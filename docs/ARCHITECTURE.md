# GameLearn AI — System Architecture

## 1. High-Level Vision
GameLearn AI is an adaptive learning system that teaches practical real-life skills through lightweight browser-based 3D simulations. Unlike static quiz applications or traditional e-learning platforms, GameLearn observes learner behaviour in real-time within interactive 3D scenarios, predicts skill and difficulty levels using machine learning, and continuously adapts subsequent learning challenges.

## 2. Core Adaptive Feedback Loop

```
                     ┌──────────────────────────────┐
                     │       Learner Profile        │
                     │  (Skill History & Progress)  │
                     └──────────────▲───────────────┘
                                    │
                                    │ Updates Profile
                                    │
┌──────────────────┐        ┌───────┴──────────────┐        ┌──────────────────┐
│ Initial Learner  │───────►│ Skill Level ML Model │───────►│ Rule-Based       │
│ Assessment       │        │  (Random Forest)     │        │ Scenario         │
└──────────────────┘        └──────────────────────┘        │ Selector         │
                                                            └─────────┬────────┘
                                                                      │ Selects Scenario
                                                                      ▼
┌──────────────────┐        ┌──────────────────────┐        ┌──────────────────┐
│  Next Scenario   │◄───────┤ Difficulty ML Model  │◄───────┤ Lightweight 3D   │
│  Simulation      │        │  (Random Forest)     │        │ Simulation (R3F) │
└────────┬─────────┘        └──────────▲───────────┘        └─────────┬────────┘
         │                             │                              │
         │                             │ Performance Score            │ Behaviour Events
         │                             │                              │
         └─────────────────────────────┴──────────────────────────────┘
```

## 3. Core Architectural Rule: Separation of Concepts

| Concept | Represents | Possible Values | Determinant |
|---|---|---|---|
| **Skill Level** | Learner's capability in a domain | Beginner, Intermediate, Advanced | Initial Assessment & Historical Performance |
| **Difficulty Level** | Challenge level of the simulation | Easy, Medium, Hard | Predicted by Difficulty ML based on simulation behaviour |

### Initial Mapping (First Simulation)
Since no previous simulation behaviour exists on the first run:
- **Beginner** $\rightarrow$ Initial **Easy**
- **Intermediate** $\rightarrow$ Initial **Medium**
- **Advanced** $\rightarrow$ Initial **Hard**

After the first simulation, actual recorded behaviour and scored performance drive the Difficulty ML model.

## 4. Subsystem Breakdown

### 4.1. Web Application (Frontend)
- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Glassmorphic dark aesthetic, Lucide React icons
- **State & Routing:** React Router v6, Context API for Auth and Simulation state
- **3D Canvas:** React Three Fiber (R3F), Three.js, `@react-three/drei`

### 4.2. API & Backend Services (FastAPI)
- **Authentication Service:** JWT bearer token authentication, bcrypt password hashing
- **Assessment Service:** 25–35 scenario-based questions across 7 real-world domains
- **Adaptive Intelligence Engine:**
  - **Skill ML Engine:** Random Forest Classifier (Per-skill classification)
  - **Scenario Selector:** Rule-based matcher considering skill, difficulty, weak areas, and completion history
  - **Difficulty ML Engine:** Random Forest Classifier driven by behaviour & performance features
- **Simulation & Behaviour Engine:** Event streaming endpoint capturing real-time simulation interactions
- **Performance Scoring Engine:** Multi-factor weighted evaluator (Accuracy, Safety, Decision Quality, Reaction Time, Mistakes, Completion)

### 4.3. Persistence Layer (PostgreSQL)
- Relational schema tracking users, learner profiles, skill predictions, scenarios, simulation sessions, raw behaviour events, performance scores, and difficulty progressions.
