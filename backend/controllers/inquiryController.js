const { run, get, all, isMongoActive } = require("../config/db");
const Inquiry = require("../models/Inquiry");
const { sendInquiryNotification } = require("../services/emailService");

// 1. Create new inquiry / consultation booking (MongoDB Atlas / SQLite fallback)
const createInquiry = async (req, res) => {
  try {
    const { name, phone, city, preferredDate, requirements, refId } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full name and mobile number are required."
      });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit mobile number."
      });
    }

    // Generate unique reference ID if not supplied
    const finalRefId = refId || `BNB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalCity = city ? city.trim() : "Bhubaneswar";
    const finalDate = preferredDate || "Earliest Available";
    const finalReqs = requirements ? requirements.trim() : "Turnkey Luxury Bathroom Renovation";
    const status = "New";

    let inquiryData = null;

    if (isMongoActive()) {
      // Save directly to MongoDB Atlas
      const newInquiryDoc = new Inquiry({
        refId: finalRefId,
        name: name.trim(),
        phone: cleanPhone,
        city: finalCity,
        preferredDate: finalDate,
        requirements: finalReqs,
        status: status
      });

      const savedDoc = await newInquiryDoc.save();
      inquiryData = {
        id: savedDoc._id.toString(),
        refId: savedDoc.refId,
        name: savedDoc.name,
        phone: savedDoc.phone,
        city: savedDoc.city,
        preferredDate: savedDoc.preferredDate,
        requirements: savedDoc.requirements,
        status: savedDoc.status,
        createdAt: savedDoc.createdAt
      };
      console.log(`🍃 Inquiry saved to MongoDB Atlas: ${finalRefId} (${name})`);
    } else {
      // Fallback: Save to SQLite
      const result = await run(
        `INSERT INTO inquiries (ref_id, name, phone, city, preferred_date, requirements, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [finalRefId, name.trim(), cleanPhone, finalCity, finalDate, finalReqs, status]
      );

      const createdInquiry = await get(`SELECT * FROM inquiries WHERE id = ?`, [result.lastID]);
      inquiryData = {
        id: createdInquiry.id,
        refId: createdInquiry.ref_id,
        name: createdInquiry.name,
        phone: createdInquiry.phone,
        city: createdInquiry.city,
        preferredDate: createdInquiry.preferred_date,
        requirements: createdInquiry.requirements,
        status: createdInquiry.status,
        createdAt: createdInquiry.created_at
      };
      console.log(`💾 Inquiry saved to SQLite database: ${finalRefId} (${name})`);
    }

    // Trigger email notification to owner asynchronously (doesn't delay user's response)
    sendInquiryNotification(inquiryData).catch((err) => {
      console.warn("Async email alert notice:", err.message);
    });

    return res.status(201).json({
      success: true,
      message: "Consultation inquiry recorded successfully.",
      storageEngine: isMongoActive() ? "MongoDB Atlas" : "SQLite",
      data: inquiryData
    });
  } catch (err) {
    console.error("❌ Error in createInquiry:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while saving inquiry."
    });
  }
};

// 2. Get all inquiries (Guarded by Owner JWT Middleware)
const getAllInquiries = async (req, res) => {
  try {
    const { search } = req.query;

    if (isMongoActive()) {
      let filter = {};
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        filter = {
          $or: [
            { name: regex }, 
            { phone: regex }, 
            { refId: regex }, 
            { city: regex }
          ]
        };
      }

      const docs = await Inquiry.find(filter).sort({ createdAt: -1 });
      const inquiries = docs.map((d) => ({
        id: d._id.toString(),
        refId: d.refId,
        name: d.name,
        phone: d.phone,
        city: d.city,
        preferredDate: d.preferredDate,
        requirements: d.requirements,
        status: d.status,
        notes: d.notes || "",
        createdAt: d.createdAt,
        receivedAt: d.createdAt
      }));

      return res.status(200).json({
        success: true,
        source: "mongodb",
        storageEngine: "MongoDB Atlas",
        count: inquiries.length,
        inquiries: inquiries,
        data: inquiries
      });
    } else {
      let query = `SELECT * FROM inquiries ORDER BY id DESC`;
      let params = [];

      if (search) {
        query = `SELECT * FROM inquiries 
                 WHERE name LIKE ? OR phone LIKE ? OR ref_id LIKE ? OR city LIKE ?
                 ORDER BY id DESC`;
        const term = `%${search.trim()}%`;
        params = [term, term, term, term];
      }

      const rows = await all(query, params);
      const inquiries = rows.map((r) => ({
        id: r.id,
        refId: r.ref_id,
        name: r.name,
        phone: r.phone,
        city: r.city,
        preferredDate: r.preferred_date,
        requirements: r.requirements,
        status: r.status,
        notes: r.notes || "",
        createdAt: r.created_at,
        receivedAt: r.created_at
      }));

      return res.status(200).json({
        success: true,
        source: "sqlite",
        storageEngine: "SQLite",
        count: inquiries.length,
        inquiries: inquiries,
        data: inquiries
      });
    }
  } catch (err) {
    console.error("❌ Error in getAllInquiries:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving inquiries."
    });
  }
};

