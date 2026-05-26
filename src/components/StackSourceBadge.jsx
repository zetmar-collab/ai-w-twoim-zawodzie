const REASON_LABELS = {
  'missing-key': 'Brak klucza API',
  'gemini-error': 'Błąd API',
  'rate-limited': 'Limit zapytań',
}

export default function StackSourceBadge({ meta }) {
  if (!meta?.source) return null

  const isGemini = meta.source === 'gemini'
  const className = `stack-source-badge ${isGemini ? 'gemini' : 'demo'}`
  const label = isGemini ? 'Gemini' : 'Demo'
  const reason = !isGemini && meta.reason ? REASON_LABELS[meta.reason] || meta.reason : null
  const title = isGemini
    ? 'Stack wygenerowany przez Gemini API'
    : `Stack przykładowy${reason ? ` (${reason})` : ''}`

  return (
    <span className={className} title={title}>
      {label}
      {reason ? <small>{reason}</small> : null}
    </span>
  )
}
