import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bank, CreditCard, Truck, Package } from "@phosphor-icons/react/dist/ssr";
import { HeroMotion } from "@/components/hero-motion";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { fragranceOf, getCollections, getProducts } from "@/lib/catalog";
import { brl, whatsappLink } from "@/lib/site";
import type { Product } from "@/lib/types";

const benefits = [
  { icon: Truck, title: "Frete grátis", text: "a partir de R$ 480 no Sudeste" },
  { icon: CreditCard, title: "Até 3x sem juros", text: "no cartão" },
  { icon: Bank, title: "Pix e boleto", text: "pagamento à vista" },
  { icon: Package, title: "Entregamos", text: "em todo o Brasil" },
];

// Ordem e textos dos formatos na home (slugs = URLs atuais da loja)
const formats: { handle: string; title: string; text: string }[] = [
  { handle: "difusores", title: "Difusores de varetas", text: "Perfume contínuo, sem chama e sem tomada." },
  { handle: "home-spray", title: "Home spray", text: "Borrifou, perfumou. 250 ml para ambientes e tecidos." },
  { handle: "aromas", title: "Aromatizantes", text: "Em 500 ml, 1 e 5 litros, para quem usa todo dia." },
];

function pick(products: Product[], handles: string[]) {
  return handles.map((h) => products.find((p) => p.handle === h)).filter(Boolean) as Product[];
}

