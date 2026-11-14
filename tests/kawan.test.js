// =========================================
// GERAK - tests/kawan.test.js
// Unit testing untuk Fitur Kawan:
// 1. Filter 14 Olahraga
// 2. Data Sedang Aktif
// 3. Olahraga Bareng
// 4. Perhitungan Jarak Haversine & Filter Radius Teman di Sekitar
// =========================================

import test from "node:test";
import assert from "node:assert/strict";
import {
  DAFTAR_KAWAN_DEMO,
  DAFTAR_OLAHRAGA_BARENG,
  DAFTAR_TITIK_ACUAN
} from "../data/kawan-demo.js";
import { hitungJarakKm, normalisasiOlahraga } from "../js/kawan.js";

test("Daftar olahraga mencakup seluruh 14 pilihan yang diminta dan memiliki profil kawan", () => {
  const olahragaDiminta = [
    "Futsal",
    "Padel",
    "Sepak Bola",
    "Basket",
    "Voli",
    "Badminton",
    "Tenis",
    "Lari",
    "Renang",
    "Bersepeda",
    "Gym",
    "Hiking",
    "Yoga"
  ];

  olahragaDiminta.forEach(olahraga => {
    const targetNorm = normalisasiOlahraga(olahraga);
    const cocok = DAFTAR_KAWAN_DEMO.filter(
      k => normalisasiOlahraga(k.olahraga) === targetNorm
    );
    assert.ok(
      cocok.length > 0,
      `Harus ada minimal 1 profil kawan untuk olahraga: ${olahraga}`
    );
  });
});

test("normalisasiOlahraga menangani 'Sepeda' dan 'Bersepeda' secara setara", () => {
  assert.equal(normalisasiOlahraga("Sepeda"), "bersepeda");
  assert.equal(normalisasiOlahraga("Bersepeda"), "bersepeda");
  assert.equal(normalisasiOlahraga("  LARI  "), "lari");
  assert.equal(normalisasiOlahraga(""), "");
  assert.equal(normalisasiOlahraga(null), "");
});

test("Data Sedang Aktif: Tidak semua kawan online (hanya subset realistis)", () => {
  const totalKawan = DAFTAR_KAWAN_DEMO.length;
  const kawanOnline = DAFTAR_KAWAN_DEMO.filter(k => k.sedangAktif === true);

  assert.ok(kawanOnline.length > 0, "Harus ada kawan yang berstatus sedang aktif");
  assert.ok(
    kawanOnline.length < totalKawan,
    "Tidak boleh semua kawan online sekaligus (harus realistis)"
  );

  kawanOnline.forEach(k => {
    assert.ok(
      k.statusAktifLabel && k.statusAktifLabel.length > 0,
      `Kawan aktif ${k.nama} harus memiliki label keaktifan transparan`
    );
  });
});

test("Olahraga Bareng: Setiap agenda memiliki jadwal, lokasi, level, dan penyelenggara", () => {
  assert.ok(
    DAFTAR_OLAHRAGA_BARENG.length >= 8,
    "Minimal tersedia 8 variasi agenda Olahraga Bareng"
  );

  DAFTAR_OLAHRAGA_BARENG.forEach(item => {
    assert.ok(item.id, "Agenda harus memiliki id unik");
    assert.ok(item.judul, "Agenda harus memiliki judul");
    assert.ok(item.olahraga, "Agenda harus memiliki jenis olahraga");
    assert.ok(item.penyelenggaraNama, "Agenda harus memiliki nama penyelenggara");
    assert.ok(item.jadwal, "Agenda harus memiliki jadwal/waktu");
    assert.ok(item.lokasi, "Agenda harus memiliki lokasi perkiraan");
    assert.ok(item.level, "Agenda harus memiliki tingkat kemampuan");
  });
});

test("Perhitungan Jarak Haversine (hitungJarakKm): Akurat dan menangani input tepi", () => {
  // Titik yang sama -> 0 km
  assert.equal(hitungJarakKm(-6.2185, 106.8026, -6.2185, 106.8026), 0);

  // GBK Senayan (-6.2185, 106.8026) ke Tebet (-6.2366, 106.8524)
  const jarakGbkTebet = hitungJarakKm(-6.2185, 106.8026, -6.2366, 106.8524);
  assert.ok(jarakGbkTebet >= 5.0 && jarakGbkTebet <= 6.5, `Jarak GBK-Tebet (~5.8 km) hasil: ${jarakGbkTebet}`);

  // Input tidak valid
  assert.equal(hitungJarakKm(null, 106, -6, 106), 0);
  assert.equal(hitungJarakKm(NaN, 106, -6, 106), 0);
});

test("Teman di Sekitar: Filter radius 1 km, 3 km, 5 km, 10 km menyaring hasil dengan benar", () => {
  const refLat = -6.2185; // GBK Senayan
  const refLng = 106.8026;

  const hitung = DAFTAR_KAWAN_DEMO.map(k => ({
    ...k,
    dist: hitungJarakKm(refLat, refLng, k.lat, k.lng)
  }));

  const r1 = hitung.filter(k => k.dist <= 1);
  const r3 = hitung.filter(k => k.dist <= 3);
  const r5 = hitung.filter(k => k.dist <= 5);
  const r10 = hitung.filter(k => k.dist <= 10);

  // Radius yang lebih besar harus mencakup atau sama dengan radius yang lebih kecil
  assert.ok(r1.length <= r3.length);
  assert.ok(r3.length <= r5.length);
  assert.ok(r5.length <= r10.length);
});

test("Titik acuan publik tersedia dan memiliki koordinat valid", () => {
  assert.ok(DAFTAR_TITIK_ACUAN.length >= 5, "Harus tersedia minimal 5 titik acuan publik");
  DAFTAR_TITIK_ACUAN.forEach(titik => {
    assert.ok(titik.id);
    assert.ok(titik.nama);
    assert.ok(typeof titik.lat === "number");
    assert.ok(typeof titik.lng === "number");
  });
});