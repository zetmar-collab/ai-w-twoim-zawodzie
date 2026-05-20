import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Home,
  Loader2,
  MessageSquareText,
  PenLine,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShoppingCart,
  Sparkles,
  Target,
  Trash2,
  UserRoundSearch,
  WandSparkles,
  X,
} from 'lucide-react'
import './App.css'

// ─── Dane ─────────────────────────────────────────────────────────────────────

const professions = [
  {
    id: 'fotograf',
    label: 'Fotograf',
    icon: Camera,
    goal: 'Oszczędność czasu i automatyzacja',
    defaults: ['Edycja zdjęć', 'Marketing i social media', 'Obsługa klienta'],
    tools: ['Lightroom', 'Photoshop', 'Canva', 'Google Drive', 'Instagram'],
    problem:
      'Szybsza selekcja zdjęć, opisy sesji, oferty dla klientów i gotowe posty po realizacji.',
  },
  {
    id: 'copywriter',
    label: 'Copywriter',
    icon: PenLine,
    goal: 'Lepsze briefy i szybsze warianty tekstów',
    defaults: ['Tworzenie treści', 'SEO', 'Analiza briefu'],
    tools: ['Google Docs', 'Notion', 'Surfer SEO', 'LinkedIn'],
    problem: 'Chcę szybciej przechodzić od briefu do gotowych wersji tekstu dla klienta.',
  },
  {
    id: 'sklep',
    label: 'Sklep / E-commerce',
    icon: ShoppingCart,
    goal: 'Opisy produktów i obsługa sprzedaży',
    defaults: ['Opisy produktów', 'Obsługa klienta', 'Kampanie'],
    tools: ['Shopify', 'WooCommerce', 'Baselinker', 'Allegro'],
    problem: 'Potrzebuję opisów, odpowiedzi do klientów i pomysłów na kampanie sezonowe.',
  },
  {
    id: 'nauczyciel',
    label: 'Nauczyciel',
    icon: BookOpen,
    goal: 'Materiały lekcyjne i indywidualizacja',
    defaults: ['Scenariusze lekcji', 'Quizy', 'Materiały dydaktyczne'],
    tools: ['Canva', 'Google Classroom', 'Teams', 'YouTube'],
    problem: 'Chcę tworzyć lepsze materiały i dostosowywać zadania do poziomu uczniów.',
  },
  {
    id: 'hr',
    label: 'HR / Rekruter',
    icon: UserRoundSearch,
    goal: 'Szybszy screening i komunikacja',
    defaults: ['Rekrutacja', 'Komunikacja', 'Onboarding'],
    tools: ['LinkedIn', 'ATS', 'Gmail', 'Google Sheets'],
    problem: 'Potrzebuję uporządkować kandydatów i pisać trafniejsze wiadomości.',
  },
]

const navItems = [
  ['dashboard', 'Mój dashboard', Home],
  ['stack', 'Mój stack AI', Sparkles],
  ['projects', 'Moje projekty', BriefcaseBusiness],
  ['history', 'Historia', FileText],
  ['prompts', 'Zapisane prompty', Copy],
  ['tools', 'Biblioteka narzędzi', BookOpen],
  ['training', 'Szkolenia', GraduationCap],
  ['inspiration', 'Inspiracje', WandSparkles],
]

const areas = [
  'Edycja zdjęć',
  'Marketing i social media',
  'Obsługa klienta',
  'Administracja',
  'Tworzenie treści',
  'SEO',
  'Zarządzanie projektami',
  'Analiza briefu',
  'Quizy',
  'Scenariusze lekcji',
  'Materiały dydaktyczne',
  'Rekrutacja',
  'Komunikacja',
  'Onboarding',
  'Opisy produktów',
  'Kampanie',
]

