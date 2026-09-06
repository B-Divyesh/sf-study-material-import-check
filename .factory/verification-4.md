# Verification 4 — Check study files before import

## Verdict: PASS

Implementation candidate `f04f432808c14465310dfb9b9954ca1f63b49749` passes independent verification. Documentation SHA `7f36e1d21706f90fe8c75ba6006e8f35e22841a3` changes only `.factory/handoff.md` after the implementation. The live site at <https://study-material-import-check.sociobot.in> matches the candidate build.

- Findings: **0** — 0 critical, 0 major, 0 minor.
- Untested public claims: **0**.
- Verified: 2026-09-06 UTC.
- Product code changed by this verification: none.

## First screen

Fresh 1440 × 900 desktop and 390 × 844 phone contexts started at the top of the live page.

| Required answer | Visible text before scrolling | Result |
| --- | --- | --- |
| Job | “Check study files before you import.” | Pass |
| Audience | “For learners bringing their own notes into practice…” | Pass |
| First action | “Try it with sample data” with the five-row outcome beside it | Pass |
| Plain facts | Local only, works after loading when offline, and free under MIT | Pass |

On phone, the bottom of the three facts ended at 742 CSS px in an 844 px viewport. On desktop it ended at 691 CSS px in a 900 px viewport. Both were measured before scrolling. The title names the job, and the page uses direct section names rather than metaphor headings.

## Demo and main job

The live one-click sample opened `/demo` with five realistic study rows already inspected. It reported one incomplete card, one later duplicate, two unsafe media links, and one formula-like value. The output panel correctly said that three of five source rows would become cards.

The persistent **Demo — sample data, nothing is saved** label remained visible after export. The downloaded `untidy-sample.study-pack.json` used format `study-pack`, version `1`, and contained three cards. It retained the HTTPS image, removed unsafe media, omitted incomplete and duplicate cards, and prefixed the formula-like prompt with an apostrophe.

**Reset demo** restored the shipped sample. **Start for real** removed the `demo:study-material-import-check` marker and opened an empty real inspector. Independent isolation checks placed unrelated `real:test` values in both local and session storage; demo reset and exit preserved them. The sample never entered those values, and private real input was absent after reload.

Normal CSV, TSV, plain text, paste, file-picker, and drag-and-drop paths worked. Invalid and recovery checks covered empty input, an incomplete card, a missing exportable card set, duplicate role reassignment, an unclosed quote, unsafe HTML, and replacement with valid input. Boundary checks accepted exactly 5 MiB and rejected 5 MiB plus one byte with guidance and focus on **Choose file**. Formula-like prompt, answer, hint, and tag values were all neutralized.

## Public claims

`.factory/claims.json` contains 17 claims. Source inspection found exactly one `@claim:<id>` test definition for each registry item and no unregistered tags. Every exact `test` command was run separately from the clean checkout; each passed in desktop Chromium and the 390 px mobile project.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `input-files` | Pass | CSV, TSV, and text files each produced one inspected exportable row. |
| `input-shapes` | Pass | Comma, tab, semicolon, pipe, and `Prompt :: Answer` sources parsed cleanly. |
| `incomplete-cards` | Pass | Finding appeared; incomplete row was absent from the three-card pack. |
| `duplicates` | Pass | Finding appeared; exported prompt-answer pairs were unique. |
| `formula-safety` | Pass | Formula-like values received an apostrophe in exports. |
| `media-safety` | Pass | HTTPS media remained; HTTP and script media were blank. |
| `unique-mapping` | Pass | Moving Prompt cleared the old role, kept focus, and exported the selected column. |
| `practice-pack` | Pass | Filename, format, version, fields, and three cards matched the documented manifest. |
| `clean-csv` | Pass | CSV header, row count, formula prefix, and unsafe-link removal passed. |
| `local-processing` | Pass | The complete demo export flow made only same-origin GET requests. |
| `memory-only` | Pass | Private real input disappeared on reload and was absent from browser storage. |
| `no-tracking` | Pass | No cookies, accounts, analytics request, or third-party product request appeared. |
| `offline-after-load` | Pass | A loaded demo parsed replacement material after its browser context went offline. |
| `mit-license` | Pass | The live terms and repository license state MIT free use. |
| `portable-format` | Pass | The live format and actual export contain no proprietary identifier or service dependency. |
| `file-limit` | Pass | Exactly 5 MiB passed; one byte more failed with focused recovery guidance. |
| `demo-sandbox` | Pass | Direct sample, persistent label, reset, real-mode exit, marker removal, and isolation passed. |

