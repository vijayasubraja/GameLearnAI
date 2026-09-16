import type { User } from './auth';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type SkillStatus = 'not_started' | 'in_progress' | 'completed';
export type ScenarioStatus = 'available' | 'completed' | 'locked';
export type AttemptStatus = 'active' | 'completed' | 'failed' | 'abandoned' | 'submitted';

export type SkillCategoryKey =
  | 'road_safety'
  | 'public_transport'
  | 'money_management'
  | 'shopping_transactions'
  | 'communication'
  | 'workplace'
  | 'emergency_safety';

export interface SkillInfo {
  skill_id: SkillCategoryKey;
  name: string;
  progress: number;
  level: SkillLevel;
  status: SkillStatus;
  completed_scenarios: number;
  total_scenarios: number;
  recommended_scenario_id?: string;
  next_action?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  skill_category: SkillCategoryKey;
  skill_name?: string;
  difficulty_level: DifficultyLevel;
  estimated_duration_minutes: number;
  objective: string;
  real_world_context: string;
  skills_tested: string[];
  controls: string[];
  success_conditions: string[];
  failure_conditions: string[];
  availability: ScenarioStatus;
  is_recommended: boolean;
  environment_config?: Record<string, unknown>;
}

export interface ScenarioFilters {
  skill?: SkillCategoryKey | 'all';
  difficulty?: DifficultyLevel | 'all';
  status?: ScenarioStatus | 'all';
}

export interface RecommendationAction {
  kind: 'recommendation' | 'weak_area' | 'mistake' | 'practice' | 'focus';
  title: string;
  message: string;
}

export interface CoachRecommendation {
  actions: RecommendationAction[];
  current_focus: string;
  next_scenario_title?: string;
}

export interface AttemptSummary {
  attempt_id: string;
  scenario_id: string;
  scenario_title: string;
  skill_category: SkillCategoryKey;
  difficulty_level: DifficultyLevel;
  status: AttemptStatus;
  started_at: string;
  completed_at?: string;
  overall_score?: number;
}

export interface DashboardPayload {
  learner: {
    name: string;
    email: string;
    joined_at?: string;
  };
  overall_level: SkillLevel;
  skill_progress: SkillInfo[];
  recommended_scenario: Scenario;
  learning_streak_days: number;
  recent_results: AttemptSummary[];
  next_challenge: Scenario | null;
  coach: CoachRecommendation;
}

export interface ScoreSeriesPoint {
  attempt_id: string;
  scenario_id: string;
  scenario_title: string;
  completed_at: string;
  overall_score: number;
  difficulty_level: DifficultyLevel;
}

export interface DifficultyProgressionPoint {
  completed_at: string;
  attempt_id: string;
  difficulty_level: DifficultyLevel;
}

export interface ProgressHistoryPayload {
  scores_over_time: ScoreSeriesPoint[];
  skill_progress: SkillInfo[];
  difficulty_progression: DifficultyProgressionPoint[];
  recent_attempts: AttemptSummary[];
  totals: {
    scenarios_completed: number;
    average_score: number;
    current_streak_days: number;
    best_score: number;
  };
}

export interface SimulationStartResponse {
  attempt_id: string;
  scenario_id: string;
  started_at: string;
  status: 'active';
}

export interface SimulationEventPayload {
  attempt_id: string;
  event_type: string;
  timestamp_offset: number;
  is_safe: boolean;
  payload?: Record<string, unknown>;
}

export interface SimulationCompleteResponse {
  attempt_id: string;
  status: 'completed' | 'failed';
  completed_at: string;
}

export interface PerformanceResult {
  attempt_id: string;
  scenario_id: string;
  scenario_title: string;
  overall_score: number;
  accuracy_score: number;
  safety_score: number;
  decision_score: number;
  reaction_score: number;
  completion_score: number;
  mistake_count: number;
  completion_status: AttemptStatus;
  successful_actions: string[];
  mistakes: string[];
  improvement_tips: string[];
  next_difficulty: DifficultyLevel;
  next_scenario_id: string;
  next_scenario_title: string;
}

export interface AuthMe {
  user: User;
}

export const SKILL_LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['Easy', 'Medium', 'Hard'];