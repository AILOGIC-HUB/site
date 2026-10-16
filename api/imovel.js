// GET /imovel/<id>: página lida pelas redes (Instagram, WhatsApp, Facebook...) para montar a prévia do link.
// Quem abre o link no navegador é levado direto ao site pelo vercel.json (/?imovel=<id>), sem passar por aqui;
// se alguém chegar aqui mesmo assim, o script abaixo leva ao site.
import { pickId, siteOrigin, findImovel, priceOf, specsOf, locOf } from './_lib/imoveis.js';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ESC[c]);

export default async function handler(req, res) {
  const id = pickId(req);
  const origin = siteOrigin(req);
  let found = null;
  try { found = await findImovel(id, origin); } catch (e) { console.error('prévia do imóvel', id, e); }

  const destino = id ? `/?imovel=${encodeURIComponent(id)}` : '/';
  let title = 'AI Logic Hub — Imóveis com curadoria';
  let desc = 'Poucos imóveis, todos visitados. Converse com o Sam e encontre o imóvel certo para você.';
  let image = origin + '/assets/og-image.jpg';
  let alt = 'AI Logic Hub: encontre o imóvel certo para você, com os botões Agendar visita e Falar com o Sam.';
  if (found) {
    const { item, exemplo } = found;
    const linha = [locOf(item), specsOf(item).join(' • '), priceOf(item)].filter(Boolean).join(' · ');
    title = `${item.titulo}${exemplo ? ' (exemplo)' : ''} · AI Logic Hub`;
    desc = exemplo ? `Imóvel de exemplo. ${linha}` : linha;
    image = `${origin}/imovel/${encodeURIComponent(id)}/foto.jpg`;
    alt = `${item.titulo}, ${linha}`;
  }
  const url = id ? `${origin}/imovel/${encodeURIComponent(id)}` : origin + '/';

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
<p><a href="${esc(destino)}">Ver ${found ? esc(found.item.titulo) : 'o site'} no AI Logic Hub</a></p>
<script>location.replace(${JSON.stringify(destino).replace(/</g, '\\u003c')});</script>
</body>
</html>`);
}
