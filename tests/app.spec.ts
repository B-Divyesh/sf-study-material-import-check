import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'

const sampleFile = `Question,Answer,Hint,Image
What is the capital of France?,Paris,Think of the Eiffel Tower,https://images.example.org/paris.jpg
What is 2 + 2?,4,,
What is 2 + 2?,4,duplicate row,
,Photosynthesis,missing prompt,http://unsafe.example/image.png
=HYPERLINK("bad"),Never run formulas,,javascript:alert(1)`

async function openDemo(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/demo')
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible()
  await expect(page.locator('#findings-title')).toBeVisible()
}

async function inspectSource(page: import('@playwright/test').Page, source: string): Promise<void> {
  await page.locator('#source').fill(source)
  await page.getByRole('button', { name: 'Inspect material' }).click()
  await expect(page.locator('#findings-title')).toBeVisible()
}

async function downloadText(page: import('@playwright/test').Page, button: string): Promise<{ name: string; contents: string }> {
  const event = page.waitForEvent('download')
  await page.getByRole('button', { name: button }).click()
  const download = await event
  return { name: download.suggestedFilename(), contents: await readFile(await download.path(), 'utf8') }
}

test('@claim:input-files accepts CSV, TSV, and text files', async ({ page }) => {
  await openDemo(page)
  const input = page.locator('#file-input')
  for (const [name, content] of [
    ['cards.csv', 'Prompt,Answer\nCapital of France?,Paris'],
    ['cards.tsv', 'Prompt\tAnswer\nCapital of France?\tParis'],
    ['cards.txt', 'Capital of France? :: Paris'],
  ]) {
    await input.setInputFiles({ name, mimeType: 'text/plain', buffer: Buffer.from(content) })
    await expect(page.getByRole('status')).toContainText('1 rows inspected locally')
    await expect(page.getByRole('button', { name: 'Export practice pack' })).toBeVisible()
  }
})

test('@claim:input-shapes recognizes common delimiters and prompt-answer text', async ({ page }) => {
  await openDemo(page)
  for (const source of [
    'Prompt,Answer\nCapital of France?,Paris',
    'Prompt\tAnswer\nCapital of France?\tParis',
    'Prompt;Answer\nCapital of France?;Paris',
    'Prompt|Answer\nCapital of France?|Paris',
    'Capital of France? :: Paris',
  ]) {
    await inspectSource(page, source)
    await expect(page.getByText('Everything looks tidy')).toBeVisible()
  }
})

test('@claim:incomplete-cards finds incomplete cards and leaves them out', async ({ page }) => {
  await openDemo(page)
  await expect(page.getByRole('heading', { name: /incomplete card/i })).toBeVisible()
  const pack = JSON.parse((await downloadText(page, 'Export practice pack')).contents)
  expect(pack.cards.every((card: { prompt: string; answer: string }) => card.prompt && card.answer)).toBe(true)
  expect(pack.cards).toHaveLength(3)
})

test('@claim:duplicates finds and omits duplicate cards', async ({ page }) => {
  await openDemo(page)
  await expect(page.getByRole('heading', { name: /duplicate card/i })).toBeVisible()
  const pack = JSON.parse((await downloadText(page, 'Export practice pack')).contents)
  const pairs = pack.cards.map((card: { prompt: string; answer: string }) => `${card.prompt}\u0000${card.answer}`)
  expect(new Set(pairs).size).toBe(pairs.length)
})

