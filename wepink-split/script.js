(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, {threshold:0.15});
  revealEls.forEach(function(el){ io.observe(el); });

  /* Nav blur/shrink state (purely visual toggle via class, kept minimal) */
  var nav = document.querySelector('.wp-nav');
  window.addEventListener('scroll', function(){
    nav.style.borderBottomColor = window.scrollY > 12 ? 'var(--line-2)' : 'var(--line)';
  }, {passive:true});

  /* Mobile navigation */
  var mobileMenuToggle = document.getElementById('mobileMenuToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if(mobileMenuToggle && mobileMenu){
    function closeMobileMenu(){
      mobileMenu.classList.remove('open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.setAttribute('aria-label', 'Abrir menu');
    }
    mobileMenuToggle.addEventListener('click', function(){
      var isOpen = mobileMenu.classList.toggle('open');
      mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
    mobileMenu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', closeMobileMenu);
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 900) closeMobileMenu();
    });
  }

  /* 3D tilt on hero + spotlight bottle via mouse position */
  if(!reduceMotion){
    var stage = document.querySelector('.wp-stage');
    var heroWrap = document.getElementById('heroBottleWrap');
    if(stage && heroWrap){
      stage.addEventListener('mousemove', function(e){
        var r = stage.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        heroWrap.style.transform = 'rotateY(' + (px*22) + 'deg) rotateX(' + (py*-16) + 'deg)';
      });
      stage.addEventListener('mouseleave', function(){
        heroWrap.style.transform = 'rotateY(0deg) rotateX(0deg)';
      });
    }
    var spotStage = document.querySelector('.wp-spot-stage');
    var spotWrap = document.getElementById('spotBottleWrap');
    if(spotStage && spotWrap){
      spotStage.addEventListener('mousemove', function(e){
        var r = spotStage.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        spotWrap.style.transform = 'rotateY(' + (px*18) + 'deg) rotateX(' + (py*-12) + 'deg)';
      });
      spotStage.addEventListener('mouseleave', function(){
        spotWrap.style.transform = 'rotateY(0deg) rotateX(0deg)';
      });
    }

    /* Category card cursor-follow glow + subtle tilt */
    document.querySelectorAll('.wp-cat-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var mx = ((e.clientX - r.left) / r.width) * 100;
        var my = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (px*6) + 'deg) rotateX(' + (py*-6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  /* Animate dial + bars when spotlight enters view */
  var dial = document.querySelector('.wp-dial');
  var dialDone = false;
  var dialIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && !dialDone){
        dialDone = true;
        var pct = parseInt(dial.getAttribute('data-dial'), 10);
        var fill = dial.querySelector('.wp-dial-fill');
        var circumference = 326.7;
        var offset = circumference - (circumference * pct / 100);
        requestAnimationFrame(function(){ fill.style.strokeDashoffset = offset; });
        document.querySelectorAll('.wp-bar-fill').forEach(function(bar){
          requestAnimationFrame(function(){ bar.style.width = bar.getAttribute('data-w') + '%'; });
        });
      }
    });
  }, {threshold:0.4});
  if(dial){ dialIO.observe(dial); }

  /* Kit option selector */
  var kitOpts = document.querySelectorAll('.wp-kit-opt');
  var kitPrice = document.getElementById('kitPrice');
  var kitInst = document.getElementById('kitInst');
  kitOpts.forEach(function(opt){
    opt.addEventListener('click', function(){
      kitOpts.forEach(function(o){ o.classList.remove('active'); });
      opt.classList.add('active');
      var price = parseFloat(opt.getAttribute('data-price')).toFixed(2).replace('.', ',');
      var inst = parseFloat(opt.getAttribute('data-inst')).toFixed(2).replace('.', ',');
      kitPrice.textContent = 'R$ ' + price;
      kitInst.textContent = 'ou 6x de R$ ' + inst;
    });
  });
})();