// 3. Get single inquiry by Reference ID or Phone
const getInquiryByRefId = async (req, res) => {
  try {
    const { refId } = req.params;
    const cleanRef = (refId || "").trim();
    const digitsOnly = cleanRef.replace(/[^0-9]/g, "");

    if (isMongoActive()) {
      const orConditions = [
        { refId: { $regex: new RegExp("^" + cleanRef + "$", "i") } }
      ];

      if (digitsOnly.length >= 10) {
        const last10 = digitsOnly.slice(-10);
        orConditions.push({ phone: { $regex: last10 } });
      } else if (digitsOnly.length > 5) {
        orConditions.push({ phone: cleanRef });
      }

      const doc = await Inquiry.findOne({ $or: orConditions }).sort({ createdAt: -1 });

      if (!doc) {
        return res.status(404).json({
          success: false,
          message: `No consultation found matching: ${refId}`
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: doc._id.toString(),
          refId: doc.refId,
          name: doc.name,
          phone: doc.phone,
          city: doc.city,
          preferredDate: doc.preferredDate,
          requirements: doc.requirements,
          status: doc.status || "New",
          notes: doc.notes || "",
          createdAt: doc.createdAt
        }
      });
    } else {
      let row = null;
      if (digitsOnly.length >= 10) {
        const last10 = digitsOnly.slice(-10);
        row = await get(
          `SELECT * FROM inquiries 
           WHERE LOWER(ref_id) = LOWER(?) 
              OR phone = ? 
              OR phone LIKE ? 
           ORDER BY id DESC LIMIT 1`,
          [cleanRef, cleanRef, `%${last10}%`]
        );
      } else {
        row = await get(
          `SELECT * FROM inquiries 
           WHERE LOWER(ref_id) = LOWER(?) 
              OR phone = ? 
           ORDER BY id DESC LIMIT 1`,
          [cleanRef, cleanRef]
        );
      }

      if (!row) {
        return res.status(404).json({
          success: false,
          message: `No consultation found matching: ${refId}`
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: row.id,
          refId: row.ref_id,
          name: row.name,
          phone: row.phone,
          city: row.city,
          preferredDate: row.preferred_date,
          requirements: row.requirements,
          status: row.status || "New",
          notes: row.notes || "",
          createdAt: row.created_at
        }
      });
    }
  } catch (err) {
    console.error("❌ Error in getInquiryByRefId:", err);
    return res.status(500).json({
      success: false,
      message: "Error retrieving inquiry details."
    });
  }
};

// 4. Update inquiry status or notes
const updateInquiryStatus = async (req, res) => {
  try {
    const rawId = req.params.id || req.body.id;
    const { status, notes } = req.body;

    if (!rawId) {
      return res.status(400).json({
        success: false,
        message: "Inquiry ID is required."
      });
    }

    const cleanId = String(rawId).replace(/^#/, "").trim();

    if (!status && notes === undefined) {
      return res.status(400).json({
        success: false,
        message: "Status or notes are required to update."
      });
    }

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;

    if (isMongoActive()) {
      let existingDoc = null;
      if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
        existingDoc = await Inquiry.findById(cleanId);
      }
      if (!existingDoc) {
        existingDoc = await Inquiry.findOne({
          $or: [
            { refId: cleanId },
            { refId: `BNB-2026-${cleanId}` },
            { refId: `#${cleanId}` }
          ]
        });
      }

      if (!existingDoc) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found in MongoDB Atlas."
        });
      }

      const updatedDoc = await Inquiry.findByIdAndUpdate(existingDoc._id, updateFields, { new: true });

      return res.status(200).json({
        success: true,
        message: `Inquiry updated successfully.`,
        data: {
          id: updatedDoc._id.toString(),
          refId: updatedDoc.refId,
          status: updatedDoc.status,
          notes: updatedDoc.notes || ""
        }
      });
    } else {
      // SQLite fallback logic
      const existingRow = await get(
        `SELECT * FROM inquiries WHERE id = ? OR ref_id = ? OR ref_id = ?`,
        [cleanId, cleanId, `BNB-2026-${cleanId}`]
      );
      if (!existingRow) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found."
        });
      }

      let setClauses = [];
      let params = [];
      if (status !== undefined) {
        setClauses.push("status = ?");
        params.push(status);
      }
      if (notes !== undefined) {
        setClauses.push("notes = ?");
        params.push(notes);
      }

      if (setClauses.length > 0) {
        params.push(existingRow.id);
        await run(`UPDATE inquiries SET ${setClauses.join(", ")} WHERE id = ?`, params);
      }

      const updatedRow = await get(`SELECT * FROM inquiries WHERE id = ?`, [existingRow.id]);

      return res.status(200).json({
        success: true,
        message: `Inquiry updated successfully.`,
        data: {
          id: updatedRow.id,
          refId: updatedRow.ref_id,
          status: updatedRow.status,
          notes: updatedRow.notes || ""
        }
      });
    }
  } catch (err) {
    console.error("❌ Error in updateInquiryStatus:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update inquiry."
    });
  }
};

