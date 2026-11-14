// =========================================
// GERAK - js/poin-rank.js
// Sistem Poin, Rank, Badge, dan Leaderboard Komunitas
// Memberikan 25 poin per sesi workout selesai
// =========================================

import { el, tampilToast } from "./ui.js";
import { hariIni } from "./tanggal.js";

/**
 * Poin yang diberikan untuk setiap satu sesi program workout yang diselesaikan secara valid.
 */
export const POIN_WORKOUT_SESI = 25;

/**
 * Daftar tingkatan Rank & Badge berdasarkan total poin akumulasi.
 * Rentang poin kontinu, tidak tumpang tindih, dan tidak memiliki celah.
 */
export const DAFTAR_RANK = [
  {
    id: "pemula_mager",
    nama: "Pemula Mager",
    minPoin: 0,
    maxPoin: 99,
    keterangan: "Perjalanan baru dimulai. Saatnya membangun kebiasaan workout!",
    ikon: "🌱",
    tier: "Bronze",
    warnaAksen: "#e3dfd4",
    borderWarna: "#111111"
  },
  {
    id: "mulai_semangat",
    nama: "Mulai Semangat",
    minPoin: 100,
    maxPoin: 499,
    keterangan: "Mulai terlihat konsistensi dalam menyelesaikan workout.",
    ikon: "⚡",
    tier: "Silver",
    warnaAksen: "#FF5A1F",
    borderWarna: "#111111"
  },
  {
    id: "pejuang_konsisten",
    nama: "Pejuang Konsisten",
    minPoin: 500,
    maxPoin: 999,
    keterangan: "Sudah mengumpulkan banyak poin dan mulai membangun kebiasaan sehat.",
    ikon: "🔥",
    tier: "Gold",
    warnaAksen: "#D9480F",
    borderWarna: "#111111"
  },
  {
    id: "atlet_disiplin",
    nama: "Atlet Disiplin",
    minPoin: 1000,
    maxPoin: 1499,
    keterangan: "Konsistensi workout semakin terlihat.",
    ikon: "🏃‍♂️",
    tier: "Platinum",
    warnaAksen: "#5ce1e6",
    borderWarna: "#111111"
  },
  {
    id: "fitness_warrior",
    nama: "Fitness Warrior",
    minPoin: 1500,
    maxPoin: 1999,
    keterangan: "Terus berlatih dan kejar posisi yang lebih tinggi.",
    ikon: "⚔️",
    tier: "Diamond",
    warnaAksen: "#bd69f1",
    borderWarna: "#111111"
  },
  {
    id: "elite_athlete",
    nama: "Elite Athlete",
    minPoin: 2000,
    maxPoin: 2499,
    keterangan: "Sudah mencapai tingkat pencapaian yang lebih tinggi.",
    ikon: "🏅",
    tier: "Master",
    warnaAksen: "#ff5c5c",
    borderWarna: "#111111"
  },
  {
    id: "master_of_fitness",
    nama: "Master of Fitness",
    minPoin: 2500,
    maxPoin: 2999,
    keterangan: "Dedikasi workout sudah mencapai level lanjutan.",
    ikon: "👑",
    tier: "Grandmaster",
    warnaAksen: "#ffd700",
    borderWarna: "#111111"
  },
  {
    id: "legend",
    nama: "Legend",
    minPoin: 3000,
    maxPoin: 3499,
    keterangan: "Salah satu tingkatan tertinggi dalam perjalanan fitness pengguna.",
    ikon: "🏆",
    tier: "Legend",
    warnaAksen: "#ffb703",
    borderWarna: "#111111"
  },
  {
    id: "mythic_titan",
    nama: "Mythic Titan",
    minPoin: 3500,
    maxPoin: 3999,
    keterangan: "Ketangguhan fisik dan mental luar biasa tak tergoyahkan.",
    ikon: "🔱",
    tier: "Mythic",
    warnaAksen: "#00f0ff",
    borderWarna: "#111111"
  },
  {
    id: "immortal_champion",
    nama: "Immortal Champion",
    minPoin: 4000,
    maxPoin: 4499,
    keterangan: "Inspirasi kebugaran tanpa batas bagi seluruh komunitas.",
    ikon: "🌟",
    tier: "Immortal",
    warnaAksen: "#ff007f",
    borderWarna: "#111111"
  },
  {
    id: "gerak_godlike",
    nama: "GERAK Godlike",
    minPoin: 4500,
    maxPoin: Infinity,
    keterangan: "Puncak tertinggi kebugaran dan disiplin raga sejati!",
    ikon: "⚡👑",
    tier: "Godlike",
    warnaAksen: "#FF5A1F",
    borderWarna: "#111111"
  }
];

