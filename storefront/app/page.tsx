import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Barbell,
  Bed,
  Car,
  ChatsCircle,
  Confetti,
  Drop,
  House,
  Storefront,
  Stethoscope,
  Briefcase,
  Wind,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { FragranceExplorer, type ExplorerItem } from "@/components/fragrance-explorer";
import { LeadForm } from "@/components/lead-form";
import { HeroIn, HeroImageMotion, Marquee, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import { fragranceOf, getProducts } from "@/lib/catalog";
import { fragranceKey, fragrances } from "@/lib/fragrances";
import { brl, site, whatsappLink } from "@/lib/site";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "Aromatização de ambientes para empresas | Aromart Rios" },
  description: site.description,
  alternates: { canonical: "/" },
  keywords: [
    "aromatização de ambientes",
    "marketing olfativo",
    "aromatização para empresas",
    "aromatizador de ambiente profissional",
    "difusor de varetas",
    "home spray",
  ],
};

const segments = [
  { icon: Storefront, label: "Varejo e lojas" },
  { icon: Bed, label: "Hotéis e pousadas" },
  { icon: Stethoscope, label: "Clínicas e consultórios" },
  { icon: Barbell, label: "Academias e spas" },
  { icon: Car, label: "Concessionárias" },
  { icon: Confetti, label: "Eventos e feiras" },
  { icon: Briefcase, label: "Escritórios e showrooms" },
  { icon: House, label: "Residências" },
];

const steps = [
  { icon: ChatsCircle, title: "Conversa", text: "Você conta sobre o espaço, o público e a sensação que quer passar." },
  { icon: Drop, title: "Proposta", text: "Indicamos as fragrâncias e o formato certo: aparelho, difusor ou spray." },
  { icon: Wind, title: "Aromatização", text: "Entregamos e acompanhamos a reposição para o cheiro não faltar." },
];

const faq = [
  {
    q: "Vocês atendem empresas fora do Rio de Janeiro?",
    a: "Sim. A Aromart Rios entrega em todo o Brasil. Peça um orçamento informando a sua cidade.",
  },
  {
    q: "Posso ter uma fragrância exclusiva da minha marca?",
    a: "Sim. Desenvolvemos fragrâncias exclusivas para empresas que querem usar o marketing olfativo como parte da identidade da marca.",
  },
  {
    q: "Que tipos de ambiente vocês aromatizam?",
    a: "Varejo, hotéis, consultórios, academias e spas, concessionárias, eventos e feiras, showrooms, escritórios e residências.",
  },
  {
    q: "Também posso comprar para casa?",
    a: "Pode. Difusores de varetas, home sprays e aromatizantes estão na loja online, com Pix, boleto ou cartão.",
  },
  {
    q: "Como funciona o frete?",
    a: "O frete é grátis a partir de R$ 480 no Sudeste e de R$ 590 a R$ 790 nas demais regiões. Abaixo disso, o valor é calculado na finalização.",
  },
];

function pick(products: Product[], handles: string[]) {
  return handles.map((h) => products.find((p) => p.handle === h)).filter(Boolean) as Product[];
}

