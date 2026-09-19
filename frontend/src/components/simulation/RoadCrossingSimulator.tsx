import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Scenario } from '../../types/domain';
import { ROAD_EVENT, type SimulatorSceneProps } from './simTypes';

interface VehicleData {
  group: THREE.Group;
  type: 'sedan' | 'suv' | 'sports' | 'bus';
  color: string;
  x: number;
  z: number;
  speed: number;
  dir: 1 | -1;
  hazarded: boolean;
  length: number;
  width: number;
}

const LANE_GAP = 1.8;
const SPAWN_X = 36;
const BOUND_X = 35;
const BOUND_Z_NEAR = -10;
const BOUND_Z_FAR = 10;
const LOOK_SCAN_SECONDS = 1.2;

const VEHICLE_COLORS = [
  '#ef4444', // Crimson Red
  '#3b82f6', // Electric Blue
  '#eab308', // Amber Yellow
  '#10b981', // Emerald Green
  '#f97316', // Bright Orange
  '#8b5cf6', // Vivid Purple
  '#ec4899', // Hot Pink
  '#f43f5e', // Rose
  '#06b6d4', // Cyan
  '#64748b', // Slate Silver
];

const BUILDING_COLORS = [
  { facade: '#38bdf8', trim: '#0284c7', window: '#bae6fd' }, // Cyan skyscraper
  { facade: '#fb7185', trim: '#e11d48', window: '#ffe4e6' }, // Coral shop
  { facade: '#4ade80', trim: '#16a34a', window: '#dcfce7' }, // Mint hub
  { facade: '#fbbf24', trim: '#d97706', window: '#fef3c7' }, // Golden tower
  { facade: '#a78bfa', trim: '#7c3aed', window: '#ede9fe' }, // Purple complex
  { facade: '#94a3b8', trim: '#475569', window: '#e2e8f0' }, // Modern glass
];

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
  const roadHalf = (laneCount / 2) * LANE_GAP + 0.5;
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

// ==========================================
// 3D COMPONENT BUILDERS (Cars, Buses, Humans, Signals)
// ==========================================

/** Detailed Humanoid Pedestrian Mesh */
function HumanoidModel({
  shirtColor = '#3b82f6',
  pantsColor = '#1e293b',
  skinColor = '#f5d0c5',
  hairColor = '#331800',
  isWalking = false,
  lookAngle = 0,
  scale = 1,
}: {
  shirtColor?: string;
  pantsColor?: string;
  skinColor?: string;
  hairColor?: string;
  isWalking?: boolean;
  lookAngle?: number;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 10;
    // Walking leg/arm swing animation
    if (isWalking) {
      if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t) * 0.6;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(t) * 0.6;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.sin(t) * 0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t) * 0.5;
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
    }
    // Head look-scan rotation
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        headGroupRef.current.rotation.y,
        lookAngle,
        0.15
      );
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      {/* Torso / Shirt */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.38, 0.55, 0.22]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>

      {/* Head & Hair */}
      <group ref={headGroupRef} position={[0, 1.18, 0]}>
        {/* Face */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </mesh>
        {/* Hair cap */}
        <mesh position={[0, 0.05, -0.02]}>
          <sphereGeometry args={[0.17, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={hairColor} roughness={0.9} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.05, 0.02, 0.14]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.05, 0.02, 0.14]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Left Leg */}
      <mesh ref={leftLegRef} position={[-0.1, 0.25, 0]}>
        <boxGeometry args={[0.14, 0.5, 0.16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>

      {/* Right Leg */}
      <mesh ref={rightLegRef} position={[0.1, 0.25, 0]}>
        <boxGeometry args={[0.14, 0.5, 0.16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.7} />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.24, 0.7, 0]}>
        <boxGeometry args={[0.1, 0.45, 0.12]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.24, 0.7, 0]}>
        <boxGeometry args={[0.1, 0.45, 0.12]} />
        <meshStandardMaterial color={shirtColor} roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Construct Detailed 3D Vehicle Group (Car, SUV, Sports, Bus) */
