// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Skills tabs =====
const tabBtns = Array.from(document.querySelectorAll('.segmented__btn'));
const panels = Array.from(document.querySelectorAll('.skills-panels .panel'));

function activateTab(btn) {
  tabBtns.forEach(b => {
    const active = b === btn;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  panels.forEach(p => {
    const active = p.id === btn.getAttribute('aria-controls');
    p.classList.toggle('is-active', active);
    p.hidden = !active;
  });
  // stagger badges when panel becomes active
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  if (panel) {
    const badges = [...panel.querySelectorAll('.skill-badge')];
    badges.forEach((b, i) => b.style.animationDelay = `${i * 35}ms`);
  }
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const i = tabBtns.indexOf(btn);
      const next = e.key === 'ArrowRight'
        ? tabBtns[(i + 1) % tabBtns.length]
        : tabBtns[(i - 1 + tabBtns.length) % tabBtns.length];
      next.focus(); activateTab(next);
    }
  });
});

// initial activate
const defaultBtn = document.querySelector('.segmented__btn.is-active') || tabBtns[0];
if (defaultBtn) activateTab(defaultBtn);

// Animate language meters on view
const langMeters = document.querySelectorAll('.languages-section .lang-meter');
const meterObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    obs.unobserve(e.target);
  });
}, { threshold: .35 });
langMeters.forEach(m => meterObs.observe(m));


// Simple tag filtering for projects
(function () {
  const buttons = Array.from(document.querySelectorAll('.filter-btn'));
  const cards = Array.from(document.querySelectorAll('.project-card'));
  if (!buttons.length || !cards.length) return;

  function applyFilter(tag) {
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(/\s+/);
      const show = tag === 'all' || tags.includes(tag);
      card.style.display = show ? '' : 'none';
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      applyFilter(btn.dataset.filter);
    });
  });

  // default: show all
  applyFilter('all');
})();


// ===== CONTACT PAGE LOGIC =====
(function initContactPage() {
  // Footer year (safe to call on every page)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('contactForm');
  if (!form) return; // only run on contact.html

  const toast = document.getElementById('toast');
  const showToast = (msg, isError = false) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.toggle('error', isError);
    toast.style.display = 'block';
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => (toast.style.display = 'none'), 4500);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        showToast('Thanks! Your message was sent ✅');
      } else {
        showToast('Oops — could not send. Please email me directly.', true);
      }
    } catch (err) {
      showToast('Network error — email me directly.', true);
    }
  });
})();
