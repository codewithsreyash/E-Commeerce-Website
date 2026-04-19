@echo off
echo =========================================
echo    Stopping ShopStream Services...
echo =========================================
echo.

echo [1/2] Stopping Backend (Java)...
taskkill /F /IM java.exe 2>nul
if %ERRORLEVEL% == 0 (
    echo      Backend stopped successfully.
) else (
    echo      No backend process found.
)

echo.
echo [2/2] Stopping Frontend (Node.js)...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% == 0 (
    echo      Frontend stopped successfully.
) else (
    echo      No frontend process found.
)

echo.
echo =========================================
echo    All services stopped!
echo =========================================
pause