let filterPeriodeAktif = "keseluruhan"; // "keseluruhan" | "mingguan"

/**
 * Menghitung detail rank, rank berikutnya, sisa poin, dan persentase progres
 * @param {number} totalPoin
 * @returns {object} Info lengkap rank
 */
export function hitungInfoRank(totalPoin = 0) {
  const poin = Math.max(0, Math.floor(totalPoin || 0));

  let indexRank = DAFTAR_RANK.findIndex(r => poin >= r.minPoin && poin <= r.maxPoin);
  if (indexRank === -1) {
    indexRank = DAFTAR_RANK.length - 1;
  }

  const rankSekarang = DAFTAR_RANK[indexRank];
  const isMaxRank = indexRank === DAFTAR_RANK.length - 1;
  const rankBerikutnya = isMaxRank ? null : DAFTAR_RANK[indexRank + 1];

  let targetPoin = rankSekarang.minPoin;
  let sisaPoin = 0;
  let persen = 100;

  if (!isMaxRank && rankBerikutnya) {
    targetPoin = rankBerikutnya.minPoin;
    sisaPoin = Math.max(0, targetPoin - poin);
    const rentang = rankBerikutnya.minPoin - rankSekarang.minPoin;
    const progresDalamTier = poin - rankSekarang.minPoin;
    persen = Math.min(100, Math.max(0, Math.round((progresDalamTier / rentang) * 100)));
  }

  return {
    poin,
    indexRank,
    rankSekarang,
    rankBerikutnya,
    isMaxRank,
    targetPoin,
    sisaPoin,
    persen
  };
}

/**
 * Memberikan 25 poin setelah satu sesi workout selesai
 * Mencegah duplikasi ganda dan mendeteksi rank up
 * @param {object} data - Objek appState.data
 * @param {string} sesiId - Identifier sesi workout
 * @returns {object} Hasil penambahan poin
 */
export function tambahPoinWorkout(data, sesiId = "") {
  if (typeof data.poin !== "number" || isNaN(data.poin)) {
    data.poin = 0;
  }
  if (typeof data.sesiWorkoutSelesai !== "number" || isNaN(data.sesiWorkoutSelesai)) {
    data.sesiWorkoutSelesai = 0;
  }
  if (!Array.isArray(data.riwayatPoinWorkout)) {
    data.riwayatPoinWorkout = [];
  }

  const infoLama = hitungInfoRank(data.poin);
  const rankLama = infoLama.rankSekarang;

  data.poin += POIN_WORKOUT_SESI;
  data.sesiWorkoutSelesai += 1;

  data.riwayatPoinWorkout.push({
    sesiId: String(sesiId || `sesi_${Date.now()}`),
    poin: POIN_WORKOUT_SESI,
    tanggal: hariIni(),
    timestamp: Date.now()
  });

  const infoBaru = hitungInfoRank(data.poin);
  const rankBaru = infoBaru.rankSekarang;
  const naikRank = rankBaru.id !== rankLama.id && rankBaru.minPoin > rankLama.minPoin;

  return {
    poinDitambah: POIN_WORKOUT_SESI,
    totalPoin: data.poin,
    sesiWorkoutSelesai: data.sesiWorkoutSelesai,
    rankLama,
    rankBaru,
    naikRank,
    infoBaru
  };
}

