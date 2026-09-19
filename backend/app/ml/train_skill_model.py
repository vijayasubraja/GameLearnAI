import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from app.ml.generate_skill_dataset import generate_synthetic_skill_dataset

FEATURE_COLUMNS = [
    "experience_rating",
    "confidence_score",
    "knowledge_score",
    "situational_decision_score",
    "response_consistency",
]

TARGET_COLUMN = "skill_level"
CLASS_NAMES = ["Beginner", "Intermediate", "Advanced"]


def train_and_save_skill_model():
    ml_dir = os.path.dirname(__file__)
    data_file = os.path.join(ml_dir, "data", "skill_level_dataset.csv")

    if os.path.exists(data_file):
        df = pd.read_csv(data_file)
    else:
        df = generate_synthetic_skill_dataset()

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Scikit-learn Pipeline with Scaler and Random Forest Classifier
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("rf", RandomForestClassifier(n_estimators=120, max_depth=10, random_state=42)),
    ])

    pipeline.fit(X_train, y_train)

    # Evaluation
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average="macro")
    cm = confusion_matrix(y_test, y_pred, labels=CLASS_NAMES)

    report = classification_report(y_test, y_pred, target_names=CLASS_NAMES)

    print(f"==================================================")
    print(f"   GameLearn AI — Skill ML Model Training Results ")
    print(f"==================================================")
    print(f"Accuracy: {acc * 100:.2f}%")
    print(f"Macro F1: {f1:.4f}")
    print("\nConfusion Matrix:")
    print(pd.DataFrame(cm, index=CLASS_NAMES, columns=CLASS_NAMES))
    print("\nClassification Report:")
    print(report)

    # Save model artifact
    models_dir = os.path.join(ml_dir, "saved_models")
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, "skill_level_rf.joblib")

    joblib.dump(pipeline, model_path)
    print(f"[ML] Model pipeline successfully serialized to: {model_path}")

    return {
        "accuracy": acc,
        "f1_score": f1,
        "model_path": model_path,
    }


if __name__ == "__main__":
    train_and_save_skill_model()
