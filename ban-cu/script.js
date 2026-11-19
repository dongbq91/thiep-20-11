(() => {
  const cfg = Object.assign({
    receiver: "Cô",
    nickname: "",
    sender: "",
    avatar: "",
    coverTop: "Happy Teacher's Day",
    coverBig: "20.11",
    coverSub: "Kính tặng {to}",
    openButton: "Mở thiệp 💌",
    title: "",
    message: "",
    signature: "",
    typingSpeed: 40,
    petalCount: 14,
    music: ""
  }, window.CARD_CONFIG || {});

  const params = new URLSearchParams(location.search);
  const to = params.get("to") || cfg.receiver;
  const from = params.get("from") || cfg.sender;
  const nick = params.get("nick") || cfg.nickname || to;
  const fill = (s) =>
    String(s || "").replace(/\{to\}/g, to).replace(/\{nick\}/g, nick).replace(/\{from\}/g, from);

  // Gắn phiên bản vào link ảnh để điện thoại không dùng ảnh cũ trong cache
  const build = window.BUILD && window.BUILD.indexOf("__") !== 0 ? window.BUILD : "";
  const bust = (url) => (build ? url + (url.includes("?") ? "&" : "?") + "v=" + build : url);

  const $ = (id) => document.getElementById(id);
  const card = $("card");
  const cardWrap = $("cardWrap");
  const cover = $("cover");
  const openBtn = $("openBtn");
  const titleEl = $("title");
  const messageEl = $("message");
  const signatureEl = $("signature");
  const replayBtn = $("replayBtn");
  const scroller = $("insideScroll");

  $("coverTop").textContent = fill(cfg.coverTop);
  $("coverBig").textContent = fill(cfg.coverBig);
  $("coverSub").textContent = fill(cfg.coverSub);
  openBtn.textContent = fill(cfg.openButton);
  signatureEl.textContent = fill(cfg.signature);

  if (cfg.avatar) {
    $("avatarImg").src = bust(cfg.avatar);
    $("avatarImg").alt = to;
    $("avatar").hidden = false;
  }

  /* ---------- Cánh hoa rơi ---------- */
  const petalColors = [
    "linear-gradient(135deg, #ffc2d4, #ff7aa2)",
    "linear-gradient(135deg, #ffe1c4, #f6bd60)",
    "linear-gradient(135deg, #ff8fab, #c9184a)",
    "linear-gradient(135deg, #fff3e4, #ffc8a8)"
  ];
  const rand = (a, b) => a + Math.random() * (b - a);
  const petals = $("petals");
  for (let i = 0; i < cfg.petalCount; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    const dur = rand(10, 18);
    p.style.left = rand(-5, 100) + "vw";
    p.style.animationDuration = dur + "s";
    p.style.animationDelay = -rand(0, dur) + "s";
    p.style.setProperty("--dx", rand(-80, 80) + "px");
    const leaf = document.createElement("i");
    leaf.style.setProperty("--s", rand(10, 20) + "px");
    leaf.style.setProperty("--c", petalColors[i % petalColors.length]);
    leaf.style.animationDuration = rand(2.2, 4) + "s";
    p.appendChild(leaf);
    petals.appendChild(p);
  }

  /* ---------- Hoa bung ra ---------- */
  function burst(icons) {
    const box = $("burst");
    const n = 18;
    for (let i = 0; i < n; i++) {
      const h = document.createElement("span");
      h.className = "heart";
      h.textContent = icons[i % icons.length];
      const angle = (Math.PI * 2 * i) / n + rand(-0.2, 0.2);
      const dist = rand(110, 190);
      h.style.setProperty("--x", Math.cos(angle) * dist + "px");
      h.style.setProperty("--y", Math.sin(angle) * dist + "px");
      h.style.setProperty("--r", rand(-40, 40) + "deg");
      h.style.setProperty("--fs", rand(14, 24) + "px");
      box.appendChild(h);
      setTimeout(() => h.remove(), 1700);
    }
  }

  /* ---------- Hiện từng chữ ---------- */
  let skip = false;
  let runId = 0;
  const caret = document.createElement("span");
  caret.className = "caret";

  const segmenter = window.Intl && Intl.Segmenter ? new Intl.Segmenter("vi", { granularity: "grapheme" }) : null;
  const splitChars = (text) =>
    segmenter ? Array.from(segmenter.segment(text), (s) => s.segment) : Array.from(text);

  const wait = (ms) => new Promise((r) => setTimeout(r, skip ? 0 : ms));

  async function typeInto(el, text, speed, id) {
    el.appendChild(caret);
    let word = null; // gom chữ trong 1 từ để không bị ngắt dòng giữa từ
    for (const ch of splitChars(text)) {
      if (id !== runId) return false;
      if (ch === "\n") {
        word = null;
        el.insertBefore(document.createElement("br"), caret);
      } else if (ch === " ") {
        word = null;
        el.insertBefore(document.createTextNode(" "), caret);
      } else {
        if (!word) {
          word = document.createElement("span");
          word.className = "word";
          el.insertBefore(word, caret);
        }
        const span = document.createElement("span");
        span.className = "ch";
        span.textContent = ch;
        word.appendChild(span);
      }
      // tự cuộn theo dòng chữ đang hiện
      const caretBottom = caret.offsetTop + caret.offsetHeight;
      if (caretBottom > scroller.scrollTop + scroller.clientHeight - 60) {
        scroller.scrollTop = caretBottom - scroller.clientHeight + 60;
      }
      let delay = speed;
      if (/[.!?]/.test(ch)) delay = speed * 8;
      else if (/[,;:—]/.test(ch)) delay = speed * 4;
      else if (ch === "\n") delay = speed * 4;
      await wait(delay);
    }
    return true;
  }

  async function playContent() {
    const id = ++runId;
    skip = false;
    titleEl.textContent = "";
    messageEl.textContent = "";
    signatureEl.classList.remove("show");
    replayBtn.classList.remove("show");
    scroller.scrollTop = 0;

    const speed = Math.max(10, Number(cfg.typingSpeed) || 40);
    if (!(await typeInto(titleEl, fill(cfg.title), speed * 1.4, id))) return;
    await wait(400);
    if (!(await typeInto(messageEl, fill(cfg.message), speed, id))) return;
    caret.remove();
    await wait(300);
    signatureEl.classList.add("show");
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    await wait(700);
    burst(["💐", "🌸", "✨", "🌷", "📖"]);
    replayBtn.classList.add("show");
  }

  // Chạm vào thiệp khi đang chạy chữ để hiện nhanh
  scroller.addEventListener("click", () => (skip = true));
  replayBtn.addEventListener("click", playContent);

  /* ---------- Nhạc nền (tùy chọn) ---------- */
  let audio = null;
  if (cfg.music) {
    audio = new Audio(bust(cfg.music));
    audio.loop = true;
    audio.volume = 0.6;
  }

  /* ---------- Mở thiệp ---------- */
  let opened = false;
  function openCard() {
    if (opened) return;
    opened = true;
    card.classList.add("open");
    cardWrap.classList.add("opened");
    openBtn.classList.add("hide");
    if (audio) audio.play().catch(() => {});
    setTimeout(() => burst(["🌸", "💗", "🌷", "✨", "💐"]), 700);
    setTimeout(playContent, 1500);
  }

  openBtn.addEventListener("click", openCard);
  cover.addEventListener("click", openCard);
  cover.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openCard();
    }
  });
})();
