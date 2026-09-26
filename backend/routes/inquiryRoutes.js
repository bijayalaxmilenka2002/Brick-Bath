const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getAllInquiries,
  getInquiryByRefId,
  updateInquiryStatus,
  deleteInquiry,
  getStats,
  exportCSV
} = require("../controllers/inquiryController");
const { requireOwnerAuth } = require("../middleware/authMiddleware");

// PUBLIC ENDPOINTS: Regular customers submit inquiries & track renovation progress
router.post("/", createInquiry);
router.get("/:refId", getInquiryByRefId);

// OWNER-ONLY PROTECTED ENDPOINTS: Requires valid owner session token
router.get("/export/csv", requireOwnerAuth, exportCSV);
router.get("/stats", requireOwnerAuth, getStats);
router.get("/", requireOwnerAuth, getAllInquiries);
router.patch("/:id/status", requireOwnerAuth, updateInquiryStatus);
router.patch("/:id", requireOwnerAuth, updateInquiryStatus);
router.patch("/", requireOwnerAuth, updateInquiryStatus);
router.delete("/:id", requireOwnerAuth, deleteInquiry);
router.delete("/", requireOwnerAuth, deleteInquiry);

module.exports = router;
