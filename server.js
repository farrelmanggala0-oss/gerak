import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = parseInt(process.env.PORT || "3000", 10);

// Model Gemini yang dicoba berurutan (yang paling cepat & stabil duluan)
const MODEL_GEMINI = ["gemini-2.5-flash", "gemini-3.5-flash-lite"];
const GEMINI_BASE_URL = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

// Muat variabel environment secara aman dari .env jika ada
function muatEnv() {
  const fileEnv = path.join(__dirname, ".env");
  if (!fs.existsSync(fileEnv)) return;
  try {
    const isi = fs.readFileSync(fileEnv, "utf-8");
    isi.split(/\r?\n/).forEach(baris => {
      const barisTrim = baris.trim();
      if (!barisTrim || barisTrim.startsWith("#")) return;
      const indeksSamaDengan = barisTrim.indexOf("=");
      if (indeksSamaDengan > 0) {
        const kunci = barisTrim.substring(0, indeksSamaDengan).trim();
        let nilai = barisTrim.substring(indeksSamaDengan + 1).trim();
        // Hapus tanda petik jika ada
        if ((nilai.startsWith('"') && nilai.endsWith('"')) || (nilai.startsWith("'") && nilai.endsWith("'"))) {
          nilai = nilai.slice(1, -1);
        }
        if (!process.env[kunci]) {
          process.env[kunci] = nilai;
        }
      }
    });
  } catch (err) {
    console.warn("⚠️ Peringatan membaca .env:", err.message);
  }
}
muatEnv();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mp4": "video/mp4",
  ".webp": "image/webp"
};

