// =========================================
// GERAK - js/edukasi.js
// Interactive Health Learning Center — Step-by-Step Learning Experience
// 5 Tabs (Ringkasan, Semua Materi, Quiz, Mini Games, Progres Belajar),
// Step-by-Step Material Reader (Steps 1-5), Single-Question Quiz Player,
// 5 Mini Games, Progress Tracker, & AI Learning Assistant
// =========================================

import {
  MATERI_EDUKASI,
  DATA_MINI_GAMES,
  FAKTA_HARIAN_LIST,
  TANTANGAN_HARIAN_LIST,
  BADGE_EDUKASI_LIST
} from "../data/edukasi-data.js";
import { simpanData, muatData } from "./penyimpanan.js";
import { tampilToast, tampilkanEfekSparkle } from "./ui.js";
import { hariIni, formatTanggalIndonesia } from "./tanggal.js";

// State edukasi internal
let stateEdukasi = {
  materiSelesai: [],
  materiTerakhirDipelajari: "materi-1",
  materiFavorit: [],
  skorQuiz: {},
  riwayatQuiz: [],
  gameStats: {
    totalDimainkan: 0,
    skorTertinggiGame: { nama: "-", skor: 0 },
    isiPiringku: { kaliMain: 0, skorTertinggi: 0 },
    tebakNutrisi: { kaliMain: 0, skorTertinggi: 0 },
    mitosFakta: { kaliMain: 0, skorTertinggi: 0 },
    foodDetective: { kaliMain: 0, skorTertinggi: 0 },
    fitnessChallenge: { kaliMain: 0, skorTertinggi: 0 }
  },
  dailyChallenge: {
    terakhirDijawabHari: null,
    idTantanganTerakhir: null,
    riwayat: []
  },
  badgeDidapat: [],
  activeTab: "ringkasan"
};

// Variable pelacak game aktif
let currentGame = {
  key: null,
  stepIndex: 0,
  score: 0,
  userChoices: {},
  completed: false
};

// Variable pelacak Step-by-Step Material Reader
let activeReader = {
  materiId: "materi-1",
  currentStep: 1, // 1: Pengenalan, 2: Materi Utama, 3: Penerapan, 4: Kesimpulan, 5: Referensi
  parsedContent: null
};

// Variable pelacak Single-Question Quiz Player
let activeQuizPlayer = {
  materiId: "materi-1",
  currentQIndex: 0,
  userAnswers: {},
  isCurrentAnswered: false,
  scorePercent: 0,
  correctCount: 0,
  completed: false
};

// Filter katalog materi
let filterKatalog = {
  kategori: "semua",
  kesulitan: "semua",
  status: "semua",
  sort: "nomor",
  cari: ""
};

// Filter quiz hub
let filterQuizHub = "semua";

/**
 * Muat progres edukasi dari localStorage atau inisialisasi default
 */
export function muatProgresEdukasi(appState) {
  const tersimpan = muatData("gerakEdukasiProgres", null);
  if (tersimpan) {
    stateEdukasi = {
      ...stateEdukasi,
      ...tersimpan,
      gameStats: { ...stateEdukasi.gameStats, ...(tersimpan.gameStats || {}) },
      dailyChallenge: { ...stateEdukasi.dailyChallenge, ...(tersimpan.dailyChallenge || {}) }
    };
  }
  if (appState) {
    appState.edukasiProgres = stateEdukasi;
  }
  return stateEdukasi;
}

/**
 * Simpan progres edukasi (hanya permanen untuk akun terdaftar atau local browser)
 */
export function simpanProgresEdukasi(appState) {
  if (appState) {
    appState.edukasiProgres = stateEdukasi;
  }
  simpanData("gerakEdukasiProgres", stateEdukasi);
}

/**
 * Inisialisasi utama Halaman Edukasi
 */
export function inisialisasiEdukasi(appState) {
  muatProgresEdukasi(appState);

  // Pasang Navigasi Internal Tab Edukasi (5 Tabs)
  inisialisasiNavigasiInternalEdukasi(appState);

  // Render tab awal (Ringkasan)
  renderRingkasanEdukasi(appState);

  // Inisialisasi event modal close
  inisialisasiEventModal(appState);
}

/**
 * ========================================================
 * 1. NAVIGASI INTERNAL EDUKASI (5 TABS)
 * ========================================================
 */
function inisialisasiNavigasiInternalEdukasi(appState) {
  const tabButtons = document.querySelectorAll(".tab-edukasi-btn");
  tabButtons.forEach((btn) => {
    btn.onclick = () => {
      const tabTarget = btn.getAttribute("data-tab");
      gantiTabEdukasi(tabTarget, appState);
    };
  });
}

