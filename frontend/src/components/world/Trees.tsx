import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { WORLD_PALETTE as P } from './palette';

interface TreeSpot {
  position: [number, number];
  scale: number;
  sway: number;
}

function buildTreeSpots(): TreeSpot[] {
  const spots: TreeSpot[] = [];

  // Park cluster around the pond
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    spots.push({ position: [17 + Math.cos(a) * 3.7, -15 + Math.sin(a) * 3.7], scale: 1.05, sway: i });
  }
  // Three other park corners
  const corners: [number, number][] = [
    [19, 19],
    [-20, 20],
    [-20, -20],
    [20, -27],
  ];
  corners.forEach((pos, s) => {
    const i = s * 4;
    spots.push({ position: pos, scale: 1.1, sway: i });
    spots.push({ position: [pos[0] + 2.2, pos[1] - 1.8], scale: 0.9, sway: i + 1 });
    spots.push({ position: [pos[0] - 2.1, pos[1] + 1.7], scale: 0.76, sway: i + 2 });
  });

  // Light woodland in the gaps between buildings
  const angles = [0.35, 0.9, 1.35, 1.85, 2.4, 2.95, 3.5, 4.1, 4.7, 5.25, 5.7, 6.1];
  angles.forEach((a, i) => {
    const r = 14.2 + (i % 3) * 1.9;
    spots.push({ position: [Math.cos(a) * r, Math.sin(a) * r], scale: 0.9 - (i % 4) * 0.08, sway: i + 10 });
  });

  return spots;
}

/** Instanced low-poly trees for high count at low draw calls. */
export const Trees: React.FC = () => {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);
  const canopyTopRef = useRef<THREE.InstancedMesh>(null);

  const spots = useMemo(buildTreeSpots, []);

  const trunkGeom = useMemo(() => new THREE.CylinderGeometry(0.09, 0.14, 0.55, 7), []);
  const canopyGeom = useMemo(() => new THREE.IcosahedronGeometry(0.62, 0), []);
  const canopyTopGeom = useMemo(() => new THREE.IcosahedronGeometry(0.46, 0), []);
  const trunkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: P.treeTrunk, roughness: 0.9 }), []);
  const canopyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: P.treeCanopy, roughness: 0.85 }), []);
  const canopyTopMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: P.treeCanopyDark, roughness: 0.85 }),
    []
  );

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    spots.forEach((spot, i) => {
      dummy.position.set(spot.position[0], 0.28, spot.position[1]);
      dummy.scale.setScalar(spot.scale);
      dummy.rotation.y = spot.sway;
      dummy.updateMatrix();
      if (trunkRef.current) trunkRef.current.setMatrixAt(i, dummy.matrix);

      dummy.position.set(spot.position[0], 0.72 * spot.scale + 0.55, spot.position[1]);
      dummy.updateMatrix();
      if (canopyRef.current) canopyRef.current.setMatrixAt(i, dummy.matrix);

      dummy.position.set(spot.position[0], (0.72 + 0.5) * spot.scale + 0.55, spot.position[1]);
      dummy.updateMatrix();
      if (canopyTopRef.current) canopyTopRef.current.setMatrixAt(i, dummy.matrix);
    });
    trunkRef.current && (trunkRef.current.instanceMatrix.needsUpdate = true);
    canopyRef.current && (canopyRef.current.instanceMatrix.needsUpdate = true);
    canopyTopRef.current && (canopyTopRef.current.instanceMatrix.needsUpdate = true);
  }, [spots]);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[trunkGeom, trunkMat, spots.length]} castShadow />
      <instancedMesh ref={canopyRef} args={[canopyGeom, canopyMat, spots.length]} castShadow />
      <instancedMesh ref={canopyTopRef} args={[canopyTopGeom, canopyTopMat, spots.length]} castShadow />
    </group>
  );
};