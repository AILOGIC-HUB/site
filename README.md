# AI Logic Hub — landing page

Um único `index.html` (HTML + CSS + JS inline, sem framework e sem build) + a pasta `assets/`.
Abre com duplo-clique. A pasta `api/` (com `package.json` e `vercel.json`) só gera a prévia de cada imóvel nas redes; o site não depende dela. São cerca de 187 KB (48 KB com gzip), sem contar as imagens.

## Assets da marca

Os arquivos da marca ficam em `assets/` (os mesmos do sistema do Hub). Só o vídeo do Sam ainda não existe.

| Arquivo | Onde aparece |
|---|---|
| `assets/logo-horizontal.png` (900×278, fundo transparente) | header e rodapé |
| `assets/sam-avatar.png` | header, botão flutuante, painel do Sam, chat |
| `assets/favicon.png`, `assets/apple-touch-icon.png` | aba do navegador / iOS |
| `assets/hero-1.webp` | primeiro slide do banner |
| `assets/hero-2.webp`, `hero-3.webp`, `hero-4.webp` | os 3 slides de imóveis em destaque |
| `assets/video-sam.mp4` | vídeo explicativo da conversa com o Sam (painel da coleção) |
| `assets/video-sam-capa.jpg` | capa do vídeo |
| `assets/og-image.jpg` (1200×630) | prévia do link ao compartilhar o site (Instagram, WhatsApp, Facebook, LinkedIn), no mesmo visual dos cards |

Enquanto um arquivo não existe, a página não quebra:
- **hero-\*.webp**: cai para uma foto demo do Unsplash e, sem internet, para o gradiente azul→marinho da marca;
- **logo**: mostra o nome em texto (fallback provisório, não é o design final);
- **avatar do Sam**: mostra um "S" sobre o azul da marca;
- **vídeo do Sam**: o play abre uma demonstração animada da conversa (marcada como "Demonstração");
- **capa do vídeo**: usa uma foto demo do Unsplash.

## O que está pronto

- Banner de abertura em carrossel horizontal de tela cheia (início, 3 imóveis em destaque, Sam e Anunciar): as fotos passam para o lado com parallax e Ken Burns, o texto entra a cada slide, autoplay de 7 s com barra de progresso e pausa, setas no desktop, arrastar no celular, gesto lateral no trackpad e ← → no teclado. Links como "Anunciar" levam direto ao slide certo.
- **Campo do Sam fixo no banner**: aparece em todos os slides (as fotos passam por trás), no estilo de conversa, com três sugestões prontas no computador. A pergunta abre o painel do Sam já respondendo, e o carrossel não troca de slide enquanto a pessoa digita. Acima dele, todos os slides têm os botões "Ver detalhes" e "Falar com o Sam".
- Menu superior: **Parceiros** (Corretores e Imobiliárias vão para o cadastro do Hub, com aprovação da diretoria; Indicadores usam o formulário do site; e um "Já é parceiro? Entrar"), **Anuncie seu imóvel** (abre o cadastro do proprietário) e **Entrar** (acesso ao sistema do Hub). O botão "Falar com o Sam" continua no topo. No celular, os mesmos três acessos no menu hambúrguer.
- Header que reage à rolagem e botão flutuante do Sam.
- Coleção: painel "Três imóveis por vez. Só os que fazem sentido para você." com filtros (Todos, Morar, Alugar, Investir, Alto padrão, Lançamentos + "Salvos" quando há favoritos), botões Ver imóveis / Falar com o Sam e o vídeo da conversa com o Sam ao lado.
- Vitrine "Imóveis selecionados para você" numa faixa escura: duas linhas de três imóveis (duas no tablet, uma no celular), seis fotos diferentes na tela, girando sem parar (a linha de cima anda para a esquerda e a de baixo para a direita). Pausa ao passar o mouse, com foco de teclado e no botão Pausar; setas nas pontas e arrastar no celular. A altura dos cards se ajusta para as duas linhas caberem na tela.
- Cards com a foto inteira e as informações por cima: selo da categoria e contador de fotos; ações na lateral (Salvar, Perguntar ao Sam, Compartilhar, Detalhes); localização, título, medidas e preço; botões **Agendar visita** e **Fazer proposta** pelo WhatsApp. Compartilhar usa o compartilhamento do celular ou copia o link (`/imovel/<id>`), que abre o detalhe do imóvel e, no Instagram e no WhatsApp, mostra o card daquele imóvel na prévia (ver "Prévia de cada imóvel").
- Selo de afinidade: "Combina com você" aparece depois que o Sam conhece o perfil (finalidade + bairro ou faixa); se a vitrine do sistema enviar o campo `match`, o selo mostra o percentual ("94% match").
- Modal de detalhe do imóvel (specs e descrição) com o mesmo rodapé do card, sempre à vista, mesmo em telas baixas: Salvar, Perguntar ao Sam, Compartilhar e Ver fotos, mais os botões **Agendar visita** e **Fazer proposta** pelo WhatsApp.
- Galeria 2D (sem 3D/WebGL): setas, contador, miniaturas, teclado ← →, swipe, fecha no ×, ESC ou clique fora.
- "Como funciona": seis fotos lado a lado, uma por etapa (Converse com o Sam → Curadoria → Visita → Proposta e negociação → Documentos e assinatura → Entrega das chaves). O número e o título ficam sempre à vista; ao passar o mouse, a descrição sobe por cima da foto, que continua aparecendo, e as outras fotos escurecem um pouco. No celular e no tablet as fotos passam de lado e a descrição fica sempre visível. As fotos estão em `assets/como-funciona/` (256×1024).
- Bairros que abrem o Sam já no contexto do bairro.
- Acessibilidade: `lang="pt-BR"`, `alt`, `aria-label` nos botões de ícone, `role="dialog"` com foco preso e ESC, alvos de toque ≥ 44 px, `prefers-reduced-motion`.
- Segurança: todo dado dinâmico passa por `esc()` antes de ir para o HTML, URLs de imagem passam por `safeUrl()`, nenhum `onclick` inline (delegação com `addEventListener`), e nada de PII no `localStorage` (só os IDs dos favoritos e a escolha de cookies).

