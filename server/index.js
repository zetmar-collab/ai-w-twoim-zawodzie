import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { GoogleGenAI } from '@google/genai'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = process.env.PORT || 8787

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const demoStack = [
  {
    name: 'Gemini',
    category: 'Asystent',
    value: 'Pomaga zamienić problem zawodowy na gotowy plan, prompt i pierwszą wersję materiału.',
    prompt:
      'Jesteś praktycznym konsultantem AI. Na podstawie mojego zawodu, problemu i narzędzi przygotuj 5 kroków automatyzacji na ten tydzień.',
    url: 'https://gemini.google.com/',
  },
  {
    name: 'Canva AI',
    category: 'Grafika',
    value: 'Tworzy szybkie posty, prezentacje, oferty i materiały dla klientów.',
    prompt: 'Przygotuj strukturę karuzeli na Instagram z praktyczną poradą AI dla mojego klienta.',
    url: 'https://www.canva.com/ai/',
  },
  {
    name: 'Google Drive AI',
    category: 'Produktywność',
    value: 'Porządkuje dokumenty, briefy, notatki i materiały robocze.',
    prompt: 'Zaproponuj strukturę folderów i nazewnictwo plików dla mojej pracy.',
    url: 'https://workspace.google.com/',
  },
  {
    name: 'Notion AI',
    category: 'Organizacja',
    value: 'Buduje bazę wiedzy, checklisty i szablony procesów.',
    prompt: 'Stwórz szablon notatki projektowej dla mojego typowego zlecenia.',
    url: 'https://www.notion.com/product/ai',
  },
  {
    name: 'Metricool',
    category: 'Social media',
    value: 'Pomaga planować publikacje i oceniać, co realnie działa.',
    prompt: 'Ułóż 7-dniowy plan publikacji z jednym celem biznesowym.',
    url: 'https://metricool.com/',
  },
  {
    name: 'Trello + AI',
    category: 'Zarządzanie',
    value: 'Zmienia chaotyczne zadania w prosty proces tygodniowy.',
    prompt: 'Rozpisz tablicę z etapami mojej pracy od zapytania do finalnego rezultatu.',
    url: 'https://trello.com/',
  },
  {
    name: 'Mailerlite AI',
    category: 'Newsletter',
    value: 'Tworzy sekwencje maili i przypomnienia dla klientów.',
    prompt: 'Napisz 3-mailową sekwencję po zakończonej usłudze.',
    url: 'https://www.mailerlite.com/',
  },
  {
    name: 'Perplexity',
    category: 'Research',
    value: 'Szybko zbiera kontekst rynku, konkurencji i trendów.',
    prompt: 'Zbierz 5 obserwacji o trendach w mojej branży w Polsce.',
    url: 'https://www.perplexity.ai/',
  },
]

function normalizeGeminiText(text) {
  return text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
}

function fallbackResponse(reason = 'missing-key') {
  return {
    meta: { source: 'demo', reason },
    stack: demoStack,
    summary: {
      weeklyHours: '5–8 h',
      productivity: '+30%',
      monthlyValue: '400 zł+',
      fit: '86%',
    },
  }
}

function isUsableApiKey(value) {
  return Boolean(value && value !== 'your_google_gemini_api_key' && value.startsWith('AIza'))
}

// Sanityzacja wejścia użytkownika
function sanitizeStr(value, maxLen = 500) {
  if (typeof value !== 'string') return ''
  return value.slice(0, maxLen).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim()
}

function sanitizeArr(value, maxItems = 10, maxItemLen = 80) {
  if (!Array.isArray(value)) return []
  return value
    .slice(0, maxItems)
    .map((item) => sanitizeStr(String(item), maxItemLen))
    .filter(Boolean)
}

// In-memory rate limiter: 5 requests per IP per minute
const rateMap = new Map()
const RATE_WINDOW = 60_000
const RATE_MAX = 5

