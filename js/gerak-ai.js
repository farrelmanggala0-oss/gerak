/**
 * GERAK AI — Contextual Assistant Module
 * 
 * Fitur:
 * - Floating trigger button & contextual speech bubble
 * - IntersectionObserver untuk deteksi seksi aktif secara real-time
 * - Cooldown & anti-spam sapaan kontekstual
 * - Mode Ganda: Guest Mode & Member Mode (nama personal & status fitur)
 * - Proxy backend ke Google Gemini Free Tier dengan fallback cerdas lokal
 * - Preservasi riwayat percakapan saat berpindah halaman
 */

// Kamus Section Title & Sapaan Kontekstual Standar
export const KAMUS_SEKSI = {
  // BERANDA
  "berandaHero": {
    judul: "Hero Beranda",
    sapaanGuest: "Hai! Baru pertama kali di GERAK.? Mau aku tunjukkan fitur-fitur utamanya?",
    sapaanMember: "Halo{nama}! Siap bergerak lebih sehat dan menjaga kebiasaan baikmu hari ini?",
    saran: ["Apa itu GERAK?", "Bagaimana cara mulai?", "Fitur apa saja yang ada?"]
  },
  "berandaStatus": {
    judul: "Streak & Level XP",
    sapaanGuest: "Di GERAK, konsistensi dihargai dengan Streak Ramah Istirahat dan kenaikan Level XP!",
    sapaanMember: "Streak-mu aman! Jatah istirahat melindungi api kebiasaanmu tanpa bikin stres.",
    saran: ["Bagaimana aturan streak?", "Apa fungsi jatah istirahat?", "Berapa XP untuk naik level?"]
  },
  "berandaAyoMulai": {
    judul: "Progres AYO MULAI",
    sapaanGuest: "Kartu AYO MULAI memantau progres berat badan dan kalori dari gizi, workout, dan kawan olahraga.",
    sapaanMember: "Pantau progres berat badanmu di sini. Sudah hitung target gizimu di Kalkulator?",
    saran: ["Bagaimana cara kerja AYO MULAI?", "Apa itu ekuivalen energi 7.700 kkal?", "Bagaimana cara memperbarui berat?"]
  },
  "berandaAktivitas": {
    judul: "Aktivitas Hari Ini (Siap Melakukan)",
    sapaanGuest: "Ini 4 aktivitas utama GERAK: Target Gizi, Program Latihan, Jurnal Harian, dan Cari Kawan.",
    sapaanMember: "Aktivitas apa yang ingin kamu tuntaskan hari ini? Yuk pilih salah satu kartu!",
    saran: ["Kenapa menu workout terkunci?", "Bagaimana cara isi jurnal?", "Berapa cabang olahraga di Kawan?"]
  },
  "berandaPengenalan": {
    judul: "Pengenalan GERAK",
    sapaanGuest: "GERAK hadir untuk membantumu hidup sehat tanpa tekanan dan tanpa gym mahal.",
    sapaanMember: "Filosofi GERAK: Sehat itu bertahap, realistis, dan inklusif untuk semua raga.",
    saran: ["Mengapa GERAK ramah pemula?", "Apa pilar utama GERAK?"]
  },
  "berandaCaraPakai": {
    judul: "Cara Menggunakan GERAK",
    sapaanGuest: "Mulai dengan 4 langkah mudah: hitung gizi, buka latihan, tulis jurnal, dan cari teman gerak!",
    sapaanMember: "Ingin memaksimalkan fitur GERAK? Ikuti 4 alur mudah ini.",
    saran: ["Langkah pertama apa?", "Bagaimana cara kumpulkan poin?"]
  },
  "berandaManfaat": {
    judul: "Manfaat Platform",
    sapaanGuest: "GERAK dirancang khusus untuk Gen Z dengan pendekatan holistik dan berbasis sains.",
    sapaanMember: "Kesehatan jangka panjang dibangun dari kebiasaan kecil setiap hari.",
    saran: ["Apakah GERAK gratis?", "Apakah data saya aman?"]
  },

  // GIZI
  "giziKalkulator": {
    judul: "Kalkulator Kalori Harian",
    sapaanGuest: "Hai! Lagi mau menghitung kebutuhan kalori? Aku bisa bantu menjelaskan setiap kolomnya.",
    sapaanMember: "Lagi mau menghitung kebutuhan kalori? Aku bisa bantu menjelaskan setiap kolomnya.",
    saran: ["Rumus apa yang digunakan?", "Kenapa umur otomatis dari tanggal lahir?", "Berapa batas kalori aman?"]
  },
  "giziHasilPenjelasan": {
    judul: "Hasil Analisis Gizi",
    sapaanGuest: "Sudah dapat hasil kalori? Mau aku bantu memahami rekomendasi protein, karbo, dan lemak?",
    sapaanMember: "Sudah dapat hasil kalori? Mau aku bantu memahami rekomendasi protein, karbo, dan lemak?",
    saran: ["Berapa gram protein yang pas?", "Kenapa ada batas minimum 1.200 kkal?", "Bagaimana cara membuka workout?"]
  },
  "giziPanduanTarget": {
    judul: "Panduan Target: Diet vs Jaga vs Bulking",
    sapaanGuest: "Mau tahu perbedaan pola makan untuk Diet, Jaga Berat Badan, atau Bulking?",
    sapaanMember: "Mau tahu strategi nutrisi terbaik untuk target yang sedang kamu jalankan?",
    saran: ["Apa beda defisit diet vs surplus bulking?", "Kenapa diet dibatasi usia 18+?", "Bagaimana cara jaga berat badan?"]
  },
  "giziMakronutrisi": {
    judul: "Rincian Makronutrisi",
    sapaanGuest: "Protein, Karbohidrat, dan Lemak sehat adalah tiga fondasi energi tubuhmu.",
    sapaanMember: "Pastikan rasio makronutrisimu seimbang untuk mendukung energimu beraktivitas.",
    saran: ["Apa fungsi protein?", "Karbohidrat apa yang bagus?", "Apakah lemak harus dihindari?"]
  },
  "giziEdukasiNutrisi": {
    judul: "Edukasi Gizi & Hidrasi",
    sapaanGuest: "Mau mempelajari cara memenuhi kebutuhan nutrisi harian secara praktis?",
    sapaanMember: "Mau mempelajari cara memenuhi kebutuhan nutrisi harian secara praktis?",
    saran: ["Berapa banyak air putih sehari?", "Bagaimana cegah defisiensi zat besi?", "Apa bahaya diet ekstrem?"]
  },

  // WORK OUT
  "workoutStatusAkses": {
    judul: "Status Akses Work Out",
    sapaanGuest: "Program latihan GERAK diselaraskan dengan kebutuhan energimu. Mau tahu cara membukanya?",
    sapaanMember: "Program latihanmu tersambung langsung dengan data gizi harianmu.",
    saran: ["Bagaimana cara buka gembok latihan?", "Kenapa latihan butuh data gizi?", "Berapa poin per sesi latihan?"]
  },
  "workoutJadwalMingguan": {
    judul: "Jadwal Latihan Mingguan",
    sapaanGuest: "Mau tahu latihan ramah sendi yang cocok untuk pemula?",
    sapaanMember: "Bingung dengan jadwal latihanmu? Aku bisa membantu menjelaskannya.",
    saran: ["Berapa kali latihan seminggu?", "Apakah butuh alat gym?", "Bagaimana jika belum kuat repetisi penuh?"]
  },
  "workoutTipsPemulihan": {
    judul: "Tips Pemulihan & Energi",
    sapaanGuest: "Istirahat dan pemulihan sama pentingnya dengan latihan fisik itu sendiri.",
    sapaanMember: "Otot tumbuh saat istirahat! Butuh tips peregangan atau hidrasi hari ini?",
    saran: ["Berapa jam tidur ideal untuk olahraga?", "Bagaimana cara redakan pegal DOMS?", "Kapan waktu terbaik minum air?"]
  },
  "workoutRiwayatKesehatan": {
    judul: "Riwayat Kesehatan & Keluhan Latihan",
    sapaanGuest: "Catat keluhan saat latihan dan hasil medical checkup supaya latihan tetap aman.",
    sapaanMember: "Ada gerakan yang bikin nggak kuat? Laporkan, nanti aku bantu cari versi yang lebih aman.",
    saran: ["Lutut sakit saat squat, harus bagaimana?", "Kapan keluhan latihan perlu ke dokter?", "Olahraga apa yang aman kalau tensi tinggi?"]
  },
  "workoutManfaatLatihan": {
    judul: "Manfaat Latihan Fisik",
    sapaanGuest: "Olahraga rutin memperbaiki postur, daya tahan tubuh, dan suasana hati.",
    sapaanMember: "Setiap sesi latihan yang kamu selesaikan menghasilkan +25 Poin untuk rank-mu!",
    saran: ["Apa manfaat latihan beban bagi postur?", "Bagaimana cara cegah overtraining?"]
  },

  // KAWAN
  "kawanPencarianFilter": {
    judul: "Pencarian Kawan & 14 Cabor",
    sapaanGuest: "Lagi mencari teman olahraga? Ada 14 cabang olahraga yang bisa kamu pilih di sini!",
    sapaanMember: "Mau mencari teman berdasarkan olahraga yang kamu sukai?",
    saran: ["Apa saja 14 cabang olahraga?", "Bagaimana cara mengirim ajakan?", "Apakah ajakan dapat XP?"]
  },
  "kawanSedangAktif": {
    judul: "Kawan Sedang Aktif",
    sapaanGuest: "Mau mengetahui siapa saja yang sedang online dan aktif olahraga hari ini?",
    sapaanMember: "Mau mengetahui siapa yang sedang online? Ajak mereka beraktivitas bareng!",
    saran: ["Berapa batas ajakan per hari?", "Bagaimana status aktif diperbarui?"]
  },
  "kawanOlahragaBareng": {
    judul: "Agenda Olahraga Bareng",
    sapaanGuest: "Lagi mencari teman lari, renang, atau main badminton di sekitarmu?",
    sapaanMember: "Lagi mencari teman lari, renang, atau main badminton di sekitarmu?",
    saran: ["Bagaimana cara gabung sesi bersama?", "Di mana titik temu kumpulnya?"]
  },
  "kawanTemanSekitar": {
    judul: "Teman di Sekitar (Radius Jarak)",
    sapaanGuest: "Fitur ini menghitung jarak nyata kawan terdekat dengan rumus Haversine.",
    sapaanMember: "Cari kawan olahraga terdekat mulai dari radius 1 km hingga 10 km.",
    saran: ["Bagaimana jarak dihitung?", "Pilihan radius berapa saja yang tersedia?"]
  },

  // POIN & RANK
  "poinTotalDashboard": {
    judul: "Dashboard Poin & Rank",
    sapaanGuest: "Mau tahu bagaimana sistem poin dan rank GERAK. bekerja?",
    sapaanMember: "Sudah tahu berapa poin yang kamu butuhkan untuk mencapai rank berikutnya?",
    saran: ["Berapa poin per sesi workout?", "Ada berapa tingkatan rank?", "Bagaimana cara naik ke tier atas?"]
  },
  "poinTingkatanBadge": {
    judul: "Tingkatan Rank & Koleksi Badge",
    sapaanGuest: "Ada 11 tingkatan rank dari Pemula Mager hingga Legenda Raga. Setiap 500 poin naik tier!",
    sapaanMember: "Ayo kejar rank berikutnya! Koleksi semua badge prestisius GERAK.",
    saran: ["Sebutkan semua 11 rank!", "Apa rank tertinggi di GERAK?"]
  },
  "poinLeaderboardKomunitas": {
    judul: "Leaderboard Komunitas",
    sapaanGuest: "Peringkat dihitung murni dari sesi workout nyata tanpa manipulasi angka buatan.",
    sapaanMember: "Cek posisimu di papan peringkat! Selesaikan latihan hari ini untuk menambah poin.",
    saran: ["Apa beda leaderboard mingguan vs keseluruhan?", "Berapa sesi untuk 500 poin?"]
  },

  // JURNAL
  "jurnalCheckinHarian": {
    judul: "Check-in Harian",
    sapaanGuest: "Check-in harian membantumu membangun kebiasaan sehat secara konsisten.",
    sapaanMember: "Sudah check-in hari ini? Setiap check-in menambah +20 XP untuk levelmu!",
    saran: ["Bagaimana jika terlewat check-in satu hari?", "Aktivitas apa saja untuk check-in?"]
  },
  "jurnalMoodPicker": {
    judul: "Mood & Kondisi Emosi",
    sapaanGuest: "Mau mulai mengenali kondisi tubuh dan suasana hatimu hari ini?",
    sapaanMember: "Bagaimana kondisi tubuh dan energimu hari ini? Pilih mood yang menggambarkan rasamu.",
    saran: ["Mengapa mood penting dicatat?", "Apakah data jurnal saya privat?"]
  },
  "jurnalRefleksiRaga": {
    judul: "Catatan Refleksi Raga",
    sapaanGuest: "Sedang ingin mencatat kondisi tubuh atau suasana hatimu? Tulis di sini tanpa takut dihakimi.",
    sapaanMember: "Tuliskan apa yang dirasakan tubuhmu hari ini. Tulisan minimal 10 karakter memberikan +10 XP!",
    saran: ["Apa contoh tulisan refleksi?", "Berapa kali sehari bisa dapat XP jurnal?"]
  },

  // EDUKASI
  "edukasiKategoriSehat": {
    judul: "Modul Edukasi Singkat",
    sapaanGuest: "Ada topik kesehatan yang ingin kamu pelajari? Modul 2 menit kami siap membantumu.",
    sapaanMember: "Ada materi yang ingin kamu pelajari? Aku bisa membantu menjelaskannya.",
    saran: ["Apa itu stunting?", "Kenapa Gen Z harus peduli stunting?", "Bagaimana porsi Isi Piringku?"]
  },
  "edukasiStunting": {
    judul: "Pencegahan Stunting (1.000 HPK)",
    sapaanGuest: "1.000 Hari Pertama Kehidupan adalah periode emas pencegahan stunting masa depan.",
    sapaanMember: "Sebagai calon orang tua masa depan, Gen Z memegang peran kunci pencegahan malnutrisi.",
    saran: ["Apa dampak stunting?", "Nutrisi apa yang paling krusial dicegah?"]
  },
  "edukasiGiziSeimbang": {
    judul: "Pedoman Isi Piringku Kemenkes",
    sapaanGuest: "Porsi Isi Piringku: 1/3 karbohidrat, 1/3 sayuran, 1/6 lauk protein, 1/6 buah-buahan.",
    sapaanMember: "Panduan praktis piring makan sehat untuk menjaga energi harianmu tetap stabil.",
    saran: ["Berapa porsi sayur yang disarankan?", "Mengapa protein hewani penting?"]
  }
};

