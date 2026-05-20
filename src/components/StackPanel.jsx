import { useRef } from 'react'
import {
  BriefcaseBusiness,
  Camera,
  Check,
  Download,
  ExternalLink,
  FileText,
  MessageSquareText,
  Save,
  Search,
  Sparkles,
  Target,
  Upload,
  WandSparkles,
} from 'lucide-react'

const toolIcons = [MessageSquareText, Camera, WandSparkles, Search, FileText, Target]

function buildPromptUrl(tool) {
  if (tool.url?.includes('gemini.google.com')) {
    return `https://gemini.google.com/app?text=${encodeURIComponent(tool.prompt || '')}`
  }
  return tool.url || 'https://gemini.google.com/'
}

export default function StackPanel({
  stack,
  summary,
  profession,
  level,
  compact = false,
  onExport,
  onImport,
  onSavePrompt,
}) {
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
      // Reset input so the same file can be re-imported if needed
      e.target.value = ''
    }
  }

  return (
    <section className={`stack-panel ${compact ? '' : 'wide-panel'}`}>
      <div className="panel-heading result-heading">
        <div>
          <h2>Twój wygenerowany AI Stack</h2>
          <p>
            Dopasowany do: <b>{profession}</b> · Poziom: <b>{level}</b>
          </p>
        </div>
        <div className="stack-actions">
          <button type="button" className="stack-action-btn" onClick={onExport} title="Pobierz stack jako plik JSON">
            <Download size={16} />
            Eksportuj
          </button>
          <button
            type="button"
            className="stack-action-btn stack-action-import"
            onClick={() => fileInputRef.current?.click()}
            title="Wczytaj stack z pliku JSON"
          >
            <Upload size={16} />
            Importuj
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="visually-hidden"
            onChange={handleFileChange}
            aria-label="Importuj stack z pliku JSON"
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
                onClick={() => onSavePrompt(tool)}
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
          <span>Zaoszczędzisz</span>
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
    </section>
  )
}
