"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus, ShoppingBagOpen, X } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-provider";
import { brl } from "@/lib/site";

export function CartDrawer() {
  const { lines, open, setOpen, setQuantity, subtotal } = useCart();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  async function checkout() {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha ao finalizar.");
      window.location.href = data.url;
    } catch (e) {
      setStatus("error");
      setError((e as Error).message);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Sacola de compras">
          <motion.button
            aria-label="Fechar sacola"
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg shadow-[0_0_60px_rgba(28,29,25,0.18)]"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <header className="flex h-16 items-center justify-between border-b border-line px-5">
              <h2 className="text-lg font-medium">Sua sacola</h2>
              <button
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-full hover:bg-surface"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBagOpen size={44} weight="light" className="text-muted" />
                <p className="text-muted">Sua sacola está vazia.</p>
                <Link
                  href="/aromas"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink transition active:scale-[0.98]"
                >
                  Ver fragrâncias
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {lines.map((l) => (
                    <li key={l.variantId} className="flex gap-4 py-5">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--radius-media)] bg-surface">
                        {l.image && <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/${l.productHandle}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium leading-snug hover:underline"
                        >
                          {l.name}
                        </Link>
                        {l.variantTitle !== "Padrão" && <span className="text-xs text-muted">{l.variantTitle}</span>}
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-line">
                            <button
                              className="grid size-8 place-items-center"
                              onClick={() => setQuantity(l.variantId, l.quantity - 1)}
                              aria-label={`Diminuir quantidade de ${l.name}`}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-sm tabular-nums">{l.quantity}</span>
                            <button
                              className="grid size-8 place-items-center"
                              onClick={() => setQuantity(l.variantId, l.quantity + 1)}
                              aria-label={`Aumentar quantidade de ${l.name}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-sm tabular-nums">{brl(l.price * l.quantity)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <footer className="space-y-3 border-t border-line p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-medium tabular-nums">{brl(subtotal)}</span>
                  </div>
                  <p className="text-xs text-muted">Frete e parcelamento calculados na finalização.</p>
                  {status === "error" && (
                    <p role="alert" className="text-sm text-danger">
                      {error}
                    </p>
                  )}
                  <button
                    onClick={checkout}
                    disabled={status === "loading"}
                    className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-ink transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                  >
                    {status === "loading" ? "Abrindo checkout..." : "Finalizar compra"}
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
