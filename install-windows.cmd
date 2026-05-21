@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul 2>&1
title Instalacja - AI w Twoim Zawodzie

echo.
echo  ========================================================
echo    AI w Twoim Zawodzie  -  Instalator Windows
echo    by Cyfrowy Przyjaciel  ^| Marek Zettel
echo  ========================================================
echo.

set "INST_DIR=%~dp0"
set "APP_DIR=%INST_DIR%app"

if not exist "%APP_DIR%\package.json" (
  echo  [BLAD] Nie znaleziono folderu "app" obok tego pliku.
  echo         Upewnij sie, ze rozpakowales ZIP w calosci.
  echo.
  pause
  exit /b 1
)

:: KROK 1: Sprawdz Node.js
echo  [1/4]  Sprawdzam Node.js...
where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo  Node.js nie jest zainstalowany.
  echo  Zaraz otworzy sie strona pobierania - pobierz wersje LTS.
  echo.
  timeout /t 3 >nul
  start https://nodejs.org/en/download/
  echo  Po zainstalowaniu Node.js uruchom ten plik jeszcze raz.
  echo.
  pause
  exit /b 0
)
for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VER=%%v
echo  OK - Node.js !NODE_VER! znaleziony.

:: KROK 2: npm install
echo.
echo  [2/4]  Instaluje zaleznosci npm...
pushd "%APP_DIR%"
call npm install --loglevel=error
if errorlevel 1 (
  echo.
  echo  [BLAD] npm install nie powiodl sie.
  popd
  pause
  exit /b 1
)
popd
echo  OK - zaleznosci zainstalowane.

:: KROK 3: Stworz launcher start.cmd
echo.
echo  [3/4]  Tworze plik startowy...
set "LAUNCHER=%APP_DIR%\start.cmd"
(
  echo @echo off
  echo title AI w Twoim Zawodzie - Serwer
  echo cd /d "%%~dp0"
  echo echo.
  echo echo  Uruchamianie serwera...
  echo echo  Nie zamykaj tego okna!
  echo echo.
  echo start /B node server/index.js
  echo timeout /t 4 /nobreak ^>nul
  echo start "" http://localhost:8787
  echo echo  Serwer dziala na: http://localhost:8787
  echo echo.
  echo echo  Aby zatrzymac: zamknij to okno.
  echo echo.
  echo :keep
  echo timeout /t 300 /nobreak ^>nul
  echo goto keep
) > "%LAUNCHER%"
echo  OK - plik startowy gotowy.

:: KROK 4: Skrot na pulpicie
echo.
echo  [4/4]  Tworze skrot na pulpicie...

set "DESKTOP=%USERPROFILE%\Desktop"
if not exist "%DESKTOP%" set "DESKTOP=%USERPROFILE%\Pulpit"
set "LNK=%DESKTOP%\AI w Twoim Zawodzie.lnk"
set "VBS=%TEMP%\mk_sc.vbs"

(
  echo Set ws = CreateObject("WScript.Shell"^)
  echo Set sc = ws.CreateShortcut("%LNK%"^)
  echo sc.TargetPath = "%LAUNCHER%"
  echo sc.WorkingDirectory = "%APP_DIR%"
  echo sc.WindowStyle = 1
  echo sc.Description = "AI w Twoim Zawodzie"
  echo sc.IconLocation = "%SystemRoot%\system32\imageres.dll, 97"
  echo sc.Save
) > "%VBS%"

cscript //nologo "%VBS%"
del "%VBS%" >nul 2>&1

if exist "%LNK%" (
  echo  OK - skrot stworzony na pulpicie.
) else (
  echo  UWAGA: Skrot nie zostal stworzony. Uruchom recznie: "%LAUNCHER%"
)

echo.
echo  ========================================================
echo    Instalacja zakonczona!
echo    Kliknij ikone na pulpicie aby uruchomic aplikacje.
echo    Przegladarka otworzy sie automatycznie po 4 sekundach.
echo  ========================================================
echo.
pause
endlocal