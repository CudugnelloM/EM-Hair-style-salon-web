(() => {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const form = document.getElementById('bookingForm');
  const status = document.getElementById('formStatus');

  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    nav.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  links.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
    let current = 'inicio';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 180) current = section.id;
    });
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const request = [
      `Hola, soy ${data.get('name')}.`,
      `Me interesa: ${data.get('service')}.`,
      `Mi teléfono es: ${data.get('phone')}.`,
      data.get('message') ? `Consulta: ${data.get('message')}` : ''
    ].filter(Boolean).join('\n');

    navigator.clipboard?.writeText(request).catch(() => {});
    status.textContent = 'Solicitud preparada y copiada. Abrimos Instagram para que puedas enviarla.';
    window.open('https://www.instagram.com/eber_hairstylistsalon/', '_blank', 'noopener,noreferrer');
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && heroVideo.dataset.videoMobile) {
    const mobileSrc = heroVideo.dataset.videoMobile;
    const desktopSrc = heroVideo.dataset.videoDesktop;
    const mq = window.matchMedia('(max-width: 720px)');

    const syncSource = () => {
      const target = mq.matches ? mobileSrc : desktopSrc;
      if (heroVideo.currentSrc.endsWith(target.replace('./', ''))) return;
      heroVideo.src = target;
      heroVideo.load();
      heroVideo.play().catch(() => {});
    };

    syncSource();
    mq.addEventListener('change', syncSource);
  }
})();
