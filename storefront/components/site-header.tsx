"use client";

import Link from "next/link";
import { BrandMark } from "@/components/brand-logo";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { List, MagnifyingGlass, ShoppingBag, X } from "@phosphor-icons/react";
import { useCart } from "@/components/cart/cart-provider";
import { site } from "@/lib/site";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  // Fecha menu e busca ao navegar
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset intencional na troca de rota
  useEffect(() => { setMenu(false); setSearch(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 md:h-[72px] md:gap-6 md:px-8">
        <button
          className="grid size-10 place-items-center rounded-full hover:bg-surface lg:hidden"
          onClick={() => setMenu((m) => !m)}
          aria-label={menu ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menu}
        >
          {menu ? <X size={22} /> : <List size={22} />}
        </button>

        <Link href="/" className="flex items-center gap-2.5" aria-label="Aromart Rios, página inicial">
          <BrandMark className="h-7 w-auto" />
          <span className="hidden text-[15px] font-semibold tracking-tight min-[370px]:inline">Aromart Rios</span>
        </Link>

        <nav aria-label="Principal" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {site.nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3.5 py-2 text-sm transition hover:bg-surface ${active ? "bg-surface font-medium" : "text-muted hover:text-ink"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link
            href="/#orcamento"
            className="mr-1 rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-ink transition hover:opacity-90 active:scale-[0.98] md:px-5 md:py-2.5 md:text-sm"
          >
            <span className="sm:hidden">Orçamento</span>
            <span className="hidden sm:inline">Pedir orçamento</span>
          </Link>
          <button
            className="hidden size-10 place-items-center rounded-full hover:bg-surface sm:grid"
            onClick={() => setSearch((s) => !s)}
            aria-label="Buscar"
            aria-expanded={search}
          >
            <MagnifyingGlass size={20} />
          </button>
          <button
            className="relative grid size-10 place-items-center rounded-full hover:bg-surface"
            onClick={() => setOpen(true)}
            aria-label={`Abrir sacola, ${count} ${count === 1 ? "item" : "itens"}`}
          >
            <ShoppingBag size={21} />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-[18px] text-primary-ink tabular-nums">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {search && (
        <form
          role="search"
          className="mx-auto max-w-[1400px] px-4 pb-4 md:px-8"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q")?.toString().trim();
            if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
          }}
        >
          <label htmlFor="busca" className="sr-only">
            Buscar produtos
          </label>
          <input
            id="busca"
            name="q"
            autoFocus
            placeholder="Busque por fragrância ou produto, ex.: lavanda"
            className="w-full rounded-full border border-line bg-surface px-5 py-3 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink"
          />
        </form>
      )}

      {menu && (
        <nav aria-label="Menu" className="border-t border-line lg:hidden">
          <ul className="mx-auto max-w-[1400px] px-4 py-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setMenu(false)} className="block py-3 text-lg">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/buscar" className="block py-3 text-lg text-muted">
                Buscar produto
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
