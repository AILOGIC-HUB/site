// Monta a imagem de prévia (1200×630, JPG) no mesmo visual do card da vitrine.
import fs from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import jpeg from 'jpeg-js';
import { tagOf, priceOf, specsOf, locOf, photosOf } from './imoveis.js';

const W = 1200, H = 630;
const file = p => fs.readFileSync(new URL(p, import.meta.url));
const FONTS = [400, 500, 600, 700].map(weight => ({ name: 'Inter', weight, style: 'normal', data: file(`../_fonts/inter-latin-${weight}-normal.woff`) }));
const LOGO = 'data:image/png;base64,' + file('../../assets/logo-horizontal.png').toString('base64');

/* ícones do site (mesmos desenhos do sprite do index.html) */
const ICONS = {
  heart: [['path', { d: 'M12 20.5s-7.6-4.6-9.2-9.1C1.6 8.1 3.7 4.8 7 4.8c2 0 3.5 1.1 5 2.9 1.5-1.8 3-2.9 5-2.9 3.3 0 5.4 3.3 4.2 6.6-1.6 4.5-9.2 9.1-9.2 9.1z' }]],
  chat: [['path', { d: 'M20.5 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-4.4a8.5 8.5 0 1 1 15.6-4.6z' }]],
  forward: [['path', { d: 'M14 5l6 6-6 6' }], ['path', { d: 'M20 11h-8.5A6.5 6.5 0 0 0 5 17.5V19' }]],
  doc: [['rect', { x: 5, y: 3.5, width: 14, height: 17, rx: 2 }], ['path', { d: 'M12 3.5v17M9.5 12h.01M14.5 12h.01' }]],
  pin: [['path', { d: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11z' }], ['circle', { cx: 12, cy: 10, r: 2.3 }]],
  calendar: [['rect', { x: 3.5, y: 5, width: 17, height: 15.5, rx: 2 }], ['path', { d: 'M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2' }]],
  photos: [['rect', { x: 3, y: 6, width: 14, height: 13, rx: 2 }], ['path', { d: 'M7 3h11a3 3 0 0 1 3 3v10' }], ['path', { d: 'M3 16l4-4 3.5 3.5L13 13l4 4' }]]
};

// satori conta uma lista de um item como vários filhos; com um só, passa o filho direto
const el = (type, style, ...children) => {
  const list = children.flat().filter(c => c !== null && c !== false && c !== undefined);
  return { type, props: { style, children: list.length === 1 ? list[0] : list } };
};
const icon = (name, size, extra = {}) => ({
  type: 'svg',
  props: {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: '#fff', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { flexShrink: 0, ...extra },
    children: ICONS[name].map(([t, p]) => ({ type: t, props: p }))
  }
});

/* Foto do imóvel como data URI. Satori lê JPG e PNG; WebP não. As fotos do banner (assets/hero-N.webp)
   têm cópia em JPG em api/_img; fotos de fora são baixadas (Unsplash já vem em JPG). */
async function photoData(item) {
  for (const src of photosOf(item)) {
    try {
      let buf;
      if (!/^https?:\/\//i.test(src)) {
        const base = /^(?:\.?\/)?assets\/([\w-]+)\.(?:webp|jpe?g|png)$/i.exec(src);
        if (!base) continue;
        buf = file(`../_img/${base[1]}.jpg`);
      } else {
        const u = new URL(src);
        if (u.protocol !== 'https:') continue;
        if (u.hostname === 'images.unsplash.com') {
          u.searchParams.delete('auto');
          u.searchParams.set('fm', 'jpg'); u.searchParams.set('w', '1400'); u.searchParams.set('q', '72');
        }
        const res = await fetch(u, { headers: { Accept: 'image/jpeg,image/png;q=0.9' }, signal: AbortSignal.timeout(5000) });
        if (!res.ok || Number(res.headers.get('content-length') || 0) > 10e6) continue;
        buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 10e6) continue;
      }
      if (buf[0] === 0xff && buf[1] === 0xd8) return 'data:image/jpeg;base64,' + buf.toString('base64');
      if (buf[0] === 0x89 && buf[1] === 0x50) return 'data:image/png;base64,' + buf.toString('base64');
    } catch { /* tenta a próxima foto */ }
  }
  return '';
}

export async function renderCard({ item, exemplo }) {
  const foto = await photoData(item);
  const fotos = (Array.isArray(item.fotos) && item.fotos.length ? item.fotos : [item.foto]).filter(Boolean).length;
  const tag = `${tagOf(item)}${exemplo ? ' · Exemplo' : ''}`.toLocaleUpperCase('pt-BR');
  const specs = specsOf(item).join(' • ');
  const loc = locOf(item);
  const one = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
  const pill = { display: 'flex', alignItems: 'center', height: 48, padding: '0 20px', border: '1.5px solid rgba(255,255,255,0.16)', borderRadius: 999, backgroundColor: 'rgba(6,19,38,0.74)', color: '#fff' };
  const act = (name, label) => el('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 124, gap: 6, fontSize: 17, fontWeight: 500, lineHeight: 1.15, textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.75)' },
    icon(name, 40), ...label.map(l => el('div', {}, l)));

  const tree = el('div', {
    display: 'flex', width: W, height: H, fontFamily: 'Inter', color: '#fff', backgroundColor: '#061326',
    backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(15,139,255,0.30), rgba(15,139,255,0) 55%)'
  },
    el('div', {
      display: 'flex', position: 'absolute', left: 24, top: 24, width: W - 48, height: H - 48,
      borderRadius: 30, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.16)',
      backgroundColor: '#0b1727', ...(foto ? {} : { backgroundImage: 'linear-gradient(135deg, #0F8BFF 0%, #0b2a52 45%, #061326 100%)' })
    },
      foto ? { type: 'img', props: { src: foto, width: W - 48, height: H - 48, style: { position: 'absolute', left: 0, top: 0, width: W - 48, height: H - 48, objectFit: 'cover' } } } : null,
      el('div', {
        display: 'flex', position: 'absolute', left: 0, top: 0, width: W - 48, height: H - 48,
        backgroundImage: 'linear-gradient(270deg, rgba(6,19,38,0.5) 0%, rgba(6,19,38,0) 16%), linear-gradient(90deg, rgba(6,19,38,0.55) 0%, rgba(6,19,38,0.2) 45%, rgba(6,19,38,0) 68%), linear-gradient(180deg, rgba(6,19,38,0.5) 0%, rgba(6,19,38,0) 24%, rgba(6,19,38,0.08) 40%, rgba(6,19,38,0.78) 66%, rgba(6,19,38,0.96) 100%)'
      }),
      // selos
      el('div', { display: 'flex', position: 'absolute', left: 30, top: 30, gap: 10 },
        el('div', { ...pill, fontSize: 16, fontWeight: 600, letterSpacing: 2 }, tag),
        el('div', { ...pill, gap: 9, fontSize: 19, fontWeight: 500 }, icon('photos', 22), String(fotos))
      ),
      // ações na lateral
      el('div', { display: 'flex', flexDirection: 'column', position: 'absolute', right: 16, top: 22, gap: 14 },
        act('heart', ['Salvar']), act('chat', ['Perguntar', 'ao Sam']), act('forward', ['Compartilhar']), act('doc', ['Detalhes'])
      ),
      // informações
      el('div', { display: 'flex', flexDirection: 'column', position: 'absolute', left: 36, bottom: 34, width: 820 },
        loc ? el('div', { display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, color: 'rgba(255,255,255,0.9)', marginBottom: 6 }, icon('pin', 25), el('div', { ...one, maxWidth: 780 }, loc)) : null,
        el('div', { ...one, fontSize: 58, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.6 }, item.titulo),
        specs ? el('div', { ...one, fontSize: 24, color: 'rgba(255,255,255,0.88)', marginTop: 8 }, specs) : null,
        el('div', { fontSize: 44, fontWeight: 700, letterSpacing: -1, marginTop: 6 }, priceOf(item)),
        el('div', { display: 'flex', gap: 14, marginTop: 18 },
          el('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, width: 300, height: 66, borderRadius: 16, border: '1.5px solid rgba(255,255,255,0.6)', backgroundColor: 'rgba(6,19,38,0.4)', fontSize: 23, fontWeight: 500 }, icon('calendar', 26), 'Agendar visita'),
          el('div', { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 300, height: 66, borderRadius: 16, backgroundColor: '#0F8BFF', fontSize: 23, fontWeight: 500 }, 'Fazer proposta')
        )
      ),
      // marca
      { type: 'img', props: { src: LOGO, width: 152, height: 47, style: { position: 'absolute', right: 30, bottom: 36 } } }
    )
  );

  const svg = await satori(tree, { width: W, height: H, fonts: FONTS });
  const img = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render();
  return jpeg.encode({ data: img.pixels, width: img.width, height: img.height }, 84).data;
}
