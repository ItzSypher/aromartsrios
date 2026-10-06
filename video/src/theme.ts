import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Geist embutida (sem depender de rede na renderização)
export const fontFamily = "Geist";
for (const [file, weight] of [
  ["Geist-Regular", "400"],
  ["Geist-Medium", "500"],
  ["Geist-SemiBold", "600"],
  ["Geist-Bold", "700"],
] as const) {
  loadFont({ family: fontFamily, url: staticFile(`fonts/${file}.woff2`), weight, format: "woff2" });
}

// Mesma paleta do site novo
export const c = {
  bg: "#f2f2ee",
  surface: "#e6e7df",
  ink: "#1c1d19",
  muted: "#5b5c53",
  sage: "#dcdcb4",
  sageDeep: "#8a8c55",
  brand: "#2b2a26",
  line: "#d3d4cb",
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;

// Easing "expo out" usado no site
export const easeOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
