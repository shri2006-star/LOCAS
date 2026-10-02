@echo off
title LOCAS Spring Boot Backend Server (Port 8080)
echo ===================================================================
echo   LOCAS BANK BACKEND SERVICE - CONNECTING TO MYSQL DATABASE
echo   Port: 8080 | DB Target: jdbc:mysql://localhost:3306/locas
echo ===================================================================
echo.

if exist mvnw.cmd (
    call mvnw.cmd spring-boot:run
) else if exist ..\mvnw.cmd (
    call ..\mvnw.cmd spring-boot:run
) else (
    echo [ERROR] mvnw.cmd wrapper script not found. Please run mvn spring-boot:run.
)
pause
