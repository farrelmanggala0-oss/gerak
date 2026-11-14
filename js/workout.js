// =========================================
// GERAK - js/workout.js
// Sistem rekomendasi latihan fisik berbasis profil gizi, slider interaktif,
// sesi latihan terstruktur, dan katalog demonstrasi gerakan
// =========================================

import { el, tampilToast } from "./ui.js";
import { formatTanggal, hariIni } from "./tanggal.js";
import { simpanData } from "./penyimpanan.js";
import { tambahPoinWorkout, sinkronkanPenggunaLeaderboard } from "./poin-rank.js";
import { dapatkanPanduanSimulasi } from "../data/panduan-simulasi.js";
import { bukaDialogLaporKeluhan, cariKeluhanGerakan, teksKeluhanSingkat } from "./kesehatan-ui.js";

// =========================================
// DATABASE PROGRAM LATIHAN BERDASARKAN TARGET
// =========================================

export const REKOMENDASI_WORKOUT = {
  diet: {
    target: "diet",
    judul: "Kardio Terukur & Sirkuit Pengencangan Otot",
    badge: "🥗 Target: Diet & Fat Loss",
    fokus: "Kombinasi latihan kekuatan tubuh dan kardio terukur untuk menjaga defisit energi tanpa kehilangan massa otot.",
    tips: "Minum air putih cukup sebelum dan sesudah latihan. Karena berada dalam fase defisit kalori, utamakan tidur 7-8 jam agar proses regenerasi sel tubuh tetap optimal.",
    jadwal: [
      {
        id: "diet-hari-1",
        hari: "Hari 1",
        jenis: "Kardio & Core",
        nama: "Kardio LISS & Penguatan Core",
        durasi: "30-40 Menit",
        level: "Pemula - Menengah",
        ilustrasi: "kardio",
        foto: "assets/workout/cardio.jpg",
        ringkasanGerakan: ["Jalan Cepat / Jogging LISS", "Plank Hold", "Bicycle Crunches", "Dead Bug"],
        gerakan: [
          {
            nama: "Jalan Cepat / Jogging Santai (LISS)",
            kategori: "core",
            targetOtot: "Jantung & Paru-paru",
            ototSekunder: "Betis, Paha Depan, Glutes",
            set: "1 Sesi",
            reps: "25-30 Menit Konstan",
            istirahat: "Sesuai kebutuhan",
            deskripsi: "Latihan kardio intensitas rendah-sedang (Low-Intensity Steady State) di zona denyut jantung 60-70% untuk memaksimalkan pembakaran cadangan lemak tanpa membebani sendi.",
            langkah: [
              "Awali dengan jalan santai 3-5 menit sebagai pemanasan dinamis.",
              "Tingkatkan kecepatan ke jalan cepat atau jogging santai dengan postur tegap.",
              "Pertahankan ritme napas teratur (bisa berbicara tanpa terengah-engah).",
              "Lakukan pendinginan dan peregangan kaki selama 3 menit di akhir sesi."
            ],
            kesalahanUmum: [
              "Memulai terlalu cepat sehingga kehabisan napas di 10 menit awal.",
              "Postur tubuh membungkuk ke depan saat berjalan atau berlari."
            ]
          },
          {
            nama: "Plank Hold",
            kategori: "core",
            targetOtot: "Core / Dinding Perut",
            ototSekunder: "Bahu, Punggung Bawah, Glutes",
            set: "3 Set",
            reps: "30-45 Detik",
            istirahat: "45 Detik",
            deskripsi: "Gerakan isometrik fondasi terbaik untuk mengencangkan otot perut dalam (transverse abdominis) dan menstabilkan tulang belakang tanpa beban berat.",
            langkah: [
              "Posisikan kedua siku tegak lurus tepat di bawah bahu dan kaki lurus ke belakang.",
              "Kencangkan otot perut dan bokong hingga tubuh membentuk satu garis lurus sempurna.",
              "Arahkan pandangan ke lantai di antara kedua tangan (posisi leher netral).",
              "Tahan posisi tanpa membiarkan pinggul melorot ke bawah atau mencuat tinggi."
            ],
            kesalahanUmum: [
              "Pinggul melorot ke bawah yang dapat memberi tekanan berlebih pada pinggang.",
              "Menahan napas (bernapaslah secara perlahan dan teratur)."
            ]
          },
          {
            nama: "Bicycle Crunches",
            kategori: "core",
            targetOtot: "Obliques (Perut Samping)",
            ototSekunder: "Rectus Abdominis, Hip Flexors",
            set: "3 Set",
            reps: "12-15 Reps tiap sisi",
            istirahat: "45 Detik",
            deskripsi: "Gerakan dinamis untuk melatih otot perut samping (obliques) dan mengoptimalkan pembakaran kalori aktif.",
            langkah: [
              "Berbaring telentang, letakkan ujung jari tangan di belakang telinga (jangan menarik leher).",
              "Angkat kedua kaki membentuk sudut 90 derajat.",
              "Dekatkan siku kanan ke lutut kiri sambil meluruskan kaki kanan ke depan.",
              "Lakukan bergantian dengan ritme terkontrol dan rasakan kontraksi dinding perut."
            ],
            kesalahanUmum: [
              "Menarik kepala atau leher dengan tangan hingga leher tegang.",
              "Mengayunkan kaki terlalu cepat tanpa merasakan kontraksi otot."
            ]
          },
          {
            nama: "Dead Bug",
            kategori: "core",
            targetOtot: "Deep Core Stabilizer",
            ototSekunder: "Panggul & Punggung Bawah",
            set: "3 Set",
            reps: "10-12 Reps tiap sisi",
            istirahat: "45 Detik",
            deskripsi: "Melatih koordinasi otot inti bagian dalam dengan aman untuk melindungi pinggang dan memperbaiki postur tubuh.",
            langkah: [
              "Berbaring telentang, angkat kedua tangan lurus ke atas dan tekuk lutut 90 derajat.",
              "Turunkan tangan kanan dan kaki kiri ke arah lantai secara bersamaan perlahan.",
              "Pastikan punggung bawah tetap menempel rata di lantai (tidak melengkung).",
              "Kembali ke posisi awal lalu ganti sisi yang berlawanan."
            ],
            kesalahanUmum: [
              "Punggung bawah terangkat atau melengkung dari permukaan lantai.",
              "Gerakan terburu-buru tanpa kontrol stabilitas."
            ]
          }
        ]
      },
      {
        id: "diet-hari-2",
        hari: "Hari 2",
        jenis: "Full Body Circuit",
        nama: "Sirkuit Pembakaran Lemak (Bodyweight)",
        durasi: "25-30 Menit",
        level: "Semua Tingkat",
        ilustrasi: "fullbody",
        foto: "assets/workout/fullbody.jpg",
        ringkasanGerakan: ["Bodyweight Squat", "Incline / Knee Push-up", "Walking Lunges", "Mountain Climbers"],
        gerakan: [
          {
            nama: "Bodyweight Squat",
            kategori: "lower",
            targetOtot: "Paha Depan (Quadriceps) & Bokong (Glutes)",
            ototSekunder: "Hamstrings, Betis, Core",
            set: "3 Set",
            reps: "12-15 Repetisi",
            istirahat: "45 Detik",
            deskripsi: "Gerakan compound kaki yang melibatkan kelompok otot terbesar tubuh untuk efisiensi metabolisme dan pembakaran kalori.",
            langkah: [
              "Berdiri dengan kaki selebar bahu, ujung jari kaki sedikit mengarah keluar.",
              "Tarik pinggul ke belakang dan tekuk lutut seolah hendak duduk di kursi.",
              "Turun hingga paha sejajar lantai dengan dada tetap tegap busung.",
              "Dorong melalui tumit kaki untuk kembali berdiri tegak."
            ],
            kesalahanUmum: [
              "Lutut menekuk ke dalam (knee valgus) saat menurunkan badan.",
              "Tumit terangkat dari lantai saat posisi squat."
            ]
          },
          {
            nama: "Incline / Knee Push-up",
            kategori: "upper",
            targetOtot: "Dada (Pectoralis)",
            ototSekunder: "Triceps, Bahu Depan, Core",
            set: "3 Set",
            reps: "10-12 Repetisi",
            istirahat: "45 Detik",
            deskripsi: "Variasi push-up ramah sendi yang efektif membangun kekuatan dada dan lengan atas tanpa tekanan berlebih pada persendian.",
            langkah: [
              "Letakkan tangan di atas permukaan lebih tinggi (meja/bangku kokoh) atau bertumpu pada lutut di matras.",
              "Jaga tubuh dalam satu garis lurus dari bahu hingga tumit atau lutut.",
              "Turunkan dada perlahan hingga hampir menyentuh permukaan.",
              "Dorong kembali ke atas sambil menghembuskan napas terkontrol."
            ],
            kesalahanUmum: [
              "Siku melebar 90 derajat tegak lurus bahu (bisa memicu nyeri sendi bahu).",
              "Perut melorot ke bawah saat mendorong tubuh naik."
            ]
          },
          {
            nama: "Walking Lunges",
            kategori: "lower",
            targetOtot: "Paha Depan & Bokong",
            ototSekunder: "Hamstrings, Keseimbangan",
            set: "3 Set",
            reps: "10 Langkah tiap kaki",
            istirahat: "45 Detik",
            deskripsi: "Melatih kekuatan satu sisi kaki (unilateral) sekaligus meningkatkan keseimbangan dan koordinasi tubuh secara fungsional.",
            langkah: [
              "Langkahkan satu kaki ke depan dengan jarak yang cukup lebar.",
              "Turunkan pinggul hingga lutut kaki belakang hampir menyentuh lantai (sudut 90 derajat).",
              "Pastikan lutut kaki depan tidak melampaui jauh ujung jari kaki.",
              "Dorong tubuh naik dan langkahkan kaki berikutnya ke depan secara bergantian."
            ],
            kesalahanUmum: [
              "Langkah terlalu pendek sehingga lutut depan tertekan tajam.",
              "Badan condong miring atau bergoyang ke samping."
            ]
          },
          {
            nama: "Mountain Climbers",
            kategori: "core",
            targetOtot: "Kardio & Core",
            ototSekunder: "Bahu Depan, Hip Flexors",
            set: "3 Set",
            reps: "30 Detik",
            istirahat: "45 Detik",
            deskripsi: "Kombinasi luar biasa antara penguatan otot perut dan akselerasi denyut jantung pembakar kalori tubuh.",
            langkah: [
              "Mulai dari posisi high plank dengan tangan lurus tepat di bawah bahu.",
              "Tarik lutut kanan ke arah dada secara dinamis dan terkontrol.",
              "Kembalikan kaki kanan lalu segera tarik lutut kiri ke arah dada.",
              "Lakukan seperti berlari di tempat dalam posisi plank datar."
            ],
            kesalahanUmum: [
              "Bokong terangkat terlalu tinggi menyerupai segitiga.",
              "Telapak tangan bergeser maju melewati garis tegak lurus bahu."
            ]
          }
        ]
      },
      {
        id: "diet-hari-3",
        hari: "Hari 3",
        jenis: "Mobilitas & Pemulihan",
        nama: "Pemulihan Aktif & Peregangan Fleksibilitas",
        durasi: "15-20 Menit",
        level: "Relaksasi",
        ilustrasi: "recovery",
        foto: "assets/workout/recovery.jpg",
        ringkasanGerakan: ["Cat-Cow Stretch", "World's Greatest Stretch", "Child's Pose", "Jalan Santai Ringan"],
        gerakan: [
          {
            nama: "Cat-Cow Stretch",
            kategori: "core",
            targetOtot: "Tulang Belakang & Punggung",
            ototSekunder: "Leher, Dada",
            set: "2 Set",
            reps: "10 Siklus Napas",
            istirahat: "30 Detik",
            deskripsi: "Peregangan dinamis untuk melenturkan ruas tulang belakang dan meredakan ketegangan otot setelah latihan intens.",
            langkah: [
              "Posisikan tubuh merangkak (tangan di bawah bahu, lutut di bawah pinggul).",
              "Tarik napas, lengkungkan punggung ke bawah, angkat kepala ke atas (Cow Pose).",
              "Hembuskan napas, bulatkan punggung ke atas, tundukkan dagu ke dada (Cat Pose).",
              "Ulangi dengan ritme napas yang tenang dan teratur."
            ],
            kesalahanUmum: [
              "Menggerakkan leher secara mendadak atau menyentak."
            ]
          },
          {
            nama: "Child's Pose (Balasana)",
            kategori: "core",
            targetOtot: "Punggung Bawah & Bahu",
            ototSekunder: "Paha Dalam, Pinggul",
            set: "2 Set",
            reps: "45-60 Detik Tahan",
            istirahat: "30 Detik",
            deskripsi: "Pose relaksasi restoratif untuk meredakan ketegangan sistem saraf dan meregangkan otot punggung.",
            langkah: [
              "Dari posisi merangkak, dudukkan bokong ke atas tumit kaki.",
              "Rentangkan kedua tangan lurus ke depan di atas matras/lantai.",
              "Rilekskan kening menyentuh lantai dan bernapaslah dalam-dalam."
            ],
            kesalahanUmum: [
              "Memaksakan bokong turun jika persendian lutut terasa sakit."
            ]
          }
        ]
      },
      {
        id: "diet-hari-4",
        hari: "Hari 4",
        jenis: "Kardio Rekreasional",
        nama: "Kardio Bebas & Olahraga Bareng Kawan",
        durasi: "40-50 Menit",
        level: "Menyenangkan",
        ilustrasi: "kardio",
        foto: "assets/workout/cardio.jpg",
        ringkasanGerakan: ["Bersepeda Santai", "Badminton Santai", "Berenang / Jogging Bareng"],
        gerakan: [
          {
            nama: "Olahraga Kardio Menyenangkan",
            kategori: "core",
            targetOtot: "Daya Tahan Aerobik",
            ototSekunder: "Kebugaran Mental & Sosial",
            set: "1 Sesi",
            reps: "45 Menit",
            istirahat: "Sesuai kebutuhan",
            deskripsi: "Gunakan fitur Kawan pada aplikasi GERAK untuk janjian berolahraga santai bersama teman secara aktif.",
            langkah: [
              "Pilih kegiatan yang kamu senangi: badminton, renang, gowes, atau lari santai.",
              "Ajak kawan gerak di tempat umum yang aman dan ramai.",
              "Fokus pada konsistensi dan kegembiraan bergerak aktif tanpa tekanan beban."
            ],
            kesalahanUmum: [
              "Kurang minum air putih sebelum dan sesudah berolahraga."
            ]
          }
        ]
      }
    ]
  },
  jaga: {
    target: "jaga",
    judul: "Kebugaran Fungsional, Daya Tahan & Mobilitas",
    badge: "⚖️ Target: Jaga Kebugaran & Stamina",
    fokus: "Keseimbangan menyeluruh antara kekuatan fungsional, mobilitas sendi, dan kapasitas kardiorespirasi untuk produktivitas harian prima.",
    tips: "Pertahankan rutinitas 3-4 kali seminggu. Latihan fungsional ini terbukti menjaga postur tubuh tetap tegap saat belajar atau bekerja di depan laptop.",
    jadwal: [
      {
        id: "jaga-hari-1",
        hari: "Hari 1",
        jenis: "Full Body",
        nama: "Full Body Functional Conditioning",
        durasi: "30-35 Menit",
        level: "Menengah",
        ilustrasi: "fullbody",
        foto: "assets/workout/fullbody.jpg",
        ringkasanGerakan: ["Push-Up Standar", "Goblet / Bodyweight Squat", "Glute Bridge", "Plank Shoulder Tap"],
        gerakan: [
          {
            nama: "Push-Up Standar",
            kategori: "upper",
            targetOtot: "Dada (Pectoralis Major)",
            ototSekunder: "Triceps, Bahu Depan, Core",
            set: "3 Set",
            reps: "10-12 Repetisi",
            istirahat: "45-60 Detik",
            deskripsi: "Gerakan compound mendorong terbaik untuk menguatkan tubuh bagian atas dan stabilitas dinding perut.",
            langkah: [
              "Letakkan telapak tangan selebar bahu di lantai, jari menghadap ke depan.",
              "Jaga tubuh lurus dari kepala hingga tumit, aktifkan core dan otot bokong.",
              "Turunkan dada dengan siku membentuk sudut 45 derajat dari badan.",
              "Dorong kembali ke atas sampai lengan lurus stabil."
            ],
            kesalahanUmum: [
              "Siku membuka terlalu lebar (90 derajat) yang membebani sendi bahu.",
              "Pinggang melorot saat tubuh bergerak naik."
            ]
          },
          {
            nama: "Goblet / Air Squat",
            kategori: "lower",
            targetOtot: "Quadriceps & Gluteus",
            ototSekunder: "Hamstrings, Core",
            set: "3 Set",
            reps: "12-15 Repetisi",
            istirahat: "45 Detik",
            deskripsi: "Fondasi gerakan fungsional duduk-berdiri untuk memperkuat persendian lutut dan mobilitas panggul.",
            langkah: [
              "Berdiri tegak dengan kaki sedikit lebih lebar dari bahu.",
              "Tahan botol air atau beban ringan di depan dada (atau satukan kedua tangan).",
              "Turunkan pinggul ke bawah dan belakang hingga paha sejajar lantai.",
              "Dorong tumit ke lantai untuk kembali berdiri tegak."
            ],
            kesalahanUmum: [
              "Dada bungkuk condong berlebihan ke depan.",
              "Tumit terangkat dari lantai saat posisi jongkok."
            ]
          },
          {
            nama: "Glute Bridge",
            kategori: "lower",
            targetOtot: "Bokong (Gluteus Maximus)",
            ototSekunder: "Hamstrings, Punggung Bawah",
            set: "3 Set",
            reps: "12-15 Repetisi",
            istirahat: "45 Detik",
            deskripsi: "Mengaktifkan otot glutes yang sering tertidur akibat terlalu lama duduk di meja belajar atau kerja.",
            langkah: [
              "Berbaring telentang, tekuk kedua lutut dengan telapak kaki rata di lantai.",
              "Dorong tumit dan angkat pinggul ke atas hingga sejajar dari lutut ke bahu.",
              "Remas otot bokong di titik puncak selama 1-2 detik.",
              "Turunkan pinggul kembali secara terkontrol."
            ],
            kesalahanUmum: [
              "Melengkungkan punggung bawah secara berlebihan di titik puncak."
            ]
          },
          {
            nama: "Plank Shoulder Tap",
            kategori: "core",
            targetOtot: "Core & Anti-Rotasi",
            ototSekunder: "Stabilitas Bahu",
            set: "3 Set",
            reps: "10 Tap tiap sisi",
            istirahat: "45 Detik",
            deskripsi: "Melatih kekuatan inti menahan putaran (anti-rotation) dan meningkatkan stabilitas kedua bahu.",
            langkah: [
              "Mulai dari posisi high plank dengan kaki sedikit lebih lebar dari biasa untuk keseimbangan.",
              "Angkat tangan kanan dan sentuh bahu kiri tanpa menggoyangkan panggul.",
              "Kembalikan tangan kanan lalu sentuh bahu kanan dengan tangan kiri.",
              "Pertahankan panggul tetap tenang dan stabil menghadap lantai."
            ],
            kesalahanUmum: [
              "Panggul bergoyang miring ke kiri dan kanan saat tangan diangkat."
            ]
          }
        ]
      },
      {
        id: "jaga-hari-2",
        hari: "Hari 2",
        jenis: "Kardio & Mobilitas",
        nama: "Kardio Aerobik & Mobilitas Sendi",
        durasi: "25-30 Menit",
        level: "Semua Tingkat",
        ilustrasi: "kardio",
        foto: "assets/workout/cardio.jpg",
        ringkasanGerakan: ["Jogging Santai / Lompat Tali", "Peregangan Panggul 90/90", "Arm & Shoulder Circles", "Cossack Squats"],
        gerakan: [
          {
            nama: "Jogging Santai / Lompat Tali",
            kategori: "core",
            targetOtot: "Kapasitas Paru & Jantung",
            ototSekunder: "Betis, Kaki",
            set: "1 Sesi",
            reps: "20 Menit",
            istirahat: "Bila perlu",
            deskripsi: "Latihan kardio untuk melancarkan sirkulasi oksigen dan meningkatkan energi positif sepanjang hari.",
            langkah: [
              "Pemanasan ringan 3 menit memutar pergelangan kaki dan lutut.",
              "Lakukan jogging atau lompat tali santai dengan tumpuan bola kaki.",
              "Atur napas ritmis dan jaga detak jantung tetap nyaman."
            ],
            kesalahanUmum: [
              "Mendarat dengan tumit keras saat lompat tali."
            ]
          },
          {
            nama: "Peregangan Panggul 90/90",
            kategori: "lower",
            targetOtot: "Mobilitas Rotasi Pinggul",
            ototSekunder: "Glutes, Punggung Bawah",
            set: "2 Set",
            reps: "8 Rotasi tiap sisi",
            istirahat: "30 Detik",
            deskripsi: "Membuka mobilitas persendian pinggul yang kaku akibat gaya hidup sedentari seharian.",
            langkah: [
              "Duduk di lantai dengan kaki depan dan belakang ditekuk masing-masing sudut 90 derajat.",
              "Tegakkan badan dan rasakan regangan pada sendi panggul.",
              "Putar kedua lutut ke sisi berlawanan secara perlahan."
            ],
            kesalahanUmum: [
              "Membungkukkan punggung saat merotasi pinggul."
            ]
          }
        ]
      },
      {
        id: "jaga-hari-3",
        hari: "Hari 3",
        jenis: "Upper & Lower Split",
        nama: "Penguatan Otot Fungsional & Postur",
        durasi: "35 Menit",
        level: "Menengah",
        ilustrasi: "upper",
        foto: "assets/workout/upper.jpg",
        ringkasanGerakan: ["Inverted Rows / Resistance Pull", "Reverse Lunges", "Pike Push-up", "Bird Dog"],
        gerakan: [
          {
            nama: "Reverse Lunges",
            kategori: "lower",
            targetOtot: "Quadriceps & Gluteus",
            ototSekunder: "Hamstrings, Keseimbangan",
            set: "3 Set",
            reps: "10-12 Reps tiap kaki",
            istirahat: "45 Detik",
            deskripsi: "Variasi lunge yang lebih ramah untuk lutut dengan aktivasi glutes maksimal.",
            langkah: [
              "Berdiri tegak, langkahkan kaki kanan ke belakang.",
              "Turunkan badan hingga lutut kanan hampir menyentuh lantai.",
              "Dorong kembali dengan kaki depan untuk berdiri tegak."
            ],
            kesalahanUmum: [
              "Lutut depan goyah ke dalam saat menahan beban tubuh."
            ]
          },
          {
            nama: "Pike Push-up (Penguat Bahu)",
            kategori: "upper",
            targetOtot: "Bahu (Deltoids)",
            ototSekunder: "Triceps, Punggung Atas",
            set: "3 Set",
            reps: "8-10 Repetisi",
            istirahat: "60 Detik",
            deskripsi: "Mempersiapkan kekuatan mendorong vertikal untuk membentuk bahu tegap dan postur gagah.",
            langkah: [
              "Dari posisi push-up, angkat pinggul ke atas membentuk huruf V terbalik.",
              "Turunkan kepala ke arah lantai di antara kedua tangan.",
              "Dorong kembali ke posisi huruf V terbalik."
            ],
            kesalahanUmum: [
              "Siku melebar ke samping alih-alih mengarah sedikit ke belakang."
            ]
          },
          {
            nama: "Bird Dog",
            kategori: "core",
            targetOtot: "Stabilitas Tulang Belakang & Punggung",
            ototSekunder: "Glutes, Core",
            set: "3 Set",
            reps: "10 Reps tiap sisi",
            istirahat: "30 Detik",
            deskripsi: "Latihan stabilisasi terbaik untuk menguatkan rantai posterior tubuh dan mencegah nyeri punggung.",
            langkah: [
              "Posisi merangkak dengan punggung netral datar.",
              "Luruskan tangan kanan ke depan dan kaki kiri ke belakang secara bersamaan.",
              "Tahan 1-2 detik lalu kembali ke posisi awal.",
              "Ganti sisi secara bergantian terkontrol."
            ],
            kesalahanUmum: [
              "Punggung melengkung berlebihan saat mengangkat kaki."
            ]
          }
        ]
      },
      {
        id: "jaga-hari-4",
        hari: "Hari 4",
        jenis: "Aktivitas Sosial",
        nama: "Olahraga Komunitas / Kawan Gerak",
        durasi: "45-60 Menit",
        level: "Sosial & Rekreasi",
        ilustrasi: "kardio",
        foto: "assets/workout/cardio.jpg",
        ringkasanGerakan: ["Futsal", "Badminton", "Lari Pagi", "Gowes Santai"],
        gerakan: [
          {
            nama: "Sesi Main Bareng Kawan",
            kategori: "core",
            targetOtot: "Stamina Menyeluruh & Kegembiraan",
            ototSekunder: "Interaksi Sosial Positif",
            set: "1 Sesi",
            reps: "45-60 Menit",
            istirahat: "Fleksibel",
            deskripsi: "Manfaatkan tab Kawan untuk berolahraga bersama teman sebaya dan mempererat silaturahmi sehat.",
            langkah: [
              "Pilih jenis olahraga favoritmu di tab Cari Kawan.",
              "Sepakati waktu dan lokasi publik yang aman.",
              "Nikmati momen berolahraga tanpa beban tekanan kompetitif."
            ],
            kesalahanUmum: [
              "Lupa melakukan pemanasan sebelum permainan intensif."
            ]
          }
        ]
      }
    ]
  },
  bulking: {
    target: "bulking",
    judul: "Latihan Beban Progresif & Hipertrofi Otot",
    badge: "💪 Target: Bulking / Tambah Massa Otot",
    fokus: "Memaksimalkan surplus kalori dan sintesis protein dengan beban progresif terarah untuk merangsang pertumbuhan serat otot.",
    tips: "Konsumsi makanan tinggi protein dalam jendela 1-2 jam setelah sesi latihan. Berikan istirahat minimal 48 jam sebelum melatih kelompok otot yang sama kembali.",
    jadwal: [
      {
        id: "bulking-hari-1",
        hari: "Hari 1",
        jenis: "Upper Body",
        nama: "Upper Body Push & Chest Hypertrophy",
        durasi: "40-45 Menit",
        level: "Lanjutan",
        ilustrasi: "upper",
        foto: "assets/workout/upper.jpg",
        ringkasanGerakan: ["Push-Up Progresif / Weighted", "Dips (Bangku / Paralel)", "Pike Push-Up to Handstand", "Triceps Diamond Push-up"],
        gerakan: [
          {
            nama: "Push-Up Progresif (Defisit / Beban)",
            kategori: "upper",
            targetOtot: "Dada Tengah & Bawah (Pectoralis)",
            ototSekunder: "Triceps, Bahu Depan, Core",
            set: "4 Set",
            reps: "10-12 Repetisi",
            istirahat: "60-90 Detik",
            deskripsi: "Meningkatkan rentang gerak (range of motion) menggunakan elevasi tangan atau ransel beban untuk stimulasi hipertrofi serat otot maksimal.",
            langkah: [
              "Gunakan parallettes atau dua buku tebal di bawah telapak tangan.",
              "Turunkan dada lebih dalam dari posisi lantai standar (rasakan regangan dada).",
              "Dorong eksplosif dan kontraksikan dada di puncak gerakan.",
              "Terapkan tempo 3 detik turun, 1 detik dorong naik."
            ],
            kesalahanUmum: [
              "Gerakan terburu-buru tanpa mengontrol fase penurunan (eksentrik).",
              "Siku mengunci keras di puncak gerakan."
            ]
          },
          {
            nama: "Dips (Bangku / Parallel Bars)",
            kategori: "upper",
            targetOtot: "Dada Bawah & Triceps",
            ototSekunder: "Bahu Depan",
            set: "3-4 Set",
            reps: "8-12 Repetisi",
            istirahat: "60-90 Detik",
            deskripsi: "Gerakan compound pemompa massa triceps dan otot dada bawah yang sangat efektif.",
            langkah: [
              "Gunakan bangku kokoh atau palang sejajar.",
              "Condongkan badan sedikit ke depan untuk aktivasi dada, atau tegak untuk fokus triceps.",
              "Turunkan badan hingga siku membentuk sudut 90 derajat.",
              "Dorong ke atas dengan kekuatan lengan dan dada."
            ],
            kesalahanUmum: [
              "Turun terlalu dalam melebihi 90 derajat yang membahayakan sendi bahu.",
              "Bahu terangkat mendekati telinga (shrugging)."
            ]
          },
          {
            nama: "Pike Push-Up (Bahu & Trap)",
            kategori: "upper",
            targetOtot: "Bahu (Anterior & Lateral Deltoids)",
            ototSekunder: "Triceps, Punggung Atas",
            set: "3 Set",
            reps: "8-10 Repetisi",
            istirahat: "60 Detik",
            deskripsi: "Membangun volume dan kekuatan bahu 3D tanpa memerlukan dumbel berat di rumah.",
            langkah: [
              "Bentuk tubuh menjadi V terbalik, angkat tumit sedikit.",
              "Arahkan kepala ke depan membentuk segitiga dengan kedua tangan.",
              "Turunkan dahi perlahan mendekati lantai lalu dorong kembali ke atas."
            ],
            kesalahanUmum: [
              "Mendorong ke arah belakang alih-alih tegak lurus."
            ]
          },
          {
            nama: "Diamond Push-up",
            kategori: "upper",
            targetOtot: "Lengan Belakang (Triceps)",
            ototSekunder: "Dada Bagian Dalam",
            set: "3 Set",
            reps: "8-10 Repetisi",
            istirahat: "60 Detik",
            deskripsi: "Variasi push-up dengan tangan membentuk wajik/berlian untuk isolasi kekuatan triceps.",
            langkah: [
              "Rapatkan ibu jari dan telunjuk kedua tangan membentuk segitiga di lantai.",
              "Jaga tubuh lurus dan turunkan dada mendekati tangan.",
              "Dorong kuat-kuat dengan fokus mengontraksikan triceps."
            ],
            kesalahanUmum: [
              "Memaksakan posisi tangan jika pergelangan tangan terasa nyeri (boleh sedikit direnggangkan)."
            ]
          }
        ]
      },
      {
        id: "bulking-hari-2",
        hari: "Hari 2",
        jenis: "Lower Body",
        nama: "Lower Body Quad & Hamstring Dominant",
        durasi: "40-45 Menit",
        level: "Lanjutan",
        ilustrasi: "lower",
        foto: "assets/workout/lower.jpg",
        ringkasanGerakan: ["Bulgarian Split Squat", "Romanian Deadlift (Beban Botol/Bar)", "Tempo Squat 3-1-1", "Single-Leg Calf Raises"],
        gerakan: [
          {
            nama: "Bulgarian Split Squat",
            kategori: "lower",
            targetOtot: "Quadriceps & Gluteus Maximus",
            ototSekunder: "Hamstrings, Penstabil Pinggul",
            set: "4 Set",
            reps: "8-10 Reps tiap kaki",
            istirahat: "60-90 Detik",
            deskripsi: "Raja latihan kaki unilateral yang memaksa setiap kaki bekerja mandiri tanpa kompensasi berat.",
            langkah: [
              "Letakkan punggung kaki belakang di atas kursi atau bangku setinggi lutut.",
              "Posisikan kaki depan cukup jauh agar saat turun lutut depan membentuk 90 derajat.",
              "Turunkan pinggul ke bawah secara tegak dan terkontrol.",
              "Dorong melalui tumit kaki depan untuk kembali naik."
            ],
            kesalahanUmum: [
              "Langkah terlalu dekat menyebabkan lutut depan menjorok tajam ke depan.",
              "Badan membungkuk lemas."
            ]
          },
          {
            nama: "Romanian Deadlift (RDL Beban Botol / Bar)",
            kategori: "lower",
            targetOtot: "Paha Belakang (Hamstrings)",
            ototSekunder: "Glutes, Punggung Bawah (Erector Spinae)",
            set: "3-4 Set",
            reps: "10-12 Repetisi",
            istirahat: "60-90 Detik",
            deskripsi: "Gerakan hip hinge esensial untuk menebalkan otot paha belakang dan memperkuat rantai pinggang.",
            langkah: [
              "Pegang beban di depan paha, lutut sedikit ditekuk (soft knees).",
              "Dorong pinggul ke belakang sejauh mungkin sambil menjaga punggung tetap rata.",
              "Turunkan beban melewati lutut hingga terasa regangan kuat di paha belakang.",
              "Dorong pinggul ke depan dan remas glutes saat kembali berdiri tegak."
            ],
            kesalahanUmum: [
              "Membulatkan punggung bawah (risiko cedera saraf terjepit).",
              "Menekuk lutut terlalu banyak hingga menjadi gerakan squat biasa."
            ]
          },
          {
            nama: "Tempo Squats (3 Detik Turun, 1 Detik Naik)",
            kategori: "lower",
            targetOtot: "Paha Depan (Quads)",
            ototSekunder: "Glutes, Core",
            set: "3 Set",
            reps: "10-12 Repetisi",
            istirahat: "60 Detik",
            deskripsi: "Meningkatkan Time Under Tension (TUT) untuk memicu rangsangan pertumbuhan hipertrofi serat otot.",
            langkah: [
              "Turun posisi squat secara perlahan dalam hitungan 3 detik.",
              "Tahan 1 detik di posisi terbawah.",
              "Dorong secara eksplosif dalam 1 detik kembali ke posisi berdiri."
            ],
            kesalahanUmum: [
              "Jatuh terlalu cepat tanpa kontrol otot."
            ]
          },
          {
            nama: "Single-Leg Calf Raises",
            kategori: "lower",
            targetOtot: "Betis (Gastrocnemius & Soleus)",
            ototSekunder: "Stabilitas Pergelangan Kaki",
            set: "3 Set",
            reps: "15-20 Reps tiap kaki",
            istirahat: "45 Detik",
            deskripsi: "Membangun volume dan kekuatan otot betis dengan beban penuh tubuh pada satu kaki.",
            langkah: [
              "Berdiri dengan ujung jari kaki di tepi anak tangga atau pijakan kokoh.",
              "Turunkan tumit ke bawah garis pijakan untuk regangan maksimal.",
              "Jinjit setinggi mungkin dan tahan 1 detik di puncak.",
              "Turunkan kembali secara perlahan."
            ],
            kesalahanUmum: [
              "Hanya memantul cepat tanpa mencapai kontraksi penuh di puncak gerakan."
            ]
          }
        ]
      },
      {
        id: "bulking-hari-3",
        hari: "Hari 3",
        jenis: "Pemulihan & Nutrisi",
        nama: "Rest Day Aktif & Superkompensasi Protein",
        durasi: "Sepanjang Hari",
        level: "Pemulihan",
        ilustrasi: "recovery",
        foto: "assets/workout/recovery.jpg",
        ringkasanGerakan: ["Peregangan Ringan", "Jalan Santai 15 Menit", "Asupan Protein Optimal", "Tidur Berkualitas 8 Jam"],
        gerakan: [
          {
            nama: "Fase Regenerasi & Anabolisme Otot",
            kategori: "core",
            targetOtot: "Seluruh Jaringan Otot Tubuh",
            ototSekunder: "Sistem Saraf Pusat (CNS)",
            set: "Sepanjang Hari",
            reps: "Nutrisi & Istirahat",
            istirahat: "Tidur 8 Jam",
            deskripsi: "Otot tidak tumbuh saat berlatih di gym, melainkan saat beristirahat dan pulih didukung asupan asam amino lengkap.",
            langkah: [
              "Penuhi target protein harian sesuai kalkulator gizi GERAK.",
              "Minum air minimal 2,5 - 3 liter per hari.",
              "Hindari begadang agar hormon pertumbuhan (GH) terlepas maksimal saat tidur nyenyak."
            ],
            kesalahanUmum: [
              "Memaksakan latihan berat setiap hari tanpa jeda istirahat (overtraining)."
            ]
          }
        ]
      },
      {
        id: "bulking-hari-4",
        hari: "Hari 4",
        jenis: "Upper Body Pull",
        nama: "Upper Body Pull & Back Hypertrophy",
        durasi: "40-45 Menit",
        level: "Lanjutan",
        ilustrasi: "upper",
        foto: "assets/workout/upper.jpg",
        ringkasanGerakan: ["Inverted Rows / Pull-ups", "Bicep Curls (Beban Bebas)", "Reverse Fly / Band Pull-Apart", "Plank Core"],
        gerakan: [
          {
            nama: "Inverted Rows / Pull-up",
            kategori: "upper",
            targetOtot: "Punggung Sayap (Latissimus Dorsi) & Rhomboids",
            ototSekunder: "Biceps, Punggung Atas, Grip",
            set: "4 Set",
            reps: "8-12 Repetisi",
            istirahat: "60-90 Detik",
            deskripsi: "Gerakan compound menarik untuk menebalkan punggung dan melebarkan siluet postur (V-taper).",
            langkah: [
              "Gunakan meja kokoh atau palang pull-up yang aman.",
              "Gantungkan badan dengan lengan lurus memegang tepi.",
              "Tarik dada mendekati pegangan dengan memeras kedua tulang belikat ke belakang.",
              "Tahan 1 detik lalu turunkan kembali secara perlahan."
            ],
            kesalahanUmum: [
              "Hanya menarik dengan lengan tanpa mengaktifkan belikat punggung.",
              "Mengayunkan pinggul untuk membantu dorongan gerakan."
            ]
          },
          {
            nama: "Bicep Curls (Beban Botol / Dumbbell)",
            kategori: "upper",
            targetOtot: "Lengan Depan (Biceps Brachii)",
            ototSekunder: "Brachialis, Lengan Bawah",
            set: "3 Set",
            reps: "10-12 Repetisi",
            istirahat: "60 Detik",
            deskripsi: "Isolasi pembentuk massa puncak lengan depan yang kuat dan simetris.",
            langkah: [
              "Pegang botol terisi air/pasir atau dumbel di samping paha.",
              "Kunci posisi siku tetap di samping pinggang (jangan mengayun).",
              "Tekuk lengan ke arah dada dan peras bicep di puncak gerakan.",
              "Turunkan perlahan dalam 3 detik."
            ],
            kesalahanUmum: [
              "Mengayunkan pinggang ke depan untuk mengangkat beban berat."
            ]
          },
          {
            nama: "Reverse Fly / Band Pull-Apart",
            kategori: "upper",
            targetOtot: "Bahu Belakang (Rear Deltoids)",
            ototSekunder: "Rhomboids, Trapezius Tengah",
            set: "3 Set",
            reps: "12-15 Repetisi",
            istirahat: "45 Detik",
            deskripsi: "Krusial untuk mengimbangi otot dada agar bahu tidak membungkuk ke depan (rounded shoulders).",
            langkah: [
              "Condongkan badan ke depan dengan punggung lurus datar.",
              "Rentangkan kedua tangan ke samping seperti sayap mengepak.",
              "Peras belikat di puncak gerakan lalu turunkan kembali secara terkontrol."
            ],
            kesalahanUmum: [
              "Menggunakan momentum hentakan leher saat mengangkat lengan."
            ]
          }
        ]
      }
    ]
  }
};

