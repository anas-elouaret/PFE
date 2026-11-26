import { useEffect } from "react";

const SITE_NAME = "GROWSTACK";
const ORIGIN = "https://growstack.ma";
const DEFAULT_IMAGE = `${ORIGIN}/logo.png`;

/**
 * Per-page title, description, canonical and social tags.
 *
 * The site is rendered in the browser, so every route is served the same
 * index.html. Without this, each page would report the home page's title and
 * description to search engines and to anything that unfurls a link.
 *
 * Implemented by hand rather than with a helmet library: the build cannot take
 * new dependencies, and this needs no more than a few DOM writes.
 */
function setMeta(selector, attr, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, name] = selector.match(/\[(?:name|property)="([^"]+)"\]/) || [];
    if (!name) return;
    el.setAttribute(selector.includes("property=") ? "property" : "name", name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export default function useSeo({ title, description, path, image, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Agence digitale au Maroc`;
    const url = `${ORIGIN}${path || window.location.pathname}`;
    const img = image || DEFAULT_IMAGE;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", description);

    // Each language version is its own canonical. Pointing the English and
    // Arabic pages back at the French one would tell search engines they are
    // duplicates and keep them out of the index.
    const requested = new URLSearchParams(window.location.search).get("lang");
    setCanonical(requested && requested !== "fr" ? `${url}?lang=${requested}` : url);

    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", img);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", img);

    // Point each page at its own three language versions. The app reads
    // `?lang=` on boot, so these are addresses a crawler can fetch — before
    // this, the English and Arabic sites had no URL of their own and were
    // invisible to search entirely.
    document.head
      .querySelectorAll('link[rel="alternate"][data-seo-hreflang]')
      .forEach((el) => el.remove());
    if (!noindex) {
      const base = `${ORIGIN}${path || window.location.pathname}`;
      for (const [hreflang, href] of [
        ["fr", base],
        ["en", `${base}?lang=en`],
        ["ar", `${base}?lang=ar`],
        ["x-default", base],
      ]) {
        const link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", hreflang);
        link.setAttribute("href", href);
        link.setAttribute("data-seo-hreflang", "");
        document.head.appendChild(link);
      }
    }

    // Private areas should not be indexed even if a link to them leaks out.
    let robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex, nofollow");
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, path, image, noindex]);
}

/**
 * Adds a JSON-LD block for the current page and removes it on unmount, so
 * structured data never describes a page the visitor has already left.
 */
export function useJsonLd(data, id) {
  useEffect(() => {
    if (!data) return undefined;
    const scriptId = `jsonld-${id}`;
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [data, id]);
}

export { ORIGIN, SITE_NAME };
