# personalweb Roadmap

## Current State — 2026-06-14

- Next.js 16 / TypeScript / Tailwind CSS app has been scaffolded.
- Git is initialized on `main` and `origin` points to `https://github.com/lgk-code/personalweb.git`.
- The home page now has a first usable slice: project-backed hero, project showcase, evidence chain, working style, and contact links.
- `AIFocus` and `CodePath` content is stored in `src/lib/portfolio.ts` and covered by `src/lib/portfolio.test.ts`.
- CodePath public screenshots were copied into `public/projects/` for visual project evidence.
- Generated bitmap assets live at `public/projects/aifocus-signal.png` and `public/projects/hero-workbench.png`; both can be regenerated with `npm run assets:generate`.
- Open Graph / Twitter metadata and a generated `/opengraph-image` PNG route are in place.
- A generated `/icon` PNG route replaces the scaffold favicon treatment.
- Public site URL resolution is centralized for metadata, `robots.txt`, and `sitemap.xml`.
- Homepage JSON-LD describes the public profile, showcased projects, and repository relationship.
- `npm run quality` runs test, lint, build, static HTML output checks, and sensitive content scanning.
- Latest local quality gate passed: `npm run quality`.

## Next Work

- Improve mobile and desktop layout after real browser screenshot review.
- When browser access to localhost is available, capture desktop and mobile screenshots.
- Before final delivery, run the three independent subagent reviews required by `AGENTS.md`.

## Known Verification Gap

Browser verification against `http://localhost:3000` was blocked by the Browser plugin enterprise network policy. Do not claim final visual acceptance until a real browser desktop and mobile screenshot review has been completed.

`npm audit --audit-level=moderate` currently reports a PostCSS advisory through `next@16.2.9`'s internal dependency tree. `npm audit fix --force` proposes a breaking downgrade to an old Next.js version, so do not apply it automatically; revisit when a safe Next.js patch is available.