// =========================================
// STATE MODUL WORKOUT & SLIDER
// =========================================

let stateSlider = {
  currentIndex: 0,
  totalSlides: 4,
  touchStartX: 0,
  touchEndX: 0,
  programAktif: null
};

let timerIstirahatInterval = null;
let timerDetikTersisa = 45;
let timerSedangBerjalan = false;
let presetDetikAktif = 45;

let callbackUpdateXP = null;

// =========================================
// SISTEM RESOLUSI FOTO & VIDEO ANIMASI ATLET
// =========================================

export function dapatkanTipeAnimasi(nama = "", kategori = "") {
  const n = (nama || "").toLowerCase();
  if (n.includes("push-up") || n.includes("push up") || n.includes("dips")) return "pushup";
  if (n.includes("squat") || n.includes("calf")) return "squat";
  if (n.includes("lunge")) return "lunge";
  if (n.includes("plank") || n.includes("dead bug") || n.includes("crunches") || n.includes("bird dog")) return "plank";
  if (n.includes("bridge") || n.includes("deadlift") || n.includes("rdl")) return "bridge";
  if (n.includes("curl") || n.includes("row") || n.includes("fly") || n.includes("pull")) return "curl";
  if (n.includes("stretch") || n.includes("pose") || n.includes("relaks") || n.includes("regenerasi") || n.includes("90/90")) return "recovery";
  if (n.includes("jogging") || n.includes("jalan") || n.includes("kardio") || n.includes("climber") || n.includes("lari") || n.includes("tali") || n.includes("sepeda")) return "cardio";
  if (kategori === "upper") return "pushup";
  if (kategori === "lower") return "squat";
  if (kategori === "recovery") return "recovery";
  return "cardio";
}

