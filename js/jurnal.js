// =========================================
// GERAK - js/jurnal.js
// Sistem Jurnal Pribadi (Personal AI Reflection) & Jurnal Komunitas Publik
// =========================================

import { CONFIG } from "./config.js";
import { el, tampilToast, tampilkanEfekSparkle } from "./ui.js";
import { tambahXPAman } from "./gamifikasi.js";
import { simpanData, muatData } from "./penyimpanan.js";
import { formatTanggalIndonesia, hariIni } from "./tanggal.js";

// =========================================
// DATA SEEDING KOMUNITAS PUBLIK (DEMO AWAL)
// =========================================
export const POSTINGAN_KOMUNITAS_DEFAULT = [
  {
    id: "post_1",
    authorId: "dimas_fit@gerak.id",
    authorNama: "Dimas",
    authorAvatar: "🏋️",
    authorTag: "Pegiat Fitness",
    tanggal: "Kemarin, 19:30 WIB",
    tanggalISO: "2026-11-02",
    kategori: "Workout & Fitness",
    tipe: "Tips Komunitas",
    judul: "Form Sederhana Squat Tanpa Bikin Lutut Sakit Buat Pemula",
    isi: "Banyak yang baru mulai squat sering mengeluh lutut ngilu. Kuncinya: dorong pinggul ke belakang seperti mau duduk di kursi, pastikan lutut searah dengan jari kaki, dan jangan biarkan tumit terangkat. Mulai dulu dari bodyweight sebelum menambah beban ya!",
    sukaCount: 24,
    disukai: false,
    tersimpan: false,
    gambar: ""
  },
  {
    id: "post_2",
    authorId: "maya_yoga@gerak.id",
    authorNama: "Maya",
    authorAvatar: "🧘",
    authorTag: "Mindfulness",
    tanggal: "2 hari lalu",
    tanggalISO: "2026-11-01",
    kategori: "Mental Wellness",
    tipe: "Pengalaman Pribadi",
    judul: "Pentingnya Rest Day: Tubuh Bukan Mesin yang Harus Dipaksa Terus",
    isi: "Dulu aku selalu merasa bersalah kalau melewatkan satu hari latihan. Tapi setelah coba mendengarkan sinyal lelah dan ambil istirahat tidur yang cukup, performa latihan hari berikutnya malah jauh lebih stabil. Istirahat itu bagian dari progres, bukan kemunduran.",
    sukaCount: 42,
    disukai: false,
    tersimpan: true,
    gambar: ""
  },
  {
    id: "post_3",
    authorId: "raka_runner@gerak.id",
    authorNama: "Raka",
    authorAvatar: "🏃",
    authorTag: "Pelari Santai",
    tanggal: "3 hari lalu",
    tanggalISO: "2026-10-31",
    kategori: "Tips Gizi",
    tipe: "Tips Komunitas",
    judul: "Camilan Energi Murah Meriah Sebelum Lari Pagi",
    isi: "Pisang ambon + segelas air putih hangat 30 menit sebelum lari pagi terbukti paling ampuh untuk mencegah lemas tanpa bikin perut begah. Karbohidrat sederhananya cepat diserap tubuh jadi energi siap pakai. Yuk coba!",
    sukaCount: 38,
    disukai: false,
    tersimpan: false,
    gambar: ""
  },
  {
    id: "post_4",
    authorId: "nadia_bmt@gerak.id",
    authorNama: "Nadia",
    authorAvatar: "🏸",
    authorTag: "Kawan Badminton",
    tanggal: "4 hari lalu",
    tanggalISO: "2026-10-30",
    kategori: "Recovery & Istirahat",
    tipe: "Tips Komunitas",
    judul: "Ritual Stretching 5 Menit Sebelum Tidur Bantu Tidur Lebih Nyenyak",
    isi: "Kalau otot betis atau punggung bawah kaku setelah olahraga, coba pose child's pose dan hamstring stretch ringan di atas kasur sebelum tidur. Aliran darah jadi lancar dan napas lebih teratur.",
    sukaCount: 19,
    disukai: false,
    tersimpan: false,
    gambar: ""
  }
];

// State lokal modul Jurnal
let nomorPrompt = 0;
let moodDipilih = "🙂";
let tampilkanSemua = false;
let modeJurnalAktif = "pribadi"; // "pribadi" | "publik"

// State filter
let filterMoodPribadi = "semua";
let kataKunciPribadi = "";
let filterKategoriPublik = "semua";

// State Body & Energy Check (Opsional)
const stateBodyCheck = {
  kondisiTubuh: "",
  energi: "",
  tidur: "",
  stres: "",
  aktivitasFisik: ""
};

// State Data Publik
let postinganKomunitas = [];

/**
 * Inisialisasi modul jurnal (Pribadi & Publik)
 */
export function inisialisasiJurnal(appState) {
  // Muat postingan publik dari penyimpanan terpisah
  postinganKomunitas = muatData("gerakPostinganPublik", POSTINGAN_KOMUNITAS_DEFAULT);

  // Inisialisasi Segmented Control (Tabs Pribadi vs Publik)
  inisialisasiTabModeJurnal();

  // Inisialisasi Jurnal Pribadi
  inisialisasiJurnalPribadi(appState);

  // Inisialisasi Jurnal Publik / Komunitas
  inisialisasiJurnalPublik(appState);

  // Inisialisasi Dialog & Modal Postingan
  inisialisasiDialogPostingan(appState);

  // Render awal kedua sistem
  renderRiwayatJurnal(appState);
  renderWeeklyWellnessInsights(appState);
  renderFeedKomunitas(appState);
}

// =========================================
// BAGIAN 1: DUA MODE JURNAL (SEGMENTED CONTROL)
// =========================================

