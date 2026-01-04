from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from models import Question, KnowledgeNode
import random

class QuestionGenerator:
    def __init__(self, db: Session):
        self.db = db

    def get_next_question(self, user_id: int):
        """
        Adapts to the user.
        1. Pick a topic (randomly or based on weak areas).
        2. Check user's strength in that topic.
        3. Fetch a question with difficulty close to that strength (Zone of Proximal Development).
        """
        # Simple strategy: 70% chance to pick a random topic to explore/reinforce, 
        # 30% chance to target a weak area.
        
        topic = None
        target_difficulty = 0.5
        
        # Get weak nodes
        weak_nodes = self.db.query(KnowledgeNode).filter(
            KnowledgeNode.user_id == user_id,
            KnowledgeNode.strength_score < 0.4
        ).all()

        if weak_nodes and random.random() < 0.3:
            # Re-test weak area
            node = random.choice(weak_nodes)
            topic = node.topic
            target_difficulty = max(0.1, node.strength_score) # Ensure it's not impossible, but near their level
        else:
            # Explore/Random
            # Ideally we pick from available question topics
            available_topics = self.db.query(Question.topic).distinct().all()
            if available_topics:
                topic = random.choice(available_topics)[0]
                # Get current strength for this topic to adapt
                node = self.db.query(KnowledgeNode).filter(
                    KnowledgeNode.user_id == user_id, 
                    KnowledgeNode.topic == topic
                ).first()
                target_difficulty = node.strength_score if node else 0.3 # Default to easy-medium if new
        
        if not topic:
            # Fallback if no topics found (DB empty?)
            return None

        # Find question with difficulty close to target_difficulty (+/- 0.2)
        # simplistic query
        question = self.db.query(Question).filter(
            Question.topic == topic,
            Question.difficulty.between(target_difficulty - 0.2, target_difficulty + 0.2)
        ).order_by(func.random()).first()

        # Fallback: if no question in range, just get any question for that topic
        if not question:
            question = self.db.query(Question).filter(Question.topic == topic).order_by(func.random()).first()
            
        return question

    def seed_questions(self):
        """Helper to seed DB if empty."""
        if self.db.query(Question).count() > 0:
            return

        # Sample data
        data = [
            ("React", "Basics", 0.2, "What is a Component?", ["A function/class", "A variable", "A database"], "A function/class"),
            ("React", "Hooks", 0.6, "What does useEffect do?", ["Side effects", "Routing", "Styling"], "Side effects"),
            ("React", "State", 0.8, "Difference between State and Props?", ["State is mutable", "Props are mutable", "Both same"], "State is mutable"),
            ("Python", "Basics", 0.1, "Output of print(2+2)?", ["4", "22", "Error"], "4"),
            ("Python", "Lists", 0.4, "How to append to list?", [".push()", ".append()", ".add()"], ".append()"),
            ("Python", "Advanced", 0.9, "What is a decorator?", ["A function modifying another", "A comment", "A class"], "A function modifying another"),
            ("AI", "Concepts", 0.5, "What is Supervised Learning?", ["Labeled data", "No labels", "Reinforcement"], "Labeled data"),
            ("AI", "Neural Nets", 0.8, "What is Backpropagation?", ["Updating weights", "Forward pass", "Data cleaning"], "Updating weights"),
        ]

        for t, sub, diff, q, opts, ans in data:
            self.db.add(Question(
                topic=t, subtopic=sub, difficulty=diff, 
                content=q, options=opts, correct_answer=ans
            ))
        self.db.commit()
