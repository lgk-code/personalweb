# personalweb Decisions

## 2026-06-14 — Use Next.js App Router

- Use Next.js 16, React 19, TypeScript, and Tailwind CSS for the first implementation.
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
- Mirror the same gate in GitHub Actions for `main` pushes and pull requests.
- Full delivery also requires browser screenshot verification and the three-role subagent review gate described in `AGENTS.md`.

## 2026-06-14 — Public Site URL

- Keep the GitHub repository URL separate from the public site URL.
- Resolve the public site URL from `NEXT_PUBLIC_SITE_URL`, then Vercel deployment variables, then local development.
- Use the resolved site URL for metadata, `robots.txt`, and `sitemap.xml`.
