// =========================================
// GERAK - tests/ayo-mulai.test.js
// Unit testing untuk modul AYO MULAI, perhitungan umur otomatis,
// aturan kunci tinggi & kelamin, serta formula ekuivalen energi
// =========================================

import test from "node:test";
import assert from "node:assert/strict";

import {
  hitungUmurDariTanggalLahir,
  apakahTinggiDikunci,
  hitungEkuivalenEnergi
} from "../js/gizi.js";
import { hitungProgresAyoMulai } from "../js/ayo-mulai.js";

test("hitungUmurDariTanggalLahir: Menghitung umur otomatis tepat pada hari ulang tahun", () => {
  // Lahir 15 Mei 2000
  const tglLahir = "2000-05-15";

  // Kasus 1: Tepat hari H ulang tahun (15 Mei 2026) -> Umur genap 26
  const umurHariH = hitungUmurDariTanggalLahir(tglLahir, new Date("2026-05-15T00:00:00"));
  assert.strictEqual(umurHariH, 26);

  // Kasus 2: Sehari sebelum ulang tahun (14 Mei 2026) -> Masih 25 tahun
  const umurSebelum = hitungUmurDariTanggalLahir(tglLahir, new Date("2026-05-14T23:59:59"));
  assert.strictEqual(umurSebelum, 25);

  // Kasus 3: Sehari setelah ulang tahun (16 Mei 2026) -> Sudah 26 tahun
  const umurSetelah = hitungUmurDariTanggalLahir(tglLahir, new Date("2026-05-16T00:00:00"));
  assert.strictEqual(umurSetelah, 26);

  // Kasus 4: Pergantian tahun kalender (1 Januari 2026) tapi ulang tahun belum tiba -> Masih 25 tahun
  const umurAwalTahun = hitungUmurDariTanggalLahir(tglLahir, new Date("2026-01-01T00:00:00"));
  assert.strictEqual(umurAwalTahun, 25);

  // Kasus 5: Input tidak valid mengembalikan null
  assert.strictEqual(hitungUmurDariTanggalLahir(""), null);
  assert.strictEqual(hitungUmurDariTanggalLahir(null), null);
  assert.strictEqual(hitungUmurDariTanggalLahir("bukan-tanggal"), null);
});

test("apakahTinggiDikunci: Aturan kunci tinggi badan berdasarkan jenis kelamin dan batas usia", () => {
  // Aturan Wanita: dapat memperbarui sampai < 18 tahun, >= 18 tahun dikunci
  assert.strictEqual(apakahTinggiDikunci("wanita", 17), false, "Wanita 17 th masih bisa update");
  assert.strictEqual(apakahTinggiDikunci("wanita", 17.9), false, "Wanita 17.9 th masih bisa update");
  assert.strictEqual(apakahTinggiDikunci("wanita", 18), true, "Wanita 18 th dikunci");
  assert.strictEqual(apakahTinggiDikunci("wanita", 25), true, "Wanita 25 th dikunci");

  // Aturan Pria: dapat memperbarui sampai < 21 tahun, >= 21 tahun dikunci
  assert.strictEqual(apakahTinggiDikunci("pria", 20), false, "Pria 20 th masih bisa update");
  assert.strictEqual(apakahTinggiDikunci("pria", 20.9), false, "Pria 20.9 th masih bisa update");
  assert.strictEqual(apakahTinggiDikunci("pria", 21), true, "Pria 21 th dikunci");
  assert.strictEqual(apakahTinggiDikunci("pria", 30), true, "Pria 30 th dikunci");

  // Input invalid
  assert.strictEqual(apakahTinggiDikunci("pria", NaN), false);
  assert.strictEqual(apakahTinggiDikunci("alien", 25), false);
});

