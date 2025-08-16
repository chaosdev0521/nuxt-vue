@echo off
echo Starting Transaction Manager Application...
echo ===========================================
echo.

:: Check if frontend dependencies are installed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)

:: Check if API dependencies are installed
if not exist "api/node_modules" (
    echo Installing API dependencies...
    cd api
    npm install
    cd ..
)

echo.
echo Starting servers...

:: Start API server in background
echo • Starting API server on port 3002...
start /min cmd /c "cd api && npm start"

:: Wait a moment for API server to start
timeout /t 3 /nobreak > nul

:: Start frontend server
echo • Starting frontend server on port 3001...
echo.
echo Servers starting...
echo Frontend: http://localhost:3001
echo API:      http://localhost:3002
echo.
echo Press Ctrl+C to stop the frontend server.
echo Note: API server runs in background. Use Task Manager to stop if needed.
echo.

npm run dev
