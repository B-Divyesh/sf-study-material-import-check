# Study Material Import Check

Check CSV, TSV, and text study files before importing them into a practice tool.

It is for learners who bring their own prompts and answers. It finds import problems, lets you map fields, and exports portable cards.

Live site: <https://study-material-import-check.sociobot.in>

## Try the sample

Open <https://study-material-import-check.sociobot.in/demo> or select **Try it with sample data**. The five-row sample shows incomplete cards, duplicates, a formula-like value, and unsafe media. Demo mode is separate from real use. **Reset demo** restores the shipped sample. **Start for real** clears the demo and restores active real work, or opens an empty inspector after a direct demo visit.

## Use the inspector

1. Choose a CSV, TSV, or text file, or paste its contents. Text may use `Prompt :: Answer`. Delimited files may use commas, tabs, semicolons, or pipes.
2. Review incomplete cards, duplicates, formula-like values, and non-HTTPS media links.
3. Map each field once, then download a `*.study-pack.json` file or `clean-study-material.csv`.

Checks and exports run in the browser. Your own source material is not uploaded or retained after reload. The loaded page can keep checking material if its connection drops.

## Privacy and format

The app has no accounts, cookies, analytics, advertisements, or third-party scripts. The shipped demo uses only a temporary `demo:` session marker and never reads or writes real material. Read the [privacy policy](https://study-material-import-check.sociobot.in/privacy), [terms](https://study-material-import-check.sociobot.in/terms), and [portable format](https://study-material-import-check.sociobot.in/format).

The tool is free under the MIT License. The JSON practice pack is version 1 and has no proprietary identifiers or continuing service requirement.

## Develop and verify

Node.js 20.19 or newer is required. Playwright 1.58.2 uses Chromium for browser checks.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` writes the static deployment output to `dist/`, with `dist/index.html` at its root. The complete public-claim registry is in [.factory/claims.json](.factory/claims.json). Run an individual claim from a clean setup with its exact listed command, for example:

```sh
npm run test:claim -- --grep @claim:demo-sandbox
```

## Deploy

Deploy `dist/` as an Azure Static Web Apps static site. Keep the committed `public/staticwebapp.config.json` with the deployment.

## License

MIT. See [LICENSE](LICENSE).
