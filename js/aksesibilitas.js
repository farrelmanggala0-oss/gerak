// =========================================
// GERAK - js/aksesibilitas.js
// Aksesibilitas WCAG 2.2 AA: Tema, Kontras Tinggi, Skala Teks, TTS, Dialog Native
// =========================================

import { tampilToast } from "./ui.js";

const SKALA_LIST = [100, 115, 130, 150];
let indeksSkala = 0; // 0 = 100%, 1 = 115%, 2 = 130%, 3 = 150%

export function inisialisasiAksesibilitas() {
  inisialisasiTemaDanKontras();
  inisialisasiSkalaTeks();
  inisialisasiMenuMobile();
  inisialisasiBacaNyaring();
  inisialisasiDialogNative();
}

/**
 * Pengaturan Tema Gelap dan Kontras Tinggi
 */
function inisialisasiTemaDanKontras() {
  const tombolGelap = document.getElementById("tombolGelap");
  const tombolKontras = document.getElementById("tombolKontras");

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersHighContrast = window.matchMedia && window.matchMedia("(prefers-contrast: more)").matches;

  const simpanGelap = localStorage.getItem("gerakGelap");
  const simpanKontras = localStorage.getItem("gerakKontras");

  // Terapkan preferensi tema
  if (simpanGelap === "ya" || (simpanGelap === null && prefersDark)) {
    document.body.classList.add("gelap");
    if (tombolGelap) {
      tombolGelap.textContent = "☀️";
      tombolGelap.setAttribute("aria-pressed", "true");
    }
  }

  // Terapkan preferensi kontras
  if (simpanKontras === "ya" || (simpanKontras === null && prefersHighContrast)) {
    document.body.classList.add("kontras");
    if (tombolKontras) {
      tombolKontras.setAttribute("aria-pressed", "true");
    }
  }

  // Listener Tombol Mode Gelap
  if (tombolGelap) {
    tombolGelap.addEventListener("click", () => {
      document.body.classList.toggle("gelap");
      const aktif = document.body.classList.contains("gelap");
      tombolGelap.textContent = aktif ? "☀️" : "🌙";
      tombolGelap.setAttribute("aria-pressed", aktif ? "true" : "false");
      try {
        localStorage.setItem("gerakGelap", aktif ? "ya" : "tidak");
      } catch (e) {
        // Abaikan
      }
      tampilToast(aktif ? "Mode gelap diaktifkan" : "Mode terang diaktifkan");
    });
  }

  // Listener Tombol Kontras Tinggi
  if (tombolKontras) {
    tombolKontras.addEventListener("click", () => {
      document.body.classList.toggle("kontras");
      const aktif = document.body.classList.contains("kontras");
      tombolKontras.setAttribute("aria-pressed", aktif ? "true" : "false");
      try {
        localStorage.setItem("gerakKontras", aktif ? "ya" : "tidak");
      } catch (e) {
        // Abaikan
      }
      tampilToast(aktif ? "Mode kontras tinggi aktif" : "Mode kontras normal");
    });
  }
}

/**
 * Kontrol Skala Ukuran Teks (A-, A, A+)
 */
function inisialisasiSkalaTeks() {
  const tombolKecil = document.getElementById("tombolTeksKecil");
  const tombolNormal = document.getElementById("tombolTeksNormal");
  const tombolBesar = document.getElementById("tombolTeksBesar");

  const skalaTersimpan = Number(localStorage.getItem("gerakUkuranTeks")) || 100;
  const idx = SKALA_LIST.indexOf(skalaTersimpan);
  indeksSkala = idx >= 0 ? idx : 0;
  terapkanSkala(SKALA_LIST[indeksSkala], false);

  if (tombolKecil) {
    tombolKecil.addEventListener("click", () => {
      if (indeksSkala > 0) {
        indeksSkala--;
        terapkanSkala(SKALA_LIST[indeksSkala], true);
      } else {
        tampilToast("Ukuran teks sudah paling kecil");
      }
    });
  }

  if (tombolNormal) {
    tombolNormal.addEventListener("click", () => {
      indeksSkala = 0;
      terapkanSkala(SKALA_LIST[0], true);
    });
  }

  if (tombolBesar) {
    tombolBesar.addEventListener("click", () => {
      if (indeksSkala < SKALA_LIST.length - 1) {
        indeksSkala++;
        terapkanSkala(SKALA_LIST[indeksSkala], true);
      } else {
        tampilToast("Ukuran teks sudah maksimal (150%)");
      }
    });
  }
}

