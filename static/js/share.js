(function () {
  var fab = document.querySelector(".share-fab");
  var feedback = document.querySelector(".share-feedback");
  if (!fab) return;

  var articles = Array.prototype.slice.call(document.querySelectorAll("article[data-share-url]"));
  var current = { url: window.location.href, title: document.title };

  function updateFromArticle(article) {
    current = {
      url: article.getAttribute("data-share-url"),
      title: article.getAttribute("data-share-title")
    };
  }

  if (articles.length === 1) {
    updateFromArticle(articles[0]);
  } else if (articles.length > 1) {
    var observer = new IntersectionObserver(function (entries) {
      var best = null;
      entries.forEach(function (entry) {
        if (!best || entry.intersectionRatio > best.intersectionRatio) {
          best = entry;
        }
      });
      if (best && best.intersectionRatio > 0) {
        updateFromArticle(best.target);
      }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    articles.forEach(function (a) { observer.observe(a); });
  }

  fab.addEventListener("click", function () {
    var url = current.url;
    var title = current.title;

    if (navigator.share) {
      navigator.share({ title: title, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        feedback.textContent = "link copied";
        setTimeout(function () { feedback.textContent = ""; }, 2000);
      });
    }
  });
})();
