# Handoff — Check study files before import

## Result: FAIL

Strict review 2 rejects implementation `f04f432808c14465310dfb9b9954ca1f63b49749`. The documentation baseline was `e05ac4a1f08ea79a922a6264c952ab1e800b2a36`. The reviewed live deployment is <https://study-material-import-check.sociobot.in>.

- Findings: 2 — 0 critical, 1 major, 1 minor.
- Untested public claims: 1.
- Product code changed during review: none.

## What passed

- The first screen states the import-checking job, learner audience, sample action, expected outcome, and three facts before scrolling on desktop and phone.
- The five-row sample produces three correctly sanitized cards. Its label, reset, clean-session exit, downloads, and temporary marker work.
- Normal, invalid, boundary, recovery, mapping, keyboard, focus, phone, 200% text, reduced-motion, accessibility, privacy, legal, offline-after-load, link, route, and designed-404 checks otherwise passed.
- All 17 declared claim commands exited successfully in desktop and mobile projects. Sixteen claims have complete passing evidence.
- `npm ci`, lint, typecheck, build, the full test suite, and the high-severity dependency audit passed.
- Live HTML, JavaScript, CSS, and mobile AVIF match the clean candidate build.
- Fresh mobile Lighthouse scored 100/100/100/100 with 1.052 s LCP, 22 ms total blocking time, and 0 CLS.

## What failed

1. **Major SMIC-R2-01:** entering Demo after inspecting real material overwrites the shared in-memory state. **Start for real** returns an empty inspector. This contradicts the demo isolation promise. The tagged `demo-sandbox` test starts clean and does not cover this path, leaving one public claim incompletely tested.
2. **Minor SMIC-R2-02:** `.factory/copy-audit.md` omits the two published footer sentences.

The full evidence and reproduction steps are in `.factory/review-2.md`.

## Run the checks

With Node 20.19 or newer and Playwright 1.58.2 Chromium available:

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npm test
npm audit --audit-level=high
```

Run every `test` value in `.factory/claims.json` separately. For the missing isolation case, first inspect private material in real mode, open Demo, reset it, select **Start for real**, and assert the original real source and mapping are restored.

## Next steps

Preserve real in-memory state separately while demo mode is active, extend `@claim:demo-sandbox` with the failing path, complete the copy audit, then rerun all gates, claim commands, live parity, and the strict review. No deployment or infrastructure change was made by this reviewer.
