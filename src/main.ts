import './style.css'
import { csvEscape, looksLikeHeader, parseMaterial, sanitizeFormula, sanitizeMediaUrl, type Delimiter, type ParsedMaterial } from './parser'

type Role = 'prompt' | 'answer' | 'hint' | 'media' | 'tags' | 'ignore'
type FindingKind = 'error' | 'warning' | 'note'
type Finding = { kind: FindingKind; title: string; detail: string; rows?: number[] }

const app = document.querySelector<HTMLDivElement>('#app')!
const sample = `Question,Answer,Hint,Image\nWhat is the capital of France?,Paris,Think of the Eiffel Tower,https://images.example.org/paris.jpg\nWhat is 2 + 2?,4,,\nWhat is 2 + 2?,4,duplicate row,\n,Photosynthesis,missing prompt,http://unsafe.example/image.png\n=HYPERLINK("bad"),Never run formulas,,javascript:alert(1)`

const state: {
  source: string
  name: string
  parsed: ParsedMaterial | null
  hasHeader: boolean
  mapping: Role[]
  delimiter?: Delimiter
  status: string
} = { source: '', name: '', parsed: null, hasHeader: true, mapping: [], status: '' }

const roleNames: Record<Role, string> = {
  prompt: 'Prompt', answer: 'Answer', hint: 'Hint', media: 'Media URL', tags: 'Tags', ignore: 'Ignore',
}

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!)
}

function icon(name: 'leaf' | 'check' | 'warn' | 'note' | 'download' | 'file'): string {
  const paths = {
    leaf: '<path d="M19 4c-7 .2-12 3.7-12 9 0 2.4 1.8 4 4.2 4C15.8 17 19 11.6 19 4Z"/><path d="M5 20c2.1-4.8 5.3-7.8 10-10"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    warn: '<path d="M12 4 3 20h18L12 4Z"/><path d="M12 9v4m0 3v.1"/>',
    note: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8v.1"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M5 20h14"/>',
    file: '<path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v5h4M9 12h6m-6 4h6"/>',
  }
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`
}

function shell(content: string): string {
  return `<header class="site-header">
    <a class="brand" href="/" aria-label="Study Material Import Check home"><span class="brand-mark">${icon('leaf')}</span><span>Import check</span></a>
    <nav aria-label="Primary"><a href="/#importer">Open inspector</a><a href="/format">Pack format</a></nav>
    <span class="privacy-chip">${icon('check')} Stays on this device</span>
  </header>${content}<footer><p>Made for learner-owned material. No accounts, uploads, analytics, or streaks.</p><nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/format">Portable format</a></nav><p class="generated-note">Paper artwork is original, AI-generated imagery.</p></footer>`
}

function renderInfoPage(path: string): void {
  const pages: Record<string, { title: string; eyebrow: string; body: string }> = {
    '/privacy': {
      eyebrow: 'Privacy note', title: 'Your study material never leaves this browser.',
      body: `<p>The inspector reads files with browser APIs and performs every check locally. It does not upload, transmit, or store the contents of your material.</p><h2>What we collect</h2><p>Nothing. This version has no accounts, analytics, cookies, advertisements, or third-party scripts. Your source material remains in memory only until you refresh or close the page.</p><h2>Exports</h2><p>Files you export are saved by your browser to the location you choose. You control and own them.</p><h2>Contact</h2><p>For questions, open an issue in the project repository.</p>`,
    },
    '/terms': {
      eyebrow: 'Plain-language terms', title: 'A free tool, used on your terms.',
      body: `<p>Study Material Import Check is provided free of charge under the MIT License. You may use it to inspect material you have the right to use.</p><h2>Your responsibility</h2><p>You are responsible for your source material, linked media, and exported files. Review the preview before importing a pack elsewhere.</p><h2>No warranty</h2><p>The tool is provided “as is,” without warranty. It flags common import problems but cannot guarantee compatibility with every learning application.</p><h2>No lock-in</h2><p>The exported JSON manifest is documented and portable. No account or continuing service is required to read it.</p>`,
    },
    '/format': {
      eyebrow: 'Open format · version 1', title: 'A practice pack you can read anywhere.',
      body: `<p>The exported <code>.study-pack.json</code> file is UTF-8 JSON. It has no proprietary identifiers and can be opened in any text editor.</p><h2>Manifest shape</h2><pre><code>{
  "format": "study-pack",
  "version": 1,
  "title": "My material",
  "createdAt": "2026-08-28T00:00:00.000Z",
  "fields": ["prompt", "answer", "hint", "media", "tags"],
  "cards": [
    { "prompt": "Capital of France?", "answer": "Paris",
      "hint": "Eiffel Tower", "media": "https://…", "tags": [] }
  ]
}</code></pre><h2>Safety rules</h2><p>Prompt, answer, hint, and tag values that begin with spreadsheet formula characters are prefixed with an apostrophe. Media accepts HTTPS URLs only. Blank and duplicate cards are omitted.</p>`,
    },
  }
  const page = pages[path]
  if (!page) {
    document.title = 'Page not found — Study Material Import Check'
    app.innerHTML = shell(`<main id="main" class="info-page not-found-page"><a class="back-link" href="/">← Back to inspector</a><p class="eyebrow">Nothing filed here</p><h1>This page is not on the desk.</h1><div class="prose"><p>The address may be mistyped or the page may have moved. Your study material has not been changed.</p><p><a class="button primary" href="/">Open the inspector</a></p></div></main>`)
    return
  }
  document.title = `${page.title} — Study Material Import Check`
  app.innerHTML = shell(`<main id="main" class="info-page"><a class="back-link" href="/">← Back to inspector</a><p class="eyebrow">${page.eyebrow}</p><h1>${page.title}</h1><div class="prose">${page.body}</div></main>`)
}

