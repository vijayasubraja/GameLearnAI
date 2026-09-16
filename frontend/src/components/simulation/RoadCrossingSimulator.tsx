import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Scenario } from '../../types/domain';
import { ROAD_EVENT, type SimulatorSceneProps } from './simTypes';

interface VehicleState {
  mesh: THREE.Mesh;
  x: number;
  z: number;
  speed: number;
  dir: 1 | -1;
  hazarded: boolean;
}

const LANE_GAP = 1.7;
const SPAWN_X = 34;
const BOUND_X = 34;
const BOUND_Z_NEAR = -9;
const BOUND_Z_FAR = 9;
const LOOK_SCAN_SECONDS = 1.2;

const NIGHT_BUILDING_COLORS = ['#2b3445', '#232b3a', '#313b4e', '#202736', '#2f3a4d'];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface CrossingConfig {
  roadHalf: number;
  laneCount: number;
  laneZs: number[];
  dense: boolean;
  hasSignal: boolean;
}

function resolveConfig(scenario: Scenario): CrossingConfig {
  const env = (scenario.environment_config ?? {}) as Record<string, unknown>;
  const laneCount = Math.max(2, typeof env.lanes === 'number' ? env.lanes : 2);
  const dense = String(env.traffic_density ?? 'low') !== 'low';
  const hasSignal = env.has_signal !== false;
  const laneZs = Array.from({ length: laneCount }, (_, i) => (i + 0.5 - laneCount / 2) * LANE_GAP);
  const roadHalf = (laneCount / 2) * LANE_GAP + 0.45;
  return { roadHalf, laneCount, laneZs, dense, hasSignal };
}

function useKeyboardBindings(
  keys: React.MutableRefObject<{ forward: boolean; back: boolean; left: boolean; right: boolean }>,
  onLook: (side: 'left' | 'right') => void,
  onInteract: () => void,
  pausedRef: React.MutableRefObject<boolean>
) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          keys.current.forward = true;
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          keys.current.back = true;
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          keys.current.left = true;
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          keys.current.right = true;
          break;
        case 'l':
          onLook('left');
          break;
        case 'r':
          onLook('right');
          break;
        case 'e':
          onInteract();
          break;
      }
    };
    const up = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keys.current.forward = false;
          break;
        case 's':
        case 'arrowdown':
          keys.current.back = false;
          break;
        case 'a':
        case 'arrowleft':
          keys.current.left = false;
          break;
        case 'd':
        case 'arrowright':
          keys.current.right = false;
          break;
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [keys, onLook, onInteract, pausedRef]);
}

