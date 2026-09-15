import React from 'react';
import * as THREE from 'three';

interface ZoneProps {
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

export const ShoppingZone: React.FC<ZoneProps> = ({ position, isSelected, onSelect }) => {
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
          <meshBasicMaterial color="#F59E0B" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Mini Storefront Building */}
      <group position={[-0.3, 0.1, -0.4]}>
        {/* Main Wall */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.2, 1.2, 0.6]} />
          <meshStandardMaterial color="#1E293B" roughness={0.6} />
        </mesh>
        {/* Striped Awning */}
        <mesh position={[0, 1.0, 0.35]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[1.3, 0.08, 0.5]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
        {/* Store Window Display */}
        <mesh position={[0, 0.55, 0.31]}>
          <planeGeometry args={[0.9, 0.6]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Low-Poly Shopping Cart */}
      <group position={[0.6, 0.25, 0.4]}>
        {/* Basket */}
        <mesh>
          <boxGeometry args={[0.45, 0.3, 0.35]} />
          <meshStandardMaterial color="#06B6D4" wireframe />
        </mesh>
        {/* Handle */}
        <mesh position={[-0.25, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
        {/* Wheels */}
        {[-0.18, 0.18].map((x, i) => (
          <mesh key={i} position={[x, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.38, 8]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
        ))}
      </group>

      {/* Zone Beacon Indicator */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
};