/**
 * Buat sapaan kontekstual berdasarkan mode dan section
 */
export function hasilkanSapaanKontekstual({ seksiId, userMode, namaUser, giziDihitung, workoutTerbuka }) {
  const data = KAMUS_SEKSI[seksiId];
  const nama = namaUser ? `, ${namaUser}` : "";
  
  if (!data) {
    if (userMode === "member") {
      return `Halo${nama}! Aku GERAK AI, asisten kesehatan pribadimu. Ada yang ingin kamu diskusikan?`;
    }
    return `Halo! Aku GERAK AI. Ada yang bisa aku bantu seputar fitur dan kesehatan di GERAK?`;
  }

  let teks = userMode === "member" ? data.sapaanMember : data.sapaanGuest;
  teks = teks.replace("{nama}", nama);

  // Sesuaikan konteks workout jika masih terkunci
  if (seksiId.startsWith("workout") && !workoutTerbuka && userMode === "member") {
    teks = `Menu Work Out masih terkunci🔒. Yuk atur kebutuhan kalorimu di Kalkulator Gizi dulu agar program latihan terbuka otomatis!`;
  }

  return teks;
}

/**
 * Rekomendasi pertanyaan cepat berdasarkan seksi
 */
export function dapatkanSaranCepat({ seksiId, userMode, workoutTerbuka }) {
  const data = KAMUS_SEKSI[seksiId];
  if (data && data.saran && data.saran.length > 0) {
    return data.saran;
  }
  return ["Apa itu GERAK?", "Bagaimana cara hitung kalori?", "Bagaimana sistem poin bekerja?"];
}

