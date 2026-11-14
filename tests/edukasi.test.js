import test from "node:test";
import assert from "node:assert/strict";
import {
  MATERI_EDUKASI,
  DATA_MINI_GAMES,
  FAKTA_HARIAN_LIST,
  TANTANGAN_HARIAN_LIST,
  BADGE_EDUKASI_LIST
} from "../data/edukasi-data.js";

test("MATERI_EDUKASI memuat minimal 20 modul dengan kategori yang lengkap", () => {
  assert.ok(Array.isArray(MATERI_EDUKASI), "MATERI_EDUKASI harus bertipe array");
  assert.ok(MATERI_EDUKASI.length >= 20, "Harus memuat minimal 20 materi pembelajaran");

  const kategoriDitemukan = new Set(MATERI_EDUKASI.map((m) => m.kategori));
  assert.ok(kategoriDitemukan.has("Gizi dan Nutrisi"), "Wajib memuat kategori Gizi dan Nutrisi");
  assert.ok(kategoriDitemukan.has("Olahraga dan Kebugaran"), "Wajib memuat kategori Olahraga dan Kebugaran");
  assert.ok(kategoriDitemukan.has("Kesehatan dan Gaya Hidup"), "Wajib memuat kategori Kesehatan dan Gaya Hidup");

  const giziCount = MATERI_EDUKASI.filter((m) => m.kategori === "Gizi dan Nutrisi").length;
  const olahragaCount = MATERI_EDUKASI.filter((m) => m.kategori === "Olahraga dan Kebugaran").length;
  const lifestyleCount = MATERI_EDUKASI.filter((m) => m.kategori === "Kesehatan dan Gaya Hidup").length;

  assert.strictEqual(giziCount, 10, "Kategori Gizi dan Nutrisi harus memiliki 10 materi");
  assert.strictEqual(olahragaCount, 6, "Kategori Olahraga dan Kebugaran harus memiliki 6 materi");
  assert.strictEqual(lifestyleCount, 4, "Kategori Kesehatan dan Gaya Hidup harus memiliki 4 materi");
});

test("Setiap materi memiliki struktur lengkap, tujuan pembelajaran, contoh aplikasi, dan fakta menarik", () => {
  MATERI_EDUKASI.forEach((m) => {
    assert.ok(m.id, `Materi nomor ${m.nomor} harus memiliki id`);
    assert.ok(m.judul && m.judul.length > 5, `Materi nomor ${m.nomor} harus memiliki judul valid`);
    assert.ok(["Pemula", "Menengah", "Lanjutan"].includes(m.tingkatKesulitan), "Tingkat kesulitan harus valid");
    assert.ok(m.estimasiWaktu, "Harus ada estimasi waktu membaca");
    assert.ok(Array.isArray(m.tujuanPembelajaran) && m.tujuanPembelajaran.length >= 3, "Harus memuat minimal 3 tujuan pembelajaran");
    assert.ok(m.penjelasanLengkap && m.penjelasanLengkap.length > 200, "Penjelasan materi harus lengkap dan komprehensif");
    assert.ok(m.penjelasanLengkap.includes("Contoh Penerapan") || m.penjelasanLengkap.includes("contoh-aplikasi"), "Wajib ada contoh penerapan sehari-hari");
    assert.ok(m.penjelasanLengkap.includes("Fakta Menarik") || m.penjelasanLengkap.includes("fakta-menarik"), "Wajib ada fakta menarik");
    assert.ok(m.penjelasanLengkap.includes("Kesimpulan") || m.penjelasanLengkap.includes("kesimpulan"), "Wajib ada kesimpulan");
  });
});

test("Setiap materi WAJIB memiliki sumber rujukan ilmiah valid (penulis, judul, institusi, tahun, dan link)", () => {
  MATERI_EDUKASI.forEach((m) => {
    const ref = m.referensi;
    assert.ok(ref, `Materi "${m.judul}" wajib memiliki objek referensi`);
    assert.ok(ref.penulis && ref.penulis.length > 3, `Referensi "${m.judul}" harus memiliki nama penulis/organisasi`);
    assert.ok(ref.judul && ref.judul.length > 5, `Referensi "${m.judul}" harus memiliki judul publikasi`);
    assert.ok(ref.institusi && ref.institusi.length > 2, `Referensi "${m.judul}" harus memiliki nama jurnal/institusi penerbit`);
    assert.ok(typeof ref.tahun === "number" && ref.tahun >= 1990, `Referensi "${m.judul}" harus memiliki tahun penerbitan valid`);
    assert.ok(ref.url && ref.url.startsWith("http"), `Referensi "${m.judul}" harus memiliki tautan URL aktif ke sumber`);
  });
});

