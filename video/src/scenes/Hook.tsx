import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { c, fontFamily } from "../theme";

const words = [
  { t: "Nosso", hl: false },
  { t: "site", hl: false },
  { t: "está", hl: false },
  { t: "de", hl: false },
  { t: "casa", hl: true },
  { t: "nova.", hl: true },
];

/** Gancho: foto real do aparelho Aromarts + título palavra por palavra. */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.18, 1.04]);
  const sub = spring({ frame: frame - 40, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ background: c.ink, fontFamily }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img src={staticFile("empresas-hero.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "52% 50%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(20,21,18,0.92) 10%, rgba(20,21,18,0.35) 55%, rgba(20,21,18,0.15))" }} />

      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 80px 260px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 26, rowGap: 0, maxWidth: 900 }}>
          {words.map((w, i) => {
            const p = spring({ frame: frame - 6 - i * 4, fps, config: { damping: 16, stiffness: 140 } });
            return (
              <span key={i} style={{ overflow: "hidden", display: "inline-block", paddingBottom: 12 }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 150,
                    lineHeight: 1,
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    color: w.hl ? c.sage : c.bg,
                    transform: `translateY(${(1 - p) * 110}%)`,
                  }}
                >
                  {w.t}
                </span>
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 40, fontSize: 46, lineHeight: 1.35, color: "rgba(242,242,238,0.82)", opacity: sub, transform: `translateY(${(1 - sub) * 24}px)` }}>
          Mais bonito, mais rápido e pensado
          <br />
          para o seu celular.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