Landing, inspector, legal, format, footer, and README copy were cross-checked against this registry. Input-method wording is covered by the file and input-shape claims and was also exercised through paste, chooser, and drop. Export, sanitation, privacy, storage, offline, licensing, portability, limit, and demo statements all have registered outcome evidence. There are no missing, false, incomplete, or untested public claims.

## Clean checkout

A detached checkout at documentation SHA `7f36e1d` was clean before dependency installation. That SHA contains implementation `f04f432`; its only later change is the prior handoff report. Environment: Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`, and the preinstalled Chromium browser.

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 139 packages, 0 vulnerabilities |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; `dist/index.html` produced |
| `npm test` | Pass; 4 parser tests and 40 browser checks; 2 expected desktop copies of mobile-only checks skipped |
| `npm audit --audit-level=high` | Pass; 0 vulnerabilities |
| All 17 commands in `.factory/claims.json` | Pass individually; 34 project executions |

The production build contains 26,424 B JavaScript, 16,940 B CSS, no web fonts, and a 14,158 B mobile AVIF. These are below the product budgets.

## Accessibility, keyboard, phone, and motion

- The factory `verify-url.sh` passed the live root with a descriptive title, `lang=en`, one `h1`, a main landmark, complete image alt text, labelled buttons, and zero console errors.
- Live axe WCAG 2 A/AA scans found zero serious or critical violations on `/`, populated `/demo`, `/privacy`, `/terms`, `/format`, and the designed 404.
- Heading levels were checked on every route without a skipped level. Each route has one `h1`, one `main`, a consistent header, and a footer.
- The first Tab exposed the skip link. Activating it bypassed header navigation. Keyboard activation opened the file chooser; Space changed the header checkbox; Arrow Down changed a mapping select. Focus remained on rerendered controls.
- The visible focus treatment was a 3 px solid blue outline. Form errors used the live status region and moved focus to the corrective action.
- At 390 px and 320 px, root and populated demo widths matched the viewport. The phone layout used stacked mapping controls and had no clipped or overlapping content.
- All effective phone targets measured at least 44 × 44 CSS px. The visually hidden file input has a 51 px button proxy, and the 20 px checkbox sits in a 44 px label.
- With reduced motion requested, transforms were removed and transition duration was `0.01ms`. There is no autoplay, flashing content, or dialog.

Desktop and phone screenshots were reviewed visually. The paper-workshop design is product-specific, readable, and consistent with `.factory/design.md`.

## Routes, privacy, offline behavior, and security

`/`, `/demo`, `/privacy`, `/terms`, `/format`, `robots.txt`, `sitemap.xml`, the social image, and the touch icon returned 200. `/does-not-exist` intentionally returned HTTP 404 with the product-designed recovery page; this is expected behavior, not a defect. Browser back and forward restored the correct route and focused its `h1` after client navigation.

Every published link was crawled. Product routes and the public GitHub privacy-contact page returned 200. Route titles, descriptions, canonicals, Open Graph titles and URLs, and heading outlines were correct. The social image is 1200 × 630 and the touch icon is 180 × 180.

Observed product traffic used only same-origin GET requests. There were no uploads, cookies, analytics, third-party scripts or fonts, page errors, or unexpected console errors. The only HTTP error observed was the deliberate unknown-route 404. There is no service worker. This matches the narrow promise that an already loaded page keeps working after connectivity drops; offline reload and update behavior are not promised.

Live responses include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, no-referrer, and disabled camera, microphone, and geolocation. Hashed assets use one-year immutable caching, and AVIF is served as `image/avif`. `OPTIONS /` returned 204 and `POST /` returned 405. Backend tenant, restart, health, persistence, and 429 checks do not apply to this static, local-only product.

## Earlier findings

All earlier findings, including minor ones, were retested independently.

| Finding | Current disposition and evidence |
| --- | --- |
| SMIC-QA-01 duplicate roles | Fixed. Reassignment cleared the old role and exported “New question.” |
| SMIC-QA-02 header-only CSV | Fixed. Zero-card CSV export produced no download and focused actionable guidance. |
| SMIC-QA-03 mapping focus | Fixed. Mouse/programmatic and keyboard mapping changes retained focus. |
| SMIC-QA-04 cache and AVIF type | Fixed. Hashed assets are immutable for one year; AVIF uses `image/avif`. |
| SMIC-QA-05 mobile targets | Fixed. Effective targets are at least 44 × 44 at 390 px. |
| SMIC-QA-06 unknown route | Fixed. The unknown route returns the designed HTTP 404 and a working route home. |
| SMIC-R1-01 demo sandbox | Fixed. Direct sample, banner, reset, real exit, storage namespace, and isolation passed. |
| SMIC-R1-02 claim coverage | Fixed. Seventeen registered claims each have one tagged test; all commands passed. |
| SMIC-R1-03 first screen | Fixed. Job, learner audience, sample action, outcome, and three facts fit before scrolling. |
| SMIC-R1-04 copy and audit | Fixed. Headings use plain section names and `.factory/copy-audit.md` is complete. |
| SMIC-R1-05 metadata | Fixed. Route metadata, 1200 × 630 social art, touch icon, robots, and sitemap passed. |
| SMIC-R1-06 structure and footer | Fixed. Standard header, three-step section, limits, footer owner, and version passed. |
| SMIC-R1-07 offline wording | Fixed. Copy promises only loaded-page behavior, which passed offline. |
| SMIC-R1-08 privacy contact | Fixed. The live GitHub issue link opens a valid 200 page in a new tab. |

## Deployment identity and performance

Live and clean-build SHA-256 values match:

```text
26250dbfc5082f0e499be0b848bd56bf95977bfa65f125371489c459a57a5290  index.html
8e0fdd990579dcb69f769afc8ad83d0ab67a3fb38dba0626d39e6a44b59b04a9  assets/index-BgelIvaZ.js
f79acf2334e189c65db5bf621eb976c0d62c06d9b8847e56573fd88a7d12914f  assets/index-ChWvPq1P.css
f39ea86b79c1df142005fed7119b36d5a6721ae39776cd082a6be03fa8e41e64  assets/hero-paper-workshop-640.f39ea86b.avif
```

Fresh live mobile Lighthouse 13.0.1 scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 1.037 s, LCP 1.187 s, total blocking time 0 ms, CLS 0, and transfer was 30,778 B. A separate 4× CPU-throttled interaction run observed nine interaction entries with a maximum duration of 88 ms.

This deterministic local inspector does not need an AI step to complete the brief. AI would add data disclosure and a key requirement without improving the required parsing, sanitation, mapping, or portable export job, so the missed-leverage check has no finding.

## Evidence

- Factory URL check: `/work/.evidence/verify-url/verify.json`
- Live Lighthouse JSON: `/work/.evidence/lighthouse-live.json`
- Desktop first screen: `/work/.evidence/live-desktop-first-screen.png`
- Desktop populated demo: `/work/.evidence/live-desktop-demo.png`
- Phone first screen: `/work/.evidence/live-phone-first-screen.png`
- Phone populated demo: `/work/.evidence/live-phone-demo.png`

## Release decision

**PASS.** Accept implementation `f04f432808c14465310dfb9b9954ca1f63b49749`. There are zero findings of every severity and zero untested claims.
