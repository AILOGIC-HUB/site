// AI Logic Hub · limite contra enxurrada nas funcoes do site (rodada 165 do Hub).
// As previas (imagem, pagina do imovel e da regiao) ficam no cache da CDN, mas cada endereco diferente (?id=...)
// passa direto e gera a imagem de novo (gasta processamento e busca a foto). Conta por IP, na memoria da instancia,
// sem banco: barra quem pede em rajada. Robos de previa (WhatsApp, Google) ficam bem abaixo do limite.
const MIN = 60000, janelas = new Map();
function ipDe(req) {
  const h = req.headers || {};
  return String(h['x-forwarded-for'] || h['x-real-ip'] || '').split(',')[0].trim() || (req.socket && req.socket.remoteAddress) || 'sem-ip';
}
// true quando ja respondeu 429
export function limitar(req, res, nome, porMinuto) {
  try {
    const agora = Date.now(), k = nome + ':' + ipDe(req);
    let j = janelas.get(k);
    if (!j || j.ate <= agora) { j = { n: 0, ate: agora + MIN }; janelas.set(k, j); }
    j.n++;
    if (janelas.size > 20000) { janelas.forEach((v, kk) => { if (v.ate <= agora) janelas.delete(kk); }); if (janelas.size > 20000) janelas.clear(); }
    if (j.n <= (porMinuto || 60)) return false;
    res.setHeader('Retry-After', String(Math.max(1, Math.ceil((j.ate - agora) / 1000))));
    res.setHeader('Cache-Control', 'no-store');
    res.statusCode = 429;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Muitas requisições em sequência. Aguarde um instante.');
    return true;
  } catch (_) { return false; }
}
