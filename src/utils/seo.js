const SITE_NAME = "Pensei em Você Doces";
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://penseiemvocesdoces.vercel.app").replace(/\/+$/, "");
const DEFAULT_DESCRIPTION = "Conheça o cardápio da Pensei em Você Doces. Doces e encomendas especiais em Joinville, Santa Catarina.";

function metaTag(attribute, key) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  return element;
}

export function setSeo({
  title = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = `${SITE_URL}/icons/icon-512.png`,
  noindex = false,
} = {}) {
  document.title = title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
  metaTag("name", "description").setAttribute("content", description);
  metaTag("name", "robots").setAttribute("content", noindex ? "noindex, nofollow" : "index, follow");
  metaTag("property", "og:title").setAttribute("content", document.title);
  metaTag("property", "og:description").setAttribute("content", description);
  metaTag("property", "og:image").setAttribute("content", image);
  metaTag("property", "og:type").setAttribute("content", "website");
  const canonical = `${SITE_URL}${path.startsWith("/") ? path : "/" + path}`;
  metaTag("property", "og:url").setAttribute("content", canonical);
  const current = document.querySelector('link[rel="canonical"]');
  if (noindex) {
    current?.remove();
  } else {
    const link = current || document.createElement("link");
    link.rel = "canonical";
    link.href = canonical;
    if (!current) document.head.appendChild(link);
  }
}

export function applyRouteSeo(route) {
  const publicPages = {
    home: ["Pensei em Você Doces", DEFAULT_DESCRIPTION],
    catalog: ["Cardápio de doces", "Encontre bolos, doces e encomendas da Pensei em Você Doces em Joinville, SC."],
    category: ["Doces por categoria", "Confira doces disponíveis por categoria na Pensei em Você Doces, Joinville."],
    product: ["Doces artesanais", "Conheça este produto do cardápio da Pensei em Você Doces."],
    tutorial: ["Como usar o site", "Saiba como consultar o cardápio e realizar encomendas."],
    support: ["Atendimento e dúvidas frequentes", "Tire dúvidas sobre as encomendas da Pensei em Você Doces."],
    contact: ["Contato", "Entre em contato com a Pensei em Você Doces em Joinville, SC."],
    terms: ["Termos de Uso", "Consulte os Termos de Uso da Pensei em Você Doces."],
    privacy: ["Política de Privacidade", "Saiba como a Pensei em Você Doces trata dados pessoais."],
  };
  const entry = publicPages[route.name];
  setSeo({
    title: entry?.[0] || SITE_NAME,
    description: entry?.[1] || DEFAULT_DESCRIPTION,
    path: route.path,
    noindex: !entry,
  });
}