/**
 * Sinkronisasi data pengguna saat ini ke daftar registry pengguna sistem (localStorage)
 * Memastikan leaderboard menggunakan data pengguna nyata
 * @param {object} appState
 * @returns {Array} Daftar seluruh pengguna yang tercatat di sistem
 */
export function sinkronkanPenggunaLeaderboard(appState) {
  try {
    const raw = localStorage.getItem("gerakSemuaPengguna");
    let daftar = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(daftar)) daftar = [];

    const akun = appState?.data?.akun;
    const nama = akun?.nama ? akun.nama : "Pengguna Tamu";
    const email = akun?.email ? akun.email : "tamu@gerak.local";
    const poin = appState?.data?.poin || 0;
    const sesi = appState?.data?.sesiWorkoutSelesai || 0;
    const riwayat = appState?.data?.riwayatPoinWorkout || [];

    const infoRank = hitungInfoRank(poin);

    const idx = daftar.findIndex(u => u.email === email || (email === "tamu@gerak.local" && u.id === "tamu"));
    const dataUser = {
      id: email === "tamu@gerak.local" ? "tamu" : email,
      nama,
      email,
      olahraga: akun?.olahragaFavorit || "Lari",
      poin,
      sesiWorkoutSelesai: sesi,
      rankId: infoRank.rankSekarang.id,
      rankNama: infoRank.rankSekarang.nama,
      rankIkon: infoRank.rankSekarang.ikon,
      rankTier: infoRank.rankSekarang.tier,
      riwayatPoinWorkout: riwayat,
      terakhirUpdate: Date.now()
    };

    if (idx >= 0) {
      daftar[idx] = Object.assign(daftar[idx], dataUser);
    } else {
      daftar.push(dataUser);
    }

    localStorage.setItem("gerakSemuaPengguna", JSON.stringify(daftar));
    return daftar;
  } catch (err) {
    console.warn("Gagal sinkronkan pengguna leaderboard:", err);
    return [];
  }
}

/**
 * Mengambil data leaderboard terurut berdasarkan periode
 * @param {object} appState
 * @param {string} periode - "keseluruhan" | "mingguan"
 * @returns {{ daftar: Array, userPosition: object|null }}
 */
export function ambilDataLeaderboard(appState, periode = "keseluruhan") {
  const daftarPengguna = sinkronkanPenggunaLeaderboard(appState);

  const akunAktif = appState?.data?.akun;
  const currentEmail = akunAktif?.email ? akunAktif.email : "tamu@gerak.local";

  const sekarangMs = Date.now();
  const tujuhHariMs = 7 * 24 * 60 * 60 * 1000;

  const dataDiolah = daftarPengguna.map(u => {
    let poinTampil = u.poin || 0;

    if (periode === "mingguan") {
      if (Array.isArray(u.riwayatPoinWorkout) && u.riwayatPoinWorkout.length > 0) {
        poinTampil = u.riwayatPoinWorkout
          .filter(r => (sekarangMs - (r.timestamp || 0)) <= tujuhHariMs)
          .reduce((total, r) => total + (r.poin || 0), 0);
      } else {
        poinTampil = u.poin || 0;
      }
    }

    const infoRank = hitungInfoRank(u.poin || 0);

    return {
      id: u.id,
      nama: u.nama,
      email: u.email,
      olahraga: u.olahraga || "Lari",
      poin: poinTampil,
      poinTotalAkumulasi: u.poin || 0,
      sesiWorkoutSelesai: u.sesiWorkoutSelesai || 0,
      rank: infoRank.rankSekarang,
      isCurrentUser: u.email === currentEmail || (currentEmail === "tamu@gerak.local" && u.id === "tamu")
    };
  });

  // Urutkan dari total poin tertinggi ke terendah
  dataDiolah.sort((a, b) => {
    if (b.poin !== a.poin) {
      return b.poin - a.poin;
    }
    return (b.sesiWorkoutSelesai || 0) - (a.sesiWorkoutSelesai || 0);
  });

  // Berikan nomor peringkat
  dataDiolah.forEach((item, idx) => {
    item.peringkat = idx + 1;
  });

  const userIdx = dataDiolah.findIndex(u => u.isCurrentUser);
  let userPosition = null;

  if (userIdx !== -1) {
    const user = dataDiolah[userIdx];
    const userDiatas = userIdx > 0 ? dataDiolah[userIdx - 1] : null;
    const selisihPoin = userDiatas ? Math.max(0, userDiatas.poin - user.poin) : 0;

    userPosition = {
      peringkat: user.peringkat,
      totalPengguna: dataDiolah.length,
      isJuara1: user.peringkat === 1,
      userDiatas,
      selisihPoin
    };
  }

  return {
    daftar: dataDiolah,
    userPosition
  };
}