function rateLimiter(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return next()
  }

  if (entry.count >= RATE_MAX) {
    return res.status(429).json({
      error: 'Zbyt wiele zapytań. Poczekaj minutę i spróbuj ponownie.',
      ...fallbackResponse('rate-limited'),
    })
  }

  entry.count++
  next()
}

// Cleanup stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateMap.entries()) {
    if (now > entry.reset) rateMap.delete(ip)
  }
}, 5 * 60_000)

app.post('/api/generate-stack', rateLimiter, async (req, res) => {
  const requestApiKey =
    typeof req.body.geminiApiKey === 'string' ? req.body.geminiApiKey.trim() : ''
  const envApiKey =
    typeof process.env.GEMINI_API_KEY === 'string' ? process.env.GEMINI_API_KEY.trim() : ''
  const apiKey = isUsableApiKey(requestApiKey) ? requestApiKey : envApiKey
  if (!isUsableApiKey(apiKey)) return res.json(fallbackResponse())

  const profession   = sanitizeStr(req.body.profession, 60)
  const level        = sanitizeStr(req.body.level, 40)
  const goal         = sanitizeStr(req.body.goal, 200)
  const areas        = sanitizeArr(req.body.areas, 5, 80)
  const currentTools = sanitizeArr(req.body.currentTools, 15, 60)
  const problem      = sanitizeStr(req.body.problem, 500)

  if (!profession) return res.status(400).json({ error: 'Brakuje pola "zawód".' })

  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: `Stwórz praktyczny AI Stack dla polskiego użytkownika.

Kontekst:
- Zawód: ${profession}
- Poziom AI: ${level}
- Cel: ${goal}
- Obszary: ${areas.join(', ')}
- Obecne narzędzia: ${currentTools.join(', ')}
- Największa potrzeba: ${problem}

Zwróć wyłącznie poprawny JSON bez Markdown. Schemat:
{
  "stack": [
    {
      "name": "nazwa narzędzia lub workflow",
      "category": "krótka kategoria",
      "value": "jedno zdanie po polsku: co to konkretnie daje tej osobie",
      "prompt": "gotowy prompt po polsku do użycia od razu",
      "url": "https://..."
    }
  ],
  "summary": {
    "weeklyHours": "np. 8-12 h",
    "productivity": "np. +45%",
    "monthlyValue": "np. 650 zł+",
    "fit": "np. 92%"
  }
}

Wymagania:
- 8 do 10 pozycji w stack.
- Zero teorii, same praktyczne narzędzia i workflow.
- Uwzględnij polski rynek, prostą mowę i realia mikrofirm.
- Prompty mają być gotowe do wklejenia do Gemini lub ChatGPT.`,
    })

    const parsed = JSON.parse(normalizeGeminiText(response.text || '{}'))
    res.json({
      meta: { source: 'gemini' },
      stack: Array.isArray(parsed.stack) ? parsed.stack.slice(0, 10) : demoStack,
      summary: parsed.summary || fallbackResponse().summary,
    })
  } catch (error) {
    res.json({
      error: 'Gemini API zwróciło niepoprawną odpowiedź.',
      detail: error.message,
      ...fallbackResponse('gemini-error'),
    })
  }
})

app.get('/api/health', (_req, res) => {
  const envApiKey =
    typeof process.env.GEMINI_API_KEY === 'string' ? process.env.GEMINI_API_KEY.trim() : ''
  res.json({ ok: true, geminiConfigured: isUsableApiKey(envApiKey) })
})

// Serve Vite production build when dist/ exists (npm start / production)
const distPath = join(__dirname, '..', 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get(/(.*)/, (_req, res) => res.sendFile(join(distPath, 'index.html')))
}

app.listen(port, () => {
  const mode = existsSync(distPath) ? 'produkcja' : 'dev-api'
  console.log(`[${mode}] Serwer na http://127.0.0.1:${port}`)
})
