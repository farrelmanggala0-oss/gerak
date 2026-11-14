// =========================================
// GERAK - js/gamifikasi.js
// Sistem gamifikasi adil, streak ramah, anti-farming XP, dan badge
// =========================================

import { CONFIG } from "./config.js";
import { formatTanggal, hariIni, kemarin, selisihHari } from "./tanggal.js";

/**
 * Evaluasi status streak dan jatah istirahat
 * @param {object} data - Objek state data pengguna
 * @param {string} [tglSekarangStr] - Tanggal evaluasi (default hari ini)
 * @returns {{ streak: number, jatahTerpakai: boolean, status: string }}
 */
export function evaluasiStreak(data, tglSekarangStr = hariIni()) {
  if (!data.terakhirCheckin) {
    data.streak = 0;
    return { streak: 0, jatahTerpakai: false, status: "belum_mulai" };
  }

  const selisih = selisihHari(data.terakhirCheckin, tglSekarangStr);

  // Jika check-in hari ini atau kemarin, streak aman
  if (selisih <= 1) {
    return { streak: data.streak, jatahTerpakai: false, status: "aktif" };
  }

  // Jika bolong tepat 1 hari (selisih == 2)
  if (selisih === 2) {
    if ((data.sisaJatahIstirahat || 0) > 0) {
      data.sisaJatahIstirahat -= 1;
      return {
        streak: data.streak,
        jatahTerpakai: true,
        status: "istirahat_dipakai"
      };
    }
  }

  // Bolong lebih dari batas jatah istirahat -> streak putus dengan ramah
  if (data.streak > 0) {
    data.rekorStreak = Math.max(data.rekorStreak || 0, data.streak);
  }
  data.streak = 0;
  // Berikan kembali 1 jatah istirahat dasar untuk siklus berikutnya
  data.sisaJatahIstirahat = 1;

  return { streak: 0, jatahTerpakai: false, status: "putus" };
}

/**
 * Reset jatah XP harian jika tanggal berganti
 */
export function perbaruiXpHarian(data, tglSekarangStr = hariIni()) {
  if (!data.xpHarian || data.xpHarian.tanggal !== tglSekarangStr) {
    data.xpHarian = {
      tanggal: tglSekarangStr,
      checkin: false,
      jurnal: 0,
      ajakan: 0,
      kawanDiajak: []
    };
  }
}

/**
 * Menambahkan XP dengan perlindungan anti-farming
 */
export function tambahXPAman(data, jenis, meta = {}, tglSekarangStr = hariIni()) {
  perbaruiXpHarian(data, tglSekarangStr);

  const levelLama = Math.floor(data.xp / CONFIG.XP.XP_PER_LEVEL) + 1;
  let xpDitambah = 0;
  let pesanPenuh = null;

  if (jenis === "checkin") {
    if (!data.xpHarian.checkin) {
      xpDitambah = CONFIG.XP.CHECKIN;
      data.xpHarian.checkin = true;
    } else {
      pesanPenuh = "XP check-in hari ini sudah kamu dapatkan 👍";
    }
  } else if (jenis === "jurnal") {
    const panjangKarakter = meta.karakter || 0;
    if (panjangKarakter < CONFIG.BATAS_HARIAN.MIN_KARAKTER_JURNAL) {
      return {
        bertambah: 0,
        naikLevel: false,
        pesan: `Tulis minimal ${CONFIG.BATAS_HARIAN.MIN_KARAKTER_JURNAL} karakter untuk dapat XP.`
      };
    }

    if (data.xpHarian.jurnal < CONFIG.BATAS_HARIAN.MAX_JURNAL_XP_PER_HARI) {
      xpDitambah = CONFIG.XP.JURNAL;
      data.xpHarian.jurnal += 1;
    } else {
      pesanPenuh = "XP jurnal hari ini sudah penuh, tulisanmu tetap tersimpan kok ✍️";
    }
  } else if (jenis === "ajakan") {
    const kawanId = String(meta.kawanId || "");
    if (data.xpHarian.ajakan >= CONFIG.BATAS_HARIAN.MAX_AJAKAN_XP_PER_HARI) {
      pesanPenuh = "Batas XP ajakan hari ini sudah tercapai (maks 3x sehari).";
    } else if (data.xpHarian.kawanDiajak.includes(kawanId)) {
      pesanPenuh = "XP ajakan untuk kawan ini sudah kamu peroleh hari ini.";
    } else {
      xpDitambah = CONFIG.XP.AJAKAN;
      data.xpHarian.ajakan += 1;
      data.xpHarian.kawanDiajak.push(kawanId);
    }
  }

  data.xp += xpDitambah;
  const levelBaru = Math.floor(data.xp / CONFIG.XP.XP_PER_LEVEL) + 1;
  const naikLevel = levelBaru > levelLama;

  return {
    bertambah: xpDitambah,
    levelBaru,
    naikLevel,
    pesanPenuh
  };
}

