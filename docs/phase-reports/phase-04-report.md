# Phase 4 — Scenario Engine + 3D Simulation (Road Safety)

## Objective
Implement the relational scenario catalog database, rule-based scenario selection engine, backend simulation session lifecycle management APIs, and an interactive 3D pedestrian road crossing simulation using React Three Fiber (R3F) and Three.js. This phase establishes the core simulation substrate where real-world skills are practiced in lightweight 3D environments, while capturing real-time telemetry events for adaptive machine learning assessment.

---

## Features Implemented

### 1. Scenario Engine & Database Catalog
- **Relational Scenario Table (`scenarios`):** Full database schema supporting scenario metadata, difficulty levels, duration estimates, skill categories, success/failure conditions, and dynamic JSON environment configurations.
- **Rule-Based Scenario Selector:** Endpoints to list available missions (`GET /api/v1/scenarios`), filter by skill/difficulty (`?skill=road_safety`), fetch details (`GET /api/v1/scenarios/{id}`), and automatically select the next recommended mission (`GET /api/v1/scenarios/select`).
- **Seed Scenarios Catalog:** 7 production-grade seed scenarios covering all 7 core life skills (Road Safety, Public Transport, Money Management, Grocery Shopping, Social Communication, Workplace Collaboration, Emergency Preparedness).

### 2. Simulation Session Lifecycle & Telemetry Ingestion
- **Session Initiation (`POST /api/v1/simulation/start`):** Authenticated endpoint initializing a `simulation_attempts` record, setting state to `active`, generating a unique `attempt_id`, and returning scenario details with `environment_config`.
- **Real-Time Telemetry Handler (`POST /api/v1/simulation/behaviour`):** High-throughput event ingestion endpoint capturing timestamped player actions, look-scans, signal interactions, road entry, proximity hazards, and objective achievements in `behaviour_events`.
- **Session Completion (`POST /api/v1/simulation/complete`):** Endpoint finalizing the attempt status (`completed` or `failed`), setting completion timestamp, and calculating/storing initial multi-factor performance metrics.

### 3. Interactive 3D Simulation Engine (`RoadCrossingSimulator`)
- **React Three Fiber (R3F) Scene:** Low-poly urban environment complete with multi-lane asphalt roadway, zebra pedestrian crosswalk, sidewalks, night-themed buildings, streetlights, and an interactive goal beacon.
- **Procedural Traffic & Signal Systems:** Configurable multi-lane vehicle spawner with direction vectors, hazard proximity detection, and a functional pedestrian traffic signal with countdown timer.
- **Player Navigation & Decision Triggers:** Smooth WASD/Arrow movement, head look-scans (`L`/`R` keys) emitting visual hazard events, traffic signal interaction (`E` key), 3-strike proximity danger limit, and automatic finish-on-arrival triggers.

---

## Technical Implementation & Data Schemas

### Architecture Overview
```
┌─────────────────────────┐          ┌──────────────────────────┐          ┌───────────────────────────┐
│   React 18 + R3F Canvas │          │   FastAPI Backend        │          │   SQLAlchemy / SQLite     │
│   (RoadCrossingSim)     │          │   (API Router v1)        │          │   (Relational DB)         │
└────────────┬────────────┘          └────────────┬─────────────┘          └─────────────┬─────────────┘
             │                                    │                                      │
             │─── 1. GET /scenarios/select ──────►│                                      │
             │◄── Scenario & Env Config ──────────│                                      │
             │                                    │                                      │
             │─── 2. POST /simulation/start ─────►│─── Create SimulationAttempt record ─►│
             │◄── attempt_id ─────────────────────│                                      │
             │                                    │                                      │
             │─── 3. POST /simulation/behaviour ─►│─── Persist BehaviourEvent (202 Accepted)
             │    (Look-scan, Proximity, Signal)  │                                      │
             │                                    │                                      │
             │─── 4. POST /simulation/complete ──►│─── Update status & score record ────►│
             │◄── Final Attempt Summary ──────────│                                      │
```

### Database Models

#### `Scenario` (`backend/app/models/scenario.py`)
- `id` (String(100), Primary Key) — Unique slug identifier (e.g. `road-safety-crosswalk-01`).
- `title` (String(255), Not Null) — Display name.
- `description` (String(1000), Not Null) — Full scenario explanation.
- `skill_category` (String(100), Indexed) — Target domain (e.g., `road_safety`).
- `skill_name` (String(100)) — Human-readable skill label.
- `difficulty_level` (String(50), Indexed) — `Easy`, `Medium`, or `Hard`.
- `estimated_duration_minutes` (Integer, Default 5).
- `objective` (String(500)) — Primary mission goal.
- `real_world_context` (String(1000)) — Educational context.
- `skills_tested` (JSON) — Array of tested sub-skills.
- `controls` (JSON) — Key bindings list.
- `success_conditions` / `failure_conditions` (JSON).
- `availability` (String(50), Default `"available"`).
- `is_recommended` (Boolean, Default `False`).
- `environment_config` (JSON) — Dynamic 3D configuration parameters (lanes, density, vehicle speed, signals).

