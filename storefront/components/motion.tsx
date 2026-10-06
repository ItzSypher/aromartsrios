"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/*
 * Primitivas de movimento (Framer Motion / `motion/react`).
 * Todo o texto continua no HTML do servidor (SEO). Sem JS, um <noscript> no layout
 * força [data-reveal] visível. Com prefers-reduced-motion, nada se move.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "header";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      data-reveal
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE } },
};

/** Grade com filhos entrando em sequência (bento, listas de produtos). */
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={container}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Comp = motion[as];
  return (
    <Comp data-reveal variants={item} className={className}>
      {children}
    </Comp>
  );
}

/** Entrada do hero ao carregar (não depende de rolagem). */
export function HeroIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Zoom lento da foto do hero: só transform, não atrasa o LCP. */
export function HeroImageMotion({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { scale: 1.08 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2.2, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Faixa contínua (uma por página). Pausa com movimento reduzido. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const reduce = useReducedMotion();
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
      {items.map((t) => (
        <li key={t} className="flex items-center gap-10 whitespace-nowrap">
          <span>{t}</span>
          <span className="text-sage-deep" aria-hidden>
            /
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {row()}
        {row(true)}
      </motion.div>
    </div>
  );
}
