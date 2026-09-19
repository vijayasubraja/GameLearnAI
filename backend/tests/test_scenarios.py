import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
import app.models  # Register all models on Base.metadata
from app.db.seed_scenarios import seed_scenarios
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    with TestingSessionLocal() as db:
        seed_scenarios(db)
    yield
    Base.metadata.drop_all(bind=engine)


def get_auth_headers():
    reg_payload = {
        "email": "scenario_tester@example.com",
        "username": "scenario_tester",
        "password": "Password123!",
        "full_name": "Scenario Tester",
    }
    client.post("/api/v1/auth/register", json=reg_payload)
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email_or_username": "scenario_tester@example.com", "password": "Password123!"},
    )
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_list_scenarios_authenticated():
    headers = get_auth_headers()
    response = client.get("/api/v1/scenarios", headers=headers)
    assert response.status_code == 200
    scenarios = response.json()
    assert len(scenarios) >= 7
    categories = [s["skill_category"] for s in scenarios]
    assert "road_safety" in categories
    assert "public_transport" in categories


def test_filter_scenarios_by_skill():
    headers = get_auth_headers()
    response = client.get("/api/v1/scenarios?skill=road_safety", headers=headers)
    assert response.status_code == 200
    scenarios = response.json()
    assert len(scenarios) >= 1
    assert all(s["skill_category"] == "road_safety" for s in scenarios)


def test_get_recommended_scenario():
    headers = get_auth_headers()
    response = client.get("/api/v1/scenarios/select", headers=headers)
    assert response.status_code == 200
    scenario = response.json()
    assert scenario["is_recommended"] is True
    assert scenario["id"] == "road-safety-crosswalk-01"


def test_get_scenario_detail_success():
    headers = get_auth_headers()
    response = client.get("/api/v1/scenarios/road-safety-crosswalk-01", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Pedestrian Crosswalk Safety"
    assert "environment_config" in data


def test_get_scenario_detail_not_found():
    headers = get_auth_headers()
    response = client.get("/api/v1/scenarios/non-existent-id", headers=headers)
    assert response.status_code == 404
