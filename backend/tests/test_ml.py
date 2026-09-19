import os
import pytest
from app.main import app
from fastapi.testclient import TestClient
from app.ml.generate_skill_dataset import generate_synthetic_skill_dataset
from app.ml.train_skill_model import train_and_save_skill_model

client = TestClient(app)


def get_auth_headers():
    reg_payload = {
        "email": "ml_tester@example.com",
        "username": "ml_tester",
        "password": "Password123!",
        "full_name": "ML Tester",
    }
    client.post("/api/v1/auth/register", json=reg_payload)
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email_or_username": "ml_tester@example.com", "password": "Password123!"},
    )
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_generate_synthetic_dataset():
    df = generate_synthetic_skill_dataset(num_samples=700)
    assert len(df) == 700
    assert "experience_rating" in df.columns
    assert "knowledge_score" in df.columns
    assert "skill_level" in df.columns
    assert set(df["skill_level"].unique()).issubset({"Beginner", "Intermediate", "Advanced"})


def test_train_and_save_skill_model():
    result = train_and_save_skill_model()
    assert result["accuracy"] > 0.80
    assert result["f1_score"] > 0.80
    assert os.path.exists(result["model_path"])


def test_predict_skill_endpoint_beginner():
    headers = get_auth_headers()
    payload = {
        "skill_category": "road_safety",
        "experience_rating": 1.2,
        "confidence_score": 1.5,
        "knowledge_score": 0.25,
        "situational_decision_score": 0.30,
        "response_consistency": 0.40,
    }
    response = client.post("/api/v1/ml/predict-skill", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["skill_category"] == "road_safety"
    assert data["predicted_level"] == "Beginner"
    assert "confidence_probabilities" in data
    assert "Beginner" in data["confidence_probabilities"]
    assert "feature_importance" in data
    assert len(data["recommendation"]) > 0


def test_predict_skill_endpoint_advanced():
    headers = get_auth_headers()
    payload = {
        "skill_category": "money_management",
        "experience_rating": 4.8,
        "confidence_score": 4.9,
        "knowledge_score": 0.95,
        "situational_decision_score": 0.92,
        "response_consistency": 0.96,
    }
    response = client.post("/api/v1/ml/predict-skill", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["skill_category"] == "money_management"
    assert data["predicted_level"] == "Advanced"
    assert data["confidence_probabilities"]["Advanced"] > 0.60


def test_predict_skill_unauthenticated():
    payload = {
        "skill_category": "workplace",
        "experience_rating": 3.0,
        "confidence_score": 3.0,
        "knowledge_score": 0.6,
        "situational_decision_score": 0.6,
        "response_consistency": 0.6,
    }
    response = client.post("/api/v1/ml/predict-skill", json=payload)
    assert response.status_code == 401
