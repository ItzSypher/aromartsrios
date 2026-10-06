import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { c, fontFamily } from "../theme";

/** Abertura: mesma animação do preloader do site (asas sobem, nome aparece, barra enche). */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wings = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 28 });
  const word = spring({ frame: frame - 8, fps, config: { damping: 200 }, durationInFrames: 30 });
  const bar = interpolate(frame, [6, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sub = spring({ frame: frame - 34, fps, config: { damping: 18, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ background: c.bg, alignItems: "center", justifyContent: "center", fontFamily }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <Img
          src={staticFile("icon.png")}
          style={{
            width: 300,
            clipPath: `inset(${(1 - wings) * 100}% 0 0 0)`,
            transform: `translateY(${(1 - wings) * 50}px) scale(${0.9 + wings * 0.1})`,
          }}
        />
        <div
          style={{
            fontSize: 46,
            fontWeight: 600,
            color: c.ink,
            letterSpacing: `${interpolate(word, [0, 1], [0.7, 0.32])}em`,
            paddingLeft: "0.32em",
            opacity: word,
          }}
        >
          AROMART RIOS
        </div>
        <div style={{ width: 340, height: 6, borderRadius: 6, background: c.line, overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: c.ink, transform: `scaleX(${bar})`, transformOrigin: "left" }} />
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 44,
            color: c.muted,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 30}px)`,
          }}
        >
          apresenta o site novo
        </div>
      </div>
    </AbsoluteFill>
  );
};
