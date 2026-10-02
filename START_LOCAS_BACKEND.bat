@echo off
title START LOCAS BACKEND FOR MYSQL
echo ===================================================================
echo   LOCAS BANK - STARTING SPRING BOOT BACKEND FOR MYSQL
echo   Target Database: MySQL (localhost:3306/locas)
echo ===================================================================
echo.

cd /d "%~dp0locas-backend"
call mvnw.cmd spring-boot:run

pause
