# wepink — redesign

Projeto separado em 3 arquivos, sem build step — basta abrir `index.html` no navegador.

## Estrutura
```
index.html   → estrutura/marcação (HTML puro)
styles.css   → toda a estilização (tokens de cor, layout, responsividade)
script.js    → toda a lógica (tilt 3D do mouse, scroll reveal, dial animado,
               seletor de kit, e as trilhas fixas do chat de atendimento)
```

`index.html` carrega os outros dois via:
```html
<link rel="stylesheet" href="styles.css">
...
<script src="script.js" defer></script>
```

As fotos dos produtos continuam embutidas em base64 dentro do `index.html`
(por isso ele ainda é o arquivo maior) — não dependem de uma pasta de imagens.

## Sobre usar React / React Native
React Native é para apps mobile nativos (iOS/Android) e não se aplica a um
site rodando no navegador. Para este projeto continuar como site, as opções
seriam:
- **Manter como está** (HTML/CSS/JS puro): mais simples, roda em qualquer
  lugar sem build, ideal pra landing page e protótipo.
- **Migrar para React (web) ou Vue**: só compensa quando o site crescer em
  interatividade real — carrinho de compras com estado complexo, catálogo
  dinâmico vindo de uma API, autenticação de usuário, etc. Nesse ponto,
  componentizar em React facilita reaproveitar peças (card de produto, chat
  widget) e integrar com um backend de e-commerce de verdade.

## Próximos passos sugeridos
- Extrair as imagens em base64 para arquivos `.webp` otimizados e servidos
  por CDN, referenciados por caminho em vez de embutidos.
- Conectar "monte seu kit" e os botões de "Comprar" a um carrinho/checkout
  real.
- Conectar o widget de atendimento a uma fila de suporte real
  (Zendesk/Chatwoot) para o handoff humano.
