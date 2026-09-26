const express = require("express");
const router = express.Router();
const {
  createApplication,
  getAllApplications
} = require("../controllers/careerController");
const { requireOwnerAuth } = require("../middleware/authMiddleware");

// PUBLIC ENDPOINT: Job seekers apply for roles
router.post("/", createApplication);

// OWNER-ONLY: View submitted candidate resumes & applications
router.get("/", requireOwnerAuth, getAllApplications);

module.exports = router;
