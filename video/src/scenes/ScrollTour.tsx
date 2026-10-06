import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone } from "../components/Phone";
import { c, fontFamily } from "../theme";

const PHONE_W = 640;
const SCREEN_W = PHONE_W - 36;
const SCALE = SCREEN_W / 390; // px de tela por px CSS do site

// Paradas do scroll (em px CSS, medidas no site real) e quadros correspondentes
const KEYS = {
  frames: [0, 45, 72, 105, 125, 140, 172, 205, 230, 270],
  css: [0, 0, 880, 880, 1290, 1290, 3660, 3660, 4850, 4850],
};

const captions = [
  { from: 0, text: ["Feito primeiro", "para o celular"] },
  { from: 56, text: ["Pensado para", "empresas"] },
  { from: 146, text: ["22 fragrâncias com", "notas olfativas"] },
  { from: 214, text: ["Compra fácil", "para casa"] },
];

const Caption: React.FC<{ lines: string[]; from: number; to: number }> = ({ lines, from, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame > to) return null;
  const enter = spring({ frame: frame - from, fps, config: { damping: 18, stiffness: 150 } });
  const exit = interpolate(frame, [to - 9, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: enter * (1 - exit),
        transform: `translateY(${(1 - enter) * 60 - exit * 50}px)`,
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: 84, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05, color: c.ink, textAlign: "center" }}>
          {l}
        </div>
      ))}
    </div>
  );
};

/** O site real rolando dentro do celular, com legendas sincronizadas às seções. */
export const ScrollTour: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const scrollCss = interpolate(frame, KEYS.frames, KEYS.css, {
    easing: Easing.bezier(0.65, 0, 0.35, 1),
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: c.sage, fontFamily }}>
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242,242,238,0.55), rgba(242,242,238,0) 65%)",
          left: -110,
          top: 520,
        }}
      />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, height: 220 }}>
        {captions.map((cap, i) => (
          <Caption key={cap.from} lines={cap.text} from={cap.from} to={captions[i + 1]?.from ?? durationInFrames + 20} />
        ))}
      </div>

      <AbsoluteFill style={{ alignItems: "center", top: 470 }}>
        <div style={{ transform: `translateY(${(1 - enter) * 900}px) rotate(${(1 - enter) * -8}deg)` }}>
          <Phone width={PHONE_W}>
            <Img
              src={staticFile("shots/home-scroll.jpg")}
              style={{ width: SCREEN_W, transform: `translateY(${-scrollCss * SCALE}px)` }}
            />
          </Phone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
