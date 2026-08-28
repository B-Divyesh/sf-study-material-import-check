import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'

test('repairs the malformed sample and exports a portable pack', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await expect(page.locator('h1')).toHaveCount(1)
  await page.getByRole('button', { name: 'Try a malformed sample' }).click()
  await expect(page.getByRole('heading', { name: 'Margin notes' })).toBeVisible()
  await expect(page.getByText('incomplete card', { exact: false })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'duplicate card', exact: false })).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export practice pack' }).click()
  const file = await download
  expect(file.suggestedFilename()).toBe('untidy-sample.study-pack.json')
  await expect(page.getByRole('status')).toContainText('3 cards exported')
  expect(errors).toEqual([])
})

test('empty input explains the next step', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Inspect material' }).click()
  await expect(page.getByRole('status')).toContainText('Add a file or paste')
})

test('primary page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/')
  await page.locator('#source').fill('Prompt,Answer,Hint\nCapital of France?,Paris,Landmark')
  await page.getByRole('button', { name: 'Inspect material' }).click()
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([])
})

test('privacy, terms, and format routes render one main heading', async ({ page }) => {
  for (const path of ['/privacy', '/terms', '/format']) {
    await page.goto(path)
    await expect(page.locator('main')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveCount(1)
  }
})

test('moving a unique role keeps keyboard focus and exports the selected column', async ({ page }) => {
  await page.goto('/')
  await page.locator('#source').fill('Prompt,Answer,Alternate\nOld question,Answer,New question')
  await page.getByRole('button', { name: 'Inspect material' }).click()
  await expect(page.locator('#findings-title')).toBeFocused()

  const visibleRoles = page.locator('.role-select:visible')
  const alternateRole = visibleRoles.nth(2)
  await alternateRole.focus()
  await alternateRole.selectOption('prompt')

  await expect(alternateRole).toBeFocused()
  await expect(visibleRoles.nth(0)).toHaveValue('ignore')
  await expect(visibleRoles.nth(2)).toHaveValue('prompt')
  await expect(page.getByRole('status')).toContainText('Prompt moved from Prompt to Alternate')

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export practice pack' }).click()
  const file = await download
  const contents = await readFile(await file.path(), 'utf8')
  expect(JSON.parse(contents).cards[0].prompt).toBe('New question')
})

test('clean CSV refuses a header-only export', async ({ page }) => {
  let downloads = 0
  page.on('download', () => { downloads += 1 })
  await page.goto('/')
  await page.locator('#source').fill('Prompt,Answer\nOnly prompt,')
  await page.getByRole('button', { name: 'Inspect material' }).click()
  await page.getByRole('button', { name: 'Export clean CSV' }).click()

  await expect(page.getByRole('status')).toContainText('keep at least one complete card')
  await expect(page.getByRole('button', { name: 'Export clean CSV' })).toBeFocused()
  expect(downloads).toBe(0)
})

test('unknown routes show an explicit not-found page', async ({ page }) => {
  await page.goto('/does-not-exist')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page is not on the desk.')
  await expect(page.getByRole('link', { name: 'Open the inspector' })).toHaveAttribute('href', '/')
})

test('mobile home and legal targets are at least 44 by 44 CSS pixels', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only target measurement')
  await page.goto('/')
  for (const locator of [page.locator('.brand'), page.getByRole('link', { name: 'Terms' })]) {
    const box = await locator.boundingBox()
    expect(box?.width).toBeGreaterThanOrEqual(44)
    expect(box?.height).toBeGreaterThanOrEqual(44)
  }
})

test('static deployment config protects route, cache, and image policies', async () => {
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8'))
  expect(config.navigationFallback).toBeUndefined()
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/index.html', statusCode: 404 })
  expect(config.mimeTypes['.avif']).toBe('image/avif')
  expect(config.routes).toContainEqual({
    route: '/assets/*',
    headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
})
