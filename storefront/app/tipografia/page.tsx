import type { Metadata } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Geist, Instrument_Sans, Jost, Manrope, Newsreader } from "next/font/google";

/**
 * Página interna para escolher a tipografia definitiva (não aparece no menu nem no Google).
 * Cada opção aplica as fontes ao conteúdo real do site.
 */
export const metadata: Metadata = { title: "Teste de tipografia", robots: { index: false, follow: false } };

const geist = Geist({ subsets: ["latin"], weight: ["400", "600"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"] });
const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"] });
const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"] });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"] });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"] });
const instrument = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

type Option = {
  id: string;
  name: string;
  why: string;
  display: string;
  body: string;
  displayLabel: string;
  bodyLabel: string;
  headline: React.ReactNode;
  headlineClass: string;
  tag?: string;
  current?: boolean;
};

const options: Option[] = [
  {
    id: "atual",
    name: "Anterior (Geist)",
    why: "Fonte usada no MVP. Neutra e eficiente, mas comum em sites feitos com IA. Fica aqui para comparação.",
    display: geist.className,
    body: geist.className,
    displayLabel: "Geist",
    bodyLabel: "Geist",
    headline: "Aromatização que faz sua marca ser lembrada.",
    headlineClass: "font-semibold tracking-[-0.035em] leading-[1.02]",
    current: true,
  },
  {
    id: "perfumaria",
    name: "Perfumaria clássica",
    tag: "Em uso no site",
    why: "Serifa de alto contraste com cara de rótulo de perfume, equilibrada por uma geométrica no estilo Futura, tipografia histórica da perfumaria. Conversa com o nome AROMART RIOS no logo.",
    display: cormorant.className,
    body: jost.className,
    displayLabel: "Cormorant Garamond",
    bodyLabel: "Jost",
    headline: (
      <>
        Aromatização que faz sua marca ser <em className="italic">lembrada.</em>
      </>
    ),
    headlineClass: "font-medium tracking-[-0.02em] leading-[1.02]",
  },
  {
    id: "alta",
    name: "Alta perfumaria",
    why: "Didone de contraste extremo, a linguagem de editoriais de moda e campanhas de perfume. Muito elegante em títulos grandes; usar só em destaque.",
    display: bodoni.className,
    body: manrope.className,
    displayLabel: "Bodoni Moda",
    bodyLabel: "Manrope",
    headline: "Aromatização que faz sua marca ser lembrada.",
    headlineClass: "font-medium tracking-[-0.03em] leading-[1.05]",
  },
  {
    id: "editorial",
    name: "Editorial contemporâneo",
    why: "Serifa de leitura moderna, mais revista do que luxo antigo. Passa autoridade para o público corporativo sem ficar formal.",
    display: newsreader.className,
    body: instrument.className,
    displayLabel: "Newsreader",
    bodyLabel: "Instrument Sans",
    headline: (
      <>
        Aromatização que faz sua <em className="italic">marca</em> ser lembrada.
      </>
    ),
    headlineClass: "font-normal tracking-[-0.03em] leading-[1.05]",
  },
  {
    id: "geometrico",
    name: "Geométrico atemporal",
    why: "Uma família só, em pesos leves e rótulos espaçados. Minimalista, combina direto com o logo e é a troca mais simples de fazer.",
    display: jost.className,
    body: jost.className,
    displayLabel: "Jost",
    bodyLabel: "Jost",
    headline: "Aromatização que faz sua marca ser lembrada.",
    headlineClass: "font-light tracking-[-0.03em] leading-[1.05]",
  },
];

const paid = [
  { name: "Canela", use: "títulos", note: "serifa da Commercial Type, muito usada em marcas de perfume e beleza" },
  { name: "Saol Display", use: "títulos", note: "serifa editorial com itálico marcante" },
  { name: "Söhne", use: "texto", note: "grotesca refinada da Klim, sóbria e premium" },
  { name: "Neue Haas Unica", use: "texto", note: "a Helvetica revisada, clássica e limpa" },
];

export default function TipografiaPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-12 md:px-8 md:pt-16">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Teste de tipografia</h1>
      <p className="mt-3 max-w-[60ch] text-muted">
        Cada bloco aplica o par de fontes ao conteúdo real do site. Todas são gratuitas (Google Fonts) e carregadas sem
        custo de desempenho pelo Next.js.
      </p>

      <div className="mt-12 space-y-8">
        {options.map((o) => (
          <section key={o.id} className="overflow-hidden rounded-[var(--radius-media)] border border-line">
            <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line bg-surface px-5 py-4 md:px-8">
              <h2 className="text-lg font-semibold">
                {o.name}
                {o.tag && <span className="ml-3 rounded-full bg-sage px-2.5 py-0.5 text-xs font-medium">{o.tag}</span>}
              </h2>
              <p className="text-sm text-muted">
                Títulos: <strong className="text-ink">{o.displayLabel}</strong> · Texto: <strong className="text-ink">{o.bodyLabel}</strong>
              </p>
            </header>

            <div className="grid gap-10 px-5 py-8 md:grid-cols-[1.3fr_1fr] md:px-8 md:py-10">
              <div className={o.body}>
                <p className="text-xs uppercase tracking-[0.2em] text-sage-deep">Marketing olfativo para empresas</p>
                <p className={`${o.display} ${o.headlineClass} mt-4 text-[2.6rem] md:text-6xl`}>{o.headline}</p>
                <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">
                  Fragrâncias exclusivas e aparelhos de aromatização para lojas, hotéis, clínicas e escritórios em todo o
                  Brasil.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink">Pedir orçamento</span>
                  <span className="rounded-full border border-line px-6 py-3 text-sm">Conhecer fragrâncias</span>
                </div>
              </div>

              <div className={`${o.body} space-y-5 self-end`}>
                <div>
                  <p className="text-sm text-muted">Amadeiradas</p>
                  <p className={`${o.display} text-4xl ${o.id === "geometrico" ? "font-light" : "font-medium"} tracking-tight`}>Palo Santo</p>
                  <p className="mt-1 text-muted">Madeira sagrada: calma, purificação e equilíbrio.</p>
                </div>
                <dl className="grid grid-cols-3 gap-2 text-sm">
                  {[
                    ["Saída", "Notas amadeiradas"],
                    ["Coração", "Resinas aromáticas"],
                    ["Fundo", "Musk, âmbar"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-[var(--radius-media)] bg-surface p-3">
                      <dt className="text-xs text-muted">{k}</dt>
                      <dd className="font-medium leading-snug">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="flex justify-between border-t border-line pt-4">
                  <span>Difusor Palo Santo 250ml</span>
                  <span className="tabular-nums">R$ 129,90</span>
                </p>
              </div>
            </div>
            <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-muted md:px-8">{o.why}</p>
          </section>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">Se quiser investir em fontes pagas</h2>
        <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {paid.map((p) => (
            <li key={p.name} className="border-t border-line pt-4">
              <p className="font-semibold">
                {p.name} <span className="font-normal text-muted">· {p.use}</span>
              </p>
              <p className="text-sm text-muted">{p.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
