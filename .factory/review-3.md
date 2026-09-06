# Review 3 — Check study files before import

## Verdict: PASS

Reviewed on 2026-09-06 UTC at <https://study-material-import-check.sociobot.in>.

- Findings: **0** — 0 critical, 0 major, 0 minor.
- Untested public claims: **0**.
- Implementation candidate: `0dd872fa2b1b3bfa2c266bfbe9be3e1e990bcae5` (`fix: preserve real workspace during demo`).
- Documentation/report baseline: `42f629c3b15768ade6dab92c0de20d8764de29fc`.
- Product code changed by this review: none.

## Job, audience, and first action

Fresh live 1440 × 900 desktop and 390 × 844 phone contexts opened the root route at scroll position zero, before scrolling.

| Check | Visible result | Result |
| --- | --- | --- |
| Job | “Check study files before you import.” | Pass |
| Audience | “For learners bringing their own notes into practice…” | Pass |
| First action | “Try it with sample data” | Pass |
| Result | “See five rows checked and three safe cards ready to export.” | Pass |
| Facts | Local only; works after loading offline; free under MIT. | Pass |

The final fact ended at 691 px on desktop and 742 px on phone, within their 900 px and 844 px viewports. Both pages had zero horizontal overflow. Fresh screenshots were visually inspected: the paper-workshop art, warm paper palette, legible type, and clear actions match the documented product-specific visual system.

## Live workflow and recovery

The one-click action opened `/demo`. The persistent **Demo — sample data, nothing is saved** label remained during the sample flow. The realistic five-row sample exported `untidy-sample.study-pack.json` with `format: "study-pack"`, `version: 1`, and three sanitized cards. **Reset demo** restored the shipped sample and **Start for real** returned a direct demo visit to the empty real inspector.

Active real work was independently checked: a real three-column source was inspected, Prompt was mapped to the third column, then Demo, browser Back, browser Forward, reset, and **Start for real** were exercised. The original source and `ignore, answer, prompt` mapping returned unchanged, and the `demo:study-material-import-check` marker was removed. No real material was written to browser storage.

Normal CSV, TSV, plain-text, paste, file-picker, and drag/drop paths are exercised by the claim suite. Fresh live invalid/recovery checks also passed: an unclosed quote produced an **Unclosed quote** finding, replacing the source with a valid card produced **Everything looks tidy**, and focus moved to the findings heading. The declared boundary test accepts exactly 5 MiB and rejects one byte over with focused guidance. Empty, incomplete, duplicate, formula-like, unsafe-media, malformed, and invalid-export paths have corrective outcomes in the suite.

## Claims and clean checkout

A detached clean checkout at documentation SHA `42f629c3b15768ade6dab92c0de20d8764de29fc` was used with Node `v22.23.2`, npm `10.9.8`, and Playwright `1.58.2` Chromium.

| Command | Result |
| --- | --- |
| `npm ci` | Pass — 139 packages installed, 0 vulnerabilities. |
| `npm run lint` | Pass. |
| `npm run typecheck` | Pass. |
| `npm test` | Pass — 4 Vitest tests; 40 Playwright passes and 2 expected desktop skips. |
| `npm run build` | Pass — `dist/index.html` produced. |
| `npm audit --audit-level=high` | Pass — 0 vulnerabilities. |

`.factory/claims.json` has 17 unique claim IDs and the browser suite has exactly 17 unique registered `@claim:` tags: no IDs are missing or unregistered. Every listed exact claim command was run separately. Each passed in both Chromium desktop and the 390 px mobile project. The live landing page, README, legal pages, format page, and footer were cross-checked against that registry. There are no missing, false, incomplete, or untested public claims.

The clean production build matches live byte for byte:

```text
ad5aace31c6cf121ff093e78220487795c84d76d50a3e49177b7bb37f3e29663  index.html
f57a991701c25115a0dcf96d8f267550527aa0e527bc871b02627ddc75fbcf63  assets/index-BVom8h6Y.js
f79acf2334e189c65db5bf621eb976c0d62c06d9b8847e56573fd88a7d12914f  assets/index-ChWvPq1P.css
```

The final build has 26.85 KiB raw JavaScript and 16.94 KiB raw CSS.

## Accessibility, routes, privacy, and performance

- `/opt/fleet/lib/verify-url.sh` passed against the live root: title, `lang=en`, one `h1`, one `main`, image alt text, labelled controls, and zero console/page errors.
- Fresh live axe WCAG 2 A/AA scans found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, `/format`, and `/does-not-exist`.
- Keyboard checks pass: the first Tab reaches the skip link; mapped-field changes retain focus; the 390 px tests confirm 44 px navigation targets. Reduced motion uses a 0.01 ms transition and no transform motion.
- `/`, `/demo`, `/privacy`, `/terms`, `/format`, `robots.txt`, and `sitemap.xml` return 200. `/does-not-exist` returns the deliberate product-designed HTTP 404 with a recovery link; this is expected behavior.
- Live product-flow requests stayed same-origin, with zero cookies, analytics, accounts, uploads, external fonts, or third-party product requests. The only offline promise is the verified loaded-page behavior; offline reload and updates are not claimed.
- Live headers include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, no-referrer, and disabled camera, microphone, and geolocation. Hashed assets are immutable and AVIF is served with its correct type.
- Fresh mobile Lighthouse 13.4.1 scored Performance **100**, Accessibility **100**, Best Practices **100**, and SEO **100**: FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, and 30 KiB transfer.

This is a static local-first product. It has no backend, database, tenant, health endpoint, rate limit, payment, consumer-installed artifact, service worker, or AI feature, so backend restart/429, billing, installed-artifact, update, and AI checks do not apply. A deterministic local inspector fully performs the brief’s parsing, mapping, sanitation, and portable-export job without disclosing learner material to a model.

## Earlier finding disposition

| Finding | Current disposition |
| --- | --- |
| SMIC-QA-01 through SMIC-QA-06 | Fixed and retained: unique mapping, blocked zero-card CSV, focus retention, cache/MIME, 44 px targets, and designed HTTP 404. |
| SMIC-R1-01 | Fixed: direct isolated demo, persistent label, reset, exit, and documented namespace work. |
| SMIC-R1-02 | Fixed: 17 declared claims have one outcome test each, and every exact command passed. |
| SMIC-R1-03 | Fixed: job, audience, sample action, outcome, and three facts fit on both first screens. |
| SMIC-R1-04 | Fixed: plain headings are used and the landing audit includes both footer sentences. |
| SMIC-R1-05 through SMIC-R1-08 | Fixed and retained: metadata/discovery, site structure, narrow offline wording, and usable privacy contact. |
| SMIC-R2-01 | Fixed: real in-memory source and mapping survive Demo, reset, exit, Back, and Forward. |
| SMIC-R2-02 | Fixed: both footer sentences are recorded in the copy audit. |

## Evidence

- Live screenshots: `/work/.evidence/review-3-live-desktop.png`, `/work/.evidence/review-3-live-phone.png`, and populated-demo counterparts.
- Factory URL check: `/work/.evidence/review-3-verify-url/verify.json`.
- Lighthouse: `/work/.evidence/review-3-lighthouse-live.json`.
- Clean-checkout commands, all exact claim commands, live route/header checks, and axe results were run in this review as described above.

## Release decision

**PASS.** Accept implementation `0dd872fa2b1b3bfa2c266bfbe9be3e1e990bcae5`. There are zero findings of every severity and zero untested public claims.
