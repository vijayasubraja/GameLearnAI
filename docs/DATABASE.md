# GameLearn AI — Database Design

## 1. Overview
The database uses a normalized PostgreSQL relational model (with SQLite compatibility for local zero-config development). It preserves detailed audit trails of assessments, raw simulation telemetry, performance evaluations, and adaptive predictions.

---

## 2. Entity Relationship Diagram

```
 users
  ├── learner_profiles (1:1)
  │     ├── skill_predictions (1:N)
  │     └── difficulty_predictions (1:N)
  ├── assessment_responses (1:N)
  └── scenario_attempts (1:N)
        ├── behaviour_events (1:N)
        └── performance_scores (1:1)

 scenarios (Catalog)
  └── scenario_attempts (1:N)
```

---

## 3. Table Schemas

### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / Integer | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User email address |
| `username` | VARCHAR(100) | UNIQUE, NOT NULL, INDEX | Unique username |
| `hashed_password` | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| `full_name` | VARCHAR(255) | NULL | Optional user display name |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Account last update |

### `learner_profiles`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / Integer | PRIMARY KEY | Profile identifier |
| `user_id` | Foreign Key -> `users.id` | UNIQUE, NOT NULL | Associated user |
| `current_difficulty` | VARCHAR(50) | DEFAULT 'Easy' | Current active difficulty level |
| `total_simulations_completed` | INTEGER | DEFAULT 0 | Count of completed sessions |
| `strengths` | JSONB / Text | DEFAULT '[]' | List of identified strong domains |
| `weak_areas` | JSONB / Text | DEFAULT '[]' | List of domains needing practice |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last profile modification |

### `assessment_responses`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / Integer | PRIMARY KEY | Record ID |
| `user_id` | Foreign Key -> `users.id` | NOT NULL | Submitting user |
| `skill_category` | VARCHAR(100) | NOT NULL | e.g. "Road Safety", "Money Management" |
| `question_id` | VARCHAR(50) | NOT NULL | Unique question code |
| `selected_option` | VARCHAR(50) | NOT NULL | Chosen response |
| `score` | FLOAT | NOT NULL | Numerical score (0.0 to 1.0) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Timestamp |

### `skill_predictions`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / Integer | PRIMARY KEY | Record ID |
| `user_id` | Foreign Key -> `users.id` | NOT NULL | User evaluated |
| `skill_category` | VARCHAR(100) | NOT NULL | Skill category |
| `predicted_level` | VARCHAR(50) | NOT NULL | Beginner, Intermediate, or Advanced |
| `confidence_score` | FLOAT | NOT NULL | Model confidence (0.0 - 1.0) |
| `feature_vector` | JSONB / Text | NOT NULL | Input features provided to ML |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Prediction timestamp |

### `scenarios`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | VARCHAR(100) | PRIMARY KEY | Unique scenario code (e.g. `road_safety_crosswalk_01`) |
| `title` | VARCHAR(255) | NOT NULL | Human-readable title |
| `skill_category` | VARCHAR(100) | NOT NULL | Target skill domain |
| `difficulty_level` | VARCHAR(50) | NOT NULL | Easy, Medium, Hard |
| `description` | TEXT | NOT NULL | Scenario mission brief |
| `environment_config` | JSONB / Text | NOT NULL | 3D scene parameters & spawn rules |

### `scenario_attempts`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / Integer | PRIMARY KEY | Attempt session ID |
| `user_id` | Foreign Key -> `users.id` | NOT NULL | Learner |
| `scenario_id` | Foreign Key -> `scenarios.id`| NOT NULL | Target scenario |
| `start_time` | TIMESTAMP | DEFAULT NOW() | Simulation start |
| `end_time` | TIMESTAMP | NULL | Simulation completion |
| `completed` | BOOLEAN | DEFAULT FALSE | Whether scenario was finished |

### `behaviour_events`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / Integer | PRIMARY KEY | Event ID |
| `attempt_id` | Foreign Key -> `scenario_attempts.id` | NOT NULL | Simulation attempt |
| `event_type` | VARCHAR(100) | NOT NULL | e.g. `looked_left_right`, `started_crossing` |
| `timestamp_offset`| FLOAT | NOT NULL | Seconds from simulation start |
| `is_safe` | BOOLEAN | NOT NULL | Safety validity |
| `payload` | JSONB / Text | NULL | Contextual telemetry (coordinates, speed) |

### `performance_scores`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / Integer | PRIMARY KEY | Score ID |
| `attempt_id` | Foreign Key -> `scenario_attempts.id` | UNIQUE, NOT NULL | Scored session |
| `overall_score` | FLOAT | NOT NULL | Weighted total (0 - 100) |
| `accuracy_score`| FLOAT | NOT NULL | Accuracy component |
| `safety_score` | FLOAT | NOT NULL | Safety component |
| `decision_score`| FLOAT | NOT NULL | Decision quality component |
| `reaction_score`| FLOAT | NOT NULL | Reaction speed component |
| `completion_score`| FLOAT | NOT NULL | Task completion component |
| `mistake_count` | INTEGER | NOT NULL | Number of safety infractions |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Timestamp |

### `difficulty_predictions`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / Integer | PRIMARY KEY | Prediction ID |
| `attempt_id` | Foreign Key -> `scenario_attempts.id` | NOT NULL | Preceding attempt |
| `user_id` | Foreign Key -> `users.id` | NOT NULL | Target learner |
| `previous_difficulty` | VARCHAR(50) | NOT NULL | Prior difficulty |
| `predicted_difficulty` | VARCHAR(50) | NOT NULL | Predicted next: Easy, Medium, Hard |
| `confidence` | FLOAT | NOT NULL | Model confidence |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Timestamp |
