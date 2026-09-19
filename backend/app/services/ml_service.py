import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any

from app.schemas.ml import SkillPredictionRequest, SkillPredictionResponse
from app.ml.train_skill_model import FEATURE_COLUMNS, train_and_save_skill_model

_SKILL_MODEL_CACHE = None

def get_skill_model_pipeline():
    """Lazy loads and caches the serialized Random Forest model pipeline."""
    global _SKILL_MODEL_CACHE
    if _SKILL_MODEL_CACHE is None:
        model_path = os.path.join(
            os.path.dirname(__file__), "..", "ml", "saved_models", "skill_level_rf.joblib"
        )
        model_path = os.path.abspath(model_path)

        if not os.path.exists(model_path):
            print(f"[ML Service] Model file not found at {model_path}. Triggering training...")
            result = train_and_save_skill_model()
            model_path = result["model_path"]

        _SKILL_MODEL_CACHE = joblib.load(model_path)
        print(f"[ML Service] Loaded Random Forest model pipeline successfully from {model_path}")
    
    return _SKILL_MODEL_CACHE


def predict_skill_level(req: SkillPredictionRequest) -> SkillPredictionResponse:
    pipeline = get_skill_model_pipeline()

    input_df = pd.DataFrame([{
        "experience_rating": req.experience_rating,
        "confidence_score": req.confidence_score,
        "knowledge_score": req.knowledge_score,
        "situational_decision_score": req.situational_decision_score,
        "response_consistency": req.response_consistency,
    }])[FEATURE_COLUMNS]

    predicted_level = str(pipeline.predict(input_df)[0])
    probabilities = pipeline.predict_proba(input_df)[0]
    classes = pipeline.classes_

    confidence_dict: Dict[str, float] = {
        cls: round(float(prob), 4) for cls, prob in zip(classes, probabilities)
    }

    # Extract feature importance from RF classifier step
    rf_model = pipeline.named_steps["rf"]
    importances = rf_model.feature_importances_
    feature_importance_dict = {
        col: round(float(imp), 4) for col, imp in zip(FEATURE_COLUMNS, importances)
    }

    # Generate personalized recommendations
    if predicted_level == "Beginner":
        rec = f"Learner demonstrates foundational concepts in {req.skill_category.replace('_', ' ').title()}. Recommended to start with introductory scenarios and basic scanning tutorials."
    elif predicted_level == "Intermediate":
        rec = f"Learner shows solid competence in {req.skill_category.replace('_', ' ').title()}. Ready for medium-difficulty multi-obstacle interactive scenarios."
    else:
        rec = f"Learner displays advanced mastery in {req.skill_category.replace('_', ' ').title()}. Recommended for hard-level stress test scenarios and rapid reaction challenges."

    return SkillPredictionResponse(
        skill_category=req.skill_category,
        predicted_level=predicted_level,
        confidence_probabilities=confidence_dict,
        feature_importance=feature_importance_dict,
        recommendation=rec,
    )