function createVehicleMesh(type: 'sedan' | 'suv' | 'sports' | 'bus', bodyColor: string): THREE.Group {
  const group = new THREE.Group();

  if (type === 'bus') {
    // ---- CITY PUBLIC TRANSIT BUS ----
    // Main body
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.2 });
    const trimMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.8 });
    const glassMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', transparent: true, opacity: 0.75, roughness: 0.1 });
    const lightMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });
    const redLightMat = new THREE.MeshBasicMaterial({ color: '#ef4444' });

    // Main Box Chassis
    const busBody = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.7, 1.6), bodyMat);
    busBody.position.set(0, 1.0, 0);
    group.add(busBody);

    // Dark Lower Bumper / Trim
    const busBumper = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.3, 1.65), trimMat);
    busBumper.position.set(0, 0.25, 0);
    group.add(busBumper);

    // Front Windshield
    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 1.45), glassMat);
    frontWindshield.position.set(2.26, 1.25, 0);
    group.add(frontWindshield);

    // Side Windows (Left & Right)
    const sideWindowL = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.65, 0.05), glassMat);
    sideWindowL.position.set(0.2, 1.3, 0.81);
    group.add(sideWindowL);

    const sideWindowR = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.65, 0.05), glassMat);
    sideWindowR.position.set(0.2, 1.3, -0.81);
    group.add(sideWindowR);

    // Destination Sign ("BUS 42")
    const destSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.25, 0.9),
      new THREE.MeshStandardMaterial({ color: '#0f172a', emissive: '#f59e0b', emissiveIntensity: 0.8 })
    );
    destSign.position.set(2.26, 1.75, 0);
    group.add(destSign);

    // Headlights
    const headL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.25), lightMat);
    headL.position.set(2.31, 0.45, 0.55);
    const headR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.25), lightMat);
    headR.position.set(2.31, 0.45, -0.55);
    group.add(headL, headR);

    // Taillights
    const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.25), redLightMat);
    tailL.position.set(-2.31, 0.5, 0.55);
    const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.25), redLightMat);
    tailR.position.set(-2.31, 0.5, -0.55);
    group.add(tailL, tailR);

    // 6 Bus Wheels
    const wheelPositions: [number, number, number][] = [
      [1.5, 0.25, 0.75], [1.5, 0.25, -0.75],
      [-1.2, 0.25, 0.75], [-1.2, 0.25, -0.75],
      [-1.8, 0.25, 0.75], [-1.8, 0.25, -0.75],
    ];
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.8, roughness: 0.2 });
    wheelPositions.forEach(([wx, wy, wz]) => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12), wheelMat);
      tire.rotation.x = Math.PI / 2;
      tire.position.set(wx, wy, wz);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.21, 8), rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(wx, wy, wz);
      group.add(tire, rim);
    });
  } else {
    // ---- SEDAN / SUV / SPORTS CARS ----
    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.4 });
    const roofMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.2 });
    const glassMat = new THREE.MeshStandardMaterial({ color: '#bae6fd', transparent: true, opacity: 0.8, roughness: 0.1 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.9, roughness: 0.1 });
    const headMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const tailMat = new THREE.MeshBasicMaterial({ color: '#ef4444' });

    const isSuv = type === 'suv';
    const isSports = type === 'sports';

    const length = isSuv ? 2.6 : isSports ? 2.5 : 2.3;
    const width = isSuv ? 1.3 : isSports ? 1.25 : 1.15;
    const height = isSuv ? 0.7 : isSports ? 0.45 : 0.55;
    const cabinH = isSuv ? 0.65 : isSports ? 0.4 : 0.5;

    // Lower Car Body
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(length, height, width), bodyMat);
    carBody.position.set(0, height / 2 + 0.2, 0);
    group.add(carBody);

    // Cabin Roof & Windshield
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(length * 0.55, cabinH, width * 0.9), isSports ? bodyMat : roofMat);
    cabin.position.set(-0.1, height + cabinH / 2 + 0.15, 0);
    group.add(cabin);

    // Windshield (Front & Rear)
    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(0.08, cabinH * 0.8, width * 0.82), glassMat);
    frontWindshield.position.set(length * 0.18, height + cabinH / 2 + 0.15, 0);
    frontWindshield.rotation.z = -0.25;
    group.add(frontWindshield);

    // Headlights
    const headL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.22), headMat);
    headL.position.set(length / 2 + 0.01, height / 2 + 0.25, width * 0.32);
    const headR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.22), headMat);
    headR.position.set(length / 2 + 0.01, height / 2 + 0.25, -width * 0.32);
    group.add(headL, headR);

    // Taillights
    const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.22), tailMat);
    tailL.position.set(-length / 2 - 0.01, height / 2 + 0.25, width * 0.32);
    const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.22), tailMat);
    tailR.position.set(-length / 2 - 0.01, height / 2 + 0.25, -width * 0.32);
    group.add(tailL, tailR);

    // 4 Wheels with Rims
    const wheelRadius = isSuv ? 0.26 : 0.21;
    const wheelPositions: [number, number, number][] = [
      [length * 0.28, wheelRadius, width * 0.52],
      [length * 0.28, wheelRadius, -width * 0.52],
      [-length * 0.28, wheelRadius, width * 0.52],
      [-length * 0.28, wheelRadius, -width * 0.52],
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.16, 12), wheelMat);
      tire.rotation.x = Math.PI / 2;
      tire.position.set(wx, wy, wz);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius * 0.55, wheelRadius * 0.55, 0.17, 8), rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(wx, wy, wz);
      group.add(tire, rim);
    });
  }

  return group;
}