## Privacidade e cookies

- **Política de Privacidade** (versão 2.0, de 30/10/2026, do pacote de publicação): fica em `politica-de-privacidade.html`, uma página própria com o texto integral. O site abre o mesmo texto numa janela (lê a página), pelos links do rodapé, do aviso de cookies, dos formulários e do painel do Sam. Aberto como arquivo, sem servidor, o link abre a página. Para atualizar a política, troque só o bloco `<section id="politica">` da página.
- **Aviso de cookies**, na primeira visita, com o texto aprovado e três saídas de um clique: **Somente essenciais**, **Aceitar todos** e **Preferências** (Essenciais sempre ativos; Análise de navegação, Personalização e Publicidade desligados até a pessoa ligar). Cada categoria mostra quais ferramentas estão em uso nela. A escolha fica em `localStorage` (`alh:consent`, sem dado pessoal) e pode ser revista em "Preferências de cookies", no rodapé. Para perguntar de novo a todos, suba `COOKIES_V` no script.
- Qualquer ferramenta opcional só pode carregar quando `window.alhConsent.analise` (ou `.personalizacao`, `.publicidade`) for `true`; cada escolha dispara o evento `alh:consent` no `document`. O Google Analytics e o Pixel da Meta já seguem essa regra (abaixo).
- Rodapé com a razão social e o CNPJ (AILOGIC HUB NEGOCIOS IMOBILIARIOS LTDA, 68.449.833/0001-78). O painel do Sam avisa que ele é um assistente virtual.
- Pendências do pacote, antes de considerar a política publicada: conferir o endereço com o cartão CNPJ oficial; criar um canal eletrônico de privacidade (e-mail dedicado) e atualizar a seção 17; aprovação do jurídico.

## Métricas e anúncios (Google Analytics 4 e Pixel da Meta)

