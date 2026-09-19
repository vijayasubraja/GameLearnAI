from fastapi import APIRouter, Depends, status
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ml import SkillPredictionRequest, SkillPredictionResponse
from app.services.ml_service import predict_skill_level

router = APIRouter(prefix="/ml", tags=["Machine Learning"])


@router.post(
    "/predict-skill",
    response_model=SkillPredictionResponse,
    status_code=status.HTTP_200_OK,
)
def predict_skill(
    payload: SkillPredictionRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Predict learner skill level (Beginner, Intermediate, Advanced) using the
    trained Random Forest Classifier model based on assessment feature inputs.
    """
    return predict_skill_level(payload)
