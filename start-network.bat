@echo off
title FinanceFlow Network Setup

echo Starting FinanceFlow for Network Access...
echo.

echo Starting API Server...
cd api
start "API Server" cmd /k "npm start"
cd..

echo Waiting for API server to start...
timeout /t 3 /nobreak >nul

echo Starting Nuxt Development Server...
set NUXT_HOST=0.0.0.0
set NUXT_PUBLIC_API_BASE=http://66.94.117.199:3002/api
npm run dev

echo.
echo Network access configured!
echo Share this URL with other users: http://66.94.117.199:3000
echo.
pause
