// GET /imovel/<id>/foto.jpg (ou /api/og?id=<id>): imagem de prévia do imóvel, no visual do card da vitrine.
// Sem o imóvel, ou se algo falhar, devolve a prévia geral do site.
import { pickId, siteOrigin, findImovel } from './_lib/imoveis.js';

export default async function handler(req, res) {
  const id = pickId(req);
  const origin = siteOrigin(req);
  try {
    const found = await findImovel(id, origin);
    if (found) {
      // carregado aqui dentro: se faltar fonte ou biblioteca, cai na prévia geral em vez de dar erro
      const { renderCard } = await import('./_lib/card.js');
      const jpg = await renderCard(found);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
      res.end(Buffer.from(jpg));
      return;
    }
  } catch (e) {
    console.error('prévia do imóvel', id, e);
  }
  res.statusCode = 302;
  res.setHeader('Location', origin + '/assets/og-image.jpg');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.end();
}