/**
 * Sanitasi & parsing markdown sederhana (bold, list, paragraf)
 */
export function formatPesanMarkdown(teks) {
  if (!teks) return "";
  const aman = String(teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Tebal **teks**, lalu miring *teks* (dipakai per baris, setelah tanda list dibuang)
  const gaya = t => t
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(\S[^*]*?)\*/g, "<em>$1</em>");

  let html = "";
  let listAktif = ""; // "ul", "ol", atau "" kalau tidak sedang di dalam list
  const tutupList = () => {
    if (listAktif) html += `</${listAktif}>`;
    listAktif = "";
  };
  const bukaList = jenis => {
    if (listAktif !== jenis) {
      tutupList();
      html += `<${jenis} class='ai-chat-list'>`;
      listAktif = jenis;
    }
  };

  aman.split("\n").forEach(barisMentah => {
    const b = barisMentah.trim();
    const judul = b.match(/^#{1,6}\s+(.*)$/);
    const nomor = b.match(/^\d+[.)]\s+(.*)$/);

    if (b.startsWith("- ") || b.startsWith("* ")) {
      bukaList("ul");
      html += `<li>${gaya(b.substring(2))}</li>`;
    } else if (nomor) {
      bukaList("ol");
      html += `<li>${gaya(nomor[1])}</li>`;
    } else {
      tutupList();
      if (judul) html += `<p class='ai-chat-judul'><strong>${gaya(judul[1]).replace(/<\/?strong>/g, "")}</strong></p>`;
      else if (b.length > 0) html += `<p>${gaya(b)}</p>`;
    }
  });
  tutupList();

  return html;
}

