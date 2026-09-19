import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.scoring import calculate_simulation_score
from app.db.session import get_db
from app.models.scenario import Scenario
from app.models.simulation import SimulationAttempt, BehaviourEvent
from app.models.performance import PerformanceScore, UserSkillProgress
from app.models.user import User
from app.schemas.simulation import (
    SimulationStartRequest,
    SimulationStartResponse,
    SimulationEventPayload,
    SimulationCompleteRequest,
    SimulationCompleteResponse,
)

router = APIRouter(prefix="/simulation", tags=["Simulation"])


@router.post("/start", response_model=SimulationStartResponse, status_code=status.HTTP_201_CREATED)
def start_simulation(
    req: SimulationStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Start a new 3D simulation session attempt."""
    scenario = db.query(Scenario).filter(Scenario.id == req.scenario_id).first()
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario with ID '{req.scenario_id}' not found.",
        )

    attempt_id = f"attempt-{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    attempt = SimulationAttempt(
        id=attempt_id,
        user_id=current_user.id,
        scenario_id=scenario.id,
        status="active",
        started_at=now,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return SimulationStartResponse(
        attempt_id=attempt.id,
        scenario_id=attempt.scenario_id,
        started_at=attempt.started_at,
        status="active",
    )


@router.post("/behaviour", status_code=status.HTTP_202_ACCEPTED)
def record_behaviour_event(
    event_in: SimulationEventPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record a real-time behavioural telemetry event during simulation."""
    attempt = db.query(SimulationAttempt).filter(
        SimulationAttempt.id == event_in.attempt_id,
        SimulationAttempt.user_id == current_user.id,
    ).first()
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation attempt '{event_in.attempt_id}' not found.",
        )

    event = BehaviourEvent(
        attempt_id=event_in.attempt_id,
        event_type=event_in.event_type,
        timestamp_offset=event_in.timestamp_offset,
        is_safe=event_in.is_safe,
        payload=event_in.payload,
    )
    db.add(event)
    db.commit()

    return {"accepted": True}


@router.post("/complete", response_model=SimulationCompleteResponse)
def complete_simulation(
    req: SimulationCompleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Complete a simulation attempt, calculate performance scores, and update user progress."""
    attempt = db.query(SimulationAttempt).filter(
        SimulationAttempt.id == req.attempt_id,
        SimulationAttempt.user_id == current_user.id,
    ).first()
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation attempt '{req.attempt_id}' not found.",
        )

    scenario = db.query(Scenario).filter(Scenario.id == attempt.scenario_id).first()
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated scenario not found.",
        )

    now = datetime.now(timezone.utc)
    attempt.status = req.status
    attempt.completed_at = now

    # Fetch recorded behaviour events
    events = db.query(BehaviourEvent).filter(BehaviourEvent.attempt_id == attempt.id).all()

    # Calculate scores
    score_data = calculate_simulation_score(attempt, scenario, events, req.status)
    attempt.overall_score = score_data["overall_score"]

    # Determine next scenario suggestion
    next_scenario = db.query(Scenario).filter(
        Scenario.skill_category == scenario.skill_category,
        Scenario.id != scenario.id,
    ).first()
    if not next_scenario:
        next_scenario = scenario

    # Store performance score record
    perf_score = PerformanceScore(
        attempt_id=attempt.id,
        scenario_id=scenario.id,
        user_id=current_user.id,
        overall_score=score_data["overall_score"],
        accuracy_score=score_data["accuracy_score"],
        safety_score=score_data["safety_score"],
        decision_score=score_data["decision_score"],
        reaction_score=score_data["reaction_score"],
        completion_score=score_data["completion_score"],
        mistake_count=score_data["mistake_count"],
        completion_status=score_data["completion_status"],
        successful_actions=score_data["successful_actions"],
        mistakes=score_data["mistakes"],
        improvement_tips=score_data["improvement_tips"],
        next_difficulty=score_data["next_difficulty"],
        next_scenario_id=next_scenario.id,
        next_scenario_title=next_scenario.title,
    )
    db.merge(perf_score)

    # Update or create user skill progress record
    skill_prog = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == current_user.id,
        UserSkillProgress.skill_category == scenario.skill_category,
    ).first()

    if not skill_prog:
        skill_prog = UserSkillProgress(
            user_id=current_user.id,
            skill_category=scenario.skill_category,
            progress=35 if req.status == "completed" else 15,
            level="Beginner",
            status="completed" if req.status == "completed" else "in_progress",
            completed_scenarios=1 if req.status == "completed" else 0,
            total_scenarios=3,
        )
        db.add(skill_prog)
    else:
        if req.status == "completed":
            skill_prog.completed_scenarios += 1
            skill_prog.progress = min(100, skill_prog.progress + 35)
            skill_prog.status = "completed" if skill_prog.completed_scenarios >= skill_prog.total_scenarios else "in_progress"
            if skill_prog.progress >= 70:
                skill_prog.level = "Advanced"
            elif skill_prog.progress >= 40:
                skill_prog.level = "Intermediate"

    db.commit()

    return SimulationCompleteResponse(
        attempt_id=attempt.id,
        status=attempt.status,
        completed_at=attempt.completed_at,
    )
