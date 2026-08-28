# Independent verification — Study Material Import Check

## Verdict: FAIL

Candidate `48152d26250df02bd96cee8db2e9c57d8dc4e5a1` was independently tested on 2026-08-28 from a clean detached worktree and against <https://study-material-import-check.sociobot.in>. The deployment is healthy and byte-for-byte matches the candidate production build, but the candidate does not meet the acceptance contract because column mapping can silently export the wrong field and invalid input can be exported as a header-only CSV with a success message.

No product code was changed during verification.

## Acceptance summary

| Area | Result | Evidence |
| --- | --- | --- |
| Core inspect/map/export job | **FAIL** | Normal CSV/TSV/text flows work, but duplicate role mappings silently use the first mapped column, and clean CSV does not enforce required fields or a non-empty card set. |
| Clean install, tests, type check, build | PASS | `npm ci`, `npm test`, and exact `npm run build` all passed from a clean checkout. The build includes `tsc --noEmit`; no lint script exists. |
| Desktop and 390 px mobile | PASS with minor defects | End-to-end flows render without document overflow or visual breakage. Two mobile targets are under 44 CSS px. |
| Accessibility | **FAIL** | Axe reports zero WCAG A/AA violations, focus rings and reduced motion work, but mapping rerenders lose keyboard focus and restart navigation at the header control. |
| Privacy and security | PASS | All processing stayed in browser memory; no content requests, third-party requests, cookies, analytics, storage, or CDN resources were observed. Live CSP and related headers are present. |
| Performance | PASS with policy defect | Live mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 92 SEO; LCP 0.907 s, TBT 43 ms, CLS 0. Hashed assets receive only a 30-second cache lifetime. |
| Deployment identity | PASS | Live HTML, hashed JS/CSS, and all five hero files match the clean candidate build by SHA-256. |
| Docs, legal, visual thesis | PASS | README, MIT license, `/privacy`, `/terms`, `/format`, design tokens, motion policy, and generated-asset provenance are present. |

## Defects

### Major — SMIC-QA-01: duplicate role mappings silently export the wrong column

Reproduction:

1. Paste `Prompt,Answer,Alternate\nOld question,Answer,New question` and inspect.
2. Map the third column, `Alternate`, to `Prompt`.
3. Export the practice pack.

Observed: the visible role values are `prompt, answer, prompt`, no warning explains the conflict, and the exported prompt is `Old question` from the first column. The newly selected `New question` column is ignored because export uses the first matching role.

Expected: each semantic role should be unique, or the interface should block export and explain how to resolve the conflict. This is a core data-correctness failure in the required mapping job.

### Major — SMIC-QA-02: invalid material exports as a header-only clean CSV

Reproduction:

1. Paste `Prompt,Answer\nOnly prompt,` and inspect.
2. Select **Export clean CSV**.

Observed: `clean-study-material.csv` downloads with exactly `Prompt,Answer,Hint,Media,Tags\r\n`, and the UI reports `0 cleaned rows exported as CSV.` The practice-pack action correctly blocks the same source and explains that at least one complete card is needed.

Expected: clean CSV should enforce Prompt, Answer, and at least one complete card just as practice-pack export does. A header-only file is not useful import-ready study material.

### Minor — SMIC-QA-03: mapping changes discard keyboard focus

Changing a role select rerenders the whole app. `document.activeElement` becomes `BODY`; the next Tab returns to `#header-toggle`, before the mapping controls. Repeating this across several columns makes keyboard users traverse earlier controls after every change. Inspection also drops focus to `BODY`, although its next Tab advances to the header control. The skip link itself works: activating it sets `#main`, and the next Tab reaches **Check my material**. Visible focus is a 3 px blue outline.

### Minor — SMIC-QA-04: hashed deployment assets are not long-lived cached

The HTML, hashed JS, hashed CSS, and image assets all return `Cache-Control: public, must-revalidate, max-age=30`; immutable hashed assets do not receive a long-lived `immutable` policy as required by the performance contract. Conditional ETag requests do return 304. The AVIF response is also served as `application/octet-stream` instead of `image/avif`, though Chromium successfully decodes it.

### Minor — SMIC-QA-05: two mobile targets are smaller than 44 × 44 CSS px

At a 390 px viewport, the home-brand link is 40 × 40 px and the footer Terms link is approximately 41.23 × 44 px. Other visible actionable controls meet the target size. The hidden 1 × 1 file input was excluded because its 48 px visible proxy button is the effective control.

### Minor — SMIC-QA-06: unknown routes masquerade as the format page

`/does-not-exist` receives HTTP 200 through the navigation fallback, and client routing renders the portable-format page for any unrecognized path. A missing route should produce an explicit not-found state rather than unrelated content.

## Clean-checkout commands and results

The detached checkout was created directly at the candidate SHA. Before installation, `git status --short --branch` reported only `## HEAD (no branch)`.

