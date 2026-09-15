import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { LearningHub } from './LearningHub';
import { RoadSafetyZone } from './zones/RoadSafetyZone';
import { TransportZone } from './zones/TransportZone';
import { MoneyZone } from './zones/MoneyZone';
import { ShoppingZone } from './zones/ShoppingZone';
import { CommunicationZone } from './zones/CommunicationZone';
import { WorkplaceZone } from './zones/WorkplaceZone';
import { EmergencyZone } from './zones/EmergencyZone';
import { AdaptiveFlowLines } from './AdaptiveFlowLines';

interface GameLearnWorldProps {
  selectedZone: string | null;
  onSelectZone: (zoneKey: string) => void;
  selectedNode: string | null;
  onSelectNode: (nodeKey: string) => void;
}

export const ZONE_CONFIGS: {
  key: string;
  name: string;
  category: string;
  position: [number, number, number];
}[] = [
  { key: 'road_safety', name: 'Road & Pedestrian Safety', category: 'Physical World', position: [0, 0, 5.8] },
  { key: 'transport', name: 'Public Transportation', category: 'Urban Navigation', position: [4.8, 0, 3.4] },
  { key: 'money', name: 'Money Management', category: 'Financial Decisions', position: [5.8, 0, -1.8] },
  { key: 'shopping', name: 'Shopping & Transactions', category: 'Practical Commerce', position: [2.5, 0, -5.4] },
  { key: 'communication', name: 'Communication & Social', category: 'Interpersonal', position: [-2.5, 0, -5.4] },
  { key: 'workplace', name: 'Workplace Skills', category: 'Career Decisions', position: [-5.8, 0, -1.8] },
  { key: 'emergency', name: 'Emergency & Safety', category: 'Critical Response', position: [-4.8, 0, 3.4] },
];

export const GameLearnWorld: React.FC<GameLearnWorldProps> = ({
  selectedZone,
  onSelectZone,
  selectedNode,
  onSelectNode,
}) => {
  const zonePositions = ZONE_CONFIGS.map((z) => z.position);

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 9.5, 14.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        {/* Ambient & Controlled Directional Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 15, 8]}
          intensity={1.2}
          color="#F8FAFC"
        />
        <pointLight position={[0, 4, 0]} intensity={1.5} color="#06B6D4" />
        <pointLight position={[-8, 3, -8]} intensity={0.8} color="#818CF8" />

        {/* Orbit Controls (Drag to rotate, scroll to zoom) */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={22}
          maxPolarAngle={Math.PI / 2.12}
          autoRotate={!selectedZone && !selectedNode}
          autoRotateSpeed={0.4}
        />

        {/* Ground Simulation Grid Helper */}
        <gridHelper
          args={[30, 40, '#312E81', '#0F172A']}
          position={[0, 0, 0]}
        />

        {/* Concentric Distance Rings */}
        {[2.5, 6.0, 9.5].map((radius, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[radius, radius + 0.02, 64]} />
            <meshBasicMaterial color="#1E293B" transparent opacity={0.5} />
          </mesh>
        ))}

        {/* Central Adaptive Learning Hub */}
        <LearningHub
          onSelectNode={onSelectNode}
          selectedNode={selectedNode}
        />

        {/* Dynamic Glowing Energy Flow Conduits */}
        <AdaptiveFlowLines zonePositions={zonePositions} />

        {/* 7 Skill Zones */}
        <RoadSafetyZone
          position={ZONE_CONFIGS[0].position}
          isSelected={selectedZone === 'road_safety'}
          onSelect={() => onSelectZone('road_safety')}
        />

        <TransportZone
          position={ZONE_CONFIGS[1].position}
          isSelected={selectedZone === 'transport'}
          onSelect={() => onSelectZone('transport')}
        />

        <MoneyZone
          position={ZONE_CONFIGS[2].position}
          isSelected={selectedZone === 'money'}
          onSelect={() => onSelectZone('money')}
        />

        <ShoppingZone
          position={ZONE_CONFIGS[3].position}
          isSelected={selectedZone === 'shopping'}
          onSelect={() => onSelectZone('shopping')}
        />

        <CommunicationZone
          position={ZONE_CONFIGS[4].position}
          isSelected={selectedZone === 'communication'}
          onSelect={() => onSelectZone('communication')}
        />

        <WorkplaceZone
          position={ZONE_CONFIGS[5].position}
          isSelected={selectedZone === 'workplace'}
          onSelect={() => onSelectZone('workplace')}
        />

        <EmergencyZone
          position={ZONE_CONFIGS[6].position}
          isSelected={selectedZone === 'emergency'}
          onSelect={() => onSelectZone('emergency')}
        />
      </Canvas>
    </div>
  );
};
