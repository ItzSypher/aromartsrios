"use client";

import { useEffect, useRef } from "react";

type Sequence = { dir: string; frames: number; focusX: number; focusY: number };

/**
 * Vídeo do hero controlado pela rolagem.
 * Cada vídeo foi convertido em quadros WebP (sem áudio, 12 fps) e é desenhado num <canvas>:
 * a rolagem dentro da seção vira a posição do vídeo, com suavização.
 * O primeiro quadro é a foto SSR que fica por baixo (aparece na hora, sem JS e para o Google).
 * Movimento reduzido ou economia de dados: fica só a foto e a seção perde a altura extra.
 */
export function HeroScrollVideo({
  sectionId,
  desktop,
  mobile,
}: {
  sectionId: string;
  desktop: Sequence;
  mobile: Sequence;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) {
      section.dataset.static = "";
      return;
    }

    const wide = window.matchMedia("(min-width: 768px)");
    let seq: Sequence = wide.matches ? desktop : mobile;
    let images: HTMLImageElement[] = [];
    let current = 0; // quadro exibido (contínuo, para suavizar)
    let target = 0; // quadro pedido pela rolagem
    let drawn = -1;
    let raf = 0;
    let disposed = false;

    const src = (s: Sequence, i: number) => `${s.dir}/${String(i).padStart(3, "0")}.webp`;

    function load(s: Sequence) {
      const list: HTMLImageElement[] = Array.from({ length: s.frames }, () => new Image());
      let next = 0;
      // Primeiro quadro na frente, depois o resto com no máximo 6 downloads simultâneos
      const pump = () => {
        if (disposed || s !== seq || next >= s.frames) return;
        const i = next++;
        const img = list[i];
        img.decoding = "async";
        img.onload = img.onerror = () => {
          if (Math.round(current) === i || drawn < 0) schedule(true);
          pump();
        };
        img.src = src(s, i);
      };
      for (let k = 0; k < 6; k++) pump();
      return list;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas!.getBoundingClientRect();
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      drawn = -1;
      schedule(true);
    }

    function nearestLoaded(i: number) {
      for (let d = 0; d < images.length; d++) {
        const a = images[i - d];
        if (a?.complete && a.naturalWidth) return a;
        const b = images[i + d];
        if (b?.complete && b.naturalWidth) return b;
      }
      return null;
    }

    function draw(i: number) {
      const img = nearestLoaded(i);
      if (!img) return;
      const cw = canvas!.width;
      const ch = canvas!.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (cw - w) * seq.focusX;
      const y = (ch - h) * seq.focusY;
      ctx!.drawImage(img, x, y, w, h);
      drawn = i;
      canvas!.dataset.ready = "";
    }

    function progress() {
      const rect = section!.getBoundingClientRect();
      const stage = section!.firstElementChild as HTMLElement | null;
      const top = stage ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
      const run = rect.height - (stage?.offsetHeight ?? window.innerHeight);
      if (run <= 0) return 0;
      return Math.min(1, Math.max(0, (top - rect.top) / run));
    }

    function tick() {
      raf = 0;
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.05) current = target;
      const frame = Math.round(current);
      if (frame !== drawn) draw(frame);
      if (current !== target) schedule();
    }

    function schedule(force = false) {
      if (force) drawn = -1;
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onScroll() {
      target = progress() * (seq.frames - 1);
      schedule();
    }

    function onBreakpoint() {
      seq = wide.matches ? desktop : mobile;
      images = load(seq);
      onScroll();
      schedule(true);
    }

    images = load(seq);
    resize();
    onScroll();
    current = target;

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    wide.addEventListener("change", onBreakpoint);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", onBreakpoint);
    };
  }, [sectionId, desktop, mobile]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 data-[ready]:opacity-100"
    />
  );
}
