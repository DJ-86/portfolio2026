/**
 * main.js — Portfolio v2 interactions
 *
 * 1. Navigation — scroll border + mobile toggle
 * 2. Scroll reveal — fade + lift sections on enter
 * 3. Skill bars — animate width on scroll into view
 * 4. Contact form — field validation + submit state
 */

'use strict';

/* ============================================================
   1. NAVIGATION
============================================================ */
function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');

  if (!nav || !toggle || !menu) return;

  // Scroll state
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 16);
  }, { passive: true });

  // Mobile toggle
  const open  = () => { menu.classList.add('nav__menu--open');    toggle.setAttribute('aria-expanded', 'true');  };
  const close = () => { menu.classList.remove('nav__menu--open'); toggle.setAttribute('aria-expanded', 'false'); };

  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  // Close on link click
  menu.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', close));

  // Close on Escape or outside click
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); toggle.focus(); } });
  document.addEventListener('click',   e => { if (!nav.contains(e.target)) close(); });
}


/* ============================================================
   2. SCROLL REVEAL — general fade + lift
============================================================ */
function initReveal() {
  // Mark elements that should animate
  const selectors = [
    '.hero__name-block',
    '.hero__right',
    '.about__header',
    '.about__content',
    '.project-card',
    '.contact__top',
    '.contact__info',
    '.contact__form',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('js-reveal');
      // Cascade siblings with small delay
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.js-reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.js-reveal').forEach(el => obs.observe(el));
}


/* ============================================================
   3. SKILL BARS — animate fill on scroll into view
   The CSS transition on .skill-row__fill fires once the 
   parent .skill-row gains is-visible class.
============================================================ */
function initSkillBars() {
  const rows = document.querySelectorAll('.skill-row');
  if (!rows.length || !('IntersectionObserver' in window)) {
    rows.forEach(r => r.classList.add('is-visible'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Stagger each bar slightly so they feel sequential
        setTimeout(() => {
          e.target.classList.add('is-visible');
        }, i * 120);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  rows.forEach(row => obs.observe(row));
}


/* ============================================================
   4. CONTACT FORM
============================================================ */
function initForm() {
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  const fields = [
    {
      input:   form.querySelector('#name'),
      errorEl: form.querySelector('#nameError'),
      fieldEl: form.querySelector('#nameField'),
      validate: v => v.trim().length >= 2 ? null : 'Please enter your name.',
    },
    {
      input:   form.querySelector('#email'),
      errorEl: form.querySelector('#emailError'),
      fieldEl: form.querySelector('#emailField'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Please enter a valid email.',
    },
    {
      input:   form.querySelector('#message'),
      errorEl: form.querySelector('#messageError'),
      fieldEl: form.querySelector('#messageField'),
      validate: v => v.trim().length >= 10 ? null : 'Message must be at least 10 characters.',
    },
  ];

  const setError = (field, msg) => {
    field.fieldEl.classList.toggle('form-field--error', !!msg);
    field.errorEl.textContent = msg || '';
    field.input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  // Re-validate live only after first failed submit
  fields.forEach(f => {
    f.input.addEventListener('input', () => {
      if (f.fieldEl.classList.contains('form-field--error')) {
        setError(f, f.validate(f.input.value));
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;
    fields.forEach(f => {
      const err = f.validate(f.input.value);
      setError(f, err);
      if (err) valid = false;
    });

    if (!valid) {
      fields.find(f => f.fieldEl.classList.contains('form-field--error'))?.input.focus();
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulated submit — replace with real fetch() endpoint
    setTimeout(() => {
      form.hidden = true;
      successMsg.hidden = false;
      successMsg.focus();
    }, 900);
  });
}


/* ============================================================
   BOOT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initSkillBars();
  initForm();
});
