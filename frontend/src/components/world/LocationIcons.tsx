import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BuildingKind } from './worldConfig';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function makeGlowTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const [r, g, b] = hexToRgb(color);
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.6)`);
    grad.addColorStop(0.5, `rgba(${r},${g},${b},0.24)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* A neutral pedestal every icon sits on — keeps proportions consistent. */
const IconPedestal: React.FC<{ accent: string }> = ({ accent }) => (
  <group>
    <mesh position={[0, 0.06, 0]} castShadow>
      <cylinderGeometry args={[0.72, 0.8, 0.12, 24]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.13, 0]}>
      <cylinderGeometry args={[0.72, 0.72, 0.03, 24]} />
      <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.021, 0]}>
      <torusGeometry args={[0.76, 0.035, 8, 28]} />
      <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} roughness={0.4} />
    </mesh>
  </group>
);

/* ------------------------------------------------------------------ */
/*  School / road-safety icon — school house with a mini traffic light */
/* ------------------------------------------------------------------ */

const SchoolIcon: React.FC = () => (
  <group position={[0, 0.16, 0]} scale={0.82}>
    <mesh position={[0, 0.66, 0]}>
      <boxGeometry args={[1.5, 1.02, 1.0]} />
      <meshStandardMaterial color="#FFE0A3" roughness={0.55} flatShading />
    </mesh>
    {/* Slate roof */}
    <mesh position={[0, 1.42, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[0.98, 0.52, 4]} />
      <meshStandardMaterial color="#F05A4E" roughness={0.5} flatShading />
    </mesh>
    {/* Roof knob */}
    <mesh position={[0, 1.78, 0]}>
      <sphereGeometry args={[0.11, 12, 12]} />
      <meshStandardMaterial color="#FFD166" emissive="#E8A52E" emissiveIntensity={0.3} />
    </mesh>
    {/* Clock */}
    <mesh position={[0, 0.78, 0.505]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.19, 0.19, 0.04, 20]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
    </mesh>
    <mesh position={[0, 0.78, 0.53]}>
      <boxGeometry args={[0.14, 0.03, 0.01]} />
      <meshBasicMaterial color="#F05A4E" />
    </mesh>
    <mesh position={[0, 0.84, 0.53]}>
      <boxGeometry args={[0.03, 0.14, 0.01]} />
      <meshBasicMaterial color="#F05A4E" />
    </mesh>
    {/* Door */}
    <mesh position={[0, 0.32, 0.507]}>
      <boxGeometry args={[0.42, 0.52, 0.04]} />
      <meshStandardMaterial color="#7A4A22" roughness={0.7} />
    </mesh>
    <mesh position={[0.16, 0.32, 0.535]}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color="#FFDA5B" />
    </mesh>
    {/* Mini crossing-sign (road safety) */}
    <group position={[0.82, 0.5, 0]}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.45, 8]} />
        <meshStandardMaterial color="#5B6472" />
      </mesh>
      <mesh position={[0.06, 0.46, 0]}>
        <boxGeometry args={[0.2, 0.36, 0.05]} />
        <meshStandardMaterial color="#2B2F36" />
      </mesh>
      <mesh position={[0.06, 0.52, 0.035]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#FF5B5B" emissive="#FF5B5B" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.06, 0.4, 0.035]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#53C270" emissive="#53C270" emissiveIntensity={1.2} />
      </mesh>
    </group>
  </group>
);

/* ------------------------------------------------------------------ */
/*  Public transport icon — friendly city bus                          */
/* ------------------------------------------------------------------ */

