/* Article template: renders one article from articles.js (chosen with ?slug=),
   builds the table of contents, copy buttons, reading progress, pager and related links. */
(function () {
  "use strict";

  var U = window.siteUtils;
  var articles = window.ARTICLES || [];
  var slug = new URLSearchParams(window.location.search).get("slug");
  var index = -1;
  articles.forEach(function (a, i) { if (a.slug === slug) index = i; });

  var wrap = document.getElementById("articleWrap");
  var notFound = document.getElementById("notFound");

  if (index === -1) {
    if (wrap) wrap.hidden = true;
    if (notFound) notFound.hidden = false;
    document.title = "Article not found · Muhammad Fadly";
    return;
  }

  var article = articles[index];
  document.title = article.title + " · Muhammad Fadly";
  var metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", article.excerpt);

  function setText(id, text) {
    var node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  setText("crumb-current", article.title);
  setText("category", article.category);
  setText("title", article.title);
  setText("excerpt", article.excerpt);
  setText("meta", U.formatDate(article.date) + "  ·  " + article.readingTime);

  /* ---------- body + table of contents ---------- */
  var body = document.getElementById("body");
  var toc = document.getElementById("toc");
  var tocDetails = document.getElementById("tocDetails");
  var headingCount = 0;

  function copyText(text, button) {
    if (!navigator.clipboard) { button.textContent = "Select to copy"; return; }
    navigator.clipboard.writeText(text).then(function () {
      button.textContent = "Copied";
      window.setTimeout(function () { button.textContent = "Copy"; }, 1600);
    }).catch(function () {
      button.textContent = "Select to copy";
    });
  }

  article.body.forEach(function (block) {
    if (block.t === "h2") {
      headingCount += 1;
      var heading = U.el("h2", "", block.x);
      heading.id = "section-" + headingCount;
      body.appendChild(heading);

      var item = U.el("li");
      var link = U.el("a", "", block.x);
      link.href = "#" + heading.id;
      item.appendChild(link);
      toc.appendChild(item);
    } else if (block.t === "p") {
      body.appendChild(U.el("p", "", block.x));
    } else if (block.t === "quote") {
      body.appendChild(U.el("blockquote", "", block.x));
    } else if (block.t === "ul") {
      var list = U.el("ul");
      block.items.forEach(function (text) { list.appendChild(U.el("li", "", text)); });
      body.appendChild(list);
    } else if (block.t === "code") {
      var codeWrap = U.el("div", "code-wrap");
      var pre = U.el("pre");
      pre.appendChild(U.el("code", "", block.x));
      var copyButton = U.el("button", "copy-btn", "Copy");
      copyButton.type = "button";
      copyButton.setAttribute("aria-label", "Copy code to clipboard");
      copyButton.addEventListener("click", function () { copyText(block.x, copyButton); });
      codeWrap.appendChild(copyButton);
      codeWrap.appendChild(pre);
      body.appendChild(codeWrap);
    }
  });

  if (headingCount === 0 && tocDetails) tocDetails.hidden = true;

  // Mobile: collapsed disclosure. Desktop: open sidebar.
  if (tocDetails) {
    tocDetails.open = window.matchMedia("(min-width: 992px)").matches;
  }

  /* ---------- reading progress (transform only) ---------- */
  var bar = document.querySelector(".progress-bar");
  var bodyStart = document.getElementById("articleBody");
  var progressTicking = false;

  function updateProgress() {
    progressTicking = false;
    if (!bar || !bodyStart) return;
    var top = bodyStart.getBoundingClientRect().top + window.scrollY;
    var total = bodyStart.offsetHeight - window.innerHeight;
    var ratio = total > 0 ? (window.scrollY - top) / total : 0;
    ratio = Math.min(1, Math.max(0, ratio));
    bar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
  }

  window.addEventListener("scroll", function () {
    if (!progressTicking) {
      progressTicking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  /* ---------- share ---------- */
  var pageUrl = window.location.href;
  var xLink = document.getElementById("shareX");
  var linkedInLink = document.getElementById("shareLinkedIn");
  if (xLink) xLink.href = "https://x.com/intent/post?text=" + encodeURIComponent(article.title) + "&url=" + encodeURIComponent(pageUrl);
  if (linkedInLink) linkedInLink.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(pageUrl);

  var copyLinkButton = document.getElementById("copyLink");
  if (copyLinkButton) {
    copyLinkButton.addEventListener("click", function () {
      var label = copyLinkButton.querySelector("span");
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(pageUrl).then(function () {
        if (label) label.textContent = "Link copied";
        window.setTimeout(function () { if (label) label.textContent = "Copy link"; }, 1600);
      }).catch(function () { /* clipboard blocked: the URL is still in the address bar */ });
    });
  }

  /* ---------- previous / next ---------- */
  function pagerLink(target, label, className) {
    var link = U.el("a", className);
    link.href = "article.html?slug=" + encodeURIComponent(target.slug);
    link.appendChild(U.el("span", "label-mono", label));
    link.appendChild(U.el("strong", "", target.title));
    return link;
  }

  var pager = document.getElementById("pager");
  if (pager) {
    // The list is newest first: "Newer" is the previous index, "Older" the next.
    if (index > 0) pager.appendChild(pagerLink(articles[index - 1], "Newer", "prev"));
    if (index < articles.length - 1) pager.appendChild(pagerLink(articles[index + 1], "Older", "next"));
    if (!pager.children.length) pager.hidden = true;
  }

  /* ---------- related: same category first, then the most recent others ---------- */
  var relatedList = document.getElementById("related-list");
  if (relatedList) {
    var related = articles.filter(function (a) { return a.slug !== article.slug && a.category === article.category; });
    if (related.length < 2) {
      articles.forEach(function (a) {
        if (a.slug !== article.slug && related.indexOf(a) === -1) related.push(a);
      });
    }
    related.slice(0, 2).forEach(function (a) { relatedList.appendChild(U.articleCard(a, "")); });
    if (!relatedList.children.length) {
      var relatedSection = document.getElementById("related");
      if (relatedSection) relatedSection.hidden = true;
    }
  }
})();
