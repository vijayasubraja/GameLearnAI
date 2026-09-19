# Phase 3 — Skill Level ML (Random Forest Classifier)

## Objective
Train, evaluate, serialize, and deploy the Random Forest Skill Level Classifier (`scikit-learn`) to predict learner proficiency levels (`Beginner`, `Intermediate`, `Advanced`) based on situational assessment vectors and learner feature parameters. This phase introduces the core machine learning inference pipeline into the FastAPI backend, serving fast sub-5ms predictions with full confidence probability distributions and feature importance breakdowns.

---

## Features Implemented

### 1. Synthetic Dataset Generation Pipeline
- **Generator Script (`backend/app/ml/generate_skill_dataset.py`):** Programmatic dataset generator producing 2,100 samples distributed evenly across all 7 core skill domains (`road_safety`, `public_transport`, `money_management`, `shopping_transactions`, `communication`, `workplace`, `emergency_safety`).
- **Feature Schema:**
  - `experience_rating` (1.0 to 5.0)
  - `confidence_score` (1.0 to 5.0)
  - `knowledge_score` (0.0 to 1.0)
  - `situational_decision_score` (0.0 to 1.0)
  - `response_consistency` (0.0 to 1.0)
- **Class Distribution:** Balanced multi-class target labels (`Beginner`, `Intermediate`, `Advanced`).

### 2. Model Training & Serialization Engine
- **Training Script (`backend/app/ml/train_skill_model.py`):** Trains a `scikit-learn` `Pipeline` consisting of a `StandardScaler` and `RandomForestClassifier(n_estimators=120, max_depth=10, random_state=42)`.
- **Evaluation Performance Metrics:**
  - **Accuracy:** **96.90%**
  - **Macro F1 Score:** **0.9687**
  - **Precision / Recall:** High precision (>0.96) across all classes.
- **Model Artifact Persistence:** Serializes the trained pipeline into `backend/app/ml/saved_models/skill_level_rf.joblib`.

### 3. ML Inference Service & Cached Model Loader
- **Service Layer (`backend/app/services/ml_service.py`):** Implements an in-memory lazy-loading model cache ensuring inference response latencies $< 5\text{ms}$.
- **Comprehensive Prediction Payload:** Computes predicted level, per-class confidence probability map (e.g. `{"Beginner": 0.04, "Intermediate": 0.91, "Advanced": 0.05}`), Gini feature importance breakdown, and personalized learning path recommendations.

### 4. FastAPI Endpoint Integration
- **Endpoint (`POST /api/v1/ml/predict-skill`):** Authenticated endpoint in `backend/app/api/v1/ml.py` receiving Pydantic feature vectors and returning model inference payloads.
- **Pydantic V2 Schemas (`backend/app/schemas/ml.py`):** Strict request validation (`SkillPredictionRequest`) and response formatting (`SkillPredictionResponse`).

---

## Technical Architecture

```
┌───────────────────────────┐         ┌────────────────────────────┐         ┌─────────────────────────────┐
│  Client / Frontend        │         │  FastAPI API Router        │         │  ML Inference Service       │
│  (Assessment / Briefing)  │         │  (POST /ml/predict-skill)  │         │  (app/services/ml_service)  │
└─────────────┬─────────────┘         └─────────────┬──────────────┘         └──────────────┬──────────────┘
              │                                     │                                       │
              │─── 1. POST /ml/predict-skill ──────►│                                       │
              │    (Feature scores)                 │─── 2. Validate with Pydantic ────────►│
              │                                     │                                       │
              │                                     │                                       │ 3. Read cached joblib
              │                                     │                                       │    RandomForest Model
              │                                     │                                       │
              │◄── 4. Return Skill Prediction ──────│◄── 5. Formulate Response Payload ─────│
              │    (Level, Probas, Importance, Rec) │                                       │
```

---

## APIs Added

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/ml/predict-skill` | Predict learner skill level (`Beginner`, `Intermediate`, `Advanced`) based on feature scores | Yes (Bearer JWT) |

---

## Files Created / Modified

### Machine Learning Engine
- `backend/app/ml/__init__.py` (NEW — Package initialization)
- `backend/app/ml/generate_skill_dataset.py` (NEW — Synthetic dataset generator script)
- `backend/app/ml/train_skill_model.py` (NEW — Model training & evaluation script)
- `backend/app/ml/data/skill_level_dataset.csv` (NEW — Generated CSV dataset)
- `backend/app/ml/saved_models/skill_level_rf.joblib` (NEW — Serialized model pipeline)

### Backend Service & API Layer
- `backend/app/schemas/ml.py` (NEW — Pydantic ML schemas)
- `backend/app/schemas/__init__.py` (MODIFIED — Package exports)
- `backend/app/services/ml_service.py` (NEW — Inference service layer with cached model loader)
- `backend/app/api/v1/ml.py` (NEW — FastAPI router)
- `backend/app/main.py` (MODIFIED — Router registration)

### Automated Test Suite
- `backend/tests/test_ml.py` (NEW — Automated unit & integration tests for ML pipeline & API)

---

## Technologies Used & Rationale

- **Scikit-learn:** Industry-standard Python machine learning library providing `RandomForestClassifier`, `Pipeline`, `StandardScaler`, and evaluation metrics.
- **Joblib:** Fast serialization for scikit-learn models ensuring fast disk load and zero runtime evaluation overhead.
- **Pandas & NumPy:** Efficient tabular vector manipulation for dataset creation and feature array formatting.
- **FastAPI & Pydantic V2:** High-throughput async REST API serving with strict input validation and type casting.

---

## Tests Performed & Results

### 1. Model Training Evaluation
- **Accuracy:** 96.90%
- **Macro F1:** 0.9687
- **Confusion Matrix:**
  - Beginner: 149 true positives, 0 false negatives
  - Intermediate: 165 true positives, 6 misclassified as Beginner, 3 misclassified as Advanced
  - Advanced: 93 true positives, 4 misclassified as Intermediate

### 2. Automated Backend Pytest Suite (`python -m pytest -v`)
- `tests/test_auth.py` (7 tests passed)
- `tests/test_ml.py` (5 tests passed — dataset generation, model training, beginner prediction, advanced prediction, 401 unauthenticated check)
- `tests/test_scenarios.py` (5 tests passed)
- `tests/test_simulation.py` (1 test passed)
- **Result:** **18/18 PASSED** (100% pass rate in 9.42s).

---

## Phase Completion Status
**COMPLETED** (Dataset generator, Random Forest training script, joblib model serialization, FastAPI endpoint, inference service, and automated pytest suite fully implemented and passing).

---

## Next Phase
- **Phase 5 — Behaviour Tracking:** Deep real-time event telemetry processing and event persistence.
- **Phase 6 — Performance Scoring:** Configurable multi-factor scoring engine.
- **Phase 7 — Difficulty ML (Random Forest):** Dynamic challenge adaptation based on simulation performance vectors.
