import React from 'react';
import { WORLD_PALETTE as P } from './palette';

const STREETLIGHT_ANGLES = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4];

const Streetlight: React.FC<{ angle: number }> = ({ angle }) => {
  const r = 11.6;
  return (
    <group position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} rotation={[0, -angle + Math.PI / 2, 0]}>
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.075, 3.1, 8]} />
        <meshStandardMaterial color="#5B6472" roughness={0.7} />
      </mesh>
      <mesh position={[0.42, 2.9, 0]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.04, 0.05, 0.95, 8]} />
        <meshStandardMaterial color="#5B6472" />
      </mesh>
      <mesh position={[0.68, 3.05, 0]}>
        <sphereGeometry args={[0.17, 14, 14]} />
        <meshStandardMaterial color="#FFF3B0" emissive="#FFD166" emissiveIntensity={1.1} />
      </mesh>
    </group>
  );
};

const Bench: React.FC<{ angle: number }> = ({ angle }) => {
  const r = 5.7;
  return (
    <group position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} rotation={[0, -angle + Math.PI / 2, 0]}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.15, 0.08, 0.42]} />
        <meshStandardMaterial color={P.treeTrunk} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.18, 0.18]}>
        <boxGeometry args={[1.15, 0.08, 0.4]} />
        <meshStandardMaterial color={P.treeTrunk} roughness={0.8} />
      </mesh>
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} position={[x, 0.12, 0]} castShadow>
          <boxGeometry args={[0.09, 0.24, 0.42]} />
          <meshStandardMaterial color="#4A4F58" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const DirectionSign: React.FC<{ angle: number }> = ({ angle }) => {
  const r = 8.9;
  return (
    <group position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]} rotation={[0, -angle + Math.PI, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 2.2, 8]} />
        <meshStandardMaterial color="#5B6472" />
      </mesh>
      <mesh position={[0.62, 1.7, 0]}>
        <boxGeometry args={[0.9, 0.28, 0.06]} />
        <meshStandardMaterial color="#F6C945" />
      </mesh>
      <mesh position={[-0.35, 1.5, 0]}>
        <boxGeometry args={[0.62, 0.24, 0.06]} />
        <meshStandardMaterial color="#53C270" />
      </mesh>
    </group>
  );
};

/** Streetlights, benches and signs for a lived-in town feel. */
export const Props: React.FC = () => {
  return (
    <group>
      {STREETLIGHT_ANGLES.map((a, i) => (
        <Streetlight key={i} angle={a} />
      ))}
      {[Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4].map((a, i) => (
        <Bench key={i} angle={a} />
      ))}
      <DirectionSign angle={1.9} />
      <DirectionSign angle={4.78} />
    </group>
  );
};