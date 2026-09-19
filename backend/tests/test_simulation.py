from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)



def get_auth_headers():
    reg_payload = {
        "email": "sim_tester@example.com",
        "username": "sim_tester",
        "password": "Password123!",
        "full_name": "Sim Tester",
    }
    client.post("/api/v1/auth/register", json=reg_payload)
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email_or_username": "sim_tester@example.com", "password": "Password123!"},
    )
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_full_simulation_flow():
    headers = get_auth_headers()

    # 1. Start simulation session
    start_res = client.post(
        "/api/v1/simulation/start",
        json={"scenario_id": "road-safety-crosswalk-01"},
        headers=headers,
    )
    assert start_res.status_code == 201
    start_data = start_res.json()
    attempt_id = start_data["attempt_id"]
    assert attempt_id.startswith("attempt-")
    assert start_data["status"] == "active"

    # 2. Record behaviour events
    event1 = {
        "attempt_id": attempt_id,
        "event_type": "ROAD_LOOK_ACTION",
        "timestamp_offset": 2,
        "is_safe": True,
        "payload": {"side": "left"},
    }
    event2 = {
        "attempt_id": attempt_id,
        "event_type": "ROAD_SIGNAL_INTERACTION",
        "timestamp_offset": 5,
        "is_safe": True,
    }
    event3 = {
        "attempt_id": attempt_id,
        "event_type": "ROAD_FINISH",
        "timestamp_offset": 12,
        "is_safe": True,
    }

    assert client.post("/api/v1/simulation/behaviour", json=event1, headers=headers).status_code == 202
    assert client.post("/api/v1/simulation/behaviour", json=event2, headers=headers).status_code == 202
    assert client.post("/api/v1/simulation/behaviour", json=event3, headers=headers).status_code == 202

    # 3. Complete simulation
    comp_res = client.post(
        "/api/v1/simulation/complete",
        json={"attempt_id": attempt_id, "status": "completed"},
        headers=headers,
    )
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["attempt_id"] == attempt_id
    assert comp_data["status"] == "completed"

    # 4. Fetch performance result
    perf_res = client.get(f"/api/v1/performance/attempts/{attempt_id}", headers=headers)
    assert perf_res.status_code == 200
    perf_data = perf_res.json()
    assert perf_data["attempt_id"] == attempt_id
    assert perf_data["overall_score"] >= 80
    assert perf_data["completion_status"] == "completed"
    assert len(perf_data["successful_actions"]) >= 1

    # 5. Fetch progress history
    prog_res = client.get("/api/v1/progress/history", headers=headers)
    assert prog_res.status_code == 200
    prog_data = prog_res.json()
    assert prog_data["totals"]["scenarios_completed"] == 1
    assert len(prog_data["scores_over_time"]) == 1
    assert prog_data["scores_over_time"][0]["overall_score"] == perf_data["overall_score"]

    # 6. Fetch profile dashboard
    dash_res = client.get("/api/v1/profile/dashboard", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["learner"]["name"] == "Sim Tester"
    assert len(dash_data["recent_results"]) == 1
    assert dash_data["recommended_scenario"]["id"] == "road-safety-crosswalk-01"

    # 7. Fetch skills map
    skills_res = client.get("/api/v1/skills", headers=headers)
    assert skills_res.status_code == 200
    skills_data = skills_res.json()
    assert len(skills_data) == 7
    road_safety_skill = next(s for s in skills_data if s["skill_id"] == "road_safety")
    assert road_safety_skill["completed_scenarios"] == 1
    assert road_safety_skill["progress"] > 0
