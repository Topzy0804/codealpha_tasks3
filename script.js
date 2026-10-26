(function () {
  "use strict";

  function rng(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function wrap(inner, p) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' +
      p[0] +
      '"/><stop offset="1" stop-color="' +
      p[1] +
      '"/></linearGradient></defs>' +
      '<rect width="800" height="600" fill="url(#g)"/>' +
      inner +
      "</svg>"
    );
  }
  function ridge(r, base, amp, color) {
    var pts = [],
      y = base - r() * amp,
      x;
    for (x = 0; x <= 800; x += 40) {
      y += (r() - 0.5) * amp * 0.95;
      y = Math.min(base + 20, Math.max(base - amp, y));
      pts.push([x, y]);
    }
    var d = "M0 600 L" + pts[0][0] + " " + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var mx = (pts[i][0] + pts[i + 1][0]) / 2,
        my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += " Q" + pts[i][0] + " " + pts[i][1] + " " + mx + " " + my;
    }
    d += " L800 " + pts[pts.length - 1][1] + " L800 600Z";
    return '<path d="' + d + '" fill="' + color + '"/>';
  }
  function sun(r, p, ymin, yrange) {
    var cx = 160 + r() * 480,
      cy = ymin + r() * yrange,
      rad = 38 + r() * 30;
    return (
      '<circle cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="' +
      rad * 2.4 +
      '" fill="' +
      p[2] +
      '" opacity="0.18"/>' +
      '<circle cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="' +
      rad +
      '" fill="' +
      p[2] +
      '" opacity="0.95"/>'
    );
  }
  function landscape(r, p) {
    var s = sun(r, p, 110, 120);
    for (var i = 0; i < 4; i++)
      s += ridge(r, 300 + i * 72, 130 - i * 22, p[3 + i]);
    return wrap(s, p);
  }
  function city(r, p) {
    var s = sun(r, p, 90, 150),
      layer,
      x,
      w,
      h,
      win;
    for (layer = 0; layer < 2; layer++) {
      x = -10;
      win = "";
      var color = layer ? p[4] : p[3];
      while (x < 810) {
        w = 40 + r() * 55;
        h = layer ? 140 + r() * 250 : 90 + r() * 170;
        var y = 600 - h;
        s +=
          '<rect x="' +
          x.toFixed(1) +
          '" y="' +
          y.toFixed(1) +
          '" width="' +
          (w + 1).toFixed(1) +
          '" height="' +
          h.toFixed(1) +
          '" fill="' +
          color +
          '"' +
          (layer ? "" : ' opacity="0.9"') +
          "/>";
        if (layer) {
          for (var wx = x + 8; wx < x + w - 10; wx += 14) {
            for (var wy = y + 14; wy < 580; wy += 20) {
              if (r() < 0.32)
                win += "M" + wx.toFixed(1) + " " + wy.toFixed(1) + "h6v9h-6z";
            }
          }
        }
        x += w;
      }
      if (layer)
        s += '<path d="' + win + '" fill="' + p[5] + '" opacity="0.9"/>';
    }
    return wrap(s, p);
  }
  function abstract(r, p) {
    var s = "",
      i;
    for (i = 0; i < 8; i++) {
      s +=
        '<circle cx="' +
        (r() * 800).toFixed(0) +
        '" cy="' +
        (r() * 600).toFixed(0) +
        '" r="' +
        (50 + r() * 170).toFixed(0) +
        '" fill="' +
        p[2 + (i % 5)] +
        '" opacity="' +
        (0.55 + r() * 0.35).toFixed(2) +
        '"/>';
    }
    for (i = 0; i < 3; i++) {
      var cx = r() * 800,
        cy = r() * 600,
        rr = 90 + r() * 220;
      s +=
        '<circle cx="' +
        cx.toFixed(0) +
        '" cy="' +
        cy.toFixed(0) +
        '" r="' +
        rr.toFixed(0) +
        '" fill="none" stroke="' +
        p[6] +
        '" stroke-width="' +
        (2 + r() * 5).toFixed(1) +
        '" opacity="0.7"/>';
    }
    for (i = 0; i < 5; i++) {
      var y0 = r() * 600;
      s +=
        '<path d="M0 ' +
        y0.toFixed(0) +
        " C 250 " +
        (y0 - 120 + r() * 240).toFixed(0) +
        " 550 " +
        (y0 - 120 + r() * 240).toFixed(0) +
        " 800 " +
        (r() * 600).toFixed(0) +
        '" fill="none" stroke="' +
        p[6] +
        '" stroke-width="1.5" opacity="0.45"/>';
    }
    return wrap(s, p);
  }
  function ocean(r, p) {
    var hor = 320,
      s = "",
      i,
      x;
    var sx = 220 + r() * 360,
      srad = 36 + r() * 24;
    s +=
      '<circle cx="' +
      sx +
      '" cy="' +
      (hor - 50 - r() * 40) +
      '" r="' +
      srad +
      '" fill="' +
      p[2] +
      '"/>';
    s +=
      '<rect x="0" y="' +
      hor +
      '" width="800" height="280" fill="' +
      p[3] +
      '"/>';
    for (i = 0; i < 9; i++) {
      var ww = srad * 2.2 * (1 - i * 0.09);
      s +=
        '<rect x="' +
        (sx - ww / 2).toFixed(0) +
        '" y="' +
        (hor + 6 + i * 18) +
        '" width="' +
        ww.toFixed(0) +
        '" height="5" rx="2.5" fill="' +
        p[2] +
        '" opacity="' +
        (0.8 - i * 0.07).toFixed(2) +
        '"/>';
    }
    for (i = 0; i < 4; i++) {
      var base = 380 + i * 62,
        amp = 7 + i * 4,
        f = 55 - i * 8,
        ph = r() * 6,
        d = "M0 600 L0 " + base;
      for (x = 0; x <= 800; x += 10)
        d += " L" + x + " " + (base + Math.sin(x / f + ph) * amp).toFixed(1);
      d += " L800 600Z";
      s +=
        '<path d="' +
        d +
        '" fill="' +
        p[4 + Math.min(i, 2)] +
        '" opacity="' +
        (0.55 + i * 0.15).toFixed(2) +
        '"/>';
    }
    var bx = 80 + r() * 560;
    s +=
      '<path d="M' +
      bx +
      " " +
      (hor + 22) +
      'h46l-8 8h-30z" fill="' +
      p[6] +
      '"/>' +
      '<path d="M' +
      (bx + 22) +
      " " +
      (hor - 26) +
      'v44l-18 0z" fill="' +
      p[2] +
      '"/>' +
      '<path d="M' +
      (bx + 26) +
      " " +
      (hor - 16) +
      'v34l14 0z" fill="' +
      p[2] +
      '" opacity="0.8"/>';
    return wrap(s, p);
  }
  var makers = {
    landscape: landscape,
    city: city,
    abstract: abstract,
    ocean: ocean,
  };
  function uri(type, seed, pal) {
    return (
      "data:image/svg+xml;utf8," +
      encodeURIComponent(makers[type](rng(seed), pal))
    );
  }

  /* ---------- Data ---------- */
  var CATS = [
    { id: "all", label: "All plates" },
    { id: "landscape", label: "Landscapes" },
    { id: "city", label: "Cityscapes" },
    { id: "abstract", label: "Abstract" },
    { id: "ocean", label: "Seascapes" },
  ];
  var LABEL = {
    landscape: "Landscape",
    city: "Cityscape",
    abstract: "Abstract",
    ocean: "Seascape",
  };

  var P = {
    dawn: [
      "#2b3a67",
      "#f4a261",
      "#ffe8a3",
      "#c77d8a",
      "#8a5a83",
      "#4b3f6b",
      "#262045",
    ],
    blue: [
      "#0b1d3a",
      "#5f7fb0",
      "#d9e4f5",
      "#4d6a99",
      "#385179",
      "#263a5e",
      "#16243d",
    ],
    ember: [
      "#3a0f1c",
      "#e8553d",
      "#ffd59a",
      "#b8412f",
      "#7d2a2a",
      "#4a1b24",
      "#25101a",
    ],
    mint: [
      "#bfe3d4",
      "#f6f1d8",
      "#fffbe8",
      "#8cc5ae",
      "#5a9e8c",
      "#2f735f",
      "#1a4a42",
    ],
    dusk: ["#1b1740", "#ff7a59", "#ffd6a0", "#4a3a7a", "#2d2459", "#ffd37a"],
    night: ["#050816", "#1b2a55", "#e9eefc", "#16224a", "#0a1028", "#ffe08a"],
    gold: ["#d8c8a8", "#f3e4c0", "#fff5da", "#a99878", "#5d5446", "#ffd27a"],
    teal: ["#0b2a33", "#3fb6b0", "#d4fff6", "#1d6f78", "#0b3a44", "#ff9f5a"],
    abA: [
      "#101820",
      "#2a3b4f",
      "#ff5d5d",
      "#ffb347",
      "#47c1bf",
      "#7a6cf0",
      "#f2f2f2",
    ],
    abB: [
      "#f3e9dc",
      "#c9ddd6",
      "#e4572e",
      "#17bebb",
      "#ffc914",
      "#2e282a",
      "#2e282a",
    ],
    abC: [
      "#1d0b3b",
      "#6a1b9a",
      "#ff80ab",
      "#ffd180",
      "#80d8ff",
      "#b9f6ca",
      "#ffffff",
    ],
    abD: [
      "#e8f1f2",
      "#a9c5d0",
      "#13293d",
      "#006494",
      "#247ba0",
      "#f4b942",
      "#13293d",
    ],
    seaA: [
      "#8ecae6",
      "#fdf0d5",
      "#ffb703",
      "#219ebc",
      "#126782",
      "#023047",
      "#011c2b",
    ],
    seaB: [
      "#2a1b4a",
      "#ff8e72",
      "#fff0c2",
      "#5a4a8a",
      "#3b2f6b",
      "#241a4a",
      "#150f2c",
    ],
    seaC: [
      "#0a1a2f",
      "#34608c",
      "#f2f6ff",
      "#1f4770",
      "#173a5c",
      "#0f2a45",
      "#08182a",
    ],
    seaD: [
      "#cfeee7",
      "#f9f3d0",
      "#ff9a76",
      "#57b8a8",
      "#2f8f87",
      "#1b6670",
      "#103f4b",
    ],
  };

  var ITEMS = [
    {
      t: "Ridge at Dawn",
      c: "landscape",
      s: 11,
      p: "dawn",
      sp: "wide",
      alt: "Layered purple mountain ridges under an orange dawn sky with a pale sun",
    },
    {
      t: "Harbour Lights",
      c: "city",
      s: 21,
      p: "dusk",
      sp: "",
      alt: "City skyline at dusk with lit windows and a low orange sun",
    },
    {
      t: "Orbit Study I",
      c: "abstract",
      s: 31,
      p: "abA",
      sp: "tall",
      alt: "Overlapping red, amber, teal and violet circles with thin white rings",
    },
    {
      t: "Low Tide, Gold",
      c: "ocean",
      s: 41,
      p: "seaA",
      sp: "",
      alt: "Calm blue sea with a golden sun reflecting in stripes and a small sailboat",
    },
    {
      t: "Blue Hour Valley",
      c: "landscape",
      s: 12,
      p: "blue",
      sp: "tall",
      alt: "Cool blue hills fading into the distance under a pale evening sky",
    },
    {
      t: "Night Shift",
      c: "city",
      s: 22,
      p: "night",
      sp: "wide",
      alt: "Dark skyline with many yellow windows under a bright moon",
    },
    {
      t: "Cut Paper Garden",
      c: "abstract",
      s: 32,
      p: "abB",
      sp: "",
      alt: "Red, teal and yellow circles on a pale background with dark rings",
    },
    {
      t: "Violet Tide",
      c: "ocean",
      s: 42,
      p: "seaB",
      sp: "",
      alt: "Purple evening sea under a peach sky with a small boat",
    },
    {
      t: "Ember Peaks",
      c: "landscape",
      s: 13,
      p: "ember",
      sp: "",
      alt: "Dark red mountain ridges beneath a glowing orange sky",
    },
    {
      t: "Dust and Gold",
      c: "city",
      s: 23,
      p: "gold",
      sp: "tall",
      alt: "Hazy beige skyline with a few warm lit windows",
    },
    {
      t: "Orbit Study II",
      c: "abstract",
      s: 33,
      p: "abC",
      sp: "wide",
      alt: "Pink, apricot and sky blue circles on a deep purple background",
    },
    {
      t: "Night Crossing",
      c: "ocean",
      s: 43,
      p: "seaC",
      sp: "",
      alt: "Deep blue water at night with a bright moon and a lone sail",
    },
    {
      t: "Mint Haze",
      c: "landscape",
      s: 14,
      p: "mint",
      sp: "",
      alt: "Soft green hills in morning haze with a pale sun",
    },
    {
      t: "Neon Quarter",
      c: "city",
      s: 24,
      p: "teal",
      sp: "",
      alt: "Teal skyline with orange windows and a light mint sun",
    },
    {
      t: "Grid and Glow",
      c: "abstract",
      s: 34,
      p: "abD",
      sp: "tall",
      alt: "Navy, blue and gold circles over a pale blue background",
    },
    {
      t: "Shallows",
      c: "ocean",
      s: 44,
      p: "seaD",
      sp: "wide",
      alt: "Turquoise shallow water under a cream sky with a coral sun",
    },
  ];

  /* ---------- Build the grid ---------- */
  var grid = document.getElementById("grid");
  var chipsEl = document.getElementById("chips");
  var statusEl = document.getElementById("status");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  ITEMS.forEach(function (it, i) {
    it.n = i + 1;
    it.src = uri(it.c === "abstract" ? "abstract" : it.c, it.s, P[it.p]);
    var b = document.createElement("button");
    b.type = "button";
    b.className = "card" + (it.sp ? " " + it.sp : "");
    b.setAttribute("aria-label", "Open " + it.t + ", " + LABEL[it.c]);
    b.innerHTML =
      '<img alt="" loading="lazy" decoding="async"><span class="cap"><b></b><i></i></span>';
    b.querySelector("img").src = it.src;
    b.querySelector("b").textContent = it.t;
    b.querySelector("i").textContent = LABEL[it.c];
    b.addEventListener("click", function () {
      openLb(it);
    });
    it.el = b;
    grid.appendChild(b);
  });

  var state = { cat: "all" };

  CATS.forEach(function (c) {
    var count =
      c.id === "all"
        ? ITEMS.length
        : ITEMS.filter(function (x) {
            return x.c === c.id;
          }).length;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.cat = c.id;
    b.innerHTML = '<span></span><span class="n"></span>';
    b.firstChild.textContent = c.label;
    b.lastChild.textContent = String(count).padStart(2, "0");
    b.addEventListener("click", function () {
      setFilter(c.id);
    });
    chipsEl.appendChild(b);
  });

  function matches(it) {
    return state.cat === "all" || it.c === state.cat;
  }
  function visibleItems() {
    return ITEMS.filter(matches);
  }

  var timer = null;
  function setFilter(cat) {
    if (cat === state.cat) return;
    state.cat = cat;
    Array.prototype.forEach.call(chipsEl.children, function (b) {
      b.setAttribute("aria-pressed", b.dataset.cat === cat ? "true" : "false");
    });
    var shown = visibleItems().length;
    statusEl.textContent = "Showing " + shown + " of " + ITEMS.length;
    try {
      sessionStorage.setItem("ls-cat", cat);
    } catch (e) {}

    var out = [],
      inn = [];
    ITEMS.forEach(function (it) {
      var m = matches(it),
        el = it.el;
      if (m && !el.hidden) el.classList.remove("is-out");
      if (m && el.hidden) inn.push(el);
      if (!m && !el.hidden) {
        out.push(el);
        el.classList.add("is-out");
      }
    });
    clearTimeout(timer);
    timer = setTimeout(
      function () {
        var stay = ITEMS.map(function (it) {
          return it.el;
        }).filter(function (el) {
          return !el.hidden && out.indexOf(el) === -1;
        });
        var first = new Map();
        stay.forEach(function (el) {
          first.set(el, el.getBoundingClientRect());
        });
        out.forEach(function (el) {
          el.hidden = true;
        });
        inn.forEach(function (el) {
          el.classList.add("is-out");
          el.hidden = false;
        });
        stay.forEach(function (el) {
          var a = first.get(el),
            b = el.getBoundingClientRect();
          var dx = a.left - b.left,
            dy = a.top - b.top;
          if (dx || dy) {
            el.style.transition = "none";
            el.style.transform = "translate(" + dx + "px," + dy + "px)";
          }
        });
        void grid.offsetWidth;
        stay.forEach(function (el) {
          el.style.transition = "";
          el.style.transform = "";
        });
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            inn.forEach(function (el) {
              el.classList.remove("is-out");
            });
          });
        });
      },
      reduced ? 0 : 260,
    );
  }

  // initial state (restore remembered filter if any)
  var start = "all";
  try {
    var saved = sessionStorage.getItem("ls-cat");
    if (
      saved &&
      CATS.some(function (c) {
        return c.id === saved;
      })
    )
      start = saved;
  } catch (e) {}
  state.cat = "__init";
  setFilter(start);
  ITEMS.forEach(function (it) {
    if (!matches(it)) {
      it.el.hidden = true;
      it.el.classList.add("is-out");
    }
  });
  clearTimeout(timer);
  statusEl.textContent =
    "Showing " + visibleItems().length + " of " + ITEMS.length;

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lb");
  var stage = document.getElementById("lbStage");
  var img = document.getElementById("lbImg");
  var lbTitle = document.getElementById("lbTitle");
  var lbSub = document.getElementById("lbSub");
  var lbSw = document.getElementById("lbSw");
  var lbCount = document.getElementById("lbCount");
  var current = null,
    list = [],
    lastFocus = null,
    swapTimer = null;

  function render(it, animate) {
    var idx = list.indexOf(it) + 1;
    lbCount.textContent =
      "Plate " +
      String(it.n).padStart(2, "0") +
      " · " +
      idx +
      " / " +
      list.length;
    function apply() {
      img.src = it.src;
      img.alt = it.alt;
      lbTitle.textContent = it.t;
      lbSub.textContent = LABEL[it.c];
      lbSw.innerHTML = "";
      P[it.p].slice(2, 7).forEach(function (col) {
        var s = document.createElement("span");
        s.style.background = col;
        lbSw.appendChild(s);
      });
      requestAnimationFrame(function () {
        stage.classList.remove("swap");
      });
    }
    if (animate && !reduced) {
      stage.classList.add("swap");
      clearTimeout(swapTimer);
      swapTimer = setTimeout(apply, 180);
    } else {
      apply();
    }
  }
  function openLb(it) {
    lastFocus = document.activeElement;
    list = visibleItems();
    current = it;
    render(it, false);
    lb.inert = false;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    document.getElementById("lbClose").focus({ preventScroll: true });
  }
  function closeLb() {
    lb.classList.remove("open");
    lb.inert = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function step(d) {
    if (!lb.classList.contains("open") || !list.length) return;
    var i = (list.indexOf(current) + d + list.length) % list.length;
    current = list[i];
    render(current, true);
  }
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", function () {
    step(-1);
  });
  document.getElementById("lbNext").addEventListener("click", function () {
    step(1);
  });
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target === stage) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Tab") {
      var f = Array.prototype.slice.call(lb.querySelectorAll("button"));
      var first = f[0],
        last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  var tx = null;
  stage.addEventListener(
    "touchstart",
    function (e) {
      tx = e.changedTouches[0].clientX;
    },
    { passive: true },
  );
  stage.addEventListener(
    "touchend",
    function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      tx = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    },
    { passive: true },
  );
})();
