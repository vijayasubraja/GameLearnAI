# GameLearn AI — Changelog

All notable changes and architectural decisions are chronologically documented in this file.

---

## [Phase 1: Landing Page Enhancement] — 2026-09-15

### Added
- **Interactive 3D Simulation Canvas:** WebGL core powered by Three.js & React Three Fiber (`HeroSimulationCanvas.tsx`) in the hero section.
- **Launch Hero:** Futuristic narrative launch scene (`LaunchHero.tsx`) with status telemetry and initiation pulse CTA leading to `/register`.
- **5-Stage Adaptive Stepper:** Interactive horizontal journey (`AdaptiveJourney.tsx`) covering Assess, Predict, Simulate, Observe, Adapt with code/payload inspector.
- **Continuous Feedback Loop Visualizer:** 8-stage circuit (`AdaptiveLoop.tsx`) with animated packet traversal and input/output payload inspector.
- **"The World Changes With You":** Interactive 3-way skill level slider (`AdaptiveComparison.tsx`) demonstrating real-time scenario parameter morphing across Beginner, Intermediate, and Advanced.
- **3D Simulation Showcase:** Cinematic Road Safety crosswalk preview (`SimulationShowcase.tsx`) with viewpoint angle switcher and hotspot inspector.
- **Actions Become Data Telemetry Streamer:** Live decision simulator (`BehaviourVisualization.tsx`) demonstrating physical action $\rightarrow$ raw telemetry $\rightarrow$ scored performance $\rightarrow$ Random Forest adaptation.
- **7 Life-Skill Worlds Navigator:** Interactive mission carousel (`SkillWorlds.tsx`) across all target life-skill domains.
- **Futuristic Terminal Launch CTA:** Terminal card (`CTASection.tsx`) linking to authentication.
- **Technical Grid Footer & Navigation:** Minimal HUD Navbar (`Navbar.tsx`) with section anchor links and technical diagnostics footer (`LandingFooter.tsx`).
- **Phase Deliverable Report:** Created `docs/phase-reports/phase-01-landing-page-enhancement.md`.

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
