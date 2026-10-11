@echo off
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js est necessaire pour lancer le jeu sur ce PC.
 pause
 exit /b 1
)
echo Ouvrez http://localhost:4173 et gardez cette fenetre ouverte.
node "%~dp0server.cjs"
pause
