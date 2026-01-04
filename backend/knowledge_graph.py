from sqlalchemy.orm import Session
from models import KnowledgeNode, User, QuestionLog
from datetime import datetime

class KnowledgeGraphEngine:
    def __init__(self, db: Session):
        self.db = db

    def update_topic_strength(self, user_id: int, topic: str, is_correct: bool, difficulty: float):
        """
        Updates the knowledge node strength for a user/topic based on recent performance.
        Uses a moving average approach with difficulty weighting.
        """
        node = self.db.query(KnowledgeNode).filter(
            KnowledgeNode.user_id == user_id, 
            KnowledgeNode.topic == topic
        ).first()

        if not node:
            node = KnowledgeNode(user_id=user_id, topic=topic, strength_score=0.1)
            self.db.add(node)
        
        # Adaptive Logic:
        # If correct: Increase strength. Gain is higher if difficulty > current strength.
        # If wrong: Decrease strength. Penalty is higher if difficulty < current strength.
        
        current = node.strength_score
        learning_rate = 0.1
        
        if is_correct:
            # Boost based on difficulty vs mastery gap
            gap = max(0, difficulty - current)
            boost = learning_rate * (1 + gap)
            new_score = min(1.0, current + boost)
        else:
            # Penalize. If I failed an easy question, huge penalty.
            gap = max(0, current - difficulty)
            penalty = learning_rate * (1 + gap)
            new_score = max(0.0, current - penalty)

        node.strength_score = new_score
        node.last_updated = datetime.utcnow()
        self.db.commit()
        return new_score

    def get_user_knowledge_graph(self, user_id: int):
        """Returns all knowledge nodes for a user."""
        nodes = self.db.query(KnowledgeNode).filter(KnowledgeNode.user_id == user_id).all()
        return [{"topic": n.topic, "strength": n.strength_score} for n in nodes]