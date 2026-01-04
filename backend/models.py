from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attempts = relationship("QuizAttempt", back_populates="user")
    knowledge_nodes = relationship("KnowledgeNode", back_populates="user")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True)
    subtopic = Column(String, index=True)
    difficulty = Column(Float)  # 0.0 to 1.0
    content = Column(String)
    options = Column(JSON)  # List of strings
    correct_answer = Column(String)
    explanation = Column(String, nullable=True)

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="attempts")
    logs = relationship("QuestionLog", back_populates="attempt")

class QuestionLog(Base):
    __tablename__ = "question_logs"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_answer = Column(String)
    is_correct = Column(Boolean)
    time_taken = Column(Float)  # in seconds
    difficulty_at_time = Column(Float)
    
    attempt = relationship("QuizAttempt", back_populates="logs")
    question = relationship("Question")

class KnowledgeNode(Base):
    __tablename__ = "knowledge_nodes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String, index=True)
    strength_score = Column(Float, default=0.0)  # 0.0 to 1.0 (Mastery)
    volatility = Column(Float, default=0.5) # How fast it changes
    last_updated = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="knowledge_nodes")