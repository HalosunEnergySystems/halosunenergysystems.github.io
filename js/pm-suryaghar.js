/* PM Surya Ghar page-specific behaviour */

(function () {
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Keep the page's language buttons visually consistent with the site.
     Full translations can be added to i18n.js later without changing this page. */
  document.querySelectorAll(".lang-toggle button").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll(".lang-toggle button").forEach(function (b) {
        b.classList.remove("active");
      });
      button.classList.add("active");
    });
  });
})();