- **Como ligar**: preencha no `CONFIG` o `ga4` (ID de métricas do GA4, `G-XXXXXXXXXX`, em Administrador › Fluxos de dados) e o `metaPixel` (só os números do ID, no Gerenciador de Eventos da Meta). Vazio, nada carrega.
- **Só com autorização**: o GA4 carrega quando a pessoa liga **Análise de navegação**; o Pixel, quando liga **Publicidade**. Antes da escolha, ou com "Somente essenciais", nenhuma chamada sai para o Google ou a Meta. Se a pessoa desligar depois, a ferramenta para de enviar e os cookies dela neste domínio (`_ga*`, `_fbp`, `_fbc`) são apagados.
- **Nenhum dado pessoal sai do site**: nome, WhatsApp, e-mail e o texto das conversas com o Sam nunca entram nos eventos. Vão só dados do imóvel (código, tipo, bairro, finalidade, preço) e da ação (de onde veio o clique, qual filtro). O GA4 roda com os sinais de anúncio negados (`ad_storage`, `ad_user_data`, `ad_personalization`).
- **Eventos**:

  | Ação no site | GA4 | Pixel da Meta |
  |---|---|---|
  | Abrir o detalhe de um imóvel (inclusive por link compartilhado) | `view_item` | `ViewContent` |
  | Salvar imóvel | `add_to_wishlist` | `AddToWishlist` |
  | Compartilhar imóvel | `share` | — |
  | Agendar visita (card ou detalhe) | `agendar_visita` | `Schedule` |
  | Fazer proposta (card ou detalhe) | `fazer_proposta` | `Contact` |
  | Outros botões de WhatsApp (topo, rodapé, Sam, formulário) | `whatsapp_click` | `Contact` |
  | Enviar formulário (Anunciar ou Ser parceiro) | `generate_lead` | `Lead` |
  | Abrir o Sam / mandar mensagem ao Sam | `sam_abrir` / `sam_mensagem` | `ConversaSam` (personalizado, só ao abrir) |
  | Filtro da vitrine, vídeo do Sam, Entrar | `filtro_vitrine`, `video_sam`, `entrar_click` | — |

  No GA4, marque `generate_lead`, `agendar_visita` e `fazer_proposta` como **eventos principais** (conversões). Para filtrar por imóvel nos relatórios, crie as dimensões personalizadas `imovel_codigo`, `imovel_bairro`, `imovel_tipo` e `origem`.
- **Para conferir**: com o ID preenchido, aceite os cookies e abra o DebugView do GA4 e a extensão Meta Pixel Helper.
- Ao ligar outra ferramenta (Google Ads, TikTok...), inclua-a em `FERRAMENTAS` e em `EVENTOS` no script, na categoria certa, e suba `COOKIES_V` se a pergunta do aviso mudar.

## Ligação com o sistema do Hub

O site chama o sistema em `https://www.ailogichuboficial.com` (constante `HUB`; na prévia em `localhost` as chamadas vão para `/api` do próprio servidor):
- **Vitrine**: `GET /api/vitrine`. Enquanto o Hub não tiver imóvel disponível publicado, o site mantém os exemplos marcados.
- **Sam**: `POST /api/sam-web`. A conversa usa a mesma IA do atendimento e, quando a pessoa deixa contato, vira lead no Hub. Se o Hub não responder, o Sam segue no fluxo guiado.
- **Formulários** (Anunciar e Ser parceiro): `POST /api/proposta?action=lead_site`, com a autorização de contato marcada. O contato entra em Comercial › Leads. Se o Hub não responder, a mensagem segue pelo WhatsApp, como antes.
- O Hub só aceita essas chamadas de origens conhecidas (CORS). Ao ligar um domínio novo no site, acrescente-o em `SITE_ORIGINS` na Vercel do Hub (separado por vírgula).

## Landing page de captação (`/lp`)

Página própria para campanhas (Meta, Google, bio do Instagram), em `lp/index.html`: mesmo visual do site, sem menu (todo clique leva ao formulário ou ao WhatsApp), HTML + CSS + JS inline, sem build. Abre também com duplo-clique. São cerca de 126 KB (32 KB com gzip), sem contar as imagens.

**Seções**: topo com o formulário à vista → faixa "como a curadoria trabalha" → "Menos anúncios. Mais certeza." (do jeito de sempre × com o Hub) → como funciona em três passos → Sam, com uma conversa de exemplo animada (marcada como "Exemplo") → bairros (o card marca o bairro no formulário) → bloco para proprietários → perguntas frequentes → chamada final → rodapé com razão social e CNPJ. No celular, uma barra fixa com "Quero minha seleção" e WhatsApp aparece longe do formulário.

**Formulário em quatro etapas** (cerca de 1 minuto), com barra de progresso, Voltar, validação por etapa e resumo da busca antes do envio:

| Etapa | Quem procura (comprar, alugar, investir) | Proprietário (vender ou alugar o imóvel) |
|---|---|---|
| 1 | O que você quer fazer? | O que você quer fazer? |
| 2 | Tipo, quartos, até 3 bairros (ou "Outro" / "Ainda não sei") | Vender/alugar, tipo, bairro, área |
| 3 | Faixa de valor (venda ou aluguel por mês), indispensáveis, prazo | Situação, valor esperado, prazo, observações |
| 4 | Nome, WhatsApp, e-mail (opcional), melhor horário, autorização de contato | igual |

- **Envio**: `POST /api/proposta?action=lead_site` do Hub, igual aos formulários do site, com `tipo` `cliente` ou `proprietario` e `origem` `site-formulario` (o Hub só aceita `site-cadastro` e `site-formulario`). O perfil inteiro vai no campo `mensagem` (até 500 caracteres), começando por "Landing page", e aparece no lead em Comercial › Leads. Sem resposta do Hub, a mensagem segue pelo WhatsApp, já preenchida, como no site.
- **Campanha (UTM)**: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term` (e se veio de clique do Google ou da Meta) são lidos da URL, guardados na sessão do navegador e vão no fim da `mensagem` ("Origem: meta/cpc, campanha selecao-nov, anúncio..."). Atende à regra MKT-360 do Marketing (todo lead de tráfego externo com origem).
- **Uma página, várias campanhas**: `?para=` troca o título e já abre na segunda etapa com a intenção marcada:
  - `/lp` (ou `?para=comprar`): quem quer comprar para morar;
  - `/lp?para=alugar`, `/lp?para=investir`;
  - `/lp?para=proprietario`: título, botões e envio do proprietário;
  - `&bairro=Pinheiros` já marca o bairro (ou preenche o bairro do imóvel, para proprietário).

  Exemplo de anúncio: `https://<site>/lp?para=alugar&bairro=Moema&utm_source=meta&utm_medium=cpc&utm_campaign=locacao-moema&utm_content=video-1`.
- **Cookies e métricas**: mesmo aviso, mesmo texto e mesma escolha do site (`alh:consent`): quem já escolheu no site não vê o aviso de novo. GA4 e Pixel seguem a mesma regra; **preencha `ga4` e `metaPixel` também no `CONFIG` da landing**. Eventos, sem nenhum dado pessoal: `lp_inicio` (primeira resposta), `lp_etapa` (cada etapa, com a intenção), `generate_lead` / `Lead` (envio, com tipo, intenção e canal hub/whatsapp) e `whatsapp_click` / `Contact`. Todos levam `pagina: lp` e a `variante`.
- **"Conversar com o Sam"** leva ao site com `?sam=1`, que abre o painel do Sam direto.
- **CSP**: se o cabeçalho também valer para `/lp`, acrescente os hashes dos dois scripts da landing (desta versão): `'sha256-STYPFcK96F7WDpjrr8lWACDtdgptm5zp3cvxlvxvz58='` e `'sha256-U3mWRv2X+tjpJm5RJzU8xQs4mgYNSDs8Eqq3JMoUO6U='`, e `https://images.unsplash.com` em `img-src` (fotos dos bairros e da conversa de exemplo).
- **Para revisar antes de anunciar**: textos das perguntas frequentes (prazo de retorno de 1 dia útil, regiões atendidas) e as faixas de valor, com o comercial; trocar as fotos do Unsplash dos bairros por fotos próprias.

## O que é demonstração

- **Imóveis**: 9 imóveis de exemplo no formato do `/api/vitrine`, marcados na tela como "Exemplo" (etiqueta nos cards, nos destaques do banner e no detalhe, mais um aviso na coleção). Somem sozinhos quando o Hub publicar imóveis reais.
- **Sam aberto como arquivo** (duplo-clique, sem servidor): segue um fluxo guiado (morar/investir/alugar → bairro → faixa de valor → indispensáveis → sugestões + WhatsApp).
- **Fotos de imóveis e bairros**: URLs do Unsplash, só ilustrativas.
- **Números e depoimentos**: foram retirados (eram exemplos). Voltam só com dados reais e depoimentos autorizados.

## Produção

