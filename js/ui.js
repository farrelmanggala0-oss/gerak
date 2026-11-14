// =========================================
// GERAK - js/ui.js
// Helper pembuatan elemen DOM aman (Anti-XSS) dan notifikasi
// =========================================

/**
 * Membuat elemen DOM secara aman tanpa innerHTML
 * @param {string} tag - Nama tag HTML
 * @param {object} props - Properti elemen { class, text, attrs, on }
 * @param {Array<Node|string>} children - Anak elemen atau string teks
 * @returns {HTMLElement}
 */
export function el(tag, props = {}, ...children) {
  const elem = document.createElement(tag);

  if (props.class || props.className) {
    elem.className = props.class || props.className;
  }

  if (props.text !== undefined && props.text !== null) {
    elem.textContent = String(props.text);
  }

  if (props.attrs) {
    for (const [key, value] of Object.entries(props.attrs)) {
      if (value !== undefined && value !== null && value !== false) {
        elem.setAttribute(key, value === true ? "" : String(value));
      }
    }
  }

  // Dukungan atribut langsung (src, alt, id, type, title, dsb)
  const RESERVED_PROPS = new Set(["class", "className", "text", "attrs", "on"]);
  for (const [key, value] of Object.entries(props)) {
    if (!RESERVED_PROPS.has(key) && value !== undefined && value !== null && value !== false) {
      elem.setAttribute(key, value === true ? "" : String(value));
      if (key in elem && typeof elem[key] !== "function") {
        try {
          elem[key] = value;
        } catch {
          // Abaikan error properti read-only
        }
      }
    }
  }

  if (props.on) {
    for (const [evt, handler] of Object.entries(props.on)) {
      if (typeof handler === "function") {
        elem.addEventListener(evt, handler);
      }
    }
  }

  children.flat().forEach(child => {
    if (child === null || child === undefined) return;
    if (child instanceof Node) {
      elem.appendChild(child);
    } else {
      elem.appendChild(document.createTextNode(String(child)));
    }
  });

  return elem;
}

// Timer untuk toast agar bisa dijeda saat di-hover atau difokus
let timerToast = null;
let toastRemainingMs = 4000;
let toastStartTime = 0;

export function tampilToast(pesan, durasiMs = 4000) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  if (timerToast) {
    clearTimeout(timerToast);
    timerToast = null;
  }

  toast.textContent = pesan;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.classList.add("tampil");

  toastRemainingMs = Math.max(durasiMs, 4000);
  toastStartTime = Date.now();

  const mulaiTimer = () => {
    timerToast = setTimeout(() => {
      toast.classList.remove("tampil");
      timerToast = null;
    }, toastRemainingMs);
  };

  toast.onmouseenter = () => {
    if (timerToast) {
      clearTimeout(timerToast);
      timerToast = null;
      const elapsed = Date.now() - toastStartTime;
      toastRemainingMs = Math.max(1000, toastRemainingMs - elapsed);
    }
  };

  toast.onmouseleave = () => {
    if (!timerToast && toast.classList.contains("tampil")) {
      toastStartTime = Date.now();
      mulaiTimer();
    }
  };

  // Picu efek Glitter & Sparkle pada momen pencapaian (+XP, +Poin, Rank, Level, Check-in)
  if (/(\+25|\+20|\+10|poin|rank|level|selamat|berhasil|tuntas|check-in)/i.test(pesan)) {
    tampilkanEfekSparkle();
  }

  mulaiTimer();
}

/**
 * Efek Glitter & Sparkle untuk momen pencapaian
 */
export function tampilkanEfekSparkle(x, y) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let wadah = document.querySelector(".wadah-sparkle-global");
  if (!wadah) {
    wadah = document.createElement("div");
    wadah.className = "wadah-sparkle-global";
    wadah.setAttribute("aria-hidden", "true");
    document.body.appendChild(wadah);
  }

  const cx = x ?? window.innerWidth / 2;
  const cy = y ?? window.innerHeight / 2;
  const simbol = ["✦", "★", "✧", "⚡", "✨"];
  const warna = ["#FF5A1F", "#FF8A4C", "#D9480F"];

  for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "sparkle-partikel";
    p.textContent = simbol[i % simbol.length];
    p.style.color = warna[i % warna.length];
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;

    const sudut = (i / 14) * Math.PI * 2;
    const jarak = 45 + Math.random() * 55;
    const tx = Math.cos(sudut) * jarak;
    const ty = Math.sin(sudut) * jarak - 25;

    p.style.setProperty("--tx", `${tx}px`);
    p.style.setProperty("--ty", `${ty}px`);
    p.style.animationDelay = `${Math.random() * 0.12}s`;

    wadah.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, 1300);
  }
}

/**
 * Loading setelah daftar/masuk (dari Gerak Pertama):
 * huruf GERAK. muncul + bar keisi, lalu logo terbang ke logo navbar.
 * siapkan() jalan di balik layar loading, selesai() jalan setelah animasi beres.
 */
export function mainkanLoading(siapkan, selesai) {
  const L = document.getElementById("loading");
  const logo = L && L.querySelector(".loading-logo");
  const tujuan = document.querySelector(".navbar .logo");
  if (!L || !logo || !tujuan) {
    siapkan();
    selesai();
    return;
  }
  L.className = "";
  L.hidden = false;
  setTimeout(() => {
    siapkan();
    // hitung jarak & ukuran dari logo loading ke logo navbar
    const a = logo.getBoundingClientRect();
    const b = tujuan.getBoundingClientRect();
    const x = b.left + b.width / 2 - (a.left + a.width / 2);
    const y = b.top + b.height / 2 - (a.top + a.height / 2);
    tujuan.style.visibility = "hidden";
    logo.style.transform = `translate(${x}px, ${y}px) scale(${b.width / a.width})`;
    L.className = "selesai";
    setTimeout(() => {
      L.hidden = true;
      logo.style.transform = "";
      tujuan.style.visibility = "";
      selesai();
    }, 900);
  }, 1800);
}