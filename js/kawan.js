// =========================================
// GERAK - js/kawan.js
// Render profil kawan inklusif, filter 14 olahraga,
// bagian Sedang Aktif, Olahraga Bareng, dan Teman di Sekitar (Radius & Lokasi)
// =========================================

import { CONFIG } from "./config.js";
import {
  DAFTAR_KAWAN_DEMO,
  DAFTAR_OLAHRAGA_BARENG,
  DAFTAR_TITIK_ACUAN
} from "../data/kawan-demo.js";
import { el, tampilToast } from "./ui.js";
import { tambahXPAman } from "./gamifikasi.js";
import { simpanData } from "./penyimpanan.js";
import { apakahSudahMasuk } from "./auth.js";

// State Filter Kawan
let subnavAktif = "jelajah"; // 'jelajah' | 'bareng' | 'sekitar'
let filterOlahragaAktif = "semua";
let filterLevelAktif = "semua";
let filterTagAktif = "semua";
let urutanAktif = "jarak"; // 'jarak' | 'streak'

// State Olahraga Bareng
let filterBarengAktif = "semua";

// State Teman di Sekitar
let radiusSekitarAktif = 5; // km: 1 | 3 | 5 | 10
let olahragaSekitarAktif = "semua";
let lokasiPengguna = null; // { lat, lng, namaLabel }
let titikAcuanAktif = null; // { id, nama, lat, lng }
let statusIzinLokasi = "belum"; // 'belum' | 'aktif' | 'ditolak' | 'tidak-didukung'

/**
 * Rumus Haversine untuk menghitung jarak akurat (km) antara 2 koordinat bumi
 */
