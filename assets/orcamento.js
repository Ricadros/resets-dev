// Pedido guiado: os dados ficam na página até o cliente abrir o WhatsApp.
(() => {
  const services = {
    sistemas: { title: 'Sistemas & Web', questions: [
      ['O que você precisa?', ['Site institucional', 'Loja virtual', 'Sistema personalizado', 'Melhorar um site ou sistema', 'Preciso de orientação']],
      ['Em que fase está o projeto?', ['Tenho uma ideia', 'Já tenho os requisitos', 'Já existe e precisa de ajustes']]
    ] },
    manutencao: { title: 'Manutenção & Montagem', questions: [
      ['Qual é o equipamento?', ['Notebook', 'Computador de mesa', 'Quero montar um PC']],
      ['O que você precisa resolver?', ['Está lento ou travando', 'Não liga', 'Esquenta ou desliga sozinho', 'Limpeza e manutenção preventiva', 'Upgrade ou montagem', 'Outro / não sei identificar']]
    ] },
    redes: { title: 'Redes & Infraestrutura', questions: [
      ['O que você precisa?', ['Melhorar o Wi-Fi', 'Resolver quedas de conexão', 'Instalar uma nova rede', 'Cabeamento e organização', 'Preciso de orientação']],
      ['Onde será o serviço?', ['Residência', 'Empresa ou escritório', 'Loja', 'Outro local']]
    ] },
    seguranca: { title: 'Segurança Eletrônica', questions: [
      ['O que você procura?', ['Câmeras de segurança', 'Alarme', 'Controle de acesso', 'Manutenção de equipamentos', 'Preciso de orientação']],
      ['Onde será o serviço?', ['Residência', 'Empresa ou loja', 'Condomínio', 'Outro local']]
    ] }
  };
  const form = document.getElementById('quote-form');
  const panels = [...form.querySelectorAll('[data-step]')];
  const steps = [...document.querySelectorAll('.quote-steps li')];
  const questions = document.getElementById('quote-questions');
  const previous = document.getElementById('quote-prev');
  const next = document.getElementById('quote-next');
  const send = document.getElementById('quote-send');
  let step = 0;
  let selected = '';

  function showStep(value) {
    step = value;
    panels.forEach((panel, index) => {
      panel.hidden = index !== step;
      // Campos das outras etapas não devem bloquear a validação nativa.
      panel.querySelectorAll('input, select, textarea').forEach(field => { field.disabled = index !== step; });
    });
    steps.forEach((item, index) => {
      if (index === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      item.classList.toggle('is-complete', index < step);
    });
    previous.hidden = step === 0;
    next.hidden = step === 2;
    send.hidden = step !== 2;
    next.textContent = step === 1 ? 'Revisar pedido →' : 'Continuar →';
    panels[step].querySelector('h2').focus();
  }

  function populate(key) {
    if (selected === key) return;
    selected = key;
    questions.replaceChildren();
    document.getElementById('quote-selected').textContent = services[key].title;
    services[key].questions.forEach(([title, options], index) => {
      const label = document.createElement('label');
      label.className = 'quote-field';
      label.textContent = title;
      const select = document.createElement('select');
      select.name = `question-${index}`;
      select.required = true;
      select.add(new Option('Selecione uma opção', ''));
      options.forEach(option => select.add(new Option(option, option)));
      label.append(select);
      questions.append(label);
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (step === 0) {
      populate(form.querySelector('input[name="service"]:checked').value);
      showStep(1);
    } else if (step === 1) {
      const lines = [`Olá! Gostaria de um orçamento para ${services[selected].title}.`, ''];
      questions.querySelectorAll('select').forEach((select, index) => {
        lines.push(`${services[selected].questions[index][0]} ${select.value}`);
      });
      const details = document.getElementById('quote-details').value.trim();
      if (details) lines.push('', `Detalhes: ${details}`);
      const message = lines.join('\n');
      document.getElementById('quote-message').textContent = message;
      send.href = `https://wa.me/5592985129159?text=${encodeURIComponent(message)}`;
      showStep(2);
    }
  });
  previous.addEventListener('click', () => showStep(step - 1));
  const preset = new URLSearchParams(location.search).get('servico');
  if (Object.hasOwn(services, preset)) {
    form.querySelector(`input[value="${preset}"]`).checked = true;
  }
  document.getElementById('quote-app').hidden = false;
})();
