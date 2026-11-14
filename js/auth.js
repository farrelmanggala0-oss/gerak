// =========================================
// GERAK - js/auth.js
// Modul Autentikasi Pengguna: Masuk / Daftar Akun GERAK
// Menjaga fitur Cari Kawan aman dan berbasis komunitas
// =========================================

import { el, tampilToast, mainkanLoading } from "./ui.js";
import { simpanData } from "./penyimpanan.js";
import { hariIni } from "./tanggal.js";
import { hitungInfoRank } from "./poin-rank.js";
import { perbaruiUIAyoMulai } from "./ayo-mulai.js";

/**
 * Cek apakah pengguna saat ini sudah memiliki akun aktif / masuk
 */
export function apakahSudahMasuk(appState) {
  return Boolean(appState && appState.data && appState.data.akun && appState.data.akun.nama);
}

/**
 * Inisialisasi sistem autentikasi dan form Masuk / Daftar
 */
export function inisialisasiAuth(appState, onAuthChange = null) {
  const dialog = document.getElementById("dialogAuth");
  const tombolBukaNav = document.getElementById("tombolBukaAuth");
  const btnDariKawan = document.getElementById("btnBukaAuthDariKawan");
  const btnHeroCariKawan = document.getElementById("tombolHeroCariKawan");
  const tombolKeluar = document.getElementById("tombolKeluarAkun");

  const formDaftar = document.getElementById("formDaftar");
  const formMasuk = document.getElementById("formMasuk");
  const linkPindahMasuk = document.getElementById("linkPindahMasuk");
  const linkPindahDaftar = document.getElementById("linkPindahDaftar");

  // Ganti mode Daftar <-> Masuk: panel geser + efek blur (desain Gerak Pertama)
  function gantiTabAuth(tab) {
    aturModeAuth(tab, true);
    const input = document.getElementById(tab === "daftar" ? "inputDaftarNama" : "inputMasukIdentitas");
    if (input) input.focus();
  }

  // Tombol panel (Masuk → / Buat Akun →) dan tombol Lihat/Tutup kata sandi
  if (dialog) {
    dialog.addEventListener("click", e => {
      const tombolPanel = e.target.closest("[data-auth]");
      if (tombolPanel) gantiTabAuth(tombolPanel.dataset.auth);
      const tombolPw = e.target.closest('[data-aksi="lihat-pw"]');
      if (tombolPw) {
        const pw = tombolPw.previousElementSibling;
        const lihat = pw.type === "password";
        pw.type = lihat ? "text" : "password";
        tombolPw.textContent = lihat ? "Tutup" : "Lihat";
        tombolPw.setAttribute("aria-label", lihat ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
      }
    });
  }

  if (linkPindahMasuk) linkPindahMasuk.addEventListener("click", () => gantiTabAuth("masuk"));
  if (linkPindahDaftar) linkPindahDaftar.addEventListener("click", () => gantiTabAuth("daftar"));

  // Tombol buka di navbar
  if (tombolBukaNav) {
    tombolBukaNav.addEventListener("click", () => {
      bukaDialogAuth("daftar");
    });
  }

  // Tombol buka dari kotak terkunci kawan
  if (btnDariKawan) {
    btnDariKawan.addEventListener("click", () => {
      bukaDialogAuth("daftar");
    });
  }

  // Tombol aksi Guest Mode Beranda
  const tombolGuestMulaiGratis = document.getElementById("tombolGuestMulaiGratis");
  const tombolGuestCtaMini = document.getElementById("tombolGuestCtaMini");
  const tombolCtaDaftarGuest = document.getElementById("tombolCtaDaftarGuest");
  const tombolGuestJelajahi = document.getElementById("tombolGuestJelajahi");

  if (tombolGuestMulaiGratis) {
    tombolGuestMulaiGratis.addEventListener("click", () => {
      bukaDialogAuth("daftar");
    });
  }

  if (tombolGuestCtaMini) {
    tombolGuestCtaMini.addEventListener("click", () => {
      bukaDialogAuth("daftar");
    });
  }

  if (tombolCtaDaftarGuest) {
    tombolCtaDaftarGuest.addEventListener("click", () => {
      bukaDialogAuth("daftar");
    });
  }

  if (tombolGuestJelajahi) {
    tombolGuestJelajahi.addEventListener("click", e => {
      e.preventDefault();
      const target = document.getElementById("pengenalanFiturGuest");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Intersepsi tombol Hero "Cari Kawan Gerak"
  if (btnHeroCariKawan) {
    btnHeroCariKawan.addEventListener("click", e => {
      if (!apakahSudahMasuk(appState)) {
        e.preventDefault();
        tampilToast("🔒 Buat akun atau masuk terlebih dahulu untuk mencari kawan olahraga!");
        bukaDialogAuth("daftar");
      }
    });
  }

  // Intersepsi menu navbar "Kawan"
  const navKawan = document.getElementById("navKawan");
  if (navKawan) {
    navKawan.addEventListener("click", e => {
      if (!apakahSudahMasuk(appState)) {
        // Biarkan scroll ke bagian kawan, tapi tampilkan toast informatif
        tampilToast("🔒 Buat akun atau masuk terlebih dahulu untuk mencari kawan olahraga!");
      }
    });
  }

  // Tombol Keluar Akun
  if (tombolKeluar) {
    tombolKeluar.addEventListener("click", () => {
      keluarAkun(appState, onAuthChange);
    });
  }

  // Submit Form Daftar
  if (formDaftar) {
    formDaftar.addEventListener("submit", e => {
      e.preventDefault();
      const nama = document.getElementById("inputDaftarNama").value.trim();
      const email = document.getElementById("inputDaftarEmail").value.trim();
      const sandi = document.getElementById("inputDaftarSandi").value;

      if (!nama || !email || !sandi) {
        tampilToast("Mohon lengkapi semua kolom pendaftaran.");
        return;
      }

      // Simpan data akun pengguna (pertahankan data profil jika sudah ada)
      appState.data.akun = {
        ...(appState.data.akun || {}),
        nama,
        email,
        olahragaFavorit: (appState.data.akun && appState.data.akun.olahragaFavorit) || "",
        tanggalDaftar: (appState.data.akun && appState.data.akun.tanggalDaftar) || hariIni()
      };
      simpanData("gerakData", appState.data);

      formDaftar.reset();
      tutupDialogAuth();
      mainkanLoading(() => {
        perbaruiUIAkun(appState);
        if (typeof onAuthChange === "function") onAuthChange();
      }, () => {
        tampilToast(`🎉 Selamat datang, ${nama}! Akunmu aktif. Fitur Cari Kawan kini terbuka!`);
      });
    });
  }

  // Submit Form Masuk
  if (formMasuk) {
    formMasuk.addEventListener("submit", e => {
      e.preventDefault();
      const identitas = document.getElementById("inputMasukIdentitas").value.trim();
      const sandi = document.getElementById("inputMasukSandi").value;

      if (!identitas || !sandi) {
        tampilToast("Mohon masukkan nama/email dan kata sandi.");
        return;
      }

      // Ambil nama dari identitas jika belum terdaftar sebelumnya
      const namaPengguna = identitas.includes("@") ? identitas.split("@")[0] : identitas;

      appState.data.akun = {
        ...(appState.data.akun || {}),
        nama: namaPengguna,
        email: identitas.includes("@") ? identitas : `${namaPengguna.toLowerCase()}@gerak.id`,
        olahragaFavorit: (appState.data.akun && appState.data.akun.olahragaFavorit) || "Lari",
        tanggalDaftar: (appState.data.akun && appState.data.akun.tanggalDaftar) || hariIni()
      };
      simpanData("gerakData", appState.data);

      formMasuk.reset();
      tutupDialogAuth();
      mainkanLoading(() => {
        perbaruiUIAkun(appState);
        if (typeof onAuthChange === "function") onAuthChange();
      }, () => {
        tampilToast(`👋 Selamat datang kembali, ${namaPengguna}!`);
      });
    });
  }

  // Render UI awal sesuai status akun
  perbaruiUIAkun(appState);
}

/**
 * Buka dialog modal autentikasi
 */
export function bukaDialogAuth(tab = "daftar") {
  const dialog = document.getElementById("dialogAuth");
  if (!dialog) return;

  aturModeAuth(tab, false);

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

/**
 * Atur mode kartu login: "daftar" atau "masuk". animasi = ulang efek blur
 */
function aturModeAuth(tab, animasi) {
  const kartu = document.getElementById("auth");
  if (!kartu) return;
  kartu.classList.toggle("mode-masuk", tab === "masuk");
  kartu.classList.remove("ganti");
  if (animasi) {
    void kartu.offsetWidth;
    kartu.classList.add("ganti");
  }
}

/**
 * Tutup dialog modal autentikasi
 */
export function tutupDialogAuth() {
  const dialog = document.getElementById("dialogAuth");
  if (!dialog) return;

  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

/**
 * Keluar dari akun saat ini
 */
export function keluarAkun(appState, onAuthChange = null) {
  appState.data.akun = null;
  simpanData("gerakData", appState.data);

  perbaruiUIAkun(appState);
  if (typeof onAuthChange === "function") onAuthChange();

  tampilToast("Kamu telah keluar dari akun. Fitur kawan kini dikunci kembali.");
}

/**
 * Sinkronisasi elemen antarmuka navbar dan seksi kawan berdasarkan status akun
 */
export function perbaruiUIAkun(appState) {
  const tombolBukaNav = document.getElementById("tombolBukaAuth");
  const userProfileNav = document.getElementById("userProfileNav");
  const navUserNama = document.getElementById("navUserNama");
  const navAvatarMini = document.getElementById("navAvatarMini");

  const wadahKawanTerkunci = document.getElementById("wadahKawanTerkunci");
  const filterKawan = document.getElementById("filterKawan");
  const gridKawan = document.getElementById("gridKawan");

  const sudahMasuk = apakahSudahMasuk(appState);

  if (sudahMasuk) {
    const akun = appState.data.akun;
    // Tampilkan profile chip di navbar, sembunyikan tombol Masuk/Daftar
    if (tombolBukaNav) tombolBukaNav.style.display = "none";
    if (userProfileNav) userProfileNav.style.display = "inline-flex";
    if (navUserNama) navUserNama.textContent = akun.nama;
    if (navAvatarMini) navAvatarMini.textContent = akun.nama.charAt(0).toUpperCase();

    // Buka kunci fitur kawan
    if (wadahKawanTerkunci) wadahKawanTerkunci.style.display = "none";
    if (filterKawan) filterKawan.style.display = "flex";
    if (gridKawan) gridKawan.style.display = "grid";
  } else {
    // Sembunyikan profile chip di navbar, tampilkan tombol Masuk/Daftar
    if (tombolBukaNav) tombolBukaNav.style.display = "inline-flex";
    if (userProfileNav) userProfileNav.style.display = "none";

    // Kunci fitur kawan
    if (wadahKawanTerkunci) wadahKawanTerkunci.style.display = "flex";
    if (filterKawan) filterKawan.style.display = "none";
    if (gridKawan) gridKawan.style.display = "none";
  }

  // Perbarui mode tampilan Beranda (Guest vs Member)
  perbaruiUIBeranda(appState);
}

/**
 * Sinkronisasi mode tampilan Beranda: Guest Mode vs Member Mode
 */
export function perbaruiUIBeranda(appState) {
  const wadahGuest = document.getElementById("wadahBerandaGuest");
  const wadahMember = document.getElementById("wadahBerandaMember");
  const sudahMasuk = apakahSudahMasuk(appState);

  if (!wadahGuest || !wadahMember) return;

  if (sudahMasuk) {
    // Mode Member: Pengguna sudah login
    wadahGuest.style.display = "none";
    wadahMember.style.display = "flex";

    const akun = appState.data.akun;
    const memberNamaSapaan = document.getElementById("memberNamaSapaan");
    if (memberNamaSapaan) {
      memberNamaSapaan.textContent = akun.nama;
    }

    // Poin & Rank Member
    const poin = appState.data.poin || 0;
    const infoRank = hitungInfoRank(poin);

    const memberPoinAngka = document.getElementById("memberPoinAngka");
    const memberRankIkon = document.getElementById("memberRankIkon");
    const memberRankNama = document.getElementById("memberRankNama");
    const memberBarPoin = document.getElementById("memberBarPoin");
    const memberSisaPoin = document.getElementById("memberSisaPoin");

    if (memberPoinAngka) memberPoinAngka.textContent = poin;
    if (memberRankIkon) memberRankIkon.textContent = infoRank.rankSekarang.ikon;
    if (memberRankNama) memberRankNama.textContent = infoRank.rankSekarang.nama;
    if (memberBarPoin) memberBarPoin.style.width = `${infoRank.persen}%`;
    if (memberSisaPoin) {
      if (infoRank.isMaxRank) {
        memberSisaPoin.textContent = "Tingkat Tertinggi! 👑";
      } else if (infoRank.rankBerikutnya) {
        memberSisaPoin.textContent = `${infoRank.sisaPoin} poin lagi menuju ${infoRank.rankBerikutnya.nama}`;
      }
    }

    // Pelacak Progres AYO MULAI
    perbaruiUIAyoMulai(appState);

    // Status Check-in Hari Ini
    const memberStatusCheckinBadge = document.getElementById("memberStatusCheckinBadge");
    const tombolCheckin = document.getElementById("tombolCheckin");
    const sudahCheckin = appState.data.terakhirCheckin === hariIni();

    if (memberStatusCheckinBadge) {
      if (sudahCheckin) {
        memberStatusCheckinBadge.textContent = "✅ Sudah check-in hari ini (+20 XP)";
        memberStatusCheckinBadge.style.background = "#dcfce7";
        memberStatusCheckinBadge.style.color = "#166534";
      } else {
        memberStatusCheckinBadge.textContent = "⏳ Belum check-in hari ini";
        memberStatusCheckinBadge.style.background = "#ffffff";
        memberStatusCheckinBadge.style.color = "#111111";
      }
    }

    if (tombolCheckin) {
      if (sudahCheckin) {
        tombolCheckin.textContent = "✔ Sudah Check-in Hari Ini";
      } else {
        tombolCheckin.textContent = "✔ Check-in Hari Ini";
      }
    }

    // Status Gizi & Workout (Aktivitas Hari Ini - Siap Melakukan)
    const badgeStatusGizi = document.getElementById("badgeStatusGizi");
    const deskripsiAksesGizi = document.getElementById("deskripsiAksesGizi");
    const btnAksesGizi = document.getElementById("btnAksesGizi");

    const badgeStatusWorkout = document.getElementById("badgeStatusWorkout");
    const deskripsiAksesWorkout = document.getElementById("deskripsiAksesWorkout");
    const btnAksesWorkout = document.getElementById("btnAksesWorkout");

    const adaGizi = Boolean(appState.data.profilGizi && appState.data.profilGizi.kalori);

    if (badgeStatusGizi && deskripsiAksesGizi) {
      if (adaGizi) {
        const p = appState.data.profilGizi;
        badgeStatusGizi.textContent = `${p.kalori} kkal`;
        badgeStatusGizi.style.background = "#bbf7d0";
        badgeStatusGizi.style.color = "#166534";
        deskripsiAksesGizi.textContent = `Target ${p.target.toUpperCase()}: ${p.kalori} kkal/hari (${p.protein}g protein, ${p.karbo}g karbo, ${p.lemak}g lemak).`;
        if (btnAksesGizi) btnAksesGizi.textContent = "Sesuaikan Gizi ➔";
      } else {
        badgeStatusGizi.textContent = "Belum Dihitung";
        badgeStatusGizi.style.background = "#fef08a";
        badgeStatusGizi.style.color = "#854d0e";
        deskripsiAksesGizi.textContent = "Hitung kebutuhan kalorimu terlebih dahulu untuk membuka program latihan fisik.";
        if (btnAksesGizi) btnAksesGizi.textContent = "Hitung Kalori Sekarang ➔";
      }
    }

    if (badgeStatusWorkout && deskripsiAksesWorkout) {
      if (adaGizi) {
        badgeStatusWorkout.textContent = "Terbuka 🔓";
        badgeStatusWorkout.style.background = "#bbf7d0";
        badgeStatusWorkout.style.color = "#166534";
        deskripsiAksesWorkout.textContent = "Program latihan personal siap dijalankan. Dapatkan +25 poin setiap sesi selesai!";
        if (btnAksesWorkout) btnAksesWorkout.textContent = "Mulai Latihan ➔";
      } else {
        badgeStatusWorkout.textContent = "Terkunci 🔒";
        badgeStatusWorkout.style.background = "#fee2e2";
        badgeStatusWorkout.style.color = "#991b1b";
        deskripsiAksesWorkout.textContent = "Kalkulasi gizi diperlukan agar program latihan disesuaikan dengan energimu secara aman.";
        if (btnAksesWorkout) btnAksesWorkout.textContent = "Buka via Gizi ➔";
      }
    }

  } else {
    // Mode Guest: Pengunjung belum login
    wadahGuest.style.display = "block";
    wadahMember.style.display = "none";

    // Pastikan tidak ada data pribadi pengguna yang tampil pada Guest Mode
    const memberNamaSapaan = document.getElementById("memberNamaSapaan");
    if (memberNamaSapaan) memberNamaSapaan.textContent = "Kawan";
  }
}