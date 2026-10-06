import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DeviceMobile, Drop, Lightning, MagnifyingGlass, Storefront } from "@phosphor-icons/react";
import { c, fontFamily } from "../theme";

type Tile = {
  span: 1 | 2;
  h: number;
  bg: string;
  fg: string;
  icon?: React.ReactNode;
  title: string;
  text: string;
  image?: string;
};

const tiles: Tile[] = [
  { span: 2, h: 300, bg: c.sage, fg: c.ink, icon: <Lightning size={64} weight="light" />, title: "Abre rápido", text: "Fotos leves e páginas prontas antes do clique." },
  { span: 1, h: 470, bg: c.brand, fg: c.bg, icon: <Drop size={64} weight="light" />, title: "Notas olfativas", text: "Saída, coração e fundo de cada fragrância." },
  { span: 1, h: 470, bg: c.surface, fg: c.ink, image: "difusor-palo-santo-2.webp", title: "Produto em destaque", text: "" },
  { span: 1, h: 380, bg: c.surface, fg: c.ink, icon: <Storefront size={64} weight="light" />, title: "Orçamento em 1 minuto", text: "Para lojas, hotéis, clínicas e escritórios." },
  { span: 1, h: 380, bg: c.bg, fg: c.ink, icon: <MagnifyingGlass size={64} weight="light" />, title: "Feito para o Google", text: "Mais fácil de ser encontrado." },
  { span: 2, h: 220, bg: c.ink, fg: c.bg, icon: <DeviceMobile size={64} weight="light" />, title: "Do celular ao pedido", text: "Tudo em poucos toques." },
];

/** Bento com as novidades do site, entrando em sequência. */
export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ background: c.bg, fontFamily, padding: "150px 70px 0" }}>
      <div style={{ opacity: head, transform: `translateY(${(1 - head) * 40}px)` }}>
        <div style={{ fontSize: 40, color: c.sageDeep, fontWeight: 500 }}>O que tem de novo</div>
        <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1, marginTop: 14, color: c.ink }}>
          Tudo mais simples.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 60 }}>
        {tiles.map((t, i) => {
          const p = spring({ frame: frame - 10 - i * 5, fps, config: { damping: 15, stiffness: 120 } });
          return (
            <div
              key={t.title}
              style={{
                gridColumn: `span ${t.span}`,
                height: t.h,
                background: t.bg,
                color: t.fg,
                borderRadius: 28,
                border: t.bg === c.bg ? `3px solid ${c.line}` : "none",
                padding: 40,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: Math.min(1, p * 1.4),
                transform: `translateY(${(1 - p) * 120}px) scale(${0.9 + p * 0.1})`,
              }}
            >
              {t.image ? (
                <>
                  <Img src={staticFile(t.image)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,21,18,0.75), rgba(20,21,18,0) 55%)" }} />
                  <div style={{ position: "relative", marginTop: "auto", fontSize: 44, fontWeight: 600, color: c.bg, letterSpacing: "-0.02em" }}>
                    {t.title}
                  </div>
                </>
              ) : (
                <>
                  {t.icon}
                  <div>
                    <div style={{ fontSize: 50, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>{t.title}</div>
                    <div style={{ fontSize: 32, marginTop: 10, opacity: 0.75, lineHeight: 1.3 }}>{t.text}</div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
