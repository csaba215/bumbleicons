import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const readmePath = path.join(root, "README.md");
const rawSvgDir = path.join(root, "raw-svg");
const columns = 6;

const files = fs
  .readdirSync(rawSvgDir)
  .filter((file) => file.endsWith(".svg"))
  .sort((a, b) => a.localeCompare(b));

const rows = ["## Icons", "", "| Icon | Icon | Icon | Icon | Icon | Icon |", "| --- | --- | --- | --- | --- | --- |"];

for (let index = 0; index < files.length; index += columns) {
  const cells = files.slice(index, index + columns).map((file) => {
    const name = file.replace(/\.svg$/, "");
    return `<img src="raw-svg/${file}" alt="${name}" width="24" height="24"><br>\`${name}\``;
  });

  while (cells.length < columns) {
    cells.push("");
  }

  rows.push(`| ${cells.join(" | ")} |`);
}

const readme = fs.readFileSync(readmePath, "utf8");
const start = readme.indexOf("## Icons");

if (start === -1) {
  throw new Error("README.md must contain a '## Icons' section");
}

const nextHeading = readme.slice(start + "## Icons".length).search(/\n## /);
const end = nextHeading === -1 ? readme.length : start + "## Icons".length + nextHeading;
const updated = `${readme.slice(0, start).trimEnd()}\n\n${rows.join("\n")}${readme.slice(end)}`;

fs.writeFileSync(readmePath, `${updated.trimEnd()}\n`);
