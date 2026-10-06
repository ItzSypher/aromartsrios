import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WhatsappLogo } from "@phosphor-icons/react";
import { StaticLogo } from "../logo";
import { c, fontFamily } from "../theme";

/** Fechamento: chamada para o WhatsApp comercial e endereço do site. */
export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 200 } });
  const title = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 120 } });
  const btn = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 140 } });
  const url = spring({ frame: frame - 26, fps, config: { damping: 200 } });
  const pulse = 1 + Math.max(0, Math.sin((frame - 30) / 7)) * 0.035 * (frame > 30 ? 1 : 0);
  const ring = interpolate((frame - 30) % 36, [0, 36], [0, 1]);

  return (
    <AbsoluteFill style={{ background: c.brand, color: c.bg, fontFamily, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <StaticLogo width={230} color={c.bg} style={{ opacity: logo, transform: `translateY(${(1 - logo) * 30}px)` }} />
      <div
        style={{
          marginTop: 60,
          fontSize: 128,
          fontWeight: 600,
          letterSpacing: "-0.045em",
          lineHeight: 0.98,
          opacity: title,
          transform: `translateY(${(1 - title) * 60}px)`,
        }}
      >
        Peça seu
        <br />
        <span style={{ color: c.sage }}>orçamento.</span>
      </div>
      <div style={{ marginTop: 34, fontSize: 42, opacity: title * 0.8, maxWidth: 820, lineHeight: 1.3 }}>
        Aromatização para lojas, hotéis, clínicas e escritórios.
      </div>

      <div style={{ position: "relative", marginTop: 90 }}>
        {frame > 30 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 80,
              border: "4px solid #25D366",
              transform: `scale(${1 + ring * 0.25})`,
              opacity: 1 - ring,
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            background: "#25D366",
            color: "#0b1f14",
            borderRadius: 80,
            padding: "34px 60px",
            fontSize: 52,
            fontWeight: 600,
            transform: `scale(${(0.6 + btn * 0.4) * pulse})`,
            opacity: Math.min(1, btn * 1.3),
          }}
        >
          <WhatsappLogo size={64} weight="fill" />
          (21) 96406-6834
        </div>
      </div>

      <div style={{ marginTop: 70, fontSize: 46, fontWeight: 500, letterSpacing: "-0.01em", opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
        aromartrios.com.br
      </div>
    </AbsoluteFill>
  );
};