// ==========================================
// KELAS PENGELOLA GERAK AI WIDGET
// ==========================================
export class GerakAiController {
  constructor(appState) {
    this.appState = appState;
    this.halamanAktif = "beranda";
    this.seksiAktif = "berandaHero";
    this.riwayatPesan = [];
    this.panelTerbuka = false;
    this.panelMaximized = false;
    this.waktuSapaanTerakhir = 0;
    this.jedaCooldownMs = 15000; // Cooldown 15 detik untuk speech bubble otomatis
    this.seksiTerakhirDisapa = null;
    this.timerSembunyiBubble = null;
    this.observer = null;

    this.dom = {
      widget: document.getElementById("gerakAiWidget"),
      trigger: document.getElementById("btnToggleAi"),
      bubble: document.getElementById("gerakAiBubble"),
      kontenBubble: document.getElementById("teksBubbleAi"),
      btnBukaBubble: document.getElementById("btnBukaChatDariBubble"),
      btnTutupBubble: document.getElementById("btnTutupBubbleAi"),
      panel: document.getElementById("gerakAiPanel"),
      statusChip: document.getElementById("aiStatusChip"),
      contextBar: document.getElementById("aiContextBar"),
      contextText: document.getElementById("aiContextText"),
      messagesBox: document.getElementById("aiMessagesBox"),
      typing: document.getElementById("aiTypingIndicator"),
      suggestionsBar: document.getElementById("aiSuggestionsBar"),
      form: document.getElementById("formAiChat"),
      input: document.getElementById("inputAiPesan"),
      btnMinimize: document.getElementById("btnAiMinimize"),
      btnMaximize: document.getElementById("btnAiMaximize"),
      btnClose: document.getElementById("btnAiClose")
    };
  }

