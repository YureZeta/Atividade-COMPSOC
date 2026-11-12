# Código de Cor

> Um percurso interativo sobre racismo algorítmico: como ele acontece, quem é afetado e como podemos questionar as tecnologias que moldam nossas vidas.

[Abrir o percurso interativo](https://yurezeta.github.io/Atividade-COMPSOC/#inicio)

## Neste README

- [Objetivo](#objetivo)
- [Explore o percurso](#explore-o-percurso)
- [Recursos interativos](#recursos-interativos)
- [Como executar](#como-executar)
- [Arquivos do projeto](#arquivos-do-projeto)
- [Manutenção do código](#manutenção-do-código)

## Objetivo

O **Código de Cor** é um projeto educativo que apresenta, em linguagem acessível, como sistemas algorítmicos podem reproduzir e ampliar desigualdades raciais. A proposta é aproximar conceitos, pesquisas e casos reais — com atenção especial ao contexto brasileiro e à Bahia — e convidar cada pessoa a refletir sobre quem cria, treina, utiliza e é afetado por essas tecnologias.

O projeto não é uma ferramenta de reconhecimento facial. As demonstrações visuais são simulações didáticas para apoiar a discussão sobre vieses, dados e impactos sociais.

## Explore o percurso

Abra os tópicos abaixo para conhecer cada etapa. Os links levam diretamente às seções correspondentes da página:

<details>
  <summary>1. Espelho, espelho meu — situações do cotidiano</summary>

  Configure tom de pele, textura e comprimento do cabelo e apresentação de gênero de um personagem fictício. A roupa, a forma do cabelo e os traços faciais mudam conforme a apresentação visual; a cor do cabelo usa uma paleta ilustrativa por tom de pele, sem sugerir que a pigmentação determine a cor natural do cabelo. Uma reflexão educativa se atualiza para cada combinação de tom, textura, comprimento e apresentação, sem prever resultados individuais. Explore exemplos de filtros de beleza, reconhecimento facial e alertas automatizados. A apresentação visual não define a identidade de uma pessoa real; as escolhas ficam apenas na página e não são salvas nem enviadas.

  [Ir para a etapa 1](./index.html#espelho)
</details>

<details>
  <summary>2. O mito da neutralidade — dados e decisões</summary>

  Entenda como dados históricos e escolhas de projeto podem levar um sistema a reproduzir desigualdades, mesmo sem uma instrução explicitamente discriminatória.

  [Ir para a etapa 2](./index.html#neutralidade)
</details>

<details>
  <summary>3. Por dentro da máquina — etapas e pontos de decisão</summary>

  Acompanhe como coleta, rotulagem, modelagem, composição das equipes e contexto de uso influenciam os resultados de sistemas algorítmicos.

  [Ir para a etapa 3](./index.html#maquina)
</details>

<details>
  <summary>4. Onde acontece — casos e impactos</summary>

  Conheça casos e pesquisas sobre reconhecimento facial, erros de classificação e seus efeitos sobre diferentes grupos.

  [Ir para a etapa 4](./index.html#casos)
</details>

<details>
  <summary>5. Quem resiste — perspectivas e iniciativas</summary>

  Veja referências, pesquisadoras, pesquisadores e iniciativas que questionam a tecnologia e propõem outras formas de construir conhecimento.

  [Ir para a etapa 5](./index.html#resistencia)
</details>

<details>
  <summary>6. E agora? — reflexão e participação</summary>

  Reflita sobre ações possíveis para quem usa, estuda, desenvolve ou toma decisões sobre tecnologia.

  [Ir para a etapa 6](./index.html#agora)
</details>

## Recursos interativos

Além do conteúdo explicativo, a página inclui:

- tela inicial com instruções de navegação, exibida antes da animação de análise facial;
- demonstração visual de análise facial, com opção para repetir a animação;
- personagem configurável e cenários com escolhas e respostas, com roupa, forma de cabelo e traços faciais que mudam por apresentação, cor de cabelo em paleta ilustrativa por tom de pele e reflexões educativas para combinações de tom, textura, comprimento e apresentação;
- referências fotográficas locais para quatro texturas de cabelo, com créditos e licenças junto às imagens;
- resultados de pesquisas sobre reconhecimento facial e prisões na Bahia, apresentados como dados coletivos e não como previsões individuais.
- simuladores e visualizações sobre dados e taxas de erro;
- glossário, quiz e navegação entre etapas;
- minijogos de forca, caça-palavras e palavras cruzadas.

Os minijogos podem ser acessados pelo menu superior ou pelo botão ao final do percurso, depois do quiz.

## Como executar

1. Baixe ou clone este repositório.
2. Mantenha o HTML, o CSS e o JavaScript na mesma pasta.
3. Abra `index.html` em um navegador.

Não é necessário instalar dependências nem executar um processo de build. A página carrega fontes do Google Fonts; sem conexão com a internet, o navegador usará as fontes alternativas definidas no CSS.

## Arquivos do projeto

| Arquivo | Função |
| --- | --- |
| [`index.html`](./index.html) | Conteúdo e estrutura da página principal |
| [`codigo-de-cor.css`](./codigo-de-cor.css) | Estilos, layout e adaptação para diferentes telas |
| [`codigo-de-cor.js`](./codigo-de-cor.js) | Interações, simuladores, quiz e minijogos |
| [`labirinto.html`](./labirinto.html) | Página autônoma do minijogo Labirinto, incorporada na aba de jogos |
| [`labirinto.css`](./labirinto.css) | Tema, tabuleiro, controles, HUD e modais do Labirinto |
| [`labirinto.js`](./labirinto.js) | Geração do mapa, movimentação, perguntas, pontuação e fases do Labirinto |
| [`assets/hair/`](./assets/hair/) | Fotografias de referência dos quatro tipos de cabelo, carregadas pelo configurador |
| [`favicon/`](./favicon/) | Ícones e manifesto usados pelos navegadores e dispositivos |
| [`protótipos/`](./protótipos/) | Versões experimentais antigas; não são carregadas pela página publicada |

O material também inclui referências a pesquisas, artigos, livros e palestras para quem quiser aprofundar a discussão.

## Manutenção do código

### Estrutura da página principal

[`index.html`](./index.html) contém o conteúdo e os pontos de integração das interações. O percurso fica em `#percurso` e segue esta ordem:

1. `#inicio`: introdução e rostos da simulação;
2. `#espelho`: cenários cotidianos, personagem, reflexões e dados da Bahia;
3. `#neutralidade`: ciclo passado/futuro dos dados;
4. `#maquina`: etapas do sistema e simulador de base de treino;
5. `#casos`: filtros e linha do tempo;
6. `#resistencia`: perspectivas, bússola, máscara e exemplos;
7. `#agora`: ações e participação;
8. `#quiz`: questionário de revisão.

`#minijogos` é uma área separada, acessada pelo menu superior ou pelo botão ao final do percurso. Suas abas exibem forca, caça-palavras, palavras cruzadas e o Labirinto (um `iframe` de `labirinto.html`). O glossário é um diálogo compartilhado no fim do documento. Em telas de até 680 px, as referências do rodapé ficam disponíveis em um botão que abre um diálogo.

### JavaScript da página principal

[`codigo-de-cor.js`](./codigo-de-cor.js) roda em uma função isolada e conecta os controles aos elementos já declarados no HTML. As seções do arquivo seguem esta ordem:

- entrada e animações: preferência por movimento reduzido, revelação das etapas e varredura da introdução;
- `cenários` e `personagem ilustrativo`: respostas das situações e atualização do personagem (tom de pele, textura, comprimento e cor do cabelo, apresentação visual, cor dos olhos e expressão), reflexão, referências capilares e contexto de pesquisa;
- `passado/futuro` e `pipeline`: ciclo dos dados e etapas de um sistema;
- `simulador de base`: curva didática de erro em função da proporção de exemplos;
- `filtros`, `objeto x sujeito`, `bússola`, `máscara`, `auditoria Gender Shades` e `alertas de Londres`: interações das seções do percurso;
- ciclo CTS, CAPTCHA e itens seguintes: demonstrações e conteúdos de reflexão;
- abas do site, glossário, quiz e progresso: navegação e componentes compartilhados;
- abas e três minijogos: estado e regras da forca, caça-palavras e palavras cruzadas.

Para mudar o conteúdo desses componentes, edite os dados próximos ao bloco correspondente. Em particular, `toneNames`, `hairNames`, `lengthNames`, `genderNames`, `toneInsights`, `hairInsights`, `lengthInsights`, `genderInsights` e `hairReferences` alimentam o personagem; as opções do HTML devem manter os mesmos valores (`liso`, `ondulado`, `cacheado`, `crespo`; `curto`, `medio`, `longo`; `feminina`, `masculina`, `androgina`). As escolhas do personagem são apenas estado local da página.

### CSS e personagem

[`codigo-de-cor.css`](./codigo-de-cor.css) começa pelos tokens globais de cor e tipografia e depois agrupa regras por componente: cabeçalho, introdução, etapas, cenários, simuladores e casos, resistência, quiz/glossário e minijogos. As regras `@media` adaptam layout e movimento à tela e às preferências de acessibilidade.

O SVG do personagem fica no HTML. O JavaScript altera seus atributos `data-tone`, `data-hair`, `data-length` e `data-gender`; o CSS usa esses atributos para escolher silhueta, rosto, cabelo, roupa e cores. Ao adicionar uma nova opção, atualize conjuntamente controle HTML, dados e nomes no JavaScript, caminhos/grupos SVG e seletores CSS. Cada comprimento ou apresentação deve continuar tendo apenas a forma correspondente visível. As seis cores de cabelo são uma paleta ilustrativa, não uma regra biológica.

### Minijogo Labirinto

[`labirinto.html`](./labirinto.html) declara o canvas, HUD, controles, instruções e diálogos. Seus `id`s são a interface usada por [`labirinto.js`](./labirinto.js); mantenha-os sincronizados ao renomear elementos. O roteiro segue estas partes:

- `questions`: banco de perguntas; cada item tem título `t`, enunciado `q`, alternativas `a`, índice da correta `c` e explicação `e`;
- `generateMaze` e `chooseQuestions`: geram um labirinto conectado, posicionam saída/desafios e evitam repetir perguntas na mesma partida quando há opções suficientes;
- `startPhase`, `newGame` e `finishPhase`: inicializam uma fase ou partida e avançam o progresso;
- `draw`, `tryStep` e `frame`: desenham o canvas, validam movimentos e animam o jogador;
- `showQuestion` e `answerQuestion`: apresentam desafios, controlam tentativas, pontos e desbloqueio da saída;
- eventos de teclado, botões móveis, tema e altura do `iframe`: conectam entradas e comunicação com a página principal.

[`labirinto.css`](./labirinto.css) define tokens de tema, canvas, painel lateral, HUD, controles e diálogos; os pontos de quebra reorganizam a interface em telas menores. As variáveis `--maze-*` são compartilhadas com o desenho do canvas.

### Contratos para alterações

- Não renomeie um `id`, `data-*`, `aria-controls` ou `aria-labelledby` sem atualizar todos os seletores e referências JavaScript/HTML correspondentes.
- Textos novos do personagem devem preservar a ressalva de que dados agregados e categorias ilustrativas não predizem resultados individuais.
- Ao alterar cores, mantenha os tokens centralizados no início do CSS; o canvas do Labirinto lê suas cores das variáveis CSS.
- Mantenha créditos e links de licença junto às fotos em `assets/hair/`.
- O projeto é estático: não há dependências instaladas, build ou etapa de compilação. Abra `index.html` para testar o percurso e a aba Minijogos para testar os jogos.
