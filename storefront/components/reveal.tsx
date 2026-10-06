/**
 * Entrada suave ao rolar, 100% CSS (animation-timeline: view()).
 * O conteúdo é visível por padrão: sem JS, sem suporte ou com movimento reduzido, nada fica escondido.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`reveal ${className}`} style={delay ? { animationDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}
