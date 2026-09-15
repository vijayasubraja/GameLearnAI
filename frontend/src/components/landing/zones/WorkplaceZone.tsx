import React from 'react';
import * as THREE from 'three';

interface ZoneProps {
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

export const WorkplaceZone: React.FC<ZoneProps> = ({ position, isSelected, onSelect }) => {
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
          <meshBasicMaterial color="#8B5CF6" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Office Desk */}
      <group position={[0, 0.1, 0]}>
        {/* Desk Surface */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.3, 0.06, 0.7]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Legs */}
        {[-0.55, 0.55].map((x, i) => (
          <mesh key={i} position={[x, 0.22, 0]}>
            <boxGeometry args={[0.08, 0.44, 0.6]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        ))}

        {/* Computer Screen */}
        <mesh position={[0, 0.75, -0.15]}>
          <boxGeometry args={[0.55, 0.35, 0.04]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        {/* Glowing Monitor Display */}
        <mesh position={[0, 0.75, -0.12]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={1.0} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, 0.52, -0.15]}>
          <cylinderGeometry args={[0.02, 0.06, 0.1, 8]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        {/* Keyboard */}
        <mesh position={[0, 0.49, 0.1]}>
          <boxGeometry args={[0.4, 0.02, 0.14]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Office Chair */}
      <group position={[0, 0.1, 0.6]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.35, 0.05, 0.35]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <mesh position={[0, 0.55, 0.15]}>
          <boxGeometry args={[0.35, 0.45, 0.05]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* Zone Beacon Indicator */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
};
