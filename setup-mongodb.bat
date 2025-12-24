@echo off
echo Setting up local MongoDB for RankTime development...

REM Check if MongoDB is installed
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not installed. Please install MongoDB Community Edition from:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo Or use Chocolatey: choco install mongodb
    echo Or use winget: winget install MongoDB.MongoDB
    pause
    exit /b 1
)

echo MongoDB is installed. Starting MongoDB service...

REM Create data directory if it doesn't exist
if not exist "C:\data\db" (
    mkdir "C:\data\db"
    echo Created data directory: C:\data\db
)

REM Start MongoDB
echo Starting MongoDB on port 27017...
start "MongoDB" mongod --dbpath "C:\data\db"

echo MongoDB is starting up...
timeout /t 5 /nobreak >nul

echo Testing connection...
mongo --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB is running successfully!
    echo You can now use the application at http://localhost:3000
) else (
    echo ❌ MongoDB connection failed. Please check if the service is running.
)

echo.
echo To stop MongoDB later, run: taskkill /f /im mongod.exe
pause