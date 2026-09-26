// Vercel Serverless Function entry point
const { connectMongoDB } = require("../backend/config/db");
const app = require("../backend/server");

module.exports = async (req, res) => {
  try {
    await connectMongoDB();
  } catch (err) {
    console.warn("MongoDB connection warning in Vercel handler:", err.message);
  }
  return app(req, res);
};
