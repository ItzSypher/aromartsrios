import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/product/buy-box";
import { Gallery } from "@/components/product/gallery";
import { ProductCard } from "@/components/product-card";
import { getCollection, getCollections, getProduct, getProducts, getRelated } from "@/lib/catalog";
import { site } from "@/lib/site";
import type { Product } from "@/lib/types";

/**
 * Uma rota para produtos e coleções, igual à loja atual:
 *   /difusor-emporio  -> produto
 *   /difusores        -> coleção
 * Mantém todas as URLs já indexadas no Google.
 */
export async function generateStaticParams() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  return [...products.map((p) => ({ slug: p.handle })), ...collections.map((c) => ({ slug: c.handle }))];
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (product) {
    return {
      title: product.name,
      description: product.seoDescription.slice(0, 160),
      alternates: { canonical: `/${product.handle}` },
      openGraph: { title: product.name, images: product.images.slice(0, 1), type: "website" },
    };
  }
  const data = await getCollection(slug);
  if (data) {
    return {
      title: data.collection.title,
      description: `${data.collection.title} Aromart Rios: ${data.products.length} produtos com entrega para todo o Brasil.`,
      alternates: { canonical: `/${slug}` },
    };
  }
  return {};
}

const SORTS = {
  relevancia: { label: "Relevância", fn: () => 0 },
  "menor-preco": { label: "Menor preço", fn: (a: Product, b: Product) => a.priceMin - b.priceMin },
  "maior-preco": { label: "Maior preço", fn: (a: Product, b: Product) => b.priceMin - a.priceMin },
} as const;

export default async function SlugPage({ params, searchParams }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (product) return <ProductView product={product} />;

  const data = await getCollection(slug);
  if (!data) notFound();

  const sortKey = ((await searchParams).ordem as keyof typeof SORTS) ?? "relevancia";
  const sort = SORTS[sortKey] ?? SORTS.relevancia;
  const items = [...data.products].sort((a, b) => Number(b.available) - Number(a.available) || sort.fn(a, b));

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-10 md:px-8 md:pt-16">
      <nav aria-label="Trilha" className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Início
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{data.collection.title}</span>
      </nav>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display text-5xl font-medium tracking-[-0.01em] md:text-7xl">{data.collection.title}</h1>
        <div className="flex items-center gap-1 text-sm" role="group" aria-label="Ordenar">
          {Object.entries(SORTS).map(([key, s]) => (
            <Link
              key={key}
              href={key === "relevancia" ? `/${slug}` : `/${slug}?ordem=${key}`}
              scroll={false}
              aria-current={key === sortKey ? "true" : undefined}
              className={`rounded-full px-3.5 py-2 transition ${key === sortKey ? "bg-surface font-medium" : "text-muted hover:text-ink"}`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">{items.length} produtos</p>
      {items.length === 0 ? (
        <p className="py-24 text-center text-muted">Nenhum produto nesta coleção no momento.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {items.map((p, i) => (
            <li key={p.handle}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function ProductView({ product }: { product: Product }) {
  const [related, collections] = await Promise.all([getRelated(product), getCollections()]);
  const collection = collections.find((c) => c.handle === product.collection);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => (i.startsWith("/") ? `${site.url}${i}` : i)),
    description: product.seoDescription,
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: site.name },
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      price: v.price.toFixed(2),
      priceCurrency: "BRL",
      availability: v.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/${product.handle}`,
    })),
  };

  return (
    <article className="mx-auto max-w-[1400px] px-4 pt-6 md:px-8 md:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Trilha" className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Início
        </Link>
        {collection && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/${collection.handle}`} className="hover:text-ink">
              {collection.title}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Gallery images={product.images} name={product.name} />
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm text-muted">{product.productType}</p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] tracking-[-0.01em] md:text-5xl">{product.name}</h1>
          <div className="mt-8">
            <BuyBox product={product} />
          </div>
        </div>
      </div>

      {product.descriptionHtml && (
        <section className="mt-20 grid gap-8 border-t border-line pt-12 lg:grid-cols-[1fr_2fr]">
          <h2 className="font-display text-3xl font-medium">Sobre o produto</h2>
          <div className="prose-store" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl font-medium md:text-4xl">Combina com</h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p) => (
              <li key={p.handle}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