/**
 * Render visual komponen Poin & Rank di DOM
 * @param {object} appState
 */
export function renderPoinRankSection(appState) {
  const data = appState?.data || {};
  const totalPoin = data.poin || 0;
  const sesiSelesai = data.sesiWorkoutSelesai || 0;
  const infoRank = hitungInfoRank(totalPoin);
  const akun = data.akun;

  // Sinkronkan chip poin & rank di navbar atas
  const navRankIkon = document.getElementById("navRankIkon");
  const navPoinAngka = document.getElementById("navPoinAngka");
  if (navRankIkon) navRankIkon.textContent = infoRank.rankSekarang.ikon;
  if (navPoinAngka) navPoinAngka.textContent = `${infoRank.poin} Poin`;

  // 1. Render Kartu Poin Utama (Dashboard Progres)
  const wadahKartuUtama = document.getElementById("kartuPoinUtama");
  if (wadahKartuUtama) {
    wadahKartuUtama.textContent = "";

    const { rankSekarang, rankBerikutnya, isMaxRank, targetPoin, sisaPoin, persen } = infoRank;

    const kartuEl = el("div", { class: "kartu-poin-grid" },
      // Sisi Kiri: Badge & Poin Akumulasi
      el("div", { class: "kolom-poin-profil" },
        el("div", { class: "badge-rank-ikon-wrap", attrs: { style: `border-color: ${rankSekarang.warnaAksen};` } },
          el("span", { class: "ikon-badge-besar", text: rankSekarang.ikon, attrs: { "aria-hidden": "true" } })
        ),
        el("div", { class: "info-rank-teks" },
          el("div", { class: "baris-tier-pill" },
            el("span", { class: "pill-tier", text: `${rankSekarang.tier} Tier` }),
            el("span", { class: "pill-sesi", text: `🏋️ ${sesiSelesai} Sesi Tuntas` })
          ),
          el("h3", { class: "nama-rank-aktif", text: rankSekarang.nama }),
          el("p", { class: "deskripsi-rank-aktif", text: rankSekarang.keterangan }),
          el("div", { class: "kotak-total-poin" },
            el("span", { class: "angka-poin-raksasa", text: String(totalPoin) }),
            el("div", { class: "label-poin-grup" },
              el("span", { class: "label-poin-tebal", text: "POIN" }),
              el("span", { class: "label-poin-sub", text: "Workout Akumulasi" })
            )
          )
        )
      ),

      // Sisi Kanan: Progres Bar Menuju Rank Berikutnya & Sisa Poin
      el("div", { class: "kolom-poin-progres" },
        el("div", { class: "header-progres-rank" },
          el("div", {},
            el("span", { class: "label-progres-mini", text: "PROGRES MENUJU RANK BERIKUTNYA" }),
            el("h4", { class: "judul-target-rank", text: isMaxRank ? "🏆 Puncak Tertinggi Tercapai!" : `Target: ${rankBerikutnya.nama} ${rankBerikutnya.ikon}` })
          ),
          el("span", { class: "persen-progres-pill", text: `${persen}%` })
        ),

        // Progress bar visual
        el("div", {
          class: "bar-progres-rank-bg",
          attrs: {
            role: "progressbar",
            "aria-valuenow": persen,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-label": isMaxRank
              ? "Puncak rank tertinggi tercapai"
              : `Progres menuju ${rankBerikutnya.nama}: ${persen} persen (${totalPoin} dari ${targetPoin} poin)`
          }
        },
          el("div", {
            class: "bar-progres-rank-isi",
            attrs: {
              style: `width: ${persen}%;`
            }
          })
        ),

        // Info sisa poin & aksi
        el("div", { class: "footer-progres-rank" },
          isMaxRank
            ? el("p", { class: "teks-sisa-poin puncak", text: "⭐ Luar biasa! Kamu telah mencapai tingkat tertinggi GERAK Godlike. Terus berolahraga untuk memimpin leaderboard!" })
            : el("p", { class: "teks-sisa-poin" },
                el("span", { class: "teks-sorot-sisa", text: `${sisaPoin} Poin Lagi` }),
                el("span", { text: ` dibutuhkan untuk naik ke ${rankBerikutnya.nama} (Target: ${targetPoin} poin).` })
              ),
          el("div", { class: "petunjuk-dapat-poin" },
            el("span", { class: "ikon-petunjuk", text: "💡" }),
            el("span", { text: "Selesaikan 1 sesi program latihan di Work Out untuk mendapatkan +25 poin!" })
          )
        )
      )
    );

    wadahKartuUtama.appendChild(kartuEl);
  }

  // 2. Render Galeri Tingkatan Rank & Koleksi Badge
  const wadahGaleri = document.getElementById("gridGaleriRank");
  if (wadahGaleri) {
    wadahGaleri.textContent = "";

    DAFTAR_RANK.forEach((rankItem, rIdx) => {
      const isRankAktif = rankItem.id === infoRank.rankSekarang.id;
      const isSudahTercapai = totalPoin >= rankItem.minPoin;

      const kelasStatus = isRankAktif
        ? "rank-item aktif"
        : (isSudahTercapai ? "rank-item tercapai" : "rank-item terkunci");

      const badgeLabelStatus = isRankAktif
        ? "✔ Rank Saat Ini"
        : (isSudahTercapai ? "✔ Terbuka" : `🔒 Min. ${rankItem.minPoin} Poin`);

      const rentangTeks = rankItem.maxPoin === Infinity
        ? `≥ ${rankItem.minPoin} Poin`
        : `${rankItem.minPoin} – ${rankItem.maxPoin} Poin`;

      const kartuRank = el("div", {
        class: kelasStatus,
        attrs: {
          role: "group",
          "aria-label": `Rank ${rankItem.nama}: ${badgeLabelStatus}. Rentang: ${rentangTeks}`
        }
      },
        el("div", { class: "rank-item-header" },
          el("span", { class: "rank-item-tier-chip", text: rankItem.tier }),
          el("span", { class: `rank-item-status-badge ${isRankAktif ? "status-aktif" : (isSudahTercapai ? "status-ok" : "status-kunci")}`, text: badgeLabelStatus })
        ),
        el("div", { class: "rank-item-ikon-box" },
          el("span", { class: "rank-item-ikon", text: rankItem.ikon, attrs: { "aria-hidden": "true" } })
        ),
        el("h4", { class: "rank-item-nama", text: rankItem.nama }),
        el("p", { class: "rank-item-rentang", text: rentangTeks }),
        el("p", { class: "rank-item-keterangan", text: rankItem.keterangan })
      );

      wadahGaleri.appendChild(kartuRank);
    });
  }

  // 3. Render Leaderboard & Podium
  renderLeaderboardKomponen(appState);
}

