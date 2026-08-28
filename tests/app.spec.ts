import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([])
})

test('privacy and format routes render one main heading', async ({ page }) => {
  for (const path of ['/privacy', '/terms', '/format']) {
    await page.goto(path)
    await expect(page.locator('main')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveCount(1)
  }
})
