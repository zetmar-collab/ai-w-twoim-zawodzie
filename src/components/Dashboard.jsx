import { useState } from 'react'
import { Check, Loader2, RefreshCcw, Sparkles } from 'lucide-react'
import StackPanel from './StackPanel'

const STEPS = ['O Tobie', 'Twoja praca', 'Preferencje']

export default function Dashboard({
  profession,
  professionId,
  professions,
  level,
  selectedAreas,
  goal,
  toolsText,
  problem,
  geminiApiKey,
  keySaved,
  status,
  isLoading,
  stack,
  summary,
  areas,
  onSwitchProfession,
  onSetLevel,
  onToggleArea,
  onSetGoal,
  onSetToolsText,
  onSetProblem,
  onSetGeminiApiKey,
  onSaveGeminiApiKey,
  onGenerate,
  onExport,
  onImport,
  onSavePrompt,
}) {
  const [step, setStep] = useState(1)

  function handleSubmit(event) {
    event.preventDefault()
    if (step < 3) {
      setStep((s) => s + 1)
    } else {
      onGenerate()
    }
  }

  return (
    <section className="content-grid">
      <form className="builder-panel" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <div>
            <h2>Stwórz swój spersonalizowany AI Stack</h2>
            <p>Uzupełnij dane, wybierz obszary i wygeneruj gotowe workflow.</p>
          </div>
          <span>{status}</span>
        </div>

        <div className="steps" aria-label="Postęp formularza">
          {STEPS.map((label, index) => (
            <div
              key={label}
              className={step === index + 1 ? 'active' : step > index + 1 ? 'done' : ''}
            >
              <b>{step > index + 1 ? <Check size={14} /> : index + 1}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="form-section">
            <h3>1. Kilka słów o Tobie</h3>
            <p>Wybierz zawód i poziom zaawansowania z narzędzi AI.</p>

            <div className="field-grid">
              <label>
                <span>Jaką rolę pełnisz?</span>
                <select value={professionId} onChange={(e) => onSwitchProfession(e.target.value)}>
                  {professions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Poziom zaawansowania z AI</span>
                <select value={level} onChange={(e) => onSetLevel(e.target.value)}>
                  <option>Początkujący</option>
                  <option>Średni</option>
                  <option>Zaawansowany</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <h3>2. Twoja praca</h3>
            <p>Powiedz, czym się zajmujesz i jakich obszarów dotyczy Twoja praca.</p>

            <label className="wide-field">
              <span>Cel główny</span>
              <input value={goal} onChange={(e) => onSetGoal(e.target.value)} />
            </label>

            <div className="area-group">
              <span>Z jakich obszarów chcesz korzystać z AI? Wybierz do 3</span>
              <div>
                {areas.map((area) => (
                  <button
                    className={selectedAreas.includes(area) ? 'selected' : ''}
                    key={area}
                    type="button"
                    onClick={() => onToggleArea(area)}
                  >
                    {area}
                    {selectedAreas.includes(area) && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <label className="wide-field">
              <span>Z jakich narzędzi korzystasz na co dzień?</span>
              <input value={toolsText} onChange={(e) => onSetToolsText(e.target.value)} />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <h3>3. Preferencje i klucz API</h3>
            <p>Opisz największą potrzebę i opcjonalnie wpisz klucz Gemini do generowania na żywo.</p>

            <label className="wide-field">
              <span>Czego najbardziej potrzebujesz od AI?</span>
              <textarea
                maxLength={420}
                value={problem}
                onChange={(e) => onSetProblem(e.target.value)}
              />
              <small>{problem.length} / 420</small>
            </label>

            <section className="api-key-panel" aria-label="Klucz Gemini API">
              <div>
                <strong>Klucz Gemini API</strong>
                <p>
                  Wklej klucz raz i zapisz go lokalnie. Możesz go pobrać w{' '}
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
                  placeholder="AIza..."
                  value={geminiApiKey}
                  onChange={(e) => onSetGeminiApiKey(e.target.value)}
                />
              </label>
              <button type="button" onClick={onSaveGeminiApiKey}>
                <Check size={16} />
                {keySaved ? 'Zapisano' : 'Zapisz klucz'}
              </button>
            </section>
          </div>
        )}

        <div className="form-actions">
          <div className="step-nav">
            {step > 1 ? (
              <button type="button" className="ghost" onClick={() => setStep((s) => s - 1)}>
                ← Wstecz
              </button>
            ) : (
              <button type="button" className="ghost" onClick={() => onSwitchProfession(professionId)}>
                <RefreshCcw size={17} />
                Przywróć preset
              </button>
            )}
          </div>

          {step < 3 ? (
            <button className="primary" type="submit">
              Następny krok →
            </button>
          ) : (
            <button className="primary" disabled={isLoading} type="submit">
              {isLoading ? <Loader2 className="spin" size={18} /> : <Sparkles size={18} />}
              Wygeneruj stack
            </button>
          )}
        </div>
      </form>

      <StackPanel
        stack={stack}
        summary={summary}
        profession={profession.label}
        level={level}
        compact
        onExport={onExport}
        onImport={onImport}
        onSavePrompt={onSavePrompt}
      />
    </section>
  )
}