- Configure tudo no objeto `CONFIG`, no início do `<script>` principal:
  - `whatsapp`, `vitrineUrl`, `samUrl`, `leadUrl`;
  - `loginUrl`: destino do "Entrar" (acesso ao sistema do Hub): `https://www.ailogichuboficial.com/`;
  - `parceiros`: página própria de cada perfil (`corretor`, `imobiliaria`, `indicador`), se houver. Sem URL, o item abre o cadastro no próprio site;
  - `videoSam`: caminho do vídeo (`assets/video-sam.mp4`);
  - `ga4` e `metaPixel`: IDs do Google Analytics 4 e do Pixel da Meta (veja "Métricas e anúncios").
- A CSP hoje está em `report-only`; passe para **enforce** (cabeçalho `Content-Security-Policy`). Um ponto de partida para esta página:

  ```
  default-src 'self';
  script-src 'self' 'sha256-eFK9hDkDon/NPDG/wQvJ0DrtXVrwpsFTD7A06bWUWvs=' 'sha256-7dih+tVyjZGH+G9d44/lwIjMlaOIllomslLTxG/hcS0=' https://www.googletagmanager.com https://connect.facebook.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: https://images.unsplash.com https://www.googletagmanager.com https://*.google-analytics.com https://www.facebook.com;
  media-src 'self';
  connect-src 'self' https://www.ailogichuboficial.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net;
  object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  ```

  Os dois hashes são dos `<script>` inline **desta versão**: qualquer edição no script muda o hash (ou mova o JS para um arquivo `.js` e use `'self'`). Os domínios do Google e da Meta são do GA4 e do Pixel; o do Hub é o da vitrine, do Sam e dos formulários. Acrescente em `img-src` o domínio onde ficam as fotos da vitrine.
- A fonte Inter é carregada de verdade pelo Google Fonts (400/500/600/700/800).
- **Prévia do link** (`og:image` no `<head>`): aponta para `https://site-orpin-two-16.vercel.app/assets/og-image.jpg`. Instagram e WhatsApp só aceitam endereço completo, em JPG ou PNG; sem isso, pegam qualquer foto da página. Ao ligar um domínio próprio, troque o endereço nas três tags de imagem. As redes guardam a prévia antiga por um tempo: para atualizar na hora, cole o link em developers.facebook.com/tools/debug e clique em "Scrape Again" (coletar de novo; vale para Instagram e WhatsApp). Os links de imóvel têm prévia própria (abaixo).

## Prévia de cada imóvel

O botão **Compartilhar** gera `https://<site>/imovel/<id>`. As redes não rodam o JavaScript da página, então a prévia de cada imóvel vem de duas funções na Vercel:

- `vercel.json`: quem abre o link no navegador é levado direto ao site (`/?imovel=<id>`, que abre o detalhe), sem passar pelas funções. Só os robôs das redes (Instagram/Facebook, WhatsApp, X, LinkedIn, Telegram, iMessage...) seguem para as funções.
- `api/imovel.js`: devolve aos robôs o título, a descrição (bairro, medidas e preço) e a imagem do imóvel.
- `api/og.js`: desenha a imagem (1200×630, JPG) no visual do card da vitrine: foto, selo, contador de fotos, ações na lateral, localização, título, medidas, preço, os botões Agendar visita / Fazer proposta e a marca. Fica guardada no CDN por um dia.
- Os dados vêm do `GET /api/vitrine` do Hub, com a mesma regra do site: havendo imóveis publicados, só eles valem; sem nenhum, valem os exemplos de `api/_lib/demo.js` (cópia do `DEMO` do `index.html`), marcados como "Exemplo" no selo e no título.
- Se o imóvel não existir ou algo falhar, a prévia volta para a geral (`assets/og-image.jpg`) e o link continua abrindo o site.
- Fotos em JPG ou PNG. WebP não entra na imagem: as fotos do banner têm cópia em JPG em `api/_img/`; foto do Hub em WebP faz a função tentar a próxima foto do imóvel e, sem nenhuma, usar o fundo azul da marca.
- Dependências (`package.json`): `satori`, `@resvg/resvg-js` e `jpeg-js`, com versões fixas. A Vercel instala sozinha no deploy; o site continua sem build.
- Se os exemplos do `index.html` mudarem, gere de novo `api/_lib/demo.js` (são os mesmos campos do `DEMO`).
- Para testar: cole um link de imóvel em developers.facebook.com/tools/debug. Fora da Vercel (ou abrindo o arquivo direto), o Compartilhar volta ao link com `#imovel-<id>`.
