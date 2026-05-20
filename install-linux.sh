#!/bin/bash
# AI w Twoim Zawodzie – Instalator Linux
# by Cyfrowy Przyjaciel · Marek Zettel

set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'

echo ""
echo "  ========================================================"
echo "    AI w Twoim Zawodzie  –  Instalator Linux"
echo "    by Cyfrowy Przyjaciel | Marek Zettel"
echo "  ========================================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/app"

if [ ! -f "$APP_DIR/package.json" ]; then
  echo -e "${RED}  [BŁĄD] Nie znaleziono folderu \"app\" obok tego pliku.${NC}"
  echo "         Upewnij się, że rozpakowałeś archiwum ZIP w całości."
  exit 1
fi

# ── KROK 1: Node.js ────────────────────────────────────────
echo "  [1/4]  Sprawdzam Node.js..."
if ! command -v node &>/dev/null; then
  echo -e "${YELLOW}  Node.js nie jest zainstalowany.${NC}"
  echo ""
  echo -e "${BOLD}  Zainstaluj Node.js odpowiednim poleceniem dla Twojej dystrybucji:${NC}"
  echo ""
  echo "    Ubuntu / Debian / Mint:"
  echo "      sudo apt update && sudo apt install -y nodejs npm"
  echo ""
  echo "    Fedora / RHEL / CentOS:"
  echo "      sudo dnf install -y nodejs npm"
  echo ""
  echo "    Arch / Manjaro:"
  echo "      sudo pacman -S nodejs npm"
  echo ""
  echo "    OpenSUSE:"
  echo "      sudo zypper install nodejs npm"
  echo ""
  echo "    Lub ręcznie (wszystkie dystrybucje):"
  echo "      https://nodejs.org/en/download/"
  echo ""
  read -p "  Po zainstalowaniu Node.js naciśnij Enter i uruchom ten skrypt ponownie..."
  exit 0
fi
NODE_VER=$(node -v)
echo -e "${GREEN}  OK – Node.js $NODE_VER znaleziony.${NC}"

# ── KROK 2: npm install ────────────────────────────────────
echo ""
echo "  [2/4]  Instaluję zależności npm..."
cd "$APP_DIR"
npm install --prefer-offline --loglevel=error
echo -e "${GREEN}  OK – zależności zainstalowane.${NC}"
cd "$SCRIPT_DIR"

# ── KROK 3: Launcher ──────────────────────────────────────
echo ""
echo "  [3/4]  Tworzę plik startowy..."
LAUNCHER="$APP_DIR/start.sh"
cat > "$LAUNCHER" << 'EOF'
#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"
node server/index.js &
sleep 3
# Otwórz przeglądarkę (sprawdź dostępne polecenia)
if command -v xdg-open &>/dev/null; then
  xdg-open http://localhost:8787
elif command -v gnome-open &>/dev/null; then
  gnome-open http://localhost:8787
elif command -v kde-open &>/dev/null; then
  kde-open http://localhost:8787
else
  echo "Otwórz przeglądarkę i wejdź na: http://localhost:8787"
fi
EOF
chmod +x "$LAUNCHER"
echo "  OK – plik startowy gotowy."

# ── KROK 4: Plik .desktop na pulpicie ─────────────────────
echo ""
echo "  [4/4]  Tworzę skrót na pulpicie..."

DESKTOP="$HOME/Desktop"
[ ! -d "$DESKTOP" ] && DESKTOP="$HOME/Pulpit"
[ ! -d "$DESKTOP" ] && DESKTOP="$(xdg-user-dir DESKTOP 2>/dev/null || echo "$HOME")"

ICON_PATH="$APP_DIR/assets/icons/app-icon.png"
DESKTOP_FILE="$DESKTOP/AI-w-Twoim-Zawodzie.desktop"

cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Name=AI w Twoim Zawodzie
Comment=Spersonalizowany stack narzędzi AI – Cyfrowy Przyjaciel
Exec=$LAUNCHER
Icon=$ICON_PATH
Terminal=false
Type=Application
Categories=Office;Education;
StartupNotify=true
EOF

chmod +x "$DESKTOP_FILE"

# Spróbuj zaufać plikowi (GNOME 3.x+)
if command -v gio &>/dev/null; then
  gio set "$DESKTOP_FILE" metadata::trusted true 2>/dev/null || true
fi

echo -e "${GREEN}  OK – skrót \"AI-w-Twoim-Zawodzie.desktop\" gotowy na pulpicie.${NC}"

echo ""
echo "  ========================================================"
echo "    Instalacja zakończona!"
echo "    Kliknij dwukrotnie ikonę na pulpicie, żeby uruchomić"
echo "    aplikację. Przeglądarka otworzy się automatycznie"
echo "    na adresie http://localhost:8787"
echo "  ========================================================"
echo ""
