const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || "bnb_luxury_jwt_secret_key_2026";
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || "24h";

/**
 * Generate a cryptographically signed JWT token for the owner
 */
function generateOwnerToken(payload = {}) {
  const ownerEmail = process.env.OWNER_EMAIL || "lenkabijayalaxmi2002@gmail.com";
  return jwt.sign(
    {
      role: "owner",
      email: ownerEmail,
      ...payload
    },
    JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRY
    }
  );
}

/**
 * Verify if a JWT token is valid, untampered, and unexpired
 */
function verifyOwnerToken(token) {
  if (!token || typeof token !== "string") return false;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.role === "owner") {
      return decoded;
    }
    return false;
  } catch (err) {
    return false;
  }
}

/**
 * Express middleware to guard owner-only endpoints using JWT tokens
 */
function requireOwnerAuth(req, res, next) {
  let token = null;

  // 1. Check standard Authorization header: Bearer <token>
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }

  // 2. Check x-owner-token header
  if (!token && req.headers["x-owner-token"]) {
    token = req.headers["x-owner-token"].trim();
  }

  // 3. Check query param (for direct browser CSV download)
  if (!token && req.query && req.query.token) {
    token = req.query.token.trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Authentication token is missing."
    });
  }

  const decoded = verifyOwnerToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again."
    });
  }

  req.user = decoded;
  req.isOwner = true;
  next();
}

module.exports = {
  generateOwnerToken,
  verifyOwnerToken,
  requireOwnerAuth
};
