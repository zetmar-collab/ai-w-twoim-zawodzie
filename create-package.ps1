# Paczka ZIP do dystrybucji (Windows)
# Uruchom: powershell -ExecutionPolicy Bypass -File create-package.ps1

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$version = (Get-Content package.json -Raw | ConvertFrom-Json).version
$packageName = "AI-w-Twoim-Zawodzie-v$version"
$tempRoot = Join-Path $env:TEMP $packageName
$appDir = Join-Path $tempRoot 'app'
$zipOut = Join-Path $PSScriptRoot "$packageName.zip"

Write-Host ''
Write-Host '  AI w Twoim Zawodzie - Create Package (Windows)'
Write-Host "  Wersja: $version"
Write-Host ''

Write-Host '  [1/5] npm run build...'
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed' }

Write-Host '  [2/5] Przygotowanie folderu...'
if (Test-Path $tempRoot) { Remove-Item $tempRoot -Recurse -Force }
New-Item -ItemType Directory -Path $appDir -Force | Out-Null

Write-Host '  [3/5] Kopiowanie aplikacji...'
Copy-Item package.json, package-lock.json -Destination $appDir -ErrorAction SilentlyContinue
Copy-Item -Recurse server, dist -Destination $appDir
if (Test-Path 'assets\icons') {
  New-Item -ItemType Directory -Path (Join-Path $appDir 'assets\icons') -Force | Out-Null
  Copy-Item assets\icons\*.ico, assets\icons\*.icns, assets\icons\*.png -Destination (Join-Path $appDir 'assets\icons') -ErrorAction SilentlyContinue
}
if (Test-Path '.env.example') {
  Copy-Item '.env.example' (Join-Path $appDir '.env.example')
} else {
  @(
    'GEMINI_API_KEY=your_google_gemini_api_key'
    'GEMINI_MODEL=gemini-2.5-flash'
    'PORT=8787'
  ) | Set-Content (Join-Path $appDir '.env.example')
}

Write-Host '  [4/5] Instalatory...'
Copy-Item 'to uruchom pierwsze.html', install-windows.cmd, install-mac.command, install-linux.sh -Destination $tempRoot

Write-Host '  [5/5] ZIP...'
if (Test-Path $zipOut) { Remove-Item $zipOut -Force }
Compress-Archive -Path $tempRoot -DestinationPath $zipOut -Force
Remove-Item $tempRoot -Recurse -Force

$sizeMb = [math]::Round((Get-Item $zipOut).Length / 1MB, 2)
Write-Host ''
Write-Host ('  Gotowe: {0} ({1} MB)' -f $zipOut, $sizeMb)
Write-Host ''
