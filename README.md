# Study Material Import Check

A calm, local-first inspector for learner-owned CSV, TSV, and plain-text study material. It previews rows, explains blank and duplicate cards, neutralizes spreadsheet formulas, removes non-HTTPS media links, maps columns, and exports an open practice-pack manifest or clean CSV.

Live: <https://study-material-import-check.sociobot.in>

## Who it is for

Learners who want to move a small set of their own prompts and answers into a practice tool without uploading their notes, learning a proprietary format, or debugging opaque import errors.

## Use it

Drop a `.csv`, `.tsv`, or `.txt` file, or paste its contents. Plain text may use `Prompt :: Answer`; delimited files may use commas, tabs, semicolons, or pipes. Review the findings, map columns to Prompt and Answer, then export either:

- `*.study-pack.json`, the documented version-1 portable format; or
- `clean-study-material.csv`, a conventional sanitized CSV.

All parsing and export happens in browser memory. Nothing is uploaded or saved by the app.

## Develop and verify

Requires Node.js 20.19 or newer. Playwright 1.58.2 uses Chromium for end-to-end tests.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

The exact production build command is `npm run build`. Output is written to `dist/`, with `dist/index.html` at the deployment root. `npm test` runs parser tests and desktop/390 px browser journeys, including automated axe accessibility checks.

## Deploy

Deploy `dist/` as a static site. `public/staticwebapp.config.json` supplies Azure Static Web Apps rewrites for `/privacy`, `/terms`, and `/format`, a real 404 response for unknown routes, immutable caching for hashed build assets, image MIME types, and security headers.

The format is documented in the app at `/format`. The product brief and paper-cut visual system live in `.factory/brief.json` (when provided by the factory) and `.factory/design.md`.

## License

MIT. See [LICENSE](LICENSE).
