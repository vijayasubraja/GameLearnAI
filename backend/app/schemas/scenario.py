from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class ScenarioBase(BaseModel):
    id: str
    title: str
    description: str
    skill_category: str
    skill_name: Optional[str] = None
    difficulty_level: str
    estimated_duration_minutes: int = 5
    objective: str
    real_world_context: str
    skills_tested: List[str]
    controls: List[str]
    success_conditions: List[str]
    failure_conditions: List[str]
    availability: str = "available"
    is_recommended: bool = False
    environment_config: Optional[Dict[str, Any]] = None


class ScenarioResponse(ScenarioBase):
    class Config:
        from_attributes = True


class ScenarioFilters(BaseModel):
    skill: Optional[str] = "all"
    difficulty: Optional[str] = "all"
    status: Optional[str] = "all"
