#!/bin/bash
# create-package.sh – Pakuje aplikację do archiwum ZIP gotowego do dystrybucji
# Uruchom z katalogu głównego projektu: bash create-package.sh
# Wynik: AI-w-Twoim-Zawodzie-v<version>.zip

set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo -e "${BOLD}  ========================================================"
echo "    AI w Twoim Zawodzie – Create Package"
echo -e "  ========================================================${NC}"
echo ""

# ── Wersja z package.json ──────────────────────────────────
VERSION=$(node -e "console.log(require('./package.json').version)" 2>/dev/null || echo "1.0.0")
PACKAGE_NAME="AI-w-Twoim-Zawodzie-v${VERSION}"
TEMP_DIR="/tmp/${PACKAGE_NAME}"
ZIP_OUT="${SCRIPT_DIR}/${PACKAGE_NAME}.zip"

echo "  Wersja:  $VERSION"
echo "  Paczka:  $ZIP_OUT"
echo ""

# ── KROK 1: Build frontendu ───────────────────────────────
echo -e "  ${BOLD}[1/5]${NC}  Buduję frontend (npm run build)..."
npm run build
echo -e "${GREEN}  OK – dist/ gotowy.${NC}"

# ── KROK 2: Przygotuj folder tymczasowy ──────────────────
echo ""
echo -e "  ${BOLD}[2/5]${NC}  Przygotowuję strukturę paczki..."
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR/app"

# ── KROK 3: Kopiuj pliki do app/ ─────────────────────────
echo ""
echo -e "  ${BOLD}[3/5]${NC}  Kopiuję pliki aplikacji..."

# Backend i konfiguracja
cp package.json "$TEMP_DIR/app/"
cp package-lock.json "$TEMP_DIR/app/" 2>/dev/null || true
cp -r server/ "$TEMP_DIR/app/server/"
cp -r dist/ "$TEMP_DIR/app/dist/"

# Ikony (jeśli istnieją)
if [ -d "assets/icons" ]; then
  mkdir -p "$TEMP_DIR/app/assets/icons"
  cp assets/icons/*.ico "$TEMP_DIR/app/assets/icons/" 2>/dev/null || true
  cp assets/icons/*.icns "$TEMP_DIR/app/assets/icons/" 2>/dev/null || true
  cp assets/icons/*.png "$TEMP_DIR/app/assets/icons/" 2>/dev/null || true
  echo "  OK – ikony skopiowane."
else
  echo -e "${YELLOW}  UWAGA: Brak katalogu assets/icons/ – skróty będą bez ikon.${NC}"
fi

# .env.example (bez prawdziwego klucza)
if [ -f ".env.example" ]; then
  cp .env.example "$TEMP_DIR/app/.env.example"
elif [ -f ".env" ]; then
  echo "GEMINI_API_KEY=your_google_gemini_api_key" > "$TEMP_DIR/app/.env.example"
else
  echo "GEMINI_API_KEY=your_google_gemini_api_key" > "$TEMP_DIR/app/.env.example"
fi

echo "  OK – pliki aplikacji skopiowane."

# ── KROK 4: Kopiuj pliki instalacyjne do korzenia ────────
echo ""
echo -e "  ${BOLD}[4/5]${NC}  Kopiuję instalatory i stronę startową..."

cp "to uruchom pierwsze.html" "$TEMP_DIR/"
cp "install-windows.cmd" "$TEMP_DIR/"
cp "install-mac.command" "$TEMP_DIR/"
cp "install-linux.sh" "$TEMP_DIR/"

chmod +x "$TEMP_DIR/install-mac.command"
chmod +x "$TEMP_DIR/install-linux.sh"

echo "  OK – instalatory gotowe."

# ── KROK 5: Zipuj ────────────────────────────────────────
echo ""
echo -e "  ${BOLD}[5/5]${NC}  Tworzę archiwum ZIP..."

rm -f "$ZIP_OUT"
cd /tmp
zip -r "$ZIP_OUT" "${PACKAGE_NAME}/" -x "*.DS_Store" -x "__MACOSX/*" -x "*.git*"
cd "$SCRIPT_DIR"

rm -rf "$TEMP_DIR"

ZIP_SIZE=$(du -sh "$ZIP_OUT" | cut -f1)
echo -e "${GREEN}  OK – archiwum gotowe (${ZIP_SIZE}).${NC}"

echo ""
echo -e "${BOLD}  ========================================================"
echo "    Paczka gotowa do dystrybucji!"
echo "    $ZIP_OUT"
echo -e "  ========================================================${NC}"
echo ""
echo "  Struktura w archiwum:"
echo "    AI-w-Twoim-Zawodzie-v${VERSION}/"
echo "    ├── to uruchom pierwsze.html"
echo "    ├── install-windows.cmd"
echo "    ├── install-mac.command"
echo "    ├── install-linux.sh"
echo "    └── app/                    ← nie ruszaj"
echo ""
