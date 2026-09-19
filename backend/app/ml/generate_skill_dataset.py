import os
import random
import numpy as np
import pandas as pd

SKILL_CATEGORIES = [
    "road_safety",
    "public_transport",
    "money_management",
    "shopping_transactions",
    "communication",
    "workplace",
    "emergency_safety",
]

def generate_synthetic_skill_dataset(num_samples: int = 2100, seed: int = 42) -> pd.DataFrame:
    """
    Generates a realistic synthetic tabular dataset for training the Skill Level ML model.
    Features:
      - experience_rating: 1.0 to 5.0
      - confidence_score: 1.0 to 5.0
      - knowledge_score: 0.0 to 1.0
      - situational_decision_score: 0.0 to 1.0
      - response_consistency: 0.0 to 1.0
    Target:
      - skill_level: Beginner, Intermediate, or Advanced
    """
    np.random.seed(seed)
    random.seed(seed)

    data = []
    samples_per_skill = num_samples // len(SKILL_CATEGORIES)

    for skill in SKILL_CATEGORIES:
        for _ in range(samples_per_skill):
            # Sample latent competency score between 0.0 and 1.0
            competency = np.random.beta(2, 2)

            # Map competency to noisy feature signals
            exp = np.clip(competency * 4.0 + 1.0 + np.random.normal(0, 0.4), 1.0, 5.0)
            conf = np.clip(competency * 4.0 + 1.0 + np.random.normal(0, 0.45), 1.0, 5.0)
            know = np.clip(competency + np.random.normal(0, 0.08), 0.0, 1.0)
            dec = np.clip(competency + np.random.normal(0, 0.09), 0.0, 1.0)
            cons = np.clip(competency * 0.8 + 0.2 + np.random.normal(0, 0.07), 0.0, 1.0)

            # Composite weighted skill score
            composite_score = (
                0.25 * (exp / 5.0) +
                0.15 * (conf / 5.0) +
                0.30 * know +
                0.20 * dec +
                0.10 * cons
            )

            # Class label determination based on thresholds
            if composite_score < 0.45:
                level = "Beginner"
            elif composite_score < 0.72:
                level = "Intermediate"
            else:
                level = "Advanced"

            data.append({
                "skill_category": skill,
                "experience_rating": round(float(exp), 2),
                "confidence_score": round(float(conf), 2),
                "knowledge_score": round(float(know), 3),
                "situational_decision_score": round(float(dec), 3),
                "response_consistency": round(float(cons), 3),
                "composite_score": round(float(composite_score), 4),
                "skill_level": level,
            })

    df = pd.DataFrame(data)
    return df


def main():
    output_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "skill_level_dataset.csv")

    df = generate_synthetic_skill_dataset(num_samples=2100)
    df.to_csv(output_file, index=False)
    print(f"[ML] Generated synthetic skill dataset with {len(df)} records at: {output_file}")
    print(df["skill_level"].value_counts(normalize=True))


if __name__ == "__main__":
    main()