export function dapatkanFotoGerakan(nama = "", kategori = "") {
  const tipe = dapatkanTipeAnimasi(nama, kategori);
  if (tipe === "pushup" || tipe === "curl") return "assets/workout/upper.jpg";
  if (tipe === "squat" || tipe === "lunge" || tipe === "bridge") return "assets/workout/lower.jpg";
  if (tipe === "recovery") return "assets/workout/recovery.jpg";
  if (tipe === "cardio") return "assets/workout/cardio.jpg";
  return "assets/workout/fullbody.jpg";
}

export function buatSvgKarakterAtlet(tipeAnimasi) {
  if (tipeAnimasi === "pushup") {
    return `
      <svg class="video-svg-stage" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="30" y1="148" x2="290" y2="148" stroke="#373a44" stroke-width="4" stroke-linecap="round"/>
        <line x1="45" y1="148" x2="160" y2="148" stroke="#FF5A1F" stroke-width="4" stroke-linecap="round"/>
        <g class="anim-pushup-body anim-rig-element">
          <line x1="90" y1="95" x2="250" y2="145" stroke="#F2F1EC" stroke-width="14" stroke-linecap="round"/>
          <line x1="120" y1="104" x2="250" y2="145" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
          <circle cx="70" cy="88" r="12" fill="#ffe270" stroke="#111111" stroke-width="2.5"/>
          <circle cx="68" cy="85" r="2" fill="#111111"/>
          <circle class="anim-pushup-glow anim-rig-element" cx="102" cy="100" r="14" fill="#FF5A1F" opacity="0.3"/>
        </g>
        <g class="anim-pushup-arm anim-rig-element">
          <line x1="95" y1="100" x2="95" y2="148" stroke="#D9480F" stroke-width="7" stroke-linecap="round"/>
          <circle cx="95" cy="148" r="4.5" fill="#111111"/>
        </g>
        <circle cx="250" cy="145" r="5" fill="#FF8A4C" stroke="#111111" stroke-width="2"/>
      </svg>`;
  } else if (tipeAnimasi === "squat") {
    return `
      <svg class="video-svg-stage" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="40" y1="156" x2="280" y2="156" stroke="#373a44" stroke-width="4" stroke-linecap="round"/>
        <line x1="100" y1="156" x2="220" y2="156" stroke="#FF8A4C" stroke-width="4" stroke-linecap="round"/>
        <g class="anim-squat-torso anim-rig-element">
          <circle cx="160" cy="42" r="13" fill="#ffe270" stroke="#111111" stroke-width="2.5"/>
          <line x1="160" y1="55" x2="160" y2="105" stroke="#F2F1EC" stroke-width="16" stroke-linecap="round"/>
          <g class="anim-squat-arms anim-rig-element">
            <line x1="160" y1="70" x2="115" y2="68" stroke="#D9480F" stroke-width="6" stroke-linecap="round"/>
          </g>
          <circle class="anim-squat-glow anim-rig-element" cx="160" cy="115" r="16" fill="#FF5A1F" opacity="0.3"/>
        </g>
        <line x1="152" y1="105" x2="135" y2="156" stroke="#111111" stroke-width="8" stroke-linecap="round"/>
        <line x1="168" y1="105" x2="185" y2="156" stroke="#111111" stroke-width="8" stroke-linecap="round"/>
        <ellipse cx="130" cy="156" rx="8" ry="3" fill="#FF8A4C"/>
        <ellipse cx="190" cy="156" rx="8" ry="3" fill="#FF8A4C"/>
      </svg>`;
  } else if (tipeAnimasi === "plank") {
    return `
      <svg class="video-svg-stage" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="30" y1="148" x2="290" y2="148" stroke="#373a44" stroke-width="4" stroke-linecap="round"/>
        <line x1="50" y1="148" x2="270" y2="148" stroke="#FF5A1F" stroke-width="4" stroke-linecap="round"/>
        <g class="anim-plank-figure anim-rig-element">
          <line x1="90" y1="110" x2="255" y2="142" stroke="#F2F1EC" stroke-width="13" stroke-linecap="round"/>
          <line x1="110" y1="114" x2="255" y2="142" stroke="#111111" stroke-width="5" stroke-linecap="round"/>
          <circle cx="70" cy="104" r="11" fill="#ffe270" stroke="#111111" stroke-width="2.5"/>
          <line x1="85" y1="112" x2="85" y2="148" stroke="#D9480F" stroke-width="6" stroke-linecap="round"/>
          <line x1="85" y1="148" x2="110" y2="148" stroke="#D9480F" stroke-width="6" stroke-linecap="round"/>
          <ellipse class="anim-plank-core-aura anim-rig-element" cx="165" cy="122" rx="26" ry="14" fill="#FF5A1F" fill-opacity="0.25" stroke="#FF5A1F" stroke-width="2" stroke-dasharray="4 3"/>
        </g>
        <circle cx="255" cy="142" r="5" fill="#FF8A4C" stroke="#111111" stroke-width="2"/>
      </svg>`;
  } else if (tipeAnimasi === "cardio") {
    return `
      <svg class="video-svg-stage" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="20" y1="156" x2="300" y2="156" stroke="#373a44" stroke-width="4" stroke-linecap="round"/>
        <line class="anim-speed-line-1 anim-rig-element" x1="60" y1="85" x2="110" y2="85" stroke="#FF5A1F" stroke-width="3" stroke-linecap="round"/>
        <line class="anim-speed-line-2 anim-rig-element" x1="40" y1="115" x2="95" y2="115" stroke="#ffe270" stroke-width="2.5" stroke-linecap="round"/>
        <g class="anim-runner-body anim-rig-element">
          <circle cx="170" cy="45" r="12" fill="#ffe270" stroke="#111111" stroke-width="2.5"/>
          <line x1="170" y1="57" x2="158" y2="102" stroke="#F2F1EC" stroke-width="14" stroke-linecap="round"/>
        </g>
        <line class="anim-runner-arm-back anim-rig-element" x1="165" y1="68" x2="135" y2="88" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
        <line class="anim-runner-arm-front anim-rig-element" x1="165" y1="68" x2="195" y2="78" stroke="#D9480F" stroke-width="6" stroke-linecap="round"/>
        <line class="anim-runner-leg-back anim-rig-element" x1="158" y1="102" x2="130" y2="148" stroke="#111111" stroke-width="7" stroke-linecap="round"/>
        <line class="anim-runner-leg-front anim-rig-element" x1="158" y1="102" x2="190" y2="148" stroke="#FF5A1F" stroke-width="7" stroke-linecap="round"/>
      </svg>`;
  } else if (tipeAnimasi === "lunge") {
    return `
      <svg class="video-svg-stage" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="30" y1="156" x2="290" y2="156" stroke="#373a44" stroke-width="4" stroke-linecap="round"/>
        <g class="anim-lunge-torso anim-rig-element">
          <circle cx="160" cy="45" r="12" fill="#ffe270" stroke="#111111" stroke-width="2.5"/>
          <line x1="160" y1="57" x2="160" y2="105" stroke="#F2F1EC" stroke-width="14" stroke-linecap="round"/>
          <line x1="160" y1="72" x2="145" y2="95" stroke="#D9480F" stroke-width="5" stroke-linecap="round"/>
          <line x1="160" y1="72" x2="175" y2="95" stroke="#D9480F" stroke-width="5" stroke-linecap="round"/>
        </g>
        <path d="M160 105 L125 125 L125 156" stroke="#FF5A1F" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M160 105 L200 135 L225 154" stroke="#D9480F" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  } else if (tipeAnimasi === "curl") {
    return `
      <svg class="video-svg-stage" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="40" y1="156" x2="280" y2="156" stroke="#373a44" stroke-width="4" stroke-linecap="round"/>
        <circle cx="160" cy="42" r="12" fill="#ffe270" stroke="#111111" stroke-width="2.5"/>
        <line x1="160" y1="54" x2="160" y2="110" stroke="#F2F1EC" stroke-width="15" stroke-linecap="round"/>
        <line x1="153" y1="110" x2="145" y2="156" stroke="#111111" stroke-width="7" stroke-linecap="round"/>
        <line x1="167" y1="110" x2="175" y2="156" stroke="#111111" stroke-width="7" stroke-linecap="round"/>
        <circle class="anim-curl-bicep-glow anim-rig-element" cx="140" cy="78" r="14" fill="#FF5A1F" opacity="0.3"/>
        <line x1="155" y1="65" x2="145" y2="95" stroke="#D9480F" stroke-width="7" stroke-linecap="round"/>
        <g class="anim-curl-forearm anim-rig-element">
          <line x1="145" y1="95" x2="145" y2="130" stroke="#FF5A1F" stroke-width="7" stroke-linecap="round"/>
          <rect x="135" y="125" width="20" height="8" rx="2" fill="#111111"/>
          <circle cx="135" cy="129" r="6" fill="#ffe270"/>
          <circle cx="155" cy="129" r="6" fill="#ffe270"/>
        </g>
      </svg>`;
  } else if (tipeAnimasi === "recovery") {
    return `
      <svg class="video-svg-stage" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="40" y1="150" x2="280" y2="150" stroke="#373a44" stroke-width="4" stroke-linecap="round"/>
        <circle class="anim-recovery-aura anim-rig-element" cx="160" cy="100" r="45" fill="#D9480F" fill-opacity="0.2" stroke="#D9480F" stroke-width="2" stroke-dasharray="4 3"/>
        <g class="anim-recovery-torso anim-rig-element">
          <circle cx="160" cy="62" r="12" fill="#ffe270" stroke="#111111" stroke-width="2.5"/>
          <path d="M160 74 C160 95 150 115 140 135" stroke="#F2F1EC" stroke-width="12" stroke-linecap="round"/>
          <line x1="160" y1="80" x2="195" y2="60" stroke="#FF5A1F" stroke-width="5" stroke-linecap="round"/>
        </g>
        <path d="M140 135 L170 148 L125 148" stroke="#111111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  } else {
    // default: glute bridge
    return `
      <svg class="video-svg-stage" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="30" y1="152" x2="290" y2="152" stroke="#373a44" stroke-width="4" stroke-linecap="round"/>
        <circle cx="245" cy="144" r="11" fill="#ffe270" stroke="#111111" stroke-width="2.5"/>
        <line x1="230" y1="146" x2="255" y2="146" stroke="#D9480F" stroke-width="6" stroke-linecap="round"/>
        <line x1="100" y1="145" x2="115" y2="145" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
        <g class="anim-bridge-hips anim-rig-element">
          <line x1="230" y1="146" x2="175" y2="125" stroke="#F2F1EC" stroke-width="13" stroke-linecap="round"/>
          <line x1="175" y1="125" x2="110" y2="145" stroke="#FF5A1F" stroke-width="9" stroke-linecap="round"/>
          <circle cx="175" cy="125" r="14" fill="#D9480F" opacity="0.4"/>
        </g>
      </svg>`;
  }
}

