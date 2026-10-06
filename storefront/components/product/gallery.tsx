"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="aspect-square rounded-[var(--radius-media)] bg-surface" />;

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <ul className="scrollbar-none flex gap-2 overflow-x-auto md:w-20 md:flex-col md:overflow-visible" aria-label="Miniaturas">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                onClick={() => setActive(i)}
                aria-label={`Ver imagem ${i + 1}`}
                aria-current={i === active}
                className={`relative block size-16 overflow-hidden rounded-[var(--radius-media)] bg-surface ring-offset-2 ring-offset-bg transition md:size-20 ${i === active ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"}`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-[var(--radius-media)] bg-surface">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name}, imagem ${active + 1} de ${images.length}`}
          fill
          priority={active === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
