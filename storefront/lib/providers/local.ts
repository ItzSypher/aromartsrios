import catalog from "@/data/products.json";
import pages from "@/data/pages.json";
import type { Collection, Page, Product } from "@/lib/types";

type RawVariant = (typeof catalog.products)[number]["variants"][number];
type RawProduct = (typeof catalog.products)[number] & { local_images?: string[] };

function toProduct(p: RawProduct): Product {
  const images = p.local_images?.length ? p.local_images : p.images;
  return {
    id: p.id,
    handle: p.handle,
    name: p.name,
    productType: p.product_type,
    collection: p.collection,
    optionName: p.option_name,
    priceMin: p.price_min ?? 0,
    priceMax: p.price_max ?? 0,
    available: p.available,
    seoDescription: p.seo_description,
    descriptionHtml: p.description_html,
    images,
    variants: p.variants.map((v: RawVariant) => ({
      id: v.id,
      sku: v.sku,
      title: v.title,
      price: v.price ?? 0,
      compareAtPrice: v.compare_at_price ?? null,
      available: v.available,
      image: v.image ? (images[p.images.indexOf(v.image)] ?? null) : null,
    })),
  };
}

const products = (catalog.products as RawProduct[]).map(toProduct);

export const localProvider = {
  async getProducts(): Promise<Product[]> {
    return products;
  },
  async getProduct(handle: string): Promise<Product | null> {
    return products.find((p) => p.handle === handle) ?? null;
  },
  async getCollections(): Promise<Collection[]> {
    return catalog.collections;
  },
  async getPages(): Promise<Page[]> {
    return pages;
  },
};