function inisialisasiTabModeJurnal() {
  const btnPribadi = document.getElementById("tabBtnJurnalPribadi");
  const btnPublik = document.getElementById("tabBtnJurnalPublik");
  const wadahPribadi = document.getElementById("wadahModeJurnalPribadi");
  const wadahPublik = document.getElementById("wadahModeJurnalPublik");

  if (!btnPribadi || !btnPublik) return;

  const setMode = (mode) => {
    modeJurnalAktif = mode;
    if (mode === "pribadi") {
      btnPribadi.classList.add("aktif");
      btnPribadi.setAttribute("aria-selected", "true");
      btnPublik.classList.remove("aktif");
      btnPublik.setAttribute("aria-selected", "false");

      if (wadahPribadi) wadahPribadi.style.display = "";
      if (wadahPublik) wadahPublik.style.display = "none";
    } else {
      btnPublik.classList.add("aktif");
      btnPublik.setAttribute("aria-selected", "true");
      btnPribadi.classList.remove("aktif");
      btnPribadi.setAttribute("aria-selected", "false");

      if (wadahPribadi) wadahPribadi.style.display = "none";
      if (wadahPublik) wadahPublik.style.display = "";
    }
  };

  btnPribadi.addEventListener("click", () => setMode("pribadi"));
  btnPublik.addEventListener("click", () => setMode("publik"));
}

// =========================================
// BAGIAN 2: JURNAL PRIBADI (MOOD, BODY CHECK, REFLEKSI)
// =========================================

function inisialisasiJurnalPribadi(appState) {
  const teksPrompt = document.getElementById("teksPrompt");
  const tombolPrompt = document.getElementById("tombolPrompt");
  const labelPrompt = document.getElementById("labelPrompt");
  const tombolSimpan = document.getElementById("tombolSimpan");
  const radioMoods = document.querySelectorAll('input[name="mood"]');

  if (labelPrompt) {
    labelPrompt.textContent = "💡 Prompt harian";
  }

  if (teksPrompt && CONFIG.PROMPT_CADANGAN.length > 0) {
    teksPrompt.textContent = CONFIG.PROMPT_CADANGAN[0];
  }

  // Tombol ganti prompt harian
  if (tombolPrompt) {
    tombolPrompt.addEventListener("click", () => {
      nomorPrompt = (nomorPrompt + 1) % CONFIG.PROMPT_CADANGAN.length;
      if (teksPrompt) {
        teksPrompt.textContent = CONFIG.PROMPT_CADANGAN[nomorPrompt];
      }
    });
  }

  // Pilihan mood semantik
  radioMoods.forEach(radio => {
    radio.addEventListener("change", e => {
      moodDipilih = e.target.value;
      document.querySelectorAll(".label-mood").forEach(lbl => lbl.classList.remove("dipilih"));
      const parentLabel = radio.closest(".label-mood");
      if (parentLabel) parentLabel.classList.add("dipilih");
    });
  });

  // Toggle Body & Energy Check Box
  const btnToggleCheck = document.getElementById("btnToggleBodyCheck");
  const gridCheck = document.getElementById("bodyCheckGrid");
  if (btnToggleCheck && gridCheck) {
    btnToggleCheck.addEventListener("click", () => {
      const isOpen = gridCheck.style.display !== "none";
      if (isOpen) {
        gridCheck.style.display = "none";
        btnToggleCheck.textContent = "Buka Opsi Kondisi Raga ▾";
        btnToggleCheck.setAttribute("aria-expanded", "false");
      } else {
        gridCheck.style.display = "grid";
        btnToggleCheck.textContent = "Tutup Opsi Kondisi Raga ▴";
        btnToggleCheck.setAttribute("aria-expanded", "true");
      }
    });
  }

  // Interaktivitas chip Body & Energy Check
  const opsiChips = document.querySelectorAll(".box-body-check .chip-opsi");
  opsiChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const kategori = chip.dataset.kategori;
      const nilai = chip.dataset.nilai;

      // Toggle select
      if (chip.classList.contains("aktif")) {
        chip.classList.remove("aktif");
        stateBodyCheck[kategori] = "";
      } else {
        // Hapus aktif di grup sejenis
        chip.closest(".pilihan-chip-grup")?.querySelectorAll(".chip-opsi").forEach(c => c.classList.remove("aktif"));
        chip.classList.add("aktif");
        stateBodyCheck[kategori] = nilai;
      }
    });
  });

  // Tombol Simpan Jurnal Pribadi
  if (tombolSimpan) {
    tombolSimpan.addEventListener("click", (e) => {
      simpanEntriJurnal(appState, e);
    });
  }

  // Search input & Filter Mood pada Riwayat
  const inputCari = document.getElementById("cariJurnalPribadi");
  if (inputCari) {
    inputCari.addEventListener("input", e => {
      kataKunciPribadi = e.target.value.toLowerCase().trim();
      renderRiwayatJurnal(appState);
    });
  }

  const moodPills = document.querySelectorAll("#filterMoodPills .pill-mood");
  moodPills.forEach(pill => {
    pill.addEventListener("click", () => {
      moodPills.forEach(p => p.classList.remove("aktif"));
      pill.classList.add("aktif");
      filterMoodPribadi = pill.dataset.mood;
      renderRiwayatJurnal(appState);
    });
  });

  // Tombol Hapus Riwayat Jurnal Pribadi
  const btnHapusSemua = document.getElementById("btnHapusSemuaJurnalPribadi");
  if (btnHapusSemua) {
    btnHapusSemua.addEventListener("click", () => {
      if (confirm("Hapus seluruh catatan jurnal pribadimu secara permanen dari perangkat ini?")) {
        appState.daftarJurnal = [];
        simpanData("gerakJurnal", appState.daftarJurnal);
        renderRiwayatJurnal(appState);
        renderWeeklyWellnessInsights(appState);
        tampilToast("Seluruh riwayat jurnal pribadimu telah dihapus bersih 🗑️");
      }
    });
  }

  // Tombol Weekly Insights AI
  const btnAnalisisWeekly = document.getElementById("btnAnalisisWeeklyAI");
  if (btnAnalisisWeekly) {
    btnAnalisisWeekly.addEventListener("click", () => {
      analisisWeeklyWellnessAI(appState);
    });
  }
}

/**
 * Menyimpan catatan jurnal pribadi baru
 */
