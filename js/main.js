// =========================================
// GERAK - js/main.js
// Entry point modul utama GERAK (ES Modules)
// =========================================

import { CONFIG } from "./config.js";
import { DATA_DEFAULT, muatData, simpanData, eksporDataJSON, hapusSemuaData } from "./penyimpanan.js";
import { formatTanggal, hariIni, kemarin } from "./tanggal.js";
import {
  evaluasiStreak,
  prosesCheckin,
  hitungInfoLevel,
  ambilDaftarBadge,
  tambahXPAman
} from "./gamifikasi.js";
import { hitungKebutuhan, validasiInputGizi, hitungUmurDariTanggalLahir, apakahTinggiDikunci } from "./gizi.js";
import { inisialisasiAyoMulai, perbaruiUIAyoMulai } from "./ayo-mulai.js";
import { inisialisasiKawan, renderDaftarKawan } from "./kawan.js";
import { inisialisasiAuth, perbaruiUIAkun, perbaruiUIBeranda } from "./auth.js";
import { inisialisasiPoinRank, renderPoinRankSection } from "./poin-rank.js";
import { inisialisasiJurnal } from "./jurnal.js";
import { inisialisasiEdukasi } from "./edukasi.js";
import { inisialisasiAksesibilitas } from "./aksesibilitas.js";
import { inisialisasiWorkout, renderWorkout } from "./workout.js";
import { inisialisasiKesehatan, renderRiwayatKesehatan } from "./kesehatan-ui.js";
import { inisialisasiGerakAI, perbaruiHalamanAi } from "./gerak-ai.js";
import { el, tampilToast } from "./ui.js";

// State global aplikasi
const appState = {
  data: muatData("gerakData", DATA_DEFAULT),
  daftarJurnal: muatData("gerakJurnal", []),
  perbaruiUILevel: () => {},
  perbaruiUIPoinRank: () => {}
};

function mulaiAplikasi() {
  // 1. Evaluasi streak saat aplikasi dibuka
  evaluasiStreak(appState.data, hariIni());

  // Pastikan fitur Work Out terkunci saat pertama kali web dibuka
  // Pengguna wajib menekan "Hitung Kalori Aman" terlebih dahulu agar mengetahui jumlah kalori yang dibutuhkan
  appState.data.profilGizi = null;
  delete appState.data.profilGizi;
  simpanData("gerakData", appState.data);

  // 2. Pasang fungsi perbarui UI level & XP & Poin Rank & Beranda & Ayo Mulai
  appState.perbaruiUILevel = () => {
    tampilStreak();
    tampilLevel();
    tampilBadge();
    renderPoinRankSection(appState);
    perbaruiUIBeranda(appState);
    perbaruiUIAyoMulai(appState);
  };

  // 3. Render status awal
  appState.perbaruiUILevel();

  // 4. Inisialisasi modul-modul
  inisialisasiAuth(appState, () => {
    renderDaftarKawan(appState);
    renderPoinRankSection(appState);
    sinkronkanFormGiziDenganAkun(appState);
    perbaruiUIAyoMulai(appState);
    appState.perbaruiUILevel();
    inisialisasiEdukasi(appState);
    inisialisasiGerakAI(appState);
  });
  inisialisasiCheckin();
  inisialisasiFormGizi();
  inisialisasiAyoMulai(appState);
  sinkronkanFormGiziDenganAkun(appState);
  inisialisasiWorkout(appState, () => {
    tampilLevel();
    tampilBadge();
    renderPoinRankSection(appState);
  });
  inisialisasiKesehatan(appState);
  inisialisasiKawan(appState);
  renderDaftarKawan(appState);
  inisialisasiPoinRank(appState);
  inisialisasiJurnal(appState);
  inisialisasiEdukasi(appState);
  inisialisasiAksesibilitas();
  inisialisasiPanelPrivasi();
  inisialisasiDialogAjakanDanLaporan();
  inisialisasiTabBeranda();
  inisialisasiNavigasiHalaman(appState);
  inisialisasiGerakAI(appState);

  // 5. Jika dibuka langsung dengan hash #workout tapi belum hitung gizi, arahkan ke #gizi
  if (window.location.hash === "#workout" && !appState.data.profilGizi) {
    history.replaceState(null, "", "#gizi");
    window.location.hash = "#gizi";
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mulaiAplikasi);
} else {
  mulaiAplikasi();
}

