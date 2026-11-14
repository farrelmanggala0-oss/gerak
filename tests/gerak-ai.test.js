import test from "node:test";
import assert from "node:assert/strict";
import {
  KAMUS_SEKSI,
  hasilkanSapaanKontekstual,
  dapatkanSaranCepat,
  formatPesanMarkdown
} from "../js/gerak-ai.js";

test("Kamus Seksi mencakup seluruh 7 halaman platform GERAK", () => {
  const kunci = Object.keys(KAMUS_SEKSI);
  
  // 1. Beranda
  assert.ok(kunci.includes("berandaHero"), "Kamus harus punya berandaHero");
  assert.ok(kunci.includes("berandaStatus"), "Kamus harus punya berandaStatus");
  assert.ok(kunci.includes("berandaAyoMulai"), "Kamus harus punya berandaAyoMulai");
  assert.ok(kunci.includes("berandaAktivitas"), "Kamus harus punya berandaAktivitas");
  assert.ok(kunci.includes("berandaPengenalan"), "Kamus harus punya berandaPengenalan");
  assert.ok(kunci.includes("berandaCaraPakai"), "Kamus harus punya berandaCaraPakai");
  assert.ok(kunci.includes("berandaManfaat"), "Kamus harus punya berandaManfaat");

  // 2. Gizi
  assert.ok(kunci.includes("giziKalkulator"), "Kamus harus punya giziKalkulator");
  assert.ok(kunci.includes("giziHasilPenjelasan"), "Kamus harus punya giziHasilPenjelasan");
  assert.ok(kunci.includes("giziPanduanTarget"), "Kamus harus punya giziPanduanTarget");
  assert.ok(kunci.includes("giziMakronutrisi"), "Kamus harus punya giziMakronutrisi");
  assert.ok(kunci.includes("giziEdukasiNutrisi"), "Kamus harus punya giziEdukasiNutrisi");

  // 3. Work Out
  assert.ok(kunci.includes("workoutStatusAkses"), "Kamus harus punya workoutStatusAkses");
  assert.ok(kunci.includes("workoutJadwalMingguan"), "Kamus harus punya workoutJadwalMingguan");
  assert.ok(kunci.includes("workoutTipsPemulihan"), "Kamus harus punya workoutTipsPemulihan");
  assert.ok(kunci.includes("workoutManfaatLatihan"), "Kamus harus punya workoutManfaatLatihan");

  // 4. Kawan
  assert.ok(kunci.includes("kawanPencarianFilter"), "Kamus harus punya kawanPencarianFilter");
  assert.ok(kunci.includes("kawanSedangAktif"), "Kamus harus punya kawanSedangAktif");
  assert.ok(kunci.includes("kawanOlahragaBareng"), "Kamus harus punya kawanOlahragaBareng");
  assert.ok(kunci.includes("kawanTemanSekitar"), "Kamus harus punya kawanTemanSekitar");

  // 5. Poin & Rank
  assert.ok(kunci.includes("poinTotalDashboard"), "Kamus harus punya poinTotalDashboard");
  assert.ok(kunci.includes("poinTingkatanBadge"), "Kamus harus punya poinTingkatanBadge");
  assert.ok(kunci.includes("poinLeaderboardKomunitas"), "Kamus harus punya poinLeaderboardKomunitas");

  // 6. Jurnal
  assert.ok(kunci.includes("jurnalCheckinHarian"), "Kamus harus punya jurnalCheckinHarian");
  assert.ok(kunci.includes("jurnalMoodPicker"), "Kamus harus punya jurnalMoodPicker");
  assert.ok(kunci.includes("jurnalRefleksiRaga"), "Kamus harus punya jurnalRefleksiRaga");

  // 7. Edukasi
  assert.ok(kunci.includes("edukasiKategoriSehat"), "Kamus harus punya edukasiKategoriSehat");
  assert.ok(kunci.includes("edukasiStunting"), "Kamus harus punya edukasiStunting");
  assert.ok(kunci.includes("edukasiGiziSeimbang"), "Kamus harus punya edukasiGiziSeimbang");
});

