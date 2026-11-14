// =========================================
// GERAK - js/ayo-mulai.js
// Pelacak Progres Berat Badan dan Ekuivalen Energi "AYO MULAI"
// =========================================

import { hitungEkuivalenEnergi } from "./gizi.js";
import { tampilToast } from "./ui.js";

/**
 * Menghitung data progres AYO MULAI dari appState
 * @param {object} appState
 * @returns {object}
 */
export function hitungProgresAyoMulai(appState) {
  const akun = appState?.data?.akun || {};
  const gizi = appState?.data?.profilGizi || {};

  const beratAwal = akun.beratBadanAwal ?? gizi.berat ?? null;
  const beratTerbaru = akun.beratBadan ?? gizi.berat ?? null;
  const target = gizi.target || akun.target || null;

  const hasilEkuivalen = hitungEkuivalenEnergi(beratAwal, beratTerbaru);

  // Sumber aktivitas
  const sesiWorkout = appState?.data?.sesiWorkoutSelesai || 0;
  const kegiatanKawan = appState?.data?.kegiatanBersamaSelesai || 0;

  return {
    beratAwal,
    beratTerbaru,
    target,
    hasilEkuivalen,
    sesiWorkout,
    kegiatanKawan,
    kaloriTarget: gizi.kalori || null
  };
}

/**
 * Memperbarui tampilan kartu AYO MULAI di Beranda
 * @param {object} appState
 */
export function perbaruiUIAyoMulai(appState) {
  const kartu = document.getElementById("kartuAyoMulai");
  if (!kartu) return;

  const data = hitungProgresAyoMulai(appState);

  // 1. Elemen Metrik Berat
  const elBeratAwal = document.getElementById("ayoMulaiBeratAwal");
  const elBeratTerbaru = document.getElementById("ayoMulaiBeratTerbaru");
  const elPerubahan = document.getElementById("ayoMulaiPerubahan");
  const elTargetBadge = document.getElementById("ayoMulaiTargetBadge");

  if (elBeratAwal) {
    elBeratAwal.textContent = data.beratAwal !== null ? `${data.beratAwal} kg` : "-";
  }
  if (elBeratTerbaru) {
    elBeratTerbaru.textContent = data.beratTerbaru !== null ? `${data.beratTerbaru} kg` : "-";
  }
  if (elPerubahan) {
    elPerubahan.textContent = data.beratAwal !== null && data.beratTerbaru !== null
      ? data.hasilEkuivalen.teksPerubahan
      : "-";
  }

  // 2. Badge Target
  if (elTargetBadge) {
    if (data.target === "diet") {
      elTargetBadge.textContent = "🥗 Target: Diet";
      elTargetBadge.className = "chip-target-aktif chip-diet";
    } else if (data.target === "bulking") {
      elTargetBadge.textContent = "💪 Target: Bulking";
      elTargetBadge.className = "chip-target-aktif chip-bulking";
    } else if (data.target === "jaga") {
      elTargetBadge.textContent = "⚖️ Target: Jaga Berat";
      elTargetBadge.className = "chip-target-aktif chip-jaga";
    } else {
      elTargetBadge.textContent = "Belum Ada Target";
      elTargetBadge.className = "chip-target-aktif chip-kosong";
    }
  }

  // 3. Ekuivalen Energi & Catatan
  const elEkuivalenTeks = document.getElementById("ayoMulaiEkuivalenTeks");
  const elEkuivalenSub = document.getElementById("ayoMulaiEkuivalenSub");
  const elIkonEkuivalen = document.getElementById("ayoMulaiIkonEkuivalen");

  if (elEkuivalenTeks && elEkuivalenSub) {
    if (data.target === "jaga") {
      if (elIkonEkuivalen) elIkonEkuivalen.textContent = "⚖️";
      elEkuivalenTeks.textContent = `Kalori Pemeliharaan: ${data.kaloriTarget ? data.kaloriTarget.toLocaleString("id-ID") + " kkal/hari" : "-"}`;
      elEkuivalenSub.textContent = "Fokus menjaga berat badan stabil dan mencukupi energi harian seimbang.";
    } else if (data.beratAwal !== null && data.beratTerbaru !== null) {
      if (elIkonEkuivalen) elIkonEkuivalen.textContent = "⚡";
      elEkuivalenTeks.textContent = `Ekuivalen Energi: ${data.hasilEkuivalen.teksEkuivalen}`;

      if (data.target === "diet") {
        if (data.hasilEkuivalen.arah === "turun") {
          elEkuivalenSub.textContent = `Bagus! Penurunan berat badan selaras dengan target diet defisitmu.`;
        } else if (data.hasilEkuivalen.arah === "tetap") {
          elEkuivalenSub.textContent = `Berat badan stabil. Lanjutkan disiplin defisit kalori dan latihan untuk memicu penurunan.`;
        } else {
          elEkuivalenSub.textContent = `Terjadi kenaikan berat. Evaluasi asupan kalori agar tetap berada pada batas defisit aman.`;
        }
      } else if (data.target === "bulking") {
        if (data.hasilEkuivalen.arah === "naik") {
          elEkuivalenSub.textContent = `Bagus! Kenaikan berat mendukung pembentukan massa otot target bulkingmu.`;
        } else {
          elEkuivalenSub.textContent = `Lanjutkan surplus kalori terukur dan latihan beban agar massa otot bertambah optimal.`;
        }
      } else {
        elEkuivalenSub.textContent = `Perubahan berat badan: ${data.hasilEkuivalen.teksPerubahan}. Pilih target di Kalkulator Gizi.`;
      }
    } else {
      if (elIkonEkuivalen) elIkonEkuivalen.textContent = "🎯";
      elEkuivalenTeks.textContent = "Estimasi Ekuivalen Energi: -";
      elEkuivalenSub.textContent = "Lengkapi data berat badan di Kalkulator Gizi untuk mulai memantau progres.";
    }
  }

  // 4. Ringkasan 3 Sumber Aktivitas
  const elRingkasanGizi = document.getElementById("ayoMulaiRingkasanGizi");
  const elRingkasanWorkout = document.getElementById("ayoMulaiRingkasanWorkout");
  const elRingkasanKawan = document.getElementById("ayoMulaiRingkasanKawan");

  if (elRingkasanGizi) {
    if (data.kaloriTarget) {
      const labelTarget = data.target ? data.target.toUpperCase() : "GIZI";
      elRingkasanGizi.textContent = `${labelTarget} (${data.kaloriTarget.toLocaleString("id-ID")} kkal/hari)`;
    } else {
      elRingkasanGizi.textContent = "Belum dihitung";
    }
  }

  if (elRingkasanWorkout) {
    if (data.sesiWorkout > 0) {
      elRingkasanWorkout.textContent = `${data.sesiWorkout} sesi selesai (+${data.sesiWorkout * 25} poin)`;
    } else {
      elRingkasanWorkout.textContent = "0 sesi selesai";
    }
  }

  if (elRingkasanKawan) {
    if (data.kegiatanKawan > 0) {
      elRingkasanKawan.textContent = `${data.kegiatanKawan} kegiatan bersama`;
    } else {
      elRingkasanKawan.textContent = "0 kegiatan tercatat";
    }
  }
}

