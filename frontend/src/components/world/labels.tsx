import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface SpriteLabelProps {
  /** Main title shown in bold. */
  text: string;
  /** Optional secondary line (e.g. a short description). */
  subtext?: string;
  position: [number, number, number];
  color?: string;
  /** World-units height of the label. */
  scale?: number;
}

const CANVAS_W = 512;
const TITLE_H = 116;
const SUB_H = 264;

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  let wordIdx = 0;
  for (wordIdx = 0; wordIdx < words.length; wordIdx++) {
    const word = words[wordIdx];
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      if (lines.length >= maxLines) break;
      line = word;
    } else {
      line = candidate;
    }
  }
  if (wordIdx >= words.length && line) lines.push(line);
  if (wordIdx < words.length) {
    const last = lines.length - 1;
    lines[last] = `${lines[last].replace(/…$/, '')}…`;
  }
  return lines;
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeLabelMaterial(text: string, color: string, subtext?: string): THREE.SpriteMaterial {
  const hasSub = Boolean(subtext);
  const height = hasSub ? SUB_H : TITLE_H;
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, CANVAS_W, height);
    const padX = 16;
    const padY = 14;
    roundRectPath(ctx, padX / 2, padY / 2, CANVAS_W - padX, height - padY, hasSub ? 26 : 30);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fill();
    ctx.lineWidth = hasSub ? 6 : 7;
    ctx.strokeStyle = color;
    ctx.stroke();

    if (!hasSub) {
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 56px system-ui, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, CANVAS_W / 2, height / 2 + 2, CANVAS_W - padX - 24);
    } else {
      // Title on top, dashed divider, wrapped description below.
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 44px system-ui, "Segoe UI", sans-serif';
      ctx.fillText(text, CANVAS_W / 2, 66, CANVAS_W - padX - 24);

      ctx.strokeStyle = 'rgba(148,163,184,0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(44, 104);
      ctx.lineTo(CANVAS_W - 44, 104);
      ctx.stroke();
      ctx.setLineDash([]);

      const maxWidth = CANVAS_W - padX - 40;
      const lines = wrapLines(ctx, subtext!, maxWidth, 3);
      ctx.font = 'normal 27px system-ui, "Segoe UI", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      lines.forEach((line, i) => {
        ctx.fillText(line, CANVAS_W / 2, 138 + i * 38, maxWidth);
      });
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
  material.rotation = 0;
  return material;
}

/**
 * A camera-facing floating label rendered from a canvas texture.
 * Uses system fonts so no external font/asset downloads are needed.
 * Always faces the camera and ignores depth, so it stays readable over
 * buildings, trees and other world objects.
 */
export const SpriteLabel: React.FC<SpriteLabelProps> = ({ text, subtext, position, color = '#F6C945', scale = 1.6 }) => {
  const material = useMemo(() => makeLabelMaterial(text, color, subtext), [text, color, subtext]);
  const ratio = CANVAS_W / (subtext ? SUB_H : TITLE_H);
  const h = scale * 0.7;

  useEffect(() => {
    return () => {
      material.map?.dispose();
      material.dispose();
    };
  }, [material]);

  return (
    <sprite
      position={position}
      scale={[h * ratio, h, 1]}
      material={material}
      renderOrder={999}
      frustumCulled={false}
    />
  );
};