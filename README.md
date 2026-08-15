# ULF R&D Dashboard

React and Vite R&D dashboard for the Universal Limbs Foundation prosthetic hand program.

## Live pages

| Branch | Purpose | URL |
| --- | --- | --- |
| `main` | Production (published via GitHub Pages) | https://rasna-spec.github.io/ULF-RD-Dashboard/ |
| `develop` | Active development / staging | Run locally (see below) until a preview deployment is configured |

Direct pages:
- Dashboard: `/`
- Prosthetic user survey: `/survey`

## Quick start (local preview)

Install Node.js 20 or later, then run from the repository root:

```bash
npm install
npm run dev
```

Then open:
- http://localhost:8000/
- http://localhost:8000/survey

Build and preview the production bundle:

```bash
npm run build
npm run preview
```


Run the built application through Express with `npm start`. Do not use `python3 -m http.server`: it cannot compile the React TypeScript entry point.

## Form Submissions

The prosthetic-user survey and University Collaboration deliverable form submit through the dashboard server. The server forwards each request to Google Apps Script, which appends a row to Google Sheets. Deliverable submissions also email the reviewer selected in the form.

1. Create one Google Sheet for survey responses and one for deliverables.
2. Open `google-apps-script.gs` in a new Apps Script project, replace both sheet ID placeholders and set a long random `SUBMISSION_SECRET`.
3. Deploy the script as a web app that runs as the account that owns the Sheets and accepts requests from the dashboard server.
4. Set the same values in the server environment:

```bash
export GOOGLE_APPS_SCRIPT_URL='https://script.google.com/macros/s/.../exec'
export GOOGLE_APPS_SCRIPT_SECRET='your-long-random-secret'
export REVIEWER_EMAILS_JSON='{"ganesh":"ganesh@universallimbs.com"}'
npm start
```

The browser never receives the secret. The server only accepts deliverable recipients from the Universal Limbs reviewer list in [server.js](server.js).

## Project structure

See [project_structure.md](project_structure.md) for the full file layout and the [MVP architecture](UI_UX_doc.md#mvp-architecture) the dashboard follows (state in `assets/js/model.js`, rendering in `assets/js/view.js`, event/interaction logic in `assets/js/presenter.js`).

## Documentation

- [rules.md](rules.md) — R&D collaboration rules
- [workflow.md](workflow.md) — operational workflow
- [implementation.md](implementation.md) — R&D implementation strategy
- [bugtracking.md](bugtracking.md) — how bugs/issues are tracked
- [UI_UX_doc.md](UI_UX_doc.md) — design principles, color palette, MVP architecture
- [project_structure.md](project_structure.md) — repository layout
- [generate.mdc](generate.mdc) — rules for generating new components/docs

## Branching

- `main` — production, published via GitHub Pages.
- `develop` — active development branch. Open PRs from `develop` into `main` when a change is ready to publish.

## Continuous checks

`.github/workflows/link-checker.yml` runs on every push/PR to `main` and `develop` and:
- scans the site for internal links (relative `href`/`src`) and flags any pointing to a file that doesn't exist in the repo,
- flags Google Docs/Drive/Forms links that aren't scoped to a `universallimbs.com` account, so shared documents stay restricted to UL team members instead of being publicly open.

## Contact / feedback

Every page has a persistent feedback bar at the bottom that opens a pre-filled email to the R&D team.
