from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, JSON, DateTime
from app.db.session import Base


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=False)
    skill_category = Column(String(100), nullable=False, index=True)
    skill_name = Column(String(100), nullable=True)
    difficulty_level = Column(String(50), nullable=False, index=True)
    estimated_duration_minutes = Column(Integer, default=5, nullable=False)
    objective = Column(String(500), nullable=False)
    real_world_context = Column(String(1000), nullable=False)
    skills_tested = Column(JSON, nullable=False, default=list)
    controls = Column(JSON, nullable=False, default=list)
    success_conditions = Column(JSON, nullable=False, default=list)
    failure_conditions = Column(JSON, nullable=False, default=list)
    availability = Column(String(50), default="available", nullable=False)
    is_recommended = Column(Boolean, default=False, nullable=False)
    environment_config = Column(JSON, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
