from typing import Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class SkillPredictionRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill_category: str = Field(default="road_safety", description="Skill domain category slug")
    experience_rating: float = Field(..., ge=1.0, le=5.0, description="Self-reported experience level (1-5)")
    confidence_score: float = Field(..., ge=1.0, le=5.0, description="Self-assessed confidence level (1-5)")
    knowledge_score: float = Field(..., ge=0.0, le=1.0, description="Assessment question accuracy (0-1)")
    situational_decision_score: float = Field(..., ge=0.0, le=1.0, description="Situational scenario score (0-1)")
    response_consistency: float = Field(..., ge=0.0, le=1.0, description="Latency & response consistency index (0-1)")


class SkillPredictionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill_category: str
    predicted_level: str
    confidence_probabilities: Dict[str, float]
    feature_importance: Dict[str, float]
    recommendation: str