export function gantiTabEdukasi(tabKey, appState) {
  stateEdukasi.activeTab = tabKey;

  // Update tab buttons
  const tabButtons = document.querySelectorAll(".tab-edukasi-btn");
  tabButtons.forEach((btn) => {
    const isTarget = btn.getAttribute("data-tab") === tabKey;
    btn.classList.toggle("aktif", isTarget);
    btn.setAttribute("aria-selected", isTarget ? "true" : "false");
  });

  // Mapping target panel
  const panels = {
    ringkasan: document.getElementById("panelEdukasiRingkasan"),
    materi: document.getElementById("panelEdukasiSemuaMateri"),
    quiz: document.getElementById("panelEdukasiQuiz"),
    games: document.getElementById("panelEdukasiMiniGames"),
    progres: document.getElementById("panelEdukasiProgres")
  };

  // Hide all panels & show active panel
  Object.keys(panels).forEach((k) => {
    if (panels[k]) {
      panels[k].style.display = k === tabKey ? "block" : "none";
      panels[k].classList.toggle("aktif", k === tabKey);
    }
  });

  // Render konten sesuai tab aktif
  if (tabKey === "ringkasan") {
    renderRingkasanEdukasi(appState);
  } else if (tabKey === "materi") {
    renderKatalogSemuaMateri(appState);
  } else if (tabKey === "quiz") {
    renderQuizHub(appState);
  } else if (tabKey === "games") {
    renderMiniGamesHub(appState);
  } else if (tabKey === "progres") {
    renderProgresBelajarView(appState);
  }

  // Scroll halus ke atas section edukasi jika pengguna berada di bawah
  const section = document.getElementById("edukasi");
  if (section && window.scrollY > section.offsetTop + 100) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * ========================================================
 * 2. TAB 1: RINGKASAN EDUKASI (OVERVIEW)
 * ========================================================
 */
export function renderRingkasanEdukasi(appState) {
  renderRingkasanProgresCepat(appState);
  renderKartuLanjutkanBelajar(appState);
  renderKategoriRingkasan(appState);
  renderDailyHealthChallenge(appState);
  renderMiniGamesRingkasanShowcase(appState);
  renderFactOfTheDay(appState);
  inisialisasiLinkRingkasan(appState);
}

/**
 * B. Learning Progress Ringkasan Cepat
 */
function renderRingkasanProgresCepat(appState) {
  const container = document.getElementById("wadahLearningProgressRingkasan");
  if (!container) return;

  const totalMateri = MATERI_EDUKASI.length; // 20
  const selesaiCount = (stateEdukasi.materiSelesai || []).length;
  const persen = Math.round((selesaiCount / totalMateri) * 100);

  const quizIds = Object.keys(stateEdukasi.skorQuiz || {});
  const totalQuizSelesai = quizIds.length;
  let rerataNilai = 0;
  if (totalQuizSelesai > 0) {
    const sumSkor = quizIds.reduce((acc, k) => acc + (stateEdukasi.skorQuiz[k]?.skorPersen || 0), 0);
    rerataNilai = Math.round(sumSkor / totalQuizSelesai);
  }

  const totalGames = stateEdukasi.gameStats?.totalDimainkan || 0;

  container.innerHTML = `
    <div class="kartu-metrik-mini">
      <div class="ikon-mini-bar">📚</div>
      <div class="info-mini-bar">
        <span class="angka-mini-bar">${selesaiCount} / ${totalMateri}</span>
        <span class="label-mini-bar">Materi Tuntas (${persen}%)</span>
      </div>
    </div>

    <div class="kartu-metrik-mini">
      <div class="ikon-mini-bar">📝</div>
      <div class="info-mini-bar">
        <span class="angka-mini-bar">${totalQuizSelesai} Quiz</span>
        <span class="label-mini-bar">Rerata: ${rerataNilai}%</span>
      </div>
    </div>

    <div class="kartu-metrik-mini">
      <div class="ikon-mini-bar">🎮</div>
      <div class="info-mini-bar">
        <span class="angka-mini-bar">${totalGames} Kali</span>
        <span class="label-mini-bar">Games Dimainkan</span>
      </div>
    </div>
  `;
}

/**
 * C. Lanjutkan Belajar
 */
function renderKartuLanjutkanBelajar(appState) {
  const container = document.getElementById("wadahLanjutkanBelajarCard");
  if (!container) return;

  // Cari materi terakhir atau yang belum selesai
  let targetMateri = MATERI_EDUKASI.find((m) => m.id === stateEdukasi.materiTerakhirDipelajari);
  if (!targetMateri || (stateEdukasi.materiSelesai || []).includes(targetMateri.id)) {
    targetMateri = MATERI_EDUKASI.find((m) => !(stateEdukasi.materiSelesai || []).includes(m.id)) || MATERI_EDUKASI[0];
  }

  const sudahSelesai = (stateEdukasi.materiSelesai || []).includes(targetMateri.id);

  container.innerHTML = `
    <div class="kartu-lanjutkan-box">
      <div class="lanjutkan-kiri">
        <span class="lanjutkan-ikon">${targetMateri.ikon}</span>
        <div class="lanjutkan-info">
          <span class="lanjutkan-tag">MODUL ${targetMateri.nomor} · ${targetMateri.kategori.toUpperCase()}</span>
          <h4 class="lanjutkan-judul">${targetMateri.judul}</h4>
          <p class="lanjutkan-sub">${targetMateri.ringkasan}</p>
          <span class="lanjutkan-waktu">⏱️ Estimasi Baca: ${targetMateri.estimasiWaktu} · Tingkat: ${targetMateri.tingkatKesulitan}</span>
        </div>
      </div>
      <div class="lanjutkan-kanan">
        <button type="button" class="tombol tombol-utama" id="btnAksiLanjutkanMateri" data-materi-id="${targetMateri.id}">
          ${sudahSelesai ? "Baca Ulang Materi ➔" : "Lanjutkan Belajar ➔"}
        </button>
      </div>
    </div>
  `;

  document.getElementById("btnAksiLanjutkanMateri")?.addEventListener("click", () => {
    bukaModalStepReader(targetMateri.id, appState);
  });
}

/**
 * D. Kategori Materi (3 Kartu Utama)
 */
function renderKategoriRingkasan(appState) {
  const container = document.getElementById("seksiKategoriRingkasan");
  if (!container) return;

  container.querySelectorAll(".kartu-kategori-ringkasan").forEach((btn) => {
    btn.onclick = () => {
      const kat = btn.getAttribute("data-kategori");
      filterKatalog.kategori = kat;
      gantiTabEdukasi("materi", appState);
    };
  });
}

/**
 * E. Daily Knowledge Challenge (1 Pertanyaan Harian Baru)
 */
function renderDailyHealthChallenge(appState) {
  const container = document.getElementById("wadahDailyChallenge");
  if (!container) return;

  const todayStr = hariIni();
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const index = Math.abs(dayOfYear) % TANTANGAN_HARIAN_LIST.length;
  const challenge = TANTANGAN_HARIAN_LIST[index];

  const sudahJawabHariIni = stateEdukasi.dailyChallenge.terakhirDijawabHari === todayStr;
  const riwayatHariIni = (stateEdukasi.dailyChallenge.riwayat || []).find((r) => r.tanggal === todayStr);

  if (sudahJawabHariIni && riwayatHariIni) {
    container.innerHTML = `
      <div class="kartu-daily-challenge terjawab">
        <div class="challenge-header">
          <span class="badge-mini ${riwayatHariIni.benar ? "aksen-hijau" : "aksen-oranye"}">
            ${riwayatHariIni.benar ? "✅ TANTANGAN HARI INI TUNTAS (BENAR)" : "⚠️ TANTANGAN HARI INI TUNTAS"}
          </span>
          <span class="tanggal-challenge">${formatTanggalIndonesia(todayStr)}</span>
        </div>
        <h4 class="soal-challenge">${challenge.pertanyaan}</h4>
        <div class="feedback-terjawab">
          <p class="status-jawaban">
            Jawabanmu: <b>${riwayatHariIni.benar ? "Tepat Sekali! 🎉" : "Kurang Tepat, namun tetap belajar!"}</b>
          </p>
          <p class="penjelasan-ilmiah"><b>💡 Pembahasan Ilmiah:</b> ${challenge.penjelasan}</p>
          <p class="sumber-challenge"><b>📚 Rujukan Ilmiah:</b> ${challenge.sumber}</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="kartu-daily-challenge">
      <div class="challenge-header">
        <span class="badge-mini aksen-biru">🎯 DAILY HEALTH CHALLENGE</span>
        <span class="tanggal-challenge">${formatTanggalIndonesia(todayStr)}</span>
      </div>
      <h4 class="soal-challenge">${challenge.pertanyaan}</h4>
      <div class="opsi-challenge-list" id="opsiDailyChallenge">
        ${challenge.pilihan
          .map(
            (pil, idx) => `
          <label class="opsi-challenge-item" for="radioChallenge_${idx}">
            <input type="radio" id="radioChallenge_${idx}" name="radioDailyChallenge" value="${idx}" class="radio-challenge-input">
            <span class="indikator-huruf">${String.fromCharCode(65 + idx)}</span>
            <span class="teks-opsi">${pil}</span>
          </label>
        `
          )
          .join("")}
      </div>
      <div class="challenge-footer">
        <span class="info-sumber">📚 Rujukan Ilmiah: <b>${challenge.sumber}</b></span>
        <button class="tombol tombol-utama tombol-kecil" id="btnKirimDailyChallenge">
          Jawab Tantangan
        </button>
      </div>
    </div>
  `;

  // Interaktivitas pemilihan opsi Daily Challenge
  const opsiLabels = container.querySelectorAll(".opsi-challenge-item");
  const radioInputs = container.querySelectorAll('input[name="radioDailyChallenge"]');
  radioInputs.forEach((r) => {
    r.addEventListener("change", () => {
      opsiLabels.forEach((lbl) => lbl.classList.remove("terpilih"));
      if (r.checked) {
        r.closest(".opsi-challenge-item")?.classList.add("terpilih");
      }
    });
  });

  document.getElementById("btnKirimDailyChallenge")?.addEventListener("click", () => {
    const selected = document.querySelector('input[name="radioDailyChallenge"]:checked');
    if (!selected) {
      tampilToast("Pilih salah satu jawaban terlebih dahulu! 👆");
      return;
    }

    const jawabanUser = parseInt(selected.value, 10);
    const benar = jawabanUser === challenge.jawabanBenar;

    if (benar) {
      tampilkanEfekSparkle();
      tampilToast("Jawabanmu Benar! Hebat! 🎉");
    } else {
      tampilToast("Jawaban kurang tepat. Simak pembahasannya ya!");
    }

    stateEdukasi.dailyChallenge.terakhirDijawabHari = todayStr;
    stateEdukasi.dailyChallenge.idTantanganTerakhir = challenge.id;
    if (!stateEdukasi.dailyChallenge.riwayat) stateEdukasi.dailyChallenge.riwayat = [];
    stateEdukasi.dailyChallenge.riwayat.push({
      id: challenge.id,
      tanggal: todayStr,
      benar,
      jawabanUser
    });

    simpanProgresEdukasi(appState);
    renderDailyHealthChallenge(appState);
    renderRingkasanProgresCepat(appState);
  });
}

/**
 * F. Mini Games Showcase Cards
 */
function renderMiniGamesRingkasanShowcase(appState) {
  const container = document.getElementById("seksiMiniGamesRingkasan");
  if (!container) return;

  container.querySelectorAll(".tombol-play-mini").forEach((btn) => {
    btn.onclick = () => {
      const gameKey = btn.getAttribute("data-game");
      bukaMiniGame(gameKey, appState);
    };
  });
}

/**
 * G. Health Fact of the Day
 */
function renderFactOfTheDay(appState) {
  const container = document.getElementById("wadahFactOfTheDay");
  if (!container) return;

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const index = Math.abs(dayOfYear) % FAKTA_HARIAN_LIST.length;
  const fact = FAKTA_HARIAN_LIST[index];

  container.innerHTML = `
    <div class="kartu-fakta-harian">
      <div class="fakta-header">
        <span class="badge-mini aksen-hijau">✨ FAKTA KESEHATAN HARI INI</span>
        <span class="tag-topik">${fact.topik}</span>
      </div>
      <p class="teks-fakta">"${fact.fakta}"</p>
      <p class="penjelasan-fakta">${fact.penjelasanIlmiah}</p>
      <div class="fakta-footer">
        <div class="sumber-wrap">
          <span class="label-sumber">📚 Sumber Ilmiah:</span>
          <a href="${fact.url}" target="_blank" rel="noopener noreferrer" class="link-sumber">
            ${fact.sumber} ↗
          </a>
        </div>
        <button class="tombol-mini tombol-tanya-ai-fakta" id="btnTanyaAIFakta" data-topik="${fact.topik}">
          🤖 Tanya GERAK AI
        </button>
      </div>
    </div>
  `;

  document.getElementById("btnTanyaAIFakta")?.addEventListener("click", () => {
    bukaAITerarah(
      `Halo GERAK AI, tolong jelaskan lebih dalam dan berikan contoh nyata mengenai fakta ilmiah hari ini tentang ${fact.topik}: "${fact.fakta}"`,
      "edukasi"
    );
  });
}

/**
 * Wire-up CTA buttons di Ringkasan
 */
function inisialisasiLinkRingkasan(appState) {
  document.getElementById("btnKeProgresLengkap")?.addEventListener("click", () => {
    gantiTabEdukasi("progres", appState);
  });

  document.getElementById("btnKeSemuaMateriDariKategori")?.addEventListener("click", () => {
    filterKatalog.kategori = "semua";
    gantiTabEdukasi("materi", appState);
  });

  document.getElementById("btnKeMiniGamesLengkap")?.addEventListener("click", () => {
    gantiTabEdukasi("games", appState);
  });
}

/**
 * ========================================================
 * 3. TAB 2: SEMUA MATERI (KATALOG 20 MATERI & FILTER)
 * ========================================================
 */
export function renderKatalogSemuaMateri(appState) {
  inisialisasiToolbarKatalogLengkap(appState);

  const grid = document.getElementById("gridKatalogMateri");
  if (!grid) return;

  // Filter materi
  let hasil = MATERI_EDUKASI.filter((m) => {
    // Kategori
    if (filterKatalog.kategori !== "semua" && m.kategori !== filterKatalog.kategori) return false;

    // Tingkat Kesulitan
    if (filterKatalog.kesulitan !== "semua" && m.tingkatKesulitan !== filterKatalog.kesulitan) return false;

    // Status Pembelajaran
    if (filterKatalog.status === "selesai") {
      if (!(stateEdukasi.materiSelesai || []).includes(m.id)) return false;
    } else if (filterKatalog.status === "belum") {
      if ((stateEdukasi.materiSelesai || []).includes(m.id)) return false;
    } else if (filterKatalog.status === "favorit") {
      if (!(stateEdukasi.materiFavorit || []).includes(m.id)) return false;
    }

    // Pencarian
    if (filterKatalog.cari.trim() !== "") {
      const q = filterKatalog.cari.toLowerCase();
      const matchJudul = m.judul.toLowerCase().includes(q);
      const matchRingkasan = m.ringkasan.toLowerCase().includes(q);
      const matchKategori = m.kategori.toLowerCase().includes(q);
      if (!matchJudul && !matchRingkasan && !matchKategori) return false;
    }

    return true;
  });

  // Sorting materi
  if (filterKatalog.sort === "judul") {
    hasil.sort((a, b) => a.judul.localeCompare(b.judul));
  } else if (filterKatalog.sort === "waktu") {
    hasil.sort((a, b) => parseInt(a.estimasiWaktu, 10) - parseInt(b.estimasiWaktu, 10));
  } else {
    hasil.sort((a, b) => a.nomor - b.nomor);
  }

  if (hasil.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-materi">
        <span class="ikon-kosong">🔍</span>
        <h4>Tidak ada materi yang sesuai kriteria</h4>
        <p>Coba sesuaikan kata kunci pencarian atau reset filter kategori.</p>
        <button type="button" class="tombol tombol-kecil" id="btnResetFilterKatalog">Reset Semua Filter</button>
      </div>
    `;

    document.getElementById("btnResetFilterKatalog")?.addEventListener("click", () => {
      filterKatalog = { kategori: "semua", kesulitan: "semua", status: "semua", sort: "nomor", cari: "" };
      renderKatalogSemuaMateri(appState);
    });
    return;
  }

  grid.innerHTML = hasil
    .map((m) => {
      const selesai = (stateEdukasi.materiSelesai || []).includes(m.id);
      const favorit = (stateEdukasi.materiFavorit || []).includes(m.id);
      const dataQuiz = stateEdukasi.skorQuiz?.[m.id];
      const skorQuiz = dataQuiz ? `${dataQuiz.skorPersen}%` : null;

      let kelasBadge = "aksen-hijau";
      if (m.tingkatKesulitan === "Menengah") kelasBadge = "aksen-biru";
      if (m.tingkatKesulitan === "Lanjutan") kelasBadge = "aksen-ungu";

      return `
        <article class="kartu-materi-edukasi ${selesai ? "status-selesai" : ""}" data-materi-id="${m.id}">
          <div class="kartu-materi-top">
            <div class="badge-row">
              <span class="badge-mini ${kelasBadge}">${m.tingkatKesulitan.toUpperCase()}</span>
              <span class="estimasi-baca">⏱️ ${m.estimasiWaktu}</span>
            </div>
            <button type="button" class="btn-favorit-materi ${favorit ? "aktif" : ""}" data-fav-id="${m.id}" title="${favorit ? "Hapus dari Favorit" : "Simpan ke Favorit"}" aria-label="Simpan materi">
              ${favorit ? "★" : "☆"}
            </button>
          </div>

          <div class="kartu-materi-body">
            <span class="nomor-materi">Modul ${m.nomor} · ${m.kategori}</span>
            <h3 class="judul-materi">${m.ikon} ${m.judul}</h3>
            <p class="ringkasan-materi">${m.ringkasan}</p>
          </div>

          <div class="kartu-materi-footer">
            <div class="status-materi-info">
              ${
                selesai
                  ? '<span class="tag-status selesai">✅ Selesai Dibaca</span>'
                  : '<span class="tag-status belum">⏳ Belum Selesai</span>'
              }
              ${skorQuiz ? `<span class="tag-quiz-skor">Skor Quiz: ${skorQuiz}</span>` : ""}
            </div>
            <div class="materi-aksi-buttons">
              <button type="button" class="tombol tombol-kecil tombol-baca-materi" data-buka-materi="${m.id}">
                📖 Pelajari
              </button>
              <button type="button" class="tombol tombol-kecil tombol-quiz-materi" data-buka-quiz="${m.id}">
                📝 Quiz (5 Soal)
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  // Event listener tombol favorit
  grid.querySelectorAll(".btn-favorit-materi").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const mId = btn.getAttribute("data-fav-id");
      if (!stateEdukasi.materiFavorit) stateEdukasi.materiFavorit = [];
      const idx = stateEdukasi.materiFavorit.indexOf(mId);
      if (idx > -1) {
        stateEdukasi.materiFavorit.splice(idx, 1);
        tampilToast("Materi dihapus dari daftar favorit ⭐");
      } else {
        stateEdukasi.materiFavorit.push(mId);
        tampilToast("Materi ditambahkan ke daftar favorit ⭐");
      }
      simpanProgresEdukasi(appState);
      renderKatalogSemuaMateri(appState);
    };
  });

  // Event listener tombol pelajari materi
  grid.querySelectorAll(".tombol-baca-materi").forEach((btn) => {
    btn.onclick = () => {
      const mId = btn.getAttribute("data-buka-materi");
      bukaModalStepReader(mId, appState);
    };
  });

  // Event listener tombol buka quiz
  grid.querySelectorAll(".tombol-quiz-materi").forEach((btn) => {
    btn.onclick = () => {
      const mId = btn.getAttribute("data-buka-quiz");
      bukaModalQuizPlayer(mId, appState);
    };
  });
}