/**
 * Inisialisasi event listener kartu AYO MULAI
 * @param {object} appState
 */
export function inisialisasiAyoMulai(appState) {
  const btn = document.getElementById("btnAyoMulaiUtama");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const akun = appState?.data?.akun || {};
    const gizi = appState?.data?.profilGizi || {};

    const belumLengkap = !akun.beratBadan || !gizi.kalori;
    if (belumLengkap) {
      window.location.hash = "#gizi";
      const form = document.getElementById("formGizi");
      if (form) form.scrollIntoView({ behavior: "smooth" });
      tampilToast("Lengkapi data profil dan hitung kalori harianmu terlebih dahulu di sini 🥗", 4000);
      return;
    }

    if (!gizi.target) {
      window.location.hash = "#gizi";
      tampilToast("Pilih target Diet, Jaga, atau Bulking terlebih dahulu di Kalkulator Gizi 🎯", 4000);
      return;
    }

    // Informasi dan target sudah tersedia
    if (gizi.target === "diet" || gizi.target === "bulking") {
      window.location.hash = "#workout";
      tampilToast(`Target ${gizi.target.toUpperCase()} aktif! Progres tercatat. Yuk lanjutkan sesi latihan fisikmu 🏋️`, 4000);
    } else {
      window.location.hash = "#gizi";
      tampilToast(`Target JAGA aktif (${gizi.kalori.toLocaleString("id-ID")} kkal/hari). Pertahankan pola hidup seimbangmu! ⚖️`, 4000);
    }
  });

  // Render awal
  perbaruiUIAyoMulai(appState);
}