import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_PALETTE as P } from './palette';
import { WORLD_LOCATIONS, type BuildingKind, type WorldLocation } from './worldConfig';
import { SpriteLabel } from './labels';
import { LocationIcon, LocationFloorGlow } from './LocationIcons';

/* ------------------------------------------------------------------ */
/*  Building models (drawn in local space; entrance faces +z)          */
/* ------------------------------------------------------------------ */

const CrossingSchool: React.FC = () => {
  return (
    <group>
      {/* Asphalt pad with zebra crossing */}
      <mesh position={[0, 0.06, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.9, 1.7]} />
        <meshStandardMaterial color="#3A4150" roughness={0.9} />
      </mesh>
      {[-0.45, -0.15, 0.15, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.065, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, 1.5]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
        </mesh>
      ))}

      {/* Traffic signal with three lamps */}
      <group position={[-0.85, 0, 0.15]}>
        <mesh position={[0, 0.95, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 1.9, 8]} />
          <meshStandardMaterial color="#5B6472" />
        </mesh>
        <mesh position={[0, 1.95, 0]} castShadow>
          <boxGeometry args={[0.32, 0.62, 0.2]} />
          <meshStandardMaterial color="#2B2F36" />
        </mesh>
        {[
          { y: 2.14, c: '#FF5B5B' },
          { y: 1.95, c: '#F6C945' },
          { y: 1.76, c: '#53C270' },
        ].map((lamp) => (
          <mesh key={lamp.y} position={[0, lamp.y, 0.11]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial color={lamp.c} emissive={lamp.c} emissiveIntensity={1.4} />
          </mesh>
        ))}
      </group>

      {/* Toy car heading away from the crossing */}
      <group position={[0.6, 0, 0.95]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.42, 0.16, 0.28]} />
          <meshStandardMaterial color="#4FC3F7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.22, 0.12, 0.22]} />
          <meshStandardMaterial color="#D9F6FF" />
        </mesh>
      </group>

      {/* Pedestrian figure */}
      <group position={[-0.35, 0, 0.85]}>
        <mesh position={[0, 0.28, 0]}>
          <capsuleGeometry args={[0.06, 0.16, 4, 8]} />
          <meshStandardMaterial color="#F26D9A" />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshStandardMaterial color="#FFD7C2" />
        </mesh>
      </group>
    </group>
  );
};

const TransitStop: React.FC = () => {
  return (
    <group position={[0, 0, 0.45]}>
      <mesh position={[0, 1.55, 0]} rotation={[0.06, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 0.12, 0.95]} />
        <meshStandardMaterial color="#5B6472" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.8, -0.42]}>
        <boxGeometry args={[1.9, 1.55, 0.07]} />
        <meshStandardMaterial color="#D9E4F0" transparent opacity={0.5} />
      </mesh>
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, 0.75, -0.32]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
          <meshStandardMaterial color="#5B6472" />
        </mesh>
      ))}
      <mesh position={[0, 0.3, 0.25]}>
        <boxGeometry args={[1.1, 0.08, 0.34]} />
        <meshStandardMaterial color="#8A5A3B" />
      </mesh>
      <mesh position={[0.75, 1.15, 0.1]} rotation={[0, -0.5, 0]}>
        <boxGeometry args={[0.55, 0.3, 0.05]} />
        <meshStandardMaterial color="#F6C945" />
      </mesh>
    </group>
  );
};

