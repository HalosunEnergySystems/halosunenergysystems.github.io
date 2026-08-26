/* Halosun global interactions */

// 1. Dynamic Year Update
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 2. Dynamic Last Modified Date Fetching
const updatedEl = document.getElementById('last-updated');
if (updatedEl) {
  fetch(window.location.href, { method: 'HEAD' })
    .then(response => {
      const lastModified = response.headers.get('Last-Modified');
      if (lastModified) {
        const date = new Date(lastModified);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        updatedEl.textContent = date.toLocaleDateString('en-GB', options);
      }
    })
    .catch(err => console.error('Error fetching last modified date:', err));
}

// Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Add a subtle scroll state to the sticky header.
const header = document.querySelector('.site-header');
if (header) {
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 8);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* ===================================================================
   Scheduled Maintenance Banner
   -------------------------------------------------------------------
   Controlled entirely from this one file — nothing to edit on any
   individual page. Edit MAINTENANCE_CONFIG below:

   - enabled: false             -> nothing happens, anywhere.
   - enabled: true, now < start -> a slim notice banner appears above
     the header on every page, announcing the upcoming window.
   - enabled: true, start <= now <= end -> the entire page content is
     replaced with a full-screen "back soon" message, on every page.
   - enabled: true, now > end   -> window has passed; site behaves
     normally again automatically, no need to switch off manually.

   Self-contained: injects its own CSS, no styles.css changes needed.
=================================================================== */
const MAINTENANCE_CONFIG = {
  enabled: false,                             // master on/off switch
  startDateTime: '2026-09-05T01:00:00+05:30', // ISO 8601, IST offset shown
  endDateTime:   '2026-09-05T05:00:00+05:30',
  message: "We're working on something good for you.",
};

function maintenanceFormatDateTime(date) {
  return date.toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function maintenanceInjectStyles() {
  if (document.getElementById('maintenance-styles')) return;
  const style = document.createElement('style');
  style.id = 'maintenance-styles';
  style.textContent = `
    .maintenance-notice-banner {
      background: #b45309;
      color: #fff;
      font: 500 14px/1.4 Inter, sans-serif;
      text-align: center;
      padding: 10px 16px;
    }
    .maintenance-notice-banner .wrap {
      max-width: 1100px;
      margin: 0 auto;
    }
    .maintenance-takeover {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f172a;
      color: #f8fafc;
      text-align: center;
      padding: 24px;
      font-family: Inter, sans-serif;
    }
    .maintenance-takeover-inner { max-width: 480px; }
    .maintenance-takeover-inner h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(28px, 5vw, 40px);
      margin: 0 0 12px;
    }
    .maintenance-takeover-inner p {
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 8px;
      color: #cbd5e1;
    }
    .maintenance-takeover-inner .maintenance-back-time {
      margin-top: 20px;
      font-weight: 600;
      color: #fbbf24;
    }
  `;
  document.head.appendChild(style);
}

function maintenanceInjectNoticeBanner(start, end) {
  const siteHeader = document.querySelector('.site-header');
  if (!siteHeader || document.getElementById('maintenance-notice-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'maintenance-notice-banner';
  banner.className = 'maintenance-notice-banner';
  banner.innerHTML = `<div class="wrap">Scheduled maintenance: `
    + `${maintenanceFormatDateTime(start)} &ndash; ${maintenanceFormatDateTime(end)}. `
    + `The site will be briefly unavailable during this window.</div>`;
  siteHeader.insertAdjacentElement('beforebegin', banner);
}

function maintenanceShowTakeover(end) {
  Array.from(document.body.children).forEach((el) => {
    if (el.tagName !== 'SCRIPT') el.style.display = 'none';
  });
  const overlay = document.createElement('div');
  overlay.id = 'maintenance-takeover';
  overlay.className = 'maintenance-takeover';
  overlay.innerHTML = `
    <div class="maintenance-takeover-inner">
      <h1>We'll be right back</h1>
      <p>${MAINTENANCE_CONFIG.message}</p>
      <p class="maintenance-back-time">Back by ${maintenanceFormatDateTime(end)}</p>
    </div>`;
  document.body.appendChild(overlay);
}

function initMaintenanceBanner() {
  if (!MAINTENANCE_CONFIG.enabled) return;

  const start = new Date(MAINTENANCE_CONFIG.startDateTime);
  const end = new Date(MAINTENANCE_CONFIG.endDateTime);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

  const now = new Date();
  maintenanceInjectStyles();

  if (now >= start && now <= end) {
    maintenanceShowTakeover(end);
  } else if (now < start) {
    maintenanceInjectNoticeBanner(start, end);
  }
}
initMaintenanceBanner();

/* ===================================================================
   Breadcrumb "Back" link
   -------------------------------------------------------------------
   The link's href already points to index.html as a safe fallback
   (works for anyone who bookmarked, opened a shared link, or arrived
   in a fresh tab with no history to go back to). If there IS same-site
   browser history to go back to, we intercept the click and use
   history.back() instead, so it returns to wherever the visitor
   actually came from rather than always jumping to the homepage.
=================================================================== */
document.querySelectorAll('.breadcrumb-back').forEach((link) => {
  link.addEventListener('click', (e) => {
    const cameFromSameSite = document.referrer &&
      new URL(document.referrer).origin === window.location.origin;
    if (window.history.length > 1 && cameFromSameSite) {
      e.preventDefault();
      window.history.back();
    }
    // else: let the default href="index.html" navigation proceed.
  });
});