  inisialisasi() {
    if (!this.dom.widget) return;

    this.pasangEventListeners();
    this.perbaruiStatusPengguna();
    this.inisialisasiObserver();
    this.perbaruiSaranCepat();

    // Sapaan awal di riwayat chat jika masih kosong
    if (this.riwayatPesan.length === 0) {
      const mode = this.cekUserMode();
      const nama = this.appState?.akun?.nama;
      const sapaanAwal = mode === "member"
        ? `Halo, **${nama}**! Senang berjumpa lagi di GERAK. Aku GERAK AI, asisten kesehatan inklusifmu. Aku memantau posisimu di halaman ini dan siap membantu kapan saja!`
        : `Halo! Selamat datang di GERAK. Aku **GERAK AI**, asisten kebugaran dan gaya hidup sehat inklusif buat Gen Z. Ada yang ingin kamu tanyakan seputar gizi, latihan fisik, kawan olahraga, atau topik lainnya?`;
      this.tambahPesan("assistant", sapaanAwal);
    }
  }

  cekUserMode() {
    return (this.appState?.akun && this.appState.akun.nama) ? "member" : "guest";
  }

  perbaruiStatusPengguna() {
    const mode = this.cekUserMode();
    if (this.dom.statusChip) {
      if (mode === "member") {
        const nama = this.appState.akun.nama;
        this.dom.statusChip.textContent = `✨ Member: ${nama}`;
        this.dom.statusChip.className = "gerak-ai-status-chip member-aktif";
      } else {
        this.dom.statusChip.textContent = "🌱 Mode Pengunjung";
        this.dom.statusChip.className = "gerak-ai-status-chip guest-aktif";
      }
    }
  }

