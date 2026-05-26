export function describeStackStatus(payload, hasApiKey) {
  const meta = payload?.meta || { source: 'demo', reason: 'missing-key' }

  if (meta.source === 'gemini') {
    return {
      meta,
      status: 'Wygenerowano przez Gemini API.',
      toast: 'Stack wygenerowany przez Gemini.',
    }
  }

  if (meta.reason === 'rate-limited') {
    return {
      meta,
      status: 'Limit zapytań (5/min). Poczekaj chwilę — pokazuję stack demo.',
      toast: 'Limit API — spróbuj za minutę.',
    }
  }

  if (meta.reason === 'gemini-error') {
    return {
      meta,
      status: 'Błąd Gemini API. Sprawdź klucz — pokazuję stack demo.',
      toast: payload?.error || 'Błąd Gemini — tryb demo.',
    }
  }

  if (!hasApiKey) {
    return {
      meta,
      status: 'Tryb demo — dodaj klucz Gemini, aby generować na żywo.',
      toast: 'Stack demo (brak klucza API).',
    }
  }

  return {
    meta,
    status: 'Tryb demo — odpowiedź z przykładowego stacka.',
    toast: 'Stack demo.',
  }
}

export async function requestStackGeneration(body) {
  const response = await fetch('/api/generate-stack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  let payload
  try {
    payload = await response.json()
  } catch {
    payload = {}
  }

  if (!response.ok && !payload.stack?.length) {
    const message = payload.error || 'Nie udało się wygenerować stacka.'
    throw new Error(message)
  }

  return { response, payload }
}
