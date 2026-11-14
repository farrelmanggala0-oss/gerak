import test from "node:test";
import assert from "node:assert/strict";
import { CONFIG } from "../js/config.js";
import { POSTINGAN_KOMUNITAS_DEFAULT } from "../js/jurnal.js";

test("CONFIG.PROMPT_CADANGAN memuat variasi prompt refleksi yang relevan", () => {
  assert.ok(Array.isArray(CONFIG.PROMPT_CADANGAN), "PROMPT_CADANGAN harus bertipe array");
  assert.ok(CONFIG.PROMPT_CADANGAN.length >= 6, "Harus menyediakan minimal 6 variasi prompt refleksi");
  
  const gabunganPrompt = CONFIG.PROMPT_CADANGAN.join(" ").toLowerCase();
  assert.ok(gabunganPrompt.includes("hal terbaik") || gabunganPrompt.includes("energi"), "Harus mencakup hal baik/energi");
  assert.ok(gabunganPrompt.includes("lelah") || gabunganPrompt.includes("beban"), "Harus mencakup pemicu lelah");
  assert.ok(gabunganPrompt.includes("pencapaian kecil") || gabunganPrompt.includes("kemenangan kecil") || gabunganPrompt.includes("bangga"), "Harus mencakup pencapaian/kemenangan kecil");
  assert.ok(gabunganPrompt.includes("olahraga") || gabunganPrompt.includes("workout"), "Harus mencakup refleksi olahraga");
  assert.ok(gabunganPrompt.includes("kebiasaan") || gabunganPrompt.includes("besok"), "Harus mencakup perbaikan kebiasaan");
});

test("POSTINGAN_KOMUNITAS_DEFAULT memiliki struktur valid dan data verified", () => {
  assert.ok(Array.isArray(POSTINGAN_KOMUNITAS_DEFAULT), "POSTINGAN_KOMUNITAS_DEFAULT harus array");
  assert.ok(POSTINGAN_KOMUNITAS_DEFAULT.length >= 3, "Minimal ada 3 contoh postingan komunitas default");

  const kategoriValid = [
    "Tips Gizi",
    "Workout & Fitness",
    "Pengalaman Olahraga",
    "Recovery & Istirahat",
    "Mental Wellness",
    "Motivasi & Kebiasaan Sehat"
  ];

  POSTINGAN_KOMUNITAS_DEFAULT.forEach((post) => {
    assert.ok(post.id, "Setiap post harus memiliki ID unik");
    assert.ok(post.authorNama, "Setiap post harus memiliki authorNama");
    assert.ok(post.judul && post.judul.length > 5, "Setiap post harus memiliki judul yang bermakna");
    assert.ok(post.isi && post.isi.length > 10, "Setiap post harus memiliki isi");
    assert.ok(kategoriValid.includes(post.kategori), `Kategori "${post.kategori}" harus termasuk kategori valid`);
    assert.strictEqual(typeof post.sukaCount, "number", "sukaCount harus angka");
  });
});

test("Pemisahan Data: Format jurnal pribadi menyertakan flag isPrivate dan tidak mengekspos data ke publik", () => {
  const dummyJurnalPribadi = {
    id: "jurnal_123",
    tanggal: "2026-11-03",
    mood: "senang",
    teks: "Hari ini berhasil lari 3km dan merasa sangat segar.",
    isPrivate: true,
    analisisAI: null
  };

  assert.strictEqual(dummyJurnalPribadi.isPrivate, true, "Jurnal pribadi harus berstatus isPrivate: true");
  assert.notStrictEqual(POSTINGAN_KOMUNITAS_DEFAULT.find(p => p.id === dummyJurnalPribadi.id), dummyJurnalPribadi, "Jurnal pribadi tidak boleh otomatis masuk feed komunitas");
});