# GameLearn AI — Development Phases Roadmap

The project is structured into 10 sequential phases. Each phase delivers a standalone, fully verified increment of functionality.

---

### Phase 1 — Foundation + Authentication
- **Objective:** Establish the foundational backend API, database layer, secure authentication, and frontend shell.
- **Key Deliverables:**
  - FastAPI backend with CORS, environment configuration, database session.
  - User model with bcrypt password hashing and JWT issuance/verification.
  - Endpoints: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`.
  - React + TypeScript + Vite frontend with Tailwind CSS and modern dark aesthetic.
  - AuthContext, ProtectedRoute, Login, Register, and Dashboard shell.
  - Pytest test suite for authentication.

---

### Phase 2 — Learner Profile + Assessment
- **Objective:** Build the situational learner assessment and profiling subsystem.
- **Key Deliverables:**
  - 25–35 scenario questions covering 7 real-life skills.
  - Assessment UI with progress tracking and intuitive option selection.
  - Feature extraction engine converting responses into structured numerical/categorical vectors.
  - Assessment submission endpoint and profile creation.

---

### Phase 3 — Skill Level ML (Random Forest)
- **Objective:** Train, evaluate, and deploy the Random Forest Skill Level Classifier.
- **Key Deliverables:**
  - Documented synthetic/demo dataset generation script.
  - Model training script outputting metrics (Accuracy, F1, Confusion Matrix).
  - Per-skill prediction outputting `Beginner`, `Intermediate`, or `Advanced`.
  - ML endpoint: `POST /api/v1/ml/predict-skill`.

---

### Phase 4 — Scenario Engine + 3D Simulation (Road Safety)
- **Objective:** Implement rule-based scenario selector and interactive 3D pedestrian crossing simulation.
- **Key Deliverables:**
  - Scenario catalog database table.
  - Rule-based scenario selection matching skill & difficulty.
  - React Three Fiber 3D scene (traffic, road, crosswalk, traffic signals, low-poly city).
  - Player navigation controls (WASD/Arrows/Touch) and interactive decision triggers.

---

### Phase 5 — Behaviour Tracking
- **Objective:** Real-time telemetry tracking of learner interactions during simulation.
- **Key Deliverables:**
  - Client-side event dispatcher capturing reaction times, look actions, wait times, safety decisions, collisions, and path accuracy.
  - Telemetry endpoint: `POST /api/v1/simulation/behaviour`.
  - Persistence in PostgreSQL `behaviour_events` table.

---

### Phase 6 — Performance Scoring
- **Objective:** Transform raw behaviour telemetry into transparent multi-factor scores.
- **Key Deliverables:**
  - Centralized configurable scoring engine (Accuracy 30%, Safety 25%, Decision 20%, Reaction 10%, Completion 10%, Mistakes 5%).
  - Scoring endpoint: `POST /api/v1/performance/score`.
  - Storage in `performance_scores` table and historical aggregation.

---

### Phase 7 — Difficulty ML (Random Forest)
- **Objective:** Train and deploy the Difficulty Predictor based on simulation performance.
- **Key Deliverables:**
  - Training dataset pairing performance vectors with next optimal challenge levels.
  - Random Forest Difficulty Classifier predicting `Easy`, `Medium`, or `Hard`.
  - Difficulty prediction endpoint: `POST /api/v1/ml/predict-difficulty`.

---

### Phase 8 — Complete Adaptive Feedback Loop
- **Objective:** Orchestrate the complete end-to-end adaptive learning cycle.
- **Key Deliverables:**
  - Automatic profile update on simulation completion.
  - Weak-area detection and adaptive scenario selection.
  - Seamless loop: Simulate $\rightarrow$ Track $\rightarrow$ Score $\rightarrow$ Predict Difficulty $\rightarrow$ Update Profile $\rightarrow$ Next Scenario.

---

### Phase 9 — Dashboard + Learning Analytics
- **Objective:** Visual analytics dashboard showcasing the learner's journey.
- **Key Deliverables:**
  - Interactive radar charts of per-skill competency.
  - Historical difficulty progression and safety trends.
  - Identified strengths and targeted growth areas.
  - Recommended next simulation scenarios.

---

### Phase 10 — Final Integration + Optimization
- **Objective:** System hardening, performance optimization, and presentation readiness.
- **Key Deliverables:**
  - Complete end-to-end automated and manual testing.
  - 3D asset optimization (draw calls, texture memory).
  - Production documentation and hackathon live demonstration walk-through.
