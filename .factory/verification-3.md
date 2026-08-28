# Independent product verification — Study Material Import Check

## Verdict: PASS

Candidate `7e744f25e22d2dd39e60a6b3fec0aba7427d87e4` was independently verified on 2026-08-28 from a clean checkout and against <https://study-material-import-check.sociobot.in>. The live deployment is healthy, byte-for-byte matches the candidate production build, and meets the researched brief and factory acceptance contract.

No product code was changed. This report and the handoff update are the only repository changes made by verification.

## Acceptance summary

| Area | Result | Fresh evidence |
| --- | --- | --- |
| Core inspect/map/export job | **PASS** | CSV, TSV, plain text, paste, file, and drag/drop journeys worked. Findings were intelligible; mapping stayed unique; JSON and CSV exports were correct and sanitized. |
| Invalid input and recovery | **PASS** | Empty, incomplete, duplicate, uneven, unsafe-media, formula-like, unclosed-quote, oversize, and injected-HTML cases were handled without a crash or unsafe export. Recovery produced a valid export. |
| Install, lint, type, test, build | **PASS** | `npm ci`, ESLint, strict TypeScript, 4 Vitest tests, 17 Playwright tests plus 1 intentional desktop skip, exact production build, and high-severity audit all passed. |
| Desktop, 390 px mobile, 320 px reflow | **PASS** | No horizontal overflow, clipping, overlap, hidden controls, or undersized effective touch targets. Mobile uses its intended stacked mapping view. |
| Accessibility and keyboard | **PASS** | Zero axe serious/critical findings on initial, populated, legal, format, and 404 states; Lighthouse accessibility 100; skip navigation, file chooser, mapping focus continuity, live feedback, and visible focus passed. |
| Privacy and outbound traffic | **PASS** | No content upload, analytics, cookies, local/session storage, service worker, CDN, external script/font, or third-party request was observed. Source HTML remained inert. |
| Security and response policy | **PASS** | CSP, HSTS, `nosniff`, no-referrer, and disabled camera/microphone/geolocation are live. OPTIONS is 204; POST is 405. |
| Caching and bundle budgets | **PASS** | Hashed assets are Brotli-compressed and one-year immutable; conditional request returns 304; AVIF has the correct MIME. JS 21,539 B, CSS 14,010 B, fonts 0 B, mobile hero 14,158 B. |
| Performance | **PASS** | Fresh live Lighthouse mobile: 100/100/100/100; LCP 1.063 s, TBT 30 ms, CLS 0. Recorded interaction duration peaked at 120 ms. |
| Deployment identity | **PASS** | Live HTML, hashed JS/CSS, and responsive AVIF match the clean local build by SHA-256. |
| Docs, legal, visual thesis | **PASS** | README, MIT license, privacy, terms, open-format documentation, product-specific design tokens, motion policy, and original-asset provenance are present. |

## Defects by severity

- Critical: none.
- Major: none.
- Minor: none.

The earlier repaired defects around duplicate roles, header-only CSV export, focus continuity, cache/MIME policy, mobile targets, and unknown routes did not reproduce.

## Clean checkout and repository gates

The checkout began at exactly the requested commit with no changes:

```text
git rev-parse HEAD
7e744f25e22d2dd39e60a6b3fec0aba7427d87e4

git status --short --branch
## main...origin/main
```

Environment: Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`, Chromium from the preinstalled Playwright browser set.

Commands and results:

```text
npm ci
  139 packages installed; 0 vulnerabilities

npm run lint
  ESLint passed

npm run typecheck
  TypeScript strict no-emit check passed

npm test
  Vitest: 1 file, 4/4 tests passed
  Playwright: 17 passed, 1 expected desktop skip
  Projects: desktop Chromium and 390 x 844 mobile

npm run build
  TypeScript passed; Vite 7.3.6 built 5 modules; dist/index.html produced

npm audit --audit-level=high
  0 vulnerabilities
