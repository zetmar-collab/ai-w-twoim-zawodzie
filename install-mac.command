#!/bin/bash
# AI w Twoim Zawodzie – Instalator macOS
# by Cyfrowy Przyjaciel · Marek Zettel

set -e

# Kolory
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo ""
echo "  ========================================================"
echo "    AI w Twoim Zawodzie  –  Instalator macOS"
echo "    by Cyfrowy Przyjaciel | Marek Zettel"
echo "  ========================================================"
echo ""

# Katalog skryptu i folder app/
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/app"

if [ ! -f "$APP_DIR/package.json" ]; then
  echo -e "${RED}  [BŁĄD] Nie znaleziono folderu \"app\" obok tego pliku.${NC}"
  echo "         Upewnij się, że rozpakowałeś archiwum ZIP w całości."
  echo ""
  read -p "  Naciśnij Enter, żeby zamknąć..."
  exit 1
fi

# ── KROK 1: Node.js ────────────────────────────────────────
echo "  [1/4]  Sprawdzam Node.js..."
if ! command -v node &>/dev/null; then
  echo -e "${YELLOW}  Node.js nie jest zainstalowany.${NC}"
  echo "  Za chwilę otworzy się strona pobierania nodejs.org."
  echo "  Pobierz pakiet .pkg, zainstaluj, a potem uruchom ten plik ponownie."
  echo ""
  sleep 2
  open "https://nodejs.org/en/download/"
  read -p "  Naciśnij Enter po zainstalowaniu Node.js..."
  if ! command -v node &>/dev/null; then
    echo -e "${RED}  Node.js nadal nie jest widoczny. Zrestartuj terminal i spróbuj ponownie.${NC}"
    exit 1
  fi
fi
NODE_VER=$(node -v)
echo -e "${GREEN}  OK – Node.js $NODE_VER znaleziony.${NC}"

# ── KROK 2: npm install ────────────────────────────────────
echo ""
echo "  [2/4]  Instaluję zależności npm (może chwilę potrwać)..."
cd "$APP_DIR"
npm install --prefer-offline --loglevel=error
echo -e "${GREEN}  OK – zależności zainstalowane.${NC}"
cd "$SCRIPT_DIR"

# ── KROK 3: Launcher shell script ─────────────────────────
echo ""
echo "  [3/4]  Tworzę plik startowy..."
LAUNCHER="$APP_DIR/start.sh"
cat > "$LAUNCHER" << 'EOF'
#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
node server/index.js &
sleep 3
open http://localhost:8787
EOF
chmod +x "$LAUNCHER"
echo "  OK – plik startowy gotowy."

# ── KROK 4: .app bundle na pulpicie ───────────────────────
echo ""
echo "  [4/4]  Tworzę ikonę na pulpicie (aplikacja macOS)..."

DESKTOP="$HOME/Desktop"
APP_BUNDLE="$DESKTOP/AI w Twoim Zawodzie.app"
ICON_SRC="$APP_DIR/assets/icons/app-icon.icns"

# AppleScript wrapper
APPLESCRIPT="do shell script \"'$LAUNCHER'\""
osacompile -e "$APPLESCRIPT" -o "$APP_BUNDLE" 2>/dev/null || {
  echo -e "${YELLOW}  UWAGA: osacompile nie działa – tworzę skrót .command na pulpicie.${NC}"
  cp "$LAUNCHER" "$DESKTOP/AI w Twoim Zawodzie.command"
  chmod +x "$DESKTOP/AI w Twoim Zawodzie.command"
  echo ""
  echo "  ========================================================"
  echo "    Instalacja zakończona!"
  echo "    Kliknij dwukrotnie 'AI w Twoim Zawodzie.command'"
  echo "    na pulpicie, żeby uruchomić aplikację."
  echo "  ========================================================"
  echo ""
  read -p "  Naciśnij Enter, żeby zamknąć..."
  exit 0
}

# Podmień ikonę jeśli jest dostępna
if [ -f "$ICON_SRC" ] && [ -d "$APP_BUNDLE/Contents/Resources" ]; then
  cp "$ICON_SRC" "$APP_BUNDLE/Contents/Resources/applet.icns"
fi

echo -e "${GREEN}  OK – aplikacja \"AI w Twoim Zawodzie\" gotowa na pulpicie.${NC}"

echo ""
echo "  ========================================================"
echo "    Instalacja zakończona!"
echo "    Kliknij dwukrotnie ikonę na pulpicie, żeby uruchomić"
echo "    aplikację. Przeglądarka otworzy się automatycznie."
echo "  ========================================================"
echo ""
read -p "  Naciśnij Enter, żeby zamknąć..."
