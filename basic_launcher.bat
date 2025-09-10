@echo off

echo ========================================
echo    CHOPISTIC - AI Learning Platform
echo ========================================
echo.
echo Starting Chopistic Learning Platform...
echo.

:: Define the desired port
set PORT=3000

:: Change to the script directory (project root)
cd /d "%~dp0"

:: [1/4] Check if Node.js is installed
echo [1/4] Checking Node.js installation...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Recommended version: 18.x or higher
    echo.
    pause
    exit /b 1
)

echo Node.js is installed
node -v

:: [2/4] Verify project structure
echo.
echo [2/4] Verifying project structure...
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the Chopistic project root directory.
    echo.
    pause
    exit /b 1
)

echo Project structure verified

:: [3/4] Check dependencies
echo.
echo [3/4] Checking dependencies...
if not exist "node_modules" (
    echo Installing project dependencies...
    echo This may take a few minutes...
    echo.
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        echo Please check your internet connection and try again.
        echo.
        pause
        exit /b 1
    )
    echo Dependencies installed successfully
) 

if exist "node_modules" (
    echo Dependencies already installed
)

:: [4/4] Start the development server
echo.
echo [4/4] Starting Chopistic...
echo.
echo Server will start on: http://localhost:%PORT%
echo.
echo ========================================
echo  Ready to learn AI? Let's get started!
echo ========================================
echo.

:: Start the development server with specified port
start cmd /k "title Chopistic Development Server && echo Starting Chopistic on port %PORT%... && npm run dev -- --port %PORT% --host"

:: Wait for server to start
echo Waiting for server to initialize...
timeout /t 3 /nobreak >nul

:: Automatically open the browser
echo Opening Chopistic in your default browser...
start http://localhost:%PORT%

echo.
echo ========================================
echo       Chopistic is now running!
echo ========================================
echo.
echo • Web Interface: http://localhost:%PORT%
echo • Press Ctrl+C in the server window to stop
echo • To restart, simply run this script again
echo.
echo Happy Learning!
echo.
pause
