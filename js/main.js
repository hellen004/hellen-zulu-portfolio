(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById("theme-toggle");
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return darkQuery.matches ? "dark" : "light";
  }

  function syncThemeLabel() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    themeBtn.setAttribute("aria-label", "Switch to " + next + " theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", currentTheme() === "dark" ? "#0C1411" : "#0B6B4D");
  }

  themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-toggle");
  var nav = document.getElementById("nav");

  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuBtn.addEventListener("click", function () {
    setMenu(!nav.classList.contains("open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  /* ---------- Highlight the current section in the nav ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
  var targets = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.removeAttribute("aria-current");
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
        });
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- Hero: type out the query, then show the result ---------- */
  var code = document.getElementById("query-code");
  var result = document.getElementById("query-result");

  function showResult() {
    result.classList.add("show");
  }

  /* Copy a node tree, keeping only the first `n` characters of text. */
  function clipTo(node, n) {
    var left = n;
    function walk(src) {
      var copy = src.cloneNode(false);
      for (var i = 0; i < src.childNodes.length && left > 0; i++) {
        var child = src.childNodes[i];
        if (child.nodeType === 3) {
          var take = child.nodeValue.slice(0, left);
          left -= take.length;
          copy.appendChild(document.createTextNode(take));
        } else {
          copy.appendChild(walk(child));
        }
      }
      return copy;
    }
    return walk(node);
  }

  if (code && result) {
    if (reduceMotion) {
      showResult();
    } else {
      var full = code.cloneNode(true);
      var total = full.textContent.length;
      var caret = document.createElement("span");
      caret.className = "caret";
      caret.setAttribute("aria-hidden", "true");
      var i = 0;

      code.setAttribute("aria-label", full.textContent);
      code.innerHTML = "";
      code.appendChild(caret);

      setTimeout(function tick() {
        i += 1;
        var partial = clipTo(full, i);
        code.innerHTML = "";
        while (partial.firstChild) code.appendChild(partial.firstChild);
        code.appendChild(caret);
        if (i < total) {
          var ch = full.textContent.charAt(i - 1);
          setTimeout(tick, ch === "\n" ? 260 : 28);
        } else {
          setTimeout(function () {
            if (caret.parentNode) caret.parentNode.removeChild(caret);
            showResult();
          }, 350);
        }
      }, 500);
    }
  } else if (result) {
    showResult();
  }

  /* ---------- Contact form: build an email in the visitor's mail app ---------- */
  var form = document.getElementById("contact-form");
  var note = document.getElementById("form-note");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      if (!name || !email || !message) return;

      var subject = "Portfolio enquiry from " + name;
      var body = message + "\n\n" + name + "\n" + email;
      window.location.href =
        "mailto:hellenzulu004@gmail.com?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      note.textContent = "If your email app didn't open, write to hellenzulu004@gmail.com directly.";
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
