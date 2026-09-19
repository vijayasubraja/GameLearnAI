from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, JSON, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base


class PerformanceScore(Base):
    __tablename__ = "performance_scores"

    attempt_id = Column(String(100), ForeignKey("simulation_attempts.id"), primary_key=True)
    scenario_id = Column(String(100), ForeignKey("scenarios.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    overall_score = Column(Integer, nullable=False)
    accuracy_score = Column(Integer, nullable=False)
    safety_score = Column(Integer, nullable=False)
    decision_score = Column(Integer, nullable=False)
    reaction_score = Column(Integer, nullable=False)
    completion_score = Column(Integer, nullable=False)
    mistake_count = Column(Integer, nullable=False, default=0)
    completion_status = Column(String(50), nullable=False)
    successful_actions = Column(JSON, nullable=False, default=list)
    mistakes = Column(JSON, nullable=False, default=list)
    improvement_tips = Column(JSON, nullable=False, default=list)
    next_difficulty = Column(String(50), nullable=False, default="Medium")
    next_scenario_id = Column(String(100), nullable=True)
    next_scenario_title = Column(String(255), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    attempt = relationship("SimulationAttempt", back_populates="score_result")


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    skill_category = Column(String(100), nullable=False, index=True)
    progress = Column(Integer, nullable=False, default=0)
    level = Column(String(50), nullable=False, default="Beginner")
    status = Column(String(50), nullable=False, default="not_started")
    completed_scenarios = Column(Integer, nullable=False, default=0)
    total_scenarios = Column(Integer, nullable=False, default=3)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint("user_id", "skill_category", name="uq_user_skill"),
    )
