# Handoff — Study Material Import Check

## What was built

- Complete local-only CSV, TSV, semicolon, pipe, and `Prompt :: Answer` text parser with quoted fields, escaped quotes, multiline fields, BOM and CRLF handling.
- Drag/drop, keyboard-accessible file picker, paste/edit path, 5 MB guard, empty/error guidance, malformed starter sample, and offline status.
- Findings for missing required fields, duplicate cards, blank/uneven rows, unclosed quotes, spreadsheet formula prefixes, and unsafe media URLs.
- Header detection and per-column mapping to prompt, answer, hint, media URL, tags, or ignore.
- Non-destructive cleanup with previews and export to both documented `study-pack` v1 JSON and sanitized CSV. Incomplete/duplicate rows are omitted; formula-like values are prefixed; only HTTPS media is retained.
- Open format documentation at `/format`, plus `/privacy` and `/terms` routes.
- Product-specific paper-cut visual system, original generated hero artwork, responsive AVIF/WebP/JPEG delivery, reduced-motion handling, and a stacked 390 px mapping experience.
- Azure Static Web Apps navigation fallback and security headers.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run build
```

- `npm test`: passed 4 Vitest parser tests and 8 Playwright tests (desktop + 390 px mobile), including malformed-file export, empty state, legal/format routes, console-error smoke test, and axe WCAG A/AA scan with no serious or critical violations.
- `npm run build`: passed; output at `dist/index.html`.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Production payload: 20.01 KB JavaScript (8.00 KB gzip), 13.91 KB CSS (4.12 KB gzip). Largest hero fallback is 72 KB; 960 px AVIF is 28 KB and 640 px AVIF is 16 KB.
- Lighthouse 13.0.1, mobile defaults against local production preview: Performance 100, Accessibility 100, Best Practices 96, SEO 92; LCP 1.4 s, CLS 0, Total Blocking Time 0 ms.
- Manual visual checks completed at 1440 px and 390 px. The mobile page has no horizontal document overflow and all primary controls meet the 44 px target.

## Known gaps and next steps

- The v1 is intentionally for small UTF-8 text files up to 5 MB. It does not decode spreadsheet workbooks, fetch remote media, or rewrite source files in place.
- Media validation is intentionally conservative: only syntactically valid HTTPS URLs are kept; link availability is not fetched because that would disclose user data and make offline use unreliable.
- A future desktop/batch product could add encoding detection, multiple-file processing, and destination-specific adapters while keeping the documented manifest as the interchange layer.

## Asset provenance

The hero source is `assets/src/hero-paper-workshop.png`; its full prompt and generator metadata are in `assets/src/hero-paper-workshop.json` and `.factory/design.md`. It was generated on 2026-08-28 with the factory Azure image deployment, reviewed for text/brand artifacts, and optimized locally to responsive AVIF, WebP, and JPEG assets.
