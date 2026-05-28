/**
 * NEXUS — script.js
 * Autor: Nexus Design Team
 * Descrição: Todos os comportamentos interativos do site.
 *
 * Índice:
 *  1. Utilitários
 *  2. Header — scroll e menu mobile
 *  3. Dark Mode
 *  4. Animações de entrada (Intersection Observer)
 *  5. Quiz interativo
 *  6. Formulário de contato
 *  7. Botão voltar ao topo
 *  8. Ano no footer
 *  9. Scroll suave para links internos
 */

/* ============================================================
   1. UTILITÁRIOS
   ============================================================ */

/**
 * Seleciona um único elemento do DOM.
 * @param {string} selector
 * @param {Element|Document} [ctx=document]
 * @returns {Element|null}
 */
const $ = (selector, ctx = document) => ctx.querySelector(selector);

/**
 * Seleciona múltiplos elementos do DOM.
 * @param {string} selector
 * @param {Element|Document} [ctx=document]
 * @returns {NodeList}
 */
const $$ = (selector, ctx = document) => ctx.querySelectorAll(selector);

/* ============================================================
   2. HEADER — SCROLL E MENU MOBILE
   ============================================================ */

(function initHeader() {
  const header    = $('#header');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobileLinks = $$('.mobile-menu__link, .mobile-menu__cta');

  if (!header || !hamburger || !mobileMenu) return;

  /* Adiciona classe .scrolled ao header quando rola a página */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // roda na inicialização

  /* Abre / fecha menu mobile */
  function toggleMenu(forceClose = false) {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    const open   = forceClose ? false : !isOpen;

    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));

    /* Bloqueia scroll do body quando menu está aberto */
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  /* Fecha menu ao clicar em um link */
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  /* Fecha menu ao pressionar Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleMenu(true);
  });

  /* Fecha menu ao redimensionar para desktop */
  const mediaQuery = window.matchMedia('(min-width: 769px)');
  mediaQuery.addEventListener('change', e => {
    if (e.matches) toggleMenu(true);
  });
})();

/* ============================================================
   3. DARK MODE
   ============================================================ */

(function initTheme() {
  const btn       = $('#btnTheme');
  const iconEl    = $('#themeIcon');
  const HTML      = document.documentElement;
  const STORAGE_KEY = 'nexus-theme';

  if (!btn) return;

  /* Lê preferência salva ou preferência do sistema */
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initial);

  btn.addEventListener('click', () => {
    const current = HTML.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    HTML.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    iconEl.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
  }
})();

/* ============================================================
   4. ANIMAÇÕES DE ENTRADA (Intersection Observer)
   ============================================================ */

(function initReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  /* Intersection Observer: aciona .visible quando elemento entra na viewport */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); /* observa apenas uma vez */
        }
      });
    },
    {
      rootMargin: '0px 0px -60px 0px', /* gatilho um pouco antes de entrar */
      threshold: 0.12
    }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. QUIZ INTERATIVO
   ============================================================ */

