@echo off
echo Starting Job Orbit with Resume Parser Integration...
echo.

echo [1/3] Starting FastAPI Resume Parser Service...
echo Please make sure your .env file has the GEMINI_API_KEY set up
start "Resume Parser" cmd /k "cd /d ""d:\Chitkara Books and PDFs\Sem 5\Fed project\job-orbit\jobOrbitResume"" && .\venv\Scripts\activate && uvicorn main:app --reload --port 8000"

timeout /t 5

echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd /d ""d:\Chitkara Books and PDFs\Sem 5\Fed project\job-orbit\server"" && npm run dev"

timeout /t 3

echo [3/3] Starting Frontend Application...
start "Frontend App" cmd /k "cd /d ""d:\Chitkara Books and PDFs\Sem 5\Fed project\job-orbit\client"" && npm run dev"

echo.
echo ===================================
echo All services are starting up!
echo ===================================
echo.
echo Services will be available at:
echo - FastAPI Resume Parser: http://127.0.0.1:8000/docs
echo - Backend API: http://localhost:5000
echo - Frontend App: http://localhost:5173
echo.
echo Make sure to:
echo 1. Set up GEMINI_API_KEY in jobOrbitResume/.env
echo 2. Wait for all services to fully start
echo 3. Test resume upload functionality
echo.
pause