/* ---------------------------------------------------------
   CHAT WIDGET — trilhas fixas de atendimento
--------------------------------------------------------- */
(function(){
  var WHATSAPP_URL = 'https://wa.me/5511941620531';
  var EMAIL_URL = 'mailto:jujubelo009@gmail.com';

  var flow = {
    root: {
      bot: "Oi! Sou a assistente virtual da wepink 💗 Sobre o que você precisa de ajuda?",
      options: [
        { label: 'Rastrear meu pedido', next: 'rastreio' },
        { label: 'Troca e devolução', next: 'troca' },
        { label: 'Formas de pagamento', next: 'pagamento' },
        { label: 'Falar com atendente', next: 'humano' }
      ]
    },
    rastreio: {
      bot: 'Sobre o rastreio, qual é a sua situação?',
      options: [
        { label: 'Ainda não recebi o código de rastreio', next: 'rastreio_sem_codigo' },
        { label: 'Meu pedido está atrasado', next: 'rastreio_atrasado' },
        { label: 'Como eu rastreio meu pedido?', next: 'rastreio_como' },
        { label: '← Voltar ao menu', next: 'root' }
      ]
    },
    rastreio_sem_codigo: {
      bot: 'O código de rastreio é enviado por e-mail em até 2 dias úteis após a confirmação do pagamento — vale conferir a caixa de spam também. Se já passou desse prazo, posso te encaminhar para um atendente.',
      options: [
        { label: 'Já passou o prazo, preciso de ajuda', next: 'humano' },
        { label: '← Voltar ao menu', next: 'root' }
      ]
    },
    rastreio_atrasado: {
      bot: 'Depois do envio, o prazo normal de entrega é de até 7 dias úteis, variando por região. Se o prazo estimado no rastreio já passou, um atendente pode olhar seu pedido com mais detalhe.',
      options: [
        { label: 'Falar com atendente', next: 'humano' },
        { label: '← Voltar ao menu', next: 'root' }
      ]
    },
    rastreio_como: {
      bot: "É só acessar 'Rastreio' no menu do site e informar o código que enviamos por e-mail assim que o pedido é despachado.",
      options: [ { label: '← Voltar ao menu', next: 'root' } ]
    },
    troca: {
      bot: 'Sobre troca ou devolução, o que você precisa?',
      options: [
        { label: 'Quero trocar um produto', next: 'troca_trocar' },
        { label: 'Quero devolver e ser reembolsado(a)', next: 'troca_devolver' },
        { label: 'Qual o prazo para troca?', next: 'troca_prazo' },
        { label: '← Voltar ao menu', next: 'root' }
      ]
    },
    troca_trocar: {
      bot: 'Você tem até 30 dias corridos após o recebimento para solicitar a troca, com o produto na embalagem original. Para produtos já abertos, cada caso é avaliado individualmente por um atendente.',
      options: [
        { label: 'Solicitar troca com atendente', next: 'humano' },
        { label: '← Voltar ao menu', next: 'root' }
      ]
    },
    troca_devolver: {
      bot: 'O reembolso é feito pelo mesmo meio de pagamento usado na compra, em até 10 dias úteis após recebermos o produto de volta. Posso te conectar com um atendente para iniciar o processo.',
      options: [
        { label: 'Falar com atendente', next: 'humano' },
        { label: '← Voltar ao menu', next: 'root' }
      ]
    },
    troca_prazo: {
      bot: 'O prazo é de 30 dias corridos a partir da data de recebimento, conforme o Código de Defesa do Consumidor.',
      options: [ { label: '← Voltar ao menu', next: 'root' } ]
    },
    pagamento: {
      bot: 'Sobre pagamento, o que você quer saber?',
      options: [
        { label: 'Quais formas são aceitas?', next: 'pagamento_formas' },
        { label: 'Posso parcelar?', next: 'pagamento_parcelar' },
        { label: 'Meu pagamento não foi aprovado', next: 'pagamento_recusado' },
        { label: '← Voltar ao menu', next: 'root' }
      ]
    },
    pagamento_formas: {
      bot: 'Aceitamos cartão de crédito, Pix e boleto bancário.',
      options: [ { label: '← Voltar ao menu', next: 'root' } ]
    },
    pagamento_parcelar: {
      bot: 'Sim! Parcelamos em até 6x sem juros no cartão de crédito, direto no checkout.',
      options: [ { label: '← Voltar ao menu', next: 'root' } ]
    },
    pagamento_recusado: {
      bot: 'Isso pode acontecer por dados incorretos, limite insuficiente ou bloqueio do banco. Vale tentar novamente ou usar outro cartão/Pix. Se o problema continuar, um atendente pode verificar com mais detalhe.',
      options: [
        { label: 'Falar com atendente', next: 'humano' },
        { label: '← Voltar ao menu', next: 'root' }
      ]
    },
    humano: {
      bot: 'Sem problemas — isso é melhor resolvido com uma pessoa do nosso time. Fale pelo WhatsApp +55 11 94162-0531 ou por e-mail; geralmente respondemos em até 2h úteis.',
      options: [
        { label: 'Chamar no WhatsApp', action: 'link', url: WHATSAPP_URL },
        { label: 'Enviar e-mail', action: 'link', url: EMAIL_URL },
        { label: '← Voltar ao menu', next: 'root' }
      ]
    }
  };

  var fab = document.getElementById('chatFab');
  var panel = document.getElementById('chatPanel');
  var body = document.getElementById('chatBody');
  var humanShortcut = document.getElementById('chatHumanShortcut');
  var started = false;

  function scrollToBottom(){
    body.scrollTop = body.scrollHeight;
  }

  function clearActiveOptions(){
    var live = body.querySelector('.wp-chat-options.live');
    if(live){ live.classList.remove('live'); live.querySelectorAll('button').forEach(function(b){ b.disabled = true; b.style.opacity = .45; b.style.pointerEvents = 'none'; }); }
  }

  function renderNode(nodeKey){
    var node = flow[nodeKey];
    if(!node) return;
    clearActiveOptions();

    var typing = document.createElement('div');
    typing.className = 'wp-chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    scrollToBottom();

    setTimeout(function(){
      typing.remove();

      var botMsg = document.createElement('div');
      botMsg.className = 'wp-msg wp-msg-bot';
      botMsg.textContent = node.bot;
      body.appendChild(botMsg);

      var optWrap = document.createElement('div');
      optWrap.className = 'wp-chat-options live';
      node.options.forEach(function(opt){
        var btn = document.createElement('button');
        btn.className = 'wp-chat-opt';
        btn.textContent = opt.label;
        btn.addEventListener('click', function(){
          var userMsg = document.createElement('div');
          userMsg.className = 'wp-msg wp-msg-user';
          userMsg.textContent = opt.label;
          body.appendChild(userMsg);
          clearActiveOptions();
          scrollToBottom();

          if(opt.action === 'link'){
            window.open(opt.url, '_blank');
            setTimeout(function(){ renderNode('root'); }, 400);
          } else {
            setTimeout(function(){ renderNode(opt.next); }, 500);
          }
        });
        optWrap.appendChild(btn);
      });
      body.appendChild(optWrap);
      scrollToBottom();
    }, 500);
  }

  function openChat(){
    panel.classList.add('open');
    fab.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    if(!started){ started = true; renderNode('root'); }
  }
  function closeChat(){
    panel.classList.remove('open');
    fab.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
  }
  fab.addEventListener('click', function(){
    panel.classList.contains('open') ? closeChat() : openChat();
  });
  humanShortcut.addEventListener('click', function(){
    if(!panel.classList.contains('open')) openChat();
    var userMsg = document.createElement('div');
    userMsg.className = 'wp-msg wp-msg-user';
    userMsg.textContent = 'Falar com atendente';
    body.appendChild(userMsg);
    clearActiveOptions();
    renderNode('humano');
  });
})();
