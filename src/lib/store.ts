import { User, RCTEvent, Post, Story, Course, AppNotification, Conversation, Message, Comment, Rating, ChatGroup, ChatMessage } from '@/types';
import { seedUsers, seedEvents, seedPosts, seedStories, seedCourses, seedNotifications, seedConversations, seedMessages, seedChatGroups, seedChatMessages } from './seed';

const STORAGE_PREFIX = 'rct_';

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function setItem<T>(key: string, value: T) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

// Initialize store with seed data if empty
export function initStore() {
  if (!localStorage.getItem(STORAGE_PREFIX + 'initialized')) {
    setItem('users', seedUsers);
    setItem('events', seedEvents);
    setItem('posts', seedPosts);
    setItem('stories', seedStories);
    setItem('courses', seedCourses);
    setItem('notifications', seedNotifications);
    setItem('conversations', seedConversations);
    setItem('messages', seedMessages);
    setItem('chatGroups', seedChatGroups);
    setItem('chatMessages', seedChatMessages);
    setItem('initialized', true);
  }
}

// ============ USERS ============
export function getUsers(): User[] { return getItem<User[]>('users', seedUsers); }
export function getUser(id: string): User | undefined { return getUsers().find(u => u.id === id); }
export function updateUser(user: User) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) users[idx] = user; else users.push(user);
  setItem('users', users);
}
export function authenticate(name: string, cin: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.cin === cin);
  return user || null;
}

// ============ EVENTS ============
export function getEvents(): RCTEvent[] { return getItem<RCTEvent[]>('events', seedEvents); }
export function getEvent(id: string): RCTEvent | undefined { return getEvents().find(e => e.id === id); }
export function createEvent(event: RCTEvent) {
  const events = getEvents();
  events.unshift(event);
  setItem('events', events);
}
export function updateEvent(event: RCTEvent) {
  const events = getEvents();
  const idx = events.findIndex(e => e.id === event.id);
  if (idx >= 0) events[idx] = event;
  setItem('events', events);
}
export function deleteEvent(id: string) {
  setItem('events', getEvents().filter(e => e.id !== id));
}
export function joinEvent(eventId: string, userId: string) {
  const event = getEvent(eventId);
  if (event && !event.participants.includes(userId)) {
    event.participants.push(userId);
    updateEvent(event);
  }
}
export function leaveEvent(eventId: string, userId: string) {
  const event = getEvent(eventId);
  if (event) {
    event.participants = event.participants.filter(id => id !== userId);
    updateEvent(event);
  }
}

// ============ POSTS ============
export function getPosts(): Post[] { return getItem<Post[]>('posts', seedPosts); }
export function getPost(id: string): Post | undefined { return getPosts().find(p => p.id === id); }
export function createPost(post: Post) {
  const posts = getPosts();
  posts.unshift(post);
  setItem('posts', posts);
}
export function toggleLike(postId: string, userId: string) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);
    }
    setItem('posts', posts);
  }
}
export function addComment(postId: string, comment: Comment) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments.push(comment);
    setItem('posts', posts);
  }
}

// ============ STORIES ============
export function getStories(): Story[] {
  const stories = getItem<Story[]>('stories', seedStories);
  const now = Date.now();
  // Filter out stories older than 24h
  return stories.filter(s => now - new Date(s.createdAt).getTime() < 86400000);
}
export function createStory(story: Story) {
  const stories = getItem<Story[]>('stories', seedStories);
  stories.unshift(story);
  setItem('stories', stories);
}
export function viewStory(storyId: string, userId: string) {
  const stories = getItem<Story[]>('stories', seedStories);
  const story = stories.find(s => s.id === storyId);
  if (story && !story.viewers.includes(userId)) {
    story.viewers.push(userId);
    setItem('stories', stories);
  }
}

// ============ COURSES ============
export function getCourses(): Course[] { return getItem<Course[]>('courses', seedCourses); }
export function getCourse(id: string): Course | undefined { return getCourses().find(c => c.id === id); }
export function addRating(courseId: string, rating: Rating) {
  const courses = getCourses();
  const course = courses.find(c => c.id === courseId);
  if (course) {
    course.ratings.push(rating);
    setItem('courses', courses);
  }
}

