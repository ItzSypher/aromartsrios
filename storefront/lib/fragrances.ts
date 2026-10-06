/**
 * Pirâmide olfativa de cada fragrância, transcrita das descrições oficiais dos
 * produtos na loja atual (saída / coração / fundo). Não inventar notas aqui.
 */
export type Family = "frescas" | "florais" | "amadeiradas" | "gourmands";

export const families: { id: Family; label: string; text: string }[] = [
  { id: "frescas", label: "Frescas", text: "Cítricos e verdes. Recepções, academias e escritórios." },
  { id: "florais", label: "Florais", text: "Delicadas e acolhedoras. Clínicas, lojas e quartos." },
  { id: "amadeiradas", label: "Amadeiradas", text: "Presença e sofisticação. Lobbies, showrooms e salas." },
  { id: "gourmands", label: "Gourmands e especiadas", text: "Quentes e marcantes. Ambientes intimistas e varejo." },
];

export type FragranceInfo = {
  key: string;
  name: string;
  family: Family;
  mood: string;
  notes: { saida: string; coracao: string; fundo: string };
  signature?: boolean;
};

export const fragrances: FragranceInfo[] = [
  { key: "aromarts", name: "Aromarts", family: "florais", signature: true, mood: "A assinatura da casa. Floral fresco com fundo quente.", notes: { saida: "Frésia, néroli", coracao: "Lavanda, junípero", fundo: "Musgo, âmbar" } },
  { key: "emporio", name: "Empório", family: "frescas", mood: "Inspirada na leveza da brisa do mar.", notes: { saida: "Limão, lavanda, lima da Pérsia", coracao: "Jasmim, lírio, folhas de cedro", fundo: "Musk, bamboo, patchouli" } },
  { key: "wood", name: "Wood", family: "amadeiradas", mood: "Imponente, para ambientes elegantes.", notes: { saida: "Limão, lavanda", coracao: "Cedro, jasmim, patchouli", fundo: "Musk, ambergris" } },
  { key: "palo santo", name: "Palo Santo", family: "amadeiradas", mood: "Madeira sagrada: calma, purificação e equilíbrio.", notes: { saida: "Notas amadeiradas e terrosas", coracao: "Resinas aromáticas", fundo: "Musk, âmbar" } },
  { key: "cha branco", name: "Chá Branco", family: "frescas", mood: "Leve e refrescante para os dias quentes.", notes: { saida: "Lima, bergamota, lavanda, limão siciliano", coracao: "Violeta, jasmim, manjericão, lírio do vale", fundo: "Musk, vetiver" } },
  { key: "bamboo", name: "Bamboo", family: "frescas", mood: "Serenidade e bem-estar.", notes: { saida: "Bamboo, bergamota", coracao: "Jacinto, jasmim", fundo: "Musk, madeira aveludada" } },
  { key: "garden", name: "Garden", family: "florais", mood: "Romântica, inspirada na suavidade das flores.", notes: { saida: "Limão, lavanda, bergamota", coracao: "Peônia, jasmim, rosa", fundo: "Âmbar, musk, sândalo" } },
  { key: "lavanda francesa", name: "Lavanda Francesa", family: "florais", mood: "A elegância dos campos da Provence.", notes: { saida: "Lavanda, anis", coracao: "Notas florais e verdes", fundo: "Musk" } },
  { key: "black vanilla", name: "Black Vanilla", family: "gourmands", mood: "Cremosa, indulgente e aconchegante.", notes: { saida: "Anis, coco, bergamota", coracao: "Jasmim, leite", fundo: "Musk, baunilha" } },
  { key: "noir candle", name: "Noir Candle", family: "gourmands", mood: "Misteriosa e intimista.", notes: { saida: "Notas quentes e especiadas", coracao: "Acordes amadeirados e florais", fundo: "Âmbar, musk, madeiras nobres" } },
  { key: "alecrim", name: "Alecrim", family: "frescas", mood: "Ervas aromáticas e energia natural.", notes: { saida: "Lavanda, alecrim, laranja, limão", coracao: "Flores brancas, litsea cubeba, petit grain", fundo: "Madeiras nobres, musk, pau-rosa, cedro" } },
  { key: "monet", name: "Monet", family: "gourmands", mood: "Luxuosa e cativante, para marcar presença.", notes: { saida: "Tangerina sanguínea, canela", coracao: "Tabaco, mirra", fundo: "Patchouli, fava-tonka" } },
  { key: "paris", name: "Paris", family: "florais", mood: "Romântica e sofisticada.", notes: { saida: "Buquê floral delicado", coracao: "Rosa, jasmim", fundo: "Musk, madeiras finas" } },
  { key: "cereja avela", name: "Cereja e Avelã", family: "gourmands", mood: "Gourmand doce e acolhedora.", notes: { saida: "Cereja, limão, morango", coracao: "Avelã, jasmim, canela", fundo: "Âmbar, musk, baunilha" } },
  { key: "vibe", name: "Vibe", family: "frescas", mood: "Energia, frescor e leveza.", notes: { saida: "Limão, maçã verde", coracao: "Bambu, jasmim", fundo: "Musk, cedro" } },
  { key: "terra patchouli", name: "Terra", family: "amadeiradas", mood: "Profunda, terrosa e marcante.", notes: { saida: "Lima, laranja, pomelo", coracao: "Cravo, lavanda", fundo: "Couro, vetiver, sândalo, patchouli" } },
  { key: "mandarim", name: "Mandarim", family: "frescas", mood: "Cítrica e versátil para o dia a dia.", notes: { saida: "Mandarina, limão, sálvia", coracao: "Lavanda, alecrim, gerânio", fundo: "Musk, sândalo" } },
  { key: "natural", name: "Natural", family: "florais", mood: "Flores e frutas em harmonia.", notes: { saida: "Violeta, pêssego, flor de laranjeira", coracao: "Rosa, cravo, jasmim, ylang ylang", fundo: "Cedro, sândalo, baunilha, fava tonka" } },
  { key: "blue", name: "Blue", family: "amadeiradas", mood: "Vibrante, especiada e intensa.", notes: { saida: "Pimenta rosa, cítricos, menta, vetiver", coracao: "Jasmim, labdanum, grapefruit, cedro", fundo: "Gengibre, incenso, sândalo, patchouli" } },
  { key: "secret", name: "Secret", family: "gourmands", mood: "Intensa, complexa e misteriosa.", notes: { saida: "Lavanda, gerânio, acorde frutal", coracao: "Cravo, baunilha, cashmeran", fundo: "Cedro, sândalo, cumarina, vetiver" } },
  { key: "desejo", name: "Desejo", family: "amadeiradas", mood: "Relaxante e acolhedora.", notes: { saida: "Laranja, lavanda", coracao: "Conífera, patchouli", fundo: "Musk, sândalo" } },
  { key: "bossa", name: "Bossa", family: "frescas", mood: "Frescor e descontração.", notes: { saida: "Limão, verbena, lavanda, lima da Pérsia", coracao: "Notas verdes, lírio do vale", fundo: "Musk, cedro, patchouli" } },
];

/** Normaliza nomes de produto para casar com `key` ("Cereja com Avelã" -> "cereja avela"). */
export function fragranceKey(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s(com|e)\s/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
