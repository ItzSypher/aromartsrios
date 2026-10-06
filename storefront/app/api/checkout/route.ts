import { NextResponse } from "next/server";
import { shopifyEnabled, shopifyProvider } from "@/lib/providers/shopify";
import { brl, whatsappLink } from "@/lib/site";
import type { CartLine } from "@/lib/types";

/**
 * Finaliza a compra.
 * - Com Shopify configurada: cria um Cart via Storefront API e devolve o checkout nativo
 *   (Pix, cartão, frete e estoque ficam todos na Shopify).
 * - Sem Shopify: monta o pedido e abre o WhatsApp da loja (fluxo que a loja já usa hoje).
 */
export async function POST(req: Request) {
  const { lines } = (await req.json()) as { lines: CartLine[] };
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
  }

  if (shopifyEnabled) {
    try {
      const url = await shopifyProvider.createCheckout(lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })));
      return NextResponse.json({ url, mode: "shopify" });
    } catch (e) {
      return NextResponse.json({ error: `Não foi possível iniciar o checkout: ${(e as Error).message}` }, { status: 502 });
    }
  }

  const total = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const text = [
    "Olá! Quero fazer este pedido pelo site:",
    "",
    ...lines.map((l) => `${l.quantity}x ${l.name}${l.variantTitle !== "Padrão" ? ` (${l.variantTitle})` : ""} - ${brl(l.price * l.quantity)}`),
    "",
    `Subtotal: ${brl(total)}`,
    "Meu CEP para o frete: ",
  ].join("\n");
  return NextResponse.json({ url: whatsappLink(text), mode: "whatsapp" });
}
