import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";

const OUT = "/Users/user/Amadeus_web/reference/loveydovey";

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("https://www.loveydovey.ai/", {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});

await page.waitForTimeout(5000);

await page.screenshot({ path: `${OUT}/desktop-1440.png`, fullPage: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("https://www.loveydovey.ai/", {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
await mobile.waitForTimeout(5000);
await mobile.screenshot({ path: `${OUT}/mobile-390.png`, fullPage: true });

const dom = await page.evaluate(() => {
  const pick = (el) => {
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      class: el.className?.toString?.() || "",
      id: el.id || "",
      text: (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
        ? el.textContent?.trim().slice(0, 80)
        : ""),
      bg: cs.backgroundColor,
      color: cs.color,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      borderRadius: cs.borderRadius,
      padding: cs.padding,
      width: cs.width,
      height: cs.height,
    };
  };

  const sections = [];
  const walk = (el, depth = 0) => {
    if (depth > 6) return;
    const info = pick(el);
    if (info.class || info.text || el.tagName === "BODY" || el.tagName === "HEADER" || el.tagName === "NAV" || el.tagName === "MAIN") {
      sections.push({ depth, ...info });
    }
    for (const child of el.children) walk(child, depth + 1);
  };
  walk(document.body);

  const cssVars = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === ":root" || rule.selectorText?.includes("root")) {
          cssVars.push(rule.cssText);
        }
      }
    } catch {}
  }

  return {
    title: document.title,
    url: location.href,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
    fontFamily: getComputedStyle(document.body).fontFamily,
    cssVars,
    structure: sections.slice(0, 120),
    html: document.documentElement.outerHTML.slice(0, 50000),
  };
});

writeFileSync(`${OUT}/dom-analysis.json`, JSON.stringify(dom, null, 2));
writeFileSync(`${OUT}/page.html`, dom.html);

console.log("Captured:", OUT);
console.log("Title:", dom.title);
console.log("Body bg:", dom.bodyBg, "color:", dom.bodyColor);
console.log("Font:", dom.fontFamily);
console.log("Top structure sample:");
dom.structure.slice(0, 30).forEach((s) => {
  console.log("  ".repeat(s.depth) + `${s.tag}.${s.class.split(" ")[0]} ${s.text || ""} [${s.bg}]`);
});

await browser.close();
