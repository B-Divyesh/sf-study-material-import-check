# Repair handoff — Study Material Import Check

## Result: READY

Repair work order `study-material-import-check-repair-1` resolves every finding in independent report commit `3ac4bd53bc988aacf7f70779dcf3fbed6aafbeeb` for candidate `48152d26250df02bd96cee8db2e9c57d8dc4e5a1`. The artifact remains a Vite + TypeScript static site with `dist/index.html` at the deployment root. The researched brief was not present in the supplied repository; the existing product scope and `.factory/design.md` were preserved.

## Findings repaired

- **SMIC-QA-01 — duplicate role mappings:** every non-Ignore role is now unique. Assigning a role to a new column atomically resets its old column to Ignore, announces the move, keeps focus on the changed control, updates the preview, and exports the newly selected data. Automatic mapping also de-duplicates repeated matching headers.
- **SMIC-QA-02 — header-only clean CSV:** JSON and CSV now share the same pre-export requirement for mapped Prompt/Answer fields and at least one complete card. Invalid material creates no download, explains the required action in the live region, and returns focus to the attempted export button.
- **SMIC-QA-03 — keyboard focus loss:** successful inspection focuses the findings heading; empty inspection returns focus to its button; header and role rerenders restore focus to the same control and viewport context; export and file errors also preserve an actionable focus point.
- **SMIC-QA-04 — cache and AVIF policy:** all shipped image names are content-hashed. Azure Static Web Apps applies `public, max-age=31536000, immutable` to `/assets/*` and declares `.avif` as `image/avif`.
- **SMIC-QA-05 — mobile targets:** the compact home control and footer legal links now have minimum 44 × 44 CSS px hit areas.
- **SMIC-QA-06 — unknown routes:** unrecognized client paths render a dedicated one-heading not-found state. Azure returns it with HTTP 404; `/privacy`, `/terms`, and `/format` remain explicit 200 rewrites.

Exact Playwright regressions cover the reported duplicate-mapping export payload, zero-card CSV no-download behavior, focus continuity, 390 px target geometry, unknown-route state, and static-host policy. A self-authored leaf favicon removes the final page-load console error; its provenance is recorded in `.factory/design.md`.

## Clean verification

Run on 2026-08-28 from `/work/repo`:

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
```

Results:

- Clean install: 139 packages installed; 0 vulnerabilities.
- ESLint: pass.
- TypeScript strict check: pass.
- Vitest: 4/4 parser tests pass.
- Playwright 1.58.2 Chromium: 17 pass, 1 expected desktop skip across desktop and 390 × 844 mobile projects.
- Production build: pass; `dist/index.html` present.
- Audit: 0 vulnerabilities.
- Raw initial assets: JavaScript 21,539 B, CSS 14,010 B, fonts 0 B, mobile AVIF 14,158 B — all within contract budgets.

Browser checks used the production build through Static Web Apps CLI 2.0.10. Desktop 1440 × 1000 and mobile 390 × 844 had no console/page errors, no horizontal overflow, one `main`, one `h1`, and zero axe WCAG 2 A/AA violations in the populated mapping state. Visual screenshots were reviewed for both sizes without clipping, overlap, or hidden controls. Keyboard checks confirmed skip-link activation (`#main`, then **Check my material**), inspection-to-findings focus, and role-select focus continuity. At 390 px, both repaired targets measure at least 44 × 44 CSS px. A separate 320 px reflow check had `scrollWidth === innerWidth` and all visible controls remained in the viewport.

Reduced motion reports a `0.01ms` transition and no transform. An exact 5 MiB file is accepted, 5 MiB + 1 byte is rejected with guidance, and BOM/CRLF TSV imports successfully. With the browser taken offline after load, local parsing continues and the interface reports `Offline — still works`. No service worker is registered, so update lifecycle testing is not applicable to this non-PWA static artifact.

Privacy/request inspection found no cookies, local/session storage, service worker, content upload, analytics, third-party requests, CDN fonts, or external scripts. Static host emulation returned OPTIONS 204 and POST 405. Root and asset responses retain CSP, HSTS, `nosniff`, no-referrer, and disabled camera/microphone/geolocation policies. Emulation specifically returned:

```text
/does-not-exist                                      404, product not-found page
/assets/index-DZ8IDAF7.js                            Cache-Control: public, max-age=31536000, immutable
/assets/hero-paper-workshop-640.f39ea86b.avif        Content-Type: image/avif; immutable
```

Final local Lighthouse 13.0.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 90 ms, CLS 0, Speed Index 1.1 s, zero console errors.

Local production hashes before deployment:

```text
index.html                    09230c7267263da1936912c41e2dcf29ceb4332b1b91511b6eb2e99e25f7c460
assets/index-DZ8IDAF7.js      547196daaa6d7e1dce9446b7db2ff655463853fa085913cb42a5714f6f652dd3
assets/index-2F_h8Drk.css     d85c412e2b040138f88d4124b544ab20a46fc3f76cbd141b4c02cbbefd9a871b
```

## Run and deploy

```sh
npm ci
npm test
npm run build
swa deploy ./dist --env production --subscription-id 283af945-693b-4a6e-b952-df928d0a18a9 --resource-group sociobot --app-name sf-study-material-import-check
```

Deployment target: <https://study-material-import-check.sociobot.in>.

## Production verification

Commit `7b140a5` was pushed to `origin/main` and `dist/` was deployed to the existing Azure Static Web App `sf-study-material-import-check` in resource group `sociobot` (production environment). The CLI reported deployment success at the backing Azure hostname; the configured custom domain served the new build immediately.

Live desktop and 390 px browser checks repeated the corrected role export, focus state, responsive layout, request/privacy inspection, and populated axe scan: zero console/page errors, zero WCAG A/AA violations, zero third-party requests, no storage/cookies, no horizontal overflow, and the exported prompt was `New question`. The live unknown route returns HTTP 404 and renders `This page is not on the desk.` Live OPTIONS is 204 and POST is 405.

Live mobile Lighthouse 13.0.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, TBT 20 ms, CLS 0, Speed Index 0.9 s, zero console errors.

Live response checks confirm the security headers from the verifier remain in place. Hashed JS/CSS and content-hashed hero assets return `Cache-Control: public, max-age=31536000, immutable`; AVIF returns `Content-Type: image/avif`. Live and local SHA-256 values match exactly:

```text
index.html                                      09230c7267263da1936912c41e2dcf29ceb4332b1b91511b6eb2e99e25f7c460
assets/index-DZ8IDAF7.js                        547196daaa6d7e1dce9446b7db2ff655463853fa085913cb42a5714f6f652dd3
assets/index-2F_h8Drk.css                       d85c412e2b040138f88d4124b544ab20a46fc3f76cbd141b4c02cbbefd9a871b
assets/hero-paper-workshop-640.f39ea86b.avif    f39ea86b79c1df142005fed7119b36d5a6721ae39776cd082a6be03fa8e41e64
```

## Known gaps / next steps

- No product gap remains from the verifier report.
- Package/consumer testing is not applicable: this is not a published package. Backend health, persistence, concurrency, and service-worker update checks are likewise not applicable to the static, in-memory, non-PWA product.
