import type { SkillCategoryKey } from '../../types/domain';

export interface SkillMeta {
  key: SkillCategoryKey;
  name: string;
  short: string;
  code: string;
}

export const SKILL_CATALOG: SkillMeta[] = [
  { key: 'road_safety', name: 'Road & Pedestrian Safety', short: 'Road Safety', code: 'GL-01' },
  { key: 'public_transport', name: 'Public Transportation', short: 'Public Transport', code: 'GL-02' },
  { key: 'money_management', name: 'Money Management', short: 'Money', code: 'GL-03' },
  { key: 'shopping_transactions', name: 'Shopping & Transactions', short: 'Shopping', code: 'GL-04' },
  { key: 'communication', name: 'Communication & Social Interaction', short: 'Communication', code: 'GL-05' },
  { key: 'workplace', name: 'Workplace Skills', short: 'Workplace', code: 'GL-06' },
  { key: 'emergency_safety', name: 'Emergency & Safety', short: 'Emergency', code: 'GL-07' },
];

export const skillMetaByKey = (key: SkillCategoryKey): SkillMeta =>
  SKILL_CATALOG.find((s) => s.key === key) ?? { key, name: key, short: key, code: 'GL-00' };

export const SKILL_ORDER: SkillCategoryKey[] = SKILL_CATALOG.map((s) => s.key);