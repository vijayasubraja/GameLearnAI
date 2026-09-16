import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CarDef {
  radius: number;
  speed: number;
  offset: number;
  baseY: number;
  color: string;
  cabin: string;
}

const CARS: CarDef[] = [
  { radius: 12.1, speed: 0.45, offset: 0.2, baseY: 0.32, color: '#EF5B5B', cabin: '#FFD9D9' },
  { radius: 12.1, speed: -0.38, offset: 1.7, baseY: 0.32, color: '#4FC3F7', cabin: '#E1F6FF' },
  { radius: 12.1, speed: 0.52, offset: 3.1, baseY: 0.32, color: '#FFD166', cabin: '#FFF3CC' },
  { radius: 12.1, speed: -0.48, offset: 4.4, baseY: 0.32, color: '#7C6CE8', cabin: '#E4DFFF' },
  { radius: 12.1, speed: 0.4, offset: 5.6, baseY: 0.32, color: '#53C270', cabin: '#DDF5E2' },
];

const Wheel: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <mesh position={[x, 0.08, z]} rotation={[Math.PI / 2, 0, 0]}>
    <cylinderGeometry args={[0.08, 0.08, 0.06, 10]} />
    <meshStandardMaterial color="#2B2F36" roughness={0.6} />
  </mesh>
);

const Car: React.FC<{ def: CarDef }> = ({ def }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = def.offset + t * def.speed;
    if (ref.current) {
      ref.current.position.set(Math.cos(a) * def.radius, def.baseY, Math.sin(a) * def.radius);
      ref.current.rotation.y = Math.atan2(-Math.sin(a), Math.cos(a));
    }
  });

  return (
    <group ref={ref}>
      <group scale={1.05}>
        {/* Body */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[0.8, 0.2, 0.44]} />
          <meshStandardMaterial color={def.color} roughness={0.45} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[0.42, 0.16, 0.34]} />
          <meshStandardMaterial color={def.cabin} roughness={0.25} />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.4, 0.12, 0.15]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#FFF8C9" />
        </mesh>
        <mesh position={[0.4, 0.12, -0.15]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#FFF8C9" />
        </mesh>
        {/* Wheels */}
        <Wheel x={0.26} z={0.19} />
        <Wheel x={-0.26} z={0.19} />
        <Wheel x={0.26} z={-0.19} />
        <Wheel x={-0.26} z={-0.19} />
      </group>
    </group>
  );
};

/** Playful vehicles cruising the ring road. */
export const Vehicles: React.FC = () => {
  return (
    <group>
      {CARS.map((car, i) => (
        <Car key={i} def={car} />
      ))}
    </group>
  );
};