# Function to handle cleanup on script exit
function Cleanup {
    Write-Host "`nShutting down servers..." -ForegroundColor Yellow
    if ($backendProcess -and !$backendProcess.HasExited) {
        $backendProcess.Kill()
    }
    if ($frontendProcess -and !$frontendProcess.HasExited) {
        $frontendProcess.Kill()
    }
    exit
}

# Register cleanup function for Ctrl+C
$null = Register-ObjectEvent -InputObject ([Console]) -EventName CancelKeyPress -Action { Cleanup }

try {
    # Start backend
    Write-Host "Starting Flask backend..." -ForegroundColor Green
    Set-Location -Path ".\backend"
    
    # Check if virtual environment exists
    if (-Not (Test-Path "venv")) {
        Write-Host "Creating virtual environment..." -ForegroundColor Yellow
        python -m venv venv
    }
    
    # Activate virtual environment and install requirements
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    .\venv\Scripts\Activate
    pip install -r requirements.txt
    
    # Start backend process
    $backendProcess = Start-Process -FilePath "python" -ArgumentList "-m flask run" -NoNewWindow -PassThru
    Set-Location -Path ".."

    # Start frontend
    Write-Host "`nStarting React frontend..." -ForegroundColor Green
    Set-Location -Path ".\frontend"
    
    # Install dependencies if needed
    if (-Not (Test-Path "node_modules")) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    # Start frontend process
    $frontendProcess = Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow -PassThru
    Set-Location -Path ".."

    Write-Host "`nServers are running!" -ForegroundColor Green
    Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "`nPress Ctrl+C to stop both servers" -ForegroundColor Yellow

    # Keep script alive until user interrupts
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
catch {
    Write-Host "`nAn error occurred: $_" -ForegroundColor Red
    Cleanup
} 