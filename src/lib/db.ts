import mongoose from 'mongoose';

// Ensure all schemas are registered in mongoose before any query executes
import '@/models/services/Category';
import '@/models/services/Subcategory';
import '@/models/services/Product';
import '@/models/BlogPost';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */
declare global {
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  // Return cached connection if it's still alive
  if (cached.conn) {
    // Verify the connection is still healthy (readyState: 1 = connected)
    if (cached.conn.connection.readyState === 1) {
      return cached.conn;
    }
    // Connection went stale — clear it and reconnect
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // ── Connection Pool ──────────────────────────────────────────
      maxPoolSize: 10,               // Max concurrent connections
      minPoolSize: 2,                // Keep at least 2 connections warm
      // ── Timeouts ─────────────────────────────────────────────────
      serverSelectionTimeoutMS: 10000, // Fail fast (10s) instead of default 30s
      socketTimeoutMS: 45000,          // Close sockets after 45s of inactivity
      connectTimeoutMS: 10000,         // Initial connection timeout (10s)
      // ── Heartbeat ────────────────────────────────────────────────
      heartbeatFrequencyMS: 10000,     // Check server health every 10s
      // ── Retry ────────────────────────────────────────────────────
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset both conn and promise so the next call retries from scratch
    cached.conn = null;
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;