import type { MetadataRoute } from "next";
import { getCollections, getPages, getProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, pages] = await Promise.all([getProducts(), getCollections(), getPages()]);
  return [
    { url: site.url, priority: 1 },
    ...collections.map((c) => ({ url: `${site.url}/${c.handle}`, priority: 0.8 })),
    ...products.map((p) => ({ url: `${site.url}/${p.handle}`, priority: 0.7 })),
    ...pages.map((p) => ({ url: `${site.url}/pagina/${p.slug}`, priority: 0.4 })),
  ];
}
