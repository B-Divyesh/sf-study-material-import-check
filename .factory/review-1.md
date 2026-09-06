# Review 1 — Check and export study material imports

## Verdict: FAIL

Reviewed on 2026-09-06 at <https://study-material-import-check.sociobot.in>.

- Findings: **8** — 0 critical, 2 major, 6 minor.
- Untested public claims: **18**.
- Implementation candidate: `7b140a554136b8622671d3fc1cef620bfb459ef3`.
- Documentation baseline: `e3fdbc404b3c0176f85b3a78790024a1a4af8f5b`.
- Live parity: live HTML, JavaScript, and CSS hashes match the clean production build. Commits after `7b140a5` change reports and handoff documentation only.

The core inspector works, but this candidate cannot pass the current factory contract. It has no compliant one-click demo sandbox and no claim registry or tagged claim tests.

## Before scrolling

Fresh 1440 × 900 desktop and 390 × 844 phone contexts showed the same first screen.

| Required answer | What a new visitor sees |
| --- | --- |
| Job | “Turn a messy study file into tidy, portable cards.” This names the job in nine words. |
| Audience | Not stated. The screen does not say it is for learners bringing their own material. |
| First action | “Check my material,” which jumps to the real importer. |
| Sample action | Not on the first screen. Its top edge was 1,343 px on desktop and 1,939 px on phone. |

Only one short fact appears: “Parsed entirely in your browser. Nothing is uploaded.” The required three first-screen facts are absent.

## Findings

### Major — SMIC-R1-01: the sample is not a demo sandbox

The live landing page has **Try a malformed sample**, but not the required **Try it with sample data** action on the first screen. `/demo` returns the correctly designed HTTP 404 page. After loading the sample there is no persistent “Demo — sample data, nothing is saved” notice, **Reset demo**, or **Start for real** action, and `.factory/demo.md` is absent.

The sample itself is useful: one click inspects five realistic rows, reports incomplete, duplicate, formula, and media problems, and exports three sanitized cards. **Clear** returns the app to an empty state. Browser storage and cookies remained empty, and the flow sent no content request, so it did not change real data. Those facts do not replace the required visible mode, direct URL, controls, and documented isolation contract.

### Major — SMIC-R1-02: all 18 public claim groups lack required claim tests

`.factory/claims.json` does not exist. Therefore there were no declared claim commands to run, no `@claim:<id>` tests, and no clean demo entry point from which a verifier could run them. Existing untagged tests and this review's observations provide useful evidence, but they do not satisfy the claim contract.

The 18 untested claim groups are:

1. Importing CSV, TSV, and plain text.
2. Recognizing comma, tab, semicolon, pipe, and `Prompt :: Answer` input.
3. Finding blank or incomplete cards.
4. Finding and omitting duplicate cards.
5. Finding and neutralizing spreadsheet formulas.
6. Finding and removing non-HTTPS media links.
7. Mapping source columns, with each role used once.
8. Exporting the version-1 practice-pack JSON.
9. Exporting sanitized CSV.
10. Parsing and exporting locally without upload or transmission.
11. Keeping source material only in memory and not saving it in the app.
12. Having no accounts, analytics, cookies, advertisements, or third-party scripts.
13. Continuing to work while offline.
14. Being free under the MIT License.
15. Producing a documented, portable JSON file with no proprietary identifiers or continuing service requirement.
16. Accepting files through 5 MiB and rejecting larger files.
17. Running parser, desktop, 390 px, and automated axe checks through `npm test`.
18. Shipping a real 404, immutable asset caching, correct image types, and security headers.

### Minor — SMIC-R1-03: the first screen omits required decision information

The job and real first action are clear, but the audience is missing, the sample action is below the fold, and the first screen has one fact instead of three privacy/offline/price facts. This fails the required cold-landing answer even though the product's purpose is otherwise understandable.

### Minor — SMIC-R1-04: interface copy uses metaphor headings and has no copy audit

Examples include “A quiet check before you practise,” “Place your notes on the desk,” “Margin notes,” “Take the tidy cards with you,” “Nothing filed here,” and “This page is not on the desk.” These headings do not name their sections in plain words. `.factory/copy-audit.md`, including sentence word counts and terminology review, is also absent.

### Minor — SMIC-R1-05: route metadata and discovery files are incomplete

The root has a valid 55-character title, language, description, favicon, and theme color. However, there is no canonical URL, Open Graph metadata, Twitter card, 1200 × 630 product image, or Apple touch icon. `robots.txt` and `sitemap.xml` both return 404.

Route titles do not follow the required route-name pattern and exceed 60 characters: Privacy is 76 characters, Terms is 62, and Format is 68. The 404 title and HTTP status are correct.

### Minor — SMIC-R1-06: the standard landing and footer structure is incomplete

The landing page goes from its first screen to a four-item progress trail and the importer. It lacks the required three-step **How it works** section and a dedicated plain-language limits/privacy section. The header has no Demo or Privacy link. The footer omits “Built by Param Factory” and a version/build identifier.

### Minor — SMIC-R1-07: offline reload does not match the broad “Offline — still works” message

An already loaded page continued parsing after the context went offline and displayed “Offline — still works.” Reloading that same fresh context offline failed with `net::ERR_INTERNET_DISCONNECTED`; there is no service worker. Either narrow the message to loaded-page behavior or implement and claim-test offline reload. Service-worker update behavior is otherwise not applicable.

