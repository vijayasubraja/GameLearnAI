# Phase 2 — Core Application Redesign (Post-Auth Experience)

## Objective
Transform the post-authentication frontend from a placeholder dashboard shell into a professional, consistent core application that mirrors the production roadmap. This phase delivers the complete learner journey UI — personalized dashboard, skill map, mission/scenario library, scenario briefing, immersive 3D simulation with real-time behaviour telemetry, official results screen, learning-progress analytics, and a learner profile — while preserving the existing architecture and keeping the FastAPI backend as the single source of truth.

---

## Features Implemented

### Design System & App Shell
- **Unified design system:** reusable `ui/*` primitives (`Button`, `Card`, `Badge`, `StatCard`, `ProgressBar`, `EmptyState`, `ErrorState`, `Skeleton`, `PageHeader`, `Modal`, `Toast` host) built on the existing glassmorphic dark aesthetic with new `gl` design tokens and utility classes (`panel`, `label-hud`, `animate-pulse-soft`, `animate-slide-up`, `bg-gl-grid`, `bg-tech-grid`).
- **Application shell:** top-level `AppShell` with sidebar navigation (Dashboard, Skills, Scenarios, Progress, Profile), topbar with search, streak pill and user menu, and `Outlet` context carrying the dashboard payload.
- **Route guard:** `ProtectedRoute` now wraps the entire authenticated experience; public routes kept to Landing / Login / Register.

### Hub & Library Pages
- **DashboardPage:** stat cards (streak, completion rate, average), finance-style score sparkline over time, morale/current recommendation coach card, scenario carousel, and recent attempts, all driven by the dashboard payload.
- **SkillsPage:** complete skill map with canonical progress per domain, learner level separated from scenario difficulty, status badges, next-action CTA linking into filtered missions.
- **ScenariosPage:** mission library with skill-category / difficulty / status filters plus an "Only recommended" toggle; supports deep-link presets via `?skill=` query param.
- **ScenarioBriefingPage:** objective, context, learning goals, environmental factors, safety & decision framework, difficulty gyroscope, controls, and a `START SIMULATION` action that only proceeds after the backend confirms a simulation start and returns an attempt ID and environment configuration.

### Immersive Simulation Experience
- **Simulation session store** (`features/simulation/sessionStore.ts`): `useSyncExternalStore`-based store persisted to `sessionStorage`, tracking attempt, scenario, elapsed time, playback safety, telemetry log count, completion status, and an in-session transient notification stack.
- **RoadCrossingSimulator (R3F):** interactive crosswalk scene driven by `environment_config` — configurable lane count, traffic density, and pedestrian signal. WASD movement, L/R looking, E to press the crossing signal, near-miss and danger detection, and finish-on-arrival telemetry.
- **MissionPlazaSimulator (R3F):** generic objective plaza scene (approach the beacon, press E to complete) for non-road-safety skills.
- **SimulationHUD:** scenario/difficulty/objective header, elapsed timer, safety state badge, progress bar, pause / restart / exit controls, and movement/interaction hints.
- **SimulationNotifications:** transient toast stack fed by the session store.
- **SimulationPlayPage:** full-viewport immersive layout; boot flow that ensures a confirmed, not-yet-audited simulation start; pause / resume / restart / exit overlays; telemetry recording with type-level event contracts; a 3-strike danger limit that fails the attempt with an explanatory screen; and a submit flow that completes the attempt and routes to results.

### Results, Progress & Profile
- **ResultsPage:** official overall score ring, breakdown bars (accuracy, safety, decision quality, reaction time), successful actions, mistakes, and improvement tips, plus actions — Back to dashboard, Continue learning (next recommended scenario), and Try again (same scenario briefing).
- **ProgressPage:** totals (missions, average, streak, best), an inline SVG score-over-time chart, difficulty progression timeline, per-skill progress bars, and clickable recent attempts.
- **ProfilePage:** avatar/initials card, contact details, join date, sign out, and a live snapshot of skill levels and totals from the profile service (no hardcoded learner data).