// =========================================
// RENDER STATUS: STREAK, LEVEL, BADGE
// =========================================

function tampilStreak() {
  const angkaStreak = document.getElementById("angkaStreak");
  const teksStreak = document.getElementById("teksStreak");
  const wadahMinggu = document.getElementById("mingguIni");
  const infoJatah = document.getElementById("infoJatahIstirahat");

  if (angkaStreak) angkaStreak.textContent = appState.data.streak || 0;

  if (teksStreak) {
    if (appState.data.terakhirCheckin === hariIni()) {
      teksStreak.textContent = "Mantap! Kamu sudah merawat badanmu hari ini.";
    } else if (appState.data.streak > 0) {
      teksStreak.textContent = "Check-in hari ini agar streak sehatmu tetap terjaga.";
    } else if (appState.data.rekorStreak > 0) {
      teksStreak.textContent = `Mulai lagi hari ini! Rekor terbaikmu: ${appState.data.rekorStreak} hari.`;
    } else {
      teksStreak.textContent = "Yuk check-in untuk menyalakan api kebiasaan sehatmu!";
    }
  }

  if (infoJatah) {
    const sisa = appState.data.sisaJatahIstirahat || 0;
    infoJatah.textContent = `Jatah istirahat: ${sisa} hari (streak tidak putus jika terlewat 1 hari)`;
  }

  // Tampilkan 7 hari terakhir
  if (wadahMinggu) {
    wadahMinggu.textContent = "";
    const namaHari = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    for (let i = 6; i >= 0; i--) {
      const tgl = new Date();
      tgl.setDate(tgl.getDate() - i);
      const strTgl = formatTanggal(tgl);

      const sudahCheckin = (appState.data.tanggalCheckin || []).includes(strTgl);
      const labelAria = `${namaHari[tgl.getDay()]}, ${sudahCheckin ? "sudah check-in" : "belum check-in"}`;

      const kotak = el("div", {
        class: `hari ${sudahCheckin ? "nyala" : ""}`,
        text: namaHari[tgl.getDay()],
        attrs: {
          "aria-label": labelAria,
          role: "img"
        }
      });
      wadahMinggu.appendChild(kotak);
    }
  }
}

function tampilLevel() {
  const info = hitungInfoLevel(appState.data.xp || 0);

  const angkaLevel = document.getElementById("angkaLevel");
  const angkaXP = document.getElementById("angkaXP");
  const isiXP = document.getElementById("isiXP");
  const namaLevel = document.getElementById("namaLevel");
  const barXP = document.getElementById("barXP");

  if (angkaLevel) angkaLevel.textContent = info.level;
  if (angkaXP) angkaXP.textContent = info.xpLevelIni;
  if (isiXP) isiXP.style.width = `${info.persen}%`;
  if (namaLevel) namaLevel.textContent = info.namaLevel;

  if (barXP) {
    barXP.setAttribute("aria-valuenow", info.xpLevelIni);
    barXP.setAttribute("aria-valuemin", 0);
    barXP.setAttribute("aria-valuemax", 100);
    barXP.setAttribute("aria-label", `Progres level ${info.level}: ${info.xpLevelIni} dari 100 XP`);
  }
}

function tampilBadge() {
  const wadah = document.getElementById("daftarBadge");
  if (!wadah) return;

  wadah.textContent = "";
  const daftar = ambilDaftarBadge(appState.data);

  daftar.forEach(badge => {
    const kotak = el("div", {
      class: `badge ${badge.terbuka ? "" : "terkunci"}`,
      attrs: {
        role: "group",
        "aria-label": `Badge ${badge.nama}: ${badge.terbuka ? "Terbuka" : "Terkunci"}. Syarat: ${badge.deskripsi}`
      }
    },
      el("p", { class: "badge-ikon", text: badge.ikon, attrs: { "aria-hidden": "true" } }),
      el("p", { class: "badge-nama", text: badge.nama }),
      el("p", { class: "badge-deskripsi", text: badge.deskripsi }),
      el("p", {
        class: `kartu-kecil badge-status ${badge.terbuka ? "status-terbuka" : "status-terkunci"}`,
        text: badge.terbuka ? "✔ Terbuka" : "🔒 Terkunci"
      })
    );
    wadah.appendChild(kotak);
  });
}