const BusIcon: React.FC = () => (
  <group position={[0, 0.16, 0]}>
    {/* Body */}
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1.7, 0.62, 0.92]} />
      <meshStandardMaterial color="#FFA23B" roughness={0.4} flatShading />
    </mesh>
    {/* Roof */}
    <mesh position={[0, 0.9, 0]}>
      <boxGeometry args={[1.7, 0.14, 0.96]} />
      <meshStandardMaterial color="#E07F1F" roughness={0.5} flatShading />
    </mesh>
    {/* Window band */}
    <mesh position={[0, 0.7, 0.01]}>
      <boxGeometry args={[1.64, 0.28, 0.7]} />
      <meshStandardMaterial color="#FFF3CC" roughness={0.3} />
    </mesh>
    {/* Front windshield + windows */}
    <mesh position={[0, 0.7, 0.475]}>
      <boxGeometry args={[1.5, 0.24, 0.03]} />
      <meshStandardMaterial color="#9BD8F0" roughness={0.2} metalness={0.2} />
    </mesh>
    {/* Route sign */}
    <mesh position={[0, 0.78, 0.5]}>
      <boxGeometry args={[0.44, 0.14, 0.05]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
    </mesh>
    {/* Body stripe */}
    <mesh position={[0, 0.4, 0.465]}>
      <boxGeometry args={[1.62, 0.09, 0.03]} />
      <meshStandardMaterial color="#FF8126" roughness={0.4} />
    </mesh>
    {/* Wheels */}
    {[-0.5, 0.5].map((x) => (
      <React.Fragment key={x}>
        <mesh position={[x, 0.18, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
          <meshStandardMaterial color="#2B2F36" roughness={0.6} />
        </mesh>
        <mesh position={[x, 0.18, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
          <meshStandardMaterial color="#2B2F36" roughness={0.6} />
        </mesh>
      </React.Fragment>
    ))}
    {/* Headlights */}
    <mesh position={[-0.6, 0.36, 0.47]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#FFF8C9" />
    </mesh>
    <mesh position={[0.6, 0.36, 0.47]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#FFF8C9" />
    </mesh>
  </group>
);

/* ------------------------------------------------------------------ */
/*  Finance icon — giant gold coin in front of a small bank             */
/* ------------------------------------------------------------------ */

const SpinningCoin: React.FC<{ position: [number, number, number]; radius: number }> = ({ position, radius }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 1.5;
  });
  return (
    <group ref={ref} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, 0.09, 24]} />
        <meshStandardMaterial color="#F7C948" emissive="#E8A52E" emissiveIntensity={0.35} metalness={0.6} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.047]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.42, radius * 0.55, 24]} />
        <meshBasicMaterial color="#FFF3C4" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, radius * 0.32, 0.05]}>
        <boxGeometry args={[radius * 0.16, radius * 0.4, 0.01]} />
        <meshBasicMaterial color="#FFF3C4" />
      </mesh>
      <mesh position={[0, -radius * 0.32, 0.05]}>
        <boxGeometry args={[radius * 0.16, radius * 0.4, 0.01]} />
        <meshBasicMaterial color="#FFF3C4" />
      </mesh>
    </group>
  );
};