```

This is a static web app, not a published library, CLI, backend, or PWA. Consumer-package installation, backend concurrency/persistence/health, and service-worker update testing are therefore not applicable. The loaded app was still exercised after the browser was put offline.

## Independent end-to-end coverage

Passed normal and format cases:

- Comma, tab, semicolon, pipe, and `Prompt :: Answer` parsing.
- UTF-8 BOM plus CRLF TSV file import; source filename became the pack filename.
- Quoted commas, escaped quotes, and multiline fields through unit coverage.
- Paste, file-picker, and synthetic drag/drop paths.
- Automatic header mapping, manual unique-role reassignment, preview update, findings, practice-pack JSON download, and clean CSV download.
- Manifest identity (`study-pack`, version 1), title, timestamp, fields, cards, tags, media, and portable-format documentation.

Passed malformed, boundary, security, and recovery cases:

- Empty/whitespace input gives an actionable next step and returns focus to inspection.
- Missing Prompt/Answer or zero complete cards blocks both useful export paths; no header-only file is downloaded.
- Duplicate cards are case-insensitively omitted; incomplete and blank rows are omitted.
- Non-HTTPS and script media are removed; HTTPS media is retained.
- Leading spreadsheet formula characters are apostrophe-neutralized in JSON and CSV.
- Unclosed quotes and uneven rows receive explicit findings with row context.
- Exact 5 MiB file is accepted; 5 MiB + 1 byte is rejected with guidance and focus on **Choose file**.
- Source `<img>` and `<script>` markup renders only as text and never executes.
- Invalid material could be replaced and then exported successfully without reload.
- Reassigning Prompt atomically clears its old column, announces the move, preserves focus, and exports the newly selected value.
- Offline-after-load parsing and findings continue, with `Offline — still works` visible.

## Accessibility, responsive design, and visual review

- Axe WCAG 2 A/AA scans found zero violations at any impact on the local desktop initial and local/live 390 px populated states. Fresh live scans of `/privacy`, `/terms`, `/format`, and the 404 state also found zero serious/critical findings.
- Every checked route has a descriptive title, `lang="en"`, one `main`, and one `h1`. The meaningful hero has descriptive alt text.
- Keyboard Tab first exposes the skip link. Activating it bypasses header navigation; the next Tab reaches **Check my material**. File chooser activation, inspection-to-findings focus, mapping-rerender focus, invalid-export focus, and oversize-error focus passed.
- Visible keyboard focus is a 3 px solid blue-pencil outline. Axe found no contrast failures.
- At 390 x 844, document width remained 390 px and every effective visible target measured at least 44 x 44 CSS px. At 320 px, `scrollWidth === innerWidth`.
- At 390 px the desktop table is intentionally replaced by stacked mapping controls and a compact preview. Desktop and mobile full-page screenshots were manually reviewed without clipping, overlap, obscured controls, or illegible text.
- With `prefers-reduced-motion: reduce`, the media query matched, transform was `none`, and transition duration was `0.01ms`.

## Privacy and browser requests

The app requested only same-origin HTML, hashed JavaScript, hashed CSS, and the appropriate responsive AVIF. Import, inspection, mapping, and export caused no content request. The browser reported:

```text
localStorage keys: 0
sessionStorage keys: 0
cookies: empty
service-worker registrations: 0
service-worker controller: false
third-party requests: 0
console errors: 0
page errors: 0
```

There are no external fonts, scripts, analytics, advertisements, accounts, or payment code. Data remains in browser memory and exported browser downloads.

## Live deployment, response policy, and parity

Fresh route/method results:

```text
/                    200 text/html
/privacy             200 text/html
/terms               200 text/html
/format              200 text/html
/does-not-exist      404 text/html with product not-found page
OPTIONS /            204
POST /               405
```

The valid TLS certificate covers `study-material-import-check.sociobot.in` and is valid from 2026-08-28 through 2027-02-28. The root and assets expose the configured policy:

```text
Strict-Transport-Security: max-age=10886400; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Root HTML is short cached (`public, must-revalidate, max-age=30`). Hashed JS, CSS, and image assets return `public, max-age=31536000, immutable`; JS is Brotli-compressed with `Vary: Accept-Encoding`; an ETag conditional request returned 304. AVIF returns `Content-Type: image/avif`.

Live and local SHA-256 values match exactly:

```text
09230c7267263da1936912c41e2dcf29ceb4332b1b91511b6eb2e99e25f7c460  index.html
547196daaa6d7e1dce9446b7db2ff655463853fa085913cb42a5714f6f652dd3  assets/index-DZ8IDAF7.js
d85c412e2b040138f88d4124b544ab20a46fc3f76cbd141b4c02cbbefd9a871b  assets/index-2F_h8Drk.css
f39ea86b79c1df142005fed7119b36d5a6721ae39776cd082a6be03fa8e41e64  assets/hero-paper-workshop-640.f39ea86b.avif
```

This is direct evidence that the live application matches the candidate build despite there being no separate build-identity endpoint.

## Performance and budgets

Raw production assets:

```text
JavaScript       21,539 B (gzip 8.52 kB)  budget <= 200 kB
CSS              14,010 B (gzip 4.14 kB)  budget <= 50 kB
Fonts                 0 B                 budget <= 120 kB
Mobile AVIF      14,158 B                 budget <= 300 kB
```

Fresh Lighthouse 13.0.1 mobile result on the live URL:

```text
Performance 100; Accessibility 100; Best Practices 100; SEO 100
FCP 0.986 s; LCP 1.063 s; Speed Index 1.146 s
TBT 30 ms; CLS 0; TTI 1.093 s
5 requests; 28,694 B transferred; 0 console errors
```

A page-load Lighthouse run does not emit a field INP. A fresh browser Event Timing interaction exercise recorded a maximum interaction duration of 120 ms, below the 200 ms budget.

## Release decision

Accept candidate `7e744f25e22d2dd39e60a6b3fec0aba7427d87e4`. No acceptance-blocking or follow-up product defect was found, and the previously reported deployment-only concern does not apply: the live site is available and matches this candidate.