// =========================================
// CHECK-IN INTERAKTIF DENGAN PERAWATAN DIRI
// =========================================

function inisialisasiCheckin() {
  const tombolCheckin = document.getElementById("tombolCheckin");
  const dialogCheckin = document.getElementById("dialogCheckin");
  const formCheckin = document.getElementById("formCheckin");

  if (tombolCheckin && dialogCheckin) {
    tombolCheckin.addEventListener("click", () => {
      if (appState.data.terakhirCheckin === hariIni()) {
        tampilToast("Kamu sudah check-in hari ini 👍");
        return;
      }
      if (typeof dialogCheckin.showModal === "function") {
        dialogCheckin.showModal();
      } else {
        dialogCheckin.setAttribute("open", "");
      }
    });
  }

  if (formCheckin && dialogCheckin) {
    formCheckin.addEventListener("submit", e => {
      e.preventDefault();

      const checkboxDipilih = formCheckin.querySelectorAll('input[name="aktivitasCheckin"]:checked');
      const aktivitasList = Array.from(checkboxDipilih).map(cb => cb.value);

      if (aktivitasList.length === 0) {
        tampilToast("Pilih minimal satu aktivitas untuk badanmu hari ini ya 🙂");
        return;
      }

      const res = prosesCheckin(appState.data, aktivitasList, hariIni());
      if (res.sukses) {
        simpanData("gerakData", appState.data);
        appState.perbaruiUILevel();
        dialogCheckin.close();

        let pesan = `🔥 Streak bertambah jadi ${res.streak} hari! +${res.xpBertambah} XP`;
        if (res.naikLevel) {
          pesan += ` 🎉 Naik ke Level ${res.levelBaru}!`;
        }
        tampilToast(pesan);
      } else {
        tampilToast(res.pesan);
      }
    });
  }
}

// =========================================
// KALKULATOR GIZI AMAN & EDUKATIF
// =========================================

/**
 * Menyinkronkan form kalkulator gizi dengan profil akun utama
 * @param {object} appState
 */
export function sinkronkanFormGiziDenganAkun(appState) {
  const akun = appState?.data?.akun || {};
  const gizi = appState?.data?.profilGizi || {};

  const inputTanggalLahir = document.getElementById("tanggalLahir");
  const inputUmur = document.getElementById("umur");
  const selectKelamin = document.getElementById("kelamin");
  const inputTinggi = document.getElementById("tinggi");
  const inputBerat = document.getElementById("berat");
  const infoKunciKelamin = document.getElementById("infoKunciKelamin");
  const infoKunciTinggi = document.getElementById("infoKunciTinggi");

  // 1. Tanggal lahir & umur
  const tglLahir = akun.tanggalLahir || "";
  if (inputTanggalLahir && tglLahir) {
    inputTanggalLahir.value = tglLahir;
  }

  let umurHitung = null;
  if (inputTanggalLahir && inputTanggalLahir.value) {
    umurHitung = hitungUmurDariTanggalLahir(inputTanggalLahir.value);
  }
  if (umurHitung === null && (akun.umur || gizi.umur)) {
    umurHitung = Number(akun.umur || gizi.umur);
  }

  if (inputUmur) {
    if (umurHitung !== null) {
      inputUmur.value = umurHitung;
    }
    inputUmur.readOnly = true;
  }

  // 2. Jenis kelamin: dikunci jika sudah terkonfirmasi di profil akun
  const kelaminTersimpan = akun.jenisKelamin || gizi.kelamin;
  if (selectKelamin) {
    if (kelaminTersimpan) {
      selectKelamin.value = kelaminTersimpan;
      selectKelamin.disabled = true;
      if (infoKunciKelamin) infoKunciKelamin.style.display = "inline";
    } else {
      selectKelamin.disabled = false;
      if (infoKunciKelamin) infoKunciKelamin.style.display = "none";
    }
  }

  const kelaminAktif = (selectKelamin && selectKelamin.disabled && kelaminTersimpan)
    ? kelaminTersimpan
    : (selectKelamin ? selectKelamin.value : "pria");

  // 3. Tinggi badan: dikunci jika umur >= 18 (perempuan) atau >= 21 (laki-laki)
  const tinggiTersimpan = akun.tinggiBadan || gizi.tinggi;
  if (inputTinggi && tinggiTersimpan) {
    inputTinggi.value = tinggiTersimpan;
  }

  const tinggiDikunci = apakahTinggiDikunci(kelaminAktif, umurHitung);
  if (inputTinggi) {
    if (tinggiDikunci && tinggiTersimpan) {
      inputTinggi.readOnly = true;
      if (infoKunciTinggi) {
        infoKunciTinggi.style.display = "inline";
        const batasUsia = kelaminAktif === "wanita" ? "18" : "21";
        infoKunciTinggi.textContent = `🔒 Terkunci batas usia (${batasUsia} th)`;
      }
    } else {
      inputTinggi.readOnly = false;
      if (infoKunciTinggi) infoKunciTinggi.style.display = "none";
    }
  }

  // 4. Berat badan: selalu dapat diperbarui oleh pengguna
  const beratTersimpan = akun.beratBadan || gizi.berat;
  if (inputBerat && beratTersimpan) {
    inputBerat.value = beratTersimpan;
  }

  // 5. Target gizi
  const targetTersimpan = gizi.target || akun.target;
  if (targetTersimpan) {
    const radio = document.querySelector(`input[name="target"][value="${targetTersimpan}"]`);
    if (radio) radio.checked = true;
  }
}

