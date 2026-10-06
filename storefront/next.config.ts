import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "cdn.awsli.com.br" },
    ],
  },
  // Redirecionamentos 301 das URLs da Loja Integrada para as novas (preserva SEO)
  async redirects() {
    return [
      { source: "/pagina/:slug.html", destination: "/pagina/:slug", permanent: true },
      { source: "/marca/:slug.html", destination: "/aromas", permanent: true },
      { source: "/carrinho/:path*", destination: "/", permanent: false },
      { source: "/conta/:path*", destination: "/", permanent: false },
      { source: "/checkout", destination: "/", permanent: false },
      { source: "/promocoes", destination: "/aromas", permanent: true },
      // Categorias antigas sem produtos próprios ou com classificação inconsistente
      { source: "/refil", destination: "/aromas", permanent: true },
      { source: "/kits", destination: "/aromas", permanent: true },
      { source: "/frascos", destination: "/difusores", permanent: true },
      { source: "/eletricos", destination: "/difusores", permanent: true },
      { source: "/aromatiza-o-spray-de-ambiente-difusor", destination: "/difusores", permanent: true },
      { source: "/pagina/servicos", destination: "/pagina/aromatizacao-de-ambientes-corporativos", permanent: true },
    ];
  },
};

export default nextConfig;