export function buatKomponenVideoAnimasi(gerakan, { otomatis = true } = {}) {
  const tipeAnimasi = dapatkanTipeAnimasi(gerakan.nama, gerakan.kategori);
  const panduan = dapatkanPanduanSimulasi(tipeAnimasi);
  const kurangiGerak = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const player = el("div", { class: "video-simulasi", attrs: { role: "region", "aria-label": `Video simulasi ${gerakan.nama}` } });

  // Layar video. Tim bisa mengisi gerakan.video dengan rekaman asli; kalau kosong pakai simulasi pola gerakan.
  const video = el("video", {
    class: "video-simulasi-video",
    attrs: {
      src: gerakan.video || panduan.video,
      poster: panduan.poster,
      loop: true,
      muted: true,
      playsinline: true,
      preload: otomatis ? "metadata" : "none",
      "aria-label": `Video simulasi pola gerakan ${panduan.judul}`
    }
  });
  video.muted = true;
  const layar = el("div", { class: "video-simulasi-layar" },
    video,
    el("span", { class: "video-simulasi-label", text: gerakan.video ? "VIDEO GERAKAN" : "VIDEO SIMULASI" })
  );

  // Kontrol: putar/jeda, kecepatan, dan fase yang sedang tampil
  const btnPutar = el("button", { type: "button", class: "btn-putar-simulasi", text: "▶ Putar" });
  const grupKecepatan = el("div", { class: "kecepatan-simulasi", attrs: { role: "group", "aria-label": "Kecepatan video" } });
  [["0.5", "0.5×"], ["1", "1×"]].forEach(([nilai, teks]) => {
    const btn = el("button", { type: "button", class: "btn-kecepatan-simulasi", text: teks, attrs: { "aria-pressed": nilai === "1" ? "true" : "false" } });
    btn.addEventListener("click", () => {
      video.playbackRate = Number(nilai);
      grupKecepatan.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
    });
    grupKecepatan.appendChild(btn);
  });
  const daftarFase = el("ol", { class: "fase-simulasi", attrs: { "aria-label": "Tahapan gerakan" } });
  const chipFase = panduan.fase.map(f => {
    const li = el("li", { text: f.label });
    daftarFase.appendChild(li);
    return li;
  });

  const perbaruiTombol = () => {
    btnPutar.textContent = video.paused ? "▶ Putar" : "⏸ Jeda";
  };
  btnPutar.addEventListener("click", () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
  video.addEventListener("play", () => {
    // cukup satu video yang jalan supaya ringan
    document.querySelectorAll(".video-simulasi-video").forEach(v => { if (v !== video) v.pause(); });
    perbaruiTombol();
  });
  video.addEventListener("pause", perbaruiTombol);
  video.addEventListener("timeupdate", () => {
    const detik = video.currentTime % 4;
    panduan.fase.forEach((f, i) => chipFase[i].classList.toggle("aktif", detik >= f.mulai && detik < f.akhir));
  });

  // Cadangan: kalau file video tidak bisa dimuat, tampilkan animasi SVG lama
  video.addEventListener("error", () => {
    const cadangan = el("div", { class: "video-animasi-player video-simulasi-cadangan", attrs: { "data-sedang-putar": "true" } });
    const panggung = el("div", { class: "video-stage-frame" });
    panggung.innerHTML = buatSvgKarakterAtlet(tipeAnimasi);
    cadangan.appendChild(panggung);
    layar.replaceChildren(cadangan, el("span", { class: "video-simulasi-label", text: "ANIMASI SIMULASI" }));
    btnPutar.hidden = true;
    grupKecepatan.hidden = true;
  });

  const kontrol = el("div", { class: "video-simulasi-kontrol" }, btnPutar, grupKecepatan, daftarFase);

  // Panduan teks: alternatif yang bisa dibaca pembaca layar & tombol baca nyaring
  const daftar = (tag, isi) => {
    const wadah = el(tag);
    isi.forEach(t => wadah.appendChild(el("li", { text: t })));
    return wadah;
  };
  const panduanTeks = el("div", { class: "video-simulasi-panduan" },
    el("div", {}, el("h6", { text: "Cara melakukan" }), daftar("ol", panduan.langkah)),
    el("div", {}, el("h6", { text: "Hindari" }), daftar("ul", panduan.hindari)),
    el("div", { class: "versi-ringan-simulasi" }, el("h6", { text: "Versi lebih ringan" }), el("p", { text: panduan.versiRingan }))
  );

  const catatan = el("p", {
    class: "video-simulasi-catatan",
    text: gerakan.video
      ? "Berhenti kalau terasa nyeri, lalu laporkan lewat tombol \"Ada keluhan\"."
      : `Simulasi pola gerakan ${panduan.judul.toLowerCase()} (animasi ilustrasi GERAK, bukan rekaman pelatih). Berhenti kalau terasa nyeri.`
  });

  player.appendChild(layar);
  player.appendChild(kontrol);
  player.appendChild(panduanTeks);
  player.appendChild(catatan);

  // Komponen dibuat saat pengguna membuka video, jadi langsung diputar (kecuali pengguna minta kurangi animasi)
  if (otomatis && !kurangiGerak) {
    requestAnimationFrame(() => {
      if (player.isConnected) video.play().catch(() => {});
    });
  }

  return player;
}

// =========================================
// 30 TIPS PEMULIHAN & ENERGI EDUKATIF
// =========================================

export const DAFTAR_TIPS_PEMULIHAN = [
  {
    id: 1,
    kategori: "💧 Hidrasi & Elektrolit",
    judul: "Hidrasi Optimal Pasca Latihan",
    isi: "Minum 500–750 ml air kelapa murni atau air putih dengan sedikit garam mineral setelah berolahraga untuk mengganti elektrolit natrium dan kalium yang hilang melalui keringat."
  },
  {
    id: 2,
    kategori: "🥩 Nutrisi & Makro",
    judul: "Jendela Anabolik & Asupan Protein",
    isi: "Konsumsi 20–30 gram protein berkualitas tinggi (seperti telur, dada ayam, tempe, tahu, atau ikan) dalam 1–2 jam pasca latihan untuk memaksimalkan sintesis protein dan perbaikan serat otot."
  },
  {
    id: 3,
    kategori: "😴 Kualitas Tidur",
    judul: "Pentingnya Deep Sleep (Tidur Pulas)",
    isi: "Sekitar 95% Human Growth Hormone (HGH) dilepaskan saat fase tidur pulas (deep slow-wave sleep). Targetkan 7–9 jam tidur malam tanpa gangguan layar gadget 30 menit sebelum tidur."
  },
  {
    id: 4,
    kategori: "🧘 Mobilitas & Peregangan",
    judul: "Peregangan Statis Pasca Latihan",
    isi: "Lakukan peregangan statis selama 15–30 detik per kelompok otot utama saat tubuh masih hangat untuk mempertahankan fleksibilitas jaringan ikat dan meredakan ketegangan sendi."
  },
  {
    id: 5,
    kategori: "❄️ Pendinginan Aktif",
    judul: "Pendinginan Bertahap (Cool-Down)",
    isi: "Luangkan 5–10 menit berjalan santai dan latihan napas dalam setelah sesi berat. Ini membantu menurunkan detak jantung secara bertahap dan mempercepat pembersihan metabolit asam laktat."
  },
  {
    id: 6,
    kategori: "🍠 Pengisian Glikogen",
    judul: "Karbohidrat Kompleks untuk Isi Ulang Energi",
    isi: "Setelah latihan intensitas tinggi, kombinasikan protein dengan karbohidrat kompleks seperti ubi jalar, nasi merah, atau pisang untuk mengisi kembali cadangan glikogen otot yang terkuras."
  },
  {
    id: 7,
    kategori: "🛑 Hari Istirahat (Rest Day)",
    judul: "Rest Day Adalah Waktu Otot Tumbuh",
    isi: "Otot tidak berkembang saat kamu mengangkat beban di sesi latihan, melainkan saat beristirahat. Pastikan ada jeda minimal 48 jam sebelum melatih kelompok otot yang sama dengan beban berat."
  },
  {
    id: 8,
    kategori: "🧠 Manajemen Stres",
    judul: "Kendalikan Hormon Stres (Kortisol)",
    isi: "Stres pikiran kronis memicu hormon kortisol tinggi yang memecah jaringan otot dan memperlambat pemulihan. Luangkan 5 menit untuk teknik pernapasan diafragma (box breathing) setiap sore."
  },
  {
    id: 9,
    kategori: "🚿 Terapi Suhu Air",
    judul: "Kombinasi Mandi Air Hangat & Dingin",
    isi: "Mandi air hangat membantu merilekskan otot kaku, sementara basuhan air dingin dapat meredakan inflamasi mikro. Mandi kontras terbukti melancarkan sirkulasi pembuluh darah perifer."
  },
  {
    id: 10,
    kategori: "🚶 Pemulihan Aktif",
    judul: "Active Recovery di Akhir Pekan",
    isi: "Pada hari istirahat, hindari rebahan total seharian penuh. Jalan kaki santai 30 menit di taman atau bersepeda santai memicu sirkulasi darah segar pembawa nutrisi ke seluruh otot tanpa rasa lelah."
  },
  {
    id: 11,
    kategori: "🎾 Pelepasan Myofascial",
    judul: "Foam Rolling & Rilis Simpul Otot",
    isi: "Gunakan foam roller atau bola tenis pada paha depan, bokong, dan punggung atas selama 1–2 menit per area untuk merilis adhesi jaringan ikat fascia dan mencegah cedera kronis."
  },
  {
    id: 12,
    kategori: "🥑 Mineral Esensial",
    judul: "Asupan Magnesium untuk Relaksasi Otot",
    isi: "Magnesium membantu transmisi saraf dan mencegah kram otot di malam hari. Konsumsi bayam, biji labu, pisang, alpukat, atau kacang almond sebagai camilan sehat harianmu."
  },
  {
    id: 13,
    kategori: "🐟 Lemak Sehat & Anti-Inflamasi",
    judul: "Manfaat Asam Lemak Omega-3 Alami",
    isi: "Ikan kembung lokal, sarden, salmon, atau biji chia kaya akan omega-3 yang terbukti efektif menekan sitokin inflamasi dan mengurangi rasa nyeri otot (DOMS) yang mengganggu."
  },
  {
    id: 14,
    kategori: "⏰ Ritme Sirkadian",
    judul: "Jadwal Jam Tidur yang Konsisten",
    isi: "Tidur dan bangun pada jam yang sama setiap hari—bahkan saat akhir pekan—menjaga jam biologis tubuh tetap sinkron, membuat kualitas tidur lebih padat dan energi pagi lebih melimpah."
  },
  {
    id: 15,
    kategori: "💧 Cek Status Tubuh",
    judul: "Deteksi Hidrasi dari Warna Urin",
    isi: "Warna urin kuning pucat seperti jerami menandakan hidrasi optimal. Jika berwarna kuning tua atau kecokelatan, segera penuhi kebutuhan air putih setidaknya 2 gelas besar."
  },
  {
    id: 16,
    kategori: "☕ Pengaturan Kafein",
    judul: "Cut-Off Kafein 6 Jam Sebelum Tidur",
    isi: "Waktu paruh kafein dalam tubuh berkisar antara 5–7 jam. Hindari kopi, teh pekat, atau pre-workout setelah jam 2 siang agar adenosin alami dapat menginduksi rasa kantuk yang dalam."
  },
  {
    id: 17,
    kategori: "🥛 Nutrisi Malam",
    judul: "Protein Lambat Cerna Sebelum Tidur",
    isi: "Bagi yang ingin mencegah pemecahan otot malam hari, segelas susu kedelai atau greek yogurt sebelum tidur menyediakan asam amino kasein yang diserap secara perlahan sepanjang malam."
  },
  {
    id: 18,
    kategori: "💓 Sinyal Tubuh",
    judul: "Waspada Gejala Overreaching (Kelelahan Sistem)",
    isi: "Jika detak jantung istirahat (resting heart rate) pagi naik lebih dari 7 bpm disertai rasa malas ekstrem, kurangi intensitas latihan hari itu menjadi sesi ringan atau jalan santai."
  },
  {
    id: 19,
    kategori: "🔥 Pemanasan Sendi",
    judul: "Pemanasan Dinamis Melumasi Sendi",
    isi: "Sebelum mengangkat beban atau lari, lakukan gerakan dinamis seperti leg swing dan arm rotation selama 5 menit untuk merangsang produksi cairan sinovial pelumas tulang rawan sendi."
  },
  {
    id: 20,
    kategori: "🚫 Pembatasan Alkohol",
    judul: "Hindari Alkohol Pasca Sesi Latihan",
    isi: "Alkohol menghambat sintesis protein otot hingga sepertiga dan merusak fase tidur REM. Hindari konsumsi alkohol terutama setelah latihan berat agar adaptasi otot tidak terbuang sia-sia."
  },
  {
    id: 21,
    kategori: "🪑 Postur Sehari-hari",
    judul: "Cegah Kekakuan Akibat Duduk Terlalu Lama",
    isi: "Setelah sesi latihan berat, hindari duduk terpaku di kursi selama berjam-jam. Bangkitlah setiap 45 menit untuk berjalan kaki sejenak agar fleksor pinggul tidak memendek dan kaku."
  },
  {
    id: 22,
    kategori: "☀️ Vitamin Sinar Matahari",
    judul: "Sinar Matahari Pagi untuk Vitamin D",
    isi: "Luangkan 10–15 menit berjemur di bawah sinar matahari pagi sebelum jam 9. Vitamin D esensial bagi kekuatan kepadatan tulang, fungsi imunitas, dan penyerapan kalsium dalam tubuh."
  },
  {
    id: 23,
    kategori: "📉 Siklus Latihan (Periodisasi)",
    judul: "Pentingnya Deload Week Berkala",
    isi: "Setiap 4–8 minggu latihan intensif, jadwalkan 1 minggu deload (kurangi beban 40–50%). Ini memberi kesempatan bagi ligamen dan tendon untuk pulih tanpa kehilangan massa otot."
  },
  {
    id: 24,
    kategori: "🧂 Keseimbangan Elektrolit",
    judul: "Kebutuhan Natrium yang Cukup",
    isi: "Jangan takut garam jika kamu rutin berkeringat banyak. Natrium bersama kalium menjaga volume plasma darah dan fungsi konduksi impuls saraf otot agar tidak mudah pusing atau lemas."
  },
  {
    id: 25,
    kategori: "🤸 Fleksibilitas & Mobilitas",
    judul: "Latihan Deep Squat Hold 5 Menit",
    isi: "Lakukan posisi jongkok dalam (deep squat hold) tanpa beban selama 2–3 menit per hari untuk menjaga mobilitas pergelangan kaki (ankle dorsiflexion) dan mencegah nyeri punggung bawah."
  },
  {
    id: 26,
    kategori: "✨ Mindset Berkelanjutan",
    judul: "Konsistensi Jangka Panjang Mengalahkan Intensitas",
    isi: "Lebih baik berolahraga 30 menit 3 kali seminggu secara konsisten sepanjang tahun daripada berolahraga 2 jam setiap hari lalu berhenti total karena cedera atau kehabisan motivasi."
  },
  {
    id: 27,
    kategori: "🫐 Antioksidan Alami",
    judul: "Buah Berwarna Pekat Mempercepat Pemulihan",
    isi: "Buah naga merah, semangka, dan buah beri mengandung antosianin dan sitrulin yang mempercepat pemulihan mikro vaskular dan mengurangi inflamasi setelah latihan keras."
  },
  {
    id: 28,
    kategori: "🌬️ Relaksasi Saraf",
    judul: "Pernapasan Diafragma Menurunkan Detak Jantung",
    isi: "Tarik napas perlahan lewat hidung selama 4 detik, tahan 2 detik, hembuskan lewat mulut selama 6 detik. Hembusan napas yang panjang mengaktifkan saraf parasimpatis pemulih energi tubuh."
  },
  {
    id: 29,
    kategori: "🛡️ Mikronutrien Pertahanan",
    judul: "Zinc & Zat Besi untuk Daya Tahan Tubuh",
    isi: "Zat besi mengangkut oksigen ke seluruh sel tubuh, sementara seng (zinc) memperbaiki jaringan yang rusak. Dapatkan dari daging tanpa lemak, kacang lentil, tempe, dan bayam hijau."
  },
  {
    id: 30,
    kategori: "📖 Pemantauan Diri",
    judul: "Gunakan Jurnal GERAK untuk Evaluasi Pemulihan",
    isi: "Catat kualitas tidur, beban latihan, dan tingkat pegalmu di tab Jurnal. Memantau tren pemulihan pribadi membantumu mengenali kapan harus meningkatkan beban dan kapan harus istirahat."
  }
];

let indexTipSaatIni = 0;

export function inisialisasiTipsPemulihan() {
  const btnPrev = document.getElementById("btnTipsPrev");
  const btnNext = document.getElementById("btnTipsNext");
  const boxTips = document.getElementById("boxTipsWorkout");

  // Pasang pada window sebagai fallback akses inline onclick
  window.geserTipsPemulihan = (arah) => {
    geserTip(arah);
  };

  if (btnPrev) {
    btnPrev.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      geserTip(-1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      geserTip(1);
    });
  }

  if (boxTips) {
    // 1. Navigasi Keyboard (Panah Kiri & Kanan)
    boxTips.setAttribute("tabindex", "0");
    boxTips.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        geserTip(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        geserTip(1);
      }
    });

    // 2. Gesture Swipe Sentuhan Layar (Touch Event)
    let touchStartX = 0;
    boxTips.addEventListener("touchstart", e => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    boxTips.addEventListener("touchend", e => {
      if (e.changedTouches && e.changedTouches[0]) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            geserTip(1); // Geser ke kiri -> tips berikutnya
          } else {
            geserTip(-1); // Geser ke kanan -> tips sebelumnya
          }
        }
      }
    }, { passive: true });

    // 3. Gesture Drag Mouse (Klik & Geser pada Kartu)
    let mouseStartX = 0;
    let isMouseDown = false;
    boxTips.addEventListener("mousedown", e => {
      if (e.target.closest(".tombol-panah-tips")) return;
      isMouseDown = true;
      mouseStartX = e.clientX;
      boxTips.classList.add("sedang-geser");
    });

    window.addEventListener("mouseup", e => {
      if (!isMouseDown) return;
      isMouseDown = false;
      boxTips.classList.remove("sedang-geser");
      const diff = e.clientX - mouseStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          geserTip(1);
        } else {
          geserTip(-1);
        }
      }
    });
  }

  tampilTip(0);
}

