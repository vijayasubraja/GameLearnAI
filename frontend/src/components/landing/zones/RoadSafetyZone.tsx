import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ZoneProps {
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

export const RoadSafetyZone: React.FC<ZoneProps> = ({ position, isSelected, onSelect }) => {
  const carRef = useRef<THREE.Group>(null);
  const signalLightRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Subtle car movement along the road
    if (carRef.current) {
      carRef.current.position.x += delta * 1.2;
      if (carRef.current.position.x > 2.0) {
        carRef.current.position.x = -2.0;
      }
    }
    // Traffic light blink
    if (signalLightRef.current) {
      const isGreen = Math.sin(state.clock.elapsedTime * 1.5) > 0;
      (signalLightRef.current.material as THREE.MeshStandardMaterial).color.set(
        isGreen ? '#10B981' : '#EF4444'
      );
      (signalLightRef.current.material as THREE.MeshStandardMaterial).emissive.set(
        isGreen ? '#10B981' : '#EF4444'
      );
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
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.5}
        />
      </mesh>

      {/* Selection Highlight Ring */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.85, 2.0, 32]} />
          <meshBasicMaterial color="#06B6D4" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Asphalt Road Strip */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.2, 1.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>

      {/* Crosswalk Zebra Stripes */}
      {[-0.3, -0.1, 0.1, 0.3].map((offset, i) => (
        <mesh key={i} position={[offset, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 0.8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Traffic Signal Post */}
      <group position={[-0.9, 0.1, -0.8]}>
        {/* Pole */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        {/* Signal Box */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.16, 0.35, 0.12]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        {/* Active Signal Lamp */}
        <mesh ref={signalLightRef} position={[0, 1.1, 0.07]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Moving Low-Poly Car */}
      <group ref={carRef} position={[-1.2, 0.22, 0.25]}>
        {/* Car Body */}
        <mesh>
          <boxGeometry args={[0.7, 0.2, 0.35]} />
          <meshStandardMaterial color="#6366F1" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Car Cabin */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.4, 0.14, 0.3]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.8} />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.35, 0, 0.1]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
        <mesh position={[0.35, 0, -0.1]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>
      </group>

      {/* Pedestrian Waiting at Curb */}
      <group position={[0.5, 0.1, 0.8]}>
        <mesh position={[0, 0.25, 0]}>
          <capsuleGeometry args={[0.08, 0.25, 4, 8]} />
          <meshStandardMaterial color="#F43F5E" />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#FECDD3" />
        </mesh>
      </group>

      {/* Floating Zone Tag */}
      <group position={[0, 1.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
};