  pasangEventListeners() {
    // 1. Toggle Panel Buka/Tutup
    this.dom.trigger?.addEventListener("click", () => {
      this.togglePanel();
    });

    // 2. Tombol Tutup Panel
    this.dom.btnClose?.addEventListener("click", () => {
      this.tutupPanel();
    });

    // 3. Tombol Minimize
    this.dom.btnMinimize?.addEventListener("click", () => {
      this.tutupPanel();
    });

    // 4. Tombol Maximize
    this.dom.btnMaximize?.addEventListener("click", () => {
      this.toggleMaximize();
    });

    // 5. Bubble: Buka Chat
    this.dom.btnBukaBubble?.addEventListener("click", () => {
      this.sembunyikanBubble();
      this.bukaPanel();
    });

    // 6. Bubble: Tutup / Abaikan
    this.dom.btnTutupBubble?.addEventListener("click", () => {
      this.sembunyikanBubble();
    });

    // 7. Form Submit Kirim Pesan
    this.dom.form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.kirimPesanPengguna();
    });
  }

  bukaPanel() {
    this.panelTerbuka = true;
    if (this.dom.panel) {
      this.dom.panel.style.display = "flex";
      this.dom.panel.classList.remove("menutup");
      this.dom.panel.classList.add("terbuka");
    }
    this.sembunyikanBubble();
    this.perbaruiContextChip();
    this.perbaruiSaranCepat();
    setTimeout(() => {
      this.dom.input?.focus();
      this.scrollPesanKeBawah();
    }, 150);
  }

  tutupPanel() {
    this.panelTerbuka = false;
    if (this.dom.panel) {
      this.dom.panel.classList.remove("terbuka");
      this.dom.panel.classList.add("menutup");
      setTimeout(() => {
        if (!this.panelTerbuka && this.dom.panel) {
          this.dom.panel.style.display = "none";
        }
      }, 250);
    }
  }

  togglePanel() {
    if (this.panelTerbuka) {
      this.tutupPanel();
    } else {
      this.bukaPanel();
    }
  }

  toggleMaximize() {
    this.panelMaximized = !this.panelMaximized;
    if (this.dom.panel) {
      if (this.panelMaximized) {
        this.dom.panel.classList.add("maximized");
        if (this.dom.btnMaximize) this.dom.btnMaximize.textContent = "❐";
      } else {
        this.dom.panel.classList.remove("maximized");
        if (this.dom.btnMaximize) this.dom.btnMaximize.textContent = "⛶";
      }
    }
  }

  tampilkanBubble(teks) {
    if (this.panelTerbuka || !this.dom.bubble) return;
    if (this.dom.kontenBubble) {
      this.dom.kontenBubble.textContent = teks;
    }
    this.dom.bubble.style.display = "flex";
    this.dom.bubble.classList.add("muncul");

    // Otomatis sembunyikan setelah 8 detik jika diabaikan
    clearTimeout(this.timerSembunyiBubble);
    this.timerSembunyiBubble = setTimeout(() => {
      this.sembunyikanBubble();
    }, 8500);
  }

  sembunyikanBubble() {
    clearTimeout(this.timerSembunyiBubble);
    if (this.dom.bubble) {
      this.dom.bubble.classList.remove("muncul");
      this.dom.bubble.style.display = "none";
    }
  }

  perbaruiContextChip() {
    if (!this.dom.contextText) return;
    const seksiData = KAMUS_SEKSI[this.seksiAktif];
    const namaHalaman = this.halamanAktif.charAt(0).toUpperCase() + this.halamanAktif.slice(1);
    const namaSeksi = seksiData?.judul || "Umum";
    this.dom.contextText.textContent = `Sedang melihat: ${namaHalaman} > ${namaSeksi}`;
  }

  perbaruiSaranCepat() {
    if (!this.dom.suggestionsBar) return;
    const mode = this.cekUserMode();
    const workoutTerbuka = Boolean(this.appState?.data?.profilGizi);
    const saran = dapatkanSaranCepat({
      seksiId: this.seksiAktif,
      userMode: mode,
      workoutTerbuka
    });

    this.dom.suggestionsBar.innerHTML = "";
    saran.forEach(teksSaran => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "gerak-ai-suggestion-chip";
      chip.textContent = teksSaran;
      chip.addEventListener("click", () => {
        if (this.dom.input) {
          this.dom.input.value = teksSaran;
        }
        this.kirimPesanPengguna();
      });
      this.dom.suggestionsBar.appendChild(chip);
    });
  }

  tambahPesan(role, teks) {
    this.riwayatPesan.push({ role, text: teks, waktu: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    if (!this.dom.messagesBox) return;

    const pesanEl = document.createElement("div");
    pesanEl.className = `gerak-ai-msg gerak-ai-msg-${role}`;

    const isiEl = document.createElement("div");
    isiEl.className = "gerak-ai-msg-content";
    isiEl.innerHTML = formatPesanMarkdown(teks);

    const waktuEl = document.createElement("span");
    waktuEl.className = "gerak-ai-msg-time";
    waktuEl.textContent = this.riwayatPesan[this.riwayatPesan.length - 1].waktu;

    pesanEl.appendChild(isiEl);
    pesanEl.appendChild(waktuEl);
    this.dom.messagesBox.appendChild(pesanEl);

    this.scrollPesanKeBawah();
  }

  scrollPesanKeBawah() {
    if (this.dom.messagesBox) {
      this.dom.messagesBox.scrollTop = this.dom.messagesBox.scrollHeight;
    }
  }

  setSedangMengetik(mengetik) {
    if (this.dom.typing) {
      this.dom.typing.style.display = mengetik ? "flex" : "none";
      if (mengetik) this.scrollPesanKeBawah();
    }
  }

  async kirimPesanPengguna() {
    const inputEl = this.dom.input;
    if (!inputEl) return;
    const pesan = inputEl.value.trim();
    if (!pesan) return;

    inputEl.value = "";
    this.tambahPesan("user", pesan);
    this.setSedangMengetik(true);

    const mode = this.cekUserMode();
    const namaUser = this.appState?.akun?.nama || "";
    const seksiData = KAMUS_SEKSI[this.seksiAktif];

    // Persiapkan payload aman (tanpa kredensial pribadi atau data rahasia)
    const payload = {
      message: pesan,
      history: this.riwayatPesan.slice(-6).map(m => ({ role: m.role, text: m.text })),
      userMode: mode,
      userName: namaUser,
      context: {
        halaman: this.halamanAktif,
        halamanJudul: this.halamanAktif.charAt(0).toUpperCase() + this.halamanAktif.slice(1),
        seksi: this.seksiAktif,
        seksiJudul: seksiData?.judul || "Umum"
      }
    };

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const hasil = await response.json();
      this.setSedangMengetik(false);

      if (hasil.sukses && hasil.balasan) {
        this.tambahPesan("assistant", hasil.balasan);
      } else {
        const pesanFallback = hasil.balasan || "Maaf, GERAK AI sedang mengalami kendala jaringan. Silakan coba kembali sesaat lagi.";
        this.tambahPesan("assistant", pesanFallback);
      }
    } catch (err) {
      console.warn("Koneksi /api/ai/chat gagal, menggunakan fallback lokal browser:", err.message);
      this.setSedangMengetik(false);

      // Gunakan fallback lokal langsung di browser
      const seksiJudul = seksiData?.judul || "Umum";
      const sapaanNama = namaUser ? `, ${namaUser}` : "";
      let balasan = `Terima kasih pertanyaannya${sapaanNama}! Saat ini kamu sedang membuka seksi **${seksiJudul}** di halaman **${this.halamanAktif}**. Di GERAK, kami selalu mengedepankan pendekatan holistik: imbangi kebutuhan nutrisi terukur dengan latihan ramah sendi dan konsistensi jurnal harian.`;
      
      this.tambahPesan("assistant", balasan);
    }
  }

  // Notifikasi pergantian halaman dari router
  setHalamanAktif(idHalaman) {
    this.halamanAktif = idHalaman || "beranda";
    this.perbaruiObserverHalaman();
    this.perbaruiContextChip();
    this.perbaruiSaranCepat();
    this.perbaruiStatusPengguna();
  }

  inisialisasiObserver() {
    if (!("IntersectionObserver" in window)) return;

    const opsi = {
      root: null,
      rootMargin: "-10% 0px -40% 0px",
      threshold: [0.1, 0.4]
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const seksiId = entry.target.getAttribute("data-seksi-ai") || entry.target.id;
          if (seksiId && seksiId !== this.seksiAktif) {
            this.handleSeksiBerubah(seksiId);
          }
        }
      });
    }, opsi);

    this.perbaruiObserverHalaman();
  }

  perbaruiObserverHalaman() {
    if (!this.observer) return;
    this.observer.disconnect();

    const halamanEl = document.getElementById(this.halamanAktif);
    if (!halamanEl) return;

    const seksiList = halamanEl.querySelectorAll("[data-seksi-ai], [id]");
    seksiList.forEach(el => {
      const id = el.getAttribute("data-seksi-ai") || el.id;
      if (KAMUS_SEKSI[id]) {
        this.observer.observe(el);
      }
    });
  }

  handleSeksiBerubah(seksiId) {
    this.seksiAktif = seksiId;
    this.perbaruiContextChip();
    this.perbaruiSaranCepat();

    // Aturan Cooldown & Pencegahan Spam Sapaan Otomatis
    const sekarang = Date.now();
    const selisihWaktu = sekarang - this.waktuSapaanTerakhir;

    // Jangan munculkan bubble jika panel sedang terbuka atau seksi baru saja disapa atau cooldown belum lewat
    if (this.panelTerbuka) return;
    if (this.seksiTerakhirDisapa === seksiId) return;
    if (selisihWaktu < this.jedaCooldownMs) return;

    const mode = this.cekUserMode();
    const namaUser = this.appState?.akun?.nama || "";
    const workoutTerbuka = Boolean(this.appState?.data?.profilGizi);

    const sapaan = hasilkanSapaanKontekstual({
      seksiId,
      userMode: mode,
      namaUser,
      giziDihitung: workoutTerbuka,
      workoutTerbuka
    });

    this.waktuSapaanTerakhir = sekarang;
    this.seksiTerakhirDisapa = seksiId;
    this.tampilkanBubble(sapaan);
  }
}

// Instance Singleton & Fungsi Inisialisasi
let instanceGerakAi = null;

export function inisialisasiGerakAI(appState) {
  if (!instanceGerakAi) {
    instanceGerakAi = new GerakAiController(appState);
    instanceGerakAi.inisialisasi();
  } else {
    instanceGerakAi.appState = appState;
    instanceGerakAi.perbaruiStatusPengguna();
  }
  return instanceGerakAi;
}

export function perbaruiHalamanAi(idHalaman) {
  if (instanceGerakAi) {
    instanceGerakAi.setHalamanAktif(idHalaman);
  }
}