# Kebijakan Etika, Privasi, & Perlindungan Pengguna GERAK

GERAK dirancang dengan komitmen etika tinggi, mengedepankan keamanan kelompok rentan, transparansi algoritma, dan penghormatan hak privasi pengguna Gen Z.

---

## 1. Penyimpanan Data Lokal & Bebas Pelacak

1. **Penyimpanan Lokal Penuh**: Seluruh data pengguna disimpan secara eksklusif di memori lokal peramban (`localStorage`) pada perangkat masing-masing pengguna.
   - Kunci data yang disimpan: `gerakData` (streak, level, XP, riwayat check-in, kawan diblokir), `gerakJurnal` (catatan jurnal refleksi dan mood), serta preferensi visual (`gerakGelap`, `gerakKontras`, `gerakUkuranTeks`).
2. **Nol Pelacak (Zero Tracking)**: Aplikasi tidak memuat skrip analitik pihak ketiga (Google Analytics, Meta Pixel, dsb.), cookie pelacak lintas situs, atau pengidentifikasi perangkat (*fingerprinting*).
3. **Kedaulatan Data Pengguna**: Pengguna memiliki kendali penuh atas datanya melalui panel di footer:
   - **Ekspor Data (JSON)**: Pengguna dapat mengunduh seluruh data lokalnya kapan saja.
   - **Hapus Semua Data**: Pengguna dapat menghapus seluruh riwayat dan preferensi dalam satu klik dengan konfirmasi aman.

---

## 2. Kebijakan Privasi Integrasi AI (Kecerdasan Buatan)

1. **Isi Jurnal Tidak Pernah Dikirim ke Server**: Catatan curahan hati, tulisan pribadi, atau keluhan kesehatan pengguna **tidak pernah** ditransmisikan ke server internal maupun penyedia API LLM eksternal.
2. **Payload Minimalis Berbasis Kategori**: Satu-satunya data yang dikirimkan ke endpoint AI di masa mendatang (Fase 4) adalah kategori terstruktur anonim:
   - Nilai mood (contoh: `🙂`)
   - Topik refleksi yang dipilih (contoh: `tidur`, `gerak`, `makan`, `stres`)
3. **Transparansi Label**: Antarmuka secara jujur membedakan antara konten bawaan sistem (*"Prompt harian"*) dan konten hasil kecerdasan buatan (*"✨ Dibuat AI"*), disertai peringatan bahwa AI dapat membuat kekeliruan dan bukan saran medis.

---

## 3. Perlindungan Kelompok Rentan

### A. Pencegahan Gangguan Makan (*Eating Disorders*) & Body Shaming
- **Pemblokiran Defisit Kalori untuk BMI Rendah**: Pengguna dewasa dengan BMI $< 18.5$ (kategori *underweight*) dilarang menggunakan target Diet defisit kalori. Sistem akan menampilkan pesan suportif tanpa menghakimi dan menyarankan konsultasi dengan dokter/ahli gizi.
- **Batas Bawah Kalori Absolut**: Nilai rekomendasi diet tidak akan pernah jatuh di bawah batas minimum metabolisme dasar (1200 kkal untuk wanita dan 1500 kkal untuk pria).
- **Bahasa Non-Judgemental**: Antarmuka tidak menggunakan istilah yang mempermalukan bentuk tubuh (*fat-shaming* maupun *skinny-shaming*).

### B. Perlindungan Pengguna Remaja (< 18 Tahun)
- **Larangan Diet Defisit Mandiri**: Pengguna berusia di bawah 18 tahun secara otomatis dinonaktifkan dari opsi Diet dan Bulking untuk melindungi masa pertumbuhan biologis.
- **Mode Aman Komunitas**: Pencocokan dengan kawan baru di ruang publik disembunyikan bagi pengguna remaja, digantikan dengan panduan berolahraga bersama keluarga, teman sekolah, dan lingkungan yang dikenal.

### C. Kepekaan Kesehatan Mental
- Saat pengguna memilih mood sedih (`😔`) atau lelah mental (`😫`), sistem tidak memberikan diagnosis psikiatri otomatis.
- Sistem menampilkan kartu ruang tenang yang hangat, menyarankan istirahat dan berbincang dengan orang terpercaya, serta menyediakan slot kontak layanan kesehatan jiwa resmi (*Hotline Kemenkes 119 ext. 8 / Sejiwa*).

---

## 4. Batasan & Penafian Medis (*Medical Disclaimer*)

> **Pemberitahuan:**
> GERAK adalah alat bantu pencatatan gaya hidup sehat dan pembangun kebiasaan baik, **bukan** perangkat medis, dokter, atau ahli gizi berlisensi. Seluruh perhitungan kalori, pembagian makronutrisi, dan tips edukasi merupakan estimasi berbasis formula umum (Mifflin-St Jeor) untuk individu sehat dan tidak boleh dijadikan acuan diagnosis medis klinis.