const express = require("express");
const router = express.Router();
const {
  generateOwnerToken,
  verifyOwnerToken
} = require("../middleware/authMiddleware");

/**
 * POST /api/auth/login
 * Authenticate owner using the configured owner password and return signed JWT token
 */
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const configuredUsername = (process.env.OWNER_USERNAME || "admin").trim().toLowerCase();
    const configuredEmail = (process.env.OWNER_EMAIL || "lenkabijayalaxmi2002@gmail.com").trim().toLowerCase();
    const configuredPassword = (process.env.OWNER_PASSWORD || "ava123@gmail.com").trim();

    if (!username || typeof username !== "string" || !password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Both username and password are required."
      });
    }

    const inputUser = username.trim().toLowerCase();
    const isUserMatch = (
      inputUser === configuredUsername ||
      inputUser === configuredEmail ||
      inputUser === "owner" ||
      inputUser === "admin"
    );
    const isPassMatch = (password.trim() === configuredPassword);

    if (!isUserMatch || !isPassMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password. Access denied."
      });
    }

    // Generate secure JWT token
    const token = generateOwnerToken({ username: inputUser });

    return res.status(200).json({
      success: true,
      message: "Owner authenticated successfully.",
      token: token,
      expiresIn: "24h",
      ownerUsername: configuredUsername,
      ownerEmail: process.env.OWNER_EMAIL || "lenkabijayalaxmi2002@gmail.com"
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication."
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify if current session JWT token is still valid
 */
router.get("/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else if (req.headers["x-owner-token"]) {
    token = req.headers["x-owner-token"].trim();
  } else if (req.query && req.query.token) {
    token = req.query.token.trim();
  }

  const decoded = verifyOwnerToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      message: "Session expired or invalid token."
    });
  }

  return res.status(200).json({
    success: true,
    authenticated: true,
    user: decoded,
    ownerEmail: process.env.OWNER_EMAIL || "lenkabijayalaxmi2002@gmail.com"
  });
});

/**
 * POST /api/auth/change-password
 * Change the owner password, persist in .env file, update runtime memory, and return a fresh JWT
 */
router.post("/change-password", (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const configuredPassword = process.env.OWNER_PASSWORD || "bricknbath2026";

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required."
      });
    }

    if (currentPassword.trim() !== configuredPassword.trim()) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect. Please check and try again."
      });
    }

    if (newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long."
      });
    }

    const updatedPass = newPassword.trim();
    process.env.OWNER_PASSWORD = updatedPass;

    // Persist new password into .env file
    const fs = require("fs");
    const path = require("path");
    const envPath = path.resolve(__dirname, "../../.env");

    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf-8");
      if (envContent.includes("OWNER_PASSWORD=")) {
        envContent = envContent.replace(/OWNER_PASSWORD=.*/, `OWNER_PASSWORD=${updatedPass}`);
      } else {
        envContent += `\nOWNER_PASSWORD=${updatedPass}`;
      }
      fs.writeFileSync(envPath, envContent, "utf-8");
    }

    // Generate fresh JWT token
    const token = generateOwnerToken();

    return res.status(200).json({
      success: true,
      message: "Owner password updated successfully!",
      token: token
    });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating password."
    });
  }
});

/**
 * POST /api/auth/logout
 * Invalidate owner session
 */
router.post("/logout", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully."
  });
});

module.exports = router;
