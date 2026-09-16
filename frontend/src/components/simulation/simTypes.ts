import type { Scenario } from '../../types/domain';

export interface TelemetryEvent {
  event_type: string;
  is_safe: boolean;
  payload?: Record<string, unknown>;
}

export interface SimulatorSceneProps {
  scenario: Scenario;
  paused: boolean;
  resetKey: number;
  onTelemetry: (event: TelemetryEvent) => void;
  onSafety: (level: 'ok' | 'warning' | 'danger') => void;
  onReachedGoal: () => void;
}

export const ROAD_EVENT = {
  LOOK_ACTION: 'LOOK_ACTION',
  SIGNAL_INTERACTION: 'TRAFFIC_SIGNAL_INTERACTION',
  ROAD_ENTRY: 'ROAD_ENTRY',
  DANGER_PROXIMITY: 'DANGER_PROXIMITY_EVENT',
  OBJECTIVE_REACHED: 'OBJECTIVE_REACHED',
  FINISH: 'SIMULATION_FINISH',
} as const;

export const PLAZA_EVENT = {
  INTERACTION: 'OBJECT_INTERACTION',
  PROMPT: 'OBJECT_PROMPT',
  OBJECTIVE_REACHED: 'OBJECTIVE_REACHED',
  FINISH: 'SIMULATION_FINISH',
} as const;