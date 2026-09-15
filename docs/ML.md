# GameLearn AI — Machine Learning Architecture

## 1. Overview
GameLearn AI relies on two distinct machine learning models designed to operate on tabular learner feature vectors:
1. **Skill Level Prediction Model** (Trained on assessment profiling features)
2. **Difficulty Prediction Model** (Trained on simulation behaviour & performance features)

> **Dataset Integrity Notice:** Initial models are trained on clearly documented synthetic datasets simulating realistic learner distributions. Models do not claim to use unverified real-world clinical data. Full retraining pipelines are provided for updating with anonymized empirical telemetry.

---

## 2. Skill Level ML Model

- **Algorithm:** Random Forest Classifier (`scikit-learn`)
- **Granularity:** Evaluated **per skill domain** (e.g., Road Safety, Money Management, Emergency Decision Making).
- **Target Classes:** `Beginner` (0), `Intermediate` (1), `Advanced` (2)

### Input Features:
- `experience_rating`: Self-reported previous familiarity (1.0 to 5.0)
- `confidence_score`: Confidence in handling unexpected situations (1.0 to 5.0)
- `knowledge_score`: Conceptual awareness score from assessment questions (0.0 to 1.0)
- `situational_decision_score`: Score on scenario-based situational dilemmas (0.0 to 1.0)
- `response_consistency`: Latency & consistency index across category questions

### Evaluation Metrics Tracked:
- Accuracy, Multi-class Macro F1 Score, Precision, Recall, and Confusion Matrix.

---

## 3. Difficulty Prediction Model

- **Algorithm:** Random Forest Classifier (`scikit-learn`)
- **Target Classes:** `Easy` (0), `Medium` (1), `Hard` (2)
- **Role:** Dynamically adapts the challenge of subsequent simulations.

### Input Features:
- `accuracy_score`: Target objective completion fidelity (0 to 100)
- `safety_score`: Infraction-free safety evaluation (0 to 100)
- `decision_score`: Correct choices at critical junctions (0 to 100)
- `reaction_time_avg`: Average response latency in seconds
- `mistake_count`: Number of safety or protocol violations
- `attempts_count`: Number of retries before achieving checkpoint
- `completed`: Boolean task completion indicator (0 or 1)
- `current_difficulty`: Current simulation difficulty (0=Easy, 1=Medium, 2=Hard)
- `historical_performance_trend`: Rolling average score delta over last 3 attempts

---

## 4. Model Persistence & Serving
- Models are trained and serialized using `joblib` into `backend/app/ml/models/`.
- Fast in-memory cached predictors ensure inference latencies $< 5\text{ms}$ upon API invocation.