(function initQuiz() {
  /* ------ Dados do quiz ------ */
  const questions = [
    {
      question: 'O que significa a sigla "SEO"?',
      options: [
        'Search Engine Optimization',
        'Social Engagement Online',
        'System Enhancement Operation',
        'Sales Enhancement Output'
      ],
      correct: 0,
      explanation: 'SEO (Search Engine Optimization) é a prática de otimizar sites para rankear melhor nos mecanismos de busca.'
    },
    {
      question: 'Qual métrica mede a porcentagem de visitantes que saem do site sem interagir?',
      options: [
        'CTR (Click-Through Rate)',
        'Taxa de Rejeição (Bounce Rate)',
        'CPC (Cost Per Click)',
        'Taxa de Conversão'
      ],
      correct: 1,
      explanation: 'A Taxa de Rejeição indica visitantes que acessam apenas uma página sem qualquer interação.'
    },
    {
      question: 'O que é um "funil de vendas" no marketing digital?',
      options: [
        'Um gráfico de barras de vendas mensais',
        'Uma ferramenta de gestão de anúncios pagos',
        'A jornada do cliente desde o primeiro contato até a compra',
        'Um sistema de envio de e-mails em massa'
      ],
      correct: 2,
      explanation: 'O funil de vendas representa as etapas pelas quais um potencial cliente passa: descoberta, consideração e decisão de compra.'
    },
    {
      question: 'Qual formato de conteúdo tipicamente gera mais engajamento nas redes sociais atualmente?',
      options: [
        'Textos longos (posts de blog)',
        'Imagens estáticas',
        'Vídeos curtos (Reels, Shorts, TikTok)',
        'Podcasts'
      ],
      correct: 2,
      explanation: 'Vídeos curtos dominam o engajamento nas principais plataformas, com alcance orgânico significativamente maior.'
    },
    {
      question: 'O que é "ROI" no contexto de marketing?',
      options: [
        'Rate of Interaction',
        'Return on Investment (Retorno sobre Investimento)',
        'Reach of Impressions',
        'Revenue on Index'
      ],
      correct: 1,
      explanation: 'ROI mede o retorno financeiro de um investimento. No marketing, indica o lucro gerado por cada real investido em campanhas.'
    },
    {
      question: 'Qual é a função principal de um "Call to Action" (CTA)?',
      options: [
        'Exibir publicidade paga em sites parceiros',
        'Otimizar a velocidade de carregamento do site',
        'Incentivar o usuário a realizar uma ação específica',
        'Medir o tráfego orgânico de um site'
      ],
      correct: 2,
      explanation: 'Um CTA é um elemento (botão, link ou frase) que instrui o visitante a realizar uma ação desejada, como comprar, assinar ou entrar em contato.'
    }
  ];

  /* ------ Referências ao DOM ------ */
  const progressBar  = $('#quizProgressBar');
  const progressText = $('#quizProgressText');
  const quizArea     = $('#quizArea');
  const questionEl   = $('#quizQuestion');
  const optionsEl    = $('#quizOptions');
  const feedbackEl   = $('#quizFeedback');
  const nextBtn      = $('#quizNext');
  const resultDiv    = $('#quizResult');
  const resultIcon   = $('#quizResultIcon');
  const resultTitle  = $('#quizResultTitle');
  const resultScore  = $('#quizResultScore');
  const resultMsg    = $('#quizResultMsg');
  const restartBtn   = $('#quizRestart');

  if (!progressBar) return; /* Sai se a seção quiz não existe */

  /* ------ Estado do quiz ------ */
  let currentIndex = 0;
  let score        = 0;
  let answered     = false; /* impede múltiplos cliques */

  /* ------ Inicializa ------ */
  renderQuestion();

  /* ------ Funções principais ------ */

  /** Renderiza a pergunta atual */
  function renderQuestion() {
    const q = questions[currentIndex];
    answered = false;

    /* Atualiza progresso */
    const progress = ((currentIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Pergunta ${currentIndex + 1} de ${questions.length}`;

    /* Atualiza pergunta com transição */
    quizArea.style.opacity = '0';
    quizArea.style.transform = 'translateX(20px)';

    setTimeout(() => {
      questionEl.textContent = q.question;

      /* Limpa e recria opções */
      optionsEl.innerHTML = '';
      q.options.forEach((opt, idx) => {
        const letters = ['A', 'B', 'C', 'D'];
        const btn = document.createElement('button');
        btn.className = 'quiz__option';
        btn.setAttribute('type', 'button');
        btn.setAttribute('role', 'listitem');
        btn.innerHTML = `
          <span class="quiz__option-letter">${letters[idx]}</span>
          <span>${opt}</span>
        `;
        btn.addEventListener('click', () => handleAnswer(idx, btn));
        optionsEl.appendChild(btn);
      });

      /* Limpa feedback e esconde botão "Próxima" */
      feedbackEl.textContent = '';
      feedbackEl.className = 'quiz__feedback';
      nextBtn.style.display = 'none';

      /* Anima entrada */
      quizArea.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      quizArea.style.opacity  = '1';
      quizArea.style.transform = 'translateX(0)';
    }, 200);
  }

  /** Processa a resposta escolhida */
  function handleAnswer(selectedIdx, selectedBtn) {
    if (answered) return; /* ignora cliques após responder */
    answered = true;

    const q = questions[currentIndex];
    const allOptions = $$('.quiz__option', optionsEl);
    const isCorrect  = selectedIdx === q.correct;

    if (isCorrect) score++;

    /* Destaca resposta correta e errada */
    allOptions.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct)   btn.classList.add('correct');
      if (idx === selectedIdx && !isCorrect) btn.classList.add('wrong');
    });

    /* Feedback textual */
    feedbackEl.className = `quiz__feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedbackEl.textContent = isCorrect
      ? `✅ Correto! ${q.explanation}`
      : `❌ Incorreto. ${q.explanation}`;

    /* Mostra botão próxima */
    const isLast = currentIndex === questions.length - 1;
    nextBtn.textContent = isLast ? 'Ver Resultado 🏆' : 'Próxima →';
    nextBtn.style.display = 'inline-flex';
  }

  /** Avança para a próxima pergunta ou mostra resultado */
  nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex < questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  });

  /** Exibe o resultado final */
  function showResult() {
    /* Esconde área de perguntas */
    quizArea.style.display = 'none';
    progressText.textContent = 'Resultado final';
    progressBar.style.width = '100%';

    /* Calcula porcentagem */
    const pct = Math.round((score / questions.length) * 100);

    /* Define emoji e mensagem com base na pontuação */
    let icon, title, msg;
    if (pct >= 83) {
      icon  = '🏆';
      title = 'Expert em Marketing!';
      msg   = 'Você arrasou! Seu conhecimento em marketing digital é impressionante.';
    } else if (pct >= 50) {
      icon  = '👏';
      title = 'Bom resultado!';
      msg   = 'Você tem uma boa base de marketing digital. Com um pouco mais de prática, chega ao topo!';
    } else {
      icon  = '📚';
      title = 'Hora de estudar!';
      msg   = 'Não se preocupe, o marketing digital tem muita coisa para aprender. Que tal explorar nossos serviços?';
    }

    resultIcon.textContent  = icon;
    resultTitle.textContent = title;
    resultScore.textContent = `${score}/${questions.length} (${pct}%)`;
    resultMsg.textContent   = msg;

    /* Exibe resultado */
    resultDiv.hidden = false;
    resultDiv.removeAttribute('hidden');
  }

  /** Reinicia o quiz */
  restartBtn.addEventListener('click', () => {
    currentIndex = 0;
    score        = 0;

    /* Esconde resultado, mostra área de perguntas */
    resultDiv.hidden = true;
    quizArea.style.display = '';
    quizArea.style.opacity = '1';
    quizArea.style.transform = 'none';

    renderQuestion();
  });
})();

