import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FillingLogo } from "../logo";
import { c, fontFamily } from "../theme";

/** Abertura: a logo se preenche como no preloader do site. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 24 });
  const sub = spring({ frame: frame - 46, fps, config: { damping: 18, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ background: c.bg, alignItems: "center", justifyContent: "center", fontFamily }}>
      <div style={{ opacity: enter, transform: `translateY(${(1 - enter) * 30}px) scale(${0.96 + enter * 0.04})` }}>
        <FillingLogo width={560} color={c.ink} start={4} duration={44} />
      </div>
      <div style={{ marginTop: 80, fontSize: 46, color: c.muted, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)` }}>
        apresenta o site novo
      </div>
    </AbsoluteFill>
  );
};
