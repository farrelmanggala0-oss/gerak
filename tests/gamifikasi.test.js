// =========================================
// GERAK - tests/gamifikasi.test.js
// Uji unit sistem streak, jatah istirahat, dan anti-farming XP
// =========================================

import test from "node:test";
import assert from "node:assert/strict";
import { evaluasiStreak, prosesCheckin, tambahXPAman, hitungInfoLevel } from "../js/gamifikasi.js";

test("Check-in pertama kali berhasil dan menambah XP", () => {
  const data = {
    streak: 0,
    terakhirCheckin: "",
    tanggalCheckin: [],
    xp: 0,
    sisaJatahIstirahat: 1,
    aktivitasCheckin: {},
    xpHarian: { tanggal: "2026-10-25", checkin: false, jurnal: 0, ajakan: 0, kawanDiajak: [] }
  };

  const res = prosesCheckin(data, ["gerak", "minum_air"], "2026-10-25");
  assert.equal(res.sukses, true);
  assert.equal(data.streak, 1);
  assert.equal(data.xp, 20);
  assert.equal(data.terakhirCheckin, "2026-10-25");
});

test("Check-in dua kali di hari yang sama ditolak", () => {
  const data = {
    streak: 1,
    terakhirCheckin: "2026-10-25",
    tanggalCheckin: ["2026-10-25"],
    xp: 20,
    sisaJatahIstirahat: 1,
    aktivitasCheckin: {},
    xpHarian: { tanggal: "2026-10-25", checkin: true, jurnal: 0, ajakan: 0, kawanDiajak: [] }
  };

  const res = prosesCheckin(data, ["tidur"], "2026-10-25");
  assert.equal(res.sukses, false);
  assert.equal(res.alasan, "sudah_checkin");
  assert.equal(data.streak, 1);
  assert.equal(data.xp, 20); // tidak bertambah
});

test("Streak berlanjut jika check-in berurutan tiap hari", () => {
  const data = {
    streak: 1,
    terakhirCheckin: "2026-10-25",
    tanggalCheckin: ["2026-10-25"],
    xp: 20,
    sisaJatahIstirahat: 1,
    aktivitasCheckin: {},
    xpHarian: { tanggal: "2026-10-26", checkin: false, jurnal: 0, ajakan: 0, kawanDiajak: [] }
  };

  const res = prosesCheckin(data, ["makan_teratur"], "2026-10-26");
  assert.equal(res.sukses, true);
  assert.equal(data.streak, 2);
  assert.equal(data.xp, 40);
});

test("Jatah istirahat dipakai bila terlewat tepat 1 hari", () => {
  const data = {
    streak: 5,
    terakhirCheckin: "2026-10-20",
    tanggalCheckin: ["2026-10-20"],
    xp: 100,
    sisaJatahIstirahat: 1, // memiliki jatah istirahat
    rekorStreak: 5
  };

  // Pengguna baru buka app tanggal 2026-10-22 (bolong tanggal 21)
  const evalHasil = evaluasiStreak(data, "2026-10-22");
  assert.equal(evalHasil.jatahTerpakai, true);
  assert.equal(data.streak, 5); // streak dipertahankan!
  assert.equal(data.sisaJatahIstirahat, 0); // jatah habis
});

test("Streak putus jika terlewat 1 hari tapi jatah istirahat sudah 0", () => {
  const data = {
    streak: 5,
    terakhirCheckin: "2026-10-20",
    tanggalCheckin: ["2026-10-20"],
    xp: 100,
    sisaJatahIstirahat: 0, // tidak ada jatah
    rekorStreak: 5
  };

  const evalHasil = evaluasiStreak(data, "2026-10-22");
  assert.equal(evalHasil.status, "putus");
  assert.equal(data.streak, 0);
  assert.equal(data.rekorStreak, 5);
});

test("Streak putus jika terlewat lebih dari 2 hari", () => {
  const data = {
    streak: 10,
    terakhirCheckin: "2026-10-15",
    tanggalCheckin: ["2026-10-15"],
    xp: 200,
    sisaJatahIstirahat: 1,
    rekorStreak: 10
  };

  const evalHasil = evaluasiStreak(data, "2026-10-25"); // lewat 10 hari
  assert.equal(evalHasil.status, "putus");
  assert.equal(data.streak, 0);
  assert.equal(data.rekorStreak, 10);
});

