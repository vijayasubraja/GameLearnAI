from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.performance import UserSkillProgress
from app.models.scenario import Scenario
from app.models.simulation import SimulationAttempt
from app.models.user import User
from app.schemas.performance import (
    DashboardPayloadResponse,
    SkillInfoResponse,
    LearnerInfo,
    CoachRecommendation,
    RecommendationAction,
    AttemptSummaryResponse,
)
from app.features.skills import SKILL_CATALOG_LIST

router = APIRouter(tags=["Profile & Dashboard"])


@router.get("/profile/dashboard", response_model=DashboardPayloadResponse)
def get_dashboard_payload(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch personalized dashboard statistics, recommendations, and recent attempt results."""
    # Recommended scenario
    rec_scenario = db.query(Scenario).filter(Scenario.is_recommended == True).first()
    if not rec_scenario:
        rec_scenario = db.query(Scenario).first()

    # User skill progress map
    user_skills = db.query(UserSkillProgress).filter(UserSkillProgress.user_id == current_user.id).all()
    user_skill_map = {s.skill_category: s for s in user_skills}

    skill_progress_list = []
    for meta in SKILL_CATALOG_LIST:
        cat_key = meta["skill_id"]
        sp = user_skill_map.get(cat_key)
        skill_progress_list.append(
            SkillInfoResponse(
                skill_id=cat_key,
                name=meta["name"],
                progress=sp.progress if sp else 0,
                level=sp.level if sp else "Beginner",
                status=sp.status if sp else "not_started",
                completed_scenarios=sp.completed_scenarios if sp else 0,
                total_scenarios=sp.total_scenarios if sp else 3,
                recommended_scenario_id=rec_scenario.id if rec_scenario else None,
                next_action=f"Practice {meta['name']}",
            )
        )

    # Recent attempts
    attempts = db.query(SimulationAttempt).filter(
        SimulationAttempt.user_id == current_user.id
    ).order_by(SimulationAttempt.started_at.desc()).limit(5).all()

    recent_results = []
    for a in attempts:
        sc = db.query(Scenario).filter(Scenario.id == a.scenario_id).first()
        recent_results.append(
            AttemptSummaryResponse(
                attempt_id=a.id,
                scenario_id=a.scenario_id,
                scenario_title=sc.title if sc else "Simulation",
                skill_category=sc.skill_category if sc else "road_safety",
                difficulty_level=sc.difficulty_level if sc else "Medium",
                status=a.status,
                started_at=a.started_at,
                completed_at=a.completed_at,
                overall_score=a.overall_score,
            )
        )

    learner = LearnerInfo(
        name=current_user.full_name or current_user.username,
        email=current_user.email,
        joined_at=current_user.created_at,
    )

    coach = CoachRecommendation(
        actions=[
            RecommendationAction(
                kind="recommendation",
                title="Practice Pedestrian Crosswalk Safety",
                message="Master visual scanning and traffic timing on medium difficulty.",
            ),
            RecommendationAction(
                kind="practice",
                title="Public Transport Readiness",
                message="Build platform queue and boarding confidence.",
            ),
        ],
        current_focus="Road Safety & Spatial Awareness",
        next_scenario_title=rec_scenario.title if rec_scenario else None,
    )

    return DashboardPayloadResponse(
        learner=learner,
        overall_level="Intermediate" if len(user_skills) > 1 else "Beginner",
        skill_progress=skill_progress_list,
        recommended_scenario=rec_scenario,
        learning_streak_days=3 if len(attempts) > 0 else 0,
        recent_results=recent_results,
        next_challenge=rec_scenario,
        coach=coach,
    )


@router.get("/skills", response_model=list[SkillInfoResponse])
def get_skills_map(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch learner's 7-skill progress map."""
    user_skills = db.query(UserSkillProgress).filter(UserSkillProgress.user_id == current_user.id).all()
    user_skill_map = {s.skill_category: s for s in user_skills}

    skill_progress_list = []
    for meta in SKILL_CATALOG_LIST:
        cat_key = meta["skill_id"]
        sp = user_skill_map.get(cat_key)
        skill_progress_list.append(
            SkillInfoResponse(
                skill_id=cat_key,
                name=meta["name"],
                progress=sp.progress if sp else 0,
                level=sp.level if sp else "Beginner",
                status=sp.status if sp else "not_started",
                completed_scenarios=sp.completed_scenarios if sp else 0,
                total_scenarios=sp.total_scenarios if sp else 3,
                recommended_scenario_id=f"{cat_key.replace('_', '-')}-crosswalk-01",
                next_action=f"Start {meta['name']} practice",
            )
        )
    return skill_progress_list
