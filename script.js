(() => {
  const cfg = Object.assign({
    receiver: "Cô",
    nickname: "",
    sender: "",
    avatar: "",
    photoCaption: "",
    skyText: "20.11",
    skySub: "Ngày Nhà giáo Việt Nam",
    hint: "Chạm vào con dấu để mở thư",
    envelopeNote: "",
    date: "",
    greeting: "",
    name: "{to}",
    message: "",
    closing: "",
    signature: "{from}",
    finale: "Happy Teacher's Day",
    wordSpeed: 110
  }, window.CARD_CONFIG || {});

  const nick = cfg.nickname || cfg.receiver;
  const fill = (s) =>
    String(s || "").replace(/\{to\}/g, cfg.receiver).replace(/\{nick\}/g, nick).replace(/\{from\}/g, cfg.sender);

  // Gắn phiên bản vào link ảnh để điện thoại không dùng ảnh cũ trong cache
  const build = window.BUILD && window.BUILD.indexOf("__") !== 0 ? window.BUILD : "";
  const bust = (url) => (build ? url + (url.includes("?") ? "&" : "?") + "v=" + build : url);

  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const rand = (a, b) => a + Math.random() * (b - a);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Gắn chữ từ config ---------- */
  $("srTitle").textContent = fill(cfg.skyText) + " – " + fill(cfg.skySub);
  $("skySub").textContent = fill(cfg.skySub);
  $("hint").textContent = fill(cfg.hint);
  $("miniNote").textContent = fill(cfg.envelopeNote);
  $("date").textContent = fill(cfg.date);
  $("greeting").textContent = fill(cfg.greeting);
  $("name").textContent = fill(cfg.name);
  $("closing").textContent = fill(cfg.closing);
  $("signature").textContent = fill(cfg.signature);
  $("finale").textContent = fill(cfg.finale);
  if (cfg.avatar) {
    $("photo").src = bust(cfg.avatar);
    $("photo").alt = cfg.receiver;
    $("caption").textContent = fill(cfg.photoCaption);
  } else {
    $("polaroid").hidden = true;
  }
  document.querySelectorAll(".bouquet path").forEach((p, i) => {
    p.style.setProperty("--i", i);
    if (p.dataset.f !== "none") p.style.setProperty("--f", p.dataset.f);
  });

  /* =========================================================
     BẢNG ĐEN: bụi phấn bay + hạt phấn ghép chữ
     ========================================================= */
  const sky = $("sky");
  const sc = sky.getContext("2d");
  const fx = $("fx");
  const fc = fx.getContext("2d");
  let W = 0, H = 0;

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    for (const c of [sky, fx]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    sc.setTransform(dpr, 0, 0, dpr, 0, 0);
    fc.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  // màu phấn: trắng là chính, xen phấn hồng / vàng / xanh
  const GOLD = ["#ffffff", "#f7f5ee", "#ffffff", "#ffd6e0", "#fff3b0", "#cde7ff"];
  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random(), y: Math.random(), r: rand(0.4, 1.5),
    tw: rand(0.6, 2), ph: rand(0, 6.28), vy: rand(0.00002, 0.0001)
  }));

  let dots = [];       // hạt sáng ghép thành chữ
  let mode = "form";   // form -> burst -> dust
  let textBox = null;

  function sampleText() {
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const o = off.getContext("2d");
    const text = fill(cfg.skyText);
    let size = Math.min(W * 0.36, H * 0.19, 210);
    const font = (s) => `${s}px "Patrick Hand", "Comic Sans MS", cursive`;
    o.font = font(size);
    const tw = o.measureText(text).width;
    if (tw > W * 0.86) {
      size *= (W * 0.86) / tw;
      o.font = font(size);
    }
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillStyle = "#fff";
    const cy = H * 0.24;
    o.fillText(text, W / 2, cy);
    const data = o.getImageData(0, 0, W, Math.ceil(H * 0.5)).data;
    const gap = Math.max(3, Math.round(size / 28));
    const pts = [];
    for (let y = 0; y < H * 0.5; y += gap) {
      for (let x = 0; x < W; x += gap) {
        if (data[(y * W + x) * 4 + 3] > 130) pts.push([x, y]);
      }
    }
    return { pts, size, cy };
  }

  function buildDots() {
    textBox = sampleText();
    const old = dots;
    dots = textBox.pts.map((p, i) => {
      const d = old[i] || {
        x: rand(0, W), y: rand(0, H), vx: 0, vy: 0,
        r: rand(0.7, 1.7), c: GOLD[i % GOLD.length], ph: rand(0, 6.28), a: 1
      };
      d.tx = p[0];
      d.ty = p[1];
      return d;
    });
    $("skySub").style.top = textBox.cy + textBox.size * 0.6 + "px";
  }

  function explode() {
    mode = "burst";
    const cx = W / 2, cy = textBox ? textBox.cy : H * 0.24;
    for (const d of dots) {
      const ang = Math.atan2(d.y - cy, d.x - cx) + rand(-0.6, 0.6);
      const sp = rand(2, 9);
      d.vx = Math.cos(ang) * sp;
      d.vy = Math.sin(ang) * sp - 2;
    }
    // sau khi nổ: giữ lại một phần làm bụi sao trôi nhẹ cho đỡ nặng máy
    setTimeout(() => {
      dots = dots.filter((_, i) => i % 5 === 0);
      mode = "dust";
    }, 1600);
  }

  let t = 0;
  function frame() {
    t += 1 / 60;
    sc.clearRect(0, 0, W, H);
    sc.globalCompositeOperation = "lighter";

    for (const s of stars) {
      s.y -= s.vy;
      if (s.y < 0) s.y = 1;
      sc.globalAlpha = 0.08 + 0.25 * Math.abs(Math.sin(t * s.tw + s.ph));
      sc.fillStyle = "#ffffff";
      sc.beginPath();
      sc.arc(s.x * W, s.y * H, s.r, 0, 6.283);
      sc.fill();
    }

    for (const d of dots) {
      if (mode === "form") {
        const tx = d.tx + Math.sin(t * 2 + d.ph) * 0.6;
        const ty = d.ty + Math.cos(t * 2 + d.ph) * 0.6;
        d.vx = (d.vx + (tx - d.x) * 0.03) * 0.85;
        d.vy = (d.vy + (ty - d.y) * 0.03) * 0.85;
        d.a = 1;
      } else if (mode === "burst") {
        d.vx *= 0.96;
        d.vy = d.vy * 0.96 + 0.05;
        d.a = Math.max(0.35, d.a - 0.006);
      } else {
        d.vx = Math.max(-0.4, Math.min(0.4, d.vx * 0.98 + rand(-0.03, 0.03)));
        d.vy = Math.max(-0.4, Math.min(0.2, d.vy * 0.98 - 0.004));
        d.a = 0.3 + 0.4 * Math.abs(Math.sin(t + d.ph));
        if (d.y < -5) d.y = H + 5;
        if (d.x < -5) d.x = W + 5;
        if (d.x > W + 5) d.x = -5;
      }
      d.x += d.vx;
      d.y += d.vy;
      sc.globalAlpha = d.a;
      sc.fillStyle = d.c;
      sc.beginPath();
      sc.arc(d.x, d.y, d.r, 0, 6.283);
      sc.fill();
    }

    sc.globalAlpha = 1;
    sc.globalCompositeOperation = "source-over";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      if (mode === "form") buildDots();
      if (body.classList.contains("reading")) fitPaper();
    }, 200);
  });

  // Đợi font tải xong mới ghép chữ để hạt sáng đúng hình chữ
  const fontReady = document.fonts && document.fonts.load
    ? Promise.race([document.fonts.load('100px "Patrick Hand"'), sleep(2500)])
    : sleep(300);
  fontReady.then(() => {
    buildDots();
    setTimeout(() => body.classList.add("ready"), 1800);
  });

  /* =========================================================
     PHÁO HOA
     ========================================================= */
  const sparks = [];
  let fxOn = false;
  const FX_COLORS = ["#ffffff", "#ffd6e0", "#fff3b0", "#cde7ff", "#ff9fb5", "#b9f6ca"];

  function firework(x, y) {
    const n = 70;
    const c1 = FX_COLORS[Math.floor(rand(0, FX_COLORS.length))];
    const c2 = FX_COLORS[Math.floor(rand(0, FX_COLORS.length))];
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
      const sp = rand(1.5, 5.5);
      sparks.push({ x, y, px: x, py: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: rand(55, 90), c: i % 2 ? c1 : c2 });
    }
    if (!fxOn) {
      fxOn = true;
      requestAnimationFrame(fxFrame);
    }
  }

  function fxFrame() {
    fc.globalCompositeOperation = "destination-out";
    fc.fillStyle = "rgba(0,0,0,.2)";
    fc.fillRect(0, 0, W, H);
    fc.globalCompositeOperation = "lighter";
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.px = s.x;
      s.py = s.y;
      s.vx *= 0.985;
      s.vy = s.vy * 0.985 + 0.045;
      s.x += s.vx;
      s.y += s.vy;
      if (--s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      fc.globalAlpha = Math.min(1, s.life / 40);
      fc.strokeStyle = s.c;
      fc.lineWidth = 1.8;
      fc.beginPath();
      fc.moveTo(s.px, s.py);
      fc.lineTo(s.x, s.y);
      fc.stroke();
    }
    fc.globalAlpha = 1;
    if (sparks.length) requestAnimationFrame(fxFrame);
    else {
      fc.clearRect(0, 0, W, H);
      fxOn = false;
    }
  }

  function celebrate() {
    for (let i = 0; i < 7; i++) {
      setTimeout(() => firework(rand(W * 0.15, W * 0.85), rand(H * 0.12, H * 0.5)), i * 380);
    }
  }

  /* =========================================================
     TRANG VỞ: chữ hiện ra như đang viết
     ========================================================= */
  const paper = $("paper");
  const bodyEl = $("letterBody");
  const skipHint = $("skipHint");

  let words = [];
  function buildLetter() {
    bodyEl.innerHTML = "";
    words = [];
    const paras = fill(cfg.message).split(/\n\s*\n/).map((p) => p.trim().replace(/\s*\n\s*/g, " ")).filter(Boolean);
    paras.forEach((text) => {
      const p = document.createElement("p");
      text.split(" ").forEach((tok, wi) => {
        if (wi > 0) p.appendChild(document.createTextNode(" "));
        if (!tok) return;
        const w = document.createElement("span");
        w.className = "w";
        w.textContent = tok;
        p.appendChild(w);
        words.push(w);
      });
      if (words.length) words[words.length - 1].dataset.end = "1";
      bodyEl.appendChild(p);
    });
  }
  buildLetter();

  // Co chữ cho cả lá thư vừa khít 1 màn hình điện thoại (không phải cuộn)
  function fitPaper() {
    const avail = window.innerHeight - 24;
    let k = 1;
    paper.style.setProperty("--k", k);
    while (paper.offsetHeight > avail && k > 0.7) {
      k -= 0.02;
      paper.style.setProperty("--k", k.toFixed(2));
    }
  }

  let skip = false;
  let runId = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, skip ? 0 : ms));

  // cuộn trang theo dòng chữ đang hiện
  function follow(el) {
    const r = el.getBoundingClientRect();
    if (r.bottom > window.innerHeight * 0.8) {
      window.scrollTo({ top: window.scrollY + r.bottom - window.innerHeight * 0.55, behavior: skip ? "auto" : "smooth" });
    }
  }

  async function reveal() {
    const id = ++runId;
    skip = false;
    body.classList.remove("done");
    paper.classList.remove("show-head", "show-sign");
    words.forEach((w) => w.classList.remove("on"));
    void paper.offsetWidth;
    window.scrollTo({ top: 0, behavior: "smooth" });

    paper.classList.add("show-head");
    skipHint.classList.add("show");
    setTimeout(() => skipHint.classList.remove("show"), 4500);
    await wait(1900);

    const speed = Math.max(30, Number(cfg.wordSpeed) || 110);
    for (const w of words) {
      if (id !== runId) return;
      w.classList.add("on");
      follow(w);
      const txt = w.textContent;
      let d = speed;
      if (w.dataset.end) d = speed * 7;
      else if (/[.!?]$/.test(txt)) d = speed * 5;
      else if (/[,;:—]$/.test(txt) || txt === "—") d = speed * 2.5;
      await wait(d);
    }
    if (id !== runId) return;

    await wait(300);
    paper.classList.add("show-sign");
    follow($("letterSign"));
    await wait(2400);
    if (id !== runId) return;
    body.classList.add("done");
    skipHint.classList.remove("show");
    celebrate();
  }

  paper.addEventListener("click", () => (skip = true));
  $("replay").addEventListener("click", reveal);

  /* =========================================================
     MỞ PHONG BÌ
     ========================================================= */
  const env = $("envelope");
  let opened = false;
  async function openLetter() {
    if (opened) return;
    opened = true;
    body.classList.add("opening");
    await sleep(350);
    env.classList.add("flap-open");
    await sleep(550);
    env.classList.add("flap-behind");
    await sleep(100);
    env.classList.add("letter-out");
    await sleep(900);
    explode();
    body.classList.add("env-away");
    await sleep(900);

    $("intro").hidden = true;
    $("letterScene").hidden = false;
    body.classList.remove("intro", "opening", "env-away");
    body.classList.add("reading");
    fitPaper();
    window.scrollTo(0, 0);
    await sleep(1500);
    reveal();
  }

  $("seal").addEventListener("click", openLetter);
  env.addEventListener("click", openLetter);
})();