function inisialisasiFormGizi() {
  const form = document.getElementById("formGizi");
  const tanggalLahirInput = document.getElementById("tanggalLahir");
  const umurInput = document.getElementById("umur");
  const kelaminInput = document.getElementById("kelamin");
  const tinggiInput = document.getElementById("tinggi");
  const beratInput = document.getElementById("berat");
  const infoRemajaGizi = document.getElementById("infoRemajaGizi");
  const radioDiet = document.querySelector('input[name="target"][value="diet"]');
  const radioBulking = document.querySelector('input[name="target"][value="bulking"]');
  const radioJaga = document.querySelector('input[name="target"][value="jaga"]');

  // Proteksi realtime saat umur diubah / tanggal lahir diinput
  function sesuaikanOpsiBerdasarkanUmur() {
    const u = umurInput ? Number(umurInput.value) : NaN;
    const isRemaja = Number.isFinite(u) && u < CONFIG.UMUR_DEWASA_MIN;

    if (isRemaja) {
      if (radioDiet) radioDiet.disabled = true;
      if (radioBulking) radioBulking.disabled = true;
      if (radioJaga) radioJaga.checked = true;
      if (infoRemajaGizi) {
        infoRemajaGizi.style.display = "block";
        infoRemajaGizi.textContent = "Untuk usia di bawah 18 tahun, opsi Diet dan Bulking dinonaktifkan. Fokuslah pada target Jaga gizi seimbang masa pertumbuhan.";
      }
    } else {
      if (radioDiet) radioDiet.disabled = false;
      if (radioBulking) radioBulking.disabled = false;
      if (infoRemajaGizi) {
        infoRemajaGizi.style.display = "none";
      }
    }
  }

  // Penyesuaian dinamis saat tanggal lahir dipilih
  function tanganiPerubahanTanggalLahir() {
    if (!tanggalLahirInput || !tanggalLahirInput.value) return;
    const u = hitungUmurDariTanggalLahir(tanggalLahirInput.value);
    if (u !== null) {
      if (umurInput) umurInput.value = u;
      sesuaikanOpsiBerdasarkanUmur();
      periksaPenguncianTinggi();
    }
  }

  function periksaPenguncianTinggi() {
    const akun = appState?.data?.akun || {};
    const kelaminVal = kelaminInput ? (kelaminInput.disabled ? (akun.jenisKelamin || kelaminInput.value) : kelaminInput.value) : "pria";
    const u = umurInput ? Number(umurInput.value) : (akun.umur || 20);
    const terkunci = apakahTinggiDikunci(kelaminVal, u);
    const infoKunciTinggi = document.getElementById("infoKunciTinggi");

    if (tinggiInput) {
      if (terkunci && (akun.tinggiBadan || tinggiInput.value)) {
        tinggiInput.readOnly = true;
        if (infoKunciTinggi) {
          infoKunciTinggi.style.display = "inline";
          const batas = kelaminVal === "wanita" ? "18" : "21";
          infoKunciTinggi.textContent = `🔒 Terkunci batas usia (${batas} th)`;
        }
      } else {
        tinggiInput.readOnly = false;
        if (infoKunciTinggi) infoKunciTinggi.style.display = "none";
      }
    }
  }

  if (tanggalLahirInput) {
    tanggalLahirInput.addEventListener("input", tanganiPerubahanTanggalLahir);
    tanggalLahirInput.addEventListener("change", tanganiPerubahanTanggalLahir);
  }

  if (kelaminInput) {
    kelaminInput.addEventListener("change", periksaPenguncianTinggi);
  }

  // Pastikan kartu hasil gizi dan tombol Mulai Work Out berstatus awal (bersih/terkunci)
  const angkaKalori = document.getElementById("angkaKalori");
  const proteinEl = document.getElementById("protein");
  const karboEl = document.getElementById("karbo");
  const lemakEl = document.getElementById("lemak");
  const bmiInfo = document.getElementById("bmiInfo");
  const tombolMulaiWorkout = document.getElementById("tombolMulaiWorkoutDariGizi");
  if (angkaKalori) angkaKalori.textContent = "-";
  if (proteinEl) proteinEl.textContent = "-";
  if (karboEl) karboEl.textContent = "-";
  if (lemakEl) lemakEl.textContent = "-";
  if (bmiInfo) bmiInfo.textContent = "";
  if (tombolMulaiWorkout) tombolMulaiWorkout.style.display = "none";

  sesuaikanOpsiBerdasarkanUmur();

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      // Reset error inline
      document.querySelectorAll(".pesan-error-inline").forEach(el => el.textContent = "");
      document.querySelectorAll("[aria-invalid]").forEach(el => el.removeAttribute("aria-invalid"));

      const akun = appState?.data?.akun;

      // 1. Validasi Tanggal Lahir & Hitung Umur Otomatis
      const tglLahirVal = tanggalLahirInput ? tanggalLahirInput.value : "";
      const errTanggalLahir = document.getElementById("errTanggalLahir");
      if (!tglLahirVal && !akun?.tanggalLahir) {
        if (errTanggalLahir) errTanggalLahir.textContent = "Pilih tanggal lahir untuk menghitung umur otomatis.";
        if (tanggalLahirInput) {
          tanggalLahirInput.setAttribute("aria-invalid", "true");
          tanggalLahirInput.focus();
        }
        return;
      }

      const tanggalLahirFinal = tglLahirVal || akun?.tanggalLahir;
      const umur = hitungUmurDariTanggalLahir(tanggalLahirFinal);
      if (umur === null) {
        if (errTanggalLahir) errTanggalLahir.textContent = "Format tanggal lahir tidak valid.";
        if (tanggalLahirInput) tanggalLahirInput.setAttribute("aria-invalid", "true");
        return;
      }
      if (umurInput) umurInput.value = umur;

      // 2. Jenis Kelamin (dikunci bila profil akun sudah mengonfirmasinya)
      const kelamin = (kelaminInput && kelaminInput.disabled && akun?.jenisKelamin)
        ? akun.jenisKelamin
        : (kelaminInput ? kelaminInput.value : "pria");

      // 3. Tinggi Badan (dikunci bila melewati batas usia 18 th perempuan / 21 th laki-laki)
      const tinggiDikunci = apakahTinggiDikunci(kelamin, umur);
      let tinggi = tinggiInput ? Number(tinggiInput.value) : 168;
      if (tinggiDikunci && akun?.tinggiBadan) {
        tinggi = akun.tinggiBadan;
        if (tinggiInput) tinggiInput.value = tinggi;
      }

      // 4. Berat Badan (selalu dapat diperbarui pengguna)
      const berat = beratInput ? Number(beratInput.value) : 60;

      // 5. Tingkat Aktivitas & Target
      const aktivitasInput = document.getElementById("aktivitas");
      const aktivitas = aktivitasInput ? Number(aktivitasInput.value) : 1.375;
      const radioPilihan = document.querySelector('input[name="target"]:checked');
      const target = radioPilihan ? radioPilihan.value : "jaga";

      // Validasi Parameter Gizi
      const validasi = validasiInputGizi({ kelamin, umur, berat, tinggi, aktivitas, target });
      if (!validasi.valid) {
        if (validasi.errors.berat) {
          const errBerat = document.getElementById("errBerat");
          if (errBerat) errBerat.textContent = validasi.errors.berat;
          if (beratInput) {
            beratInput.setAttribute("aria-invalid", "true");
            beratInput.focus();
          }
        }
        if (validasi.errors.tinggi) {
          const errTinggi = document.getElementById("errTinggi");
          if (errTinggi) errTinggi.textContent = validasi.errors.tinggi;
          if (tinggiInput) tinggiInput.setAttribute("aria-invalid", "true");
        }
        if (validasi.errors.umur) {
          const errUmur = document.getElementById("errUmur");
          if (errUmur) errUmur.textContent = validasi.errors.umur;
          if (umurInput) umurInput.setAttribute("aria-invalid", "true");
        }
        return;
      }

      const hasil = hitungKebutuhan({ kelamin, umur, berat, tinggi, aktivitas, target });

      const angkaKalori = document.getElementById("angkaKalori");
      const proteinEl = document.getElementById("protein");
      const karboEl = document.getElementById("karbo");
      const lemakEl = document.getElementById("lemak");
      const saranGizi = document.getElementById("saranGizi");
      const bmiInfo = document.getElementById("bmiInfo");
      const tombolMulaiWorkout = document.getElementById("tombolMulaiWorkoutDariGizi");

      if (hasil.status === "diblokir") {
        if (angkaKalori) angkaKalori.textContent = "-";
        if (proteinEl) proteinEl.textContent = "-";
        if (karboEl) karboEl.textContent = "-";
        if (lemakEl) lemakEl.textContent = "-";
        if (saranGizi) saranGizi.textContent = hasil.catatan;
        if (bmiInfo) {
          bmiInfo.textContent = hasil.bmi ? `BMI kamu: ${hasil.bmi}` : "";
        }
        if (tombolMulaiWorkout) tombolMulaiWorkout.style.display = "none";
        tampilToast(hasil.catatan, 5000);
        return;
      }

      // Berhasil (ok atau ok-dinaikkan)
      if (angkaKalori) angkaKalori.textContent = hasil.kalori.toLocaleString("id-ID");
      if (proteinEl) proteinEl.textContent = `${hasil.protein}g`;
      if (karboEl) karboEl.textContent = `${hasil.karbo}g`;
      if (lemakEl) lemakEl.textContent = `${hasil.lemak}g`;
      if (saranGizi) saranGizi.textContent = hasil.catatan;
      if (bmiInfo) {
        bmiInfo.textContent = `BMI kamu: ${hasil.bmi}`;
      }

      // Tampilkan tombol Mulai Work Out tepat di bawah bagian hasil kalori
      if (tombolMulaiWorkout) {
        tombolMulaiWorkout.style.display = "block";
      }

      // Sinkronkan ke data akun pengguna
      if (!appState.data.akun) {
        appState.data.akun = { nama: "Pengguna" };
      }
      const dataAkun = appState.data.akun;
      dataAkun.tanggalLahir = tanggalLahirFinal;
      dataAkun.umur = umur;
      dataAkun.jenisKelamin = kelamin; // terkunci setelah profil dikonfirmasi
      if (!tinggiDikunci || !dataAkun.tinggiBadan) {
        dataAkun.tinggiBadan = tinggi;
      }

      // Simpan berat badan awal secara terpisah agar progres jangka panjang tidak hilang
      if (dataAkun.beratBadanAwal === undefined || dataAkun.beratBadanAwal === null) {
        dataAkun.beratBadanAwal = berat;
        dataAkun.tanggalBeratAwal = hariIni();
      }
      dataAkun.beratBadan = berat;
      dataAkun.tanggalCatatBerat = hariIni();
      dataAkun.target = target;
      if (!Array.isArray(dataAkun.riwayatBerat)) {
        dataAkun.riwayatBerat = [];
      }
      dataAkun.riwayatBerat.push({ berat, tanggal: hariIni() });

      // Simpan umurUser di appState untuk perlindungan kawan
      appState.data.umurUser = umur;

      // Simpan profil gizi ke state & penyimpanan
      appState.data.profilGizi = {
        target,
        kalori: hasil.kalori,
        protein: hasil.protein,
        karbo: hasil.karbo,
        lemak: hasil.lemak,
        bmi: hasil.bmi,
        berat,
        tinggi,
        umur,
        kelamin,
        tanggal: hariIni()
      };
      simpanData("gerakData", appState.data);

      // Buka kunci dan perbarui tampilan Work Out
      renderWorkout(appState);

      // Sinkronkan UI form, kartu AYO MULAI di Beranda, dan aktivitas hari ini
      sinkronkanFormGiziDenganAkun(appState);
      perbaruiUIAyoMulai(appState);
      perbaruiUIBeranda(appState);

      const pesanToast = hasil.status === "ok-dinaikkan"
        ? "Kalori disesuaikan ke batas aman minimum. Menu Work Out kini terbuka! 🔓"
        : "Perhitungan gizi tersimpan & profil tersinkron! Menu Work Out kini terbuka! 🔓";
      tampilToast(pesanToast);
    });
  }
}

