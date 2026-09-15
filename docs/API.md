# GameLearn AI — API Documentation

Base URL: `http://localhost:8000/api/v1`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new learner account.
- **Request Body:**
  ```json
  {
    "email": "learner@example.com",
    "username": "learner101",
    "password": "SecurePassword123!",
    "full_name": "Alex Mercer"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": 1,
    "email": "learner@example.com",
    "username": "learner101",
    "full_name": "Alex Mercer",
    "created_at": "2026-09-15T10:00:00Z"
  }
  ```

### `POST /auth/login`
Authenticates a user and issues a Bearer JWT.
- **Request Body:**
  ```json
  {
    "email_or_username": "learner@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "learner@example.com",
      "username": "learner101",
      "full_name": "Alex Mercer"
    }
  }
  ```

### `GET /auth/me`
Fetches the profile of the currently authenticated user.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "email": "learner@example.com",
    "username": "learner101",
    "full_name": "Alex Mercer",
    "created_at": "2026-09-15T10:00:00Z"
  }
  ```

---

## 2. Assessment Endpoints (Phase 2)
- `GET /assessment/questions` — Retrieve the 25–35 scenario profiling questions.
- `POST /assessment/submit` — Submit answers and calculate initial category scores.

---

## 3. ML Endpoints (Phase 3 & Phase 7)
- `POST /ml/predict-skill` — Random Forest inference on assessment vector $\rightarrow$ `Beginner | Intermediate | Advanced`.
- `POST /ml/predict-difficulty` — Random Forest inference on simulation performance $\rightarrow$ `Easy | Medium | Hard`.

---

## 4. Scenario & Simulation Endpoints (Phase 4 & Phase 5)
- `GET /scenarios/select` — Rule-based scenario selection matching skill level & difficulty.
- `POST /simulation/start` — Initiate a scenario attempt session.
- `POST /simulation/behaviour` — Ingest live telemetry events (look actions, road entry, signal obedience).
- `POST /simulation/complete` — Conclude attempt and trigger scoring pipeline.

---

## 5. Performance & Profile Endpoints (Phase 6 & Phase 8)
- `POST /performance/score` — Compute weighted score across accuracy, safety, reaction, decisions.
- `GET /profile/dashboard` — Full analytics payload (strengths, weak areas, skill radar, history).