### Minor — SMIC-R1-08: the privacy contact instruction has no usable path

The privacy page says to “open an issue in the project repository,” but the site and README expose no repository issue link or other privacy contact method. A visitor cannot complete the stated privacy-request path from the published product.

## Core workflow and edge-path evidence

The following behavior passed on the live deployment:

- One-click malformed sample: five rows inspected; three cards exported as `untidy-sample.study-pack.json`.
- Output sanitation: the duplicate and incomplete rows were omitted, formula-like text was prefixed, the HTTPS image remained, and unsafe media was removed.
- Clear/reset: source and populated workspace were removed; no storage, cookie, or external request changed.
- Empty input: “Add a file or paste some material first.”
- Invalid and recovery: an unclosed quote produced a visible finding; replacing it with valid material exported `clean-study-material.csv` without reload.
- Boundary: an exact 5 MiB file was accepted; 5 MiB plus one byte was rejected with guidance and focus returned to **Choose file**.
- Mapping: moving Prompt to a third column kept focus on that select, cleared the prior role, and exported “New question.”
- Invalid CSV export: incomplete material was blocked rather than producing a header-only file.
- Phone: no horizontal document overflow at 390 px; the effective brand and Terms targets were 44 × 44 px. The 1 × 1 file input has a 48 px labelled proxy, and the 20 px checkbox sits inside a 44 px label.
- Keyboard: the first fresh Tab reached **Skip to importer**; Enter moved past header navigation. No trap was found.
- Reduced motion: a context created with reduced motion reported a non-moving hero and near-zero transitions.
- Accessibility: axe WCAG A/AA scans found zero violations on populated desktop, populated phone, Privacy, Terms, Format, and 404 pages. The supplied `verify-url.sh` passed with one title, `lang=en`, one `h1`, a main landmark, image alt text, and zero console errors.
- Privacy: the whole import/export flow requested only same-origin HTML, JS, CSS, and hero AVIF. Local storage, session storage, cookies, service workers, analytics, and third-party requests were absent.
- Links: every published internal link reached its intended route. The intentional unknown-route 404 is a correct response, not a defect.

AI-assisted behavior is not implied by this deterministic local inspector, so the AI missed-leverage check is not a finding. Backend tenant, persistence, health, and rate-limit checks do not apply to this static product. CLI, library, desktop-consumer, and service-worker update checks do not apply.

## Earlier finding disposition

| Earlier finding | Current result | Fresh evidence |
| --- | --- | --- |
| QA-01 duplicate role mapping | Fixed | Prompt moved atomically to column 3; old role became Ignore; exported prompt was “New question.” |
| QA-02 header-only CSV export | Fixed | Incomplete input produced no download and focused the CSV action with corrective text. |
| QA-03 mapping focus loss | Fixed | The changed select remained focused after rerender. |
| QA-04 asset cache and AVIF type | Fixed | Hashed JS/CSS/AVIF returned one-year `immutable`; AVIF returned `image/avif`. |
| QA-05 mobile targets | Fixed | Brand and Terms effective targets measured exactly 44 × 44 CSS px. |
| QA-06 unknown route rendered Format | Fixed | `/does-not-exist` returned HTTP 404 with one product-styled not-found `h1` and a working way home. |

The earlier minor findings were explicitly retested; none regressed.

## Clean-checkout commands

A detached clean checkout at documentation SHA `e3fdbc404b3c0176f85b3a78790024a1a4af8f5b` used Node `v22.23.2`, npm `10.9.8`, Playwright `1.58.2`, and the preinstalled Chromium.

```text
npm ci
  139 packages installed; 0 vulnerabilities

npm run dev -- --host 127.0.0.1
  Vite 7.3.6 started successfully

npm run lint
  passed

npm run typecheck
  passed

npm test
  Vitest 4/4 passed
  Playwright 17 passed, 1 intentional desktop skip

npm run build
  passed; dist/index.html produced

npm audit --audit-level=high
  0 vulnerabilities
```

There were no claim commands to run because the required claim registry is missing. That absence is a finding, not a skipped successful check.

## Deployment, performance, and security

The live and clean-build hashes match:

```text
09230c7267263da1936912c41e2dcf29ceb4332b1b91511b6eb2e99e25f7c460  index.html
547196daaa6d7e1dce9446b7db2ff655463853fa085913cb42a5714f6f652dd3  assets/index-DZ8IDAF7.js
d85c412e2b040138f88d4124b544ab20a46fc3f76cbd141b4c02cbbefd9a871b  assets/index-2F_h8Drk.css
```

Production sizes are 21,539 B raw JavaScript, 14,010 B CSS, no fonts, and a 14,158 B mobile AVIF. Fresh live mobile Lighthouse scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100, with FCP 0.9 s, LCP 1.0 s, TBT 40 ms, CLS 0, and 28 KiB transferred.

The live site returned the configured CSP, HSTS, `nosniff`, no-referrer, and permissions policy. `OPTIONS /` returned 204 and `POST /` returned 405. This static product has no backend or shared database.

## Release decision

Do not accept this candidate. Add the compliant isolated demo and its documentation, register and tag every public claim, then address the six minor contract gaps and rerun the full review. The result remains **FAIL** even though the core inspector and prior repairs pass.
