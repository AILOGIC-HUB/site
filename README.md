# AI Logic Hub — landing page

Um único `index.html` (HTML + CSS + JS inline, sem framework e sem build) + a pasta `assets/`.
Abre com duplo-clique. São cerca de 179 KB (47 KB com gzip), sem contar as imagens.

## Antes de publicar: coloque os assets reais

A página usa os arquivos da marca pelos nomes abaixo. Eles **não estão neste repositório**: copie-os para `assets/`.

| Arquivo | Onde aparece |
|---|---|
| `assets/logo-horizontal.png` (900×278, fundo transparente) | header e rodapé |
| `assets/sam-avatar.png` | header, botão flutuante, painel do Sam, chat |
| `assets/favicon.png`, `assets/apple-touch-icon.png` | aba do navegador / iOS |
| `assets/hero-1.webp` | primeiro slide do banner |
| `assets/hero-2.webp`, `hero-3.webp`, `hero-4.webp` | os 3 slides de imóveis em destaque |
| `assets/video-sam.mp4` | vídeo explicativo da conversa com o Sam (painel da coleção) |
| `assets/video-sam-capa.jpg` | capa do vídeo |

Enquanto um arquivo não existe, a página não quebra:
- **hero-\*.webp**: cai para uma foto demo do Unsplash e, sem internet, para o gradiente azul→marinho da marca;
- **logo**: mostra o nome em texto (fallback provisório, não é o design final);
- **avatar do Sam**: mostra um "S" sobre o azul da marca;
- **vídeo do Sam**: o play abre uma demonstração animada da conversa (marcada como "Demonstração");
- **capa do vídeo**: usa uma foto demo do Unsplash.

## O que está pronto

- Banner de abertura em carrossel horizontal de tela cheia (início, 3 imóveis em destaque, Sam e Anunciar): as fotos passam para o lado com parallax e Ken Burns, o texto entra a cada slide, autoplay de 7 s com barra de progresso e pausa, setas no desktop, arrastar no celular, gesto lateral no trackpad e ← → no teclado. Links como "Anunciar" levam direto ao slide certo.
- Menu superior: **Parceiros** (abre Corretores, Imobiliárias e Indicadores de imóveis, cada um com o seu cadastro, e um "Já é parceiro? Entrar"), **Anuncie seu imóvel** (abre o cadastro do proprietário) e **Entrar** (acesso ao sistema do Hub). O botão "Falar com o Sam" continua no topo. No celular, os mesmos três acessos no menu hambúrguer.
- Header que reage à rolagem e botão flutuante do Sam.
- Coleção: painel "Três imóveis por vez. Só os que fazem sentido para você." com filtros (Todos, Morar, Alugar, Investir, Alto padrão, Lançamentos + "Salvos" quando há favoritos), botões Ver imóveis / Falar com o Sam e o vídeo da conversa com o Sam ao lado.
- Vitrine "Imóveis selecionados para você" numa faixa escura: duas linhas de três imóveis (duas no tablet, uma no celular), seis fotos diferentes na tela, girando sem parar (a linha de cima anda para a esquerda e a de baixo para a direita). Pausa ao passar o mouse, com foco de teclado e no botão Pausar; setas nas pontas e arrastar no celular. A altura dos cards se ajusta para as duas linhas caberem na tela.
- Cards com a foto inteira e as informações por cima: selo da categoria e contador de fotos; ações na lateral (Salvar, Perguntar ao Sam, Compartilhar, Detalhes); localização, título, medidas e preço; botões **Agendar visita** e **Fazer proposta** pelo WhatsApp. Compartilhar usa o compartilhamento do celular ou copia o link, e o link (`#imovel-<id>`) abre o detalhe do imóvel.
- Selo de afinidade: "Combina com você" aparece depois que o Sam conhece o perfil (finalidade + bairro ou faixa); se a vitrine do sistema enviar o campo `match`, o selo mostra o percentual ("94% match").
- Modal de detalhe do imóvel (specs, descrição, **Agendar visita** via WhatsApp, Ver fotos, Perguntar ao Sam).
- Galeria 2D (sem 3D/WebGL): setas, contador, miniaturas, teclado ← →, swipe, fecha no ×, ESC ou clique fora.
- "Como funciona" com linha de progresso e cinco etapas: Conversa → Curadoria → Visita → Documentação e contrato → Chave na mão, cada uma com uma frase de destaque e um texto de apoio.
- Bairros que abrem o Sam já no contexto do bairro.
- Acessibilidade: `lang="pt-BR"`, `alt`, `aria-label` nos botões de ícone, `role="dialog"` com foco preso e ESC, alvos de toque ≥ 44 px, `prefers-reduced-motion`.
- Segurança: todo dado dinâmico passa por `esc()` antes de ir para o HTML, URLs de imagem passam por `safeUrl()`, nenhum `onclick` inline (delegação com `addEventListener`), e nada de PII no `localStorage` (só os IDs dos favoritos).

