import { LOGO_PATH, LOGO_VIEWBOX } from "@/components/brand-logo";

/**
 * Preloader: a logo Aromarts se preenche de baixo para cima, como um líquido
 * (onda subindo sobre uma "sombra" clara da própria logo).
 * Renderizado no servidor e animado só com CSS: aparece no primeiro quadro,
 * sai sozinho mesmo sem JavaScript e não bloqueia o conteúdo para o Google.
 * Exibido uma vez por sessão (script em layout.tsx adiciona .no-preloader ao <html>).
 */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <svg viewBox={LOGO_VIEWBOX} className="preloader__logo" fill="currentColor">
        <defs>
          <path id="aromart-logo" fillRule="evenodd" d={LOGO_PATH} />
          <clipPath id="aromart-logo-nivel">
            {/* Superfície do líquido: onda larga que sobe e desliza para o lado */}
            <path
              className="preloader__nivel"
              d="M-1336 40 Q-1169 0 -1002 40 T-668 40 T-334 40 T0 40 T334 40 T668 40 T1002 40 T1336 40 T1670 40 T2004 40 T2338 40 T2672 40 V1500 H-1336 Z"
            />
          </clipPath>
        </defs>
        <use href="#aromart-logo" className="preloader__sombra" />
        <use href="#aromart-logo" clipPath="url(#aromart-logo-nivel)" />
      </svg>
    </div>
  );
}

/** Roda antes da pintura: pula o preloader em navegações seguintes da mesma sessão. */
export const preloaderScript = `try{if(sessionStorage.getItem("aromart:intro")){document.documentElement.classList.add("no-preloader")}else{sessionStorage.setItem("aromart:intro","1")}}catch(e){}`;
