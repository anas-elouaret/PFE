#!/usr/bin/env node
/**
 * Tell Bing, Yandex, Seznam and Naver that pages changed.
 *
 * IndexNow needs no account and no verification beyond a key file served
 * from the site itself, which is why this exists alongside Search Console
 * rather than instead of it — Google does not participate.
 *
 * The URL list is read from public/sitemap.xml so it cannot drift from what
 * the site actually publishes.
 *
 *   node scripts/indexnow.mjs            submit every URL in the sitemap
 *   node scripts/indexnow.mjs /contact   submit specific paths
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "growstack.ma";
const ORIGIN = `https://${HOST}`;

const keyFile = fs
  .readdirSync(path.join(ROOT, "public"))
  .find((f) => /^[0-9a-f]{32}\.txt$/.test(f));

if (!keyFile) {
  console.error("No IndexNow key file in public/. Expected <32-hex>.txt");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");

const args = process.argv.slice(2);
let urlList;
if (args.length) {
  urlList = args.map((p) => (p.startsWith("http") ? p : ORIGIN + (p.startsWith("/") ? p : `/${p}`)));
} else {
  const xml = fs.readFileSync(path.join(ROOT, "public", "sitemap.xml"), "utf8");
  urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

// The key must be fetchable before anything is accepted.
const probe = await fetch(`${ORIGIN}/${keyFile}`).catch(() => null);
if (!probe || !probe.ok) {
  console.error(`Could not read ${ORIGIN}/${keyFile}.`);
  console.error("Either it is not deployed yet, or this machine reaches the");
  console.error("web through a proxy that Node's fetch does not use. Check with:");
  console.error(`  curl -sS ${ORIGIN}/${keyFile}`);
  process.exit(1);
}
const served = (await probe.text()).trim();
if (served !== key) {
  console.error("Key file contents do not match its name.");
  process.exit(1);
}

const body = { host: HOST, key, keyLocation: `${ORIGIN}/${keyFile}`, urlList };
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

// 200 accepted, 202 accepted but key still being validated.
console.log(`submitted ${urlList.length} urls -> HTTP ${res.status}`);
if (![200, 202].includes(res.status)) {
  console.error(await res.text());
  process.exit(1);
}
