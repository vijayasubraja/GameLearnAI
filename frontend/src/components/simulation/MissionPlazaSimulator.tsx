import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PLAZA_EVENT, type SimulatorSceneProps } from './simTypes';

function SceneInner({ scenario, paused, onTelemetry, onSafety, onReachedGoal }: SimulatorSceneProps) {
  const keys = useRef({ forward: false, back: false, left: false, right: false });
  const player = useRef<THREE.Group>(null);
  const finished = useRef(false);
  const promptedInteract = useRef(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const body = useThree((s) => s.camera);

  const objective = useMemo(() => {
    const env = (scenario.environment_config ?? {}) as Record<string, unknown>;
    return {
      x: typeof env.obj_x === 'number' ? env.obj_x : 0,
      z: typeof env.obj_z === 'number' ? env.obj_z : 6,
    };
  }, [scenario]);

  const onInteract = () => {
    if (!player.current || finished.current) return;
    const p = player.current.position;
    const dist = Math.hypot(p.x - objective.x, p.z - objective.z);
    if (dist < 2.2) {
      onTelemetry({ event_type: PLAZA_EVENT.INTERACTION, is_safe: true });
      onTelemetry({ event_type: PLAZA_EVENT.OBJECTIVE_REACHED, is_safe: true });
      onTelemetry({ event_type: PLAZA_EVENT.FINISH, is_safe: true });
      finished.current = true;
      onReachedGoal();
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.current.forward = true;
      else if (k === 's' || k === 'arrowdown') keys.current.back = true;
      else if (k === 'a' || k === 'arrowleft') keys.current.left = true;
      else if (k === 'd' || k === 'arrowright') keys.current.right = true;
      else if (k === 'e') onInteract();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.current.forward = false;
      else if (k === 's' || k === 'arrowdown') keys.current.back = false;
      else if (k === 'a' || k === 'arrowleft') keys.current.left = false;
      else if (k === 'd' || k === 'arrowright') keys.current.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  });

  useFrame((_state, delta) => {
    const speed = 5.2;
    let dx = 0;
    let dz = 0;
    if (!paused) {
      if (keys.current.forward) dz -= 1;
      if (keys.current.back) dz += 1;
      if (keys.current.left) dx -= 1;
      if (keys.current.right) dx += 1;
    }
    const len = Math.hypot(dx, dz);
    if (player.current && len > 0) {
      player.current.position.x += (dx / len) * speed * delta;
      player.current.position.z += (dz / len) * speed * delta;
      player.current.position.x = THREE.MathUtils.clamp(player.current.position.x, -16, 16);
      player.current.position.z = THREE.MathUtils.clamp(player.current.position.z, -10, 10);
    }

    if (player.current && !finished.current) {
      const dist = Math.hypot(player.current.position.x - objective.x, player.current.position.z - objective.z);
      if (dist < 2.4) {
        onSafety('warning');
        if (!promptedInteract.current) {
          promptedInteract.current = true;
          onTelemetry({ event_type: PLAZA_EVENT.PROMPT, is_safe: true, payload: { prompt: 'press_e' } });
        }
      } else {
        promptedInteract.current = false;
        onSafety('ok');
      }
    }

    if (player.current) {
      const p = player.current.position;
      body.position.set(p.x + 2, 5.6, p.z + 7);
      body.lookAt(p.x, 0.8, p.z);
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#121824" roughness={0.95} />
      </mesh>
      <gridHelper args={[40, 20, '#2a3b52', '#1b2637']} position={[0, 0.01, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, objective.z]}>
        <circleGeometry args={[2.6, 32]} />
        <meshBasicMaterial color="#3D7BFF" transparent opacity={0.14} />
      </mesh>

      {/* Objective beacon */}
      <group position={[objective.x, 0, objective.z]}>
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 3.2, 6]} />
          <meshStandardMaterial color="#2b3547" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.3, 0]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#3D7BFF" emissive="#3D7BFF" emissiveIntensity={1.1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[1.1, 1.7, 32]} />
          <meshBasicMaterial color="#3D7BFF" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Neon edge markers */}
      {[-8, 0, 8].map((x) => (
        <mesh key={x} position={[x, 0.1, -8]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 1]} />
          <meshBasicMaterial color="#223452" />
        </mesh>
      ))}

      {/* Player avatar */}
      <group ref={player} position={[0, 0, -7]}>
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

export const MissionPlazaSimulator: React.FC<SimulatorSceneProps> = (props) => {
  return (
    <Canvas
      camera={{ position: [2, 5.6, 0.5], fov: 47 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.75]}
    >
      <ambientLight intensity={0.6} />
      <hemisphereLight color="#8fa8cc" groundColor="#0e131c" intensity={0.5} />
      <directionalLight position={[14, 26, 10]} intensity={1.1} color="#cfe0ff" />
      <pointLight position={[0, 7, 2]} intensity={0.5} color="#3D7BFF" />
      <SceneInner key={props.resetKey} {...props} />
    </Canvas>
  );
};