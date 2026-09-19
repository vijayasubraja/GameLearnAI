from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.scenario import Scenario
from app.models.user import User
from app.schemas.scenario import ScenarioResponse

router = APIRouter(prefix="/scenarios", tags=["Scenarios"])


@router.get("", response_model=List[ScenarioResponse])
def list_scenarios(
    skill: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List available scenarios with optional filtering."""
    query = db.query(Scenario)
    if skill and skill != "all":
        query = query.filter(Scenario.skill_category == skill)
    if difficulty and difficulty != "all":
        query = query.filter(Scenario.difficulty_level == difficulty)
    if status and status != "all":
        query = query.filter(Scenario.availability == status)
    
    return query.all()


@router.get("/select", response_model=ScenarioResponse)
def get_recommended_scenario(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Rule-based scenario selection for learner."""
    # Find recommended scenario or default to Road Safety Crosswalk
    recommended = db.query(Scenario).filter(Scenario.is_recommended == True).first()
    if not recommended:
        recommended = db.query(Scenario).first()
    if not recommended:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No scenarios available in system catalog.",
        )
    return recommended


@router.get("/{scenario_id}", response_model=ScenarioResponse)
def get_scenario(
    scenario_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get scenario details by ID."""
    scenario = db.query(Scenario).filter(Scenario.id == scenario_id).first()
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario with ID '{scenario_id}' not found.",
        )
    return scenario
