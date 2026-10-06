/**
 * Preloader com a marca. Renderizado no servidor e animado só com CSS:
 * aparece no primeiro quadro, sai sozinho (~1,6 s) mesmo sem JavaScript e
 * não bloqueia o conteúdo para o Google. Exibido uma vez por sessão
 * (ver script em layout.tsx que adiciona .no-preloader ao <html>).
 */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__mark">
        {/* eslint-disable-next-line @next/next/no-img-element -- precisa existir antes da hidratação */}
        <img src="/brand/icon.png" alt="" width={96} height={81} className="preloader__wings dark:invert" />
        <span className="preloader__word">Aromart Rios</span>
        <span className="preloader__bar" />
      </div>
    </div>
  );
}

/** Roda antes da pintura: pula o preloader em navegações seguintes da mesma sessão. */
export const preloaderScript = `try{if(sessionStorage.getItem("aromart:intro")){document.documentElement.classList.add("no-preloader")}else{sessionStorage.setItem("aromart:intro","1")}}catch(e){}`;
