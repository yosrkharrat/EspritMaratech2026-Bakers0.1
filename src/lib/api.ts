/**
 * RCT Connect API Client
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token management
let authToken: string | null = localStorage.getItem('rct_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('rct_token', token);
  } else {
    localStorage.removeItem('rct_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

// API Response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Request helper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: 'Erreur de connexion au serveur',
    };
  }
}

// ============ AUTH API ============

export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { name: string; email: string; password: string }) =>
    request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<{ user: any }>('/auth/me'),

  logout: () => request('/auth/logout', { method: 'POST' }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ============ USERS API ============

export const usersApi = {
  getAll: (params?: { role?: string; group?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.set('role', params.role);
    if (params?.group) searchParams.set('group', params.group);
    const query = searchParams.toString();
    return request<any[]>(`/users${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<any>(`/users/${id}`),

  update: (id: string, data: Partial<any>) =>
    request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/users/${id}`, { method: 'DELETE' }),

  updateStats: (id: string, stats: { distance?: number; runs?: number }) =>
    request<any>(`/users/${id}/stats`, {
      method: 'PUT',
      body: JSON.stringify(stats),
    }),

  connectStrava: (id: string, stravaId: string) =>
    request<any>(`/users/${id}/strava`, {
      method: 'POST',
      body: JSON.stringify({ stravaId }),
    }),

  disconnectStrava: (id: string) =>
    request(`/users/${id}/strava`, { method: 'DELETE' }),
};

// ============ EVENTS API ============

export const eventsApi = {
  getAll: (params?: { date?: string; group?: string; type?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.set('date', params.date);
    if (params?.group) searchParams.set('group', params.group);
    if (params?.type) searchParams.set('type', params.type);
    const query = searchParams.toString();
    return request<any[]>(`/events${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<any>(`/events/${id}`),

  create: (data: {
    title: string;
    description?: string;
    date: string;
    time: string;
    location: string;
    location_coords?: { lat: number; lng: number };
    distance?: number;
    group_name?: string;
    event_type?: string;
    max_participants?: number;
  }) =>
    request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<any>) =>
    request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/events/${id}`, { method: 'DELETE' }),

  join: (id: string) =>
    request<any>(`/events/${id}/join`, { method: 'POST' }),

  leave: (id: string) =>
    request(`/events/${id}/leave`, { method: 'DELETE' }),

  getParticipants: (id: string) =>
    request<any[]>(`/events/${id}/participants`),
};

// ============ POSTS API ============

export const postsApi = {
  getAll: (params?: { limit?: number; offset?: number; authorId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    if (params?.authorId) searchParams.set('authorId', params.authorId);
    const query = searchParams.toString();
    return request<any[]>(`/posts${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<any>(`/posts/${id}`),

  create: (data: { content: string; image?: string }) =>
    request<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { content?: string; image?: string }) =>
    request<any>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/posts/${id}`, { method: 'DELETE' }),

  toggleLike: (id: string) =>
    request<{ liked: boolean; likeCount: number }>(`/posts/${id}/like`, {
      method: 'POST',
    }),

  getComments: (postId: string) =>
    request<any[]>(`/posts/${postId}/comments`),

  addComment: (postId: string, content: string) =>
    request<any>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  deleteComment: (postId: string, commentId: string) =>
    request(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }),
};

// ============ STORIES API ============

export const storiesApi = {
  getAll: () => request<any[]>('/stories'),

  getById: (id: string) => request<any>(`/stories/${id}`),

  create: (data: { image: string; caption?: string }) =>
    request<any>('/stories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/stories/${id}`, { method: 'DELETE' }),

  markViewed: (id: string) =>
    request(`/stories/${id}/view`, { method: 'POST' }),
};

// ============ COURSES API ============

export const coursesApi = {
  getAll: (params?: { difficulty?: string; minDistance?: number; maxDistance?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.minDistance) searchParams.set('minDistance', String(params.minDistance));
    if (params?.maxDistance) searchParams.set('maxDistance', String(params.maxDistance));
    const query = searchParams.toString();
    return request<any[]>(`/courses${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => request<any>(`/courses/${id}`),

  create: (data: {
    name: string;
    description?: string;
    distance: number;
    difficulty?: string;
    location: string;
    start_point: { lat: number; lng: number };
    route_points?: Array<{ lat: number; lng: number }>;
  }) =>
    request<any>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<any>) =>
    request<any>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/courses/${id}`, { method: 'DELETE' }),

  rate: (id: string, rating: number, comment?: string) =>
    request<any>(`/courses/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    }),
};

// ============ NOTIFICATIONS API ============

export const notificationsApi = {
  getAll: (params?: { unreadOnly?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.unreadOnly) searchParams.set('unreadOnly', 'true');
    const query = searchParams.toString();
    return request<any[]>(`/notifications${query ? `?${query}` : ''}`);
  },

  markRead: (id: string) =>
    request(`/notifications/${id}/read`, { method: 'PUT' }),

  markAllRead: () =>
    request('/notifications/read-all', { method: 'PUT' }),

  delete: (id: string) =>
    request(`/notifications/${id}`, { method: 'DELETE' }),
};

// ============ MESSAGES API ============

export const messagesApi = {
  getConversations: () =>
    request<any[]>('/messages/conversations'),

  getConversation: (id: string, params?: { limit?: number; before?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.before) searchParams.set('before', params.before);
    const query = searchParams.toString();
    return request<any>(`/messages/conversations/${id}${query ? `?${query}` : ''}`);
  },

  startConversation: (participantId: string) =>
    request<any>('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify({ participant_id: participantId }),
    }),

  sendMessage: (conversationId: string, content: string) =>
    request<any>(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  markRead: (messageId: string) =>
    request(`/messages/${messageId}/read`, { method: 'PUT' }),

  deleteConversation: (id: string) =>
    request(`/messages/conversations/${id}`, { method: 'DELETE' }),
};

// ============ SETTINGS API ============

export const settingsApi = {
  get: () => request<any>('/settings'),

  update: (data: {
    theme?: 'light' | 'dark' | 'system';
    language?: 'fr' | 'en' | 'ar';
    notifications_enabled?: boolean;
    email_notifications?: boolean;
  }) =>
    request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateTheme: (theme: 'light' | 'dark' | 'system') =>
    request('/settings/theme', {
      method: 'PUT',
      body: JSON.stringify({ theme }),
    }),

  updateLanguage: (language: 'fr' | 'en' | 'ar') =>
    request('/settings/language', {
      method: 'PUT',
      body: JSON.stringify({ language }),
    }),
};

// ============ HEALTH CHECK ============

export const healthCheck = () => request('/health');

// Export all APIs
export default {
  auth: authApi,
  users: usersApi,
  events: eventsApi,
  posts: postsApi,
  stories: storiesApi,
  courses: coursesApi,
  notifications: notificationsApi,
  messages: messagesApi,
  settings: settingsApi,
  healthCheck,
  setAuthToken,
  getAuthToken,
};
