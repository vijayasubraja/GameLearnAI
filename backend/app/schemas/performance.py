from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.schemas.scenario import ScenarioResponse


class SkillInfoResponse(BaseModel):
    skill_id: str
    name: str
    progress: int
    level: str
    status: str
    completed_scenarios: int
    total_scenarios: int
    recommended_scenario_id: Optional[str] = None
    next_action: Optional[str] = None


class PerformanceResultResponse(BaseModel):
    attempt_id: str
    scenario_id: str
    scenario_title: str
    overall_score: int
    accuracy_score: int
    safety_score: int
    decision_score: int
    reaction_score: int
    completion_score: int
    mistake_count: int
    completion_status: str
    successful_actions: List[str]
    mistakes: List[str]
    improvement_tips: List[str]
    next_difficulty: str
    next_scenario_id: str
    next_scenario_title: str


class AttemptSummaryResponse(BaseModel):
    attempt_id: str
    scenario_id: str
    scenario_title: str
    skill_category: str
    difficulty_level: str
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    overall_score: Optional[int] = None


class ScoreSeriesPointResponse(BaseModel):
    attempt_id: str
    scenario_id: str
    scenario_title: str
    completed_at: datetime
    overall_score: int
    difficulty_level: str


class DifficultyProgressionPointResponse(BaseModel):
    completed_at: datetime
    attempt_id: str
    difficulty_level: str


class ProgressTotals(BaseModel):
    scenarios_completed: int
    average_score: int
    current_streak_days: int
    best_score: int


class ProgressHistoryResponse(BaseModel):
    scores_over_time: List[ScoreSeriesPointResponse]
    skill_progress: List[SkillInfoResponse]
    difficulty_progression: List[DifficultyProgressionPointResponse]
    recent_attempts: List[AttemptSummaryResponse]
    totals: ProgressTotals


class RecommendationAction(BaseModel):
    kind: str
    title: str
    message: str


class CoachRecommendation(BaseModel):
    actions: List[RecommendationAction]
    current_focus: str
    next_scenario_title: Optional[str] = None


class LearnerInfo(BaseModel):
    name: str
    email: str
    joined_at: Optional[datetime] = None


class DashboardPayloadResponse(BaseModel):
    learner: LearnerInfo
    overall_level: str
    skill_progress: List[SkillInfoResponse]
    recommended_scenario: ScenarioResponse
    learning_streak_days: int
    recent_results: List[AttemptSummaryResponse]
    next_challenge: Optional[ScenarioResponse] = None
    coach: CoachRecommendation
