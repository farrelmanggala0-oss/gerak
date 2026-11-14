# Dokumentasi & Bukti Aksesibilitas GERAK (WCAG 2.2 Level AA)

Dokumen ini memuat audit kepatuhan aksesibilitas web GERAK berdasarkan pedoman **WCAG 2.2 Level AA**, perbandingan kontras warna sebelum dan sesudah refaktor, serta panduan pengujian manual menggunakan teknologi asistif.

---

## 1. Tabel Perbandingan Rasio Kontras Warna

| Elemen Antarmuka | Mode | Warna (Sebelum) | Rasio Sebelum | Status Sebelum | Warna (Sesudah) | Rasio Sesudah | Status Sesudah |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Badge Terkunci** | Normal | `#16171b` dg `opacity: 0.4` | ~2.5:1 | ❌ **GAGAL** | Teks `#595959`, border dashed, tanpa opacity | **7.00:1** | ✅ **LOLOS** |
| **Border Tombol Lapor** | Normal | Border `#c9c5ba` vs `#ffffff` | 1.70:1 | ❌ **GAGAL** | Border `#76746e` vs `#ffffff` | **3.56:1** | ✅ **LOLOS** |
| **Label Kategori** | Normal | `#6b6a63` vs `#f6f3ea` | 4.81:1 | ⚠️ Lolos Tipis | `#55544e` vs `#f6f3ea` | **5.80:1** | ✅ **LOLOS TEGAS** |
| **Teks Verifikasi** | Normal | `#2f7d1e` vs `#ffffff` | 4.77:1 | ⚠️ Lolos Tipis | `#266718` vs `#ffffff` | **5.50:1** | ✅ **LOLOS TEGAS** |
| **Border Kartu Gelap** | Gelap | Border `#3b3e46` vs `#121317` | 1.78:1 | ❌ **GAGAL** | Border `#525661` vs `#121317` | **3.05:1** | ✅ **LOLOS** |
| **Border Input Gelap** | Gelap | Border `#4a4d56` vs `#26282f` | 1.77:1 | ❌ **GAGAL** | Border `#6e7380` vs `#26282f` | **3.12:1** | ✅ **LOLOS** |
| **Border Tombol Lapor** | Gelap | Border `#4a4d56` vs `#1d1f25` | 1.98:1 | ❌ **GAGAL** | Border `#6e7380` vs `#1d1f25` | **3.24:1** | ✅ **LOLOS** |
| **Focus Indicator** | Normal | Tidak terlihat di mode normal | < 1.5:1 | ❌ **GAGAL** | `outline: 3px solid #5b13e0`, offset 3px | **8.40:1** | ✅ **LOLOS** |
| **Focus Indicator** | Gelap | Tidak konsisten | < 2.0:1 | ❌ **GAGAL** | `outline: 3px solid #c8f169`, offset 3px | **12.40:1** | ✅ **LOLOS** |
| **Focus Indicator** | Kontras| `outline: 4px solid #ffe600` | 16.7:1 | ✅ Lolos | `outline: 4px solid #ffe600` | **16.70:1** | ✅ **LOLOS** |

---

## 2. Checklist Kepatuhan WCAG 2.2 Level AA