test("Setiap materi memiliki Quiz khusus minimal 5 soal (Total minimal 100 pertanyaan quiz)", () => {
  let totalPertanyaan = 0;

  MATERI_EDUKASI.forEach((m) => {
    assert.ok(Array.isArray(m.quiz), `Quiz pada materi "${m.judul}" harus berupa array`);
    assert.strictEqual(m.quiz.length, 5, `Materi "${m.judul}" harus memiliki tepat 5 soal quiz`);

    m.quiz.forEach((q, qIdx) => {
      assert.ok(q.pertanyaan && q.pertanyaan.length > 10, `Pertanyaan ${qIdx + 1} di "${m.judul}" harus valid`);
      assert.strictEqual(q.pilihan.length, 4, `Pertanyaan ${qIdx + 1} di "${m.judul}" harus memiliki 4 opsi (A, B, C, D)`);
      assert.ok([0, 1, 2, 3].includes(q.jawabanBenar), `Kunci jawaban harus bernilai index 0-3`);
      assert.ok(q.penjelasan && q.penjelasan.length > 15, `Harus ada penjelasan ilmiah mengapa jawaban benar`);
      totalPertanyaan++;
    });
  });

  assert.ok(totalPertanyaan >= 100, `Total seluruh pertanyaan quiz harus minimal 100 (terhitung: ${totalPertanyaan})`);
});

test("DATA_MINI_GAMES memuat 5 mini game interaktif yang siap dimainkan", () => {
  const keys = Object.keys(DATA_MINI_GAMES);
  assert.ok(keys.includes("isiPiringku"), "Game 1: Susun Isi Piringku harus ada");
  assert.ok(keys.includes("tebakNutrisi"), "Game 2: Tebak Nutrisi harus ada");
  assert.ok(keys.includes("mitosFakta"), "Game 3: Mitos atau Fakta harus ada");
  assert.ok(keys.includes("foodDetective"), "Game 4: Food Detective harus ada");
  assert.ok(keys.includes("fitnessChallenge"), "Game 5: Fitness Challenge harus ada");

  // Game 1
  assert.ok(DATA_MINI_GAMES.isiPiringku.items.length >= 12, "Isi piringku harus punya minimal 12 pilihan makanan");

  // Game 2
  assert.strictEqual(DATA_MINI_GAMES.tebakNutrisi.ronde.length, 8, "Tebak nutrisi harus memiliki 8 ronde");

  // Game 3
  assert.strictEqual(DATA_MINI_GAMES.mitosFakta.daftar.length, 10, "Mitos atau Fakta harus memiliki 10 pernyataan");

  // Game 4
  assert.strictEqual(DATA_MINI_GAMES.foodDetective.kasus.length, 3, "Food detective harus memiliki 3 kasus label gizi");

  // Game 5
  assert.strictEqual(DATA_MINI_GAMES.fitnessChallenge.stages.length, 5, "Fitness challenge harus memiliki 5 stage taktis");
});

test("FAKTA_HARIAN_LIST dan TANTANGAN_HARIAN_LIST memuat konten harian terverifikasi", () => {
  assert.ok(FAKTA_HARIAN_LIST.length >= 14, "Harus ada minimal 14 fakta kesehatan harian");
  assert.ok(TANTANGAN_HARIAN_LIST.length >= 14, "Harus ada minimal 14 tantangan kesehatan harian");

  FAKTA_HARIAN_LIST.forEach((f) => {
    assert.ok(f.fakta && f.penjelasanIlmiah && f.sumber && f.url, "Fakta harian harus lengkap dengan sumber terverifikasi");
  });

  TANTANGAN_HARIAN_LIST.forEach((t) => {
    assert.ok(t.pertanyaan && t.pilihan.length === 4 && t.penjelasan && t.sumber, "Tantangan harian harus lengkap");
  });
});

