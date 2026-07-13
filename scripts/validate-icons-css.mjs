import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const rawSvgDir = path.join(root, "raw-svg");
const cssPath = path.join(root, "bumblevueicons.css");

const aliases = new Map([
  ["asteriks", "asterisk"],
  ["sort-alpha-alt-down", "sort-alpha-down-alt"],
  ["sort-alpha-alt-up", "sort-alpha-up-alt"],
  ["sort-numeric-alt-down", "sort-numeric-down-alt"],
  ["sort-numeric-alt-up", "sort-numeric-up-alt"]
]);

const rawIcons = fs
  .readdirSync(rawSvgDir)
  .filter((file) => file.endsWith(".svg"))
  .map((file) => file.replace(/\.svg$/, ""))
  .sort((a, b) => a.localeCompare(b));

const css = fs.readFileSync(cssPath, "utf8");
const cssIcons = [...css.matchAll(/\.pi-([a-z0-9-]+):before\s*\{/g)]
  .map((match) => match[1])
  .sort((a, b) => a.localeCompare(b));
const cssIconSet = new Set(cssIcons);
const expectedCssIcons = new Set(rawIcons.map((name) => aliases.get(name) || name));

const missing = rawIcons.filter((name) => !cssIconSet.has(aliases.get(name) || name));
const extra = cssIcons.filter((name) => !expectedCssIcons.has(name));

if (missing.length > 0) {
  console.error(`Validated ${rawIcons.length} raw SVG icons against ${path.basename(cssPath)}.`);

  console.error("Missing CSS classes for raw SVG icons:");
  for (const name of missing) {
    console.error(`- raw-svg/${name}.svg expected .pi-${aliases.get(name) || name}:before`);
  }

  process.exit(1);
}

console.log(`Validated ${rawIcons.length} raw SVG icons against ${path.basename(cssPath)}. Missing: 0.`);

if (extra.length > 0) {
  console.log("Extra CSS icon classes without raw SVG icons:");
  for (const name of extra) {
    console.log(`- .pi-${name}:before`);
  }

  process.exit(1);
}
