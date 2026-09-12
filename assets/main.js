// ================================================================
// RESETS INFORMÁTICA — script compartilhado (vanilla JS, sem libs)
// ================================================================

// Ano dinâmico no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menu mobile — abre/fecha e fecha ao clicar em um link
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

if (menuToggle && menu) {
  document.documentElement.classList.add('menu-ready');
  menuToggle.setAttribute('aria-controls', menu.id);
  const closeMenu = (restoreFocus = false) => {
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    if (restoreFocus) menuToggle.focus();
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  document.addEventListener('focusin', event => {
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 721px)').addEventListener('change', () => closeMenu());
}

// Scroll reveal — leve, via IntersectionObserver
// (mais barato para o navegador do que ouvir o evento "scroll")
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealEls.length) {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Conteúdo visível por padrão, mesmo se a animação não puder executar.
          if (typeof entry.target.animate === 'function') {
            entry.target.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' });
          }
          observer.unobserve(entry.target); // anima uma única vez, evita custo repetido
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }
}

// Cabeçalho e navegação por seção, sem interferir na rolagem natural.
const siteHeader = document.querySelector('header');
const updateHeader = () => siteHeader?.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
const sectionLinks = [...document.querySelectorAll('nav.menu a[href^="#"]')];
if (sectionLinks.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        const current = link.hash === '#' + entry.target.id;
        link.classList.toggle('is-active', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  sectionLinks.forEach(link => {
    const section = document.getElementById(link.hash.slice(1));
    if (section) sectionObserver.observe(section);
  });
}
const floatingContact = document.querySelector('.floating-contact');
if (floatingContact && 'IntersectionObserver' in window) {
  const contactVisibility = new Map();
  new IntersectionObserver(entries => {
    entries.forEach(entry => contactVisibility.set(entry.target, entry.isIntersecting));
    floatingContact.classList.toggle('is-hidden', [...contactVisibility.values()].some(Boolean));
  }).observe(document.getElementById('contato'));
}

// FAQ — só um item aberto por vez, pra lista não ficar comprida demais
document.querySelectorAll('.faq-list').forEach(list => {
  list.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        list.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
});

// Compartilhamento discreto nas páginas de serviço.
const serviceTitle = document.querySelector('.page-hero h1');
if (serviceTitle) {
  const heading = document.createElement('div');
  heading.className = 'service-heading';
  serviceTitle.before(heading);
  heading.append(serviceTitle);

  const shareButton = document.createElement('button');
  shareButton.type = 'button';
  shareButton.className = 'service-share';
  shareButton.title = 'Compartilhar serviço';
  shareButton.setAttribute('aria-label', 'Compartilhar este serviço');
  shareButton.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>';
  heading.append(shareButton);

  const feedback = document.createElement('div');
  feedback.className = 'share-feedback';
  feedback.hidden = true;
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  const manualLabel = document.createElement('label');
  manualLabel.textContent = 'Link deste serviço';
  manualLabel.hidden = true;
  const manualLink = document.createElement('input');
  manualLink.type = 'text';
  manualLink.readOnly = true;
  manualLink.addEventListener('focus', () => manualLink.select());
  manualLabel.append(manualLink);
  feedback.append(status, manualLabel);
  heading.after(feedback);

  shareButton.addEventListener('click', async () => {
    feedback.hidden = true;
    manualLabel.hidden = true;
    status.textContent = '';
    if (!/^https?:$/.test(location.protocol)) {
      feedback.hidden = false;
      status.textContent = 'O compartilhamento estará disponível quando o site estiver publicado.';
      return;
    }
    const url = new URL(location.href);
    url.hash = '';
    url.search = '';
    shareButton.disabled = true;
    try {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ title: document.title, url: url.href });
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
          // Se o compartilhamento nativo falhar, ofereça a cópia do link.
        }
      }
      try {
        await navigator.clipboard.writeText(url.href);
        feedback.hidden = false;
        status.textContent = 'Link copiado! Agora é só enviar para alguém.';
      } catch {
        feedback.hidden = false;
        status.textContent = 'Copie o link abaixo para compartilhar.';
        manualLabel.hidden = false;
        manualLink.value = url.href;
        manualLink.focus();
      }
    } finally {
      shareButton.disabled = false;
    }
  });
}
