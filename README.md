# 🎯 QuickTask: Professional AI-Powered Task Management SaaS

QuickTask is a high-fidelity, full-stack productivity application built with a modern microservices architecture. It features a stunning glassmorphism UI, real-time deadline scheduling, automated productivity analytics via Python, and a robust Node.js backend.

---

## 🚀 Key Features

- **💎 Premium UI/UX**: Modern glassmorphism design with Dark/Light mode, smooth Framer Motion animations, and responsive layouts.
- **📊 AI Productivity Analytics**: A dedicated Python FastAPI microservice that calculates productivity scores, completion trends, and efficiency metrics.
- **🔔 Smart Notifications**: Background scheduler that alerts users for overdue tasks and upcoming deadlines (within 24 hours).
- **📂 Data Portability**: Export your filtered tasks directly to professional **PDF Reports** or **CSV Spreadsheets**.
- **🛡️ Enterprise Security**: Secure authentication using industry-standard JWT and Bcrypt password hashing.
- **🐳 Cloud Ready**: Fully containerized with Docker and optimized for Serverless deployments like Vercel.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Framer Motion, Recharts, Lucide Icons.
- **Core Backend**: Node.js, Express, Mongoose (MongoDB).
- **Analytics Service**: Python 3.9, FastAPI, PyMongo.
- **DevOps**: Docker, GitHub Actions CI/CD, Vercel Serverless.

---

## 📂 Project Structure

```text
├── backend/          # Node.js Express API (Auth, Tasks, Export)
├── analytics/        # Python FastAPI Service (Data Crunching)
├── frontend/         # React SPA (Vite-powered)
├── docker-compose.yml # Local orchestration for all services
└── README.md         # Documentation
```

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- Node.js (v18+) & npm
- Python (v3.9+)
- MongoDB (Running locally or on Atlas)

### 2. Manual Startup
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Analytics:**
```bash
cd analytics
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Production Deployment Guide

This application is designed for a hybrid cloud deployment: **Vercel** (Frontend/Backend) and **Hugging Face** (Analytics).

### Phase 1: Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Crucial**: Go to **Network Access** > **Add IP Address** > Click **"Allow Access from Anywhere"** (`0.0.0.0/0`).
3. Copy your Connection String.

### Phase 2: Core Backend (Vercel)
1. Push your code to GitHub.
2. In Vercel, select **New Project** and use the `backend` folder as the Root Directory.
3. Add Environment Variables:
   - `MONGO_URI`: (Your Atlas String)
   - `JWT_SECRET`: (A strong random string)
   - `NODE_ENV`: `production`

### Phase 3: Analytics Microservice (Hugging Face Spaces)
1. Create a new **Docker Space** on [Hugging Face](https://huggingface.co/spaces).
2. Upload all files from the `analytics` folder.
3. In **Settings > Secrets**, add:
   - `MONGO_URI`: (Your Atlas String)
4. Once the space is "Running", copy the Direct URL (usually ends in `.hf.space`).

### Phase 4: Frontend (Vercel)
1. Create a new project on Vercel using the `frontend` folder as the Root Directory.
2. Under **Framework Preset**, select **Vite**.
3. Add Environment Variables (Replace with your actual live URLs):
   - `VITE_NODE_API_URL`: `https://your-backend-api.vercel.app/api`
   - `VITE_PYTHON_API_URL`: `https://your-analytics-space.hf.space/analytics`
4. Deploy.

---

## 🧪 Development & Testing

- **Backend Tests**: `cd backend && npm test` (Uses Jest & Supertest)
- **Analytics Tests**: `cd analytics && pytest` (Uses Pytest & Mongomock)
- **CI/CD**: Every push to `main` triggers automated testing and build checks via GitHub Actions.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