export function geserTip(arah) {
  const total = DAFTAR_TIPS_PEMULIHAN.length;
  indexTipSaatIni = ((indexTipSaatIni + arah) % total + total) % total;
  tampilTip(indexTipSaatIni);
}

export function tampilTip(index) {
  const tip = DAFTAR_TIPS_PEMULIHAN[index];
  if (!tip) return;

  const tipsKategori = document.getElementById("tipsKategori");
  const tipsJudul = document.getElementById("tipsJudul");
  const workoutTips = document.getElementById("workoutTips");
  const tipsCounter = document.getElementById("tipsCounter");
  const tipsKontenArea = document.getElementById("tipsKontenArea");

  // Perbarui teks seketika (responsif 0ms)
  if (tipsKategori) tipsKategori.textContent = tip.kategori;
  if (tipsJudul) tipsJudul.textContent = tip.judul;
  if (workoutTips) workoutTips.textContent = tip.isi;
  if (tipsCounter) tipsCounter.textContent = `${index + 1} / ${DAFTAR_TIPS_PEMULIHAN.length}`;

  // Animasi halus transisi konten
  if (tipsKontenArea) {
    tipsKontenArea.classList.remove("animasi-ganti");
    void tipsKontenArea.offsetWidth;
    tipsKontenArea.classList.add("animasi-ganti");
  }
}

