import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPages } from "@/lib/catalog";
import { whatsappLink } from "@/lib/site";

export async function generateStaticParams() {
  return (await getPages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/pagina/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = (await getPages()).find((p) => p.slug === slug);
  return page ? { title: page.title, alternates: { canonical: `/pagina/${slug}` } } : {};
}

export default async function InstitutionalPage({ params }: PageProps<"/pagina/[slug]">) {
  const { slug } = await params;
  const page = (await getPages()).find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pt-12 md:px-8 md:pt-20">
      <h1 className="font-display text-5xl font-medium tracking-[-0.01em] md:text-6xl">{page.title}</h1>
      <div className="prose-store mt-10 text-[17px]" dangerouslySetInnerHTML={{ __html: page.html }} />
      <a
        href={whatsappLink(`Olá! Vim da página "${page.title}" no site.`)}
        className="mt-12 inline-block rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-ink transition hover:opacity-90 active:scale-[0.98]"
      >
        Falar no WhatsApp
      </a>
    </article>
  );
}
