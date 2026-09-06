# Review 2 — Check study files before import

## Verdict: FAIL

Reviewed on 2026-09-06 at <https://study-material-import-check.sociobot.in>.

- Findings: **2** — 0 critical, 1 major, 1 minor.
- Untested public claims: **1**.
- Implementation candidate: `f04f432808c14465310dfb9b9954ca1f63b49749`.
- Documentation baseline: `e05ac4a1f08ea79a922a6264c952ab1e800b2a36`.
- Product code changed by this review: none.
- Live parity: live HTML, JavaScript, CSS, and mobile AVIF match the clean candidate build byte for byte.

The inspector, output sanitation, accessibility, routes, performance, and 16 complete public claims pass. The result is still FAIL because entering the demo discards active real-session material despite the isolation promise. The related declared test starts with no real material and cannot detect that failure. The copy audit also omits two published footer sentences.

## First screen

Fresh 1440 × 900 desktop and 390 × 844 phone contexts started at the top without scrolling.

| Required answer | Visible text | Result |
| --- | --- | --- |
| Job | “Check study files before you import.” | Pass |
| Audience | “For learners bringing their own notes into practice…” | Pass |
| First action | “Try it with sample data” | Pass |
| Outcome | Five rows checked and three safe cards ready to export | Pass |
| Plain facts | Local only, works after loading when offline, and free under MIT | Pass |

All three facts ended above the viewport bottom on both devices. The title names the job in plain words. The first screen does not depend on metaphor copy.

## Findings

### Major — SMIC-R2-01: demo entry discards active real material

The live demo says **“Your real material is not read or changed.”** The registered `demo-sandbox` claim says the resettable sample **“never changes your real material.”** That promise fails when a learner enters the demo after starting real work.

Fresh live reproduction:

1. Open `/` and paste `Prompt,Answer` followed by `Private real question,Private real answer`.
2. Select **Inspect material** and confirm the real card is present.
3. Select the header **Demo** link, then **Reset demo**.
4. Select **Start for real**.
5. The real inspector returns empty. Browser Back also returns an empty real inspector.

The external source file is not modified, but the learner's pasted or edited in-session material is lost without warning. This is real product state for a memory-only tool. Source inspection confirms that `seedDemo()` overwrites the shared `state` object and `clearDemo()` replaces it with an empty real state.

The exact declared command `npm run test:claim -- --grep @claim:demo-sandbox` passes because its test opens `/demo` from a clean page. It never creates real material before entering the sample. The command therefore does not test the full registered promise, and the live counterexample makes that promise false.

Preserve and restore the current real-mode state in a separate in-memory slot when demo mode opens. Extend the tagged test to create real material first, exercise demo edit and reset, leave demo, and assert that the original real material and mapping return unchanged.

### Minor — SMIC-R2-02: the landing copy audit is incomplete

`.factory/copy-audit.md` says it extracts landing copy, but it omits two published footer sentences:

- “Check learner-owned study files before importing them.”
- “Paper artwork is original, AI-generated imagery.”

Both sentences are short and use plain words, so this is an evidence gap rather than a copy-quality problem. Add them with word counts so the required audit covers every landing-page sentence.

## Demo and main workflow

The required direct demo and its main output otherwise work. `/demo` opens five realistic rows with one incomplete card, one later duplicate, two unsafe media links, and one formula-like value. The output panel says three of five rows will become cards.

The downloaded `untidy-sample.study-pack.json` has format `study-pack`, version `1`, and three cards. It retains the HTTPS image, removes HTTP and script media, omits incomplete and duplicate cards, and prefixes the formula-like prompt with an apostrophe. The demo label remains after export. **Reset demo** restores the shipped sample. A clean demo round trip removes only its `demo:study-material-import-check` marker and preserves unrelated local and session storage.

Normal paste, file-picker, and drag-and-drop input worked. CSV, TSV, plain-text, comma, tab, semicolon, pipe, and `Prompt :: Answer` paths passed their claim tests. Empty input gave a next step. An unclosed quote produced a visible finding, and replacing it with valid input recovered without reload. Exactly 5 MiB passed; one byte more failed with guidance and focus on **Choose file**. A zero-card CSV export was blocked with guidance. Reassigning Prompt cleared the previous role, retained focus, and exported the selected column.

## Public claims

`.factory/claims.json` contains 17 entries. Each ID occurs on exactly one test definition, and every exact command exited successfully in desktop Chromium and the 390 px mobile project. One command is incomplete as evidence and has a live counterexample.

