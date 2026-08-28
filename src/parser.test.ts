import { describe, expect, it } from 'vitest'
import { csvEscape, detectDelimiter, looksLikeHeader, parseMaterial, sanitizeFormula, sanitizeMediaUrl } from './parser'

describe('study material parser', () => {
  it('parses commas, escaped quotes, and multiline fields', () => {
    const parsed = parseMaterial('Prompt,Answer\n"Why?","Because, yes"\n"two\nlines",ok')
    expect(parsed.rows).toEqual([['Prompt', 'Answer'], ['Why?', 'Because, yes'], ['two\nlines', 'ok']])
  })

  it('detects tabs and reports an open quote', () => {
    expect(detectDelimiter('front\tback\na\tb')).toBe('\t')
    expect(parseMaterial('a,"broken').warnings).toHaveLength(1)
  })

  it('recognizes common headers', () => {
    expect(looksLikeHeader(['Question', 'Answer', 'Hint'])).toBe(true)
    expect(looksLikeHeader(['Paris', 'France'])).toBe(false)
  })

  it('neutralizes spreadsheet formulas and unsafe media', () => {
    expect(sanitizeFormula('=2+2')).toBe("'=2+2")
    expect(csvEscape('+cmd')).toBe("'+cmd")
    expect(sanitizeMediaUrl('javascript:alert(1)')).toBe('')
    expect(sanitizeMediaUrl('http://example.com/a.png')).toBe('')
    expect(sanitizeMediaUrl('https://example.com/a.png')).toBe('https://example.com/a.png')
  })
})
