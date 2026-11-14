// =========================================
// GERAK - js/config.js
// Konfigurasi aplikasi, batas aman gizi, dan gamifikasi
// =========================================

export const CONFIG = {
  // Mode demo untuk simulasi profil
  DEMO: true,

  // Mode aman untuk pengguna di bawah 18 tahun (swadeklarasi usia)
  // KEPUTUSAN-PRODUK: Mode aman remaja aktif secara bawaan
  MODE_AMAN_REMAJA: true,

  // Batas usia dewasa untuk kalkulasi defisit/surplus kalori
  UMUR_DEWASA_MIN: 18,

  // Cutoff BMI dewasa menurut standar WHO/Kemenkes
  BMI_UNDERWEIGHT_MAX: 18.5,

  // Batas minimum asupan kalori harian agar metabolisme tidak rusak
  // VERIFIKASI: Batas placeholder (1200 kkal wanita, 1500 kkal pria) perlu dikonfirmasi ke standar AKG Kemenkes RI/ahli gizi
  BATAS_KALORI_MIN: {
    wanita: 1200,
    pria: 1500
  },

  // Pengaturan Gamifikasi & XP
  XP: {
    CHECKIN: 20,
    JURNAL: 15,
    AJAKAN: 10,
    XP_PER_LEVEL: 100
  },

  // Batas harian perolehan XP agar tidak di-farming
  BATAS_HARIAN: {
    MAX_CHECKIN_PER_HARI: 1,
    MAX_JURNAL_XP_PER_HARI: 1,
    MIN_KARAKTER_JURNAL: 10,
    MAX_AJAKAN_XP_PER_HARI: 3,
    MAX_AJAKAN_PER_KAWAN_PER_HARI: 1
  },

  // Batas kapasitas penyimpanan lokal (localStorage)
  BATAS_PENYIMPANAN: {
    MAX_HARI_CHECKIN: 120,
    MAX_ENTRI_JURNAL: 500,
    JURNAL_TAMPIL_AWAL: 4
  },

  // Jatah hari istirahat (Rest Day) agar streak tetap inklusif
  STREAK: {
    JATAH_ISTIRAHAT_PER_HARI: 7 // 1 jatah rest day tiap kelipatan 7 hari streak
  },

  // Nama level pencapaian
  // KEPUTUSAN-PRODUK: Mempertahankan "Atlet Kampung" sesuai baseline asli
  NAMA_LEVEL: [
    "Pemula Gerak",
    "Mulai Panas",
    "Rajin Gerak",
    "Atlet Kampung",
    "Si Paling Sehat",
    "Legenda GERAK"
  ],

  // Kontak bantuan kesehatan mental resmi
  // VERIFIKASI: Masukkan kontak resmi (misal Hotline Kesehatan Jiwa Kemenkes 119 ext. 8 / Sejiwa)
  KONTAK_BANTUAN: null,

  // Prompt refleksi jurnal cadangan (offline / bawaan)
  PROMPT_CADANGAN: [
    "Apa hal terbaik yang terjadi hari ini?",
    "Apa yang membuatmu merasa lelah atau stres hari ini?",
    "Apa pencapaian kecil yang ingin kamu apresiasi pada dirimu?",
    "Bagaimana kondisi tubuhmu setelah bergerak atau workout hari ini?",
    "Apa satu hal kecil yang ingin kamu perbaiki besok?",
    "Apa satu hal kecil yang bikin badan kamu terasa enak hari ini?",
    "Hari ini kamu gerak berapa lama? Gimana rasanya?",
    "Makanan apa yang paling kamu nikmati hari ini, dan kenapa?",
    "Kalau badan kamu bisa ngomong, dia bakal bilang apa hari ini?",
    "Jam berapa kamu tidur semalam? Ngaruh nggak ke mood kamu?"
  ]
};