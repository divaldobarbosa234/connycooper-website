(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var nodes = document.querySelectorAll("[data-reveal]");

  document.documentElement.classList.add("js");

  function show(node) {
    node.classList.add("is-in");
    node.classList.remove("reveal-pending");
  }

  function reveal() {
    if (!nodes.length || reduce.matches || !("IntersectionObserver" in window)) {
      nodes.forEach(show);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var delay = entry.target.getAttribute("data-reveal-delay");
          if (delay) {
            entry.target.style.transitionDelay = delay + "ms";
          }
          show(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );

    nodes.forEach(function (node) {
      var rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        show(node);
        return;
      }
      node.classList.add("reveal-pending");
      observer.observe(node);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reveal);
  } else {
    reveal();
  }
})();
