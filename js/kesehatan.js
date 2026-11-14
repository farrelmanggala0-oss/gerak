// =========================================
// GERAK - js/kesehatan.js
// Logika murni Riwayat Kesehatan: laporan keluhan saat latihan, medical checkup,
// deteksi tanda bahaya, saran modifikasi gerakan, dan analisis riwayat.
// Tidak menyentuh DOM supaya bisa diuji dengan node --test.
// CATATAN: Semua saran bersifat edukatif, BUKAN diagnosis medis.
// =========================================

import { selisihHari } from "./tanggal.js";

export const BATAS_KESEHATAN = {
  MAX_KELUHAN: 100,
  MAX_CHECKUP: 50,
  MAX_CATATAN: 300,
  MAX_CATATAN_DOKTER: 500,
  HARI_PERINGATAN: 30
};

export const BAGIAN_TUBUH = [
  { id: "lutut", label: "Lutut" },
  { id: "punggung-bawah", label: "Punggung bawah" },
  { id: "bahu", label: "Bahu" },
  { id: "pergelangan-tangan", label: "Pergelangan tangan" },
  { id: "siku", label: "Siku" },
  { id: "leher", label: "Leher" },
  { id: "pinggul", label: "Pinggul" },
  { id: "pergelangan-kaki", label: "Pergelangan kaki" },
  { id: "perut-inti", label: "Perut / otot inti" },
  { id: "lainnya", label: "Lainnya" }
];

export const JENIS_KELUHAN = [
  { id: "tidak-kuat-posisi", label: "Nggak kuat tahan posisi" },
  { id: "nyeri", label: "Nyeri / sakit" },
  { id: "kram", label: "Kram / otot tegang" },
  { id: "tidak-stabil", label: "Goyah / nggak seimbang" },
  { id: "pusing", label: "Pusing / mau pingsan", bahaya: true },
  { id: "sesak", label: "Sesak napas berat", bahaya: true },
  { id: "nyeri-dada", label: "Nyeri dada", bahaya: true },
  { id: "kesemutan", label: "Kesemutan / mati rasa", bahaya: true }
];

export const FASE_KELUHAN = [
  { id: "saat-turun", label: "Saat turun" },
  { id: "saat-menahan", label: "Saat menahan posisi" },
  { id: "saat-naik", label: "Saat naik / mendorong" },
  { id: "sepanjang-gerakan", label: "Sepanjang gerakan" },
  { id: "setelah-latihan", label: "Setelah latihan" }
];

export const ANJURAN_OLAHRAGA = [
  { id: "bebas", label: "Boleh olahraga seperti biasa" },
  { id: "hindari-beban-berat", label: "Hindari beban berat" },
  { id: "hindari-benturan", label: "Hindari lompatan / benturan" },
  { id: "istirahat-dulu", label: "Istirahat olahraga dulu" },
  { id: "tidak-ada", label: "Tidak ada anjuran khusus" }
];

// Rentang angka checkup yang masih masuk akal. Di luar ini dianggap salah ketik.
const RENTANG_CHECKUP = {
  sistolik: [70, 250],
  diastolik: [40, 150],
  detakIstirahat: [30, 200],
  gulaDarah: [40, 600],
  kolesterol: [80, 500]
};

const cariLabel = (daftar, id) => (daftar.find(item => item.id === id) || {}).label || id;
export const labelBagianTubuh = id => cariLabel(BAGIAN_TUBUH, id);
export const labelJenisKeluhan = id => cariLabel(JENIS_KELUHAN, id);
export const labelFaseKeluhan = id => cariLabel(FASE_KELUHAN, id);
export const labelAnjuran = id => cariLabel(ANJURAN_OLAHRAGA, id);

// Ambil pilihan yang valid saja, urut sesuai daftar, tanpa dobel
const pilihanValid = (nilai, daftar) => {
  const dipilih = [].concat(nilai || []);
  return daftar.filter(item => dipilih.includes(item.id)).map(item => item.id);
};
const gabungLabel = (ids, fungsiLabel) => ids.map(fungsiLabel).join(", ");

// "Nyeri / sakit, Goyah / nggak seimbang di lutut, bahu"
export function ringkasKeluhan(k) {
  return `${gabungLabel(k.jenis, labelJenisKeluhan)} di ${gabungLabel(k.bagianTubuh, labelBagianTubuh).toLowerCase()}`;
}

