const fs = require("node:fs");
const path = require("node:path");
const webfontsGenerator = require("webfonts-generator");

const root = path.resolve(__dirname, "..");
const rawSvgDir = path.join(root, "raw-svg");
const fontsDir = path.join(root, "fonts");
const selectionPath = path.join(root, "selection.json");
const fontName = "bumblevueicons";

const fontTypes = ["eot", "woff2", "woff", "ttf", "svg"];
const svgFiles = fs
  .readdirSync(rawSvgDir)
  .filter((file) => file.endsWith(".svg"))
  .sort((a, b) => a.localeCompare(b))
  .map((file) => path.join(rawSvgDir, file));

const selection = JSON.parse(fs.readFileSync(selectionPath, "utf8"));
const codepoints = Object.create(null);

for (const item of selection.icons || []) {
  const name = item.properties && item.properties.name;
  const code = item.properties && item.properties.code;

  if (name && Number.isInteger(code)) {
    codepoints[name] = code;
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
