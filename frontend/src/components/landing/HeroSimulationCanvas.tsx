import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Low-poly rotating simulation core with floating data rings and road lanes
const SimulationCore: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x += delta * 0.2;
      ringRef1.current.rotation.z += delta * 0.1;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y -= delta * 0.25;
      ringRef2.current.rotation.x -= delta * 0.15;
    }
    if (nodesRef.current) {
      nodesRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Holographic Node */}
      <mesh>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#0891B2"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color="#6366F1"
          emissive="#4F46E5"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Floating Data Ring 1 (Cyan) */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.2, 0.02, 16, 64]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.6} />
      </mesh>

      {/* Floating Data Ring 2 (Indigo) */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[2.8, 0.02, 16, 64]} />
        <meshBasicMaterial color="#818CF8" transparent opacity={0.5} />
      </mesh>

      {/* Orbital Decision Checkpoints */}
      <group ref={nodesRef}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => {
          const x = Math.cos(angle) * 2.2;
          const z = Math.sin(angle) * 2.2;
          const colors = ['#10B981', '#F59E0B', '#06B6D4'];
          return (
            <group key={i} position={[x, 0, z]}>
              <mesh>
                <boxGeometry args={[0.25, 0.25, 0.25]} />
                <meshStandardMaterial
                  color={colors[i]}
                  emissive={colors[i]}
                  emissiveIntensity={0.9}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Ground Simulation Grid Plane */}
      <gridHelper
        args={[10, 20, '#6366F1', '#1E293B']}
        position={[0, -1.8, 0]}
      />
    </group>
  );
};

// Subtle ambient particle dust
const ParticleField: React.FC = () => {
  const count = 70;
  const meshRef = useRef<THREE.Points>(null);

  const [positions] = React.useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 12;
      pos[i + 1] = (Math.random() - 0.5) * 8;
      pos[i + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  });

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#38BDF8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export const HeroSimulationCanvas: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[380px] lg:min-h-[520px] relative pointer-events-auto">
      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 8, 5]} intensity={1.5} color="#818CF8" />
        <pointLight position={[-5, -4, -4]} intensity={1.0} color="#06B6D4" />
        
        <SimulationCore />
        <ParticleField />
      </Canvas>

      {/* Decorative Technical HUD Coordinate Overlays */}
      <div className="absolute top-4 right-4 pointer-events-none text-[10px] font-mono text-cyan-400/70 space-y-1 text-right bg-slate-950/60 p-2.5 rounded-lg border border-cyan-500/20 backdrop-blur-md">
        <p className="flex items-center justify-end gap-1.5 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          SIM_NODE_01 // ACTIVE
        </p>
        <p className="text-slate-400">FPS: 60.0 | RENDER: WEBGL</p>
        <p className="text-slate-500">ADAPTIVE_MESH: REALTIME</p>
      </div>

      <div className="absolute bottom-4 left-4 pointer-events-none text-[10px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-white/5 backdrop-blur-md flex items-center gap-3">
        <span className="text-indigo-400">LATENCY: 2.1ms</span>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400">SKILL_ENGINE: READY</span>
      </div>
    </div>
  );
};
