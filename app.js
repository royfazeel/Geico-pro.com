/* ================================================
   GEICO-PRO.COM — App Engine
   ================================================ */

// === CONFIG ===
const PHONE = '(888) 524-0250';
const PHONE_LINK = 'tel:+18885240250';
const POPUP_DELAY = 5000;        // 5s initial delay on GEICO pages
const POPUP_REAPPEAR = 5000;     // 5s reappear after close
const POPUP_MAX_SHOWS = 3;       // max times popup reappears per page
const GEICO_PAGES = ['geico-auto','geico-home','geico-moto','geico-umbrella','geico-renters','geico-condo','geico-bundle','geico-compare','geico-sr22'];

let popupCount = 0;
let popupTimer = null;
let currentPage = 'home';

// === PAGE NAVIGATION ===
function go(page) {
  // Reset popup counter on page change
  popupCount = 0;
  clearTimeout(popupTimer);
  hidePopup();

  document.querySelectorAll('.pg').forEach(p => {
    p.classList.remove('active');
    p.style.animation = 'none';
  });
  const target = document.getElementById('pg-' + page);
  if (target) {
    target.offsetHeight; // force reflow
    target.style.animation = 'fadeIn 0.35s ease';
    target.classList.add('active');
  }

  // Update nav
  document.querySelectorAll('.nav > a').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page)
  );

  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentPage = page;

  // Reinit observers
  setTimeout(initReveal, 150);

  // Schedule popup on GEICO pages
  if (GEICO_PAGES.includes(page)) {
    schedulePopup(POPUP_DELAY);
  }
}

// === MOBILE MENU ===
function openMobile() {
  document.getElementById('mobileMenu').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.body.style.overflow = '';
}
function closeMobileOv(e) {
  if (e.target === document.getElementById('mobileMenu')) closeMobile();
}

// === HEADER SCROLL ===
window.addEventListener('scroll', () => {
  const h = document.getElementById('siteHeader');
  const st = document.getElementById('scrollTop');
  if (h) h.classList.toggle('scrolled', scrollY > 30);
  if (st) st.classList.toggle('show', scrollY > 500);
}, { passive: true });

// === FAQ ACCORDION ===
function toggleFaq(el) {
  const item = el.parentElement;
  const ans = item.querySelector('.faq-a');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-a').style.maxHeight = '0';
  });
  if (!isOpen) {
    item.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
  }
}

// === POPUP SYSTEM ===
function showPopup() {
  const active = document.querySelector('.pg.active');
  if (!active) return;
  // Only show on GEICO subpages
  if (!GEICO_PAGES.includes(currentPage)) return;
  if (popupCount >= POPUP_MAX_SHOWS) return;

  popupCount++;
  const overlay = document.getElementById('popupBg');
  if (overlay) {
    overlay.classList.add('show');
    // Reset animations by removing and re-adding
    const modal = overlay.querySelector('.popup-modal');
    if (modal) {
      modal.style.animation = 'none';
      modal.offsetHeight;
      modal.style.animation = '';
    }
  }
}

function hidePopup() {
  const overlay = document.getElementById('popupBg');
  if (overlay) overlay.classList.remove('show');

  // Schedule reappearance if under max
  if (GEICO_PAGES.includes(currentPage) && popupCount < POPUP_MAX_SHOWS) {
    schedulePopup(POPUP_REAPPEAR);
  }
}

function schedulePopup(delay) {
  clearTimeout(popupTimer);
  popupTimer = setTimeout(showPopup, delay);
}

// Close on overlay click
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'popupBg') hidePopup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hidePopup();
});

// Also trigger popup on scroll depth for GEICO pages
let scrollPopupFired = false;
window.addEventListener('scroll', () => {
  if (scrollPopupFired) return;
  if (!GEICO_PAGES.includes(currentPage)) return;
  if ((scrollY + innerHeight) / document.body.scrollHeight > 0.45) {
    scrollPopupFired = true;
    showPopup();
  }
}, { passive: true });

// === SCROLL REVEAL (IntersectionObserver) ===
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv:not(.vis)').forEach(el => obs.observe(el));
}

// === COUNTER ANIMATION ===
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 45);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = prefix + current + suffix;
    }, 28);
  });
}

// Trigger counters when stats section is visible
function initCounters() {
  const statsEls = document.querySelectorAll('.hero-stats, .stats-row');
  statsEls.forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
  });
}

// === CARD TILT EFFECT ===
function initTilt() {
  const cards = document.querySelectorAll('.card, .prov-card, .why-card, .cov-card, .deal, .gf-card, .test-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initTilt();

  // Scroll top button
  const stBtn = document.getElementById('scrollTop');
  if (stBtn) {
    stBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
