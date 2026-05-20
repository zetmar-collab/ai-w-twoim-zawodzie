# AI w Twoim Zawodzie

> Darmowy, lokalny generator spersonalizowanego **AI Stack** — wpisz swój zawód, poziom i cele, a aplikacja (z pomocą Gemini AI) dobierze 8–10 konkretnych narzędzi z gotowymi promptami.

![Wersja](https://img.shields.io/badge/wersja-1.0.0-brightgreen)
![Licencja](https://img.shields.io/badge/licencja-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)

---

## Jak uruchomić (dla użytkowników)

Pobierz najnowszą paczkę ZIP ze strony [Releases](https://github.com/zetmar-collab/ai-w-twoim-zawodzie/releases), rozpakuj i otwórz plik **`to uruchom pierwsze.html`**.

Strona automatycznie wykryje Twój system i pokaże instrukcje instalacji krok po kroku:

| System | Plik do uruchomienia |
|--------|----------------------|
| 🪟 Windows | `install-windows.cmd` |
| 🍎 macOS | `install-mac.command` |
| 🐧 Linux | `install-linux.sh` |

Instalator sprawdzi Node.js (i otworzy stronę pobierania jeśli go brak), zainstaluje zależności i stworzy skrót na pulpicie. Kliknięcie skrótu startuje serwer i otwiera przeglądarkę automatycznie po 3 sekundach.

---

## Klucz Gemini API (opcjonalny)

Bez klucza aplikacja działa w **trybie demo** (statyczny, przykładowy stack).  
Aby uzyskać spersonalizowany wynik od AI:

1. Wejdź na [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Stwórz bezpłatny klucz API
3. Wklej go w ustawieniach aplikacji (ikona ⚙️)

Klucz jest przechowywany **wyłącznie lokalnie** w przeglądarce — nie opuszcza Twojego komputera.

---

## Dla deweloperów

### Wymagania

- Node.js 18+
- npm

### Instalacja

```bash
git clone https://github.com/zetmar-collab/ai-w-twoim-zawodzie.git
cd ai-w-twoim-zawodzie
npm install
```

### Uruchomienie (dev)

```bash
npm run dev
```

Aplikacja dostępna pod `http://localhost:5173`, API pod `http://localhost:8787`.

### Zmienne środowiskowe

Skopiuj `.env.example` do `.env` i uzupełnij:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY=twój_klucz_gemini
GEMINI_MODEL=gemini-2.5-flash
PORT=8787
```

### Budowanie paczki dystrybucyjnej

```bash
bash create-package.sh
```

Skrypt zbuduje frontend, spakuje wszystko do `AI-w-Twoim-Zawodzie-v1.0.0.zip` gotowego do dystrybucji.

### Struktura projektu

```
ai-w-twoim-zawodzie/
├── server/              # Express backend (API proxy do Gemini)
│   └── index.js
├── src/                 # React frontend (Vite)
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── assets/icons/        # Ikony aplikacji (.ico, .icns, .png)
├── to uruchom pierwsze.html  # Strona startowa dla użytkowników
├── install-windows.cmd  # Instalator Windows
├── install-mac.command  # Instalator macOS
├── install-linux.sh     # Instalator Linux
├── create-package.sh    # Skrypt pakujący ZIP do dystrybucji
├── .env.example         # Przykładowy plik konfiguracji
└── package.json
```

---

## Funkcje

- 🎯 **Spersonalizowany AI Stack** — 8–10 narzędzi dopasowanych do zawodu, poziomu i celów
- 🤖 **Gemini 2.5 Flash** — zasilany najnowszym modelem Google AI
- 🔒 **Tryb demo** — działa bez klucza API
- 📋 **Gotowe prompty** — każde narzędzie ma prompt gotowy do wklejenia
- 💾 **Historia i projekty** — zapisuj i zarządzaj wieloma stackami
- 📤 **Eksport** — pobierz stack jako plik .txt
- 🔍 **Biblioteka narzędzi** — przeglądaj i filtruj narzędzia AI
- 🛡️ **Rate limiting** — 5 zapytań/minutę, sanityzacja wejścia
- 🖥️ **Instalator one-click** — dedykowane skrypty dla Windows/macOS/Linux

---

## Licencja

MIT © [Marek Zettel](https://github.com/zetmar-collab)
