import React from 'react';
import * as THREE from 'three';
import { WORLD_PALETTE as P } from './palette';

/** Ground base, ring road, sidewalks, plaza and park details. */
export const Environment: React.FC = () => {
  return (
    <group>
      {/* Grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[130, 130]} />
        <meshStandardMaterial color={P.grass} roughness={0.95} metalness={0} />
      </mesh>

      {/* Soft lighter grass patches for texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[22, 0.005, -18]} receiveShadow>
        <circleGeometry args={[11, 40]} />
        <meshStandardMaterial color={P.grassLight} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-24, 0.005, 20]} receiveShadow>
        <circleGeometry args={[12, 40]} />
        <meshStandardMaterial color={P.grassLight} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-26, 0.005, -22]} receiveShadow>
        <circleGeometry args={[9, 40]} />
        <meshStandardMaterial color={P.grassLight} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[26, 0.005, 24]} receiveShadow>
        <circleGeometry args={[10, 40]} />
        <meshStandardMaterial color={P.grassLight} roughness={0.95} />
      </mesh>

      {/* Directional main roads (bright blue), forming a cross beyond the ring */}
      {[
        { x: 0, z: 46, w: 2.4, h: 66 },
        { x: 0, z: -46, w: 2.4, h: 66 },
        { x: 46, z: 0, w: 66, h: 2.4 },
        { x: -46, z: 0, w: 66, h: 2.4 },
      ].map((road, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[road.x, 0.01, road.z]} receiveShadow>
          <planeGeometry args={[road.w, road.h]} />
          <meshStandardMaterial color={P.road} roughness={0.9} />
        </mesh>
      ))}

      {/* Ring road around the town (animulus) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <ringGeometry args={[11.0, 13.2, 64]} />
        <meshStandardMaterial color={P.road} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Road edge lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[10.98, 11.0, 64]} />
        <meshBasicMaterial color={P.roadEdge} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[13.2, 13.22, 64]} />
        <meshBasicMaterial color={P.roadEdge} />
      </mesh>

      {/* Sidewalk ring between plaza and road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <ringGeometry args={[6.6, 10.7, 64]} />
        <meshStandardMaterial color={P.sidewalk} roughness={0.9} />
      </mesh>

      {/* Playground / park pond outside the ring */}
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[17, 0.02, -15]} receiveShadow>
          <circleGeometry args={[2.9, 40]} />
          <meshStandardMaterial color={P.grassDark} roughness={0.95} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[17, 0.06, -15]}>
          <circleGeometry args={[2.1, 40]} />
          <meshStandardMaterial color={P.water} roughness={0.35} metalness={0.1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[17, 0.075, -15]}>
          <circleGeometry args={[1.5, 40]} />
          <meshStandardMaterial color={P.waterDeep} transparent opacity={0.55} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};