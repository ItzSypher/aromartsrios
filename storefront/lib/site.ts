export const site = {
  name: "Aromart Rios",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aromartrios.com.br",
  description:
    "Aromatização de ambientes e marketing olfativo para empresas: lojas, hotéis, clínicas, academias e escritórios. Fragrâncias exclusivas e entrega em todo o Brasil.",
  whatsapp: "5521964066834",
  phone: "(21) 96406-6834",
  email: "contatoaromart@gmail.com",
  cnpj: "08.332.607/0001-80",
  social: [
    { label: "Instagram", href: "https://instagram.com/aromartrios" },
    { label: "Facebook", href: "https://facebook.com/aromart.rios" },
    { label: "Pinterest", href: "https://pinterest.com/contatoaromart" },
  ],
  nav: [
    { label: "Para empresas", href: "/#solucoes" },
    { label: "Fragrâncias", href: "/#fragrancias" },
    { label: "Difusores", href: "/difusores" },
    { label: "Home Spray", href: "/home-spray" },
    { label: "Aromatizantes", href: "/aromas" },
  ],
};

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