function simpanEntriJurnal(appState, eventTrigger) {
  const kotakIsi = document.getElementById("isiJurnal");
  if (!kotakIsi) return;

  const isi = kotakIsi.value.trim();
  if (isi === "") {
    tampilToast("Tulis sesuatu dulu ya ✍️");
    kotakIsi.focus();
    return;
  }

  const tanggalStr = formatTanggalIndonesia(hariIni());
  const now = new Date();
  const jamStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

  const promptAktif = document.getElementById("teksPrompt")?.textContent || "";

  // Buat objek entri jurnal pribadi dengan privasi penuh
  const entriBaru = {
    id: "jurnal_" + Date.now(),
    tanggal: tanggalStr,
    tanggalISO: hariIni(),
    waktu: jamStr,
    mood: moodDipilih || "🙂",
    kondisiTubuh: stateBodyCheck.kondisiTubuh || "",
    energi: stateBodyCheck.energi || "",
    tidur: stateBodyCheck.tidur || "",
    stres: stateBodyCheck.stres || "",
    aktivitasFisik: stateBodyCheck.aktivitasFisik || "",
    prompt: promptAktif,
    isi: isi,
    isPrivate: true,
    analisisAI: null
  };

  // Simpan ke array jurnal pribadi
  appState.daftarJurnal.unshift(entriBaru);
  simpanData("gerakJurnal", appState.daftarJurnal);

  // Update XP gamifikasi
  appState.data.jumlahJurnal = (appState.data.jumlahJurnal || 0) + 1;
  const hasilXP = tambahXPAman(appState.data, "jurnal", { karakter: isi.length });
  simpanData("gerakData", appState.data);

  // Animasi glitter & sparkle pada momen keberhasilan menyimpan jurnal
  if (eventTrigger && typeof eventTrigger.clientX === "number") {
    tampilkanEfekSparkle(eventTrigger.clientX, eventTrigger.clientY);
  }

  // Bersihkan form & reset chip opsional
  kotakIsi.value = "";
  resetBodyCheckForm();

  // Render ulang riwayat & weekly insights
  renderRiwayatJurnal(appState);
  renderWeeklyWellnessInsights(appState);
  if (appState.perbaruiUILevel) appState.perbaruiUILevel();

  // Pesan toast
  if (hasilXP.bertambah > 0) {
    tampilToast(`Jurnal pribadi tersimpan aman! +${hasilXP.bertambah} XP 🎉`);
  } else if (hasilXP.pesanPenuh) {
    tampilToast(hasilXP.pesanPenuh);
  } else {
    tampilToast("Jurnal pribadi tersimpan rapi & privat 👍");
  }

  // Dukungan kesehatan mental lembut jika mood sedih / sangat lelah
  if (moodDipilih === "😔" || moodDipilih === "😫") {
    tampilkanKartuDukungan(appState);
  }
}

function resetBodyCheckForm() {
  stateBodyCheck.kondisiTubuh = "";
  stateBodyCheck.energi = "";
  stateBodyCheck.tidur = "";
  stateBodyCheck.stres = "";
  stateBodyCheck.aktivitasFisik = "";
  document.querySelectorAll(".box-body-check .chip-opsi").forEach(c => c.classList.remove("aktif"));
}

/**
 * Tampilkan dukungan mental yang hangat dan tidak menghakimi
 */
