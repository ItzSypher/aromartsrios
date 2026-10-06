import { c } from "../theme";

/** Moldura de celular com a tela real do site dentro. */
export const Phone: React.FC<{
  children: React.ReactNode;
  width?: number;
  style?: React.CSSProperties;
}> = ({ children, width = 640, style }) => {
  const bezel = 18;
  const screenW = width - bezel * 2;
  const screenH = Math.round(screenW * (1688 / 780));
  return (
    <div
      style={{
        width,
        height: screenH + bezel * 2,
        borderRadius: 86,
        background: "#121310",
        padding: bezel,
        boxShadow: "0 60px 120px rgba(28,29,25,0.35), inset 0 0 0 2px rgba(255,255,255,0.08)",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          width: screenW,
          height: screenH,
          borderRadius: 68,
          overflow: "hidden",
          position: "relative",
          background: c.bg,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          top: bezel + 16,
          left: "50%",
          width: 150,
          height: 42,
          marginLeft: -75,
          borderRadius: 30,
          background: "#121310",
        }}
      />
    </div>
  );
};

export const PHONE_SCREEN_RATIO = 1688 / 780;
