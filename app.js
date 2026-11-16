// Portfolio v4 de Cheikhouna Kébé (modèle barre latérale) — interactions :
// révélation au défilement, lien actif dans la navigation.
// Les chiffres des statistiques sont fixes (pas de compteurs animés).
//
// Robustesse : la classe "js" est ajoutée sur <html> uniquement quand ce
// script tourne. Le CSS ne masque les éléments .reveal que sous html.js,
// donc sans JavaScript tout le contenu reste visible.

(function () {
  "use strict";

  // Active les animations d'apparition uniquement quand JS tourne.
  document.documentElement.classList.add("js");

  // ---------- Révélation au défilement ----------
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // ---------- Lien actif dans la navigation (barre latérale) ----------
  var navLinks = document.querySelectorAll(".sidebar-nav a[href^='#']");
  var sections = Array.prototype.slice.call(navLinks)
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);
  function onScroll() {
    var pos = window.scrollY + 100;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.offsetTop <= pos) current = section;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", current && link.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
