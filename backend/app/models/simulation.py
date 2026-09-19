from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class SimulationAttempt(Base):
    __tablename__ = "simulation_attempts"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    scenario_id = Column(String(100), ForeignKey("scenarios.id"), nullable=False, index=True)
    status = Column(String(50), default="active", nullable=False)
    started_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)
    overall_score = Column(Integer, nullable=True)

    events = relationship("BehaviourEvent", back_populates="attempt", cascade="all, delete-orphan")
    score_result = relationship("PerformanceScore", back_populates="attempt", uselist=False, cascade="all, delete-orphan")


class BehaviourEvent(Base):
    __tablename__ = "behaviour_events"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    attempt_id = Column(String(100), ForeignKey("simulation_attempts.id"), nullable=False, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    timestamp_offset = Column(Integer, nullable=False, default=0)
    is_safe = Column(Boolean, nullable=False, default=True)
    payload = Column(JSON, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    attempt = relationship("SimulationAttempt", back_populates="events")
