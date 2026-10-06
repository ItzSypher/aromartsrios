"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, WhatsappLogo } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-provider";
import { brl, whatsappLink } from "@/lib/site";
import type { Product } from "@/lib/types";

export function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const firstAvailable = product.variants.find((v) => v.available) ?? product.variants[0];
  const [variantId, setVariantId] = useState(firstAvailable.id);
  const [qty, setQty] = useState(1);
  const variant = product.variants.find((v) => v.id === variantId) ?? firstAvailable;
  const hasOptions = product.variants.length > 1;
  const off = variant.compareAtPrice ? Math.round((1 - variant.price / variant.compareAtPrice) * 100) : 0;

  return (
    <div className="space-y-7">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{brl(variant.price)}</span>
        {variant.compareAtPrice && (
          <>
            <s className="text-muted tabular-nums">{brl(variant.compareAtPrice)}</s>
            <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-medium">-{off}%</span>
          </>
        )}
      </div>

      {hasOptions && (
        <fieldset>
          <legend className="mb-3 text-sm font-medium">{product.optionName ?? "Opção"}</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <label
                key={v.id}
                className={`cursor-pointer rounded-full border px-5 py-2.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink ${
                  v.id === variantId ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"
                } ${!v.available ? "cursor-not-allowed line-through opacity-50" : ""}`}
              >
                <input
                  type="radio"
                  name="variante"
                  value={v.id}
                  checked={v.id === variantId}
                  disabled={!v.available}
                  onChange={() => setVariantId(v.id)}
                  className="sr-only"
                />
                {v.title}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex gap-3">
        <div className="flex items-center rounded-full border border-line">
          <button className="grid size-12 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">
            <Minus size={16} />
          </button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button className="grid size-12 place-items-center" onClick={() => setQty((q) => q + 1)} aria-label="Aumentar quantidade">
            <Plus size={16} />
          </button>
        </div>
        <button
          disabled={!variant.available}
          onClick={() =>
            add(
              {
                variantId: variant.id,
                productHandle: product.handle,
                name: product.name,
                variantTitle: variant.title,
                price: variant.price,
                image: variant.image ?? product.images[0] ?? null,
              },
              qty,
            )
          }
          className="flex-1 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-ink transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {variant.available ? "Adicionar à sacola" : "Esgotado"}
        </button>
      </div>

      <a
        href={whatsappLink(
          `Olá! Tenho interesse em: ${qty}x ${product.name}${hasOptions ? ` (${variant.title})` : ""} - ${brl(variant.price)}`,
        )}
        className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-sm transition hover:border-ink"
      >
        <WhatsappLogo size={18} />
        Comprar pelo WhatsApp
      </a>

      <p className="text-xs leading-relaxed text-muted">
        Pix, boleto ou cartão. Frete grátis a partir de R$ 480 no Sudeste.{" "}
        <Link href="/pagina/frete-gratis-por-regiao" className="underline underline-offset-2 hover:text-ink">
          Ver todas as regiões
        </Link>
      </p>
    </div>
  );
}
