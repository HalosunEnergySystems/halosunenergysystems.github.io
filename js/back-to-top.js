// ============ BACK TO TOP BUTTON ============
// Shows a "scroll to top" button only once the page is actually
// scrollable and the visitor has scrolled down a bit. Hides again
// near the top, and on pages short enough to never need it.
(function () {
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  var SHOW_AFTER_PX = 400;   // how far down before it appears
  var MIN_SCROLLABLE = 200;  // page must have at least this much extra scroll room

  function isPageScrollable() {
    var doc = document.documentElement;
    return (doc.scrollHeight - doc.clientHeight) > MIN_SCROLLABLE;
  }

  function update() {
    var scrolled = window.scrollY || document.documentElement.scrollTop || 0;
    if (isPageScrollable() && scrolled > SHOW_AFTER_PX) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    btn.blur();
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  // Content (images, fonts, dynamic sections) can change page height
  // after first paint, so re-check shortly after load too.
  window.addEventListener('load', update);
  document.addEventListener('DOMContentLoaded', update);
  setTimeout(update, 500);
  update();
})();
