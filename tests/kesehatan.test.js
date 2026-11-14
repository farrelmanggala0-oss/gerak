// =========================================
// GERAK - tests/kesehatan.test.js
// Uji unit Riwayat Kesehatan (keluhan latihan & medical checkup) dan panduan video simulasi
// =========================================

import test from "node:test";
import assert from "node:assert/strict";
import {
  BATAS_KESEHATAN,
  validasiLaporanKeluhan,
  cekTandaBahaya,
  saranModifikasi,
  validasiCheckup,
  tambahKeluhan,
  tambahCheckup,
  hapusEntriKesehatan,
  keluhanTerakhirUntukGerakan,
  analisisRiwayat,
  buatPromptAnalisisAI,
  ringkasKeluhan,
  riwayatKosong
} from "../js/kesehatan.js";
import { PANDUAN_SIMULASI, dapatkanPanduanSimulasi } from "../data/panduan-simulasi.js";
import { migrasiSkemaData, DATA_DEFAULT } from "../js/penyimpanan.js";

const HARI = "2026-11-10";

function laporanContoh(ubah = {}) {
  return {
    gerakan: "Bodyweight Squat",
    tipeGerakan: "squat",
    bagianTubuh: ["lutut"],
    jenis: ["nyeri"],
    fase: "saat-turun",
    intensitas: 4,
    catatan: "Lutut kanan nyut-nyutan pas turun",
    ...ubah
  };
}

// ---------- Laporan keluhan ----------

test("Laporan keluhan valid disimpan lengkap dengan id dan tanggal", () => {
  const hasil = validasiLaporanKeluhan(laporanContoh(), HARI);
  assert.equal(hasil.ok, true);
  assert.equal(hasil.data.tanggal, HARI);
  assert.deepEqual(hasil.data.bagianTubuh, ["lutut"]);
  assert.equal(hasil.data.intensitas, 4);
  assert.ok(hasil.data.id);
});

test("Laporan tanpa bagian tubuh atau jenis keluhan ditolak dengan pesan", () => {
  assert.equal(validasiLaporanKeluhan(laporanContoh({ bagianTubuh: [] }), HARI).ok, false);
  const tanpaJenis = validasiLaporanKeluhan(laporanContoh({ jenis: ["asal"] }), HARI);
  assert.equal(tanpaJenis.ok, false);
  assert.ok(tanpaJenis.pesan.length > 0);
});

test("Intensitas dibatasi 1-10 dan catatan dipotong sesuai batas", () => {
  const tinggi = validasiLaporanKeluhan(laporanContoh({ intensitas: 99 }), HARI);
  assert.equal(tinggi.data.intensitas, 10);
  const rendah = validasiLaporanKeluhan(laporanContoh({ intensitas: -3 }), HARI);
  assert.equal(rendah.data.intensitas, 1);
  const panjang = validasiLaporanKeluhan(laporanContoh({ catatan: "a".repeat(1000) }), HARI);
  assert.equal(panjang.data.catatan.length, BATAS_KESEHATAN.MAX_CATATAN);
});

test("Bisa pilih lebih dari satu bagian tubuh dan jenis keluhan (urut, tanpa dobel, yang asal dibuang)", () => {
  const hasil = validasiLaporanKeluhan(laporanContoh({ bagianTubuh: ["bahu", "lutut", "asal", "bahu"], jenis: ["tidak-stabil", "nyeri"] }), HARI);
  assert.equal(hasil.ok, true);
  assert.deepEqual(hasil.data.bagianTubuh, ["lutut", "bahu"]);
  assert.deepEqual(hasil.data.jenis, ["nyeri", "tidak-stabil"]);
});

test("Ringkasan keluhan menyebut semua pilihan", () => {
  const k = validasiLaporanKeluhan(laporanContoh({ bagianTubuh: ["lutut", "bahu"], jenis: ["nyeri", "tidak-stabil"] }), HARI).data;
  assert.equal(ringkasKeluhan(k), "Nyeri / sakit, Goyah / nggak seimbang di lutut, bahu");
});

// ---------- Tanda bahaya ----------

