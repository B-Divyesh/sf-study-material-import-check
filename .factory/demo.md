# Demo sandbox

## Entry point

Open `/demo` or select **Try it with sample data** on the landing page.

## Sample and outcome

The shipped `untidy-sample.csv` has five realistic study rows. It includes one incomplete card, one duplicate, one formula-like prompt, one unsafe media URL, and three exportable cards. The demo opens with those findings already checked.

## Isolation and reset

Demo mode uses the separate `sessionStorage` namespace key `demo:study-material-import-check`. The key contains only the sample-mode marker `sample-v1`; it never stores an edited sample, an uploaded file, an export, or real material. No real-mode browser storage is read or written while the demo banner is present.

When demo opens from active real work, the app keeps that real workspace in memory only and uses a separate demo workspace. **Reset demo** restores the shipped sample without changing the saved real workspace. **Start for real** removes the demo key and restores the active real workspace; from a direct `/demo` visit, it opens an empty real-mode inspector. Refreshing `/demo` seeds the shipped sample again.
