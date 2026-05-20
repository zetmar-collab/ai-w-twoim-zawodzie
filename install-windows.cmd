@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul 2>&1
title Instalacja – AI w Twoim Zawodzie

echo.
echo  ========================================================
echo    AI w Twoim Zawodzie  –  Instalator Windows
echo    by Cyfrowy Przyjaciel  ^|  Marek Zettel
echo  ========================================================
echo.

:: Ustal katalog instalatora i podkatalog app\
set "INST_DIR=%~dp0"
set "APP_DIR=%INST_DIR%app"

if not exist "%APP_DIR%\package.json" (
  echo  [BLAD] Nie znaleziono folderu "app" obok tego pliku.
  echo         Upewnij sie, ze rozpakowales archiwum ZIP w calosci.
  echo.
  pause
  exit /b 1
)

:: -- KROK 1: Sprawdz Node.js
echo  [1/4]  Sprawdzam Node.js...
where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo  Node.js nie jest zainstalowany.
  echo  Zaraz otworzy sie strona pobierania – pobierz wersje LTS
  echo  i zainstaluj, a nastepnie uruchom ten plik ponownie.
  echo.
  timeout /t 3 >nul
  start https://nodejs.org/en/download/
  echo  Po zainstalowaniu Node.js kliknij dwukrotnie ten plik jeszcze raz.
  echo.
  pause
  exit /b 0
)
for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VER=%%v
echo  OK – Node.js !NODE_VER! znaleziony.

:: -- KROK 2: npm install
echo.
echo  [2/4]  Instaluje zaleznosci npm (moze chwile potrwac)...
pushd "%APP_DIR%"
call npm install --prefer-offline --loglevel=error
if errorlevel 1 (
  echo.
  echo  [BLAD] npm install nie powiodl sie.
  echo         Sprawdz polaczenie z internetem i sprobuj ponownie.
  popd
  pause
  exit /b 1
)
popd
echo  OK – zaleznosci zainstalowane.

:: -- KROK 3: Stworz launcher start.cmd
echo.
echo  [3/4]  Tworze plik startowy...
set "LAUNCHER=%APP_DIR%\start.cmd"
(
  echo @echo off
  echo title AI w Twoim Zawodzie
  echo cd /d "%%~dp0"
  echo start "" /B node server/index.js
  echo timeout /t 3 /nobreak ^>nul
  echo start "" http://localhost:8787
) > "%LAUNCHER%"
echo  OK – plik startowy gotowy.

:: -- KROK 4: Skrot na pulpicie
echo.
echo  [4/4]  Tworze skrot na pulpicie...

set "ICON_PATH=%APP_DIR%\assets\icons\app-icon.ico"
set "DESKTOP=%USERPROFILE%\Desktop"
if not exist "%DESKTOP%" set "DESKTOP=%USERPROFILE%\Pulpit"

set "LNK=%DESKTOP%\AI w Twoim Zawodzie.lnk"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $sc = $ws.CreateShortcut('%LNK%'); $sc.TargetPath = '%LAUNCHER%'; $sc.WorkingDirectory = '%APP_DIR%'; $sc.WindowStyle = 7; if (Test-Path '%ICON_PATH%') { $sc.IconLocation = '%ICON_PATH%' }; $sc.Description = 'AI w Twoim Zawodzie – Cyfrowy Przyjaciel'; $sc.Save()"

if exist "%LNK%" (
  echo  OK – skrot "AI w Twoim Zawodzie" stworzony na pulpicie.
) else (
  echo  UWAGA: Nie udalo sie stworzyc skrotu.
  echo  Uruchom recznie: "%LAUNCHER%"
)

echo.
echo  ========================================================
echo    Instalacja zakonczona!
echo    Kliknij dwukrotnie ikone na pulpicie, aby uruchomic
echo    aplikacje. Przegladarka otworzy sie automatycznie.
echo  ========================================================
echo.
pause
endlocal