const BankIcon: React.FC = () => (
  <group position={[0, 0.16, 0]}>
    {/* Bank building (behind) */}
    <group position={[0.28, 0, -0.22]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.25, 0.6, 0.85]} />
        <meshStandardMaterial color="#F6C945" roughness={0.55} flatShading />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.34, 0.12, 0.95]} />
        <meshStandardMaterial color="#E8A52E" roughness={0.5} flatShading />
      </mesh>
      {/* Columns */}
      {[-0.42, 0, 0.42].map((x) => (
        <mesh key={x} position={[x, 0.52, 0.43]}>
          <cylinderGeometry args={[0.06, 0.065, 0.55, 10]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[-0.28, 0.32, 0.42]}>
        <boxGeometry args={[0.26, 0.3, 0.03]} />
        <meshStandardMaterial color="#7A4A22" roughness={0.7} />
      </mesh>
    </group>
    {/* Big spinning coin */}
    <SpinningCoin position={[-0.42, 0.62, 0.28]} radius={0.46} />
    {/* Side coin stack */}
    <mesh position={[0.62, 0.4, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 0.07, 16]} />
      <meshStandardMaterial color="#F7C948" emissive="#E8A52E" emissiveIntensity={0.3} metalness={0.6} roughness={0.22} />
    </mesh>
    <mesh position={[0.62, 0.53, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 0.07, 16]} />
      <meshStandardMaterial color="#FFD166" emissive="#E8A52E" emissiveIntensity={0.3} metalness={0.6} roughness={0.22} />
    </mesh>
  </group>
);

/* ------------------------------------------------------------------ */
/*  Shopping icon — grocery basket with fruit                           */
/* ------------------------------------------------------------------ */

const BasketIcon: React.FC = () => (
  <group position={[0, 0.16, 0]}>
    <mesh position={[0, 0.34, 0]}>
      <cylinderGeometry args={[0.62, 0.5, 0.44, 20]} />
      <meshStandardMaterial color="#7CC76B" roughness={0.6} flatShading />
    </mesh>
    <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.62, 0.05, 8, 22]} />
      <meshStandardMaterial color="#4E9E55" roughness={0.5} />
    </mesh>
    {/* Handle arch */}
    <mesh position={[0, 0.56, 0]} rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[0.5, 0.05, 8, 18, Math.PI]} />
      <meshStandardMaterial color="#3F7C44" roughness={0.5} />
    </mesh>
    {/* Apple */}
    <mesh position={[0.24, 0.68, 0.08]}>
      <sphereGeometry args={[0.2, 14, 12]} />
      <meshStandardMaterial color="#E85D5D" roughness={0.4} flatShading />
    </mesh>
    <mesh position={[0.3, 0.86, 0.08]}>
      <boxGeometry args={[0.03, 0.07, 0.03]} />
      <meshStandardMaterial color="#7A4A22" />
    </mesh>
    {/* Orange */}
    <mesh position={[-0.22, 0.66, -0.12]}>
      <sphereGeometry args={[0.18, 14, 12]} />
      <meshStandardMaterial color="#FF9F3D" roughness={0.5} flatShading />
    </mesh>
    {/* Carrot */}
    <mesh position={[-0.08, 0.78, -0.34]} rotation={[0, 0, -0.35]}>
      <coneGeometry args={[0.1, 0.32, 10]} />
      <meshStandardMaterial color="#FF7B3D" roughness={0.5} flatShading />
    </mesh>
    {/* Grapes */}
    {[
      [0.06, 0.64, 0.3],
      [0.18, 0.58, 0.34],
      [0.1, 0.5, 0.3],
      [-0.02, 0.58, 0.3],
    ].map((p, i) => (
      <mesh key={i} position={p as [number, number, number]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color="#9B5DE5" roughness={0.35} flatShading />
      </mesh>
    ))}
  </group>
);

/* ------------------------------------------------------------------ */
/*  Communication icon — chat bubbles                                   */
/* ------------------------------------------------------------------ */

