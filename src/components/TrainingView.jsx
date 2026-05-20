import { useState } from 'react'
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  RefreshCcw,
  Sparkles,
} from 'lucide-react'

// ── Baza szkoleń dla poszczególnych narzędzi ─────────────────────────────────
const TOOL_LESSONS = {
  Gemini: [
    {
      title: 'Pierwsze kroki z Gemini',
      duration: '15 min',
      level: 'Podstawowy',
      description: 'Jak pisać skuteczne prompty, nadawać kontekst i iterować wynik w rozmowie.',
      prompt: 'Wciel się w rolę doradcy dla [ZAWÓD]. Mam problem: [OPISZ PROBLEM]. Zaproponuj 3 konkretne kroki rozwiązania w prostym języku.',
      url: 'https://gemini.google.com/',
    },
    {
      title: 'Gemini w Google Workspace',
      duration: '20 min',
      level: 'Średni',
      description: 'Integracja z Dokumentami, Arkuszami i Gmail — podsumowania, szkice i formuły AI.',
      prompt: 'Napisz szablon e-maila do klienta po zakończeniu projektu. Ton: profesjonalny, ale ciepły. Zostaw miejsca do uzupełnienia: [IMIĘ], [PROJEKT], [NASTĘPNY KROK].',
      url: 'https://workspace.google.com/',
    },
  ],
  'Adobe Lightroom AI': [
    {
      title: 'AI w Lightroom – maski i selekcja',
      duration: '18 min',
      level: 'Podstawowy',
      description: 'Automatyczne maski obiektów, Select Subject i pierwsze korekty wspomagane AI.',
      prompt: 'Stwórz checklistę 8 kroków edycji portretu biznesowego w Lightroom z użyciem AI tools. Każdy krok w jednym zdaniu.',
      url: 'https://www.adobe.com/products/photoshop-lightroom.html',
    },
  ],
  'Canva AI': [
    {
      title: 'Generowanie grafik z AI w Canva',
      duration: '12 min',
      level: 'Podstawowy',
      description: 'Magic Design, text-to-image i Brand Kit – tworzenie materiałów w kilka minut.',
      prompt: 'Zaproponuj 5 konceptów graficznych na post dla [BRANŻA]. Format: [PLATFORMA]. Styl: minimalistyczny, nowoczesny. Opisz każdy koncept w 2 zdaniach.',
      url: 'https://www.canva.com/ai/',
    },
  ],
  'Notion AI': [
    {
      title: 'Baza wiedzy i szablony w Notion AI',
      duration: '20 min',
      level: 'Średni',
      description: 'AI Autofill, automatyczne podsumowania i szablony procesów dla Twojej pracy.',
      prompt: 'Stwórz szablon strony Notion dla projektu [ZAWÓD]. Sekcje: opis, cele, harmonogram, notatki z klientem, checklist do oddania.',
      url: 'https://www.notion.com/product/ai',
    },
  ],
  ChatGPT: [
    {
      title: 'Techniki promptowania w ChatGPT',
      duration: '15 min',
      level: 'Podstawowy',
      description: 'Metody: rola + kontekst + format + przykład. Chain-of-thought i few-shot prompting.',
      prompt: 'Wciel się w rolę doświadczonego [ZAWÓD] z 10 latami praktyki. Pomóż mi rozwiązać: [PROBLEM]. Odpowiedz krok po kroku. Na końcu daj jedno konkretne zadanie do wykonania dziś.',
      url: 'https://chatgpt.com/',
    },
  ],
  'Remove.bg': [
    {
      title: 'Usuwanie tła w workflow fotograficznym',
      duration: '8 min',
      level: 'Podstawowy',
      description: 'Kiedy i jak używać Remove.bg: miniatury, oferty, sklep, materiały sprzedażowe.',
      prompt: 'Wymień 6 konkretnych zastosowań usuwania tła w pracy [ZAWÓD]. Dla każdego napisz: po co, kiedy, jak wygląda wynik.',
      url: 'https://www.remove.bg/',
    },
  ],
  Metricool: [
    {
      title: 'Planowanie social media z Metricool',
      duration: '15 min',
      level: 'Podstawowy',
      description: 'Harmonogram publikacji, analiza zasięgów i najlepsze godziny postowania dla Twojej branży.',
      prompt: 'Ułóż plan 7 postów na tydzień dla [ZAWÓD] na Instagram. Każdy post: temat, format (zdjęcie/rolka/karuzela), cel (zasięg/sprzedaż/relacja), najlepsza godzina.',
      url: 'https://metricool.com/',
    },
  ],
  'Google Drive AI': [
    {
      title: 'Organizacja plików i workflow w Drive',
      duration: '12 min',
      level: 'Podstawowy',
      description: 'Struktura folderów, wyszukiwanie AI i automatyzacja w Google Workspace.',
      prompt: 'Zaproponuj strukturę folderów Google Drive dla [ZAWÓD]. Dla każdego folderu: nazwa, co tam trafia, jak często używane. Maks. 3 poziomy głębokości.',
      url: 'https://workspace.google.com/',
    },
  ],
  'Mailerlite AI': [
    {
      title: 'Automatyzacja e-mail marketingu',
      duration: '20 min',
      level: 'Średni',
      description: 'Sekwencje powitalne, kampanie sezonowe, segmentacja i testy A/B z AI.',
      prompt: 'Napisz 3-mailową sekwencję powitalną dla nowych klientów [ZAWÓD]. Maile: 1) powitanie i co ich czeka, 2) Twoja historia i wartość, 3) pierwsze zadanie do wykonania. Ton: ciepły, konkretny.',
      url: 'https://www.mailerlite.com/',
    },
  ],
  'Trello + AI': [
    {
      title: 'Zarządzanie projektami z AI w Trello',
      duration: '15 min',
      level: 'Podstawowy',
      description: 'Tablice Kanban, automatyzacje Butler i prompty AI do planowania sprintów.',
      prompt: 'Rozpisz tablicę Trello dla projektu [ZAWÓD]. Listy (kolumny): od briefu do oddania. Podaj 3-5 przykładowych kart z opisem i checklistą dla każdej listy.',
      url: 'https://trello.com/',
    },
  ],
  'CapCut AI': [
    {
      title: 'Tworzenie rolek z CapCut AI',
      duration: '18 min',
      level: 'Podstawowy',
      description: 'Auto-napisy, szablony wideo, efekty AI i montaż b-rollu do krótkich filmów.',
      prompt: 'Napisz scenariusz 30-sekundowej rolki prezentującej [USŁUGA/PRODUKT]. Format: ujęcie 1 (hak), ujęcie 2-4 (wartość), ujęcie 5 (CTA). Każde ujęcie: czas, co widać, co słychać.',
      url: 'https://www.capcut.com/',
    },
  ],
  Perplexity: [
    {
      title: 'Research rynkowy z Perplexity',
      duration: '12 min',
      level: 'Podstawowy',
      description: 'Szybkie zbieranie rzetelnych informacji z cytowanymi źródłami i Spaces do projektów.',
      prompt: 'Zbierz 5 aktualnych trendów w branży [BRANŻA] w Polsce (rok 2025). Dla każdego: co to, dlaczego ważne, jak można to wykorzystać jako [ZAWÓD]. Podaj źródła.',
      url: 'https://www.perplexity.ai/',
    },
  ],
  'Make.com': [
    {
      title: 'Pierwsza automatyzacja w Make',
      duration: '25 min',
      level: 'Średni',
      description: 'Budowanie scenariuszy bez kodu: trigger → akcje → filtry. Integracja z AI.',
      prompt: 'Opisz 3 automatyzacje, które [ZAWÓD] mógłby zbudować w Make.com w ciągu tygodnia. Dla każdej: trigger, kroki, co oszczędza, czas wdrożenia.',
      url: 'https://make.com/',
    },
  ],
  Zapier: [
    {
      title: 'Automatyzacja procesów z Zapier',
      duration: '15 min',
      level: 'Podstawowy',
      description: 'Tworzenie Zap-ów łączących aplikacje bez kodu i użycie AI Actions.',
      prompt: 'Zaproponuj 5 automatyzacji Zapier dla [ZAWÓD]. Dla każdej: aplikacja A → aplikacja B, co się dzieje, ile czasu oszczędza tygodniowo.',
      url: 'https://zapier.com/',
    },
  ],
  'Surfer SEO': [
    {
      title: 'Optymalizacja treści z Surfer SEO',
      duration: '20 min',
      level: 'Średni',
      description: 'Content Editor, Keyword Research i Audit – jak pisać artykuły rankujące w Google.',
      prompt: 'Stwórz brief artykułu SEO dla słowa kluczowego "[SŁOWO KLUCZOWE]". Sekcje: intencja wyszukiwania, nagłówki H2-H3, pytania do odpowiedzi, meta tytuł i opis.',
      url: 'https://surferseo.com/',
    },
  ],
}

