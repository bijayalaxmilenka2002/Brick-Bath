require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const inquiryRoutes = require("./routes/inquiryRoutes");
const careerRoutes = require("./routes/careerRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all incoming origins (useful when client runs on another port / Live Server or direct file)
app.use(cors());

// Parse JSON and form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith("/assets") && !req.path.endsWith(".css") && !req.path.endsWith(".js")) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

const { isMongoActive, connectMongoDB, getLastMongoError } = require("./config/db");

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await connectMongoDB();
  } catch (e) {}

  const isMongo = isMongoActive();
  res.status(200).json({
    status: "ok",
    service: "Brick & Bath Backend API",
    version: "2.0.0",
    database: isMongo ? "MongoDB Atlas (Connected)" : "SQLite Local Fallback (Active)",
    databaseType: isMongo ? "mongodb" : "sqlite",
    mongoError: getLastMongoError(),
    authSystem: "JWT (JSON Web Token)",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/careers", careerRoutes);

if (!process.env.VERCEL) {
  // Serve static frontend files from the workspace root (Local Development)
  const frontendPath = path.join(__dirname, "..");
  app.use(express.static(frontendPath));

  // Fallback to index.html for root or client routes (skipping /api)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred."
  });
});

if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log("==================================================");
    console.log(`🛁  BRICK & BATH LUXURY RENOVATION BACKEND ONLINE`);
    console.log(`🌐  Local Server:  http://localhost:${PORT}`);
    console.log(`🔍  Health Check:  http://localhost:${PORT}/api/health`);
    console.log(`📋  Inquiries API: http://localhost:${PORT}/api/inquiries`);
    console.log(`💼  Careers API:   http://localhost:${PORT}/api/careers`);
    console.log("==================================================");
  });
}

module.exports = app;