#### `SimulationAttempt` (`backend/app/models/simulation.py`)
- `id` (String(100), Primary Key) — Generated attempt identifier (`attempt-{uuid}`).
- `user_id` (Integer, Foreign Key `users.id`, Indexed).
- `scenario_id` (String(100), Foreign Key `scenarios.id`, Indexed).
- `status` (String(50), Default `"active"`) — `active`, `completed`, `failed`.
- `started_at` (DateTime, Timezone-aware).
- `completed_at` (DateTime, Nullable).
- `overall_score` (Integer, Nullable).

#### `BehaviourEvent` (`backend/app/models/simulation.py`)
- `id` (Integer, Primary Key, Auto-increment).
- `attempt_id` (String(100), Foreign Key `simulation_attempts.id`, Indexed).
- `event_type` (String(100), Indexed) — Event classification tag.
- `timestamp_offset` (Integer) — Elapsed seconds from simulation start.
- `is_safe` (Boolean, Default `True`).
- `payload` (JSON, Nullable) — Event-specific context (e.g., scan side, vehicle distance gap).

---

## APIs Added / Updated

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/scenarios` | List available scenarios with optional `skill`, `difficulty`, `status` filters | Yes (Bearer JWT) |
| `GET` | `/api/v1/scenarios/select` | Get rule-based recommended scenario for the learner | Yes (Bearer JWT) |
| `GET` | `/api/v1/scenarios/{scenario_id}` | Retrieve scenario details and `environment_config` | Yes (Bearer JWT) |
| `POST` | `/api/v1/simulation/start` | Initialize a new simulation attempt session | Yes (Bearer JWT) |
| `POST` | `/api/v1/simulation/behaviour` | Ingest real-time behaviour telemetry event | Yes (Bearer JWT) |
| `POST` | `/api/v1/simulation/complete` | Finalize simulation attempt & finalize performance score | Yes (Bearer JWT) |

---

## Database Tables Added

1. `scenarios`: Catalog storing 7 pre-configured simulation scenarios with dynamic `environment_config` JSON payloads.
2. `simulation_attempts`: Tracks active/completed simulation sessions linked to authenticated users.
3. `behaviour_events`: Stores fine-grained telemetry events captured during 3D simulation runs.

---

## Files Created / Modified

### Backend Files
- `backend/app/models/scenario.py` (NEW — Scenario model)
- `backend/app/models/simulation.py` (NEW — SimulationAttempt & BehaviourEvent models)
- `backend/app/models/__init__.py` (MODIFIED — Package exports)
- `backend/app/schemas/scenario.py` (NEW — Scenario response schemas)
- `backend/app/schemas/simulation.py` (NEW — Simulation request/response schemas)
- `backend/app/schemas/__init__.py` (MODIFIED — Schema package exports)
- `backend/app/db/seed_scenarios.py` (NEW — Scenario seed loader with 7 scenarios)
- `backend/app/api/v1/scenarios.py` (NEW — Scenarios API router)
- `backend/app/api/v1/simulation.py` (NEW — Simulation lifecycle & telemetry API router)
- `backend/app/main.py` (MODIFIED — Router registration & database table auto-creation)
- `backend/tests/conftest.py` (NEW — Shared pytest fixtures & database isolation)
- `backend/tests/test_scenarios.py` (NEW — Scenario catalog test suite)
- `backend/tests/test_simulation.py` (NEW — End-to-end simulation flow test suite)
- `backend/tests/test_auth.py` (MODIFIED — Updated to use shared `conftest` fixtures)

### Frontend Files
- `frontend/src/components/simulation/RoadCrossingSimulator.tsx` (MODIFIED — R3F canvas, player avatar, dynamic traffic spawner, streetlights, zebra crosswalk, pedestrian signal)
- `frontend/src/components/simulation/MissionPlazaSimulator.tsx` (MODIFIED — Generic plaza 3D simulator for non-road safety scenarios)
- `frontend/src/components/simulation/SimulationHUD.tsx` (MODIFIED — Simulation telemetry HUD overlay)
- `frontend/src/components/simulation/simTypes.ts` (MODIFIED — Simulation telemetry event contract definitions)
- `frontend/src/pages/ScenarioBriefingPage.tsx` (MODIFIED — Wired backend simulation start payload)
- `frontend/src/pages/SimulationPlayPage.tsx` (MODIFIED — Real-time telemetry dispatcher & attempt lifecycle manager)

---

## Technologies Used & Rationale

- **React Three Fiber (R3F) & Three.js:** Declarative WebGL rendering engine allowing high-performance 3D scenes within the browser without requiring external plugins or game engines.
- **FastAPI & SQLAlchemy:** Async Python backend facilitating low-latency telemetry ingestion and instant integration with scikit-learn machine learning pipelines.
- **Pydantic V2:** Type validation and strict response schemas for scenario data and telemetry payloads.
- **SQLite (Development/Testing) & PostgreSQL (Production):** Zero-config in-memory database during test runs with seamless production scaling via SQLAlchemy ORM.
- **Pytest:** Comprehensive automated test framework for API verification and data isolation.

---

## Tests Performed & Results

### 1. Automated Backend Pytest Suite (`python -m pytest -v`)
- `tests/test_auth.py` (7 tests passed): Root health check, registration, duplicate checks, login, JWT decode, bad password handling, unauthorized route protection.
- `tests/test_scenarios.py` (5 tests passed): Scenarios listing, filtering by skill category, recommended scenario selector, scenario detail lookup, 404 handling.
- `tests/test_simulation.py` (1 test passed): Full multi-step simulation lifecycle test (Start Session $\rightarrow$ Record Telemetry Events $\rightarrow$ Complete Attempt $\rightarrow$ Verify Performance Result $\rightarrow$ Verify Progress History $\rightarrow$ Verify Profile & Skills Map).
- **Result:** **13/13 PASSED** (100% pass rate in 6.66s).

### 2. Frontend Build Verification (`npm run build`)
- Executed `tsc && vite build` inside `frontend/`.
- Verified 0 TypeScript compilation errors and isolated Three.js vendor bundle chunking (`three` chunk ~266 kB gzip loaded on-demand).
- **Result:** **0 Errors, PASSED**.

---

## Problems Encountered & Solutions Applied

1. **Pytest Database Session Bleed Across Test Modules:**
   - *Problem:* Running multiple test files sequentially caused `sqlite3.OperationalError: no such table: users` due to conflicting in-memory engine instances and un-overridden `get_db` dependencies.
   - *Solution:* Introduced `backend/tests/conftest.py` providing shared module-level engine, `TestingSessionLocal`, dependency override, and auto-seeding `setup_db` fixtures.

2. **Pydantic V2 Migration Warnings:**
   - *Problem:* Pydantic V2 emitted deprecation warnings for `class Config` in schema definitions.
   - *Solution:* Updated schema models to use `model_config = ConfigDict(from_attributes=True)`.

3. **Three.js Bundle Optimization:**
   - *Problem:* 3D graphics libraries increased the initial application load time.
   - *Solution:* Configured Vite `manualChunks` to isolate Three.js and R3F into a lazy-loaded `three` chunk, maintaining a slim main application bundle (~134 kB gzip).

---

## Current System Sequence Flow

```
Learner (Browser)           Scenario Briefing        FastAPI (/api/v1/...)         Database Layer
      │                            │                          │                           │
      │── 1. Select Mission ──────►│                          │                           │
      │                            │── 2. GET /scenarios/{id}►│                           │
      │                            │◄── Return Scenario & Env ├───────────────────────────┤
      │                            │                          │                           │
      │── 3. Click "Start Sim" ───►│                          │                           │
      │                            │── 4. POST /sim/start ───►│── Create Attempt Record ─►│
      │                            │◄── Return attempt_id ────│                           │
      │                            │                          │                           │
      │◄── 5. Mount R3F 3D Canvas ─┴──────────────────────────│                           │
      │                                                       │                           │
      │── 6. WASD Move / L-R Look / E Press Signal ───────────►│── Save BehaviourEvent ───►│
      │       (Real-Time Telemetry: /sim/behaviour)           │                           │
      │                                                       │                           │
      │── 7. Reach Sidewalk Goal ────────────────────────────►│── Update Attempt Status ─►│
      │       (POST /sim/complete)                            │   & Calculate Score       │
      │                                                       │                           │
      │◄── 8. Redirect to /results ───────────────────────────┴───────────────────────────┘
```

---

## Phase Completion Status
**COMPLETED** (Scenario engine, relational schema, backend endpoints, R3F 3D simulation canvas, telemetry ingestion, and test verification fully executed and passing).

---

## Next Steps
- **Phase 3 — Skill Level ML (Random Forest):** Train and deploy skill classifier using baseline situational assessment data and simulation telemetry vectors.
- **Phase 5 — Behaviour Tracking & Analytics Enhancement:** Expand telemetry event aggregations and real-time safety heatmaps.
