import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 py-32 md:px-8">
      <h1 className="font-display text-5xl font-medium">Página não encontrada</h1>
      <p className="mt-4 text-muted">O endereço pode ter mudado. Os produtos continuam aqui.</p>
      <div className="mt-8 flex gap-6">
        <Link href="/" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink">
          Ir para o início
        </Link>
        <Link href="/buscar" className="py-3 text-sm font-medium underline-offset-4 hover:underline">
          Buscar produto
        </Link>
      </div>
    </div>
  );
}
