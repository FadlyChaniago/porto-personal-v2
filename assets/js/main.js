/* Shared behaviour for every page: theme toggle, header state, nav highlight,
   scroll reveals, subtle parallax, mobile menu, and the homepage writing preview. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- small helpers (shared with blog.js and article.js) ---------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function formatDate(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    });
  }

  function articleCard(article, base) {
    var item = el("article", "writing-item");
    var meta = el("p", "meta-line");
    meta.appendChild(el("span", "label-mono", article.category));
    meta.appendChild(document.createTextNode("  ·  " + article.readingTime + "  ·  " + formatDate(article.date)));

    var title = el("h3");
    var link = el("a", "", article.title);
    link.href = base + "article.html?slug=" + encodeURIComponent(article.slug);
    title.appendChild(link);

    item.appendChild(meta);
    item.appendChild(title);
    item.appendChild(el("p", "excerpt", article.excerpt));
    return item;
  }

  window.siteUtils = { el: el, formatDate: formatDate, articleCard: articleCard };

  /* ---------- theme ---------- */
  var themeToggle = document.getElementById("themeToggle");

  function paintThemeToggle() {
    if (!themeToggle) return;
    var dark = root.getAttribute("data-bs-theme") === "dark";
    var icon = themeToggle.querySelector("i");
    if (icon) icon.className = dark ? "bi bi-sun" : "bi bi-moon-stars";
    var label = dark ? "Switch to light theme" : "Switch to dark theme";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-bs-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: theme still switches for this view */ }
      paintThemeToggle();
    });
  }
  paintThemeToggle();

  /* ---------- header state ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- active section in the nav (homepage only) ---------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll("[data-spy-link]"));
  if ("IntersectionObserver" in window && spyLinks.length) {
    var linkFor = {};
    spyLinks.forEach(function (link) {
      linkFor[link.getAttribute("href").replace("#", "")] = link;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        spyLinks.forEach(function (l) { l.classList.remove("active"); });
        var match = linkFor[entry.target.id];
        if (match) match.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---------- homepage: latest writing preview (3 featured articles) ---------- */
  var homeWriting = document.getElementById("home-writing");
  if (homeWriting && window.ARTICLES) {
    var featured = window.ARTICLES.filter(function (a) { return a.featured; }).slice(0, 3);
    homeWriting.textContent = "";
    featured.forEach(function (a) { homeWriting.appendChild(articleCard(a, "blog/")); });
  }

  /* ---------- scroll reveals ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (node) { node.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (node) { revealObserver.observe(node); });
  }

  /* ---------- subtle parallax: transform only, desktop only, one rAF per frame ---------- */
  var layers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var wideScreen = window.matchMedia("(min-width: 992px)");
  if (layers.length && !reduceMotion) {
    var ticking = false;
    var updateParallax = function () {
      ticking = false;
      if (!wideScreen.matches) {
        layers.forEach(function (layer) { layer.style.transform = ""; });
        return;
      }
      var y = window.scrollY;
      layers.forEach(function (layer) {
        var depth = parseFloat(layer.getAttribute("data-parallax")) || 0;
        layer.style.transform = "translate3d(0," + (-y * depth).toFixed(1) + "px,0)";
      });
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- mobile menu closes after a link is chosen ---------- */
  var collapseEl = document.getElementById("siteNav");
  if (collapseEl && window.bootstrap) {
    collapseEl.querySelectorAll("a.nav-link-site").forEach(function (link) {
      link.addEventListener("click", function () {
        window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
      });
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
