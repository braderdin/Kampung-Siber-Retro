// Start: UI/UX Audit Harness — Kampung Siber (Visitor Simulation)
import puppeteer from "puppeteer-core";
import { writeFileSync } from "node:fs";

const CHROME = "/usr/bin/chromium-browser";
const BASE = "http://localhost:3000";
const ROUTES = ["/", "/hub", "/arcade", "/cyber-museum", "/bbs-room", "/guestbook",
  "/directory", "/browse", "/docs", "/signin", "/about", "/map", "/themes",
  "/dashboard", "/status", "/contact", "/help", "/balai_raya", "/town-hall"];
const VIEWPORTS = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "mobile", width: 375, height: 812 },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Start: In-page audit — detect horizontal overflow + clipped elements + buttons
function auditInPage() {
  const doc = document, win = window;
  const sw = doc.documentElement.scrollWidth, cw = doc.documentElement.clientWidth;
  const vw = win.innerWidth;
  const all = [...doc.querySelectorAll("*")];
  let clipped = [];
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > vw + 2 && r.left < vw) {
      if (clipped.length < 6) clipped.push({ tag: el.tagName.toLowerCase(), cls: (el.className||"").toString().slice(0,50), right: Math.round(r.right) });
    }
  }
  const els = [...doc.querySelectorAll("button, a")].slice(0, 30);
  const buttons = els.map((e)=>({ t:(e.textContent||"").replace(/\s+/g," ").trim().slice(0,35), w:Math.round(e.getBoundingClientRect().width), h:Math.round(e.getBoundingClientRect().height) }));
  return { overflowX: sw > cw + 2, overflowPx: sw - cw, clippedTotal: all.filter((el)=>{const r=el.getBoundingClientRect();return r.width>0&&r.right>vw+2&&r.left<vw;}).length, clipped, buttons, title: doc.title, bodyH: doc.body.scrollHeight };
}
// End: In-page audit

// Start: Main runner
(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const report = { generatedAt: new Date().toISOString(), routes: {} };
  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      report.routes[route] = {};
      for (const vp of VIEWPORTS) {
        await page.setViewport({ width: vp.width, height: vp.height });
        let status = 200;
        try {
          const resp = await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 20000 });
          status = resp ? resp.status() : 0;
        } catch (e) { status = -1; }
        await sleep(600);
        const data = await page.evaluate(auditInPage);
        report.routes[route][vp.name] = { status, ...data };
      }
      await page.close();
    }
  } finally { await browser.close(); }
  writeFileSync("scripts/audit-report.json", JSON.stringify(report, null, 2));
  console.log("AUDIT_DONE");
})().catch((e) => { console.error("AUDIT_FAIL", e); process.exit(1); });
// End: Main runner