// ==========================================
// GERAK AI SMART LOCAL KNOWLEDGE ENGINE
// (Fallback cerdas saat API key belum dipasang / batas kuota tercapai)
// ==========================================
function hasilkanJawabanLokal({ pesan, konteks, userMode, namaUser }) {
  const teksLower = (pesan || "").toLowerCase();
  const sapaanNama = (userMode === "member" && namaUser) ? `, ${namaUser}` : "";
  const halaman = (konteks?.halaman || "beranda").toLowerCase();
  const seksi = (konteks?.seksi || "").toLowerCase();

  // 0. Analisis Refleksi Jurnal Pribadi dari GERAK AI
  if (konteks?.tipe === "analisis_jurnal" || teksLower.includes("analisis jurnal") || teksLower.includes("refleksi jurnal")) {
    const entri = konteks?.entriJurnal || {};
    const mood = entri.mood || "🙂";
    const kondisi = entri.kondisiTubuh ? `Kondisi tubuh: ${entri.kondisiTubuh}. ` : "";
    const energi = entri.energi ? `Tingkat energi: ${entri.energi}. ` : "";
    const tidur = entri.tidur ? `Kualitas tidur: ${entri.tidur}. ` : "";
    const stres = entri.stres ? `Tingkat stres: ${entri.stres}. ` : "";
    const aktivitas = entri.aktivitasFisik ? `Aktivitas: ${entri.aktivitasFisik}. ` : "";

    return `### ✨ Refleksi Personal GERAK AI${sapaanNama ? ` untuk ${namaUser}` : ""}

1. 📌 **Rangkuman Refleksi**:
Kamu mencatat suasana hati **${mood}**. ${kondisi}${energi}${tidur}${stres}${aktivitas}Catatan ini menunjukkan kesadaran berharga untuk menyelaraskan kondisi fisik dan batinmu hari ini.

2. 💭 **Identifikasi Emosi & Tema**:
Tema yang terlihat adalah kejujuran mendengarkan sinyal tubuh tanpa rasa bersalah. Mengakui batas kapasitas harian adalah tanda kedewasaan dalam berolahraga dan menjaga kesehatan jangka panjang.

3. 🌱 **Refleksi Suportif**:
Terima kasih sudah meluangkan waktu berefleksi. Apapun kondisimu hari ini—baik saat produktif penuh energi maupun saat butuh jeda—tubuhmu telah bekerja keras menopang harimu. Berikan dirimu apresiasi yang layak.

4. 💡 **Rekomendasi Kebiasaan Sehat Realistis**:
- 💧 **Peregangan & Napas Rileks**: Luangkan 5 menit untuk peregangan ringan leher dan bahu, lalu ambil 3 napas dalam perlahan.
- 🛌 **Fokus Waktu Pemulihan**: Pastikan tidur malam tidak terganggu paparan layar gadget 30 menit sebelum istirahat.

5. ❓ **Pertanyaan Refleksi Lanjutan**:
*Apa satu hal kecil yang paling kamu butuhkan saat ini agar tubuh dan pikiranmu terasa lebih ringan?*

*(💡 Catatan: Refleksi AI ini bersifat pendampingan gaya hidup sehat dan bukan diagnosis medis).*`;
  }

  // 0b. Weekly Wellness Insights
  if (konteks?.tipe === "weekly_insights" || teksLower.includes("weekly insights") || teksLower.includes("tren mingguan")) {
    return `### 📊 Weekly Wellness Insights GERAK AI

1. 📈 **Pola Mood & Konsistensi**:
Dalam sepekan terakhir, kamu menunjukkan komitmen yang baik dalam memantau kebugaran raga. Fluktuasi energi adalah hal manusiawi, dan mencatatnya membantumu mengenali ritme alami tubuh.

2. 🛌 **Pola Pemulihan & Tidur**:
Kualitas istirahat berdampak langsung pada performa latihan. Menjaga jam tidur yang teratur membantu stabilitas energi dan mencegah keletihan mental.

3. 🎯 **Rekomendasi Minggu Berikutnya**:
- Jaga keseimbangan antara hari aktif dan sesi rest day.
- Cukupi hidrasi harian minimal 2 liter air putih, terutama di hari latihan fisik.
- Tetap jadikan jurnal pribadi sebagai ruang amanmu tanpa penghakiman.`;
  }

  // 0c. Bantuan Postingan Komunitas Publik
  if (konteks?.tipe === "bantuan_postingan" || teksLower.includes("bantuan postingan") || teksLower.includes("ide judul")) {
    return `Berikut rekomendasi bantuan penulisan dari GERAK AI:
- 💡 **Pilihan Ide Judul**:
  1. *Pengalaman Nyata: Menjaga Ritme Sehat Tanpa Beban*
  2. *Tips Sederhana Memulai Konsistensi Olahraga dari Nol*
  3. *Kenapa Istirahat Cukup Sama Pentingnya dengan Latihan Berat*
- ✨ **Saran Kalimat**: Tulisanmu sudah hangat dan ramah kawan. Pastikan selalu menyertakan pengingat bahwa tips ini berakar dari pengalaman pribadi.
- 🏷️ **Saran Kategori**: Pilih kategori yang paling spesifik agar kawan komunitas yang membutuhkan mudah menemukannya!`;
  }

  // 0d. Bantuan Pembelajaran Edukasi & Quiz dari GERAK AI
  if (
    konteks?.tipe === "tanya_edukasi" ||
    konteks?.tipe === "bedah_istilah" ||
    konteks?.tipe === "bantuan_quiz" ||
    teksLower.includes("sederhanakan") ||
    teksLower.includes("bedah istilah") ||
    teksLower.includes("soal quiz") ||
    teksLower.includes("fakta kesehatan hari ini") ||
    (halaman === "edukasi" && (teksLower.includes("jelaskan") || teksLower.includes("materi")))
  ) {
    if (teksLower.includes("bedah istilah")) {
      return `### 🔍 Bedah Istilah Ilmiah dari GERAK AI${sapaanNama ? ` untuk ${namaUser}` : ""}

Berikut pembedahan konsep & istilah medis/gizi penting dalam pembelajaran kesehatan:
1. **Bioavailabilitas**: Seberapa banyak dan seberapa cepat suatu zat gizi diserap dan digunakan oleh sel tubuh (contoh: protein hewani memiliki bioavailabilitas tinggi).
2. **Hipertrofi Miofibrilar**: Pembesaran ukuran serat otot kontraktil akibat adaptasi tegangan mekanis latihan beban berulang (*progressive overload*).
3. **Indeks Glikemik (IG)**: Skala kecepatan suatu makanan karbohidrat dalam menaikkan kadar glukosa darah. Semakin rendah IG (<55), semakin stabil energimu.
4. **Sistem Saraf Parasimpatik**: Cabang saraf otonom yang memfasilitasi fase *Rest and Digest*, menurunkan detak jantung, dan memicu pemulihan saat istirahat/tidur.
5. **Translokasi GLUT-4**: Mekanisme pintu masuk glukosa ke dalam sel otot yang aktif saat otot berkontraksi, menurunkan gula darah bahkan tanpa bergantung penuh pada insulin.

📚 *Sumber Rujukan: Journal of Sports Sciences & American Journal of Clinical Nutrition.* Ada istilah lain yang ingin kamu tanyakan?`;
    }

    if (teksLower.includes("sederhanakan") || teksLower.includes("bahasa yang sangat sederhana")) {
      return `### 💡 Penjelasan Ringkas & Ramah dari GERAK AI${sapaanNama ? ` untuk ${namaUser}` : ""}

Bayangkan tubuhmu seperti sebuah kendaraan berperforma tinggi:
- **Makanan Pokok (Karbohidrat)** = Bensin utama yang memberi tenaga untuk berjalan dan berpikir seharian.
- **Lauk Pauk (Protein)** = Onderdil dan suku cadang yang memperbaiki bodi mobil saat ada lecet atau aus setelah beraktivitas.
- **Sayuran & Buah (Vitamin & Serat)** = Oli pelumas dan cairan pendingin yang memastikan mesin tidak kepanasan dan pembuangan sisa lancar.
- **Hari Istirahat & Tidur** = Waktu parkir di garasi untuk servis total. Tanpa tidur nyenyak, mobil tercanggih pun akan mogok!

Kuncinya bukan diet ekstrem yang menyiksa, melainkan proporsi seimbang dan konsistensi kebiasaan kecil setiap hari. Ada bagian modul yang ingin kita bahas lebih dalam?`;
    }

    if (teksLower.includes("quiz") || teksLower.includes("soal")) {
      return `### 📝 Bantuan Evaluasi Quiz dari GERAK AI${sapaanNama ? ` untuk ${namaUser}` : ""}

Memahami konsep di balik soal quiz jauh lebih bermakna daripada sekadar menghafal jawaban:
- **Mengapa waktu tidur penting bagi otot?** Karena hormon pertumbuhan (HGH) dilepaskan saat fase *slow-wave sleep* (tidur nyenyak) untuk memperbaiki mikrotrauma otot pasca-latihan.
- **Mengapa peregangan dinamis lebih baik sebelum latihan?** Karena gerakan aktif melumasi sendi dengan cairan sinovial dan menaikkan suhu jaringan tanpa menurunkan kekuatan ledak otot.
- **Mengapa sayuran mengisi sepertiga piring?** Serat memperlambat laju penyerapan gula dan memberi rasa kenyang awet dengan densitas kalori yang sangat ramah.

Kamu bisa mengulang quiz kapan saja untuk memperkuat pemahamanmu!`;
    }

    return `### 🧠 Asisten Pembelajaran GERAK AI${sapaanNama ? ` untuk ${namaUser}` : ""}

Aku siap membantumu mempelajari 20 modul kesehatan terverifikasi ilmiah, memahami rujukan penelitian jurnal, membedah label gizi, atau memandu strategi mini games kebugaran!

Apa materi atau konsep yang ingin kamu eksplorasi saat ini?`;
  }

  // 1. Sapaan & Pertanyaan Umum
  if (/^(halo|hai|hey|p|pagi|siang|sore|malam|assalamualaikum|tes|test)/.test(teksLower)) {
    if (userMode === "member") {
      return `Halo${sapaanNama}! Senang bertemu denganmu lagi di GERAK. Saat ini kamu sedang membuka halaman **${konteks?.halamanJudul || halaman}**. Ada yang bisa aku bantu seputar latihan, target gizi, atau kawan olahraga hari ini?`;
    }
    return `Halo! Selamat datang di GERAK. — platform kesehatan inklusif buat Gen Z. Aku GERAK AI, siap membantumu memahami kalkulator gizi, latihan fisik ramah sendi, komunitas 14 cabang olahraga, hingga sistem poin kebugaran. Ada yang ingin kamu tanyakan?`;
  }

  // 2. Pertanyaan tentang Apa itu GERAK
  if (teksLower.includes("apa itu gerak") || teksLower.includes("tentang gerak") || teksLower.includes("fungsi gerak")) {
    return `**GERAK.** adalah platform kesehatan dan kebugaran inklusif yang dirancang khusus untuk Gen Z di Indonesia. 
GERAK berdiri di atas 4 pilar utama:
- 🥗 **Gizi**: Kalkulator kebutuhan kalori ilmiah (Mifflin-St Jeor) dengan batas aman minimum 1.200 kkal dan perlindungan usia remaja.
- ⚡ **Energi**: Check-in harian bermakna, streak ramah istirahat (tanpa bikin stres!), dan sistem Level XP.
- 🧘 **Raga**: Jurnal refleksi harian kondisi fisik & mood, serta program workout terstruktur (+25 poin/sesi).
- 👥 **Kawan**: Komunitas olahraga bareng di 14 cabang olahraga dengan pencarian radius jarak nyata.`;
  }

  // 3. Pertanyaan seputar Gizi & Kalori
  if (teksLower.includes("kalori") || teksLower.includes("gizi") || teksLower.includes("mifflin") || teksLower.includes("bmr") || teksLower.includes("tdee")) {
    return `Di halaman **Gizi**, GERAK menggunakan formula saintifik **Mifflin-St Jeor** untuk menghitung laju metabolisme basal (BMR) dan kebutuhan energi harian (TDEE).
Beberapa aturan keselamatan gizi penting:
1. 🛡️ **Batas Kalori Aman**: Asupan tidak boleh turun di bawah 1.200 kkal/hari untuk mencegah malnutrisi.
2. 👶 **Proteksi Usia**: Mode **Diet** dibatasi hanya untuk usia 18 tahun ke atas. Remaja diarahkan ke mode **Jaga Berat Badan** agar pertumbuhan optimal.
3. ⚖️ **Pilihan Target**:
   - **Diet**: Defisit moderat 500 kkal untuk penurunan bertahap.
   - **Jaga**: Keseimbangan kalori pemeliharaan (maintenance).
   - **Bulking**: Surplus bertahap 300 kkal untuk pembentukan massa otot.`;
  }

  // 4. Pertanyaan seputar Diet vs Bulking
  if (teksLower.includes("diet") || teksLower.includes("turun berat") || teksLower.includes("bulking") || teksLower.includes("naik berat")) {
    return `Perbedaan utama target di GERAK:
- 🥗 **Diet (Fat Loss Sehat)**: Mengurangi 500 kkal dari kebutuhan harianmu secara bertahap. Tidak boleh ekstrem di bawah 1.200 kkal. Butuh asupan protein cukup (25%) agar otot tidak menyusut.
- 💪 **Bulking (Massa Otot)**: Menambah sekitar 300 kkal di atas maintenance, dipadukan dengan program latihan beban/bodyweight di menu Work Out agar berat yang naik adalah otot, bukan lemak berlebih.
- ⚖️ **Jaga Berat Badan**: Menjaga asupan sesuai pengeluaran energi harianmu.`;
  }

  // 5. Pertanyaan seputar Makronutrisi (Protein, Karbo, Lemak)
  if (teksLower.includes("protein") || teksLower.includes("karbo") || teksLower.includes("lemak") || teksLower.includes("makro")) {
    return `Pembagian makronutrisi seimbang standar di GERAK:
- 🥩 **Protein (20–25%)**: Membangun dan memperbaiki jaringan otot, serta memberi rasa kenyang lebih lama. Contoh: telur, tempe, tahu, dada ayam, ikan.
- 🍚 **Karbohidrat (50–55%)**: Sumber energi utama tubuh dan otak. Utamakan karbohidrat kompleks seperti nasi merah, oat, ubi, atau kentang.
- 🥑 **Lemak Sehat (25–30%)**: Mendukung produksi hormon dan penyerapan vitamin (A, D, E, K). Contoh: alpukat, kacang-kacangan, minyak zaitun.`;
  }

  // 6. Pertanyaan seputar Work Out & Status Gembok
  if (teksLower.includes("workout") || teksLower.includes("latihan") || teksLower.includes("gembok") || teksLower.includes("terkunci") || teksLower.includes("buka latihan")) {
    return `Mengapa menu **Work Out** terkunci?
🔒 Di GERAK, program latihan fisik diselaraskan langsung dengan kebutuhan kalori dan target energimu (Diet, Jaga, atau Bulking).
**Cara membukanya sangat mudah:**
1. Masuk ke halaman **Gizi**.
2. Isi tanggal lahir, jenis kelamin, tinggi, berat badan, dan level aktivitas.
3. Klik tombol **"Hitung Kalori Aman"**.
Begitu target gizi tersimpan, menu Work Out akan **otomatis terbuka**! Setiap sesi latihan yang kamu selesaikan memberikan **+25 Poin** untuk menaikkan rank.`;
  }

  // 7. Pertanyaan seputar Kawan & 14 Cabang Olahraga
  if (teksLower.includes("kawan") || teksLower.includes("teman") || teksLower.includes("olahraga bareng") || teksLower.includes("cabor") || teksLower.includes("radius") || teksLower.includes("jarak")) {
    return `Fitur **Kawan** menghubungkanmu dengan sesama pegiat olahraga:
- 🏃 **14 Cabang Olahraga**: Lari, Jalan Santai, Bersepeda, Renang, Gym/Fitness, Badminton, Futsal, Basket, Yoga, Padel, Tenis Meja, Lompat Tali, Voli, dan Bela Diri.
- 📍 **Teman di Sekitar**: Menghitung jarak nyata memakai formula Haversine dengan pilihan radius 1 km, 3 km, 5 km, hingga 10 km.
- ⚡ **Sedang Aktif**: Melihat siapa saja kawan yang siap diajak olahraga hari ini.
- 🎁 **XP Bonus**: Mengirim ajakan olahraga bareng yang valid memberikan **+10 XP** (maksimal 3 ajakan per hari).`;
  }

  // 8. Pertanyaan seputar Poin & Rank
  if (teksLower.includes("poin") || teksLower.includes("rank") || teksLower.includes("leaderboard") || teksLower.includes("tingkatan")) {
    return `Sistem **Poin & Rank** GERAK:
- 🎖️ **11 Tingkatan Rank**: Dimulai dari *Pemula Mager* (0–99 poin), *Mulai Semangat* (100–499), *Pejuang Konsisten* (500–999), hingga tingkatan tertinggi *Legenda Raga* (5.000+ poin).
- 🏆 **Setiap Sesi Workout**: Memberikan tepat **+25 Poin**.
- 📊 **Leaderboard Transparan**: Peringkat dihitung murni dari latihan nyata pengguna tanpa manipulasi angka buatan.`;
  }

  // 9. Pertanyaan seputar Jurnal & Check-in & Streak
  if (teksLower.includes("jurnal") || teksLower.includes("streak") || teksLower.includes("istirahat") || teksLower.includes("checkin") || teksLower.includes("check-in") || teksLower.includes("xp")) {
    return `Fitur Konsistensi di GERAK:
- 🔥 **Streak Ramah Istirahat**: Streak tidak akan putus jika kamu mengambil jeda 1 hari karena tersedia jatah istirahat terproteksi.
- 📝 **Jurnal Refleksi**: Catat kondisi fisik dan emosimu dengan prompt harian. Tulisan minimal 10 karakter memberikan **+10 XP** (1x sehari).
- ⚡ **Level Akun**: Kumpulkan XP dari check-in (+20 XP), jurnal (+10 XP), dan ajakan kawan (+10 XP) untuk meningkatkan level akunmu.`;
  }

  // 10. Pertanyaan seputar Edukasi & Stunting
  if (teksLower.includes("stunting") || teksLower.includes("edukasi") || teksLower.includes("kemenkes") || teksLower.includes("isi piringku") || teksLower.includes("1000 hpk")) {
    return `Halaman **Edukasi** GERAK memuat modul mikro 2 menit berbasis pedoman Kementerian Kesehatan RI:
- 👶 **Pencegahan Stunting**: Sangat krusial pada 1.000 Hari Pertama Kehidupan (sejak janin hingga usia 2 tahun).
- 💡 **Peran Gen Z**: Sebagai calon orang tua masa depan, pencegahan anemia dan pemenuhan gizi seimbang sejak masa remaja merupakan kunci memutus rantai stunting.
- 🍽️ **Panduan "Isi Piringku"**: 1/3 karbohidrat, 1/3 sayuran, 1/6 lauk pauk berprotein tinggi, dan 1/6 buah-buahan, disertai minimal 8 gelas air putih sehari.`;
  }

  // 11. Pertanyaan seputar Scrolling dan Navigasi Halaman
  if (teksLower.includes("scroll") || teksLower.includes("halaman") || teksLower.includes("pindah") || teksLower.includes("navigasi")) {
    return `Setiap halaman di GERAK (Beranda, Gizi, Work Out, Kawan, Poin & Rank, Jurnal, Edukasi) sekarang memiliki **scrolling vertikal mandiri**!
Kamu bisa menggulir layar untuk membaca semua informasi lengkap di halaman tersebut tanpa takut halaman berganti sendiri. 
Untuk berpindah halaman, gunakan **menu navigasi sticky di bilah atas**.`;
  }

  // 12. Fallback Jawaban Cerdas Kontekstual
  return `Terima kasih pertanyaannya${sapaanNama}! Mengenai hal tersebut, di GERAK kami selalu mengutamakan prinsip keseimbangan: dengarkan kondisi tubuh, penuhi gizi seimbang tanpa rasa tertekan, dan bergeraklah secara konsisten bersama teman. 

Kamu saat ini sedang berada di halaman **${konteks?.halamanJudul || halaman}**. Apakah ada bagian tertentu dari halaman ini yang ingin kamu diskusikan lebih mendalam?`;
}

