@echo off
echo Starting Yuva App...
echo Ensuring frontend is built...
if not exist "frontend\dist" (
    echo Building frontend...
    cd frontend
    call npm install
    call npm run build
    cd ..
)

echo Starting Backend Server...
cd backend
echo Open your browser at: http://localhost:8000
python -m uvicorn main:app --host 0.0.0.0 --port 8000
pause
