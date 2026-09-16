import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { WORLD_PALETTE as P } from './palette';
import { Environment } from './Environment';
import { Hub } from './Hub';
import { WorldBuildings } from './Buildings';
import { Trees } from './Trees';
import { Vehicles } from './Vehicles';
import { Coins } from './Coins';
import { Props } from './Props';

const CLOUDS: { x: number; y: number; z: number; scale: number; speed: number }[] = [
  { x: -20, y: 17, z: -12, scale: 2.4, speed: 0.32 },
  { x: 14, y: 19, z: -22, scale: 3.1, speed: 0.22 },
  { x: 26, y: 18, z: 8, scale: 2.1, speed: 0.28 },
  { x: -8, y: 20, z: 24, scale: 2.8, speed: 0.36 },
  { x: -30, y: 17.5, z: 2, scale: 2.3, speed: 0.26 },
];

const Cloud: React.FC<{ x: number; y: number; z: number; scale: number; speed: number }> = ({
  x,
  y,
  z,
  scale,
  speed,
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const min = -40;
    const max = 40;
    if (!ref.current) return;
    let nx = ref.current.position.x + speed * clock.getDelta();
    if (nx > max) nx = min;
    ref.current.position.x = nx;
  });
  return (
    <group ref={ref} position={[x, y, z]} scale={scale}>
      <mesh>
        <sphereGeometry args={[1.4, 12, 9]} />
        <meshStandardMaterial color={P.cloud} roughness={1} flatShading />
      </mesh>
      <mesh position={[1.15, -0.25, 0]}>
        <sphereGeometry args={[1.0, 12, 9]} />
        <meshStandardMaterial color={P.cloud} roughness={1} flatShading />
      </mesh>
      <mesh position={[-1.15, -0.15, 0]}>
        <sphereGeometry args={[0.95, 12, 9]} />
        <meshStandardMaterial color={P.cloud} roughness={1} flatShading />
      </mesh>
    </group>
  );
};

const SkyDress: React.FC = () => (
  <>
    {/* Warm sun */}
    <mesh position={[42, 40, -38]}>
      <sphereGeometry args={[6, 24, 24]} />
      <meshBasicMaterial color={P.sun} />
    </mesh>
    <mesh position={[42, 40, -38]}>
      <sphereGeometry args={[7.6, 24, 24]} />
      <meshBasicMaterial color={P.sun} transparent opacity={0.22} />
    </mesh>
    {/* Drifting clouds */}
    {CLOUDS.map((c, i) => (
      <Cloud key={i} {...c} />
    ))}
  </>
);

interface GameWorldProps {
  selected: string | null;
  onSelect: (key: string) => void;
  /** Bump to snap the camera back into auto-rotation (EXPLORE WORLD). */
  exploreNonce: number;
}

export const GameWorld: React.FC<GameWorldProps> = ({ selected, onSelect, exploreNonce }) => {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    setInteracted(false);
  }, [exploreNonce]);

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ position: [16, 17.5, 16], fov: 36 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.6]}
      >
        {/* Bright day sky */}
        <color attach="background" args={[P.sky]} />
        <fog attach="fog" args={[P.sky, 46, 95]} />

        <SkyDress />

        {/* Sunlit lighting */}
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#CDE9FF', '#6FBF6D']} intensity={0.55} />
        <directionalLight
          position={[14, 24, 10]}
          intensity={1.3}
          color="#FFF3DC"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-34}
          shadow-camera-right={34}
          shadow-camera-top={34}
          shadow-camera-bottom={-34}
          shadow-camera-near={2}
          shadow-camera-far={70}
          shadow-bias={-0.0004}
        />

        {/* Isometric-style orbit camera */}
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={7}
          maxDistance={32}
          minPolarAngle={0.35}
          maxPolarAngle={1.22}
          enablePan
          panSpeed={0.6}
          autoRotate={!selected && !interacted}
          autoRotateSpeed={0.45}
          onStart={() => setInteracted(true)}
        />

        <Environment />
        <Hub />
        <WorldBuildings selected={selected} onSelect={onSelect} />
        <Trees />
        <Coins />
        <Props />
        <Vehicles />
      </Canvas>
    </div>
  );
};