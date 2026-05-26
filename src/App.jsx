import { useMemo, useRef, useState } from 'react'
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Loader2,
  Moon,
  Plus,
  Sun,
  RefreshCcw,
  Save,
  Zap,
  Search,
  Sparkles,
  Target,
  Trash2,
  WandSparkles,
  X,
} from 'lucide-react'
import './App.css'
import Toast from './components/Toast'
import StackSourceBadge from './components/StackSourceBadge'
import WeeklyPlanPanel from './components/WeeklyPlanPanel'
import OnboardingModal from './components/OnboardingModal'
import HistoryView from './components/HistoryView'
import ProfileDefaults from './components/ProfileDefaults'
import { buildWeeklyPlan } from './lib/weeklyPlan'
import { printStackReport } from './lib/exportPrint'
import { BASE_AI_MODELS, PROMPT_CATS } from './data/constants'
import { LIBRARY_EXAMPLES } from './data/libraryExamples'
import {
  CUSTOM_PROFESSION_ID,
  areas,
  fallbackStack,
  getProfessionById,
  navItems,
  professions,
  toolIcons,
} from './data/professions'
import { useInstallId } from './hooks/useInstallId'
import { useTheme } from './hooks/useTheme'
import { uniqueId } from './lib/id'
import { buildPromptUrl } from './lib/promptUrl'
import { getStackInspirations, getToolLessons, seededShuffle } from './lib/stackHelpers'
import { describeStackStatus, requestStackGeneration } from './lib/stackApi'
import {
  buildDefaultsPayload,
  getInitialFormState,
  readUserDefaults,
  saveUserDefaults,
} from './lib/userDefaults'
import {
  downloadTextFile,
  parsePromptbaseCsv,
  serializePromptbaseCsv,
} from './lib/promptCsv'
import {
  STORAGE_KEYS,
  clearAppData,
  exportAllData,
  getJson,
  getString,
  importAllData,
  setJson,
  setString,
} from './lib/storage'

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  useInstallId()
  const { isDark, toggleTheme } = useTheme()

  const initialForm = getInitialFormState()
  const [activeView, setActiveView] = useState('dashboard')
  const [professionId, setProfessionId] = useState(initialForm.professionId)
  const profession = getProfessionById(professionId)
  const [customProfessionLabel, setCustomProfessionLabel] = useState(
    initialForm.customProfessionLabel,
  )
  const [level, setLevel] = useState(initialForm.level)
  const [selectedAreas, setSelectedAreas] = useState(initialForm.selectedAreas)
  const [goal, setGoal] = useState(initialForm.goal)
  const [toolsText, setToolsText] = useState(initialForm.toolsText)
  const [problem, setProblem] = useState(initialForm.problem)
  const [stack, setStack] = useState(() => getJson(STORAGE_KEYS.stack, []))
  const [stackMeta, setStackMeta] = useState(() =>
    getJson(STORAGE_KEYS.stackMeta, { source: 'demo', reason: 'missing-key' }),
  )
  const [summary, setSummary] = useState({
    weeklyHours: '8-12 h',
    productivity: '+45%',
    monthlyValue: '650 zł+',
    fit: '92%',
  })
  const [history, setHistory] = useState(() => getJson(STORAGE_KEYS.stackHistory, []))
  const [savedPrompts, setSavedPrompts] = useState(() => getJson(STORAGE_KEYS.savedPrompts, []))
  const [promptFormOpen, setPromptFormOpen] = useState(true)
  const [completedLessons, setCompletedLessons] = useState(() =>
    getJson(STORAGE_KEYS.completedLessons, []),
  )
  const [trainingFilter, setTrainingFilter] = useState('all')
  const [expandedTool, setExpandedTool] = useState(null)
  const [doneInspirations, setDoneInspirations] = useState(() =>
    getJson(STORAGE_KEYS.doneInspirations, []),
  )
  const [inspirationFilter, setInspirationFilter] = useState('all')
  const [shuffleSeed, setShuffleSeed] = useState(1)
  const [newPromptName, setNewPromptName] = useState('')
  const [newPromptModel, setNewPromptModel] = useState('')
  const [newPromptCat, setNewPromptCat] = useState('')
  const [newPromptText, setNewPromptText] = useState('')
  const [projects, setProjects] = useState(() => getJson(STORAGE_KEYS.projects, []))
  const [projectName, setProjectName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [geminiApiKey, setGeminiApiKey] = useState(() => getString(STORAGE_KEYS.geminiApiKey, ''))
  const [keySaved, setKeySaved] = useState(Boolean(getString(STORAGE_KEYS.geminiApiKey, '')))
  const [apiKeyError, setApiKeyError] = useState('')
  const [status, setStatus] = useState(
    getString(STORAGE_KEYS.geminiApiKey, '')
      ? 'Klucz Gemini zapisany. Możesz generować stack na żywo.'
      : 'Tryb demo. Wpisz klucz Gemini, aby generować wynik na żywo.',
  )
  const [toast, setToast] = useState(null)
  const [formStep, setFormStep] = useState(1)
  const [userName, setUserName] = useState(() => getString(STORAGE_KEYS.userName, ''))
  const [profileOpen, setProfileOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(
    () => !getString(STORAGE_KEYS.onboardingCompleted, ''),
  )
  const [weeklyPlanDone, setWeeklyPlanDone] = useState(() =>
    getJson(STORAGE_KEYS.weeklyPlanDone, []),
  )
  const fileInputRef = useRef(null)
  const promptImportRef = useRef(null)
  const backupImportRef = useRef(null)
  const [defaultsLoadOnStart, setDefaultsLoadOnStart] = useState(
    () => Boolean(readUserDefaults()?.loadOnStart),
  )
  const [historyCompareA, setHistoryCompareA] = useState(null)
  const [historyCompareB, setHistoryCompareB] = useState(null)

  function getProfessionLabel() {
    if (professionId === CUSTOM_PROFESSION_ID) {
      const custom = customProfessionLabel.trim()
      return custom || 'Inny zawód'
    }
    return profession.label
  }

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

  const weeklyPlan = useMemo(() => buildWeeklyPlan(stack), [stack])

  function showToast(message) {
    setToast(message)
  }

  function switchProfession(id) {
    const next = getProfessionById(id)
    if (!next) return
    setProfessionId(id)
    setString(STORAGE_KEYS.professionId, id)
    if (id !== CUSTOM_PROFESSION_ID) {
      setSelectedAreas(next.defaults)
      setGoal(next.goal)
      setToolsText(next.tools.join(', '))
      setProblem(next.problem)
    }
    setFormStep(1)
  }

  function updateCustomProfessionLabel(value) {
    setCustomProfessionLabel(value)
    setString(STORAGE_KEYS.customProfessionLabel, value.trim())
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
      setString(STORAGE_KEYS.geminiApiKey, '')
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
    setString(STORAGE_KEYS.geminiApiKey, trimmedKey)
    setGeminiApiKey(trimmedKey)
    setKeySaved(true)
    setStatus('Klucz Gemini zapisany lokalnie. Możesz generować stack na żywo.')
    showToast('Klucz API zapisany pomyślnie.')
  }

  function applyFormState(form) {
    setProfessionId(form.professionId)
    setString(STORAGE_KEYS.professionId, form.professionId)
    setCustomProfessionLabel(form.customProfessionLabel || '')
    setString(STORAGE_KEYS.customProfessionLabel, (form.customProfessionLabel || '').trim())
    setLevel(form.level)
    setGoal(form.goal)
    setSelectedAreas(form.selectedAreas)
    setToolsText(form.toolsText)
    setProblem(form.problem)
    setFormStep(1)
  }

  function saveCurrentAsDefaults() {
    const payload = buildDefaultsPayload(
      {
        professionId,
        customProfessionLabel,
        level,
        goal,
        problem,
        toolsText,
        selectedAreas,
      },
      defaultsLoadOnStart,
    )
    saveUserDefaults(payload)
    showToast('Domyślne ustawienia zapisane.')
  }

  function applySavedDefaults() {
    const prefs = readUserDefaults()
    if (!prefs?.form) {
      showToast('Brak zapisanych domyślnych ustawień.')
      return
    }
    applyFormState(prefs.form)
    showToast('Wczytano domyślne ustawienia formularza.')
  }

  function handleDefaultsLoadOnStart(checked) {
    setDefaultsLoadOnStart(checked)
    const prefs = readUserDefaults()
    const form =
      prefs?.form ?? {
        professionId,
        customProfessionLabel,
        level,
        goal,
        problem,
        toolsText,
        selectedAreas,
      }
    saveUserDefaults(buildDefaultsPayload(form, checked))
    if (checked && !prefs?.form) {
      showToast('Zapisano bieżące ustawienia jako domyślne.')
    }
  }

  function restoreHistoryEntry(item) {
    if (!item.stack?.length) {
      showToast('Ten wpis nie ma zapisanego stacka.')
      return
    }
    setStack(item.stack)
    setSummary(item.summary || summary)
    if (item.meta) {
      setStackMeta(item.meta)
      setJson(STORAGE_KEYS.stackMeta, item.meta)
    }
    setJson(STORAGE_KEYS.stack, item.stack)
    setWeeklyPlanDone([])
    setJson(STORAGE_KEYS.weeklyPlanDone, [])
    setActiveView('stack')
    showToast('Stack wczytany z historii.')
  }

  function persistStack(nextStack, nextSummary, meta) {
    const historyItem = {
      id: uniqueId(),
      date: new Date().toLocaleString('pl-PL'),
      profession: getProfessionLabel(),
      professionId,
      level,
      goal,
      problem,
      areas: selectedAreas,
      count: nextStack.length,
      source: meta?.source,
      stack: nextStack,
      summary: nextSummary,
      meta: meta || stackMeta,
    }
    const nextHistory = [historyItem, ...history].slice(0, 20)
    setStack(nextStack)
    setSummary(nextSummary)
    setHistory(nextHistory)
    if (meta) {
      setStackMeta(meta)
      setJson(STORAGE_KEYS.stackMeta, meta)
    }
    setJson(STORAGE_KEYS.stack, nextStack)
    setJson(STORAGE_KEYS.stackHistory, nextHistory)
    setWeeklyPlanDone([])
    setJson(STORAGE_KEYS.weeklyPlanDone, [])
  }

  function validateBeforeGenerate() {
    if (professionId === CUSTOM_PROFESSION_ID && !customProfessionLabel.trim()) {
      showToast('Wpisz nazwę swojego zawodu.')
      setFormStep(1)
      return false
    }
    return true
  }

  function quickGenerateStack() {
    if (!validateBeforeGenerate()) return
    setFormStep(3)
    generateStack()
  }

  function exportStackPdf() {
    if (!stack.length) {
      showToast('Najpierw wygeneruj stack.')
      return
    }
    try {
      printStackReport({
        profession: getProfessionLabel(),
        level,
        stack,
        summary,
        stackMeta,
        weeklyPlan,
      })
      showToast('Otwarto widok druku — wybierz „Zapisz jako PDF”.')
    } catch (error) {
      showToast(error.message)
    }
  }

  function toggleWeeklyPlanDay(dayId) {
    const next = weeklyPlanDone.includes(dayId)
      ? weeklyPlanDone.filter((id) => id !== dayId)
      : [...weeklyPlanDone, dayId]
    setWeeklyPlanDone(next)
    setJson(STORAGE_KEYS.weeklyPlanDone, next)
    if (!weeklyPlanDone.includes(dayId)) showToast('Dzień planu oznaczony jako zrobiony.')
  }

  function completeOnboarding() {
    setString(STORAGE_KEYS.onboardingCompleted, '1')
    setShowOnboarding(false)
  }

  async function generateStack() {
    if (!validateBeforeGenerate()) return

    setIsLoading(true)
    setStatus('Gemini układa spersonalizowany AI Stack…')
    const hasApiKey = Boolean(geminiApiKey.trim())

    try {
      const { payload } = await requestStackGeneration({
        profession: getProfessionLabel(),
        level,
        goal,
        areas: selectedAreas,
        currentTools,
        problem,
        geminiApiKey: geminiApiKey.trim(),
      })

      const nextStack = payload.stack?.length ? payload.stack : fallbackStack
      const nextSummary = payload.summary || summary
      const meta = payload.meta || { source: 'demo', reason: 'missing-key' }
      const { status: nextStatus, toast } = describeStackStatus(payload, hasApiKey)

      persistStack(nextStack, nextSummary, meta)
      setStatus(nextStatus)
      setActiveView('stack')
      showToast(toast)
    } catch (error) {
      const meta = { source: 'demo', reason: 'network-error' }
      persistStack(fallbackStack, summary, meta)
      setStatus('Błąd połączenia z serwerem. Pokazuję bezpieczny stack demo.')
      showToast(`Błąd: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  function exportStack() {
    const data = {
      version: 2,
      exportedAt: new Date().toISOString(),
      profession: getProfessionLabel(),
      professionId,
      level,
      stack,
      summary,
      meta: stackMeta,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-stack-${profession.id}-${uniqueId()}.json`
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
        const imported = data.stack.slice(0, 10)
        setStack(imported)
        setJson(STORAGE_KEYS.stack, imported)
        if (data.summary) setSummary(data.summary)
        if (data.meta) {
          setStackMeta(data.meta)
          setJson(STORAGE_KEYS.stackMeta, data.meta)
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
    setJson(STORAGE_KEYS.savedPrompts, next)
    showToast(`Zapisano: ${tool.name}`)
  }

  function deletePrompt(id) {
    const next = savedPrompts.filter((item) => item.id !== id)
    setSavedPrompts(next)
    setJson(STORAGE_KEYS.savedPrompts, next)
    showToast('Prompt usunięty.')
  }

  function saveNewPrompt() {
    if (!newPromptName.trim() || !newPromptText.trim()) {
      showToast('Uzupełnij nazwę i treść promptu.')
      return
    }
    const entry = {
      id: uniqueId(),
      name: newPromptName.trim(),
      model: newPromptModel,
      category: newPromptCat,
      prompt: newPromptText.trim(),
    }
    const next = [entry, ...savedPrompts]
    setSavedPrompts(next)
    setJson(STORAGE_KEYS.savedPrompts, next)
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
      id: uniqueId(),
      name: name || prompt.slice(0, 40),
      model: model || '',
      category: cat || '',
      prompt: prompt,
    }
    const next = [entry, ...savedPrompts]
    setSavedPrompts(next)
    setJson(STORAGE_KEYS.savedPrompts, next)
    showToast('Prompt zapisany: ' + entry.name)
  }

  function clearHistory() {
    setHistory([])
    setJson(STORAGE_KEYS.stackHistory, [])
    showToast('Historia wyczyszczona.')
  }

  function applyImportedPrompts(valid, replace) {
    if (!valid.length) {
      showToast('Nie znaleziono poprawnych promptów (wymagane: nazwa i treść).')
      return
    }

    let next
    let skipped = 0

    if (replace) {
      next = valid.map(function (p) {
        return {
          id: p.id || uniqueId(),
          name: p.name,
          model: p.model || '',
          category: p.category || '',
          prompt: p.prompt,
        }
      })
    } else {
      const existing = new Set(
        savedPrompts.map(function (p) {
          return p.name + '|' + p.prompt.slice(0, 50)
        }),
      )
      const fresh = valid.filter(function (p) {
        return !existing.has(p.name + '|' + p.prompt.slice(0, 50))
      })
      skipped = valid.length - fresh.length
      next = [
        ...fresh.map(function (p) {
          return {
            id: uniqueId(),
            name: p.name,
            model: p.model || '',
            category: p.category || '',
            prompt: p.prompt,
          }
        }),
        ...savedPrompts,
      ]
    }

    setSavedPrompts(next)
    setJson(STORAGE_KEYS.savedPrompts, next)

    if (replace) {
      showToast('Zaimportowano ' + valid.length + ' promptów (zastąpiono listę).')
    } else if (skipped > 0) {
      showToast(
        'Zaimportowano ' + (valid.length - skipped) + ' promptów. Pominięto duplikatów: ' + skipped + '.',
      )
    } else {
      showToast('Zaimportowano ' + valid.length + ' promptów.')
    }
  }

  function exportPromptsJson() {
    if (!savedPrompts.length) {
      showToast('Brak promptów do eksportu.')
      return
    }
    const data = { version: 1, exportedAt: new Date().toISOString(), prompts: savedPrompts }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ai-prompty-' + uniqueId() + '.json'
    a.click()
    URL.revokeObjectURL(a.href)
    showToast('Wyeksportowano ' + savedPrompts.length + ' promptów (JSON).')
  }

  function exportPromptsCsv() {
    if (!savedPrompts.length) {
      showToast('Brak promptów do eksportu.')
      return
    }
    const csv = serializePromptbaseCsv(savedPrompts)
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    downloadTextFile('biblioteka-promptow-' + stamp + '.csv', csv)
    showToast('Wyeksportowano ' + savedPrompts.length + ' promptów (CSV PrompBase).')
  }

  function importPrompts(file) {
    const reader = new FileReader()
    const isCsv = /\.csv$/i.test(file.name)

    reader.onload = function (e) {
      try {
        let valid = []

        if (isCsv) {
          valid = parsePromptbaseCsv(e.target.result)
        } else {
          const data = JSON.parse(e.target.result)
          const list = Array.isArray(data.prompts) ? data.prompts : Array.isArray(data) ? data : null
          if (!list) {
            showToast('Nieprawidłowy plik — brak promptów.')
            return
          }
          valid = list
            .filter(function (p) {
              return p.name && p.prompt
            })
            .map(function (p) {
              return {
                id: p.id,
                name: p.name,
                model: p.model || '',
                category: p.category || '',
                prompt: p.prompt,
              }
            })
        }

        if (!valid.length) {
          showToast('Nie znaleziono poprawnych promptów w pliku.')
          return
        }

        if (
          !window.confirm('Znaleziono ' + valid.length + ' promptów. Kontynuować import?')
        ) {
          return
        }

        const replace = window.confirm(
          'OK — dopisz nowe prompty do listy\n\nAnuluj — zastąp całą listę zapisanych promptów',
        )
        applyImportedPrompts(valid, !replace)
      } catch {
        showToast(isCsv ? 'Błąd odczytu pliku CSV.' : 'Błąd odczytu pliku JSON.')
      }
    }
    reader.readAsText(file, 'utf-8')
  }

  function resetAllData() {
    clearAppData()
    window.location.reload()
  }

  function exportBackup() {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-w-twoim-zawodzie-backup-${uniqueId()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Backup wyeksportowany.')
  }

  function importBackup(file) {
    const reader = new FileReader()
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result)
        importAllData(data)
        showToast('Backup zaimportowany. Odświeżam aplikację…')
        setTimeout(function () {
          window.location.reload()
        }, 800)
      } catch (err) {
        showToast(err.message || 'Błąd importu backupu.')
      }
    }
    reader.readAsText(file)
  }

  function toggleLesson(lessonId) {
    const next = completedLessons.includes(lessonId)
      ? completedLessons.filter(function(id) { return id !== lessonId })
      : [...completedLessons, lessonId]
    setCompletedLessons(next)
    setJson(STORAGE_KEYS.completedLessons, next)
    if (!completedLessons.includes(lessonId)) showToast('Lekcja ukończona!')
  }

  function toggleInspiration(id) {
    const next = doneInspirations.includes(id)
      ? doneInspirations.filter(function(x) { return x !== id })
      : [...doneInspirations, id]
    setDoneInspirations(next)
    setJson(STORAGE_KEYS.doneInspirations, next)
    if (!doneInspirations.includes(id)) showToast('Wyzwanie zaliczone!')
  }

  function addProject() {
    const name = projectName.trim()
    if (!name) return
    const next = [
      { id: uniqueId(), name, profession: getProfessionLabel(), status: 'Nowy' },
      ...projects,
    ]
    setProjects(next)
    setProjectName('')
    setJson(STORAGE_KEYS.projects, next)
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
          {professionId === CUSTOM_PROFESSION_ID && (
            <label className="wide-field">
              <span>Twój zawód / rola</span>
              <input
                type="text"
                maxLength={60}
                placeholder="np. Architekt wnętrz, fryzjer, trener personalny"
                value={customProfessionLabel}
                onChange={(e) => updateCustomProfessionLabel(e.target.value)}
              />
            </label>
          )}
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
              Wklej klucz raz — zostaje tylko na tym komputerze (localStorage). Pobierzesz go w{' '}
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
        <div className="quick-generate-bar">
          <div>
            <strong>Szybki start</strong>
            <p>
              Wygeneruj stack od razu z ustawień: <b>{getProfessionLabel()}</b> · {level}
            </p>
          </div>
          <button
            type="button"
            className="primary quick-generate-btn"
            disabled={isLoading}
            onClick={quickGenerateStack}
          >
            {isLoading ? <Loader2 className="spin" size={18} /> : <Zap size={18} />}
            Szybki stack
          </button>
        </div>

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
            <div className="panel-status-row">
              <span>{status}</span>
              {stack.length > 0 && <StackSourceBadge meta={stackMeta} />}
            </div>
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
              Dopasowany do: <b>{getProfessionLabel()}</b> · Poziom: <b>{level}</b>
            </p>
            <StackSourceBadge meta={stackMeta} />
          </div>
          <div className="stack-export-btns">
            <button type="button" onClick={exportStackPdf} title="Drukuj lub zapisz jako PDF">
              <FileText size={17} />
              PDF
            </button>
            <button type="button" onClick={exportStack}>
              <Download size={17} />
              JSON
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

        {stack.length > 0 && (
          <WeeklyPlanPanel
            plan={weeklyPlan}
            doneIds={weeklyPlanDone}
            onToggleDay={toggleWeeklyPlanDay}
            onCopyPrompt={copyPromptText}
          />
        )}
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

  function renderPrompts() {
    const stackModelNames = stack.map(function(t) { return t.name })

    return (
      <section className="view-panel">
        <div className="panel-heading">
          <div>
            <h2>Zapisane prompty</h2>
            <p>
              {savedPrompts.length} zapisanych promptów · import/eksport CSV zgodny z{' '}
              <strong>PrompBase</strong>
            </p>
          </div>
          <div className="prompt-header-actions">
            <button type="button" className="btn-add-prompt" onClick={() => setPromptFormOpen(function(v) { return !v })}>
              <Plus size={16} /> {promptFormOpen ? 'Anuluj' : 'Nowy prompt'}
            </button>
            <button type="button" className="btn-export-prompts" onClick={exportPromptsJson} title="Eksport JSON (ta aplikacja)">
              <Download size={15} /> JSON
            </button>
            <button type="button" className="btn-export-prompts" onClick={exportPromptsCsv} title="Eksport CSV do PrompBase">
              <Download size={15} /> CSV
            </button>
            <button type="button" className="btn-export-prompts" onClick={function() { promptImportRef.current && promptImportRef.current.click() }} title="Import JSON lub CSV (PrompBase)">
              <Save size={15} /> Importuj
            </button>
            <input ref={promptImportRef} type="file" accept=".json,.csv,application/json,text/csv" style={{display:'none'}} onChange={function(e){ if(e.target.files&&e.target.files[0]){importPrompts(e.target.files[0]);e.target.value=''} }} />
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
    if (activeView === 'history') {
      return (
        <HistoryView
          history={history}
          compareSlotA={historyCompareA}
          compareSlotB={historyCompareB}
          onSelectCompare={function (a, b) {
            setHistoryCompareA(a)
            setHistoryCompareB(b)
          }}
          onClearCompare={function () {
            setHistoryCompareA(null)
            setHistoryCompareB(null)
          }}
          onRestore={restoreHistoryEntry}
          onClearHistory={clearHistory}
        />
      )
    }
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
      {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}
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
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
              title={isDark ? 'Jasny motyw' : 'Ciemny motyw'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="profile-wrapper">
              <button className="profile" type="button" onClick={function(){ setProfileOpen(function(o){ return !o }) }}>
                {initials} <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <label className="profile-label">Twoje imie</label>
                  <input
                    className="profile-input"
                    type="text"
                    value={userName}
                    placeholder="np. Jan Kowalski"
                    onChange={function (e) {
                      setUserName(e.target.value)
                      setString(STORAGE_KEYS.userName, e.target.value)
                    }}
                  />
                  <p className="profile-hint">Klucz API jest zapisywany tylko lokalnie w tej przeglądarce.</p>

                  <ProfileDefaults
                    professionId={professionId}
                    professions={professions}
                    customProfessionId={CUSTOM_PROFESSION_ID}
                    customProfessionLabel={customProfessionLabel}
                    level={level}
                    goal={goal}
                    problem={problem}
                    toolsText={toolsText}
                    selectedAreas={selectedAreas}
                    loadOnStart={defaultsLoadOnStart}
                    onLoadOnStartChange={handleDefaultsLoadOnStart}
                    onSaveDefaults={saveCurrentAsDefaults}
                    onApplyDefaults={applySavedDefaults}
                  />

                  <hr className="profile-divider" />

                  <button type="button" className="ghost profile-backup-btn" onClick={exportBackup}>
                    <Download size={13} /> Eksportuj backup danych
                  </button>
                  <button
                    type="button"
                    className="ghost profile-backup-btn"
                    onClick={function () {
                      backupImportRef.current?.click()
                    }}
                  >
                    <Save size={13} /> Importuj backup
                  </button>
                  <input
                    ref={backupImportRef}
                    type="file"
                    accept=".json,application/json"
                    className="visually-hidden"
                    onChange={function (e) {
                      if (e.target.files?.[0]) {
                        importBackup(e.target.files[0])
                        e.target.value = ''
                      }
                    }}
                  />
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
