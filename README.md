# Brick & Bath — Luxury Bathroom Renovation Portal & Backend

This repository contains the complete web experience and Node.js + Express + SQLite backend for the **Brick & Bath** bathroom renovation portal.

## 🚀 Quick Start

### 1. Install Dependencies
Run in terminal:
```bash
npm install
```

### 2. Start the Backend Server
```bash
npm start
```
Or for development mode with automatic reload on changes:
```bash
npm run dev
```

The server will start at:
```
http://localhost:5000
```
When you open `http://localhost:5000` in your web browser, the website is served with all API routes fully functional.

---

## 🗄️ Database Architecture

The backend automatically creates and manages an embedded **SQLite** database located at:
```
backend/data/bricknbath.sqlite
```
- **Zero Configuration**: No MySQL or MongoDB server installation needed.
- **Tables**:
  - `inquiries`: Stores consultation requests, contact numbers, city, dates, estimator scope, and workflow status.
  - `careers`: Stores job applications, applicant contact info, experience, and notes.

---

## 📡 REST API Endpoints

### Consultations & Inquiries
- `POST /api/inquiries` — Submit a consultation form request.
- `GET /api/inquiries` — Retrieve all inquiries (sorted by newest first).
- `GET /api/inquiries/:refId` — Query a booking by Reference ID (e.g. `BNB-2026-1082`) or phone number.
- `PATCH /api/inquiries/:id/status` — Update inquiry status (`New`, `Contacted`, `Assessment Scheduled`, `Completed`).
- `DELETE /api/inquiries/:id` — Delete an inquiry.
- `GET /api/inquiries/stats` — Quick stats for the dashboard.
- `GET /api/inquiries/export/csv` — Download inquiries directly as a `.csv` file.

### Career Applications
- `POST /api/careers` — Submit a career application.
- `GET /api/careers` — Retrieve all career applications.

### System Health
- `GET /api/health` — Check server and database status.