| Claim | Command | Review result |
| --- | --- | --- |
| `input-files` | Pass | Pass — CSV, TSV, and text files produced inspected rows. |
| `input-shapes` | Pass | Pass — all five documented input shapes parsed. |
| `incomplete-cards` | Pass | Pass — incomplete cards were reported and omitted. |
| `duplicates` | Pass | Pass — later duplicate cards were reported and omitted. |
| `formula-safety` | Pass | Pass — formula-like values were neutralized in exports. |
| `media-safety` | Pass | Pass — HTTPS remained and unsafe media was removed. |
| `unique-mapping` | Pass | Pass — each role remained unique and exported the chosen column. |
| `practice-pack` | Pass | Pass — the version-1 JSON filename and manifest were correct. |
| `clean-csv` | Pass | Pass — header, row count, formula prefix, and media cleanup were correct. |
| `local-processing` | Pass | Pass — the demo export flow stayed on the current origin. |
| `memory-only` | Pass | Pass — real material was absent after reload and from browser storage. |
| `no-tracking` | Pass | Pass — no cookies or third-party product requests appeared. |
| `offline-after-load` | Pass | Pass — a loaded page inspected material after its connection dropped. |
| `mit-license` | Pass | Pass — the terms and repository license state MIT use. |
| `portable-format` | Pass | Pass — the documented and exported format has no service dependency. |
| `file-limit` | Pass | Pass — the exact boundary and one-byte-over failure worked. |
| `demo-sandbox` | Pass | **Fail** — the test omits pre-existing real state, which the live demo discards. |

Untested public claim count: **1**. This count is the untested portion of `demo-sandbox`; it is not an eighteenth registry item.

## Clean checkout and gates

The main checkout was clean before dependency installation. Node was `v22.23.2`, npm was `10.9.8`, Playwright was pinned to `1.58.2`, and the preinstalled Chromium browser was used.

| Command | Result |
| --- | --- |
| `npm ci` | Pass — 139 packages, 0 vulnerabilities. |
| `npm run lint` | Pass. |
| `npm run typecheck` | Pass. |
| `npm run build` | Pass — `dist/index.html` produced. |
| `npm test` | Pass — 4 parser tests and 40 browser checks; 2 expected desktop copies of mobile-only checks skipped. |
| `npm audit --audit-level=high` | Pass — 0 vulnerabilities. |
| All 17 exact claim commands | Pass at command level — 34 project executions. |

The build contains 26,424 B JavaScript, 16,940 B CSS, no web fonts, and a 14,158 B mobile AVIF. These are below the static-product budgets.

## Accessibility, keyboard, phone, and motion

- The factory URL verifier passed the live root with a descriptive title, `lang=en`, one `h1`, one main landmark, complete image alt text, labelled buttons, and no console errors.
- Fresh axe WCAG 2 A/AA scans found no serious or critical violations on `/`, populated `/demo`, `/privacy`, `/terms`, `/format`, or the designed 404.
- The first Tab reached the skip link. Enter bypassed navigation and opened the file chooser. Space changed the header checkbox. Native select keyboard navigation changed mapping and retained focus after rendering.
- Visible phone links, buttons, selects, and the checkbox label meet the 44 px target rule. The 390 px root and populated demo had no horizontal document overflow.
- At 200% text size, the root remained within the 390 px viewport.
- Reduced motion changed transitions to `0.01ms`. There is no autoplay, looping motion, flashing content, or dialog.
- The paper-workshop identity matches `.factory/design.md` and remains readable on desktop and phone.

## Routes, privacy, offline behavior, and security

`/`, `/demo`, `/privacy`, `/terms`, `/format`, `robots.txt`, `sitemap.xml`, the social image, and the touch icon returned 200. The GitHub privacy-contact link returned 200. `/does-not-exist` intentionally returned HTTP 404 with the designed recovery page; this expected response is not a defect.

Route titles, one-`h1` structure, main landmarks, canonicals, Open Graph fields, and navigation passed. The social image is 1200 × 630 and the touch icon is 180 × 180. Client route changes and browser history restored the correct route and focused its heading.

Observed product traffic used only same-origin GET requests. There were no cookies, analytics, third-party scripts, external fonts, unexpected page errors, or unexpected console errors. The loaded demo continued inspecting while offline without a request. There is no service worker, so offline reload and update behavior are not promised or applicable.