```text
npm ci
  added 59 packages; found 0 vulnerabilities

npm test
  Vitest: 1 file, 4 tests passed
  Playwright: 8 tests passed (desktop Chromium and 390 px mobile)

npm run build
  tsc --noEmit: passed
  Vite 7.3.6: 5 modules transformed; dist/ produced

npm audit --audit-level=high
  found 0 vulnerabilities
```

There is no repository lint script. This is a static web product, not a library, CLI, backend, or PWA, so consumer-package, concurrency/persistence/health, and service-worker update checks are not applicable.

## Independent functional coverage

Passed cases:

- Normal CSV import, preview, automatic header mapping, findings, JSON export, and clean-CSV export.
- TSV file with UTF-8 BOM and CRLF, semicolon-delimited input, pipe-delimited input, `Prompt :: Answer` text, quoted commas, escaped quotes, and multiline quoted values.
- File picker and synthetic drag/drop paths; source filename retained for pack naming.
- Empty and whitespace-only input guidance; unclosed-quote finding; missing required values; uneven rows; blanks; case-insensitive duplicates; unsafe media; formula-like values.
- Exact 5 MiB file accepted; 5 MiB + 1 byte rejected with actionable guidance.
- Exported pack schema/version/fields, ISO timestamp, case-insensitive deduplication, incomplete-row omission, HTTPS media retention, unsafe media removal, tag splitting, and formula neutralization.
- Source HTML payload rendered inert; no injected element or script execution.
- Loaded page continued parsing after the browser was switched offline and displayed its offline state.
- `/privacy`, `/terms`, and `/format` loaded with one `main` and one `h1`.

Failed cases are SMIC-QA-01 through SMIC-QA-03 above.

## Accessibility and responsive evidence

- Automated axe-core Playwright scans using WCAG 2 A/AA tags found **zero violations at any impact level** on local desktop initial, local 390 px populated, and live desktop populated states; therefore serious/critical count is zero.
- `<html lang="en">`, descriptive title, one `h1`, one `main`, heading order, labelled controls, table caption, image alt text, skip link, and live status region are present.
- Keyboard file chooser works with Enter. No trap was found. Mapping focus continuity fails as documented.
- `prefers-reduced-motion: reduce` matched; transforms became `none` and transition duration became `1e-05s`.
- At 390 × 844, both initial and populated document `scrollWidth` remained 390 px; the stacked mapping UI replaced the desktop table, and the 640 px AVIF loaded successfully.
- Full-page desktop and mobile visual review found no clipping, overlap, obscured fixed bar, or illegible state. The touch exceptions are documented above.

## Privacy, requests, and response policies

The initial application made four requests only: same-origin HTML, hashed JS, hashed CSS, and responsive AVIF. Inspecting and exporting user material added no network request. `localStorage`, `sessionStorage`, cookies, and service-worker controller were empty; no analytics, third-party font, external script, or external media request was present.

Live response policy evidence:

```text
HTTP/2 200
Strict-Transport-Security: max-age=10886400; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cache-Control: public, must-revalidate, max-age=30
```

JS and CSS are Brotli-compressed with `Vary: Accept-Encoding`. OPTIONS returns 204 with `Allow: GET, HEAD, OPTIONS`; POST returns 405. No user material is sent outbound.

## Deployment identity and build budgets

The live root returned HTTP/2 200 with a valid certificate. Live and local production SHA-256 values match:

```text
index.html                    2c8f8f950438fb462a0167f22ec25aefab501eb2aff31da94a07312d0f2c724b
assets/index--IINGD4O.js     652bb75d2857b8ba27703c2dd122626a5e61aaaf7b15ca27110443d9cd7694fc
assets/index-DkvXFLKu.css    7b6c36e798b2164c00ed90d02e6b58bdfe377d6ddcc8d67a9847f28125bdbc15
```

All five hero asset hashes also match. This establishes that the deployment is the candidate build, despite the app not exposing a separate build-identity endpoint.

Production artifact sizes:

```text
JavaScript  20,007 B raw / 8.00 kB gzip   (budget <= 200 kB)
CSS         13,907 B raw / 4.12 kB gzip   (budget <= 50 kB)
Fonts       0 B                            (budget <= 120 kB)
Mobile AVIF 14,158 B                       (budget <= 300 kB)
```

Fresh live mobile Lighthouse 13.0.1 results:

```text
Performance 100; Accessibility 100; Best Practices 100; SEO 92
FCP 0.768 s; LCP 0.907 s; Speed Index 0.768 s; TBT 43 ms; CLS 0; TTI 0.907 s
4 requests; 27,576 B transferred; 0 third-party requests
```

No lab INP value is emitted for a page-load Lighthouse run; tested interactions responded without observable delay.

## Release decision

Do not accept candidate `48152d26250df02bd96cee8db2e9c57d8dc4e5a1` as complete. Fix SMIC-QA-01 and SMIC-QA-02, add regression tests for unique mappings and zero-card CSV export, then rerun keyboard, cache/header, mobile target, axe, build, and live-parity checks.