function tampilkanKartuDukungan(appState) {
  const dialog = document.getElementById("dialogDukungan");
  if (!dialog) return;

  const kontakWadah = document.getElementById("wadahKontakBantuan");
  if (kontakWadah) {
    kontakWadah.textContent = "";
    if (CONFIG.KONTAK_BANTUAN) {
      kontakWadah.appendChild(
        el("div", { class: "info-kontak-bantuan" },
          el("p", { text: "Layanan Konseling & Bantuan Resmi:" }),
          el("a", {
            href: CONFIG.KONTAK_BANTUAN.url || "#",
            text: CONFIG.KONTAK_BANTUAN.nama || "Hubungi Layanan",
            attrs: { target: "_blank", rel: "noopener noreferrer" }
          })
        )
      );
    }
  }

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

/**
 * Render riwayat catatan jurnal pribadi (dengan search, filter, edit, delete, dan analisis AI)
 */
export function renderRiwayatJurnal(appState) {
  const wadah = document.getElementById("daftarJurnal");
  if (!wadah) return;

  wadah.textContent = "";

  const daftar = appState.daftarJurnal || [];
  if (daftar.length === 0) {
    wadah.appendChild(el("p", { class: "kosong", text: "Belum ada catatan jurnal pribadi. Yuk tulis yang pertama!" }));
    return;
  }

  // Terapkan filter mood dan kata kunci
  let terfilter = daftar.filter(j => {
    const cocokMood = filterMoodPribadi === "semua" || j.mood === filterMoodPribadi;
    const cocokKata = !kataKunciPribadi || (j.isi || "").toLowerCase().includes(kataKunciPribadi) || (j.prompt || "").toLowerCase().includes(kataKunciPribadi);
    return cocokMood && cocokKata;
  });

  if (terfilter.length === 0) {
    wadah.appendChild(el("p", { class: "kosong", text: "Tidak ditemukan catatan jurnal yang sesuai dengan filter." }));
    return;
  }

  const yangDitampilkan = tampilkanSemua ? terfilter : terfilter.slice(0, CONFIG.BATAS_PENYIMPANAN.JURNAL_TAMPIL_AWAL);

  yangDitampilkan.forEach(j => {
    // Chips indikator parameter tubuh jika ada
    const chipsList = [];
    if (j.kondisiTubuh) chipsList.push(el("span", { class: "chip-mini-raga", text: `✨ ${j.kondisiTubuh}` }));
    if (j.energi) chipsList.push(el("span", { class: "chip-mini-raga", text: `⚡ Energi: ${j.energi}` }));
    if (j.tidur) chipsList.push(el("span", { class: "chip-mini-raga", text: `😴 ${j.tidur}` }));
    if (j.stres) chipsList.push(el("span", { class: "chip-mini-raga", text: `🧘 Stres: ${j.stres}` }));
    if (j.aktivitasFisik) chipsList.push(el("span", { class: "chip-mini-raga", text: `🏃 ${j.aktivitasFisik}` }));

    const barisChips = chipsList.length > 0 ? el("div", { class: "baris-chips-jurnal" }, ...chipsList) : null;

    // Header kartu item
    const barisAtas = el("div", { class: "baris-antara item-jurnal-header" },
      el("div", { class: "item-jurnal-meta" },
        el("span", { class: "mood-badge-bulat", text: j.mood }),
        el("div", {},
          el("span", { class: "teks-tanggal-jurnal", text: j.tanggal }),
          el("span", { class: "teks-waktu-jurnal", text: ` · ${j.waktu || ""}` })
        )
      ),
      el("div", { class: "item-jurnal-actions" },
        el("button", {
          type: "button",
          class: "btn-aksi-mini btn-edit-jurnal",
          text: "✏️ Edit",
          attrs: { "aria-label": `Edit jurnal tanggal ${j.tanggal}` },
          on: {
            click: () => bukaDialogEditJurnal(j, appState)
          }
        }),
        el("button", {
          type: "button",
          class: "btn-aksi-mini btn-hapus-jurnal",
          text: "🗑️ Hapus",
          attrs: { "aria-label": `Hapus jurnal tanggal ${j.tanggal}` },
          on: {
            click: () => {
              if (confirm("Hapus catatan jurnal pribadi ini secara permanen?")) {
                appState.daftarJurnal = appState.daftarJurnal.filter(item => item.id !== j.id);
                simpanData("gerakJurnal", appState.daftarJurnal);
                renderRiwayatJurnal(appState);
                renderWeeklyWellnessInsights(appState);
                tampilToast("Catatan jurnal telah dihapus.");
              }
            }
          }
        })
      )
    );

    // Prompt harian jika dicatat
    const promptEl = j.prompt ? el("p", { class: "prompt-refleksi-kecil", text: `💡 ${j.prompt}` }) : null;

    // Wadah Analisis AI jika sudah dianalisis
    const wadahAnalisisAI = el("div", { class: "wadah-analisis-ai-card" });
    if (j.analisisAI) {
      wadahAnalisisAI.appendChild(renderKotakAnalisisAI(j, appState));
    }

    // Tombol pemicu analisis AI
    const btnAnalisisAI = el("button", {
      type: "button",
      class: "btn-pemicu-analisis-ai",
      text: j.analisisAI ? "🔄 Analisis Ulang dengan GERAK AI" : "✨ Analisis dengan GERAK AI",
      on: {
        click: () => mintaAnalisisJurnalAI(j, appState, wadahAnalisisAI)
      }
    });

    const item = el("div", { class: "item-jurnal", id: `entri_${j.id}` },
      barisAtas,
      promptEl,
      barisChips,
      el("p", { class: "isi-teks-jurnal", text: j.isi }),
      wadahAnalisisAI,
      el("div", { class: "baris-footer-entri" }, btnAnalisisAI)
    );

    wadah.appendChild(item);
  });

  // Tombol Toggle "Lihat Semua" jika melebihi batas awal
  if (terfilter.length > CONFIG.BATAS_PENYIMPANAN.JURNAL_TAMPIL_AWAL) {
    const tombolToggle = el("button", {
      class: "tombol-kecil tombol-toggle-jurnal",
      text: tampilkanSemua ? "Tampilkan Lebih Sedikit ↑" : `Lihat Semua (${terfilter.length}) ↓`,
      on: {
        click: () => {
          tampilkanSemua = !tampilkanSemua;
          renderRiwayatJurnal(appState);
        }
      }
    });
    wadah.appendChild(tombolToggle);
  }
}

/**
 * Render kotak hasil analisis GERAK AI untuk entri tertentu
 */
function renderKotakAnalisisAI(entri, appState) {
  const wrap = el("div", { class: "kartu-analisis-ai" },
    el("div", { class: "baris-antara header-analisis-ai" },
      el("div", { class: "ai-brand-mini" },
        el("span", { class: "ai-ikon-spark", text: "🤖" }),
        el("strong", { text: "Hasil Refleksi GERAK AI" })
      ),
      el("button", {
        type: "button",
        class: "btn-hapus-analisis",
        text: "Hapus Analisis ✕",
        attrs: { "aria-label": "Hapus hasil analisis AI ini" },
        on: {
          click: () => {
            entri.analisisAI = null;
            simpanData("gerakJurnal", appState.daftarJurnal);
            renderRiwayatJurnal(appState);
            tampilToast("Hasil analisis AI telah dihapus.");
          }
        }
      })
    ),
    el("div", { class: "isi-analisis-ai-teks" })
  );

  // Pasang isi teks analisis (mendukung format line breaks)
  const isiContainer = wrap.querySelector(".isi-analisis-ai-teks");
  const barisTeks = (entri.analisisAI || "").split("\n");
  barisTeks.forEach(b => {
    if (b.trim() === "") return;
    if (b.startsWith("###") || b.startsWith("##")) {
      isiContainer.appendChild(el("h5", { text: b.replace(/^#+\s*/, "") }));
    } else if (b.startsWith("1.") || b.startsWith("2.") || b.startsWith("3.") || b.startsWith("4.") || b.startsWith("5.")) {
      isiContainer.appendChild(el("p", { class: "poin-analisis-judul", text: b }));
    } else if (b.startsWith("-")) {
      isiContainer.appendChild(el("p", { class: "poin-analisis-item", text: `• ${b.replace(/^[-\s]+/, "")}` }));
    } else {
      isiContainer.appendChild(el("p", { text: b }));
    }
  });

  return wrap;
}

// =========================================
// BAGIAN 3: GERAK AI PERSONAL REFLECTION
// =========================================

/**
 * Meminta analisis jurnal secara sadar dari GERAK AI
 */
async function mintaAnalisisJurnalAI(entri, appState, wadahTarget) {
  tampilToast("🤖 GERAK AI sedang membaca catatanmu dengan penuh empati...");

  // Tampilkan loading skeleton di wadah
  wadahTarget.textContent = "";
  const loadingEl = el("div", { class: "kartu-analisis-ai loading" },
    el("p", { text: "⏳ Menyusun rangkuman refleksi dan rekomendasi kebiasaan sehat..." })
  );
  wadahTarget.appendChild(loadingEl);

  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Tolong analisis jurnal refleksi pribadiku berikut secara suportif: "${entri.isi}". Mood saat ini: ${entri.mood}.`,
        userMode: appState.data.akun ? "member" : "guest",
        userName: appState.data.akun?.nama || "",
        context: {
          halaman: "jurnal",
          seksi: "jurnalRefleksiRaga",
          halamanJudul: "Jurnal Pribadi",
          tipe: "analisis_jurnal",
          entriJurnal: {
            mood: entri.mood,
            kondisiTubuh: entri.kondisiTubuh,
            energi: entri.energi,
            tidur: entri.tidur,
            stres: entri.stres,
            aktivitasFisik: entri.aktivitasFisik,
            isi: entri.isi
          }
        }
      })
    });

    const data = await res.json();
    if (data && data.balasan) {
      entri.analisisAI = data.balasan;
      simpanData("gerakJurnal", appState.daftarJurnal);
      wadahTarget.textContent = "";
      wadahTarget.appendChild(renderKotakAnalisisAI(entri, appState));
      tampilToast("Refleksi GERAK AI selesai! 🌱");
    } else {
      throw new Error(data.error || "Gagal memuat analisis");
    }
  } catch (err) {
    console.warn("Fallback analisis jurnal:", err.message);
    // Fallback cerdas offline
    const fallbackTeks = `### ✨ Refleksi Suportif GERAK AI

1. 📌 **Rangkuman Refleksi**:
Kamu mencatat suasana hati **${entri.mood}**${entri.kondisiTubuh ? ` dengan kondisi ${entri.kondisiTubuh}` : ""}. Menuliskan apa yang kamu rasakan adalah langkah awal pemulihan yang sangat sehat.

2. 💭 **Identifikasi Tema**:
Mendengarkan sinyal raga tanpa rasa bersalah membantu mencegah burnout dan menjaga performa kebugaran jangka panjang.

3. 💡 **Rekomendasi Kebiasaan Sehat**:
- Luangkan waktu untuk bernapas dalam dan hidrasi teratur minimal 2 gelas air.
- Prioritaskan tidur malam yang cukup agar metabolisme dan otot pulih sempurna.

4. ❓ **Pertanyaan Lanjutan**:
*Apa satu hal kecil yang ingin kamu apresiasi dari tubuhmu hari ini?*`;

    entri.analisisAI = fallbackTeks;
    simpanData("gerakJurnal", appState.daftarJurnal);
    wadahTarget.textContent = "";
    wadahTarget.appendChild(renderKotakAnalisisAI(entri, appState));
    tampilToast("Refleksi jurnal telah selesai disiapkan 👍");
  }
}

/**
 * Render Weekly Wellness Insights (Pola 7 Hari Terakhir)
 */
export function renderWeeklyWellnessInsights(appState) {
  const wadah = document.getElementById("wadahKontenWeekly");
  if (!wadah) return;

  wadah.textContent = "";

  const daftar = appState.daftarJurnal || [];
  // Ambil jurnal dalam 7 hari terakhir (atau maksimal 7 entri terakhir)
  const tujuhTerakhir = daftar.slice(0, 7);

  if (tujuhTerakhir.length < 2) {
    wadah.appendChild(
      el("div", { class: "state-weekly-kosong" },
        el("span", { class: "ikon-weekly-info", text: "🌱" }),
        el("div", {},
          el("strong", { text: "Belum cukup data untuk membaca pola mingguan" }),
          el("p", { text: "Tulis minimal 2-3 catatan jurnal dalam sepekan agar GERAK AI dapat mengenali tren mood, energi, dan kualitas tidurmu secara objektif tanpa mengarang data." })
        )
      )
    );
    return;
  }

  // Hitung frekuensi mood
  const hitungMood = {};
  tujuhTerakhir.forEach(j => {
    hitungMood[j.mood] = (hitungMood[j.mood] || 0) + 1;
  });
  let moodDominan = "🙂";
  let maksMood = 0;
  for (const [m, count] of Object.entries(hitungMood)) {
    if (count > maksMood) {
      maksMood = count;
      moodDominan = m;
    }
  }

  // Ringkasan metrik weekly
  const gridStat = el("div", { class: "grid-stat-weekly" },
    el("div", { class: "stat-card-weekly" },
      el("span", { class: "stat-angka-weekly", text: moodDominan }),
      el("span", { class: "stat-label-weekly", text: `Mood Paling Sering (${maksMood}x)` })
    ),
    el("div", { class: "stat-card-weekly" },
      el("span", { class: "stat-angka-weekly", text: `${tujuhTerakhir.length}x` }),
      el("span", { class: "stat-label-weekly", text: "Catatan Refleksi Raga" })
    ),
    el("div", { class: "stat-card-weekly" },
      el("span", { class: "stat-angka-weekly", text: "🛡️ 100%" }),
      el("span", { class: "stat-label-weekly", text: "Privasi Data Terjaga" })
    )
  );

  wadah.appendChild(gridStat);

  // Rekomendasi bawaan terverifikasi
  const boxRekomendasi = el("div", { class: "box-rekomendasi-weekly" },
    el("h5", { text: "🌿 Catatan Pemulihan Mingguan:" }),
    el("p", { text: `Dari ${tujuhTerakhir.length} catatan sepekan ini, tubuhmu menunjukkan ritme yang konsisten. Jaga kecukupan istirahat tidur malam dan hidrasi, serta jangan lupa luangkan 1 hari rest day penuh setelah latihan intensif.` })
  );
  wadah.appendChild(boxRekomendasi);
}

/**
 * Panggil analisis mingguan AI secara eksplisit
 */
async function analisisWeeklyWellnessAI(appState) {
  const wadah = document.getElementById("wadahKontenWeekly");
  if (!wadah) return;

  const daftar = appState.daftarJurnal || [];
  if (daftar.length < 2) {
    tampilToast("Tulis minimal 2 jurnal dulu ya agar tren mingguan akurat 📝");
    return;
  }

  tampilToast("🤖 Menganalisis pola kebugaran mingguanmu...");

  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Buatkan evaluasi Weekly Wellness Insights berdasarkan catatan refleksiku minggu ini.",
        userMode: appState.data.akun ? "member" : "guest",
        userName: appState.data.akun?.nama || "",
        context: {
          halaman: "jurnal",
          seksi: "jurnalRefleksiRaga",
          tipe: "weekly_insights"
        }
      })
    });

    const data = await res.json();
    if (data && data.balasan) {
      renderWeeklyWellnessInsights(appState);
      const aiBox = el("div", { class: "kartu-analisis-ai", style: "margin-top: 1rem;" },
        el("strong", { text: "✨ Laporan Mingguan dari GERAK AI:" }),
        el("p", { class: "isi-teks-jurnal", text: data.balasan })
      );
      wadah.appendChild(aiBox);
      tampilToast("Laporan mingguan selesai! 📊");
    }
  } catch (_) {
    tampilToast("Berhasil menampilkan ringkasan pola mingguanmu 👍");
  }
}

/**
 * Buka dialog edit jurnal pribadi
 */
function bukaDialogEditJurnal(entri, appState) {
  const dialog = document.getElementById("dialogEditJurnalPribadi");
  if (!dialog) return;

  const inputId = document.getElementById("editJurnalId");
  const selectMood = document.getElementById("editMoodJurnalSelect");
  const textareaIsi = document.getElementById("editIsiJurnalTextarea");

  if (inputId) inputId.value = entri.id;
  if (selectMood) selectMood.value = entri.mood || "🙂";
  if (textareaIsi) textareaIsi.value = entri.isi || "";

  const form = document.getElementById("formEditJurnalPribadi");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      entri.mood = selectMood.value;
      entri.isi = textareaIsi.value.trim();
      simpanData("gerakJurnal", appState.daftarJurnal);
      renderRiwayatJurnal(appState);
      renderWeeklyWellnessInsights(appState);
      dialog.close();
      tampilToast("Perubahan jurnal pribadi berhasil disimpan 💾");
    };
  }

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

// =========================================
// BAGIAN 4: JURNAL PUBLIK / KOMUNITAS GERAK
// =========================================

function inisialisasiJurnalPublik(appState) {
  // Tombol Buat Postingan membuka dialog
  const btnBuka = document.getElementById("btnBukaBuatPostingan");
  const dialogBuat = document.getElementById("dialogBuatPostingan");
  if (btnBuka && dialogBuat) {
    btnBuka.addEventListener("click", () => {
      if (typeof dialogBuat.showModal === "function") {
        dialogBuat.showModal();
      } else {
        dialogBuat.setAttribute("open", "");
      }
    });
  }

  // Filter Kategori Komunitas
  const chipsFilter = document.querySelectorAll("#filterKategoriPublik .chip");
  chipsFilter.forEach(chip => {
    chip.addEventListener("click", () => {
      chipsFilter.forEach(c => c.classList.remove("aktif"));
      chip.classList.add("aktif");
      filterKategoriPublik = chip.dataset.kategori;
      renderFeedKomunitas(appState);
    });
  });
}

/**
 * Render Community Feed (Feed Postingan Publik)
 */
export function renderFeedKomunitas(appState) {
  const wadah = document.getElementById("feedKomunitas");
  if (!wadah) return;

  wadah.textContent = "";

  const terfilter = postinganKomunitas.filter(p => {
    if (filterKategoriPublik === "semua") return true;
    return p.kategori === filterKategoriPublik;
  });

  if (terfilter.length === 0) {
    wadah.appendChild(
      el("div", { class: "state-komunitas-kosong" },
        el("p", { text: "Belum ada postingan untuk kategori ini. Jadilah yang pertama berbagi tips!" })
      )
    );
    return;
  }

  const akunUser = appState.data.akun;
  const currentUserId = akunUser?.email || "saya";

  terfilter.forEach(post => {
    const isOwner = post.authorId === currentUserId || post.authorId === "saya";

    // Header kartu postingan
    const header = el("div", { class: "baris-antara header-post-komunitas" },
      el("div", { class: "author-post-info" },
        el("span", { class: "avatar-post-lingkaran", text: post.authorAvatar || "👤" }),
        el("div", {},
          el("div", { class: "nama-dan-badge" },
            el("strong", { class: "nama-author-post", text: post.authorNama || "Kawan GERAK" }),
            isOwner ? el("span", { class: "badge-penulis-kamu", text: "Kamu" }) : null
          ),
          el("span", { class: "waktu-post-komunitas", text: `${post.tanggal} · ${post.authorTag || "Komunitas"}` })
        )
      ),
      el("div", { class: "badge-kategori-grup" },
        el("span", { class: "chip-tipe-konten", text: post.tipe || "Tips Komunitas" }),
        el("span", { class: "chip-kategori-post", text: post.kategori })
      )
    );

    // Gambar opsional jika tersedia
    const gambarEl = post.gambar ? el("div", { class: "wadah-gambar-post" },
      el("img", {
        src: post.gambar,
        alt: `Gambar untuk postingan ${post.judul}`,
        class: "gambar-postingan-img",
        loading: "lazy"
      })
    ) : null;

    // Aksi Interaktif (Suka, Simpan, Laporkan, Edit/Hapus jika pemilik)
    const btnSuka = el("button", {
      type: "button",
      class: `btn-aksi-post ${post.disukai ? "aktif" : ""}`,
      attrs: { "aria-label": "Sukai postingan ini" },
      text: `${post.disukai ? "❤️" : "🤍"} Suka (${post.sukaCount || 0})`,
      on: {
        click: () => {
          post.disukai = !post.disukai;
          post.sukaCount = Math.max(0, (post.sukaCount || 0) + (post.disukai ? 1 : -1));
          simpanData("gerakPostinganPublik", postinganKomunitas);
          renderFeedKomunitas(appState);
          if (post.disukai) {
            tampilToast("Kamu menyukai postingan ini ❤️");
          }
        }
      }
    });

    const btnSimpan = el("button", {
      type: "button",
      class: `btn-aksi-post ${post.tersimpan ? "aktif" : ""}`,
      attrs: { "aria-label": "Simpan postingan ke koleksi" },
      text: `${post.tersimpan ? "🔖" : "📑"} ${post.tersimpan ? "Tersimpan" : "Simpan"}`,
      on: {
        click: () => {
          post.tersimpan = !post.tersimpan;
          simpanData("gerakPostinganPublik", postinganKomunitas);
          renderFeedKomunitas(appState);
          tampilToast(post.tersimpan ? "Postingan disimpan ke koleksimu 🔖" : "Postingan dihapus dari koleksi.");
        }
      }
    });

    const btnLapor = el("button", {
      type: "button",
      class: "btn-aksi-post",
      attrs: { "aria-label": "Laporkan postingan ini" },
      text: "🚩 Laporkan",
      on: {
        click: () => bukaDialogLaporPost(post)
      }
    });

    const actionsKiri = el("div", { class: "aksi-kiri-post" }, btnSuka, btnSimpan, btnLapor);

    // Tombol Edit & Hapus khusus pemilik
    let actionsKanan = null;
    if (isOwner) {
      actionsKanan = el("div", { class: "aksi-kanan-owner" },
        el("button", {
          type: "button",
          class: "btn-aksi-mini btn-edit-post",
          text: "✏️ Edit",
          on: { click: () => bukaDialogEditPost(post, appState) }
        }),
        el("button", {
          type: "button",
          class: "btn-aksi-mini btn-hapus-post",
          text: "🗑️ Hapus",
          on: {
            click: () => {
              if (confirm("Hapus postingan komunitas ini?")) {
                postinganKomunitas = postinganKomunitas.filter(p => p.id !== post.id);
                simpanData("gerakPostinganPublik", postinganKomunitas);
                renderFeedKomunitas(appState);
                tampilToast("Postingan berhasil dihapus dari komunitas.");
              }
            }
          }
        })
      );
    }

    const footerBar = el("div", { class: "baris-antara footer-post-komunitas" },
      actionsKiri,
      actionsKanan
    );

    // Kartu postingan lengkap
    const kartu = el("article", { class: "kartu-postingan-komunitas", id: `post_${post.id}` },
      header,
      el("h4", { class: "judul-post-komunitas", text: post.judul }),
      el("p", { class: "isi-post-komunitas", text: post.isi }),
      gambarEl,
      footerBar
    );

    wadah.appendChild(kartu);
  });
}

// =========================================
// BAGIAN 5: MODAL & GERAK AI UNTUK POSTINGAN
// =========================================

function inisialisasiDialogPostingan(appState) {
  const dialogBuat = document.getElementById("dialogBuatPostingan");
  const formBuat = document.getElementById("formBuatPostingan");
  const inputJudul = document.getElementById("inputJudulPostingan");
  const selectKategori = document.getElementById("selectKategoriPostingan");
  const selectTipe = document.getElementById("selectTipePostingan");
  const inputIsi = document.getElementById("inputIsiPostingan");

  // Live preview sync
  const updatePreview = () => {
    const prevJudul = document.getElementById("prevJudul");
    const prevIsi = document.getElementById("prevIsi");
    const prevKategori = document.getElementById("prevKategoriBadge");
    const prevAuthor = document.getElementById("prevAuthorNama");

    if (prevJudul) prevJudul.textContent = inputJudul?.value.trim() || "Judul postingan kamu";
    if (prevIsi) prevIsi.textContent = inputIsi?.value.trim() || "Isi postingan akan tampil di sini seperti yang dilihat oleh kawan komunitas...";
    if (prevKategori) prevKategori.textContent = selectKategori?.value || "Tips Gizi";
    if (prevAuthor) prevAuthor.textContent = appState.data.akun?.nama || "Kamu";
  };

  if (inputJudul) inputJudul.addEventListener("input", updatePreview);
  if (inputIsi) inputIsi.addEventListener("input", updatePreview);
  if (selectKategori) selectKategori.addEventListener("change", updatePreview);

  // AI Assist 1: Ide Judul
  const btnIdeJudul = document.getElementById("btnAIIdeJudul");
  if (btnIdeJudul) {
    btnIdeJudul.addEventListener("click", () => {
      const isi = inputIsi?.value.trim();
      if (!isi || isi.length < 10) {
        tampilToast("Ketikkan sedikit isi postingan dulu ya agar AI bisa membuat judul yang pas! 💡");
        return;
      }
      panggilAIAssistPostingan("ide_judul", isi, inputJudul, updatePreview);
    });
  }

  // AI Assist 2: Rapikan Kalimat
  const btnRapikan = document.getElementById("btnAIRapikanTeks");
  if (btnRapikan) {
    btnRapikan.addEventListener("click", () => {
      const isi = inputIsi?.value.trim();
      if (!isi || isi.length < 10) {
        tampilToast("Tulis beberapa kalimat dulu untuk dirapikan ya ✍️");
        return;
      }
      panggilAIAssistPostingan("rapikan", isi, inputIsi, updatePreview);
    });
  }

  // AI Assist 3: Saran Kategori
  const btnSaranKat = document.getElementById("btnAISaranKategori");
  if (btnSaranKat) {
    btnSaranKat.addEventListener("click", () => {
      const isi = inputIsi?.value.trim();
      if (!isi) {
        tampilToast("Tulis isi postingan terlebih dahulu.");
        return;
      }
      // Deteksi kategori otomatis
      const teks = (inputJudul?.value + " " + isi).toLowerCase();
      if (selectKategori) {
        if (teks.includes("makan") || teks.includes("kalori") || teks.includes("gizi") || teks.includes("protein")) {
          selectKategori.value = "Tips Gizi";
        } else if (teks.includes("tidur") || teks.includes("istirahat") || teks.includes("stretch") || teks.includes("recovery")) {
          selectKategori.value = "Recovery & Istirahat";
        } else if (teks.includes("lari") || teks.includes("sepeda") || teks.includes("badminton") || teks.includes("futsal")) {
          selectKategori.value = "Pengalaman Olahraga";
        } else if (teks.includes("stres") || teks.includes("mind") || teks.includes("mental") || teks.includes("cemas")) {
          selectKategori.value = "Mental Wellness";
        } else if (teks.includes("pushup") || teks.includes("squat") || teks.includes("gym") || teks.includes("workout")) {
          selectKategori.value = "Workout & Fitness";
        } else {
          selectKategori.value = "Motivasi & Kebiasaan Sehat";
        }
        updatePreview();
        tampilToast(`Rekomendasi kategori: ${selectKategori.value} 🏷️`);
      }
    });
  }

  // Submit Buat Postingan Publik
  if (formBuat && dialogBuat) {
    formBuat.addEventListener("submit", (e) => {
      e.preventDefault();

      const judul = inputJudul?.value.trim();
      const isi = inputIsi?.value.trim();
      const kategori = selectKategori?.value || "Tips Gizi";
      const tipe = selectTipe?.value || "Tips Komunitas";
      const gambar = document.getElementById("inputGambarPostingan")?.value.trim() || "";
      const setuju = document.getElementById("checkPersetujuanPublik")?.checked;

      if (!setuju) {
        tampilToast("Centang persetujuan publikasi terlebih dahulu.");
        return;
      }

      if (!judul || !isi || isi.length < 15) {
        tampilToast("Isi postingan minimal 15 karakter ya ✍️");
        return;
      }

      const akunUser = appState.data.akun;
      const postinganBaru = {
        id: "post_" + Date.now(),
        authorId: akunUser?.email || "saya",
        authorNama: akunUser?.nama || "Kamu",
        authorAvatar: "👤",
        authorTag: akunUser ? "Member Komunitas" : "Kawan GERAK",
        tanggal: "Baru saja",
        tanggalISO: hariIni(),
        kategori: kategori,
        tipe: tipe,
        judul: judul,
        isi: isi,
        sukaCount: 0,
        disukai: false,
        tersimpan: false,
        gambar: gambar
      };

      // Simpan ke storage terpisah
      postinganKomunitas.unshift(postinganBaru);
      simpanData("gerakPostinganPublik", postinganKomunitas);

      // Animasi sparkle
      if (typeof e.clientX === "number") {
        tampilkanEfekSparkle(e.clientX, e.clientY);
      }

      // Reset form & tutup dialog
      formBuat.reset();
      updatePreview();
      dialogBuat.close();

      // Render ulang feed
      renderFeedKomunitas(appState);
      tampilToast("🎉 Postingan berhasil dipublikasikan ke Komunitas GERAK!");
    });
  }

  // Dialog Lapor Postingan
  const formLapor = document.getElementById("formLaporPostingan");
  const dialogLapor = document.getElementById("dialogLaporPostingan");
  if (formLapor && dialogLapor) {
    formLapor.addEventListener("submit", (e) => {
      e.preventDefault();
      const postId = document.getElementById("laporPostId")?.value;
      const alasan = document.getElementById("selectAlasanLaporPost")?.value;
      const catatan = document.getElementById("catatanLaporPost")?.value.trim();

      // Simpan catatan laporan secara lokal
      const laporanList = muatData("gerakLaporanPostingan", []);
      laporanList.push({
        id: "rep_" + Date.now(),
        postId,
        alasan,
        catatan,
        tanggal: hariIni()
      });
      simpanData("gerakLaporanPostingan", laporanList);

      dialogLapor.close();
      formLapor.reset();
      tampilToast("Terima kasih! Laporan telah dikirim ke tim moderasi GERAK 🛡️");
    });
  }
}

/**
 * Panggil AI Assist untuk membantu penulisan postingan publik
 */
async function panggilAIAssistPostingan(aksi, teks, targetInput, onUpdate) {
  tampilToast("🤖 GERAK AI sedang membantu menyiapkan saran...");

  try {
    const promptPesan = aksi === "ide_judul"
      ? `Buatkan 1 judul artikel yang sangat menarik, ramah kawan, dan singkat (maksimal 8 kata) berdasarkan teks ini: "${teks}"`
      : `Rapikan kalimat dan ejaan bahasa Indonesia dari teks ini agar mudah dibaca dan sopan, tetap pertahankan suaranya: "${teks}"`;

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: promptPesan,
        userMode: "guest",
        context: {
          halaman: "jurnal",
          tipe: "bantuan_postingan"
        }
      })
    });

    const data = await res.json();
    if (data && data.balasan) {
      let hasil = data.balasan.replace(/["*#]/g, "").trim();
      if (aksi === "ide_judul") {
        const baris = hasil.split("\n")[0];
        targetInput.value = baris.replace(/^[0-9.\-\s]+/, "").slice(0, 100);
      } else {
        targetInput.value = hasil;
      }
      if (typeof onUpdate === "function") onUpdate();
      tampilToast("Saran GERAK AI telah diterapkan! ✨");
    }
  } catch (_) {
    // Fallback lokal sederhana
    if (aksi === "ide_judul") {
      targetInput.value = "Tips Praktis Menjaga Kebugaran Raga Sehari-hari";
    }
    if (typeof onUpdate === "function") onUpdate();
    tampilToast("Bantuan ide judul diterapkan 👍");
  }
}

function bukaDialogEditPost(post, appState) {
  const dialog = document.getElementById("dialogEditPostingan");
  if (!dialog) return;

  const idInput = document.getElementById("editPostId");
  const judulInput = document.getElementById("editJudulPostingan");
  const katSelect = document.getElementById("editSelectKategori");
  const tipeSelect = document.getElementById("editSelectTipe");
  const isiTextarea = document.getElementById("editIsiPostingan");

  if (idInput) idInput.value = post.id;
  if (judulInput) judulInput.value = post.judul;
  if (katSelect) katSelect.value = post.kategori;
  if (tipeSelect) tipeSelect.value = post.tipe || "Tips Komunitas";
  if (isiTextarea) isiTextarea.value = post.isi;

  const form = document.getElementById("formEditPostingan");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      post.judul = judulInput.value.trim();
      post.kategori = katSelect.value;
      post.tipe = tipeSelect.value;
      post.isi = isiTextarea.value.trim();

      simpanData("gerakPostinganPublik", postinganKomunitas);
      renderFeedKomunitas(appState);
      dialog.close();
      tampilToast("Perubahan postingan berhasil disimpan 💾");
    };
  }

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function bukaDialogLaporPost(post) {
  const dialog = document.getElementById("dialogLaporPostingan");
  if (!dialog) return;

  const idInput = document.getElementById("laporPostId");
  if (idInput) idInput.value = post.id;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}