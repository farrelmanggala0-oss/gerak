// =========================================
// GERAK - tests/auth.test.js
// Uji unit autentikasi dan status akun pengguna
// =========================================

import test from "node:test";
import assert from "node:assert/strict";
import { apakahSudahMasuk } from "../js/auth.js";
import { DATA_DEFAULT } from "../js/penyimpanan.js";

test("Akun default bernilai null dan apakahSudahMasuk bernilai false", () => {
  const stateAwal = {
    data: { ...DATA_DEFAULT }
  };
  assert.equal(stateAwal.data.akun, null);
  assert.equal(apakahSudahMasuk(stateAwal), false);
});

test("apakahSudahMasuk mengembalikan false jika akun tidak memiliki nama", () => {
  const stateKosong = {
    data: { akun: {} }
  };
  assert.equal(apakahSudahMasuk(stateKosong), false);

  const stateNull = null;
  assert.equal(apakahSudahMasuk(stateNull), false);
});

test("apakahSudahMasuk mengembalikan true jika akun memiliki nama valid", () => {
  const stateMasuk = {
    data: {
      akun: {
        nama: "Vito",
        email: "vito@gerak.id",
        olahragaFavorit: "Lari",
        tanggalDaftar: "2026-10-26"
      }
    }
  };
  assert.equal(apakahSudahMasuk(stateMasuk), true);
});

test("Determinasi Mode Beranda: state tanpa akun menentukan Guest Mode", () => {
  const stateGuest = {
    data: { ...DATA_DEFAULT, akun: null }
  };
  const mode = apakahSudahMasuk(stateGuest) ? "member" : "guest";
  assert.equal(mode, "guest");
});

test("Determinasi Mode Beranda: state dengan akun menentukan Member Mode dan sapaan personal", () => {
  const stateMember = {
    data: {
      ...DATA_DEFAULT,
      akun: {
        nama: "Garo",
        email: "garo@gerak.id",
        olahragaFavorit: "Gym",
        tanggalDaftar: "2026-10-29"
      }
    }
  };
  const mode = apakahSudahMasuk(stateMember) ? "member" : "guest";
  assert.equal(mode, "member");
  assert.equal(stateMember.data.akun.nama, "Garo");
});

test("Determinasi Mode Beranda: logout membersihkan akun dan kembali ke Guest Mode", () => {
  const state = {
    data: {
      ...DATA_DEFAULT,
      akun: { nama: "UserTest" }
    }
  };
  assert.equal(apakahSudahMasuk(state), true);

  // Simulasi logout
  state.data.akun = null;
  assert.equal(apakahSudahMasuk(state), false);
  const modeSetelahLogout = apakahSudahMasuk(state) ? "member" : "guest";
  assert.equal(modeSetelahLogout, "guest");
});