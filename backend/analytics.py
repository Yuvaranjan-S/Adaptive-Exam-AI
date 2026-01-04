from sqlalchemy.orm import Session
from sqlalchemy import func
from models import QuizAttempt, KnowledgeNode

class AnalyticsEngine:
    def __init__(self, db: Session):
        self.db = db

    def get_student_stats(self, user_id: int):
        # Total Quizzes
        total_quizzes = self.db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).count()
        
        # Average Score
        avg_score = self.db.query(func.avg(QuizAttempt.score)).filter(QuizAttempt.user_id == user_id).scalar() or 0.0
        
        # Strongest Topic
        strongest = self.db.query(KnowledgeNode).filter(
            KnowledgeNode.user_id == user_id
        ).order_by(KnowledgeNode.strength_score.desc()).first()

        # Weakest Topic
        weakest = self.db.query(KnowledgeNode).filter(
            KnowledgeNode.user_id == user_id
        ).order_by(KnowledgeNode.strength_score.asc()).first()

        return {
            "total_quizzes": total_quizzes,
            "average_score": round(avg_score, 1),
            "strongest_topic": strongest.topic if strongest else "N/A",
            "weakest_topic": weakest.topic if weakest else "N/A",
            "mastery_level": "Intermediate" if avg_score > 70 else "Beginner" # Simple logic
        }