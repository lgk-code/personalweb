import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDir = path.join(process.cwd(), "public", "projects");

const stages = [
  ["01", "Sources", "T1 feeds and trusted AI channels"],
  ["02", "Filter", "AI relevance before costly work"],
  ["03", "Score", "Summary, tags, category"],
  ["04", "Cluster", "Merge repeats into one event"],
  ["05", "Daily", "Morning brief from signal"],
  ["06", "Skill", "RSS, API, agents"],
];

const stageCards = stages
  .map(([index, title, body], position) => {
    const x = 70 + (position % 3) * 380;
    const y = 235 + Math.floor(position / 3) * 210;
    return `
      <g>
        <rect x="${x}" y="${y}" width="318" height="154" rx="8" fill="#f7f3ea" stroke="#181713" stroke-width="2" />
        <text x="${x + 24}" y="${y + 42}" fill="#286a4b" font-size="22" font-weight="700" font-family="Geist Mono, ui-monospace, monospace">${index}</text>
        <text x="${x + 24}" y="${y + 82}" fill="#181713" font-size="30" font-weight="760" font-family="Geist, Arial, sans-serif">${title}</text>
        <text x="${x + 24}" y="${y + 118}" fill="#5f5b52" font-size="17" font-family="Geist, Arial, sans-serif">${body}</text>
      </g>
    `;
  })
  .join("");

const connectorLines = `
  <path d="M388 312 H450 V312 H450" stroke="#181713" stroke-width="2" fill="none" />
  <path d="M768 312 H830" stroke="#181713" stroke-width="2" fill="none" />
  <path d="M990 389 V445 H229 V445 V445" stroke="#181713" stroke-width="2" fill="none" />
  <path d="M388 522 H450" stroke="#181713" stroke-width="2" fill="none" />
  <path d="M768 522 H830" stroke="#181713" stroke-width="2" fill="none" />
`;

const svg = `
<svg width="1280" height="760" viewBox="0 0 1280 760" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="760" fill="#eee5d5" />
  <rect x="40" y="40" width="1200" height="680" rx="14" fill="#fffdf8" stroke="#181713" stroke-width="3" />
  <rect x="70" y="70" width="1140" height="96" rx="8" fill="#151713" />
  <text x="104" y="113" fill="#f7f3ea" font-size="30" font-weight="760" font-family="Geist, Arial, sans-serif">AIFocus signal system</text>
  <text x="104" y="145" fill="#c8d9a2" font-size="18" font-family="Geist Mono, ui-monospace, monospace">from noisy AI feeds to readable daily signal</text>
  <text x="948" y="128" fill="#f7f3ea" font-size="18" font-family="Geist Mono, ui-monospace, monospace">worker / API / Skill</text>
  ${connectorLines}
  ${stageCards}
  <rect x="70" y="645" width="180" height="20" rx="4" fill="#286a4b" />
  <rect x="270" y="645" width="96" height="20" rx="4" fill="#b3261e" />
  <rect x="386" y="645" width="260" height="20" rx="4" fill="#d3c08f" />
  <rect x="666" y="645" width="148" height="20" rx="4" fill="#285f8f" />
  <text x="842" y="662" fill="#5f5b52" font-size="15" font-family="Geist Mono, ui-monospace, monospace">ranking is code; model handles semantics</text>
</svg>
`;

await mkdir(outputDir, { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, "aifocus-signal.png"));

console.log("Generated public/projects/aifocus-signal.png");