export default async function Home() {
  const products = (await getProducts()).filter((p) => p.available);

  // Fragrâncias com fotos e formatos reais do catálogo
  const order = ["difusores", "home-spray", "aromas"];
  const explorer: ExplorerItem[] = fragrances
    .map((f) => {
      const matches = products
        .filter((p) => fragranceKey(fragranceOf(p.name)) === f.key)
        .sort((a, b) => order.indexOf(a.collection) - order.indexOf(b.collection));
      const formats = matches.map((p) => ({
        label:
          p.collection === "difusores"
            ? "Difusor de varetas 250 ml"
            : p.collection === "home-spray"
              ? "Home spray 250 ml"
              : "Aromatizante 500 ml a 5 L",
        href: `/${p.handle}`,
        price: p.priceMin,
        ranged: p.priceMax > p.priceMin,
      }));
      return { ...f, image: matches[0]?.images[0] ?? null, formats };
    })
    .filter((f) => f.formats.length > 0);

  const featured = products.find((p) => p.handle === "difusor-palo-santo") ?? products[0];
  const highlights = pick(products, [
    "difusor-emporio",
    "aromatizante-wood",
    "home-spray-aromatizador-250ml-noir-candle",
    "difusor-bamboo-250ml",
  ]);
  const benefitImage = products.find((p) => p.handle === "difusor-emporio")?.images[1];
  const exclusiveImage = products.find((p) => p.handle === "difusor-emporio")?.images[2];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Aromatização de ambientes e marketing olfativo",
      provider: { "@type": "Organization", name: site.name, url: site.url },
      areaServed: { "@type": "Country", name: "Brasil" },
      audience: { "@type": "BusinessAudience", audienceType: segments.map((s) => s.label).join(", ") },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* HERO: foto real do aparelho Aromarts em ambiente corporativo */}
      <section className="relative isolate flex min-h-[calc(100dvh-64px)] items-end overflow-hidden md:min-h-[calc(100dvh-72px)]">
        <HeroImageMotion className="absolute inset-0 -z-10">
          <Image
            src="/brand/empresas-hero.webp"
            alt="Aparelho de aromatização Aromarts instalado em parede de madeira de um ambiente corporativo"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[58%_40%] md:object-center"
          />
        </HeroImageMotion>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#141512]/90 via-[#141512]/45 to-[#141512]/5 md:bg-gradient-to-r md:from-[#141512]/85 md:via-[#141512]/35 md:to-transparent" />

        <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-40 text-[#f2f2ee] md:px-8 md:pb-20">
          <HeroIn>
            <p className="text-sm font-medium text-[#dcdcb4]">Marketing olfativo para empresas</p>
          </HeroIn>
          <HeroIn delay={0.08}>
            <h1 className="mt-4 max-w-[15ch] text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-7xl">
              Aromatização que faz sua marca ser lembrada.
            </h1>
          </HeroIn>
          <HeroIn delay={0.16}>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-[#f2f2ee]/80 md:text-lg">
              Fragrâncias exclusivas e aparelhos de aromatização para lojas, hotéis, clínicas e escritórios em todo o Brasil.
            </p>
          </HeroIn>
          <HeroIn delay={0.24} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#orcamento"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#dcdcb4] px-7 py-4 text-sm font-semibold text-[#1c1d19] transition hover:bg-[#e8e8c6] active:scale-[0.98]"
            >
              Pedir orçamento
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#fragrancias"
              className="inline-flex items-center justify-center rounded-full border border-[#f2f2ee]/35 px-7 py-4 text-sm font-medium backdrop-blur-sm transition hover:bg-[#f2f2ee]/10"
            >
              Conhecer fragrâncias
            </Link>
          </HeroIn>
        </div>
      </section>

      {/* Segmentos atendidos: única faixa contínua da página */}
      <section
        aria-label="Segmentos atendidos"
        className="border-b border-line bg-sage py-5 text-lg font-medium tracking-tight text-ink md:py-6 md:text-2xl"
      >
        <Marquee items={segments.map((s) => s.label)} />
      </section>

      {/* Por que aromatizar: bento */}
      <section id="solucoes" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-20 md:px-8 md:pt-28">
        <Reveal as="header" className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">O cheiro também vende.</h2>
          <p className="mt-4 text-muted md:text-lg">
            O olfato está ligado à memória e às emoções. Um ambiente perfumado faz o cliente ficar mais e lembrar de você.
          </p>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-6 md:gap-4">
          <StaggerItem className="relative col-span-2 min-h-[420px] overflow-hidden rounded-[var(--radius-media)] bg-surface md:col-span-4 md:row-span-2 md:min-h-[560px]">
            {benefitImage && (
              <Image src={benefitImage} alt="Difusor de varetas Aromarts" fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141512]/80 via-[#141512]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-[#f2f2ee] md:p-10">
              <Sparkle size={28} weight="light" className="text-[#dcdcb4]" />
              <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">Memória de marca</h3>
              <p className="mt-2 max-w-[42ch] text-[#f2f2ee]/80">
                Quando o cliente sente o aroma de novo, revive a experiência. É a sua marca ficando na lembrança.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem className="col-span-1 flex flex-col justify-between rounded-[var(--radius-media)] bg-sage p-5 md:col-span-2 md:p-7">
            <span className="text-4xl font-semibold tracking-tight tabular-nums md:text-6xl">+15,9%</span>
            <span className="mt-6 text-sm leading-snug md:text-base">de tempo de permanência no ponto de venda*</span>
          </StaggerItem>

          <StaggerItem className="col-span-1 flex flex-col justify-between rounded-[var(--radius-media)] bg-primary p-5 text-primary-ink md:col-span-2 md:p-7">
            <span className="text-4xl font-semibold tracking-tight tabular-nums md:text-6xl">+14,8%</span>
            <span className="mt-6 text-sm leading-snug opacity-80 md:text-base">de probabilidade de compra*</span>
          </StaggerItem>

          <StaggerItem className="col-span-2 flex flex-col gap-3 rounded-[var(--radius-media)] border border-line p-6 md:col-span-3 md:p-8">
            <Wind size={28} weight="light" className="text-sage-deep" />
            <h3 className="text-xl font-semibold tracking-tight md:text-2xl">Ambiente mais agradável</h3>
            <p className="max-w-[44ch] text-muted">
              Equipes mais dispostas e concentradas, menos sensação de cansaço e um ar que convida a ficar.
            </p>
          </StaggerItem>

          <StaggerItem className="relative col-span-2 grid min-h-[260px] overflow-hidden rounded-[var(--radius-media)] bg-surface sm:grid-cols-2 md:col-span-3">
            <div className="flex flex-col gap-3 p-6 md:p-8">
              <Drop size={28} weight="light" className="text-sage-deep" />
              <h3 className="text-xl font-semibold tracking-tight md:text-2xl">Fragrância exclusiva</h3>
              <p className="text-muted">Criamos com você o aroma que vira a assinatura da sua marca.</p>
            </div>
            {exclusiveImage && (
              <div className="relative min-h-[200px]">
                <Image src={exclusiveImage} alt="Embalagem do difusor Aromarts" fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover" />
              </div>
            )}
          </StaggerItem>
        </Stagger>
        <p className="mt-4 text-xs text-muted">
          *Médias de pesquisa comportamental realizada na Alemanha sobre o uso de fragrâncias no ponto de venda.
        </p>
      </section>

      {/* Como funciona + segmentos */}
      <section className="mx-auto max-w-[1400px] px-4 pt-20 md:px-8 md:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Do primeiro contato ao ambiente perfumado.</h2>
            </Reveal>
            <Stagger as="ul" className="mt-10 space-y-8">
              {steps.map(({ icon: Icon, title, text }) => (
                <StaggerItem as="li" key={title} className="flex gap-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sage">
                    <Icon size={22} />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold tracking-tight">{title}</span>
                    <span className="mt-1 block max-w-[40ch] text-muted">{text}</span>
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Stagger as="ul" className="grid grid-cols-2 gap-3 self-start sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {segments.map(({ icon: Icon, label }) => (
              <StaggerItem
                as="li"
                key={label}
                className="flex aspect-square flex-col justify-between rounded-[var(--radius-media)] bg-surface p-4 transition-colors hover:bg-sage md:p-5"
              >
                <Icon size={30} weight="light" />
                <span className="text-sm font-medium leading-snug md:text-base">{label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Fragrâncias */}
      <section id="fragrancias" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 pt-20 md:px-8 md:pt-28">
        <Reveal as="header" className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Nossas fragrâncias</h2>
          <p className="mt-4 text-muted md:text-lg">
            {explorer.length} composições próprias, com notas de saída, coração e fundo. Escolha pela família ou pelo nome.
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <FragranceExplorer items={explorer} />
        </Reveal>
      </section>

      {/* Destaques da loja: bento de produtos */}
      <section className="mx-auto max-w-[1400px] px-4 pt-20 md:px-8 md:pt-28">
        <Reveal as="header" className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Destaques para levar para casa</h2>
            <p className="mt-3 text-muted md:text-lg">As mesmas fragrâncias, em difusores, sprays e aromatizantes.</p>
          </div>
          <nav aria-label="Categorias" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
            {site.nav.slice(2, 5).map((c) => (
              <Link key={c.href} href={c.href} className="shrink-0 rounded-full border border-line px-4 py-2 text-sm transition hover:border-ink">
                {c.label}
              </Link>
            ))}
          </nav>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
          {featured && (
            <StaggerItem as="article" className="col-span-2 lg:row-span-2">
              <Link
                href={`/${featured.handle}`}
                className="group relative flex h-full min-h-[460px] overflow-hidden rounded-[var(--radius-media)] bg-sage"
              >
                <Image
                  src={featured.images[1] ?? featured.images[0]}
                  alt={featured.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141512]/75 via-transparent to-transparent" />
                <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6 text-[#f2f2ee] md:p-8">
                  <div>
                    <p className="text-sm text-[#dcdcb4]">Mais pedido</p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight md:text-4xl">{featured.name}</h3>
                    <p className="mt-1 tabular-nums text-[#f2f2ee]/80">{brl(featured.priceMin)}</p>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f2f2ee] text-[#1c1d19] transition group-hover:translate-x-1">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          )}
          {highlights.map((p) => (
            <StaggerItem key={p.handle}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Orçamento */}
      <section id="orcamento" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-20 md:px-8 md:pt-28">
        <Reveal className="grid overflow-hidden rounded-[var(--radius-media)] bg-surface lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden p-6 text-[#f2f2ee] md:p-10">
            <Image src="/brand/empresas-hero.webp" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="-z-10 object-cover object-center" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#141512]/90 via-[#141512]/50 to-[#141512]/20" />
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Vamos perfumar sua empresa?</h2>
            <p className="mt-4 max-w-[40ch] text-[#f2f2ee]/80">
              Preencha em 1 minuto. A conversa continua no WhatsApp com a nossa equipe comercial.
            </p>
            <a
              href={whatsappLink("Olá! Quero falar sobre aromatização para minha empresa.")}
              className="mt-6 text-sm font-medium text-[#dcdcb4] underline underline-offset-4"
            >
              Prefere falar direto? {site.phone}
            </a>
          </div>
          <div className="p-6 md:p-10">
            <LeadForm />
          </div>
        </Reveal>
      </section>

      {/* Perguntas frequentes (com FAQPage JSON-LD) */}
      <section className="mx-auto max-w-[1400px] px-4 pt-20 md:px-8 md:pt-28">
        <Reveal as="header">
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Perguntas frequentes</h2>
        </Reveal>
        <Stagger className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {faq.map((f) => (
            <StaggerItem key={f.q} className="border-t border-line pt-6">
              <h3 className="text-lg font-semibold tracking-tight">{f.q}</h3>
              <p className="mt-2 max-w-[56ch] leading-relaxed text-muted">{f.a}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