/** Colorful Storefront & City Building */
function VibrantBuilding({
  position,
  size,
  theme,
  label,
}: {
  position: [number, number, number];
  size: [number, number, number];
  theme: { facade: string; trim: string; window: string };
  label?: string;
}) {
  return (
    <group position={position}>
      {/* Main Structure */}
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={theme.facade} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Roof Trim */}
      <mesh position={[0, size[1] + 0.15, 0]}>
        <boxGeometry args={[size[0] + 0.2, 0.3, size[2] + 0.2]} />
        <meshStandardMaterial color={theme.trim} roughness={0.5} />
      </mesh>

      {/* Windows Grid */}
      <mesh position={[0, size[1] * 0.6, size[2] / 2 + 0.05]}>
        <boxGeometry args={[size[0] * 0.8, size[1] * 0.5, 0.05]} />
        <meshStandardMaterial color={theme.window} emissive={theme.window} emissiveIntensity={0.3} />
      </mesh>

      {/* Storefront Sign Board */}
      {label && (
        <group position={[0, 2.2, size[2] / 2 + 0.12]}>
          <mesh>
            <boxGeometry args={[size[0] * 0.75, 0.7, 0.1]} />
            <meshStandardMaterial color={theme.trim} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[size[0] * 0.65, 0.45, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      )}
    </group>
  );
}

/** Cityscape Row */
function Cityscape({ zSide }: { zSide: -1 | 1 }) {
  const buildings = useMemo(() => {
    const labels = ['CAFE', 'SUPERMARKET', 'PHARMACY', 'METRO BANK', 'CITY HUB', 'TECH SHOP'];
    const list: { position: [number, number, number]; size: [number, number, number]; theme: typeof BUILDING_COLORS[0]; label?: string }[] = [];
    let x = -32;
    let idx = 0;
    while (x < 32) {
      const theme = BUILDING_COLORS[idx % BUILDING_COLORS.length];
      const w = rand(5, 7.5);
      const h = rand(6, 11);
      const d = rand(5, 7);
      list.push({
        position: [x + w / 2, 0, zSide * (8.5 + d / 2)],
        size: [w, h, d],
        theme,
        label: labels[idx % labels.length],
      });
      x += w + rand(1.5, 3.5);
      idx++;
    }
    return list;
  }, [zSide]);

  return (
    <group>
      {buildings.map((b, i) => (
        <VibrantBuilding key={i} position={b.position} size={b.size} theme={b.theme} label={b.label} />
      ))}
    </group>
  );
}