const fallbackStack = [
  {
    name: 'Gemini',
    category: 'Asystent',
    value: 'Pomysły na treści, opisy ofert i odpowiedzi do klientów.',
    prompt:
      'Jesteś praktycznym doradcą AI. Przygotuj 5 wariantów odpowiedzi do klienta, który pyta o cenę mojej usługi.',
    url: 'https://gemini.google.com/',
  },
  {
    name: 'Adobe Lightroom AI',
    category: 'Edycja zdjęć',
    value: 'Automatyczna selekcja, maski i pierwsze korekty zdjęć.',
    prompt: 'Stwórz checklistę ustawień Lightroom AI dla reportażu rodzinnego.',
    url: 'https://www.adobe.com/products/photoshop-lightroom.html',
  },
  {
    name: 'Canva AI',
    category: 'Grafika',
    value: 'Szybkie posty, relacje i prezentacje po sesji.',
    prompt: 'Zaproponuj 7 slajdów karuzeli Instagram po sesji wizerunkowej.',
    url: 'https://www.canva.com/ai/',
  },
  {
    name: 'Remove.bg',
    category: 'Edycja zdjęć',
    value: 'Usuwanie tła do miniatur, ofert i materiałów sprzedażowych.',
    prompt: 'Przygotuj instrukcję, kiedy używać usuwania tła w ofercie fotografa.',
    url: 'https://www.remove.bg/',
  },
  {
    name: 'Metricool',
    category: 'Social media',
    value: 'Plan publikacji i analiza wyników postów.',
    prompt: 'Ułóż tygodniowy plan postów dla fotografa ślubnego w Polsce.',
    url: 'https://metricool.com/',
  },
  {
    name: 'Google Drive AI',
    category: 'Produktywność',
    value: 'Porządkowanie plików, briefów i notatek z klientami.',
    prompt: 'Zaproponuj strukturę folderów dla sesji zdjęciowych i komunikacji z klientem.',
    url: 'https://workspace.google.com/',
  },
  {
    name: 'Notion AI',
    category: 'Organizacja',
    value: 'Briefy, checklisty sesji i baza pomysłów na publikacje.',
    prompt: 'Stwórz szablon notatki projektowej dla nowej sesji zdjęciowej.',
    url: 'https://www.notion.com/product/ai',
  },
  {
    name: 'CapCut AI',
    category: 'Wideo',
    value: 'Krótkie rolki z backstage, napisami i wariantami montażu.',
    prompt: 'Ułóż scenariusz 30-sekundowej rolki z backstage sesji biznesowej.',
    url: 'https://www.capcut.com/',
  },
  {
    name: 'Trello + AI',
    category: 'Zarządzanie',
    value: 'Lista zadań od zapytania klienta po oddanie galerii.',
    prompt: 'Rozpisz tablicę Trello dla procesu od zapytania do finalnego rezultatu.',
    url: 'https://trello.com/',
  },
  {
    name: 'Mailerlite AI',
    category: 'Newsletter',
    value: 'Sekwencje maili, oferty i przypomnienia dla stałych klientów.',
    prompt: 'Napisz 3-mailową sekwencję dla klienta po odebraniu galerii zdjęć.',
    url: 'https://www.mailerlite.com/',
  },
]

const toolIcons = [MessageSquareText, Camera, WandSparkles, Search, FileText, Target]

const learningItems = [
  ['Start z Gemini', '15 minut', 'Jak pisać konkretne polecenia i poprawiać wynik.'],
  ['Workflow tygodniowy', '25 minut', 'Jak zamienić powtarzalne zadania w checklisty AI.'],
  ['Bezpieczne dane', '12 minut', 'Co wpisywać do AI, a czego lepiej nie wysyłać.'],
]

const inspirationItems = [
  'Zrób mini-audyt jednego procesu, który zabiera Ci najwięcej czasu.',
  'Poproś AI o 3 wersje odpowiedzi do klienta: ciepłą, konkretną i premium.',
  'Zamień ostatni projekt w szablon do ponownego użycia.',
]