// =========================================
// DIALOG AJAKAN & LAPORAN KAWAN
// =========================================

function inisialisasiDialogAjakanDanLaporan() {
  const dialogAjak = document.getElementById("dialogAjak");
  const formAjak = document.getElementById("formAjak");
  const dialogLapor = document.getElementById("dialogLapor");
  const formLapor = document.getElementById("formLapor");

  if (formAjak && dialogAjak) {
    formAjak.addEventListener("submit", e => {
      e.preventDefault();

      const kawanId = dialogAjak.dataset.kawanId;
      const kawanNama = dialogAjak.dataset.kawanNama;
      const tempat = (document.getElementById("tempatAjakInput")?.value || "").trim();
      const hari = document.getElementById("hariAjakSelect")?.value || "";
      const pesan = (document.getElementById("pesanAjakInput")?.value || "").trim();
      const checkAman = document.getElementById("checkTempatAman");

      if (!checkAman || !checkAman.checked) {
        tampilToast("Demi keamanan, pastikan kamu menyetujui pertemuan di tempat umum yang ramai.");
        return;
      }

      if (!tempat) {
        tampilToast("Isi lokasi pertemuan yang spesifik ya.");
        return;
      }

      // Catat ajakan
      if (!appState.data.ajakanKawan) appState.data.ajakanKawan = [];
      appState.data.ajakanKawan.unshift({
        id: "ajak_" + Date.now(),
        kawanId,
        kawanNama,
        hari,
        tempat,
        pesan,
        tanggal: hariIni(),
        status: "Terkirim (demo)"
      });

      appState.data.jumlahAjakan = (appState.data.jumlahAjakan || 0) + 1;
      const hasilXP = tambahXPAman(appState.data, "ajakan", { kawanId });
      simpanData("gerakData", appState.data);

      appState.perbaruiUILevel();
      dialogAjak.close();

      if (hasilXP.bertambah > 0) {
        tampilToast(`Ajakan ke ${kawanNama} terkirim (demo)! +${hasilXP.bertambah} XP 🎉`);
      } else if (hasilXP.pesanPenuh) {
        tampilToast(hasilXP.pesanPenuh);
      } else {
        tampilToast(`Ajakan ke ${kawanNama} terkirim (mode demo).`);
      }
    });
  }

  if (formLapor && dialogLapor) {
    formLapor.addEventListener("submit", e => {
      e.preventDefault();

      const kawanId = dialogLapor.dataset.kawanId;
      const kawanNama = dialogLapor.dataset.kawanNama;
      const alasan = document.getElementById("alasanLaporSelect").value;
      const catatan = document.getElementById("catatanLaporInput").value.trim();

      if (!appState.data.laporanKawan) appState.data.laporanKawan = [];
      appState.data.laporanKawan.push({
        id: "lapor_" + Date.now(),
        kawanId,
        kawanNama,
        alasan,
        catatan,
        tanggal: hariIni()
      });

      simpanData("gerakData", appState.data);
      dialogLapor.close();
      tampilToast(`Laporan terkait ${kawanNama} telah dikirim ke tim keamanan GERAK (demo) 🛡️`);
    });
  }
}

