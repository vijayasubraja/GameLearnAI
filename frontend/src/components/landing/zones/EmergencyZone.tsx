import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ZoneProps {
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

export const EmergencyZone: React.FC<ZoneProps> = ({ position, isSelected, onSelect }) => {
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beaconRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4);
      (beaconRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        pulse > 0 ? 1.8 : 0.4;
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
          <meshBasicMaterial color="#F43F5E" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Emergency Beacon Post */}
      <group position={[0, 0.1, 0]}>
        {/* Support Pillar */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.0, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Flashing Emergency Beacon Light */}
        <mesh ref={beaconRef} position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.25, 16]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.5} />
        </mesh>

        {/* Emergency Signboard */}
        <mesh position={[0, 0.7, 0.12]}>
          <boxGeometry args={[0.55, 0.3, 0.04]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
        <mesh position={[0, 0.7, 0.15]}>
          <planeGeometry args={[0.45, 0.2]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* Extinguisher Canister */}
      <group position={[0.5, 0.1, 0.4]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.45, 12]} />
          <meshStandardMaterial color="#DC2626" />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
      </group>

      {/* Zone Beacon Indicator */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#F43F5E" emissive="#F43F5E" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
};
