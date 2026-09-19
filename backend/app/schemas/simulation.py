from typing import Optional, Dict, Any, Literal
from datetime import datetime
from pydantic import BaseModel


class SimulationStartRequest(BaseModel):
    scenario_id: str


class SimulationStartResponse(BaseModel):
    attempt_id: str
    scenario_id: str
    started_at: datetime
    status: Literal["active"] = "active"


class SimulationEventPayload(BaseModel):
    attempt_id: str
    event_type: str
    timestamp_offset: int
    is_safe: bool = True
    payload: Optional[Dict[str, Any]] = None


class SimulationCompleteRequest(BaseModel):
    attempt_id: str
    status: Literal["completed", "failed"]


class SimulationCompleteResponse(BaseModel):
    attempt_id: str
    status: Literal["completed", "failed"]
    completed_at: datetime
