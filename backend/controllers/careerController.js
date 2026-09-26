const { run, get, all } = require("../config/db");
const { sendCareerNotification } = require("../services/emailService");

// 1. Submit a job application
const createApplication = async (req, res) => {
  try {
    const { jobTitle, name, email, phone, experience, notes } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full name, email address, and phone number are required."
      });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const finalJobTitle = jobTitle ? jobTitle.trim() : "General Application";

    const result = await run(
      `INSERT INTO careers (job_title, name, email, phone, experience, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [finalJobTitle, name.trim(), email.trim(), cleanPhone, experience ? experience.trim() : "", notes ? notes.trim() : "", "Under Review"]
    );

    const created = await get(`SELECT * FROM careers WHERE id = ?`, [result.lastID]);

    const appData = {
      id: created.id,
      jobTitle: created.job_title,
      name: created.name,
      email: created.email,
      phone: created.phone,
      experience: created.experience,
      notes: created.notes,
      status: created.status,
      createdAt: created.created_at
    };

    // Trigger email notification to owner asynchronously
    sendCareerNotification(appData).catch(err => {
      console.warn("Async career email alert error:", err.message);
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully! Our HR team will review your profile.",
      data: appData
    });
  } catch (err) {
    console.error("❌ Error in createApplication:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while processing job application."
    });
  }
};

// 2. Get all career applications
const getAllApplications = async (req, res) => {
  try {
    const rows = await all(`SELECT * FROM careers ORDER BY created_at DESC`);
    const applications = rows.map(r => ({
      id: r.id,
      jobTitle: r.job_title,
      name: r.name,
      email: r.email,
      phone: r.phone,
      experience: r.experience,
      notes: r.notes,
      status: r.status,
      createdAt: r.created_at
    }));

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    console.error("❌ Error in getAllApplications:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving applications."
    });
  }
};

module.exports = {
  createApplication,
  getAllApplications
};
