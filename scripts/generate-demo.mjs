import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cssPath = path.join(root, "bumblevueicons.css");
const demoPath = path.join(root, "demo.html");

const css = fs.readFileSync(cssPath, "utf8");
const icons = [...css.matchAll(/\.pi-([a-z0-9-]+):before\s*\{\s*content:\s*"\\([a-f0-9]+)";\s*\}/g)].map(
  ([, name, code]) => ({ name, code })
);

if (!icons.length) {
  throw new Error("No icon classes found in bumblevueicons.css");
}

const glyphs = icons
  .map(
    ({ name, code }) => `        <div class="glyph fs1">
            <div class="clearfix bshadow0 pbs">
                <span class="pi pi-${name}"></span>
                <span class="mls"> pi-${name}</span>
            </div>
            <fieldset class="fs0 size1of1 clearfix hidden-false">
                <input type="text" readonly value="${code}" class="unit size1of2" />
                <input type="text" maxlength="1" readonly value="&#x${code};" class="unitRight size1of2 talign-right" />
            </fieldset>
            <div class="fs0 bshadow0 clearfix hidden-true">
                <span class="unit pvs fgc1">liga: </span>
                <input type="text" readonly value="" class="liga unitRight" />
            </div>
        </div>`
  )
  .join("\n");

const html = `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>BumbleVue Icons Demo</title>
    <meta name="description" content="Icon Library for BumbleVue UI Library">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="demo-files/demo.css">
    <link rel="stylesheet" href="bumblevueicons.css">
</head>
<body>
    <div class="bgc1 clearfix">
        <h1 class="mhmm mvm"><span class="fgc1">Font Name:</span> bumblevueicons <small class="fgc1">(Glyphs:&nbsp;${icons.length})</small></h1>
    </div>
    <div class="clearfix mhl ptl">
${glyphs}
    </div>

    <!--[if gt IE 8]><!-->
    <div class="mhl clearfix mbl">
        <h1>Font Test Drive</h1>
        <label>
            Font Size: <input id="fontSize" type="number" class="textbox0 mbm"
            min="8" value="48" />
            px
        </label>
        <input id="testText" type="text" class="phl size1of1 mvl"
        placeholder="Type some text to test..." value=""/>
        <div id="testDrive" class="pi">&nbsp;</div>
    </div>
    <!--<![endif]-->

    <script src="demo-files/demo.js"></script>
</body>
</html>
`;

fs.writeFileSync(demoPath, html);