test("hitungEkuivalenEnergi: Formula |deltaW| * 7.700 kkal dan penentuan arah", () => {
  // Contoh spesifikasi 1: 98 kg -> 98 kg (delta 0, 0 kkal, tetap)
  const hasil0 = hitungEkuivalenEnergi(98, 98);
  assert.strictEqual(hasil0.perubahanKg, 0);
  assert.strictEqual(hasil0.arah, "tetap");
  assert.strictEqual(hasil0.ekuivalenKalori, 0);

  // Contoh spesifikasi 2: 98 kg -> 97 kg (turun 1 kg, ~7.700 kkal)
  const hasilTurun = hitungEkuivalenEnergi(98, 97);
  assert.strictEqual(hasilTurun.perubahanKg, -1);
  assert.strictEqual(hasilTurun.arah, "turun");
  assert.strictEqual(hasilTurun.ekuivalenKalori, 7700);

  // Contoh spesifikasi 3: 98 kg -> 99 kg (naik 1 kg, ~7.700 kkal)
  const hasilNaik = hitungEkuivalenEnergi(98, 99);
  assert.strictEqual(hasilNaik.perubahanKg, 1);
  assert.strictEqual(hasilNaik.arah, "naik");
  assert.strictEqual(hasilNaik.ekuivalenKalori, 7700);

  // Contoh pecahan: 80 kg -> 78.5 kg (turun 1.5 kg, 1.5 * 7700 = 11.550 kkal)
  const hasilPecahan = hitungEkuivalenEnergi(80, 78.5);
  assert.strictEqual(hasilPecahan.perubahanKg, -1.5);
  assert.strictEqual(hasilPecahan.arah, "turun");
  assert.strictEqual(hasilPecahan.ekuivalenKalori, 11550);

  // Penanganan input tepi / kosong
  const hasilKosong = hitungEkuivalenEnergi(null, null);
  assert.strictEqual(hasilKosong.ekuivalenKalori, 0);
  assert.strictEqual(hasilKosong.teksPerubahan, "-");
});

test("hitungProgresAyoMulai: Ekstraksi metrik progres, 3 sumber aktivitas, dan separasi berat awal vs terbaru", () => {
  const dummyState = {
    data: {
      akun: {
        nama: "Alex",
        beratBadanAwal: 98,
        beratBadan: 95,
        tanggalBeratAwal: "2026-01-01",
        tanggalCatatBerat: "2026-02-15",
        target: "diet"
      },
      profilGizi: {
        target: "diet",
        kalori: 1850,
        protein: 176,
        karbo: 150,
        lemak: 51
      },
      sesiWorkoutSelesai: 4,
      kegiatanBersamaSelesai: 2
    }
  };

  const progres = hitungProgresAyoMulai(dummyState);

  // Separasi berat awal vs terbaru terjaga
  assert.strictEqual(progres.beratAwal, 98);
  assert.strictEqual(progres.beratTerbaru, 95);
  assert.strictEqual(progres.target, "diet");
  assert.strictEqual(progres.hasilEkuivalen.perubahanKg, -3);
  assert.strictEqual(progres.hasilEkuivalen.arah, "turun");
  assert.strictEqual(progres.hasilEkuivalen.ekuivalenKalori, 3 * 7700); // 23.100 kkal

  // 3 sumber aktivitas
  assert.strictEqual(progres.kaloriTarget, 1850);
  assert.strictEqual(progres.sesiWorkout, 4);
  assert.strictEqual(progres.kegiatanKawan, 2);
});

test("Mode Jaga Berat Badan: Tidak menampilkan tujuan penurunan/kenaikan sebagai fokus", () => {
  const dummyStateJaga = {
    data: {
      akun: {
        nama: "Siti",
        beratBadanAwal: 60,
        beratBadan: 60,
        target: "jaga"
      },
      profilGizi: {
        target: "jaga",
        kalori: 2000
      }
    }
  };

  const progres = hitungProgresAyoMulai(dummyStateJaga);
  assert.strictEqual(progres.target, "jaga");
  assert.strictEqual(progres.kaloriTarget, 2000);
});