function inisialisasiToolbarKatalogLengkap(appState) {
  const inputCari = document.getElementById("inputCariMateri");
  if (inputCari) {
    inputCari.value = filterKatalog.cari;
    inputCari.oninput = (e) => {
      filterKatalog.cari = e.target.value;
      renderKatalogSemuaMateri(appState);
    };
  }

  const sortSelect = document.getElementById("selectSortMateri");
  if (sortSelect) {
    sortSelect.value = filterKatalog.sort;
    sortSelect.onchange = (e) => {
      filterKatalog.sort = e.target.value;
      renderKatalogSemuaMateri(appState);
    };
  }

  const wadahKat = document.getElementById("wadahFilterKategoriMateri");
  if (wadahKat) {
    wadahKat.querySelectorAll(".pill-filter-kategori").forEach((btn) => {
      const kat = btn.getAttribute("data-kategori");
      btn.classList.toggle("aktif", kat === filterKatalog.kategori);
      btn.onclick = () => {
        filterKatalog.kategori = kat;
        renderKatalogSemuaMateri(appState);
      };
    });
  }

  const selKesulitan = document.getElementById("filterKesulitanMateri");
  if (selKesulitan) {
    selKesulitan.value = filterKatalog.kesulitan;
    selKesulitan.onchange = (e) => {
      filterKatalog.kesulitan = e.target.value;
      renderKatalogSemuaMateri(appState);
    };
  }

  const selStatus = document.getElementById("filterStatusMateri");
  if (selStatus) {
    selStatus.value = filterKatalog.status;
    selStatus.onchange = (e) => {
      filterKatalog.status = e.target.value;
      renderKatalogSemuaMateri(appState);
    };
  }
}

/**
 * ========================================================
 * 4. STEP-BY-STEP MATERIAL READER (STEPS 1-5)
 * ========================================================
 */
