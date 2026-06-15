# personalweb Decisions

## 2026-06-14 — Use Next.js App Router

- Use Next.js 16, React 19, TypeScript, and hand-written CSS for the first implementation.
- Keep the site mostly static for now; project content lives in typed local data rather than a CMS.
- Use App Router files under `src/app/`.

## 2026-06-14 — Public Identity

- Use `lgk-code` as the public identity until the user provides a different display name.
- Do not infer or invent a legal name.

## 2026-06-14 — Repository Binding

- Treat `https://github.com/lgk-code/personalweb` as the canonical repository binding for this project.
- Use `https://github.com/lgk-code/personalweb.git` as `origin` when the repository is initialized locally.
- Keep the repository binding in project docs. The repository is publicly reachable as of 2026-06-15 and the public page may render it as a source-code callout.

## 2026-06-14 — Project Showcase Sources

- Read `/home/lgk/projects/AIFocus` and `/home/lgk/projects/CodePath` for facts.
- Do not modify those adjacent projects unless the user explicitly asks.
- Do not expose local filesystem paths, secrets, private config, or unreleased claims in public page content.

## 2026-06-14 — Motion And Media

- Do not use Remotion for the first homepage slice; current motion is lightweight CSS only.
- Use real project screenshots where available. AIFocus combines a generated data-system visual with a manually reviewed `/agent` access screenshot until a public deployment or source URL is available.
- The first screen should show project evidence immediately, so it uses a generated bitmap composition rather than purely decorative CSS shapes.
- Generated SVG-to-PNG assets embed Next.js bundled Geist WOFF2 fonts before Sharp rasterization so local WSL output and GitHub Actions output do not drift due to host font differences.
- 2026-06-15 motion remains CSS-only: desktop may use slow hero drift and project scanline/reveal motion, while small screens disable continuous hero drift and `prefers-reduced-motion: reduce` explicitly disables the motion layer.
- Project motion should be tied to the showcased system: AIFocus uses information-chain scan motion, while CodePath uses side-panel focus/lock motion rather than sharing a single generic effect.
- Project presentation should lean toward system records instead of closed portfolio cards: use record labels, input/process/output workflow traces, open row borders, and real project evidence before adding decorative framing.
- Scroll reveal motion can shift content into place, but it must not lower project-card opacity because screenshot timing should not make critical copy look disabled or unreadable.
- Operating-style content should stay grounded in observable practice. When it risks becoming abstract, prefer compact quality signals such as local gates, browser checks, and public-content boundaries.

## 2026-06-14 — Verification

- Minimum local gate is `npm run quality`, which runs tests, lint, build, and sensitive content scanning.
- Static HTML output checks are part of the local gate because browser screenshot verification can be temporarily unavailable in Codex; they also enforce small HTML size budgets for the homepage and 404 output.
- Generated asset drift checks run before tests so code and committed PNG outputs stay in sync.
- Design redline checks prevent regressions such as viewport-scaled font sizes, default scaffold assets, decorative gradients, orb/bokeh motifs, and negative letter spacing.
- Content redline checks scan source files for filler/template wording so real project copy does not regress into placeholders.
- Contrast checks statically enforce the main text/background color pairs at WCAG AA regular-text contrast.
- Public asset privacy scans inspect printable metadata in image and icon files for local paths or credential markers.
- Asset tests enforce both useful dimensions and byte budgets for public PNG visuals.
- Route output checks read the production build manifests to keep the homepage, 404, image routes, `manifest.webmanifest`, `robots.txt`, and `sitemap.xml` static.
- Runtime smoke checks start `next start` on an ephemeral local port and verify key routes, `manifest.webmanifest`, and actual security response headers.
- Static accessibility output checks cover landmarks, skip targets, labelled navigation, focus outlines, reduced motion, image alt text, and link safety.
- Public link checks use a static allowlist for rendered homepage and 404 HTTPS links and prevent not-yet-public repository links from appearing. The allowlist includes the GitHub profile, the personalweb source repository, the CodePath release page, and the CodePath extension download.
- Live public link checks cover rendered homepage and 404 links as an opt-in final-review command, but stay out of `npm run quality` to avoid network flakes in CI. The script uses `curl` so WSL proxy settings are honored consistently, and strips query/hash from redirected URLs before printing results.
- Project docs consistency checks keep the repository binding, living `AGENTS.md` rule, `/neat` context-hygiene rule, real browser screenshot requirement, three-agent final review gate, and GitHub Actions Node 22 / v6 action runtime from disappearing by accident.
- Audit checks require zero moderate-or-higher advisories.
- Pin `next` to `16.2.9` and use an npm override for its internal `postcss` dependency until Next ships the patched PostCSS version upstream.
- Mirror the same gate in GitHub Actions for `main` pushes and pull requests.
- Keep first-party GitHub Actions on Node-24-ready major versions where available; the quality workflow currently uses `actions/checkout@v6`, `actions/setup-node@v6`, and Node 22 for the project runtime.
- Use Dependabot PRs for npm and GitHub Actions updates instead of ad hoc dependency drift.
- Full delivery also requires browser screenshot verification and the three-role subagent review gate described in `AGENTS.md`.

## 2026-06-14 — Dependency Hygiene

- Keep runtime dependencies exact-pinned in `package.json`, and enforce that with `npm run check:package`.
- Use `.npmrc` with `save-exact=true` so future `npm install` commands preserve exact pins.
- Apply low-risk patch updates only after `npm run quality` passes.

## 2026-06-14 — Public Site URL

- Keep the GitHub repository URL separate from the public site URL.
- Resolve the public site URL from `NEXT_PUBLIC_SITE_URL`, then Vercel deployment variables, then local development.
- Normalize configured deployment URLs to their origin by removing path, query, and hash segments.
- Use the resolved site URL for metadata, `robots.txt`, and `sitemap.xml`.
- Keep homepage metadata, `robots.txt`, and `sitemap.xml` as static build outputs; local previews on a non-default port must set `NEXT_PUBLIC_SITE_URL` before `npm run build` if canonical URLs need to match that port.
- Local development falls back to `http://localhost:$PORT` when `PORT` is set, otherwise `http://localhost:3000`.
- Keep viewport metadata static: `themeColor` matches the dark hero surface and `colorScheme` remains light for default browser UI.

## 2026-06-14 — Security Headers

- Add low-risk response headers in `next.config.ts`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy`.
- Disable `X-Powered-By` so the app does not advertise the framework in runtime headers.
- Do not add a Content Security Policy yet; it needs a separate pass because Next.js inline scripts, JSON-LD, and image optimization can be easy to break.