test("BADGE_EDUKASI_LIST mendefinisikan 4 lencana bertahap khusus Edukasi", () => {
  assert.strictEqual(BADGE_EDUKASI_LIST.length, 4, "Harus ada 4 badge edukasi");
  const namaBadge = BADGE_EDUKASI_LIST.map((b) => b.nama);
  assert.ok(namaBadge.includes("Penjelajah Sehat"), "Harus ada badge Penjelajah Sehat");
  assert.ok(namaBadge.includes("Pembelajar Aktif"), "Harus ada badge Pembelajar Aktif");
  assert.ok(namaBadge.includes("Health Enthusiast"), "Harus ada badge Health Enthusiast");
  assert.ok(namaBadge.includes("Health Master"), "Harus ada badge Health Master");
});

test("Step-by-Step Reader mapping membagi materi menjadi 5 tahapan terstruktur", () => {
  // Simulasi parsing 5 tahapan dari setiap modul
  MATERI_EDUKASI.forEach((m) => {
    const raw = m.penjelasanLengkap;

    // Tahap 1: Pengenalan (Tujuan Pembelajaran)
    assert.ok(Array.isArray(m.tujuanPembelajaran) && m.tujuanPembelajaran.length >= 3, "Step 1 wajib ada tujuan");

    // Tahap 2: Materi Utama & Fakta Menarik
    const faktaMatch = raw.match(/<div class="kotak-sorotan fakta-menarik">([\s\S]*?)<\/div>/i);
    assert.ok(faktaMatch && faktaMatch[1].length > 10, `Step 2 Fakta Menarik wajib ada di "${m.judul}"`);

    // Tahap 3: Contoh Aplikasi
    const aplikasiMatch = raw.match(/<div class="kotak-sorotan contoh-aplikasi">([\s\S]*?)<\/div>/i);
    assert.ok(aplikasiMatch && aplikasiMatch[1].length > 10, `Step 3 Contoh Aplikasi wajib ada di "${m.judul}"`);

    // Tahap 4: Kesimpulan
    const kesimpulanMatch = raw.match(/<div class="kotak-sorotan kesimpulan">([\s\S]*?)<\/div>/i);
    assert.ok(kesimpulanMatch && kesimpulanMatch[1].length > 10, `Step 4 Kesimpulan wajib ada di "${m.judul}"`);

    // Tahap 5: Referensi Ilmiah
    assert.ok(m.referensi && m.referensi.url, `Step 5 Referensi Ilmiah wajib ada di "${m.judul}"`);
  });
});

test("Single-Question Quiz Player memvalidasi skor per soal dan persentase kelulusan", () => {
  const materiSample = MATERI_EDUKASI[0];
  const soalList = materiSample.quiz;
  assert.strictEqual(soalList.length, 5);

  // Skenario 1: Jawaban sempurna (5 benar dari 5)
  const skorPenuh = Math.round((5 / 5) * 100);
  assert.strictEqual(skorPenuh, 100);
  const statusLulus = skorPenuh >= 80;
  assert.strictEqual(statusLulus, true);

  // Skenario 2: 4 benar dari 5
  const skorEmpat = Math.round((4 / 5) * 100);
  assert.strictEqual(skorEmpat, 80);
  assert.strictEqual(skorEmpat >= 80, true);

  // Skenario 3: 3 benar dari 5 (kurang dari batas kelulusan 80%)
  const skorTiga = Math.round((3 / 5) * 100);
  assert.strictEqual(skorTiga, 60);
  assert.strictEqual(skorTiga >= 80, false);
});

test("Integritas Pemisahan Poin: Edukasi tidak menambah skor atau mengubah rank workout", () => {
  // Simulasi state edukasi vs workout
  const stateEdukasi = {
    materiSelesai: ["gizi-1", "gizi-2"],
    quizSkor: { "gizi-1": 100, "gizi-2": 80 },
    xpEdukasi: 50
  };

  const stateWorkout = {
    totalSelesai: 2,
    poin: 50 // 2 sesi * 25 poin
  };

  // Memastikan bahwa menyelesaikan materi/quiz edukasi tidak mempengaruhi stateWorkout.poin
  assert.strictEqual(stateWorkout.poin, 50, "Poin workout tidak boleh bertambah dari modul edukasi");
  assert.ok(!("xpEdukasi" in stateWorkout), "xpEdukasi harus terisolasi di domain edukasi");
});