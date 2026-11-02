(() => {
'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const COLS=21,ROWS=15,TILE=32,CHALLENGES=5,LEVELS=3;

const questions=[
{t:'Dados de treinamento',q:'Um sistema foi treinado com exemplos de apenas uma parte da população. O que pode acontecer?',a:['Ele será imparcial por definição.','Pode funcionar pior para grupos pouco representados.','A quantidade e a variedade dos dados não fazem diferença.'],c:1,e:'Dados pouco diversos podem fazer o sistema aprender padrões que não representam bem toda a população.'},
{t:'Seleção de candidatos',q:'Uma empresa usa decisões antigas para treinar um algoritmo de contratação. Qual cuidado é necessário?',a:['Verificar se as decisões antigas reproduzem desigualdades.','Aceitar o histórico como neutro porque contém números.','Retirar toda participação humana sem avaliar os resultados.'],c:0,e:'Registros históricos podem refletir desigualdades sociais. Automatizá-los pode reproduzir essas desigualdades.'},
{t:'Reconhecimento facial',q:'Um sistema apresenta taxas de erro diferentes entre grupos. Qual é a atitude mais responsável?',a:['Ignorar a diferença se a média geral for boa.','Investigar os dados e testar o desempenho em diferentes grupos.','Afirmar que a tecnologia é sempre objetiva.'],c:1,e:'Avaliações por grupo ajudam a revelar falhas que uma média geral pode esconder.'},
{t:'Recomendações',q:'Uma plataforma recomenda sempre conteúdos muito parecidos. Qual risco pode surgir?',a:['Uma bolha informacional, com menos contato com outras perspectivas.','Garantia de acesso a todas as opiniões.','Fim automático da desinformação.'],c:0,e:'Recomendações repetitivas podem limitar a diversidade de informações que uma pessoa encontra.'},
{t:'Critérios aparentemente neutros',q:'Um algoritmo usa o CEP como critério para avaliar crédito. Por que isso merece atenção?',a:['Porque localização nunca tem relação com desigualdade.','Porque CEP é sempre um dado proibido.','Porque pode funcionar como indicador indireto de condições sociais desiguais.'],c:2,e:'Uma variável aparentemente neutra pode estar associada a fatores sociais e produzir impactos desiguais.'},
{t:'Transparência',q:'Por que é importante explicar como uma decisão automatizada foi tomada?',a:['Para permitir auditoria, contestação e identificação de erros.','Para impedir que as pessoas questionem o resultado.','Porque explicações substituem testes de qualidade.'],c:0,e:'Transparência ajuda pessoas afetadas e especialistas a entender, avaliar e contestar decisões.'},
{t:'Responsabilidade',q:'Quem deve se preocupar com possíveis danos causados por um sistema automatizado?',a:['Somente o computador.','As organizações e pessoas que projetam, implantam e utilizam o sistema.','Ninguém, pois o resultado é automático.'],c:1,e:'Automação não elimina a responsabilidade humana e institucional pelas escolhas e consequências.'},
{t:'Representatividade',q:'O que pode ajudar a reduzir problemas causados por grupos ausentes nos dados?',a:['Usar dados mais diversos e avaliar limitações do conjunto.','Apagar os resultados que parecem diferentes.','Treinar sempre com menos exemplos.'],c:0,e:'Representatividade, documentação e avaliação contínua ajudam a revelar lacunas nos dados.'},
{t:'Discriminação indireta',q:'Uma regra não menciona raça ou gênero, mas prejudica desproporcionalmente um grupo. Isso pode ser:',a:['Uma prova de que não existe viés.','Discriminação indireta ou impacto desigual.','Apenas um problema de velocidade.'],c:1,e:'Uma regra pode gerar impacto discriminatório mesmo sem usar explicitamente uma característica protegida.'},
{t:'Auditoria',q:'Qual é uma finalidade de auditar um algoritmo?',a:['Verificar desempenho, riscos e impactos em diferentes grupos.','Garantir que ele nunca mais precise de revisão.','Esconder como os dados foram utilizados.'],c:0,e:'Auditorias ajudam a encontrar falhas, medir impactos e orientar correções.'},
{t:'Dados incompletos',q:'Se certos grupos aparecem pouco em um conjunto de dados, o que deve ser feito?',a:['Assumir que os dados representam todos.','Investigar a lacuna e buscar dados adequados, respeitando a privacidade.','Inventar registros para preencher a amostra.'],c:1,e:'É necessário entender quem está ausente e melhorar a coleta de forma ética e responsável.'},
{t:'Automação',q:'Uma decisão feita por IA deve ser aceita sem questionamento?',a:['Sim, porque máquinas não cometem erros.','Sim, desde que seja rápida.','Não. Resultados importantes precisam de avaliação e possibilidade de contestação.'],c:2,e:'Sistemas podem errar. Decisões relevantes devem ter mecanismos de revisão e contestação.'},
{t:'Privacidade',q:'Ao coletar dados para treinar um sistema, qual princípio deve ser considerado?',a:['Coletar tudo, mesmo sem necessidade.','Coletar apenas o necessário e proteger as informações pessoais.','Compartilhar todos os dados publicamente.'],c:1,e:'A minimização de dados e a proteção da privacidade reduzem riscos para as pessoas.'},
{t:'Viés algorítmico',q:'O que significa viés algorítmico?',a:['Uma tendência sistemática que pode favorecer ou prejudicar certos grupos.','Qualquer erro aleatório de digitação.','Uma característica exclusiva de algoritmos antigos.'],c:0,e:'Vieses podem surgir dos dados, das escolhas de projeto, das métricas e do contexto de uso.'},
{t:'Métricas',q:'Por que avaliar apenas a precisão geral de um modelo pode ser insuficiente?',a:['Porque a precisão nunca é útil.','Porque uma média pode esconder diferenças de desempenho entre grupos.','Porque grupos diferentes sempre devem ter resultados idênticos.'],c:1,e:'Métricas desagregadas podem mostrar disparidades que ficam escondidas na média.'},
{t:'Contexto social',q:'Por que o contexto social importa ao desenvolver tecnologia?',a:['Porque tecnologia existe separada da sociedade.','Porque impactos dependem de como sistemas são usados e de quem é afetado.','Porque contexto só importa depois de um erro.'],c:1,e:'Tecnologias são criadas e usadas em contextos sociais, com efeitos reais sobre pessoas.'},
{t:'Correção de problemas',q:'Ao descobrir um resultado discriminatório, qual deve ser o próximo passo?',a:['Investigar a causa, envolver pessoas afetadas e corrigir e reavaliar o sistema.','Apagar a reclamação.','Mudar apenas a aparência da interface.'],c:0,e:'A resposta exige investigação, participação, correção e acompanhamento dos efeitos.'},
{t:'Inclusão',q:'Qual prática contribui para desenvolver sistemas mais inclusivos?',a:['Projetar sem ouvir os usuários.','Considerar diferentes experiências e envolver grupos afetados no processo.','Usar sempre o mesmo teste para qualquer contexto.'],c:1,e:'A participação de diferentes grupos ajuda a identificar necessidades e riscos ignorados.'},
{t:'Decisão automatizada',q:'Uma pessoa foi prejudicada por uma decisão automatizada. O que é importante garantir?',a:['Um canal para entender e contestar a decisão.','Que não exista contato com a organização.','Que o sistema não registre explicações.'],c:0,e:'Mecanismos de explicação, revisão e contestação são importantes para proteger direitos.'},
{t:'Ética em IA',q:'Uma tecnologia pode ser tecnicamente eficiente e ainda assim ser injusta?',a:['Não, eficiência sempre significa justiça.','Sim, desempenho técnico não garante impactos justos.','Não, se foi criada por especialistas.'],c:1,e:'Um sistema pode cumprir sua tarefa e ainda distribuir benefícios e danos de maneira desigual.'},
{t:'Policiamento preditivo',q:'Um sistema indica mais policiamento em bairros que já recebem mais policiamento. Qual risco?',a:['Reforçar um ciclo de mais abordagens em áreas já marginalizadas.','Melhorar automaticamente a segurança de todos.','Eliminar o preconceito policial.'],c:0,e:'Se treinado com dados de policiamento desigual, o sistema pode reforçar o próprio viés.'},
{t:'Saúde',q:'Um algoritmo de saúde usa gastos históricos como proxy de necessidade. Por que é problemático?',a:['Porque pacientes negros historicamente recebem menos recursos, e o sistema aprende isso como "menor necessidade".','Porque gastos nunca importam.','Porque proxy é sempre proibido.'],c:0,e:'O caso Obermeyer (2019) mostrou como proxies podem esconder desigualdades no acesso à saúde.'},
{t:'Crédito',q:'Um sistema de crédito nega empréstimo com base em dados de localização. Isso pode ser:',a:['Uma decisão justa porque não usa raça.','Discriminação indireta, pois localização reflete desigualdades raciais e socioeconômicas.','Uma exigência legal.'],c:1,e:'Mesmo sem usar raça explicitamente, o efeito pode ser discriminatório.'},
{t:'Moderação de conteúdo',q:'Sistemas automáticos de moderação podem ser problemáticos porque:',a:['Sempre removem conteúdo correto.','Podem ter vieses que afetam desproporcionalmente criadores de grupos minoritários.','Nunca erram.'],c:1,e:'A moderação automatizada pode reproduzir vieses e silenciar certas vozes.'},
{t:'Chatbots',q:'Um assistente virtual responde de forma estereotipada sobre profissões. Isso indica:',a:['Que ele é neutro.','Que o modelo aprendeu vieses dos textos de treinamento.','Que o problema é do usuário.'],c:1,e:'Modelos de linguagem aprendem associações presentes nos dados humanos, incluindo preconceitos.'},
{t:'Tradução automática',q:'Um tradutor automático converte "nurse" sempre como feminino e "doctor" como masculino. Isso é:',a:['Viés de gênero reproduzido pelo modelo.','Uma regra gramatical correta.','Um erro do usuário.'],c:0,e:'Estereótipos de gênero presentes nos dados aparecem nas traduções.'},
{t:'Reconhecimento de voz',q:'Assistentes de voz erram mais com vozes femininas e de sotaques regionais. Isso sugere:',a:['Que o sistema é neutro.','Que os dados de treinamento foram pouco diversos.','Que o usuário fala errado.'],c:1,e:'Falta de diversidade nos dados de áudio gera falhas sistemáticas.'},
{t:'IA generativa',q:'Modelos de imagem podem gerar apenas médicos homens brancos. Isso indica:',a:['Que o modelo reflete estereótipos dos dados.','Que a medicina é só para homens.','Que a IA é neutra.'],c:0,e:'Modelos generativos reproduzem padrões e estereótipos presentes nos dados.'},
{t:'Justiça distributiva',q:'O que significa justiça distributiva em IA?',a:['Distribuir códigos igualmente.','Garantir que benefícios e ônus dos sistemas sejam distribuídos de forma justa.','Distribuir computadores.'],c:1,e:'Justiça distributiva olha para quem ganha e quem perde com as decisões algorítmicas.'},
{t:'Justiça procedimental',q:'O que significa justiça procedimental em IA?',a:['Ter um processo judicial.','Garantir transparência, participação e possibilidade de contestação.','Processar os algoritmos.'],c:1,e:'Processos justos incluem explicabilidade e canais de contestação.'},
{t:'Direito à explicação',q:'O que é o direito à explicação?',a:['Explicar tudo a todos.','Obter explicações sobre decisões automatizadas que afetam a pessoa.','Um tutorial de programação.'],c:1,e:'A LGPD (art. 20) assegura esse direito no Brasil.'},
{t:'LGPD',q:'Qual lei brasileira prevê revisão de decisões automatizadas?',a:['Código Penal','LGPD','CLT','Código de Trânsito'],c:1,e:'A Lei Geral de Proteção de Dados (LGPD) assegura esse direito.'},
{t:'Interseccionalidade',q:'Uma mulher negra pode sofrer discriminação diferente de um homem negro ou de uma mulher branca. Isso se chama:',a:['Interseccionalidade.','Neutralidade.','Aleatoriedade.'],c:0,e:'Interseccionalidade considera a sobreposição de identidades e formas únicas de discriminação.'},
{t:'Auditoria externa',q:'Qual o papel de auditorias externas em sistemas de IA?',a:['Aumentar o lucro.','Verificar de forma independente se o sistema é justo e seguro.','Substituir a responsabilidade das empresas.'],c:1,e:'Auditorias independentes ajudam a revelar problemas que a própria empresa pode não ver.'},
{t:'Dados sintéticos',q:'Dados sintéticos podem ser usados para:',a:['Substituir toda a pesquisa.','Complementar conjuntos enviesados, com cuidado para não introduzir novos vieses.','Aumentar o preconceito.'],c:1,e:'Podem ajudar a balancear dados, mas exigem avaliação cuidadosa.'},
{t:'Participação pública',q:'Por que envolver a sociedade no design de sistemas de IA?',a:['Para aumentar o custo.','Para identificar riscos e necessidades que especialistas podem não perceber.','Para atrasar o projeto.'],c:1,e:'Participação ajuda a construir sistemas mais justos e adequados ao contexto.'},
{t:'Regulação',q:'O PL 2338/23 no Brasil trata de:',a:['Regulamentação do uso de inteligência artificial.','Construção civil.','Trânsito.'],c:0,e:'O projeto busca regulamentar IA no Brasil, incluindo transparência e responsabilização.'},
{t:'EU AI Act',q:'O EU AI Act classifica reconhecimento facial em tempo real em espaços públicos como:',a:['Risco mínimo.','Risco inaceitável, com exceções.','Risco baixo.'],c:1,e:'A lei europeia classifica como inaceitável, com exceções específicas.'},
{t:'Capitalismo de vigilância',q:'O conceito de "capitalismo de vigilância" foi desenvolvido por:',a:['Shoshana Zuboff.','Cathy O\'Neil.','Safiya Noble.'],c:0,e:'Zuboff analisa o modelo econômico baseado em extração de dados para prever e influenciar comportamento.'},
{t:'New Jim Code',q:'O conceito de "New Jim Code" foi cunhado por:',a:['Ruha Benjamin.','Safiya Noble.','Joy Buolamwini.'],c:0,e:'Ruha Benjamin analisa como tecnologias podem reforçar discriminação racial.'},
{t:'Algorithms of Oppression',q:'O livro "Algorithms of Oppression" é de autoria de:',a:['Safiya Umoja Noble.','Cathy O\'Neil.','Virginia Eubanks.'],c:0,e:'Safiya Noble analisa como mecanismos de busca reproduzem racismo e sexismo.'},
{t:'Weapons of Math Destruction',q:'A tese central de "Weapons of Math Destruction" (Cathy O\'Neil) é:',a:['Algoritmos são neutros.','Modelos opacos de grande escala podem amplificar desigualdades.','IA é sempre benéfica.'],c:1,e:'O\'Neil mostra como modelos opacos podem amplificar desigualdades em crédito, trabalho e educação.'},
{t:'Gender Shades',q:'O caso "Gender Shades" (Buolamwini & Gebru, 2018) analisou o quê?',a:['Viés de gênero em brinquedos.','Desempenho de reconhecimento facial por gênero e tom de pele.','Viés em crédito.'],c:1,e:'O estudo revelou taxas de erro muito maiores para mulheres de pele escura em sistemas comerciais.'},
{t:'Colonialismo de dados',q:'O conceito de "colonialismo de dados" é desenvolvido por:',a:['Couldry e Mejias.','Zuboff.','Floridi.'],c:0,e:'Couldry e Mejias analisam a extração de dados de comunidades marginalizadas sem benefício local.'},
{t:'Accountability',q:'O que é accountability em IA?',a:['Conta bancária.','Responsabilização por decisões automatizadas.','Contabilidade.'],c:1,e:'Significa que deve haver alguém responsável quando um sistema causa dano.'},
{t:'Caixa-preta',q:'O que é caixa-preta em IA?',a:['Servidor seguro.','Sistema cujas decisões são difíceis de explicar.','Criptografia.'],c:1,e:'A opacidade dificulta contestação e fiscalização de decisões automatizadas.'},
{t:'Feedback loop',q:'O que é feedback loop em algoritmos?',a:['Alto-falante.','Ciclo em que decisões enviesadas geram mais viés.','Erro de rede.'],c:1,e:'Decisões enviesadas geram mais dados enviesados, reforçando o ciclo.'},
{t:'Proxy',q:'O que é um proxy em algoritmos?',a:['Servidor intermediário.','Variável que substitui outra e pode perpetuar discriminação.','Firewall.'],c:1,e:'Exemplo: CEP pode funcionar como proxy para raça, gerando discriminação indireta.'},
{t:'Exclusão digital',q:'O que é exclusão digital?',a:['Excluir arquivos.','Falta de acesso ou representação de grupos no digital.','Apagar usuário.'],c:1,e:'Comunidades sem conectividade ficam fora dos dados de treinamento e dos benefícios da tecnologia.'}
];

let grid=[],player={x:1,y:1,px:1,py:1},markers=[],chosen=[],solved=new Set(),score=0,level=1,paused=false,exit=null;
let usedInRun=new Set();
let answeringLocked=false;
let held=new Set(),moveAccumulator=0,lastTime=0,moveInterval=125;
const $=id=>document.getElementById(id);
const dirs={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]};
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function generateMaze(){
  grid=Array.from({length:ROWS},()=>Array(COLS).fill(1));
  const stack=[[1,1]];grid[1][1]=0;
  while(stack.length){
    const [x,y]=stack[stack.length-1],options=shuffle([[0,-2],[0,2],[-2,0],[2,0]]);
    let found=false;
    for(const [dx,dy] of options){const nx=x+dx,ny=y+dy;
      if(nx>0&&nx<COLS-1&&ny>0&&ny<ROWS-1&&grid[ny][nx]===1){
        grid[y+dy/2][x+dx/2]=0;grid[ny][nx]=0;stack.push([nx,ny]);found=true;break;
      }
    }
    if(!found)stack.pop();
  }
  for(let i=0;i<Math.floor(COLS*ROWS*.035);i++){
    const x=1+Math.floor(Math.random()*(COLS-2)),y=1+Math.floor(Math.random()*(ROWS-2));
    if(grid[y][x]===1){
      const horizontal=grid[y][x-1]===0&&grid[y][x+1]===0;
      const vertical=grid[y-1][x]===0&&grid[y+1][x]===0;
      if(horizontal||vertical)grid[y][x]=0;
    }
  }
  player={x:1,y:1,px:1,py:1};
  exit={x:COLS-2,y:ROWS-2};
  const distances=Array.from({length:ROWS},()=>Array(COLS).fill(-1)),queue=[[1,1]];distances[1][1]=0;
  for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){const nx=x+dx,ny=y+dy;if(grid[ny]?.[nx]===0&&distances[ny][nx]===-1){distances[ny][nx]=distances[y][x]+1;queue.push([nx,ny]);}}}
  let far=[1,1],max=-1;for(const [x,y] of queue){if(distances[y][x]>max){max=distances[y][x];far=[x,y];}}exit={x:far[0],y:far[1]};
  const candidates=queue.filter(([x,y])=>!(x===1&&y===1)&&!(x===exit.x&&y===exit.y));
  shuffle(candidates);
  const pick=candidates.slice(0,Math.min(CHALLENGES,candidates.length));
  markers=pick.map(([x,y],i)=>({x,y,q:chosen[i]}));
}
function chooseQuestions(){
  let pool=[...Array(questions.length).keys()].filter(i=>!usedInRun.has(i));
  if(pool.length<CHALLENGES){usedInRun=new Set();pool=[...Array(questions.length).keys()];}
  chosen=shuffle(pool).slice(0,CHALLENGES);
  chosen.forEach(i=>usedInRun.add(i));
}
function startPhase(){
  paused=false;answeringLocked=false;solved=new Set();held.clear();moveAccumulator=0;
  chooseQuestions();generateMaze();
  $('level').textContent=`${level}/${LEVELS}`;$('progressText').textContent=`0/${CHALLENGES}`;
  $('progressBar').style.width='0%';$('nextPhase').style.display='none';draw();
}
function newGame(){score=0;level=1;usedInRun=new Set();answeringLocked=false;$('score').textContent='0';$('messageModal').classList.remove('show');$('questionModal').classList.remove('show');startPhase();}
function draw(){
  const styles=getComputedStyle(document.documentElement);
  const color=name=>styles.getPropertyValue(name).trim();
  const colors={
    wall:color('--maze-wall'),wallHighlight:color('--maze-wall-highlight'),wallShadow:color('--maze-wall-shadow'),
    floor:color('--maze-floor'),floorGrid:color('--maze-floor-grid'),gold:color('--gold'),goldInk:color('--gold-ink'),
    machine:color('--machine'),purple:color('--purple'),exitInk:color('--maze-exit-ink'),playerInk:color('--maze-player-ink')
  };
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const px=x*TILE,py=y*TILE;
    ctx.fillStyle=grid[y][x]===1?colors.wall:colors.floor;ctx.fillRect(px,py,TILE,TILE);
    if(grid[y][x]===1){ctx.fillStyle=colors.wallHighlight;ctx.fillRect(px+2,py+2,TILE-4,TILE-4);ctx.fillStyle=colors.wallShadow;ctx.fillRect(px+4,py+TILE-7,TILE-8,3);}
    else{ctx.strokeStyle=colors.floorGrid;ctx.strokeRect(px,py,TILE,TILE);}
  }
  markers.forEach(m=>{if(!solved.has(m.q)){const x=m.x*TILE+TILE/2,y=m.y*TILE+TILE/2;ctx.fillStyle=colors.gold;ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.fill();ctx.fillStyle=colors.goldInk;ctx.font='bold 17px "Atkinson Hyperlegible",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',x,y+1);}});
  const ex=exit.x*TILE,ey=exit.y*TILE;
  ctx.fillStyle=solved.size===CHALLENGES?colors.machine:colors.purple;ctx.fillRect(ex+7,ey+4,TILE-14,TILE-8);
  ctx.fillStyle=colors.exitInk;ctx.beginPath();ctx.arc(ex+TILE-12,ey+TILE/2,2,0,Math.PI*2);ctx.fill();
  const cx=player.px*TILE+TILE/2,cy=player.py*TILE+TILE/2;
  ctx.fillStyle=colors.machine;ctx.beginPath();ctx.arc(cx,cy,11,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=colors.playerInk;ctx.beginPath();ctx.arc(cx-4,cy-2,1.8,0,Math.PI*2);ctx.arc(cx+4,cy-2,1.8,0,Math.PI*2);ctx.fill();
}
function tryStep(dx,dy){
  if(paused)return false;
  const nx=player.x+dx,ny=player.y+dy;
  if(!grid[ny]||grid[ny][nx]!==0)return false;
  player.x=nx;player.y=ny;
  const marker=markers.find(m=>m.x===nx&&m.y===ny&&!solved.has(m.q));
  if(marker)showQuestion(marker.q);
  if(nx===exit.x&&ny===exit.y&&solved.size===CHALLENGES)finishPhase();
  return true;
}
function showQuestion(qIndex){
  paused=true;held.clear();answeringLocked=false;
  const q=questions[qIndex];
  $('qTag').textContent=`Desafio ${solved.size+1} de ${CHALLENGES}`;
  $('qTitle').textContent=q.t;$('qText').textContent=q.q;$('feedback').textContent='';
  $('closeQuestion').style.display='none';
  const box=$('answers');box.innerHTML='';
  q.a.forEach((answer,i)=>{const b=document.createElement('button');b.textContent=`${'ABC'[i]}) ${answer}`;b.addEventListener('click',()=>answerQuestion(qIndex,i,b));box.appendChild(b);});
  $('questionModal').classList.add('show');
}
function answerQuestion(qIndex,choice,button){
  if(answeringLocked)return;
  answeringLocked=true;
  const q=questions[qIndex],buttons=[...$('answers').querySelectorAll('button')];
  if(choice===q.c){
    solved.add(qIndex);score+=100;$('score').textContent=score;
    $('progressText').textContent=`${solved.size}/${CHALLENGES}`;$('progressBar').style.width=`${solved.size/CHALLENGES*100}%`;
    buttons.forEach(b=>b.disabled=true);button.classList.add('correct');
    $('feedback').textContent=`✓ Resposta correta! ${q.e}`;
    $('closeQuestion').style.display='inline-block';
  }else{
    score=Math.max(0,score-50);$('score').textContent=score;
    button.classList.add('wrong');button.disabled=true;
    $('feedback').textContent=`Resposta incorreta: -50 pontos. Pontuação: ${score}. Tente outra alternativa. Dica: pense em quem pode ser prejudicado e por quê.`;
    answeringLocked=false;
  }
}
$('closeQuestion').addEventListener('click',()=>{$('questionModal').classList.remove('show');answeringLocked=false;paused=false;});
function finishPhase(){
  paused=true;held.clear();
  $('messageTitle').textContent=level===LEVELS?'🏆 Você venceu!':`✨ Fase ${level} concluída!`;
  $('messageText').textContent=level===LEVELS?`Você completou as três fases e acumulou ${score} pontos.`:`Você resolveu os cinco desafios. Pontuação: ${score}. A próxima fase terá um novo labirinto e outras perguntas.`;
  $('messageButton').textContent=level===LEVELS?'Jogar novamente':'Próxima fase';
  $('messageModal').classList.add('show');
}
$('messageButton').addEventListener('click',()=>{
  $('messageModal').classList.remove('show');
  if(level===LEVELS)newGame();else{level++;startPhase();}
});
function frame(time){
  if(!lastTime)lastTime=time;const dt=Math.min(50,time-lastTime);lastTime=time;
  if(!paused){
    moveAccumulator+=dt;
    if(moveAccumulator>=moveInterval&&held.size){
      moveAccumulator=0;
      const key=[...held].at(-1),d=dirs[key];if(d)tryStep(d[0],d[1]);
    }
    const ease=Math.min(1,dt/75);
    player.px+=(player.x-player.px)*ease;player.py+=(player.y-player.py)*ease;
    if(Math.abs(player.x-player.px)<.006)player.px=player.x;
    if(Math.abs(player.y-player.py)<.006)player.py=player.y;
    draw();
  }
  requestAnimationFrame(frame);
}
document.addEventListener('keydown',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if(dirs[k]){e.preventDefault();held.delete(k);held.add(k);}});
document.addEventListener('keyup',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;held.delete(k);});
window.addEventListener('blur',()=>held.clear());
document.querySelectorAll('[data-dir]').forEach(b=>{
  const mapDir={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'},key=mapDir[b.dataset.dir];
  b.addEventListener('pointerdown',e=>{e.preventDefault();held.delete(key);held.add(key);});
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>held.delete(key)));
});
$('newGame').addEventListener('click',newGame);
window.addEventListener('message',event=>{
  if(event.source!==window.parent||!event.data||event.data.type!=='cdc-theme')return;
  if(event.data.theme==='dark'||event.data.theme==='light'){
    document.documentElement.setAttribute('data-theme',event.data.theme);
    draw();
  }
});
function notifyParentHeight(){
  window.parent.postMessage({type:'labirinto-height',height:document.documentElement.scrollHeight},'*');
}
window.addEventListener('load',notifyParentHeight);
window.addEventListener('resize',notifyParentHeight);
newGame();requestAnimationFrame(frame);
})();
