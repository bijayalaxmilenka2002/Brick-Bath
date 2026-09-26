const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

let isMongoConnected = false;
let cachedMongoConn = null;

// 1. Connect to MongoDB Atlas (with connection caching for Serverless environments)
const connectMongoDB = async () => {
  if (cachedMongoConn && mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return true;
  }

  const mongoURI = process.env.MONGODB_URI || "mongodb+srv://bijayalaxmilenka48_db_user:9AmhLquZMCZ2SAb@ridebuddy.twjpoqm.mongodb.net/bricknbath?retryWrites=true&w=majority&appName=RideBuddy";
  if (!mongoURI) {
    console.log("ℹ️  MONGODB_URI not found in environment.");
    return false;
  }

  try {
    console.log("⏳ Connecting to MongoDB Atlas Cluster...");
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000
    });
    cachedMongoConn = conn;
    isMongoConnected = true;
    console.log(`🍃 Connected to MongoDB Atlas: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (err) {
    console.error("❌ MongoDB Atlas connection error:", err.message);
    isMongoConnected = false;
    return false;
  }
};

// Automatically initiate MongoDB Atlas connection
connectMongoDB().catch(() => {});

// 2. Local SQLite Engine (Safe initialization for local development, graceful fallback on Vercel)
let db = null;

try {
  // If running in Vercel serverless, SQLite is optional and must use /tmp if initialized
  const isVercel = !!process.env.VERCEL;
  const dbPath = isVercel 
    ? path.join("/tmp", "bricknbath.sqlite")
    : (process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(__dirname, "../data/bricknbath.sqlite"));

  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      // Read-only filesystem (Vercel)
    }
  }

  const sqlite3 = require("sqlite3").verbose();
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.warn("⚠️ SQLite fallback notice:", err.message);
    } else {
      console.log(`✅ SQLite fallback database initialized at: ${dbPath}`);
    }
  });
} catch (err) {
  console.log("ℹ️ SQLite native engine omitted or running in serverless cloud mode:", err.message);
}

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!db) return resolve({ lastID: 0, changes: 0 });
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!db) return resolve(null);
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (!db) return resolve([]);
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

// Initialize schema tables for SQLite fallback if active
const initDatabase = async () => {
  if (!db) return;
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ref_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        city TEXT DEFAULT 'Bhubaneswar',
        preferred_date TEXT,
        requirements TEXT,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS careers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_title TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        experience TEXT,
        notes TEXT,
        status TEXT DEFAULT 'Under Review',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.warn("Notice initializing SQLite tables:", err.message);
  }
};

initDatabase().catch(() => {});

module.exports = {
  db,
  run,
  get,
  all,
  connectMongoDB,
  isMongoActive: () => isMongoConnected || (mongoose.connection && mongoose.connection.readyState === 1)
};