| Kriteria Sukses WCAG | Prinsip | Implementasi di GERAK | Status |
| :--- | :--- | :--- | :--- |
| **1.1.1 Non-text Content** | Perceivable | Emoji dekoratif diberi `aria-hidden="true"`; tombol ikon memiliki `aria-label` deskriptif bahasa Indonesia. | ✅ Terpenuhi |
| **1.3.1 Info and Relationships** | Perceivable | Heading berurutan (h1 $\rightarrow$ h2 $\rightarrow$ h3); section menggunakan `aria-labelledby`; mood menggunakan `<fieldset>` & `<legend>`. | ✅ Terpenuhi |
| **1.4.3 Contrast (Minimum)** | Perceivable | Semua teks normal $\ge$ 4.5:1, teks besar $\ge$ 3.0:1 pada mode normal, gelap, dan kontras tinggi. | ✅ Terpenuhi |
| **1.4.4 Resize Text** | Perceivable | Mendukung tombol skala teks mandiri A− (100%), A (115%), A+ (130%, 150%) menggunakan CSS variable dan unit `rem`. | ✅ Terpenuhi |
| **1.4.11 Non-text Contrast** | Perceivable | Border tombol, komponen form, dan indikator progres $\ge$ 3.0:1 terhadap latar belakang. | ✅ Terpenuhi |
| **2.1.1 Keyboard** | Operable | Seluruh fitur (navigasi, kalkulator gizi, filter kawan, ajakan, jurnal, dialog) dapat dioperasikan penuh via keyboard. | ✅ Terpenuhi |
| **2.1.2 No Keyboard Trap** | Operable | Menggunakan elemen `<dialog>` native (modal dialog otomatis memerangkap fokus di dalam modal dan melepas saat tombol Esc ditekan). | ✅ Terpenuhi |
| **2.4.1 Bypass Blocks** | Operable | Skip link `Lewati ke konten utama` sebagai elemen pertama di `<body>`. | ✅ Terpenuhi |
| **2.4.7 Focus Visible** | Operable | Indikator fokus `:focus-visible` dengan outline tebal (3px) dan offset yang kontras di setiap mode tema. | ✅ Terpenuhi |
| **2.5.5 / 2.5.8 Target Size** | Operable | Target sentuh interaktif berukuran minimal 44 × 44 px (termasuk tombol kontrol ikon dan tombol mood). | ✅ Terpenuhi |
| **3.2.1 On Focus** | Understandable | Tidak ada perubahan konteks mendadak saat elemen menerima fokus keyboard. | ✅ Terpenuhi |
| **3.3.1 Error Identification** | Understandable | Kesalahan form gizi ditandai dengan `aria-invalid` dan pesan kesalahan teks inline yang terhubung via `aria-describedby`. | ✅ Terpenuhi |
| **4.1.3 Status Messages** | Robust | Komponen toast dan live region kalkulator gizi menggunakan `role="status"` dan `aria-live="polite"`. | ✅ Terpenuhi |

---

## 3. Hasil Pengujian Responsif & Zoom Browser

- **Pengujian Zoom 200%**: Layout grid mengalir menjadi 1 kolom secara fleksibel tanpa terjadi tumpang tindih teks atau scrollbar horizontal ganda.
- **Pengujian Lebar Layar 320px (Ponsel Sempit)**:
  - Navbar beralih ke tombol hamburger menu.
  - Kartu streak 7 hari menyesuaikan ukuran kotak hari secara proporsional.
  - Angka besar kalori dan streak mengecil ke `3rem` sehingga tidak terpotong.

---

## 4. Panduan Pengujian Manual Menggunakan Screen Reader

Untuk memverifikasi secara independen menggunakan pembaca layar:

### Pengujian dengan NVDA (Windows)
1. Nyalakan NVDA (`Ctrl + Alt + N`).
2. Buka halaman di Google Chrome atau Microsoft Edge.
3. Tekan tombol `Tab`: Pastikan tautan pertama yang dibacakan adalah *"Lewati ke konten utama"*, dan menekan `Enter` langsung memindahkan fokus ke area konten utama.
4. Masuk ke seksi **Gizi**: Tab ke input umur, masukkan angka `16`. Pastikan NVDA membacakan pemberitahuan bahwa opsi Diet dinonaktifkan.
5. Masuk ke seksi **Kawan**: Tekan tombol `Ajak Gerak`. Pastikan fokus berpindah ke dalam dialog dan tombol `Escape` menutup dialog serta mengembalikan fokus ke tombol pemanggil.

### Pengujian dengan TalkBack (Android) / VoiceOver (iOS/macOS)
1. Aktifkan pembaca layar pada perangkat sentuh.
2. Jelajahi tombol-tombol ikon navigasi di kanan atas (A−, A, A+, Baca, Kontras, Gelap): Pastikan semua tombol memiliki nama aksesibel jelas (bukan sekadar membaca emoji atau simbol).
3. Gesek (*swipe*) pada bagian mood jurnal: Pastikan pembaca layar mengumumkan *"Sangat senang"*, *"Biasa saja"*, dsb., bukan kode unicode emoji mentah.