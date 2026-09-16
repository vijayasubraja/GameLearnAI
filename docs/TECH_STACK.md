# GameLearn AI — Technology Stack

This document describes all technologies utilized across the platform, including their purpose, location, rationale, and alternatives considered.

---

## 1. Frontend Technologies

### React 18
- **Purpose:** Frontend User Interface & Component Architecture
- **Where Used:** `frontend/src/` (Web Application UI, Dashboard, Assessment, HUD)
- **Why Selected:** Component-driven development, rich ecosystem, seamless declarative 3D integration via React Three Fiber.
- **Alternative Considered:** Vue.js, Svelte (React chosen for superior 3D ecosystem).

### TypeScript
- **Purpose:** Static Type Safety
- **Where Used:** Full frontend codebase (`.tsx`, `.ts`)
- **Why Selected:** Eliminates runtime type errors, provides rich IDE autocomplete, ensures solid contracts with backend schemas.
- **Alternative Considered:** Vanilla JavaScript (rejected due to maintenance risk in complex 3D state).

### Vite
- **Purpose:** Build Tool and Development Server
- **Where Used:** `frontend/vite.config.ts`
- **Why Selected:** Instant HMR, lightning-fast build times, optimized asset bundling.
- **Alternative Considered:** Create React App, Webpack (both significantly slower).

### Tailwind CSS
- **Purpose:** Utility-First Styling
- **Where Used:** `frontend/src/index.css`, UI components
- **Why Selected:** Rapid UI development, high design consistency, lightweight production CSS.
- **Alternative Considered:** Styled Components, Vanilla CSS.

### React Three Fiber & Three.js
- **Purpose:** Lightweight Browser-Based 3D Graphics
- **Where Used:** `frontend/src/components/simulation/`
- **Why Selected:** Declarative Three.js in React, excellent performance on integrated GPUs, WebGL-native.
- **Alternative Considered:** Babylon.js, PlayCanvas, Unreal Pixel Streaming (too heavy for lightweight browser execution).

### React Router (v6)
- **Purpose:** Routing & Code-Splitting
- **Where Used:** `frontend/src/App.tsx`
- **Why Selected:** Declarative nested routes, `React.lazy` route-level code-splitting, robust route params for scenario/attempt URLs.
- **Alternative Considered:** TanStack Router (React Router remains the ecosystem standard).

### Axios
- **Purpose:** HTTP Client with Interceptors
- **Where Used:** `frontend/src/api/client.ts`
- **Why Selected:** Automatic Bearer-token injection and 401 handling via interceptors; consistent typed errors via `normalizeApiError`.
- **Alternative Considered:** fetch API (would require manual interceptor logic).

### Lucide React
- **Purpose:** Iconography
- **Where Used:** All UI components and pages
- **Why Selected:** Tree-shakeable, consistent stroke-weight icons matching the technical aesthetic.
- **Alternative Considered:** Font Awesome (style mismatch), Material Icons.

### useSyncExternalStore (React 18)
- **Purpose:** Simulation Session State
- **Where Used:** `frontend/src/features/simulation/sessionStore.ts`
- **Why Selected:** Framework-native external-state subscription with selector-based re-renders, avoiding a state-library dependency; persisted to `sessionStorage`.
- **Alternative Considered:** Zustand, Redux Toolkit (extra dependency for a focused, page-scoped store).

---

## 2. Backend Technologies

### Python (3.11+)
- **Purpose:** Core Backend & ML Runtime
- **Where Used:** `backend/`
- **Why Selected:** Native home for modern machine learning libraries (scikit-learn, numpy, pandas) and high-performance async web frameworks.
- **Alternative Considered:** Node.js (poor native ML ecosystem), Go.

### FastAPI
- **Purpose:** High-Performance REST API Framework
- **Where Used:** `backend/app/`
- **Why Selected:** Built on Starlette and Pydantic, automatic OpenAPI/Swagger docs, high async throughput, native Python ML integration.
- **Alternative Considered:** Flask (slower, synchronous), Django (heavyweight for microservices).

### Pydantic (v2)
- **Purpose:** Data Validation & Schema Serialization
- **Where Used:** `backend/app/schemas/`
- **Why Selected:** Strict runtime validation, clear error messages, seamless integration with FastAPI.
- **Alternative Considered:** Marshmallow, Cerberus.

### Uvicorn
- **Purpose:** ASGI Web Server
- **Where Used:** Backend runtime execution
- **Why Selected:** Lightning-fast async execution powered by `uvloop` and `httptools`.
- **Alternative Considered:** Gunicorn + Uvicorn workers.

---

## 3. Authentication & Security

### bcrypt (passlib)
- **Purpose:** Secure One-Way Password Hashing
- **Where Used:** `backend/app/core/security.py`
- **Why Selected:** Industry-standard salt+hash algorithm resistant to brute-force and rainbow table attacks.
- **Alternative Considered:** Argon2, PBKDF2.

### PyJWT / python-jose
- **Purpose:** Stateless JSON Web Token Generation and Verification
- **Where Used:** `backend/app/core/security.py`, `backend/app/api/deps.py`
- **Why Selected:** Secure, compact, stateless authentication for REST APIs with configurable token expiration.
- **Alternative Considered:** Session cookies (less suitable for decoupled APIs).

---

## 4. Database & ORM

### PostgreSQL (with SQLite local fallback)
- **Purpose:** Relational Persistence Engine
- **Where Used:** Learner profiles, assessments, behaviour events, performance scores, predictions.
- **Why Selected:** ACID compliance, JSONB support for raw event telemetry, robust relational constraints.
- **Alternative Considered:** MongoDB (relational constraints are critical for historical progress tracking).

### SQLAlchemy (2.0)
- **Purpose:** Object Relational Mapper (ORM)
- **Where Used:** `backend/app/models/`, `backend/app/db/`
- **Why Selected:** Python's gold standard ORM, clean declarative models, supports async and sync queries.
- **Alternative Considered:** Tortoise ORM, SQLModel.

---

## 5. Machine Learning

### scikit-learn
- **Purpose:** Machine Learning Algorithms & Model Pipeline
- **Where Used:** `backend/app/ml/`
- **Why Selected:** Production-ready implementations of Random Forest Classifier, cross-validation, feature scalers, metrics.
- **Alternative Considered:** PyTorch, TensorFlow (overkill for tabular decision features).

### Random Forest Classifier
- **Purpose:** Skill Level & Difficulty Prediction
- **Where Used:** `SkillModel`, `DifficultyModel`
- **Why Selected:** High accuracy on tabular data, resistant to overfitting, interpretable feature importances, fast inference latency (< 5ms).
- **Alternative Considered:** Logistic Regression (too simplistic for non-linear boundaries), Neural Networks (unnecessary complexity).

---

## 6. Version Control & Testing

### Git & GitHub
- **Purpose:** Distributed Version Control
- **Where Used:** Repository management
- **Why Selected:** Standard collaboration and version tracking.

### Pytest
- **Purpose:** Automated Unit & API Testing
- **Where Used:** `backend/tests/`
- **Why Selected:** Expressive syntax, fixtures, rich plugin ecosystem for API testing via HTTPX.

---

## 7. Frontend Verification
- **TypeScript check + production build:** `npm run build` (`tsc && vite build`) — strict `noUnusedLocals`/`noUnusedParameters`, 0 errors.
- **Bundling strategy:** all feature pages are `React.lazy` code-split; `build.rollupOptions.output.manualChunks` isolates the `three` vendor package so heavy WebGL code loads only on the simulation route.
