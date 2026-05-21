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

// ─── Stałe promptów ──────────────────────────────────────────────────────────

const BASE_AI_MODELS = [
  'ChatGPT (GPT-4o)', 'ChatGPT (GPT-4)', 'Claude 3.5 Sonnet', 'Claude 3 Opus',
  'Gemini 2.5 Flash', 'Gemini 2.0 Pro', 'Copilot', 'Perplexity',
  'Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Adobe Firefly',
  'Canva AI', 'Runway ML', 'Suno AI', 'ElevenLabs', 'Notion AI',
]

const PROMPT_CATS = [
  'Tekst', 'Grafika', 'Kod', 'Marketing', 'Research',
  'Wideo', 'Audio', 'Organizacja', 'Sprzedaż', 'Inne',
]

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

const LIBRARY_EXAMPLES = {
  'Gemini': [
    { name: 'Pomysły na treści', cat: 'Tekst', prompt: 'Wygeneruj 10 pomysłów na posty Instagram dla [mój zawód]. Każdy pomysł w jednym zdaniu, praktyczny i angażujący.' },
    { name: 'Email do klienta', cat: 'Tekst', prompt: 'Napisz profesjonalny email z podziękowaniem po zakończonej usłudze i prośbą o wystawienie opinii.' },
    { name: 'Opis oferty', cat: 'Marketing', prompt: 'Napisz przekonujący opis mojej usługi [nazwa] na stronę www. Styl: ciepły, profesjonalny, 150 słów.' },
  ],
  'Canva AI': [
    { name: 'Karuzela Instagram', cat: 'Grafika', prompt: 'Zaproponuj strukturę 8 slajdów karuzeli Instagram prezentującej portfolio [mój zawód].' },
    { name: 'Post wizerunkowy', cat: 'Grafika', prompt: 'Napisz tekst do posta wizerunkowego z moją historią zawodową. Styl szczery, 3 akapity.' },
    { name: 'Historia marki', cat: 'Marketing', prompt: 'Stwórz konspekt prezentacji "Moja historia jako [zawód]" na 6 slajdów z nagłówkami.' },
  ],
  'Notion AI': [
    { name: 'Szablon projektu', cat: 'Organizacja', prompt: 'Stwórz szablon notatki projektowej dla nowego zlecenia: pola klienta, termin, zakres, linki, status.' },
    { name: 'Checklist przed realizacją', cat: 'Organizacja', prompt: 'Napisz checklistę 15 rzeczy do sprawdzenia przed realizacją typowego zlecenia w mojej branży.' },
    { name: 'Baza pomysłów', cat: 'Organizacja', prompt: 'Zaproponuj strukturę bazy wiedzy Notion dla freelancera: sekcje, widoki, właściwości.' },
  ],
  'Metricool': [
    { name: 'Plan publikacji', cat: 'Marketing', prompt: 'Ułóż 7-dniowy plan publikacji social media dla [zawód] z jednym celem: więcej zapytań od klientów.' },
    { name: 'Analiza zasięgów', cat: 'Research', prompt: 'Podaj 5 wskaźników, które powinienem śledzić w Metricool jako [zawód], i co każdy z nich oznacza.' },
    { name: 'Hashtagi', cat: 'Marketing', prompt: 'Zaproponuj 20 hashtagów do postów Instagram dla [zawód] w Polsce, mieszanka niszowych i popularnych.' },
  ],
  'Trello + AI': [
    { name: 'Tablica projektu', cat: 'Organizacja', prompt: 'Rozpisz tablicę Trello dla procesu od pierwszego zapytania klienta do finalnego dostarczenia usługi.' },
    { name: 'Tygodniowy przegląd', cat: 'Organizacja', prompt: 'Stwórz szablon tygodniowego przeglądu zadań dla freelancera: 5 pytań do oceny tygodnia.' },
    { name: 'Onboarding klienta', cat: 'Tekst', prompt: 'Napisz listę kroków onboardingu nowego klienta — od pierwszego kontaktu do startu realizacji.' },
  ],
  'Mailerlite AI': [
    { name: 'Sekwencja powitalna', cat: 'Marketing', prompt: 'Napisz 3-mailową sekwencję powitalną dla nowych subskrybentów mojego newslettera jako [zawód].' },
    { name: 'Email po usłudze', cat: 'Tekst', prompt: 'Napisz email wysyłany 7 dni po zakończeniu usługi: podzięk, pytanie o wrażenia, propozycja kolejnej współpracy.' },
    { name: 'Oferta specjalna', cat: 'Marketing', prompt: 'Napisz email z limitowaną ofertą specjalną dla stałych klientów. Styl: ciepły, bez nachalnej sprzedaży.' },
  ],
  'Google Drive AI': [
    { name: 'Struktura folderów', cat: 'Organizacja', prompt: 'Zaproponuj optymalną strukturę folderów Google Drive dla [zawód]: projekty, klienci, zasoby, archiwum.' },
    { name: 'Nazewnictwo plików', cat: 'Organizacja', prompt: 'Stwórz system nazewnictwa plików dla [zawód] — daty, klienci, wersje — żeby łatwo szukać.' },
    { name: 'Shared drive', cat: 'Produktywność', prompt: 'Jak skonfigurować Shared Drive do współpracy z klientem? Podaj 5 dobrych praktyk.' },
  ],
  'CapCut AI': [
    { name: 'Scenariusz rolki', cat: 'Wideo', prompt: 'Ułóż scenariusz 30-sekundowej rolki pokazującej kulisy mojej pracy jako [zawód]. Hook + 3 sceny + CTA.' },
    { name: 'Napisy do wideo', cat: 'Wideo', prompt: 'Napisz tekst do wideo "Dlaczego wybrałem zawód [zawód]" — styl szczery, 60 sekund mówienia.' },
    { name: 'Pomysły na rolki', cat: 'Wideo', prompt: 'Podaj 10 pomysłów na rolki Instagram/TikTok dla [zawód], które angażują i budują markę osobistą.' },
  ],
  'Adobe Lightroom AI': [
    { name: 'Preset workflow', cat: 'Grafika', prompt: 'Opisz workflow edycji zdjęć w Lightroom AI od importu do eksportu: jakie kroki, w jakiej kolejności.' },
    { name: 'Styl wizualny', cat: 'Grafika', prompt: 'Pomóż mi opisać mój styl wizualny w 5 przymiotnikach i 3 zdaniach, które użyję w komunikacji marki.' },
    { name: 'Eksport ustawienia', cat: 'Grafika', prompt: 'Jakie ustawienia eksportu z Lightroom stosować dla różnych celów: web, druk, social media, klient?' },
  ],
  'Remove.bg': [
    { name: 'Kiedy używać', cat: 'Grafika', prompt: 'W jakich 5 sytuacjach usuwanie tła jest niezbędne w pracy [zawód]? Podaj konkretne przykłady.' },
    { name: 'Workflow produktowy', cat: 'Grafika', prompt: 'Opisz krok po kroku jak przygotować zdjęcia produktowe do sklepu online z użyciem Remove.bg.' },
    { name: 'Portfolio miniatura', cat: 'Grafika', prompt: 'Jak tworzyć spójne miniatury portfolio używając usuniętego tła? Podaj wytyczne stylistyczne.' },
  ],
}

