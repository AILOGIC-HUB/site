// Imóveis para as prévias de link: a vitrine do Hub e, enquanto ela estiver vazia, os exemplos.
// As regras de selo, preço e medidas são as mesmas do card no index.html (tagOf, priceOf, specsOf).
import { DEMO } from './demo.js';

export const HUB = 'https://www.ailogichuboficial.com';
export const SITE = 'https://site-orpin-two-16.vercel.app'; // usado só se o cabeçalho Host vier inválido

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const NUM = new Intl.NumberFormat('pt-BR');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;

/** id vindo da URL (/imovel/<id>, ?id=<id>); só letras, números, ponto, hífen e sublinhado. */
export function pickId(req) {
  let raw = '';
  try {
    const u = new URL(req.url || '/', 'http://local');
    raw = (req.query && req.query.id) || u.searchParams.get('id') || (/\/imovel\/([^/?#]+)/.exec(u.pathname) || [])[1] || '';
    raw = decodeURIComponent(String(raw));
  } catch { return ''; }
  return /^[\w.-]{1,80}$/.test(raw) ? raw : '';
}

/** Endereço do próprio site (domínio da Vercel ou domínio próprio, o que a pessoa abriu). */
export function siteOrigin(req) {
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  if (!/^[a-z0-9.-]+(:\d{1,5})?$/i.test(host)) return SITE;
  return (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? 'http://' : 'https://') + host;
}

function normalize(raw) {
  const arr = Array.isArray(raw) ? raw : (raw && (raw.imoveis || raw.data || raw.items)) || [];
  const n = v => (v === null || v === undefined || v === '' ? 0 : Number(v) || 0);
  return arr.map((r, k) => {
    const fotos = Array.isArray(r.fotos) ? r.fotos.map(String).filter(Boolean) : [];
    const foto = String(r.foto || fotos[0] || '');
    return {
      id: String(r.id ?? r.codigo ?? k), codigo: String(r.codigo ?? r.id ?? ''),
      titulo: String(r.titulo || 'Imóvel'), tipo: String(r.tipo || ''),
      finalidade: ['venda', 'locacao', 'temporada'].includes(r.finalidade) ? r.finalidade : 'venda',
      preco: n(r.preco), area: n(r.area), quartos: n(r.quartos), suites: n(r.suites), banheiros: n(r.banheiros), vagas: n(r.vagas),
      bairro: String(r.bairro || ''), cidade: String(r.cidade || ''), descricao: String(r.descricao || ''),
      foto, fotos: fotos.length ? fotos : (foto ? [foto] : []),
      categorias: Array.isArray(r.categorias) ? r.categorias : undefined
    };
  });
}

// a vitrine fica guardada alguns minutos em cada instância da função
let cache = { at: 0, list: [] };
async function vitrineHub(origin) {
  if (Date.now() - cache.at < 5 * 60 * 1000) return cache.list;
  let list = [];
  try {
    const res = await fetch(HUB + '/api/vitrine', {
      headers: { Accept: 'application/json', Origin: origin },
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok && /json/.test(res.headers.get('content-type') || '')) list = normalize(await res.json());
  } catch { /* Hub fora do ar: segue com os exemplos */ }
  cache = { at: Date.now(), list };
  return list;
}

/** Mesma regra do site: com imóveis publicados no Hub, só eles valem; sem nenhum, valem os exemplos. */
export async function findImovel(id, origin) {
  if (!id) return null;
  const hub = await vitrineHub(origin);
  if (hub.length) {
    const item = hub.find(i => i.id === id);
    return item ? { item, exemplo: false } : null;
  }
  const item = DEMO.find(i => i.id === id);
  return item ? { item, exemplo: true } : null;
}

function catsOf(i) {
  const c = new Set(Array.isArray(i.categorias) ? i.categorias.map(norm) : []);
  const txt = norm(`${i.tipo} ${i.titulo} ${i.descricao}`);
  const lanc = /lancamento|na planta/.test(txt);
  if (i.finalidade === 'locacao' || i.finalidade === 'temporada') c.add('alugar');
  if (i.finalidade === 'venda') c.add('morar');
  if (lanc) { c.add('lancamentos'); c.add('investir'); }
  if (i.finalidade === 'venda' && (i.area && i.area <= 60 || /studio|sala|loja|renda/.test(txt))) c.add('investir');
  if ((i.finalidade === 'venda' && i.preco >= 4000000) || (i.finalidade !== 'venda' && i.preco >= 15000)) c.add('alto-padrao');
  return c;
}
export function tagOf(i) {
  const c = catsOf(i);
  if (c.has('lancamentos')) return 'Lançamento';
  if (i.finalidade === 'temporada') return 'Temporada';
  if (c.has('alugar')) return 'Para alugar';
  if (c.has('alto-padrao')) return 'Alto padrão';
  if (c.has('investir')) return 'Investimento';
  return 'À venda';
}
export function priceOf(i) {
  if (!i.preco) return 'Sob consulta';
  const s = BRL.format(i.preco);
  return i.finalidade === 'locacao' ? `${s}/mês` : i.finalidade === 'temporada' ? `${s}/diária` : s;
}
export function specsOf(i) {
  const out = [];
  if (i.area) out.push(`${NUM.format(i.area)} m²`);
  if (i.suites) out.push(plural(i.suites, 'suíte', 'suítes'));
  else if (i.quartos) out.push(plural(i.quartos, 'quarto', 'quartos'));
  if (i.vagas) out.push(plural(i.vagas, 'vaga', 'vagas'));
  return out;
}
export const locOf = i => [i.bairro, i.cidade].filter(Boolean).join(' • ');
export const photosOf = i => [...new Set([i.foto, ...(Array.isArray(i.fotos) ? i.fotos : [])].filter(Boolean))];
