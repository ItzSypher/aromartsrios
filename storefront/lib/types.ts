export type Variant = {
  id: string;
  sku: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  available: boolean;
  image: string | null;
};

export type Product = {
  id: string;
  handle: string;
  name: string;
  productType: string;
  collection: string;
  optionName: string | null;
  priceMin: number;
  priceMax: number;
  available: boolean;
  seoDescription: string;
  descriptionHtml: string;
  images: string[];
  variants: Variant[];
};

export type Collection = {
  handle: string;
  title: string;
  description?: string;
  count: number;
};

export type Page = {
  slug: string;
  title: string;
  html: string;
};

export type CartLine = {
  variantId: string;
  productHandle: string;
  name: string;
  variantTitle: string;
  price: number;
  image: string | null;
  quantity: number;
};
