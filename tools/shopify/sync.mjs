#!/usr/bin/env node
/**
 * Sincroniza o catálogo (storefront/data/products.json) com uma loja Shopify.
 *
 * - Cria ou atualiza cada produto pelo handle (mesma URL da loja atual), com variantes,
 *   preços, preço "de", SKU, descrição, SEO e imagens (mutation `productSet`, idempotente).
 * - Cria coleções automáticas por tag com os mesmos slugs (/difusores, /aromas, ...).
 * - Publica os produtos em todos os canais (Loja virtual + Headless).
 *
 * Uso:
 *   SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com \
 *   SHOPIFY_ADMIN_TOKEN=shpat_xxx \
 *   node tools/shopify/sync.mjs [--dry-run] [--only handle1,handle2]
 *
 * O token vem de: Shopify Admin > Configurações > Apps > Desenvolver apps > criar app
 * com os escopos write_products, write_publications, read_publications.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_TOKEN;
const version = process.env.SHOPIFY_API_VERSION ?? "2026-07";
const dryRun = process.argv.includes("--dry-run");
const onlyArg = process.argv[process.argv.indexOf("--only") + 1];
const only = process.argv.includes("--only") ? new Set(onlyArg.split(",")) : null;
// Imagens locais não são acessíveis pela Shopify; usa as URLs públicas originais.
const imageBase = process.env.IMAGE_BASE_URL;

if (!dryRun && (!domain || !token)) {
  console.error("Defina SHOPIFY_STORE_DOMAIN e SHOPIFY_ADMIN_TOKEN (ou use --dry-run).");
  process.exit(1);
}

async function admin(query, variables = {}) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    const throttled = json.errors?.some?.((e) => e.extensions?.code === "THROTTLED");
    if ((res.status === 429 || throttled) && attempt < 5) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      continue;
    }
    if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? res.statusText));
    return json.data;
  }
}

function toProductSet(p) {
  const hasOptions = p.variants.length > 1 || p.variants[0].title !== "Padrão";
  const optionName = hasOptions ? p.option_name ?? "Tamanho" : "Title";
  const images = (imageBase && p.local_images?.length ? p.local_images.map((i) => imageBase + i) : p.images).slice(0, 10);
  return {
    handle: p.handle,
    title: p.name,
    descriptionHtml: p.description_html,
    vendor: p.vendor,
    productType: p.product_type,
    status: p.available ? "ACTIVE" : "DRAFT",
    tags: [p.collection, p.product_type],
    seo: { title: p.name, description: p.seo_description.slice(0, 320) },
    productOptions: [
      { name: optionName, values: p.variants.map((v) => ({ name: hasOptions ? v.title : "Default Title" })) },
    ],
    files: images.map((url, i) => ({ originalSource: url, contentType: "IMAGE", alt: `${p.name} - imagem ${i + 1}` })),
    variants: p.variants.map((v) => ({
      optionValues: [{ optionName, name: hasOptions ? v.title : "Default Title" }],
      price: v.price?.toFixed(2),
      compareAtPrice: v.compare_at_price ? v.compare_at_price.toFixed(2) : null,
      sku: v.sku || undefined,
      inventoryPolicy: "DENY",
    })),
  };
}

const PRODUCT_SET = /* GraphQL */ `
  mutation ($input: ProductSetInput!, $identifier: ProductSetIdentifiers) {
    productSet(synchronous: true, input: $input, identifier: $identifier) {
      product { id handle }
      userErrors { field message }
    }
  }
`;

async function ensureCollection(c) {
  const found = await admin(`query ($h: String!) { collectionByHandle(handle: $h) { id } }`, { h: c.handle });
  if (found.collectionByHandle) return found.collectionByHandle.id;
  const data = await admin(
    `mutation ($input: CollectionInput!) { collectionCreate(input: $input) { collection { id } userErrors { message } } }`,
    {
      input: {
        handle: c.handle,
        title: c.title,
        ruleSet: { appliedDisjunctively: false, rules: [{ column: "TAG", relation: "EQUALS", condition: c.handle }] },
      },
    },
  );
  const errs = data.collectionCreate.userErrors;
  if (errs.length) throw new Error(errs.map((e) => e.message).join("; "));
  return data.collectionCreate.collection.id;
}

async function publish(ids, publications) {
  for (const id of ids) {
    await admin(
      `mutation ($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { message } } }`,
      { id, input: publications.map((p) => ({ publicationId: p.id })) },
    );
  }
}

const catalog = JSON.parse(await readFile(path.join(root, "storefront/data/products.json"), "utf8"));
const products = catalog.products.filter((p) => !only || only.has(p.handle));
console.log(`${products.length} produtos para sincronizar com ${domain ?? "(dry-run)"}`);

if (dryRun) {
  console.log(JSON.stringify(toProductSet(products[0]), null, 2));
  process.exit(0);
}

const { publications } = await admin(`query { publications(first: 20) { nodes { id name } } }`);
console.log("Canais:", publications.nodes.map((p) => p.name).join(", "));

const ids = [];
let failed = 0;
for (const p of products) {
  try {
    const data = await admin(PRODUCT_SET, { input: toProductSet(p), identifier: { handle: p.handle } });
    const { product, userErrors } = data.productSet;
    if (userErrors.length) throw new Error(userErrors.map((e) => `${e.field}: ${e.message}`).join("; "));
    ids.push(product.id);
    console.log(`  ok  ${p.handle}`);
  } catch (e) {
    failed++;
    console.error(`  ERRO ${p.handle}: ${e.message}`);
  }
}

const collectionIds = [];
for (const c of catalog.collections) collectionIds.push(await ensureCollection(c));
await publish([...ids, ...collectionIds], publications.nodes);
console.log(`Concluído: ${ids.length} produtos, ${collectionIds.length} coleções, ${failed} erros.`);
