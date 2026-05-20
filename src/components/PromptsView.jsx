import { useState } from 'react'
import { Check, Copy, Plus, Trash2 } from 'lucide-react'

const APPLICATIONS = [
  'Tekst',
  'Grafika',
  'Wideo',
  'Audio',
  'Research',
  'Social media',
  'E-mail',
  'Kod',
  'Inne',
]

export default function PromptsView({ savedPrompts, stack, onAddPrompt, onDeletePrompt }) {
  const [name, setName] = useState('')
  const [promptText, setPromptText] = useState('')
  const [model, setModel] = useState('')
  const [application, setApplication] = useState('')
  const [copied, setCopied] = useState(null)

  // Unique model names from the current stack
  const modelOptions = [...new Set(stack.map((t) => t.name))]

  function handleAdd() {
    const trimName = name.trim()
    const trimPrompt = promptText.trim()
    if (!trimName || !trimPrompt) return
    onAddPrompt({
      id: Date.now(),
      name: trimName,
      category: application || 'Inne',
      model: model || '',
      prompt: trimPrompt,
    })
    setName('')
    setPromptText('')
    setModel('')
    setApplication('')
  }

  function copyPrompt(prompt, id) {
    navigator.clipboard?.writeText(prompt)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section className="view-panel">
      <h2>Zapisane prompty</h2>

      {/* ── Formularz nowego promptu ── */}
      <div className="prompt-add-form">
        <h3>Dodaj nowy prompt</h3>

        <label className="wide-field">
          <span>Nazwa</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Np. Opis produktu sezonowy, Post na LinkedIn…"
          />
        </label>

        <div className="prompt-selects">
          <label>
            <span>Model AI</span>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="">– wybierz model –</option>
              {modelOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Zastosowanie</span>
            <select value={application} onChange={(e) => setApplication(e.target.value)}>
              <option value="">– wybierz –</option>
              {APPLICATIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="wide-field">
          <span>Treść promptu</span>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Wpisz gotowy prompt do użycia w AI…"
            rows={4}
          />
        </label>

        <button
          type="button"
          className="prompt-add-btn"
          onClick={handleAdd}
          disabled={!name.trim() || !promptText.trim()}
        >
          <Plus size={16} />
          Zapisz prompt
        </button>
      </div>

      {/* ── Lista zapisanych promptów ── */}
      <div className="prompt-grid">
        {savedPrompts.length ? (
          savedPrompts.map((item) => (
            <article className="prompt-card" key={item.id}>
              <div className="prompt-card-header">
                <strong>{item.name}</strong>
                <span>{item.category}</span>
              </div>

              {item.model && (
                <p className="prompt-model-tag">
                  Model: <b>{item.model}</b>
                </p>
              )}

              <p className="prompt-text">{item.prompt}</p>

              <div className="prompt-card-actions">
                <button
                  type="button"
                  className="prompt-copy-btn"
                  onClick={() => copyPrompt(item.prompt, item.id)}
                  title="Kopiuj treść promptu"
                >
                  {copied === item.id ? <Check size={15} /> : <Copy size={15} />}
                  {copied === item.id ? 'Skopiowano!' : 'Kopiuj prompt'}
                </button>
                <button
                  type="button"
                  className="prompt-delete-btn"
                  onClick={() => onDeletePrompt(item.id)}
                  title="Usuń prompt"
                >
                  <Trash2 size={15} />
                  Usuń
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="prompts-empty">
            Brak zapisanych promptów. Użyj formularza powyżej lub kliknij ikonę dyskietki przy
            narzędziu w stacku.
          </p>
        )}
      </div>
    </section>
  )
}
