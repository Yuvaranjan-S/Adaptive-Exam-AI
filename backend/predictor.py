from sqlalchemy.orm import Session
from models import KnowledgeNode

class PredictorEngine:
    def __init__(self, db: Session):
        self.db = db

    def predict_weak_areas(self, user_id: int, top_n: int = 3):
        """
        Identifies the top N topics the user is likely to fail next.
        Logic: Lowest strength scores.
        Future Upgrade: Look at recent consecutive failures.
        """
        nodes = self.db.query(KnowledgeNode).filter(
            KnowledgeNode.user_id == user_id
        ).order_by(KnowledgeNode.strength_score.asc()).limit(top_n).all()

        recommendations = []
        for node in nodes:
            risk = "CRITICAL" if node.strength_score < 0.3 else "MODERATE"
            recommendations.append({
                "topic": node.topic,
                "current_mastery": round(node.strength_score * 100, 1),
                "risk_level": risk,
                "predicted_fail_probability": round((1.0 - node.strength_score) * 0.9, 2) # Heuristic
            })
        
        return recommendations