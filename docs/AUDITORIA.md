# Auditoria do site atual (www.aromartrios.com.br)

Data: 06/10/2026. Método: navegação real com Chromium (desktop 1440px e celular 390px), análise de rede, console, HTML, sitemap e robots.txt.

**Plataforma atual:** Loja Integrada (VTEX), servida via CloudFront.

## Críticos

| # | Problema | Evidência | Impacto |
|---|---|---|---|
| 1 | **Domínio sem "www" não funciona em HTTPS** | `https://aromartrios.com.br` aponta para `54.232.92.235` e a conexão é recusada (reset). Só o `http://` redireciona. | É o erro de certificado que você viu. Quem digita o endereço sem "www" (ou clica num link antigo) recebe erro de segurança. |
| 2 | **Hero da home é um GIF de 3,9 MB (86 quadros)** | `banner/aromarts--sempre-present--4--rt0o5s7p0d.gif`, 2500x600 | Carregamento da home em 9,3 s no desktop. Péssimo para Google (LCP) e para conversão no celular. |
| 3 | **Link quebrado em todas as páginas** | `/promocoes` retorna **404** (está no menu/HTML de todo o site) | Erro visível para cliente e sinal negativo para SEO. |
| 4 | **Categorias bagunçadas** | Aromatizantes 500 ml/1 L estão na categoria "Home Spray"; difusores em "Aromatização\|Spray de Ambiente\|Difusor"; um difusor em "Frascos/Artesanal". Refil, Kits e Elétricos não têm nenhum produto como categoria principal. | Cliente clica em "Refil" e não acha refil. Filtros e navegação não fazem sentido. |
| 5 | **Informações contraditórias** | Banner: "Frete grátis para SP/RJ" vs. página de frete: grátis só acima de **R$ 480 (Sudeste)**. Banner: "Parcele em até 12x" vs. produto: "até 3x sem juros". Meta description: "desde 2006" vs. Quem Somos: "desde 2004". | Promessa que não se cumpre no checkout = abandono de carrinho e reclamação. |

## Importantes

- **Página "Marketing olfativo" com texto copiado de terceiros:** o conteúdo cita "Yasmin Esperanza, gerente de marketing da **Cheiro Bom**" e descreve os equipamentos dessa outra empresa como se fossem da loja. Risco jurídico e de SEO (conteúdo duplicado). No site novo a página redireciona para a seção de empresas da home, com texto próprio.

- **Sem dados estruturados (JSON-LD)** de produto: Google não mostra preço/estoque nos resultados. Só há microdata antigo.
- **H1 vazio na home** e **106 de 287 imagens sem texto alternativo** (acessibilidade e SEO de imagem).
- **Página "Serviços" vazia** (só o título).
- **Chat Tawk.to com erro** de CORS/WebSocket em todas as páginas + botão de WhatsApp: dois balões flutuantes disputando o canto da tela no celular, cobrindo produtos.
- **15 domínios de terceiros** por página (GA, Google Ads, Meta, TikTok, Ebit, Tawk, Fidelizar+...). Pixel do TikTok reclama de `content_id` ausente no carrinho (eventos de conversão quebrados).
- **Seção "Escolher por Marcas" vazia** na home e ícone do **Google+** (extinto em 2019) no rodapé.
- **Depoimentos genéricos** com avatar padrão e só primeiro nome: não passam confiança.
- **Marca inconsistente:** "AromartRios", "Aromart Rios" e "Aromarts" usados de forma aleatória em títulos, logo e textos. Erro de digitação em produto: "Terra PatchoulI".
- **Layout "pula" durante o carregamento** (barra de benefícios se sobrepõe antes do carrossel iniciar).
- **E-mail @gmail.com** como contato principal (passa menos credibilidade que um domínio próprio).

## O que foi feito na nova versão

| Problema | Solução no novo site (`storefront/`) |
|---|---|
| GIF de 3,9 MB | Fotos reais em WebP (catálogo inteiro: 4,5 MB em 217 imagens) + `next/image` responsivo |
| Categorias | Reclassificação automática por tipo real: **Difusores (11), Home Spray (16), Aromatizantes (29)**, mantendo as URLs antigas |
| URLs/SEO | Mesmas URLs de produto (`/difusor-emporio`) e coleção (`/difusores`, `/home-spray`, `/aromas`); redirecionamentos 301 para `.html`, `/refil`, `/kits`, `/promocoes` etc. |
| Dados estruturados | JSON-LD de `Product` (preço, estoque, SKU por variação) e `Organization`; sitemap e robots gerados |
| Informações contraditórias | Textos usam só o que é verificável (frete grátis a partir de R$ 480 no Sudeste, 3x sem juros) |
| Chat duplicado | Só WhatsApp, integrado ao produto e ao carrinho |
| Acessibilidade | H1 real, alt em todas as imagens, foco visível, "pular para o conteúdo", modo escuro, `prefers-reduced-motion` |

## Ainda depende de você

1. **Corrigir o domínio sem "www"** no painel DNS: apontar `aromartrios.com.br` para o mesmo destino do `www` (ou, ao migrar para Vercel/Shopify, adicionar os dois domínios lá; o certificado é emitido automaticamente).
2. Confirmar o ano de fundação (2004 ou 2006) e a política de parcelamento real.
3. Fotos de ambiente (lifestyle) e depoimentos reais (ex.: avaliações do Google) para substituir os genéricos.
4. Revisar o nome "Terra PatchoulI" e as descrições curtas dos home sprays (vários têm 1 foto só).
