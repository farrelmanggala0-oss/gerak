# GERAK — Gizi, Energi, Raga, Kawan

> **Platform kesehatan inklusif untuk Gen Z Indonesia.**
> Dibuat untuk **LOGICODIX 2026**, subtema *Inclusive Health & Well-being*.

GERAK membantu anak muda membangun kebiasaan sehat **tanpa diet ekstrem, tanpa rasa bersalah, dan tanpa memaksa tubuh**. Gizi, olahraga, komunitas, edukasi, dan kesehatan mental digabung dalam satu web yang ringan, bisa dipakai di HP, dan ramah aksesibilitas.

---

## 1. Masalah yang Diselesaikan

| Masalah di aplikasi kesehatan umum | Jawaban GERAK |
|---|---|
| Kalkulator kalori membiarkan defisit ekstrem, bahkan untuk remaja | Batas minimum aman (1200 kkal wanita, 1500 kkal pria). Defisit diblokir untuk usia < 18 tahun dan BMI < 18,5. |
| Program workout tidak peduli kalau tubuh pengguna **tidak kuat** di posisi tertentu | **Lapor keluhan** saat latihan → saran versi gerakan yang lebih ringan + **video simulasi** teknik yang benar + peringatan di sesi berikutnya. |
| Gejala berbahaya saat olahraga diabaikan | Nyeri dada, sesak, pusing, kesemutan, atau intensitas ≥ 8/10 → pengguna diminta **berhenti** dan diberi info **119 / IGD**. |
| Gamifikasi menghukum satu hari bolong | Streak punya **jatah istirahat** (1 hari per 7 hari). |
| Klaim palsu dan data pribadi dikirim ke mana-mana | Label jujur (*Demo*, *Simulasi*, *analisis lokal*). Data tersimpan **di perangkat pengguna**. AI hanya menerima ringkasan tanpa nama. |

---

## 2. Fitur

| Menu | Isi |
|---|---|
| **Beranda** | Ringkasan harian dan kartu *Ayo Mulai* (progres berat badan & ekuivalen energi). |
| **Gizi** | Kalkulator kebutuhan energi (rumus Mifflin-St Jeor) dengan batas aman. Work Out terbuka setelah gizi dihitung. |
| **Work Out** | Program latihan ramah sendi dengan sesi layar penuh, **video simulasi gerakan** (8 pola, kecepatan 0,5×, fase gerakan tersorot), **lapor keluhan** (boleh pilih lebih dari satu bagian tubuh & jenis keluhan), dan **riwayat kesehatan + medical checkup** (tensi, detak jantung, gula darah, kolesterol, anjuran dokter). |
| **Kawan** | Cari teman olahraga berdasarkan jarak (rumus Haversine) dan cabang olahraga, dengan tag aksesibilitas. Profil berstatus **Demo**. |
| **Poin & Rank** | +25 poin per sesi workout, rank bertingkat, badge, dan leaderboard. |
| **Jurnal** | Check-in harian, refleksi raga, dan streak ramah istirahat. |
| **Edukasi** | Materi gizi seimbang (Isi Piringku), pencegahan stunting, dan kebiasaan sehat. |
| **GERAK AI** | Asisten yang paham halaman yang sedang dibuka, plus **analisis riwayat kesehatan** (lihat bagian 3). |

Tampilan bisa diatur: **mode gelap**, **kontras tinggi**, dan **ukuran teks** (A- / A / A+). Animasi mengikuti pengaturan *kurangi gerakan* di perangkat.

---

## 3. GERAK AI (Google Gemini)

- Browser tidak pernah memegang API key. Permintaan lewat **`server.js`** (proxy) yang membaca kunci dari `.env`.
- Model dicoba berurutan: **`gemini-2.5-flash`** → **`gemini-3.5-flash-lite`** (maks 20 detik per model). Kalau keduanya sibuk atau gagal, GERAK memakai **asisten lokal** dan menuliskannya dengan jujur ("analisis lokal").
- Untuk analisis kesehatan, yang dikirim ke AI hanya **ringkasan keluhan dan angka checkup**: tanpa nama, tanpa catatan pribadi, tanpa nama tempat.
- Setiap jawaban ditandai sebagai **edukasi, bukan diagnosis**.

---

## 4. Cara Menjalankan

