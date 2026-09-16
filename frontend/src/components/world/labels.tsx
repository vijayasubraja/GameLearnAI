import React, { useMemo } from 'react';
import * as THREE from 'three';

interface SpriteLabelProps {
  text: string;
  position: [number, number, number];
  color?: string;
  /** World-units height/width of the sprite. */
  scale?: number;
}

function makeLabelMaterial(text: string, color: string): THREE.SpriteMaterial {
  const canvas = document.createElement('canvas');
  const padX = 14;
  const padY = 8;
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = 24;
    ctx.beginPath();
    ctx.roundRect(padX / 2, padY / 2, canvas.width - padX, canvas.height - padY, radius);
    ctx.fillStyle = 'rgba(255,255,255,0.94)';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 42px system-ui, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2, canvas.width - padX - 28);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  material.rotation = 0;
  return material;
}

/**
 * A camera-facing floating label rendered from a canvas texture.
 * Uses system fonts so no external font/asset downloads are needed.
 */
export const SpriteLabel: React.FC<SpriteLabelProps> = ({ text, position, color = '#F6C945', scale = 1.6 }) => {
  const material = useMemo(() => makeLabelMaterial(text, color), [text, color]);

  return (
    <sprite
      position={position}
      scale={[scale * 2.6, scale * 0.68, 1]}
      material={material}
      renderOrder={999}
      frustumCulled={false}
    />
  );
};