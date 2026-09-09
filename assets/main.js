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
  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveal — leve, via IntersectionObserver
// (mais barato para o navegador do que ouvir o evento "scroll")
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (revealEls.length) {
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // anima uma única vez, evita custo repetido
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }
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
