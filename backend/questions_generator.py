import random

class QuestionGenerator:
    def __init__(self):
        self.question_bank = {
            "Algebra": [
                {"q": "Solve x + 5 = 10", "a": "5", "options": ["3", "4", "5", "6"], "difficulty": 0.2},
                {"q": "Solve 2x = 12", "a": "6", "options": ["2", "4", "6", "8"], "difficulty": 0.3}
            ],
            "Calculus": [
                {"q": "Derivative of x^2", "a": "2x", "options": ["x", "2x", "x^2", "2"], "difficulty": 0.5},
                {"q": "Integral of 1 dx", "a": "x", "options": ["1", "x", "0", "C"], "difficulty": 0.4}
            ]
        }

    def generate_question(self, topic, difficulty):
        questions = self.question_bank.get(topic, [])
        if not questions:
            return {"q": f"Sample question for {topic}?", "a": "Answer", "options": ["A", "B", "C", "D"]}
        
        # Simple selection based on closest difficulty
        return random.choice(questions)