// =========================================
// INISIALISASI MODUL WORKOUT
// =========================================

export function inisialisasiWorkout(appState, onSelesaiSesiCallback = null) {
  callbackUpdateXP = onSelesaiSesiCallback;

  // Intersepsi klik pada navbar Work Out jika masih terkunci
  const navWorkout = document.getElementById("navWorkout");
  if (navWorkout) {
    navWorkout.addEventListener("click", e => {
      if (!appState.data.profilGizi) {
        e.preventDefault();
        tampilToast("🔒 Atur kebutuhan gizi kamu dulu ya sebelum membuka menu Work Out!");
        const seksiGizi = document.getElementById("gizi");
        if (seksiGizi) {
          seksiGizi.scrollIntoView({ behavior: "smooth" });
          const umurInput = document.getElementById("umur");
          if (umurInput) umurInput.focus();
        }
      }
    });
  }

  // Tombol Atur Gizi dari kotak terkunci
  const tombolAturGizi = document.getElementById("tombolAturGiziDariWorkout");
  if (tombolAturGizi) {
    tombolAturGizi.addEventListener("click", () => {
      const seksiGizi = document.getElementById("gizi");
      if (seksiGizi) {
        seksiGizi.scrollIntoView({ behavior: "smooth" });
        const umurInput = document.getElementById("umur");
        if (umurInput) umurInput.focus();
      }
    });
  }

  // Tombol Ubah/Sesuaikan Gizi dari header workout terbuka
  const tombolUbahGizi = document.getElementById("tombolUbahGizi");
  if (tombolUbahGizi) {
    tombolUbahGizi.addEventListener("click", () => {
      const seksiGizi = document.getElementById("gizi");
      if (seksiGizi) {
        seksiGizi.scrollIntoView({ behavior: "smooth" });
        const umurInput = document.getElementById("umur");
        if (umurInput) umurInput.focus();
      }
    });
  }

  // Tombol Mulai Work Out dari hasil gizi
  const tombolMulaiWorkoutDariGizi = document.getElementById("tombolMulaiWorkoutDariGizi");
  if (tombolMulaiWorkoutDariGizi) {
    tombolMulaiWorkoutDariGizi.addEventListener("click", () => {
      const seksiWorkout = document.getElementById("workout");
      if (seksiWorkout) {
        seksiWorkout.scrollIntoView({ behavior: "smooth" });
        const btnMulai = document.getElementById("btnMulaiLatihanHariIni");
        if (btnMulai) {
          setTimeout(() => btnMulai.focus(), 500);
        }
      }
    });
  }

  // Kontrol Slider Navigasi (Panah Kiri & Kanan)
  const btnPrev = document.getElementById("btnSliderPrev");
  const btnNext = document.getElementById("btnSliderNext");
  if (btnPrev) {
    btnPrev.addEventListener("click", () => geserSlider(-1));
  }
  if (btnNext) {
    btnNext.addEventListener("click", () => geserSlider(1));
  }

  // Touch & Keyboard Events pada Slider
  const viewportSlider = document.getElementById("sliderWorkoutViewport");
  if (viewportSlider) {
    viewportSlider.addEventListener("touchstart", e => {
      stateSlider.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewportSlider.addEventListener("touchend", e => {
      stateSlider.touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    }, { passive: true });

    viewportSlider.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") {
        geserSlider(-1);
      } else if (e.key === "ArrowRight") {
        geserSlider(1);
      }
    });
  }

  // Tombol Aksi Utama A: "Mulai Latihan"
  const btnMulaiLatihan = document.getElementById("btnMulaiLatihanHariIni");
  if (btnMulaiLatihan) {
    btnMulaiLatihan.addEventListener("click", () => {
      if (!stateSlider.programAktif) return;
      const jadwalAktif = stateSlider.programAktif.jadwal[stateSlider.currentIndex] || stateSlider.programAktif.jadwal[0];
      bukaDialogSesiLatihan(jadwalAktif, appState);
    });
  }

  // Tombol Aksi Utama B: "Lihat Semua Latihan"
  const btnLihatSemua = document.getElementById("btnLihatSemuaLatihan");
  if (btnLihatSemua) {
    btnLihatSemua.addEventListener("click", () => {
      if (!stateSlider.programAktif) return;
      bukaDialogKatalogSemuaLatihan(stateSlider.programAktif);
    });
  }

  // Inisialisasi Timer Istirahat pada Modal Sesi
  inisialisasiRestTimer();

  // Inisialisasi Filter Kategori pada Modal Katalog
  inisialisasiFilterKatalog();

  // Inisialisasi 30 Tips Pemulihan & Energi Interaktif
  inisialisasiTipsPemulihan();

  // Inisialisasi Mode Full Screen Workout (Fullscreen API & kontrol tombol X / Esc)
  inisialisasiFullscreenWorkout();

  // Render awal sesuai state
  renderWorkout(appState);
}

// =========================================
// RENDER ANTARMUKA WORK OUT (TERKUNCI VS TERBUKA)
// =========================================

export function renderWorkout(appState) {
  const wadahTerkunci = document.getElementById("wadahWorkoutTerkunci");
  const wadahTerbuka = document.getElementById("wadahWorkoutTerbuka");
  const navWorkout = document.getElementById("navWorkout");
  const ikonKunciNav = document.getElementById("ikonKunciNav");
  const tombolMulaiWorkoutDariGizi = document.getElementById("tombolMulaiWorkoutDariGizi");

  if (!wadahTerkunci || !wadahTerbuka) return;

  const profilGizi = appState.data.profilGizi;

  if (!profilGizi) {
    // KONDISI TERKUNCI
    wadahTerkunci.style.display = "flex";
    wadahTerbuka.style.display = "none";

    if (ikonKunciNav) ikonKunciNav.style.display = "inline";
    if (navWorkout) {
      navWorkout.classList.add("nav-terkunci");
      navWorkout.setAttribute("aria-label", "Work Out (Terkunci, atur gizi terlebih dahulu)");
    }
    if (tombolMulaiWorkoutDariGizi) {
      tombolMulaiWorkoutDariGizi.style.display = "none";
    }
  } else {
    // KONDISI TERBUKA
    wadahTerkunci.style.display = "none";
    wadahTerbuka.style.display = "block";

    if (ikonKunciNav) ikonKunciNav.style.display = "none";
    if (navWorkout) {
      navWorkout.classList.remove("nav-terkunci");
      navWorkout.setAttribute("aria-label", "Work Out");
    }
    if (tombolMulaiWorkoutDariGizi) {
      tombolMulaiWorkoutDariGizi.style.display = "block";
    }

    // Ambil program rekomendasi sesuai target gizi
    const targetKunci = (profilGizi.target || "jaga").toLowerCase();
    const dataRekomendasi = REKOMENDASI_WORKOUT[targetKunci] || REKOMENDASI_WORKOUT.jaga;
    stateSlider.programAktif = dataRekomendasi;
    stateSlider.totalSlides = dataRekomendasi.jadwal.length;

    // Pastikan index slider valid
    if (stateSlider.currentIndex >= stateSlider.totalSlides) {
      stateSlider.currentIndex = 0;
    }

    // Isi konten header program
    const badgeTarget = document.getElementById("workoutBadgeTarget");
    const judulProgram = document.getElementById("workoutJudulProgram");
    const fokusProgram = document.getElementById("workoutFokusProgram");

    if (badgeTarget) {
      const kaloriStr = profilGizi.kalori ? profilGizi.kalori.toLocaleString("id-ID") : "-";
      badgeTarget.textContent = `${dataRekomendasi.badge} · ${kaloriStr} kkal/hari`;
    }
    if (judulProgram) judulProgram.textContent = dataRekomendasi.judul;
    if (fokusProgram) fokusProgram.textContent = dataRekomendasi.fokus;

    const chipHari = document.getElementById("workoutChipHari");
    const chipDurasi = document.getElementById("workoutChipDurasi");
    if (chipHari) chipHari.textContent = `${dataRekomendasi.jadwal.length} Sesi / Minggu`;
    if (chipDurasi && dataRekomendasi.jadwal[0]) chipDurasi.textContent = `~${dataRekomendasi.jadwal[0].durasi} / Sesi`;

    // Render slider kartu jadwal
    renderKartuSlider(dataRekomendasi, appState);
    updateSliderTampilan();
  }
}

// =========================================
// SISTEM SLIDER / CAROUSEL PROGRAM LATIHAN
// =========================================

