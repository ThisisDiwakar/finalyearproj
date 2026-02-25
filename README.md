# 🌊 Blue Carbon Registry — Blockchain-Based MRV System

A Blockchain-powered registry for blue carbon ecosystem restoration with Monitoring, Reporting, and Verification (MRV) capabilities.

> **Problem Statement**: SIH — Blockchain-Based Blue Carbon Registry and MRV System  
> **Organization**: Ministry of Earth Sciences (MoES) — NCCR  
> **Theme**: Clean & Green Technology

---

## 📋 Implemented Modules

### ✅ Module 1: User Registration & Login
- Multi-step registration with role selection (Community, NGO, Panchayat)
- JWT-based secure authentication
- Organization details capture
- Location-based profile (State, District, Village)

### ✅ Module 2: Project Submission
- GPS location capture via browser Geolocation API
- Multi-photo upload with IPFS storage (via Pinata)
- Species selection with auto-suggest for Indian mangrove species
- Auto CO₂e calculation (Area × Sequestration Rate)
- Offline support — data queued in localStorage when offline
- Project status tracking (DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → MINTED)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| File Storage | IPFS (Pinata API) |
| Styling | Custom CSS (Ocean dark theme) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** running locally (or MongoDB Atlas URI)
- (Optional) Pinata account for IPFS: https://app.pinata.cloud/

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env file with your MongoDB URI and (optionally) Pinata keys
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Open in Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

---

## 📁 Project Structure

```
finalyearproj/
├── backend/
│   ├── config/db.js           # MongoDB connection
│   ├── middleware/auth.js     # JWT auth middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Project.js         # Project schema
│   ├── routes/
│   │   ├── auth.js            # Register, Login, Profile APIs
│   │   └── project.js         # Project CRUD APIs
│   ├── utils/ipfs.js          # Pinata IPFS upload utility
│   ├── server.js              # Express server entry
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/          # Login & Register
│   │   │   ├── Dashboard/     # Dashboard with stats
│   │   │   ├── Project/       # Submission & List
│   │   │   └── Layout/        # Navbar
│   │   ├── context/           # AuthContext (React Context)
│   │   ├── services/api.js    # Axios API client
│   │   ├── App.jsx            # Routes
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Submit new project (multipart) |
| GET | `/api/projects` | List user's projects |
| GET | `/api/projects/:id` | Get project details |
| PUT | `/api/projects/:id` | Update draft/rejected project |

---

## 🌱 Default Carbon Calculation

| Ecosystem Type | Sequestration Rate (tons CO₂e/ha/year) |
|----------------|---------------------------------------|
| Mangrove | 15 |
| Coastal Wetland | 12 |
| Salt Marsh | 10 |
| Seagrass | 8 |

Formula: **Estimated CO₂e = Area (ha) × Sequestration Rate**

---

## 📱 Features

- 🔐 Secure JWT authentication with role-based access
- 📍 GPS capture with accuracy display
- 📸 Photo upload to IPFS (decentralized storage)
- 🌿 Indian mangrove species auto-suggest
- 🌍 Real-time CO₂e estimation
- 📴 Offline-first design with sync queue
- 📱 Fully responsive (mobile-first)
- 🎨 Ocean-themed dark UI

---

## 📝 Next Steps (Future Modules)

- **Module 3**: Admin Review Dashboard (NCCR)
- **Module 4**: Blockchain Credit Minting (Polygon + Smart Contracts)
- **Module 5**: Real-time Blockchain Verification
- **Module 6**: Carbon Credit Marketplace
- **Module 7**: Credit Retirement & UPI Payment
- **Module 8**: Community Impact Dashboard
