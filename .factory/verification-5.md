# Verification 5 — Check study files before import

## Verdict: PASS

Implementation candidate `0dd872fa2b1b3bfa2c266bfbe9be3e1e990bcae5` passes independent verification on 2026-09-06 UTC. Documentation SHA `e0fd7c7270b01d6b71fbcbf6a862f149f488a60b` follows the candidate; the only files changed after the implementation are `.factory/handoff.md` in `44f5f53` and `e0fd7c7`.

- Findings: **0** — 0 critical, 0 major, 0 minor.
- Untested public claims: **0**.
- Live URL: <https://study-material-import-check.sociobot.in>.
- Product code changed by this verification: none.

## Job, audience, and first action

Fresh 1440 × 900 desktop and 390 × 844 phone browser contexts opened the live root at scroll position zero before any scrolling.

| Check | Visible result | Result |
| --- | --- | --- |
| Job | “Check study files before you import.” | Pass |
| Audience | “For learners bringing their own notes into practice…” | Pass |
| First action | “Try it with sample data” | Pass |
| Result after action | Five rows are checked and three safe cards are ready to export. | Pass |
| Facts | Local only; works after loading when offline; free under MIT. | Pass |

The bottom of the third fact was at 691 px on desktop and 742 px on phone, within the respective viewports. The landing title is `Study Material Import Check — check study files`.

## Live product flow

The visible sample action opened `/demo` in one click. The persistent **Demo — sample data, nothing is saved** label remained after export. The realistic sample exported `untidy-sample.study-pack.json` with `format: "study-pack"`, `version: 1`, and three cards. Editing the sample and choosing **Reset demo** restored the shipped sample. A direct demo exit cleared the temporary marker and returned to an empty real inspector.

The repaired isolation behavior was independently retested with active real material and a non-default mapping. The real source and `ignore, answer, prompt` mapping both survived entering Demo, browser Back, browser Forward, editing/resetting the demo, and **Start for real**. The demo marker was absent after exit. This resolves SMIC-R2-01 and verifies the strengthened `@claim:demo-sandbox` outcome coverage.

Normal CSV, TSV, plain-text, paste, file-picker, and drag/drop behavior is covered by the claim suite. Invalid empty, incomplete, duplicate, formula-like, unsafe-media, malformed, and over-limit material has a recovery path; the exact 5 MiB boundary is accepted and one byte over is rejected with focused guidance. The offline promise is appropriately narrow: a loaded page continues to inspect after connectivity drops; offline reload and service-worker updates are not promised.

## Claims and clean checkout

A fresh detached checkout at documentation SHA `e0fd7c7` was clean before installation. Environment: Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`, and the supplied Chromium browser.

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 139 packages, 0 vulnerabilities |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm test` | Pass; 4 Vitest tests, 40 Playwright passes, 2 expected desktop skips |
| `npm run build` | Pass; `dist/index.html` produced |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities |

`.factory/claims.json` declares 17 unique claims. The test source has exactly 17 unique registered `@claim:` tags, with no missing or unregistered IDs. Every exact claim command was run separately from the clean checkout; all 17 commands passed in desktop and mobile projects. The live page, README, legal pages, format page, and footer were cross-checked against the registry. There are no missing, false, incomplete, or untested public claims.

## Accessibility, routes, privacy, and performance

- The supplied `verify-url.sh` passed live: title, `lang=en`, one `h1`, one `main`, image alt text, labelled buttons, and zero console/page errors.
- Fresh axe WCAG 2 A/AA scans found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, `/format`, and `/does-not-exist`.
- Desktop and phone runs had no console errors. The first keyboard Tab reaches the skip link. Phone demo width remained 390 px with no horizontal overflow. Reduced motion reports a `0.01ms` transition and no transform.
- All named routes returned 200. `/does-not-exist` returned the deliberate, product-designed HTTP 404 with one `h1` and one `main`; this is expected behavior, not a defect. Published internal and privacy-contact links returned 200.
- Requests during the product flow are same-origin. There are no accounts, cookies, analytics, uploads, external fonts, or third-party product requests. The static product has no backend, database, health endpoint, tenant, rate limit, installed consumer artifact, payment, or service worker, so backend restart/429, consumer-install, billing, and update checks do not apply.
- Live responses include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, no-referrer, and disabled camera, microphone, and geolocation. Hashed JS and AVIF assets use one-year immutable caching; AVIF is served as `image/avif`.
- Fresh mobile Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 0 ms, CLS 0, 30 KiB transfer.

The clean production build and live deployment match by SHA-256:

```text
ad5aace31c6cf121ff093e78220487795c84d76d50a3e49177b7bb37f3e29663  index.html
f57a991701c25115a0dcf96d8f267550527aa0e527bc871b02627ddc75fbcf63  assets/index-BVom8h6Y.js
f79acf2334e189c65db5bf621eb976c0d62c06d9b8847e56573fd88a7d12914f  assets/index-ChWvPq1P.css
```

## Earlier finding disposition

| Finding | Current disposition |
| --- | --- |
| SMIC-QA-01 | Fixed: role reassignment clears the old mapping and exports the chosen source field. |
| SMIC-QA-02 | Fixed: zero-card CSV export is blocked with corrective guidance. |
| SMIC-QA-03 | Fixed: mapping changes retain keyboard focus. |
| SMIC-QA-04 | Fixed: hashed assets are immutable and AVIF has the correct MIME type. |
| SMIC-QA-05 | Fixed: effective mobile targets meet 44 × 44 CSS px. |
| SMIC-QA-06 | Fixed: unknown routes return the designed HTTP 404. |
| SMIC-R1-01 | Fixed: direct demo, visible label, reset, exit, namespace, and real-session isolation pass. |
| SMIC-R1-02 | Fixed: 17 registered claims each have one outcome test and were run separately. |
| SMIC-R1-03 | Fixed: first screen has job, audience, sample action, outcome, and three facts. |
| SMIC-R1-04 | Fixed: plain headings are used and the footer sentences appear in `.factory/copy-audit.md`. |
| SMIC-R1-05 | Fixed: metadata, social image, touch icon, robots, and sitemap are present. |
| SMIC-R1-06 | Fixed: header, how-it-works, limits, and footer structure are present. |
| SMIC-R1-07 | Fixed: the offline wording promises loaded-page behavior only. |
| SMIC-R1-08 | Fixed: the GitHub privacy-contact link works. |
| SMIC-R2-01 | Fixed: active real source and mapping restore after Demo, reset, exit, Back, and Forward. |
| SMIC-R2-02 | Fixed: both published footer sentences are in the copy audit. |

## Evidence

- Clean gates: `/work/.evidence/verification-5-gates.log`
- Exact claim commands: `/work/.evidence/verification-5-claims.log`
- Live browser and axe results: `/work/.evidence/verification-5-live-browser.json`
- Live screenshots: `/work/.evidence/verification-5-live-desktop.png`, `/work/.evidence/verification-5-live-phone.png`
- Factory URL check: `/work/.evidence/verification-5-verify-url/verify.json`
- Lighthouse: `/work/.evidence/verification-5-lighthouse-live.json`

## Release decision

**PASS.** Accept implementation `0dd872fa2b1b3bfa2c266bfbe9be3e1e990bcae5`. There are zero findings of every severity and zero untested public claims.