// ── Lekcje ogólne dołączane zawsze ───────────────────────────────────────────
const UNIVERSAL_LESSONS = [
  {
    tool: 'Ogólne',
    title: 'Bezpieczne dane w AI',
    duration: '12 min',
    level: 'Podstawowy',
    description: 'Co wpisywać do AI, a czego lepiej nie wysyłać — RODO, dane klientów, tajemnica zawodowa.',
    prompt: 'Wymień 8 typów danych, których nie powinienem wpisywać do publicznych modeli AI. Dla każdego wyjaśnij ryzyko i zaproponuj bezpieczną alternatywę.',
    url: null,
  },
  {
    tool: 'Ogólne',
    title: 'Tygodniowy workflow AI od zera',
    duration: '25 min',
    level: 'Średni',
    description: 'Jak zamienić powtarzalne zadania w systematyczne procesy z AI – budowanie nawyku.',
    prompt: 'Zaproponuj tygodniowy harmonogram użycia AI dla [ZAWÓD]. Podziel na: poniedziałek–piątek. Każdy dzień: konkretne narzędzie, zadanie i szacowany czas oszczędności.',
    url: null,
  },
]

const STATUS_CYCLE = { not_started: 'in_progress', in_progress: 'completed', completed: 'not_started' }
const STATUS_LABEL = {
  not_started: 'Zacznij',
  in_progress: 'Ukończ',
  completed: 'Ukończono',
}
const STATUS_COLOR = {
  not_started: 'lesson-btn-start',
  in_progress: 'lesson-btn-progress',
  completed: 'lesson-btn-done',
}
const LEVEL_COLOR = { Podstawowy: 'level-basic', Średni: 'level-mid', Zaawansowany: 'level-adv' }

