// =========================================
// GERAK - js/penyimpanan.js
// Penyimpanan lokal tahan banting dengan migrasi skema dan ekspor data
// =========================================

import { CONFIG } from "./config.js";
import { tampilToast } from "./ui.js";
import { hariIni } from "./tanggal.js";

export const SKEMA_TERKINI = 2;

export const DATA_DEFAULT = {
  versiSkema: SKEMA_TERKINI,
  streak: 0,
  rekorStreak: 0,
  terakhirCheckin: "",
  tanggalCheckin: [],
  aktivitasCheckin: {},
  xp: 0,
  jumlahJurnal: 0,
  jumlahAjakan: 0,
  sisaJatahIstirahat: 1,
  xpHarian: {
    tanggal: "",
    checkin: false,
    jurnal: 0,
    ajakan: 0,
    kawanDiajak: []
  },
  blokirKawan: [],
  ajakanKawan: [],
  laporanKawan: [],
  umurUser: null,
  profilGizi: null,
  akun: null,
  poin: 0,
  sesiWorkoutSelesai: 0,
  riwayatPoinWorkout: [],
  riwayatKesehatan: { keluhan: [], checkup: [] }
};

/**
 * Membaca data dari localStorage secara aman dengan fallback
 */
export function muatData(kunci, nilaiBawaan) {
  try {
    const mentah = localStorage.getItem(kunci);
    if (!mentah) return structuredClone(nilaiBawaan);

    const hasil = JSON.parse(mentah);
    if (typeof hasil !== "object" || hasil === null) {
      return structuredClone(nilaiBawaan);
    }

    // Jika objek data utama, lakukan penggabungan dan migrasi
    if (kunci === "gerakData") {
      return migrasiSkemaData(hasil, nilaiBawaan);
    }

    // Jika array jurnal
    if (kunci === "gerakJurnal") {
      if (!Array.isArray(hasil)) return [];
      return hasil.slice(0, CONFIG.BATAS_PENYIMPANAN.MAX_ENTRI_JURNAL);
    }

    return Object.assign(structuredClone(nilaiBawaan), hasil);
  } catch (err) {
    console.warn(`Gagal memuat ${kunci} dari localStorage:`, err);
    return structuredClone(nilaiBawaan);
  }
}

/**
 * Menyimpan data ke localStorage secara aman dengan try/catch
 */
export function simpanData(kunci, nilai) {
  try {
    // Batasi pertumbuhan data sebelum disimpan
    if (kunci === "gerakData" && nilai && Array.isArray(nilai.tanggalCheckin)) {
      if (nilai.tanggalCheckin.length > CONFIG.BATAS_PENYIMPANAN.MAX_HARI_CHECKIN) {
        nilai.tanggalCheckin = nilai.tanggalCheckin.slice(-CONFIG.BATAS_PENYIMPANAN.MAX_HARI_CHECKIN);
      }
    }

    if (kunci === "gerakJurnal" && Array.isArray(nilai)) {
      if (nilai.length > CONFIG.BATAS_PENYIMPANAN.MAX_ENTRI_JURNAL) {
        nilai = nilai.slice(0, CONFIG.BATAS_PENYIMPANAN.MAX_ENTRI_JURNAL);
      }
    }

    localStorage.setItem(kunci, JSON.stringify(nilai));
    return true;
  } catch (err) {
    console.error(`Gagal menyimpan ${kunci} ke localStorage:`, err);
    tampilToast("Penyimpanan peramban penuh atau mode privat aktif. Perubahan mungkin tidak tersimpan.", 5000);
    return false;
  }
}

/**
 * Migrasi skema data lama (versi 1) ke versi 2
 */
export function migrasiSkemaData(dataLama, nilaiBawaan) {
  const merged = Object.assign(structuredClone(nilaiBawaan), dataLama);

  // Pastikan xpHarian selalu memiliki struktur yang benar dan sinkron dengan hari ini
  if (!merged.xpHarian || typeof merged.xpHarian !== "object" || merged.xpHarian.tanggal !== hariIni()) {
    merged.xpHarian = {
      tanggal: hariIni(),
      checkin: false,
      jurnal: 0,
      ajakan: 0,
      kawanDiajak: []
    };
  }

  if (!Array.isArray(merged.blokirKawan)) merged.blokirKawan = [];
  if (!Array.isArray(merged.ajakanKawan)) merged.ajakanKawan = [];
  if (!Array.isArray(merged.laporanKawan)) merged.laporanKawan = [];
  if (!merged.aktivitasCheckin || typeof merged.aktivitasCheckin !== "object") merged.aktivitasCheckin = {};

  // Riwayat kesehatan (keluhan latihan & medical checkup) selalu punya dua daftar
  const rk = merged.riwayatKesehatan;
  merged.riwayatKesehatan = {
    keluhan: rk && Array.isArray(rk.keluhan)
      // laporan lama menyimpan satu pilihan sebagai teks; sekarang selalu daftar
      ? rk.keluhan.filter(k => k && typeof k === "object").map(k => ({ ...k, bagianTubuh: [].concat(k.bagianTubuh || []), jenis: [].concat(k.jenis || []) }))
      : [],
    checkup: rk && Array.isArray(rk.checkup) ? rk.checkup : []
  };

  if (!merged.rekorStreak || merged.rekorStreak < merged.streak) {
    merged.rekorStreak = merged.streak || 0;
  }

  if (merged.sisaJatahIstirahat === undefined || merged.sisaJatahIstirahat === null) {
    merged.sisaJatahIstirahat = 1;
  }

  merged.versiSkema = SKEMA_TERKINI;
  return merged;
}

/**
 * Ekspor seluruh data GERAK lokal sebagai file JSON
 */
export function eksporDataJSON() {
  try {
    const bundle = {
      aplikasi: "GERAK - Gizi, Energi, Raga, Kawan",
      versi: "1.0.0",
      tanggalEkspor: new Date().toISOString(),
      gerakData: muatData("gerakData", DATA_DEFAULT),
      gerakJurnal: muatData("gerakJurnal", []),
      gerakGelap: localStorage.getItem("gerakGelap") || "tidak",
      gerakKontras: localStorage.getItem("gerakKontras") || "tidak",
      gerakUkuranTeks: localStorage.getItem("gerakUkuranTeks") || "100"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const unduhAnchor = document.createElement("a");
    unduhAnchor.setAttribute("href", dataStr);
    unduhAnchor.setAttribute("download", `gerak-data-${hariIni()}.json`);
    document.body.appendChild(unduhAnchor);
    unduhAnchor.click();
    unduhAnchor.remove();

    tampilToast("Data berhasil diekspor ke file JSON 📁");
  } catch (err) {
    console.error("Gagal mengekspor data:", err);
    tampilToast("Terjadi kesalahan saat mengekspor data.");
  }
}

/**
 * Menghapus seluruh data GERAK dari penyimpanan lokal
 */
export function hapusSemuaData() {
  try {
    localStorage.removeItem("gerakData");
    localStorage.removeItem("gerakJurnal");
    localStorage.removeItem("gerakGelap");
    localStorage.removeItem("gerakKontras");
    localStorage.removeItem("gerakUkuranTeks");
    localStorage.removeItem("gerakBlokir");
    localStorage.removeItem("gerakLaporan");
    localStorage.removeItem("gerakAjakan");
    localStorage.removeItem("gerakUmur");
    tampilToast("Semua data GERAK telah dihapus dari perangkat ini.");
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  } catch (err) {
    console.error("Gagal menghapus data:", err);
    tampilToast("Gagal menghapus data.");
  }
}