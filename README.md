# URL Shortener with Analytics

A powerful, premium URL shortener clone with robust real-time analytics, geo-tracking, QR code generation, and link security features built from scratch.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS v4, Framer Motion, Recharts, React-Simple-Maps
- **Backend**: Node.js, Express, better-sqlite3
- **Geo-lookup**: IP-API.com
- **User Agent Parsing**: ua-parser-js

## Features
- **Shorten & Alias**: Generate automatic short codes or enforce custom aliases.
- **Expiry & Password**: Secure links with passwords or set chronological expiration.
- **Analytics Dashboard**: Tracks clicks over time, device demographics, browsers, top countries (World Map), top referrers, and specific time-of-day access patterns (Heatmap).
- **QR Code**: Auto-generates scannable QR codes for each short URL, downloadable in SVG and PNG.
- **Live Updating**: Analytics dashboard polls dynamically for live activity tracking.
- **Link Management**: Toggle link active/inactive state, edit aliases, or permanently delete links.

## Setup Instructions

### 1. Backend Setup
Navigate to the `backend` directory.
```bash
cd backend
npm install
npm run dev
```
The database (`shortener.db`) will be automatically seeded via `db.js`.

### 2. Frontend Setup
Navigate to the `frontend` directory.
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### 3. Environment Config
The application runs locally on `http://localhost:5173` (Frontend) and `http://localhost:3000` (Backend). Production deployments can be customized using `.env` files modifying `FRONTEND_URL` and `BACKEND_URL`.
