/* AI Logic Hub · faixa "Site em período de testes" (pedido do Alessandro em 18/11/2026).
   Uma faixa fina no topo de todas as páginas. Nas páginas com cabeçalho fixo, o cabeçalho desce junto (o script
   recebe a altura do cabeçalho em data-header) e o espaço reservado entra em --header-h, para nada ficar escondido.
   Quem fecha não vê de novo durante a visita (sessionStorage). Para tirar do site: remover a tag deste script. */
(function () {
  var s = document.currentScript, H = 34, raiz = document.documentElement;
  var hdr = s && s.getAttribute('data-header') ? parseInt(s.getAttribute('data-header'), 10) : 0;
  var fechado = false; try { fechado = sessionStorage.getItem('ail_aviso_testes') === '1'; } catch (_) {}
  if (fechado) return;
  var css = '.aviso-testes{position:fixed;top:0;left:0;right:0;z-index:56;height:' + H + 'px;display:flex;align-items:center;justify-content:center;gap:9px;'
    + 'padding:0 46px;background:#F5B83D;color:#1d1503;border-bottom:1px solid rgba(0,0,0,.14);font:500 12.5px/1.2 Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;'
    + 'letter-spacing:.005em;text-align:center;-webkit-font-smoothing:antialiased}'
    + '.aviso-testes b{font-weight:700}.aviso-testes i{flex:none;width:7px;height:7px;border-radius:50%;background:#1d1503;opacity:.85}'
    + '.aviso-testes span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    + '.aviso-testes button{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:28px;height:28px;display:grid;place-items:center;border:0;border-radius:6px;'
    + 'background:transparent;color:#1d1503;cursor:pointer;padding:0}.aviso-testes button:hover{background:rgba(0,0,0,.08)}'
    + '.aviso-testes button:focus-visible{outline:2px solid #1d1503;outline-offset:1px}'
    + '.aviso-testes svg{width:14px;height:14px;stroke:currentColor;stroke-width:2.2;fill:none;stroke-linecap:round}'
    + '@media (max-width:640px){.aviso-testes .longo{display:none}}'
    + 'html.com-aviso .site-header{top:' + H + 'px}'
    + 'html.com-aviso:not(.aviso-hdr) body{padding-top:' + H + 'px}'
    + '@media print{.aviso-testes{display:none}}';
  var st = document.createElement('style'); st.id = 'aviso-testes-css'; st.textContent = css; document.head.appendChild(st);
  raiz.classList.add('com-aviso');
  if (hdr) {
    raiz.classList.add('aviso-hdr');
    raiz.style.setProperty('--header-h', (hdr + H) + 'px');
    st.textContent += 'html.com-aviso .site-header{height:' + hdr + 'px}';
  }
  function fechar() {
    try { sessionStorage.setItem('ail_aviso_testes', '1'); } catch (_) {}
    var b = document.getElementById('avisoTestes'); if (b) b.remove();
    raiz.classList.remove('com-aviso', 'aviso-hdr'); raiz.style.removeProperty('--header-h');
  }
  function montar() {
    if (document.getElementById('avisoTestes')) return;
    var d = document.createElement('div'); d.className = 'aviso-testes'; d.id = 'avisoTestes'; d.setAttribute('role', 'note');
    d.innerHTML = '<i aria-hidden="true"></i><span><b>Site em período de testes.</b><span class="longo"> Alguns imóveis e informações ainda podem mudar.</span></span>'
      + '<button type="button" aria-label="Fechar o aviso"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    d.querySelector('button').addEventListener('click', fechar);
    document.body.insertBefore(d, document.body.firstChild);
  }
  if (document.body) montar(); else document.addEventListener('DOMContentLoaded', montar);
})();