export function bukaModalStepReader(materiId, appState) {
  const dialog = document.getElementById("dialogMateriEdukasi");
  if (!dialog) return;

  const materi = MATERI_EDUKASI.find((m) => m.id === materiId);
  if (!materi) return;

  activeReader.materiId = materiId;
  activeReader.currentStep = 1;
  activeReader.parsedContent = parseMateriSections(materi);

  // Catat sebagai materi terakhir dipelajari
  stateEdukasi.materiTerakhirDipelajari = materiId;
  simpanProgresEdukasi(appState);

  // Set konteks untuk GERAK AI
  if (appState) appState.edukasiMateriAktif = materi.judul;

  // Header modal
  const elJudul = document.getElementById("judulModalMateri");
  const elNomorKat = document.getElementById("badgeModalNomorKategori");
  const elKesulitan = document.getElementById("badgeModalKesulitan");
  const elWaktu = document.getElementById("labelModalWaktuBaca");

  if (elJudul) elJudul.innerHTML = `${materi.ikon} ${materi.nomor}. ${materi.judul}`;
  if (elNomorKat) elNomorKat.textContent = `Modul ${materi.nomor} · ${materi.kategori}`;
  if (elKesulitan) elKesulitan.textContent = materi.tingkatKesulitan;
  if (elWaktu) elWaktu.textContent = `⏱️ ${materi.estimasiWaktu}`;

  // Pasang listener tombol langkah 1-5 di stepper dots
  dialog.querySelectorAll(".step-dot-btn").forEach((dotBtn) => {
    dotBtn.onclick = () => {
      const step = parseInt(dotBtn.getAttribute("data-step"), 10);
      setReaderStep(step, materi, appState);
    };
  });

  // Tombol navigasi footer
  const btnPrev = document.getElementById("btnLangkahSebelumnya");
  const btnNext = document.getElementById("btnLangkahSelanjutnya");
  const btnQuiz = document.getElementById("btnBukaQuizDariMateri");

  if (btnPrev) {
    btnPrev.onclick = () => {
      if (activeReader.currentStep > 1) {
        setReaderStep(activeReader.currentStep - 1, materi, appState);
      }
    };
  }

  if (btnNext) {
    btnNext.onclick = () => {
      if (activeReader.currentStep < 5) {
        setReaderStep(activeReader.currentStep + 1, materi, appState);
      } else {
        // Step 5 Selesai: Tandai selesai otomatis & tawarkan quiz
        tandaiMateriSelesai(materi.id, appState);
        bukaModalQuizPlayer(materi.id, appState);
      }
    };
  }

  if (btnQuiz) {
    btnQuiz.onclick = () => {
      bukaModalQuizPlayer(materi.id, appState);
    };
  }

  // Listener AI Assistance
  setupAIAssistanceButtons(materi);

  // Render step awal (1)
  setReaderStep(1, materi, appState);

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

/**
 * Parse teks materi ke dalam 5 bagian terstruktur
 */
function parseMateriSections(materi) {
  const html = materi.penjelasanLengkap;
  const contohMatch = html.match(/<div class="kotak-sorotan contoh-aplikasi">([\s\S]*?)<\/div>/);
  const faktaMatch = html.match(/<div class="kotak-sorotan fakta-menarik">([\s\S]*?)<\/div>/);
  const kesimpulanMatch = html.match(/<div class="kotak-sorotan kesimpulan">([\s\S]*?)<\/div>/);
  const firstKotakIdx = html.indexOf('<div class="kotak-sorotan');
  const materiUtama = firstKotakIdx !== -1 ? html.slice(0, firstKotakIdx) : html;

  return {
    tujuan: materi.tujuanPembelajaran,
    ringkasan: materi.ringkasan,
    materiUtama,
    faktaMenarik: faktaMatch ? faktaMatch[1] : "",
    contohPenerapan: contohMatch ? contohMatch[1] : "",
    kesimpulan: kesimpulanMatch ? kesimpulanMatch[1] : "",
    referensi: materi.referensi
  };
}

/**
 * Ganti step aktif pada reader
 */
function setReaderStep(step, materi, appState) {
  activeReader.currentStep = step;
  const container = document.getElementById("paneKontenLangkahMateri");
  const dialog = document.getElementById("dialogMateriEdukasi");
  if (!container || !dialog) return;

  // Update Stepper Dots & Progress Fill
  dialog.querySelectorAll(".step-dot-btn").forEach((dotBtn) => {
    const s = parseInt(dotBtn.getAttribute("data-step"), 10);
    dotBtn.classList.toggle("aktif", s === step);
    dotBtn.classList.toggle("selesai", s < step);
  });

  const progressBar = document.getElementById("materiProgressBar");
  if (progressBar) progressBar.style.width = `${step * 20}%`;

  const labelStep = document.getElementById("labelIndikatorStep");
  if (labelStep) labelStep.textContent = `Langkah ${step} dari 5`;

  const btnPrev = document.getElementById("btnLangkahSebelumnya");
  const btnNext = document.getElementById("btnLangkahSelanjutnya");

  if (btnPrev) btnPrev.disabled = step === 1;
  if (btnNext) {
    btnNext.textContent = step === 5 ? "Selesai Membaca & Mulai Quiz 🏁" : "Selanjutnya ➔";
  }

  // Render isi konten langkah
  const p = activeReader.parsedContent;

  if (step === 1) {
    // STEP 1 — PENGENALAN
    container.innerHTML = `
      <div class="step-card-view">
        <div class="step-badge-tag">LANGKAH 1 DARI 5: PENGENALAN &amp; TUJUAN BELAJAR</div>
        <h4 class="step-title">Gambaran Umum Topik</h4>
        <p class="step-lead-text">${p.ringkasan}</p>

        <div class="kotak-tujuan-belajar">
          <h5>🎯 Tujuan Pembelajaran:</h5>
          <ul>
            ${p.tujuan.map((t) => `<li>${t}</li>`).join("")}
          </ul>
        </div>

        <div class="step-info-box">
          <p>💡 <b>Tips Belajar:</b> Baca materi secara bertahap. Di akhir setiap modul, terdapat 5 pertanyaan quiz untuk menguji pemahamanmu.</p>
        </div>
      </div>
    `;
  } else if (step === 2) {
    // STEP 2 — MATERI UTAMA
    container.innerHTML = `
      <div class="step-card-view">
        <div class="step-badge-tag">LANGKAH 2 DARI 5: PEMBAHASAN MATERI UTAMA</div>
        <div class="step-main-text">
          ${p.materiUtama}
        </div>
        ${
          p.faktaMenarik
            ? `
          <div class="kotak-sorotan fakta-menarik">
            ${p.faktaMenarik}
          </div>
        `
            : ""
        }
      </div>
    `;
  } else if (step === 3) {
    // STEP 3 — PENERAPAN SEHARI-HARI
    container.innerHTML = `
      <div class="step-card-view">
        <div class="step-badge-tag">LANGKAH 3 DARI 5: CONTOH PENERAPAN NYATA</div>
        <h4 class="step-title">Bagaimana Menerapkannya dalam Hidupmu?</h4>
        <div class="kotak-sorotan contoh-aplikasi">
          ${p.contohPenerapan}
        </div>
        <div class="step-practical-checklist">
          <h5>✅ 3 Kebiasaan Sederhana yang Bisa Kamu Mulai Hari Ini:</h5>
          <ul>
            <li>Perhatikan kualitas makanan atau intensitas gerakan sebelum memulai.</li>
            <li>Dengarkan sinyal lelah tubuh dan berikan waktu istirahat seimbang.</li>
            <li>Gunakan pedoman ilmiah sebagai kompas, bukan aturan kaku yang menyiksa.</li>
          </ul>
        </div>
      </div>
    `;
  } else if (step === 4) {
    // STEP 4 — KESIMPULAN
    const sudahTuntas = (stateEdukasi.materiSelesai || []).includes(materi.id);
    container.innerHTML = `
      <div class="step-card-view">
        <div class="step-badge-tag">LANGKAH 4 DARI 5: KESIMPULAN &amp; RANGKUMAN</div>
        <div class="kotak-sorotan kesimpulan">
          ${p.kesimpulan}
        </div>
        <div class="step-complete-box">
          <h5>Sudah memahami materi ini?</h5>
          <p>Tandai materi ini sebagai selesai untuk mencatat progres belajarmu dan membuka lencana edukasi!</p>
          <button type="button" class="tombol tombol-sukses" id="btnTandaiSelesaiStep">
            ${sudahTuntas ? "✅ Materi Sudah Ditandai Selesai" : "✓ Tandai Materi Ini Selesai"}
          </button>
        </div>
      </div>
    `;

    document.getElementById("btnTandaiSelesaiStep")?.addEventListener("click", () => {
      tandaiMateriSelesai(materi.id, appState);
      const btn = document.getElementById("btnTandaiSelesaiStep");
      if (btn) btn.textContent = "✅ Materi Sudah Ditandai Selesai";
    });
  } else if (step === 5) {
    // STEP 5 — REFERENSI ILMIAH
    container.innerHTML = `
      <div class="step-card-view">
        <div class="step-badge-tag">LANGKAH 5 DARI 5: REFERENSI &amp; SUMBER ILMIAH</div>
        <h4 class="step-title">Landasan Bukti Ilmiah (Evidence-Based Medicine)</h4>
        <p class="step-lead-text">Seluruh materi kesehatan di GERAK disusun berdasarkan pedoman resmi institusi kesehatan dunia dan riset peer-reviewed terverifikasi:</p>

        <div class="kotak-referensi-ilmiah">
          <h5 class="judul-referensi">📚 Publikasi Resmi Terverifikasi:</h5>
          <div class="detail-sumber">
            <p><b>Penulis / Peneliti:</b> ${p.referensi.penulis}</p>
            <p><b>Judul Penelitian:</b> "${p.referensi.judul}"</p>
            <p><b>Jurnal / Penerbit:</b> ${p.referensi.institusi} (${p.referensi.tahun})</p>
            ${p.referensi.doi ? `<p><b>DOI:</b> <span class="font-mono">${p.referensi.doi}</span></p>` : ""}
            ${p.referensi.pmid ? `<p><b>PMID:</b> <span class="font-mono">${p.referensi.pmid}</span></p>` : ""}
            <p class="link-wrap-step">
              <a href="${p.referensi.url}" target="_blank" rel="noopener noreferrer" class="link-jurnal-asli">
                🔗 Buka Sumber Asli / Publikasi Resmi ↗
              </a>
            </p>
          </div>
        </div>

        <div class="step-cta-quiz-box">
          <h5>Langkah Berikutnya: Uji Pemahamanmu!</h5>
          <p>Selesaikan 5 pertanyaan quiz interaktif khusus untuk materi ini dan raih nilai sempurnamu.</p>
        </div>
      </div>
    `;
  }

  // Scroll reader body ke atas saat ganti langkah
  container.scrollTop = 0;
}

function tandaiMateriSelesai(materiId, appState) {
  if (!stateEdukasi.materiSelesai) stateEdukasi.materiSelesai = [];
  if (!stateEdukasi.materiSelesai.includes(materiId)) {
    stateEdukasi.materiSelesai.push(materiId);
    tampilkanEfekSparkle();
    tampilToast("Selamat! Materi ini tuntas dipelajari! 🎓");
    cekBadgeEdukasi(appState);
    simpanProgresEdukasi(appState);
    renderRingkasanProgresCepat(appState);
    renderKartuLanjutkanBelajar(appState);
  }
}

function setupAIAssistanceButtons(materi) {
  document.getElementById("btnAISederhanakan")?.addEventListener("click", () => {
    bukaAITerarah(
      `Tolong jelaskan materi "${materi.judul}" ini dengan bahasa yang sangat sederhana, ramah untuk pemula, dan berikan analogi yang mudah diingat.`,
      "edukasi"
    );
  });

  document.getElementById("btnAIBedahIstilah")?.addEventListener("click", () => {
    bukaAITerarah(
      `Jelaskan istilah-istilah medis, nutrisi, atau olahraga yang penting dalam topik "${materi.judul}" agar aku paham maknanya secara saintifik.`,
      "edukasi"
    );
  });

  document.getElementById("btnAIContohLain")?.addEventListener("click", () => {
    bukaAITerarah(
      `Berikan 3 contoh penerapan praktis sehari-hari untuk mahasiswa atau pemula dari topik "${materi.judul}".`,
      "edukasi"
    );
  });
}

/**
 * ========================================================
 * 5. TAB 3: QUIZ HUB & SINGLE-QUESTION QUIZ PLAYER
 * ========================================================
 */
export function renderQuizHub(appState) {
  const container = document.getElementById("gridHubQuizEdukasi");
  const statBar = document.getElementById("statQuizQuickBar");
  if (!container) return;

  const totalQuiz = MATERI_EDUKASI.length;
  const quizIds = Object.keys(stateEdukasi.skorQuiz || {});
  const totalSelesai = quizIds.length;
  let rerataNilai = 0;
  if (totalSelesai > 0) {
    const sumSkor = quizIds.reduce((acc, k) => acc + (stateEdukasi.skorQuiz[k]?.skorPersen || 0), 0);
    rerataNilai = Math.round(sumSkor / totalSelesai);
  }

  if (statBar) {
    statBar.innerHTML = `
      <div class="stat-pill-quiz"><b>${totalSelesai} dari ${totalQuiz}</b> Quiz Dikerjakan</div>
      <div class="stat-pill-quiz">Nilai Rata-rata: <b>${rerataNilai}%</b></div>
    `;
  }

  // Filter toolbar quiz
  const filterBtns = document.querySelectorAll(".pill-filter-quiz");
  filterBtns.forEach((btn) => {
    const f = btn.getAttribute("data-filter");
    btn.classList.toggle("aktif", f === filterQuizHub);
    btn.onclick = () => {
      filterQuizHub = f;
      renderQuizHub(appState);
    };
  });

  const daftarTersaring = MATERI_EDUKASI.filter((m) => {
    const sudahDikerjakan = stateEdukasi.skorQuiz?.[m.id] !== undefined;
    if (filterQuizHub === "selesai") return sudahDikerjakan;
    if (filterQuizHub === "belum") return !sudahDikerjakan;
    return true;
  });

  container.innerHTML = daftarTersaring
    .map((m) => {
      const dataSkor = stateEdukasi.skorQuiz?.[m.id];
      const sudah = dataSkor !== undefined;

      return `
        <div class="kartu-quiz-hub ${sudah ? "sudah-dikerjakan" : ""}">
          <div class="quiz-hub-top">
            <span class="quiz-hub-icon">${m.ikon}</span>
            <span class="badge-mini aksen-biru">${m.tingkatKesulitan}</span>
          </div>
          <div class="quiz-hub-body">
            <span class="quiz-hub-nomor">Quiz Modul ${m.nomor} · ${m.kategori}</span>
            <h4 class="quiz-hub-judul">${m.judul}</h4>
            <p class="quiz-hub-sub">5 Pertanyaan Pilihan Ganda Berbasis Rujukan Ilmiah</p>
          </div>
          <div class="quiz-hub-footer">
            <div class="quiz-status-badge">
              ${
                sudah
                  ? `<span class="tag-status selesai">✅ Nilai: ${dataSkor.skorPersen}% (${dataSkor.benar}/5 Benar)</span>`
                  : `<span class="tag-status belum">⏳ Belum Dikerjakan</span>`
              }
            </div>
            <button type="button" class="tombol tombol-utama tombol-kecil btn-mulai-quiz-hub" data-quiz-materi="${m.id}">
              ${sudah ? "Ulangi Quiz 🔄" : "Mulai Quiz ➔"}
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".btn-mulai-quiz-hub").forEach((btn) => {
    btn.onclick = () => {
      const mId = btn.getAttribute("data-quiz-materi");
      bukaModalQuizPlayer(mId, appState);
    };
  });
}

/**
 * Buka Single-Question Interactive Quiz Player
 */
export function bukaModalQuizPlayer(materiId, appState) {
  const dialog = document.getElementById("dialogQuizPlayer");
  if (!dialog) return;

  const materi = MATERI_EDUKASI.find((m) => m.id === materiId);
  if (!materi) return;

  activeQuizPlayer = {
    materiId,
    currentQIndex: 0,
    userAnswers: {},
    isCurrentAnswered: false,
    scorePercent: 0,
    correctCount: 0,
    completed: false
  };

  // Header modal
  const elJudul = document.getElementById("judulModalQuizPlayer");
  const elBadgeMateri = document.getElementById("badgeQuizMateriTerkait");
  if (elJudul) elJudul.textContent = `Quiz: ${materi.judul}`;
  if (elBadgeMateri) elBadgeMateri.textContent = `Modul ${materi.nomor} · ${materi.kategori}`;

  // Reset display
  const areaSoal = document.getElementById("areaSoalQuizAktif");
  const areaFeedback = document.getElementById("areaFeedbackQuiz");
  const areaTombol = document.getElementById("areaTombolQuizStep");
  const areaHasil = document.getElementById("areaHasilAkhirQuiz");

  if (areaSoal) areaSoal.style.display = "block";
  if (areaFeedback) areaFeedback.style.display = "none";
  if (areaTombol) areaTombol.style.display = "block";
  if (areaHasil) areaHasil.style.display = "none";

  renderSingleQuestionQuiz(materi, appState);

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

/**
 * Render 1 Soal Aktif pada Quiz Player
 */
function renderSingleQuestionQuiz(materi, appState) {
  const qIdx = activeQuizPlayer.currentQIndex;
  const question = materi.quiz[qIdx];
  const totalQuestions = materi.quiz.length; // 5

  const areaSoal = document.getElementById("areaSoalQuizAktif");
  const areaFeedback = document.getElementById("areaFeedbackQuiz");
  const btnNext = document.getElementById("btnLanjutSoalQuiz");
  const labelCounter = document.getElementById("labelSoalCounter");
  const barProgress = document.getElementById("barProgressQuiz");
  const labelStatus = document.getElementById("labelQuizStatusJawab");

  if (!areaSoal || !question) return;

  // Stepper & Progress
  if (labelCounter) labelCounter.textContent = `Pertanyaan ${qIdx + 1} dari ${totalQuestions}`;
  if (barProgress) barProgress.style.width = `${((qIdx + 1) / totalQuestions) * 100}%`;
  if (labelStatus) labelStatus.textContent = activeQuizPlayer.isCurrentAnswered ? "Jawaban tercatat!" : "Pilih salah satu jawaban:";

  // Render Pilihan Soal
  areaSoal.innerHTML = `
    <div class="soal-card-single">
      <h4 class="soal-teks-single">${qIdx + 1}. ${question.pertanyaan}</h4>
      <div class="pilihan-quiz-single-list">
        ${question.pilihan
          .map((pil, pIdx) => {
            return `
              <button type="button" class="btn-opsi-quiz-single" data-pil-idx="${pIdx}">
                <span class="huruf-opsi-quiz">${String.fromCharCode(65 + pIdx)}</span>
                <span class="teks-opsi-quiz">${pil}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;

  if (areaFeedback) areaFeedback.style.display = "none";
  if (btnNext) btnNext.style.display = "none";

  // Event listener tombol pilihan
  areaSoal.querySelectorAll(".btn-opsi-quiz-single").forEach((btn) => {
    btn.onclick = () => {
      if (activeQuizPlayer.isCurrentAnswered) return;

      const pIdx = parseInt(btn.getAttribute("data-pil-idx"), 10);
      activeQuizPlayer.userAnswers[qIdx] = pIdx;
      activeQuizPlayer.isCurrentAnswered = true;

      const isCorrect = pIdx === question.jawabanBenar;
      if (isCorrect) {
        activeQuizPlayer.correctCount++;
        tampilkanEfekSparkle();
      }

      // Beri warna pada opsi
      areaSoal.querySelectorAll(".btn-opsi-quiz-single").forEach((b, idx) => {
        b.disabled = true;
        if (idx === question.jawabanBenar) {
          b.classList.add("opsi-kunci-benar");
        } else if (idx === pIdx && !isCorrect) {
          b.classList.add("opsi-salah-terpilih");
        }
      });

      // Tampilkan feedback & pembahasan
      if (areaFeedback) {
        areaFeedback.style.display = "block";
        areaFeedback.className = `area-feedback-quiz ${isCorrect ? "sukses" : "peringatan"}`;
        areaFeedback.innerHTML = `
          <p class="status-feedback-teks">
            ${isCorrect ? "✅ Tepat Sekali!" : `❌ Kurang Tepat. Jawaban benar adalah pilihan <b>${String.fromCharCode(65 + question.jawabanBenar)}</b>.`}
          </p>
          <p class="pembahasan-ilmiah-teks"><b>💡 Pembahasan Ilmiah:</b> ${question.penjelasan}</p>
        `;
      }

      // Tampilkan tombol lanjut
      if (btnNext) {
        btnNext.style.display = "block";
        btnNext.textContent = qIdx < totalQuestions - 1 ? "Soal Selanjutnya ➔" : "Lihat Hasil Akhir 🏆";
        btnNext.onclick = () => {
          if (qIdx < totalQuestions - 1) {
            activeQuizPlayer.currentQIndex++;
            activeQuizPlayer.isCurrentAnswered = false;
            renderSingleQuestionQuiz(materi, appState);
          } else {
            selesaikanQuizPlayer(materi, appState);
          }
        };
      }
    };
  });
}

/**
 * Tampilan Hasil Akhir Quiz Player
 */
function selesaikanQuizPlayer(materi, appState) {
  const total = materi.quiz.length; // 5
  const benar = activeQuizPlayer.correctCount;
  const salah = total - benar;
  const skorPersen = Math.round((benar / total) * 100);

  // Simpan data
  if (!stateEdukasi.skorQuiz) stateEdukasi.skorQuiz = {};
  stateEdukasi.skorQuiz[materi.id] = {
    skorPersen,
    benar,
    salah,
    tanggal: hariIni()
  };

  if (!stateEdukasi.riwayatQuiz) stateEdukasi.riwayatQuiz = [];
  stateEdukasi.riwayatQuiz.push({
    materiId: materi.id,
    judul: materi.judul,
    skorPersen,
    benar,
    salah,
    tanggal: hariIni()
  });

  // Jika lulus minimal 60%, tandai materi selesai
  if (skorPersen >= 60) {
    tandaiMateriSelesai(materi.id, appState);
  }

  if (skorPersen === 100) {
    tampilkanEfekSparkle();
    tampilToast("SEMPURNA! Nilai 100% Quiz Edukasi! 🏆✨");
  } else {
    tampilToast(`Quiz selesai! Nilaimu: ${skorPersen}% (${benar}/${total} benar)`);
  }

  cekBadgeEdukasi(appState);
  simpanProgresEdukasi(appState);

  // Sembunyikan area soal & feedback, tampilkan hasil
  const areaSoal = document.getElementById("areaSoalQuizAktif");
  const areaFeedback = document.getElementById("areaFeedbackQuiz");
  const areaTombol = document.getElementById("areaTombolQuizStep");
  const areaHasil = document.getElementById("areaHasilAkhirQuiz");

  if (areaSoal) areaSoal.style.display = "none";
  if (areaFeedback) areaFeedback.style.display = "none";
  if (areaTombol) areaTombol.style.display = "none";

  if (areaHasil) {
    areaHasil.style.display = "block";
    areaHasil.innerHTML = `
      <div class="hasil-quiz-player-card">
        <span class="skor-gauge-raksasa">${skorPersen}%</span>
        <h4>${skorPersen >= 80 ? "Luar Biasa! Pemahamanmu Sangat Kuat! 🎉" : skorPersen >= 60 ? "Bagus! Kamu Sudah Memahami Konsep Intinya." : "Jangan Patah Semangat! Pelajari Lagi & Coba Ulang."}</h4>
        <p class="skor-detail-teks">Jawaban Benar: <b>${benar}</b> · Jawaban Salah: <b>${salah}</b></p>

        <div class="hasil-action-buttons">
          <button type="button" class="tombol tombol-utama" id="btnUlangiQuizPlayer">
            🔄 Ulangi Quiz Ini
          </button>
          <button type="button" class="tombol tombol-ai" id="btnTanyaAIHasilQuiz">
            🤖 Tanya GERAK AI tentang Quiz Ini
          </button>
          <button type="button" class="tombol tombol-garis" data-tutup>
            ✕ Tutup &amp; Selesai
          </button>
        </div>
      </div>
    `;

    document.getElementById("btnUlangiQuizPlayer")?.addEventListener("click", () => {
      bukaModalQuizPlayer(materi.id, appState);
    });

    document.getElementById("btnTanyaAIHasilQuiz")?.addEventListener("click", () => {
      bukaAITerarah(
        `Halo GERAK AI, aku baru selesai mengerjakan quiz materi "${materi.judul}" dengan perolehan skor ${skorPersen}%. Bisakah kamu menjelaskan konsep-konsep penting dari soal-soal ini agar aku semakin paham?`,
        "edukasi"
      );
    });
  }
}

/**
 * ========================================================
 * 6. TAB 4: MINI GAMES HUB (5 GAMES)
 * ========================================================
 */
export function renderMiniGamesHub(appState) {
  const container = document.getElementById("gridHubMiniGames");
  if (!container) return;

  const games = [
    {
      key: "isiPiringku",
      judul: "Susun Isi Piringku",
      ikon: "🍽️",
      durasi: "3 Menit",
      desc: "Susun proporsi makanan pokok, lauk pauk, sayur, dan buah sesuai pedoman gizi seimbang Kemenkes RI.",
      badge: "GAME 1 · GIZI SEIMBANG",
      kelas: "aksen-hijau"
    },
    {
      key: "tebakNutrisi",
      judul: "Tebak Nutrisi",
      ikon: "🥑",
      durasi: "4 Menit",
      desc: "Uji ketajaman matamu dalam mengidentifikasi makronutrien dominan dan mikronutrien pangan alami dalam 8 ronde.",
      badge: "GAME 2 · KETELITIAN GIZI",
      kelas: "aksen-biru"
    },
    {
      key: "mitosFakta",
      judul: "Mitos atau Fakta",
      ikon: "🧐",
      durasi: "4 Menit",
      desc: "Bedah 10 pernyataan populer seputar diet, tidur, air es, hingga keringat berdasarkan bukti ilmiah internasional.",
      badge: "GAME 3 · MYTHBUSTER",
      kelas: "aksen-ungu"
    },
    {
      key: "foodDetective",
      judul: "Food Detective",
      ikon: "🔍",
      durasi: "5 Menit",
      desc: "Pecahkan misteri label Informasi Nilai Gizi produk kemasan: hitung takaran saji riil, gula tersembunyi, dan natrium.",
      badge: "GAME 4 · LITERASI PANGAN",
      kelas: "aksen-oranye"
    },
    {
      key: "fitnessChallenge",
      judul: "Fitness Challenge",
      ikon: "⚡",
      durasi: "5 Menit",
      desc: "5 stage skenario tantangan kebugaran: pemanasan dinamis, form push-up, ambang napas, nutrisi, dan rest day.",
      badge: "GAME 5 · STRATEGI WORKOUT",
      kelas: "aksen-hijau"
    }
  ];

  container.innerHTML = games
    .map((g) => {
      const stats = stateEdukasi.gameStats?.[g.key] || { kaliMain: 0, skorTertinggi: 0 };
      return `
        <div class="kartu-arena-game">
          <div class="arena-top">
            <span class="arena-icon">${g.ikon}</span>
            <span class="badge-mini ${g.kelas}">${g.badge}</span>
          </div>
          <div class="arena-body">
            <h4 class="arena-judul">${g.judul}</h4>
            <p class="arena-desc">${g.desc}</p>
            <div class="arena-stats-mini">
              <span>⏱️ Estimasi: ${g.durasi}</span>
              <span>🏆 Skor Tertinggi: <b>${stats.skorTertinggi}</b></span>
            </div>
          </div>
          <div class="arena-footer">
            <button type="button" class="tombol tombol-utama lebar-penuh btn-mainkan-game-arena" data-game-key="${g.key}">
              Mainkan Game Ini ➔
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".btn-mainkan-game-arena").forEach((btn) => {
    btn.onclick = () => {
      const gKey = btn.getAttribute("data-game-key");
      bukaMiniGame(gKey, appState);
    };
  });
}

/**
 * ========================================================
 * 7. TAB 5: PROGRES BELAJAR VIEW (PENCAPAIAN LENGKAP)
 * ========================================================
 */
export function renderProgresBelajarView(appState) {
  const container = document.getElementById("wadahDetailLearningProgress");
  if (!container) return;

  const totalMateri = MATERI_EDUKASI.length; // 20
  const selesaiCount = (stateEdukasi.materiSelesai || []).length;
  const persen = Math.round((selesaiCount / totalMateri) * 100);

  const quizIds = Object.keys(stateEdukasi.skorQuiz || {});
  const totalQuizSelesai = quizIds.length;
  let rerataNilai = 0;
  if (totalQuizSelesai > 0) {
    const sumSkor = quizIds.reduce((acc, k) => acc + (stateEdukasi.skorQuiz[k]?.skorPersen || 0), 0);
    rerataNilai = Math.round(sumSkor / totalQuizSelesai);
  }

  const totalGame = stateEdukasi.gameStats?.totalDimainkan || 0;
  const bestGame = stateEdukasi.gameStats?.skorTertinggiGame || { nama: "-", skor: 0 };

  // Cek Lencana
  cekBadgeEdukasi(appState);

  container.innerHTML = `
    <!-- 4 Metrik Utama -->
    <div class="grid-metrik-progres-lengkap">
      <div class="kartu-stat-progres">
        <span class="stat-icon">📚</span>
        <div class="stat-info">
          <span class="stat-number">${selesaiCount} / ${totalMateri}</span>
          <span class="stat-label">Materi Selesai (${persen}%)</span>
        </div>
      </div>

      <div class="kartu-stat-progres">
        <span class="stat-icon">📝</span>
        <div class="stat-info">
          <span class="stat-number">${rerataNilai}%</span>
          <span class="stat-label">Rata-rata Nilai Quiz (${totalQuizSelesai} Quiz)</span>
        </div>
      </div>

      <div class="kartu-stat-progres">
        <span class="stat-icon">🎮</span>
        <div class="stat-info">
          <span class="stat-number">${totalGame} Kali</span>
          <span class="stat-label">Mini Games Dimainkan</span>
        </div>
      </div>

      <div class="kartu-stat-progres">
        <span class="stat-icon">🏆</span>
        <div class="stat-info">
          <span class="stat-number">${bestGame.skor} Poin</span>
          <span class="stat-label">Skor Game Tertinggi (${bestGame.nama})</span>
        </div>
      </div>
    </div>

    <!-- 4 Lencana Edukasi -->
    <div class="seksi-lencana-progres">
      <h4 class="sub-judul-progres">Lencana Pembelajaran Edukasi</h4>
      <div class="grid-lencana-progres">
        ${BADGE_EDUKASI_LIST.map((b) => {
          const unlocked = (stateEdukasi.badgeDidapat || []).includes(b.id);
          return `
            <div class="kartu-lencana-item ${unlocked ? "unlocked" : "locked"}">
              <span class="ikon-lencana-item">${b.ikon}</span>
              <div class="info-lencana-item">
                <h5>${b.nama}</h5>
                <p class="syarat-lencana">${b.syarat}</p>
                <span class="status-lencana-tag">${unlocked ? "✅ Terbuka" : "🔒 Terkunci"}</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <!-- Sub-Bagian Tab Progres: Materi, Riwayat Quiz, Games, Favorit -->
    <div class="tabs-sub-progres-wrap">
      <div class="nav-sub-progres">
        <button type="button" class="btn-sub-progres aktif" data-sub="materi">Daftar Materi Saya</button>
        <button type="button" class="btn-sub-progres" data-sub="quiz">Riwayat Quiz</button>
        <button type="button" class="btn-sub-progres" data-sub="games">Statistik Games</button>
        <button type="button" class="btn-sub-progres" data-sub="favorit">Materi Favorit (${(stateEdukasi.materiFavorit || []).length})</button>
      </div>

      <div class="isi-sub-progres" id="wadahIsiSubProgres">
        <!-- Konten sub-progres di-render dinamis -->
      </div>
    </div>
  `;

  // Render default sub-view: materi
  renderSubProgresView("materi", appState);

  // Sub-tabs listener
  container.querySelectorAll(".btn-sub-progres").forEach((btn) => {
    btn.onclick = () => {
      container.querySelectorAll(".btn-sub-progres").forEach((b) => b.classList.remove("aktif"));
      btn.classList.add("aktif");
      const sub = btn.getAttribute("data-sub");
      renderSubProgresView(sub, appState);
    };
  });
}

function renderSubProgresView(subKey, appState) {
  const container = document.getElementById("wadahIsiSubProgres");
  if (!container) return;

  if (subKey === "materi") {
    const selesaiList = MATERI_EDUKASI.filter((m) => (stateEdukasi.materiSelesai || []).includes(m.id));
    const belumList = MATERI_EDUKASI.filter((m) => !(stateEdukasi.materiSelesai || []).includes(m.id));

    container.innerHTML = `
      <div class="sub-view-materi-grid">
        <div class="kolom-sub-materi">
          <h5>⏳ Materi Belum Selesai (${belumList.length})</h5>
          <div class="daftar-sub-materi-list">
            ${
              belumList.length === 0
                ? '<p class="teks-kosong">Selamat! Seluruh 20 materi telah kamu tuntaskan! 🏆</p>'
                : belumList
                    .map(
                      (m) => `
                  <div class="item-sub-materi-row">
                    <span class="m-icon">${m.ikon}</span>
                    <div class="m-info">
                      <h6>Modul ${m.nomor}. ${m.judul}</h6>
                      <small>${m.kategori} · ${m.estimasiWaktu}</small>
                    </div>
                    <button type="button" class="tombol-mini btn-buka-langsung" data-id="${m.id}">Pelajari ➔</button>
                  </div>
                `
                    )
                    .join("")
            }
          </div>
        </div>

        <div class="kolom-sub-materi">
          <h5>✅ Materi Sudah Tuntas (${selesaiList.length})</h5>
          <div class="daftar-sub-materi-list">
            ${
              selesaiList.length === 0
                ? '<p class="teks-kosong">Belum ada materi yang dituntaskan. Mulai modul pertamamu yuk!</p>'
                : selesaiList
                    .map(
                      (m) => `
                  <div class="item-sub-materi-row selesai">
                    <span class="m-icon">${m.ikon}</span>
                    <div class="m-info">
                      <h6>Modul ${m.nomor}. ${m.judul}</h6>
                      <small>Status: Tuntas Dipelajari</small>
                    </div>
                    <button type="button" class="tombol-mini btn-buka-langsung" data-id="${m.id}">Baca Ulang</button>
                  </div>
                `
                    )
                    .join("")
            }
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll(".btn-buka-langsung").forEach((btn) => {
      btn.onclick = () => {
        const mId = btn.getAttribute("data-id");
        bukaModalStepReader(mId, appState);
      };
    });
  } else if (subKey === "quiz") {
    const riwayat = stateEdukasi.riwayatQuiz || [];
    container.innerHTML = `
      <div class="sub-view-riwayat-quiz">
        <h5>Riwayat Pengerjaan Quiz:</h5>
        ${
          riwayat.length === 0
            ? '<p class="teks-kosong">Kamu belum mengerjakan quiz. Uji pemahamanmu di tab Quiz Interaktif!</p>'
            : `
          <div class="tabel-riwayat-quiz-wrap">
            <table class="tabel-riwayat-quiz">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Materi</th>
                  <th>Nilai</th>
                  <th>Hasil</th>
                </tr>
              </thead>
              <tbody>
                ${riwayat
                  .slice(-15)
                  .reverse()
                  .map(
                    (r) => `
                  <tr>
                    <td>${formatTanggalIndonesia(r.tanggal)}</td>
                    <td><b>${r.judul}</b></td>
                    <td><span class="badge-nilai ${r.skorPersen >= 60 ? "lulus" : "remidi"}">${r.skorPersen}%</span></td>
                    <td>${r.benar}/5 Benar</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
        }
      </div>
    `;
  } else if (subKey === "games") {
    const gs = stateEdukasi.gameStats || {};
    container.innerHTML = `
      <div class="sub-view-games-stats">
        <h5>Statistik 5 Mini Games Edukasi:</h5>
        <div class="grid-game-stats-cards">
          <div class="game-stat-item">
            <span>🍽️ Susun Isi Piringku</span>
            <b>${gs.isiPiringku?.kaliMain || 0} kali main</b>
            <small>Skor Tertinggi: ${gs.isiPiringku?.skorTertinggi || 0}</small>
          </div>
          <div class="game-stat-item">
            <span>🥑 Tebak Nutrisi</span>
            <b>${gs.tebakNutrisi?.kaliMain || 0} kali main</b>
            <small>Skor Tertinggi: ${gs.tebakNutrisi?.skorTertinggi || 0}</small>
          </div>
          <div class="game-stat-item">
            <span>🧐 Mitos atau Fakta</span>
            <b>${gs.mitosFakta?.kaliMain || 0} kali main</b>
            <small>Skor Tertinggi: ${gs.mitosFakta?.skorTertinggi || 0}</small>
          </div>
          <div class="game-stat-item">
            <span>🔍 Food Detective</span>
            <b>${gs.foodDetective?.kaliMain || 0} kali main</b>
            <small>Skor Tertinggi: ${gs.foodDetective?.skorTertinggi || 0}</small>
          </div>
          <div class="game-stat-item">
            <span>⚡ Fitness Challenge</span>
            <b>${gs.fitnessChallenge?.kaliMain || 0} kali main</b>
            <small>Skor Tertinggi: ${gs.fitnessChallenge?.skorTertinggi || 0}</small>
          </div>
        </div>
      </div>
    `;
  } else if (subKey === "favorit") {
    const favIds = stateEdukasi.materiFavorit || [];
    const favMateri = MATERI_EDUKASI.filter((m) => favIds.includes(m.id));

    container.innerHTML = `
      <div class="sub-view-favorit">
        <h5>⭐ Materi yang Kamu Simpan:</h5>
        ${
          favMateri.length === 0
            ? '<p class="teks-kosong">Belum ada materi favorit. Klik ikon bintang (☆) pada kartu materi untuk menyimpannya di sini!</p>'
            : `
          <div class="grid-materi-favorit">
            ${favMateri
              .map(
                (m) => `
              <div class="kartu-fav-mini">
                <span class="fav-icon">${m.ikon}</span>
                <div class="fav-info">
                  <h6>Modul ${m.nomor}. ${m.judul}</h6>
                  <small>${m.kategori} · ${m.estimasiWaktu}</small>
                </div>
                <button type="button" class="tombol tombol-kecil btn-buka-fav" data-id="${m.id}">Pelajari ➔</button>
              </div>
            `
              )
              .join("")}
          </div>
        `
        }
      </div>
    `;

    container.querySelectorAll(".btn-buka-fav").forEach((btn) => {
      btn.onclick = () => {
        const mId = btn.getAttribute("data-id");
        bukaModalStepReader(mId, appState);
      };
    });
  }
}

/**
 * Cek dan buka badge edukasi
 */
export function cekBadgeEdukasi(appState) {
  const materiCount = (stateEdukasi.materiSelesai || []).length;
  let baruBuka = false;

  BADGE_EDUKASI_LIST.forEach((badge) => {
    if (!stateEdukasi.badgeDidapat) stateEdukasi.badgeDidapat = [];
    if (!stateEdukasi.badgeDidapat.includes(badge.id)) {
      if (materiCount >= badge.jumlahSyarat) {
        stateEdukasi.badgeDidapat.push(badge.id);
        baruBuka = true;
        tampilkanEfekSparkle();
        tampilToast(`🎉 Lencana Baru Terbuka: ${badge.ikon} ${badge.nama}!`);
      }
    }
  });

  if (baruBuka) {
    simpanProgresEdukasi(appState);
  }
}

/**
 * ========================================================
 * 8. MINI GAMES ENGINE (PRESERVED 100%)
 * ========================================================
 */
export function bukaMiniGame(gameKey, appState) {
  const dialog = document.getElementById("dialogMiniGameEdukasi");
  if (!dialog) return;

  currentGame = {
    key: gameKey,
    stepIndex: 0,
    score: 0,
    userChoices: {},
    completed: false
  };

  renderActiveGame(appState);

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function renderActiveGame(appState) {
  const container = document.getElementById("wadahIsiMiniGame");
  const elJudul = document.getElementById("judulModalGame");
  if (!container) return;

  if (currentGame.key === "isiPiringku") {
    if (elJudul) elJudul.textContent = "🍽️ Game 1: Susun Isi Piringku (Kemenkes RI)";
    renderGameIsiPiringku(container, appState);
  } else if (currentGame.key === "tebakNutrisi") {
    if (elJudul) elJudul.textContent = "🥑 Game 2: Tebak Nutrisi (8 Ronde)";
    renderGameTebakNutrisi(container, appState);
  } else if (currentGame.key === "mitosFakta") {
    if (elJudul) elJudul.textContent = "🧐 Game 3: Mitos atau Fakta Kesehatan";
    renderGameMitosFakta(container, appState);
  } else if (currentGame.key === "foodDetective") {
    if (elJudul) elJudul.textContent = "🔍 Game 4: Food Detective (Baca Label Gizi)";
    renderGameFoodDetective(container, appState);
  } else if (currentGame.key === "fitnessChallenge") {
    if (elJudul) elJudul.textContent = "⚡ Game 5: Fitness Challenge (5 Stage)";
    renderGameFitnessChallenge(container, appState);
  }
}

function renderGameIsiPiringku(container, appState) {
  const data = DATA_MINI_GAMES.isiPiringku;
  const piring = currentGame.userChoices.piring || {
    makananPokok: null,
    laukPauk: null,
    sayuran: null,
    buahBuahan: null
  };

  container.innerHTML = `
    <div class="game-container game-piringku">
      <p class="instruksi-game"><b>Instruksi:</b> ${data.instruksi}</p>

      <div class="papan-piring-visual">
        <div class="sektor-piring sektor-sayur ${piring.sayuran ? "terisi" : ""}" data-slot="sayuran">
          <span class="label-sektor">🥗 Sayuran (2/3 dari 1/2 piring)</span>
          <div class="isi-sektor">${piring.sayuran ? `${piring.sayuran.emoji} ${piring.sayuran.nama}` : '<span class="slot-kosong">+ Pilih Sayuran</span>'}</div>
        </div>

        <div class="sektor-piring sektor-buah ${piring.buahBuahan ? "terisi" : ""}" data-slot="buahBuahan">
          <span class="label-sektor">🍉 Buah (1/3 dari 1/2 piring)</span>
          <div class="isi-sektor">${piring.buahBuahan ? `${piring.buahBuahan.emoji} ${piring.buahBuahan.nama}` : '<span class="slot-kosong">+ Pilih Buah</span>'}</div>
        </div>

        <div class="sektor-piring sektor-pokok ${piring.makananPokok ? "terisi" : ""}" data-slot="makananPokok">
          <span class="label-sektor">🍚 Makanan Pokok (2/3 dari 1/2 piring)</span>
          <div class="isi-sektor">${piring.makananPokok ? `${piring.makananPokok.emoji} ${piring.makananPokok.nama}` : '<span class="slot-kosong">+ Pilih Pokok</span>'}</div>
        </div>

        <div class="sektor-piring sektor-lauk ${piring.laukPauk ? "terisi" : ""}" data-slot="laukPauk">
          <span class="label-sektor">🍗 Lauk Pauk (1/3 dari 1/2 piring)</span>
          <div class="isi-sektor">${piring.laukPauk ? `${piring.laukPauk.emoji} ${piring.laukPauk.nama}` : '<span class="slot-kosong">+ Pilih Lauk</span>'}</div>
        </div>
      </div>

      <div class="rak-makanan-pilihan">
        <h5>Pilih bahan makanan di bawah ini untuk mengisi piring:</h5>
        <div class="grid-rak-makanan">
          ${data.items
            .map((it) => {
              const terpilih = Object.values(piring).some((p) => p && p.id === it.id);
              return `
                <button type="button" class="item-rak-makanan ${terpilih ? "dipakai" : ""}" data-item-id="${it.id}">
                  <span class="emoji-rak">${it.emoji}</span>
                  <span class="nama-rak">${it.nama}</span>
                  <span class="kalori-rak">${it.kalori}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </div>

      <div class="game-action-bar">
        <button type="button" class="tombol tombol-bahaya tombol-kecil" id="btnResetPiring">Kosongkan Piring</button>
        <button type="button" class="tombol tombol-utama" id="btnVerifikasiPiring">Verifikasi Porsi Isi Piringku</button>
      </div>

      <div id="feedbackPiringBox"></div>
    </div>
  `;

  container.querySelectorAll(".item-rak-makanan").forEach((btn) => {
    btn.onclick = () => {
      const itId = btn.getAttribute("data-item-id");
      const item = data.items.find((x) => x.id === itId);
      if (!item) return;

      piring[item.kategori] = item;
      currentGame.userChoices.piring = piring;
      renderGameIsiPiringku(container, appState);
    };
  });

  document.getElementById("btnResetPiring")?.addEventListener("click", () => {
    currentGame.userChoices.piring = { makananPokok: null, laukPauk: null, sayuran: null, buahBuahan: null };
    renderGameIsiPiringku(container, appState);
  });

  document.getElementById("btnVerifikasiPiring")?.addEventListener("click", () => {
    const box = document.getElementById("feedbackPiringBox");
    if (!box) return;

    const terisi = [piring.makananPokok, piring.laukPauk, piring.sayuran, piring.buahBuahan].filter(Boolean).length;
    if (terisi < 4) {
      box.innerHTML = `
        <div class="feedback-game peringatan">
          <h5>⚠️ Piring Belum Lengkap (${terisi}/4 bagian terisi)</h5>
          <p>Pastikan kamu memilih 1 makanan pokok, 1 lauk pauk, 1 sayuran, dan 1 buah agar komposisi gizi seimbang sempurna!</p>
        </div>
      `;
      return;
    }

    const skor = 100;
    catatSkorMiniGame("isiPiringku", "Susun Isi Piringku", skor, appState);
    tampilkanEfekSparkle();

    box.innerHTML = `
      <div class="feedback-game sukses">
        <h4>🎉 Komposisi Piring Sempurna! (Skor: 100)</h4>
        <p><b>Hebat!</b> Piringmu memenuhi standar <b>Isi Piringku Kemenkes RI</b>:</p>
        <ul>
          <li><b>Makanan Pokok:</b> ${piring.makananPokok.nama} (${piring.makananPokok.kalori})</li>
          <li><b>Lauk Pauk:</b> ${piring.laukPauk.nama} (${piring.laukPauk.kalori})</li>
          <li><b>Sayuran:</b> ${piring.sayuran.nama} (${piring.sayuran.kalori})</li>
          <li><b>Buah:</b> ${piring.buahBuahan.nama} (${piring.buahBuahan.kalori})</li>
        </ul>
        <p>Jangan lupa minum <b>air putih minimal 1 gelas</b> dan cuci tangan pakai sabun ya!</p>
        <button type="button" class="tombol tombol-kecil" id="btnMainLagiPiring">Main Kembali dengan Menu Lain</button>
      </div>
    `;

    document.getElementById("btnMainLagiPiring")?.addEventListener("click", () => {
      currentGame.userChoices.piring = { makananPokok: null, laukPauk: null, sayuran: null, buahBuahan: null };
      renderGameIsiPiringku(container, appState);
    });
  });
}

function renderGameTebakNutrisi(container, appState) {
  const data = DATA_MINI_GAMES.tebakNutrisi;
  const currentRonde = data.ronde[currentGame.stepIndex];

  if (currentGame.completed || !currentRonde) {
    container.innerHTML = `
      <div class="game-container game-selesai">
        <span class="ikon-raksasa">🏆</span>
        <h3>Tebak Nutrisi Selesai!</h3>
        <p class="skor-akhir-game">Skor Akhirmu: <b>${currentGame.score}</b> / 100</p>
        <p>Kamu telah menyelesaikan 8 ronde pengenalan zat gizi makanan alami dengan sangat baik.</p>
        <button type="button" class="tombol tombol-utama" id="btnUlangTebakNutrisi">Main Kembali</button>
      </div>
    `;

    document.getElementById("btnUlangTebakNutrisi")?.addEventListener("click", () => {
      currentGame.stepIndex = 0;
      currentGame.score = 0;
      currentGame.completed = false;
      renderGameTebakNutrisi(container, appState);
    });
    return;
  }

  const sudahJawab = currentGame.userChoices[currentGame.stepIndex] !== undefined;
  const jawabanDipilih = currentGame.userChoices[currentGame.stepIndex];
  const benar = sudahJawab && jawabanDipilih === currentRonde.jawabanBenar;

  container.innerHTML = `
    <div class="game-container game-tebak-nutrisi">
      <div class="header-ronde-bar">
        <span class="ronde-tag">Ronde ${currentGame.stepIndex + 1} dari 8</span>
        <span class="skor-sementara">Skor: ${currentGame.score}</span>
      </div>

      <div class="kartu-makanan-tanya">
        <span class="makanan-ikon-besar">${currentRonde.emoji}</span>
        <h4 class="nama-makanan-tanya">${currentRonde.makanan}</h4>
        <p class="soal-makanan">${currentRonde.pertanyaan}</p>
      </div>

      <div class="pilihan-tebak-list">
        ${currentRonde.pilihan
          .map((pil, idx) => {
            let kelas = "";
            if (sudahJawab) {
              if (idx === currentRonde.jawabanBenar) kelas = "jawaban-benar";
              else if (idx === jawabanDipilih) kelas = "jawaban-salah";
            }
            return `
              <button type="button" class="btn-opsi-tebak ${kelas}" data-pilihan-idx="${idx}" ${sudahJawab ? "disabled" : ""}>
                <span class="huruf-opsi">${String.fromCharCode(65 + idx)}</span>
                <span class="teks-opsi">${pil}</span>
              </button>
            `;
          })
          .join("")}
      </div>

      ${
        sudahJawab
          ? `
        <div class="feedback-ronde ${benar ? "sukses" : "peringatan"}">
          <p class="status-tebakan">${benar ? "🎉 Benar Sekali (+12.5 Poin)!" : "❌ Kurang tepat!"}</p>
          <p class="penjelasan-tebakan">${currentRonde.penjelasan}</p>
          <button type="button" class="tombol tombol-utama tombol-kecil" id="btnNextRondeTebak">
            ${currentGame.stepIndex < 7 ? "Ronde Berikutnya ➔" : "Lihat Hasil Akhir 🏆"}
          </button>
        </div>
      `
          : ""
      }
    </div>
  `;

  if (!sudahJawab) {
    container.querySelectorAll(".btn-opsi-tebak").forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute("data-pilihan-idx"), 10);
        currentGame.userChoices[currentGame.stepIndex] = idx;
        if (idx === currentRonde.jawabanBenar) {
          currentGame.score += 12.5;
          tampilkanEfekSparkle();
        }
        renderGameTebakNutrisi(container, appState);
      };
    });
  } else {
    document.getElementById("btnNextRondeTebak")?.addEventListener("click", () => {
      if (currentGame.stepIndex < 7) {
        currentGame.stepIndex++;
      } else {
        currentGame.completed = true;
        catatSkorMiniGame("tebakNutrisi", "Tebak Nutrisi", Math.round(currentGame.score), appState);
      }
      renderGameTebakNutrisi(container, appState);
    });
  }
}

function renderGameMitosFakta(container, appState) {
  const data = DATA_MINI_GAMES.mitosFakta;
  const currentItem = data.daftar[currentGame.stepIndex];

  if (currentGame.completed || !currentItem) {
    container.innerHTML = `
      <div class="game-container game-selesai">
        <span class="ikon-raksasa">🧐</span>
        <h3>Tantangan Mitos atau Fakta Tuntas!</h3>
        <p class="skor-akhir-game">Skor Akhir: <b>${currentGame.score}</b> / 100</p>
        <p>Kamu telah berhasil membedakan sains kesehatan nyata dari mitos yang beredar di masyarakat.</p>
        <button type="button" class="tombol tombol-utama" id="btnUlangMitosFakta">Main Kembali</button>
      </div>
    `;

    document.getElementById("btnUlangMitosFakta")?.addEventListener("click", () => {
      currentGame.stepIndex = 0;
      currentGame.score = 0;
      currentGame.completed = false;
      renderGameMitosFakta(container, appState);
    });
    return;
  }

  const sudahJawab = currentGame.userChoices[currentGame.stepIndex] !== undefined;
  const pilihanUser = currentGame.userChoices[currentGame.stepIndex];
  const benar = sudahJawab && pilihanUser === currentItem.apakahFakta;

  container.innerHTML = `
    <div class="game-container game-mitos-fakta">
      <div class="header-ronde-bar">
        <span class="ronde-tag">Pernyataan ${currentGame.stepIndex + 1} dari 10</span>
        <span class="skor-sementara">Skor: ${currentGame.score}</span>
      </div>

      <div class="kartu-pernyataan-mitos">
        <span class="tag-kategori-mf">${currentItem.kategori}</span>
        <h4 class="teks-pernyataan">"${currentItem.pernyataan}"</h4>
      </div>

      <div class="tombol-dua-pilihan">
        <button type="button" class="tombol-pilih-mf tombol-mitos ${sudahJawab && !currentItem.apakahFakta ? "terbukti-benar" : ""}" id="btnPilihMitos" ${sudahJawab ? "disabled" : ""}>
          ❌ MITOS
        </button>
        <button type="button" class="tombol-pilih-mf tombol-fakta ${sudahJawab && currentItem.apakahFakta ? "terbukti-benar" : ""}" id="btnPilihFakta" ${sudahJawab ? "disabled" : ""}>
          ✅ FAKTA
        </button>
      </div>

      ${
        sudahJawab
          ? `
        <div class="feedback-ronde ${benar ? "sukses" : "peringatan"}">
          <p class="status-mf">
            ${benar ? "🎉 Tebakanmu Tepat Sekali (+10 Poin)!" : "⚠️ Kurang Tepat!"}
            Pernyataan ini adalah <b>${currentItem.apakahFakta ? "FAKTA" : "MITOS"}</b>.
          </p>
          <p class="penjelasan-mf">${currentItem.penjelasan}</p>
          <p class="sumber-mf"><b>📚 Sumber Rujukan:</b> ${currentItem.sumber}</p>
          <button type="button" class="tombol tombol-utama tombol-kecil" id="btnNextMitosFakta">
            ${currentGame.stepIndex < 9 ? "Pernyataan Berikutnya ➔" : "Lihat Hasil Akhir 🏆"}
          </button>
        </div>
      `
          : ""
      }
    </div>
  `;

  if (!sudahJawab) {
    document.getElementById("btnPilihMitos")?.addEventListener("click", () => {
      currentGame.userChoices[currentGame.stepIndex] = false;
      if (!currentItem.apakahFakta) {
        currentGame.score += 10;
        tampilkanEfekSparkle();
      }
      renderGameMitosFakta(container, appState);
    });

    document.getElementById("btnPilihFakta")?.addEventListener("click", () => {
      currentGame.userChoices[currentGame.stepIndex] = true;
      if (currentItem.apakahFakta) {
        currentGame.score += 10;
        tampilkanEfekSparkle();
      }
      renderGameMitosFakta(container, appState);
    });
  } else {
    document.getElementById("btnNextMitosFakta")?.addEventListener("click", () => {
      if (currentGame.stepIndex < 9) {
        currentGame.stepIndex++;
      } else {
        currentGame.completed = true;
        catatSkorMiniGame("mitosFakta", "Mitos atau Fakta", currentGame.score, appState);
      }
      renderGameMitosFakta(container, appState);
    });
  }
}

function renderGameFoodDetective(container, appState) {
  const data = DATA_MINI_GAMES.foodDetective;
  const kasusIndex = currentGame.stepIndex;
  const currentKasus = data.kasus[kasusIndex];

  if (currentGame.completed || !currentKasus) {
    container.innerHTML = `
      <div class="game-container game-selesai">
        <span class="ikon-raksasa">🔍</span>
        <h3>Kasus Detektif Selesai Dipecahkan!</h3>
        <p class="skor-akhir-game">Skor Akhir: <b>${currentGame.score}</b> / 100</p>
        <p>Kamu telah membuktikan keterampilan membaca label pangan kemasan dengan teliti.</p>
        <button type="button" class="tombol tombol-utama" id="btnUlangFoodDetective">Pecahkan Lagi</button>
      </div>
    `;

    document.getElementById("btnUlangFoodDetective")?.addEventListener("click", () => {
      currentGame.stepIndex = 0;
      currentGame.score = 0;
      currentGame.completed = false;
      currentGame.userChoices = {};
      renderGameFoodDetective(container, appState);
    });
    return;
  }

  const userAnswersKasus = currentGame.userChoices[kasusIndex] || {};
  const isAllAnswered = Object.keys(userAnswersKasus).length === 3;

  container.innerHTML = `
    <div class="game-container game-food-detective">
      <div class="header-ronde-bar">
        <span class="ronde-tag">Kasus ${kasusIndex + 1} dari 3: ${currentKasus.namaProduk}</span>
        <span class="skor-sementara">Skor: ${currentGame.score}</span>
      </div>

      <div class="split-detective-layout">
        <div class="panel-label-gizi">
          <div class="nutrition-facts-box">
            <h4 class="nf-title">Informasi Nilai Gizi</h4>
            <p class="nf-serving">Takaran Saji: <b>${currentKasus.label.takaranSaji}</b></p>
            <p class="nf-servings-container">${currentKasus.label.jumlahSajianPerKemasan} Sajian per Kemasan</p>
            <div class="nf-divider-thick"></div>
            <p class="nf-calories">Jumlah per Sajian</p>
            <p class="nf-calories-num">Energi Total: <b>${currentKasus.label.energiTotal}</b></p>
            <div class="nf-divider-medium"></div>
            <ul class="nf-nutrients">
              <li>Lemak Total: <b>${currentKasus.label.lemakTotal}</b></li>
              <li>Protein: <b>${currentKasus.label.protein}</b></li>
              <li>Karbohidrat Total: <b>${currentKasus.label.karbohidratTotal}</b></li>
              ${currentKasus.label.seratPangan ? `<li>Serat Pangan: <b>${currentKasus.label.seratPangan}</b></li>` : ""}
              <li>Gula: <b>${currentKasus.label.gulaTotal}</b></li>
              <li>Natrium: <b>${currentKasus.label.natrium}</b></li>
            </ul>
          </div>
        </div>

        <div class="panel-tanya-detective">
          <h5>Pertanyaan Detektif Nutrisi:</h5>
          ${currentKasus.pertanyaan
            .map((q, qIdx) => {
              const ans = userAnswersKasus[qIdx];
              const answered = ans !== undefined;
              const isCorrect = answered && ans === q.jawabanBenar;

              return `
                <div class="item-tanya-fd ${answered ? (isCorrect ? "fd-benar" : "fd-salah") : ""}">
                  <p class="teks-tanya-fd"><b>${qIdx + 1}.</b> ${q.tanya}</p>
                  <div class="pilihan-fd-list">
                    ${q.pilihan
                      .map((p, pIdx) => {
                        let cls = "";
                        if (answered) {
                          if (pIdx === q.jawabanBenar) cls = "pilihan-kunci-fd";
                          else if (pIdx === ans) cls = "pilihan-salah-fd";
                        }
                        return `
                          <button type="button" class="btn-opsi-fd ${cls}" data-kasus-idx="${kasusIndex}" data-soal-idx="${qIdx}" data-pil-idx="${pIdx}" ${answered ? "disabled" : ""}>
                            ${p}
                          </button>
                        `;
                      })
                      .join("")}
                  </div>
                  ${answered ? `<p class="penjelasan-fd-mini">💡 ${q.penjelasan}</p>` : ""}
                </div>
              `;
            })
            .join("")}

          ${
            isAllAnswered
              ? `
            <div class="kasus-next-wrap">
              <button type="button" class="tombol tombol-utama" id="btnNextKasusFD">
                ${kasusIndex < 2 ? "Lanjut ke Kasus Berikutnya ➔" : "Selesaikan Investigasi 🏆"}
              </button>
            </div>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll(".btn-opsi-fd").forEach((btn) => {
    btn.onclick = () => {
      const kIdx = parseInt(btn.getAttribute("data-kasus-idx"), 10);
      const sIdx = parseInt(btn.getAttribute("data-soal-idx"), 10);
      const pIdx = parseInt(btn.getAttribute("data-pil-idx"), 10);

      if (!currentGame.userChoices[kIdx]) currentGame.userChoices[kIdx] = {};
      currentGame.userChoices[kIdx][sIdx] = pIdx;

      if (pIdx === currentKasus.pertanyaan[sIdx].jawabanBenar) {
        currentGame.score += 11.1;
        tampilkanEfekSparkle();
      }

      renderGameFoodDetective(container, appState);
    };
  });

  document.getElementById("btnNextKasusFD")?.addEventListener("click", () => {
    if (currentGame.stepIndex < 2) {
      currentGame.stepIndex++;
    } else {
      currentGame.completed = true;
      catatSkorMiniGame("foodDetective", "Food Detective", Math.round(currentGame.score), appState);
    }
    renderGameFoodDetective(container, appState);
  });
}

function renderGameFitnessChallenge(container, appState) {
  const data = DATA_MINI_GAMES.fitnessChallenge;
  const stage = data.stages[currentGame.stepIndex];

  if (currentGame.completed || !stage) {
    container.innerHTML = `
      <div class="game-container game-selesai">
        <span class="ikon-raksasa">⚡</span>
        <h3>Fitness Challenge Tuntas!</h3>
        <p class="skor-akhir-game">Skor Akhir: <b>${currentGame.score}</b> / 100</p>
        <p>Kamu telah membuktikan penguasaan strategi kebugaran taktis: pemanasan, form teknik, regulasi napas, nutrisi, dan pemulihan!</p>
        <button type="button" class="tombol tombol-utama" id="btnUlangFitnessChallenge">Mulai Tantangan Baru</button>
      </div>
    `;

    document.getElementById("btnUlangFitnessChallenge")?.addEventListener("click", () => {
      currentGame.stepIndex = 0;
      currentGame.score = 0;
      currentGame.completed = false;
      renderGameFitnessChallenge(container, appState);
    });
    return;
  }

  const sudahJawab = currentGame.userChoices[currentGame.stepIndex] !== undefined;
  const jawabanDipilih = currentGame.userChoices[currentGame.stepIndex];
  const benar = sudahJawab && jawabanDipilih === stage.jawabanBenar;

  container.innerHTML = `
    <div class="game-container game-fitness-challenge">
      <div class="header-ronde-bar">
        <span class="ronde-tag">Stage ${stage.stage} dari 5: ${stage.judul}</span>
        <span class="skor-sementara">Skor: ${currentGame.score}</span>
      </div>

      <div class="stepper-stages">
        ${data.stages
          .map((st, i) => `
            <div class="step-dot ${i < currentGame.stepIndex ? "tuntas" : i === currentGame.stepIndex ? "aktif" : ""}">
              ${i < currentGame.stepIndex ? "✓" : i + 1}
            </div>
          `)
          .join("")}
      </div>

      <div class="kartu-skenario-fitness">
        <h5>Skenario Tantangan:</h5>
        <p class="teks-skenario">${stage.skenario}</p>
      </div>

      <div class="opsi-fitness-list">
        ${stage.pilihan
          .map((pil, idx) => {
            let cls = "";
            if (sudahJawab) {
              if (idx === stage.jawabanBenar) cls = "jawaban-benar";
              else if (idx === jawabanDipilih) cls = "jawaban-salah";
            }
            return `
              <button type="button" class="btn-opsi-fitness ${cls}" data-idx="${idx}" ${sudahJawab ? "disabled" : ""}>
                <span class="huruf-opsi">${String.fromCharCode(65 + idx)}</span>
                <span class="teks-opsi">${pil}</span>
              </button>
            `;
          })
          .join("")}
      </div>

      ${
        sudahJawab
          ? `
        <div class="feedback-ronde ${benar ? "sukses" : "peringatan"}">
          <p class="status-fit">${benar ? "🎉 Taktik Tepat (+20 Poin)!" : "⚠️ Keputusan Berisiko!"}</p>
          <p class="penjelasan-fit">${stage.penjelasan}</p>
          <button type="button" class="tombol tombol-utama tombol-kecil" id="btnNextStageFit">
            ${currentGame.stepIndex < 4 ? "Lanjut ke Stage Berikutnya ➔" : "Lihat Evaluasi Akhir 🏆"}
          </button>
        </div>
      `
          : ""
      }
    </div>
  `;

  if (!sudahJawab) {
    container.querySelectorAll(".btn-opsi-fitness").forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        currentGame.userChoices[currentGame.stepIndex] = idx;
        if (idx === stage.jawabanBenar) {
          currentGame.score += 20;
          tampilkanEfekSparkle();
        }
        renderGameFitnessChallenge(container, appState);
      };
    });
  } else {
    document.getElementById("btnNextStageFit")?.addEventListener("click", () => {
      if (currentGame.stepIndex < 4) {
        currentGame.stepIndex++;
      } else {
        currentGame.completed = true;
        catatSkorMiniGame("fitnessChallenge", "Fitness Challenge", currentGame.score, appState);
      }
      renderGameFitnessChallenge(container, appState);
    });
  }
}

function catatSkorMiniGame(key, nama, skor, appState) {
  if (!stateEdukasi.gameStats) {
    stateEdukasi.gameStats = { totalDimainkan: 0, skorTertinggiGame: { nama: "-", skor: 0 } };
  }

  stateEdukasi.gameStats.totalDimainkan++;
  if (!stateEdukasi.gameStats[key]) {
    stateEdukasi.gameStats[key] = { kaliMain: 0, skorTertinggi: 0 };
  }
  stateEdukasi.gameStats[key].kaliMain++;
  if (skor > stateEdukasi.gameStats[key].skorTertinggi) {
    stateEdukasi.gameStats[key].skorTertinggi = skor;
  }

  if (skor > (stateEdukasi.gameStats.skorTertinggiGame?.skor || 0)) {
    stateEdukasi.gameStats.skorTertinggiGame = { nama, skor };
  }

  simpanProgresEdukasi(appState);
  renderRingkasanProgresCepat(appState);
}

/**
 * Helper membuka GERAK AI dengan pesan awal terarah
 */
function bukaAITerarah(pesanAwal, seksiId = "edukasi") {
  const dialogAI = document.getElementById("dialogAsistenAI");
  const inputAI = document.getElementById("inputPesanPenggunaAI");
  const formAI = document.getElementById("formObrolanAI");

  if (dialogAI && typeof dialogAI.showModal === "function") {
    if (!dialogAI.open) dialogAI.showModal();
  }

  if (inputAI) {
    inputAI.value = pesanAwal;
    inputAI.focus();
    if (formAI) {
      setTimeout(() => {
        formAI.requestSubmit ? formAI.requestSubmit() : formAI.dispatchEvent(new Event("submit"));
      }, 100);
    }
  }
}

/**
 * Setup modal close event listeners
 */
function inisialisasiEventModal(appState) {
  document.querySelectorAll("[data-tutup]").forEach((btn) => {
    btn.onclick = () => {
      const dialog = btn.closest("dialog");
      if (dialog) dialog.close();
    };
  });
}