function suggestMapping(parsed: ParsedMaterial, header: boolean): Role[] {
  const headers = header ? parsed.rows[0] ?? [] : []
  const aliases: Record<Exclude<Role, 'ignore'>, RegExp> = {
    prompt: /^(front|question|prompt|term)$/i,
    answer: /^(back|answer|response|definition)$/i,
    hint: /^(hint|note|notes)$/i,
    media: /^(media|image|audio|url|media url)$/i,
    tags: /^(tag|tags|category)$/i,
  }
  const used = new Set<Role>()
  return Array.from({ length: parsed.maxColumns }, (_, index) => {
    const label = (headers[index] ?? '').trim()
    const found = (Object.entries(aliases) as [Exclude<Role, 'ignore'>, RegExp][]).find(([, pattern]) => pattern.test(label))
    const suggested: Role = found?.[0] ?? (index === 0 ? 'prompt' : index === 1 ? 'answer' : 'ignore')
    if (suggested !== 'ignore' && used.has(suggested)) return 'ignore'
    used.add(suggested)
    if (suggested !== 'ignore') return suggested
    return 'ignore'
  })
}

function focusAfterRender(selector: string, scrollSelector?: string): void {
  const element = document.querySelector<HTMLElement>(selector)
  element?.focus({ preventScroll: true })
  if (scrollSelector) document.querySelector(scrollSelector)?.scrollIntoView({ block: 'nearest' })
}

function parseSource(): void {
  if (!state.source.trim()) {
    state.parsed = null
    state.mapping = []
    state.status = 'Add a file or paste some material first.'
    renderApp()
    focusAfterRender('#inspect-button', '#status')
    return
  }
  state.parsed = parseMaterial(state.source, state.delimiter)
  state.hasHeader = looksLikeHeader(state.parsed.rows[0] ?? [])
  state.mapping = suggestMapping(state.parsed, state.hasHeader)
  state.status = `${Math.max(0, state.parsed.rows.length - (state.hasHeader ? 1 : 0))} rows inspected locally.`
  renderApp()
  focusAfterRender('#findings-title', '#findings')
}

function dataRows(): string[][] {
  if (!state.parsed) return []
  return state.parsed.rows.slice(state.hasHeader ? 1 : 0)
}

function mappedIndex(role: Role): number { return state.mapping.indexOf(role) }

function getValue(row: string[], role: Role): string {
  const index = mappedIndex(role)
  return index < 0 ? '' : (row[index] ?? '').trim()
}

