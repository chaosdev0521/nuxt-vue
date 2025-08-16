# FinanceFlow Network Startup Script
Write-Host "Starting FinanceFlow for Network Access..." -ForegroundColor Green

# Get local IP address
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*" | Where-Object {$_.IPAddress -ne "127.0.0.1"}).IPAddress[0]
if (-not $ipAddress) {
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -ne "127.0.0.1" -and $_.IPAddress -notlike "169.*"}).IPAddress[0]
}

Write-Host "Your IP Address: $ipAddress" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting API Server on port 3002..." -ForegroundColor Cyan

# Start API server in background
Start-Process powershell -ArgumentList "-Command", "cd '$PWD\api'; npm start" -WindowStyle Minimized

# Wait a moment for API server to start
Start-Sleep 3

Write-Host "Starting Nuxt Development Server..." -ForegroundColor Cyan

# Set environment variable for API base
$env:NUXT_HOST = $ipAddress

# Start Nuxt with network access
npm run dev

Write-Host ""
Write-Host "Access URLs:" -ForegroundColor Green
Write-Host "   Local:    http://localhost:3000" -ForegroundColor White
Write-Host "   Network:  http://$ipAddress:3000" -ForegroundColor White
Write-Host "
Write-Host "API Server:" -ForegroundColor Green  
Write-Host "   Local:    http://localhost:3002" -ForegroundColor White
Write-Host "   Network:  http://$ipAddress:3002" -ForegroundColor White
Write-Host ""
Write-Host "Share the Network URL with other users on your local network!" -ForegroundColor Yellow
