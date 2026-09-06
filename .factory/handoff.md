# Handoff — Study Material Import Check

## Result: PASS

Implementation candidate: `f04f432` (`fix: keep mobile navigation targets accessible`). It was deployed to <https://study-material-import-check.sociobot.in> on 2026-09-06. This handoff is documentation-only and follows that implementation candidate.

The product checks learner-owned CSV, TSV, and text study material locally before import. It finds bad rows, lets learners map fields, and exports portable JSON or sanitized CSV.

## What changed

- Added a direct, pre-populated `/demo` sandbox. It has the required persistent **Demo — sample data, nothing is saved** notice, **Reset demo**, and **Start for real** controls.
- Kept real and demo use separate. The demo uses only the temporary `sessionStorage` marker `demo:study-material-import-check`; it does not store edited input or access real material. The documented behavior is in `.factory/demo.md`.
- Rebuilt the first screen in plain words: job, learner audience, visible sample action, real-inspector action, and local/offline/free facts all appear before scrolling on desktop and phone.
- Added the required landing structure, how-it-works steps, limits/privacy section, standard header/footer, valid privacy contact, clear route titles, canonical/Open Graph/Twitter metadata, touch icon, social image, `robots.txt`, and `sitemap.xml`.
- Added `.factory/claims.json` with 17 current public behavior claims. Each has one observable Playwright test tagged `@claim:<id>` and a clean-setup command.
- Added outcome-based coverage for demo reset/isolation, file formats and limit, findings and repairs, mapping focus/export correctness, downloads, local processing, memory-only handling, offline-after-load behavior, legal/format copy, routes, keyboard, mobile targets, reduced motion, and axe scans.
- Added `.factory/copy-audit.md` and updated the design provenance for the derived social and touch assets.
- Added `.factory/catalog-description.txt` and copied the same verb-first 82-character description to `/work/.evidence/catalog-description.txt`.

## Review finding disposition

| Finding | Disposition |
| --- | --- |
| SMIC-R1-01 demo sandbox | Fixed. `/demo` opens the five-row sample; banner, reset, start-real, isolation, and `.factory/demo.md` are present and tested. |
| SMIC-R1-02 untested public claims | Fixed. The current product has 17 public behavior claims, each with exactly one tagged, observable test. The former test-suite/deployment statements were removed as product-facing claims rather than left untestable. |
| SMIC-R1-03 first-screen information | Fixed. The root first screen identifies the job, learner audience, sample action, real action, and three facts. |
| SMIC-R1-04 metaphor copy and missing audit | Fixed. Product headings now name their sections and `.factory/copy-audit.md` records landing and demo copy. |
| SMIC-R1-05 metadata and discovery | Fixed. Route titles are concise; canonical, social cards, 1200 × 630 product image, touch icon, robots, and sitemap ship. |
| SMIC-R1-06 standard structure/footer | Fixed. Header has Demo/Inspector/Format/Privacy; landing includes three steps and limits; footer identifies Param Factory and version. |
| SMIC-R1-07 broad offline wording | Fixed. Copy now promises only offline-after-load behavior, and that exact behavior is claim-tested in its own browser context. Offline reload is not promised. |
| SMIC-R1-08 privacy contact | Fixed. Privacy now links to the public repository issue page. |
| QA-01 unique mapping | Still fixed. Moving Prompt clears its prior assignment, retains focus, and exports the newly selected column. |
| QA-02 header-only CSV | Still fixed. Invalid source downloads nothing and focuses the corrective action. |
| QA-03 mapping focus | Still fixed by the mapping regression test. |
| QA-04 asset caching/MIME | Still fixed. Live hashed JS is immutable and the AVIF is `image/avif`. |
| QA-05 mobile targets | Still fixed. A fresh 390 px test and live phone check measure all brand/header/footer navigation targets at least 44 × 44 CSS px. |
| QA-06 missing routes | Still fixed. `/does-not-exist` returns HTTP 404 with the designed recovery page. |

## Clean verification

From the documented clean setup, using Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`, and preinstalled Chromium:

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npm test
npm audit --audit-level=high
```

All passed. `npm test` reported 4/4 Vitest tests and 40 passing Playwright checks; two project-inapplicable desktop copies of mobile-only tests were skipped. All 17 exact claim commands from `.factory/claims.json` were then run individually and passed.

Local and live automated accessibility checks use the installed `@axe-core/playwright` integration. The final live phone scan found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, `/format`, and `/does-not-exist`. The factory `verify-url.sh` passed against the final HTTPS root: descriptive title, `lang=en`, one `<h1>`, main landmark, image alt text, labelled buttons, and zero console errors.

## Live deployment and performance

The durable static deployment reused the existing `sf-study-material-import-check` application and its existing custom domain. No backend, volume, billing, or external integration applies to this free static product.

- Live root, demo, legal/format routes, robots, and sitemap returned 200; intentional unknown route returned 404.
- Live HTML and final JavaScript hash-matched the candidate build (`index-BgelIvaZ.js`).
- HTTPS responses retain CSP, no-referrer, nosniff, permissions policy, one-year immutable hashed asset caching, and AVIF MIME type.
- Fresh desktop and 390 × 844 phone contexts both saw the job, audience, sample action, and three facts before scrolling. Both completed the sample findings, reset, and start-real path with zero console errors.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,063 ms, TBT 42 ms, CLS 0.
- Final build assets: JavaScript 26,424 B raw / 9.98 kB gzip; CSS 16,940 B raw / 4.62 kB gzip; mobile AVIF 14,158 B. All are within the static-product budgets.

## Known limits and next steps

There are no known acceptance-blocking gaps. The app deliberately does not promise offline reload because it does not install a service worker; it continues working only after the page has loaded. It is a free product, so no billing offer metadata is needed. The next step is independent review of implementation `f04f432` and this handoff documentation.
