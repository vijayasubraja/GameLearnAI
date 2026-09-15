# GameLearn AI — Changelog

All notable changes and architectural decisions are chronologically documented in this file.

---

## [Phase 1: Foundation + Authentication] — 2026-09-15

### Added
- **Project Structure:** Created standard full-stack layout separating `backend/`, `frontend/`, and `docs/`.
- **Documentation System:** Established complete architectural and engineering guides (`ARCHITECTURE.md`, `TECH_STACK.md`, `PHASES.md`, `DATABASE.md`, `API.md`, `ML.md`, `SIMULATION.md`, `TESTING.md`, `PROJECT_STATUS.md`).
- **Backend Core:** FastAPI server with CORS, Pydantic settings, bcrypt security hashing, and JWT bearer token issuance/verification.
- **Database Schema:** User model with SQLAlchemy supporting PostgreSQL and SQLite fallback.
- **Auth Endpoints:** `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`.
- **Frontend App:** Vite + React 18 + TypeScript + Tailwind CSS with dark-mode aesthetic.
- **Auth Flow & Routing:** React Router v6, AuthContext with persistent JWT storage, ProtectedRoute guard, Login, Register, and Dashboard shell.
- **Test Suite:** Pytest automated tests covering user creation, duplicate protection, bcrypt verification, and JWT authentication.