function slugify(tool, title) {
  return `${tool}-${title}`.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

function buildLessons(stack) {
  const lessons = []
  const seenTools = new Set()

  for (const tool of stack) {
    if (seenTools.has(tool.name)) continue
    seenTools.add(tool.name)
    const toolLessons = TOOL_LESSONS[tool.name]
    if (toolLessons) {
      toolLessons.forEach((lesson) =>
        lessons.push({ ...lesson, tool: tool.name, id: slugify(tool.name, lesson.title) }),
      )
    } else {
      // Generic lesson for unknown tool
      lessons.push({
        id: slugify(tool.name, 'podstawy'),
        tool: tool.name,
        title: `Pierwsze kroki z ${tool.name}`,
        duration: '15 min',
        level: 'Podstawowy',
        description: `Jak efektywnie używać ${tool.name} w codziennej pracy. Podstawowe funkcje i pierwsze workflow.`,
        prompt: `Jesteś ekspertem w ${tool.name}. Wyjaśnij mi 5 najważniejszych funkcji tego narzędzia przydatnych dla [ZAWÓD]. Dla każdej: co robi, kiedy używać, przykład zastosowania.`,
        url: tool.url || null,
      })
    }
  }

  UNIVERSAL_LESSONS.forEach((lesson) =>
    lessons.push({ ...lesson, id: slugify(lesson.tool, lesson.title) }),
  )

  return lessons
}

// ── Komponent ─────────────────────────────────────────────────────────────────
export default function TrainingView({ stack, profession }) {
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('training_progress') || '{}')
    } catch {
      return {}
    }
  })
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const lessons = buildLessons(stack)
  const total = lessons.length
  const completedCount = lessons.filter((l) => progress[l.id] === 'completed').length
  const progressPct = total > 0 ? Math.round((completedCount / total) * 100) : 0

  function advanceStatus(id) {
    const current = progress[id] || 'not_started'
    const next = STATUS_CYCLE[current]
    const updated = { ...progress, [id]: next }
    setProgress(updated)
    window.localStorage.setItem('training_progress', JSON.stringify(updated))
  }

  function toggleExpand(id) {
    setExpanded((prev) => (prev === id ? null : id))
  }

  function personalisePrompt(prompt) {
    return prompt.replace(/\[ZAWÓD\]/g, profession)
  }

  const filtered = lessons.filter((l) => {
    const status = progress[l.id] || 'not_started'
    if (filter === 'todo') return status !== 'completed'
    if (filter === 'done') return status === 'completed'
    return true
  })

  return (
    <section className="view-panel">
      {/* ── Nagłówek z paskiem postępu ── */}
      <div className="training-header">
        <div>
          <h2>Szkolenia</h2>
          <p>
            Lekcje dopasowane do Twojego stacka ({stack.length} narzędzi) ·{' '}
            <b>{profession}</b>
          </p>
        </div>
        <div className="training-progress-box">
          <span className="training-progress-label">
            {completedCount} / {total} ukończonych
          </span>
          <div className="training-progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="training-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="training-progress-pct">{progressPct}%</span>
        </div>
      </div>

      {/* ── Filtry ── */}
      <div className="training-filters" role="tablist">
        {[
          ['all', `Wszystkie (${total})`],
          ['todo', `Do nauki (${lessons.filter((l) => (progress[l.id] || 'not_started') !== 'completed').length})`],
          ['done', `Ukończone (${completedCount})`],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            className={`training-filter-btn ${filter === key ? 'active' : ''}`}
            type="button"
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Lista lekcji ── */}
      <div className="lesson-list">
        {filtered.length === 0 && (
          <p className="training-empty">Brak lekcji w tej kategorii.</p>
        )}

        {filtered.map((lesson) => {
          const status = progress[lesson.id] || 'not_started'
          const isExpanded = expanded === lesson.id
          const personalPrompt = personalisePrompt(lesson.prompt)

          return (
            <article key={lesson.id} className={`lesson-card ${status === 'completed' ? 'lesson-done' : ''}`}>
              <div className="lesson-top">
                <div className="lesson-meta">
                  <span className="lesson-tool-badge">{lesson.tool}</span>
                  <span className={`lesson-level ${LEVEL_COLOR[lesson.level] || ''}`}>
                    {lesson.level}
                  </span>
                  <span className="lesson-duration">
                    <Clock size={13} />
                    {lesson.duration}
                  </span>
                </div>

                <div className="lesson-main">
                  <h3 className="lesson-title">
                    {status === 'completed' && <Check size={16} className="lesson-check-icon" />}
                    {lesson.title}
                  </h3>
                  <p className="lesson-desc">{lesson.description}</p>
                </div>

                <div className="lesson-actions">
                  <button
                    type="button"
                    className={`lesson-status-btn ${STATUS_COLOR[status]}`}
                    onClick={() => advanceStatus(lesson.id)}
                    title={status === 'completed' ? 'Kliknij by zresetować' : ''}
                  >
                    {status === 'completed' ? (
                      <>
                        <Check size={15} /> Ukończono
                      </>
                    ) : status === 'in_progress' ? (
                      <>
                        <Sparkles size={15} /> Ukończ
                      </>
                    ) : (
                      <>
                        <BookOpen size={15} /> Zacznij
                      </>
                    )}
                  </button>

                  {lesson.url && (
                    <a
                      className="lesson-link"
                      href={lesson.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Otwórz narzędzie"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}

                  <button
                    type="button"
                    className="lesson-prompt-toggle"
                    onClick={() => toggleExpand(lesson.id)}
                    title={isExpanded ? 'Ukryj prompt' : 'Pokaż prompt do ćwiczenia'}
                  >
                    Prompt
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* ── Rozwijany prompt ── */}
              {isExpanded && (
                <div className="lesson-prompt-box">
                  <p className="lesson-prompt-label">
                    <Sparkles size={13} /> Prompt do ćwiczenia — wklej do Gemini lub ChatGPT
                  </p>
                  <pre className="lesson-prompt-text">{personalPrompt}</pre>
                  <button
                    type="button"
                    className="lesson-copy-btn"
                    onClick={() => navigator.clipboard?.writeText(personalPrompt)}
                  >
                    Kopiuj prompt
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
