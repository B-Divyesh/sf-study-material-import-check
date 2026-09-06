# Handoff — Check study files before import

## Result: PASS

- Implementation SHA: `0dd872fa2b1b3bfa2c266bfbe9be3e1e990bcae5` (`fix: preserve real workspace during demo`).
- Prior strict-review documentation SHA: `a41dcc296ecb9da0d6d0f3c9eecb298065eba6d7`.
- The implementation is deployed to <https://study-material-import-check.sociobot.in>.

## What changed

- Demo entry now saves the active real workspace in memory, then uses a separate demo workspace. Resetting demo changes only the sample. Leaving demo restores the exact real source, parsed state, mapping, filename, and status; a direct `/demo` visit still returns to an empty real inspector.
- The `@claim:demo-sandbox` outcome test now covers direct demo, edited sample, reset, direct exit, real material with a changed mapping, header Demo entry, browser Back/Forward, reset, exit, and removal of the demo marker. It runs in both desktop and phone projects.
- The landing copy audit now includes both published footer sentences.
- README and demo documentation now describe restoring active real work accurately.

## Verification

From the documented clean setup (Node 20.19+; tested with Node 22.23.2 and Playwright 1.58.2):

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
```

All commands passed. `npm test` had 4/4 Vitest tests and 40 passed Playwright executions, with 2 expected desktop skips for mobile-only measurements. The build writes `dist/index.html`; final assets are 26.85 KB JavaScript raw and 16.94 KB CSS raw. The high-severity audit found 0 vulnerabilities.

All 17 exact commands in `.factory/claims.json` were run separately from the clean setup in both browser projects; each passed. The strengthened demo claim is outcome-based, not a source-string assertion.

Local checks passed with `/opt/fleet/lib/verify-url.sh`: descriptive title, `lang=en`, one `h1`, one `main`, complete image alt text, labelled controls, and no console errors. The browser-based axe checks found zero serious or critical WCAG 2 A/AA findings across root, populated demo, Privacy, Terms, Format, and the designed 404. The standalone axe CLI could not launch its Selenium Chrome driver in this image; the Playwright axe integration is the applicable successful check.

## Deployment and live checks

The durable static deployment helper reused `sf-study-material-import-check` in `eastus2`; upload deployment `fc90316e-78b7-4cc9-a828-21029ec25542` succeeded. Live HTML, JavaScript, and CSS match the local build by SHA-256:

```text
ad5aace31c6cf121ff093e78220487795c84d76d50a3e49177b7bb37f3e29663  index.html
f57a991701c25115a0dcf96d8f267550527aa0e527bc871b02627ddc75fbcf63  assets/index-BVom8h6Y.js
f79acf2334e189c65db5bf621eb976c0d62c06d9b8847e56573fd88a7d12914f  assets/index-ChWvPq1P.css
```

Fresh 1440 × 900 desktop and 390 × 844 phone contexts opened the live root at scroll position zero. Both showed the job, learner audience, sample action, outcome, and all three facts before scrolling. In both contexts, the one-click sample showed five source rows and three exportable cards; its label persisted after export; Reset demo restored the shipped sample; and exiting a demo entered from active real work restored the original source and `ignore, answer, prompt` mapping unchanged. There were no console errors.

Fresh live axe scans on `/`, `/demo`, `/privacy`, `/terms`, `/format`, and `/does-not-exist` reported zero serious or critical findings. All pages have their route title, one `h1`, one `main`, and no 390 px overflow; the skip link is first in keyboard order. Live offline-after-load inspection worked after the demo page loaded, and its only requests were same-origin HTML, JavaScript, and CSS with no cookies.

Live `/`, `/demo`, `/privacy`, `/terms`, `/format`, `robots.txt`, and `sitemap.xml` return 200. The product-designed unknown route returns its intended HTTP 404. CSP, HSTS, `nosniff`, no-referrer, permissions policy, correct AVIF MIME, and immutable hashed-asset caching are live. Mobile Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, TBT 0 ms, CLS 0, and 30 KiB transfer.

`.factory/catalog-description.txt` remains the verb-first, 81-character description and was copied exactly to `/work/.evidence/catalog-description.txt`.

## Earlier finding disposition

| Finding | Current disposition |
| --- | --- |
| SMIC-QA-01 through SMIC-QA-06 | Fixed and retained: unique mapping, blocked zero-card CSV, focus retention, asset cache/MIME, 44 px targets, and designed HTTP 404. |
| SMIC-R1-01 through SMIC-R1-08 | Fixed and retained: isolated demo, claim registry, first-screen information, plain copy/audit, metadata, site structure, narrow offline wording, and privacy contact. |
| SMIC-R2-01 | Fixed: real in-memory workspace survives demo entry, reset, exit, and Back/Forward. |
| SMIC-R2-02 | Fixed: both footer sentences are included in `.factory/copy-audit.md`. |

## Known scope limits

This is a free, local-only static utility. It has no account, payment, backend, database, service worker, or external AI integration. Offline reload and service-worker update behavior are not claimed; an already loaded page continues to inspect material offline. No paid offer exists, so billing registration metadata does not apply. The deterministic parser, mapping, sanitation, and portable export job does not need an AI call; adding one would disclose learner material without improving the required workflow.