// ============ NOTIFICATIONS ============
export function getNotifications(userId: string): AppNotification[] {
  return getItem<AppNotification[]>('notifications', seedNotifications).filter(n => n.userId === userId);
}
export function addNotification(notification: AppNotification) {
  const notifs = getItem<AppNotification[]>('notifications', seedNotifications);
  notifs.unshift(notification);
  setItem('notifications', notifs);
}
export function markNotificationRead(id: string) {
  const notifs = getItem<AppNotification[]>('notifications', seedNotifications);
  const n = notifs.find(x => x.id === id);
  if (n) { n.read = true; setItem('notifications', notifs); }
}
export function markAllNotificationsRead(userId: string) {
  const notifs = getItem<AppNotification[]>('notifications', seedNotifications);
  notifs.filter(n => n.userId === userId).forEach(n => n.read = true);
  setItem('notifications', notifs);
}
export function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter(n => !n.read).length;
}

// ============ MESSAGES ============
export function getConversations(userId: string): Conversation[] {
  return getItem<Conversation[]>('conversations', seedConversations).filter(c => c.participantIds.includes(userId));
}
export function getMessages(userId1: string, userId2: string): Message[] {
  return getItem<Message[]>('messages', seedMessages).filter(
    m => (m.senderId === userId1 && m.receiverId === userId2) || (m.senderId === userId2 && m.receiverId === userId1)
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
export function sendMessage(message: Message) {
  const messages = getItem<Message[]>('messages', seedMessages);
  messages.push(message);
  setItem('messages', messages);
  // Update conversation
  const convs = getItem<Conversation[]>('conversations', seedConversations);
  const conv = convs.find(c =>
    c.participantIds.includes(message.senderId) && c.participantIds.includes(message.receiverId)
  );
  if (conv) {
    conv.lastMessage = message.content;
    conv.lastMessageTime = message.createdAt;
    conv.unreadCount += 1;
  } else {
    const sender = getUser(message.senderId);
    const receiver = getUser(message.receiverId);
    convs.push({
      id: 'conv_' + Date.now(),
      participantIds: [message.senderId, message.receiverId],
      participantNames: [sender?.name || '', receiver?.name || ''],
      participantAvatars: ['', ''],
      lastMessage: message.content,
      lastMessageTime: message.createdAt,
      unreadCount: 1,
    });
  }
  setItem('conversations', convs);
}

// ============ CHAT GROUPS ============
export function getChatGroups(userId: string): ChatGroup[] {
  return getItem<ChatGroup[]>('chatGroups', seedChatGroups).filter(g => g.memberIds.includes(userId));
}
export function getChatGroup(id: string): ChatGroup | undefined {
  return getItem<ChatGroup[]>('chatGroups', seedChatGroups).find(g => g.id === id);
}
export function createChatGroup(group: ChatGroup) {
  const groups = getItem<ChatGroup[]>('chatGroups', seedChatGroups);
  groups.unshift(group);
  setItem('chatGroups', groups);
}
export function updateChatGroup(group: ChatGroup) {
  const groups = getItem<ChatGroup[]>('chatGroups', seedChatGroups);
  const idx = groups.findIndex(g => g.id === group.id);
  if (idx >= 0) groups[idx] = group;
  setItem('chatGroups', groups);
}
export function deleteChatGroup(id: string) {
  setItem('chatGroups', getItem<ChatGroup[]>('chatGroups', seedChatGroups).filter(g => g.id !== id));
  // Also delete all messages in the group
  setItem('chatMessages', getItem<ChatMessage[]>('chatMessages', seedChatMessages).filter(m => m.groupId !== id));
}
export function getChatMessages(groupId: string): ChatMessage[] {
  return getItem<ChatMessage[]>('chatMessages', seedChatMessages)
    .filter(m => m.groupId === groupId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
export function sendChatMessage(message: ChatMessage) {
  const messages = getItem<ChatMessage[]>('chatMessages', seedChatMessages);
  messages.push(message);
  setItem('chatMessages', messages);
  // Update group's last message
  const groups = getItem<ChatGroup[]>('chatGroups', seedChatGroups);
  const group = groups.find(g => g.id === message.groupId);
  if (group) {
    group.lastMessage = message.content;
    group.lastMessageTime = message.createdAt;
    group.lastMessageSender = message.senderName;
    setItem('chatGroups', groups);
  }
}

// ============ THEME ============
export function getTheme(): 'light' | 'dark' {
  return getItem<'light' | 'dark'>('theme', 'light');
}
export function setTheme(theme: 'light' | 'dark') {
  setItem('theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Reset
export function resetStore() {
  Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX)).forEach(k => localStorage.removeItem(k));
  initStore();
}
