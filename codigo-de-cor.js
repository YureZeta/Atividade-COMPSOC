/* Lógica interativa do projeto Código de Cor. Os blocos abaixo acompanham as seções e os minijogos da página. */
(function(){
  var root = document.documentElement;
  // Aplica a preferência salva antes de configurar as interações da página.
  try{ var saved = localStorage.getItem("cdc-theme"); if(saved) root.setAttribute("data-theme", saved); }catch(e){}
  document.getElementById("themeBtn").addEventListener("click", function(){
    var cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try{ localStorage.setItem("cdc-theme", next); }catch(e){}
  });
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function fmt(n){ return n.toFixed(1).replace(".", ","); }

  // hero
  var tones = ["--t1","--t2","--t3","--t4","--t5","--t6"];
  var conf  = [99, 98, 95, 79, 52, null];
  var order = [0,3,5,1,4,2, 4,1,2,5,0,3];
  var faces = document.getElementById("faces");
  order.forEach(function(t){
    var d = document.createElement("div"); d.className = "face";
    d.innerHTML = '<svg viewBox="0 0 100 120" aria-hidden="true"><circle cx="50" cy="44" r="25" fill="var('+tones[t]+')"/><path d="M14 120c0-24 16-40 36-40s36 16 36 40z" fill="var('+tones[t]+')"/></svg>';
    var b = document.createElement("div"); var c = conf[t];
    b.className = "box" + (c === null ? " none" : c < 90 ? " weak" : "");
    b.innerHTML = '<span class="tag">' + (c === null ? "não detectado" : "rosto " + c + "%") + '</span>';
    d.appendChild(b); faces.appendChild(d);
  });
  function runScan(){
    var list = faces.querySelectorAll(".face");
    list.forEach(function(f){ f.classList.remove("scanned"); });
    faces.classList.remove("scanning");
    if(reduce){ list.forEach(function(f){ f.classList.add("scanned"); }); return; }
    void faces.offsetWidth; faces.classList.add("scanning");
    list.forEach(function(f, i){ setTimeout(function(){ f.classList.add("scanned"); }, 300 + i * 160); });
  }
  runScan();
  document.getElementById("replay").addEventListener("click", runScan);

  // cenários
  document.querySelectorAll("[data-scn]").forEach(function(s){
    var btns = s.querySelectorAll(".choice"), rev = s.querySelector(".reveal");
    btns.forEach(function(b){ b.addEventListener("click", function(){
      btns.forEach(function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      rev.querySelector(".react").textContent = b.dataset.react; rev.hidden = false;
    });});
  });

  var fut = document.getElementById("future"), fb = document.getElementById("futureBtn");
  fb.addEventListener("click", function(){
    var shown = fut.dataset.shown === "true";
    fut.dataset.shown = shown ? "false" : "true";
    fb.textContent = shown ? "Mostrar o que o sistema aprende" : "Esconder";
  });

  // pipeline
  var stages = [
    ["Coleta","de onde vêm as fotos","Se a base de imagens tem muito mais rostos brancos, o sistema vê poucos exemplos de pessoas negras e aprende pior sobre elas. Os bancos de teste de rostos mais usados até 2018 tinham mais de 83% de pessoas brancas."],
    ["Rotulagem","quem diz o que é cada foto","Pessoas classificam as imagens como “perigoso”, “profissional”, “bonito”. Esses rótulos carregam os preconceitos de quem rotula, e o modelo aprende o preconceito como se fosse fato. Muitas vezes esse trabalho é feito no Sul Global, por pessoas mal pagas."],
    ["Modelagem","o que se otimiza","Um modelo pode ter 95% de acerto na média e errar muito para um grupo minoritário, porque a média esconde quem fica para trás. Se ninguém mede o erro por grupo, ninguém vê o problema."],
    ["Equipe","quem faz as perguntas","Equipes pouco diversas tendem a não perceber falhas que não as atingem. Foi uma pesquisadora negra, ao ver que o sistema não reconhecia seu rosto, que iniciou a investigação de Gender Shades."],
    ["Uso","onde a câmera é instalada","Mesmo um sistema com erro igual para todos gera injustiça se for instalado só em bairros periféricos e estações de grande fluxo popular. A decisão de onde vigiar é política, não técnica."]
  ];
  var pipe = document.getElementById("pipe"), panel = document.getElementById("pipePanel");
  stages.forEach(function(s, i){
    var li = document.createElement("li");
    li.innerHTML = '<button type="button" role="tab" aria-selected="' + (i===0) + '" id="ps' + i + '"><b>' + (i+1) + '. ' + s[0] + '</b><small>' + s[1] + '</small></button>';
    pipe.appendChild(li);
  });
  function showStage(i){
    pipe.querySelectorAll("button").forEach(function(b, j){ b.setAttribute("aria-selected", j === i ? "true" : "false"); });
    panel.setAttribute("aria-labelledby", "ps" + i);
    panel.innerHTML = '<h3>' + stages[i][0] + '</h3><p>' + stages[i][2] + '</p>';
  }
  pipe.addEventListener("click", function(e){ var b = e.target.closest("button"); if(!b) return; showStage([].indexOf.call(pipe.querySelectorAll("button"), b)); });
  showStage(0);

  // simulador de base
  var mix = document.getElementById("mix");
  function err(share){ var gap = Math.max(0, 0.5 - share) / 0.45; return 0.8 + 33.9 * Math.pow(gap, 1.35); }
  function updSim(){
    var d = mix.value / 100, eD = err(d), eL = err(1 - d);
    document.getElementById("mixOut").textContent = mix.value + "%";
    var shD = document.getElementById("shD"); shD.textContent = mix.value + "%"; shD.style.width = mix.value + "%";
    document.getElementById("shL").textContent = (100 - mix.value) + "%";
    document.getElementById("bD").style.width = (eD / 35 * 100) + "%";
    document.getElementById("bL").style.width = (eL / 35 * 100) + "%";
    document.getElementById("vD").textContent = fmt(eD) + "%";
    document.getElementById("vL").textContent = fmt(eL) + "%";
    var ratio = eD / eL, note;
    if(mix.value >= 48) note = "Base equilibrada: os erros ficam parecidos. Mas atenção, isso não resolve tudo. Se a câmera continuar instalada só nos mesmos lugares, quem é vigiado continua sendo o mesmo grupo.";
    else if(ratio > 20) note = "Com tão poucos exemplos, o sistema erra cerca de " + Math.round(ratio) + " vezes mais com rostos de pele escura. É o cenário mais próximo do que Gender Shades encontrou em produtos vendidos no mercado.";
    else note = "O erro para rostos de pele escura ainda é " + fmt(ratio) + " vezes maior. Continue arrastando para equilibrar a base.";
    document.getElementById("simNote").textContent = note;
  }
  mix.addEventListener("input", updSim); updSim();

  // filtros
  var fbtns = document.querySelectorAll("[data-filter]");
  fbtns.forEach(function(b){ b.addEventListener("click", function(){
    fbtns.forEach(function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    var f = b.dataset.filter;
    document.querySelectorAll("#timeline li").forEach(function(li){ li.hidden = !(f === "all" || li.dataset.where === f); });
  });});

  // objeto x sujeito
  var views = {
    obj: '<h4>A IA como sistema técnico</h4><p>Visto como objeto, um sistema de IA é feito de três camadas:</p><ul><li><b>Dados:</b> textos, imagens e registros que o alimentam.</li><li><b>Algoritmos:</b> as regras matemáticas que encontram padrões estatísticos nesses dados.</li><li><b>Infraestrutura:</b> data centers, cabos, minérios e energia que fazem tudo funcionar.</li></ul><p>É a visão mais comum, e a que costuma vir acompanhada da promessa de neutralidade.</p>',
    suj: '<h4>A IA como sistema político-epistêmico</h4><p>Visto como sujeito, o mesmo sistema revela relações de poder:</p><ul><li><b>Quem decide:</b> poucas corporações e Estados do Norte definem o que a IA faz e para quem.</li><li><b>Que racionalidade:</b> a IA imita um fragmento do pensamento ocidental, que mede e modela o mundo, e deixa outras formas de saber de fora.</li><li><b>Quem paga:</b> o trabalho de rotular dados e a extração de minérios ficam, em grande parte, no Sul Global.</li></ul><p>Por isso Monagreda diz que a IA não é nem tão inteligente nem tão artificial quanto parece.</p>'
  };
  var vp = document.getElementById("viewPanel"), vbtns = document.querySelectorAll("[data-view]");
  function setView(k){ vp.innerHTML = views[k]; vbtns.forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.view === k ? "true" : "false"); }); }
  vbtns.forEach(function(b){ b.addEventListener("click", function(){ setView(b.dataset.view); }); });
  setView("obj");

  // bússola
  var comp = document.getElementById("compass");
  document.getElementById("flipBtn").addEventListener("click", function(){ comp.classList.toggle("flip"); });

  // máscara
  var maskOn = false, mBtn = document.getElementById("maskBtn"), mShape = document.getElementById("maskShape"), mBox = document.getElementById("maskBox"), mNote = document.getElementById("maskNote");
  function updMask(){
    mShape.setAttribute("opacity", maskOn ? "1" : "0");
    mBox.className = "box" + (maskOn ? "" : " none");
    mBox.querySelector(".tag").textContent = maskOn ? "rosto 97%" : "nenhum rosto";
    mBtn.textContent = maskOn ? "Tirar a máscara" : "Colocar a máscara branca";
    mBtn.setAttribute("aria-pressed", maskOn ? "true" : "false");
    mNote.textContent = maskOn ? "Agora o sistema “vê” um rosto. Não o dela: o de uma máscara branca e genérica. Foi o que aconteceu com Joy Buolamwini, e é a cena que abre Coded Bias." : "Sem a máscara, o detector não encontra rosto nenhum.";
  }
  mBtn.addEventListener("click", function(){ maskOn = !maskOn; updMask(); }); updMask();

  // auditoria Gender Shades (tabela 4 do artigo)
  var audit = [
    {n:"Microsoft", v:[20.8, 6.0, 1.7, 0.0]},
    {n:"Face++",   v:[34.5, 0.7, 6.0, 0.8]},
    {n:"IBM",      v:[34.7, 12.0, 7.1, 0.3]}
  ];
  var groups = ["Mulheres de pele escura","Homens de pele escura","Mulheres de pele clara","Homens de pele clara"];
  var ab = document.getElementById("auditBars");
  groups.forEach(function(g, i){
    ab.insertAdjacentHTML("beforeend", '<div class="barrow"><span>' + g + '</span><div class="track"><div class="fill' + (i === 0 ? ' hot' : '') + '" id="ab' + i + '"></div></div><span class="val" id="av' + i + '"></span></div>');
  });
  var cobtns = document.querySelectorAll("[data-co]");
  function setCo(k){
    var a = audit[k];
    cobtns.forEach(function(b){ b.setAttribute("aria-pressed", +b.dataset.co === k ? "true" : "false"); });
    a.v.forEach(function(x, i){ document.getElementById("ab" + i).style.width = (x / 35 * 100) + "%"; document.getElementById("av" + i).textContent = fmt(x) + "%"; });
    var best = Math.max(Math.min.apply(null, a.v), 0.1);
    document.getElementById("auditNote").textContent = "No sistema da " + a.n + ", o erro para mulheres de pele escura foi de " + fmt(a.v[0]) + "%. " + (a.v[3] === 0 ? "Para homens de pele clara, foi zero." : "Para homens de pele clara, " + fmt(a.v[3]) + "%.");
  }
  cobtns.forEach(function(b){ b.addEventListener("click", function(){ setCo(+b.dataset.co); }); });
  setCo(0);

  // alertas de Londres: 104 alertas, 2 corretos
  var al = document.getElementById("alerts"), html = "";
  for(var i = 0; i < 104; i++){ html += '<i class="' + (i === 37 || i === 81 ? "t" : "f") + '"></i>'; }
  al.innerHTML = html;
  document.getElementById("alertsBtn").addEventListener("click", function(){
    al.classList.add("on");
    document.getElementById("alertsNote").textContent = "De 104 alertas, 102 apontaram pessoas inocentes. Só 2 identificações estavam corretas: mais de 98% de erro. No País de Gales, a taxa de alertas errados foi de 91%.";
    this.disabled = true;
  });

  // ciclo CTS
  var cyc = [
    ["Conhecimento","monopolizado","Classes dominantes concentram o conhecimento científico. Hoje, poucas empresas detêm os dados, os pesquisadores e o poder computacional."],
    ["Tecnologia","de controle","Esse conhecimento vira tecnologia para controlar a sociedade. Câmeras de reconhecimento facial são um exemplo atual."],
    ["Exploração","do ser humano","A tecnologia mantém a exploração do ser humano pelo ser humano. Cada clique gera riqueza que não volta para quem clicou, o que Marcello chama de escravidão digital."],
    ["Mais poder","para quem já tem","A riqueza e os dados extraídos reforçam o monopólio do conhecimento, e o ciclo recomeça. Para quebrá-lo, Marcello aposta em educação, política e software livre."]
  ];
  var cy = document.getElementById("cycle"), cp = document.getElementById("cyclePanel");
  cyc.forEach(function(c, i){ cy.insertAdjacentHTML("beforeend", '<button type="button" aria-pressed="false" data-cy="' + i + '"><b>' + (i+1) + '. ' + c[0] + '</b><small>' + c[1] + '</small></button>'); });
  function setCy(i){
    cy.querySelectorAll("button").forEach(function(b){ b.setAttribute("aria-pressed", +b.dataset.cy === i ? "true" : "false"); });
    cp.innerHTML = '<p>' + cyc[i][2] + '</p>' + (i === 3 ? '' : '<p><button class="btn btn-ghost" type="button" data-next="' + (i+1) + '">Próxima etapa</button></p>');
  }
  cy.addEventListener("click", function(e){ var b = e.target.closest("button"); if(b) setCy(+b.dataset.cy); });
  cp.addEventListener("click", function(e){ var b = e.target.closest("[data-next]"); if(b) setCy(+b.dataset.next); });
  setCy(0);

  // captcha
  var cap = document.getElementById("captcha");
  cap.addEventListener("click", function(){
    var on = cap.getAttribute("aria-pressed") !== "true";
    cap.setAttribute("aria-pressed", on ? "true" : "false");
    cap.querySelector(".ck").textContent = on ? "✓" : "";
    document.getElementById("captchaNote").textContent = on ? "Pronto: você acabou de provar a uma máquina que é humano. No teste original, era a máquina que tentava provar isso a nós. E, de quebra, seus movimentos viraram dados para treinar algum sistema." : "";
  });

  // abas
  var tabs = document.querySelectorAll('.tabs [role="tab"]');
  tabs.forEach(function(t){ t.addEventListener("click", function(){
    tabs.forEach(function(x){ var on = x === t; x.setAttribute("aria-selected", on ? "true" : "false"); document.getElementById(x.getAttribute("aria-controls")).hidden = !on; });
  });});

  // glossário
  var terms = {
    "algoritmo":"Sequência de instruções que um computador segue para resolver um problema ou tomar uma decisão.",
    "dados de treino":"Exemplos (fotos, textos, registros) usados para ensinar um sistema de IA a reconhecer padrões. O sistema só sabe o que esses dados mostram.",
    "racismo algorítmico":"Modo como sistemas computacionais reproduzem, automatizam e ampliam discriminações raciais, mesmo sem intenção explícita de quem os criou.",
    "viés":"Tendência sistemática de um sistema a favorecer ou prejudicar um grupo. Não é um erro aleatório: aponta sempre na mesma direção.",
    "falso positivo":"Quando o sistema diz “sim” e a resposta certa era “não”. No reconhecimento facial, apontar uma pessoa inocente como procurada.",
    "reconhecimento facial":"Tecnologia que mede traços do rosto para identificar ou verificar quem é uma pessoa a partir de uma imagem.",
    "capitalismo de vigilância":"Termo de Shoshana Zuboff para a lógica em que empresas lucram coletando dados sobre nosso comportamento para prevê-lo e modificá-lo.",
    "colonialismo de dados":"Ideia de que a extração de dados repete a lógica colonial de apropriação, agora sobre a vida, os afetos e as relações sociais.",
    "Sul Global":"Mais do que um lugar no mapa, uma posição marcada pelo legado colonial, de onde também se produzem conhecimento e resistência.",
    "auditoria algorítmica":"Avaliação independente de um sistema para verificar se ele funciona de forma justa, inclusive para grupos diferentes.",
    "LGPD":"Lei Geral de Proteção de Dados (Lei 13.709/2018). Entre outros direitos, permite pedir revisão de decisões tomadas apenas por meios automatizados."
  };
  var dlg = document.getElementById("gloss"), list = document.getElementById("glossList");
  Object.keys(terms).forEach(function(k){
    var dt = document.createElement("dt"); dt.textContent = k.charAt(0).toUpperCase() + k.slice(1); dt.id = "g-" + k.replace(/\s/g, "-");
    var dd = document.createElement("dd"); dd.textContent = terms[k];
    list.appendChild(dt); list.appendChild(dd);
  });
  function openGloss(term){
    list.querySelectorAll("dt").forEach(function(d){ d.classList.remove("hl"); });
    if(dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    if(term){ var el = document.getElementById("g-" + term.replace(/\s/g, "-")); if(el){ el.classList.add("hl"); el.scrollIntoView({block:"center"}); } }
  }
  document.getElementById("glossBtn").addEventListener("click", function(){ openGloss(); });
  document.getElementById("glossClose").addEventListener("click", function(){ dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
  document.querySelectorAll("[data-term]").forEach(function(b){ b.addEventListener("click", function(){ openGloss(b.dataset.term); }); });

  // quiz
  var qs = [
    ["Por que um algoritmo pode ser racista mesmo sem ninguém programar isso?", ["Porque computadores têm opinião própria","Porque aprende com dados que registram uma sociedade desigual","Porque só funciona com internet lenta"], 1, "Ele aprende padrões do passado. Se o passado é desigual, o padrão aprendido também é."],
    ["Em Gender Shades, qual grupo teve a maior taxa de erro?", ["Homens de pele clara","Mulheres de pele clara","Mulheres de pele escura"], 2, "O erro chegou a 34,7% para mulheres de pele escura, contra no máximo 0,8% para homens de pele clara."],
    ["Segundo a Rede de Observatórios da Segurança, quantos dos presos por reconhecimento facial em 2019 eram negros?", ["Cerca de 50%","90,5%","Menos de 30%"], 1, "90,5% nos casos com informação de raça, e a Bahia concentrou 52% das prisões."],
    ["Para Johanna Monagreda, olhar a IA “como sujeito” significa:", ["Tratar a IA como uma pessoa com sentimentos","Ver a IA como um sistema político-epistêmico, atravessado por relações de poder","Estudar apenas o código-fonte dos algoritmos"], 1, "Como sujeito, a IA revela quem decide, que racionalidade ela imita e quem paga o custo da sua produção."],
    ["No algoritmo de saúde dos Estados Unidos, por que pacientes negros eram prejudicados?", ["O sistema usava a raça como critério","O critério era o gasto prévio com saúde, menor entre pessoas negras por desigualdade histórica","Faltavam dados de pacientes brancos"], 1, "Um critério que parece neutro carregava a desigualdade de acesso à saúde. É o segundo tipo de viés descrito por Monagreda."],
    ["O que Marcello Chaves chama de Teste de Turing invertido?", ["Máquinas testando outras máquinas","O ser humano tendo de provar à máquina que é humano","Um teste para saber se a IA é ética"], 1, "No teste original, a máquina tentava se passar por humana. Hoje, somos nós que marcamos “não sou um robô”."],
    ["Se a base de treino ficar perfeitamente equilibrada, o problema acaba?", ["Sim, totalmente","Não, porque decidir onde e contra quem usar o sistema também gera injustiça","Sim, desde que a câmera seja cara"], 1, "Equilibrar os dados reduz o erro técnico, mas a escolha de onde vigiar continua sendo uma decisão política."]
  ];
  var box = document.getElementById("quizBox"), right = 0, answered = 0;
  qs.forEach(function(q, i){
    var w = document.createElement("div"); w.className = "q";
    var fs = document.createElement("fieldset");
    var lg = document.createElement("legend"); lg.textContent = (i+1) + ". " + q[0]; fs.appendChild(lg);
    var fbk = document.createElement("p"); fbk.className = "fb"; fbk.setAttribute("aria-live", "polite");
    q[1].forEach(function(o, j){
      var b = document.createElement("button"); b.type = "button"; b.className = "opt"; b.textContent = o;
      b.addEventListener("click", function(){
        fs.querySelectorAll(".opt").forEach(function(x, k){ x.disabled = true; if(k === q[2]) x.classList.add("right"); });
        var ok = j === q[2]; if(!ok) b.classList.add("wrong"); else right++;
        answered++;
        fbk.innerHTML = "<strong>" + (ok ? "Isso mesmo." : "Não exatamente.") + "</strong> " + q[3];
        if(answered === qs.length) document.getElementById("score").textContent = "Você acertou " + right + " de " + qs.length + ".";
      });
      fs.appendChild(b);
    });
    fs.appendChild(fbk); w.appendChild(fs); box.appendChild(w);
  });

  // progresso
  var ids = ["espelho","neutralidade","maquina","casos","resistencia","agora"];
  var links = document.querySelectorAll(".steps a");
  function onScroll(){
    var y = window.scrollY + window.innerHeight * 0.35, cur = -1;
    ids.forEach(function(id, i){ var el = document.getElementById(id); if(el && el.offsetTop <= y) cur = i; });
    if(document.getElementById("quiz").offsetTop <= y) cur = ids.length - 1;
    links.forEach(function(a, i){ a.classList.toggle("on", i <= cur); if(i === cur) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current"); });
  }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

  // abas do site (percurso x minijogos)
  var percEl = document.getElementById("percurso"), gamesEl = document.getElementById("minijogos"), vlinks = document.querySelectorAll(".views a");
  function route(){
    var h = location.hash.slice(1), g = h === "minijogos";
    percEl.hidden = g; gamesEl.hidden = !g;
    document.body.classList.toggle("is-games", g);
    vlinks.forEach(function(a){ if((a.dataset.v === "jogos") === g) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    if(g){ window.scrollTo(0, 0); }
    else if(h){ var t = document.getElementById(h); if(t) setTimeout(function(){ t.scrollIntoView(); }, 40); }
    onScroll();
  }
  window.addEventListener("hashchange", route); route();

  (function(){
    function norm(x){ return x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); }
    function shuffle(a){ a = a.slice(); for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

    // abas dos jogos
    var gtabs = document.querySelectorAll('#minijogos [role="tab"]'), activeGame = "g-forca";
    gtabs.forEach(function(t){ t.addEventListener("click", function(){
      gtabs.forEach(function(x){ var on = x === t; x.setAttribute("aria-selected", on ? "true" : "false"); document.getElementById(x.getAttribute("aria-controls")).hidden = !on; });
      activeGame = t.getAttribute("aria-controls");
    });});

    // ---------- FORCA ----------
    var FQ = [["ALGORITMO","Conjunto de instruções que um sistema segue para resolver um problema ou tomar decisões.","Algoritmos podem influenciar recomendações, seleções e classificações. Seus resultados dependem das regras e dos dados usados."],["VIES","Tendência sistemática que pode favorecer alguns grupos e prejudicar outros.","O viés algorítmico pode surgir de dados históricos, escolhas de projeto ou formas de avaliação. A palavra “viés” tem acento, mas aqui jogamos sem acentos."],["RACISMO","Discriminação racial que também pode ser reproduzida por sistemas automatizados.","Um sistema de reconhecimento facial, por exemplo, pode apresentar taxas de erro diferentes entre grupos raciais."],["DADOS","Informações usadas para treinar e avaliar modelos de inteligência artificial.","Dados pouco representativos ou marcados por desigualdades históricas podem contribuir para resultados injustos."],["EQUIDADE","Princípio de justiça que considera diferenças de condições e necessidades.","Buscar equidade na tecnologia significa investigar impactos desiguais e reduzir barreiras e discriminações."],["INCLUSAO","Prática de garantir que diferentes pessoas possam participar e se beneficiar da tecnologia.","Projetos inclusivos consideram acessibilidade e diferentes realidades sociais desde o início."],["TRANSPARENCIA","Qualidade de um sistema que permite compreender suas decisões e critérios.","Transparência ajuda pessoas a questionar decisões automatizadas e a identificar possíveis injustiças."],["DISCRIMINACAO","Tratamento injusto de pessoas com base em características ou pertencimento a grupos.","A discriminação algorítmica ocorre quando sistemas produzem ou reforçam desvantagens injustas para determinados grupos."],["DIVERSIDADE","Presença de diferentes perspectivas, experiências e grupos sociais.","Equipes e conjuntos de dados diversos podem ajudar a identificar pontos cegos, embora isso não elimine automaticamente o viés."],["AUDITORIA","Processo de examinar e testar um sistema para identificar problemas e riscos.","Auditorias podem comparar resultados entre grupos e verificar se sistemas estão funcionando de maneira justa."],["PRIVACIDADE","Direito de controlar e proteger informações pessoais.","A coleta de dados para sistemas de IA deve respeitar a privacidade e evitar usos discriminatórios."],["REPRESENTATIVIDADE","Característica de dados ou equipes que refletem adequadamente a variedade de pessoas afetadas.","A falta de representatividade pode fazer com que modelos funcionem pior para certos grupos."],["ACESSIBILIDADE","Condição que permite que pessoas com deficiência utilizem tecnologias.","Sistemas acessíveis consideram diferentes necessidades de interação."],["JUSTICA","Princípio de tratar pessoas de maneira justa.","Avaliar justiça exige observar quem é beneficiado ou prejudicado."],["ETICA","Reflexão sobre o que é correto e responsável.","A ética ajuda a orientar escolhas no desenvolvimento de IA."],["RESPONSABILIDADE","Dever de responder pelas consequências de decisões.","Empresas e instituições devem responder pelos efeitos de seus sistemas."],["EXPLICABILIDADE","Capacidade de apresentar razões compreensíveis para resultados.","Explicações podem ajudar a contestar decisões automatizadas."],["INTERPRETABILIDADE","Facilidade de compreender o funcionamento de um modelo.","Modelos interpretáveis podem facilitar investigações de erros."],["AUTOMACAO","Uso de sistemas para realizar tarefas com pouca intervenção humana.","Automatizar decisões não elimina a responsabilidade humana."],["APRENDIZADO","Processo pelo qual um modelo identifica padrões em exemplos.","Modelos podem aprender padrões discriminatórios presentes nos dados."],["TREINAMENTO","Etapa em que um modelo aprende com exemplos.","Dados e escolhas de treinamento afetam resultados."],["AMOSTRAGEM","Seleção de exemplos para formar um conjunto de dados.","Amostras desequilibradas podem excluir experiências importantes."],["ROTULAGEM","Atribuição de categorias aos dados.","Rótulos imprecisos podem transmitir preconceitos ao modelo."],["CLASSIFICACAO","Ato de separar elementos em categorias.","Classificadores podem cometer erros diferentes entre grupos."],["PREVISAO","Estimativa feita a partir de padrões anteriores.","Previsões não são certezas e podem reproduzir desigualdades."],["RECOMENDACAO","Sugestão automática de conteúdo ou produto.","Recomendações influenciam o que as pessoas veem."],["PERSONALIZACAO","Adaptação de resultados ao perfil de alguém.","Personalizar pode criar experiências úteis ou reforçar estereótipos."],["PERFILAMENTO","Criação de perfis a partir de dados sobre pessoas.","Perfis podem levar a tratamentos injustos."],["VIGILANCIA","Monitoramento de comportamentos e atividades.","Vigilância excessiva pode afetar direitos e liberdades."],["RECONHECIMENTO","Identificação de padrões em imagens ou sinais.","Sistemas de reconhecimento precisam ser testados entre diferentes grupos."],["BIOMETRIA","Uso de características físicas ou comportamentais para identificação.","Dados biométricos exigem proteção especial."],["IDENTIDADE","Conjunto de características que identificam alguém.","Inferir identidades automaticamente pode causar danos."],["ESTEREOTIPO","Ideia simplificada sobre um grupo de pessoas.","Estereótipos podem aparecer em dados e respostas de IA."],["PRECONCEITO","Julgamento antecipado sobre pessoas ou grupos.","Tecnologias podem reproduzir preconceitos humanos."],["DESIGUALDADE","Diferença injusta de oportunidades ou condições.","Dados históricos podem refletir desigualdades sociais."],["EXCLUSAO","Afastamento de pessoas de serviços ou oportunidades.","Sistemas mal projetados podem ampliar a exclusão."],["SEGREGACAO","Separação de grupos sociais em espaços ou oportunidades.","Decisões automatizadas podem reforçar segregações."],["MARGINALIZACAO","Processo de deixar grupos à margem da sociedade.","Tecnologias devem considerar pessoas historicamente marginalizadas."],["OPRESSAO","Relação de poder que limita direitos e oportunidades.","Sistemas podem reforçar estruturas de opressão."],["INTERSECCIONALIDADE","Análise de como diferentes formas de desigualdade se cruzam.","Uma pessoa pode sofrer impactos combinados de vários vieses."],["GENERO","Categoria social ligada a identidades e papéis.","Sistemas podem apresentar diferenças injustas entre gêneros."],["IDADE","Tempo de vida de uma pessoa.","Ferramentas automatizadas não devem discriminar por idade."],["DEFICIENCIA","Condição que pode envolver barreiras de acesso.","A falta de acessibilidade exclui pessoas com deficiência."],["TERRITORIO","Espaço geográfico vivido por uma comunidade.","Localização pode funcionar como indicador indireto de desigualdade."],["RENDA","Recursos financeiros recebidos por alguém.","Usar renda sem cuidado pode reforçar exclusões."],["CLASSE","Posição social ou econômica de um grupo.","Diferenças de classe influenciam acesso à tecnologia."],["EDUCACAO","Processo de aprendizagem e formação.","Tecnologia educacional deve atender estudantes diversos."],["SAUDE","Área relacionada ao bem-estar e ao cuidado.","Modelos na saúde precisam ser avaliados quanto a erros desiguais."],["EMPREGO","Ocupação profissional remunerada.","Filtros automáticos de currículos podem gerar discriminação."],["CREDITO","Possibilidade de obter recursos financeiros emprestados.","Pontuações de crédito podem prejudicar grupos injustamente."],["MORADIA","Lugar onde alguém vive.","Sistemas de seleção habitacional precisam evitar discriminação."],["SEGURANCA","Condição de proteção contra riscos.","Segurança tecnológica inclui prevenir danos sociais."],["CIDADANIA","Conjunto de direitos e deveres na sociedade.","A cidadania digital exige acesso e proteção de direitos."],["DIREITOS","Garantias fundamentais das pessoas.","Decisões algorítmicas devem respeitar direitos."],["DIGNIDADE","Valor inerente a toda pessoa.","Pessoas não devem ser reduzidas a pontuações automáticas."],["AUTONOMIA","Capacidade de tomar decisões próprias.","Usuários devem ter escolhas informadas sobre sistemas."],["CONSENTIMENTO","Autorização livre e informada para determinado uso.","O tratamento de dados requer bases legais apropriadas."],["PROTECAO","Ação de evitar danos e preservar direitos.","Proteger dados reduz riscos de abusos."],["GOVERNANCA","Regras e processos para dirigir e fiscalizar sistemas.","Boa governança define responsáveis e controles."],["REGULACAO","Criação de regras para orientar atividades.","Normas podem estabelecer limites para usos arriscados de IA."],["LEGISLACAO","Conjunto de leis aplicáveis a um assunto.","Leis de proteção de dados impõem obrigações."],["FISCALIZACAO","Acompanhamento do cumprimento de regras.","Fiscalização pode identificar práticas discriminatórias."],["PRESTACAO","Ato de apresentar informações sobre ações realizadas.","Prestar contas ajuda a responsabilizar organizações."],["CONTESTACAO","Ato de questionar uma decisão.","Pessoas devem poder questionar resultados injustos."],["RECURSO","Pedido de revisão de uma decisão.","Canais de recurso ajudam a corrigir erros automatizados."],["REVISAO","Nova análise de um resultado ou processo.","Revisões humanas podem detectar falhas."],["SUPERVISAO","Acompanhamento humano de uma atividade.","Supervisão adequada é importante em decisões sensíveis."],["MONITORAMENTO","Observação contínua do desempenho de um sistema.","Monitorar resultados ajuda a detectar vieses após a implantação."],["AVALIACAO","Exame da qualidade e dos efeitos de algo.","Avaliações devem considerar diferentes grupos afetados."],["VALIDACAO","Verificação de que um sistema atende ao objetivo.","Validar com dados variados reduz riscos de generalização indevida."],["TESTAGEM","Realização de testes para encontrar falhas.","Testes comparativos podem revelar diferenças de desempenho."],["METRICA","Medida usada para avaliar resultados.","Uma única métrica pode esconder injustiças."],["PRECISAO","Proporção de resultados corretos em determinada medida.","Precisão geral alta não garante equidade entre grupos."],["ERRO","Resultado incorreto produzido por um sistema.","Erros podem ter consequências diferentes para cada pessoa."],["FALSO","Algo que não corresponde à realidade.","Um resultado falso pode afetar uma decisão automatizada."],["POSITIVO","Categoria afirmativa em um classificador.","Falsos positivos podem gerar consequências injustas."],["NEGATIVO","Categoria de ausência em um classificador.","Falsos negativos também podem excluir pessoas."],["LIMIAR","Valor usado como ponto de corte para decisões.","Alterar limiares pode mudar os erros entre grupos."],["PADRAO","Regularidade identificada em informações.","Nem todo padrão estatístico deve orientar uma decisão."],["CORRELACAO","Relação estatística entre duas variáveis.","Correlação não prova causa e pode refletir desigualdades."],["CAUSALIDADE","Relação em que um fator provoca outro.","Investigar causas evita interpretações enganosas dos dados."],["CONTEXTO","Circunstâncias que ajudam a interpretar uma situação.","Dados fora de contexto podem levar a decisões injustas."],["HISTORICO","Conjunto de acontecimentos passados.","Registros históricos podem conter discriminações antigas."],["COLETA","Processo de reunir informações.","A forma de coletar dados influencia quem fica representado."],["QUALIDADE","Grau em que algo atende a critérios esperados.","Dados de baixa qualidade podem piorar desigualdades."],["LACUNA","Ausência de informação importante.","Lacunas nos dados podem tornar certos grupos invisíveis."],["SUBREPRESENTACAO","Presença insuficiente de um grupo em um conjunto.","Grupos sub-representados podem ter mais erros em modelos."],["SOBRERREPRESENTACAO","Presença excessiva de um grupo em comparação com outros.","Desequilíbrios na amostra podem distorcer o aprendizado."],["BALANCEAMENTO","Ajuste para reduzir desequilíbrios em dados.","Balancear dados é uma estratégia, não solução universal."],["GENERALIZACAO","Capacidade de funcionar em exemplos novos.","Um modelo pode falhar ao atender populações diferentes."],["DESLOCAMENTO","Mudança entre dados de treinamento e de uso.","Mudanças de contexto podem piorar o desempenho."],["PROXY","Variável usada como substituta de outra.","Uma variável indireta pode revelar características sensíveis."],["OPACIDADE","Dificuldade de entender como uma decisão foi produzida.","Opacidade dificulta a identificação de vieses."],["CAIXAPRETA","Expressão para um sistema cujo funcionamento é pouco compreensível.","Modelos de caixa-preta exigem cuidados adicionais de avaliação."],["DOCUMENTACAO","Registro de informações sobre um projeto ou sistema.","Documentar dados e limitações facilita auditorias."],["RASTREABILIDADE","Capacidade de acompanhar a origem de dados e decisões.","Rastreabilidade facilita investigar problemas."],["PARTICIPACAO","Envolvimento de pessoas em decisões coletivas.","Ouvir comunidades afetadas melhora o desenvolvimento tecnológico."],["COMUNIDADE","Grupo de pessoas com interesses ou vivências comuns.","Comunidades afetadas devem participar das decisões."],["ESCUTA","Atenção às experiências e necessidades de outras pessoas.","Escutar usuários ajuda a perceber danos não previstos."],["REPARACAO","Ação para corrigir ou compensar um dano.","Identificar discriminação deve levar a medidas de reparação."]];
    var deck = [], cur, errs = 0, pts = 0, round = 0, guessed, ended = false, over = false;
    var $ = function(id){ return document.getElementById(id); };
    var parts = document.querySelectorAll("#fSvg .f-part");
    function fNew(){
      if(over){ over = false; pts = 0; round = 0; deck = []; }
      if(!deck.length) deck = shuffle(FQ);
      cur = deck.pop(); round++; errs = 0; guessed = {}; ended = false;
      $("fExp").hidden = true; $("fMsg").textContent = "Escolha uma letra para começar.";
      $("fNext").textContent = "Próxima palavra"; $("fNext").disabled = true;
      $("fHint").textContent = cur[1];
      parts.forEach(function(p){ p.style.visibility = "hidden"; });
      var k = $("fKeys"); k.innerHTML = "";
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function(c){
        var b = document.createElement("button"); b.type = "button"; b.textContent = c; b.setAttribute("aria-label", "Letra " + c);
        b.addEventListener("click", function(){ fGuess(c); }); k.appendChild(b);
      });
      fRender();
    }
    function fRender(){
      var w = $("fWord"); w.innerHTML = "";
      cur[0].split("").forEach(function(c){
        var sp = document.createElement("span");
        if(guessed[c]) sp.textContent = c;
        else if(ended && errs >= 5){ sp.textContent = c; sp.className = "miss"; }
        w.appendChild(sp);
      });
      $("fErr").textContent = "Erros: " + errs + "/5"; $("fPts").textContent = "Pontos: " + pts; $("fRound").textContent = "Rodada " + round;
    }
    function fGuess(c){
      if(ended || guessed[c]) return;
      guessed[c] = true;
      var good = cur[0].indexOf(c) > -1;
      $("fKeys").querySelectorAll("button").forEach(function(b){ if(b.textContent === c){ b.disabled = true; b.classList.add(good ? "good" : "bad"); } });
      if(!good){ errs++; parts[errs - 1].style.visibility = "visible"; }
      var won = cur[0].split("").every(function(x){ return guessed[x]; });
      if(won || errs >= 5){
        ended = true;
        if(won){ pts += 10; $("fMsg").textContent = "Você acertou! Mais 10 pontos."; }
        else { over = true; $("fMsg").textContent = "Fim de jogo. A palavra era " + cur[0] + ". Pontuação final: " + pts + "."; }
        $("fKeys").querySelectorAll("button").forEach(function(b){ b.disabled = true; });
        $("fExp").innerHTML = "<strong>Você sabia?</strong> " + cur[2]; $("fExp").hidden = false;
        $("fNext").textContent = over ? "Jogar de novo" : "Próxima palavra"; $("fNext").disabled = false; $("fNext").focus();
      } else {
        $("fMsg").textContent = good ? "Boa! Essa letra está na palavra." : "Essa letra não aparece. Tente outra.";
      }
      fRender();
    }
    $("fNext").addEventListener("click", function(){ if(ended) fNew(); });
    document.addEventListener("keydown", function(e){
      if(gamesEl.hidden || activeGame !== "g-forca") return;
      if(e.ctrlKey || e.altKey || e.metaKey) return;
      var tg = e.target.tagName; if(tg === "INPUT" || tg === "TEXTAREA") return;
      var c = norm(e.key); if(/^[A-Z]$/.test(c)) fGuess(c);
    });
    fNew();

    // ---------- CAÇA-PALAVRAS ----------
    var WS = [
      ["ALGORITMO","Um algoritmo é uma sequência de instruções. Ele não é neutro: depende de quem o escreve e dos dados que recebe."],
      ["VIES","Viés é uma tendência que aponta sempre na mesma direção, favorecendo uns e prejudicando outros."],
      ["DADOS","Para Johanna Monagreda, o colonialismo de dados repete a lógica colonial de extração, agora sobre nossas vidas."],
      ["RACISMO","Racismo algorítmico é o modo como sistemas reproduzem e ampliam discriminações raciais, como descreve Tarcízio Silva."],
      ["VIGILANCIA","Capitalismo de vigilância é o termo de Shoshana Zuboff para o lucro obtido prevendo e moldando nosso comportamento."],
      ["BIOMETRIA","Rosto e digitais são dados biométricos. Em 2022, uma ação tentou barrar a coleta biométrica de 4 milhões de usuários do metrô de São Paulo."],
      ["AUDITORIA","A auditoria Gender Shades mostrou erro de até 34,7% para mulheres de pele escura em sistemas comerciais."],
      ["REPARACAO","Monagreda propõe uma linguagem de reparação: colocar o combate ao racismo como objetivo explícito dos sistemas."],
      ["COLONIALISMO","Pensar a IA a partir do Sul Global é questionar a colonialidade que ainda organiza quem extrai e quem é extraído."],
      ["PRIVACIDADE","Dados sobre raça são sensíveis. A LGPD exige cuidado especial no tratamento deles."]
    ];
    var N = 12, wsLetters, wsPlaced, wsFound, wsStart = null, wsDrag = false, wsLast = null, wsColorIx = 0;
    var FCOL = [["var(--t2)","#2a1a10"],["var(--t3)","#1c1008"],["var(--t4)","#fff"],["var(--t5)","#fff"],["var(--t6)","#fff"]];
    var DIRS = [[0,1],[1,0],[1,1],[-1,1]];
    var wsGrid = document.getElementById("wsGrid"), wsList = document.getElementById("wsList");
    function wsBuild(){
      for(var attempt = 0; attempt < 200; attempt++){
        var g = new Array(N * N).fill(""), placed = [], ok = true;
        var order = WS.slice().sort(function(a, b){ return b[0].length - a[0].length; });
        for(var k = 0; k < order.length && ok; k++){
          var w = order[k][0], done = false;
          for(var tries = 0; tries < 300 && !done; tries++){
            var d = DIRS[Math.floor(Math.random() * DIRS.length)];
            var r = Math.floor(Math.random() * N), c = Math.floor(Math.random() * N);
            var er = r + d[0] * (w.length - 1), ec = c + d[1] * (w.length - 1);
            if(er < 0 || er >= N || ec < 0 || ec >= N) continue;
            var fits = true;
            for(var i = 0; i < w.length; i++){ var ch = g[(r + d[0] * i) * N + c + d[1] * i]; if(ch && ch !== w[i]){ fits = false; break; } }
            if(!fits) continue;
            for(i = 0; i < w.length; i++) g[(r + d[0] * i) * N + c + d[1] * i] = w[i];
            placed.push(w); done = true;
          }
          if(!done) ok = false;
        }
        if(ok){
          var AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          for(var x = 0; x < g.length; x++) if(!g[x]) g[x] = AB[Math.floor(Math.random() * 26)];
          return g;
        }
      }
    }
    function wsNew(){
      wsLetters = wsBuild(); wsFound = {}; wsStart = null; wsColorIx = 0;
      wsGrid.innerHTML = "";
      wsLetters.forEach(function(ch, i){
        var b = document.createElement("button"); b.type = "button"; b.className = "ws-cell"; b.textContent = ch; b.dataset.i = i;
        b.setAttribute("aria-label", "Linha " + (Math.floor(i / N) + 1) + ", coluna " + (i % N + 1) + ": " + ch);
        wsGrid.appendChild(b);
      });
      wsList.innerHTML = "";
      WS.forEach(function(w){ var li = document.createElement("li"); li.textContent = w[0]; li.id = "ws-" + w[0]; wsList.appendChild(li); });
      document.getElementById("wsFact").textContent = "Cada palavra encontrada revela aqui uma explicação.";
      wsCount();
    }
    function wsCount(){ var n = Object.keys(wsFound).length; document.getElementById("wsCount").textContent = n === WS.length ? "Você encontrou todas as 10 palavras!" : n + " de " + WS.length + " encontradas"; }
    function wsLine(a, b){
      var ra = Math.floor(a / N), ca = a % N, rb = Math.floor(b / N), cb = b % N;
      var dr = rb - ra, dc = cb - ca;
      if(!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null;
      var len = Math.max(Math.abs(dr), Math.abs(dc)) + 1, sr = Math.sign(dr), sc = Math.sign(dc), out = [];
      for(var i = 0; i < len; i++) out.push((ra + sr * i) * N + ca + sc * i);
      return out;
    }
    function wsPreview(cells){
      wsGrid.querySelectorAll(".prev").forEach(function(c){ c.classList.remove("prev"); });
      (cells || []).forEach(function(i){ wsGrid.children[i].classList.add("prev"); });
    }
    function wsFinish(a, b){
      var cells = wsLine(a, b); wsPreview(null); wsStart = null;
      var fact = document.getElementById("wsFact");
      if(!cells || cells.length < 2){ return; }
      var str = cells.map(function(i){ return wsLetters[i]; }).join(""), rev = str.split("").reverse().join("");
      var hit = WS.filter(function(w){ return (w[0] === str || w[0] === rev) && !wsFound[w[0]]; })[0];
      if(!hit){ fact.textContent = "Essa sequência não forma uma das palavras da lista. Tente outra."; return; }
      wsFound[hit[0]] = true;
      var col = FCOL[wsColorIx++ % FCOL.length];
      cells.forEach(function(i){ var el = wsGrid.children[i]; el.classList.add("found"); el.style.setProperty("--fc", col[0]); el.style.setProperty("--fi", col[1]); });
      document.getElementById("ws-" + hit[0]).classList.add("done");
      fact.innerHTML = "<strong>" + hit[0] + ":</strong> " + hit[1];
      wsCount();
    }
    function cellAt(x, y){ var el = document.elementFromPoint(x, y); el = el && el.closest ? el.closest(".ws-cell") : null; return el && wsGrid.contains(el) ? +el.dataset.i : null; }
    wsGrid.addEventListener("pointerdown", function(e){
      var i = cellAt(e.clientX, e.clientY); if(i === null) return;
      e.preventDefault();
      if(wsStart === null){ wsStart = i; wsDrag = true; wsLast = i; wsPreview([i]); }
      else { wsFinish(wsStart, i); wsDrag = false; }
    });
    wsGrid.addEventListener("pointermove", function(e){
      if(!wsDrag || wsStart === null) return;
      var i = cellAt(e.clientX, e.clientY); if(i === null || i === wsLast) return;
      wsLast = i; wsPreview(wsLine(wsStart, i) || [wsStart]);
    });
    document.addEventListener("pointerup", function(){
      if(!wsDrag) return; wsDrag = false;
      if(wsStart !== null && wsLast !== null && wsLast !== wsStart) wsFinish(wsStart, wsLast);
    });
    wsGrid.addEventListener("click", function(e){
      if(e.detail !== 0) return; // só ativação por teclado
      var el = e.target.closest(".ws-cell"); if(!el) return; var i = +el.dataset.i;
      if(wsStart === null){ wsStart = i; wsPreview([i]); } else wsFinish(wsStart, i);
    });
    document.getElementById("wsNew").addEventListener("click", wsNew);
    wsNew();

    // ---------- PALAVRAS CRUZADAS ----------
    var CW = { rows:12, cols:13, words:[
      ["TURING",0,2,"H","Teste que, para Marcello Chaves, foi invertido: hoje somos nós que provamos à máquina que somos humanos."],
      ["LGPD",0,9,"H","Sigla da lei brasileira que permite pedir revisão de decisões automatizadas."],
      ["ALGORITMO",3,4,"H","Sequência de instruções que um sistema segue para tomar decisões."],
      ["ETICA",5,0,"H","Vem do grego ethos. Para Marcello Chaves, começa por se colocar no lugar do outro."],
      ["VIES",5,8,"H","Tendência sistemática que favorece uns e prejudica outros."],
      ["MASCARA",7,3,"H","O que Joy Buolamwini precisou vestir para ser detectada, em Coded Bias."],
      ["AUDITORIA",10,2,"H","Avaliação independente, como Gender Shades, que mede se um sistema é justo para todos os grupos."],
      ["REPARACAO",0,4,"V","Linguagem moral que Johanna Monagreda propõe contra o racismo algorítmico."],
      ["DADOS",0,12,"V","Matéria-prima da IA. Monagreda fala em colonialismo de ___."],
      ["BAHIA",2,2,"V","Estado que concentrou 52% das prisões por reconhecimento facial no Brasil em 2019."],
      ["VIGILANCIA",2,9,"V","Capitalismo de ___: termo de Shoshana Zuboff."],
      ["SUL",5,11,"V","“Nosso norte é o ___”, escreveu Torres García. Daí a ideia de ___ Global."]
    ]};
    var cells = {}, cwWords = [], curW = 0, curDir = "H";
    CW.words.forEach(function(w, wi){
      var o = { a:w[0], r:w[1], c:w[2], d:w[3], q:w[4], cells:[] };
      for(var i = 0; i < o.a.length; i++){
        var r = o.r + (o.d === "V" ? i : 0), c = o.c + (o.d === "H" ? i : 0), key = r + "," + c;
        if(!cells[key]) cells[key] = { r:r, c:c, ch:o.a[i], words:{} };
        cells[key].words[o.d] = wi; o.cells.push(key);
      }
      cwWords.push(o);
    });
    var num = 0;
    for(var r = 0; r < CW.rows; r++) for(var c = 0; c < CW.cols; c++){
      var starts = cwWords.filter(function(w){ return w.r === r && w.c === c; });
      if(starts.length){ num++; starts.forEach(function(w){ w.n = num; }); cells[r + "," + c].n = num; }
    }
    var cwGrid = document.getElementById("cwGrid");
    for(r = 0; r < CW.rows; r++) for(c = 0; c < CW.cols; c++){
      var div = document.createElement("div"), cell = cells[r + "," + c];
      if(cell){
        div.className = "cw-cell"; div.dataset.k = r + "," + c;
        div.innerHTML = (cell.n ? '<span class="cw-num">' + cell.n + '</span>' : '') + '<input maxlength="2" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Linha ' + (r+1) + ', coluna ' + (c+1) + '">';
        cell.el = div; cell.inp = div.querySelector("input");
      }
      cwGrid.appendChild(div);
    }
    function clueBtn(w, wi){ return '<li><button type="button" data-w="' + wi + '"><b>' + w.n + '</b>' + w.q + ' (' + w.a.length + ')</button></li>'; }
    var hHtml = "", vHtml = "";
    cwWords.map(function(w, wi){ return [w, wi]; }).sort(function(x, y){ return x[0].n - y[0].n; }).forEach(function(p){ if(p[0].d === "H") hHtml += clueBtn(p[0], p[1]); else vHtml += clueBtn(p[0], p[1]); });
    document.getElementById("cwH").innerHTML = hHtml; document.getElementById("cwV").innerHTML = vHtml;
    var clueBtns = document.querySelectorAll(".cw-clues button");
    var focusKey = null;
    function paint(){
      Object.keys(cells).forEach(function(k){ cells[k].el.classList.remove("word", "cur"); });
      cwWords[curW].cells.forEach(function(k){ cells[k].el.classList.add("word"); });
      if(focusKey) cells[focusKey].el.classList.add("cur");
      clueBtns.forEach(function(b){ b.classList.toggle("on", +b.dataset.w === curW); });
      var w = cwWords[curW];
      document.getElementById("cwCur").innerHTML = "<strong>" + w.n + " " + (w.d === "H" ? "horizontal" : "vertical") + ":</strong> " + w.q;
    }
    function selectCell(k, toggle){
      var cell = cells[k], ws = cell.words;
      if(toggle && ws.H !== undefined && ws.V !== undefined) curDir = curDir === "H" ? "V" : "H";
      else if(ws[curDir] === undefined) curDir = ws.H !== undefined ? "H" : "V";
      curW = ws[curDir]; focusKey = k; paint();
    }
    Object.keys(cells).forEach(function(k){
      var inp = cells[k].inp;
      inp.addEventListener("mousedown", function(){ if(focusKey === k && document.activeElement === inp) selectCell(k, true); });
      inp.addEventListener("focus", function(){ if(focusKey !== k) selectCell(k, false); });
      inp.addEventListener("input", function(){
        var v = norm(inp.value).replace(/[^A-Z]/g, ""); v = v.slice(-1); inp.value = v;
        cells[k].el.classList.remove("bad", "ok");
        if(v){ var ws = cwWords[curW].cells, i = ws.indexOf(k); if(i > -1 && i < ws.length - 1) cells[ws[i + 1]].inp.focus(); }
        cwDone();
      });
      inp.addEventListener("keydown", function(e){
        var ws = cwWords[curW].cells, i = ws.indexOf(k);
        if(e.key === "Backspace" && !inp.value && i > 0){ e.preventDefault(); var pk = ws[i - 1]; cells[pk].inp.value = ""; cells[pk].inp.focus(); }
        var mv = { ArrowRight:[0,1], ArrowLeft:[0,-1], ArrowDown:[1,0], ArrowUp:[-1,0] }[e.key];
        if(mv){
          e.preventDefault(); var rr = cells[k].r + mv[0], cc = cells[k].c + mv[1];
          while(rr >= 0 && rr < CW.rows && cc >= 0 && cc < CW.cols){ var nk = rr + "," + cc; if(cells[nk]){ curDir = mv[0] ? "V" : "H"; cells[nk].inp.focus(); selectCell(nk, false); break; } rr += mv[0]; cc += mv[1]; }
        }
      });
    });
    clueBtns.forEach(function(b){ b.addEventListener("click", function(){
      var w = cwWords[+b.dataset.w]; curDir = w.d;
      var k = w.cells.filter(function(x){ return !cells[x].inp.value; })[0] || w.cells[0];
      focusKey = null; cells[k].inp.focus(); selectCell(k, false);
    });});
    function solved(w){ return w.cells.every(function(k){ return cells[k].inp.value === cells[k].ch; }); }
    function cwDone(){
      if(cwWords.every(solved)){
        clueBtns.forEach(function(b){ b.classList.add("solved"); });
        document.getElementById("cwMsg").textContent = "Parabéns! Você completou as palavras cruzadas. Todas as respostas aparecem no percurso e nas palestras.";
      }
    }
    document.getElementById("cwCheck").addEventListener("click", function(){
      var wrong = 0, empty = 0;
      Object.keys(cells).forEach(function(k){
        var cl = cells[k]; cl.el.classList.remove("bad", "ok");
        if(!cl.inp.value) empty++; else if(cl.inp.value !== cl.ch){ cl.el.classList.add("bad"); wrong++; } else cl.el.classList.add("ok");
      });
      cwWords.forEach(function(w, wi){ document.querySelector('.cw-clues button[data-w="' + wi + '"]').classList.toggle("solved", solved(w)); });
      document.getElementById("cwMsg").textContent = wrong ? wrong + (wrong === 1 ? " letra errada, marcada em vermelho." : " letras erradas, marcadas em vermelho.") + (empty ? " Faltam " + empty + " casas." : "") : (empty ? "Até aqui, tudo certo. Faltam " + empty + " casas." : "Tudo certo!");
      cwDone();
    });
    document.getElementById("cwReveal").addEventListener("click", function(){
      cwWords[curW].cells.forEach(function(k){ cells[k].inp.value = cells[k].ch; cells[k].el.classList.remove("bad"); });
      document.querySelector('.cw-clues button[data-w="' + curW + '"]').classList.add("solved"); cwDone();
    });
    document.getElementById("cwClear").addEventListener("click", function(){
      Object.keys(cells).forEach(function(k){ cells[k].inp.value = ""; cells[k].el.classList.remove("bad", "ok"); });
      clueBtns.forEach(function(b){ b.classList.remove("solved"); }); document.getElementById("cwMsg").textContent = "";
    });
    curW = 0; paint();
  })();

})();