// ==========================================
// PROXY GEMINI API KE GOOGLE AI STUDIO
// ==========================================
async function panggilGeminiAPI({ pesan, riwayat, konteks, userMode, namaUser }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;

  if (!apiKey || apiKey === "MASUKKAN_GEMINI_API_KEY_DI_SINI") {
    // Mode offline / smart local fallback
    const balasanLokal = hasilkanJawabanLokal({ pesan, konteks, userMode, namaUser });
    return {
      sukses: true,
      balasan: balasanLokal,
      sumber: "local_assistant",
      catatan: "Kunci API Gemini belum dipasang di .env. Menggunakan asisten cerdas bawaan GERAK."
    };
  }

  // Susun System Instruction & Konteks untuk Gemini Free Tier
  const systemInstruction = `Kamu adalah GERAK AI, asisten kebugaran, nutrisi, dan gaya hidup sehat inklusif dari platform GERAK. untuk generasi muda (Gen Z) di Indonesia.
Prinsip utamamu:
1. Nada bicara: ramah, santun, hangat, suportif, komunikatif, bernada positif khas anak muda tanpa bahasa alay yang berlebihan.
2. Tidak menghakimi pengguna mengenai berat badan, bentuk tubuh, atau level kebugaran.
3. Platform GERAK memiliki 6 pilar: Gizi (formula Mifflin-St Jeor batas 1200 kkal), Work Out (ramah sendi, butuh gizi terbuka dulu, +25 poin/sesi), Kawan (14 cabang olahraga, radius jarak nyata), Poin & Rank (11 tier rank, leaderboard transparan), Jurnal (check-in, streak ramah istirahat, refleksi raga), dan Edukasi (Kemenkes, cegah stunting pada 1000 HPK, Isi Piringku).
4. Mode Pengguna saat ini: ${userMode === "member" ? `MEMBER (Nama: ${namaUser || "Member"})` : "GUEST (Pengunjung belum login)"}.
5. Halaman aktif: "${konteks?.halaman || "Beranda"}", Bagian/Seksi: "${konteks?.seksiJudul || konteks?.seksi || "Umum"}".
6. Keamanan medis: Selalu ingatkan bahwa saranmu bersifat edukatif, bukan diagnosis medis pengganti dokter atau ahli gizi terdaftar. Jangan pernah merekomendasikan defisit kalori ekstrem (<1200 kkal).
7. Jawab secara ringkas (maksimal sekitar 180 kata), padat, berbobot, terstruktur (gunakan bullet points jika perlu), dan dalam Bahasa Indonesia.`;

  // Format percakapan untuk API Gemini (generateContent)
  const contents = [];

  // Masukkan riwayat percakapan sebelumnya jika ada (max 6 pesan terakhir untuk hemat token free tier)
  if (Array.isArray(riwayat) && riwayat.length > 0) {
    const riwayatTerpilih = riwayat.slice(-6);
    riwayatTerpilih.forEach(item => {
      if (item && item.role && item.text) {
        contents.push({
          role: item.role === "assistant" ? "model" : "user",
          parts: [{ text: String(item.text).slice(0, 500) }]
        });
      }
    });
  }

  // Tambahkan prompt saat ini beserta konteks section
  const promptLengkap = `[Konteks: Halaman ${konteks?.halaman || "Beranda"}, Seksi: ${konteks?.seksiJudul || "Umum"}]
Pertanyaan Pengguna:
${pesan}`;

  contents.push({
    role: "user",
    parts: [{ text: promptLengkap }]
  });

  const bodyData = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192, // model "berpikir" dulu & token berpikir ikut dihitung, jadi beri ruang lega
      topP: 0.95
    }
  };

  // Dicoba berurutan: kalau model pertama sibuk (503/429) atau kelamaan, pindah ke model berikutnya.
  // Hasil tes (13 Nov 2026): 2.5-flash ~2,5 dtk, 3.5-flash-lite ~8 dtk; model 3.6–3.8 sering 503 "high demand".
  let kendalaTerakhir = "";
  for (const model of MODEL_GEMINI) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // maks 20 detik per model

    try {
      const response = await fetch(`${GEMINI_BASE_URL}/models/${model}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey // kunci lewat header, bukan di URL
        },
        body: JSON.stringify(bodyData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`⚠️ Gemini (${model}) gagal: ${response.status}`, errText.slice(0, 200));
        kendalaTerakhir = `HTTP ${response.status}`;
        continue; // coba model berikutnya
      }

      const data = await response.json();
      // Gabungkan semua bagian teks jawaban (lewati bagian "pikiran" model kalau ada)
      const balasanAI = (data?.candidates?.[0]?.content?.parts || [])
        .filter(bagian => bagian.text && !bagian.thought)
        .map(bagian => bagian.text)
        .join("")
        .trim();

      if (!balasanAI) {
        kendalaTerakhir = "jawaban kosong";
        continue;
      }

      // Kalau jawaban terpotong karena batas token, beri tahu pengguna dengan jujur
      const terpotong = data?.candidates?.[0]?.finishReason === "MAX_TOKENS";

      return {
        sukses: true,
        balasan: terpotong ? `${balasanAI}…\n\n*(Jawaban terpotong karena terlalu panjang.)*` : balasanAI,
        sumber: "gemini_free_tier",
        model
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`⚠️ Gemini (${model}) tidak menjawab:`, err.message);
      kendalaTerakhir = "timeout/koneksi";
    }
  }

  // Semua model gagal → asisten lokal
  return {
    sukses: true,
    balasan: hasilkanJawabanLokal({ pesan, konteks, userMode, namaUser }),
    sumber: "local_fallback",
    catatan: `Gemini sedang tidak bisa dihubungi (${kendalaTerakhir}). Dialihkan ke asisten lokal GERAK.`
  };
}

// ==========================================
// HTTP SERVER DENGAN ENDPOINT API & STATIC FILES
// ==========================================
const server = http.createServer(async (req, res) => {
  // Parsing URL
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost:3000"}`);
  let pathname = decodeURI(parsedUrl.pathname);

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Endpoint Cek Status AI: GET /api/ai/status
  if (req.method === "GET" && pathname === "/api/ai/status") {
    const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.LLM_API_KEY);
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      aktif: true,
      provider: hasKey ? "Google Gemini Free Tier" : "GERAK Local Smart Engine",
      hasApiKey: hasKey,
      pesan: hasKey ? "Gemini API terhubung aktif." : "Mode asisten cerdas lokal (tambahkan GEMINI_API_KEY di .env untuk integrasi cloud)."
    }));
    return;
  }

  // 2. Endpoint Chat GERAK AI: POST /api/ai/chat
  if (req.method === "POST" && pathname === "/api/ai/chat") {
    let bodyText = "";
    req.on("data", chunk => {
      bodyText += chunk;
      // Batasi payload maksimal 100KB
      if (bodyText.length > 102400) {
        res.writeHead(413, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ sukses: false, error: "Payload terlalu besar" }));
        req.destroy();
      }
    });

    req.on("end", async () => {
      try {
        const payload = JSON.parse(bodyText || "{}");
        const pesan = String(payload.message || "").trim();

        if (!pesan) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ sukses: false, error: "Pesan tidak boleh kosong" }));
          return;
        }

        // Batasi panjang pesan
        const pesanTervalidasi = pesan.slice(0, 1500);

        const hasil = await panggilGeminiAPI({
          pesan: pesanTervalidasi,
          riwayat: payload.history || [],
          konteks: payload.context || {},
          userMode: payload.userMode || "guest",
          namaUser: payload.userName || ""
        });

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(hasil));
      } catch (err) {
        console.error("Error pada /api/ai/chat:", err);
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ sukses: false, error: "Gagal memproses pesan AI", detail: err.message }));
      }
    });
    return;
  }

  // 3. Static File Server
  if (pathname === "/" || pathname === "") {
    pathname = "/index.html";
  }

  const filePath = path.join(__dirname, pathname);

  // Jangan pernah kirim file tersembunyi (misalnya .env berisi kunci API Gemini)
  if (pathname.split("/").some(bagian => bagian.startsWith("."))) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
    return;
  }

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("403 Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<h2>404 - Halaman Tidak Ditemukan</h2><p><a href="/">Kembali ke Beranda GERAK</a></p>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    // Dukungan Range (potongan file): wajib untuk memutar video di Safari/iPhone
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    if (range) {
      const mulai = range[1] ? parseInt(range[1], 10) : Math.max(0, stats.size - parseInt(range[2] || "0", 10));
      const akhir = range[1] && range[2] ? Math.min(parseInt(range[2], 10), stats.size - 1) : stats.size - 1;
      if (mulai >= stats.size || mulai > akhir) {
        res.writeHead(416, { "Content-Range": `bytes */${stats.size}` });
        res.end();
        return;
      }
      res.writeHead(206, {
        "Content-Type": contentType,
        "Content-Range": `bytes ${mulai}-${akhir}/${stats.size}`,
        "Content-Length": akhir - mulai + 1,
        "Accept-Ranges": "bytes"
      });
      fs.createReadStream(filePath, { start: mulai, end: akhir }).pipe(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Accept-Ranges": "bytes",
      "Access-Control-Allow-Origin": "*"
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.warn(`⚠️ Port ${PORT} sudah digunakan oleh proses lain.`);
    console.warn("Server GERAK kemungkinan sudah aktif di terminal sebelumnya.");
  } else {
    console.error("Terjadi error pada server:", err);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  const url = `http://localhost:${PORT}`;
  console.log("==================================================");
  console.log("  🏃 GERAK. — Platform Kesehatan Inklusif Gen Z");
  console.log("  🤖 Dilengkapi GERAK AI Contextual Assistant");
  console.log("==================================================");
  console.log(`  🌐 Website berjalan di : ${url}`);
  console.log("  💡 Tekan Ctrl + C di terminal ini untuk berhenti.");
  console.log("==================================================\n");

  // Buka browser hanya jika tidak diminta untuk skip
  if (!process.env.NO_AUTO_BROWSER) {
    exec(`start ${url}`);
  }
});