export function hitungJarakKm(lat1, lon1, lat2, lon2) {
  if (
    typeof lat1 !== "number" ||
    typeof lon1 !== "number" ||
    typeof lat2 !== "number" ||
    typeof lon2 !== "number" ||
    Number.isNaN(lat1) ||
    Number.isNaN(lon1) ||
    Number.isNaN(lat2) ||
    Number.isNaN(lon2)
  ) {
    return 0;
  }
  const R = 6371; // Radius Bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Normalisasi nama olahraga untuk pencocokan filter
 */
export function normalisasiOlahraga(str) {
  if (!str) return "";
  const s = String(str).trim().toLowerCase();
  if (s === "sepeda") return "bersepeda";
  return s;
}

/**
 * Render seluruh halaman kawan (Jelajah, Sedang Aktif, Olahraga Bareng, Teman di Sekitar)
 */
export function renderDaftarKawan(appState) {
  const wadah = document.getElementById("gridKawan");
  const liveRegion = document.getElementById("kawanLiveRegion");
  const wadahTerkunci = document.getElementById("wadahKawanTerkunci");
  const wadahKontenKawan = document.getElementById("wadahKontenKawan");
  if (!wadah) return;

  // 1. Verifikasi status autentikasi akun GERAK
  if (!apakahSudahMasuk(appState)) {
    if (wadahTerkunci) wadahTerkunci.style.display = "flex";
    if (wadahKontenKawan) wadahKontenKawan.style.display = "none";
    wadah.textContent = "";
    if (liveRegion) {
      liveRegion.textContent =
        "Fitur Cari Kawan terkunci. Pengguna wajib membuat akun atau masuk terlebih dahulu.";
    }
    return;
  }

  // Pengguna sudah masuk
  if (wadahTerkunci) wadahTerkunci.style.display = "none";
  if (wadahKontenKawan) wadahKontenKawan.style.display = "block";

  // 2. Render sub-bagian
  renderSedangAktif(appState);
  renderOlahragaBareng(appState);
  renderTemanSekitar(appState);

  // 3. Render kartu utama kawan
  wadah.textContent = "";

  const data = appState.data;
  const blokirList = data.blokirKawan || [];

  // Pengecekan Mode Aman Remaja
  const isRemaja = data.umurUser !== null && data.umurUser < CONFIG.UMUR_DEWASA_MIN;
  if (CONFIG.MODE_AMAN_REMAJA && isRemaja) {
    const kartuProteksi = el(
      "div",
      { class: "kotak-aman kotak-remaja" },
      el("h3", { text: "🛡️ Mode Komunitas Aman Remaja Aktif" }),
      el("p", {
        text:
          "Karena usiamu di bawah 18 tahun, fitur pencocokan dengan kawan baru dinonaktifkan demi keselamatanmu."
      }),
      el("p", {
        text:
          "Yuk ajak teman sekolah, saudara, atau keluargamu untuk gerak bareng di lingkungan yang aman dan selalu beri tahu orang tua/wali!"
      })
    );
    wadah.appendChild(kartuProteksi);
    if (liveRegion) liveRegion.textContent = "Mode aman remaja aktif. Pencocokan kawan publik disembunyikan.";
    return;
  }

  // Filter profil berdasarkan 14 olahraga
  let hasil = DAFTAR_KAWAN_DEMO.filter(k => !blokirList.includes(k.id));

  if (filterOlahragaAktif !== "semua") {
    const targetNorm = normalisasiOlahraga(filterOlahragaAktif);
    hasil = hasil.filter(k => normalisasiOlahraga(k.olahraga) === targetNorm);
  }

  if (filterLevelAktif !== "semua") {
    hasil = hasil.filter(k => k.level.toLowerCase() === filterLevelAktif.toLowerCase());
  }

  if (filterTagAktif !== "semua") {
    hasil = hasil.filter(k => Array.isArray(k.tag) && k.tag.includes(filterTagAktif));
  }

  // Pengurutan
  if (urutanAktif === "streak") {
    hasil.sort((a, b) => b.streak - a.streak);
  } else {
    hasil.sort((a, b) => a.jarakKm - b.jarakKm);
  }

  // Banner Demo
  if (CONFIG.DEMO) {
    const banner = el(
      "div",
      { class: "banner-demo", attrs: { role: "note" } },
      el("span", { class: "banner-ikon", text: "ℹ️ " }),
      el("span", {
        text: "Mode demo: Profil di bawah adalah contoh simulasi inklusif, bukan akun pengguna sungguhan."
      })
    );
    wadah.appendChild(banner);
  }

  if (hasil.length === 0) {
    const kosong = el(
      "div",
      { class: "state-kosong" },
      el("p", { text: "Belum ada kawan yang cocok dengan filter olahraga yang kamu pilih." }),
      el("button", {
        class: "tombol-kecil",
        text: "Reset Filter Olahraga",
        on: {
          click: () => {
            filterOlahragaAktif = "semua";
            const semuaChip = document.querySelectorAll("#filterKawan .chip");
            semuaChip.forEach(c => {
              const val = c.getAttribute("data-olahraga");
              if (val === "semua") {
                c.classList.add("aktif");
                c.setAttribute("aria-pressed", "true");
              } else {
                c.classList.remove("aktif");
                c.setAttribute("aria-pressed", "false");
              }
            });
            renderDaftarKawan(appState);
          }
        }
      })
    );
    wadah.appendChild(kosong);
    if (liveRegion) liveRegion.textContent = "Tidak ada kawan yang cocok.";
    return;
  }

  if (liveRegion) {
    liveRegion.textContent = `Menampilkan ${hasil.length} kawan olahraga untuk pilihan ${filterOlahragaAktif}.`;
  }

  hasil.forEach(kawan => {
    const tagElements = [
      el("span", { class: "tag", text: kawan.olahraga }),
      el("span", { class: "tag", text: `📍 ${kawan.area}` }),
      el("span", { class: "tag", text: `± ${kawan.jarakKm} km` }),
      el("span", { class: "tag tag-level", text: `Level: ${kawan.level}` })
    ];

    if (Array.isArray(kawan.tag)) {
      kawan.tag.forEach(t => {
        tagElements.push(el("span", { class: "tag tag-inklusif", text: `#${t}` }));
      });
    }

    const kartu = el(
      "div",
      { class: "kartu-kawan", attrs: { "data-kawan-id": kawan.id } },
      el(
        "div",
        { class: "kawan-atas" },
        el(
          "div",
          {
            class: "avatar",
            attrs: { style: `background:${kawan.warna}` },
            text: kawan.nama.charAt(0)
          },
          kawan.sedangAktif
            ? el("span", {
                class: "dot-online-avatar",
                attrs: { title: "Sedang aktif (simulasi komunitas)" }
              })
            : null
        ),
        el(
          "div",
          {},
          el("p", { class: "kawan-nama", text: `${kawan.nama}, ${kawan.umur}` }),
          kawan.verifikasiDemo
            ? el("p", {
                class: "verifikasi",
                text: "✔ Terverifikasi (demo)",
                attrs: { title: "Profil contoh terverifikasi simulasi" }
              })
            : null
        )
      ),
      el("p", { class: "kawan-bio", text: kawan.bio }),
      el("div", { class: "kawan-info" }, ...tagElements),
      el("p", { class: "kawan-streak", text: `🔥 Streak ${kawan.streak} hari` }),
      el(
        "div",
        { class: "kawan-tombol" },
        el("button", {
          class: "tombol tombol-utama",
          attrs: {
            "data-aksi": "ajak",
            "data-id": kawan.id,
            "aria-label": `Ajak ${kawan.nama} gerak bareng`
          },
          text: "Ajak Gerak"
        }),
        el("button", {
          class: "tombol-lapor",
          attrs: {
            "data-aksi": "laporkan",
            "data-id": kawan.id,
            "aria-label": `Laporkan profil ${kawan.nama}`
          },
          text: "Laporkan"
        }),
        el("button", {
          class: "tombol-blokir",
          attrs: {
            "data-aksi": "blokir",
            "data-id": kawan.id,
            "aria-label": `Blokir profil ${kawan.nama}`
          },
          text: "Blokir"
        })
      )
    );

    wadah.appendChild(kartu);
  });
}

// =========================================
// BAGIAN: SEDANG AKTIF (ONLINE USERS)
// =========================================

/**
 * Render bagian ringkas "Sedang Aktif" di bawah filter olahraga
 */
export function renderSedangAktif(appState) {
  const wadah = document.getElementById("wadahAvatarSedangAktif");
  const badgeCount = document.getElementById("badgeOnlineCount");
  if (!wadah) return;

  wadah.textContent = "";

  const data = appState.data;
  const blokirList = data.blokirKawan || [];
  const akunUser = data.akun;

  // Daftar pengguna aktif:
  // 1. Pengguna saat ini (sesi lokal aktif nyata)
  // 2. Demo kawan yang ditandai sedangAktif (transparan berlabel simulasi komunitas)
  const listAktif = [];

  if (akunUser && akunUser.nama) {
    listAktif.push({
      id: "saya",
      nama: `${akunUser.nama} (Kamu)`,
      namaPanggilan: akunUser.nama.split(" ")[0],
      olahraga: akunUser.olahraga || "Semua",
      warna: "#FF5A1F",
      statusLabel: "Sesi Lokal Aktif",
      isUserSendiri: true,
      bio: "Akun terhubung di perangkat ini. Siap berolahraga bareng!"
    });
  }

  const kawanAktif = DAFTAR_KAWAN_DEMO.filter(
    k => k.sedangAktif && !blokirList.includes(k.id)
  );

  kawanAktif.forEach(k => {
    listAktif.push({
      id: k.id,
      nama: k.nama,
      namaPanggilan: k.nama,
      umur: k.umur,
      olahraga: k.olahraga,
      warna: k.warna,
      statusLabel: k.statusAktifLabel || "Aktif sekarang (simulasi)",
      isUserSendiri: false,
      kawanData: k
    });
  });

  if (badgeCount) {
    badgeCount.textContent = `${listAktif.length} Online`;
  }

  // Render item avatar ringkas
  listAktif.forEach(item => {
    const itemCard = el(
      "div",
      {
        class: `item-user-aktif ${item.isUserSendiri ? "item-user-sendiri" : ""}`,
        attrs: {
          role: "button",
          tabindex: "0",
          "aria-label": `Lihat profil ${item.nama}, olahraga ${item.olahraga}`
        },
        on: {
          click: () => bukaDetailProfilKawan(item.kawanData || item, appState),
          keydown: e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              bukaDetailProfilKawan(item.kawanData || item, appState);
            }
          }
        }
      },
      el(
        "div",
        { class: "wrap-avatar-aktif" },
        el("div", {
          class: "avatar-aktif",
          attrs: { style: `background: ${item.warna};` },
          text: item.namaPanggilan.charAt(0)
        }),
        el("span", {
          class: "dot-online-status",
          attrs: { title: item.statusLabel }
        })
      ),
      el(
        "div",
        { class: "info-user-aktif" },
        el("span", { class: "nama-user-aktif", text: item.namaPanggilan }),
        el("span", {
          class: "olahraga-user-aktif",
          text: item.olahraga ? item.olahraga : "Aktif"
        })
      )
    );

    wadah.appendChild(itemCard);
  });
}