Live responses include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, no-referrer, and disabled camera, microphone, and geolocation. Hashed assets use one-year immutable caching, and AVIF uses `image/avif`. `OPTIONS /` returned 204 and `POST /` returned 405. Backend tenant isolation, restart persistence, health, and 429 checks do not apply to this static local-only product. CLI, library, desktop-consumer, payment, and account checks do not apply.

## Earlier findings

All 14 earlier findings, including minor ones, were inspected again.

| Earlier finding | Current disposition |
| --- | --- |
| SMIC-QA-01 duplicate roles | Fixed — reassignment clears the old role and exports the new value. |
| SMIC-QA-02 header-only CSV | Fixed — zero-card export is blocked with focused guidance. |
| SMIC-QA-03 mapping focus | Fixed — mapping changes retain keyboard focus. |
| SMIC-QA-04 cache and AVIF type | Fixed — hashed assets are immutable for one year and AVIF is served correctly. |
| SMIC-QA-05 mobile targets | Fixed — effective phone targets meet 44 × 44 CSS px. |
| SMIC-QA-06 unknown route | Fixed — unknown routes return the designed HTTP 404. |
| SMIC-R1-01 demo sandbox | **Not fully fixed** — direct demo, reset, label, and clean exit work, but entering from active real work discards that state. See SMIC-R2-01. |
| SMIC-R1-02 claim coverage | **Not fully fixed** — all commands exist and pass, but `demo-sandbox` does not test its complete promise. See SMIC-R2-01. |
| SMIC-R1-03 first screen | Fixed — job, audience, sample action, outcome, and three facts fit before scrolling. |
| SMIC-R1-04 copy and audit | **Not fully fixed** — metaphor headings are gone, but two footer sentences are absent from the audit. See SMIC-R2-02. |
| SMIC-R1-05 metadata | Fixed — route metadata, social art, touch icon, robots, and sitemap pass. |
| SMIC-R1-06 structure and footer | Fixed — header, three-step section, limits, owner, and version are present. |
| SMIC-R1-07 offline wording | Fixed — copy promises only loaded-page behavior, which passed. |
| SMIC-R1-08 privacy contact | Fixed — the published GitHub issue link works. |

## Live identity and performance

The clean build and live deployment have matching SHA-256 values:

```text
26250dbfc5082f0e499be0b848bd56bf95977bfa65f125371489c459a57a5290  index.html
8e0fdd990579dcb69f769afc8ad83d0ab67a3fb38dba0626d39e6a44b59b04a9  assets/index-BgelIvaZ.js
f79acf2334e189c65db5bf621eb976c0d62c06d9b8847e56573fd88a7d12914f  assets/index-ChWvPq1P.css
f39ea86b79c1df142005fed7119b36d5a6721ae39776cd082a6be03fa8e41e64  assets/hero-paper-workshop-640.f39ea86b.avif
```

Fresh live mobile Lighthouse 13.0.1 scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100. FCP was 0.902 s, LCP 1.052 s, total blocking time 22 ms, CLS 0, and transfer was 30,862 B. A separate 4× CPU-throttled interaction exercise recorded 82 Event Timing entries with a maximum duration of 128 ms.

This deterministic local inspector does not need an AI step to perform the researched job. Adding model calls would introduce data disclosure and a key requirement without improving parsing, mapping, sanitation, or portable export, so the AI missed-leverage check has no finding.

## Evidence

- Live browser checks: `/work/.evidence/review-2-live-results.json`
- Real-state counterexample: `/work/.evidence/review-2-real-state.txt`
- Counterexample screenshots: `/work/.evidence/review-2-real-state-before.png` and `/work/.evidence/review-2-real-state-after.png`
- Desktop and phone screenshots: `/work/.evidence/review-2-desktop-first-screen.png`, `/work/.evidence/review-2-desktop-demo.png`, `/work/.evidence/review-2-phone-first-screen.png`, and `/work/.evidence/review-2-phone-demo.png`
- Factory URL check: `/work/.evidence/review-2-verify-url/verify.json`
- Lighthouse: `/work/.evidence/review-2-lighthouse-live.json`
- Claim logs: `/work/.evidence/review-2-claim-*.log`
- Gate logs: `/work/.evidence/review-2-{lint,typecheck,build,test,audit}.log`
- Live parity: `/work/.evidence/review-2-live-parity.txt`

## Release decision

**FAIL.** Do not accept implementation `f04f432808c14465310dfb9b9954ca1f63b49749` as complete. Resolve SMIC-R2-01 and SMIC-R2-02, add the missing real-state claim coverage, and rerun the full review. There are **2 findings** and **1 untested public claim**.