// 5. Delete an inquiry
const deleteInquiry = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Inquiry ID is required to delete."
      });
    }

    if (isMongoActive()) {
      let deletedDoc;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        deletedDoc = await Inquiry.findByIdAndDelete(id);
      } else {
        deletedDoc = await Inquiry.findOneAndDelete({ refId: id });
      }

      if (!deletedDoc) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found in MongoDB Atlas."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Inquiry deleted successfully from MongoDB Atlas."
      });
    } else {
      const result = await run(`DELETE FROM inquiries WHERE id = ? OR ref_id = ?`, [id, id]);

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Inquiry deleted successfully from SQLite."
      });
    }
  } catch (err) {
    console.error("❌ Error in deleteInquiry:", err);
    return res.status(500).json({
      success: false,
      message: "Error deleting inquiry."
    });
  }
};

// 6. Get Inquiry Statistics
const getStats = async (req, res) => {
  try {
    if (isMongoActive()) {
      const total = await Inquiry.countDocuments();
      const newCount = await Inquiry.countDocuments({ status: "New" });
      const contactedCount = await Inquiry.countDocuments({ status: "Contacted" });
      const convertedCount = await Inquiry.countDocuments({ status: "Converted" });

      return res.status(200).json({
        success: true,
        storageEngine: "MongoDB Atlas",
        data: {
          total,
          new: newCount,
          contacted: contactedCount,
          converted: convertedCount
        }
      });
    } else {
      const totalRow = await get(`SELECT COUNT(*) AS count FROM inquiries`);
      const newRow = await get(`SELECT COUNT(*) AS count FROM inquiries WHERE status = 'New'`);
      const contactedRow = await get(`SELECT COUNT(*) AS count FROM inquiries WHERE status = 'Contacted'`);
      const convertedRow = await get(`SELECT COUNT(*) AS count FROM inquiries WHERE status = 'Converted'`);

      return res.status(200).json({
        success: true,
        storageEngine: "SQLite",
        data: {
          total: totalRow ? totalRow.count : 0,
          new: newRow ? newRow.count : 0,
          contacted: contactedRow ? contactedRow.count : 0,
          converted: convertedRow ? convertedRow.count : 0
        }
      });
    }
  } catch (err) {
    console.error("❌ Error in getStats:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching statistics."
    });
  }
};

// 7. Export Inquiries to CSV Format (Guarded by Owner JWT)
const exportCSV = async (req, res) => {
  try {
    let rows = [];

    if (isMongoActive()) {
      const docs = await Inquiry.find().sort({ createdAt: -1 });
      rows = docs.map((d) => ({
        ref_id: d.refId,
        name: d.name,
        phone: d.phone,
        city: d.city,
        preferred_date: d.preferredDate,
        requirements: d.requirements,
        status: d.status,
        created_at: d.createdAt
      }));
    } else {
      rows = await all(`SELECT * FROM inquiries ORDER BY id DESC`);
    }

    let csv = "Reference ID,Client Name,Phone,City,Preferred Date,Requirements,Status,Received Date\n";

    rows.forEach((r) => {
      const escape = (str) => `"${(str || "").toString().replace(/"/g, '""')}"`;
      csv += `${escape(r.ref_id)},${escape(r.name)},${escape(r.phone)},${escape(r.city)},${escape(r.preferred_date)},${escape(r.requirements)},${escape(r.status)},${escape(r.created_at)}\n`;
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=BricknBath_Inquiries_${Date.now()}.csv`);
    return res.status(200).send(csv);
  } catch (err) {
    console.error("❌ Error in exportCSV:", err);
    return res.status(500).json({
      success: false,
      message: "Error generating CSV export."
    });
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryByRefId,
  updateInquiryStatus,
  deleteInquiry,
  getStats,
  exportCSV
};
