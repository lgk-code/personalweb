# personalweb Roadmap

## Current State — 2026-06-14

- Next.js 16 / TypeScript / hand-written CSS app has been scaffolded.
- Git is initialized on `main` and `origin` points to `https://github.com/lgk-code/personalweb.git`.
- The home page now has a first usable slice: project-backed hero, project showcase, evidence chain, working style, and contact links.
- `AIFocus` and `CodePath` content is stored in `src/lib/portfolio.ts` and covered by `src/lib/portfolio.test.ts`.
- Project cards include short field notes so each showcased system carries a little more working-context signal than a generic portfolio card.
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
- Live public link checks are available with `npm run check:links:live` for final review passes.
- A custom `not-found` page replaces the default unmatched-route experience.
- A keyboard-visible skip link improves access to the project section.
- Static accessibility checks cover landmarks, hash-link targets, focus outlines, reduced motion, labelled nav, and project image alt text.
- Basic security headers are configured in `next.config.ts`.
- `npm run quality` runs generated asset drift checks, test, lint, design redline checks, contrast checks, public asset privacy scans, build, static HTML output checks, route output checks, runtime smoke checks, accessibility checks, public link allowlist checks, sensitive content scanning, and audit checks.
- GitHub Actions runs the same quality gate on `main` pushes and pull requests.
- Dependabot is configured for npm and GitHub Actions updates.
- `docs/REVIEW-RUBRIC.md` defines the three-agent final review scoring rules.
- Latest local quality gate passed: `npm run quality`.

## Next Work

- Improve mobile and desktop layout after real browser screenshot review.
- When browser access to localhost is available, capture desktop and mobile screenshots.
- Before final delivery, run the three independent subagent reviews required by `AGENTS.md`.

## Midreview Notes

2026-06-14 static-only subagent midreview scores were 88 (vibe coder), 86 (native design), and 82 (destructive quality). Follow-up fixes removed competing hero asset text, localized the skip link, made project proof points name AIFocus/CodePath directly, added mobile-specific project visuals, strengthened secret/audit checks, disabled `X-Powered-By`, and made local site URLs respect `PORT`. These reviews do not count as final acceptance because real browser desktop/mobile screenshots are still missing.

Later on 2026-06-14, a second static-only subagent midreview scored 93 (vibe coder), 91 (native design), and 92 (destructive quality), with no static redlines. Follow-up fixes replaced the project-management flavored hero proof point, added project field notes, added runtime smoke coverage, and made generated asset checks run against a temporary output root. These scores still do not count as final acceptance because real browser desktop/mobile screenshots are still missing.

## Known Verification Gap

Browser verification against `http://localhost:3000` was blocked by the Browser plugin enterprise network policy. Do not claim final visual acceptance until a real browser desktop and mobile screenshot review has been completed.

`https://github.com/lgk-code/personalweb` is the intended canonical repository binding, but anonymous access currently returns 404. Keep it out of rendered public pages until the repository is pushed and public, or until the project intentionally treats it as a private repository reference only.

`next@16.2.9` still declares an internal `postcss@8.4.31` dependency, which is affected by [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93). The project uses an npm override to force Next's internal PostCSS to `8.5.10`, so `npm audit --audit-level=moderate` and `npm run check:audit` currently pass with zero advisories. Revisit the override when Next ships the patched PostCSS version upstream.
