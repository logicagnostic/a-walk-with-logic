/* Matrix quote: the quote resolves out of code, and the code hides a message.
   Hidden lines use a two digit alphabet code: A = 01 ... Z = 26.
   Used by the matrix-quote shortcode. */
(function () {
  if (window.__matrixQuoteLoaded) return;
  window.__matrixQuoteLoaded = true;

  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function encode(str) {
    return (str || "").toLowerCase().replace(/[^a-z]/g, "").split("").map(function (c) {
      var n = c.charCodeAt(0) - 96;
      return (n < 10 ? "0" : "") + n;
    }).join("");
  }

  /* mostly 0 and 1, with 2 to 9 mixed in */
  function noise() {
    return Math.random() < 0.6 ? (Math.random() < 0.5 ? "0" : "1") : String(2 + Math.floor(Math.random() * 8));
  }

  function setup(box) {
    var inner = box.querySelector(".mq-inner");
    var canvas = box.querySelector("canvas");
    var p = box.querySelector(".mq-text");
    var sig = box.querySelector(".mq-sig");
    var quote = p.textContent;
    var signature = sig ? sig.textContent : "";

    if (still) return;

    /* screen readers get the plain quote; the animated letters are hidden from them */
    var plain = document.createElement("span");
    plain.className = "mq-sr";
    plain.textContent = quote + (signature ? " " + signature : "");
    inner.appendChild(plain);
    p.setAttribute("aria-hidden", "true");
    if (sig) sig.setAttribute("aria-hidden", "true");

    function build(el, str) {
      el.textContent = "";
      return str.split("").map(function (c) {
        var s = document.createElement("span");
        s.className = "ch";
        s.dataset.c = c;
        s.textContent = c;
        el.appendChild(s);
        return s;
      });
    }
    var letters = build(p, quote).concat(sig ? build(sig, signature) : []);

    var CODE = encode(box.dataset.hidden), CODE2 = encode(box.dataset.hidden2);

    /* first pass: hidden line one, then hidden line two, leftover spots random */
    var LINE = CODE + CODE2, k = 0;
    letters.forEach(function (s) {
      if (s.dataset.c === " ") return;
      s.dataset.h = k < LINE.length ? LINE.charAt(k) : "";
      k++;
    });

    /* falling code: each column reads the hidden lines top to bottom, with random gaps */
    var STREAM = CODE + "      " + (CODE2 ? CODE2 + "      " : "");
    function streamDigit(i) {
      var c = STREAM.charAt(i % STREAM.length);
      return c === " " || c === "" ? noise() : c;
    }
    var ctx = canvas.getContext("2d"), cols = [], size = 14, w = 0, h = 0;
    function resize() {
      var r = inner.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      w = r.width; h = r.height;
      canvas.width = w * d; canvas.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      cols = [];
      for (var x = 0; x < Math.ceil(w / size); x++) {
        cols.push({ row: Math.floor(Math.random() * -h / size), ptr: Math.floor(Math.random() * STREAM.length), speed: 1 + (x % 3) });
      }
    }
    resize();
    window.addEventListener("resize", resize);

    /* only animate while the quote is on screen */
    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(box);
    }

    var lastStep = 0, tickN = 0;
    function rain(now) {
      requestAnimationFrame(rain);
      if (!visible || now - lastStep < 85) return;
      lastStep = now; tickN++;
      ctx.fillStyle = "rgba(13,18,13,0.10)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = size + "px monospace";
      ctx.fillStyle = "#b6ffcb";
      cols.forEach(function (col, x) {
        if (tickN % (4 - col.speed) !== 0) return;
        col.row++;
        var y = col.row * size;
        ctx.fillText(streamDigit(col.ptr), x * size, y);
        col.ptr++;
        if (y > h && Math.random() > 0.9) col.row = 0;
      });
    }
    requestAnimationFrame(rain);

    function toCode(s) { s.className = "ch code"; s.textContent = s.dataset.h || noise(); }

    function cycle() {
      letters.forEach(function (s) { if (s.dataset.c !== " ") toCode(s); });
      var start = performance.now();
      var spread = 5200, hold = 2200;
      var lockAt = letters.map(function (s, i) { return hold + (i / letters.length) * spread + Math.random() * 120; });
      (function tick(now) {
        var t = now - start, done = true;
        letters.forEach(function (s, i) {
          if (s.dataset.c === " ") return;
          if (t < lockAt[i]) { done = false; return; }
          var cls = t < lockAt[i] + 450 ? "ch lock" : "ch";
          if (s.className !== cls) { s.className = cls; s.textContent = s.dataset.c; }
          if (cls !== "ch") done = false;
        });
        if (!done) return requestAnimationFrame(tick);
        glitch(performance.now());
      })(start);
    }

    /* while the quote holds, a letter now and then slips back to its code digit */
    function glitch(holdStart) {
      (function tick(now) {
        if (now - holdStart > 8000) return dissolve();
        if (Math.random() < 0.015) {
          var s = letters[Math.floor(Math.random() * letters.length)];
          if (s.dataset.c !== " ") {
            toCode(s);
            setTimeout(function () { s.className = "ch"; s.textContent = s.dataset.c; }, 320);
          }
        }
        requestAnimationFrame(tick);
      })(holdStart);
    }

    function dissolve() {
      var start = performance.now();
      var at = letters.map(function (s, i) { return (i / letters.length) * 2400 + Math.random() * 400; });
      (function tick(now) {
        var t = now - start, done = true;
        letters.forEach(function (s, i) {
          if (s.dataset.c === " ") return;
          if (t > at[i]) { if (s.className !== "ch code") toCode(s); }
          else done = false;
        });
        if (!done) return requestAnimationFrame(tick);
        setTimeout(cycle, 3500);
      })(start);
    }

    cycle();
  }

  function init() { document.querySelectorAll("[data-mq]").forEach(setup); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
