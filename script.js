'use strict';

// ── 1. NAVBAR SCROLL STATE ────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ── 2. HAMBURGER MENU ─────────────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navMobile = document.getElementById('nav-mobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Menü öffnen' : 'Menü schließen');
    navMobile.hidden = isOpen;
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Menü öffnen');
      navMobile.hidden = true;
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (navMobile.hidden) return;
    if (!navbar.contains(e.target)) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Menü öffnen');
      navMobile.hidden = true;
    }
  });
}

// ── 3. ACTIVE NAV LINK ────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, #nav-mobile a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle(
          'nav-link--active',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

sections.forEach(section => activeObserver.observe(section));

// ── 4. SCROLL REVEAL ──────────────────────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length) {
  // Stagger cards with a delay based on their position within a parent grid
  const staggerGroups = [
    '.leistungen-grid',
    '.price-grid',
    '.vorteile-grid',
  ];

  staggerGroups.forEach(selector => {
    const container = document.querySelector(selector);
    if (!container) return;
    container.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 70}ms`;
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  revealElements.forEach(el => revealObserver.observe(el));
}

// ── 5. SCROLL-TO-TOP BUTTON ───────────────────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
  function handleScrollTopVisibility() {
    const visible = window.scrollY > 400;
    scrollTopBtn.classList.toggle('visible', visible);
    scrollTopBtn.setAttribute('aria-hidden', String(!visible));
  }

  window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
  handleScrollTopVisibility();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── 6. CONTACT FORM ───────────────────────────────────────────────────────────
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

if (form && submitBtn) {
  function validateField(field) {
    const errorEl = document.getElementById(`${field.id}-error`);
    if (!errorEl) return true;

    const val = field.value.trim();

    if (field.required && !val) {
      errorEl.textContent = 'Dieses Feld ist erforderlich.';
      field.parentElement.classList.add('has-error');
      return false;
    }

    if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      errorEl.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      field.parentElement.classList.add('has-error');
      return false;
    }

    if (field.type === 'tel' && field.required && val && val.replace(/\s/g, '').length < 7) {
      errorEl.textContent = 'Bitte geben Sie eine gültige Telefonnummer ein.';
      field.parentElement.classList.add('has-error');
      return false;
    }

    errorEl.textContent = '';
    field.parentElement.classList.remove('has-error');
    return true;
  }

  // Validate on blur, clear error on input once touched
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.parentElement.classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const requiredFields = [...form.querySelectorAll('input[required], textarea[required]')];
    const allValid = requiredFields.map(f => validateField(f)).every(Boolean);

    if (!allValid) {
      const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
      firstInvalid?.focus();
      return;
    }

    // Loading state
    const labelEl = submitBtn.querySelector('.btn-label');
    const spinnerEl = submitBtn.querySelector('.btn-spinner');
    submitBtn.disabled = true;
    labelEl.textContent = 'Wird gesendet …';
    spinnerEl.hidden = false;

    // Simulated send — replace with real fetch() when backend is ready:
    // await fetch('/api/contact', { method: 'POST', body: new FormData(form) });
    await new Promise(resolve => setTimeout(resolve, 1400));

    form.innerHTML = `
      <div class="form-success" role="status" aria-live="polite">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
          <path d="M7 12l3.5 3.5L17 8" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>Vielen Dank!</h3>
        <p>Ihre Anfrage ist eingegangen. Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
      </div>
    `;
  });
}
