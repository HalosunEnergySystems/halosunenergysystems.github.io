/* ---------- Nav "About" dropdown ----------
   Click-to-open only. Toggles the .open class on [data-nav-dropdown],
   which styles.css uses to show/hide .nav-dropdown-menu. No :hover
   trigger — matches the CSS, which has no hover-open rule on purpose.

   Behavior:
   - Click trigger button -> toggle open/closed
   - Click outside the dropdown -> close
   - Escape key -> close (and return focus to the trigger)
   - Clicking a menu link -> close (so it doesn't stay open after navigation)
   - Syncs aria-expanded on the trigger button for accessibility
   - Supports multiple [data-nav-dropdown] instances on a page, though
     this site currently only has one ("About")
*/
(function () {
  var dropdowns = document.querySelectorAll('[data-nav-dropdown]');
  if (!dropdowns.length) return;

  function closeDropdown(dd) {
    dd.classList.remove('open');
    var trigger = dd.querySelector('.nav-dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function openDropdown(dd) {
    dd.classList.add('open');
    var trigger = dd.querySelector('.nav-dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function closeAll(except) {
    dropdowns.forEach(function (dd) {
      if (dd !== except) closeDropdown(dd);
    });
  }

  dropdowns.forEach(function (dd) {
    var trigger = dd.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dd.classList.contains('open');
      closeAll(dd);
      if (isOpen) {
        closeDropdown(dd);
      } else {
        openDropdown(dd);
      }
    });

    // Close after a menu link is clicked (mobile: panel is static/inline,
    // so this just resets state before the page navigates away).
    dd.querySelectorAll('.nav-dropdown-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeDropdown(dd);
      });
    });
  });

  // Click anywhere outside any open dropdown closes it.
  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (dd) {
      if (dd.classList.contains('open') && !dd.contains(e.target)) {
        closeDropdown(dd);
      }
    });
  });

  // Escape closes the open dropdown and returns focus to its trigger.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    dropdowns.forEach(function (dd) {
      if (dd.classList.contains('open')) {
        closeDropdown(dd);
        var trigger = dd.querySelector('.nav-dropdown-trigger');
        if (trigger) trigger.focus();
      }
    });
  });
})();
