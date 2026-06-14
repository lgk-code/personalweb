# personalweb Roadmap

## Current State — 2026-06-15

- Next.js 16 / TypeScript / hand-written CSS app has been scaffolded.
- Git is initialized on `main` and `origin` points to `https://github.com/lgk-code/personalweb.git`.
- The home page now has a first usable slice: project-backed hero, project showcase, evidence chain, working style, and contact links.
- `AIFocus` and `CodePath` content is stored in `src/lib/portfolio.ts` and covered by `src/lib/portfolio.test.ts`.
- Project cards include short field notes so each showcased system carries a little more working-context signal than a generic portfolio card.
- Key PNG visuals are covered by asset metadata and byte-budget tests.
- A CodePath public screenshot was copied into `public/projects/` for visual project evidence.
- A CodePath MCP comparison crop is included as a second public-safe screenshot, with the original local path area excluded.
- Generated bitmap assets live at `public/projects/aifocus-signal.png` and `public/projects/hero-workbench.png`; both can be regenerated with `npm run assets:generate`.
- Mobile-specific public assets are generated for AIFocus and CodePath so project evidence remains legible on narrow viewports.
- Open Graph / Twitter metadata and a statically generated `/opengraph-image` PNG route are in place.
- Generated `/icon`, `/apple-icon`, and `src/app/favicon.ico` assets replace the scaffold favicon treatment.
- A generated `/manifest.webmanifest` route connects the site identity to the existing favicon, icon, and Apple icon assets.
- Public site URL resolution is centralized for metadata, `robots.txt`, and `sitemap.xml`.
- Metadata routes are covered by unit tests.
- Homepage metadata includes canonical, author, creator, publisher, Open Graph, Twitter, theme-color, color-scheme, and JSON-LD signals.
- Homepage JSON-LD describes the public profile and showcased projects.
- Public page links avoid private or not-yet-public GitHub repositories, while exposing the GitHub profile, the CodePath release page, and the CodePath extension download.
- Live public link checks are available with `npm run check:links:live` for final review passes; redirected signed query strings are stripped from command output.
- A custom `not-found` page replaces the default unmatched-route experience.
- A keyboard-visible skip link improves access to the project section.
- Static accessibility checks cover landmarks, hash-link targets, focus outlines, reduced motion, labelled nav, and project image alt text.
- Basic security headers are configured in `next.config.ts`.
- `npm run quality` runs generated asset drift checks, test, lint, design redline checks, content redline checks, contrast checks, public asset privacy scans, build, static HTML output checks, route output checks, runtime smoke checks, accessibility checks, public link allowlist checks, project docs consistency checks, package policy checks, sensitive content scanning, and audit checks.
- GitHub Actions runs the same quality gate on `main` pushes and pull requests.
- Dependabot is configured for npm and GitHub Actions updates.
- Runtime dependencies are exact-pinned; `.npmrc` sets `save-exact=true` to preserve that convention during future installs.
- `docs/REVIEW-RUBRIC.md` defines the three-agent final review scoring rules.
- Latest local quality gate passed: 2026-06-15, `npm run quality`.
- 2026-06-15 motion pass added lightweight CSS motion: desktop hero drift, staggered hero entry, project scanline motion, scroll reveal, hover feedback, mobile proof labels that wrap safely, explicit reduced-motion shutdown, and small-screen continuous-motion disablement.
- 2026-06-15 real browser verification passed with Browser DOM checks at 1440x1000, 390x844, 360x780, and 430x932: no horizontal overflow, no console errors, visible hero image loaded, proof labels stayed within viewport, desktop retained `hero-drift`, and small screens disabled the continuous hero drift.
- 2026-06-15 Edge headless screenshots were captured for desktop hero, mobile hero, and desktop project section after the in-app Browser screenshot API timed out. Use Browser DOM checks plus Edge/CDP screenshot fallback if this recurs.
- 2026-06-15 final-style three-agent review passed: vibe coder 92, native design 92, destructive quality 92, with no redlines.
- 2026-06-15 live public link check passed with `npm run check:links:live`.
- 2026-06-15 project section motion was differentiated: AIFocus keeps information-chain scan motion, CodePath uses side-panel focus/lock motion, and the desktop CodePath card reverses the text/media order to reduce repeated case-study card rhythm.

## Next Work

- Reduce remaining case-study/card feel in the project section without losing the strong real-project evidence.
- Add a concise AIFocus evidence note when a safe public source or screenshot is available, so the private-project claims remain traceable without exposing local paths.

## Midreview Notes

2026-06-14 static-only subagent midreview scores were 88 (vibe coder), 86 (native design), and 82 (destructive quality). Follow-up fixes removed competing hero asset text, localized the skip link, made project proof points name AIFocus/CodePath directly, added mobile-specific project visuals, strengthened secret/audit checks, disabled `X-Powered-By`, and made local site URLs respect `PORT`. These reviews did not count as final acceptance at the time because real browser desktop/mobile screenshots had not yet been completed.

Later on 2026-06-14, a second static-only subagent midreview scored 93 (vibe coder), 91 (native design), and 92 (destructive quality), with no static redlines. Follow-up fixes replaced the project-management flavored hero proof point, added project field notes, added runtime smoke coverage, and made generated asset checks run against a temporary output root. These scores were superseded by the 2026-06-15 real-browser review recorded above.

## Known Verification Notes

The in-app Browser screenshot API can time out on `Page.captureScreenshot` even when DOM inspection works. For visual acceptance, use Browser DOM checks for layout/console/motion state and Edge/CDP screenshots for rendered evidence when needed.

`https://github.com/lgk-code/personalweb` is publicly reachable as of 2026-06-15. The rendered public page can keep omitting the repository link until the site intentionally adds a personalweb source-code callout.

`next@16.2.9` still declares an internal `postcss@8.4.31` dependency, which is affected by [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93). The project uses an npm override to force Next's internal PostCSS to `8.5.10`, so `npm audit --audit-level=moderate` and `npm run check:audit` currently pass with zero advisories. Revisit the override when Next ships the patched PostCSS version upstream.