export default async function Home() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);
  const available = products.filter((p) => p.available);

  const heroProduct = products.find((p) => p.handle === "difusor-palo-santo") ?? available[0];
  const heroImage = heroProduct?.images[1] ?? heroProduct?.images[0];

  const bestSellers = [
    ...pick(available, ["difusor-emporio", "difusor-palo-santo", "aromatizante-summer", "difusor-bamboo-250ml"]),
    ...available.filter((p) => p.variants.some((v) => v.compareAtPrice)),
    ...available,
  ]
    .filter((p, i, arr) => arr.findIndex((x) => x.handle === p.handle) === i)
    .slice(0, 10);

  const tiles = formats
    .map((f) => {
      const c = collections.find((c) => c.handle === f.handle);
      const cover = products.find((p) => p.collection === f.handle && p.images.length)?.images[0];
      return c ? { ...f, count: c.count, cover } : null;
    })
    .filter(Boolean) as (typeof formats[number] & { count: number; cover?: string })[];

  // Índice de fragrâncias: cada aroma e em quais formatos ele existe
  const scents = new Map<string, { name: string; items: { label: string; href: string }[] }>();
  for (const p of available) {
    const name = fragranceOf(p.name);
    if (!name || name.length > 24 || /kit|frasco/i.test(p.productType)) continue;
    const key = name.toLowerCase().replace(/\s(com|e)\s/g, " ");
    const entry = scents.get(key) ?? { name, items: [] };
    if (!entry.items.some((i) => i.label === p.productType)) entry.items.push({ label: p.productType, href: `/${p.handle}` });
    scents.set(key, entry);
  }
  const scentList = [...scents.values()].sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name)).slice(0, 18);

  const corporateImage = products.find((p) => p.handle === "difusor-emporio")?.images[2] ?? heroImage;

  return (
    <>
      {/* Hero: split assimétrico, produto real à direita */}
      <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 pb-16 pt-8 md:grid-cols-[1fr_1.1fr] md:px-8 md:pt-14 lg:min-h-[calc(100dvh-72px)] lg:pb-14">
        <HeroMotion>
          <h1 className="max-w-[14ch] text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] md:text-6xl lg:text-7xl">
            Um perfume para cada ambiente.
          </h1>
          <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-muted">
            Difusores, home sprays e aromatizantes com fragrâncias próprias, para casa e para empresas.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/aromas"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-ink transition hover:opacity-90 active:scale-[0.98]"
            >
              Ver fragrâncias
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </Link>
            <Link href="/pagina/aromatizacao-de-ambientes-corporativos" className="text-sm font-medium underline-offset-4 hover:underline">
              Aromatização para empresas
            </Link>
          </div>
        </HeroMotion>

        {heroImage && (
          <figure>
            <Link
              href={`/${heroProduct.handle}`}
              className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-media)] bg-sage md:aspect-[6/6] lg:aspect-[5/5]"
            >
              <Image
                src={heroImage}
                alt={heroProduct.name}
                fill
                priority
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover"
              />
            </Link>
            <figcaption className="mt-3 flex justify-between text-sm text-muted">
              <span>{heroProduct.name}</span>
              <span className="tabular-nums">{brl(heroProduct.priceMin)}</span>
            </figcaption>
          </figure>
        )}
      </section>

      {/* Benefícios: faixa simples, sem cards */}
      <section aria-label="Vantagens" className="border-y border-line">
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-6 px-4 py-7 md:grid-cols-4 md:px-8">
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3">
              <Icon size={26} weight="light" className="shrink-0 text-sage-deep" />
              <span className="text-sm leading-tight">
                <span className="block font-medium">{title}</span>
                <span className="text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Formatos: bento 2 + 3 */}
      <section className="mx-auto max-w-[1400px] px-4 pt-24 md:px-8">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Escolha pelo formato</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-[1.25fr_1fr] md:grid-rows-2">
          {tiles.map((t, i) => (
            <Reveal key={t.handle} delay={i * 0.05} className={i === 0 ? "md:row-span-2" : ""}>
              <Link
                href={`/${t.handle}`}
                className={`group relative flex h-full overflow-hidden rounded-[var(--radius-media)] bg-surface ${i === 0 ? "aspect-[4/5] md:aspect-auto md:min-h-[640px]" : "aspect-[16/10] md:aspect-auto md:min-h-[312px]"}`}
              >
                {t.cover && (
                  <Image
                    src={t.cover}
                    alt=""
                    fill
                    sizes={i === 0 ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 768px) 45vw, 100vw"}
                    className="object-cover transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1d19]/70 via-[#1c1d19]/10 to-transparent" />
                <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-5 text-[#f2f2ee] md:p-6">
                  <div>
                    <h3 className={`font-semibold tracking-tight ${i === 0 ? "text-2xl md:text-4xl" : "text-2xl"}`}>{t.title}</h3>
                    <p className="mt-1 max-w-[34ch] text-sm text-[#f2f2ee]/80">{t.text}</p>
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-[#f2f2ee]/80">{t.count}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mais vendidos: trilho horizontal com scroll-snap */}
      <section className="pt-24">
        <div className="mx-auto flex max-w-[1400px] items-end justify-between px-4 md:px-8">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Os mais pedidos</h2>
          <Link href="/difusores" className="hidden text-sm font-medium underline-offset-4 hover:underline sm:block">
            Ver todos os difusores
          </Link>
        </div>
        <ul className="scrollbar-none mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:scroll-px-8 md:gap-6 md:px-8 xl:px-[max(2rem,calc((100vw_-_1400px)/2_+_2rem))] xl:scroll-px-[max(2rem,calc((100vw_-_1400px)/2_+_2rem))]">
          {bestSellers.map((p) => (
            <li key={p.handle} className="w-[64vw] shrink-0 snap-start sm:w-[38vw] md:w-[28vw] lg:w-[22vw] xl:w-[300px]">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>

      {/* Índice de fragrâncias: tipográfico, dados reais do catálogo */}
      <section className="mx-auto max-w-[1400px] px-4 pt-28 md:px-8">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Encontre pelo aroma</h2>
          <p className="mt-3 max-w-[52ch] text-muted">
            A mesma fragrância em vários formatos. Escolha o cheiro e depois o jeito de usar.
          </p>
        </Reveal>
        <ul className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {scentList.map((s) => (
            <li key={s.name} className="flex items-baseline justify-between gap-4 border-t border-line py-4">
              <Link href={s.items[0].href} className="text-xl font-medium tracking-tight hover:underline hover:underline-offset-4">
                {s.name}
              </Link>
              <span className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-xs text-muted">
                {s.items.map((it) => (
                  <Link key={it.href} href={it.href} className="hover:text-ink">
                    {it.label}
                  </Link>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Corporativo: painel sálvia de largura total */}
      <section className="mx-auto max-w-[1400px] px-4 pt-28 md:px-8">
        <Reveal className="grid overflow-hidden rounded-[var(--radius-media)] bg-sage md:grid-cols-2">
          <div className="flex flex-col justify-center gap-6 p-8 md:p-14">
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Sua marca também tem cheiro.</h2>
            <p className="max-w-[44ch] leading-relaxed text-ink/75">
              Marketing olfativo e fragrâncias exclusivas para varejo, hotéis, consultórios, academias, concessionárias e
              eventos.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={whatsappLink("Olá! Quero um orçamento de aromatização para minha empresa.")}
                className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-ink transition hover:opacity-90 active:scale-[0.98]"
              >
                Pedir orçamento
              </a>
              <Link href="/pagina/marketing-olfativo-com-aromatizacao-profissional" className="text-sm font-medium underline-offset-4 hover:underline">
                Como funciona
              </Link>
            </div>
          </div>
          {corporateImage && (
            <div className="relative min-h-[320px] md:min-h-[520px]">
              <Image src={corporateImage} alt="Difusor Aromart em ambiente" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
