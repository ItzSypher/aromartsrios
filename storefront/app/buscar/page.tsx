import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getProducts, searchProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Busca", robots: { index: false } };

export default async function SearchPage({ searchParams }: PageProps<"/buscar">) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  const results = q ? searchProducts(await getProducts(), q) : [];

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-12 md:px-8 md:pt-16">
      <form role="search" action="/buscar" className="max-w-xl">
        <label htmlFor="q" className="text-sm font-medium">
          Buscar produtos
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="ex.: lavanda, difusor, refil"
          className="mt-2 w-full rounded-full border border-line bg-surface px-5 py-3 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink"
        />
      </form>

      {q && (
        <p className="mt-10 text-muted">
          {results.length} {results.length === 1 ? "resultado" : "resultados"} para <strong className="text-ink">“{q}”</strong>
        </p>
      )}

      {q && results.length === 0 ? (
        <div className="py-20">
          <p className="text-lg">Nada encontrado com esse termo.</p>
          <p className="mt-2 text-muted">
            Tente o nome de uma fragrância ou veja <Link href="/aromas" className="underline underline-offset-4">todas as fragrâncias</Link>.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {results.map((p) => (
            <li key={p.handle}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
