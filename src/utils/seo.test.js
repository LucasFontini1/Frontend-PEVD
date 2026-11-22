import { afterEach, describe, expect, it } from "vitest";
import { setSeo, applyRouteSeo } from "./seo";

afterEach(() => {
  document.querySelector('link[rel="canonical"]')?.remove();
  document.querySelector('meta[name="robots"]')?.remove();
});

describe("SEO do site", () => {
  it("marca as páginas públicas para indexação e define canonical", () => {
    applyRouteSeo({ name: "catalog", path: "/cardapio" });
    expect(document.title).toContain("Cardápio");
    expect(document.querySelector('meta[name="robots"]').content).toBe("index, follow");
    expect(document.querySelector('link[rel="canonical"]').href).toContain("/cardapio");
  });
  it("protege páginas privadas da indexação e remove canonical", () => {
    applyRouteSeo({ name: "catalog", path: "/cardapio" });
    applyRouteSeo({ name: "checkout", path: "/checkout" });
    expect(document.querySelector('meta[name="robots"]').content).toBe("noindex, nofollow");
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });
  it("permite metadados próprios por produto", () => {
    setSeo({
      title: "Bolo de chocolate",
      path: "/produto/bolo-de-chocolate",
      description: "Bolo de chocolate artesanal.",
    });
    expect(document.title).toContain("Bolo de chocolate");
    expect(document.querySelector('meta[name="description"]').content).toBe("Bolo de chocolate artesanal.");
  });
});
