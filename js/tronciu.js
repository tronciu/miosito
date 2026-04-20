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
      'Ciao, vorrei una consulenza per il mio sito.',
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

    const subject = encodeURIComponent('Richiesta consulenza sito web');
    const body = encodeURIComponent(buildMessage());
    window.location.href = `mailto:tronciu.trade@gmail.com?subject=${subject}&body=${body}`;
  });
}
