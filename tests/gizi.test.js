// =========================================
// GERAK - tests/gizi.test.js
// Uji unit kalkulator gizi aman
// =========================================

import test from "node:test";
import assert from "node:assert/strict";
import { hitungKebutuhan, hitungBMI } from "../js/gizi.js";

test("Kasus A: Pria 20 th, 60 kg, 168 cm, x1.375, jaga", () => {
  const hasil = hitungKebutuhan({
    kelamin: "pria",
    umur: 20,
    berat: 60,
    tinggi: 168,
    aktivitas: 1.375,
    target: "jaga"
  });

  assert.equal(hasil.status, "ok");
  assert.equal(hasil.kalori, 2138);
  assert.equal(hasil.protein, 72);
  assert.equal(hasil.lemak, 59);
  assert.equal(hasil.karbo, 330);
});

test("Kasus B: Wanita 30 th, 55 kg, 160 cm, x1.2, diet (dinaikkan ke batas aman 1200)", () => {
  const hasil = hitungKebutuhan({
    kelamin: "wanita",
    umur: 30,
    berat: 55,
    tinggi: 160,
    aktivitas: 1.2,
    target: "diet"
  });

  assert.equal(hasil.status, "ok-dinaikkan");
  assert.equal(hasil.kalori, 1200);
  assert.equal(hasil.protein, 99);
  assert.equal(hasil.lemak, 33);
  assert.equal(hasil.karbo, 127);
  assert.match(hasil.catatan, /Angka dinaikkan ke batas minimum aman/);
});

test("Kasus C: Pria 22 th, 70 kg, 175 cm, x1.55, bulking", () => {
  const hasil = hitungKebutuhan({
    kelamin: "pria",
    umur: 22,
    berat: 70,
    tinggi: 175,
    aktivitas: 1.55,
    target: "bulking"
  });

  assert.equal(hasil.status, "ok");
  assert.equal(hasil.kalori, 2918);
  assert.equal(hasil.protein, 126);
  assert.equal(hasil.lemak, 81);
  assert.equal(hasil.karbo, 421);
});

test("Kasus D: Wanita 16 th, 40 kg, 150 cm, x1.2, diet (diblokir karena usia < 18)", () => {
  const hasil = hitungKebutuhan({
    kelamin: "wanita",
    umur: 16,
    berat: 40,
    tinggi: 150,
    aktivitas: 1.2,
    target: "diet"
  });

  assert.equal(hasil.status, "diblokir");
  assert.equal(hasil.kalori, null);
  assert.notEqual(hasil.kalori, 916); // angka berbahaya lama tidak boleh muncul
  assert.match(hasil.catatan, /di bawah 18 tahun/);
});

test("Kasus E: Wanita 25 th, 40 kg, 155 cm, x1.375, diet (diblokir karena BMI underweight)", () => {
  const hasil = hitungKebutuhan({
    kelamin: "wanita",
    umur: 25,
    berat: 40,
    tinggi: 155,
    aktivitas: 1.375,
    target: "diet"
  });

  assert.equal(hasil.status, "diblokir");
  assert.equal(hasil.kalori, null);
  assert.equal(hasil.bmi, 16.6);
  assert.match(hasil.catatan, /di bawah rentang berat badan sehat/);
});

test("Kasus F: Wanita 17 th, 50 kg, 160 cm, x1.375, jaga (boleh dengan label perkiraan kasar)", () => {
  const hasil = hitungKebutuhan({
    kelamin: "wanita",
    umur: 17,
    berat: 50,
    tinggi: 160,
    aktivitas: 1.375,
    target: "jaga"
  });

  assert.equal(hasil.status, "ok");
  assert.equal(hasil.kalori, 1724);
  assert.equal(hasil.protein, 60);
  assert.equal(hasil.lemak, 48);
  assert.equal(hasil.karbo, 263);
  assert.match(hasil.catatan, /perkiraan kasar/);
});

test("Kasus G: Pria 35 th, 90 kg, 175 cm, x1.2, diet", () => {
  const hasil = hitungKebutuhan({
    kelamin: "pria",
    umur: 35,
    berat: 90,
    tinggi: 175,
    aktivitas: 1.2,
    target: "diet"
  });

  assert.equal(hasil.status, "ok");
  assert.equal(hasil.kalori, 1789);
  assert.equal(hasil.protein, 162);
  assert.equal(hasil.lemak, 50);
  assert.equal(hasil.karbo, 173);
});

test("Kasus Tepi: Umur 17 vs 18 untuk Diet", () => {
  // Umur 17 th -> diblokir
  const hasil17 = hitungKebutuhan({
    kelamin: "wanita",
    umur: 17,
    berat: 55,
    tinggi: 160,
    aktivitas: 1.375,
    target: "diet"
  });
  assert.equal(hasil17.status, "diblokir");

  // Umur 18 th, BMI sehat (21.5) -> ok
  const hasil18 = hitungKebutuhan({
    kelamin: "wanita",
    umur: 18,
    berat: 55,
    tinggi: 160,
    aktivitas: 1.375,
    target: "diet"
  });
  assert.equal(hasil18.status, "ok");
});

test("Kasus Tepi: BMI 18.4 (diblokir) vs BMI 18.5 (diizinkan)", () => {
  // Tinggi 160 cm, berat 47.1 kg -> BMI 18.4
  const hasil18_4 = hitungKebutuhan({
    kelamin: "wanita",
    umur: 22,
    berat: 47.1,
    tinggi: 160,
    aktivitas: 1.375,
    target: "diet"
  });
  assert.equal(hasil18_4.status, "diblokir");

  // Tinggi 160 cm, berat 47.4 kg -> BMI 18.5 (dengan aktivitas 1.2 diet jatuh di bawah 1200)
  const hasil18_5 = hitungKebutuhan({
    kelamin: "wanita",
    umur: 22,
    berat: 47.4,
    tinggi: 160,
    aktivitas: 1.2,
    target: "diet"
  });
  assert.equal(hasil18_5.status, "ok-dinaikkan"); // dinaikkan ke batas aman 1200
  assert.equal(hasil18_5.kalori, 1200);
});

test("Kasus Tepi: Input kosong / NaN / negatif", () => {
  const hasilNaN = hitungKebutuhan({
    kelamin: "pria",
    umur: "bukanAngka",
    berat: -50,
    tinggi: 0,
    aktivitas: 1.2,
    target: "jaga"
  });
  assert.equal(hasilNaN.status, "diblokir");
  assert.equal(hasilNaN.kalori, null);
  assert.ok(hasilNaN.errors.umur);
  assert.ok(hasilNaN.errors.berat);
  assert.ok(hasilNaN.errors.tinggi);
});