// =========================================
// PANEL DATA & PRIVASI (FOOTER)
// =========================================

function inisialisasiPanelPrivasi() {
  const tombolEkspor = document.getElementById("tombolEksporData");
  const tombolHapus = document.getElementById("tombolHapusData");

  if (tombolEkspor) {
    tombolEkspor.addEventListener("click", eksporDataJSON);
  }

  if (tombolHapus) {
    tombolHapus.addEventListener("click", () => {
      const dialog = document.getElementById("dialogHapusData");
      if (dialog) {
        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
        }
      }
    });
  }

  const tombolKonfirmasiHapus = document.getElementById("konfirmasiHapusData");
  if (tombolKonfirmasiHapus) {
    tombolKonfirmasiHapus.addEventListener("click", () => {
      hapusSemuaData();
    });
  }
}

// =========================================
// TAB SWITCHER BERANDA (SIAP MELAKUKAN VS 4 PILAR)
// =========================================

function inisialisasiTabBeranda() {
  const tabSiapMelakukan = document.getElementById("tabBtnSiapMelakukan");
  const tabEmpatPilar = document.getElementById("tabBtnEmpatPilar");
  const panelSiapMelakukan = document.getElementById("wadahAktivitasHariIni");
  const panelEmpatPilar = document.getElementById("wadahEmpatPilarBeranda");

  if (!tabSiapMelakukan || !tabEmpatPilar || !panelSiapMelakukan || !panelEmpatPilar) return;

  tabSiapMelakukan.addEventListener("click", () => {
    tabSiapMelakukan.classList.add("tab-beranda-aktif");
    tabSiapMelakukan.setAttribute("aria-selected", "true");
    tabEmpatPilar.classList.remove("tab-beranda-aktif");
    tabEmpatPilar.setAttribute("aria-selected", "false");

    panelSiapMelakukan.style.display = "block";
    panelSiapMelakukan.classList.add("panel-tab-aktif");
    panelEmpatPilar.style.display = "none";
    panelEmpatPilar.classList.remove("panel-tab-aktif");
  });

  tabEmpatPilar.addEventListener("click", () => {
    tabEmpatPilar.classList.add("tab-beranda-aktif");
    tabEmpatPilar.setAttribute("aria-selected", "true");
    tabSiapMelakukan.classList.remove("tab-beranda-aktif");
    tabSiapMelakukan.setAttribute("aria-selected", "false");

    panelEmpatPilar.style.display = "block";
    panelEmpatPilar.classList.add("panel-tab-aktif");
    panelSiapMelakukan.style.display = "none";
    panelSiapMelakukan.classList.remove("panel-tab-aktif");
  });
}

