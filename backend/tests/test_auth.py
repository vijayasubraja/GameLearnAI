import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
import app.models  # Register all models on Base.metadata
from app.main import app

# Create in-memory SQLite database for test isolation
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
    """Recreate test database schema for each test."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "GameLearn AI" in data["project"]


def test_user_registration_success():
    payload = {
        "email": "learner1@example.com",
        "username": "learner_one",
        "password": "Password123!",
        "full_name": "Learner One"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "learner1@example.com"
    assert data["username"] == "learner_one"
    assert data["full_name"] == "Learner One"
    assert "id" in data
    assert "hashed_password" not in data


def test_duplicate_email_registration():
    payload = {
        "email": "duplicate@example.com",
        "username": "user1",
        "password": "Password123!",
        "full_name": "User 1"
    }
    res1 = client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    # Attempt to register same email with different username
    payload2 = {
        "email": "duplicate@example.com",
        "username": "user2",
        "password": "Password123!",
        "full_name": "User 2"
    }
    res2 = client.post("/api/v1/auth/register", json=payload2)
    assert res2.status_code == 400
    assert "email" in res2.json()["detail"].lower()


def test_duplicate_username_registration():
    payload1 = {
        "email": "unique1@example.com",
        "username": "same_user",
        "password": "Password123!",
        "full_name": "User 1"
    }
    res1 = client.post("/api/v1/auth/register", json=payload1)
    assert res1.status_code == 201

    payload2 = {
        "email": "unique2@example.com",
        "username": "same_user",
        "password": "Password123!",
        "full_name": "User 2"
    }
    res2 = client.post("/api/v1/auth/register", json=payload2)
    assert res2.status_code == 400
    assert "username" in res2.json()["detail"].lower()


def test_login_and_me_flow():
    # Register
    reg_payload = {
        "email": "auth_test@example.com",
        "username": "authtest",
        "password": "SuperSecretPassword123!",
        "full_name": "Auth Tester"
    }
    client.post("/api/v1/auth/register", json=reg_payload)

    # Login with email
    login_payload = {
        "email_or_username": "auth_test@example.com",
        "password": "SuperSecretPassword123!"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    assert token_data["user"]["email"] == "auth_test@example.com"

    token = token_data["access_token"]

    # Login with username
    login_username_res = client.post(
        "/api/v1/auth/login",
        json={"email_or_username": "authtest", "password": "SuperSecretPassword123!"}
    )
    assert login_username_res.status_code == 200

    # Fetch /auth/me with Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "auth_test@example.com"
    assert me_data["username"] == "authtest"
    assert me_data["full_name"] == "Auth Tester"


def test_invalid_login():
    reg_payload = {
        "email": "badpass@example.com",
        "username": "badpass_user",
        "password": "CorrectPassword123!",
    }
    client.post("/api/v1/auth/register", json=reg_payload)

    bad_login = {
        "email_or_username": "badpass@example.com",
        "password": "WrongPassword!"
    }
    res = client.post("/api/v1/auth/login", json=bad_login)
    assert res.status_code == 401


def test_unauthorized_me_access():
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401
