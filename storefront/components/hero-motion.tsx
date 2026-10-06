/** Entrada escalonada do texto do hero (título, apoio, CTAs), em CSS para não atrasar a pintura. */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  return <div className="hero-stagger">{children}</div>;
}
