import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlowLinesProps {
  zonePositions: [number, number, number][];
}

export const AdaptiveFlowLines: React.FC<FlowLinesProps> = ({ zonePositions }) => {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const target = zonePositions[i % zonePositions.length];
        const progress = (state.clock.elapsedTime * 0.4 + i * 0.15) % 1;
        child.position.x = target[0] * progress;
        child.position.z = target[2] * progress;
        child.position.y = 0.15 + Math.sin(progress * Math.PI) * 0.3;
      });
    }
  });

  return (
    <group>
      {/* Static Glowing Conduits on Ground */}
      {zonePositions.map((pos, idx) => {
        const points = [
          new THREE.Vector3(0, 0.08, 0),
          new THREE.Vector3(pos[0], 0.08, pos[2]),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive key={idx} object={new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: '#06B6D4',
              transparent: true,
              opacity: 0.35,
            })
          )} />
        );
      })}

      {/* Traveling Data Pulse Particles along Conduits */}
      <group ref={particlesRef}>
        {zonePositions.map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
