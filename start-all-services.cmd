@echo off
set MAVEN_CMD=C:\maven\bin\mvn.cmd
set BASE_DIR=C:\ticket_booking_requiem1.1\src

echo ========================================
echo Starting Cinema Microservices
echo ========================================
echo.

:: Открываем окна для всех сервисов параллельно
start "Discovery Service" cmd /c "cd /d %BASE_DIR%\cinema-discovery && %MAVEN_CMD% spring-boot:run"
start "Film Service" cmd /c "cd /d %BASE_DIR%\cinema-film-service && %MAVEN_CMD% spring-boot:run"
start "Booking Service" cmd /c "cd /d %BASE_DIR%\cinema-booking-service && %MAVEN_CMD% spring-boot:run"
start "Notification Service" cmd /c "cd /d %BASE_DIR%\cinema-notification-service && %MAVEN_CMD% spring-boot:run"
start "Gateway" cmd /c "cd /d %BASE_DIR%\cinema-gateway && %MAVEN_CMD% spring-boot:run"
start "Frontend" cmd /c "cd /d %BASE_DIR%\cinema-frontend && npm start"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Services:
echo   - Discovery: http://localhost:8761
echo   - Film: http://localhost:8081
echo   - Booking: http://localhost:8082
echo   - Notification: http://localhost:8083
echo   - Gateway: http://localhost:8080
echo   - Frontend: http://localhost:3000
echo.
echo NOTE: Discovery Service needs ~10 seconds to start first time
echo       Other services will retry connection automatically
echo.
pause