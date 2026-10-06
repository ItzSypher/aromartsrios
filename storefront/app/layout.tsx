import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Preloader, preloaderScript } from "@/components/preloader";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Aromatização de ambientes para empresas | Aromart Rios", template: "%s | Aromart Rios" },
  description: site.description,
  openGraph: { type: "website", locale: "pt_BR", siteName: site.name },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#141512" },
  ],
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/brand/logo.png`,
  email: site.email,
  telephone: "+55 21 96406-6834",
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-[100dvh] flex-col">
        <Preloader />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-ink"
        >
          Pular para o conteúdo
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }}
        />
        <CartProvider>
          <SiteHeader />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
