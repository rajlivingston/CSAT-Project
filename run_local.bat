@echo off
TITLE RapidCSAT Local Starter
echo ========================================
echo   RapidCSAT One-Click Local Starter
echo ========================================
echo.
echo [1/2] Launching Backend (WSL)...

:: Change directory to where your project is stored
:: Assuming it is in the standard WSL home path
wsl -d Ubuntu -u raj_livingston_2003_ bash -c "cd /home/raj_livingston_2003_/csat-project && poetry run python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo Project is running! 
echo Dashboard: http://localhost:8000/admin
echo Feedback:  http://localhost:8000/
echo.
pause