/**
 * Proses check-in harian dengan aktivitas perawatan diri
 */
export function prosesCheckin(data, aktivitasList = [], tglSekarangStr = hariIni()) {
  evaluasiStreak(data, tglSekarangStr);

  if (data.terakhirCheckin === tglSekarangStr) {
    return {
      sukses: false,
      alasan: "sudah_checkin",
      pesan: "Kamu udah check-in hari ini 👍"
    };
  }

  if (!Array.isArray(aktivitasList) || aktivitasList.length === 0) {
    return {
      sukses: false,
      alasan: "aktivitas_kosong",
      pesan: "Pilih minimal satu hal yang kamu lakukan untuk badanmu hari ini."
    };
  }

  data.streak += 1;
  data.terakhirCheckin = tglSekarangStr;
  if (!data.tanggalCheckin.includes(tglSekarangStr)) {
    data.tanggalCheckin.push(tglSekarangStr);
  }

  if (!data.aktivitasCheckin) data.aktivitasCheckin = {};
  data.aktivitasCheckin[tglSekarangStr] = aktivitasList;

  // Perbarui rekor streak
  data.rekorStreak = Math.max(data.rekorStreak || 0, data.streak);

  // Bonus jatah istirahat tiap 7 hari
  if (data.streak % 7 === 0) {
    data.sisaJatahIstirahat = (data.sisaJatahIstirahat || 0) + 1;
  }

  const hasilXP = tambahXPAman(data, "checkin", {}, tglSekarangStr);

  return {
    sukses: true,
    streak: data.streak,
    xpBertambah: hasilXP.bertambah,
    naikLevel: hasilXP.naikLevel,
    levelBaru: hasilXP.levelBaru
  };
}

/**
 * Hitung kalkulasi level dan sisa XP
 */
export function hitungInfoLevel(xp) {
  const level = Math.floor(xp / CONFIG.XP.XP_PER_LEVEL) + 1;
  const xpLevelIni = xp % CONFIG.XP.XP_PER_LEVEL;
  const idx = Math.min(level - 1, CONFIG.NAMA_LEVEL.length - 1);
  return {
    level,
    xpLevelIni,
    persen: xpLevelIni,
    namaLevel: CONFIG.NAMA_LEVEL[idx]
  };
}

/**
 * Ambil daftar badge lengkap dengan status dan teks syarat
 */
export function ambilDaftarBadge(data) {
  return [
    {
      id: "langkah_pertama",
      ikon: "👟",
      nama: "Langkah Pertama",
      deskripsi: "Check-in pertama kali di GERAK",
      terbuka: (data.tanggalCheckin || []).length >= 1
    },
    {
      id: "api_kecil",
      ikon: "🔥",
      nama: "Api Kecil",
      deskripsi: "Pertahankan streak 3 hari berturut-turut",
      terbuka: (data.streak || 0) >= 3 || (data.rekorStreak || 0) >= 3
    },
    {
      id: "seminggu_penuh",
      ikon: "🏆",
      nama: "Seminggu Penuh",
      deskripsi: "Pertahankan streak 7 hari berturut-turut",
      terbuka: (data.streak || 0) >= 7 || (data.rekorStreak || 0) >= 7
    },
    {
      id: "penulis_jurnal",
      ikon: "📓",
      nama: "Penulis Jurnal",
      deskripsi: "Tulis dan simpan minimal 1 catatan jurnal",
      terbuka: (data.jumlahJurnal || 0) >= 1
    },
    {
      id: "kawan_sejati",
      ikon: "🤝",
      nama: "Kawan Sejati",
      deskripsi: "Kirim minimal 1 ajakan gerak ke kawan",
      terbuka: (data.jumlahAjakan || 0) >= 1
    }
  ];
}