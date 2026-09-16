import type { SkillCategoryKey } from '../../types/domain';
import { LOCATION_COLORS } from './palette';

export type BuildingKind =
  | 'crossingSchool'
  | 'transitStop'
  | 'savingsBank'
  | 'marketStall'
  | 'communityHall'
  | 'officeHub'
  | 'emergencyStation';

export interface WorldLocation {
  key: SkillCategoryKey;
  /** Player-facing name of the location in the world. */
  name: string;
  /** Short name used on floating labels. */
  short: string;
  /** One-line, player-facing description (no technical details). */
  blurb: string;
  /** Position on the sidewalk ring (radius ~8.9). */
  position: [number, number, number];
  /** Rotation so the entrance faces the central plaza. */
  rotationY: number;
  accent: string;
  buildingKind: BuildingKind;
}

const LOCATION_BLURBS: Record<SkillCategoryKey, string> = {
  road_safety:
    'Cross roads safely — watch for traffic, use the signals, and get to the other side without a scratch.',
  public_transport:
    'Plan your ride — read the routes, find your stop, and board the right vehicle for your journey.',
  money_management:
    'Make smart money choices — balance what you spend today with what you want tomorrow.',
  shopping_transactions:
    'Shop like a pro — compare prices, watch the receipts, and get the best value for every coin.',
  communication:
    'Have great conversations — listen carefully, speak up kindly, and connect with the people around you.',
  workplace:
    'Thrive at work — keep your tasks organised, write clearly, and get things done on time.',
  emergency_safety:
    'Stay calm in a crisis — spot danger early, find the exits, and get the right help fast.',
};

const LOCATION_NAMES: Record<SkillCategoryKey, string> = {
  road_safety: 'Crossing School',
  public_transport: 'Transit Stop',
  money_management: 'Savings Bank',
  shopping_transactions: 'Market Plaza',
  communication: 'Community Hall',
  workplace: 'Office Hub',
  emergency_safety: 'Emergency Station',
};

const LOCATION_SHORT: Record<SkillCategoryKey, string> = {
  road_safety: 'Road Safety',
  public_transport: 'Transit',
  money_management: 'Money',
  shopping_transactions: 'Shopping',
  communication: 'Communication',
  workplace: 'Workplace',
  emergency_safety: 'Emergency',
};

export const BUILDING_RADIUS = 8.9;

export const WORLD_LOCATIONS: WorldLocation[] = (() => {
  const keys: SkillCategoryKey[] = [
    'money_management',
    'shopping_transactions',
    'emergency_safety',
    'communication',
    'public_transport',
    'road_safety',
    'workplace',
  ];
  const count = keys.length;
  const step = (2 * Math.PI) / count;
  return keys.map((key, i) => {
    const angle = -Math.PI / 2 + i * step;
    const position: [number, number, number] = [
      Math.cos(angle) * BUILDING_RADIUS,
      0,
      Math.sin(angle) * BUILDING_RADIUS,
    ];
    // Face the entrance back toward the central plaza (origin).
    const rotationY = Math.atan2(-position[0], -position[2]);
    return {
      key,
      name: LOCATION_NAMES[key],
      short: LOCATION_SHORT[key],
      blurb: LOCATION_BLURBS[key],
      position,
      rotationY,
      accent: LOCATION_COLORS[key],
      buildingKind: keyToBuilding(key),
    };
  });
})();

function keyToBuilding(key: SkillCategoryKey): BuildingKind {
  switch (key) {
    case 'money_management':
      return 'savingsBank';
    case 'shopping_transactions':
      return 'marketStall';
    case 'emergency_safety':
      return 'emergencyStation';
    case 'communication':
      return 'communityHall';
    case 'public_transport':
      return 'transitStop';
    case 'road_safety':
      return 'crossingSchool';
    case 'workplace':
      return 'officeHub';
  }
}

export const worldLocationByKey = (key: SkillCategoryKey | string): WorldLocation | undefined =>
  WORLD_LOCATIONS.find((l) => l.key === key);