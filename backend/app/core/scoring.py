from typing import List, Dict, Any, Tuple
from app.models.simulation import BehaviourEvent, SimulationAttempt
from app.models.scenario import Scenario


def calculate_simulation_score(
    attempt: SimulationAttempt,
    scenario: Scenario,
    events: List[BehaviourEvent],
    status: str,
) -> Dict[str, Any]:
    total_events = len(events)
    safe_events = [e for e in events if e.is_safe]
    unsafe_events = [e for e in events if not e.is_safe]
    mistake_count = len(unsafe_events)

    # Base calculations
    is_completed = (status == "completed")
    
    # 1. Completion Score (0 or 100)
    completion_score = 100 if is_completed else 30

    # 2. Safety Score (Ratio of safe events + danger proximity penalties)
    if total_events > 0:
        safety_ratio = len(safe_events) / total_events
        safety_score = int(safety_ratio * 100)
    else:
        safety_score = 100 if is_completed else 50
    
    # Deduct 15 points per danger event, cap at 0
    safety_score = max(0, safety_score - (mistake_count * 15))

    # 3. Decision Quality Score
    look_events = [e for e in events if "LOOK" in e.event_type.upper()]
    signal_events = [e for e in events if "SIGNAL" in e.event_type.upper()]
    decision_points = 50
    if len(look_events) > 0:
        decision_points += 25
    if len(signal_events) > 0 or scenario.skill_category != "road_safety":
        decision_points += 25
    decision_score = min(100, decision_points) if is_completed else max(20, decision_points - 30)

    # 4. Accuracy Score
    if is_completed:
        accuracy_score = 100 if mistake_count == 0 else max(40, 100 - (mistake_count * 20))
    else:
        accuracy_score = 30

    # 5. Reaction Score
    reaction_score = 90 if is_completed and mistake_count < 2 else 65

    # Overall Score formula (Weighted average)
    # Accuracy 30%, Safety 25%, Decision 20%, Reaction 10%, Completion 15%
    overall = (
        (accuracy_score * 0.30)
        + (safety_score * 0.25)
        + (decision_score * 0.20)
        + (reaction_score * 0.10)
        + (completion_score * 0.15)
    )
    overall_score = int(round(overall))

    # Generate Feedback lists
    successful_actions = []
    mistakes = []
    improvement_tips = []

    if is_completed:
        successful_actions.append(f"Successfully reached the destination for {scenario.title}")
    if len(look_events) > 0:
        successful_actions.append("Performed proactive visual hazard scans before moving")
    if len(signal_events) > 0:
        successful_actions.append("Interacted correctly with safety controls")
    if mistake_count == 0 and is_completed:
        successful_actions.append("Flawless run with zero danger proximity incidents")

    if mistake_count > 0:
        mistakes.append(f"Entered danger zone or near-collision area ({mistake_count} time(s))")
    if len(look_events) == 0 and scenario.skill_category == "road_safety":
        mistakes.append("Stepped onto the road without scanning left and right first")

    if mistake_count > 0:
        improvement_tips.append("Maintain a safe buffer distance from moving traffic or hazards")
    if len(look_events) == 0 and scenario.skill_category == "road_safety":
        improvement_tips.append("Press 'L' and 'R' to check both sides before crossing")
    if is_completed:
        improvement_tips.append("Great job! Practice on higher difficulty for advanced mastery")
    else:
        improvement_tips.append("Take your time to observe the environment before taking action")

    # Determine next difficulty recommendation
    if overall_score >= 85:
        next_difficulty = "Hard" if scenario.difficulty_level == "Medium" else "Medium"
    elif overall_score >= 60:
        next_difficulty = scenario.difficulty_level
    else:
        next_difficulty = "Easy"

    return {
        "overall_score": overall_score,
        "accuracy_score": accuracy_score,
        "safety_score": safety_score,
        "decision_score": decision_score,
        "reaction_score": reaction_score,
        "completion_score": completion_score,
        "mistake_count": mistake_count,
        "completion_status": "completed" if is_completed else "failed",
        "successful_actions": successful_actions if successful_actions else ["Initiated practice simulation"],
        "mistakes": mistakes if mistakes else ["No major mistakes recorded"],
        "improvement_tips": improvement_tips,
        "next_difficulty": next_difficulty,
    }
