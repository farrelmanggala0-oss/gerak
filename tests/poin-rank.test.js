// =========================================
// GERAK - tests/poin-rank.test.js
// Uji unit sistem Poin, Rank, Badge, dan Leaderboard
// =========================================

import test from "node:test";
import assert from "node:assert/strict";
import {
  POIN_WORKOUT_SESI,
  DAFTAR_RANK,
  hitungInfoRank,
  tambahPoinWorkout,
  ambilDataLeaderboard
} from "../js/poin-rank.js";

test("POIN_WORKOUT_SESI bernilai tepat 25 poin", () => {
  assert.equal(POIN_WORKOUT_SESI, 25);
});

test("Rentang semua rank kontinu, tidak tumpang tindih, dan tidak memiliki celah", () => {
  assert.equal(DAFTAR_RANK.length, 11);

  for (let i = 0; i < DAFTAR_RANK.length; i++) {
    const rank = DAFTAR_RANK[i];
    assert.ok(rank.minPoin <= rank.maxPoin, `Rank ${rank.nama} minPoin harus <= maxPoin`);

    if (i > 0) {
      const prevRank = DAFTAR_RANK[i - 1];
      assert.equal(
        rank.minPoin,
        prevRank.maxPoin + 1,
        `Rank ${rank.nama} (${rank.minPoin}) harus tepat setelah ${prevRank.nama} (${prevRank.maxPoin})`
      );
    }
  }

  // Cek rank spesifik sesuai tabel instruksi
  assert.equal(DAFTAR_RANK[0].nama, "Pemula Mager");
  assert.equal(DAFTAR_RANK[0].minPoin, 0);
  assert.equal(DAFTAR_RANK[0].maxPoin, 99);

  assert.equal(DAFTAR_RANK[1].nama, "Mulai Semangat");
  assert.equal(DAFTAR_RANK[1].minPoin, 100);
  assert.equal(DAFTAR_RANK[1].maxPoin, 499);

  assert.equal(DAFTAR_RANK[2].nama, "Pejuang Konsisten");
  assert.equal(DAFTAR_RANK[2].minPoin, 500);
  assert.equal(DAFTAR_RANK[2].maxPoin, 999);

  assert.equal(DAFTAR_RANK[3].nama, "Atlet Disiplin");
  assert.equal(DAFTAR_RANK[3].minPoin, 1000);
  assert.equal(DAFTAR_RANK[3].maxPoin, 1499);

  assert.equal(DAFTAR_RANK[4].nama, "Fitness Warrior");
  assert.equal(DAFTAR_RANK[4].minPoin, 1500);
  assert.equal(DAFTAR_RANK[4].maxPoin, 1999);

  assert.equal(DAFTAR_RANK[5].nama, "Elite Athlete");
  assert.equal(DAFTAR_RANK[5].minPoin, 2000);
  assert.equal(DAFTAR_RANK[5].maxPoin, 2499);

  assert.equal(DAFTAR_RANK[6].nama, "Master of Fitness");
  assert.equal(DAFTAR_RANK[6].minPoin, 2500);
  assert.equal(DAFTAR_RANK[6].maxPoin, 2999);

  assert.equal(DAFTAR_RANK[7].nama, "Legend");
  assert.equal(DAFTAR_RANK[7].minPoin, 3000);
  assert.equal(DAFTAR_RANK[7].maxPoin, 3499);

  // Kenaikan setiap 500 poin berikutnya
  assert.equal(DAFTAR_RANK[8].nama, "Mythic Titan");
  assert.equal(DAFTAR_RANK[8].minPoin, 3500);
  assert.equal(DAFTAR_RANK[8].maxPoin, 3999);

  assert.equal(DAFTAR_RANK[9].nama, "Immortal Champion");
  assert.equal(DAFTAR_RANK[9].minPoin, 4000);
  assert.equal(DAFTAR_RANK[9].maxPoin, 4499);

  assert.equal(DAFTAR_RANK[10].nama, "GERAK Godlike");
  assert.equal(DAFTAR_RANK[10].minPoin, 4500);
});

test("Kalkulasi rank, sisa poin, dan target poin", () => {
  // Poin 0 -> Pemula Mager, target 100, sisa 100, 0%
  const res0 = hitungInfoRank(0);
  assert.equal(res0.rankSekarang.nama, "Pemula Mager");
  assert.equal(res0.targetPoin, 100);
  assert.equal(res0.sisaPoin, 100);
  assert.equal(res0.persen, 0);

  // Poin 25 (1 sesi selesai) -> Pemula Mager, target 100, sisa 75, 25%
  const res25 = hitungInfoRank(25);
  assert.equal(res25.rankSekarang.nama, "Pemula Mager");
  assert.equal(res25.targetPoin, 100);
  assert.equal(res25.sisaPoin, 75);
  assert.equal(res25.persen, 25);

  // Poin 350 (contoh prompt) -> Mulai Semangat, target 500, sisa 150
  const res350 = hitungInfoRank(350);
  assert.equal(res350.rankSekarang.nama, "Mulai Semangat");
  assert.equal(res350.rankBerikutnya.nama, "Pejuang Konsisten");
  assert.equal(res350.targetPoin, 500);
  assert.equal(res350.sisaPoin, 150);
  // (350 - 100) / (500 - 100) = 250 / 400 = 62.5% -> 63%
  assert.equal(res350.persen, 63);

  // Poin 4500 (Puncak Godlike)
  const resMax = hitungInfoRank(4500);
  assert.equal(resMax.rankSekarang.nama, "GERAK Godlike");
  assert.equal(resMax.isMaxRank, true);
  assert.equal(resMax.sisaPoin, 0);
  assert.equal(resMax.persen, 100);
});

test("tambahPoinWorkout menambahkan 25 poin per sesi dan melacak rank up", () => {
  const data = {
    poin: 75,
    sesiWorkoutSelesai: 3,
    riwayatPoinWorkout: []
  };

  // Sesi ke-4: 75 + 25 = 100 poin -> Rank up dari Pemula Mager ke Mulai Semangat
  const hasil = tambahPoinWorkout(data, "sesi_senin_upper");
  assert.equal(hasil.poinDitambah, 25);
  assert.equal(hasil.totalPoin, 100);
  assert.equal(hasil.sesiWorkoutSelesai, 4);
  assert.equal(hasil.naikRank, true);
  assert.equal(hasil.rankLama.nama, "Pemula Mager");
  assert.equal(hasil.rankBaru.nama, "Mulai Semangat");
  assert.equal(data.riwayatPoinWorkout.length, 1);
});

test("Simulasi penyelesaian 20 sesi = 500 poin dan 40 sesi = 1000 poin", () => {
  const data = {
    poin: 0,
    sesiWorkoutSelesai: 0,
    riwayatPoinWorkout: []
  };

  for (let i = 1; i <= 20; i++) {
    tambahPoinWorkout(data, `sesi_${i}`);
  }
  assert.equal(data.poin, 500);
  assert.equal(data.sesiWorkoutSelesai, 20);
  assert.equal(hitungInfoRank(data.poin).rankSekarang.nama, "Pejuang Konsisten");

  for (let i = 21; i <= 40; i++) {
    tambahPoinWorkout(data, `sesi_${i}`);
  }
  assert.equal(data.poin, 1000);
  assert.equal(data.sesiWorkoutSelesai, 40);
  assert.equal(hitungInfoRank(data.poin).rankSekarang.nama, "Atlet Disiplin");
});