(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var nodes = document.querySelectorAll("[data-reveal]");
  var ENTER = 0.2;
  var observer;

  document.documentElement.classList.add("js");

  function delayMs(node) {
    var delay = node.getAttribute("data-reveal-delay");
    return delay ? delay + "ms" : "0ms";
  }

  function enter(node) {
    if (node.classList.contains("is-in")) return;
    node.style.transitionDelay = delayMs(node);
    node.classList.add("is-in");
    node.classList.remove("is-out");
    node.inert = false;
  }

  function leave(node) {
    if (!node.classList.contains("is-in")) return;
    node.style.transitionDelay = "0ms";
    node.classList.remove("is-in");
    node.classList.add("is-out");
    node.inert = true;
  }

  function showAll() {
    nodes.forEach(function (node) {
      node.style.transitionDelay = "0ms";
      node.classList.add("is-in");
      node.classList.remove("is-out");
      node.inert = false;
    });
  }

  function onIntersect(entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio >= ENTER) {
        enter(entry.target);
      } else if (!entry.isIntersecting) {
        leave(entry.target);
      }
    });
  }

  function start() {
    if (!nodes.length) return;

    if (reduce.matches || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    observer = new IntersectionObserver(onIntersect, {
      threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1]
    });

    nodes.forEach(function (node) {
      node.classList.remove("is-in", "is-out");
      node.inert = true;
      observer.observe(node);
    });
  }

  function stop() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function sync() {
    stop();
    if (reduce.matches) {
      showAll();
      return;
    }
    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  if (typeof reduce.addEventListener === "function") {
    reduce.addEventListener("change", sync);
  } else if (typeof reduce.addListener === "function") {
    reduce.addListener(sync);
  }

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) sync();
  });
})();
