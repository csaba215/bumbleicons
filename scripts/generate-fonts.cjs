const fs = require("node:fs");
const path = require("node:path");
const webfontsGenerator = require("webfonts-generator");

const root = path.resolve(__dirname, "..");
const rawSvgDir = path.join(root, "raw-svg");
const fontsDir = path.join(root, "fonts");
const cssPath = path.join(root, "bumblevueicons.css");
const fontName = "bumblevueicons";
const aliases = new Map([
  ["asteriks", "asterisk"],
  ["sort-alpha-alt-down", "sort-alpha-down-alt"],
  ["sort-alpha-alt-up", "sort-alpha-up-alt"],
  ["sort-numeric-alt-down", "sort-numeric-down-alt"],
  ["sort-numeric-alt-up", "sort-numeric-up-alt"]
]);

const fontTypes = ["eot", "woff2", "woff", "ttf", "svg"];
const svgFiles = fs
  .readdirSync(rawSvgDir)
  .filter((file) => file.endsWith(".svg"))
  .sort((a, b) => a.localeCompare(b))
  .map((file) => path.join(rawSvgDir, file));

const css = fs.readFileSync(cssPath, "utf8");
const codepoints = Object.create(null);

for (const [, name, code] of css.matchAll(/\.pi-([a-z0-9-]+):before\s*\{\s*content:\s*"\\([a-f0-9]+)";\s*\}/g)) {
  codepoints[name] = Number.parseInt(code, 16);
}

for (const [rawName, cssName] of aliases) {
  if (Number.isInteger(codepoints[cssName])) {
    codepoints[rawName] = codepoints[cssName];
  }
}

fs.mkdirSync(fontsDir, { recursive: true });

for (const type of fontTypes) {
  fs.rmSync(path.join(fontsDir, `primeicons.${type}`), { force: true });
  fs.rmSync(path.join(fontsDir, `${fontName}.${type}`), { force: true });
}

webfontsGenerator(
  {
    files: svgFiles,
    dest: fontsDir,
    fontName,
    types: fontTypes,
    codepoints,
    normalize: true,
    fontHeight: 1024,
    descent: 64,
    formatOptions: {
      ttf: {
        ts: 0
      }
    },
    writeFiles: true,
    css: false,
    html: false
  },
  (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    const svgFontPath = path.join(fontsDir, `${fontName}.svg`);
    const svgFont = fs.readFileSync(svgFontPath, "utf8");
    fs.writeFileSync(svgFontPath, svgFont.replace(/[ \t]+$/gm, ""));
  }
);