test('@claim:formula-safety neutralizes spreadsheet formulas in exports', async ({ page }) => {
  await openDemo(page)
  const pack = JSON.parse((await downloadText(page, 'Export practice pack')).contents)
  expect(pack.cards.find((card: { prompt: string }) => card.prompt.includes('HYPERLINK'))?.prompt).toMatch(/^'/)
})

test('@claim:media-safety removes non-HTTPS media links', async ({ page }) => {
  await openDemo(page)
  const pack = JSON.parse((await downloadText(page, 'Export practice pack')).contents)
  expect(pack.cards.find((card: { prompt: string }) => card.prompt.includes('HYPERLINK'))?.media).toBe('')
  expect(pack.cards.find((card: { prompt: string }) => card.prompt.includes('capital'))?.media).toBe('https://images.example.org/paris.jpg')
})

test('@claim:unique-mapping moves a role and exports the selected column', async ({ page }) => {
  await openDemo(page)
  await inspectSource(page, 'Prompt,Answer,Alternate\nOld question,Answer,New question')
  const visibleRoles = page.locator('.role-select:visible')
  const alternate = visibleRoles.nth(2)
  await alternate.focus()
  await alternate.selectOption('prompt')
  await expect(alternate).toBeFocused()
  await expect(visibleRoles.nth(0)).toHaveValue('ignore')
  await expect(visibleRoles.nth(2)).toHaveValue('prompt')
  const pack = JSON.parse((await downloadText(page, 'Export practice pack')).contents)
  expect(pack.cards[0].prompt).toBe('New question')
})

test('@claim:practice-pack exports a version-1 portable practice pack', async ({ page }) => {
  await openDemo(page)
  const downloaded = await downloadText(page, 'Export practice pack')
  const pack = JSON.parse(downloaded.contents)
  expect(downloaded.name).toBe('untidy-sample.study-pack.json')
  expect(pack).toMatchObject({ format: 'study-pack', version: 1, fields: ['prompt', 'answer', 'hint', 'media', 'tags'] })
  expect(pack.cards).toHaveLength(3)
})

test('@claim:clean-csv exports sanitized CSV', async ({ page }) => {
  await openDemo(page)
  const downloaded = await downloadText(page, 'Export clean CSV')
  expect(downloaded.name).toBe('clean-study-material.csv')
  expect(downloaded.contents.split('\r\n').filter(Boolean)).toHaveLength(4)
  expect(downloaded.contents).toContain("'=HYPERLINK")
  expect(downloaded.contents).not.toContain('javascript:alert')
})

test('@claim:local-processing keeps the demo flow on the current origin', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await openDemo(page)
  await downloadText(page, 'Export practice pack')
  const origin = new URL(page.url()).origin
  expect(requests).not.toEqual([])
  expect(requests.every((url) => new URL(url).origin === origin)).toBe(true)
})

test('@claim:memory-only does not retain real material after reload', async ({ page }) => {
  await openDemo(page)
  await page.getByRole('button', { name: 'Start for real' }).click()
  await inspectSource(page, 'Prompt,Answer\nA private card,A private answer')
  await page.reload()
  await expect(page.locator('#source')).toHaveValue('')
  const storage = await page.evaluate(() => ({ local: Object.values(localStorage), session: Object.values(sessionStorage) }))
  expect([...storage.local, ...storage.session].join('\n')).not.toContain('A private card')
})

test('@claim:no-tracking starts without accounts, cookies, or third-party requests', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/')
  const origin = new URL(page.url()).origin
  expect(await page.context().cookies()).toEqual([])
  expect(requests.every((url) => new URL(url).origin === origin)).toBe(true)
  await expect(page.getByText('Local only — no upload')).toBeVisible()
})

test('@claim:offline-after-load checks material after the page is offline', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  try {
    await openDemo(page)
    await context.setOffline(true)
    await page.evaluate(() => window.dispatchEvent(new Event('offline')))
    await expect(page.getByText('Offline — this loaded page still works')).toBeVisible()
    await inspectSource(page, 'Prompt,Answer\nOffline question,Offline answer')
    await expect(page.getByText('Everything looks tidy')).toBeVisible()
  } finally {
    await context.close()
  }
})

test('@claim:mit-license describes the free MIT terms', async ({ page }) => {
  await page.goto('/terms')
  await expect(page.getByRole('heading', { name: 'Read the terms for this free tool.' })).toBeVisible()
  await expect(page.getByText('MIT License')).toBeVisible()
})

test('@claim:portable-format documents an open manifest without proprietary identifiers', async ({ page }) => {
  await page.goto('/format')
  await expect(page.getByRole('heading', { name: 'Read the portable practice pack format.' })).toBeVisible()
  await expect(page.getByText('no proprietary identifiers', { exact: false })).toBeVisible()
  await expect(page.getByText('No account or continuing service is required', { exact: false })).toBeVisible()
})

