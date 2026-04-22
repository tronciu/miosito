const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const startEntrance = () => {
  // Two RAFs ensure the browser paints the compressed start state first.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.body.classList.add('entered');
    });
  });
};

const onScroll = () => {
  const heroHeight = window.innerHeight || 1;
  const scrollY = window.scrollY;
  const progress = clamp(scrollY / heroHeight, 0, 1);
  const fullHeight =
    document.documentElement.scrollHeight - window.innerHeight || 1;
  const pageProgress = clamp(scrollY / fullHeight, 0, 1);
  const heroProgress = clamp(scrollY / (heroHeight * 1.35), 0, 1);

  document.body.style.setProperty('--page-progress', pageProgress.toFixed(4));
  document.body.style.setProperty('--hero-progress', heroProgress.toFixed(4));

  document.body.classList.toggle('scrolled', progress > 0.08);
};

startEntrance();
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

// Smooth-scroll to in-page anchors without leaving hash fragments in the URL.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', window.location.pathname);
  });
});

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav');
const themeToggle = document.querySelector('#theme-toggle');

const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);
  if (!themeToggle) return;
  const isDark = theme === 'dark';
  themeToggle.textContent = isDark ? 'LIGHT MODE' : 'DARK MODE';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Attiva tema chiaro' : 'Attiva tema scuro'
  );
};

const savedTheme = window.localStorage.getItem('theme-preference');
if (savedTheme === 'dark' || savedTheme === 'light') {
  applyTheme(savedTheme);
} else {
  applyTheme('light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    window.localStorage.setItem('theme-preference', next);
  });
}

if (navToggle && navMenu) {
  const closeMenu = () => {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
  };

  navToggle.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) {
      closeMenu();
      return;
    }
    openMenu();
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

const revealTargets = document.querySelectorAll(
  '.hero, .services, .cta, .contact, .features .card, .service-grid .card, .about-hero, .about-body, .about-side, .about-card, .about-step, .about-cta, main > .card'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealTargets.forEach((el) => observer.observe(el));

const contactForm = document.querySelector('#contact-form');
const waLink = document.querySelector('#wa-link');

if (contactForm) {
  const nameInput = contactForm.querySelector('#nome');
  const emailInput = contactForm.querySelector('#email');
  const messageInput = contactForm.querySelector('#messaggio');

  const autoResizeMessage = () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = `${messageInput.scrollHeight}px`;
  };

  const buildMessage = () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    return [
      'Ciao, vorrei una consulenza per realizzare un sito web premium.',
      name ? `Nome: ${name}` : '',
      email ? `Email: ${email}` : '',
      message ? `Messaggio: ${message}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const updateWhatsAppLink = () => {
    if (!waLink) return;
    const text = encodeURIComponent(buildMessage());
    waLink.href = `https://wa.me/393284716993?text=${text}`;
  };

  [nameInput, emailInput, messageInput].forEach((el) => {
    el.addEventListener('input', updateWhatsAppLink);
  });
  messageInput.addEventListener('input', autoResizeMessage);
  autoResizeMessage();
  updateWhatsAppLink();

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const subject = encodeURIComponent('Richiesta consulenza sito web premium');
    const body = encodeURIComponent(buildMessage());
    window.location.href = `mailto:tronciu.trade@gmail.com?subject=${subject}&body=${body}`;
  });
}
