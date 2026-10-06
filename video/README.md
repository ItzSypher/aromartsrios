# Vídeo story: site novo Aromart Rios

Remotion (React) em 1080x1920, 30 fps, ~29 s. Cenas em `src/scenes/`:

1. `Intro`: abertura com a mesma animação do preloader do site
2. `Hook`: "Nosso site está de casa nova." sobre a foto do aparelho Aromarts
3. `ScrollTour`: o site real rolando dentro do celular, com legendas por seção
4. `Features`: bento com as novidades (rapidez, notas olfativas, orçamento, Google)
5. `WhatsApp`: formulário enviado e pedido chegando pronto no WhatsApp
6. `CallToAction`: "Peça seu orçamento" + (21) 96406-6834 + aromartrios.com.br

As telas em `public/shots/` são capturas reais do site (celular, 2x).

```bash
npm install
npm run dev                         # Remotion Studio para editar e pré-visualizar
npx remotion render SiteNovoStory out/aromart-site-novo-story.mp4
```
