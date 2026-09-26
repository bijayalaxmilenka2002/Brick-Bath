const mongoose = require("mongoose");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

let isMongoConnected = false;

// 1. Connect to MongoDB Atlas
const connectMongoDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log("ℹ️  MONGODB_URI not found in .env. Ready for MongoDB Atlas connection string.");
    return false;
  }

  try {
    console.log("⏳ Connecting to MongoDB Atlas Cluster...");
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000
    });
    isMongoConnected = true;
    console.log(`🍃 Connected to MongoDB Atlas: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (err) {
    console.error("❌ MongoDB Atlas connection error:", err.message);
    console.log("⚠️  Falling back to local SQLite database until Atlas credentials are confirmed.");
    isMongoConnected = false;
    return false;
  }
};

// Automatically initiate MongoDB Atlas connection
connectMongoDB();

// 2. Local SQLite Engine (Maintains operational resilience)
const dbPath = process.env.DB_PATH 
  ? path.resolve(process.env.DB_PATH) 
  : path.join(__dirname, "../data/bricknbath.sqlite");

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite database:", err.message);
  } else {
    console.log(`✅ SQLite fallback database initialized at: ${dbPath}`);
  }
});

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize schema tables for SQLite fallback
const initDatabase = async () => {
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
        tracking_token TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure tracking_token column exists in existing SQLite databases
    try {
      await run(`ALTER TABLE inquiries ADD COLUMN tracking_token TEXT UNIQUE`);
    } catch (ignoreErr) {}

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
    console.error("❌ Error initializing SQLite tables:", err.message);
  }
};

initDatabase();

module.exports = {
  db,
  run,
  get,
  all,
  connectMongoDB,
  isMongoActive: () => isMongoConnected
};