const buatId = awalan => `${awalan}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const teksAman = (nilai, batas) => String(nilai || "").trim().slice(0, batas);
const tanggalValid = teks => /^\d{4}-\d{2}-\d{2}$/.test(teks) && !Number.isNaN(new Date(teks + "T00:00:00").getTime());

export function riwayatKosong() {
  return { keluhan: [], checkup: [] };
}

// ---------- Laporan keluhan saat latihan ----------

export function validasiLaporanKeluhan(input, tanggal) {
  const gerakan = teksAman(input.gerakan, 120);
  if (!gerakan) return { ok: false, pesan: "Gerakan yang dilaporkan belum diketahui." };
  const bagianTubuh = pilihanValid(input.bagianTubuh, BAGIAN_TUBUH);
  const jenis = pilihanValid(input.jenis, JENIS_KELUHAN);
  if (bagianTubuh.length === 0) return { ok: false, pesan: "Pilih minimal satu bagian tubuh yang terasa nggak nyaman ya." };
  if (jenis.length === 0) return { ok: false, pesan: "Pilih minimal satu jenis keluhan ya." };

  const angka = Math.round(Number(input.intensitas) || 1);
  return {
    ok: true,
    data: {
      id: buatId("keluhan"),
      tanggal,
      gerakan,
      tipeGerakan: teksAman(input.tipeGerakan, 20),
      bagianTubuh,
      jenis,
      fase: FASE_KELUHAN.some(f => f.id === input.fase) ? input.fase : "sepanjang-gerakan",
      intensitas: Math.min(10, Math.max(1, angka)),
      catatan: teksAman(input.catatan, BATAS_KESEHATAN.MAX_CATATAN)
    }
  };
}

export function cekTandaBahaya(laporan) {
  const bahaya = JENIS_KELUHAN.some(j => j.bahaya && laporan.jenis.includes(j.id)) || Number(laporan.intensitas) >= 8;
  return {
    bahaya,
    pesan: bahaya
      ? "Berhenti latihan sekarang, duduk atau berbaring, dan tarik napas pelan. Kalau nyeri dada, sesak berat, atau pusing tidak membaik dalam beberapa menit, segera hubungi 119 atau ke IGD terdekat. Jangan lanjut latihan sebelum diperiksa tenaga kesehatan."
      : "Istirahat dulu sebentar. Kalau sudah nyaman, lanjut pakai versi yang lebih ringan di bawah ini. Kalau keluhan berulang, konsultasikan ke dokter atau fisioterapis."
  };
}

// Saran perbaikan posisi tubuh + versi lebih ringan, per pola gerakan dan bagian tubuh
const TABEL_MODIFIKASI = {
  "squat:lutut": [
    "Turun setengah saja (half squat) sampai masih nyaman, jangan dipaksa sampai paha sejajar.",
    "Pakai kursi di belakang (box squat): turun sampai pantat menyentuh kursi, lalu berdiri lagi.",
    "Arahkan lutut searah ujung jari kaki, jangan sampai lutut masuk ke dalam."
  ],
  "squat:punggung-bawah": [
    "Jaga dada tetap terangkat dan punggung lurus, jangan membungkuk.",
    "Kencangkan perut sebelum turun, lalu turun lebih dangkal.",
    "Coba wall squat (bersandar ke tembok) supaya punggung tertopang."
  ],
  "lunge:lutut": [
    "Perpendek langkah dan turun lebih dangkal.",
    "Pegang kursi atau tembok untuk keseimbangan.",
    "Pastikan lutut depan tidak melewati ujung jari kaki terlalu jauh."
  ],
  "lunge:tidak-stabil": [
    "Lakukan lunge di tempat (tanpa melangkah) sambil pegang kursi.",
    "Lebarkan jarak kaki ke samping supaya lebih stabil."
  ],
  "pushup:pergelangan-tangan": [
    "Kepalkan tangan atau pegang dumbbell supaya pergelangan tetap lurus.",
    "Pindah ke incline push-up: tangan di meja atau tembok.",
    "Regangkan pergelangan tangan pelan-pelan sebelum mulai."
  ],
  "pushup:bahu": [
    "Rapatkan siku sekitar 45° dari badan, jangan dibuka lebar.",
    "Pakai knee push-up (lutut di lantai) atau push-up di tembok.",
    "Turun lebih dangkal dulu sampai bahu terbiasa."
  ],
  "pushup:punggung-bawah": [
    "Kencangkan perut dan pantat supaya pinggul tidak turun.",
    "Pakai knee push-up dulu sampai otot inti lebih kuat."
  ],
  "plank:punggung-bawah": [
    "Kencangkan perut dan pantat, jangan biarkan pinggul turun.",
    "Plank dengan lutut di lantai dulu.",
    "Tahan lebih singkat (10–15 detik) tapi posisinya rapi."
  ],
  "plank:bahu": [
    "Pastikan siku tepat di bawah bahu.",
    "Tekan lantai dengan lengan bawah supaya bahu tidak melorot."
  ],
  "plank:tidak-kuat-posisi": [
    "Mulai dari plank lutut atau plank miring di tembok.",
    "Bagi jadi beberapa set pendek, misalnya 3 × 10 detik."
  ],
  "bridge:punggung-bawah": [
    "Angkat pinggul secukupnya sampai lurus dengan paha, jangan melengkung berlebihan.",
    "Remas otot pantat saat di atas, bukan menekan punggung."
  ],
  "bridge:leher": [
    "Tumpukan beban di bahu dan kaki, bukan di leher atau kepala.",
    "Jaga dagu sedikit menunduk dan pandangan ke atas."
  ],
  "curl:siku": [
    "Kurangi beban (botol lebih kecil) dan gerakkan lebih pelan.",
    "Jangan kunci siku sampai lurus penuh di bawah."
  ],
  "curl:punggung-bawah": [
    "Jangan mengayun badan; berdiri tegak atau duduk bersandar.",
    "Kurangi beban sampai bisa mengangkat tanpa ayunan."
  ],
  "cardio:lutut": [
    "Ganti lari atau lompat tali dengan jalan cepat.",
    "Pakai sepatu yang empuk dan pilih permukaan rata."
  ],
  "cardio:pergelangan-kaki": [
    "Ganti ke latihan tanpa benturan, misalnya jalan santai atau sepeda statis.",
    "Pemanasan putar pergelangan kaki sebelum mulai."
  ],
  "cardio:tidak-kuat-posisi": [
    "Turunkan tempo: harus masih bisa ngobrol sambil bergerak.",
    "Selang-seling 1 menit jalan cepat, 1 menit jalan santai."
  ],
  "recovery:punggung-bawah": [
    "Gerakkan lebih kecil dan pelan, ikuti napas.",
    "Taruh bantal di bawah lutut supaya lebih nyaman."
  ]
};

const SARAN_UMUM_BAGIAN = {
  "tidak-kuat-posisi": "Kurangi repetisi atau waktu tahan, lalu tambah sedikit demi sedikit tiap minggu.",
  "tidak-stabil": "Latihan di dekat tembok atau kursi supaya bisa berpegangan.",
  kram: "Minum air, regangkan otot yang kram pelan-pelan, dan istirahat lebih lama antar set."
};

// bagian & jenis berupa daftar. Saran diambil bergiliran supaya tiap pilihan kebagian.
export function saranModifikasi(tipe, bagian, jenis) {
  const perPilihan = bagian.concat(jenis).map(k => TABEL_MODIFIKASI[`${tipe}:${k}`] || []);
  const spesifik = [];
  for (let i = 0; i < 3; i++) perPilihan.forEach(daftar => daftar[i] && spesifik.push(daftar[i]));
  const umum = [
    ...jenis.map(j => SARAN_UMUM_BAGIAN[j]),
    "Tonton video simulasi gerakan ini dan cocokkan posisi tubuhmu pelan-pelan.",
    "Kurangi jumlah repetisi atau set dulu, utamakan posisi yang benar daripada jumlah."
  ].filter(Boolean);
  return [...new Set(spesifik.concat(umum))].slice(0, 4);
}

// ---------- Medical checkup ----------

function angkaDalamRentang(nilai, [min, max]) {
  if (nilai === "" || nilai === null || nilai === undefined) return null;
  const n = Number(nilai);
  return Number.isFinite(n) && n >= min && n <= max ? Math.round(n) : null;
}

export function validasiCheckup(input) {
  const tanggal = String(input.tanggal || "").trim();
  if (!tanggalValid(tanggal)) return { ok: false, pesan: "Isi tanggal medical checkup dulu ya." };

  const data = { id: buatId("checkup"), tanggal, tempat: teksAman(input.tempat, 80) };
  for (const kunci of Object.keys(RENTANG_CHECKUP)) {
    data[kunci] = angkaDalamRentang(input[kunci], RENTANG_CHECKUP[kunci]);
  }
  data.anjuranOlahraga = ANJURAN_OLAHRAGA.some(a => a.id === input.anjuranOlahraga) ? input.anjuranOlahraga : "tidak-ada";
  data.catatanDokter = teksAman(input.catatanDokter, BATAS_KESEHATAN.MAX_CATATAN_DOKTER);
  return { ok: true, data };
}

// ---------- Penyimpanan riwayat ----------

export function tambahKeluhan(riwayat, laporan) {
  return { ...riwayat, keluhan: [laporan, ...riwayat.keluhan].slice(0, BATAS_KESEHATAN.MAX_KELUHAN) };
}

export function tambahCheckup(riwayat, checkup) {
  const urut = [checkup, ...riwayat.checkup].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  return { ...riwayat, checkup: urut.slice(0, BATAS_KESEHATAN.MAX_CHECKUP) };
}

export function hapusEntriKesehatan(riwayat, jenis, id) {
  return { ...riwayat, [jenis]: riwayat[jenis].filter(item => item.id !== id) };
}

const dalamRentangHari = (tanggal, hari) => {
  const selisih = selisihHari(tanggal, hari);
  return selisih >= 0 && selisih <= BATAS_KESEHATAN.HARI_PERINGATAN;
};

export function keluhanTerakhirUntukGerakan(riwayat, namaGerakan, hari) {
  return riwayat.keluhan.find(k => k.gerakan === namaGerakan && dalamRentangHari(k.tanggal, hari)) || null;
}

// ---------- Analisis riwayat (dipakai juga sebagai cadangan kalau AI cloud mati) ----------

function terbanyak(daftar) {
  const hitung = {};
  daftar.forEach(x => { hitung[x] = (hitung[x] || 0) + 1; });
  const [kunci, jumlah] = Object.entries(hitung).sort((a, b) => b[1] - a[1])[0] || [];
  return kunci ? { kunci, jumlah } : null;
}

export function analisisRiwayat(riwayat, hari) {
  const { keluhan, checkup } = riwayat;
  const rekomendasi = [];
  const peringatan = [];

  if (keluhan.length === 0 && checkup.length === 0) {
    return {
      kosong: true,
      totalKeluhan: 0,
      keluhan30Hari: 0,
      bagianTerbanyak: null,
      gerakanTerbanyak: null,
      adaTandaBahaya: false,
      checkupTerakhir: null,
      rekomendasi: [
        "Belum ada catatan. Kalau ada gerakan yang bikin nggak kuat atau sakit, tekan tombol \"Ada keluhan\" di sesi latihan.",
        "Catat hasil medical checkup terakhirmu supaya saran latihan lebih pas."
      ],
      peringatan
    };
  }

  const baru = keluhan.filter(k => dalamRentangHari(k.tanggal, hari));
  const bagian = terbanyak(keluhan.flatMap(k => k.bagianTubuh));
  const gerakan = terbanyak(keluhan.map(k => k.gerakan));
  const adaTandaBahaya = baru.some(k => cekTandaBahaya(k).bahaya);

  if (adaTandaBahaya) {
    peringatan.push("Ada keluhan tanda bahaya (misalnya pusing, sesak, nyeri dada, atau nyeri berat) dalam 30 hari terakhir. Periksakan ke dokter sebelum lanjut latihan berat.");
  }

  if (bagian && bagian.jumlah >= 2) {
    rekomendasi.push(`${labelBagianTubuh(bagian.kunci)} paling sering dikeluhkan (${bagian.jumlah}×). Utamakan versi gerakan yang lebih ringan untuk bagian ini dan jangan dipaksa.`);
  }

  if (gerakan && gerakan.jumlah >= 2) {
    const contoh = keluhan.find(k => k.gerakan === gerakan.kunci);
    const saran = saranModifikasi(contoh.tipeGerakan, contoh.bagianTubuh, contoh.jenis)[0];
    rekomendasi.push(`Gerakan "${gerakan.kunci}" paling sering bermasalah (${gerakan.jumlah}×). ${saran}`);
  } else if (keluhan.length > 0) {
    const k = keluhan[0]; // terbaru
    rekomendasi.push(`Keluhan terakhir di gerakan "${k.gerakan}". ${saranModifikasi(k.tipeGerakan, k.bagianTubuh, k.jenis)[0]}`);
  }

  if (baru.length >= 3) {
    rekomendasi.push(`Ada ${baru.length} keluhan dalam 30 hari terakhir. Kurangi intensitas minggu ini dan tambah hari istirahat.`);
  }

  const terakhir = checkup[0] || null;
  if (terakhir) {
    if ((terakhir.sistolik && terakhir.sistolik >= 140) || (terakhir.diastolik && terakhir.diastolik >= 90)) {
      peringatan.push(`Tekanan darah tercatat tinggi (${terakhir.sistolik || "-"}/${terakhir.diastolik || "-"} mmHg). Hindari menahan napas saat mengangkat beban, pilih intensitas ringan–sedang, dan ikuti arahan dokter.`);
    }
    if (terakhir.gulaDarah && terakhir.gulaDarah >= 126) {
      rekomendasi.push("Gula darah tercatat tinggi. Jangan latihan saat perut kosong, siapkan camilan, dan konsultasikan pola latihan dengan dokter.");
    }
    if (terakhir.detakIstirahat && terakhir.detakIstirahat > 100) {
      rekomendasi.push("Detak jantung istirahat tercatat di atas 100. Mulai dari latihan ringan dan tanyakan ke dokter.");
    }
    if (terakhir.anjuranOlahraga === "istirahat-dulu") {
      peringatan.push("Dokter menganjurkan istirahat olahraga dulu. Ikuti anjuran dokter; GERAK menyarankan cukup peregangan ringan atau jalan santai kalau sudah diizinkan.");
    } else if (terakhir.anjuranOlahraga === "hindari-beban-berat") {
      rekomendasi.push("Sesuai anjuran dokter, hindari beban berat. Pakai berat badan sendiri atau beban ringan saja.");
    } else if (terakhir.anjuranOlahraga === "hindari-benturan") {
      rekomendasi.push("Sesuai anjuran dokter, hindari lompatan. Ganti lompat tali atau lari dengan jalan cepat atau sepeda statis.");
    }
    if (selisihHari(terakhir.tanggal, hari) > 365) {
      rekomendasi.push("Medical checkup terakhirmu sudah lebih dari setahun lalu. Pertimbangkan cek ulang.");
    }
  } else {
    rekomendasi.push("Belum ada data medical checkup. Kalau punya hasilnya, catat supaya analisis lebih lengkap.");
  }

  if (rekomendasi.length === 0) {
    rekomendasi.push("Catatanmu masih aman. Tetap pemanasan, jaga posisi tubuh, dan laporkan kalau ada keluhan baru.");
  }

  return {
    kosong: false,
    totalKeluhan: keluhan.length,
    keluhan30Hari: baru.length,
    bagianTerbanyak: bagian ? { id: bagian.kunci, label: labelBagianTubuh(bagian.kunci), jumlah: bagian.jumlah } : null,
    gerakanTerbanyak: gerakan ? { nama: gerakan.kunci, jumlah: gerakan.jumlah } : null,
    adaTandaBahaya,
    checkupTerakhir: terakhir,
    rekomendasi,
    peringatan
  };
}

// Ringkasan untuk dikirim ke GERAK AI: tanpa nama dan tanpa catatan bebas pengguna
export function buatPromptAnalisisAI(analisis, riwayat) {
  const baris = [
    "Analisis riwayat keluhan latihan dan medical checkup pengguna GERAK berikut.",
    "Beri: (1) kemungkinan penyebab dari sisi posisi tubuh, (2) modifikasi gerakan yang aman, (3) kapan harus ke dokter. Singkat (maksimal 150 kata), poin-poin, bukan diagnosis.",
    `Total keluhan: ${analisis.totalKeluhan} (30 hari terakhir: ${analisis.keluhan30Hari}).`
  ];
  riwayat.keluhan.slice(0, 8).forEach(k => {
    baris.push(`- ${k.tanggal}: ${k.gerakan} | ${gabungLabel(k.bagianTubuh, labelBagianTubuh)} | ${gabungLabel(k.jenis, labelJenisKeluhan)} | ${labelFaseKeluhan(k.fase)} | intensitas ${k.intensitas}/10`);
  });
  const c = analisis.checkupTerakhir;
  if (c) {
    baris.push(`Checkup terakhir ${c.tanggal}: tensi ${c.sistolik || "-"}/${c.diastolik || "-"}, detak istirahat ${c.detakIstirahat || "-"}, gula darah puasa ${c.gulaDarah || "-"}, kolesterol ${c.kolesterol || "-"}, anjuran dokter: ${labelAnjuran(c.anjuranOlahraga)}.`);
  }
  return baris.join("\n").slice(0, 1400);
}