/** Low-Poly Urban Tree */
function StreetTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1.6, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Foliage Layers */}
      <mesh position={[0, 2.0, 0]}>
        <coneGeometry args={[0.9, 1.4, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.7, 0]}>
        <coneGeometry args={[0.7, 1.2, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Bus Stop Shelter */
function BusStopShelter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Glass Back Wall */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[3.2, 2.2, 0.08]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Steel Roof */}
      <mesh position={[0, 2.35, 0.4]}>
        <boxGeometry args={[3.4, 0.12, 1.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      {/* Wooden Bench */}
      <mesh position={[0, 0.45, 0.3]}>
        <boxGeometry args={[2.4, 0.1, 0.45]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      {/* Bus Stop Pole & Sign */}
      <mesh position={[-1.8, 1.5, 0.8]}>
        <cylinderGeometry args={[0.05, 0.05, 3.0, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} />
      </mesh>
      <mesh position={[-1.8, 2.7, 0.8]}>
        <boxGeometry args={[0.6, 0.6, 0.08]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

/** Streetlight with Warm Light Cone */
function Streetlight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Metallic Pole */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 4.8, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Lamp Arm */}
      <mesh position={[-0.4, 4.7, 0]}>
        <boxGeometry args={[0.9, 0.1, 0.14]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Glowing Bulb */}
      <mesh position={[-0.75, 4.55, 0]}>
        <boxGeometry args={[0.22, 0.12, 0.3]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
    </group>
  );
}

/** Traffic Light Post (Vehicles) & Pedestrian Signal */
function PedestrianSignal({
  stateRef,
  position,
}: {
  stateRef: React.MutableRefObject<{ walk: boolean; walkUntil: number }>;
  position: [number, number, number];
}) {
  const pedLightRef = useRef<THREE.Mesh>(null);
  const vehGreenRef = useRef<THREE.Mesh>(null);
  const vehRedRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const isWalk = stateRef.current.walk;
    // Pedestrian Light
    if (pedLightRef.current) {
      const mat = pedLightRef.current.material as THREE.MeshBasicMaterial;
      mat.color.set(isWalk ? '#22c55e' : '#ef4444');
    }
    // Vehicle Traffic Signal (Red when walk green, Green when walk red)
    if (vehRedRef.current) {
      const mat = vehRedRef.current.material as THREE.MeshBasicMaterial;
      mat.color.set(isWalk ? '#ef4444' : '#1e293b');
    }
    if (vehGreenRef.current) {
      const mat = vehGreenRef.current.material as THREE.MeshBasicMaterial;
      mat.color.set(isWalk ? '#1e293b' : '#22c55e');
    }
  });

  return (
    <group position={position}>
      {/* Main Signal Post */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 3.6, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Vehicle 3-Light Traffic Signal Box */}
      <group position={[0, 3.2, 0]}>
        <mesh>
          <boxGeometry args={[0.35, 0.9, 0.35]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Red Light */}
        <mesh ref={vehRedRef} position={[0, 0.28, 0.18]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Yellow Light */}
        <mesh position={[0, 0, 0.18]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        {/* Green Light */}
        <mesh ref={vehGreenRef} position={[0, -0.28, 0.18]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* Pedestrian Crossing Signal Box */}
      <group position={[0, 2.2, 0.1]}>
        <mesh>
          <boxGeometry args={[0.32, 0.55, 0.2]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Pedestrian Indicator Screen */}
        <mesh ref={pedLightRef} position={[0, 0, 0.11]}>
          <boxGeometry args={[0.22, 0.4, 0.02]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        {/* Push Button Box */}
        <mesh position={[0, -0.6, 0.08]}>
          <boxGeometry args={[0.22, 0.22, 0.14]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
        <mesh position={[0, -0.6, 0.16]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// MAIN SIMULATION SCENE INNER
// ==========================================

function SceneInner({ scenario, paused, onTelemetry, onSafety, onReachedGoal }: SimulatorSceneProps) {
  const keys = useRef({ forward: false, back: false, left: false, right: false });
  const playerRef = useRef<THREE.Group>(null);
  const vehiclesRef = useRef<VehicleData[]>([]);
  const crossedRef = useRef(false);
  const finishedRef = useRef(false);
  const signalRef = useRef({ walk: false, walkUntil: 0 });
  const lookLockRef = useRef(false);
  const playerLookAngle = useRef(0);
  const isPlayerMoving = useRef(false);
  const lastDangerAt = useRef(0);
  const prevSafety = useRef<'ok' | 'warning' | 'danger'>('ok');
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const cfg = useMemo(() => resolveConfig(scenario), [scenario]);

  const ensureVehicles = (scene: THREE.Scene) => {
    if (vehiclesRef.current.length > 0) return;
    const count = cfg.dense ? cfg.laneCount * 3 : cfg.laneCount * 2;
    const types: ('sedan' | 'suv' | 'sports' | 'bus')[] = ['sedan', 'suv', 'bus', 'sports', 'sedan', 'suv'];

    for (let i = 0; i < count; i++) {
      const laneIdx = i % cfg.laneCount;
      const z = cfg.laneZs[laneIdx];
      const dir: 1 | -1 = laneIdx % 2 === 0 ? 1 : -1;
      const type = types[i % types.length];
      const color = type === 'bus' ? '#f59e0b' : VEHICLE_COLORS[i % VEHICLE_COLORS.length];

      const group = createVehicleMesh(type, color);
      if (dir === -1) group.rotation.y = Math.PI;

      const progress = i / count;
      const x = dir === 1 ? -SPAWN_X + progress * SPAWN_X * 2 : SPAWN_X - progress * SPAWN_X * 2;
      group.position.set(x, 0, z);
      scene.add(group);

      vehiclesRef.current.push({
        group,
        type,
        color,
        x,
        z,
        speed: rand(6, cfg.dense ? 10 : 8) * dir,
        dir,
        hazarded: false,
        length: type === 'bus' ? 4.6 : 2.4,
        width: type === 'bus' ? 1.6 : 1.2,
      });
    }
  };

  const body = useThree((s) => s.camera);

  const lookScan = (side: 'left' | 'right') => {
    if (lookLockRef.current) return;
    lookLockRef.current = true;
    playerLookAngle.current = side === 'left' ? Math.PI / 2 : -Math.PI / 2;
    onTelemetry({ event_type: ROAD_EVENT.LOOK_ACTION, is_safe: true, payload: { side } });
    window.setTimeout(() => {
      lookLockRef.current = false;
      playerLookAngle.current = 0;
    }, LOOK_SCAN_SECONDS * 1000);
  };

  const tryPressSignal = () => {
    if (!cfg.hasSignal) return;
    if (!playerRef.current) return;
    const p = playerRef.current.position;
    if (Math.abs(p.x - 3.4) > 3.5 || Math.abs(p.z - (-cfg.roadHalf - 2.2)) > 3.5) return;
    signalRef.current.walk = true;
    signalRef.current.walkUntil = Date.now() / 1000 + 7;
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

    // Pedestrian signal timer
    if (cfg.hasSignal) {
      if (Date.now() / 1000 > signalRef.current.walkUntil) signalRef.current.walk = false;
    }

    // ---- Player Movement ----
    if (playerRef.current) {
      const speed = 5.6;
      let dx = 0;
      let dz = 0;
      if (!paused) {
        if (keys.current.forward) dz -= 1;
        if (keys.current.back) dz += 1;
        if (keys.current.left) dx -= 1;
        if (keys.current.right) dx += 1;
      }
      const len = Math.hypot(dx, dz);
      isPlayerMoving.current = len > 0;

      if (len > 0) {
        playerRef.current.position.x += (dx / len) * speed * delta;
        playerRef.current.position.z += (dz / len) * speed * delta;
        // Turn player facing direction
        const targetRot = Math.atan2(dx, dz);
        playerRef.current.rotation.y = THREE.MathUtils.lerp(playerRef.current.rotation.y, targetRot, 0.2);
      }

      const p = playerRef.current.position;
      p.x = THREE.MathUtils.clamp(p.x, -BOUND_X, BOUND_X);
      p.z = THREE.MathUtils.clamp(p.z, BOUND_Z_NEAR, BOUND_Z_FAR);

      // -- Road Entry Detection --
      const inRoad = Math.abs(p.z) < cfg.roadHalf;
      if (!crossedRef.current && inRoad && !finishedRef.current) {
        crossedRef.current = true;
        const vehicleThreat =
          !signalRef.current.walk &&
          vehiclesRef.current.some(
            (v) => Math.abs(v.x - p.x) < 6 && Math.abs(v.z - p.z) < 2.5 && !v.hazarded
          );
        const signalGreen = !cfg.hasSignal || signalRef.current.walk;
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

      // -- Finish Detection (Destination Sidewalk) --
      if (!finishedRef.current && p.z > cfg.roadHalf + 1.8 && Math.abs(p.x) < 4.0) {
        finishedRef.current = true;
        onTelemetry({ event_type: ROAD_EVENT.OBJECTIVE_REACHED, is_safe: true });
        onTelemetry({ event_type: ROAD_EVENT.FINISH, is_safe: true });
        onReachedGoal();
      }

      // -- Vehicle Safety & Danger Proximity --
      if (!finishedRef.current) {
        let danger = false;
        for (const v of vehiclesRef.current) {
          if (Math.abs(p.z - v.z) > 1.4) continue;
          const gap = Math.abs(v.x - p.x);
          if (gap < 5.2 && !v.hazarded && Math.abs(p.z) < cfg.roadHalf) {
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
          } else if (gap > 8.5) {
            v.hazarded = false;
          }
        }
        if (!danger) {
          updateSafety(Math.abs(p.z) < cfg.roadHalf ? 'warning' : 'ok');
        }
      }
    }

    // ---- Vehicle Drive Movement ----
    const isSignalWalk = signalRef.current.walk;
    for (const v of vehiclesRef.current) {
      // Vehicles slow down / stop at crosswalk when pedestrian signal is green WALK!
      const nearCrosswalk = Math.abs(v.x) < 7;
      v.x += (isSignalWalk && nearCrosswalk ? v.speed * 0.15 : v.speed) * delta;
      if (v.dir === 1 && v.x > SPAWN_X) v.x = -SPAWN_X;
      if (v.dir === -1 && v.x < -SPAWN_X) v.x = SPAWN_X;
      v.group.position.x = v.x;
    }


    // ---- Smooth Camera Follow ----
    if (playerRef.current) {
      const p = playerRef.current.position;
      body.position.set(p.x + 2.5, 7.2, p.z + 8.2);
      body.lookAt(p.x, 1.0, p.z + 0.8);
    }
  });

  const roadHalf = cfg.roadHalf;

  return (
    <group>
      {/* Ground Grass / Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[90, 36]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>

      {/* Main Asphalt Road Bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[90, roadHalf * 2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Yellow Curb Borders */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -roadHalf - 0.08]}>
        <planeGeometry args={[90, 0.16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, roadHalf + 0.08]}>
        <planeGeometry args={[90, 0.16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>

      {/* White Lane Divider Dash Lines */}
      {cfg.laneCount > 1 &&
        Array.from({ length: cfg.laneCount - 1 }, (_, i) => {
          const z = (i + 1 - cfg.laneCount / 2) * LANE_GAP;
          return (
            <group key={i} position={[0, 0.04, z]}>
              {Array.from({ length: 18 }, (_, j) => (
                <mesh key={j} rotation={[-Math.PI / 2, 0, 0]} position={[-38 + j * 4.5, 0, 0]}>
                  <planeGeometry args={[2.2, 0.12]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
                </mesh>
              ))}
            </group>
          );
        })}

      {/* High-Contrast White Zebra Crossing */}
      <group position={[0, 0.05, 0]}>
        {Array.from({ length: 11 }, (_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-2.5 + i * 0.5, 0, 0]}>
            <planeGeometry args={[0.28, roadHalf * 1.95]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Concrete Sidewalks */}
      <group position={[0, 0.06, -roadHalf - 1.8]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[90, 3.4]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
      </group>
      <group position={[0, 0.06, roadHalf + 1.8]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[90, 3.4]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
      </group>

      {/* City Architecture */}
      <Cityscape zSide={-1} />
      <Cityscape zSide={1} />

      {/* Trees lining Sidewalks */}
      <StreetTree position={[-16, 0, -roadHalf - 3.2]} />
      <StreetTree position={[-8, 0, -roadHalf - 3.2]} />
      <StreetTree position={[14, 0, -roadHalf - 3.2]} />
      <StreetTree position={[-14, 0, roadHalf + 3.2]} />
      <StreetTree position={[10, 0, roadHalf + 3.2]} />

      {/* Bus Stop Shelter & Bench */}
      <BusStopShelter position={[-9, 0, -roadHalf - 2.2]} />

      {/* Street Lamps */}
      <Streetlight position={[6, 0, -roadHalf - 0.7]} />
      <Streetlight position={[-6, 0, -roadHalf - 0.7]} />
      <Streetlight position={[12, 0, roadHalf + 0.7]} />
      <Streetlight position={[-12, 0, roadHalf + 0.7]} />

      {/* Pedestrian Sidewalk NPC Civilian Humans */}
      <group position={[-8.2, 0, -roadHalf - 1.6]}>
        <HumanoidModel shirtColor="#ef4444" pantsColor="#0f172a" skinColor="#f5c096" scale={0.9} />
      </group>
      <group position={[-7.5, 0, -roadHalf - 1.9]}>
        <HumanoidModel shirtColor="#10b981" pantsColor="#334155" skinColor="#e0a899" scale={0.88} />
      </group>
      <group position={[4.2, 0, -roadHalf - 1.8]}>
        <HumanoidModel shirtColor="#ec4899" pantsColor="#1e293b" skinColor="#fce7f3" scale={0.92} />
      </group>
      <group position={[2.8, 0, roadHalf + 1.8]}>
        <HumanoidModel shirtColor="#eab308" pantsColor="#0f172a" skinColor="#f5c096" scale={0.9} />
      </group>

      {/* Traffic Signals */}
      {cfg.hasSignal && (
        <PedestrianSignal stateRef={signalRef} position={[3.4, 0, -roadHalf - 2.2]} />
      )}

      {/* Goal Beacon (Target Destination Sidewalk) */}
      <group position={[0, 0, roadHalf + 2.8]}>
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 4.0, 8]} />
          <meshStandardMaterial color="#15803d" metalness={0.6} />
        </mesh>
        <mesh position={[0, 4.0, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={1.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
          <ringGeometry args={[1.5, 2.2, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Main Player Avatar (Controlled Character) */}
      <group ref={playerRef} position={[0, 0, -roadHalf - 2.5]}>
        <HumanoidModel
          shirtColor="#2563eb"
          pantsColor="#0f172a"
          skinColor="#f5c096"
          hairColor="#1e1b18"
          isWalking={isPlayerMoving.current}
          lookAngle={playerLookAngle.current}
          scale={1.0}
        />
        {/* Selection Ring under Player */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.75, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// ROAD CROSSING SIMULATOR CANVAS
// ==========================================

export const RoadCrossingSimulator: React.FC<SimulatorSceneProps> = (props) => {
  return (
    <Canvas
      camera={{ position: [2.5, 7.2, 7.5], fov: 48 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.75]}
    >
      {/* Sky & Sun Lighting */}
      <ambientLight intensity={0.65} color="#bae6fd" />
      <hemisphereLight color="#e0f2fe" groundColor="#166534" intensity={0.6} />
      <directionalLight position={[28, 42, 18]} intensity={1.3} color="#fff7ed" castShadow />
      <pointLight position={[0, 10, -4]} intensity={0.5} color="#3b82f6" />
      <SceneInner key={props.resetKey} {...props} />
    </Canvas>
  );
};

export type { CrossingConfig };