test("Logika pergantian bulan dan tahun pada streak", () => {
  // Pergantian bulan: 31 Okt ke 1 Nov
  const dataBulan = {
    streak: 3,
    terakhirCheckin: "2026-10-31",
    tanggalCheckin: ["2026-10-31"],
    xp: 60,
    sisaJatahIstirahat: 1,
    xpHarian: { tanggal: "2026-11-01", checkin: false, jurnal: 0, ajakan: 0, kawanDiajak: [] }
  };
  const resBulan = prosesCheckin(dataBulan, ["istirahat"], "2026-11-01");
  assert.equal(resBulan.sukses, true);
  assert.equal(dataBulan.streak, 4);

  // Pergantian tahun: 31 Des 2026 ke 1 Jan 2027
  const dataTahun = {
    streak: 14,
    terakhirCheckin: "2026-12-31",
    tanggalCheckin: ["2026-12-31"],
    xp: 280,
    sisaJatahIstirahat: 1,
    xpHarian: { tanggal: "2027-01-01", checkin: false, jurnal: 0, ajakan: 0, kawanDiajak: [] }
  };
  const resTahun = prosesCheckin(dataTahun, ["istirahat"], "2027-01-01");
  assert.equal(resTahun.sukses, true);
  assert.equal(dataTahun.streak, 15);
});

test("Anti-Farming XP: Jurnal kurang dari 10 karakter tidak dapat XP", () => {
  const data = { xp: 0, xpHarian: { tanggal: "2026-10-25", checkin: false, jurnal: 0, ajakan: 0, kawanDiajak: [] } };
  const res = tambahXPAman(data, "jurnal", { karakter: 5 }, "2026-10-25");
  assert.equal(res.bertambah, 0);
  assert.equal(data.xp, 0);
});

test("Anti-Farming XP: Jurnal hanya dapat XP 1x per hari", () => {
  const data = { xp: 0, xpHarian: { tanggal: "2026-10-25", checkin: false, jurnal: 0, ajakan: 0, kawanDiajak: [] } };

  // Jurnal pertama (>= 10 karakter)
  const res1 = tambahXPAman(data, "jurnal", { karakter: 15 }, "2026-10-25");
  assert.equal(res1.bertambah, 15);
  assert.equal(data.xp, 15);

  // Jurnal kedua di hari yang sama
  const res2 = tambahXPAman(data, "jurnal", { karakter: 20 }, "2026-10-25");
  assert.equal(res2.bertambah, 0);
  assert.equal(data.xp, 15);
  assert.match(res2.pesanPenuh, /XP jurnal hari ini sudah penuh/);
});

test("Anti-Farming XP: Ajakan maksimal 3x per hari dan 1x per kawan per hari", () => {
  const data = { xp: 0, xpHarian: { tanggal: "2026-10-25", checkin: false, jurnal: 0, ajakan: 0, kawanDiajak: [] } };

  // Ajak Kawan 1 -> Dapat 10 XP
  const a1 = tambahXPAman(data, "ajakan", { kawanId: "raka" }, "2026-10-25");
  assert.equal(a1.bertambah, 10);
  assert.equal(data.xp, 10);

  // Ajak Kawan 1 lagi di hari yang sama -> Ditolak (0 XP)
  const a1_ulang = tambahXPAman(data, "ajakan", { kawanId: "raka" }, "2026-10-25");
  assert.equal(a1_ulang.bertambah, 0);
  assert.equal(data.xp, 10);

  // Ajak Kawan 2 -> Dapat 10 XP (total 20 XP)
  const a2 = tambahXPAman(data, "ajakan", { kawanId: "nadia" }, "2026-10-25");
  assert.equal(a2.bertambah, 10);
  assert.equal(data.xp, 20);

  // Ajak Kawan 3 -> Dapat 10 XP (total 30 XP, kuota harian ajakan habis)
  const a3 = tambahXPAman(data, "ajakan", { kawanId: "dimas" }, "2026-10-25");
  assert.equal(a3.bertambah, 10);
  assert.equal(data.xp, 30);

  // Ajak Kawan 4 -> Ditolak karena kuota 3x/hari tercapai
  const a4 = tambahXPAman(data, "ajakan", { kawanId: "salsa" }, "2026-10-25");
  assert.equal(a4.bertambah, 0);
  assert.equal(data.xp, 30);
  assert.match(a4.pesanPenuh, /Batas XP ajakan hari ini sudah tercapai/);
});