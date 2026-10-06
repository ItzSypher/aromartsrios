import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { site, whatsappLink } from "@/lib/site";

const groups = [
  {
    title: "Loja",
    links: site.nav.slice(2, 5),
  },
  {
    title: "Institucional",
    links: [
      { label: "Quem somos", href: "/pagina/quem-somos" },
      { label: "Para empresas", href: "/#solucoes" },
      { label: "Pedir orçamento", href: "/#orcamento" },
      { label: "Frete grátis por região", href: "/pagina/frete-gratis-por-regiao" },
      { label: "Trocas e devoluções", href: "/pagina/politica-de-trocas-e-devolucoes" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-8">
        <div className="max-w-xs space-y-4">
          <BrandLogo className="h-16 w-auto text-ink" />
          <p className="text-sm leading-relaxed text-muted">
            Aromatização de ambientes para casas, lojas, hotéis e escritórios, com fragrâncias próprias.
          </p>
        </div>

        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="mb-4 text-sm font-medium">{g.title}</h2>
            <ul className="space-y-2.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="mb-4 text-sm font-medium">Atendimento</h2>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <a href={whatsappLink("Olá! Vim pelo site da Aromart Rios.")} className="transition hover:text-ink">
                WhatsApp {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="transition hover:text-ink">
                {site.email}
              </a>
            </li>
            <li className="flex gap-4 pt-2">
              {site.social.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener" className="transition hover:text-ink">
                  {s.label}
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1400px] px-4 py-6 text-xs text-muted md:px-8">
          © {new Date().getFullYear()} Aromart Rios. CNPJ {site.cnpj}. Pagamento seguro via Pix, cartão e boleto.
        </p>
      </div>
    </footer>
  );
}