test("Nyeri dada, pusing, sesak, dan kesemutan dianggap tanda bahaya", () => {
  for (const jenis of ["nyeri-dada", "pusing", "sesak", "kesemutan"]) {
    assert.equal(cekTandaBahaya(laporanContoh({ jenis: [jenis], intensitas: 2 })).bahaya, true, jenis);
  }
});

test("Satu jenis bahaya di antara pilihan lain tetap dianggap bahaya", () => {
  assert.equal(cekTandaBahaya(laporanContoh({ jenis: ["nyeri", "nyeri-dada"], intensitas: 2 })).bahaya, true);
});

test("Nyeri dengan intensitas 8 ke atas dianggap tanda bahaya", () => {
  assert.equal(cekTandaBahaya(laporanContoh({ intensitas: 8 })).bahaya, true);
});

test("Nyeri ringan atau nggak kuat tahan posisi tidak dianggap bahaya", () => {
  assert.equal(cekTandaBahaya(laporanContoh({ intensitas: 3 })).bahaya, false);
  assert.equal(cekTandaBahaya(laporanContoh({ jenis: ["tidak-kuat-posisi"], intensitas: 6 })).bahaya, false);
});

test("Pesan tanda bahaya menyuruh berhenti dan menyebut layanan darurat", () => {
  const hasil = cekTandaBahaya(laporanContoh({ jenis: ["nyeri-dada"] }));
  assert.match(hasil.pesan, /berhenti/i);
  assert.match(hasil.pesan, /119/);
});

// ---------- Saran modifikasi ----------

test("Saran modifikasi squat + lutut berisi versi lebih ringan", () => {
  const saran = saranModifikasi("squat", ["lutut"], []);
  assert.ok(saran.length >= 2);
  assert.ok(saran.some(s => /setengah|kursi/i.test(s)));
});

test("Kombinasi yang tidak dikenal tetap dapat saran umum yang aman", () => {
  const saran = saranModifikasi("tidak-ada", ["lainnya"], []);
  assert.ok(saran.length >= 2);
});

test("Saran mencakup setiap bagian tubuh yang dipilih", () => {
  const saran = saranModifikasi("pushup", ["bahu", "pergelangan-tangan"], ["nyeri"]);
  assert.ok(saran.length <= 4);
  assert.ok(saran.some(s => /Rapatkan siku/.test(s)), "saran bahu");
  assert.ok(saran.some(s => /Kepalkan tangan/.test(s)), "saran pergelangan tangan");
});

// ---------- Medical checkup ----------

test("Checkup wajib punya tanggal yang valid", () => {
  assert.equal(validasiCheckup({ tanggal: "" }).ok, false);
  assert.equal(validasiCheckup({ tanggal: "bukan-tanggal" }).ok, false);
  assert.equal(validasiCheckup({ tanggal: "2026-10-01" }).ok, true);
});

test("Angka checkup di luar rentang wajar dikosongkan, bukan disimpan asal", () => {
  const hasil = validasiCheckup({ tanggal: "2026-10-01", sistolik: 999, diastolik: 80, gulaDarah: "abc", detakIstirahat: 70 });
  assert.equal(hasil.data.sistolik, null);
  assert.equal(hasil.data.diastolik, 80);
  assert.equal(hasil.data.gulaDarah, null);
  assert.equal(hasil.data.detakIstirahat, 70);
});

test("Catatan dokter dipotong sesuai batas", () => {
  const hasil = validasiCheckup({ tanggal: "2026-10-01", catatanDokter: "b".repeat(2000) });
  assert.equal(hasil.data.catatanDokter.length, BATAS_KESEHATAN.MAX_CATATAN_DOKTER);
});

// ---------- Penyimpanan riwayat ----------

test("Keluhan terbaru di urutan pertama dan jumlahnya dibatasi", () => {
  let riwayat = riwayatKosong();
  for (let i = 0; i < BATAS_KESEHATAN.MAX_KELUHAN + 5; i++) {
    riwayat = tambahKeluhan(riwayat, { ...validasiLaporanKeluhan(laporanContoh(), HARI).data, id: `k${i}` });
  }
  assert.equal(riwayat.keluhan.length, BATAS_KESEHATAN.MAX_KELUHAN);
  assert.equal(riwayat.keluhan[0].id, `k${BATAS_KESEHATAN.MAX_KELUHAN + 4}`);
});