/**
 * Render komponen Leaderboard: Podium top 3, tabel peringkat, dan banner status posisi pengguna
 * @param {object} appState
 */
export function renderLeaderboardKomponen(appState) {
  const { daftar, userPosition } = ambilDataLeaderboard(appState, filterPeriodeAktif);

  // 1. Banner Posisi Pengguna & Selisih Poin
  const bannerPosisi = document.getElementById("bannerPosisiUser");
  if (bannerPosisi) {
    bannerPosisi.textContent = "";

    if (userPosition) {
      if (userPosition.isJuara1) {
        bannerPosisi.className = "banner-posisi-user juara-satu";
        bannerPosisi.appendChild(
          el("div", { class: "banner-posisi-isi" },
            el("span", { class: "ikon-banner-raksasa", text: "👑" }),
            el("div", {},
              el("h4", { text: "Kamu Berada di Peringkat Teratas (#1)!" }),
              el("p", { text: "Pertahankan konsistensi latihanmu. Setiap sesi workout yang selesai akan memperkokoh posisimu di puncak leaderboard." })
            )
          )
        );
      } else {
        const { peringkat, userDiatas, selisihPoin } = userPosition;
        const sesiDibutuhkan = Math.ceil(selisihPoin / POIN_WORKOUT_SESI);
        bannerPosisi.className = "banner-posisi-user sedang-mengejar";
        bannerPosisi.appendChild(
          el("div", { class: "banner-posisi-isi" },
            el("span", { class: "ikon-banner-raksasa", text: "🎯" }),
            el("div", {},
              el("h4", { text: `Posisi Kamu: Peringkat #${peringkat}` }),
              el("p", {
                text: userDiatas
                  ? `Kamu hanya butuh ${selisihPoin} poin lagi (~${sesiDibutuhkan} sesi workout) untuk menyalip "${userDiatas.nama}" di posisi #${userDiatas.peringkat}!`
                  : "Selesaikan sesi workout baru untuk terus mendaki papan peringkat!"
              })
            )
          )
        );
      }
    }
  }

  // 2. Podium Top 3
  const wadahPodium = document.getElementById("podiumTop3");
  if (wadahPodium) {
    wadahPodium.textContent = "";

    const top1 = daftar[0] || null;
    const top2 = daftar[1] || null;
    const top3 = daftar[2] || null;

    // Klasik Layout Podium: #2 (Perak - Kiri), #1 (Emas - Tengah, Tinggi), #3 (Perunggu - Kanan)
    const buatPilarPodium = (item, posisi, labelMedali, kelasPilar) => {
      if (!item) {
        return el("div", { class: `pilar-podium ${kelasPilar} kosong` },
          el("span", { class: "medali-podium", text: labelMedali }),
          el("span", { class: "pilar-nomor", text: `#${posisi}` }),
          el("p", { class: "podium-kosong-teks", text: "Menunggu Penantang" })
        );
      }

      return el("div", { class: `pilar-podium ${kelasPilar} ${item.isCurrentUser ? "podium-user-aktif" : ""}` },
        el("div", { class: "podium-avatar-wrap" },
          el("span", { class: "medali-podium", text: labelMedali }),
          el("span", { class: "podium-ikon-rank", text: item.rank.ikon })
        ),
        el("p", { class: "podium-nama-user", text: item.isCurrentUser ? `${item.nama} (Kamu)` : item.nama }),
        el("span", { class: "podium-tier-pill", text: item.rank.nama }),
        el("div", { class: "podium-balok" },
          el("span", { class: "pilar-nomor", text: `#${posisi}` }),
          el("span", { class: "podium-angka-poin", text: `${item.poin} Poin` })
        )
      );
    };

    wadahPodium.appendChild(buatPilarPodium(top2, 2, "🥈", "pilar-perak"));
    wadahPodium.appendChild(buatPilarPodium(top1, 1, "👑", "pilar-emas"));
    wadahPodium.appendChild(buatPilarPodium(top3, 3, "🥉", "pilar-perunggu"));
  }

  // 3. Tabel Leaderboard
  const tbody = document.getElementById("tbodyLeaderboard");
  if (tbody) {
    tbody.textContent = "";

    if (daftar.length === 0) {
      const trKosong = el("tr", {},
        el("td", { attrs: { colspan: 4, style: "text-align: center; padding: 2rem;" } },
          el("p", { text: "Belum ada poin workout yang tercatat. Selesaikan sesi workout pertamamu untuk memimpin leaderboard!" })
        )
      );
      tbody.appendChild(trKosong);
      return;
    }

    daftar.forEach(item => {
      let medaliSimbol = `#${item.peringkat}`;
      if (item.peringkat === 1) medaliSimbol = "🥇 #1";
      else if (item.peringkat === 2) medaliSimbol = "🥈 #2";
      else if (item.peringkat === 3) medaliSimbol = "🥉 #3";

      const tr = el("tr", { class: item.isCurrentUser ? "baris-user-aktif" : "" },
        // Kolom 1: Peringkat
        el("td", { class: "td-peringkat" },
          el("span", { class: `badge-peringkat-tabel p-${item.peringkat <= 3 ? item.peringkat : "lain"}`, text: medaliSimbol })
        ),
        // Kolom 2: Pengguna
        el("td", { class: "td-pengguna" },
          el("div", { class: "cell-pengguna-wrap" },
            el("span", { class: "avatar-tabel-mini" }, item.nama.charAt(0).toUpperCase()),
            el("div", {},
              el("span", { class: "nama-pengguna-tabel", text: item.nama }),
              item.isCurrentUser
                ? el("span", { class: "tag-kamu-pill", text: "Kamu" })
                : null
            )
          )
        ),
        // Kolom 3: Tier & Badge
        el("td", { class: "td-tier" },
          el("div", { class: "cell-tier-wrap" },
            el("span", { class: "ikon-tabel-rank", text: item.rank.ikon }),
            el("div", {},
              el("span", { class: "nama-tabel-rank", text: item.rank.nama }),
              el("span", { class: "sub-tabel-tier", text: `${item.rank.tier} Tier` })
            )
          )
        ),
        // Kolom 4: Total Poin
        el("td", { class: "td-poin", attrs: { style: "text-align: right;" } },
          el("span", { class: "pill-poin-tabel", text: `${item.poin} Poin` })
        )
      );

      tbody.appendChild(tr);
    });
  }
}

