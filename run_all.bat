@echo off
TITLE QuickTask Full-Stack Launcher

echo Starting QuickTask Services...
echo.

:: Start Backend (Node.js)
echo [1/3] Launching Node.js Backend on Port 5000...
start "QuickTask-Backend" cmd /k "cd backend && npm start"

:: Start Analytics (Python)
echo [2/3] Launching Python Analytics on Port 8000...
start "QuickTask-Analytics" cmd /k "cd analytics && python main.py"

:: Start Frontend (React/Vite)
echo [3/3] Launching React Frontend on Port 5173...
start "QuickTask-Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services are starting in separate windows.
echo Frontend: http://localhost:5173
echo.
pause
