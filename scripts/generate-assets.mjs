import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputRoot = process.env.ASSET_OUTPUT_ROOT
  ? path.resolve(process.env.ASSET_OUTPUT_ROOT)
  : process.cwd();
const sourceAssetDir = path.join(process.cwd(), "public", "projects");
const outputDir = path.join(outputRoot, "public", "projects");
const appDir = path.join(outputRoot, "src", "app");
const aifocusPath = path.join(outputDir, "aifocus-signal.png");
const aifocusMobilePath = path.join(outputDir, "aifocus-signal-mobile.png");
const codePathBrowserPath = path.join(sourceAssetDir, "codepath-browser.png");
const codePathPanelPath = path.join(outputDir, "codepath-panel-mobile.png");
const heroPath = path.join(outputDir, "hero-workbench.png");
const faviconPath = path.join(appDir, "favicon.ico");

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

const mobileStageCards = stages
  .map(([index, title, body], position) => {
    const y = 174 + position * 118;
    return `
      <g>
        <rect x="56" y="${y}" width="648" height="88" rx="8" fill="#fffdf8" stroke="#181713" stroke-width="2" />
        <text x="84" y="${y + 38}" fill="#286a4b" font-size="20" font-weight="700" font-family="Geist Mono, ui-monospace, monospace">${index}</text>
        <text x="154" y="${y + 38}" fill="#181713" font-size="28" font-weight="760" font-family="Geist, Arial, sans-serif">${title}</text>
        <text x="154" y="${y + 66}" fill="#5f5b52" font-size="18" font-family="Geist, Arial, sans-serif">${body}</text>
      </g>
    `;
  })
  .join("");

const mobileSvg = `
<svg width="760" height="940" viewBox="0 0 760 940" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="940" fill="#eee5d5" />
  <rect x="28" y="28" width="704" height="884" rx="14" fill="#f9f7ef" stroke="#181713" stroke-width="3" />
  <rect x="56" y="58" width="648" height="84" rx="8" fill="#151713" />
  <text x="84" y="104" fill="#f7f3ea" font-size="30" font-weight="760" font-family="Geist, Arial, sans-serif">AIFocus signal path</text>
  <text x="84" y="130" fill="#c8d9a2" font-size="16" font-family="Geist Mono, ui-monospace, monospace">feeds to daily signal, API, RSS and Skill</text>
  ${mobileStageCards}
  <rect x="56" y="884" width="190" height="18" rx="4" fill="#286a4b" />
  <rect x="268" y="884" width="120" height="18" rx="4" fill="#b3261e" />
  <rect x="410" y="884" width="216" height="18" rx="4" fill="#285f8f" />
</svg>
`;

function createIco(pngBuffers, sizes) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  let imageOffset = 6 + pngBuffers.length * 16;
  const entries = pngBuffers.map((pngBuffer, index) => {
    const entry = Buffer.alloc(16);
    const size = sizes[index];
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(pngBuffer.length, 8);
    entry.writeUInt32LE(imageOffset, 12);
    imageOffset += pngBuffer.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function createFaviconFrame(size) {
  const strokeWidth = Math.max(1, Math.round(size * 0.07));
  const inset = Math.max(1, Math.round(size * 0.11));
  const fontSize = Math.round(size * 0.36);
  const iconSvg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#151713" />
    <rect x="${inset}" y="${inset}" width="${size - inset * 2}" height="${size - inset * 2}" rx="${Math.max(1, Math.round(size * 0.08))}" fill="none" stroke="#fffef8" stroke-width="${strokeWidth}" />
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="#fffef8" font-size="${fontSize}" font-weight="800" font-family="Arial, sans-serif">lgk</text>
  </svg>
  `;

  return sharp(Buffer.from(iconSvg)).png().toBuffer();
}

await mkdir(outputDir, { recursive: true });
await mkdir(appDir, { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(aifocusPath);
await sharp(Buffer.from(mobileSvg)).png().toFile(aifocusMobilePath);
await sharp(codePathBrowserPath)
  .extract({ left: 376, top: 110, width: 1012, height: 1170 })
  .flatten({ background: "#ffffff" })
  .resize({ width: 900 })
  .png()
  .toFile(codePathPanelPath);

const aifocusHero = await sharp(aifocusPath)
  .resize({ width: 780 })
  .png()
  .toBuffer();
const codePathHero = await sharp(codePathBrowserPath)
  .resize({ width: 760, height: 690, fit: "cover", position: "top" })
  .png()
  .toBuffer();

const heroSvg = `
<svg width="1920" height="1120" viewBox="0 0 1920 1120" xmlns="http://www.w3.org/2000/svg">
  <rect width="1920" height="1120" fill="#151713" />
  <rect x="0" y="0" width="820" height="1120" fill="#151713" />
  <rect x="820" y="0" width="1100" height="1120" fill="#dfe8df" />
  <rect x="104" y="120" width="532" height="1" fill="#edf0e6" opacity="0.42" />
  <rect x="104" y="236" width="408" height="1" fill="#edf0e6" opacity="0.28" />
  <rect x="104" y="352" width="590" height="1" fill="#edf0e6" opacity="0.18" />
  <rect x="104" y="794" width="420" height="1" fill="#edf0e6" opacity="0.16" />
  <rect x="104" y="876" width="300" height="1" fill="#edf0e6" opacity="0.22" />
  <rect x="104" y="948" width="520" height="1" fill="#edf0e6" opacity="0.14" />
  <rect x="104" y="1016" width="230" height="1" fill="#edf0e6" opacity="0.26" />
  <rect x="910" y="118" width="804" height="520" rx="14" fill="#fffdf8" stroke="#151713" stroke-width="3" />
  <rect x="1120" y="504" width="690" height="500" rx="14" fill="#18202a" stroke="#151713" stroke-width="3" />
  <rect x="1542" y="96" width="170" height="34" rx="4" fill="#b3261e" />
  <rect x="1710" y="718" width="92" height="34" rx="4" fill="#286a4b" />
  <path d="M790 694 C1030 648 1088 458 1278 452 C1450 446 1480 560 1664 524" stroke="#151713" stroke-width="4" fill="none" opacity="0.6" />
  <path d="M826 766 C1034 736 1184 830 1378 796 C1568 764 1618 646 1818 680" stroke="#b3261e" stroke-width="4" fill="none" opacity="0.62" />
</svg>
`;

await sharp(Buffer.from(heroSvg))
  .composite([
    { input: aifocusHero, left: 922, top: 130 },
    { input: codePathHero, left: 1136, top: 520 },
  ])
  .png()
  .toFile(heroPath);

const faviconSizes = [16, 32, 48, 64];
const faviconFrames = await Promise.all(faviconSizes.map((size) => createFaviconFrame(size)));
await writeFile(faviconPath, createIco(faviconFrames, faviconSizes));

console.log("Generated public/projects/aifocus-signal.png");
console.log("Generated public/projects/aifocus-signal-mobile.png");
console.log("Generated public/projects/codepath-panel-mobile.png");
console.log("Generated public/projects/hero-workbench.png");
console.log("Generated src/app/favicon.ico");
