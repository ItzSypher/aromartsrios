#!/usr/bin/env python3
"""
Extrai o catálogo público da loja Aromart Rios (Loja Integrada / VTEX).

Uso:
    python3 tools/scraper/scrape.py                  # catálogo + imagens otimizadas
    python3 tools/scraper/scrape.py --no-images      # só os dados
    python3 tools/scraper/scrape.py --delay 3        # intervalo entre requisições (s)

Saídas:
    storefront/data/products.json              catálogo normalizado (usado pela nova vitrine)
    storefront/data/pages.json                 páginas institucionais (quem somos, trocas...)
    storefront/public/products/<handle>-<n>.webp  imagens otimizadas (1200px)
    exports/shopify_products_import.csv        pronto para Shopify > Produtos > Importar

Fonte de verdade: sitemap público /sitemap/product-1.xml + páginas de produto
(microdata schema.org + variáveis JS `variacoes`/`produto_grades_imagens`).
Respeita robots.txt (só acessa caminhos permitidos).
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import time
import urllib.request
from pathlib import Path
from xml.etree import ElementTree

from bs4 import BeautifulSoup

BASE = "https://www.aromartrios.com.br"
ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "storefront" / "data"
IMAGES = ROOT / "storefront" / "public" / "products"
EXPORTS = ROOT / "exports"
UA = "Mozilla/5.0 (compatible; AromartCatalogExport/1.0; +https://www.aromartrios.com.br)"

# Na Loja Integrada a categoria principal está inconsistente (aromatizantes em
# "Home Spray", difusores em "Aromatização|Spray...", etc.). Classificamos pelo
# nome do produto e usamos os MESMOS slugs de URL atuais (/difusores, /home-spray,
# /aromas) para não perder posicionamento no Google.
COLLECTIONS = [
    # (regex no nome, tipo de produto, slug da coleção, título da coleção)
    (r"^difusor", "Difusor de Varetas", "difusores", "Difusores"),
    (r"home spray|spray aromatizador", "Home Spray", "home-spray", "Home Spray"),
    (r"^aromatizante", "Aromatizante", "aromas", "Aromatizantes"),
]


def classify(name: str) -> tuple[str, str, str]:
    for pattern, ptype, handle, title in COLLECTIONS:
        if re.search(pattern, name, re.I):
            return ptype, handle, title
    return "Aromatização", "outros", "Outros"


def fetch(url: str, binary: bool = False, retries: int = 3):
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "pt-BR"})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
                return data if binary else data.decode("utf-8", "replace")
        except Exception as e:  # noqa: BLE001 - rede instável: tenta de novo
            last = e
            time.sleep(2 ** (attempt + 1))
    raise RuntimeError(f"falha ao baixar {url}: {last}")


def product_urls() -> list[str]:
    xml = fetch(f"{BASE}/sitemap/product-1.xml")
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return [loc.text.strip() for loc in ElementTree.fromstring(xml.encode()).findall(".//s:loc", ns)]


def money(text: str | None) -> float | None:
    if not text:
        return None
    m = re.search(r"(\d{1,3}(?:\.\d{3})*,\d{2})", text)
    return float(m.group(1).replace(".", "").replace(",", ".")) if m else None


def clean_html(node) -> str:
    """Remove estilos inline (font-size etc.) e mantém só a estrutura semântica."""
    if node is None:
        return ""
    node = BeautifulSoup(node.decode_contents(), "html.parser")
    for tag in node.find_all(True):
        tag.attrs = {k: v for k, v in tag.attrs.items() if k == "href"}
    for tag in node.find_all(["span", "font"]):
        tag.unwrap()
    for tag in node.find_all("div"):
        tag.name = "p"
    for tag in node.find_all("p"):
        if not tag.get_text(strip=True) and not tag.find("img"):
            tag.decompose()
    return re.sub(r"\n\s*\n+", "\n", str(node)).strip()


def parse_js(html: str, name: str):
    m = re.search(rf"var {name}\s*=\s*(.*?);\n", html)
    if not m:
        return None
    raw = m.group(1).strip()
    if raw in ("undefined", "null"):
        return None
    raw = re.sub(r"([{,]\s*)(\d+)\s*:", r'\1"\2":', raw)  # chaves numéricas -> JSON
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


def slug_of(url: str) -> str:
    return url.rstrip("/").rsplit("/", 1)[-1].strip("-")


def parse_product(url: str, html: str) -> dict:
    s = BeautifulSoup(html, "html.parser")
    main = s.select_one('[itemtype="http://schema.org/Product"]')

    def own(sel):
        """itemprops do produto principal (ignora 'isRelatedTo')."""
        return [el for el in main.select(sel) if not el.find_parent(attrs={"itemprop": "isRelatedTo"})]

    name = s.select_one("h1.nome-produto").get_text(strip=True)
    sku_el = own('[itemprop="sku"]')
    sku = sku_el[0].get_text(strip=True) if sku_el else ""
    breadcrumb = [a.get_text(strip=True) for a in s.select(".breadcrumbs a")][1:]

    images = []
    for el in s.select("[data-imagem-grande]"):
        src = el["data-imagem-grande"]
        if src not in [i["src"] for i in images]:
            images.append({"id": el.get("data-imagem-id"), "src": src})
    if not images:
        og = s.select_one('meta[property="og:image"]')
        if og:
            images.append({"id": None, "src": og["content"].replace("/800x800/", "/2500x2500/")})

    desc_node = s.select_one("#descricao")
    description_html = clean_html(desc_node)
    meta_desc = s.select_one('meta[name="description"]')

    variants = []
    variacoes = parse_js(html, "variacoes") or []
    var_imgs = parse_js(html, "produto_grades_imagens") or {}
    img_by_id = {i["id"]: i["src"] for i in images}
    option_name = None
    for pair in variacoes:
        for child_id, var_ids in pair.items():
            box = s.select_one(f'.acoes-produto[data-produto-id="{child_id}"]')
            labels = []
            for vid in var_ids:
                a = s.select_one(f'a.atributo-item[data-variacao-id="{vid}"]')
                if a:
                    option_name = a.get("data-grade-nome")
                    labels.append(a.get("data-variacao-nome"))
            v_sku = ""
            if box:
                m = re.search(r"SKU-(\S+)", " ".join(box.get("class", [])))
                v_sku = m.group(1) if m else ""
            prices = box.select_one(".preco-produto") if box else None
            old = money(prices.select_one(".preco-venda").get_text()) if prices and prices.select_one(".preco-venda") else None
            now = money(prices.select_one(".preco-promocional").get_text()) if prices and prices.select_one(".preco-promocional") else None
            if now is None and old is not None:
                now, old = old, None
            in_stock = bool(box and "disponivel" in box.get("class", []))
            first_img = next((img_by_id.get(str(i)) for vid in var_ids for i in var_imgs.get(str(vid), []) if img_by_id.get(str(i))), None)
            variants.append({
                "id": child_id,
                "sku": v_sku,
                "title": " / ".join(labels) or "Padrão",
                "price": now,
                "compare_at_price": old,
                "available": in_stock,
                "image": first_img,
            })

    if not variants:
        box = s.select_one(".acoes-produto")
        price_el = own('[itemprop="price"]')
        now = float(price_el[0]["content"]) if price_el else None
        old = None
        if box and box.select_one(".preco-venda") and box.select_one(".preco-promocional"):
            old = money(box.select_one(".preco-venda").get_text())
            promo = money(box.select_one(".preco-promocional").get_text())
            now = promo or now
        avail = own('[itemprop="availability"]')
        variants.append({
            "id": re.search(r"var PRODUTO_ID = '(\d+)'", html).group(1),
            "sku": sku,
            "title": "Padrão",
            "price": now,
            "compare_at_price": old if old and now and old > now else None,
            "available": bool(avail and "InStock" in avail[0].get("content", "")),
            "image": None,
        })

    ptype, collection, collection_title = classify(name)
    prices = [v["price"] for v in variants if v["price"] is not None]
    return {
        "id": re.search(r"var PRODUTO_ID = '(\d+)'", html).group(1),
        "handle": slug_of(url),
        "url": url,
        "name": name,
        "sku": sku,
        "vendor": "Aromart Rios",
        "category_path": breadcrumb,
        "product_type": ptype,
        "collection": collection,
        "collection_title": collection_title,
        "option_name": option_name,
        "price_min": min(prices) if prices else None,
        "price_max": max(prices) if prices else None,
        "available": any(v["available"] for v in variants),
        "seo_description": (meta_desc["content"].strip() if meta_desc else "")[:320],
        "description_html": description_html,
        "images": [i["src"] for i in images],
        "variants": variants,
    }


def write_shopify_csv(products: list[dict], path: Path) -> None:
    """Formato oficial de importação de produtos da Shopify."""
    cols = [
        "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published",
        "Option1 Name", "Option1 Value", "Variant SKU", "Variant Grams", "Variant Inventory Tracker",
        "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price",
        "Variant Requires Shipping", "Variant Taxable", "Image Src", "Image Position", "Image Alt Text",
        "Variant Image", "SEO Title", "SEO Description", "Status",
    ]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for p in products:
            has_opts = len(p["variants"]) > 1 or p["variants"][0]["title"] != "Padrão"
            tags = ", ".join(dict.fromkeys([p["collection"], p["product_type"]]))
            rows = max(len(p["variants"]), len(p["images"]))
            for i in range(rows):
                v = p["variants"][i] if i < len(p["variants"]) else None
                row = {"Handle": p["handle"]}
                if i == 0:
                    row.update({
                        "Title": p["name"], "Body (HTML)": p["description_html"], "Vendor": p["vendor"],
                        "Product Category": "Home & Garden > Decor > Home Fragrances",
                        "Type": p["product_type"], "Tags": tags, "Published": "TRUE",
                        "Option1 Name": (p["option_name"] or "Tamanho") if has_opts else "Title",
                        "SEO Title": p["name"], "SEO Description": p["seo_description"][:320],
                        "Status": "active" if p["available"] else "draft",
                    })
                if v:
                    row.update({
                        "Option1 Value": v["title"] if has_opts else "Default Title",
                        "Variant SKU": v["sku"], "Variant Grams": "",
                        "Variant Inventory Tracker": "shopify", "Variant Inventory Policy": "deny",
                        "Variant Fulfillment Service": "manual",
                        "Variant Price": f'{v["price"]:.2f}' if v["price"] is not None else "",
                        "Variant Compare At Price": f'{v["compare_at_price"]:.2f}' if v["compare_at_price"] else "",
                        "Variant Requires Shipping": "TRUE", "Variant Taxable": "TRUE",
                        "Variant Image": v["image"] or "",
                    })
                if i < len(p["images"]):
                    row.update({"Image Src": p["images"][i], "Image Position": i + 1,
                                "Image Alt Text": f'{p["name"]} - imagem {i + 1}'})
                w.writerow(row)


def download_images(products: list[dict], delay: float) -> None:
    from PIL import Image  # import tardio: só necessário com imagens

    out = IMAGES
    out.mkdir(parents=True, exist_ok=True)
    for p in products:
        local = []
        for n, src in enumerate(p["images"][:6], start=1):
            dest = out / f'{p["handle"]}-{n}.webp'
            if not dest.exists():
                raw = fetch(src.replace("/2500x2500/", "/1200x1200/"), binary=True)
                im = Image.open(io.BytesIO(raw))
                im = im.convert("RGBA") if im.mode in ("P", "LA") else im
                if im.mode == "RGBA":
                    bg = Image.new("RGB", im.size, (255, 255, 255))
                    bg.paste(im, mask=im.split()[-1])
                    im = bg
                im = im.convert("RGB")
                im.thumbnail((1200, 1200))
                im.save(dest, "WEBP", quality=80, method=6)
                time.sleep(delay / 4)
            local.append(f"/products/{dest.name}")
        p["local_images"] = local
        print(f'  img {p["handle"]}: {len(local)}', file=sys.stderr)


def scrape_pages() -> list[dict]:
    xml = fetch(f"{BASE}/sitemap/sitemap-custom-1.xml")
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    pages = []
    for loc in ElementTree.fromstring(xml.encode()).findall(".//s:loc", ns):
        url = loc.text.strip()
        s = BeautifulSoup(fetch(url), "html.parser")
        h1 = s.select_one("h1")
        body = h1.parent if h1 else s.select_one(".conteudo")
        title = h1.get_text(strip=True).capitalize() if h1 else ""
        if h1:
            h1.decompose()
        pages.append({
            "slug": slug_of(url).removesuffix(".html"),
            "url": url,
            "title": title,
            "html": clean_html(body),
        })
        time.sleep(1)
    return pages


def collections_of(products: list[dict]) -> list[dict]:
    seen: dict[str, dict] = {}
    for p in products:
        c = seen.setdefault(p["collection"], {
            "handle": p["collection"], "title": p["collection_title"], "count": 0})
        c["count"] += 1
    order = [c[2] for c in COLLECTIONS]
    return sorted(seen.values(), key=lambda c: order.index(c["handle"]) if c["handle"] in order else 99)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--delay", type=float, default=2.0)
    ap.add_argument("--no-images", action="store_true")
    args = ap.parse_args()

    DATA.mkdir(parents=True, exist_ok=True)
    EXPORTS.mkdir(exist_ok=True)
    urls = product_urls()
    print(f"{len(urls)} produtos no sitemap", file=sys.stderr)
    products, errors = [], []
    for i, url in enumerate(urls, 1):
        try:
            p = parse_product(url, fetch(url))
            products.append(p)
            print(f"[{i}/{len(urls)}] {p['name']} — R$ {p['price_min']} ({len(p['variants'])} var, {len(p['images'])} img)", file=sys.stderr)
        except Exception as e:  # noqa: BLE001
            errors.append({"url": url, "error": str(e)})
            print(f"[{i}/{len(urls)}] ERRO {url}: {e}", file=sys.stderr)
        time.sleep(args.delay)

    if not args.no_images:
        download_images(products, args.delay)

    products.sort(key=lambda p: (p["collection"], p["name"]))
    (DATA / "products.json").write_text(json.dumps(
        {"source": BASE, "scraped_at": time.strftime("%Y-%m-%d"), "count": len(products),
         "errors": errors, "collections": collections_of(products), "products": products},
        ensure_ascii=False, indent=2), encoding="utf-8")
    (DATA / "pages.json").write_text(json.dumps(scrape_pages(), ensure_ascii=False, indent=2), encoding="utf-8")
    write_shopify_csv(products, EXPORTS / "shopify_products_import.csv")
    print(f"OK: {len(products)} produtos, {len(errors)} erros -> {DATA}", file=sys.stderr)


if __name__ == "__main__":
    main()
