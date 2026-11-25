@echo off
setlocal
cd /d "%~dp0"

set "BACKEND_DIR=%~dp0backend"
set "FRONTEND_DIR=%~dp0frontend"
set "PYTHON_EXE=%BACKEND_DIR%\.venv\Scripts\python.exe"

where py >nul 2>nul
if errorlevel 1 (
  echo ERROR: Python Launcher ^(py^) was not found.
  echo Install Python from python.org and enable the Python Launcher option.
  goto :error
)

if not exist "%PYTHON_EXE%" (
  echo Creating a project-specific Python virtual environment...
  py -3 -m venv "%BACKEND_DIR%\.venv"
  if errorlevel 1 goto :error
)

echo.
echo Installing/verifying backend dependencies in the project's own environment...
"%PYTHON_EXE%" -m pip install --upgrade pip
if errorlevel 1 goto :error
"%PYTHON_EXE%" -m pip install -r "%BACKEND_DIR%\requirements.txt"
if errorlevel 1 goto :error

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js was not found. Install Node.js 20 LTS or newer, then reopen PowerShell.
  goto :error
)
where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm was not found. Reinstall Node.js with npm included, then reopen PowerShell.
  goto :error
)

if not exist "%FRONTEND_DIR%\node_modules" (
  echo.
  echo Installing frontend packages...
  pushd "%FRONTEND_DIR%"
  call npm install
  if errorlevel 1 (popd & goto :error)
  popd
)

echo.
echo Starting FastAPI with the project virtual environment...
start "AI Resume Reviewer API" cmd /k "cd /d ""%BACKEND_DIR%"" && ""%PYTHON_EXE%"" -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo Starting React frontend...
start "AI Resume Reviewer Frontend" cmd /k "cd /d ""%FRONTEND_DIR%"" && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Frontend: http://localhost:5173
echo Backend docs: http://127.0.0.1:8000/docs
echo.
echo IMPORTANT: Do not run backend\main.py with the VS Code Run button.
echo This app must be started with Uvicorn, as this script does.
pause
exit /b 0

:error
echo.
echo Setup could not finish. Read the error above, correct it, and run this file again.
pause
exit /b 1
