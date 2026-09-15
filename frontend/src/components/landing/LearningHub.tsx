import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LearningHubProps {
  onSelectNode: (nodeKey: string) => void;
  selectedNode: string | null;
}

const ADAPTIVE_NODES = [
  { key: 'assess', label: 'ASSESS', angle: 0, color: '#818CF8' },
  { key: 'predict', label: 'PREDICT', angle: (2 * Math.PI) / 5, color: '#06B6D4' },
  { key: 'simulate', label: 'SIMULATE', angle: (4 * Math.PI) / 5, color: '#10B981' },
  { key: 'observe', label: 'OBSERVE', angle: (6 * Math.PI) / 5, color: '#F59E0B' },
  { key: 'adapt', label: 'ADAPT', angle: (8 * Math.PI) / 5, color: '#F43F5E' },
];

export const LearningHub: React.FC<LearningHubProps> = ({ onSelectNode, selectedNode }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.3;
      ring1Ref.current.rotation.x = 0.5 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.25;
      ring2Ref.current.rotation.y += delta * 0.2;
    }
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Platform Base (Futuristic Circular Pedestal) */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[2.2, 2.5, 0.15, 32]} />
        <meshStandardMaterial
          color="#0B1224"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Cyan Energy Ring on Platform */}
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.1, 32]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner Glowing Hexagon / Disc */}
      <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 6]} />
        <meshStandardMaterial
          color="#1E1B4B"
          emissive="#312E81"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Floating Holographic Core Crystal (GameLearn Core) */}
      <mesh
        ref={coreRef}
        position={[0, 0.8, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode('hub');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={1.2}
          wireframe={selectedNode === 'hub'}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Surrounding Orbital Gyro Rings */}
      <mesh ref={ring1Ref} position={[0, 0.8, 0]}>
        <torusGeometry args={[1.1, 0.018, 16, 48]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.7} />
      </mesh>

      <mesh ref={ring2Ref} position={[0, 0.8, 0]}>
        <torusGeometry args={[1.35, 0.015, 16, 48]} />
        <meshBasicMaterial color="#818CF8" transparent opacity={0.6} />
      </mesh>

      {/* 5 Adaptive Process Nodes (Assess, Predict, Simulate, Observe, Adapt) */}
      <group ref={nodesGroupRef} position={[0, 0.4, 0]}>
        {ADAPTIVE_NODES.map((node) => {
          const radius = 1.7;
          const x = Math.cos(node.angle) * radius;
          const z = Math.sin(node.angle) * radius;
          const isSelected = selectedNode === node.key;

          return (
            <group key={node.key} position={[x, 0.1, z]}>
              {/* Connector Pin */}
              <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
                <meshBasicMaterial color="#475569" />
              </mesh>

              {/* Node Orb */}
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node.key);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = 'auto';
                }}
              >
                <sphereGeometry args={[isSelected ? 0.22 : 0.16, 16, 16]} />
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.color}
                  emissiveIntensity={isSelected ? 1.6 : 0.9}
                  roughness={0.2}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};
