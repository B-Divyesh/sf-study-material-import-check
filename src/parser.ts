export type Delimiter = ',' | '\t' | ';' | '|'

export type ParsedMaterial = {
  rows: string[][]
  delimiter: Delimiter
  delimiterLabel: string
  maxColumns: number
  warnings: string[]
}

const delimiterLabels: Record<Delimiter, string> = {
  ',': 'comma',
  '\t': 'tab',
  ';': 'semicolon',
  '|': 'pipe',
}

function countOutsideQuotes(line: string, delimiter: Delimiter): number {
  let count = 0
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    if (line[i] === '"') {
      if (quoted && line[i + 1] === '"') i += 1
      else quoted = !quoted
    } else if (!quoted && line[i] === delimiter) count += 1
  }
  return count
}

export function detectDelimiter(input: string): Delimiter {
  const lines = input.split(/\r?\n/).filter((line) => line.trim()).slice(0, 8)
  const options: Delimiter[] = ['\t', ',', ';', '|']
  const scores = options.map((delimiter) => {
    const counts = lines.map((line) => countOutsideQuotes(line, delimiter))
    const positive = counts.filter(Boolean)
    const consistency = positive.length > 1 && positive.every((count) => count === positive[0]) ? 4 : 0
    return { delimiter, score: positive.reduce((a, b) => a + b, 0) + consistency }
  })
  scores.sort((a, b) => b.score - a.score)
  return scores[0].score > 0 ? scores[0].delimiter : '\t'
}

export function parseMaterial(input: string, selected?: Delimiter): ParsedMaterial {
  let normalized = input.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  let delimiter = selected ?? detectDelimiter(normalized)
  const plainLines = normalized.split('\n').filter((line) => line.trim())
  if (!selected && delimiter === '\t' && !normalized.includes('\t') && plainLines.length && plainLines.every((line) => line.includes('::'))) {
    normalized = normalized.replaceAll('::', '|')
    delimiter = '|'
  }
  const rows: string[][] = []
  const warnings: string[] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i]
    if (char === '"') {
      if (quoted && normalized[i + 1] === '"') {
        field += '"'
        i += 1
      } else quoted = !quoted
    } else if (char === delimiter && !quoted) {
      row.push(field)
      field = ''
    } else if (char === '\n' && !quoted) {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }
  if (field.length || row.length) {
    row.push(field)
    rows.push(row)
  }
  if (quoted) warnings.push('An opening quote has no closing quote. Check the last quoted field.')

  const maxColumns = Math.max(0, ...rows.map((item) => item.length))
  return { rows, delimiter, delimiterLabel: delimiterLabels[delimiter], maxColumns, warnings }
}

export function looksLikeHeader(row: string[]): boolean {
  if (!row.length) return false
  const known = /^(front|back|question|answer|prompt|response|term|definition|hint|note|media|image|audio|tags?)$/i
  return row.filter((value) => known.test(value.trim())).length >= Math.min(2, row.length)
}

export function sanitizeFormula(value: string): string {
  return /^[=+@-]/.test(value.trimStart()) ? `'${value}` : value
}

export function sanitizeMediaUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  try {
    const url = new URL(trimmed)
    return url.protocol === 'https:' ? url.href : ''
  } catch {
    return ''
  }
}

export function csvEscape(value: string): string {
  const safe = sanitizeFormula(value)
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe
}