// ─── Helpery ──────────────────────────────────────────────────────────────────

function buildPromptUrl(tool) {
  if (tool.url?.includes('gemini.google.com')) {
    return `https://gemini.google.com/app?text=${encodeURIComponent(tool.prompt || '')}`
  }
  return tool.url || 'https://gemini.google.com/'
}

function getToolLessons(tool) {
  const promptSnippet = (tool.prompt || '').slice(0, 90) + ((tool.prompt || '').length > 90 ? '…' : '')
  return [
    {
      id: tool.name + '-0',
      title: 'Pierwsze kroki z ' + tool.name,
      duration: '10 min',
      desc: 'Poznaj interfejs i możliwości narzędzia. ' + tool.value,
      task: 'Otwórz narzędzie i przetestuj gotowy prompt: „' + promptSnippet + '"',
      url: tool.url || '#',
      level: 'Podstawowy',
    },
    {
      id: tool.name + '-1',
      title: tool.name + ' w codziennej pracy',
      duration: '15 min',
      desc: 'Wdróż ' + tool.name + ' do realnych zadań. Kategoria: ' + tool.category + '. ' + tool.value,
      task: 'Dostosuj gotowy prompt do konkretnego zadania z bieżącego tygodnia i zapisz efekt.',
      url: tool.url || '#',
      level: 'Średni',
    },
    {
      id: tool.name + '-2',
      title: 'Workflow z ' + tool.name + ' — oszczędność czasu',
      duration: '20 min',
      desc: 'Połącz ' + tool.name + ' z innymi narzędziami ze swojego stacka i zbuduj mini-automatyzację.',
      task: 'Zapisz 3 przypadki, w których ' + tool.name + ' zastępuje Twoją manualną pracę.',
      url: tool.url || '#',
      level: 'Zaawansowany',
    },
  ]
}

