/* Blog archive: category filters, search, featured article, empty state. */
(function () {
  "use strict";

  var list = document.getElementById("article-list");
  if (!list || !window.ARTICLES) return;

  var U = window.siteUtils;
  var featuredBox = document.getElementById("featured");
  var filterBox = document.getElementById("category-filters");
  var searchInput = document.getElementById("search");
  var emptyState = document.getElementById("empty");
  var resultCount = document.getElementById("result-count");
  var clearButton = document.getElementById("clear-filters");

  var articles = window.ARTICLES;
  var categories = ["All"];
  articles.forEach(function (a) {
    if (categories.indexOf(a.category) === -1) categories.push(a.category);
  });

  var state = { category: "All", query: "" };

  function matches(article, query) {
    if (!query) return true;
    var haystack = (article.title + " " + article.excerpt + " " + article.tags.join(" ")).toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function featuredCard(article) {
    var wrap = U.el("section", "featured-article");
    wrap.setAttribute("aria-labelledby", "featured-title");
    wrap.appendChild(U.el("span", "label-mono", "Featured · " + article.category));
    var title = U.el("h2", "title-featured");
    title.id = "featured-title";
    var link = U.el("a", "", article.title);
    link.href = "article.html?slug=" + encodeURIComponent(article.slug);
    link.style.color = "var(--ink)";
    link.style.textDecoration = "none";
    title.appendChild(link);
    wrap.appendChild(title);
    wrap.appendChild(U.el("p", "lead-text", article.excerpt));
    wrap.appendChild(U.el("p", "meta-line", article.readingTime + "  ·  " + U.formatDate(article.date)));
    return wrap;
  }

  function renderFilters() {
    filterBox.textContent = "";
    categories.forEach(function (name) {
      var button = U.el("button", "filter-btn", name);
      button.type = "button";
      button.setAttribute("aria-pressed", String(state.category === name));
      button.addEventListener("click", function () {
        state.category = name;
        render();
      });
      filterBox.appendChild(button);
    });
  }

  function render() {
    renderFilters();

    var query = state.query.trim().toLowerCase();
    var visible = articles.filter(function (a) {
      return (state.category === "All" || a.category === state.category) && matches(a, query);
    });

    featuredBox.textContent = "";
    var rest = visible;
    var showFeatured = state.category === "All" && !query;
    if (showFeatured) {
      var featured = articles.filter(function (a) { return a.featured; })[0];
      if (featured && visible.indexOf(featured) !== -1) {
        featuredBox.appendChild(featuredCard(featured));
        rest = visible.filter(function (a) { return a !== featured; });
      }
    }

    list.textContent = "";
    rest.forEach(function (a) { list.appendChild(U.articleCard(a, "")); });

    var total = visible.length;
    emptyState.hidden = total !== 0;
    resultCount.textContent = total + (total === 1 ? " article" : " articles");
  }

  searchInput.addEventListener("input", function () {
    state.query = searchInput.value;
    render();
  });

  clearButton.addEventListener("click", function () {
    state.category = "All";
    state.query = "";
    searchInput.value = "";
    render();
    searchInput.focus();
  });

  render();
})();
