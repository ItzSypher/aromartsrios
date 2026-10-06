import type { Collection, Page, Product } from "@/lib/types";

/**
 * Shopify Storefront API (headless). Ativado quando as variáveis
 * SHOPIFY_STORE_DOMAIN e SHOPIFY_STOREFRONT_ACCESS_TOKEN estão definidas.
 * Docs: https://shopify.dev/docs/api/storefront
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION ?? "2026-07";

export const shopifyEnabled = Boolean(domain && token);

async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token!,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300, tags: ["shopify"] },
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(`Shopify Storefront API: ${JSON.stringify(json.errors ?? res.statusText)}`);
  }
  return json.data as T;
}

const PRODUCT_FIELDS = /* GraphQL */ `
  id
  handle
  title
  productType
  descriptionHtml
  availableForSale
  seo { description }
  options { name }
  collections(first: 1) { nodes { handle } }
  priceRange { minVariantPrice { amount } maxVariantPrice { amount } }
  images(first: 10) { nodes { url } }
  variants(first: 50) {
    nodes {
      id
      sku
      title
      availableForSale
      price { amount }
      compareAtPrice { amount }
      image { url }
    }
  }
`;

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  descriptionHtml: string;
  availableForSale: boolean;
  seo: { description: string | null };
  options: { name: string }[];
  collections: { nodes: { handle: string }[] };
  priceRange: { minVariantPrice: { amount: string }; maxVariantPrice: { amount: string } };
  images: { nodes: { url: string }[] };
  variants: {
    nodes: {
      id: string;
      sku: string | null;
      title: string;
      availableForSale: boolean;
      price: { amount: string };
      compareAtPrice: { amount: string } | null;
      image: { url: string } | null;
    }[];
  };
};

function toProduct(p: ShopifyProduct): Product {
  const option = p.options[0]?.name;
  return {
    id: p.id,
    handle: p.handle,
    name: p.title,
    productType: p.productType,
    collection: p.collections.nodes[0]?.handle ?? "geral",
    optionName: option && option !== "Title" ? option : null,
    priceMin: Number(p.priceRange.minVariantPrice.amount),
    priceMax: Number(p.priceRange.maxVariantPrice.amount),
    available: p.availableForSale,
    seoDescription: p.seo.description ?? "",
    descriptionHtml: p.descriptionHtml,
    images: p.images.nodes.map((i) => i.url),
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      sku: v.sku ?? "",
      title: v.title === "Default Title" ? "Padrão" : v.title,
      price: Number(v.price.amount),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice.amount) : null,
      available: v.availableForSale,
      image: v.image?.url ?? null,
    })),
  };
}

export const shopifyProvider = {
  async getProducts(): Promise<Product[]> {
    const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(
      `query { products(first: 250, sortKey: BEST_SELLING) { nodes { ${PRODUCT_FIELDS} } } }`,
    );
    return data.products.nodes.map(toProduct);
  },
  async getProduct(handle: string): Promise<Product | null> {
    const data = await storefront<{ product: ShopifyProduct | null }>(
      `query ($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
      { handle },
    );
    return data.product ? toProduct(data.product) : null;
  },
  async getCollections(): Promise<Collection[]> {
    const data = await storefront<{
      collections: { nodes: { handle: string; title: string; description: string; products: { nodes: { id: string }[] } }[] };
    }>(`query { collections(first: 50) { nodes { handle title description products(first: 250) { nodes { id } } } } }`);
    return data.collections.nodes
      .map((c) => ({ handle: c.handle, title: c.title, description: c.description, count: c.products.nodes.length }))
      .filter((c) => c.count > 0);
  },
  async getPages(): Promise<Page[]> {
    const data = await storefront<{ pages: { nodes: { handle: string; title: string; body: string }[] } }>(
      `query { pages(first: 30) { nodes { handle title body } } }`,
    );
    return data.pages.nodes.map((p) => ({ slug: p.handle, title: p.title, html: p.body }));
  },
  /** Cria um carrinho na Shopify e devolve a URL do checkout nativo. */
  async createCheckout(lines: { variantId: string; quantity: number }[]): Promise<string> {
    const data = await storefront<{
      cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
    }>(
      `mutation ($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) { cart { checkoutUrl } userErrors { message } }
      }`,
      { lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })) },
    );
    if (!data.cartCreate.cart) {
      throw new Error(data.cartCreate.userErrors.map((e) => e.message).join("; "));
    }
    return data.cartCreate.cart.checkoutUrl;
  },
};
