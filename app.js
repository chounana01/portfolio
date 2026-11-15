// Portfolio de Cheikhouna Kébé — interactions : compteurs animés, filtres projets,
// révélation au défilement, menu mobile, lien actif dans la navigation.

(function () {
  "use strict";

  // Active les animations d'apparition uniquement quand JS tourne.
  document.documentElement.classList.add("js");

  // ---------- Compteurs animés ----------
  function formatNumber(value, format) {
    if (format === "int") {
      return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    if (format === "decimal1") {
      return value.toFixed(1).replace(".", ",");
    }
    if (format === "decimal2") {
      return value.toFixed(2).replace(".", ",");
    }
    return String(value);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var format = el.getAttribute("data-format") || "int";
    var duration = 1400;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(target * eased, format);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll(".counter");
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  // ---------- Filtres projets ----------
  var filterButtons = document.querySelectorAll(".filter-btn");
  var cards = document.querySelectorAll(".project-card");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });

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

  // ---------- Menu mobile ----------
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- Lien actif dans la navigation ----------
  var navLinks = document.querySelectorAll(".site-nav a[href^='#']");
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