/**
 * Buka modal "Lihat Semua" Pengguna Sedang Aktif
 */
export function bukaModalSemuaAktif(appState) {
  const dialog = document.getElementById("dialogSemuaAktif");
  const wadahList = document.getElementById("wadahListSemuaAktif");
  if (!dialog || !wadahList) return;

  wadahList.textContent = "";

  const data = appState.data;
  const blokirList = data.blokirKawan || [];
  const akunUser = data.akun;

  // Akun pengguna sendiri
  if (akunUser && akunUser.nama) {
    const barisSaya = el(
      "div",
      { class: "baris-kawan-aktif baris-saya" },
      el(
        "div",
        { class: "kawan-aktif-kiri" },
        el(
          "div",
          { class: "wrap-avatar-aktif" },
          el("div", {
            class: "avatar-aktif",
            attrs: { style: "background: #FF5A1F;" },
            text: akunUser.nama.charAt(0)
          }),
          el("span", { class: "dot-online-status" })
        ),
        el(
          "div",
          {},
          el("strong", { text: `${akunUser.nama} (Kamu)` }),
          el("p", { class: "teks-kecil-muted", text: "🟢 Sesi Lokal Aktif Saat Ini" }),
          el("span", { class: "tag tag-level", text: `Minat: ${akunUser.olahraga || "Semua"}` })
        )
      ),
      el(
        "div",
        { class: "kawan-aktif-kanan" },
        el("span", { class: "badge-status-online-pill", text: "Akun Aktif" })
      )
    );
    wadahList.appendChild(barisSaya);
  }

  // Kawan demo aktif
  const kawanAktif = DAFTAR_KAWAN_DEMO.filter(
    k => k.sedangAktif && !blokirList.includes(k.id)
  );

  kawanAktif.forEach(k => {
    const baris = el(
      "div",
      { class: "baris-kawan-aktif" },
      el(
        "div",
        { class: "kawan-aktif-kiri" },
        el(
          "div",
          { class: "wrap-avatar-aktif" },
          el("div", {
            class: "avatar-aktif",
            attrs: { style: `background: ${k.warna};` },
            text: k.nama.charAt(0)
          }),
          el("span", { class: "dot-online-status" })
        ),
        el(
          "div",
          {},
          el("strong", { text: `${k.nama}, ${k.umur} th` }),
          el("p", { class: "teks-kecil-muted", text: `📍 ${k.area} · ± ${k.jarakKm} km` }),
          el("div", { class: "baris-tag-mini" },
            el("span", { class: "tag", text: k.olahraga }),
            el("span", { class: "tag tag-level", text: `Level: ${k.level}` })
          )
        )
      ),
      el(
        "div",
        { class: "kawan-aktif-kanan" },
        el("span", {
          class: "badge-status-online-pill simulasi",
          text: k.statusAktifLabel || "Aktif (simulasi)"
        }),
        el("button", {
          type: "button",
          class: "tombol-kecil tombol-garis",
          text: "Ajak Gerak",
          on: {
            click: () => {
              if (dialog.close) dialog.close();
              bukaDialogAjakan(k, appState);
            }
          }
        })
      )
    );

    wadahList.appendChild(baris);
  });

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

/**
 * Buka modal detail profil kawan ringkas
 */
export function bukaDetailProfilKawan(kawan, appState) {
  const dialog = document.getElementById("dialogDetailProfilKawan");
  const wadah = document.getElementById("wadahDetailProfilKawan");
  if (!dialog || !wadah || !kawan) return;

  wadah.textContent = "";

  const isUserSendiri = kawan.isUserSendiri || kawan.id === "saya";
  const namaTampil = kawan.nama || "Kawan GERAK";
  const bioTampil = kawan.bio || "Penggiat hidup sehat aktif di komunitas GERAK.";
  const olahragaTampil = kawan.olahraga || "Semua Olahraga";
  const areaTampil = kawan.area || "Jakarta";
  const levelTampil = kawan.level || "Semua Level";
  const streakTampil = kawan.streak || 1;

  const card = el(
    "div",
    { class: "kartu-detail-profil-modal" },
    el(
      "div",
      { class: "detail-profil-header" },
      el("div", {
        class: "avatar avatar-besar",
        attrs: { style: `background: ${kawan.warna || "#FF5A1F"}` },
        text: namaTampil.charAt(0)
      }),
      el(
        "div",
        {},
        el("h3", { text: namaTampil }),
        el("p", {
          class: "teks-kecil-muted",
          text: isUserSendiri
            ? "🟢 Akun Sesi Lokal Aktif"
            : `📍 ${areaTampil} · Level ${levelTampil}`
        })
      )
    ),
    el("p", { class: "kawan-bio-modal", text: bioTampil }),
    el(
      "div",
      { class: "kawan-info-modal" },
      el("span", { class: "tag", text: `Olahraga: ${olahragaTampil}` }),
      el("span", { class: "tag tag-level", text: `Level: ${levelTampil}` }),
      el("span", { class: "tag", text: `🔥 Streak ${streakTampil} hari` })
    ),
    !isUserSendiri
      ? el(
          "div",
          { class: "baris-aksi-modal-profil" },
          el("button", {
            type: "button",
            class: "tombol tombol-utama lebar-penuh",
            text: `🤝 Ajak ${namaTampil} Gerak Bareng`,
            on: {
              click: () => {
                if (dialog.close) dialog.close();
                bukaDialogAjakan(kawan, appState);
              }
            }
          })
        )
      : null
  );

  wadah.appendChild(card);

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

// =========================================
// BAGIAN: OLAHRAGA BARENG
// =========================================

/**
 * Render kartu sesi "Olahraga Bareng"
 */
export function renderOlahragaBareng(appState) {
  const wadah = document.getElementById("gridOlahragaBareng");
  if (!wadah) return;

  wadah.textContent = "";

  let list = DAFTAR_OLAHRAGA_BARENG;
  if (filterBarengAktif !== "semua") {
    const targetNorm = normalisasiOlahraga(filterBarengAktif);
    list = list.filter(item => normalisasiOlahraga(item.olahraga) === targetNorm);
  }

  if (list.length === 0) {
    const kosong = el(
      "div",
      { class: "state-kosong" },
      el("p", {
        text: `Belum ada agenda Olahraga Bareng untuk kategori ${filterBarengAktif}.`
      }),
      el("button", {
        type: "button",
        class: "tombol-kecil",
        text: "Tampilkan Semua Olahraga",
        on: {
          click: () => {
            filterBarengAktif = "semua";
            const chips = document.querySelectorAll("#filterOlahragaBareng .chip");
            chips.forEach(c => {
              if (c.getAttribute("data-kategori-bareng") === "semua") {
                c.classList.add("aktif");
                c.setAttribute("aria-pressed", "true");
              } else {
                c.classList.remove("aktif");
                c.setAttribute("aria-pressed", "false");
              }
            });
            renderOlahragaBareng(appState);
          }
        }
      })
    );
    wadah.appendChild(kosong);
    return;
  }

  list.forEach(item => {
    const tags = [
      el("span", { class: "tag", text: item.olahraga }),
      el("span", { class: "tag tag-level", text: `Level: ${item.level}` })
    ];

    if (Array.isArray(item.tag)) {
      item.tag.forEach(t => {
        tags.push(el("span", { class: "tag tag-inklusif", text: `#${t}` }));
      });
    }

    const kartu = el(
      "div",
      { class: "kartu-kawan kartu-olahraga-bareng" },
      el(
        "div",
        { class: "baris-antara header-bareng-card" },
        el("span", { class: "badge-bareng-olahraga", text: `⚡ ${item.olahraga}` }),
        el("span", { class: "badge-bareng-level", text: `🎯 ${item.level}` })
      ),
      el("h4", { class: "judul-bareng", text: item.judul }),
      el(
        "div",
        { class: "penyelenggara-bareng" },
        el("div", {
          class: "avatar-bareng-mini",
          attrs: { style: `background: ${item.penyelenggaraWarna}` },
          text: item.penyelenggaraAvatar
        }),
        el("span", {
          class: "nama-penyelenggara-bareng",
          text: `Dibuat oleh ${item.penyelenggaraNama}`
        })
      ),
      el(
        "div",
        { class: "detail-jadwal-lokasi" },
        el("div", { class: "item-detail-baris" },
          el("span", { class: "ikon-detail", text: "📅" }),
          el("strong", { text: item.jadwal })
        ),
        el("div", { class: "item-detail-baris" },
          el("span", { class: "ikon-detail", text: "📍" }),
          el("span", { text: `${item.lokasi} (${item.area})` })
        ),
        item.kuota
          ? el("div", { class: "item-detail-baris" },
              el("span", { class: "ikon-detail", text: "👥" }),
              el("span", { text: `Kuota: ${item.kuota}` })
            )
          : null
      ),
      el("p", { class: "kawan-bio", text: item.deskripsi }),
      el("div", { class: "kawan-info" }, ...tags),
      el(
        "div",
        { class: "kawan-tombol" },
        el("button", {
          type: "button",
          class: "tombol tombol-utama lebar-penuh",
          attrs: {
            "aria-label": `Gabung atau ajak gerak untuk kegiatan ${item.judul}`
          },
          text: "🤝 Gabung / Ajak Gerak",
          on: {
            click: () => {
              bukaDialogAjakanBareng(item, appState);
            }
          }
        })
      )
    );

    wadah.appendChild(kartu);
  });
}

/**
 * Buka dialog ajakan dari kartu Olahraga Bareng
 */
function bukaDialogAjakanBareng(item, appState) {
  const dialog = document.getElementById("dialogAjak");
  if (!dialog) return;

  const namaTarget = document.getElementById("namaAjakTarget");
  const tempatInput = document.getElementById("tempatAjakInput");
  const pesanInput = document.getElementById("pesanAjakInput");
  const checkAman = document.getElementById("checkTempatAman");

  if (namaTarget) namaTarget.textContent = item.penyelenggaraNama;
  if (tempatInput) tempatInput.value = `${item.lokasi}, ${item.area}`;
  if (pesanInput) {
    pesanInput.value = `Halo ${item.penyelenggaraNama}! Aku tertarik ikut sesi "${item.judul}" pada ${item.jadwal}. Boleh gabung gerak bareng?`;
  }
  if (checkAman) checkAman.checked = false;

  dialog.dataset.kawanId = item.penyelenggaraId;
  dialog.dataset.kawanNama = item.penyelenggaraNama;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

// =========================================
// BAGIAN: TEMAN DI SEKITAR (RADIUS & GEOLOKASI)
// =========================================

/**
 * Render grid "Teman di Sekitar" berdasarkan radius dan olahraga
 */
export function renderTemanSekitar(appState) {
  const wadah = document.getElementById("gridTemanSekitar");
  const liveRegion = document.getElementById("liveRegionSekitar");
  if (!wadah) return;

  wadah.textContent = "";

  const data = appState.data;
  const blokirList = data.blokirKawan || [];

  // Tentukan titik acuan koordinat (dari GPS pengguna atau titik acuan publik)
  let refLat = null;
  let refLng = null;
  let labelTitik = "";

  if (lokasiPengguna && lokasiPengguna.lat && lokasiPengguna.lng) {
    refLat = lokasiPengguna.lat;
    refLng = lokasiPengguna.lng;
    labelTitik = lokasiPengguna.namaLabel || "Lokasi Saya (GPS)";
  } else if (titikAcuanAktif && titikAcuanAktif.lat && titikAcuanAktif.lng) {
    refLat = titikAcuanAktif.lat;
    refLng = titikAcuanAktif.lng;
    labelTitik = titikAcuanAktif.nama;
  }

  // Jika belum ada titik acuan sama sekali
  if (refLat === null || refLng === null) {
    const belumAdaLokasi = el(
      "div",
      { class: "state-kosong state-perlu-lokasi" },
      el("div", { class: "ikon-radar-besar", text: "📡" }),
      el("h4", { text: "Izin Lokasi Belum Diaktifkan" }),
      el("p", {
        text:
          "Untuk menampilkan teman olahraga terdekat, klik tombol 'Aktifkan Lokasi Saya' di atas, atau pilih salah satu Titik Acuan Publik di daftar pilihan."
      }),
      el("p", {
        class: "teks-kecil-muted",
        text:
          "🛡️ Privasi Terjamin: Titik acuan hanya digunakan untuk estimasi jarak kasar. Koordinat rumahmu tidak pernah disimpan."
      })
    );
    wadah.appendChild(belumAdaLokasi);
    if (liveRegion) {
      liveRegion.textContent =
        "Lokasi belum ditentukan. Silakan aktifkan izin lokasi atau pilih titik acuan.";
    }
    return;
  }

  // Filter profil berdasarkan radius jarak (Haversine) & olahraga
  let list = DAFTAR_KAWAN_DEMO.filter(k => !blokirList.includes(k.id));

  // Hitung jarak dinamis untuk setiap kawan
  const listDenganJarak = list.map(k => {
    const jarakHitung = hitungJarakKm(refLat, refLng, k.lat, k.lng);
    return {
      ...k,
      jarakDinamisKm: jarakHitung
    };
  });

  // Filter radius
  let hasil = listDenganJarak.filter(k => k.jarakDinamisKm <= radiusSekitarAktif);

  // Filter jenis olahraga
  if (olahragaSekitarAktif !== "semua") {
    const targetNorm = normalisasiOlahraga(olahragaSekitarAktif);
    hasil = hasil.filter(k => normalisasiOlahraga(k.olahraga) === targetNorm);
  }

  // Urutkan dari yang terdekat
  hasil.sort((a, b) => a.jarakDinamisKm - b.jarakDinamisKm);

  if (hasil.length === 0) {
    const kosong = el(
      "div",
      { class: "state-kosong" },
      el("p", {
        text: `Belum ada kawan dalam radius ${radiusSekitarAktif} km dari ${labelTitik} untuk pilihan olahraga "${olahragaSekitarAktif}".`
      }),
      el("p", {
        class: "teks-kecil-muted",
        text: "💡 Coba perluas radius pencarian menjadi 5 km atau 10 km, atau ganti pilihan olahraga."
      })
    );
    wadah.appendChild(kosong);
    if (liveRegion) {
      liveRegion.textContent = `Tidak ada kawan dalam radius ${radiusSekitarAktif} km.`;
    }
    return;
  }

  if (liveRegion) {
    liveRegion.textContent = `Ditemukan ${hasil.length} kawan olahraga dalam radius ${radiusSekitarAktif} km dari ${labelTitik}.`;
  }

  hasil.forEach(kawan => {
    const tagElements = [
      el("span", { class: "tag tag-jarak-sekitar", text: `📍 ± ${kawan.jarakDinamisKm} km` }),
      el("span", { class: "tag", text: kawan.olahraga }),
      el("span", { class: "tag", text: `Area: ${kawan.area}` }),
      el("span", { class: "tag tag-level", text: `Level: ${kawan.level}` })
    ];

    if (Array.isArray(kawan.tag)) {
      kawan.tag.forEach(t => {
        tagElements.push(el("span", { class: "tag tag-inklusif", text: `#${t}` }));
      });
    }

    const kartu = el(
      "div",
      { class: "kartu-kawan kartu-sekitar" },
      el(
        "div",
        { class: "kawan-atas" },
        el(
          "div",
          {
            class: "avatar",
            attrs: { style: `background:${kawan.warna}` },
            text: kawan.nama.charAt(0)
          },
          kawan.sedangAktif
            ? el("span", { class: "dot-online-avatar", attrs: { title: "Sedang aktif" } })
            : null
        ),
        el(
          "div",
          {},
          el("p", { class: "kawan-nama", text: `${kawan.nama}, ${kawan.umur}` }),
          el("p", {
            class: "jarak-perkiraan-label",
            text: `🎯 ± ${kawan.jarakDinamisKm} km dari ${labelTitik}`
          })
        )
      ),
      el("p", { class: "kawan-bio", text: kawan.bio }),
      el("div", { class: "kawan-info" }, ...tagElements),
      el("p", { class: "kawan-streak", text: `🔥 Streak ${kawan.streak} hari` }),
      el(
        "div",
        { class: "kawan-tombol" },
        el("button", {
          class: "tombol tombol-utama",
          attrs: {
            "data-aksi": "ajak",
            "data-id": kawan.id,
            "aria-label": `Ajak ${kawan.nama} gerak bareng`
          },
          text: "Ajak Gerak"
        }),
        el("button", {
          class: "tombol-lapor",
          attrs: {
            "data-aksi": "laporkan",
            "data-id": kawan.id,
            "aria-label": `Laporkan profil ${kawan.nama}`
          },
          text: "Laporkan"
        }),
        el("button", {
          class: "tombol-blokir",
          attrs: {
            "data-aksi": "blokir",
            "data-id": kawan.id,
            "aria-label": `Blokir profil ${kawan.nama}`
          },
          text: "Blokir"
        })
      )
    );

    wadah.appendChild(kartu);
  });
}

// =========================================
// INISIALISASI EVENT LISTENERS KAWAN
// =========================================

/**
 * Pasang seluruh event listener untuk tab, filter 14 olahraga,
 * Sedang Aktif, Olahraga Bareng, dan Teman di Sekitar
 */
export function inisialisasiKawan(appState) {
  // 1. Sub-nav Switcher (Jelajah Kawan, Olahraga Bareng, Teman di Sekitar)
  const tabJelajah = document.getElementById("tabKawanJelajah");
  const tabBareng = document.getElementById("tabKawanBareng");
  const tabSekitar = document.getElementById("tabKawanSekitar");

  const panelJelajah = document.getElementById("panelKawanJelajah");
  const panelBareng = document.getElementById("panelKawanBareng");
  const panelSekitar = document.getElementById("panelKawanSekitar");

  function gantiSubnav(tujuan) {
    subnavAktif = tujuan;
    const tabs = [tabJelajah, tabBareng, tabSekitar];
    const panels = [panelJelajah, panelBareng, panelSekitar];

    tabs.forEach(t => {
      if (!t) return;
      t.classList.remove("aktif");
      t.setAttribute("aria-selected", "false");
    });
    panels.forEach(p => {
      if (!p) return;
      p.style.display = "none";
    });

    if (tujuan === "jelajah") {
      if (tabJelajah) {
        tabJelajah.classList.add("aktif");
        tabJelajah.setAttribute("aria-selected", "true");
      }
      if (panelJelajah) panelJelajah.style.display = "block";
    } else if (tujuan === "bareng") {
      if (tabBareng) {
        tabBareng.classList.add("aktif");
        tabBareng.setAttribute("aria-selected", "true");
      }
      if (panelBareng) panelBareng.style.display = "block";
      renderOlahragaBareng(appState);
    } else if (tujuan === "sekitar") {
      if (tabSekitar) {
        tabSekitar.classList.add("aktif");
        tabSekitar.setAttribute("aria-selected", "true");
      }
      if (panelSekitar) panelSekitar.style.display = "block";
      renderTemanSekitar(appState);
    }
  }

  if (tabJelajah) tabJelajah.addEventListener("click", () => gantiSubnav("jelajah"));
  if (tabBareng) tabBareng.addEventListener("click", () => gantiSubnav("bareng"));
  if (tabSekitar) tabSekitar.addEventListener("click", () => gantiSubnav("sekitar"));

  // 2. Filter 14 Olahraga (Jelajah Kawan)
  const chipsOlahraga = document.querySelectorAll("#filterKawan .chip");
  chipsOlahraga.forEach(chip => {
    chip.addEventListener("click", () => {
      chipsOlahraga.forEach(c => {
        c.classList.remove("aktif");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("aktif");
      chip.setAttribute("aria-pressed", "true");
      filterOlahragaAktif = chip.dataset.olahraga || "semua";
      renderDaftarKawan(appState);
    });
  });

  // 3. Tombol "Lihat Semua" Sedang Aktif
  const btnLihatSemuaAktif = document.getElementById("btnLihatSemuaAktif");
  if (btnLihatSemuaAktif) {
    btnLihatSemuaAktif.addEventListener("click", () => {
      bukaModalSemuaAktif(appState);
    });
  }

  // 4. Filter Kategori Olahraga Bareng
  const chipsBareng = document.querySelectorAll("#filterOlahragaBareng .chip");
  chipsBareng.forEach(chip => {
    chip.addEventListener("click", () => {
      chipsBareng.forEach(c => {
        c.classList.remove("aktif");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("aktif");
      chip.setAttribute("aria-pressed", "true");
      filterBarengAktif = chip.dataset.kategoriBareng || "semua";
      renderOlahragaBareng(appState);
    });
  });

  // 5. Inisialisasi Titik Acuan Publik Dropdown (Teman di Sekitar)
  const selectTitikAcuan = document.getElementById("selectTitikAcuan");
  if (selectTitikAcuan) {
    selectTitikAcuan.textContent = "";
    selectTitikAcuan.appendChild(
      el("option", { value: "", text: "-- Pilih Titik Acuan Publik --" })
    );
    DAFTAR_TITIK_ACUAN.forEach(t => {
      selectTitikAcuan.appendChild(
        el("option", { value: t.id, text: t.nama })
      );
    });

    selectTitikAcuan.addEventListener("change", e => {
      const val = e.target.value;
      if (!val) {
        titikAcuanAktif = null;
      } else {
        const item = DAFTAR_TITIK_ACUAN.find(t => t.id === val);
        titikAcuanAktif = item || null;
      }
      perbaruiStatusLokasiUI();
      renderTemanSekitar(appState);
    });
  }

  // 6. Tombol Minta Izin Geolocation (Teman di Sekitar)
  const btnIzinLokasi = document.getElementById("btnMintaIzinLokasi");
  if (btnIzinLokasi) {
    btnIzinLokasi.addEventListener("click", () => {
      mintaIzinLokasiPengguna(appState);
    });
  }

  // 7. Filter Radius Teman di Sekitar (1 km, 3 km, 5 km, 10 km)
  const chipsRadius = document.querySelectorAll("#filterRadiusKawan .chip-radius");
  chipsRadius.forEach(chip => {
    chip.addEventListener("click", () => {
      chipsRadius.forEach(c => {
        c.classList.remove("aktif");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("aktif");
      chip.setAttribute("aria-pressed", "true");
      radiusSekitarAktif = Number(chip.dataset.radius) || 5;
      renderTemanSekitar(appState);
    });
  });

  // 8. Select Olahraga Teman di Sekitar
  const selectOlahragaSekitar = document.getElementById("selectOlahragaSekitar");
  if (selectOlahragaSekitar) {
    selectOlahragaSekitar.addEventListener("change", e => {
      olahragaSekitarAktif = e.target.value || "semua";
      renderTemanSekitar(appState);
    });
  }

  // 9. Delegasi Tombol Ajak, Lapor, Blokir pada Grid Kawan & Grid Teman Sekitar
  const pasangAksiDelegasi = wadahEl => {
    if (!wadahEl) return;
    wadahEl.addEventListener("click", e => {
      const target = e.target.closest("button[data-aksi]");
      if (!target) return;

      const aksi = target.getAttribute("data-aksi");
      const id = target.getAttribute("data-id");
      const kawan = DAFTAR_KAWAN_DEMO.find(k => k.id === id);
      if (!kawan) return;

      if (aksi === "ajak") {
        bukaDialogAjakan(kawan, appState);
      } else if (aksi === "laporkan") {
        bukaDialogLaporan(kawan, appState);
      } else if (aksi === "blokir") {
        if (
          confirm(
            `Yakin ingin memblokir ${kawan.nama}? Profil ini tidak akan ditampilkan lagi.`
          )
        ) {
          if (!appState.data.blokirKawan) appState.data.blokirKawan = [];
          appState.data.blokirKawan.push(kawan.id);
          simpanData("gerakData", appState.data);
          renderDaftarKawan(appState);
          tampilToast(
            `${kawan.nama} telah diblokir. Kamu bisa memulihkannya lewat panel privasi di bawah.`
          );
        }
      }
    });
  };

  pasangAksiDelegasi(document.getElementById("gridKawan"));
  pasangAksiDelegasi(document.getElementById("gridTemanSekitar"));
}

/**
 * Minta izin lokasi GPS browser secara kontekstual
 */
function mintaIzinLokasiPengguna(appState) {
  const labelStatus = document.getElementById("labelStatusLokasi");
  const deskStatus = document.getElementById("deskripsiStatusLokasi");
  const ikonStatus = document.getElementById("ikonStatusLokasi");

  if (!navigator.geolocation) {
    statusIzinLokasi = "tidak-didukung";
    if (labelStatus) labelStatus.textContent = "Browser Tidak Mendukung Geolocation";
    if (deskStatus) {
      deskStatus.textContent =
        "Perangkat atau browsermu tidak mendukung fitur lokasi. Silakan gunakan pilihan Titik Acuan Publik manual.";
    }
    if (ikonStatus) ikonStatus.textContent = "⚠️";
    tampilToast("Perangkat tidak mendukung GPS. Gunakan pilihan Titik Acuan Publik.");
    return;
  }

  if (labelStatus) labelStatus.textContent = "Meminta Izin Lokasi...";
  if (deskStatus) deskStatus.textContent = "Mohon klik 'Allow' / 'Izinkan' pada notifikasi browser kamu.";
  if (ikonStatus) ikonStatus.textContent = "⏳";

  navigator.geolocation.getCurrentPosition(
    position => {
      statusIzinLokasi = "aktif";
      lokasiPengguna = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        namaLabel: "Lokasi Perangkat Kamu"
      };

      perbaruiStatusLokasiUI();
      renderTemanSekitar(appState);
      tampilToast("📍 Lokasi aktif! Menghitung jarak perkiraan ke area kawan olahraga.");
    },
    error => {
      statusIzinLokasi = "ditolak";
      lokasiPengguna = null;
      perbaruiStatusLokasiUI(error.message);
      renderTemanSekitar(appState);
      tampilToast(
        "Izin lokasi tidak diberikan. Kamu tetap bisa menjelajah dengan memilih Titik Acuan Publik."
      );
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
  );
}

/**
 * Perbarui teks status panel lokasi
 */
function perbaruiStatusLokasiUI(pesanError = "") {
  const labelStatus = document.getElementById("labelStatusLokasi");
  const deskStatus = document.getElementById("deskripsiStatusLokasi");
  const ikonStatus = document.getElementById("ikonStatusLokasi");

  if (statusIzinLokasi === "aktif" && lokasiPengguna) {
    if (labelStatus) labelStatus.textContent = "✅ Izin Lokasi Aktif (GPS Perangkat)";
    if (deskStatus) {
      deskStatus.textContent =
        "Menghitung jarak radius perkiraan dari koordinatmu ke titik kumpul area publik.";
    }
    if (ikonStatus) ikonStatus.textContent = "📍";
  } else if (titikAcuanAktif) {
    if (labelStatus) labelStatus.textContent = `📌 Titik Acuan Manual: ${titikAcuanAktif.nama}`;
    if (deskStatus) {
      deskStatus.textContent =
        "Menghitung estimasi jarak berdasarkan titik kumpul area publik yang kamu pilih.";
    }
    if (ikonStatus) ikonStatus.textContent = "📌";
  } else if (statusIzinLokasi === "ditolak") {
    if (labelStatus) labelStatus.textContent = "Izin Lokasi Ditolak / Belum Tersedia";
    if (deskStatus) {
      deskStatus.textContent =
        "Fitur Kawan lainnya tetap dapat digunakan normal. Pilih Titik Acuan Publik di sebelah kanan untuk mencari kawan sekitar.";
    }
    if (ikonStatus) ikonStatus.textContent = "🛡️";
  } else {
    if (labelStatus) labelStatus.textContent = "Izin Lokasi Belum Diaktifkan";
    if (deskStatus) {
      deskStatus.textContent =
        "Aktifkan izin lokasi browser untuk mengukur jarak perkiraan, atau pilih titik acuan area publik terdekat secara manual.";
    }
    if (ikonStatus) ikonStatus.textContent = "📡";
  }
}

/**
 * Buka dialog ajakan gerak bareng
 */
function bukaDialogAjakan(kawan, appState) {
  const dialog = document.getElementById("dialogAjak");
  if (!dialog) return;

  const namaTarget = document.getElementById("namaAjakTarget");
  const tempatInput = document.getElementById("tempatAjakInput");
  const pesanInput = document.getElementById("pesanAjakInput");
  const checkAman = document.getElementById("checkTempatAman");

  if (namaTarget) namaTarget.textContent = kawan.nama;
  if (tempatInput) tempatInput.value = kawan.area;
  if (pesanInput) {
    pesanInput.value = `Halo ${kawan.nama}! Mau gerak bareng olahraga ${kawan.olahraga}?`;
  }
  if (checkAman) checkAman.checked = false;

  dialog.dataset.kawanId = kawan.id;
  dialog.dataset.kawanNama = kawan.nama;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

/**
 * Buka dialog laporan kawan
 */
function bukaDialogLaporan(kawan, appState) {
  const dialog = document.getElementById("dialogLapor");
  if (!dialog) return;

  const namaLapor = document.getElementById("namaLaporTarget");
  if (namaLapor) namaLapor.textContent = kawan.nama;

  dialog.dataset.kawanId = kawan.id;
  dialog.dataset.kawanNama = kawan.nama;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}