// ─── Helpery ──────────────────────────────────────────────────────────────────

function buildPromptUrl(tool) {
  if (tool.url?.includes('gemini.google.com')) {
    return `https://gemini.google.com/app?text=${encodeURIComponent(tool.prompt || '')}`
  }
  return tool.url || 'https://gemini.google.com/'
}

function getStoredValue(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [message, onClose])

  return (
    <div className="toast" role="alert" aria-live="polite">
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Zamknij powiadomienie">
        <X size={14} />
      </button>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [professionId, setProfessionId] = useState('fotograf')
  const profession = professions.find((item) => item.id === professionId) ?? professions[0]
  const [level, setLevel] = useState('Średni')
  const [selectedAreas, setSelectedAreas] = useState(profession.defaults)
  const [goal, setGoal] = useState(profession.goal)
  const [toolsText, setToolsText] = useState(profession.tools.join(', '))
  const [problem, setProblem] = useState(profession.problem)
  const [stack, setStack] = useState(() => getStoredValue('ai_stack', fallbackStack))
  const [summary, setSummary] = useState({
    weeklyHours: '8-12 h',
    productivity: '+45%',
    monthlyValue: '650 zł+',
    fit: '92%',
  })
  const [history, setHistory] = useState(() => getStoredValue('ai_stack_history', []))
  const [savedPrompts, setSavedPrompts] = useState(() => getStoredValue('saved_prompts', []))
  const [projects, setProjects] = useState(() =>
    getStoredValue('ai_projects', [
      { id: 1, name: 'Pierwszy AI Stack', profession: 'Fotograf', status: 'W trakcie' },
    ]),
  )
  const [projectName, setProjectName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [geminiApiKey, setGeminiApiKey] = useState(
    () => window.localStorage.getItem('gemini_api_key') || '',
  )
  const [keySaved, setKeySaved] = useState(Boolean(window.localStorage.getItem('gemini_api_key')))
  const [apiKeyError, setApiKeyError] = useState('')
  const [status, setStatus] = useState(
    window.localStorage.getItem('gemini_api_key')
      ? 'Klucz Gemini zapisany. Możesz generować stack na żywo.'
      : 'Tryb demo. Wpisz klucz Gemini, aby generować wynik na żywo.',
  )
  const [toast, setToast] = useState(null)
  const [formStep, setFormStep] = useState(1)
  const [userName, setUserName] = useState(() => window.localStorage.getItem('user_name') || '')
  const [profileOpen, setProfileOpen] = useState(false)
  const fileInputRef = useRef(null)

  // Biblioteka – wyszukiwanie i filtrowanie
  const [librarySearch, setLibrarySearch] = useState('')
  const [libraryCategory, setLibraryCategory] = useState('Wszystkie')
  const libraryCategories = useMemo(
    () => ['Wszystkie', ...new Set(fallbackStack.map((t) => t.category))],
    [],
  )
  const filteredLibrary = useMemo(() => {
    const q = librarySearch.toLowerCase()
    return fallbackStack.filter((tool) => {
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.value.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      const matchesCategory =
        libraryCategory === 'Wszystkie' || tool.category === libraryCategory
      return matchesSearch && matchesCategory
    })
  }, [librarySearch, libraryCategory])

  const pageTitle = navItems.find(([id]) => id === activeView)?.[1] || 'Mój dashboard'
  const currentTools = useMemo(
    () =>
      toolsText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [toolsText],
  )

  function showToast(message) {
    setToast(message)
  }

  function switchProfession(id) {
    const next = professions.find((item) => item.id === id)
    if (!next) return
    setProfessionId(id)
    setSelectedAreas(next.defaults)
    setGoal(next.goal)
    setToolsText(next.tools.join(', '))
    setProblem(next.problem)
    setFormStep(1)
  }

  function toggleArea(area) {
    setSelectedAreas((current) => {
      if (current.includes(area)) return current.filter((item) => item !== area)
      if (current.length >= 3) return current
      return [...current, area]
    })
  }

  function validateApiKey(key) {
    if (!key) return ''
    if (!key.startsWith('AIza')) return 'Klucz powinien zaczynać się od "AIza…"'
    if (key.length < 30) return 'Klucz jest za krótki – sprawdź czy skopiowałeś całość.'
    return ''
  }

  function saveGeminiApiKey() {
    const trimmedKey = geminiApiKey.trim()
    if (!trimmedKey) {
      window.localStorage.removeItem('gemini_api_key')
      setGeminiApiKey('')
      setKeySaved(false)
      setApiKeyError('')
      setStatus('Klucz Gemini usunięty. Aplikacja działa w trybie demo.')
      showToast('Klucz API usunięty.')
      return
    }
    const error = validateApiKey(trimmedKey)
    if (error) {
      setApiKeyError(error)
      return
    }
    setApiKeyError('')
    window.localStorage.setItem('gemini_api_key', trimmedKey)
    setGeminiApiKey(trimmedKey)
    setKeySaved(true)
    setStatus('Klucz Gemini zapisany lokalnie. Możesz generować stack na żywo.')
    showToast('Klucz API zapisany pomyślnie.')
  }

  function persistStack(nextStack, nextSummary) {
    const historyItem = {
      id: Date.now(),
      date: new Date().toLocaleString('pl-PL'),
      profession: profession.label,
      goal,
      count: nextStack.length,
    }
    const nextHistory = [historyItem, ...history].slice(0, 20)
    setStack(nextStack)
    setSummary(nextSummary)
    setHistory(nextHistory)
    window.localStorage.setItem('ai_stack', JSON.stringify(nextStack))
    window.localStorage.setItem('ai_stack_history', JSON.stringify(nextHistory))
  }

  async function generateStack() {
    setIsLoading(true)
    setStatus('Gemini układa spersonalizowany AI Stack…')
    try {
      const response = await fetch('/api/generate-stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession: profession.label,
          level,
          goal,
          areas: selectedAreas,
          currentTools,
          problem,
          geminiApiKey: geminiApiKey.trim(),
        }),
      })

      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Nie udało się wygenerować stacka.')

      const nextStack = payload.stack?.length ? payload.stack : fallbackStack
      const nextSummary = payload.summary || summary
      persistStack(nextStack, nextSummary)
      setStatus(
        payload.meta?.source === 'gemini'
          ? 'Wygenerowano przez Gemini API.'
          : payload.meta?.reason === 'gemini-error'
            ? 'Klucz Gemini odrzucony lub błąd API. Pokazuję demo.'
            : 'Tryb demo – brak klucza Gemini.',
      )
      setActiveView('stack')
      showToast('Stack wygenerowany pomyślnie!')
    } catch (error) {
      persistStack(fallbackStack, summary)
      setStatus('Błąd połączenia. Pokazuję bezpieczny stack demo.')
      showToast(`Błąd: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  function exportStack() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profession: profession.label,
      level,
      stack,
      summary,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-stack-${profession.id}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Stack wyeksportowany jako plik .json')
  }

  function importStack(file) {
    const reader = new FileReader()
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result)
        if (!Array.isArray(data.stack) || data.stack.length === 0) {
          showToast('Nieprawidlowy plik – brak tablicy stack.')
          return
        }
        const valid = data.stack.every(function(t) {
          return t.name && t.category && t.value && t.prompt
        })
        if (!valid) {
          showToast('Plik JSON ma nieprawidlowa strukture narzedzi.')
          return
        }
        setStack(data.stack.slice(0, 10))
        window.localStorage.setItem('ai_stack', JSON.stringify(data.stack.slice(0, 10)))
        if (data.summary) {
          setSummary(data.summary)
        }
        setActiveView('stack')
        showToast('Stack wczytany z pliku: ' + data.stack.length + ' narzedzi.')
      } catch {
        showToast('Blad odczytu pliku JSON.')
      }
    }
    reader.readAsText(file)
  }

  function savePrompt(tool) {
    const next = [
      { id: tool.prompt, name: tool.name, category: tool.category, prompt: tool.prompt },
      ...savedPrompts.filter((item) => item.prompt !== tool.prompt),
    ]
    setSavedPrompts(next)
    window.localStorage.setItem('saved_prompts', JSON.stringify(next))
    showToast(`Zapisano: ${tool.name}`)
  }

  function deletePrompt(id) {
    const next = savedPrompts.filter((item) => item.id !== id)
    setSavedPrompts(next)
    window.localStorage.setItem('saved_prompts', JSON.stringify(next))
    showToast('Prompt usunięty.')
  }

  function addProject() {
    const name = projectName.trim()
    if (!name) return
    const next = [
      { id: Date.now(), name, profession: profession.label, status: 'Nowy' },
      ...projects,
    ]
    setProjects(next)
    setProjectName('')
    window.localStorage.setItem('ai_projects', JSON.stringify(next))
    showToast(`Dodano projekt: ${name}`)
  }

  // ─── Renderowanie ─────────────────────────────────────────────────────────

  function renderSteps() {
    const steps = ['O Tobie', 'Twoja praca', 'Preferencje']
    return (
      <div className="steps" aria-label="Postęp formularza">
        {steps.map((step, index) => {
          const stepNum = index + 1
          const isDone = formStep > stepNum
          const isActive = formStep === stepNum
          return (
            <div key={step} className={isDone ? 'done' : isActive ? 'active' : ''}>
              <b>{isDone ? <Check size={14} /> : stepNum}</b>
              <span>{step}</span>
            </div>
          )
        })}
      </div>
    )
  }

  function renderFormStep() {
    if (formStep === 1) {
      return (
        <div className="form-section">
          <h3>1. Kilka słów o Tobie</h3>
          <p>Wybierz zawód i poziom doświadczenia z AI.</p>
          <div className="field-grid">
            <label>
              <span>Jaką rolę pełnisz?</span>
              <select value={professionId} onChange={(e) => switchProfession(e.target.value)}>
                {professions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Poziom zaawansowania z AI</span>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option>Początkujący</option>
                <option>Średni</option>
                <option>Zaawansowany</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="ghost"
              onClick={() => switchProfession(professionId)}
            >
              <RefreshCcw size={17} /> Przywróć preset
            </button>
            <button type="button" className="primary" onClick={() => setFormStep(2)}>
              Dalej <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )
    }

    if (formStep === 2) {
      return (
        <div className="form-section">
          <h3>2. Twoja praca</h3>
          <p>Wybierz obszary i wpisz narzędzia, z których korzystasz na co dzień.</p>
          <div className="area-group">
            <span>Z jakich obszarów chcesz korzystać z AI? (wybierz do 3)</span>
            <div>
              {areas.map((area) => (
                <button
                  className={selectedAreas.includes(area) ? 'selected' : ''}
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                >
                  {area}
                  {selectedAreas.includes(area) && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
          <label className="wide-field">
            <span>Z jakich narzędzi korzystasz na co dzień?</span>
            <input value={toolsText} onChange={(e) => setToolsText(e.target.value)} />
          </label>
          <div className="form-actions">
            <button type="button" className="ghost" onClick={() => setFormStep(1)}>
              ← Wstecz
            </button>
            <button type="button" className="primary" onClick={() => setFormStep(3)}>
              Dalej <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )
    }

    // Krok 3
    return (
      <div className="form-section">
        <h3>3. Preferencje i klucz API</h3>
        <p>Opisz swoje potrzeby i opcjonalnie wpisz klucz Gemini.</p>

        <label className="wide-field">
          <span>Cel główny</span>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} />
        </label>

        <label className="wide-field">
          <span>Czego najbardziej potrzebujesz od AI?</span>
          <textarea
            maxLength={420}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
          <small>{problem.length} / 420</small>
        </label>

        <section className="api-key-panel" aria-label="Klucz Gemini API">
          <div>
            <strong>Klucz Gemini API (opcjonalnie)</strong>
            <p>
              Wklej klucz raz i zapisz go lokalnie. Pobierzesz go w{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                Google AI Studio
              </a>
              .
            </p>
          </div>
          <label>
            <span>API key</span>
            <input
              type="password"
              autoComplete="off"
              placeholder="AIza…"
              value={geminiApiKey}
              onChange={(e) => {
                setGeminiApiKey(e.target.value)
                setKeySaved(false)
                setApiKeyError('')
              }}
            />
            {apiKeyError && <small className="field-error">{apiKeyError}</small>}
          </label>
          <button type="button" onClick={saveGeminiApiKey}>
            <Check size={16} />
            {keySaved ? 'Zapisano' : 'Zapisz klucz'}
          </button>
        </section>

        <div className="form-actions">
          <button type="button" className="ghost" onClick={() => setFormStep(2)}>
            ← Wstecz
          </button>
          <button className="primary" disabled={isLoading} type="submit">
            {isLoading ? <Loader2 className="spin" size={18} /> : <Sparkles size={18} />}
            Wygeneruj stack
          </button>
        </div>
      </div>
    )
  }

  function renderDashboard() {
    return (
      <section className="content-grid">
        <form
          className="builder-panel"
          onSubmit={(e) => {
            e.preventDefault()
            generateStack()
          }}
        >
          <div className="panel-heading">
            <div>
              <h2>Stwórz swój spersonalizowany AI Stack</h2>
              <p>Uzupełnij dane, wybierz obszary i wygeneruj gotowe workflow.</p>
            </div>
            <span>{status}</span>
          </div>

          {renderSteps()}
          {renderFormStep()}
        </form>

        {renderStackPanel(true)}
      </section>
    )
  }

  function renderStackPanel(compact = false) {
    return (
      <section className={`stack-panel ${compact ? '' : 'wide-panel'}`}>
        <div className="panel-heading result-heading">
          <div>
            <h2>Twój wygenerowany AI Stack</h2>
            <p>
              Dopasowany do: <b>{profession.label}</b> · Poziom: <b>{level}</b>
            </p>
          </div>
          <div className="stack-export-btns">
            <button type="button" onClick={exportStack}>
              <Download size={17} />
              Eksportuj
            </button>
            <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              <Save size={17} />
              Importuj
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files && e.target.files[0]) { importStack(e.target.files[0]); e.target.value = '' } }}
            />
          </div>
        </div>

        <div className="tool-list">
          {stack.map((tool, index) => {
            const Icon = toolIcons[index % toolIcons.length]
            return (
              <article className="tool-row" key={`${tool.name}-${index}`}>
                <span className="tool-index">{index + 1}</span>
                <span className="tool-icon">
                  <Icon size={22} />
                </span>
                <div className="tool-copy">
                  <strong>{tool.name}</strong>
                  <p>{tool.value}</p>
                </div>
                <span className="category">{tool.category}</span>
                <a href={buildPromptUrl(tool)} target="_blank" rel="noreferrer">
                  Wypróbuj teraz
                  <ExternalLink size={14} />
                </a>
                <button
                  className="icon-button subtle"
                  type="button"
                  aria-label={`Zapisz prompt ${tool.name}`}
                  onClick={() => savePrompt(tool)}
                >
                  <Save size={17} />
                </button>
              </article>
            )
          })}
        </div>

        <div className="metrics">
          <div>
            <Target size={28} />
            <span>Oszczędzisz</span>
            <strong>{summary.weeklyHours}</strong>
            <p>tygodniowo</p>
          </div>
          <div>
            <Sparkles size={28} />
            <span>Wydajność</span>
            <strong>{summary.productivity}</strong>
            <p>więcej czasu na pracę</p>
          </div>
          <div>
            <BriefcaseBusiness size={28} />
            <span>Szacowany zwrot</span>
            <strong>{summary.monthlyValue}</strong>
            <p>miesięcznie</p>
          </div>
          <div>
            <Check size={28} />
            <span>Dopasowanie</span>
            <strong>{summary.fit}</strong>
            <p>do potrzeb</p>
          </div>
        </div>
        <p className="metrics-disclaimer">
          * Wartości szacunkowe wygenerowane przez AI na podstawie podanych danych – nie stanowią gwarancji wyników.
        </p>
      </section>
    )
  }

  function createStackForProject(project) {
    // Dopasuj projekt do zawodu
    const matched = professions.find(
      (p) => p.label.toLowerCase() === (project.profession || '').toLowerCase()
    )
    if (matched) {
      switchProfession(matched.id)
    }
    setFormStep(1)
    setActiveView('dashboard')
    setStatus('Generujesz stack dla projektu: ' + project.name + '. Uzupelnij formularz i kliknij Generuj.')
    showToast('Projekt "' + project.name + '" wczytany. Wypelnij formularz i wygeneruj stack.')
  }

  function renderProjects() {
    return (
      <section className="view-panel">
        <div className="panel-heading">
          <div>
            <h2>Moje projekty</h2>
            <p>Twórz proste projekty, do których będziesz przypinać stacki i prompty.</p>
          </div>
        </div>
        <div className="inline-form">
          <input
            placeholder="Np. kampania dla klienta, sesja wizerunkowa, lekcja z AI"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addProject()}
          />
          <button type="button" onClick={addProject}>
            <Plus size={16} /> Dodaj projekt
          </button>
        </div>
        <div className="item-grid">
          {projects.map((project) => (
            <article className="item-card project-card" key={project.id}>
              <strong>{project.name}</strong>
              <p className="project-profession">{project.profession}</p>
              <span className="project-status">{project.status}</span>
              <button
                className="project-stack-btn"
                type="button"
                onClick={function(){ createStackForProject(project) }}
              >
                <Sparkles size={14} />
                Utwórz stack
              </button>
            </article>
          ))}
        </div>
      </section>
    )
  }

  function renderHistory() {
    return (
      <section className="view-panel">
        <h2>Historia generowania</h2>
        <div className="list-panel">
          {history.length ? (
            history.map((item) => (
              <article className="history-row" key={item.id}>
                <div>
                  <strong>{item.profession}</strong>
                  <p>{item.goal}</p>
                </div>
                <span>{item.count} narzędzi</span>
                <small>{item.date}</small>
              </article>
            ))
          ) : (
            <p>Brak historii. Wygeneruj pierwszy stack z dashboardu.</p>
          )}
        </div>
      </section>
    )
  }

  function renderPrompts() {
    return (
      <section className="view-panel">
        <h2>Zapisane prompty</h2>
        <div className="prompt-grid">
          {savedPrompts.length ? (
            savedPrompts.map((item) => (
              <article className="prompt-card" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
                </div>
                <p>{item.prompt}</p>
                <button type="button" onClick={() => deletePrompt(item.id)}>
                  <Trash2 size={16} /> Usuń
                </button>
              </article>
            ))
          ) : (
            <p>Zapisz prompt przyciskiem dyskietki w widoku stacka.</p>
          )}
        </div>
      </section>
    )
  }

  function renderLibrary() {
    return (
      <section className="view-panel">
        <div className="panel-heading">
          <div>
            <h2>Biblioteka narzędzi</h2>
            <p>
              {filteredLibrary.length} z {fallbackStack.length} narzędzi
            </p>
          </div>
        </div>

        <div className="library-controls">
          <label className="library-search">
            <Search size={16} />
            <input
              placeholder="Szukaj narzędzia…"
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
            />
            {librarySearch && (
              <button
                type="button"
                className="library-clear"
                onClick={() => setLibrarySearch('')}
                aria-label="Wyczyść wyszukiwanie"
              >
                <X size={14} />
              </button>
            )}
          </label>
          <div className="library-filters">
            {libraryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={libraryCategory === cat ? 'selected' : ''}
                onClick={() => setLibraryCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="item-grid">
          {filteredLibrary.length ? (
            filteredLibrary.map((tool) => (
              <article className="item-card" key={tool.name}>
                <strong>{tool.name}</strong>
                <p>{tool.value}</p>
                <span>{tool.category}</span>
                <a className="tool-link" href={tool.url} target="_blank" rel="noreferrer">
                  Otwórz narzędzie <ExternalLink size={12} />
                </a>
              </article>
            ))
          ) : (
            <p>Brak wyników dla podanych filtrów.</p>
          )}
        </div>
      </section>
    )
  }

  function renderSimpleList(title, items) {
    return (
      <section className="view-panel">
        <h2>{title}</h2>
        <div className="item-grid">
          {items.map((item) =>
            Array.isArray(item) ? (
              <article className="item-card" key={item[0]}>
                <strong>{item[0]}</strong>
                <span>{item[1]}</span>
                <p>{item[2]}</p>
              </article>
            ) : (
              <article className="item-card" key={item}>
                <strong>{item}</strong>
                <p>Gotowy pomysł do przetestowania w tym tygodniu.</p>
              </article>
            ),
          )}
        </div>
      </section>
    )
  }

  function renderActiveView() {
    if (activeView === 'dashboard') return renderDashboard()
    if (activeView === 'stack') return <div className="single-view">{renderStackPanel()}</div>
    if (activeView === 'projects') return renderProjects()
    if (activeView === 'history') return renderHistory()
    if (activeView === 'prompts') return renderPrompts()
    if (activeView === 'tools') return renderLibrary()
    if (activeView === 'training') return renderSimpleList('Szkolenia', learningItems)
    return renderSimpleList('Inspiracje', inspirationItems)
  }

  const initials = userName
    ? userName.trim().split(' ').filter(function(w){ return w.length > 0 }).map(function(w){ return w[0].toUpperCase() }).join('').slice(0, 2)
    : '?'

  return (
    <div className="app-shell">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={22} />
          </div>
          <div>
            <strong>AI w Twoim Zawodzie</strong>
            <span>by Cyfrowy Przyjaciel</span>
          </div>
        </div>

        <p className="sidebar-label">Nawigacja</p>
        <nav className="nav-list" aria-label="Nawigacja główna">
          {navItems.map(([id, label, Icon]) => (
            <button
              className={activeView === id ? 'active' : ''}
              type="button"
              key={id}
              onClick={() => setActiveView(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <p className="sidebar-label">Zawody</p>
        <div className="profession-list">
          {professions.map((item) => {
            const Icon = item.icon
            return (
              <button
                className={item.id === professionId ? 'active' : ''}
                key={item.id}
                type="button"
                onClick={() => {
                  switchProfession(item.id)
                  setActiveView('dashboard')
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <h1>{pageTitle}</h1>
            <p>Darmowa aplikacja do budowania praktycznych workflow AI.</p>
          </div>
          <div className="top-actions">
            <div className="profile-wrapper">
              <button className="profile" type="button" onClick={function(){ setProfileOpen(function(o){ return !o }) }}>
                {initials} <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <label className="profile-label">Twoje imie</label>
                  <input className="profile-input" type="text" value={userName} placeholder="np. Jan Kowalski" onChange={function(e){ setUserName(e.target.value); window.localStorage.setItem('user_name', e.target.value) }} />
                  <button className="ghost profile-close" type="button" onClick={function(){ setProfileOpen(false) }}>Zamknij</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {renderActiveView()}
      </main>
    </div>
  )
}

export default App
