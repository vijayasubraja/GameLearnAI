# GameLearn AI — 3D Simulation Architecture

## 1. 3D Design Philosophy
- **Lightweight & Accessible:** Designed to run smoothly at 60 FPS on modest hardware (integrated Intel/AMD GPUs) directly inside modern web browsers without plugins.
- **Technology:** WebGL powered by **Three.js** and **React Three Fiber (R3F)** with helper utilities from `@react-three/drei`.
- **Styling & Aesthetics:** Low-poly aesthetic, vibrant lighting with optimized shadow maps, clean color palettes, and interactive HUD overlays.

---

## 2. Flagship Simulation: Road Safety & Pedestrian Crossing

### Scene Components:
1. **Urban Environment:**
   - 2-lane road with crosswalk markings (zebra crossing).
   - Sidewalks with curbs and boundary colliders.
   - Low-poly roadside buildings, street lamps, and trees.
2. **Interactive Traffic System:**
   - Animated vehicle traffic with realistic speeds and randomized approach gaps.
   - Dynamic traffic light system (Red / Amber / Green) with pedestrian signal buttons.
3. **Player Avatar & Controls:**
   - First-person / Third-person hybrid camera.
   - Movement controls: Keyboard (`W, A, S, D` / Arrow keys) and on-screen virtual directional pad for touch.
   - Interactive camera view ("Look Left", "Look Right") to assess crossing awareness.
4. **Interactive Checkpoints & Event Triggers:**
   - Curb approach zone.
   - Crossing signal activation button.
   - Crosswalk boundary triggers detecting safe vs. hazardous road entry.
   - Success arrival zone.

---

## 3. Real-Time Telemetry Generation
During the simulation, the client-side engine dispatches high-resolution telemetry packets:
- `SIMULATION_START`: Session initialized with scenario difficulty parameters.
- `LOOK_ACTION`: Learner checked left/right before stepping off curb.
- `TRAFFIC_SIGNAL_INTERACTION`: Learner engaged pedestrian crossing signal.
- `ROAD_ENTRY`: Learner stepped onto crosswalk (evaluates vehicle proximity & signal state).
- `DANGER_PROXIMITY_EVENT`: Triggered if vehicle passes within safety threshold.
- `SIMULATION_FINISH`: Learner reached safe sidewalk destination.