function getStackInspirations(stack) {
  const result = []
  stack.forEach(function(tool) {
    result.push({
      id: tool.name + '-quick',
      type: 'quick',
      typeLabel: 'Szybki test',
      time: '5 min',
      title: 'Przetestuj ' + tool.name + ' dziś',
      desc: 'Wybierz jedno realne zadanie z dziś i wykonaj je za pomocą ' + tool.name + '. ' + tool.value,
      prompt: tool.prompt,
      tool: tool.name,
      url: tool.url || '#',
    })
    result.push({
      id: tool.name + '-workflow',
      type: 'workflow',
      typeLabel: 'Workflow',
      time: '30 min',
      title: 'Mini-automatyzacja z ' + tool.name,
      desc: 'Zidentyfikuj jeden powtarzalny proces i zautomatyzuj go za pomocą ' + tool.name + '. Kategoria: ' + tool.category + '.',
      prompt: 'Opisz krok po kroku jak ' + tool.name + ' może zastąpić moją ręczną pracę przy: [wpisz zadanie]. Daj gotowy przepływ pracy.',
      tool: tool.name,
      url: tool.url || '#',
    })
    result.push({
      id: tool.name + '-idea',
      type: 'idea',
      typeLabel: 'Pomysł',
      time: '15 min',
      title: tool.name + ' — nowe zastosowanie',
      desc: 'Wymyśl nieoczywiste zastosowanie ' + tool.name + ' w kategorii ' + tool.category + '. Co możesz zrobić inaczej niż dotychczas?',
      prompt: 'Podaj 5 nieoczywistych sposobów użycia ' + tool.name + ' dla kogoś w mojej pracy. Skup się na oszczędności czasu i energii.',
      tool: tool.name,
      url: tool.url || '#',
    })
  })
  return result
}