### Service Layer & Pre-API Integration Strategy
- Scenario / simulation / performance / profile services with `withDevFallback`: while the matching backend endpoints are not yet implemented, the frontend gracefully degrades to *clearly-marked* development preview data only when `VITE_ENABLE_DEV_FALLBACK=true`.
- The dev fallback data is explicitly tagged (`DEV_FALLBACK` symbol, `isDevFallback`, `DevBanner`), so preview data is never confused with production results and the backend remains the source of truth.
- Auth (`401 Unauthorized`) and validation failures (`422`) are never masked by the fallback.
- `frontend/.env.example` documents `VITE_API_BASE_URL` and `VITE_ENABLE_DEV_FALLBACK`.

---

## Technical Implementation

### New Frontend Layers
- **`src/components/ui/*`** — design-system primitives (shared by every page).
- **`src/components/layout/*`** — AppShell, Sidebar, Topbar, AuthLayout.
- **`src/components/simulation/*`** — R3F simulators, HUD, notifications, sim event contracts.
- **`src/features/simulation/sessionStore.ts`** — session store (selector-subscribed via `useSyncExternalStore` + `sessionStorage` persistence).
- **`src/features/skills/skillCatalog.ts`** — canonical 7-skill metadata + ordering.
- **`src/services/*`** — scenario/simulation/performance/profile services with `withDevFallback`.
- **`src/services/fallback/*`** — marked dev preview payloads and `devResultFor` builder.
- **`src/pages/*`** — Dashboard, Skills, Scenarios, ScenarioBriefing, SimulationPlay, Results, Progress, Profile (all lazy-loaded in `App.tsx`; plain login/register retained).
- **`src/lib/`** — `format.ts` (date/duration/score tone helpers), `cn.ts`, `api.ts` (typed errors, `normalizeApiError`).
- **`src/hooks/useApi.ts`** — loading/error/refetch wrapper around async service calls.

### Bundling & Performance
- All pages are code-split via lazy `React.lazy` routes; the immersive simulation route (with its heavy 3D dependency) is isolated so it is only loaded on demand.
- `vite.config.ts` now uses `manualChunks` to split the Three.js / R3F / drei vendor bundle into a dedicated `three` chunk. Result: main bundle reduced from ~278 kB to ~134 kB (gzip), with the 3D runtime isolated in its own lazy chunk.

### API Integration (Auth Only — Verified)
- Backend currently implements authentication endpoints only (`/api/v1/auth/{register,login,me}`). All scenario / simulation / performance / progress payloads in this phase are served through the explicitly-marked dev preview layer until those endpoints ship.

---

## Files Created / Changed

### New Frontend Files
- `frontend/src/components/ui/{Button,Card,Badge,StatCard,ProgressBar,EmptyState,ErrorState,Skeleton,PageHeader,Modal,Toast}.tsx` (+ `index.ts`)
- `frontend/src/components/DevBanner.tsx`
- `frontend/src/components/layout/{AppShell,Sidebar,Topbar,AuthLayout}.tsx`
- `frontend/src/components/simulation/{simTypes,RoadCrossingSimulator,MissionPlazaSimulator,SimulationHUD,SimulationNotifications}.tsx`
- `frontend/src/features/simulation/sessionStore.ts`
- `frontend/src/features/skills/skillCatalog.ts`
- `frontend/src/services/{scenarioService,simulationService,performanceService,profileService}.ts`
- `frontend/src/services/utils.ts` (shared API + dev-fallback helpers)
- `frontend/src/services/fallback/devData.ts` (marked dev preview payloads + `devResultFor` builder)
- `frontend/src/types/domain.ts`
- `frontend/src/hooks/useApi.ts`
- `frontend/src/lib/{cn,format,api}.ts`
- `frontend/src/pages/{DashboardPage,SkillsPage,ScenariosPage,ScenarioBriefingPage,SimulationPlayPage,ResultsPage,ProgressPage,ProfilePage}.tsx`
- `frontend/.env.example` (documented, gitignored `.env` created locally for the preview)

