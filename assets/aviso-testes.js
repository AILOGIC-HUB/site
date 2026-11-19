/* AI Logic Hub · faixa de aviso no topo do site (pedido do Alessandro em 18/11/2026; texto dele em 19/11/2026).
   Uma faixa no topo de todas as páginas. O texto pode quebrar em mais de uma linha: a altura real da faixa vira
   --aviso-h e, nas páginas com cabeçalho fixo (altura em data-header), o cabeçalho desce junto e o espaço entra em
   --header-h, para nada ficar escondido. Quem fecha não vê de novo durante a visita (sessionStorage).
   Para tirar do site: remover a tag deste script das páginas. */
(function () {
  var TITULO = 'Estamos preparando uma nova experiência imobiliária.';
  var MEIO = 'Nossa plataforma está em fase de desenvolvimento e, em breve, novos imóveis e funcionalidades estarão disponíveis.';
  var FIM = 'As imagens e informações atuais são demonstrativas.';
  var RESTO = MEIO + ' ' + FIM;
  var CHAVE = 'ail_aviso_testes_v2';
  var s = document.currentScript, raiz = document.documentElement;
  var hdr = s && s.getAttribute('data-header') ? parseInt(s.getAttribute('data-header'), 10) : 0;
  var fechado = false; try { fechado = sessionStorage.getItem(CHAVE) === '1'; } catch (_) {}
  if (fechado) return;
  var FONTE = 'Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif';
  var css = '.aviso-testes{position:fixed;top:0;left:0;right:0;z-index:56;box-sizing:border-box;min-height:34px;display:flex;align-items:center;justify-content:center;'
    + 'gap:10px;padding:8px 52px;background:#F5B83D;color:#1d1503;border-bottom:1px solid rgba(0,0,0,.14);font:400 12.5px/1.45 ' + FONTE + ';'
    + 'letter-spacing:.005em;text-align:center;-webkit-font-smoothing:antialiased}'
    + '.aviso-testes b{font-weight:700}.aviso-testes i{display:inline-block;width:7px;height:7px;margin:0 9px 0 0;border-radius:50%;background:#1d1503;opacity:.85;vertical-align:1px}'
    + '.aviso-testes p{margin:0;max-width:1180px}.aviso-testes br{display:none}@media (min-width:1100px){.aviso-testes br{display:inline}}'
    + '.aviso-testes button{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:30px;height:30px;display:grid;place-items:center;border:0;border-radius:6px;'
    + 'background:transparent;color:#1d1503;cursor:pointer;padding:0}.aviso-testes button:hover{background:rgba(0,0,0,.08)}'
    + '.aviso-testes button:focus-visible{outline:2px solid #1d1503;outline-offset:1px}'
    + '.aviso-testes svg{width:14px;height:14px;stroke:currentColor;stroke-width:2.2;fill:none;stroke-linecap:round}'
    + '@media (max-width:640px){.aviso-testes{justify-content:flex-start;text-align:left;padding:9px 46px 9px 16px;font-size:12px;line-height:1.42;text-wrap:pretty}'
    + '.aviso-testes i{margin-right:7px}.aviso-testes button{top:6px;transform:none}}'
    + 'html.com-aviso .site-header{top:var(--aviso-h,34px)}'
    + 'html.com-aviso:not(.aviso-hdr) body{padding-top:var(--aviso-h,34px)}'
    + '@media print{.aviso-testes{display:none}html.com-aviso .site-header{top:0}html.com-aviso:not(.aviso-hdr) body{padding-top:0}}';
  var st = document.createElement('style'); st.id = 'aviso-testes-css'; st.textContent = css; document.head.appendChild(st);
  raiz.classList.add('com-aviso');
  if (hdr) { raiz.classList.add('aviso-hdr'); st.textContent += 'html.com-aviso .site-header{height:' + hdr + 'px}'; }

  function altura(h) {
    h = Math.round(h * 100) / 100;   // altura exata: sem fresta entre a faixa e o cabeçalho
    raiz.style.setProperty('--aviso-h', h + 'px');
    if (hdr) raiz.style.setProperty('--header-h', (hdr + h) + 'px');
  }
  // antes de a faixa existir, reserva a altura estimada (largura do texto na tela) para o cabeçalho não pular
  (function estimar() {
    var w = window.innerWidth || raiz.clientWidth || 1280, mob = w <= 640, fs = mob ? 12 : 12.5, lh = mob ? 1.42 : 1.45;
    var livre = Math.max(160, Math.min(1180, w - (mob ? 62 : 104) - 17)), larg = (TITULO.length + RESTO.length + 1) * fs * 0.52;
    try { var cv = document.createElement('canvas').getContext('2d'); cv.font = '400 ' + fs + 'px ' + FONTE; larg = cv.measureText(TITULO + ' ' + RESTO).width * 1.04; } catch (_) {}
    var linhas = Math.max(1, Math.ceil(larg / livre));
    altura(Math.max(34, linhas * fs * lh + (mob ? 18 : 16) + 1));
  })();

  function fechar() {
    try { sessionStorage.setItem(CHAVE, '1'); } catch (_) {}
    var b = document.getElementById('avisoTestes'); if (b) b.remove();
    raiz.classList.remove('com-aviso', 'aviso-hdr'); raiz.style.removeProperty('--header-h'); raiz.style.removeProperty('--aviso-h');
  }
  function montar() {
    if (document.getElementById('avisoTestes') || !document.body) return;
    var d = document.createElement('div'); d.className = 'aviso-testes'; d.id = 'avisoTestes'; d.setAttribute('role', 'note');
    d.innerHTML = '<p><i aria-hidden="true"></i><b>' + TITULO + '</b> ' + MEIO + ' <br>' + FIM + '</p>'
      + '<button type="button" aria-label="Fechar o aviso"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    d.querySelector('button').addEventListener('click', fechar);
    document.body.insertBefore(d, document.body.firstChild);
    // altura real: mede agora, quando a fonte carregar e a cada mudança de tamanho
    var medir = function () { if (document.getElementById('avisoTestes')) altura(d.getBoundingClientRect().height); };
    medir();
    if (window.ResizeObserver) new ResizeObserver(medir).observe(d); else window.addEventListener('resize', medir);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
  }
  // monta assim que o body existir (antes do primeiro desenho, na maioria dos navegadores)
  if (document.body) montar();
  else if (window.MutationObserver) {
    var mo = new MutationObserver(function () { if (document.body) { mo.disconnect(); montar(); } });
    mo.observe(raiz, { childList: true });
    document.addEventListener('DOMContentLoaded', montar);
  } else document.addEventListener('DOMContentLoaded', montar);
})();
