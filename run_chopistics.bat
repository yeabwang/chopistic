@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    Chopistics - Auto Setup and Run
echo ========================================
echo.

:: Check if we're in the right directory
if not exist "chopistic-main\package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the project root directory.
    echo.
    pause
    exit /b 1
)

:: Change to the project directory
cd chopistic-main

echo [1/4] Checking Node.js installation...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is available

echo.
echo [2/4] Checking npm installation...
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH!
    echo.
    pause
    exit /b 1
)

echo [OK] npm is available

echo.
echo [3/4] Installing dependencies...
if exist node_modules goto deps_installed
echo Installing npm packages (this may take a few minutes)...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    echo.
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully
goto deps_done
:deps_installed
echo [OK] Dependencies already installed
:deps_done

echo.
echo [4/4] Starting development server...
echo.
echo ========================================
echo    Starting Chopistics...
echo ========================================
echo.
echo The application will open in your browser shortly.
echo To stop the server, press Ctrl+C
echo.
echo ========================================

:: Start the development server
npm run dev

:: If we get here, the server was stopped
echo.
echo Development server stopped.
pause
