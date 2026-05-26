function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sourceLabel(meta) {
  if (meta?.source === 'gemini') return 'Gemini API'
  if (meta?.reason === 'rate-limited') return 'Demo (limit zapytań)'
  if (meta?.reason === 'gemini-error') return 'Demo (błąd API)'
  return 'Demo / przykład'
}

export function printStackReport({ profession, level, stack, summary, stackMeta, weeklyPlan }) {
  const stackRows = (stack || [])
    .map(
      (tool, index) => `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${escapeHtml(tool.name)}</strong><br><small>${escapeHtml(tool.category)}</small></td>
        <td>${escapeHtml(tool.value)}</td>
      </tr>`,
    )
    .join('')

  const planRows = (weeklyPlan || [])
    .map(
      (day) => `
      <tr>
        <td><strong>${escapeHtml(day.day)}</strong></td>
        <td>${escapeHtml(day.toolName)}</td>
        <td>${escapeHtml(day.action)}</td>
        <td><pre class="prompt">${escapeHtml(day.prompt)}</pre></td>
      </tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <title>AI Stack — ${escapeHtml(profession)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family:Segoe UI,Arial,sans-serif;color:#1a2e24;margin:24px;line-height:1.45;font-size:13px; }
    h1 { font-size:22px;color:#0d6b45;margin:0 0 6px; }
    h2 { font-size:16px;color:#0d6b45;margin:28px 0 10px;border-bottom:2px solid #d9efe5;padding-bottom:6px; }
    .meta { color:#5a7268;margin-bottom:20px; }
    table { width:100%;border-collapse:collapse;margin-bottom:12px; }
    th,td { border:1px solid #cfe8d8;padding:8px 10px;text-align:left;vertical-align:top; }
    th { background:#ecfbf4;color:#0d6b45; }
    pre.prompt { white-space:pre-wrap;font-family:inherit;font-size:11px;margin:0;max-height:120px;overflow:hidden; }
    .metrics { display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0; }
    .metric { border:1px solid #cfe8d8;border-radius:8px;padding:10px;background:#f8fefa; }
    .metric strong { display:block;font-size:18px;color:#0d6b45; }
    .disclaimer { font-size:11px;color:#5a7268;margin-top:24px; }
    @media print { body { margin:12mm; } }
  </style>
</head>
<body>
  <h1>AI w Twoim Zawodzie — plan wdrożenia</h1>
  <p class="meta">
    Zawód: <strong>${escapeHtml(profession)}</strong> · Poziom: <strong>${escapeHtml(level)}</strong> ·
    Źródło stacka: <strong>${escapeHtml(sourceLabel(stackMeta))}</strong> ·
    Data: ${escapeHtml(new Date().toLocaleString('pl-PL'))}
  </p>

  <div class="metrics">
    <div class="metric"><span>Oszczędność</span><strong>${escapeHtml(summary?.weeklyHours || '—')}</strong></div>
    <div class="metric"><span>Wydajność</span><strong>${escapeHtml(summary?.productivity || '—')}</strong></div>
    <div class="metric"><span>Zwrot</span><strong>${escapeHtml(summary?.monthlyValue || '—')}</strong></div>
    <div class="metric"><span>Dopasowanie</span><strong>${escapeHtml(summary?.fit || '—')}</strong></div>
  </div>

  <h2>Twój AI Stack (${(stack || []).length} narzędzi)</h2>
  <table>
    <thead><tr><th>#</th><th>Narzędzie</th><th>Co daje</th></tr></thead>
    <tbody>${stackRows || '<tr><td colspan="3">Brak stacka</td></tr>'}</tbody>
  </table>

  <h2>Plan na 7 dni</h2>
  <table>
    <thead><tr><th>Dzień</th><th>Narzędzie</th><th>Zadanie</th><th>Prompt</th></tr></thead>
    <tbody>${planRows || '<tr><td colspan="4">Wygeneruj stack, aby zobaczyć plan.</td></tr>'}</tbody>
  </table>

  <p class="disclaimer">
    Wygenerowano w aplikacji „AI w Twoim Zawodzie” (Cyfrowy Przyjaciel).
    Metryki są szacunkowe i nie stanowią gwarancji wyników.
  </p>
</body>
</html>`

  const win = window.open('', '_blank', 'noopener,noreferrer')
  if (!win) {
    throw new Error('Zezwól na wyskakujące okna, aby zapisać PDF (Drukuj → Zapisz jako PDF).')
  }
  win.document.open()
  win.document.write(html)
  win.document.close()
  win.focus()
  window.setTimeout(() => {
    win.print()
  }, 450)
}
