const nodemailer = require("nodemailer");

const ownerEmail = process.env.OWNER_EMAIL || "lenkabijayalaxmi2002@gmail.com";

// Initialize Transporter
const getTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null; // Development mode / simulation
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
    auth: {
      user: user,
      pass: pass
    }
  });
};

/**
 * Send email notification for a new consultation inquiry
 */
const sendInquiryNotification = async (inquiry) => {
  const transporter = getTransporter();

  const waLink = `https://wa.me/91${inquiry.phone}?text=Hello%20${encodeURIComponent(inquiry.name)}%2C%20this%20is%20BricknBath%20Bhubaneswar%20regarding%20your%20renovation%20inquiry%20(${inquiry.refId}).`;
  const telLink = `tel:+91${inquiry.phone}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b111a; margin: 0; padding: 24px; color: #e2e8f0; }
        .card { max-width: 600px; margin: 0 auto; background: #111a28; border: 1px solid #c8893a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #182335 0%, #0d1522 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #c8893a; }
        .logo-title { font-size: 24px; font-weight: 800; letter-spacing: 3px; color: #e5b36a; margin: 0; text-transform: uppercase; }
        .logo-sub { font-size: 11px; letter-spacing: 2px; color: #94a3b8; margin-top: 4px; text-transform: uppercase; }
        .badge { display: inline-block; background: rgba(200, 137, 58, 0.15); color: #e5b36a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 14px; border: 1px solid rgba(200, 137, 58, 0.3); }
        .body { padding: 28px 24px; }
        .headline { font-size: 20px; color: #ffffff; margin: 0 0 8px 0; font-weight: 700; }
        .subhead { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
        .table-box { background: #0c1420; border-radius: 8px; border: 1px solid rgba(200, 137, 58, 0.2); margin-bottom: 24px; }
        .row { display: flex; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 12px 16px; }
        .row:last-child { border-bottom: none; }
        .label { width: 140px; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { flex: 1; color: #ffffff; font-size: 14px; font-weight: 500; word-break: break-word; }
        .ref-val { color: #e5b36a; font-weight: 700; font-family: monospace; font-size: 15px; }
        .actions { text-align: center; margin-top: 24px; }
        .btn-wa { display: inline-block; background: #25D366; color: #ffffff; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; margin-right: 8px; }
        .btn-call { display: inline-block; background: #1e293b; color: #e5b36a; font-weight: 700; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 14px; border: 1px solid #c8893a; }
        .footer { background: #0c1420; padding: 16px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo-title">BRICK & BATH</div>
          <div class="logo-sub">Bathroom Meets Lifestyle • Luxury Renovation</div>
          <div class="badge">🔔 NEW CONSULTATION BOOKING</div>
        </div>
        <div class="body">
          <h2 class="headline">New Client Consultation Request</h2>
          <p class="subhead">A visitor has requested a 3D bathroom renovation assessment on your website.</p>
          
          <table style="width: 100%; border-collapse: collapse; background: #0c1420; border-radius: 8px; border: 1px solid rgba(200, 137, 58, 0.2);">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; font-weight: 600; width: 140px;">REFERENCE ID</td>
              <td style="padding: 12px 16px; color: #e5b36a; font-weight: 700; font-family: monospace; font-size: 15px;">${inquiry.refId}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; font-weight: 600;">CLIENT NAME</td>
              <td style="padding: 12px 16px; color: #ffffff; font-weight: 700; font-size: 15px;">${inquiry.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; font-weight: 600;">MOBILE NUMBER</td>
              <td style="padding: 12px 16px; color: #ffffff; font-weight: 600;">+91 ${inquiry.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; font-weight: 600;">CITY / LOCATION</td>
              <td style="padding: 12px 16px; color: #ffffff;">${inquiry.city || 'Bhubaneswar'}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
              <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; font-weight: 600;">PREFERRED DATE</td>
              <td style="padding: 12px 16px; color: #ffffff;">${inquiry.preferredDate || 'Earliest Available'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #94a3b8; font-size: 13px; font-weight: 600; vertical-align: top;">REQUIREMENTS</td>
              <td style="padding: 12px 16px; color: #e5b36a; line-height: 1.5;">${inquiry.requirements}</td>
            </tr>
          </table>

          <div class="actions">
            <a href="${waLink}" class="btn-wa" target="_blank">💬 Open WhatsApp Chat</a>
            <a href="${telLink}" class="btn-call">📞 Call Client</a>
          </div>
        </div>
        <div class="footer">
          This record was permanently saved to the Brick & Bath SQLite database at ${inquiry.createdAt || new Date().toLocaleString()}.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log("==================================================");
    console.log(`📨 [EMAIL NOTIFICATION DEV LOG]`);
    console.log(`To:        ${ownerEmail}`);
    console.log(`Subject:   🔔 New Consultation Booking: ${inquiry.refId} (${inquiry.name})`);
    console.log(`Client:    ${inquiry.name} (+91 ${inquiry.phone})`);
    console.log(`Location:  ${inquiry.city} | Date: ${inquiry.preferredDate}`);
    console.log(`Scope:     ${inquiry.requirements}`);
    console.log(`💡 NOTE: To receive actual emails in your Gmail inbox, add your 16-character Google App Password to SMTP_PASS in .env`);
    console.log("==================================================");
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Brick & Bath Notifications" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      subject: `🔔 New Consultation Request: ${inquiry.refId} - ${inquiry.name} (${inquiry.city})`,
      html: htmlContent
    });
    console.log(`✅ Email notification sent to ${ownerEmail} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Failed to send email to ${ownerEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send email notification for a new job application
 */
const sendCareerNotification = async (application) => {
  const transporter = getTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b111a; margin: 0; padding: 24px; color: #e2e8f0; }
        .card { max-width: 600px; margin: 0 auto; background: #111a28; border: 1px solid #c8893a; border-radius: 12px; overflow: hidden; }
        .header { background: #182335; padding: 20px; text-align: center; border-bottom: 2px solid #c8893a; }
        .title { color: #e5b36a; font-size: 20px; font-weight: 700; }
        .body { padding: 24px; }
        .table { width: 100%; border-collapse: collapse; background: #0c1420; border-radius: 8px; }
        td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .label { color: #94a3b8; font-weight: 600; width: 130px; font-size: 13px; }
        .val { color: #ffffff; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="title">💼 NEW JOB APPLICATION</div>
          <div style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Role: ${application.jobTitle}</div>
        </div>
        <div class="body">
          <table class="table">
            <tr><td class="label">APPLICANT</td><td class="val">${application.name}</td></tr>
            <tr><td class="label">EMAIL</td><td class="val">${application.email}</td></tr>
            <tr><td class="label">PHONE</td><td class="val">+91 ${application.phone}</td></tr>
            <tr><td class="label">EXPERIENCE</td><td class="val">${application.experience || 'Not specified'}</td></tr>
            <tr><td class="label">NOTES / RESUME</td><td class="val" style="color: #e5b36a;">${application.notes || 'None'}</td></tr>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.log("==================================================");
    console.log(`📨 [CAREER APPLICATION DEV LOG]`);
    console.log(`To:        ${ownerEmail}`);
    console.log(`Role:      ${application.jobTitle}`);
    console.log(`Applicant: ${application.name} (${application.email}, ${application.phone})`);
    console.log("==================================================");
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Brick & Bath Careers" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      subject: `💼 New Job Application: ${application.jobTitle} - ${application.name}`,
      html: htmlContent
    });
    console.log(`✅ Career notification sent to ${ownerEmail} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Failed to send career email:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendInquiryNotification,
  sendCareerNotification
};
