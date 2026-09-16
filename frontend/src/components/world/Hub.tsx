import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_PALETTE as P } from './palette';
import { SpriteLabel } from './labels';

/** Central GameLearn town square: plaza, fountain and two lantern posts. */
export const Hub: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  const geyserRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (waterRef.current) {
      waterRef.current.rotation.z += delta * 0.15;
      const s = 1 + Math.sin(t * 1.4) * 0.04;
      waterRef.current.scale.set(s, s, 1);
    }
    if (geyserRef.current) {
      const gh = 0.55 + Math.sin(t * 2.2) * 0.12;
      geyserRef.current.scale.set(1, gh, 1);
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.5 + Math.sin(t * 1.8) * 0.14;
    }
  });

  return (
    <group>
      {/* Plaza base (warm concrete) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]} receiveShadow>
        <circleGeometry args={[6.4, 48]} />
        <meshStandardMaterial color={P.plaza} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[6.18, 6.4, 48]} />
        <meshBasicMaterial color={P.plazaRing} />
      </mesh>

      {/* Inner grass garden ring around the fountain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
        <ringGeometry args={[3.6, 5.4, 48]} />
        <meshStandardMaterial color={P.grass} roughness={0.95} />
      </mesh>

      {/* Fountain base */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[2.1, 2.3, 0.28, 32]} />
        <meshStandardMaterial color={P.stone} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[2.12, 2.12, 0.05, 32]} />
        <meshBasicMaterial color={P.stoneDark} />
      </mesh>

      {/* Animated water pool */}
      <mesh ref={waterRef} position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.75, 32]} />
        <meshStandardMaterial color={P.water} roughness={0.25} metalness={0.1} transparent opacity={0.92} />
      </mesh>

      {/* Center geyser */}
      <mesh ref={geyserRef} position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.18, 0.3, 1.15, 16]} />
        <meshStandardMaterial color={P.waterDeep} transparent opacity={0.85} roughness={0.2} />
      </mesh>

      {/* Gentle light beam */}
      <mesh ref={beamRef} position={[0, 1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.85, 24]} />
        <meshBasicMaterial color="#CFEFFF" transparent opacity={0.5} depthWrite={false} />
      </mesh>

      {/* Friendly top sphere */}
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color={P.hubLight} emissive={P.hub} emissiveIntensity={0.35} roughness={0.4} />
      </mesh>

      {/* Flower circles around the garden */}
      {[
        [0, 5.85],
        [5.85, 0],
        [0, -5.85],
        [-5.85, 0],
        [4.14, 4.14],
        [-4.14, -4.14],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.05, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.32, 20]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#FF8FA3' : '#FFD166'} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}

      {/* GAMELEARN town sign + lantern posts */}
      <group position={[0, 0, 6.35]}>
        <mesh position={[0.9, 1.15, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 2.3, 10]} />
          <meshStandardMaterial color="#8A5A3B" />
        </mesh>
        <mesh position={[-0.9, 1.15, 0]}>
          <cylinderGeometry args={[0.06, 0.07, 2.3, 10]} />
          <meshStandardMaterial color="#8A5A3B" />
        </mesh>
        <mesh position={[0, 1.85, 0]}>
          <boxGeometry args={[2.4, 0.55, 0.22]} />
          <meshStandardMaterial color="#8A5A3B" />
        </mesh>
        <SpriteLabel text="GAMELEARN" position={[0, 2.5, 0]} color={P.hub} scale={1.3} />
      </group>

      {/* Two street lanterns on the plaza */}
      {[
        [3.9, 4.6],
        [-3.9, -4.6],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 2.4, 10]} />
            <meshStandardMaterial color="#5B6472" />
          </mesh>
          <mesh position={[0, 2.45, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#FFF3B0" emissive="#FFD166" emissiveIntensity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};