/**
 * Inisialisasi event listener interaktif pada seksi Poin & Rank
 * @param {object} appState
 */
export function inisialisasiPoinRank(appState) {
  const tabSemua = document.getElementById("tabLeaderboardSemua");
  const tabMingguan = document.getElementById("tabLeaderboardMingguan");

  if (tabSemua) {
    tabSemua.addEventListener("click", () => {
      filterPeriodeAktif = "keseluruhan";
      tabSemua.classList.add("aktif");
      tabSemua.setAttribute("aria-pressed", "true");
      if (tabMingguan) {
        tabMingguan.classList.remove("aktif");
        tabMingguan.setAttribute("aria-pressed", "false");
      }
      renderLeaderboardKomponen(appState);
    });
  }

  if (tabMingguan) {
    tabMingguan.addEventListener("click", () => {
      filterPeriodeAktif = "mingguan";
      tabMingguan.classList.add("aktif");
      tabMingguan.setAttribute("aria-pressed", "true");
      if (tabSemua) {
        tabSemua.classList.remove("aktif");
        tabSemua.setAttribute("aria-pressed", "false");
      }
      renderLeaderboardKomponen(appState);
    });
  }

  // Daftarkan fungsi pembaruan UI ke appState
  appState.perbaruiUIPoinRank = () => {
    renderPoinRankSection(appState);
  };

  // Render awal
  renderPoinRankSection(appState);
}