function terapkanSkala(skalaPersen, beriNotif = true) {
  const faktor = skalaPersen / 100;
  document.documentElement.style.setProperty("--skala-teks", String(faktor));
  try {
    localStorage.setItem("gerakUkuranTeks", String(skalaPersen));
  } catch (e) {
    // Abaikan
  }

  const tombolNormal = document.getElementById("tombolTeksNormal");
  if (tombolNormal) {
    tombolNormal.setAttribute("aria-pressed", skalaPersen === 100 ? "true" : "false");
  }

  if (beriNotif) {
    tampilToast(`Ukuran teks diatur ke ${skalaPersen}%`);
  }
}

/**
 * Pengaturan Menu Mobile Aksesibel
 */
function inisialisasiMenuMobile() {
  const menu = document.getElementById("menu");
  const tombolMenu = document.getElementById("tombolMenu");
  if (!menu || !tombolMenu) return;

  tombolMenu.addEventListener("click", () => {
    const buka = menu.classList.toggle("buka");
    tombolMenu.setAttribute("aria-expanded", buka ? "true" : "false");
  });

  // Tutup menu dengan tombol Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && menu.classList.contains("buka")) {
      menu.classList.remove("buka");
      tombolMenu.setAttribute("aria-expanded", "false");
      tombolMenu.focus();
    }
  });

  // Tutup menu saat link diklik
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("buka");
      tombolMenu.setAttribute("aria-expanded", "false");
    });
  });

  // Klik di luar menu menutup menu mobile
  document.addEventListener("click", e => {
    if (!menu.contains(e.target) && !tombolMenu.contains(e.target) && menu.classList.contains("buka")) {
      menu.classList.remove("buka");
      tombolMenu.setAttribute("aria-expanded", "false");
    }
  });
}

/**
 * Fitur Baca Nyaring (Speech Synthesis) Ramah Aksesibilitas
 */
function inisialisasiBacaNyaring() {
  const tombolBaca = document.getElementById("tombolBaca");
  if (!tombolBaca) return;

  if (!("speechSynthesis" in window)) {
    tombolBaca.style.display = "none";
    return;
  }

  window.addEventListener("pagehide", () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  });

  tombolBaca.addEventListener("click", () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      tombolBaca.setAttribute("aria-pressed", "false");
      tampilToast("Baca nyaring dihentikan");
      return;
    }

    let teks = window.getSelection().toString().trim();

    if (!teks) {
      const semuaBagian = document.querySelectorAll("main section");
      for (let i = 0; i < semuaBagian.length; i++) {
        const posisi = semuaBagian[i].getBoundingClientRect();
        if (posisi.bottom > 120) {
          teks = semuaBagian[i].innerText;
          break;
        }
      }
    }

    if (!teks) {
      tampilToast("Pilih atau buka bagian yang ingin dibacakan");
      return;
    }

    // Bersihkan emoji dan karakter dekoratif sebelum dibacakan
    const teksBersih = teks
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .replace(/\s+/g, " ")
      .trim();

    const suara = new SpeechSynthesisUtterance(teksBersih);
    suara.lang = "id-ID";
    suara.rate = 0.95;

    suara.onend = () => {
      tombolBaca.setAttribute("aria-pressed", "false");
    };

    suara.onerror = () => {
      tombolBaca.setAttribute("aria-pressed", "false");
    };

    tombolBaca.setAttribute("aria-pressed", "true");
    window.speechSynthesis.speak(suara);
    tampilToast("🔊 Membacakan teks... Tekan lagi untuk berhenti");
  });
}

/**
 * Inisialisasi perilaku elemen <dialog> native
 */
function inisialisasiDialogNative() {
  const dialogList = document.querySelectorAll("dialog");

  dialogList.forEach(dialog => {
    // Klik di latar belakang (backdrop) menutup dialog biasa (TIDAK untuk dialog Full Screen Workout)
    dialog.addEventListener("click", e => {
      if (e.target === dialog) {
        if (dialog.classList.contains("is-fullscreen") || dialog.id === "dialogSesiLatihan" || dialog.id === "dialogSemuaLatihan") {
          return; // Jangan menutup Full Screen ketika mengeklik area kosong atau bagian luar konten
        }
        dialog.close();
      }
    });

    // Tombol close dengan data-tutup
    dialog.querySelectorAll("[data-tutup]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (dialog.classList.contains("is-fullscreen") || dialog.id === "dialogSesiLatihan" || dialog.id === "dialogSemuaLatihan") {
          // Ditangani secara spesifik oleh keluarWorkoutFullscreen agar status dan posisi #workout terjaga
          return;
        }
        dialog.close();
      });
    });
  });
}