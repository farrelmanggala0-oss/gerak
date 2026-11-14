// =========================================
// GERAK - js/gizi.js
// Logika kalkulasi gizi murni dan aman
// =========================================

import { CONFIG } from "./config.js";

/**
 * Validasi parameter input gizi
 */
export function validasiInputGizi({ kelamin, umur, berat, tinggi, aktivitas, target }) {
  const errors = {};

  if (kelamin !== "pria" && kelamin !== "wanita") {
    errors.kelamin = "Pilih jenis kelamin.";
  }

  const u = Number(umur);
  if (!Number.isFinite(u) || u < 10 || u > 100) {
    errors.umur = "Umur harus antara 10 sampai 100 tahun.";
  }

  const b = Number(berat);
  if (!Number.isFinite(b) || b < 20 || b > 250) {
    errors.berat = "Berat badan harus antara 20 sampai 250 kg.";
  }

  const t = Number(tinggi);
  if (!Number.isFinite(t) || t < 100 || t > 250) {
    errors.tinggi = "Tinggi badan harus antara 100 sampai 250 cm.";
  }

  const a = Number(aktivitas);
  if (!Number.isFinite(a) || a < 1.0 || a > 2.5) {
    errors.aktivitas = "Tingkat aktivitas tidak valid.";
  }

  if (target !== "diet" && target !== "jaga" && target !== "bulking") {
    errors.target = "Pilih target yang sesuai.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Hitung BMI (Body Mass Index)
 */
export function hitungBMI(beratKg, tinggiCm) {
  if (!beratKg || !tinggiCm || tinggiCm <= 0) return 0;
  const tinggiM = tinggiCm / 100;
  return Number((beratKg / (tinggiM * tinggiM)).toFixed(1));
}

/**
 * Fungsi murni untuk menghitung kebutuhan kalori dan makronutrisi
 * @returns {{
 *   status: 'ok' | 'ok-dinaikkan' | 'diblokir',
 *   kalori: number | null,
 *   protein: number | null,
 *   karbo: number | null,
 *   lemak: number | null,
 *   bmi: number,
 *   catatan: string,
 *   errorField?: string
 * }}
 */
export function hitungKebutuhan({ kelamin, umur, berat, tinggi, aktivitas, target }) {
  const validasi = validasiInputGizi({ kelamin, umur, berat, tinggi, aktivitas, target });
  if (!validasi.valid) {
    const pesanPertama = Object.values(validasi.errors)[0];
    return {
      status: "diblokir",
      kalori: null,
      protein: null,
      karbo: null,
      lemak: null,
      bmi: 0,
      catatan: pesanPertama || "Mohon isi semua data dengan angka yang valid.",
      errors: validasi.errors
    };
  }

  const u = Number(umur);
  const b = Number(berat);
  const t = Number(tinggi);
  const a = Number(aktivitas);
  const bmi = hitungBMI(b, t);

  // 1. Perlindungan Usia Remaja (< 18 tahun)
  if (u < CONFIG.UMUR_DEWASA_MIN) {
    if (target !== "jaga") {
      return {
        status: "diblokir",
        kalori: null,
        protein: null,
        karbo: null,
        lemak: null,
        bmi,
        catatan: "Untuk usia di bawah 18 tahun, program diet defisit kalori atau bulking mandiri tidak disarankan. Tubuhmu masih dalam masa pertumbuhan penting. Silakan pilih target 'Jaga' atau konsultasikan ke ahli gizi/dokter."
      };
    }
  }

  // 2. Perlindungan BMI Underweight untuk Target Diet
  if (target === "diet" && bmi < CONFIG.BMI_UNDERWEIGHT_MAX) {
    return {
      status: "diblokir",
      kalori: null,
      protein: null,
      karbo: null,
      lemak: null,
      bmi,
      catatan: `Indeks Massa Tubuhmu (BMI ${bmi}) berada di bawah rentang berat badan sehat (< ${CONFIG.BMI_UNDERWEIGHT_MAX}). Defisit kalori tidak dianjurkan karena berisiko bagi kesehatan. Yuk fokus pada asupan bergizi seimbang dan konsultasikan ke dokter bila perlu.`
    };
  }

  // 3. Kalkulasi BMR (Mifflin-St Jeor)
  let kaloriDasar = 10 * b + 6.25 * t - 5 * u;
  if (kelamin === "pria") {
    kaloriDasar += 5;
  } else {
    kaloriDasar -= 161;
  }

  const tdee = kaloriDasar * a;
  let kaloriMentah = tdee;
  let status = "ok";
  let catatan = "";

  if (target === "diet") {
    kaloriMentah = tdee - 400;
  } else if (target === "bulking") {
    kaloriMentah = tdee + 300;
  }

  let kaloriBulat = Math.round(kaloriMentah);

  // 4. Batas Kalori Minimum
  const batasMin = kelamin === "pria" ? CONFIG.BATAS_KALORI_MIN.pria : CONFIG.BATAS_KALORI_MIN.wanita;
  if (target === "diet" && kaloriBulat < batasMin) {
    kaloriBulat = batasMin;
    status = "ok-dinaikkan";
    catatan = `Angka dinaikkan ke batas minimum aman (${batasMin} kkal/hari) agar metabolisme dan organ tubuhmu tetap berfungsi optimal.`;
  } else {
    if (u < CONFIG.UMUR_DEWASA_MIN) {
      catatan = "Ini perkiraan kasar untuk menjaga energi harian di masa pertumbuhan. Konsultasikan dengan tenaga kesehatan untuk panduan personal.";
    } else if (target === "diet") {
      catatan = "Defisit ringan agar penurunan bertahap dan aman. Perbanyak protein, sayur, dan air putih.";
    } else if (target === "bulking") {
      catatan = "Surplus terukur untuk mendukung pembentukan massa otot. Padukan dengan latihan beban teratur.";
    } else {
      catatan = "Pertahankan pola makan bergizi seimbang dan tetap aktif bergerak setiap hari.";
    }
  }

  // 5. Pembagian Makronutrisi
  // Protein: 1.2 g/kg untuk jaga, 1.8 g/kg untuk selain itu
  const faktorProtein = target === "jaga" ? 1.2 : 1.8;
  const protein = Math.round(b * faktorProtein);
  const lemak = Math.round((kaloriBulat * 0.25) / 9);
  const sisaKaloriKarbo = kaloriBulat - (protein * 4) - (lemak * 9);
  const karbo = Math.max(0, Math.round(sisaKaloriKarbo / 4));

  return {
    status,
    kalori: kaloriBulat,
    protein,
    karbo,
    lemak,
    bmi,
    catatan
  };
}

/**
 * Menghitung umur pengguna secara otomatis berdasarkan tanggal lahir.
 * Umur bertambah tepat pada hari ulang tahun, bukan semata karena pergantian tahun kalender.
 * @param {string|Date} tanggalLahir - Tanggal lahir format YYYY-MM-DD atau objek Date
 * @param {string|Date} [tanggalAcuan=new Date()] - Tanggal acuan perhitungan
 * @returns {number|null} Umur dalam tahun, atau null jika tidak valid
 */
export function hitungUmurDariTanggalLahir(tanggalLahir, tanggalAcuan = new Date()) {
  if (!tanggalLahir) return null;
  const lahir = typeof tanggalLahir === "string" ? new Date(tanggalLahir) : tanggalLahir;
  if (isNaN(lahir.getTime())) return null;

  const acuan = typeof tanggalAcuan === "string" ? new Date(tanggalAcuan) : tanggalAcuan;
  if (isNaN(acuan.getTime())) return null;

  let umur = acuan.getFullYear() - lahir.getFullYear();
  const bulanSelisih = acuan.getMonth() - lahir.getMonth();

  // Jika bulan belum sampai, atau bulan sama tapi tanggal belum sampai, kurangi 1 tahun
  if (bulanSelisih < 0 || (bulanSelisih === 0 && acuan.getDate() < lahir.getDate())) {
    umur--;
  }

  return umur >= 0 ? umur : 0;
}

/**
 * Mengecek apakah pengubahan tinggi badan dikunci berdasarkan jenis kelamin dan usia.
 * Aturan produk:
 * - Perempuan (wanita): dikunci jika umur >= 18 tahun.
 * - Laki-laki (pria): dikunci jika umur >= 21 tahun.
 * @param {'pria'|'wanita'} kelamin
 * @param {number} umur
 * @returns {boolean}
 */
export function apakahTinggiDikunci(kelamin, umur) {
  const u = Number(umur);
  if (!Number.isFinite(u)) return false;
  if (kelamin === "wanita") {
    return u >= 18;
  }
  if (kelamin === "pria") {
    return u >= 21;
  }
  return false;
}

/**
 * Menghitung estimasi ekuivalen energi dari perubahan berat badan.
 * Formula: |beratTerbaru - beratAwal| * 7700 kkal.
 * @param {number} beratAwal
 * @param {number} beratTerbaru
 * @returns {{
 *   perubahanKg: number,
 *   arah: 'turun' | 'naik' | 'tetap',
 *   ekuivalenKalori: number,
 *   teksPerubahan: string,
 *   teksEkuivalen: string
 * }}
 */
export function hitungEkuivalenEnergi(beratAwal, beratTerbaru) {
  const awal = Number(beratAwal);
  const baru = Number(beratTerbaru);

  if (!Number.isFinite(awal) || !Number.isFinite(baru) || awal <= 0 || baru <= 0) {
    return {
      perubahanKg: 0,
      arah: "tetap",
      ekuivalenKalori: 0,
      teksPerubahan: "-",
      teksEkuivalen: "-"
    };
  }

  const selisih = Number((baru - awal).toFixed(1));
  const absSelisih = Math.abs(selisih);
  const ekuivalen = Math.round(absSelisih * 7700);

  let arah = "tetap";
  let teksPerubahan = "0 kg";
  let teksEkuivalen = "0 kkal";

  if (selisih < 0) {
    arah = "turun";
    teksPerubahan = `Turun ${absSelisih} kg`;
    teksEkuivalen = `≈ ${ekuivalen.toLocaleString("id-ID")} kkal`;
  } else if (selisih > 0) {
    arah = "naik";
    teksPerubahan = `Naik ${absSelisih} kg`;
    teksEkuivalen = `≈ ${ekuivalen.toLocaleString("id-ID")} kkal`;
  } else {
    arah = "tetap";
    teksPerubahan = "Tetap (0 kg)";
    teksEkuivalen = "0 kkal";
  }

  return {
    perubahanKg: selisih,
    arah,
    ekuivalenKalori: ekuivalen,
    teksPerubahan,
    teksEkuivalen
  };
}