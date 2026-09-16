import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_PALETTE as P } from './palette';
import { WORLD_LOCATIONS } from './worldConfig';

interface CoinSpot {
  x: number;
  z: number;
  phase: number;
}

function buildCoinSpots(): CoinSpot[] {
  const spots: CoinSpot[] = [];

  // Coins leading to each building entrance (porch side, facing plaza)
  WORLD_LOCATIONS.forEach((loc, i) => {
    const [x, , z] = loc.position;
    const toCenter = -1 / Math.sqrt(x * x + z * z) || 1;
    for (let k = 0; k < 3; k++) {
      const t = 0.5 + k * 0.42;
      spots.push({
        x: x + x * toCenter * t,
        z: z + z * toCenter * t,
        phase: i * 3 + k,
      });
    }
  });

  // Scattered rewards along the grass ring
  const arc = 10;
  for (let i = 0; i < arc; i++) {
    const a = (i / arc) * Math.PI * 2 + 0.3;
    const r = 5.7;
    spots.push({ x: Math.cos(a) * r, z: Math.sin(a) * r * 1.05, phase: 60 + i });
  }

  // A few near the pond park
  [[15.5, -11.6], [18.6, -12.4], [20, -17.6], [12.9, -18.4]].forEach(([x, z], i) => {
    spots.push({ x, z, phase: 80 + i });
  });

  return spots;
}

/** Instanced spinning coins — collectible rewards scattered across the world. */
export const Coins: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const spots = useMemo(buildCoinSpots, []);

  const geometry = useMemo(() => new THREE.CylinderGeometry(0.19, 0.19, 0.06, 18), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: P.coin,
        emissive: P.coinEdge,
        emissiveIntensity: 0.35,
        metalness: 0.55,
        roughness: 0.25,
      }),
    []
  );

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    spots.forEach((spot, i) => {
      dummy.position.set(spot.x, 0.18, spot.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  }, [spots]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    spots.forEach((spot, i) => {
      dummy.position.set(spot.x, 0.2 + Math.sin(t * 1.8 + spot.phase) * 0.12, spot.z);
      dummy.rotation.set(0.5, t * 2.2 + spot.phase, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, spots.length]} />;
};