const ChatIcon: React.FC = () => (
  <group position={[0, 0.16, 0]}>
    {/* Back bubble */}
    <mesh position={[0.2, 0.78, -0.16]} scale={[1, 0.84, 1]}>
      <sphereGeometry args={[0.48, 20, 16]} />
      <meshStandardMaterial color="#F9C3DC" roughness={0.5} flatShading />
    </mesh>
    {/* Tail */}
    <mesh position={[-0.18, 0.24, 0.05]} rotation={[0, 0, 0]} scale={[1, 0.8, 1]}>
      <coneGeometry args={[0.16, 0.34, 4]} />
      <meshStandardMaterial color="#F26D9A" roughness={0.5} flatShading />
    </mesh>
    {/* Front bubble */}
    <mesh position={[0.02, 0.74, 0.06]} scale={[1, 0.86, 1]}>
      <sphereGeometry args={[0.5, 20, 16]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.45} flatShading />
    </mesh>
    {/* Ellipsis dots */}
    {[-0.16, 0, 0.16].map((x) => (
      <mesh key={x} position={[x + 0.02, 0.7, 0.56]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#F26D9A" emissive="#F26D9A" emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
    ))}
    {/* Mini second bubble */}
    <mesh position={[0.55, 0.42, 0.22]} scale={[1, 0.8, 1]}>
      <sphereGeometry args={[0.25, 16, 12]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.5} flatShading />
    </mesh>
    {[-0.08, 0.06, 0.2].map((x) => (
      <mesh key={x} position={[x + 0.55, 0.4, 0.48]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#F9A8C8" roughness={0.4} />
      </mesh>
    ))}
  </group>
);

/* ------------------------------------------------------------------ */
/*  Workplace icon — sturdy briefcase                                   */
/* ------------------------------------------------------------------ */

const BriefcaseIcon: React.FC = () => (
  <group position={[0, 0.16, 0]}>
    <mesh position={[0, 0.62, 0]} castShadow>
      <boxGeometry args={[1.5, 0.95, 1.05]} />
      <meshStandardMaterial color="#7C6CE8" roughness={0.45} flatShading />
    </mesh>
    {/* Top rim */}
    <mesh position={[0, 1.12, 0]}>
      <boxGeometry args={[1.54, 0.08, 1.08]} />
      <meshStandardMaterial color="#5B4FC0" roughness={0.5} flatShading />
    </mesh>
    {/* Latch plates */}
    {[-0.3, 0.3].map((x) => (
      <mesh key={x} position={[x, 0.82, 0.53]}>
        <boxGeometry args={[0.2, 0.14, 0.05]} />
        <meshStandardMaterial color="#F6C945" emissive="#E8A52E" emissiveIntensity={0.25} metalness={0.5} roughness={0.3} />
      </mesh>
    ))}
    {/* Handle */}
    <mesh position={[0, 1.28, 0]}>
      <torusGeometry args={[0.28, 0.07, 8, 18, Math.PI]} />
      <meshStandardMaterial color="#5B4FC0" roughness={0.5} />
    </mesh>
  </group>
);

/* ------------------------------------------------------------------ */
/*  Emergency icon — rounded red panel with a white medical cross       */
/* ------------------------------------------------------------------ */

const EmergencyIcon: React.FC = () => {
  const panelGeom = useMemo(() => {
    const s = 0.7;
    const r = 0.24;
    const shape = new THREE.Shape();
    shape.moveTo(-s + r, -s);
    shape.lineTo(s - r, -s);
    shape.quadraticCurveTo(s, -s, s, -s + r);
    shape.lineTo(s, s - r);
    shape.quadraticCurveTo(s, s, s - r, s);
    shape.lineTo(-s + r, s);
    shape.quadraticCurveTo(-s, s, -s, s - r);
    shape.lineTo(-s, -s + r);
    shape.quadraticCurveTo(-s, -s, -s + r, -s);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2,
      steps: 1,
    });
    geo.center();
    return geo;
  }, []);

  return (
    <group position={[0, 0.16, 0]}>
      {/* Soft white backplate ring */}
      <mesh position={[0, 0.86, -0.22]}>
        <torusGeometry args={[0.66, 0.06, 10, 26]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.45} />
      </mesh>
      {/* Rounded red panel */}
      <mesh position={[0, 0.86, -0.12]} geometry={panelGeom}>
        <meshStandardMaterial color="#F05A4E" roughness={0.45} flatShading />
      </mesh>
      {/* White cross */}
      <mesh position={[0, 0.86, 0.15]}>
        <boxGeometry args={[0.28, 0.8, 0.06]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.86, 0.15]}>
        <boxGeometry args={[0.72, 0.28, 0.06]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/*  Icon picker                                                        */
/* ------------------------------------------------------------------ */

export const LocationIcon: React.FC<{ buildingKind: BuildingKind; accent: string }> = ({ buildingKind, accent }) => {
  const glyph = (() => {
    switch (buildingKind) {
      case 'crossingSchool':
        return <SchoolIcon />;
      case 'transitStop':
        return <BusIcon />;
      case 'savingsBank':
        return <BankIcon />;
      case 'marketStall':
        return <BasketIcon />;
      case 'communityHall':
        return <ChatIcon />;
      case 'officeHub':
        return <BriefcaseIcon />;
      case 'emergencyStation':
        return <EmergencyIcon />;
    }
  })();

  return (
    <group>
      <IconPedestal accent={accent} />
      {glyph}
    </group>
  );
};

/* ------------------------------------------------------------------ */
/*  Soft circular glow + pulsing ring on the ground under a location   */
/* ------------------------------------------------------------------ */

export const LocationFloorGlow: React.FC<{ accent: string }> = ({ accent }) => {
  const texture = useMemo(() => makeGlowTexture(accent), [accent]);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + Math.sin(t * 2.2) * 0.25;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(t * 1.6) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={glowRef} position={[0, 0.055, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial map={texture} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.06, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.15, 2.34, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
};