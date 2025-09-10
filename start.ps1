# ========================================
#    CHOPISTIC - AI Learning Platform
# ========================================

Write-Host "========================================"
Write-Host "   CHOPISTIC - AI Learning Platform"
Write-Host "========================================`n"
Write-Host "Starting Chopistic Learning Platform...`n"

# Define the desired port
$PORT = 3000

# Change to the script directory (project root)
Set-Location -Path $PSScriptRoot

# [1/4] Check if Node.js is installed
Write-Host "[1/4] Checking Node.js installation..."
try {
    $null = & node -v 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Node.js is not installed!`n"
        Write-Host "Please install Node.js from: https://nodejs.org/"
        Write-Host "Recommended version: 18.x or higher`n"
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "Node.js is installed"
    & node -v
} catch {
    Write-Host "ERROR: Node.js is not installed!`n"
    Read-Host "Press Enter to exit"
    exit 1
}

# [2/4] Verify project structure
Write-Host "`n[2/4] Verifying project structure..."
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found!"
    Write-Host "Please run this script from the Chopistic project root directory.`n"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Project structure verified"

# [3/4] Check dependencies
Write-Host "`n[3/4] Checking dependencies..."
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing project dependencies..."
    Write-Host "This may take a few minutes...`n"
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies!"
        Write-Host "Please check your internet connection and try again.`n"
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "Dependencies installed successfully"
} else {
    Write-Host "Dependencies already installed"
}

# [4/4] Start the development server
Write-Host "`n[4/4] Starting Chopistic...`n"
Write-Host "Server will start on: http://localhost:$PORT`n"
Write-Host "========================================"
Write-Host " Ready to learn AI? Let's get started!"
Write-Host "========================================`n"

# Start the dev server in a new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting Chopistic on port $PORT...'; npm run dev -- --port $PORT --host" -WindowStyle Normal

# Wait for server to start
Write-Host "Waiting for server to initialize..."
Start-Sleep -Seconds 3

# Automatically open the browser
Write-Host "Opening Chopistic in your default browser..."
Start-Process "http://localhost:$PORT"

Write-Host "`n========================================"
Write-Host "      Chopistic is now running!"
Write-Host "========================================`n"
Write-Host "• Web Interface: http://localhost:$PORT"
Write-Host "• Press Ctrl+C in the server window to stop"
Write-Host "• To restart, simply run this script again"
Write-Host "`nHappy Learning!`n"

Read-Host "Press Enter to exit"
