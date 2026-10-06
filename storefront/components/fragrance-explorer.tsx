"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { families, type Family, type FragranceInfo } from "@/lib/fragrances";
import { brl } from "@/lib/site";

export type ExplorerItem = FragranceInfo & {
  image: string | null;
  formats: { label: string; href: string; price: number; ranged: boolean }[];
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function FragranceExplorer({ items }: { items: ExplorerItem[] }) {
  const reduce = useReducedMotion();
  const [family, setFamily] = useState<Family | "todas">("todas");
  const visible = useMemo(() => (family === "todas" ? items : items.filter((i) => i.family === family)), [family, items]);
  const [selectedKey, setSelectedKey] = useState(items[0]?.key);
  const selected = visible.find((i) => i.key === selectedKey) ?? visible[0];

  function chooseFamily(f: Family | "todas") {
    setFamily(f);
    const first = f === "todas" ? items[0] : items.find((i) => i.family === f);
    if (first) setSelectedKey(first.key);
  }

  function askForBusiness(name: string) {
    window.dispatchEvent(new CustomEvent("aromart:fragrancia", { detail: name }));
    document.getElementById("orcamento")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div>
      {/* Filtro por família */}
      <LayoutGroup id="familias">
        <div
          role="tablist"
          aria-label="Famílias olfativas"
          className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
        >
          {[{ id: "todas" as const, label: "Todas" }, ...families].map((f) => {
            const active = family === f.id;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => chooseFamily(f.id)}
                className={`relative shrink-0 rounded-full px-4 py-2.5 text-sm transition-colors ${active ? "text-primary-ink" : "text-muted hover:text-ink"}`}
              >
                {active && (
                  <motion.span
                    layoutId="familia-ativa"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      {family !== "todas" && (
        <p className="mt-3 text-sm text-muted">{families.find((f) => f.id === family)?.text}</p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
        {/* Lista de fragrâncias: trilho no celular, lista no desktop */}
        <ul
          className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 lg:mx-0 lg:grid lg:snap-none lg:grid-cols-2 lg:content-start lg:gap-x-6 lg:gap-y-0 lg:overflow-visible lg:px-0"
          aria-label="Fragrâncias"
        >
          {visible.map((f) => {
            const active = f.key === selected?.key;
            return (
              <li key={f.key} className="shrink-0 snap-start lg:border-t lg:border-line">
                <button
                  onClick={() => setSelectedKey(f.key)}
                  aria-pressed={active}
                  className={`group flex w-full items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-left transition lg:rounded-none lg:border-0 lg:px-0 lg:py-4 ${
                    active ? "border-ink bg-ink text-bg lg:bg-transparent lg:text-ink" : "border-line lg:text-muted lg:hover:text-ink"
                  }`}
                >
                  <span className="whitespace-nowrap text-sm font-medium lg:text-xl lg:tracking-tight">
                    {f.name}
                    {f.signature && <span className="ml-2 text-xs font-normal text-sage-deep">assinatura</span>}
                  </span>
                  <ArrowRight
                    size={18}
                    className={`hidden shrink-0 transition lg:block ${active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Detalhe da fragrância */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence mode="wait" initial={false}>
            {selected && (
              <motion.article
                key={selected.key}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden rounded-[var(--radius-media)] bg-surface"
              >
                <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative aspect-[4/3] bg-sage sm:aspect-auto sm:min-h-[420px]">
                    {selected.image && (
                      <Image src={selected.image} alt={`Fragrância ${selected.name}`} fill sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col gap-6 p-6 md:p-8">
                    <div>
                      <p className="text-sm text-muted">{families.find((f) => f.id === selected.family)?.label}</p>
                      <h3 className="mt-1 text-3xl font-semibold tracking-tight">{selected.name}</h3>
                      <p className="mt-2 leading-relaxed text-muted">{selected.mood}</p>
                    </div>

                    <dl className="space-y-3">
                      {(
                        [
                          ["Saída", selected.notes.saida, "w-[70%]"],
                          ["Coração", selected.notes.coracao, "w-[85%]"],
                          ["Fundo", selected.notes.fundo, "w-full"],
                        ] as const
                      ).map(([label, value, width], i) => (
                        <motion.div
                          key={label}
                          initial={reduce ? false : { opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
                          className={`${width} rounded-[var(--radius-media)] bg-bg px-4 py-3`}
                        >
                          <dt className="text-xs text-muted">{label}</dt>
                          <dd className="text-sm font-medium leading-snug">{value}</dd>
                        </motion.div>
                      ))}
                    </dl>

                    {selected.formats.length > 0 && (
                      <ul className="space-y-1.5">
                        {selected.formats.map((fmt) => (
                          <li key={fmt.href}>
                            <Link href={fmt.href} className="group flex items-center justify-between gap-3 text-sm">
                              <span className="underline-offset-4 group-hover:underline">{fmt.label}</span>
                              <span className="flex items-center gap-1.5 tabular-nums text-muted">
                                {fmt.ranged && "a partir de "}
                                {brl(fmt.price)}
                                <ArrowUpRight size={14} />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => askForBusiness(selected.name)}
                      className="mt-auto rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-ink transition hover:opacity-90 active:scale-[0.98]"
                    >
                      Quero {selected.name} na minha empresa
                    </button>
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
