import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ArrowLeft, Checks, Phone as PhoneIcon, VideoCamera } from "@phosphor-icons/react";
import { Phone } from "../components/Phone";
import { c, fontFamily } from "../theme";

const PHONE_W = 640;
const SCREEN_W = PHONE_W - 36;
const SCREEN_H = Math.round(SCREEN_W * (1688 / 780));

const message = [
  "Olá! Quero um orçamento de aromatização para minha empresa.",
  "",
  "Empresa: Hotel Vista Mar",
  "Segmento: Hotel ou pousada",
  "Cidade: Niterói",
  "Área: 120 a 500 m²",
  "Fragrância: Wood",
].join("\n");

const TAP = 38;
const SWITCH = 54;
const TYPE_START = 72;
const TYPE_END = 132;
const REPLY = 168;

const ChatScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = Math.round(interpolate(frame, [TYPE_START, TYPE_END], [0, message.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const bubble = spring({ frame: frame - TYPE_START + 4, fps, config: { damping: 16, stiffness: 160 } });
  const sent = frame > TYPE_END + 6;
  const typing = frame > TYPE_END + 14 && frame < REPLY;
  const reply = spring({ frame: frame - REPLY, fps, config: { damping: 15, stiffness: 160 } });

  return (
    <div style={{ width: SCREEN_W, height: SCREEN_H, background: "#efeae2", display: "flex", flexDirection: "column", fontFamily }}>
      <div style={{ background: "#008069", color: "#fff", padding: "86px 22px 22px", display: "flex", alignItems: "center", gap: 16 }}>
        <ArrowLeft size={34} />
        <div style={{ width: 62, height: 62, borderRadius: 31, background: c.sage, display: "grid", placeItems: "center" }}>
          <Img src={staticFile("icon.png")} style={{ width: 38 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 600 }}>Aromart Rios</div>
          <div style={{ fontSize: 22, opacity: 0.85 }}>{typing ? "digitando..." : "online"}</div>
        </div>
        <VideoCamera size={34} />
        <PhoneIcon size={32} />
      </div>

      <div style={{ flex: 1, padding: "28px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ alignSelf: "center", background: "#fff", borderRadius: 12, padding: "6px 16px", fontSize: 20, color: "#54656f" }}>HOJE</div>
        {frame >= TYPE_START - 4 && (
          <div
            style={{
              alignSelf: "flex-end",
              maxWidth: "84%",
              background: "#d9fdd3",
              borderRadius: "22px 6px 22px 22px",
              padding: "16px 20px 12px",
              fontSize: 25,
              lineHeight: 1.38,
              color: "#111b21",
              whiteSpace: "pre-wrap",
              transformOrigin: "100% 0%",
              transform: `scale(${0.6 + bubble * 0.4})`,
              opacity: bubble,
              boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
            }}
          >
            {message.slice(0, chars)}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, fontSize: 18, color: "#667781", marginTop: 4 }}>
              10:42
              <Checks size={22} color={sent ? "#53bdeb" : "#8696a0"} weight="bold" />
            </div>
          </div>
        )}
        {frame >= REPLY && (
          <div
            style={{
              alignSelf: "flex-start",
              maxWidth: "84%",
              background: "#fff",
              borderRadius: "6px 22px 22px 22px",
              padding: "16px 20px 12px",
              fontSize: 25,
              lineHeight: 1.38,
              color: "#111b21",
              transformOrigin: "0% 0%",
              transform: `scale(${0.6 + reply * 0.4})`,
              opacity: reply,
              boxShadow: "0 1px 1px rgba(0,0,0,0.08)",
            }}
          >
            Oi, Marina! Recebemos seu pedido. Já vamos preparar a sua proposta.
            <div style={{ textAlign: "right", fontSize: 18, color: "#667781", marginTop: 4 }}>10:43</div>
          </div>
        )}
      </div>
    </div>
  );
};

/** Formulário do site -> toque em enviar -> pedido chega pronto no WhatsApp. */
export const WhatsApp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 100 } });
  const tap = spring({ frame: frame - TAP, fps, config: { damping: 14, stiffness: 200 } });
  const tapFade = interpolate(frame, [TAP + 6, TAP + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const press = frame >= TAP && frame < TAP + 6 ? 0.96 : 1;
  const sw = spring({ frame: frame - SWITCH, fps, config: { damping: 20, stiffness: 110 } });
  const cap1 = interpolate(frame, [0, 10, SWITCH, SWITCH + 10], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const cap2 = spring({ frame: frame - SWITCH - 4, fps, config: { damping: 18, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ background: c.bg, fontFamily }}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, height: 220, textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, opacity: cap1, transform: `translateY(${(1 - cap1) * 40}px)` }}>
          <div style={{ fontSize: 84, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05, color: c.ink }}>
            Preencheu,
            <br />
            enviou.
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: cap2, transform: `translateY(${(1 - cap2) * 60}px)` }}>
          <div style={{ fontSize: 84, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05, color: c.ink }}>
            Cai direto no
            <br />
            nosso <span style={{ color: "#008069" }}>WhatsApp</span>.
          </div>
        </div>
      </div>

      <AbsoluteFill style={{ alignItems: "center", top: 470 }}>
        <div style={{ transform: `translateY(${(1 - enter) * 700}px)` }}>
          <Phone width={PHONE_W}>
            {/* Tela 1: formulário real do site */}
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${-sw * 100}%)` }}>
              <Img src={staticFile("shots/form.jpg")} style={{ width: SCREEN_W }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 210, background: `linear-gradient(to top, ${c.surface} 70%, rgba(230,231,223,0))` }} />
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  right: 34,
                  bottom: 70,
                  height: 92,
                  borderRadius: 46,
                  background: c.brand,
                  color: c.bg,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 27,
                  fontWeight: 500,
                  transform: `scale(${press})`,
                }}
              >
                Pedir orçamento pelo WhatsApp
              </div>
              {frame >= TAP && (
                <div
                  style={{
                    position: "absolute",
                    left: SCREEN_W / 2 - 60,
                    bottom: 56,
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    background: "rgba(220,220,180,0.55)",
                    border: "4px solid rgba(255,255,255,0.8)",
                    transform: `scale(${0.4 + tap * 0.9})`,
                    opacity: tapFade,
                  }}
                />
              )}
            </div>
            {/* Tela 2: conversa no WhatsApp */}
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - sw) * 100}%)` }}>
              <ChatScreen />
            </div>
          </Phone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
