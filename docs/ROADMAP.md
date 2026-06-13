# personalweb Roadmap

## Current State — 2026-06-14

- Next.js 16 / TypeScript / hand-written CSS app has been scaffolded.
- Git is initialized on `main` and `origin` points to `https://github.com/lgk-code/personalweb.git`.
- The home page now has a first usable slice: project-backed hero, project showcase, evidence chain, working style, and contact links.
- `AIFocus` and `CodePath` content is stored in `src/lib/portfolio.ts` and covered by `src/lib/portfolio.test.ts`.
- Key PNG visuals are covered by asset metadata tests.
- A CodePath public screenshot was copied into `public/projects/` for visual project evidence.
- A CodePath MCP comparison crop is included as a second public-safe screenshot, with the original local path area excluded.
- Generated bitmap assets live at `public/projects/aifocus-signal.png` and `public/projects/hero-workbench.png`; both can be regenerated with `npm run assets:generate`.
- Mobile-specific public assets are generated for AIFocus and CodePath so project evidence remains legible on narrow viewports.
- Open Graph / Twitter metadata and a statically generated `/opengraph-image` PNG route are in place.
- Generated `/icon` and `src/app/favicon.ico` assets replace the scaffold favicon treatment.
- Public site URL resolution is centralized for metadata, `robots.txt`, and `sitemap.xml`.
- Metadata routes are covered by unit tests.
- Homepage metadata includes canonical, author, creator, publisher, Open Graph, Twitter, and JSON-LD signals.
- Homepage JSON-LD describes the public profile and showcased projects.
- Public page links avoid private or not-yet-public GitHub repositories.
- A custom `not-found` page replaces the default unmatched-route experience.
- A keyboard-visible skip link improves access to the project section.
- Static accessibility checks cover landmarks, hash-link targets, focus outlines, reduced motion, labelled nav, and project image alt text.
- Basic security headers are configured in `next.config.ts`.
- `npm run quality` runs generated asset drift checks, test, lint, design redline checks, build, static HTML output checks, accessibility checks, sensitive content scanning, and audit documentation checks.
- GitHub Actions runs the same quality gate on `main` pushes and pull requests.
- Dependabot is configured for npm and GitHub Actions updates.
- `docs/REVIEW-RUBRIC.md` defines the three-agent final review scoring rules.
- Latest local quality gate passed: `npm run quality`.

## Next Work

- Improve mobile and desktop layout after real browser screenshot review.
- When browser access to localhost is available, capture desktop and mobile screenshots.
- Before final delivery, run the three independent subagent reviews required by `AGENTS.md`.

## Known Verification Gap

Browser verification against `http://localhost:3000` was blocked by the Browser plugin enterprise network policy. Do not claim final visual acceptance until a real browser desktop and mobile screenshot review has been completed.

`npm audit --audit-level=moderate` currently reports [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93), a moderate PostCSS advisory fixed in `postcss@8.5.10`, through `next@16.2.9`'s internal dependency tree. The advisory is documented here because `npm audit fix --force` proposes a breaking downgrade to an old Next.js version; do not apply that automatically. `npm run check:audit` allows only this known advisory chain and fails on unknown moderate-or-higher advisories, so revisit when a safe Next.js patch is available.
