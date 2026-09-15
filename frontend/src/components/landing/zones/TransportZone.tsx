import React from 'react';
import * as THREE from 'three';

interface ZoneProps {
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

export const TransportZone: React.FC<ZoneProps> = ({ position, isSelected, onSelect }) => {
  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Zone Pedestal Base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[1.8, 1.9, 0.1, 24]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} />
      </mesh>

      {/* Selection Highlight Ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.85, 2.0, 32]} />
          <meshBasicMaterial color="#818CF8" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Bus Stop Platform & Shelter */}
      <group position={[-0.4, 0.1, -0.2]}>
        {/* Glass Canopy */}
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.6]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} />
        </mesh>
        {/* Support Pillars */}
        <mesh position={[-0.5, 0.45, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        <mesh position={[0.5, 0.45, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        {/* Bus Stop Bench */}
        <mesh position={[0, 0.2, -0.1]}>
          <boxGeometry args={[0.7, 0.05, 0.2]} />
          <meshStandardMaterial color="#D97706" />
        </mesh>
      </group>

      {/* Transit Route Sign Post */}
      <group position={[0.7, 0.1, -0.6]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.0, 8]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        <mesh position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Low-Poly Transit Bus */}
      <group position={[0.1, 0.3, 0.6]}>
        {/* Bus Body */}
        <mesh>
          <boxGeometry args={[1.4, 0.45, 0.5]} />
          <meshStandardMaterial color="#3B82F6" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Windows Strip */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[1.35, 0.16, 0.52]} />
          <meshStandardMaterial color="#BAE6FD" roughness={0.1} />
        </mesh>
        {/* Wheels */}
        {[-0.45, 0.45].map((x, i) => (
          <mesh key={i} position={[x, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.54, 16]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        ))}
      </group>

      {/* Zone Beacon Indicator */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#818CF8" emissive="#818CF8" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
};
