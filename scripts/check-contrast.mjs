import { readFileSync } from "node:fs";
import path from "node:path";

const cssPath = path.join(process.cwd(), "src", "app", "globals.css");
const css = readFileSync(cssPath, "utf8");

function fail(message) {
  console.error(`Contrast check failed: ${message}`);
  process.exit(1);
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) {
    fail(`invalid hex color: ${hex}`);
  }

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }) {
  const channels = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(hexToRgb(foreground));
  const backgroundLuminance = relativeLuminance(hexToRgb(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function blendOver(foreground, alpha, background) {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  const blend = (front, back) => Math.round(front * alpha + back * (1 - alpha));

  return `#${[blend(fg.r, bg.r), blend(fg.g, bg.g), blend(fg.b, bg.b)]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

const variableMatches = [...css.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})/gi)];
const colors = Object.fromEntries(variableMatches.map(([, name, value]) => [name, value]));

const requiredVariables = ["background", "foreground", "muted", "panel", "ink", "red", "green", "blue"];
for (const name of requiredVariables) {
  if (!colors[name]) {
    fail(`missing CSS color variable --${name}`);
  }
}

const darkSurface = "#151713";
const methodSurface = "#e4ecf2";
const contactSurface = "#edf1e7";
const projectSurface = "#eef2f5";
const heroChipSurface = blendOver(colors.panel, 0.72, darkSurface);
const subtleActionSurface = blendOver(colors.panel, 0.08, darkSurface);

const pairs = [
  ["body text", colors.foreground, colors.background],
  ["muted copy on panel", colors.muted, colors.panel],
  ["muted copy on project surface", colors.muted, projectSurface],
  ["section kicker on panel", colors.red, colors.panel],
  ["section kicker on contact surface", colors.red, contactSurface],
  ["section kicker on method surface", colors.red, methodSurface],
  ["hero text", colors.panel, darkSurface],
  ["hero summary", "#edf0e6", darkSurface],
  ["hero kicker", "#ffb4a8", darkSurface],
  ["hero chip text", "#2e2b25", heroChipSurface],
  ["project evidence text", "#2f2d27", colors.panel],
  ["project field note on panel", "#2f2d27", colors.panel],
  ["project field note on alternate card", "#2f2d27", projectSurface],
  ["project link", colors.blue, colors.panel],
  ["project link on alternate card", colors.blue, projectSurface],
  ["evidence label", "#c8d9a2", darkSurface],
  ["evidence body", "#dce2d7", darkSurface],
  ["method number", colors.green, methodSurface],
  ["not-found body", "#dce2d7", darkSurface],
  ["not-found action", colors.panel, subtleActionSurface],
  ["focus outline on panel", "#005fcc", colors.panel],
];

const threshold = 4.5;
const failures = pairs
  .map(([label, foreground, background]) => ({
    label,
    foreground,
    background,
    ratio: contrastRatio(foreground, background),
  }))
  .filter(({ ratio }) => ratio < threshold);

if (failures.length > 0) {
  fail(
    failures
      .map(
        ({ label, foreground, background, ratio }) =>
          `${label}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1`
      )
      .join("\n")
  );
}

console.log(`Contrast check passed (${pairs.length} pairs, minimum ${threshold}:1)`);
