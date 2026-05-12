@echo off
echo ========================================
echo Stopping Cinema Microservices
echo ========================================
echo.

:: Закрываем окна по названиям
taskkill /FI "WINDOWTITLE eq Discovery Service*" /T /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Film Service*" /T /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Booking Service*" /T /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Notification Service*" /T /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Gateway*" /T /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend*" /T /F > nul 2>&1

echo All services stopped.
echo.
pause