test("Checkup diurutkan dari tanggal terbaru", () => {
  let riwayat = riwayatKosong();
  riwayat = tambahCheckup(riwayat, validasiCheckup({ tanggal: "2026-01-05" }).data);
  riwayat = tambahCheckup(riwayat, validasiCheckup({ tanggal: "2026-09-01" }).data);
  riwayat = tambahCheckup(riwayat, validasiCheckup({ tanggal: "2026-03-10" }).data);
  assert.deepEqual(riwayat.checkup.map(c => c.tanggal), ["2026-09-01", "2026-03-10", "2026-01-05"]);
});

test("Entri bisa dihapus berdasarkan id", () => {
  let riwayat = tambahKeluhan(riwayatKosong(), { ...validasiLaporanKeluhan(laporanContoh(), HARI).data, id: "hapus-aku" });
  riwayat = hapusEntriKesehatan(riwayat, "keluhan", "hapus-aku");
  assert.equal(riwayat.keluhan.length, 0);
});

test("Keluhan terakhir per gerakan hanya dihitung dalam 30 hari", () => {
  let riwayat = riwayatKosong();
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh(), "2026-09-01").data);
  assert.equal(keluhanTerakhirUntukGerakan(riwayat, "Bodyweight Squat", HARI), null);
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh(), "2026-11-05").data);
  assert.equal(keluhanTerakhirUntukGerakan(riwayat, "Bodyweight Squat", HARI).tanggal, "2026-11-05");
  assert.equal(keluhanTerakhirUntukGerakan(riwayat, "Plank Hold", HARI), null);
});

// ---------- Analisis riwayat ----------

test("Analisis riwayat kosong memberi tahu cara mulai", () => {
  const analisis = analisisRiwayat(riwayatKosong(), HARI);
  assert.equal(analisis.kosong, true);
  assert.ok(analisis.rekomendasi.length > 0);
});

test("Analisis menemukan bagian tubuh dan gerakan yang paling sering dikeluhkan", () => {
  let riwayat = riwayatKosong();
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh(), "2026-11-01").data);
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh(), "2026-11-03").data);
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh({ gerakan: "Plank Hold", tipeGerakan: "plank", bagianTubuh: ["punggung-bawah"] }), "2026-11-04").data);
  const analisis = analisisRiwayat(riwayat, HARI);
  assert.equal(analisis.kosong, false);
  assert.equal(analisis.totalKeluhan, 3);
  assert.equal(analisis.bagianTerbanyak.id, "lutut");
  assert.equal(analisis.bagianTerbanyak.jumlah, 2);
  assert.equal(analisis.gerakanTerbanyak.nama, "Bodyweight Squat");
});

test("Satu laporan saja tidak disebut 'paling sering', tapi tetap dapat saran untuk gerakan terakhir", () => {
  let riwayat = riwayatKosong();
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh(), "2026-11-01").data);
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh({ gerakan: "Plank Hold", tipeGerakan: "plank", bagianTubuh: ["punggung-bawah"] }), "2026-11-04").data);
  const teks = analisisRiwayat(riwayat, HARI).rekomendasi.join(" ");
  assert.doesNotMatch(teks, /paling sering/i);
  assert.match(teks, /Plank Hold/);
});

test("Bagian tubuh tersering menghitung setiap bagian yang dipilih", () => {
  let riwayat = riwayatKosong();
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh({ bagianTubuh: ["bahu", "lutut"] }), "2026-11-01").data);
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh({ gerakan: "Push-Up", bagianTubuh: ["lutut"] }), "2026-11-02").data);
  const analisis = analisisRiwayat(riwayat, HARI);
  assert.equal(analisis.bagianTerbanyak.id, "lutut");
  assert.equal(analisis.bagianTerbanyak.jumlah, 2);
  assert.match(buatPromptAnalisisAI(analisis, riwayat), /Lutut, Bahu/);
});

