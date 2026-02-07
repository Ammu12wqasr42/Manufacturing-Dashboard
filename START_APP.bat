@echo off
REM Start Backend
cd c:\Users\amans\OneDrive\Desktop\Dixon\backend
echo Starting Backend Server...
start cmd /k "npm start"
timeout /t 3

REM Start Frontend
cd c:\Users\amans\OneDrive\Desktop\Dixon\frontend
echo Installing Frontend Dependencies...
call npm install
echo Starting Frontend...
call npm start
