# run.ps1

# Function to handle cleanup on script exit
function Cleanup {
    Write-Host "Shutting down server..."
    if ($backendProcess -and !$backendProcess.HasExited) {
        $backendProcess.Kill()
    }
    exit
}

# Start Flask backend
Write-Host "Starting Flask backend..."
Set-Location -Path ".\backend"

# Check if requirements are installed
if (-Not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
    Write-Host "Activating virtual environment..."
    .\venv\Scripts\Activate
    Write-Host "Installing requirements..."
    pip install -r requirements.txt
} else {
    Write-Host "Activating virtual environment..."
    .\venv\Scripts\Activate
}

Write-Host "Starting Flask server..."
$backendProcess = Start-Process -FilePath "python" -ArgumentList "-m flask run" -NoNewWindow -PassThru

# Register Ctrl+C (SIGINT) handler
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

Write-Host "Server is running. Press Ctrl+C to stop."

# Keep script alive until user interrupts
while ($true) {
    Start-Sleep -Seconds 1
}
