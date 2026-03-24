<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/zap.svg" width="60" alt="Rilho Icon"/>
  <h1 align="center">Rilho | Modern URL Ecosystem</h1>
  <p align="center">
    <strong>A high-performance, enterprise-grade URL shortener armed with aggressive geo-tracking, A/B testing engines, and multi-device routing architectures.</strong>
  </p>
</div>

<hr/>

## 🌌 Platform Overview
Rilho is an architectural masterpiece designed to drastically supersede basic shortening utilities like Bitly. We engineered a spatial glassmorphism frontend (React + Framer Motion) paired tightly with an asynchronous MongoDB event-driven backend.

## 🚀 Enterprise Features
*   **A/B Traffic Split Engine:** Generate conditional links and specify a randomized `%` bias to route live traffic cleanly between Landing Page A and B.
*   **Operating System Interception:** Dictate specific overwrite URLs for iOS or Android. If a user cliks the link on an iPhone, Rilho intercepts the User-Agent headers, silently blocks the default destination, and forces them into the Apple App Store.
*   **Bulk CSV Streamer:** Drag and drop an `.csv` file. Our Node backend parses the memory stream utilizing `multer` and instantly downloads an expanded `.csv` mapping short links against your entire array.
*   **Password Cryptography:** Encapsulate sensitive URLs behind PIN locks. Backed by Redis-style Map tracking, attackers are forcefully IP-blocked after 5 failed brute-force attempts.
*   **Google Safe Browsing Hook:** Pre-emptively scans generated targets through security API blacklists to protect domain reputation and prevent malware chaining.
*   **Real-time Streaming Matrix:** The dashboard natively incorporates dynamic rendering of raw IP feeds, geographic distributions, topological heatmaps, and micro-metric breakdowns.

---

## 🛠️ Stack Configuration
*   **Frontend Ecosystem:** React 19 / Vite / Tailwind CSS v4 / Recharts / ReactBits / Framer Motion
*   **Backend Aggregator:** Node.js 20 / Express / Mongoose ORM / MongoDB Atlas
*   **Infrastructure Configuration:** Pre-mapped `render.yaml` server blueprint paired with a `netlify.toml` SPA static handler for absolute 1-click cloud portability.

## 💾 Sub-System Setup
**Database:**
You will need a standard MongoDB Cluster (Atlas or local `mongod`). Insert the connection string into the `backend/.env` file under the key `MONGODB_URI`.

**Initiation Sequence:**
```bash
# 1. Initialize API Aggregator
cd backend
npm install
npm start

# 2. Boot Spatial UI
cd frontend
npm install
npm run dev
```

> **Note on Chrome Integrity:** Netlify and Render.com endpoints execute seamlessly. If testing `GET /:code` logic manually inside browsers, use `--legacy-peer-deps` within npm environments or `Incognito Mode` to bypass aggressive `301/302` HTTP caching protocols executed arbitrarily by iOS environments.

<hr/>

<div align="center">
  <p>Forged with absolute precision to route the modern web. ⚡</p>
</div>
