import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ZoneProps {
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

export const MoneyZone: React.FC<ZoneProps> = ({ position, isSelected, onSelect }) => {
  const coinGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (coinGroupRef.current) {
      coinGroupRef.current.rotation.y += delta * 1.5;
    }
  });

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
          <meshBasicMaterial color="#10B981" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Futuristic ATM / Budget Terminal Kiosk */}
      <group position={[-0.5, 0.1, 0]}>
        {/* Terminal Pillar */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.5, 1.0, 0.4]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Glowing Screen */}
        <mesh position={[0, 0.65, 0.21]}>
          <planeGeometry args={[0.35, 0.25]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={1.2} />
        </mesh>
        {/* Card / Payment Pad */}
        <mesh position={[0, 0.4, 0.22]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.2, 0.02, 0.15]} />
          <meshStandardMaterial color="#06B6D4" />
        </mesh>
      </group>

      {/* Floating Animated Coin Stack */}
      <group ref={coinGroupRef} position={[0.5, 0.7, 0]}>
        {[0, 0.18, 0.36].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#D97706"
              emissiveIntensity={0.6}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Digital Balance Graph Plane */}
      <mesh position={[0, 0.11, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshStandardMaterial color="#064E3B" transparent opacity={0.6} />
      </mesh>

      {/* Zone Beacon Indicator */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
};
