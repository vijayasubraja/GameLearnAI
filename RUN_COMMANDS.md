# GameLearn AI — Project Run Commands Guide

This document provides a comprehensive guide for setting up, running, building, testing, and troubleshooting both the **Backend (FastAPI)** and **Frontend (React + TypeScript + Vite + R3F)** of the GameLearn AI platform.

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed on your machine:

- **Node.js** (v18.0.0 or higher) & **npm** (v9.0.0 or higher)
- **Python** (v3.10 or higher)
- **Git**

---

## 🐍 Backend Commands (FastAPI + SQLAlchemy + Pytest)

All backend operations should be run from the `backend/` directory:

```bash
cd backend
```

### 1. Environment Setup & Dependency Installation

#### **Windows (PowerShell / Command Prompt)**
```powershell
# Create Python Virtual Environment (if not already created)
python -m venv venv

# Activate Virtual Environment (PowerShell)
.\venv\Scripts\Activate.ps1
# OR (Command Prompt)
.\venv\Scripts\activate.bat

# Upgrade pip & install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### **Linux / macOS (Bash / Zsh)**
```bash
# Create Python Virtual Environment
python3 -m venv venv

# Activate Virtual Environment
source venv/bin/activate

# Upgrade pip & install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

---

### 2. Backend Environment Configuration

Copy the example environment file:

```bash
# Copy example .env file
cp .env.example .env
```

*Default configuration in `.env`:*
- Database: `DATABASE_URL=sqlite:///./gamelearn.db`
- Port: `8000`
- JWT Secret: `SECRET_KEY=supersecret_jwt_key_change_in_production_environment`

---

### 3. Start Backend Development Server

Run FastAPI development server with hot-reloading:

```bash
# Using uvicorn directly (with active venv)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# OR using python module execution
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> 🌐 **Backend URLs:**
> - API Base Endpoint: [http://127.0.0.1:8000](http://127.0.0.1:8000)
> - Interactive OpenAPI Specs (Swagger UI): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
> - Redoc Documentation: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### 4. Run Backend Test Suite

Run automated unit and integration tests (Pytest):

```bash
# Run all tests with verbose output
python -m pytest -v

# Run a specific test module
python -m pytest tests/test_auth.py -v
python -m pytest tests/test_scenarios.py -v
python -m pytest tests/test_simulation.py -v
```

---

### 5. Database Operations & Seeding

```bash
# Manually seed scenario catalog into SQLite/PostgreSQL
python -c "from app.db.session import SessionLocal, Base, engine; Base.metadata.create_all(bind=engine); from app.db.seed_scenarios import seed_scenarios; seed_scenarios(SessionLocal())"
```

---

## ⚛️ Frontend Commands (React + TypeScript + Vite + Tailwind CSS)

All frontend operations should be run from the `frontend/` directory:

```bash
cd frontend
```

### 1. Install Node Dependencies

```bash
npm install
```

---

### 2. Frontend Environment Configuration

Copy the example environment file:

```bash
# Copy example .env file
cp .env.example .env
```

*Key Environment Variables in `.env`:*
- `VITE_API_BASE_URL`: Base URL for API requests (default: `http://127.0.0.1:8000/api/v1`)
- `VITE_ENABLE_DEV_FALLBACK`: Set to `false` for live backend or `true` for local dev preview.

---

### 3. Start Frontend Development Server

Run Vite local development server with HMR (Hot Module Replacement):

```bash
npm run dev
```

> 🌐 **Frontend URL:**
> - Local Application: [http://localhost:5173](http://localhost:5173)

---

### 4. Type Checking & Code Quality Verification

```bash
# Run TypeScript type check (no code emit)
npx tsc --noEmit
```

---

### 5. Production Build & Local Preview

```bash
# Build production bundle (transpile TS & bundle with Vite)
npm run build

# Preview production build locally
npm run preview
```

---

## 🚀 Running Full Stack (Backend + Frontend)

To run the full stack simultaneously, open two separate terminal windows:

### **Terminal 1 — Backend API Server**
```powershell
cd d:\hackwell26\GameLearnAI\backend
.\venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```

### **Terminal 2 — Frontend App**
```powershell
cd d:\hackwell26\GameLearnAI\frontend
npm run dev
```

---

## ⚡ Quick Reference Cheat Sheet

| Action | Target | Command |
|---|---|---|
| **Install Backend Dependencies** | Backend | `pip install -r requirements.txt` |
| **Run Backend Dev Server** | Backend | `uvicorn app.main:app --reload --port 8000` |
| **Run Pytest Suite** | Backend | `python -m pytest -v` |
| **Install Frontend Dependencies** | Frontend | `npm install` |
| **Run Frontend Dev Server** | Frontend | `npm run dev` |
| **TypeScript Typecheck** | Frontend | `npx tsc --noEmit` |
| **Production Frontend Build** | Frontend | `npm run build` |
| **Preview Frontend Build** | Frontend | `npm run preview` |

---

## 🔧 Troubleshooting & Tips

- **Port 8000 in use (Backend):**
  - Kill active process: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force` (Windows) or `kill -9 $(lsof -t -i:8000)` (Linux/Mac).
- **Port 5173 in use (Frontend):**
  - Vite will automatically switch to port `5174` or specified custom port via `npm run dev -- --port 3000`.
- **Reset Local Database (SQLite):**
  - Delete `backend/gamelearn.db` and restart the backend server; tables and scenarios will be automatically recreated.
