# AI Logic Hub — landing page

Um único `index.html` (HTML + CSS + JS inline, sem framework e sem build) + a pasta `assets/`.
Abre com duplo-clique. São cerca de 135 KB (36 KB com gzip), sem contar as imagens.

## Antes de publicar: coloque os assets reais

A página usa os arquivos da marca pelos nomes abaixo. Eles **não estão neste repositório**: copie-os para `assets/`.

| Arquivo | Onde aparece |
|---|---|
| `assets/logo-horizontal.png` (900×278, fundo transparente) | header e rodapé |
| `assets/sam-avatar.png` | header, botão flutuante, painel do Sam, chat |
| `assets/favicon.png`, `assets/apple-touch-icon.png` | aba do navegador / iOS |
| `assets/hero-1.webp` | primeiro slide do banner |
| `assets/hero-2.webp`, `hero-3.webp`, `hero-4.webp` | os 3 slides de imóveis em destaque |

Enquanto um arquivo não existe, a página não quebra:
- **hero-\*.webp**: cai para uma foto demo do Unsplash e, sem internet, para o gradiente azul→marinho da marca;
- **logo**: mostra o nome em texto (fallback provisório, não é o design final);
- **avatar do Sam**: mostra um "S" sobre o azul da marca.

## O que está pronto

- Banner de abertura em carrossel horizontal de tela cheia (início, 3 imóveis em destaque, Sam e Anunciar): as fotos passam para o lado com parallax e Ken Burns, o texto entra a cada slide, autoplay de 7 s com barra de progresso e pausa, setas no desktop, arrastar no celular, gesto lateral no trackpad e ← → no teclado. Links como "Anunciar" levam direto ao slide certo.
- Header que reage à rolagem, menu hambúrguer no mobile, botão flutuante do Sam.
- Coleção com filtros (Todos, Morar, Alugar, Investir, Alto padrão, Lançamentos + "Salvos" quando há favoritos), cards com zoom, favoritos e "Ver fotos".
- Modal de detalhe do imóvel (specs, descrição, **Agendar visita** via WhatsApp, Ver fotos, Perguntar ao Sam).
- Galeria 2D (sem 3D/WebGL): setas, contador, miniaturas, teclado ← →, swipe, fecha no ×, ESC ou clique fora.
- Números com contagem animada, "Como funciona" com linha de progresso, depoimentos em carrossel automático (pausa no hover/foco e botão de pausa), bairros que abrem o Sam já no contexto do bairro.
- Acessibilidade: `lang="pt-BR"`, `alt`, `aria-label` nos botões de ícone, `role="dialog"` com foco preso e ESC, alvos de toque ≥ 44 px, `prefers-reduced-motion`.
- Segurança: todo dado dinâmico passa por `esc()` antes de ir para o HTML, URLs de imagem passam por `safeUrl()`, nenhum `onclick` inline (delegação com `addEventListener`), e nada de PII no `localStorage` (só os IDs dos favoritos).

## O que é demonstração

- **Imóveis**: 9 imóveis demo no formato do `/api/vitrine`. Servida por http(s), a página tenta `GET /api/vitrine` e, se responder JSON, substitui os dados demo (grade, slides de destaque e galeria). Aceita um array ou `{imoveis|data|items: [...]}`.
- **Sam**: offline, segue um fluxo guiado (morar/investir/alugar → bairro → faixa de valor → indispensáveis → sugestões + WhatsApp). Servida por http(s), chama `POST /api/sam-web` com `{messages:[{role,content}]}` e espera `{reply, sugestoes}`. Se a API falhar, volta para o fluxo guiado.
- **Formulários de lead** (Anunciar imóvel / Ser parceiro): validam e mostram sucesso, mas não enviam nada. Para enviar, defina `CONFIG.leadUrl` no script (POST JSON).
- **Fotos de imóveis, bairros e depoimentos**: URLs do Unsplash, só ilustrativas.
- **Depoimentos e números** ("1.240 famílias", "97%"...): textos de exemplo. **Troque por dados reais e depoimentos autorizados** antes de publicar.
- **Links "Legal"** (Termos, Privacidade, Cookies): placeholders. Falta também o **número do CRECI** no rodapé.

## Produção

- Configure tudo no objeto `CONFIG`, no início do `<script>` principal (`whatsapp`, `vitrineUrl`, `samUrl`, `leadUrl`).
- A CSP hoje está em `report-only`; passe para **enforce** (cabeçalho `Content-Security-Policy`). Um ponto de partida para esta página:

  ```
  default-src 'self';
  script-src 'self' 'sha256-eFK9hDkDon/NPDG/wQvJ0DrtXVrwpsFTD7A06bWUWvs=' 'sha256-aGxhg2ItIJZASrUvabAIC2IBiV3yQaMr5ULT2KiTsXE=';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: https://images.unsplash.com;
  connect-src 'self';
  object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  ```

  Os dois hashes são dos `<script>` inline **desta versão**: qualquer edição no script muda o hash (ou mova o JS para um arquivo `.js` e use `'self'`). Acrescente em `img-src` o domínio onde ficam as fotos da vitrine.
- A fonte Inter é carregada de verdade pelo Google Fonts (400/500/600/700/800).
