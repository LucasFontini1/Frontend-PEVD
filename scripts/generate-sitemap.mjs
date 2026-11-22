// Generates a sitemap with public pages and, when available, published catalog items.
// Does not require the API to be online for the frontend build to succeed.
import { writeFile } from "node:fs/promises";

const site = (process.env.VITE_SITE_URL || "https://penseiemvocesdoces.vercel.app").replace(/\/+$/, "");
const apiRoot = process.env.VITE_API_BASE_URL?.replace(/\/+$/, "");
const staticPages = [
  "/", "/cardapio", "/atendimento", "/contato", "/tutorial",
  "/termos-de-uso", "/politica-de-privacidade",
];
const paths = new Set(staticPages);
const validSlug = (slug) => typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
const escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

async function collect(endpoint, prefix) {
  if (!apiRoot) return;
  const root = new URL(apiRoot + "/");
  let url = new URL(endpoint, root);
  for (let page = 0; page < 50 && url; page += 1) {
    if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) break;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} em ${url.pathname}`);
    const data = await response.json();
    const items = Array.isArray(data) ? data : data.results;
    if (!Array.isArray(items)) throw new Error("Formato inesperado do catálogo");
    for (const item of items) {
      if (validSlug(item.slug)) paths.add(`/${prefix}/${item.slug}`);
    }
    if (Array.isArray(data)) break;
    if (!data.next) break;
    url = new URL(data.next, root);
  }
}

if (apiRoot) {
  for (const [endpoint, prefix] of [["categories/", "categoria"], ["products/", "produto"]]) {
    try {
      await collect(endpoint, prefix);
    } catch (error) {
      console.warn(`Sitemap: sem dados dinâmicos de ${prefix}: ${error.message}`);
    }
  }
} else {
  console.warn("Sitemap: VITE_API_BASE_URL não configurada; gerando apenas páginas públicas fixas.");
}

const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...paths].sort().map((path) => `  <url><loc>${escapeXml(site + path)}</loc></url>`).join("\n") +
  '\n</urlset>\n';

await writeFile(new URL("../public/sitemap.xml", import.meta.url), sitemap, "utf8");
console.log(`Sitemap: ${paths.size} URLs públicas geradas.`);
