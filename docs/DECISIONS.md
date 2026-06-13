# personalweb Decisions

## 2026-06-14 — Use Next.js App Router

- Use Next.js 16, React 19, TypeScript, and hand-written CSS for the first implementation.
- Keep the site mostly static for now; project content lives in typed local data rather than a CMS.
- Use App Router files under `src/app/`.

## 2026-06-14 — Public Identity

- Use `lgk-code` as the public identity until the user provides a different display name.
- Do not infer or invent a legal name.

## 2026-06-14 — Project Showcase Sources

- Read `/home/lgk/projects/AIFocus` and `/home/lgk/projects/CodePath` for facts.
- Do not modify those adjacent projects unless the user explicitly asks.
- Do not expose local filesystem paths, secrets, private config, or unreleased claims in public page content.

## 2026-06-14 — Motion And Media

- Do not use Remotion for the first homepage slice; current motion is lightweight CSS only.
- Use real project screenshots where available. AIFocus uses a generated PNG data-system visual until a safe real product screenshot is available.
- The first screen should show project evidence immediately, so it uses a generated bitmap composition rather than purely decorative CSS shapes.

## 2026-06-14 — Verification

- Minimum local gate is `npm run quality`, which runs tests, lint, build, and sensitive content scanning.
- Static HTML output checks are part of the local gate because browser screenshot verification can be temporarily unavailable in Codex.
- Generated asset drift checks run before tests so code and committed PNG outputs stay in sync.
- Design redline checks prevent regressions such as viewport-scaled font sizes, default scaffold assets, decorative gradients, orb/bokeh motifs, and negative letter spacing.
- Contrast checks statically enforce the main text/background color pairs at WCAG AA regular-text contrast.
- Public asset privacy scans inspect printable metadata in image and icon files for local paths or credential markers.
- Route output checks read the production build manifests to keep the homepage, 404, image routes, `robots.txt`, and `sitemap.xml` static.
- Runtime smoke checks start `next start` on an ephemeral local port and verify key routes plus actual security response headers.
- Static accessibility output checks cover landmarks, skip targets, labelled navigation, focus outlines, reduced motion, image alt text, and link safety.
- Public link checks use a static allowlist for rendered homepage HTTPS links and prevent not-yet-public repository links from appearing.
- Live public link checks are available as an opt-in final-review command, but stay out of `npm run quality` to avoid network flakes in CI.
- Audit checks require zero moderate-or-higher advisories.
- Pin `next` to `16.2.9` and use an npm override for its internal `postcss` dependency until Next ships the patched PostCSS version upstream.
- Mirror the same gate in GitHub Actions for `main` pushes and pull requests.
- Use Dependabot PRs for npm and GitHub Actions updates instead of ad hoc dependency drift.
- Full delivery also requires browser screenshot verification and the three-role subagent review gate described in `AGENTS.md`.

## 2026-06-14 — Public Site URL

- Keep the GitHub repository URL separate from the public site URL.
- Resolve the public site URL from `NEXT_PUBLIC_SITE_URL`, then Vercel deployment variables, then local development.
- Normalize configured deployment URLs to their origin by removing path, query, and hash segments.
- Use the resolved site URL for metadata, `robots.txt`, and `sitemap.xml`.
- Local development falls back to `http://localhost:$PORT` when `PORT` is set, otherwise `http://localhost:3000`.

## 2026-06-14 — Security Headers

- Add low-risk response headers in `next.config.ts`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy`.
- Disable `X-Powered-By` so the app does not advertise the framework in runtime headers.
- Do not add a Content Security Policy yet; it needs a separate pass because Next.js inline scripts, JSON-LD, and image optimization can be easy to break.
