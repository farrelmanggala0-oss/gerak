@echo off
title GERAK. - Platform Kesehatan Inklusif Gen Z
cd /d "%~dp0"

echo ======================================================
echo   Sedang Mengaktifkan Website GERAK...
echo ======================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Menggunakan Node.js server...
    node server.js
    goto selesai
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Menggunakan Python server...
    start http://localhost:3000
    python -m http.server 3000
    goto selesai
)

echo [Peringatan] Node.js atau Python tidak terdeteksi.
echo Membuka index.html di browser...
start index.html

:selesai
pause