function renderKartuSlider(dataProgram, appState) {
  const track = document.getElementById("sliderWorkoutTrack");
  const dotsContainer = document.getElementById("sliderDots");

  if (!track || !dotsContainer) return;

  track.textContent = "";
  dotsContainer.textContent = "";

  dataProgram.jadwal.forEach((item, index) => {
    // 1. Kartu Slide
    const kartu = el("article", {
      class: "kartu-slide-workout",
      attrs: {
        "data-index": String(index),
        role: "group",
        "aria-roledescription": "slide",
        "aria-label": `${item.hari}: ${item.nama}`
      }
    });

    // Top Bar Kartu (Tag Hari, Tag Jenis, Durasi)
    const topBar = el("div", { class: "kartu-slide-top" },
      el("div", { class: "baris-kiri-tag" },
        el("span", { class: "tag tag-hari", text: item.hari }),
        el("span", { class: "tag tag-jenis", text: item.jenis })
      ),
      el("span", { class: "durasi-pill", text: `⏱️ ${item.durasi}` })
    );

    // Banner Foto Workout Neo-brutalist (Proporsional & Anti-Crop Ekstrem)
    const fotoSrc = item.foto || dapatkanFotoGerakan(item.nama, item.jenis);
    const tipeAnim = dapatkanTipeAnimasi(item.nama, item.jenis);

    const imgSlide = el("img", {
      src: fotoSrc,
      alt: `Foto latihan ${item.nama}`,
      class: "foto-workout-slide",
      loading: "eager",
      decoding: "async"
    });

    // Fallback elegan jika gambar gagal dimuat
    imgSlide.addEventListener("error", () => {
      imgSlide.style.display = "none";
      if (!visual.querySelector(".fallback-svg-slide")) {
        const svgBox = el("div", {
          class: "fallback-svg-slide",
          style: "width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#2b2f3a;"
        });
        svgBox.innerHTML = buatSvgKarakterAtlet(tipeAnim);
        visual.insertBefore(svgBox, visual.firstChild);
      }
    });

    const visual = el("div", { class: "kartu-slide-foto-wrap" },
      imgSlide,
      el("div", { class: "overlay-foto-badge-group", attrs: { "aria-hidden": "true" } },
        el("span", { class: "overlay-pill-badge tag-hari-foto", text: `🗓️ ${item.hari}` }),
        el("span", { class: "overlay-pill-badge tag-jenis-foto", text: `⚡ ${item.jenis}` }),
        el("span", { class: "overlay-pill-badge tag-durasi-foto", text: `⏱️ ${item.durasi}` })
      )
    );

    // Chips Gerakan Kunci Modern (Bukan dashed box kosong)
    const chipsWadah = el("div", { class: "grid-gerakan-pills" });
    (item.ringkasanGerakan || []).forEach(namaGerakan => {
      let icon = "⚡";
      const nm = namaGerakan.toLowerCase();
      if (nm.includes("lari") || nm.includes("jogging") || nm.includes("jalan")) icon = "🏃";
      else if (nm.includes("sepeda")) icon = "🚲";
      else if (nm.includes("renang")) icon = "🏊";
      else if (nm.includes("badminton")) icon = "🏸";
      else if (nm.includes("push") || nm.includes("dada") || nm.includes("incline")) icon = "💪";
      else if (nm.includes("squat") || nm.includes("lunge") || nm.includes("jongkok")) icon = "🦵";
      else if (nm.includes("plank") || nm.includes("dead bug") || nm.includes("crunch") || nm.includes("climber")) icon = "🧘";
      else if (nm.includes("stretch") || nm.includes("pose") || nm.includes("cat") || nm.includes("cow") || nm.includes("peregangan")) icon = "🌱";
      else if (nm.includes("curl") || nm.includes("biceps") || nm.includes("angkat")) icon = "🏋️";

      const chip = el("span", { class: "pill-gerakan" },
        el("span", { class: "pill-icon", attrs: { "aria-hidden": "true" } }, icon),
        el("span", { class: "pill-text", text: namaGerakan })
      );
      chipsWadah.appendChild(chip);
    });

    // Body Kartu Rapi & Berimbang
    const bodyKartu = el("div", { class: "kartu-slide-body" },
      el("div", { class: "header-sesi-wrap" },
        topBar,
        el("h4", { class: "nama-latihan-slide", text: item.nama })
      ),
      el("div", { class: "box-gerakan-modern" },
        el("div", { class: "baris-label-gerakan" },
          el("span", { class: "label-gerakan-kunci", text: "Rangkaian Gerakan Sesi Ini" }),
          el("span", { class: "sub-gerakan-count", text: `${(item.ringkasanGerakan || []).length} Gerakan` })
        ),
        chipsWadah
      )
    );

    // Footer Kartu dengan Tombol Neo-Brutalist Jelas & Konsisten
    const btnMulaiSesiIni = el("button", {
      type: "button",
      class: "tombol tombol-utama btn-mulai-dari-kartu",
      text: "▶ Mulai Sesi Ini"
    });
    btnMulaiSesiIni.addEventListener("click", () => {
      bukaDialogSesiLatihan(item, appState);
    });

    const btnDetailSesiIni = el("button", {
      type: "button",
      class: "tombol tombol-garis btn-detail-dari-kartu",
      text: "📖 Pelajari Teknik & Video Latihan"
    });
    btnDetailSesiIni.addEventListener("click", () => {
      bukaDialogKatalogSemuaLatihan(dataProgram);
    });

    const footerKartu = el("div", { class: "kartu-slide-footer" },
      btnMulaiSesiIni,
      btnDetailSesiIni
    );

    // Layout Grid 2-Kolom Seimbang: Visual Kiri, Konten Kanan
    const gridSlide = el("div", { class: "kartu-slide-grid" },
      el("div", { class: "slide-col-visual" },
        visual
      ),
      el("div", { class: "slide-col-content" },
        bodyKartu,
        footerKartu
      )
    );

    kartu.appendChild(gridSlide);
    track.appendChild(kartu);

    // 2. Dots Indikator
    const dot = el("button", {
      type: "button",
      class: `slider-dot ${index === stateSlider.currentIndex ? "aktif" : ""}`,
      attrs: {
        role: "tab",
        "aria-label": `Lihat ${item.hari}`,
        "aria-selected": index === stateSlider.currentIndex ? "true" : "false"
      }
    });

    dot.addEventListener("click", () => {
      stateSlider.currentIndex = index;
      updateSliderTampilan();
    });

    dotsContainer.appendChild(dot);
  });
}

function geserSlider(arah) {
  const baru = stateSlider.currentIndex + arah;
  if (baru >= 0 && baru < stateSlider.totalSlides) {
    stateSlider.currentIndex = baru;
    updateSliderTampilan();
  }
}

function handleSwipeGesture() {
  const jarak = stateSlider.touchEndX - stateSlider.touchStartX;
  if (Math.abs(jarak) > 45) {
    if (jarak < 0) {
      // Geser kiri -> next
      geserSlider(1);
    } else {
      // Geser kanan -> prev
      geserSlider(-1);
    }
  }
}

function updateSliderTampilan() {
  const track = document.getElementById("sliderWorkoutTrack");
  const indikatorAngka = document.getElementById("indikatorSliderAngka");
  const btnPrev = document.getElementById("btnSliderPrev");
  const btnNext = document.getElementById("btnSliderNext");
  const dots = document.querySelectorAll(".slider-dot");

  const idx = stateSlider.currentIndex;
  const total = stateSlider.totalSlides;

  // Geser track dengan smooth CSS transform
  if (track) {
    track.style.transform = `translateX(-${idx * 100}%)`;

    // Pastikan gambar kartu aktif langsung termuat
    if (track.children[idx]) {
      const imgAktif = track.children[idx].querySelector(".foto-workout-slide");
      if (imgAktif && (!imgAktif.complete || imgAktif.naturalWidth === 0)) {
        imgAktif.loading = "eager";
        imgAktif.decoding = "async";
      }
    }
  }

  // Perbarui teks indikator angka
  if (indikatorAngka) {
    indikatorAngka.textContent = `${idx + 1} / ${total}`;
  }

  // Status tombol panah
  if (btnPrev) {
    btnPrev.disabled = idx === 0;
    btnPrev.setAttribute("aria-disabled", idx === 0 ? "true" : "false");
  }
  if (btnNext) {
    btnNext.disabled = idx === total - 1;
    btnNext.setAttribute("aria-disabled", idx === total - 1 ? "true" : "false");
  }

  // Status dots
  dots.forEach((dot, dotIdx) => {
    if (dotIdx === idx) {
      dot.classList.add("aktif");
      dot.setAttribute("aria-selected", "true");
    } else {
      dot.classList.remove("aktif");
      dot.setAttribute("aria-selected", "false");
    }
  });
}

// =========================================
// SISTEM WORKOUT FULL SCREEN MODE
// =========================================

// State pelacak sesi latihan agar status centang gerakan tidak hilang ketika pengguna keluar
const stateProgresSesi = {
  sesiId: null,
  gerakanSelesai: new Set()
};

/**
 * Membuka dialog ke tampilan Full Screen
 * Prioritas 1: Fullscreen API browser native
 * Prioritas 2 (fallback): Full-viewport overlay 100dvh & 100vw
 */
export function masukWorkoutFullscreen(dialog) {
  if (!dialog) return;

  dialog.classList.add("is-fullscreen");
  document.body.classList.add("workout-fullscreen-aktif");

  // Buka dialog native jika belum terbuka
  if (typeof dialog.showModal === "function") {
    try {
      if (!dialog.open) dialog.showModal();
    } catch (_) {
      dialog.setAttribute("open", "");
    }
  } else {
    dialog.setAttribute("open", "");
  }

  // Panggil Fullscreen API dari gestur tombol pengguna langsung
  const reqFS = dialog.requestFullscreen ||
                dialog.webkitRequestFullscreen ||
                dialog.mozRequestFullScreen ||
                dialog.msRequestFullscreen;

  if (typeof reqFS === "function") {
    try {
      const p = reqFS.call(dialog);
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Fallback overlay 100dvh sudah aktif melalui class .is-fullscreen
        });
      }
    } catch (_) {
      // Fallback overlay 100dvh sudah aktif
    }
  }
}

/**
 * Menutup mode Full Screen dan mengembalikan pengguna ke seksi #workout
 */
let sedangKeluarFullscreen = false;
export function keluarWorkoutFullscreen(dialog) {
  if (!dialog || sedangKeluarFullscreen) return;
  sedangKeluarFullscreen = true;

  try {
    // 1. Keluar dari Fullscreen API jika aktif di browser
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }

    dialog.querySelectorAll("video").forEach(v => v.pause());

    // 2. Hapus class fullscreen dan pulihkan tampilan navbar serta scroll
    dialog.classList.remove("is-fullscreen");
    document.body.classList.remove("workout-fullscreen-aktif");

    // 3. Tutup dialog
    if (dialog.open) {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    }

    // 4. Pastikan posisi halaman tetap di #workout, bukan dialihkan ke Beranda
    if (window.location.hash !== "#workout") {
      window.location.hash = "#workout";
    }
    const seksiWorkout = document.getElementById("workout");
    if (seksiWorkout) {
      seksiWorkout.style.display = "";
      seksiWorkout.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } finally {
    sedangKeluarFullscreen = false;
  }
}

/**
 * Inisialisasi pendengar event Full Screen (Esc / F11 / tombol browser)
 */
function inisialisasiFullscreenWorkout() {
  const handlerPerubahanFS = () => {
    const isFS = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    if (!isFS) {
      const dialogSesi = document.getElementById("dialogSesiLatihan");
      const dialogSemua = document.getElementById("dialogSemuaLatihan");
      [dialogSesi, dialogSemua].forEach(d => {
        if (d && d.classList.contains("is-fullscreen") && d.open) {
          keluarWorkoutFullscreen(d);
        }
      });
    }
  };

  document.addEventListener("fullscreenchange", handlerPerubahanFS);
  document.addEventListener("webkitfullscreenchange", handlerPerubahanFS);

  const dialogSesi = document.getElementById("dialogSesiLatihan");
  const dialogSemua = document.getElementById("dialogSemuaLatihan");
  [dialogSesi, dialogSemua].forEach(d => {
    if (!d) return;

    d.addEventListener("cancel", e => {
      e.preventDefault();
      keluarWorkoutFullscreen(d);
    });

    // Jalur tutup lain (mis. handler umum [data-tutup]) cuma memanggil close():
    // pastikan class fullscreen ikut dilepas & video dijeda, kalau tidak dialog tetap menutupi layar.
    d.addEventListener("close", e => {
      if (e.target === d && d.classList.contains("is-fullscreen")) keluarWorkoutFullscreen(d);
    });

    const tombolX = d.querySelector(".tutup-modal, [data-tutup]");
    if (tombolX) {
      tombolX.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        keluarWorkoutFullscreen(d);
      };
    }
  });
}

// =========================================
// FITUR A: MODAL SESI LATIHAN TERSTRUKTUR (FULL SCREEN WORKOUT)
// =========================================