/* ============================================================
   6. FORMULÁRIO DE CONTATO
   ============================================================ */

(function initForm() {
  const form        = $('#contatoForm');
  const successMsg  = $('#formSuccess');
  if (!form) return;

  /* Campos e erros */
  const fields = {
    nome:     { el: $('#nome'),     errEl: $('#nomeError'),     label: 'Nome' },
    email:    { el: $('#email'),    errEl: $('#emailError'),    label: 'E-mail' },
    mensagem: { el: $('#mensagem'), errEl: $('#mensagemError'), label: 'Mensagem' }
  };

  /** Valida um campo e retorna true se válido */
  function validateField(key) {
    const { el, errEl, label } = fields[key];
    const value = el.value.trim();
    let error = '';

    if (!value) {
      error = `${label} é obrigatório.`;
    } else if (key === 'email') {
      /* Validação básica de e-mail */
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Informe um e-mail válido.';
      }
    } else if (key === 'nome' && value.length < 3) {
      error = 'Nome deve ter pelo menos 3 caracteres.';
    } else if (key === 'mensagem' && value.length < 10) {
      error = 'Mensagem deve ter pelo menos 10 caracteres.';
    }

    /* Aplica / remove classes e mensagens */
    errEl.textContent = error;
    el.classList.toggle('invalid', !!error);
    return !error;
  }

  /* Validação ao perder o foco (blur) em cada campo */
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    /* Limpa erro ao digitar novamente */
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('invalid')) validateField(key);
    });
  });

  /* Submit */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Valida todos os campos */
    const allValid = Object.keys(fields).map(validateField).every(Boolean);
    if (!allValid) {
      /* Foca no primeiro campo inválido */
      const firstInvalid = Object.values(fields).find(f => f.el.classList.contains('invalid'));
      if (firstInvalid) firstInvalid.el.focus();
      return;
    }

    /* Simula envio (sem backend real) */
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    setTimeout(() => {
      /* Reset do formulário */
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensagem ✉';

      /* Remove estados de validação */
      Object.values(fields).forEach(({ el }) => el.classList.remove('invalid'));

      /* Mostra mensagem de sucesso */
      successMsg.hidden = false;
      successMsg.removeAttribute('hidden');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      /* Esconde mensagem de sucesso após 5s */
      setTimeout(() => {
        successMsg.hidden = true;
      }, 5000);
    }, 1200); /* Simula latência de rede */
  });
})();

/* ============================================================
   7. BOTÃO VOLTAR AO TOPO
   ============================================================ */

(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  /* Mostra/esconde com base no scroll */
  function onScroll() {
    const show = window.scrollY > 400;
    if (show) {
      btn.hidden = false; /* remove hidden para o CSS animar */
    } else {
      btn.hidden = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* executa no load */

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   8. ANO DINÂMICO NO FOOTER
   ============================================================ */

(function initYear() {
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ============================================================
   9. SCROLL SUAVE PARA LINKS INTERNOS (fallback)
   ============================================================ */
(function initSmoothScroll() {
  /* O CSS já tem scroll-behavior: smooth, mas este fallback
     garante que o header fixo não cubra o destino. */
  const HEADER_OFFSET = 80; /* altura do header + margem */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; /* link para o topo */

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