test("hasilkanSapaanKontekstual: Guest Mode vs Member Mode", () => {
  // Guest mode di Beranda
  const sapaanGuest = hasilkanSapaanKontekstual({
    seksiId: "berandaHero",
    userMode: "guest",
    namaUser: "",
    workoutTerbuka: false
  });
  assert.ok(sapaanGuest.includes("Baru pertama kali di GERAK.?"), "Sapaan guest harus ramah pengunjung");
  assert.ok(!sapaanGuest.includes("undefined"), "Tidak boleh ada kata undefined");

  // Member mode di Beranda
  const sapaanMember = hasilkanSapaanKontekstual({
    seksiId: "berandaHero",
    userMode: "member",
    namaUser: "Budi",
    workoutTerbuka: true
  });
  assert.ok(sapaanMember.includes("Halo, Budi!"), "Sapaan member harus memuat sapaan personal nama");
});

test("hasilkanSapaanKontekstual: Menyesuaikan status gembok Work Out jika belum hitung gizi", () => {
  const sapaanTerkunci = hasilkanSapaanKontekstual({
    seksiId: "workoutStatusAkses",
    userMode: "member",
    namaUser: "Siti",
    workoutTerbuka: false
  });
  assert.ok(sapaanTerkunci.includes("terkunci") || sapaanTerkunci.includes("Kalkulator Gizi"), "Member dengan workout terkunci diarahkan ke gizi");
});

test("dapatkanSaranCepat: Menghasilkan daftar pertanyaan kontekstual", () => {
  const saranGizi = dapatkanSaranCepat({
    seksiId: "giziKalkulator",
    userMode: "guest",
    workoutTerbuka: false
  });
  assert.ok(Array.isArray(saranGizi) && saranGizi.length > 0, "Saran harus berupa array tidak kosong");
  assert.ok(saranGizi.some(s => s.toLowerCase().includes("kalori") || s.toLowerCase().includes("rumus")), "Saran gizi harus relevan");

  const saranUnknown = dapatkanSaranCepat({
    seksiId: "seksiAnehTidakAda",
    userMode: "guest",
    workoutTerbuka: false
  });
  assert.ok(Array.isArray(saranUnknown) && saranUnknown.length > 0, "Harus fallback ke saran umum");
});

test("formatPesanMarkdown: Sanitasi HTML dan parsing formatting sederhana", () => {
  const inputXSS = "<script>alert('xss')</script> **Tebal**";
  const output = formatPesanMarkdown(inputXSS);
  assert.ok(!output.includes("<script>"), "Tag script harus di-escape");
  assert.ok(output.includes("&lt;script&gt;"), "Tag script harus diubah ke entitas aman");
  assert.ok(output.includes("<strong>Tebal</strong>"), "Markdown bold harus dikonversi ke strong");

  const listInput = "Poin penting:\n- Langkah 1\n- Langkah 2";
  const listOutput = formatPesanMarkdown(listInput);
  assert.ok(listOutput.includes("<ul class='ai-chat-list'>"), "List harus di-wrap ul");
  assert.ok(listOutput.includes("<li>Langkah 1</li>"), "Item harus di-wrap li");
});


test("formatPesanMarkdown: judul ###, list bernomor, dan teks miring dirapikan", () => {
  const output = formatPesanMarkdown("### (1) Penyebab\n1. Istirahat\n2. Konsultasi\nCoba *incline push-up* dulu");
  assert.ok(!output.includes("###"), "Tanda ### tidak boleh tampil mentah");
  assert.ok(output.includes("<p class='ai-chat-judul'><strong>(1) Penyebab</strong></p>"), "Judul jadi teks tebal");
  assert.ok(output.includes("<ol class='ai-chat-list'><li>Istirahat</li><li>Konsultasi</li></ol>"), "List bernomor jadi ol");
  assert.ok(output.includes("<em>incline push-up</em>"), "*teks* jadi miring");
});

test("formatPesanMarkdown: list '* item' tidak dianggap teks miring", () => {
  const output = formatPesanMarkdown("* Satu\n* Dua");
  assert.ok(output.includes("<li>Satu</li><li>Dua</li>"));
  assert.ok(!output.includes("<em>"));
});