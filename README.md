# ULF R&D Dashboard

Static, single-page R&D dashboard for the Universal Limbs Foundation prosthetic hand program. No build step, no framework, no server-side code — everything renders directly from static HTML/CSS/JS.

## Live pages

| Branch | Purpose | URL |
| --- | --- | --- |
| `main` | Production (published via GitHub Pages) | https://rasna-spec.github.io/ULF-RD-Dashboard/ |
| `develop` | Active development / staging | Run locally (see below) until a preview deployment is configured |

Direct pages:
- Dashboard: `index.html`
- Prosthetic user survey: `prosthetic-user-survey.html`

## Quick start (local preview)

This is a static site — any static file server works. From the repo root:

```bash
# Python 3 (no install needed on macOS)
python3 -m http.server 8000
```

Then open:
- http://localhost:8000/index.html
- http://localhost:8000/prosthetic-user-survey.html

To preview a specific branch locally:

```bash
git fetch origin
git checkout develop   # or main
python3 -m http.server 8000
```

No `npm install`, `pip install`, or environment variables are required.

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