test("Tekanan darah tinggi dan anjuran istirahat dari dokter masuk ke rekomendasi", () => {
  let riwayat = riwayatKosong();
  riwayat = tambahCheckup(riwayat, validasiCheckup({ tanggal: "2026-10-20", sistolik: 150, diastolik: 95, anjuranOlahraga: "istirahat-dulu" }).data);
  const analisis = analisisRiwayat(riwayat, HARI);
  const semua = analisis.rekomendasi.concat(analisis.peringatan).join(" ");
  assert.match(semua, /tekanan darah/i);
  assert.match(semua, /dokter/i);
});

test("Keluhan bahaya dalam 30 hari terakhir ditandai di analisis", () => {
  const riwayat = tambahKeluhan(riwayatKosong(), validasiLaporanKeluhan(laporanContoh({ jenis: ["pusing"] }), "2026-11-08").data);
  assert.equal(analisisRiwayat(riwayat, HARI).adaTandaBahaya, true);
});

test("Prompt AI ringkas, tanpa nama pengguna, dan memuat ringkasan keluhan", () => {
  let riwayat = riwayatKosong();
  riwayat = tambahKeluhan(riwayat, validasiLaporanKeluhan(laporanContoh({ catatan: "Namaku Vito, lututku sakit" }), "2026-11-05").data);
  const prompt = buatPromptAnalisisAI(analisisRiwayat(riwayat, HARI), riwayat);
  assert.ok(prompt.length <= 1400);
  assert.match(prompt, /lutut/i);
  assert.match(prompt, /Bodyweight Squat/);
  assert.doesNotMatch(prompt, /Vito/);
});

// ---------- Panduan video simulasi ----------

test("Setiap pola gerakan punya video, poster, langkah, larangan, versi ringan, dan fase yang urut", () => {
  const pola = ["squat", "lunge", "pushup", "plank", "bridge", "curl", "recovery", "cardio"];
  for (const tipe of pola) {
    const p = PANDUAN_SIMULASI[tipe];
    assert.ok(p, tipe);
    assert.match(p.video, /^assets\/workout\/simulasi\/.+\.mp4$/);
    assert.match(p.poster, /^assets\/workout\/simulasi\/.+\.jpg$/);
    assert.ok(p.langkah.length >= 3, tipe);
    assert.ok(p.hindari.length >= 2, tipe);
    assert.ok(p.versiRingan.length > 0, tipe);
    let akhirSebelumnya = 0;
    for (const f of p.fase) {
      assert.ok(f.mulai >= akhirSebelumnya && f.akhir > f.mulai && f.akhir <= 4, `${tipe} ${f.label}`);
      akhirSebelumnya = f.akhir;
    }
  }
});

test("Pola yang tidak dikenal memakai panduan cardio sebagai cadangan", () => {
  assert.equal(dapatkanPanduanSimulasi("asal"), PANDUAN_SIMULASI.cardio);
});

// ---------- Migrasi data ----------

test("Data lama tanpa riwayat kesehatan otomatis dapat struktur kosong", () => {
  const data = migrasiSkemaData({ poin: 10 }, DATA_DEFAULT);
  assert.deepEqual(data.riwayatKesehatan, { keluhan: [], checkup: [] });
});

test("Riwayat kesehatan yang rusak diperbaiki saat migrasi", () => {
  const data = migrasiSkemaData({ riwayatKesehatan: { keluhan: "rusak" } }, DATA_DEFAULT);
  assert.ok(Array.isArray(data.riwayatKesehatan.keluhan));
  assert.ok(Array.isArray(data.riwayatKesehatan.checkup));
});

test("Keluhan lama (satu pilihan berupa teks) diubah jadi daftar saat migrasi", () => {
  const data = migrasiSkemaData({ riwayatKesehatan: { keluhan: [{ id: "lama", bagianTubuh: "lutut", jenis: "nyeri" }], checkup: [] } }, DATA_DEFAULT);
  assert.deepEqual(data.riwayatKesehatan.keluhan[0].bagianTubuh, ["lutut"]);
  assert.deepEqual(data.riwayatKesehatan.keluhan[0].jenis, ["nyeri"]);
});