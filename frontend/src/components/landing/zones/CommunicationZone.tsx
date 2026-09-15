import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ZoneProps {
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

export const CommunicationZone: React.FC<ZoneProps> = ({ position, isSelected, onSelect }) => {
  const bubbleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (bubbleRef.current) {
      bubbleRef.current.position.y = 0.9 + Math.sin(state.clock.elapsedTime * 3) * 0.06;
      bubbleRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.08);
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
          <meshBasicMaterial color="#EC4899" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Character A (Left) */}
      <group position={[-0.45, 0.1, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
          <meshStandardMaterial color="#3B82F6" />
        </mesh>
        <mesh position={[0, 0.68, 0]}>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshStandardMaterial color="#BAE6FD" />
        </mesh>
      </group>

      {/* Character B (Right) */}
      <group position={[0.45, 0.1, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
          <meshStandardMaterial color="#EC4899" />
        </mesh>
        <mesh position={[0, 0.68, 0]}>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshStandardMaterial color="#FBCFE8" />
        </mesh>
      </group>

      {/* Floating Animated Speech Bubble Between Them */}
      <mesh ref={bubbleRef} position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={1.0}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Zone Beacon Indicator */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
};
