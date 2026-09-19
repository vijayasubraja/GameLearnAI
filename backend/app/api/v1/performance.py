from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.performance import PerformanceScore, UserSkillProgress
from app.models.simulation import SimulationAttempt
from app.models.scenario import Scenario
from app.models.user import User
from app.schemas.performance import (
    PerformanceResultResponse,
    ProgressHistoryResponse,
    ScoreSeriesPointResponse,
    DifficultyProgressionPointResponse,
    AttemptSummaryResponse,
    ProgressTotals,
)
from app.features.skills import SKILL_CATALOG_LIST

router = APIRouter(tags=["Performance & Progress"])


@router.get("/performance/attempts/{attempt_id}", response_model=PerformanceResultResponse)
def get_attempt_result(
    attempt_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch performance results and breakdown for a specific simulation attempt."""
    perf = db.query(PerformanceScore).filter(
        PerformanceScore.attempt_id == attempt_id,
        PerformanceScore.user_id == current_user.id,
    ).first()

    if not perf:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Performance result for attempt '{attempt_id}' not found.",
        )

    scenario = db.query(Scenario).filter(Scenario.id == perf.scenario_id).first()
    scenario_title = scenario.title if scenario else "Simulation Challenge"

    return PerformanceResultResponse(
        attempt_id=perf.attempt_id,
        scenario_id=perf.scenario_id,
        scenario_title=scenario_title,
        overall_score=perf.overall_score,
        accuracy_score=perf.accuracy_score,
        safety_score=perf.safety_score,
        decision_score=perf.decision_score,
        reaction_score=perf.reaction_score,
        completion_score=perf.completion_score,
        mistake_count=perf.mistake_count,
        completion_status=perf.completion_status,
        successful_actions=perf.successful_actions,
        mistakes=perf.mistakes,
        improvement_tips=perf.improvement_tips,
        next_difficulty=perf.next_difficulty,
        next_scenario_id=perf.next_scenario_id or perf.scenario_id,
        next_scenario_title=perf.next_scenario_title or scenario_title,
    )


@router.get("/progress/history", response_model=ProgressHistoryResponse)
def get_progress_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch learner's overall score progress, skill competency map, and attempt history."""
    attempts = db.query(SimulationAttempt).filter(
        SimulationAttempt.user_id == current_user.id,
        SimulationAttempt.status.in_(["completed", "failed"]),
    ).order_by(SimulationAttempt.started_at.asc()).all()

    scores_over_time = []
    difficulty_progression = []
    recent_attempts = []
    total_score_sum = 0
    best_score = 0
    completed_count = 0

    for a in attempts:
        scenario = db.query(Scenario).filter(Scenario.id == a.scenario_id).first()
        scenario_title = scenario.title if scenario else "Simulation"
        skill_cat = scenario.skill_category if scenario else "road_safety"
        diff_level = scenario.difficulty_level if scenario else "Medium"
        score = a.overall_score or 0

        if a.status == "completed":
            completed_count += 1
            total_score_sum += score
            if score > best_score:
                best_score = score

            if a.completed_at:
                scores_over_time.append(
                    ScoreSeriesPointResponse(
                        attempt_id=a.id,
                        scenario_id=a.scenario_id,
                        scenario_title=scenario_title,
                        completed_at=a.completed_at,
                        overall_score=score,
                        difficulty_level=diff_level,
                    )
                )
                difficulty_progression.append(
                    DifficultyProgressionPointResponse(
                        completed_at=a.completed_at,
                        attempt_id=a.id,
                        difficulty_level=diff_level,
                    )
                )

        recent_attempts.append(
            AttemptSummaryResponse(
                attempt_id=a.id,
                scenario_id=a.scenario_id,
                scenario_title=scenario_title,
                skill_category=skill_cat,
                difficulty_level=diff_level,
                status=a.status,
                started_at=a.started_at,
                completed_at=a.completed_at,
                overall_score=a.overall_score,
            )
        )

    # Reverse recent attempts for latest first
    recent_attempts.reverse()

    # User skill progress list
    user_skills = db.query(UserSkillProgress).filter(UserSkillProgress.user_id == current_user.id).all()
    user_skill_map = {s.skill_category: s for s in user_skills}

    skill_progress_list = []
    for meta in SKILL_CATALOG_LIST:
        cat_key = meta["skill_id"]
        sp = user_skill_map.get(cat_key)
        skill_progress_list.append({
            "skill_id": cat_key,
            "name": meta["name"],
            "progress": sp.progress if sp else 0,
            "level": sp.level if sp else "Beginner",
            "status": sp.status if sp else "not_started",
            "completed_scenarios": sp.completed_scenarios if sp else 0,
            "total_scenarios": sp.total_scenarios if sp else 3,
            "recommended_scenario_id": f"{cat_key.replace('_', '-')}-crosswalk-01",
            "next_action": f"Start {meta['name']} practice",
        })

    avg_score = int(round(total_score_sum / completed_count)) if completed_count > 0 else 0

    return ProgressHistoryResponse(
        scores_over_time=scores_over_time,
        skill_progress=skill_progress_list,
        difficulty_progression=difficulty_progression,
        recent_attempts=recent_attempts[:10],
        totals=ProgressTotals(
            scenarios_completed=completed_count,
            average_score=avg_score,
            current_streak_days=3 if completed_count > 0 else 0,
            best_score=best_score,
        ),
    )
