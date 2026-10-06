import Image from "next/image";
import Link from "next/link";
import { brl } from "@/lib/site";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [first, second] = product.images;
  const discounted = product.variants.find((v) => v.compareAtPrice && v.compareAtPrice > v.price);
  const ranged = product.priceMax > product.priceMin;

  return (
    <Link href={`/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] bg-surface">
        {first && (
          <Image
            src={first}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] ${second ? "group-hover:opacity-0" : ""}`}
          />
        )}
        {second && (
          <Image
            src={second}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition duration-700 group-hover:opacity-100"
          />
        )}
        {!product.available && (
          <span className="absolute inset-x-0 bottom-0 bg-bg/85 py-2 text-center text-xs font-medium">Esgotado</span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium leading-snug group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h3>
        <p className="flex items-baseline gap-2 text-sm tabular-nums">
          <span>
            {ranged && <span className="text-muted">a partir de </span>}
            {brl(product.priceMin)}
          </span>
          {discounted && !ranged && <s className="text-xs text-muted">{brl(discounted.compareAtPrice!)}</s>}
        </p>
      </div>
    </Link>
  );
}
