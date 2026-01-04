# Adaptive Exam AI - Intelligent Competitive Exam Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Production--Ready-green.svg)

> **A futuristic, AI-powered adaptive learning platform designed for the modern student.**
> Built with FastAPI, React, and Behavioral Knowledge Graph technology.

---

## 🚀 Overview

**Adaptive Exam AI** is not just a quiz app; it's a personal AI tutor that learns how you learn. By tracking response times, accuracy patterns, and topic relationships, it builds a dynamic **Knowledge Graph** of your skills. It then predicts which topics you are likely to fail next and adapts the question difficulty in real-time to keep you in the optimal learning zone.

### Key Features
*   **🧠 Dynamic Knowledge Graph**: Visualizes your mastery of concepts in a network graph.
*   **🔮 Weakness Prediction**: AI algorithms predict your next failure before it happens.
*   **⚡ Adaptive Difficulty Engine**: Questions get harder as you get better (Zone of Proximal Development).
*   **📊 Future-Gen Dashboard**: Glassmorphism UI with real-time analytics and neon aesthetics.
*   **🤖 AI Chat Tutor**: Integrated conceptual support that detects confusion.

---

## 🛠️ System Architecture

### Tech Stack
*   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts.
*   **Backend**: FastAPI (Python), SQLAlchemy, Pydantic.
*   **AI/Logic**:
    *   **Knowledge Engine**: Rule-based strength propagation (upgradable to Neo4j).
    *   **Predictor**: Trend analysis & probability scoring.
    *   **Database**: SQLite (Production-ready for PostgreSQL).

### Project Structure
```
adaptive-exam-ai/
├── backend/            # FastAPI Application
│   ├── main.py         # Entry point & API Routes
│   ├── models.py       # DB Schema (User, Quiz, Question)
│   ├── knowledge_graph.py # AI Logic for skill tracking
│   ├── predictor.py    # Risk analysis algorithms
│   └── database.py     # SQLite connection
│
├── frontend/           # React Application
│   ├── src/
│   │   ├── Dashboard.js    # Analytics View
│   │   ├── Quiz.js         # Adaptive Engine UI
│   │   ├── KnowledgeGraph.js # Visual Node Graph
│   │   └── api.js          # Backend Connection
│   └── tailwind.config.js  # Design System
```

---

## ⚡ Quick Start Guide

### Prerequisites
*   Node.js & npm
*   Python 3.9+

### 1. Setup Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
*Server runs at `http://localhost:8000`*

### 2. Setup Frontend
```bash
cd frontend
npm install
# Note: If you see a security error on Windows, use: npm.cmd install
npm run dev
```
*Client runs at `http://localhost:5173`*

---

## 🎨 UI/UX Philosophy
We adopted a **"Dark Mode First"** philosophy with **Glassmorphism** elements to create a premium, high-tech feel.
*   **Visual Hierarchy**: Important data (Predictions) pops out in Red/Neon.
*   **Micro-interactions**: Smooth transitions between quiz questions reduce cognitive load.
*   **Clean Data**: Analytics are presented purely, without clutter.

---

## 🔮 Future Enhancements
*   [ ] **Neo4j Integration**: For complex dependency modeling (e.g., Algebra -> Calculus).
*   [ ] **LLM Integration**: Connect Chat Tutor to GPT-4 for deep concept explanation.
*   [ ] **Multi-User Classrooms**: For teacher/student monitoring.

---

**Developed for Advanced Agentic Coding - Project Yuva**