**Syarat:** [Node.js](https://nodejs.org) versi 18 ke atas (dites di v24). Tidak perlu `npm install`, karena tidak ada dependensi.

```bash
# 1. (Opsional, untuk AI cloud) buat file .env dari contoh, lalu isi GEMINI_API_KEY
#    Kunci gratis: https://aistudio.google.com/app/apikey
cp .env.example .env

# 2. Jalankan server
npm start
# atau di Windows: .\jalankan-gerak.bat
```

Buka **http://localhost:3000**. Tanpa `.env`, semua fitur tetap jalan dan GERAK AI memakai asisten lokal.

> Jangan unggah `.env` ke GitHub. File ini sudah masuk `.gitignore`.

### Uji otomatis

```bash
npm test
```

Hasil yang diharapkan: **95 tes lulus, 0 gagal** (runner bawaan `node --test`).

---

## 5. Struktur Proyek

```text
gerak/
├── index.html              # Satu halaman, navigasi berbasis hash (#gizi, #workout, ...)
├── server.js               # Server statis + proxy GERAK AI ke Gemini (tanpa dependensi)
├── css/                    # Desain "Navy Pulse", dipecah per bagian & dimuat berurutan (01 → 15)
│   ├── 01-dasar.css        # Reset, navbar, tombol, hero
│   ├── 02-beranda.css      # Beranda tamu & member
│   ├── 03-kawan.css        # Cari Kawan
│   ├── 04-gizi-workout.css # Gizi, program & sesi Work Out
│   ├── 05-komponen-umum.css  # Footer, dialog, toast, login
│   ├── 06-poin-rank.css    # Poin, rank, leaderboard
│   ├── 07-mode-gelap-kontras.css
│   ├── 08-responsif.css    # Tablet, HP, kurangi gerakan
│   ├── 09-gerak-ai-animasi.css
│   ├── 10-workout-layar-penuh.css
│   ├── 11-jurnal.css
│   ├── 12-edukasi.css
│   ├── 13-intro-masuk-navbar.css
│   ├── 14-design-system-navy-pulse.css
│   └── 15-fitur-kesehatan.css  # Video simulasi, lapor keluhan, riwayat kesehatan
├── js/
│   ├── main.js             # Titik awal, router halaman
│   ├── auth.js             # Masuk / Daftar
│   ├── gizi.js             # Kalkulator gizi (fungsi murni, diuji)
│   ├── workout.js          # Program latihan, sesi layar penuh, video simulasi
│   ├── kesehatan.js        # Logika lapor keluhan, tanda bahaya, analisis riwayat (fungsi murni, diuji)
│   ├── kesehatan-ui.js     # Tampilan lapor keluhan, medical checkup, analisis AI
│   ├── kawan.js            # Cari kawan olahraga
│   ├── poin-rank.js        # Poin, rank, badge, leaderboard
│   ├── jurnal.js           # Jurnal & check-in
│   ├── edukasi.js          # Materi edukasi
│   ├── gerak-ai.js         # Widget GERAK AI + format jawaban (aman dari XSS)
│   ├── ayo-mulai.js        # Kartu progres Ayo Mulai
│   ├── gamifikasi.js       # Streak ramah istirahat
│   ├── aksesibilitas.js    # Mode gelap, kontras, ukuran teks
│   ├── penyimpanan.js      # Simpan/muat data lokal + migrasi skema
│   ├── config.js           # Batas aman gizi & konstanta
│   ├── tanggal.js          # Utilitas tanggal
│   └── ui.js               # Helper DOM aman & toast
├── data/
│   ├── panduan-simulasi.js # Langkah, hal yang dihindari, versi ringan per gerakan
│   ├── kawan-demo.js       # Profil kawan contoh (Demo)
│   └── edukasi-data.js     # Konten edukasi
├── assets/workout/         # Foto program + simulasi/ (8 video MP4 loop 4 detik + poster)
├── tests/                  # 10 file uji unit (gizi, kesehatan, AI, auth, kawan, dll.)
├── docs/                   # Arsitektur, aksesibilitas, etika & privasi
└── .env.example            # Contoh konfigurasi (PORT, GEMINI_API_KEY)
```

Dokumentasi lengkap: [arsitektur](docs/arsitektur.md) · [aksesibilitas](docs/aksesibilitas.md) · [etika & privasi](docs/etika-dan-privasi.md)

---

## 6. Keamanan, Etika, & Privasi

- **Data lokal:** akun, riwayat latihan, keluhan, dan checkup disimpan di `localStorage` browser pengguna. Tidak ada database atau pelacak pihak ketiga.
- **Server aman:** `server.js` menolak semua file tersembunyi (termasuk `.env`), membatasi ukuran pesan, dan mendukung *Range request* agar video bisa diputar di Safari/iPhone.
- **Anti-XSS:** jawaban AI di-*escape* sebelum ditampilkan, dan isian pengguna (nama, catatan keluhan, checkup) ditampilkan sebagai teks lewat helper DOM `el()`, tidak pernah sebagai HTML.
- **Kelompok rentan:** mode aman remaja, tidak ada diet defisit di bawah umur, dan peringatan tanda bahaya saat olahraga.

---

## 7. Green IT

- **Tanpa framework dan tanpa build step.** HTML, CSS, dan JavaScript murni, tanpa Virtual DOM.
- **Video hemat:** 8 video simulasi totalnya ±300 KB (640×360, H.264). Di katalog tidak diputar otomatis (`preload="none"`), hanya satu video berputar sekaligus, dan tidak diputar otomatis kalau pengguna memilih *kurangi gerakan*.
- **Tanpa polling:** tidak ada panggilan jaringan berulang saat aplikasi diam. AI hanya dipanggil saat pengguna bertanya.
- **Hemat token AI:** riwayat chat yang dikirim dibatasi 6 pesan terakhir, pesan maksimal 1500 karakter.

---

## 8. Batasan (Transparansi)

1. **Akun hanya di perangkat ini.** Belum ada server akun, jadi data tidak tersinkron antar perangkat.
2. **Profil Kawan adalah data Demo** untuk mendemonstrasikan filter jarak, aksesibilitas, dan pelaporan.
3. **Video simulasi adalah animasi ilustrasi buatan GERAK**, bukan rekaman pelatih. File di `assets/workout/simulasi/` bisa diganti rekaman asli dengan nama file yang sama, tanpa mengubah kode.
4. **Usia berdasarkan pengakuan pengguna** (*self-declared*).
5. **Hasil kalori, analisis keluhan, dan jawaban AI adalah edukasi**, bukan diagnosis. Kondisi medis khusus tetap perlu dokter atau ahli gizi.

---

## 9. Tim

Tim LOGICODIX 2026: **Sulaiman** (ketua), **Vito**, **Sadam**, dan **Farrel**.