## O que é demonstração

- **Imóveis**: 9 imóveis de exemplo no formato do `/api/vitrine`, marcados na tela como "Exemplo" (etiqueta nos cards, nos destaques do banner e no detalhe, mais um aviso na coleção). O botão do detalhe vira "Quero algo parecido" e a mensagem do WhatsApp não cita código inexistente. Servida por http(s), a página tenta `GET /api/vitrine` e, se responder JSON, troca os exemplos pelos imóveis reais e some com as marcações.
- **Sam**: offline, segue um fluxo guiado (morar/investir/alugar → bairro → faixa de valor → indispensáveis → sugestões + WhatsApp). Servida por http(s), chama `POST /api/sam-web` com `{messages:[{role,content}]}` e espera `{reply, sugestoes}`. Se a API falhar, volta para o fluxo guiado.
- **Formulários** (Anunciar imóvel / Ser parceiro, este com o perfil Corretor, Imobiliária ou Indicador e campos próprios de cada um): sem `CONFIG.leadUrl`, abrem o WhatsApp do Hub com a mensagem já preenchida (o contato só chega quando a pessoa envia). Com `CONFIG.leadUrl`, enviam por POST JSON.
- **Fotos de imóveis e bairros**: URLs do Unsplash, só ilustrativas.
- **Números e depoimentos**: foram retirados (eram exemplos). Voltam só com dados reais e depoimentos autorizados.

## Produção

- Configure tudo no objeto `CONFIG`, no início do `<script>` principal:
  - `whatsapp`, `vitrineUrl`, `samUrl`, `leadUrl`;
  - `loginUrl`: destino do "Entrar" (acesso ao sistema do Hub): `https://www.ailogichuboficial.com/`;
  - `parceiros`: página própria de cada perfil (`corretor`, `imobiliaria`, `indicador`), se houver. Sem URL, o item abre o cadastro no próprio site;
  - `videoSam`: caminho do vídeo (`assets/video-sam.mp4`).
- A CSP hoje está em `report-only`; passe para **enforce** (cabeçalho `Content-Security-Policy`). Um ponto de partida para esta página:

  ```
  default-src 'self';
  script-src 'self' 'sha256-eFK9hDkDon/NPDG/wQvJ0DrtXVrwpsFTD7A06bWUWvs=' 'sha256-H+2awtvGlYcmYJocp9ySA3szIhcIt2eEmBmnVRtHgsQ=';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: https://images.unsplash.com;
  media-src 'self';
  connect-src 'self';
  object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
  ```

  Os dois hashes são dos `<script>` inline **desta versão**: qualquer edição no script muda o hash (ou mova o JS para um arquivo `.js` e use `'self'`). Acrescente em `img-src` o domínio onde ficam as fotos da vitrine.
- A fonte Inter é carregada de verdade pelo Google Fonts (400/500/600/700/800).
