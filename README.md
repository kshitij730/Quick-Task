# QuickTask Productivity SaaS

QuickTask is a high-performance, full-stack task management application designed with a microservices architecture. It features a modern React frontend, a Node.js backend for core operations, and a Python FastAPI service for advanced productivity analytics.

## 🚀 Architecture

- **Frontend**: React (Vite) + Recharts + Framer Motion. High-fidelity glassmorphism UI.
- **Main Backend (Node.js)**: REST API handling Auth, Task CRUD, and Dashboard aggregation.
- **Analytics Service (Python)**: Dedicated microservice for productivity scoring and trend analysis.
- **Database**: MongoDB (Shared by both backends).

## 🛠️ Tech Stack

- **Node.js**: Express, Mongoose, JWT, Bcrypt.
- **Python**: FastAPI, PyMongo, Pydantic.
- **React**: Axios, Context API, Lucide Icons.

## 🏃 Running the Application

### Prerequisites
- Node.js & npm
- Python 3.8+
- MongoDB instance (running at `mongodb://localhost:27017`)

### Quick Start
You can use the provided PowerShell script to launch all services:
```powershell
./run_all.ps1
```

### Manual Start

#### 1. Backend
```bash
cd backend
npm install
npm start
```

#### 2. Analytics
```bash
cd analytics
pip install -r requirements.txt  # Or manually install fastapi, uvicorn, pymongo
python main.py
```

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security
- JWT-based authentication with 30-day token expiry.
- Password hashing using BCrypt.
- Strict data isolation: Users can only access their own tasks via database-level filtering.
- Middleware protection on all task related routes.

## 🌟 Advanced Features

- **Real-time Notifications**: Background scheduler checks for overdue and upcoming tasks (due in 24h).
- **Dark Mode**: Global theme toggle with persistent user preference and glassmorphism support.
- **Data Export**: Export your filtered tasks directly to **CSV** or **PDF** for external reporting.
- **Microservices Health**: Automated status monitoring and notification system.

## 🐳 Docker Support

QuickTask is fully containerized. Start the entire ecosystem with one command:
```bash
docker-compose up --build
```
This launches:
- **MongoDB**: Database layer.
- **Backend**: Node.js API.
- **Analytics**: Python Microservice.
- **Frontend**: React App served via Nginx.

## 🧪 Testing

### Backend (Node.js)
```bash
cd backend
npm test
```
Uses **Jest** and **Supertest** with a mocked in-memory MongoDB.

### Analytics (Python)
```bash
cd analytics
pytest
```
Uses **Pytest** for logic verification.

## 🔄 CI/CD
Automated workflows are configured via **GitHub Actions** (`.github/workflows/main.yml`) to verify tests and builds on every push.