// =========================================
// ROUTER APLIKASI (ONE PAGE = ONE SCREEN)
// =========================================

export function inisialisasiNavigasiHalaman(appState) {
  const daftarBagian = document.querySelectorAll("main > section.bagian, main > section#beranda");
  const menuLinks = document.querySelectorAll(".menu a, .logo, .user-profile-nav a");
  const footer = document.querySelector(".footer");

  function bukaHalaman(hash) {
    let idTarget = (hash && hash.startsWith("#")) ? hash.slice(1) : "beranda";
    if (!idTarget) idTarget = "beranda";

    // Cek proteksi gizi sebelum buka workout
    if (idTarget === "workout" && !appState?.data?.profilGizi) {
      idTarget = "gizi";
      window.location.hash = "#gizi";
      tampilToast("🔒 Atur kebutuhan gizi kamu dulu ya sebelum membuka menu Work Out!");
    }

    let targetEl = document.getElementById(idTarget);
    if (!targetEl) {
      targetEl = document.getElementById("beranda");
      idTarget = "beranda";
    }

    daftarBagian.forEach(bagian => {
      if (bagian === targetEl) {
        bagian.classList.add("halaman-aktif");
        bagian.style.display = "";
      } else {
        bagian.classList.remove("halaman-aktif");
        bagian.style.display = "none";
      }
    });

    // Update active class pada navbar
    menuLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === `#${idTarget}`) {
        link.classList.add("aktif");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("aktif");
        link.removeAttribute("aria-current");
      }
    });

    // Tampilkan footer di setiap halaman yang dapat di-scroll
    if (footer) {
      footer.style.display = "";
    }

    // Riwayat kesehatan dibaca ulang tiap buka Work Out (data bisa berganti setelah masuk/keluar akun)
    if (idTarget === "workout") {
      renderRiwayatKesehatan();
    }

    // Perbarui UI jika kembali ke beranda
    if (idTarget === "beranda") {
      perbaruiUIAyoMulai(appState);
      perbaruiUIBeranda(appState);
    }

    perbaruiHalamanAi(idTarget);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  window.addEventListener("hashchange", () => {
    bukaHalaman(window.location.hash);
  });

  // Panggil saat inisialisasi awal
  bukaHalaman(window.location.hash || "#beranda");
}