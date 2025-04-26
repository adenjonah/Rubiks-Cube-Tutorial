@echo off
echo Starting servers...

:: Start backend
echo Starting Flask backend...
cd backend
start cmd /k "python -m flask run"
cd ..

:: Start frontend
echo Starting React frontend...
cd frontend
start cmd /k "npm start"
cd ..

echo Both servers are running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop both servers...
pause > nul

:: Kill both servers
taskkill /F /IM node.exe
taskkill /F /IM python.exe 