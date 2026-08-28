# Verification handoff — Study Material Import Check

## Result: FAIL

Independent QA tested candidate `48152d26250df02bd96cee8db2e9c57d8dc4e5a1` and <https://study-material-import-check.sociobot.in> on 2026-08-28. The live site is deployed, healthy, and byte-for-byte identical to the candidate build. It nevertheless fails the product acceptance contract on core mapping/export correctness.

## Release-blocking defects

- **Major — duplicate mappings silently export the first mapped column.** Mapping an additional column to Prompt leaves both selectors on Prompt, gives no conflict warning, and exports the earlier column instead of the newly selected one.
- **Major — clean CSV accepts zero valid cards.** For `Prompt,Answer\nOnly prompt,`, practice-pack export correctly blocks, but clean-CSV export downloads a header-only file and reports success.

Additional minor defects: role-change rerenders discard keyboard focus; hashed live assets use only `max-age=30` and no `immutable`; AVIF is served as `application/octet-stream`; the 390 px home and Terms targets are slightly under 44 px wide/high; unknown routes return 200 and render the format page.

## Verification completed

From a clean detached checkout at the candidate:

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
```

- 4/4 Vitest tests and 8/8 Playwright tests passed.
- TypeScript strict check and exact Vite production build passed; `dist/` was produced.
- No lint script exists. Audit reported zero vulnerabilities.
- Independent CSV, TSV, semicolon, pipe, plain-text, quoted/multiline, empty, malformed, duplicate, unsafe-media, formula, XSS, file-size boundary, drag/drop, keyboard, offline-loaded, and export checks were run.
- Axe WCAG A/AA: zero violations at any impact level on local desktop initial, local 390 px populated, and live populated states.
- No console/page errors, horizontal overflow, third-party requests, analytics, cookies, storage, or content upload were observed.
- Live Lighthouse 13.0.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 92; LCP 0.907 s, TBT 43 ms, CLS 0.
- Live HTML, JS, CSS, and all hero assets match the candidate build by SHA-256.

Full commands, evidence, response headers, hashes, budgets, and reproduction steps are in [`.factory/verification.md`](verification.md).

## Required next steps

1. Enforce unique field roles or block conflicting mappings with an actionable message.
2. Apply practice-pack validation to clean-CSV export and add regression coverage.
3. Preserve focus after mapping changes.
4. Add long-lived immutable caching for hashed assets and correct the AVIF MIME type.
5. Bring all mobile targets to at least 44 × 44 CSS px and add a real not-found state.
6. Rerun all clean-checkout and live-deployment checks before release.

No product code was modified during this verification.