function inspect(): Finding[] {
  if (!state.parsed) return []
  const findings: Finding[] = state.parsed.warnings.map((detail) => ({ kind: 'error', title: 'Unclosed quote', detail }))
  const rows = dataRows()
  const promptIndex = mappedIndex('prompt')
  const answerIndex = mappedIndex('answer')
  if (promptIndex < 0) findings.push({ kind: 'error', title: 'No prompt column', detail: 'Map one column to Prompt before exporting.' })
  if (answerIndex < 0) findings.push({ kind: 'error', title: 'No answer column', detail: 'Map one column to Answer before exporting.' })
  const blankRows: number[] = []
  const emptyCards: number[] = []
  const uneven: number[] = []
  const formulaRows: number[] = []
  const mediaRows: number[] = []
  const duplicateRows: number[] = []
  const seen = new Set<string>()
  rows.forEach((row, index) => {
    const number = index + (state.hasHeader ? 2 : 1)
    if (row.every((value) => !value.trim())) blankRows.push(number)
    if (!getValue(row, 'prompt') || !getValue(row, 'answer')) emptyCards.push(number)
    if (row.length !== state.parsed!.maxColumns) uneven.push(number)
    if (row.some((value) => /^[=+@-]/.test(value.trimStart()))) formulaRows.push(number)
    const media = getValue(row, 'media')
    if (media && !sanitizeMediaUrl(media)) mediaRows.push(number)
    const key = `${getValue(row, 'prompt').toLocaleLowerCase()}\u0000${getValue(row, 'answer').toLocaleLowerCase()}`
    if (key !== '\u0000') {
      if (seen.has(key)) duplicateRows.push(number)
      else seen.add(key)
    }
  })
  if (emptyCards.length) findings.push({ kind: 'error', title: `${emptyCards.length} incomplete ${emptyCards.length === 1 ? 'card' : 'cards'}`, detail: 'Rows without both a prompt and answer will be left out.', rows: emptyCards })
  if (duplicateRows.length) findings.push({ kind: 'warning', title: `${duplicateRows.length} duplicate ${duplicateRows.length === 1 ? 'card' : 'cards'}`, detail: 'Later duplicates will be left out of the export.', rows: duplicateRows })
  if (mediaRows.length) findings.push({ kind: 'warning', title: `${mediaRows.length} unsafe media ${mediaRows.length === 1 ? 'link' : 'links'}`, detail: 'Only HTTPS media links are kept. These links will be removed.', rows: mediaRows })
  if (formulaRows.length) findings.push({ kind: 'warning', title: `${formulaRows.length} formula-like ${formulaRows.length === 1 ? 'value' : 'values'}`, detail: 'A leading apostrophe will make each value safe for spreadsheets.', rows: formulaRows })
  if (uneven.length) findings.push({ kind: 'note', title: `${uneven.length} uneven ${uneven.length === 1 ? 'row' : 'rows'}`, detail: `The file uses up to ${state.parsed.maxColumns} columns. Missing cells are treated as blank.`, rows: uneven })
  if (blankRows.length) findings.push({ kind: 'note', title: `${blankRows.length} blank ${blankRows.length === 1 ? 'row' : 'rows'}`, detail: 'Blank rows will be left out.', rows: blankRows })
  if (!findings.length) findings.push({ kind: 'note', title: 'Everything looks tidy', detail: 'Map the fields below, check the preview, and export your pack.' })
  return findings
}

function cleanedCards() {
  const seen = new Set<string>()
  return dataRows().flatMap((row) => {
    const prompt = getValue(row, 'prompt')
    const answer = getValue(row, 'answer')
    if (!prompt || !answer) return []
    const key = `${prompt.toLocaleLowerCase()}\u0000${answer.toLocaleLowerCase()}`
    if (seen.has(key)) return []
    seen.add(key)
    const media = sanitizeMediaUrl(getValue(row, 'media'))
    return [{
      prompt: sanitizeFormula(prompt), answer: sanitizeFormula(answer),
      hint: sanitizeFormula(getValue(row, 'hint')), media,
      tags: getValue(row, 'tags').split(/[;,]/).map((tag) => sanitizeFormula(tag.trim())).filter(Boolean),
    }]
  })
}