function Building({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

function Cityscape({ zSide }: { zSide: -1 | 1 }) {
  const buildings = useMemo(() => {
    const list: { position: [number, number, number]; size: [number, number, number]; color: string }[] = [];
    let x = -30;
    while (x < 30) {
      list.push({
        position: [x + rand(-1, 1), 2 + rand(0, 3), zSide * (8 + rand(0, 3))],
        size: [rand(4, 7), rand(3.5, 6.5), rand(4, 6)],
        color: NIGHT_BUILDING_COLORS[Math.floor(Math.random() * NIGHT_BUILDING_COLORS.length)],
      });
      x += 8 + rand(0, 4);
    }
    return list;
  }, [zSide]);

  return (
    <group>
      {buildings.map((b, i) => (
        <Building key={i} position={b.position} size={b.size} color={b.color} />
      ))}
    </group>
  );
}

function Streetlight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 4.4, 6]} />
        <meshStandardMaterial color="#3a4456" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.35, 4.3, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.12]} />
        <meshStandardMaterial color="#2c3646" />
      </mesh>
      <mesh position={[-0.35, 4.1, 0]}>
        <boxGeometry args={[0.16, 0.1, 0.5]} />
        <meshStandardMaterial color="#ffe9a8" emissive="#b9912b" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function SceneInner({ scenario, paused, onTelemetry, onSafety, onReachedGoal }: SimulatorSceneProps) {
  const keys = useRef({ forward: false, back: false, left: false, right: false });
  const player = useRef<THREE.Group>(null);
  const vehicles = useRef<VehicleState[]>([]);
  const crossedRef = useRef(false);
  const finishedRef = useRef(false);
  const signalRef = useRef({ walk: false, walkUntil: 0 });
  const lookLockRef = useRef(false);
  const lastDangerAt = useRef(0);
  const prevSafety = useRef<'ok' | 'warning' | 'danger'>('ok');
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const cfg = useMemo(() => resolveConfig(scenario), [scenario]);

  const ensureVehicles = (scene: THREE.Scene) => {
    if (vehicles.current.length > 0) return;
    const count = cfg.dense ? cfg.laneCount * 3 : cfg.laneCount * 2;
    for (let i = 0; i < count; i++) {
      const laneIdx = i % cfg.laneCount;
      const z = cfg.laneZs[laneIdx];
      const dir: 1 | -1 = laneIdx % 2 === 0 ? 1 : -1;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.8, 1.15),
        new THREE.MeshStandardMaterial({
          color: dir === 1 ? '#33506e' : '#5d4a33',
          roughness: 0.6,
          metalness: 0.2,
        })
      );
      mesh.rotation.y = dir === 1 ? -Math.PI / 2 : Math.PI / 2;
      const progress = i / count;
      const x = dir === 1 ? -SPAWN_X + progress * SPAWN_X * 2 : SPAWN_X - progress * SPAWN_X * 2;
      mesh.position.set(x, 0.4, z);
      scene.add(mesh);
      vehicles.current.push({
        mesh,
        x,
        z,
        speed: rand(5, cfg.dense ? 9 : 7) * dir,
        dir,
        hazarded: false,
      });
    }
  };

  const body = useThree((s) => s.camera);

  const lookScan = (side: 'left' | 'right') => {
    if (lookLockRef.current) return;
    lookLockRef.current = true;
    onTelemetry({ event_type: ROAD_EVENT.LOOK_ACTION, is_safe: true, payload: { side } });
    window.setTimeout(() => {
      lookLockRef.current = false;
    }, LOOK_SCAN_SECONDS * 1000);
  };

  const tryPressSignal = () => {
    if (!cfg.hasSignal) return;
    if (!player.current) return;
    const p = player.current.position;
    if (Math.abs(p.x - 3.4) > 3 || Math.abs(p.z - (-cfg.roadHalf - 2.2)) > 3) return;
    signalRef.current.walk = true;
    signalRef.current.walkUntil = Date.now() / 1000 + 6;
    onTelemetry({ event_type: ROAD_EVENT.SIGNAL_INTERACTION, is_safe: true });
  };

  useKeyboardBindings(keys, lookScan, tryPressSignal, pausedRef);

  const updateSafety = (level: 'ok' | 'warning' | 'danger') => {
    if (level !== prevSafety.current) {
      prevSafety.current = level;
      onSafety(level);
    }
  };

  useFrame((state, delta) => {
    const scene = state.scene;
    ensureVehicles(scene);
    const now = state.clock.getElapsedTime();

    // Pedestrian signal state
    if (cfg.hasSignal) {
      if (now > signalRef.current.walkUntil) signalRef.current.walk = false;
    }

    // ---- player movement ----
    if (player.current) {
      const speed = 5.4;
      let dx = 0;
      let dz = 0;
      if (!paused) {
        if (keys.current.forward) dz -= 1;
        if (keys.current.back) dz += 1;
        if (keys.current.left) dx -= 1;
        if (keys.current.right) dx += 1;
      }
      const len = Math.hypot(dx, dz);
      if (len > 0) {
        player.current.position.x += (dx / len) * speed * delta;
        player.current.position.z += (dz / len) * speed * delta;
      }
      const p = player.current.position;
      p.x = THREE.MathUtils.clamp(p.x, -BOUND_X, BOUND_X);
      p.z = THREE.MathUtils.clamp(p.z, BOUND_Z_NEAR, BOUND_Z_FAR);

      // -- road entry detection --
      const inRoad = Math.abs(p.z) < cfg.roadHalf;
      if (!crossedRef.current && inRoad && !finishedRef.current) {
        crossedRef.current = true;
        const vehicleThreat =
          now > signalRef.current.walkUntil &&
          vehicles.current.some(
            (v) => Math.abs(v.x - p.x) < 5 && Math.abs(v.z - p.z) < 2.4 && !v.hazarded
          );
        const signalGreen = !cfg.hasSignal || now <= signalRef.current.walkUntil;
        const safe = signalGreen && !vehicleThreat;
        onTelemetry({
          event_type: ROAD_EVENT.ROAD_ENTRY,
          is_safe: safe,
          payload: { signal_green: signalGreen, vehicle_threat: vehicleThreat },
        });
        if (!safe) {
          lastDangerAt.current = now;
          updateSafety('danger');
        }
      }

      // -- finish detection --
      if (!finishedRef.current && p.z > cfg.roadHalf + 1.6 && Math.abs(p.x) < 3.5) {
        finishedRef.current = true;
        onTelemetry({ event_type: ROAD_EVENT.OBJECTIVE_REACHED, is_safe: true });
        onTelemetry({ event_type: ROAD_EVENT.FINISH, is_safe: true });
        onReachedGoal();
      }

      // -- safety from vehicles --
      if (!finishedRef.current) {
        let danger = false;
        for (const v of vehicles.current) {
          if (Math.abs(p.z - v.z) > 1.3) continue;
          const gap = Math.abs(v.x - p.x);
          if (gap < 5 && !v.hazarded && Math.abs(p.z) < cfg.roadHalf) {
            v.hazarded = true;
            danger = true;
            if (now - lastDangerAt.current > 1.2) {
              lastDangerAt.current = now;
              onTelemetry({
                event_type: ROAD_EVENT.DANGER_PROXIMITY,
                is_safe: false,
                payload: { gap: Math.round(gap * 10) / 10, lane_z: Math.round(v.z * 10) / 10 },
              });
              updateSafety('danger');
            }
          } else if (gap > 8) {
            v.hazarded = false;
          }
        }
        if (!danger) {
          updateSafety(Math.abs(p.z) < cfg.roadHalf ? 'warning' : 'ok');
        }
      }
    }

    // ---- vehicles ----
    for (const v of vehicles.current) {
      v.x += v.speed * delta;
      if (v.dir === 1 && v.x > SPAWN_X) v.x = -SPAWN_X;
      if (v.dir === -1 && v.x < -SPAWN_X) v.x = SPAWN_X;
      v.mesh.position.x = v.x;
    }

    // ---- camera follow ----
    if (player.current) {
      const p = player.current.position;
      body.position.set(p.x + 2.5, 6.4, p.z + 7.6);
      body.lookAt(p.x, 0.8, p.z + 1);
    }
  });

  const roadHalf = cfg.roadHalf;

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 30]} />
        <meshStandardMaterial color="#101722" roughness={0.95} />
      </mesh>
      <gridHelper args={[80, 40, '#223043', '#16202e']} position={[0, 0.01, 0]} />

      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[80, roadHalf * 2]} />
        <meshStandardMaterial color="#1b2432" roughness={0.9} />
      </mesh>

      {/* Lane markings */}
      {cfg.laneCount > 1 &&
        Array.from({ length: cfg.laneCount - 1 }, (_, i) => {
          const z = (i + 1 - cfg.laneCount / 2) * LANE_GAP;
          return (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, z]}>
              <planeGeometry args={[78, 0.08]} />
              <meshStandardMaterial color="#5b6572" emissive="#5b6572" emissiveIntensity={0.25} transparent opacity={0.7} />
            </mesh>
          );
        })}

      {/* Zebra crossing */}
      <group position={[0, 0.04, 0]}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-2 + i * 0.5, 0, (i % 2 === 0 ? 0.25 : -0.25) * roadHalf * 0.5]}>
            <planeGeometry args={[0.24, roadHalf * 1.9]} />
            <meshStandardMaterial color="#7d8896" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -roadHalf - 1.5]}>
        <planeGeometry args={[80, 3]} />
        <meshStandardMaterial color="#212a38" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, roadHalf + 1.5]}>
        <planeGeometry args={[80, 3]} />
        <meshStandardMaterial color="#212a38" roughness={0.95} />
      </mesh>

      {/* Cityscape */}
      <Cityscape zSide={-1} />
      <Cityscape zSide={1} />

      {/* Street lights */}
      <Streetlight position={[8, 0, -roadHalf - 0.6]} />
      <Streetlight position={[-8, 0, -roadHalf - 0.6]} />
      <Streetlight position={[12, 0, roadHalf + 0.6]} />
      <Streetlight position={[-12, 0, roadHalf + 0.6]} />

      {/* Pedestrian signal */}
      {cfg.hasSignal && (
        <PedestrianSignal stateRef={signalRef} position={[3.4, 0, -roadHalf - 2.2]} />
      )}

      {/* Goal beacon */}
      <group position={[0, 0, roadHalf + 3]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 3.4, 6]} />
          <meshStandardMaterial color="#12351f" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={1.4} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[1.4, 1.9, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.28} />
        </mesh>
      </group>

      {/* Player avatar */}
      <group ref={player} position={[0, 0, -roadHalf - 2.6]}>
        <mesh position={[0, 0.45, 0]}>
          <capsuleGeometry args={[0.28, 0.5, 4, 10]} />
          <meshStandardMaterial color="#3D7BFF" roughness={0.4} metalness={0.25} />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.23, 12, 12]} />
          <meshStandardMaterial color="#233047" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.7, 24]} />
          <meshBasicMaterial color="#3D7BFF" transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
}

