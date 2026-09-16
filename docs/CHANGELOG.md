# GameLearn AI — Changelog

All notable changes and architectural decisions are chronologically documented in this file.

---

## [Phase 2: Core Application Redesign] — 2026-09-16

### Added
- **Unified UI Design System:** reusable `ui/*` primitives (`Button`, `Card`, `Badge`, `StatCard`, `ProgressBar`, `EmptyState`, `ErrorState`, `Skeleton`, `PageHeader`, `Modal`, `Toast`) on the existing glassmorphic dark aesthetic with new `gl` tokens and utility classes.
- **Application Shell:** `AppShell` + `Sidebar` + `Topbar` wrapping the authenticated experience behind `ProtectedRoute`, with `Outlet` dashboard context.
- **Dashboard:** stat cards, score sparkline, Learning Coach recommendation, scenario carousel, recent attempts.
- **Skill Map (SkillsPage):** canonical progress per domain, learner level vs scenario difficulty, status badges, next-action links into filtered missions.
- **Mission Library (ScenariosPage):** skill/difficulty/status filters, recommended-only toggle, `?skill=` deep links.
- **Scenario Briefing:** objective, context, learning goals, environment factors, difficulty gyroscope, controls, and a `START SIMULATION` that waits for backend confirmation.
- **Immersive Simulation:** `RoadCrossingSimulator` + `MissionPlazaSimulator` (R3F, WASD + E controls), `SimulationHUD`, `SimulationNotifications`, session store with `sessionStorage` persistence, telemetry event contracts, 3-strike danger limit.
- **Results:** official score ring, breakdown bars, successful actions, mistakes, improvement tips, and Back / Continue learning / Try again actions.
- **Progress:** totals, inline SVG score-over-time chart, difficulty progression timeline, skill progress bars, recent attempts.
- **Profile:** account identity card and live skill snapshot via profile service (identity from `/auth/me`).
- **Service Layer + Dev Preview:** scenario/simulation/performance/profile services with `withDevFallback`; dev payloads explicitly marked with the `DEV_FALLBACK` symbol and surfaced via `DevBanner`; auth/validation failures never masked.
- **Performance:** lazy route code-splitting for all pages + isolated `three` vendor chunk (`manualChunks`) — main bundle reduced ~278 kB → ~134 kB gzip.
- **Config:** `frontend/.env.example` documenting `VITE_API_BASE_URL` / `VITE_ENABLE_DEV_FALLBACK`.
- **Phase Deliverable Report:** `docs/phase-reports/phase-02-core-application-redesign.md`.

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
