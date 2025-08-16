# Start both API server and Nuxt development server
Write-Host "🚀 Starting Nuxt Transaction App..." -ForegroundColor Green

# Check if node is available
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Start API server
Write-Host "Starting API server on port 3002..." -ForegroundColor Yellow
$apiJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\Administrator\Music\nuxt-transaction\api"
    node server.js
}

# Wait a moment for API server to start
Start-Sleep -Seconds 2

# Check if API server is running
$apiRunning = netstat -ano | Select-String ":3002"
if ($apiRunning) {
    Write-Host "✅ API server started successfully" -ForegroundColor Green
} else {
    Write-Host "❌ API server failed to start" -ForegroundColor Red
    Stop-Job $apiJob
    Remove-Job $apiJob
    exit 1
}

# Start Nuxt dev server
Write-Host "Starting Nuxt development server..." -ForegroundColor Yellow
$nuxtJob = Start-Job -ScriptBlock {
    Set-Location "C:\Users\Administrator\Music\nuxt-transaction"
    npm run dev
}

# Wait a moment for Nuxt server to start
Start-Sleep -Seconds 5

Write-Host "Both servers are starting up!" -ForegroundColor Green
Write-Host "Server Information:" -ForegroundColor Cyan
Write-Host "   • API Server: http://localhost:3002/api" -ForegroundColor White
Write-Host "   • Nuxt App: http://localhost:3000 or http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow

# Keep script running and monitor jobs
try {
    while ($true) {
        if ($apiJob.State -eq "Failed") {
            Write-Host "API server has stopped" -ForegroundColor Red
            break
        }
        if ($nuxtJob.State -eq "Failed") {
            Write-Host "Nuxt server has stopped" -ForegroundColor Red
            break
        }
        Start-Sleep -Seconds 1
    }
} finally {
    # Clean up jobs
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job $apiJob -ErrorAction SilentlyContinue
    Stop-Job $nuxtJob -ErrorAction SilentlyContinue
    Remove-Job $apiJob -ErrorAction SilentlyContinue
    Remove-Job $nuxtJob -ErrorAction SilentlyContinue
    Write-Host "Servers stopped" -ForegroundColor Green
}
