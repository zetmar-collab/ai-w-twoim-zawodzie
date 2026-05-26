/**
 * Import / eksport CSV zgodny z PrompBase (Python desktop + PWA).
 * Kolumny: Nazwa, Status, Format, Model AI, Zastosowanie, Tagi, Data Utworzenia, Komentarz, Treść Promptu
 */

export const PROMPTBASE_CSV_HEADERS = [
  'Nazwa',
  'Status',
  'Format',
  'Model AI',
  'Zastosowanie',
  'Tagi',
  'Data Utworzenia',
  'Komentarz',
  'Treść Promptu',
]

const COLUMN_MAP = {
  nazwa: 'name',
  name: 'name',
  status: 'status',
  format: 'format',
  'model ai': 'model',
  model: 'model',
  zastosowanie: 'zastosowanie',
  tagi: 'tags',
  tags: 'tags',
  komentarz: 'comment',
  'komentarz / wskazówka': 'comment',
  'komentarz / wskazowka': 'comment',
  comment: 'comment',
  'treść promptu': 'content',
  'tresc promptu': 'content',
  treść: 'content',
  tresc: 'content',
  content: 'content',
  'data utworzenia': 'createdStr',
}

const NEWLINE_PLACEHOLDER = ' ↵ '

function detectDelimiter(firstLine) {
  const semicolons = (firstLine.match(/;/g) || []).length
  const commas = (firstLine.match(/,/g) || []).length
  return semicolons > commas ? ';' : ','
}

function parseCsvRows(text, delimiter) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        cell += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
    } else if (ch === delimiter) {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
      row.push(cell)
      if (row.some((c) => c.length > 0)) rows.push(row)
      row = []
      cell = ''
      if (ch === '\r') i++
    } else if (ch === '\r') {
      row.push(cell)
      if (row.some((c) => c.length > 0)) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += ch
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    if (row.some((c) => c.length > 0)) rows.push(row)
  }

  return rows
}

function normalizeRow(headers, values) {
  const normalized = {}
  headers.forEach((header, index) => {
    const mapped = COLUMN_MAP[(header || '').toLowerCase().trim()]
    if (mapped) normalized[mapped] = (values[index] || '').trim()
  })
  return normalized
}

function formatToCategory(format) {
  const f = (format || '').toLowerCase()
  if (f === 'kod') return 'Kod'
  if (f.includes('zdj') || f.includes('screen') || f.includes('obraz')) return 'Grafika'
  return ''
}

function categoryToFormat(category) {
  const c = (category || '').toLowerCase()
  if (c.includes('graf') || c.includes('obraz') || c === 'grafika') return 'zdjecie/screen'
  if (c.includes('kod')) return 'kod'
  return 'tekst'
}

function formatExportDate(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function escapeCsvCell(value) {
  const s = String(value ?? '')
  if (/[",\n\r;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function contentForCsv(text) {
  return String(text || '').replace(/\r\n/g, '\n').replace(/\n/g, NEWLINE_PLACEHOLDER)
}

function contentFromCsv(text) {
  return String(text || '').replace(/ ↵ /g, '\n')
}

/**
 * @param {string} text — surowy plik CSV (UTF-8 / UTF-8-BOM)
 * @returns {{ name: string, model: string, category: string, prompt: string }[]}
 */
export function parsePromptbaseCsv(text) {
  const cleaned = String(text || '').replace(/^\uFEFF/, '')
  const lines = cleaned.split(/\r?\n/).filter((line, index, all) => index < all.length - 1 || line.trim())
  if (!lines.length) return []

  const delimiter = detectDelimiter(lines[0])
  const rows = parseCsvRows(cleaned, delimiter)
  if (rows.length < 2) return []

  const headers = rows[0]
  const prompts = []

  for (let r = 1; r < rows.length; r++) {
    const normalized = normalizeRow(headers, rows[r])
    const content = contentFromCsv(normalized.content)
    if (!content) continue

    const zastosowanie = normalized.zastosowanie || ''
    const tags = normalized.tags || ''
    const category =
      zastosowanie ||
      formatToCategory(normalized.format) ||
      (tags ? tags.split(',')[0].trim() : '')

    prompts.push({
      name: normalized.name || content.slice(0, 60),
      model: normalized.model || '',
      category,
      prompt: content,
    })
  }

  return prompts
}

/**
 * @param {{ name: string, model?: string, category?: string, prompt: string }[]} prompts
 * @returns {string}
 */
export function serializePromptbaseCsv(prompts) {
  const lines = [PROMPTBASE_CSV_HEADERS.map(escapeCsvCell).join(',')]

  for (const item of prompts) {
    const row = [
      item.name || '',
      'Uniwersalne',
      categoryToFormat(item.category),
      item.model || '',
      item.category || '',
      'ai-w-twoim-zawodzie',
      formatExportDate(),
      'Eksport z AI w Twoim Zawodzie',
      contentForCsv(item.prompt),
    ]
    lines.push(row.map(escapeCsvCell).join(','))
  }

  return lines.join('\r\n')
}

export function downloadTextFile(filename, text, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\uFEFF', text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
