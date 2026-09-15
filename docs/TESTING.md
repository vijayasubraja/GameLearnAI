# GameLearn AI — Quality Assurance & Testing Strategy

## 1. Testing Philosophy
Every phase must pass automated unit tests, API integration tests, and manual verification before being declared complete. Code without active validation is considered incomplete.

---

## 2. Test Matrix

| Layer | Framework / Tool | Test Focus | Target Coverage |
|---|---|---|---|
| **Backend Unit & API** | Pytest + HTTPX | Password hashing, JWT token lifecycle, API endpoints, error handling | > 85% |
| **Machine Learning** | Pytest + scikit-learn | Data preprocessing, feature shape verification, inference stability, metric thresholds | 100% test pass rate |
| **Database** | SQLAlchemy / SQLite | Migrations, foreign key integrity, cascade deletions, query correctness | Critical path |
| **Frontend UI & State** | TypeScript compiler + Vite build | Type integrity, routing guards, AuthContext state transitions | Zero type errors |
| **End-to-End** | Manual + Browser Subagent | Full user journey: Register $\rightarrow$ Login $\rightarrow$ Assess $\rightarrow$ Simulate $\rightarrow$ Score $\rightarrow$ Next | Flawless UX |

---

## 3. Automated Test Execution Commands
- **Backend Tests:**
  ```bash
  pytest backend/tests/ -v
  ```
- **Frontend Type & Build Verification:**
  ```bash
  npm --prefix frontend run build
  ```
