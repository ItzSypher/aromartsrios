import { cache } from "react";
import { localProvider } from "@/lib/providers/local";
import { shopifyEnabled, shopifyProvider } from "@/lib/providers/shopify";
import type { Product } from "@/lib/types";

/**
 * Fonte única do catálogo. Sem variáveis da Shopify, usa o catálogo exportado
 * da loja atual (data/products.json). Com elas, lê tudo da Shopify em tempo real.
 */
const provider = shopifyEnabled ? shopifyProvider : localProvider;

export const commerceMode = shopifyEnabled ? "shopify" : "local";

export const getProducts = cache(() => provider.getProducts());
export const getProduct = cache((handle: string) => provider.getProduct(handle));
export const getCollections = cache(() => provider.getCollections());
export const getPages = cache(() => provider.getPages());

export async function getCollection(handle: string) {
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);
  const collection = collections.find((c) => c.handle === handle);
  if (!collection) return null;
  return { collection, products: products.filter((p) => p.collection === handle) };
}

export async function getRelated(product: Product, limit = 4) {
  const products = await getProducts();
  const scent = fragranceOf(product.name);
  const sameScent = products.filter((p) => p.handle !== product.handle && fragranceOf(p.name) === scent);
  const sameCollection = products.filter(
    (p) => p.handle !== product.handle && p.collection === product.collection && !sameScent.includes(p),
  );
  return [...sameScent, ...sameCollection].slice(0, limit);
}

/** "Home Spray Aromatizador 250ml - Lavanda" -> "Lavanda" ; "Difusor Bamboo - 250ml" -> "Bamboo" */
export function fragranceOf(name: string): string {
  return name
    .replace(/home spray aromatizador|spray aromatizador|aromatizante|difusor/gi, "")
    .replace(/\b\d+\s?ml\b/gi, "")
    .replace(/\s+-\s+|^\s*-|-\s*$/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchProducts(products: Product[], q: string) {
  const norm = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  const terms = norm(q).split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    const hay = norm(`${p.name} ${p.productType} ${p.seoDescription}`);
    return terms.every((t) => hay.includes(t));
  });
}