function seededShuffle(arr, seed) {
  const result = arr.slice()
  let s = seed >>> 0
  for (let i = result.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    const j = s % (i + 1)
    const tmp = result[i]; result[i] = result[j]; result[j] = tmp
  }
  return result
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
  const [stack, setStack] = useState(() => getStoredValue('ai_stack', []))
  const [summary, setSummary] = useState({
    weeklyHours: '8-12 h',
    productivity: '+45%',
    monthlyValue: '650 zł+',
    fit: '92%',
  })
  const [history, setHistory] = useState(() => getStoredValue('ai_stack_history', []))
  const [savedPrompts, setSavedPrompts] = useState(() => getStoredValue('saved_prompts', []))
  const [promptFormOpen, setPromptFormOpen] = useState(true)
  const [completedLessons, setCompletedLessons] = useState(() => getStoredValue('completed_lessons', []))
  const [trainingFilter, setTrainingFilter] = useState('all')
  const [expandedTool, setExpandedTool] = useState(null)
  const [doneInspirations, setDoneInspirations] = useState(() => getStoredValue('done_inspirations', []))
  const [inspirationFilter, setInspirationFilter] = useState('all')
  const [shuffleSeed, setShuffleSeed] = useState(1)
  const [newPromptName, setNewPromptName] = useState('')
  const [newPromptModel, setNewPromptModel] = useState('')
  const [newPromptCat, setNewPromptCat] = useState('')
  const [newPromptText, setNewPromptText] = useState('')
  const [projects, setProjects] = useState(() => getStoredValue('ai_projects', []))
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
  const promptImportRef = useRef(null)

  // Sprawdź install_id — czyści dane przy nowej instalacji
  useEffect(() => {
    async function checkInstallId() {
      try {
        const res = await fetch('/api/install-id')
        const data = await res.json()
        const newId = data.installId || 'dev'
        if (newId === 'dev') return
        const storedId = window.localStorage.getItem('app_install_id')
        if (storedId && storedId !== newId) {
          const keysToKeep = ['app_install_id', 'gemini_api_key']
          const toRemove = []
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i)
            if (k && !keysToKeep.includes(k)) toRemove.push(k)
          }
          toRemove.forEach(function(k) { window.localStorage.removeItem(k) })
          window.location.reload()
        }
        if (!storedId || storedId !== newId) {
          window.localStorage.setItem('app_install_id', newId)
        }
      } catch { /* tryb dev lub brak pliku */ }
    }
    checkInstallId()
  }, [])

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

  function saveNewPrompt() {
    if (!newPromptName.trim() || !newPromptText.trim()) {
      showToast('Uzupełnij nazwę i treść promptu.')
      return
    }
    const entry = {
      id: Date.now().toString(),
      name: newPromptName.trim(),
      model: newPromptModel,
      category: newPromptCat,
      prompt: newPromptText.trim(),
    }
    const next = [entry, ...savedPrompts]
    setSavedPrompts(next)
    window.localStorage.setItem('saved_prompts', JSON.stringify(next))
    setNewPromptName('')
    setNewPromptModel('')
    setNewPromptCat('')
    setNewPromptText('')
    setPromptFormOpen(false)
    showToast('Prompt zapisany!')
  }

  function copyPromptText(text) {
    navigator.clipboard.writeText(text).then(
      function() { showToast('Prompt skopiowany!') },
      function() { showToast('Nie można skopiować.') }
    )
  }

  function savePromptQuick(name, prompt, model, cat) {
    if (!prompt) return
    const entry = {
      id: Date.now().toString(),
      name: name || prompt.slice(0, 40),
      model: model || '',
      category: cat || '',
      prompt: prompt,
    }
    const next = [entry, ...savedPrompts]
    setSavedPrompts(next)
    window.localStorage.setItem('saved_prompts', JSON.stringify(next))
    showToast('Prompt zapisany: ' + entry.name)
  }

  function clearHistory() {
    setHistory([])
    window.localStorage.removeItem('ai_stack_history')
    showToast('Historia wyczyszczona.')
  }

  function exportPrompts() {
    if (!savedPrompts.length) { showToast('Brak promptów do eksportu.'); return }
    const data = { version: 1, exportedAt: new Date().toISOString(), prompts: savedPrompts }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ai-prompty-' + Date.now() + '.json'
    a.click()
    URL.revokeObjectURL(a.href)
    showToast('Wyeksportowano ' + savedPrompts.length + ' promptów.')
  }

  function importPrompts(file) {
    const reader = new FileReader()
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result)
        const list = Array.isArray(data.prompts) ? data.prompts : (Array.isArray(data) ? data : null)
        if (!list || !list.length) { showToast('Nieprawidłowy plik — brak promptów.'); return }
        const valid = list.filter(function(p) { return p.name && p.prompt })
        const next = [...valid.map(function(p) {
          return { id: p.id || Date.now().toString() + Math.random(), name: p.name, model: p.model || '', category: p.category || '', prompt: p.prompt }
        }), ...savedPrompts]
        setSavedPrompts(next)
        window.localStorage.setItem('saved_prompts', JSON.stringify(next))
        showToast('Zaimportowano ' + valid.length + ' promptów.')
      } catch { showToast('Błąd odczytu pliku JSON.') }
    }
    reader.readAsText(file)
  }

  function resetAllData() {
    const keys = ['ai_stack','ai_stack_history','saved_prompts','ai_projects','completed_lessons','done_inspirations','user_name','app_install_id']
    keys.forEach(function(k) { window.localStorage.removeItem(k) })
    window.location.reload()
  }

  function toggleLesson(lessonId) {
    const next = completedLessons.includes(lessonId)
      ? completedLessons.filter(function(id) { return id !== lessonId })
      : [...completedLessons, lessonId]
    setCompletedLessons(next)
    window.localStorage.setItem('completed_lessons', JSON.stringify(next))
    if (!completedLessons.includes(lessonId)) showToast('Lekcja ukończona!')
  }

  function toggleInspiration(id) {
    const next = doneInspirations.includes(id)
      ? doneInspirations.filter(function(x) { return x !== id })
      : [...doneInspirations, id]
    setDoneInspirations(next)
    window.localStorage.setItem('done_inspirations', JSON.stringify(next))
    if (!doneInspirations.includes(id)) showToast('Wyzwanie zaliczone!')
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
        <div className="panel-heading">
          <div>
            <h2>Historia generowania</h2>
            <p>{history.length} wpisów</p>
          </div>
          {history.length > 0 && (
            <button type="button" className="btn-danger-ghost" onClick={clearHistory}>
              <Trash2 size={15} /> Wyczyść historię
            </button>
          )}
        </div>
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
            <p className="empty-hint">Brak historii. Wygeneruj pierwszy stack z dashboardu.</p>
          )}
        </div>
      </section>
    )
  }

  function renderPrompts() {
    const stackModelNames = stack.map(function(t) { return t.name })
    const allModels = Array.from(new Set([...stackModelNames, ...BASE_AI_MODELS]))

    return (
      <section className="view-panel">
        <div className="panel-heading">
          <div>
            <h2>Zapisane prompty</h2>
            <p>{savedPrompts.length} zapisanych promptów</p>
          </div>
          <div className="prompt-header-actions">
            <button type="button" className="btn-add-prompt" onClick={() => setPromptFormOpen(function(v) { return !v })}>
              <Plus size={16} /> {promptFormOpen ? 'Anuluj' : 'Nowy prompt'}
            </button>
            <button type="button" className="btn-export-prompts" onClick={exportPrompts}>
              <Download size={15} /> Eksportuj
            </button>
            <button type="button" className="btn-export-prompts" onClick={function() { promptImportRef.current && promptImportRef.current.click() }}>
              <Save size={15} /> Importuj
            </button>
            <input ref={promptImportRef} type="file" accept=".json" style={{display:'none'}} onChange={function(e){ if(e.target.files&&e.target.files[0]){importPrompts(e.target.files[0]);e.target.value=''} }} />
          </div>
        </div>

        {promptFormOpen && (
          <div className="prompt-form">
            <h3>Dodaj nowy prompt</h3>
            <div className="prompt-form-row">
              <label>
                Nazwa
                <input
                  type="text"
                  placeholder="np. Opis sesji zdjęciowej"
                  value={newPromptName}
                  onChange={function(e) { setNewPromptName(e.target.value) }}
                  maxLength={80}
                />
              </label>
              <label>
                Model AI
                <select
                  value={newPromptModel}
                  onChange={function(e) { setNewPromptModel(e.target.value) }}
                >
                  <option value="">— wybierz model —</option>
                  {stack.length > 0 && (
                    <optgroup label="Z Twojego stacka">
                      {stackModelNames.map(function(m) {
                        return <option key={m} value={m}>{m}</option>
                      })}
                    </optgroup>
                  )}
                  <optgroup label="Popularne modele">
                    {BASE_AI_MODELS.map(function(m) {
                      return <option key={m} value={m}>{m}</option>
                    })}
                  </optgroup>
                </select>
              </label>
              <label>
                Zastosowanie
                <select
                  value={newPromptCat}
                  onChange={function(e) { setNewPromptCat(e.target.value) }}
                >
                  <option value="">— wybierz typ —</option>
                  {PROMPT_CATS.map(function(c) {
                    return <option key={c} value={c}>{c}</option>
                  })}
                </select>
              </label>
            </div>
            <label className="prompt-form-full">
              Treść promptu
              <textarea
                placeholder="Wpisz lub wklej prompt…"
                value={newPromptText}
                onChange={function(e) { setNewPromptText(e.target.value) }}
                rows={5}
              />
            </label>
            <button type="button" className="btn-save-prompt" onClick={saveNewPrompt}>
              <Save size={16} /> Zapisz prompt
            </button>
          </div>
        )}

        <div className="prompt-grid">
          {savedPrompts.length ? (
            savedPrompts.map(function(item) {
              return (
                <article className="prompt-card" key={item.id}>
                  <div className="prompt-card-header">
                    <div>
                      <strong>{item.name}</strong>
                      <div className="prompt-card-meta">
                        {item.model && <span className="prompt-badge model">{item.model}</span>}
                        {item.category && <span className="prompt-badge cat">{item.category}</span>}
                        {!item.model && !item.category && item.category !== undefined && (
                          <span className="prompt-badge cat">{item.category || 'Brak kategorii'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="prompt-text">{item.prompt}</p>
                  <div className="prompt-card-actions">
                    <button
                      type="button"
                      className="btn-copy-prompt"
                      onClick={function() { copyPromptText(item.prompt) }}
                    >
                      <Copy size={15} /> Kopiuj prompt
                    </button>
                    <button
                      type="button"
                      className="btn-delete-prompt"
                      onClick={function() { deletePrompt(item.id) }}
                    >
                      <Trash2 size={15} /> Usuń
                    </button>
                  </div>
                </article>
              )
            })
          ) : (
            <p className="empty-hint">Brak zapisanych promptów. Dodaj nowy lub zapisz z widoku stacka.</p>
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
            filteredLibrary.map(function(tool) {
              const examples = LIBRARY_EXAMPLES[tool.name] || []
              return (
                <article className="item-card lib-card" key={tool.name}>
                  <div className="lib-card-top">
                    <strong>{tool.name}</strong>
                    <span>{tool.category}</span>
                  </div>
                  <p>{tool.value}</p>
                  {examples.length > 0 && (
                    <div className="lib-prompts">
                      <span className="lib-prompts-label">Przykładowe prompty:</span>
                      {examples.map(function(ex, i) {
                        return (
                          <div key={i} className="lib-prompt-row">
                            <span className="lib-prompt-name">{ex.name}</span>
                            <p className="lib-prompt-text">{ex.prompt}</p>
                            <div className="lib-prompt-actions">
                              <button type="button" className="lib-btn-copy" onClick={function(){ copyPromptText(ex.prompt) }}>
                                <Copy size={12} /> Kopiuj
                              </button>
                              <button type="button" className="lib-btn-save" onClick={function(){ savePromptQuick(ex.name + ' — ' + tool.name, ex.prompt, tool.name, ex.cat) }}>
                                <Save size={12} /> Zapisz
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <a className="tool-link" href={tool.url} target="_blank" rel="noreferrer">
                    Otwórz narzędzie <ExternalLink size={12} />
                  </a>
                </article>
              )
            })
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

  function renderTraining() {
    const isFallback = stack.length > 0 && stack[0].name === fallbackStack[0].name &&
      stack.length === fallbackStack.length
    const allLessons = stack.flatMap(getToolLessons)
    const totalCount = allLessons.length
    const doneCount = allLessons.filter(function(l) { return completedLessons.includes(l.id) }).length
    const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0
    const levelClass = { 'Podstawowy': 'level-basic', 'Średni': 'level-mid', 'Zaawansowany': 'level-adv' }

    return (
      <section className="view-panel">
        <div className="panel-heading">
          <div>
            <h2>Plan szkoleń</h2>
            <p>Spersonalizowany plan na podstawie Twojego AI Stacka</p>
          </div>
        </div>

        {isFallback ? (
          <div className="training-no-stack">
            <GraduationCap size={48} />
            <h3>Brak spersonalizowanego stacka</h3>
            <p>Wygeneruj swój AI Stack, aby zobaczyć plan szkoleń dopasowany do Twojego zawodu i narzędzi.</p>
            <button type="button" onClick={function() { setActiveView('dashboard') }}>
              Przejdź do generatora
            </button>
          </div>
        ) : (
          <>
            <div className="training-progress-wrap">
              <div className="training-progress-header">
                <span>{doneCount} / {totalCount} lekcji ukończonych</span>
                <span className="training-pct">{progress}%</span>
              </div>
              <div className="training-bar">
                <div className="training-bar-fill" style={{ width: progress + '%' }} />
              </div>
            </div>

            <div className="training-filters">
              {[['all', 'Wszystkie'], ['todo', 'Do zrobienia'], ['done', 'Ukończone']].map(function(pair) {
                return (
                  <button
                    key={pair[0]}
                    type="button"
                    className={trainingFilter === pair[0] ? 'active' : ''}
                    onClick={function() { setTrainingFilter(pair[0]) }}
                  >
                    {pair[1]}
                  </button>
                )
              })}
            </div>

            <div className="training-list">
              {stack.map(function(tool) {
                const lessons = getToolLessons(tool)
                const toolDone = lessons.filter(function(l) { return completedLessons.includes(l.id) }).length
                const isExpanded = expandedTool === tool.name
                const allDone = toolDone === lessons.length

                if (trainingFilter === 'done' && toolDone === 0) return null
                if (trainingFilter === 'todo' && allDone) return null

                return (
                  <div key={tool.name} className={'training-tool' + (allDone ? ' all-done' : '')}>
                    <button
                      type="button"
                      className="training-tool-header"
                      onClick={function() { setExpandedTool(isExpanded ? null : tool.name) }}
                    >
                      <div className="training-tool-left">
                        <strong>{tool.name}</strong>
                        <span className="training-tool-cat">{tool.category}</span>
                      </div>
                      <div className="training-tool-right">
                        <span className="training-mini-progress">
                          {toolDone}/{lessons.length}
                        </span>
                        {allDone && <Check size={15} className="training-all-done-icon" />}
                        <ChevronDown
                          size={16}
                          className={'training-chevron' + (isExpanded ? ' open' : '')}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="training-lessons">
                        {lessons.map(function(lesson) {
                          const isDone = completedLessons.includes(lesson.id)
                          if (trainingFilter === 'done' && !isDone) return null
                          if (trainingFilter === 'todo' && isDone) return null

                          return (
                            <div key={lesson.id} className={'training-lesson' + (isDone ? ' done' : '')}>
                              <div className="training-lesson-meta">
                                <span className={'training-level ' + (levelClass[lesson.level] || '')}>
                                  {lesson.level}
                                </span>
                                <span className="training-duration">{lesson.duration}</span>
                              </div>
                              <strong className="training-lesson-title">{lesson.title}</strong>
                              <p className="training-lesson-desc">{lesson.desc}</p>
                              <div className="training-task-box">
                                <Target size={13} />
                                <span>{lesson.task}</span>
                              </div>
                              <div className="training-lesson-actions">
                                <a href={lesson.url} target="_blank" rel="noreferrer" className="training-btn-open">
                                  <ExternalLink size={13} /> Otwórz narzędzie
                                </a>
                                <button type="button" className="training-btn-open" onClick={function() { savePromptQuick(lesson.title, lesson.task, tool.name, 'Tekst') }}>
                                  <Save size={13} /> Zapisz prompt
                                </button>
                                <button
                                  type="button"
                                  className={'training-btn-done' + (isDone ? ' is-done' : '')}
                                  onClick={function() { toggleLesson(lesson.id) }}
                                >
                                  <Check size={13} />
                                  {isDone ? 'Ukończona' : 'Oznacz jako ukończoną'}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </section>
    )
  }

  function renderInspirations() {
    const isFallback = stack.length > 0 && stack[0].name === fallbackStack[0].name &&
      stack.length === fallbackStack.length
    const all = seededShuffle(getStackInspirations(stack), shuffleSeed)
    const filtered = inspirationFilter === 'all' ? all : all.filter(function(c) { return c.type === inspirationFilter })
    const doneCount = all.filter(function(c) { return doneInspirations.includes(c.id) }).length
    const typeColors = { quick: 'insp-quick', workflow: 'insp-workflow', idea: 'insp-idea' }

    return (
      <section className="view-panel">
        <div className="panel-heading">
          <div>
            <h2>Inspiracje</h2>
            <p>{doneCount} / {all.length} wyzwań ukończonych</p>
          </div>
          <button
            type="button"
            className="btn-shuffle"
            onClick={function() { setShuffleSeed(function(s) { return s + 1 }) }}
          >
            <RefreshCcw size={15} /> Losuj kolejność
          </button>
        </div>

        {isFallback ? (
          <div className="training-no-stack">
            <WandSparkles size={48} />
            <h3>Brak spersonalizowanego stacka</h3>
            <p>Wygeneruj swój AI Stack, aby zobaczyć wyzwania dopasowane do Twoich narzędzi.</p>
            <button type="button" onClick={function() { setActiveView('dashboard') }}>
              Przejdź do generatora
            </button>
          </div>
        ) : (
          <>
            <div className="training-filters">
              {[['all','Wszystkie'], ['quick','Szybki test'], ['workflow','Workflow'], ['idea','Pomysł']].map(function(pair) {
                return (
                  <button
                    key={pair[0]}
                    type="button"
                    className={inspirationFilter === pair[0] ? 'active' : ''}
                    onClick={function() { setInspirationFilter(pair[0]) }}
                  >
                    {pair[1]}
                  </button>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <p className="empty-hint">Brak wyzwań w tej kategorii.</p>
            )}

            <div className="insp-grid">
              {filtered.map(function(card) {
                const isDone = doneInspirations.includes(card.id)
                return (
                  <article key={card.id} className={'insp-card' + (isDone ? ' done' : '')}>
                    <div className="insp-card-top">
                      <span className={'insp-badge ' + (typeColors[card.type] || '')}>{card.typeLabel}</span>
                      <span className="insp-time">{card.time}</span>
                      {isDone && <Check size={15} className="insp-done-icon" />}
                    </div>
                    <strong className="insp-title">{card.title}</strong>
                    <p className="insp-desc">{card.desc}</p>
                    <div className="insp-prompt-box">
                      <span className="insp-prompt-label">Prompt do wypróbowania:</span>
                      <p className="insp-prompt-text">{card.prompt}</p>
                    </div>
                    <div className="insp-actions">
                      <button type="button" className="insp-btn-copy" onClick={function() { copyPromptText(card.prompt) }}>
                        <Copy size={13} /> Kopiuj prompt
                      </button>
                      <button type="button" className="insp-btn-copy" onClick={function() { savePromptQuick(card.title, card.prompt, card.tool, card.typeLabel) }}>
                        <Save size={13} /> Zapisz prompt
                      </button>
                      <a href={card.url} target="_blank" rel="noreferrer" className="insp-btn-try">
                        <ExternalLink size={13} /> Wypróbuj
                      </a>
                      <button type="button" className={'insp-btn-done' + (isDone ? ' is-done' : '')} onClick={function() { toggleInspiration(card.id) }}>
                        <Check size={13} /> {isDone ? 'Zrobione' : 'Oznacz jako zrobione'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}
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
    if (activeView === 'training') return renderTraining()
    return renderInspirations()
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
                  <button className="btn-danger-ghost profile-reset" type="button" onClick={function(){ if(window.confirm('Usunąć wszystkie dane aplikacji?')) resetAllData() }}>
                    <Trash2 size={13} /> Resetuj wszystkie dane
                  </button>
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
