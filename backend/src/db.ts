import { join, dirname } from 'path';
import { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';
import { existsSync, mkdirSync } from 'fs';

// Database Types
export interface DbUser {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar: string | null;
  role: 'admin' | 'coach' | 'member';
  group_name: string | null;
  distance: number;
  runs: number;
  joined_events: number;
  strava_connected: boolean;
  strava_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  location_coords: string | null; // JSON string
  distance: number;
  group_name: string;
  event_type: string;
  max_participants: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DbEventParticipant {
  event_id: string;
  user_id: string;
  joined_at: string;
}

export interface DbPost {
  id: string;
  author_id: string;
  content: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbPostLike {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface DbComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
}

export interface DbStory {
  id: string;
  user_id: string;
  image: string;
  caption: string | null;
  expires_at: string;
  created_at: string;
}

export interface DbStoryView {
  story_id: string;
  user_id: string;
  viewed_at: string;
}

export interface DbCourse {
  id: string;
  name: string;
  description: string | null;
  distance: number;
  difficulty: string;
  location: string;
  start_point: string; // JSON string
  route_points: string; // JSON string
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DbRating {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_id: string | null;
  read: boolean;
  created_at: string;
}

export interface DbConversation {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface DbConversationParticipant {
  conversation_id: string;
  user_id: string;
  joined_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface DbUserSettings {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en' | 'ar';
  notifications_enabled: boolean;
  email_notifications: boolean;
}

export interface Database {
  users: DbUser[];
  events: DbEvent[];
  event_participants: DbEventParticipant[];
  posts: DbPost[];
  post_likes: DbPostLike[];
  comments: DbComment[];
  stories: DbStory[];
  story_views: DbStoryView[];
  courses: DbCourse[];
  ratings: DbRating[];
  notifications: DbNotification[];
  conversations: DbConversation[];
  conversation_participants: DbConversationParticipant[];
  messages: DbMessage[];
  user_settings: DbUserSettings[];
}

// Default data structure
const defaultData: Database = {
  users: [],
  events: [],
  event_participants: [],
  posts: [],
  post_likes: [],
  comments: [],
  stories: [],
  story_views: [],
  courses: [],
  ratings: [],
  notifications: [],
  conversations: [],
  conversation_participants: [],
  messages: [],
  user_settings: [],
};

// Database singleton
let db: Low<Database>;

// Initialize database
const dbPath = process.env.DATABASE_PATH || './data/rct.json';
const dataDir = dirname(dbPath);

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Create and export the database instance
async function initDb() {
  db = await JSONFilePreset<Database>(dbPath, defaultData);
  return db;
}

// Initialize immediately
const dbPromise = initDb();

// Helper class to provide synchronous-like API
class DatabaseHelper {
  private db!: Low<Database>;
  private ready = false;

  async init() {
    this.db = await dbPromise;
    this.ready = true;
  }

  private ensureReady() {
    if (!this.ready) {
      throw new Error('Database not initialized. Call init() first.');
    }
  }

  get data(): Database {
    this.ensureReady();
    return this.db.data;
  }

  async write() {
    this.ensureReady();
    await this.db.write();
  }

  // Synchronous write for simpler usage
  writeSync() {
    this.ensureReady();
    // lowdb v7 write is async, but we queue it
    this.db.write().catch(console.error);
  }
}

export const dbHelper = new DatabaseHelper();

// Initialize helper on first import
dbHelper.init().catch(console.error);

export default dbHelper;