function PedestrianSignal({
  stateRef,
  position,
}: {
  stateRef: React.MutableRefObject<{ walk: boolean; walkUntil: number }>;
  position: [number, number, number];
}) {
  const lightRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mat = lightRef.current?.material as THREE.MeshBasicMaterial | undefined;
    if (mat) mat.color.set(stateRef.current.walk ? '#22c55e' : '#ef4444');
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 3.2, 6]} />
        <meshStandardMaterial color="#39434f" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[0.28, 0.5, 0.1]} />
        <meshStandardMaterial color="#1c232e" />
      </mesh>
      <mesh ref={lightRef} position={[0, 2.7, 0.08]}>
        <boxGeometry args={[0.14, 0.14, 0.02]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

export const RoadCrossingSimulator: React.FC<SimulatorSceneProps> = (props) => {
  return (
    <Canvas
      camera={{ position: [2.5, 6.4, 5], fov: 47 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.75]}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight color="#8fa8cc" groundColor="#0e131c" intensity={0.5} />
      <directionalLight position={[22, 34, 12]} intensity={1.1} color="#cfe0ff" />
      <pointLight position={[0, 8, -4]} intensity={0.4} color="#3D7BFF" />
      <SceneInner key={props.resetKey} {...props} />
    </Canvas>
  );
};

export type { CrossingConfig };