### Modified Files
- `frontend/src/App.tsx` (lazy route registry for all new pages)
- `frontend/src/index.css` (gl tokens + utility classes)
- `frontend/tailwind.config.js` (design tokens)
- `frontend/vite.config.ts` (three vendor chunk)
- `frontend/src/context/AuthContext.tsx`, `frontend/src/components/ProtectedRoute.tsx`, `frontend/src/api/client.ts`

---

## APIs Integrated
| Endpoint | Status | Used By |
|---|---|---|
| `GET /api/v1/auth/me` | Implemented | Profile identity |
| `POST /api/v1/auth/register` / `login` | Implemented | Auth |
| Scenario list/detail, simulation start/event/complete, performance results/progress, profile dashboard/skills | **Not yet implemented** — dev preview with explicit `DEV_FALLBACK` markers | All post-auth pages |

---

## Tests Performed
1. **Frontend build (`tsc && vite build`):** 0 type errors; production bundle created (2195 modules). Main JS 134 kB gzip, dedicated lazy `three` chunk 265 kB gzip loaded only on the simulation route.
2. **Backend pytest suite:** 7/7 passed (auth endpoints), latest run 4.12s.

---

## Test Results
- **Frontend Build:** PASSED (0 errors, 11s).
- **Backend Tests:** 7/7 PASSED.

---

## Problems Encountered & Solutions Applied
1. **Seven pages referenced by `App.tsx` did not exist** — the empty-route build failed before this phase; all seven pages are now implemented and the build passes.
2. **`noUnusedLocals`/`noUnusedParameters` strictness** — unused icon imports and an unused `(state)` frame callback were flagged; cleaned up (removed `Copy` import from ResultsPage, dropped `state` in `useFrame`).
3. **Emitted event outside the `PLAZA_EVENT` contract** — a "press E" prompt event used a non-existent `IDLE` key; the contract now explicitly includes `OBJECT_PROMPT`.
4. **Unused session subscription in ResultsPage** — replaced with a one-shot `getSimulationSessionSnapshot()` read for the first-load shortcut.
5. **Three.js vendor chunk size** — isolated the 3D runtime into its own lazy-loaded chunk via `manualChunks` (`three`), keeping the main bundle small.

---

## Current System Flow (Authenticated)
```
User (Browser, authenticated)
   │
   ├── Dashboard ──► Recommendations ──► Scenarios (filtered ?skill=)
   ├── Skills ─────► Skill map ────────► Scenarios (filtered ?skill=)
   ├── Scenarios ──► Scenario Briefing ─► START SIMULATION   (backend start confirmed)
   │                                          │
   │                                          ▼
   │                                   R3F Simulator (RoadCrossing / MissionPlaza)
   │                                          │  real-time behaviour telemetry events
   │                                          ▼
   │                                   Submitting… (complete + result fetch)
   │                                          │
   ├── Results ◄──────────────────────────────┘
   │     ├── Try again (same briefing)
   │     ├── Continue learning (next recommended)
   │     └── Back to dashboard
   ├── Progress ──► scores over time / skills / difficulty progression / recent attempts
   └── Profile ───► account info + skill snapshot
```

---

## Phase Completion Status
**COMPLETED** — all post-auth hub pages, immersive simulation flow, telemetry contracts, session store, results/productivity views built; strict TypeScript build passes; backend suite still green.

---

## Next Steps
1. Implement the backend endpoints these UIs already consume (scenario list / detail, simulation start / event / complete, performance results / progress, dashboard / profile) and wire them to real persistence.
2. Phase 3 in roadmap — Skill Level ML (Random Forest) using the assessment + behaviour telemetry now being captured by these pages.
3. Fill the Road Crossing environment with additional procedural detail and add more scenario simulations beyond the generic plaza.