const SavingsBank: React.FC = () => {
  const coinRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (coinRef.current) coinRef.current.rotation.y = state.clock.elapsedTime * 1.6;
  });

  return (
    <group>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[1.9, 1.5, 1.6]} />
        <meshStandardMaterial color="#F6C945" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <cylinderGeometry args={[1.08, 1.28, 0.55, 4]} />
        <meshStandardMaterial color="#F4A63C" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.08, 0]}>
        <boxGeometry args={[1.9, 0.14, 1.7]} />
        <meshStandardMaterial color="#E3922E" />
      </mesh>
      <mesh ref={coinRef} position={[0, 2.35, 0.05]}>
        <cylinderGeometry args={[0.3, 0.3, 0.09, 20]} />
        <meshStandardMaterial color="#FFE28A" emissive="#E8A52E" emissiveIntensity={0.4} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.45, 0.82]} castShadow>
        <boxGeometry args={[0.62, 0.9, 0.08]} />
        <meshStandardMaterial color="#7A4A22" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.85, 0.87]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color="#FFDA5B" />
      </mesh>
      {[0.55, -0.55].map((x) => (
        <mesh key={x} position={[x, 0.85, 0.81]}>
          <boxGeometry args={[0.42, 0.4, 0.05]} />
          <meshStandardMaterial color="#9AD6F0" roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const MarketStall: React.FC = () => {
  return (
    <group position={[0, 0, 0.3]}>
      {[-0.55, -0.18, 0.18, 0.55].map((x, i) => (
        <mesh key={x} position={[x, 1.55, 0]} rotation={[0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.1, 1.25]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#F3F4F6' : '#53C270'} roughness={0.7} />
        </mesh>
      ))}
      {[
        [-0.85, 0.5],
        [0.85, 0.5],
        [-0.85, -0.5],
        [0.85, -0.5],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.85, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.7, 8]} />
          <meshStandardMaterial color="#7A4A22" />
        </mesh>
      ))}
      <mesh position={[0, 0.5, 0.15]}>
        <boxGeometry args={[1.7, 0.16, 0.75]} />
        <meshStandardMaterial color="#C79A6B" roughness={0.8} />
      </mesh>
      <group position={[-0.75, 0.6, -0.25]}>
        {[
          [0, 0, '#F26D6B'],
          [0.18, 0, '#F6C945'],
          [0, 0.18, '#7CC76B'],
        ].map(([x, z, c], i) => (
          <mesh key={i} position={[x as number, 0.09, z as number]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color={c as string} roughness={0.5} />
          </mesh>
        ))}
      </group>
      <mesh position={[0.75, 1.25, 0.1]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.5, 0.28, 0.05]} />
        <meshStandardMaterial color="#FFE28A" />
      </mesh>
    </group>
  );
};

const CommunityHall: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[1.0, 1.1, 1.6, 22]} />
        <meshStandardMaterial color="#F8A9C1" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[1.02, 22, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#F26D9A" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.18, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#FFDA5B" emissive="#E8A52E" emissiveIntensity={0.4} />
      </mesh>
      <group position={[0, 0, 0.94]}>
        <mesh position={[0, 0.62, 0.06]}>
          <boxGeometry args={[0.62, 0.85, 0.08]} />
          <meshStandardMaterial color="#B65B8C" />
        </mesh>
        <mesh position={[0, 1.02, 0.06]}>
          <sphereGeometry args={[0.31, 14, 14, 0, Math.PI, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#B65B8C" />
        </mesh>
      </group>
      {[0.55, -0.55].map((x) => (
        <mesh key={x} position={[x, 0.9, 0.8]} rotation={[0, 0.35 * (x > 0 ? 1 : -1), 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#9AD6F0" roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const OfficeHub: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.5, 1.4, 1.4]} />
        <meshStandardMaterial color="#8F82F0" roughness={0.5} />
      </mesh>
      <mesh position={[0.95, 0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 1.0, 1.1]} />
        <meshStandardMaterial color="#7C6CE8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.46, 0]}>
        <boxGeometry args={[1.62, 0.12, 1.52]} />
        <meshStandardMaterial color="#5B4FC0" />
      </mesh>
      {[0.45, 0, -0.45].map((z, zi) =>
        [-0.5, 0, 0.5].map((x) => (
          <mesh key={`${zi}${x}`} position={[x, 0.75, 0.71 + z * 0.28]}>
            <boxGeometry args={[0.16, 0.18, 0.03]} />
            <meshStandardMaterial color="#C8F0FF" roughness={0.15} />
          </mesh>
        ))
      )}
      <mesh position={[0, 0.42, 0.72]} castShadow>
        <boxGeometry args={[0.62, 0.84, 0.1]} />
        <meshStandardMaterial color="#F3F4F6" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, 0.78]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshBasicMaterial color="#FFDA5B" />
      </mesh>
    </group>
  );
};

const EmergencyStation: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[2.0, 1.5, 1.7]} />
        <meshStandardMaterial color="#F05A4E" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[2.0, 0.16, 1.7]} />
        <meshStandardMaterial color="#D94B40" />
      </mesh>
      <group position={[0, 1.92, 0.9]}>
        <mesh>
          <boxGeometry args={[0.5, 0.14, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.14, 0.5, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      <mesh position={[0, 0.6, 0.86]} castShadow>
        <boxGeometry args={[1.15, 1.2, 0.08]} />
        <meshStandardMaterial color="#D9E4F0" transparent opacity={0.65} />
      </mesh>
      <group position={[0.55, 0, 1.15]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.72, 0.24, 0.45]} />
          <meshStandardMaterial color="#FF5B5B" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[0.4, 0.15, 0.35]} />
          <meshStandardMaterial color="#FFD9D9" />
        </mesh>
        {[-0.24, 0.24].map((x) =>
          [-0.18, 0.18].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.08, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.05, 8]} />
              <meshStandardMaterial color="#2B2F36" />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
};

const BuildingModel: React.FC<{ kind: BuildingKind }> = ({ kind }) => {
  switch (kind) {
    case 'crossingSchool':
      return <CrossingSchool />;
    case 'transitStop':
      return <TransitStop />;
    case 'savingsBank':
      return <SavingsBank />;
    case 'marketStall':
      return <MarketStall />;
    case 'communityHall':
      return <CommunityHall />;
    case 'officeHub':
      return <OfficeHub />;
    case 'emergencyStation':
      return <EmergencyStation />;
  }
};

/* ------------------------------------------------------------------ */
/*  Interactive location wrapped in a clickable marker                 */
/* ------------------------------------------------------------------ */

interface LocationMarkerProps {
  location: WorldLocation;
  isSelected: boolean;
  onSelect: (key: string) => void;
}

/** Height of the floating icon marker above the location's ground tile. */
const ICON_BASE_Y = 3.3;
/** Always-visible nameplate height. */
const NAME_Y = 5.9;

export const LocationMarker: React.FC<LocationMarkerProps> = ({ location, isSelected, onSelect }) => {
  const rootRef = useRef<THREE.Group>(null);
  const iconRef = useRef<THREE.Group>(null);
  const liftRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Per-location phase so nearby icons bob out of sync.
  const phase = useMemo(() => {
    let s = 0;
    for (const ch of location.key) s = (s * 31 + ch.charCodeAt(0)) % 997;
    return s;
  }, [location.key]);

  const active = hovered || isSelected;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const icon = iconRef.current;
    const lift = liftRef.current;
    const root = rootRef.current;
    if (!icon || !lift || !root) return;

    // Always turn the icon's front face toward the main camera so it can be
    // recognisable from every orbit angle.
    const world = new THREE.Vector3();
    root.getWorldPosition(world);
    icon.rotation.y = Math.atan2(state.camera.position.x - world.x, state.camera.position.z - world.z);

    // Soft floating / bobbing animation.
    const bob = Math.sin(t * 1.7 + phase) * 0.16;
    const bobBoost = active ? 1.35 : 1;

    // Gentle lift + emphasis when hovered / selected.
    const targetY = ICON_BASE_Y + bob * bobBoost + (active ? 0.28 : 0);
    lift.position.y += (targetY - lift.position.y) * 0.12;

    // Grow slightly as the player approaches, and a bit more on hover/selection.
    const dist = state.camera.position.distanceTo(world);
    const prox = THREE.MathUtils.clamp(1 - (dist - 12) / 9, 0, 1);
    const targetScale = 1 + prox * 0.16 + (active ? 0.16 : 0);
    icon.scale.x += (targetScale - icon.scale.x) * 0.16;
    icon.scale.y += (targetScale - icon.scale.y) * 0.16;
    icon.scale.z += (targetScale - icon.scale.z) * 0.16;
  });

  return (
    <group
      ref={rootRef}
      position={location.position}
      rotation={[0, location.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(location.key);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Porch tile */}
      <mesh position={[0, 0.06, 0.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.6, 2.4]} />
        <meshStandardMaterial color={P.sidewalkLine} roughness={0.95} />
      </mesh>

      <BuildingModel kind={location.buildingKind} />

      {/* Soft circular highlight on the ground under the location */}
      <LocationFloorGlow accent={location.accent} />

      {/* Large recognizable 3D icon, floating + bobbing above the building */}
      <group ref={liftRef}>
        <group ref={iconRef}>
          <LocationIcon buildingKind={location.buildingKind} accent={location.accent} />
        </group>
      </group>

      {/* Floating nameplate — always on, readable from the camera distance */}
      {active ? (
        <SpriteLabel
          key={`label-active-${location.key}`}
          text={location.name}
          subtext={location.blurb}
          position={[0, NAME_Y, 0]}
          color={location.accent}
          scale={1.15}
        />
      ) : (
        <SpriteLabel
          key={`label-inactive-${location.key}`}
          text={location.short}
          position={[0, NAME_Y, 0]}
          color={location.accent}
          scale={1.4}
        />
      )}

      {/* Invisible oversized hit-box so clicking near the marker is easy */}
      <mesh position={[0, 2.5, 0.45]}>
        <cylinderGeometry args={[2.3, 2.5, 5.2, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/*  All world locations group                                          */
/* ------------------------------------------------------------------ */

interface BuildingsProps {
  selected: string | null;
  onSelect: (key: string) => void;
}

export const WorldBuildings: React.FC<BuildingsProps> = ({ selected, onSelect }) => {
  return (
    <>
      {WORLD_LOCATIONS.map((location) => (
        <LocationMarker
          key={location.key}
          location={location}
          isSelected={selected === location.key}
          onSelect={onSelect}
        />
      ))}
    </>
  );
};