// GET /regiao/<slug>: página lida pelas redes (WhatsApp, Instagram, Facebook...) para montar a prévia do link da região.
// GET /regiao/<slug>/foto.jpg: a imagem dessa prévia (foto de um imóvel de lá, nome da região e quantos imóveis tem).
// Quem abre o link no navegador é levado direto ao site pelo vercel.json (/?regiao=<slug>), sem passar por aqui;
// se alguém chegar aqui mesmo assim, o script abaixo leva ao site.
import { limitar } from './_lib/limite.js';
import { pickSlug, siteOrigin, findRegiao, plural } from './_lib/imoveis.js';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ESC[c]);

export default async function handler(req, res) {
  if (limitar(req, res, 'regiao', 120)) return;   // rodada 165 do Hub: barra rajada de pedidos
  const slug = pickSlug(req);
  const origin = siteOrigin(req);
  const querFoto = (req.query && String(req.query.foto) === '1') || /\/foto\.jpg$/.test(String(req.url || '').split('?')[0]);
  let found = null;
  try { found = await findRegiao(slug, origin); } catch (e) { console.error('prévia da região', slug, e); }

  if (querFoto) {
    try {
      if (found) {
        // carregado aqui dentro: se faltar fonte ou biblioteca, cai na prévia geral em vez de dar erro
        const { renderRegiao } = await import('./_lib/card.js');
        const jpg = await renderRegiao(found);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=604800');
        res.end(Buffer.from(jpg));
        return;
      }
    } catch (e) { console.error('imagem da região', slug, e); }
    res.statusCode = 302;
    res.setHeader('Location', origin + '/assets/og-image.jpg');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    res.end();
    return;
  }

  const destino = slug ? `/?regiao=${encodeURIComponent(slug)}` : '/';
  let title = 'AI Logic Hub — Imóveis com curadoria';
  let desc = 'Poucos imóveis, todos visitados. Converse com o Sam e encontre o imóvel certo para você.';
  let image = origin + '/assets/og-image.jpg';
  let alt = 'AI Logic Hub: encontre o imóvel certo para você, com os botões Agendar visita e Falar com o Sam.';
  if (found) {
    const onde = [found.cidade, plural(found.n, 'imóvel', 'imóveis')].filter(Boolean).join(' · ');
    title = `Imóveis em ${found.nome}${found.exemplo ? ' (exemplo)' : ''} · AI Logic Hub`;
    desc = `${found.exemplo ? 'Região de exemplo. ' : ''}${onde}. Escolhidos a dedo pelo AI Logic Hub. Converse com o Sam e agende sua visita.`;
    image = `${origin}/regiao/${encodeURIComponent(slug)}/foto.jpg`;
    alt = `Imóveis em ${found.nome}, ${onde}`;
  }
  const url = slug ? `${origin}/regiao/${encodeURIComponent(slug)}` : origin + '/';

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AI Logic Hub">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:secure_url" content="${esc(image)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${esc(image)}">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#061326;color:#f4f7fa;font:16px/1.5 system-ui,sans-serif}a{color:#4CC6FF}</style>
</head>
<body>
<p><a href="${esc(destino)}">Ver ${found ? `os imóveis em ${esc(found.nome)}` : 'o site'} no AI Logic Hub</a></p>
<script>location.replace(${JSON.stringify(destino).replace(/</g, '\\u003c')});</script>
</body>
</html>`);
}
