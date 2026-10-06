# Aromart Rios: nova loja

Redesign da loja [aromartrios.com.br](https://www.aromartrios.com.br) com catálogo extraído da loja atual e pronto para sincronizar com a Shopify.

```
docs/AUDITORIA.md                    o que está errado no site atual (e o que foi corrigido)
tools/scraper/scrape.py              extrai produtos, variações, preços, fotos e páginas da Loja Integrada
tools/shopify/sync.mjs               envia o catálogo para a Shopify (Admin API), idempotente
exports/shopify_products_import.csv  alternativa sem código: Shopify > Produtos > Importar
storefront/                          novo site (Next.js 16 + Tailwind v4)
.claude/skills/                      skills de design instaladas (taste-skill)
```

## 1. Catálogo

```bash
pip install beautifulsoup4 pillow
python3 tools/scraper/scrape.py            # ~3 min; --no-images para só dados
```

Resultado atual: **56 produtos, 0 erros**, 3 coleções, 6 páginas institucionais, 217 fotos em WebP.

## 2. Site novo

```bash
cd storefront
npm install
npm run dev        # http://localhost:3000
```

Sem configuração, o site usa o catálogo exportado e o checkout abre o **WhatsApp** com o pedido montado (fluxo que a loja já usa).

## 3. Conectar à Shopify ("headless")

1. Crie a loja Shopify e importe os produtos, por um dos caminhos:
   - **Sem código:** Shopify Admin > Produtos > Importar > `exports/shopify_products_import.csv`
   - **Por script (recomendado, cria coleções e publica):**
     ```bash
     SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com SHOPIFY_ADMIN_TOKEN=shpat_... node tools/shopify/sync.mjs
     ```
     Token: Admin > Configurações > Apps > Desenvolver apps, escopos `write_products`, `read_publications`, `write_publications`.
2. Instale o canal **Headless** na Shopify e copie o token público da Storefront API.
3. Na Vercel (ou `storefront/.env.local`):
   ```
   SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
   NEXT_PUBLIC_SITE_URL=https://www.aromartrios.com.br
   ```
   A partir daí o site lê produtos, preços e estoque direto da Shopify e o botão "Finalizar compra" leva ao checkout da Shopify (Pix, cartão, frete).

## Design

Direção definida com a skill `design-taste-frontend`: redesign completo para e-commerce de fragrâncias (consumidor + B2B), paleta derivada da marca (oliva-grafite `#3f3d38` + sálvia `#dcdcb4`), Geist, modo claro/escuro automático, movimento sutil em CSS respeitando `prefers-reduced-motion`.
