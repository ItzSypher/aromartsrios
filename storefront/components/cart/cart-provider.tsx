"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/types";

type CartContext = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartContext | null>(null);
const KEY = "aromart:cart:v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratação única do carrinho salvo
      if (saved) setLines(JSON.parse(saved));
    } catch {
      /* armazenamento indisponível: carrinho começa vazio */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignora: modo privado */
    }
  }, [lines, hydrated]);

  const add = useCallback<CartContext["add"]>((line, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        return prev.map((l) => (l.variantId === line.variantId ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, { ...line, quantity }];
    });
    setOpen(true);
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0 ? prev.filter((l) => l.variantId !== variantId) : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
    );
  }, []);

  const value = useMemo<CartContext>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.quantity * l.price, 0),
      open,
      setOpen,
      add,
      setQuantity,
      clear: () => setLines([]),
    }),
    [lines, open, add, setQuantity],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
