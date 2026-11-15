// Imóveis para as prévias de link: a vitrine do Hub e, enquanto ela estiver vazia, os exemplos.
// As regras de selo, preço e medidas são as mesmas do card no index.html (tagOf, priceOf, specsOf).
import { DEMO } from './demo.js';

export const HUB = 'https://www.ailogichuboficial.com';
export const SITE = 'https://www.ailogichub.com.br'; // usado só se o cabeçalho Host vier inválido

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const NUM = new Intl.NumberFormat('pt-BR');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
export const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
const MINUSC = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);
/** Mesma regra do index.html: nome de lugar todo em maiúsculas ("FAZENDA ALVORADA") vira título ("Fazenda Alvorada"). */
export function lugar(v) {
  const t = String(v ?? '').replace(/\s+/g, ' ').trim();
  if (!t || !/\p{L}/u.test(t) || t !== t.toLocaleUpperCase('pt-BR')) return t;
  return t.toLocaleLowerCase('pt-BR').split(' ').map((w, k) => (k && MINUSC.has(w)) ? w : /^[ivx]{1,4}$/.test(w) ? w.toUpperCase()
    : w.split('-').map(p => p.charAt(0).toLocaleUpperCase('pt-BR') + p.slice(1)).join('-')).join(' ');
}
/** Endereço da região na URL (mesma regra do index.html): "Fazenda Alvorada" + "Porto Feliz" -> fazenda-alvorada-porto-feliz. */
export const slugDe = t => norm(t).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

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

/** slug da região vindo da URL (/regiao/<slug>, ?slug=<slug>); só letras minúsculas, números e hífen. */
export function pickSlug(req) {
  let raw = '';
  try {
    const u = new URL(req.url || '/', 'http://local');
    raw = (req.query && req.query.slug) || u.searchParams.get('slug') || (/\/regiao\/([^/?#]+)/.exec(u.pathname) || [])[1] || '';
  } catch { return ''; }
  return /^[a-z0-9-]{1,120}$/.test(String(raw)) ? String(raw) : '';
}

/** Endereço do próprio site (domínio da Vercel ou domínio próprio, o que a pessoa abriu). */
export function siteOrigin(req) {
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  if (!/^[a-z0-9.-]+(:\d{1,5})?$/i.test(host)) return SITE;
  return (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? 'http://' : 'https://') + host;
}

function normalize(raw) {
  const arr = Array.isArray(raw) ? raw : (raw && (raw.rows || raw.imoveis || raw.data || raw.items)) || [];   // o Hub responde { rows: [...] }
  const n = v => (v === null || v === undefined || v === '' ? 0 : Number(v) || 0);
  return arr.map((r, k) => {
    const fotos = Array.isArray(r.fotos) ? r.fotos.map(String).filter(Boolean) : [];
    const foto = String(r.foto || fotos[0] || '');
    return {
      id: String(r.id ?? r.codigo ?? k), codigo: String(r.codigo ?? r.id ?? ''),
      titulo: String(r.titulo || 'Imóvel'), tipo: String(r.tipo || ''),
      finalidade: ['venda', 'locacao', 'temporada'].includes(r.finalidade) ? r.finalidade : 'venda',
      preco: n(r.preco), area: n(r.area), quartos: n(r.quartos), suites: n(r.suites), banheiros: n(r.banheiros), vagas: n(r.vagas),
      bairro: lugar(r.bairro), cidade: lugar(r.cidade), descricao: String(r.descricao || ''),
      foto, fotos: fotos.length ? fotos : (foto ? [foto] : []), destaque: !!r.destaque,
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

/** Região (bairro, ou a cidade sem bairro) com os imóveis de lá; mesma regra das regiões do index.html. */
export async function findRegiao(slug, origin) {
  if (!slug) return null;
  const hub = await vitrineHub(origin);
  const lista = hub.length ? hub : DEMO.map(i => ({ ...i, bairro: lugar(i.bairro), cidade: lugar(i.cidade) }));
  const itens = lista.filter(i => (i.bairro || i.cidade) && slugDe(`${i.bairro || i.cidade} ${i.bairro ? i.cidade : ''}`) === slug);
  if (!itens.length) return null;
  const i0 = itens[0];
  const capa = itens.find(i => i.destaque && photosOf(i).length) || itens.find(i => photosOf(i).length) || i0;
  return { nome: i0.bairro || i0.cidade, cidade: i0.bairro ? i0.cidade : '', n: itens.length, capa, exemplo: !hub.length };
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