function download(filename: string, contents: string, type: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function exportValidationMessage(cards: ReturnType<typeof cleanedCards>): string {
  if (mappedIndex('prompt') < 0 || mappedIndex('answer') < 0 || !cards.length) {
    return 'Map Prompt and Answer and keep at least one complete card before exporting.'
  }
  return ''
}

function blockInvalidExport(cards: ReturnType<typeof cleanedCards>, focusSelector: string): boolean {
  const message = exportValidationMessage(cards)
  if (!message) return false
  state.status = message
  renderApp()
  focusAfterRender(focusSelector, '#status')
  return true
}

function exportPack(): void {
  const cards = cleanedCards()
  if (blockInvalidExport(cards, '#export-pack')) return
  const title = (state.name || 'study-material').replace(/\.[^.]+$/, '')
  const pack = { format: 'study-pack', version: 1, title, createdAt: new Date().toISOString(), fields: ['prompt', 'answer', 'hint', 'media', 'tags'], cards }
  download(`${title}.study-pack.json`, `${JSON.stringify(pack, null, 2)}\n`, 'application/json;charset=utf-8')
  state.status = `${cards.length} ${cards.length === 1 ? 'card' : 'cards'} exported in a portable practice pack.`
  renderApp()
  focusAfterRender('#export-pack')
}

function exportCsv(): void {
  const cards = cleanedCards()
  if (blockInvalidExport(cards, '#export-csv')) return
  const lines = ['Prompt,Answer,Hint,Media,Tags', ...cards.map((card) => [card.prompt, card.answer, card.hint, card.media, card.tags.join('; ')].map(csvEscape).join(','))]
  download('clean-study-material.csv', `${lines.join('\r\n')}\r\n`, 'text/csv;charset=utf-8')
  state.status = `${cards.length} cleaned ${cards.length === 1 ? 'row' : 'rows'} exported as CSV.`
  renderApp()
  focusAfterRender('#export-csv')
}

function rowNumbers(rows?: number[]): string { return rows?.length ? ` <span class="row-list">Rows ${rows.slice(0, 6).join(', ')}${rows.length > 6 ? '…' : ''}</span>` : '' }

function renderWorkspace(): string {
  if (!state.parsed) return ''
  const findings = inspect()
  const counts = findings.reduce((result, finding) => ({ ...result, [finding.kind]: result[finding.kind] + (finding.kind === 'note' && finding.title === 'Everything looks tidy' ? 0 : 1) }), { error: 0, warning: 0, note: 0 })
  const rows = dataRows()
  const headers = state.hasHeader ? state.parsed.rows[0] : Array.from({ length: state.parsed.maxColumns }, (_, index) => `Column ${index + 1}`)
  return `<section id="findings" class="work-section paper-sheet" aria-labelledby="findings-title">
    <div class="section-heading"><div><p class="eyebrow">2 · Inspect</p><h2 id="findings-title" tabindex="-1">Margin notes</h2></div><p class="summary-stamp ${counts.error ? 'needs-work' : 'ready'}">${counts.error ? `${counts.error} to resolve` : 'Ready to map'}</p></div>
    <div class="finding-list">${findings.map((finding) => `<article class="finding ${finding.kind}">${icon(finding.kind === 'error' || finding.kind === 'warning' ? 'warn' : 'note')}<div><h3>${escapeHtml(finding.title)}</h3><p>${escapeHtml(finding.detail)}${rowNumbers(finding.rows)}</p></div></article>`).join('')}</div>
    <p class="repair-note">Export repairs are non-destructive: the source above never changes. Incomplete and duplicate cards are omitted; formulas are neutralized; unsafe media is removed.</p>
  </section>
  <section id="mapping" class="work-section" aria-labelledby="mapping-title">
    <div class="section-heading"><div><p class="eyebrow">3 · Map</p><h2 id="mapping-title">Tell each column its job</h2></div><label class="header-check"><input id="header-toggle" type="checkbox" ${state.hasHeader ? 'checked' : ''}> First row is a header</label></div>
    <p class="section-intro">Prompt and Answer are required. Each role can be used once; choosing it for a new column moves it from the old one.</p>
    <div class="mobile-map-list" aria-label="Column mapping">${headers.map((header, index) => `<label><span>${escapeHtml(header || `Column ${index + 1}`)}</span><select class="role-select" data-column="${index}">${(Object.keys(roleNames) as Role[]).map((role) => `<option value="${role}" ${state.mapping[index] === role ? 'selected' : ''}>${roleNames[role]}</option>`).join('')}</select></label>`).join('')}</div>
    <div class="table-scroll" tabindex="0" aria-label="Column mapping and first rows; scroll horizontally if needed">
      <table><caption class="sr-only">Map source columns and preview rows</caption><thead><tr>${headers.map((header, index) => `<th scope="col"><span class="source-label">${escapeHtml(header || `Column ${index + 1}`)}</span><label><span class="sr-only">Role for ${escapeHtml(header || `column ${index + 1}`)}</span><select class="role-select" data-column="${index}">${(Object.keys(roleNames) as Role[]).map((role) => `<option value="${role}" ${state.mapping[index] === role ? 'selected' : ''}>${roleNames[role]}</option>`).join('')}</select></label></th>`).join('')}</tr></thead><tbody>${rows.slice(0, 8).map((row, rowIndex) => `<tr>${Array.from({ length: state.parsed!.maxColumns }, (_, columnIndex) => `<td><span class="cell-row">${rowIndex + (state.hasHeader ? 2 : 1)}</span>${escapeHtml(row[columnIndex] ?? '') || '<span class="empty-cell">Blank</span>'}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </div><p class="scroll-cue">Swipe or use Shift + mouse wheel to see more columns.</p>
    <div class="mobile-preview"><h3>First cards</h3><ol>${rows.slice(0, 5).map((row) => `<li><strong>${escapeHtml(getValue(row, 'prompt')) || '<span class="empty-cell">Blank prompt</span>'}</strong><span>${escapeHtml(getValue(row, 'answer')) || '<span class="empty-cell">Blank answer</span>'}</span></li>`).join('')}</ol></div>
  </section>
  <section id="export" class="work-section export-sheet" aria-labelledby="export-title">
    <div><p class="eyebrow">4 · Export</p><h2 id="export-title">Take the tidy cards with you</h2><p>${cleanedCards().length} of ${rows.length} source rows will become cards. The JSON format is open and documented.</p></div>
    <div class="export-actions"><button class="button primary" id="export-pack">${icon('download')} Export practice pack</button><button class="button secondary" id="export-csv">Export clean CSV</button><a href="/format">Read the format</a></div>
  </section>`
}

function renderApp(): void {
  document.title = 'Study Material Import Check — inspect before you import'
  const offline = !navigator.onLine
  app.innerHTML = shell(`<main id="main">
    <section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">A quiet check before you practise</p><h1 id="hero-title">Turn a messy study file into tidy, portable cards.</h1><p class="hero-lede">Preview CSV, TSV, or plain text. Find blanks, duplicates, risky formulas, and broken media links—then export a clean, open practice pack.</p><a class="button primary" href="#importer">Check my material</a><p class="local-note">${icon('check')} Parsed entirely in your browser. Nothing is uploaded.</p></div>
      <picture class="hero-art"><source media="(max-width: 640px)" srcset="/assets/hero-paper-workshop-640.f39ea86b.avif" type="image/avif"><source media="(max-width: 640px)" srcset="/assets/hero-paper-workshop-640.d26c82f4.webp" type="image/webp"><source srcset="/assets/hero-paper-workshop-960.73a2c0ca.avif" type="image/avif"><source srcset="/assets/hero-paper-workshop-960.1bfc26f2.webp" type="image/webp"><img src="/assets/hero-paper-workshop-960.064c2652.jpg" width="960" height="640" alt="Paper study notes pass through a green inspection arch and emerge as three neat checked cards" fetchpriority="high" decoding="async"></picture>
    </section>
    <ol class="trail" aria-label="Import steps"><li class="active"><span>1</span>Add</li><li class="${state.parsed ? 'active' : ''}"><span>2</span>Inspect</li><li class="${state.parsed ? 'active' : ''}"><span>3</span>Map</li><li class="${state.parsed ? 'active' : ''}"><span>4</span>Export</li></ol>
    <section id="importer" class="import-section" aria-labelledby="import-title"><div class="section-heading"><div><p class="eyebrow">1 · Add material</p><h2 id="import-title">Place your notes on the desk</h2></div><span class="connection ${offline ? 'offline' : ''}">${offline ? '○ Offline — still works' : '● Ready locally'}</span></div>
      <div class="input-grid"><div class="drop-sheet" id="drop-sheet"><span class="file-icon">${icon('file')}</span><strong>Drop a .csv, .tsv, or .txt file</strong><span>or choose one from this device</span><button class="button secondary" type="button" id="choose-file">Choose file</button><input class="sr-only" id="file-input" aria-label="Choose a CSV, TSV, or text file" type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"></div>
      <div class="paste-sheet"><label for="source"><strong>Or paste and edit</strong><span>Comma, tab, semicolon, pipe, or <code>Prompt :: Answer</code></span></label><textarea id="source" rows="9" spellcheck="false" placeholder="Question,Answer&#10;Capital of France?,Paris">${escapeHtml(state.source)}</textarea><div class="paste-actions"><button class="text-button" type="button" id="load-sample">Try a malformed sample</button><button class="text-button" type="button" id="clear-source" ${state.source ? '' : 'disabled'}>Clear</button></div></div></div>
      <div class="inspect-row"><p>${state.name ? `Source: <strong>${escapeHtml(state.name)}</strong>` : 'UTF-8 files up to 5 MB work best.'}</p><button class="button primary" id="inspect-button">Inspect material</button></div>
      <p id="status" class="status" role="status" aria-live="polite">${escapeHtml(state.status)}</p>
    </section>${renderWorkspace()}
  </main>`)
  bindEvents()
}

function bindEvents(): void {
  const source = document.querySelector<HTMLTextAreaElement>('#source')
  source?.addEventListener('input', () => { state.source = source.value; state.status = '' })
  document.querySelector('#inspect-button')?.addEventListener('click', parseSource)
  document.querySelector('#load-sample')?.addEventListener('click', () => { state.source = sample; state.name = 'untidy-sample.csv'; state.delimiter = undefined; parseSource() })
  document.querySelector('#clear-source')?.addEventListener('click', () => { state.source = ''; state.name = ''; state.parsed = null; state.mapping = []; state.status = 'Desk cleared.'; renderApp(); document.querySelector<HTMLTextAreaElement>('#source')?.focus() })
  const input = document.querySelector<HTMLInputElement>('#file-input')
  const choose = () => input?.click()
  document.querySelector('#choose-file')?.addEventListener('click', (event) => { event.stopPropagation(); choose() })
  const drop = document.querySelector<HTMLElement>('#drop-sheet')
  const readFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { state.status = 'That file is over 5 MB. Split it into a smaller file and try again.'; renderApp(); focusAfterRender('#choose-file', '#status'); return }
    const reader = new FileReader()
    reader.onerror = () => { state.status = 'The browser could not read that file. Save it as UTF-8 text and try again.'; renderApp(); focusAfterRender('#choose-file', '#status') }
    reader.onload = () => { state.source = String(reader.result ?? ''); state.name = file.name; state.delimiter = file.name.endsWith('.tsv') ? '\t' : undefined; parseSource() }
    reader.readAsText(file)
  }
  input?.addEventListener('change', () => { if (input.files?.[0]) readFile(input.files[0]) })
  ;['dragenter', 'dragover'].forEach((name) => drop?.addEventListener(name, (event) => { event.preventDefault(); drop.classList.add('dragging') }))
  ;['dragleave', 'drop'].forEach((name) => drop?.addEventListener(name, (event) => { event.preventDefault(); drop.classList.remove('dragging') }))
  drop?.addEventListener('drop', (event) => { const file = (event as DragEvent).dataTransfer?.files[0]; if (file) readFile(file) })
  document.querySelector('#header-toggle')?.addEventListener('change', (event) => {
    state.hasHeader = (event.target as HTMLInputElement).checked
    state.mapping = suggestMapping(state.parsed!, state.hasHeader)
    renderApp()
    focusAfterRender('#header-toggle', '#mapping')
  })
  document.querySelectorAll<HTMLSelectElement>('.role-select').forEach((select) => select.addEventListener('change', () => {
    const column = Number(select.dataset.column)
    const role = select.value as Role
    const previousColumn = role === 'ignore' ? -1 : state.mapping.findIndex((mappedRole, index) => mappedRole === role && index !== column)
    if (previousColumn >= 0) state.mapping[previousColumn] = 'ignore'
    state.mapping[column] = role
    const rows = state.parsed?.rows ?? []
    const nextLabel = state.hasHeader ? rows[0]?.[column]?.trim() || `Column ${column + 1}` : `Column ${column + 1}`
    if (previousColumn >= 0) {
      const previousLabel = state.hasHeader ? rows[0]?.[previousColumn]?.trim() || `Column ${previousColumn + 1}` : `Column ${previousColumn + 1}`
      state.status = `${roleNames[role]} moved from ${previousLabel} to ${nextLabel}. Each role can be used once.`
    } else {
      state.status = role === 'ignore' ? `${nextLabel} will be ignored.` : `${nextLabel} is mapped to ${roleNames[role]}.`
    }
    const container = select.closest('.mobile-map-list') ? '.mobile-map-list' : '.table-scroll'
    renderApp()
    focusAfterRender(`${container} .role-select[data-column="${column}"]`, '#mapping')
  }))
  document.querySelector('#export-pack')?.addEventListener('click', exportPack)
  document.querySelector('#export-csv')?.addEventListener('click', exportCsv)
}

window.addEventListener('online', () => { if (location.pathname === '/') renderApp() })
window.addEventListener('offline', () => { if (location.pathname === '/') renderApp() })

const route = location.pathname.replace(/\/$/, '') || '/'
if (route === '/') renderApp()
else renderInfoPage(route)