test('@claim:file-limit accepts 5 MiB and rejects a larger file', async ({ page }) => {
  await openDemo(page)
  const limit = 5 * 1024 * 1024
  const prefix = Buffer.from('Prompt,Answer\nQuestion,Answer')
  const atLimit = Buffer.concat([prefix, Buffer.alloc(limit - prefix.length, 0x20)])
  await page.locator('#file-input').setInputFiles({ name: 'at-limit.csv', mimeType: 'text/csv', buffer: atLimit })
  await expect(page.getByRole('status')).toContainText('1 rows inspected locally')
  await page.locator('#file-input').setInputFiles({ name: 'too-large.csv', mimeType: 'text/csv', buffer: Buffer.alloc(limit + 1, 0x20) })
  await expect(page.getByRole('status')).toContainText('over 5 MB')
  await expect(page.getByRole('button', { name: 'Choose file' })).toBeFocused()
})

test('@claim:demo-sandbox shows a resettable sample and starts a separate real session', async ({ page }) => {
  await openDemo(page)
  await page.locator('#source').fill('Prompt,Answer\nChanged sample,Changed answer')
  await page.getByRole('button', { name: 'Reset demo' }).click()
  await expect(page.locator('#source')).toHaveValue(sampleFile)
  await page.getByRole('button', { name: 'Start for real' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('#source')).toHaveValue('')
  expect(await page.evaluate(() => sessionStorage.getItem('demo:study-material-import-check'))).toBeNull()
})

test('keeps invalid export recoverable and has no serious accessibility violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Check study files before you import.' })).toBeVisible()
  await expect(page.getByText('For learners bringing their own notes into practice', { exact: false })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible()
  await expect(page.locator('.hero-facts li')).toHaveCount(3)
  await inspectSource(page, 'Prompt,Answer\nOnly prompt,')
  await page.getByRole('button', { name: 'Export clean CSV' }).click()
  await expect(page.getByRole('status')).toContainText('keep at least one complete card')
  await expect(page.getByRole('button', { name: 'Export clean CSV' })).toBeFocused()
  await inspectSource(page, 'Prompt,Answer\nCapital of France?,Paris')
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([])
  for (const path of ['/demo', '/privacy', '/terms', '/format', '/does-not-exist']) {
    await page.goto(path)
    const routeResults = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(routeResults.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([])
  }
})

test('provides titled legal routes, a real not-found page, and a keyboard skip link', async ({ page }) => {
  for (const [path, title] of [['/privacy', 'Privacy — Study Material Import Check'], ['/terms', 'Terms — Study Material Import Check'], ['/format', 'Format — Study Material Import Check']]) {
    await page.goto(path)
    await expect(page).toHaveTitle(title)
    await expect(page.locator('main')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveCount(1)
  }
  await page.goto('/does-not-exist')
  await expect(page).toHaveTitle('Page not found — Study Material Import Check')
  await expect(page.getByRole('heading', { name: 'Find the page you need.' })).toBeVisible()
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()
})

test('keeps the 390 px layout within the viewport and honors reduced motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only layout measurement')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/demo')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
  expect(await page.locator('.hero-art').count()).toBe(0)
  const motion = await page.locator('.button').first().evaluate((element) => getComputedStyle(element).transitionDuration)
  expect(Number.parseFloat(motion)).toBeLessThanOrEqual(0.01)
})

test('keeps mobile navigation targets at least 44 by 44 CSS pixels', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only target measurement')
  await page.goto('/')
  const targets = [page.locator('.brand'), page.locator('.site-header nav a'), page.locator('footer nav a')]
  for (const target of targets) {
    const count = await target.count()
    for (let index = 0; index < count; index += 1) {
      const box = await target.nth(index).boundingBox()
      expect(box?.width).toBeGreaterThanOrEqual(44)
      expect(box?.height).toBeGreaterThanOrEqual(44)
    }
  }
})