function bukaDialogSesiLatihan(jadwalItem, appState) {
  const dialog = document.getElementById("dialogSesiLatihan");
  if (!dialog) return;

  const idSesiIni = jadwalItem.id || `${jadwalItem.hari}_${jadwalItem.nama}`;
  if (stateProgresSesi.sesiId !== idSesiIni) {
    stateProgresSesi.sesiId = idSesiIni;
    stateProgresSesi.gerakanSelesai.clear();
  }

  const badgeProgram = document.getElementById("sesiBadgeProgram");
  const badgeHari = document.getElementById("sesiBadgeHari");
  const judul = document.getElementById("judulDialogSesiLatihan");
  const deskripsi = document.getElementById("sesiDeskripsiSingkat");
  const wadahDaftar = document.getElementById("wadahDaftarGerakanSesi");
  const angkaProgress = document.getElementById("angkaProgressSesi");
  const barProgress = document.getElementById("progressBarSesi");
  const barProgressAria = document.getElementById("progressBarAria");

  if (badgeProgram) {
    if (stateSlider.programAktif) {
      badgeProgram.textContent = `${stateSlider.programAktif.badge} · ${stateSlider.programAktif.judul}`;
      badgeProgram.style.display = "inline-flex";
    } else {
      badgeProgram.style.display = "none";
    }
  }

  if (badgeHari) badgeHari.textContent = `${jadwalItem.hari} · ${jadwalItem.jenis} (⏱️ ${jadwalItem.durasi})`;
  if (judul) judul.textContent = jadwalItem.nama;
  if (deskripsi) deskripsi.textContent = `Target ${jadwalItem.gerakan ? jadwalItem.gerakan.length : 0} gerakan. Centang setiap gerakan setelah selesai dilakukan!`;

  if (wadahDaftar) {
    wadahDaftar.textContent = "";
    const gerakanList = jadwalItem.gerakan || [];
    let gerakanSelesaiCount = 0;

    const perbaruiProgres = () => {
      const total = gerakanList.length;
      const persen = total > 0 ? Math.round((gerakanSelesaiCount / total) * 100) : 0;
      if (angkaProgress) angkaProgress.textContent = `${gerakanSelesaiCount} / ${total} Gerakan Selesai (${persen}%)`;
      if (barProgress) barProgress.style.width = `${persen}%`;
      if (barProgressAria) {
        barProgressAria.setAttribute("aria-valuenow", persen);
        barProgressAria.setAttribute("aria-label", `${gerakanSelesaiCount} dari ${total} gerakan selesai`);
      }
    };

    gerakanList.forEach((g, gIdx) => {
      const itemRow = el("div", { class: "item-gerakan-sesi" });
      const fotoGerakan = g.foto || dapatkanFotoGerakan(g.nama, g.kategori);

      const thumbFoto = el("img", {
        src: fotoGerakan,
        alt: `Foto gerakan ${g.nama}`,
        class: "mini-thumb-gerakan",
        loading: "eager",
        decoding: "async"
      });
      thumbFoto.addEventListener("error", () => {
        thumbFoto.style.display = "none";
      });

      const btnToggleAnim = el("button", {
        type: "button",
        class: "btn-toggle-anim-inline",
        text: "🎬 Video Simulasi ▾",
        attrs: { "aria-expanded": "false" }
      });

      const inlineVideoWadah = el("div", { class: "inline-video-wadah", style: "display: none;" });
      let videoKomponenDibuat = false;

      const aturVideo = buka => {
        if (buka && !videoKomponenDibuat) {
          inlineVideoWadah.appendChild(buatKomponenVideoAnimasi(g));
          videoKomponenDibuat = true;
        }
        if (!buka) inlineVideoWadah.querySelectorAll("video").forEach(v => v.pause());
        inlineVideoWadah.style.display = buka ? "block" : "none";
        btnToggleAnim.textContent = buka ? "🎬 Tutup Video ▴" : "🎬 Video Simulasi ▾";
        btnToggleAnim.setAttribute("aria-expanded", buka ? "true" : "false");
      };

      btnToggleAnim.addEventListener("click", () => {
        aturVideo(inlineVideoWadah.style.display === "none");
      });

      // Peringatan kalau gerakan ini pernah dilaporkan dalam 30 hari terakhir
      const chipPeringatan = el("button", { type: "button", class: "chip-peringatan-keluhan" });
      const perbaruiPeringatan = () => {
        const keluhan = cariKeluhanGerakan(g.nama);
        chipPeringatan.hidden = !keluhan;
        if (keluhan) chipPeringatan.textContent = `⚠️ Pernah dilaporkan: ${teksKeluhanSingkat(keluhan)}. Lihat versi ringan`;
      };
      chipPeringatan.addEventListener("click", () => aturVideo(true));
      perbaruiPeringatan();

      // Tombol lapor: untuk pengguna yang nggak kuat atau sakit karena posisi tubuh
      const btnLapor = el("button", { type: "button", class: "btn-lapor-keluhan", text: "😣 Ada keluhan" });
      btnLapor.addEventListener("click", () => {
        bukaDialogLaporKeluhan({ gerakan: g.nama, tipeGerakan: dapatkanTipeAnimasi(g.nama, g.kategori) }, () => {
          perbaruiPeringatan();
          return () => aturVideo(true);
        });
      });

      const infoKiri = el("div", { class: "info-gerakan-sesi" },
        el("div", { class: "baris-nama-gerakan" },
          el("span", { class: "nomor-urutan", text: `${gIdx + 1}` }),
          el("h5", { text: g.nama })
        ),
        el("div", { class: "baris-parameter-gerakan" },
          el("span", { class: "chip-parameter", text: `📊 ${g.set} × ${g.reps}` }),
          el("span", { class: "chip-parameter", text: `⏳ Istirahat: ${g.istirahat}` })
        ),
        el("p", { class: "deskripsi-mini-gerakan", text: g.deskripsi }),
        chipPeringatan,
        el("div", { class: "baris-aksi-gerakan" }, btnToggleAnim, btnLapor),
        inlineVideoWadah
      );

      const kontenKiriWrap = el("div", { class: "item-gerakan-sesi-inner" },
        thumbFoto,
        infoKiri
      );

      const sudahSelesai = stateProgresSesi.gerakanSelesai.has(gIdx);
      if (sudahSelesai) {
        gerakanSelesaiCount += 1;
      }

      const btnCentang = el("button", {
        type: "button",
        class: `btn-centang-gerakan ${sudahSelesai ? "selesai" : ""}`,
        attrs: { "aria-pressed": sudahSelesai ? "true" : "false" },
        text: sudahSelesai ? "✅ Tuntas!" : "⭕ Belum"
      });

      btnCentang.addEventListener("click", () => {
        const isSelesai = btnCentang.getAttribute("aria-pressed") === "true";
        if (isSelesai) {
          btnCentang.setAttribute("aria-pressed", "false");
          btnCentang.classList.remove("selesai");
          btnCentang.textContent = "⭕ Belum";
          gerakanSelesaiCount = Math.max(0, gerakanSelesaiCount - 1);
          stateProgresSesi.gerakanSelesai.delete(gIdx);
        } else {
          btnCentang.setAttribute("aria-pressed", "true");
          btnCentang.classList.add("selesai");
          btnCentang.textContent = "✅ Tuntas!";
          gerakanSelesaiCount += 1;
          stateProgresSesi.gerakanSelesai.add(gIdx);
          tampilToast(`Bagus! Gerakan "${g.nama}" tuntas 👍`);
        }
        perbaruiProgres();
      });

      itemRow.appendChild(kontenKiriWrap);
      itemRow.appendChild(btnCentang);
      wadahDaftar.appendChild(itemRow);
    });

    perbaruiProgres();
  }

  // Tombol Selesaikan Sesi Latihan (Hadiah 25 Poin, terlindungi anti-klik ganda)
  let sesiIniSudahDiberiPoin = false;
  const btnSelesai = document.getElementById("btnSelesaikanLatihan");
  if (btnSelesai) {
    btnSelesai.disabled = false;
    btnSelesai.onclick = () => {
      hentikanRestTimer();

      if (sesiIniSudahDiberiPoin) {
        return;
      }
      sesiIniSudahDiberiPoin = true;
      btnSelesai.disabled = true;

      // 1. Berikan 25 poin untuk penyelesaian 1 sesi workout
      const hasilPoin = tambahPoinWorkout(appState.data, jadwalItem.id || jadwalItem.nama);
      simpanData("gerakData", appState.data);

      // 2. Tambahkan XP jika belum latihan hari ini
      const tglIni = hariIni();
      if (appState.data.terakhirSesiWorkout !== tglIni) {
        appState.data.terakhirSesiWorkout = tglIni;
        appState.data.xp = (appState.data.xp || 0) + 15;
        simpanData("gerakData", appState.data);
      }

      // Sinkronkan ke leaderboard pengguna lokal dan perbarui tampilan Poin & Rank
      sinkronkanPenggunaLeaderboard(appState);
      if (typeof appState.perbaruiUIPoinRank === "function") {
        appState.perbaruiUIPoinRank();
      }
      if (typeof callbackUpdateXP === "function") {
        callbackUpdateXP();
      }

      // Tampilkan notifikasi rank-up atau penyelesaian sesi
      if (hasilPoin.naikRank) {
        tampilToast(`🎉 Rank Up! Kamu berhasil menjadi ${hasilPoin.rankBaru.nama}! ${hasilPoin.rankBaru.ikon} (+25 Poin)`, 6000);
      } else {
        tampilToast(`🎉 Luar biasa! Sesi latihan selesai! Kamu mendapatkan +25 Poin! (Total: ${appState.data.poin} Poin)`, 5000);
      }

      stateProgresSesi.gerakanSelesai.clear();
      keluarWorkoutFullscreen(dialog);
    };
  }

  // Langsung tampilkan tampilan Workout Mode dalam layar penuh
  masukWorkoutFullscreen(dialog);
}

// =========================================
// QUICK REST TIMER (PENGATUR WAKTU ISTIRAHAT)
// =========================================

function inisialisasiRestTimer() {
  const display = document.getElementById("displayTimerIstirahat");
  const btnToggle = document.getElementById("btnToggleTimer");
  const btnReset = document.getElementById("btnResetTimer");
  const chipsPreset = document.querySelectorAll(".chip-timer");

  const formatWaktu = detik => {
    const m = Math.floor(detik / 60);
    const s = detik % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const updateDisplay = () => {
    if (display) {
      display.textContent = formatWaktu(timerDetikTersisa);
      if (timerDetikTersisa <= 5 && timerSedangBerjalan) {
        display.classList.add("menipis");
      } else {
        display.classList.remove("menipis");
      }
    }
  };

  chipsPreset.forEach(chip => {
    chip.addEventListener("click", () => {
      chipsPreset.forEach(c => c.classList.remove("aktif"));
      chip.classList.add("aktif");
      presetDetikAktif = Number(chip.getAttribute("data-durasi")) || 45;
      hentikanRestTimer();
      timerDetikTersisa = presetDetikAktif;
      updateDisplay();
    });
  });

  if (btnToggle) {
    btnToggle.addEventListener("click", () => {
      if (timerSedangBerjalan) {
        hentikanRestTimer();
        btnToggle.textContent = "▶ Lanjut";
      } else {
        if (timerDetikTersisa <= 0) {
          timerDetikTersisa = presetDetikAktif;
        }
        timerSedangBerjalan = true;
        btnToggle.textContent = "⏸ Jeda";
        timerIstirahatInterval = setInterval(() => {
          timerDetikTersisa--;
          updateDisplay();
          if (timerDetikTersisa <= 0) {
            hentikanRestTimer();
            btnToggle.textContent = "▶ Mulai";
            tampilToast("🔔 Waktu istirahat selesai! Siap untuk set berikutnya! 💪");
          }
        }, 1000);
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      hentikanRestTimer();
      timerDetikTersisa = presetDetikAktif;
      if (btnToggle) btnToggle.textContent = "▶ Mulai";
      updateDisplay();
    });
  }
}

function hentikanRestTimer() {
  if (timerIstirahatInterval) {
    clearInterval(timerIstirahatInterval);
    timerIstirahatInterval = null;
  }
  timerSedangBerjalan = false;
  const btnToggle = document.getElementById("btnToggleTimer");
  if (btnToggle) btnToggle.textContent = "▶ Mulai";
}

// =========================================
// FITUR B: MODAL KATALOG SEMUA LATIHAN & VIDEO DEMO (FULL SCREEN)
// =========================================

function bukaDialogKatalogSemuaLatihan(dataProgram) {
  const dialog = document.getElementById("dialogSemuaLatihan");
  if (!dialog) return;

  const badgeTarget = document.getElementById("katalogBadgeTarget");
  if (badgeTarget && dataProgram) {
    badgeTarget.textContent = `${dataProgram.badge} · ${dataProgram.judul}`;
  }

  // Kumpulkan seluruh gerakan unik dari semua hari dalam program
  const kumpulanGerakan = [];
  const namaUnik = new Set();

  (dataProgram.jadwal || []).forEach(j => {
    (j.gerakan || []).forEach(g => {
      if (!namaUnik.has(g.nama)) {
        namaUnik.add(g.nama);
        kumpulanGerakan.push({ ...g, hariAsal: j.hari, namaHari: j.nama });
      }
    });
  });

  renderKatalogList(kumpulanGerakan, "semua");

  // Langsung tampilkan tampilan pembelajaran dalam layar penuh
  masukWorkoutFullscreen(dialog);
}

function inisialisasiFilterKatalog() {
  const filterBtns = document.querySelectorAll("#filterKatalogGerakan .chip");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("aktif");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("aktif");
      btn.setAttribute("aria-pressed", "true");

      const kategori = btn.getAttribute("data-kategori") || "semua";
      if (stateSlider.programAktif) {
        const kumpulanGerakan = [];
        const namaUnik = new Set();
        (stateSlider.programAktif.jadwal || []).forEach(j => {
          (j.gerakan || []).forEach(g => {
            if (!namaUnik.has(g.nama)) {
              namaUnik.add(g.nama);
              kumpulanGerakan.push({ ...g, hariAsal: j.hari, namaHari: j.nama });
            }
          });
        });
        renderKatalogList(kumpulanGerakan, kategori);
      }
    });
  });
}

function renderKatalogList(daftarGerakan, filterKategori) {
  const wadah = document.getElementById("wadahKatalogGerakan");
  if (!wadah) return;

  wadah.textContent = "";

  const terfilter = filterKategori === "semua"
    ? daftarGerakan
    : daftarGerakan.filter(g => g.kategori === filterKategori);

  if (terfilter.length === 0) {
    const kosong = el("div", { class: "state-kosong" },
      el("p", { text: "Tidak ada gerakan untuk kategori ini." })
    );
    wadah.appendChild(kosong);
    return;
  }

  terfilter.forEach(g => {
    const kartu = el("article", { class: "kartu-katalog-detail" });

    // Header Kartu dengan Thumbnail Foto Gerakan
    const fotoGerakan = g.foto || dapatkanFotoGerakan(g.nama, g.kategori);

    const header = el("div", { class: "katalog-kartu-header" },
      el("div", { class: "katalog-header-bar" },
        el("div", { class: "katalog-foto-thumb" },
          el("img", {
            src: fotoGerakan,
            alt: `Foto gerakan ${g.nama}`,
            class: "katalog-foto-img",
            loading: "eager",
            decoding: "async"
          })
        ),
        el("div", { class: "katalog-info-utama" },
          el("div", { class: "baris-antara" },
            el("span", { class: "tag tag-kategori", text: g.kategori ? g.kategori.toUpperCase() : "GERAKAN" }),
            el("span", { class: "chip-rekomendasi", text: `📊 ${g.set} × ${g.reps}` })
          ),
          el("h4", { class: "judul-gerakan-katalog", text: g.nama }),
          el("p", { class: "deskripsi-gerakan-katalog", text: g.deskripsi })
        )
      )
    );

    // Video simulasi (tidak diputar otomatis di katalog karena banyak kartu sekaligus)
    const videoFrame = buatKomponenVideoAnimasi(g, { otomatis: false });

    // Petunjuk Langkah demi Langkah
    const langkahWrap = el("div", { class: "box-langkah-gerakan" },
      el("h5", { class: "sub-judul-detail", text: "📋 Petunjuk Melakukan Gerakan dengan Benar:" })
    );
    const olLangkah = el("ol", { class: "daftar-langkah-list" });
    (g.langkah || []).forEach(l => {
      const li = el("li", { text: l });
      olLangkah.appendChild(li);
    });
    langkahWrap.appendChild(olLangkah);

    // Otot yang Dilatih
    const ototWrap = el("div", { class: "box-otot-gerakan" },
      el("div", { class: "item-otot" },
        el("span", { class: "label-otot", text: "🎯 Otot Utama:" }),
        el("span", { class: "chip-otot-primer", text: g.targetOtot })
      ),
      el("div", { class: "item-otot" },
        el("span", { class: "label-otot", text: "⚡ Otot Pendukung:" }),
        el("span", { class: "chip-otot-sekunder", text: g.ototSekunder })
      )
    );

    // Kesalahan Umum yang Perlu Dihindari (Pencegahan Cedera)
    const kesalahanWrap = el("div", { class: "box-kesalahan-umum" },
      el("h5", { class: "judul-kesalahan", text: "⚠️ Kesalahan Umum yang Perlu Dihindari:" })
    );
    const ulKesalahan = el("ul", { class: "daftar-kesalahan-list" });
    (g.kesalahanUmum || []).forEach(k => {
      const li = el("li", { text: k });
      ulKesalahan.appendChild(li);
    });
    kesalahanWrap.appendChild(ulKesalahan);

    const kolomKonten = el("div", { class: "katalog-kolom-konten" },
      langkahWrap,
      ototWrap,
      kesalahanWrap
    );

    kartu.appendChild(header);
    kartu.appendChild(videoFrame);
    kartu.appendChild(kolomKonten);

    wadah.appendChild(kartu);
  });
}