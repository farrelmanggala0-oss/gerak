// =========================================
// GERAK - data/edukasi-data.js
// Pusat Data Pembelajaran Kesehatan Terverifikasi Ilmiah
// Mencakup 20 Materi Lengkap, 100 Pertanyaan Quiz, 5 Mini Games,
// 14 Fakta Kesehatan Harian, dan 14 Tantangan Pengetahuan Harian
// =========================================

export const MATERI_EDUKASI = [
  // 1. Mengenal Gizi Seimbang
  {
    id: "materi-1",
    nomor: 1,
    judul: "Mengenal Gizi Seimbang",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "4 menit",
    ikon: "🥗",
    ringkasan: "Memahami fondasi piramida gizi seimbang yang menggantikan konsep lama 4 Sehat 5 Sempurna demi pemenuhan nutrisi holistik.",
    tujuanPembelajaran: [
      "Memahami perbedaan konsep Gizi Seimbang dengan 4 Sehat 5 Sempurna.",
      "Mengenal 4 pilar utama Pedoman Gizi Seimbang Kemenkes RI.",
      "Mampu menerapkan variasi makanan harian sesuai kebutuhan tubuh."
    ],
    penjelasanLengkap: `
      <h4>1. Dari 4 Sehat 5 Sempurna Menuju Gizi Seimbang</h4>
      <p>Konsep '4 Sehat 5 Sempurna' yang dicetuskan Prof. Poerwo Soedarmo pada tahun 1952 telah disempurnakan oleh Kementerian Kesehatan RI menjadi <strong>Pedoman Gizi Seimbang (PGS)</strong>. Mengapa? Karena konsep lama menekankan susu sebagai penyempurna tanpa memperhitungkan porsi, hidrasi, maupun aktivitas fisik harian.</p>
      
      <h4>2. Empat Pilar Utama Gizi Seimbang</h4>
      <p>Pedoman Gizi Seimbang berdiri di atas 4 pilar yang saling melengkapi:</p>
      <ul>
        <li><strong>Mengonsumsi anekaragam pangan:</strong> Tidak ada satu pun makanan tunggal yang mengandung seluruh zat gizi yang dibutuhkan tubuh secara sempurna (kecuali ASI untuk bayi 0-6 bulan).</li>
        <li><strong>Membiasakan perilaku hidup bersih:</strong> Mencuci tangan dengan sabun mencegah infeksi kuman yang mengganggu penyerapan gizi.</li>
        <li><strong>Melakukan aktivitas fisik teratur:</strong> Membantu memperlancar metabolisme, menjaga kebugaran jantung, dan menyeimbangkan energi masuk dan keluar.</li>
        <li><strong>Memantau berat badan secara teratur:</strong> Mempertahankan Indeks Massa Tubuh (IMT) dalam rentang normal (18,5 - 22,9 kg/m² untuk populasi Asia).</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Alih-alih makan mie instan dobel dengan nasi (karbohidrat ganda tanpa serat), tambahkan 1 butir telur rebus, segenggam sawi hijau, dan irisan tomat. Lengkapi dengan segelas air putih dan jalan santai 15 menit setelah makan.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Berdasarkan Riset Kesehatan Dasar (Riskesdas), lebih dari 95% penduduk Indonesia usia di atas 5 tahun masih kurang mengonsumsi sayur dan buah sesuai rekomendasi WHO (minimal 400 gram/hari).</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Gizi seimbang bukan tentang pembatasan makanan yang menyiksa, melainkan tentang harmoni antara porsi yang tepat, keragaman sumber pangan, kebersihan, dan gerak aktif setiap hari.</p>
      </div>
    `,
    referensi: {
      penulis: "Kementerian Kesehatan Republik Indonesia",
      judul: "Pedoman Gizi Seimbang (Permenkes No. 41 Tahun 2014)",
      institusi: "Kementerian Kesehatan RI",
      tahun: 2014,
      doi: null,
      pmid: null,
      url: "https://kesmas.kemkes.go.id/konten/133/0/pedoman-gizi-seimbang"
    },
    quiz: [
      {
        pertanyaan: "Mengapa konsep '4 Sehat 5 Sempurna' digantikan oleh 'Pedoman Gizi Seimbang'?",
        pilihan: [
          "Karena susu dianggap berbahaya bagi kesehatan",
          "Karena konsep lama tidak memperhitungkan proporsi porsi, hidrasi, dan aktivitas fisik",
          "Karena konsep gizi seimbang hanya diperuntukkan bagi atlet profesional",
          "Karena jumlah makanan yang dikonsumsi harus dikurangi hingga separuh"
        ],
        jawabanBenar: 1,
        penjelasan: "Pedoman Gizi Seimbang menyempurnakan 4 Sehat 5 Sempurna karena memasukkan perhitungan proporsi porsi makanan, kebutuhan air minum, perilaku hidup bersih, serta pentingnya aktivitas fisik."
      },
      {
        pertanyaan: "Manakah yang BUKAN merupakan salah satu dari 4 pilar Pedoman Gizi Seimbang?",
        pilihan: [
          "Mengonsumsi aneka ragam makanan",
          "Membiasakan perilaku hidup bersih",
          "Menghindari konsumsi lemak dan karbohidrat secara total",
          "Mempertahankan dan memantau berat badan normal"
        ],
        jawabanBenar: 2,
        penjelasan: "Menghindari lemak dan karbohidrat secara total adalah kekeliruan diet ekstrem. Tubuh tetap membutuhkan makronutrien tersebut dalam proporsi seimbang."
      },
      {
        pertanyaan: "Berapa batas rentang Indeks Massa Tubuh (IMT) normal untuk klasifikasi populasi Asia Pasifik (WHO/Kemenkes)?",
        pilihan: [
          "15,0 - 18,4 kg/m²",
          "18,5 - 22,9 kg/m²",
          "23,0 - 27,5 kg/m²",
          "28,0 - 32,0 kg/m²"
        ],
        jawabanBenar: 1,
        penjelasan: "Berdasarkan standar WHO Asia Pasifik dan Kemenkes RI, IMT normal berada pada rentang 18,5 hingga 22,9 kg/m²."
      },
      {
        pertanyaan: "Berapa anjuran minimal konsumsi sayur dan buah per hari menurut rekomendasi WHO?",
        pilihan: [
          "100 gram per hari",
          "250 gram per hari",
          "400 gram per hari",
          "800 gram per hari"
        ],
        jawabanBenar: 2,
        penjelasan: "WHO merekomendasikan konsumsi minimal 400 gram (setara 5 porsi) sayuran dan buah-buahan setiap hari untuk menurunkan risiko penyakit tidak menular."
      },
      {
        pertanyaan: "Mengapa makanan tunggal (kecuali ASI pada 6 bulan pertama) tidak dapat mencukupi seluruh kebutuhan gizi?",
        pilihan: [
          "Karena setiap jenis makanan memiliki profil zat gizi yang unik dan berbeda kelengkapannya",
          "Karena makanan padat tidak dapat dicerna oleh usus halus",
          "Karena enzim pencernaan manusia hanya mengenali satu jenis vitamin saja",
          "Karena metabolisme tubuh akan melambat bila makanan bervariasi"
        ],
        jawabanBenar: 0,
        penjelasan: "Tidak ada makanan tunggal dengan komposisi zat gizi sempurna. Variasi makanan menjamin pemenuhan vitamin, mineral, asam amino esensial, dan serat secara sinergis."
      }
    ]
  },

  // 2. Memahami Isi Piringku
  {
    id: "materi-2",
    nomor: 2,
    judul: "Memahami Isi Piringku",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "3 menit",
    ikon: "🍽️",
    ringkasan: "Panduan visual porsi satu kali makan dari Kemenkes RI untuk mencegah malnutrisi dan menjaga berat badan ideal.",
    tujuanPembelajaran: [
      "Mengetahui pembagian proporsi visual pada piring makan.",
      "Mengidentifikasi porsi makanan pokok, lauk pauk, sayuran, dan buah.",
      "Mengetahui anjuran konsumsi air putih dan cuci tangan sebelum makan."
    ],
    penjelasanLengkap: `
      <h4>1. Panduan Visual Isi Piringku</h4>
      <p>Jika satu piring bundar dibagi menjadi dua bagian sama besar:</p>
      <ul>
        <li><strong>Setengah piring pertama:</strong> Terdiri dari 2/3 makanan pokok (karbohidrat) dan 1/3 lauk-pauk (sumber protein).</li>
        <li><strong>Setengah piring kedua:</strong> Terdiri dari 2/3 sayur-sayuran dan 1/3 buah-buahan segar.</li>
      </ul>

      <h4>2. Pesan Pendamping Isi Piringku</h4>
      <p>Program GERMAS Kemenkes RI menekankan empat kebiasaan pendamping di setiap jam makan:</p>
      <ul>
        <li>Cuci tangan pakai sabun dengan air mengalir selama minimal 20 detik.</li>
        <li>Aktivitas fisik sedang minimal 30 menit setiap hari.</li>
        <li>Minum air putih minimal 8 gelas (±2 liter) per hari.</li>
        <li>Batasi konsumsi Gula, Garam, dan Lemak (G4-G1-L5 per hari).</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Bila menggunakan piring diameter 20 cm: isi 1 centong nasi merah/jagung (makanan pokok), 1 potong dada ayam bakar/ikan nila plus 1 potong tempe (lauk pauk), 1 mangkuk tumis kangkung toge (sayur), dan 1 buah pisang ambon (buah).</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Serat pada sayuran yang mengisi sepertiga piring memperlambat penyerapan glukosa ke aliran darah, mencegah lonjakan insulin mendadak yang memicu rasa kantuk setelah makan siang.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Isi Piringku adalah alat visual paling praktis tanpa perlu menimbang makanan dengan timbangan digital, membantu menjaga rasa kenyang lebih lama dan mengontrol kalori secara alami.</p>
      </div>
    `,
    referensi: {
      penulis: "Direktorat Promosi Kesehatan dan Pemberdayaan Masyarakat Kemenkes RI",
      judul: "Panduan Porsi Makan Isi Piringku untuk Hidup Sehat",
      institusi: "Kementerian Kesehatan RI",
      tahun: 2017,
      doi: null,
      pmid: null,
      url: "https://promkes.kemkes.go.id/isi-piringku"
    },
    quiz: [
      {
        pertanyaan: "Dalam konsep 'Isi Piringku', berapa proporsi sayuran pada setengah bagian piring sayur dan buah?",
        pilihan: [
          "1/4 bagian",
          "1/3 bagian",
          "2/3 bagian",
          "Seluruh setengah piring"
        ],
        jawabanBenar: 2,
        penjelasan: "Pada setengah piring khusus sayur dan buah, porsi sayuran menempati 2/3 bagian dan buah menempati 1/3 bagian sisanya."
      },
      {
        pertanyaan: "Pada setengah piring yang berisi makanan pokok dan lauk pauk, berapa porsi lauk pauk sumber protein?",
        pilihan: [
          "1/3 dari setengah piring",
          "2/3 dari setengah piring",
          "1/2 dari seluruh piring",
          "3/4 dari setengah piring"
        ],
        jawabanBenar: 0,
        penjelasan: "Lauk pauk sumber protein menempati 1/3 dari setengah piring, sedangkan makanan pokok menempati 2/3 bagiannya."
      },
      {
        pertanyaan: "Berapa anjuran batas maksimal harian konsumsi Gula, Garam, dan Lemak (GGL) dari Kemenkes RI?",
        pilihan: [
          "Gula 1 sdm, Garam 4 sdt, Lemak 10 sdm",
          "Gula 4 sdm (50g), Garam 1 sdt (2000mg natrium), Lemak 5 sdm (67g)",
          "Gula 8 sdm, Garam 3 sdt, Lemak Bebas",
          "Gula 10 sdt, Garam 5 sdt, Lemak 2 sdm"
        ],
        jawabanBenar: 1,
        penjelasan: "Pedoman Kemenkes RI merumuskan batasan G4-G1-L5: Gula maksimal 4 sendok makan (50 gram), Garam 1 sendok teh (2000 mg natrium), dan Lemak 5 sendok makan (67 gram) per orang per hari."
      },
      {
        pertanyaan: "Mengapa sayuran disarankan dikonsumsi dalam porsi lebih banyak daripada makanan pokok olahan?",
        pilihan: [
          "Sayuran tidak memiliki kalori sama sekali",
          "Sayuran kaya serat dan mikronutrien dengan densitas kalori rendah, memberi rasa kenyang tanpa kelebihan kalori",
          "Sayuran mempercepat penurunan massa otot",
          "Sayuran menghambat penyerapan protein dalam darah"
        ],
        jawabanBenar: 1,
        penjelasan: "Sayuran memiliki densitas energi rendah serta tinggi serat dan air, sehingga memperbesar volume makanan di lambung untuk memicu sinyal kenyang tanpa kalori berlebih."
      },
      {
        pertanyaan: "Apa kebiasaan higienis yang menjadi pesan kunci sebelum menyantap sajian Isi Piringku?",
        pilihan: [
          "Menyemprotkan parfum ke makanan",
          "Mencuci tangan pakai sabun dan air mengalir selama minimal 20 detik",
          "Meminum air es sebanyak 1 liter",
          "Berdiri selama 10 menit sebelum duduk makan"
        ],
        jawabanBenar: 1,
        penjelasan: "Mencuci tangan dengan sabun dan air mengalir adalah langkah sanitasi dasar untuk mencegah kontaminasi patogen ke saluran pencernaan."
      }
    ]
  },

  // 3. Karbohidrat sebagai Sumber Energi
  {
    id: "materi-3",
    nomor: 3,
    judul: "Karbohidrat sebagai Sumber Energi",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "4 menit",
    ikon: "🌾",
    ringkasan: "Mengenal jenis karbohidrat sederhana vs kompleks, indeks glikemik, dan perannya sebagai bahan bakar utama sel dan otak.",
    tujuanPembelajaran: [
      "Membedakan karbohidrat sederhana dan karbohidrat kompleks.",
      "Memahami konsep Indeks Glikemik (IG) dan pengaruhnya pada gula darah.",
      "Menentukan pilihan karbohidrat berkualitas tinggi untuk energi stabil."
    ],
    penjelasanLengkap: `
      <h4>1. Peran Biologis Karbohidrat</h4>
      <p>Karbohidrat dipecah di dalam tubuh menjadi glukosa, yang merupakan sumber bahan bakar utama bagi sistem saraf pusat, otak, dan sel darah merah. Setiap 1 gram karbohidrat menghasilkan energi sebesar <strong>4 kilokalori (kkal)</strong>.</p>

      <h4>2. Karbohidrat Sederhana vs Kompleks</h4>
      <ul>
        <li><strong>Karbohidrat Sederhana:</strong> Memiliki rantai molekul pendek (glukosa, fruktosa, sukrosa). Cepat diserap sehingga memicu lonjakan gula darah dan penurunan energi drastis (*sugar crash*). Contoh: gula pasir, sirup, permen, minuman bersoda.</li>
        <li><strong>Karbohidrat Kompleks:</strong> Memiliki rantai polisakarida panjang yang kaya serat. Dicerna secara perlahan, memberikan aliran energi stabil dan rasa kenyang bertahan lama. Contoh: beras merah, oatmeal, ubi jalar, singkong, roti gandum utuh.</li>
      </ul>

      <h4>3. Memahami Indeks Glikemik (IG)</h4>
      <p>Indeks Glikemik mengukur seberapa cepat suatu makanan menaikkan kadar glukosa darah dibandingkan dengan glukosa murni (skala 0 - 100). Makanan dengan IG rendah (< 55) sangat baik untuk manajemen berat badan dan pencegahan diabetes melitus tipe 2.</p>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Ganti sarapan lontong atau donat manis dengan semangkuk oatmeal yang diberi irisan pisang dan taburan biji chia. Kamu akan merasa bertenaga hingga jam makan siang tanpa rasa lemas di tengah kuliah atau kerja.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Otak manusia mengonsumsi sekitar 20% dari total energi glukosa tubuh setiap hari, meskipun berat otak hanya sekitar 2% dari total berat badan.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Karbohidrat bukanlah musuh yang harus dijauhi. Kuncinya adalah memilih karbohidrat kompleks berserat tinggi dan mengontrol porsinya sesuai tingkat aktivitas fisik harian.</p>
      </div>
    `,
    referensi: {
      penulis: "Slavin, J., & Carlson, J.",
      judul: "Carbohydrates",
      institusi: "Advances in Nutrition (American Society for Nutrition)",
      tahun: 2014,
      doi: "10.3945/an.114.006163",
      pmid: "25398736",
      url: "https://pubmed.ncbi.nlm.nih.gov/25398736/"
    },
    quiz: [
      {
        pertanyaan: "Berapa nilai energi yang dihasilkan oleh 1 gram karbohidrat di dalam tubuh?",
        pilihan: [
          "2 kkal",
          "4 kkal",
          "7 kkal",
          "9 kkal"
        ],
        jawabanBenar: 1,
        penjelasan: "Karbohidrat dan protein menghasilkan 4 kkal per gram, sedangkan lemak menghasilkan 9 kkal per gram."
      },
      {
        pertanyaan: "Apa karakteristik utama dari karbohidrat kompleks dibandingkan karbohidrat sederhana?",
        pilihan: [
          "Mengandung rantai kimia panjang dan kaya serat, sehingga dicerna lebih lambat",
          "Memiliki rasa yang jauh lebih manis di lidah",
          "Langsung diserap menjadi lemak dalam waktu 5 menit",
          "Tidak dapat diubah menjadi glukosa sama sekali"
        ],
        jawabanBenar: 0,
        penjelasan: "Karbohidrat kompleks memiliki susunan rantai molekul panjang serta serat pangan, sehingga dicerna secara perlahan dan menghasilkan pelepasan glukosa yang bertahap."
      },
      {
        pertanyaan: "Makanan dengan kategori Indeks Glikemik (IG) rendah memiliki nilai skala berapa?",
        pilihan: [
          "Di bawah 55",
          "Antara 56 sampai 69",
          "Di atas 70",
          "Tepat 100"
        ],
        jawabanBenar: 0,
        penjelasan: "Klasifikasi IG: Rendah (< 55), Sedang (56-69), dan Tinggi (≥ 70)."
      },
      {
        pertanyaan: "Apa organ tubuh yang mutlak membutuhkan glukosa sebagai bahan bakar energi primer utamanya?",
        pilihan: [
          "Kandung kemih",
          "Otak dan sel darah merah",
          "Tulang rawan",
          "Kuku dan rambut"
        ],
        jawabanBenar: 1,
        penjelasan: "Otak dan eritrosit (sel darah merah) bergantung pada pasokan glukosa konstan dari darah untuk menjalankan fungsi fisiologis normalnya."
      },
      {
        pertanyaan: "Manakah pilihan sumber karbohidrat di bawah ini yang paling direkomendasikan untuk kestabilan energi harian?",
        pilihan: [
          "Minuman teh manis boba",
          "Ubi jalar kukus dan oatmeal gandum utuh",
          "Permen jeli dan wafer cokelat",
          "Keripik singkong gurih digoreng minyak jelantah"
        ],
        jawabanBenar: 1,
        penjelasan: "Ubi jalar dan oatmeal merupakan karbohidrat kompleks kaya serat pangan, vitamin, dan mineral dengan IG rendah hingga sedang."
      }
    ]
  },

  // 4. Protein dan Fungsinya untuk Otot
  {
    id: "materi-4",
    nomor: 4,
    judul: "Protein dan Fungsinya untuk Otot",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "4 menit",
    ikon: "🥩",
    ringkasan: "Memahami asam amino esensial, peran protein dalam sintesis jaringan otot (MPS), dan rekomendasi asupan harian.",
    tujuanPembelajaran: [
      "Mengenal fungsi protein struktural dan enzimatis dalam tubuh.",
      "Memahami perbedaan protein hewani (lengkap) dan nabati.",
      "Menghitung estimasi kebutuhan protein harian berdasarkan berat badan."
    ],
    penjelasanLengkap: `
      <h4>1. Blok Pembangun Tubuh: Asam Amino</h4>
      <p>Protein tersusun atas 20 jenis asam amino. Sembilan di antaranya adalah <strong>asam amino esensial (EAA)</strong> yang tidak dapat disintesis oleh tubuh sendiri sehingga harus didapatkan dari makanan. Asam amino leusin secara khusus berperan sebagai sakelar biologis untuk memicu <em>Muscle Protein Synthesis (MPS)</em>.</p>

      <h4>2. Sumber Protein: Hewani vs Nabati</h4>
      <ul>
        <li><strong>Protein Hewani:</strong> Memiliki profil asam amino lengkap dan bioavailabilitas tinggi. Contoh: telur, dada ayam, ikan, daging sapi tanpa lemak, susu, yoghurt.</li>
        <li><strong>Protein Nabati:</strong> Sangat kaya serat, antioksidan, dan bebas kolesterol, namun beberapa sumber memiliki asam amino pembatas. Mengombinasikan berbagai sumber nabati (seperti tempe, tahu, kacang kedelai, kacang hijau, lentil) menghasilkan profil asam amino yang setara lengkap.</li>
      </ul>

      <h4>3. Kebutuhan Protein Harian</h4>
      <p>Pedoman umum menyarankan:</p>
      <ul>
        <li>Orang dewasa sedentari (kurang aktif): <strong>0,8 - 1,0 gram/kg berat badan/hari</strong>.</li>
        <li>Individu aktif / olahraga ketahanan (kardio): <strong>1,2 - 1,4 gram/kg berat badan/hari</strong>.</li>
        <li>Latihan beban / pembentukan otot: <strong>1,6 - 2,2 gram/kg berat badan/hari</strong>.</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Untuk berat badan 60 kg yang rutin olahraga beban, kebutuhan proteinnya sekitar 96–120 gram per hari. Bagilah ke dalam 3-4 kali makan: sarapan 2 butir telur (12g), makan siang 100g dada ayam (31g), camilan segenggam kedelai edamame (17g), dan makan malam 100g ikan tuna (28g) serta 2 potong tempe (10g).</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Telur utuh sering dijadikan standar emas (*biological value* = 100) dalam evaluasi kualitas protein karena rasio asam aminonya sangat efisien diserap dan dimanfaatkan tubuh manusia.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Protein esensial tidak hanya bagi binaragawan, tetapi bagi siapa saja yang ingin menjaga imunitas, mempercepat penyembuhan luka, serta mencegah hilangnya massa otot (*sarcopenia*) seiring bertambahnya usia.</p>
      </div>
    `,
    referensi: {
      penulis: "Morton, R. W., et al.",
      judul: "A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults",
      institusi: "British Journal of Sports Medicine",
      tahun: 2018,
      doi: "10.1136/bjsports-2017-097608",
      pmid: "28698222",
      url: "https://pubmed.ncbi.nlm.nih.gov/28698222/"
    },
    quiz: [
      {
        pertanyaan: "Berapa jumlah asam amino esensial yang wajib didapatkan manusia dari asupan makanan?",
        pilihan: [
          "4 jenis",
          "9 jenis",
          "15 jenis",
          "20 jenis"
        ],
        jawabanBenar: 1,
        penjelasan: "Dari 20 jenis asam amino pembentuk protein tubuh, terdapat 9 asam amino esensial yang tidak dapat diproduksi sendiri oleh tubuh manusia."
      },
      {
        pertanyaan: "Asam amino manakah yang berfungsi sebagai pemicu utama sinyal Muscle Protein Synthesis (MPS)?",
        pilihan: [
          "Glukosa",
          "Leusin",
          "Alanin",
          "Kreatinin"
        ],
        jawabanBenar: 1,
        penjelasan: "Leusin adalah asam amino rantai cabang (BCAA) yang mengaktifkan jalur mTOR untuk memulai proses sintesis protein otot."
      },
      {
        pertanyaan: "Berapa kisaran asupan protein harian yang direkomendasikan untuk individu yang rutin latihan beban untuk hipertrofi otot?",
        pilihan: [
          "0,2 - 0,4 g/kg berat badan",
          "0,8 - 1,0 g/kg berat badan",
          "1,6 - 2,2 g/kg berat badan",
          "4,0 - 5,5 g/kg berat badan"
        ],
        jawabanBenar: 2,
        penjelasan: "Meta-analisis Morton et al. (BJSM, 2018) menunjukkan bahwa asupan protein 1,6 hingga 2,2 gram per kilogram berat badan per hari mengoptimalkan adaptasi massa dan kekuatan otot."
      },
      {
        pertanyaan: "Bagaimana cara vegetarian atau vegan mendapatkan profil asam amino lengkap dari sumber pangan nabati?",
        pilihan: [
          "Hanya makan buah apel saja setiap hari",
          "Mengombinasikan aneka sumber nabati, misalnya biji-bijian dengan kacang-kacangan (seperti nasi dengan tempe/tahu)",
          "Memasak makanan dengan minyak berulang kali",
          "Mengonsumsi gula tebu cair dalam jumlah besar"
        ],
        jawabanBenar: 1,
        penjelasan: "Kombinasi komplementer pangan nabati (misal serealia yang kaya metionin namun rendah lisin digabung dengan polong-polongan yang kaya lisin) melengkapi kebutuhan asam amino esensial."
      },
      {
        pertanyaan: "Selain untuk pembentukan massa otot, apa fungsi vital protein lainnya di dalam tubuh manusia?",
        pilihan: [
          "Membentuk antibodi sistem kekebalan tubuh, enzim, dan hormon",
          "Menyimpan lemak visceral di rongga perut",
          "Menghentikan denyut jantung saat istirahat",
          "Menghalangi penyerapan air di usus besar"
        ],
        jawabanBenar: 0,
        penjelasan: "Protein merupakan penyusun enzim biologis, hormon pertumbuhan/insulin, sel darah merah (hemoglobin), serta imunoglobulin (antibodi) penjaga imunitas."
      }
    ]
  },

  // 5. Lemak Baik dan Lemak yang Perlu Dibatasi
  {
    id: "materi-5",
    nomor: 5,
    judul: "Lemak Baik dan Lemak yang Perlu Dibatasi",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Menengah",
    estimasiWaktu: "4 menit",
    ikon: "🥑",
    ringkasan: "Membedakan lemak tak jenuh ganda/tunggal, lemak jenuh, dan bahaya lemak trans bagi pembuluh darah dan kesehatan jantung.",
    tujuanPembelajaran: [
      "Mengenal klasifikasi lemak tak jenuh (MUFA/PUFA), lemak jenuh, dan lemak trans.",
      "Mengetahui dampak masing-masing jenis lemak terhadap kolesterol LDL dan HDL.",
      "Menentukan sumber lemak sehat dalam menu makanan harian."
    ],
    penjelasanLengkap: `
      <h4>1. Lemak Tidak Harus Ditakuti</h4>
      <p>Lemak adalah makronutrien penting dengan densitas energi <strong>9 kkal per gram</strong>. Lemak dibutuhkan untuk penyerapan vitamin larut lemak (A, D, E, K), isolasi termal, produksi membran sel, dan sintesis hormon steroid (termasuk testosteron dan estrogen).</p>

      <h4>2. Peta Jenis Lemak</h4>
      <ul>
        <li><strong>Lemak Sehat (Tak Jenuh Tunggal & Ganda - MUFA/PUFA):</strong> Menurunkan kolesterol jahat (LDL) dan meningkatkan profil lipid sehat. Termasuk di dalamnya asam lemak Omega-3 yang anti-inflamasi. Sumber: alpukat, minyak zaitun, kacang almond, biji chia, ikan berlemak (kembung, salmon, sarden).</li>
        <li><strong>Lemak Jenuh (*Saturated Fat*):</strong> Perlu dikonsumsi secara bijak (maksimal < 10% dari total kalori harian menurut WHO). Sumber: santan pekat, daging berlemak, mentega, minyak kelapa sawit.</li>
        <li><strong>Lemak Trans (*Trans Fat*):</strong> Lemak buatan hasil hidrogenasi parsial minyak nabati. Sangat berbahaya karena menaikkan LDL sekaligus menurunkan HDL. Sumber: margarin padat murah, gorengan dengan minyak teroksidasi berkali-kali, biskuit/pastry industri.</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Ikan kembung lokal Indonesia memiliki kandungan Omega-3 yang setara atau bahkan lebih tinggi daripada ikan salmon impor dengan harga jauh lebih terjangkau. Masaklah dengan cara dikukus, dipepes, atau dipanggang alih-alih digoreng terendam minyak jelantah.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>WHO meluncurkan inisiatif global REPLACE untuk mengeliminasi lemak trans industri dari rantai pasokan makanan dunia karena menyebabkan lebih dari 500.000 kematian akibat penyakit kardiovaskular setiap tahunnya.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Gantilah sumber lemak jenuh dan lemak trans dengan lemak tak jenuh ramah jantung. Jangan hilangkan lemak sama sekali dari piring makanmu!</p>
      </div>
    `,
    referensi: {
      penulis: "Sacks, F. M., et al. (American Heart Association)",
      judul: "Dietary Fats and Cardiovascular Disease: A Presidential Advisory From the American Heart Association",
      institusi: "Circulation",
      tahun: 2017,
      doi: "10.1161/CIR.0000000000000510",
      pmid: "28619997",
      url: "https://pubmed.ncbi.nlm.nih.gov/28619997/"
    },
    quiz: [
      {
        pertanyaan: "Berapa energi yang dihasilkan oleh 1 gram lemak di dalam tubuh manusia?",
        pilihan: [
          "4 kkal",
          "7 kkal",
          "9 kkal",
          "12 kkal"
        ],
        jawabanBenar: 2,
        penjelasan: "Lemak adalah makronutrien paling padat energi, menghasilkan 9 kkal per gram (lebih dari dua kali lipat karbohidrat atau protein)."
      },
      {
        pertanyaan: "Jenis lemak manakah yang paling berbahaya bagi kesehatan kardiovaskular karena menaikkan kolesterol jahat (LDL) sekaligus menurunkan kolesterol baik (HDL)?",
        pilihan: [
          "Lemak tak jenuh tunggal (MUFA)",
          "Asam lemak Omega-3",
          "Lemak trans industri (trans fat)",
          "Minyak zaitun extra virgin"
        ],
        jawabanBenar: 2,
        penjelasan: "Lemak trans industri secara konsisten terbukti merusak rasio kolesterol darah dengan meningkatkan LDL dan menekan HDL, mempercepat aterosklerosis."
      },
      {
        pertanyaan: "Vitamin apa sajakah yang penyerapan biologisnya dalam usus mutlak memerlukan kehadiran lemak?",
        pilihan: [
          "Vitamin B kompleks dan Vitamin C",
          "Vitamin A, D, E, dan K",
          "Vitamin B12 dan Asam Folat",
          "Kalsium dan Kalium"
        ],
        jawabanBenar: 1,
        penjelasan: "Vitamin A, D, E, dan K adalah kelompok vitamin larut lemak (fat-soluble vitamins) yang memerlukan misel lemak untuk diserap oleh dinding usus."
      },
      {
        pertanyaan: "Ikan lokal Indonesia manakah yang kaya akan asam lemak Omega-3 alami dan sangat ramah di kantong?",
        pilihan: [
          "Ikan kembung",
          "Ikan asin peda kering",
          "Ikan sapu-sapu",
          "Kerupuk ikan tenggiri bakar"
        ],
        jawabanBenar: 0,
        penjelasan: "Ikan kembung (mackerel) memiliki kandungan EPA dan DHA (Omega-3) yang sangat tinggi, bahkan menyaingi salmon impor dengan harga ekonomis."
      },
      {
        pertanyaan: "Berapa batas maksimal anjuran asupan lemak jenuh menurut panduan kesehatan jantung WHO dan AHA?",
        pilihan: [
          "Kurang dari 10% dari total kalori harian",
          "Minimal 60% dari total kalori harian",
          "Tepat 0 gram (dilarang mutlak)",
          "Bebas tanpa batasan asalkan minum air jeruk hangat"
        ],
        jawabanBenar: 0,
        penjelasan: "WHO dan AHA menganjurkan asupan asam lemak jenuh tidak melebihi 7-10% dari total kebutuhan kalori harian untuk melindungi kesehatan pembuluh darah."
      }
    ]
  },

  // 6. Vitamin dan Mineral yang Dibutuhkan Tubuh
  {
    id: "materi-6",
    nomor: 6,
    judul: "Vitamin dan Mineral yang Dibutuhkan Tubuh",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Menengah",
    estimasiWaktu: "4 menit",
    ikon: "🍊",
    ringkasan: "Eksplorasi mikronutrien esensial: peran zat besi mencegah anemia, kalsium dan vitamin D untuk tulang, serta seng dan vitamin C untuk kekebalan.",
    tujuanPembelajaran: [
      "Mengenal fungsi mikronutrien esensial (vitamin dan mineral).",
      "Memahami pentingnya zat besi bagi remaja dan atlet untuk mencegah anemia.",
      "Mengidentifikasi sumber makanan kaya vitamin dan mineral alami."
    ],
    penjelasanLengkap: `
      <h4>1. Mikronutrien: Kecil Namun Berdampak Masif</h4>
      <p>Berbeda dengan makronutrien, tubuh hanya membutuhkan vitamin dan mineral dalam jumlah miligram (mg) atau mikrogram (mcg). Namun, ketiadaan mikronutrien esensial dapat memicu malfungsi seluler, penurunan kekebalan, hingga gangguan kognitif.</p>

      <h4>2. Vitamin Larut Air vs Larut Lemak</h4>
      <ul>
        <li><strong>Larut Air (Vitamin C & B-Kompleks):</strong> Tidak disimpan dalam jumlah besar di tubuh; kelebihannya dibuang melalui urin. Harus dikonsumsi teratur setiap hari.</li>
        <li><strong>Larut Lemak (Vitamin A, D, E, K):</strong> Disimpan dalam jaringan hati dan lemak tubuh. Berperan dalam penglihatan (A), penyerapan kalsium (D), antioksidan pelindung sel (E), dan pembekuan darah (K).</li>
      </ul>

      <h4>3. Mineral Vital: Zat Besi, Kalsium, & Seng</h4>
      <p>Zat besi adalah inti molekul hemoglobin pembawa oksigen ke otot dan otak. Defisiensi zat besi menyebabkan anemia, letih kronis, dan penurunan konsentrasi belajar. Kalsium bersama vitamin D membentuk kepadatan matriks tulang, sementara seng (zinc) krusial untuk regenerasi sel imun.</p>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Untuk memaksimalkan penyerapan zat besi non-heme (dari sayuran hijau atau tempe), konsumsilah bersamaan dengan sumber vitamin C (seperti perasan jeruk nipis, jambu biji, atau tomat). Hindari minum teh atau kopi pekat tepat saat jam makan karena tanin menghambat penyerapan zat besi hingga 60%.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Sinar matahari pagi di Indonesia memicu sintesis Vitamin D3 alami di kulit melalui konversi 7-dehidrokolesterol saat terkena paparan sinar ultraviolet B (UVB).</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Dapatkan vitamin dan mineral dari variasi pangan alami berwarna-warni (*eat the rainbow*) sebelum memutuskan mengonsumsi suplemen dosis tinggi.</p>
      </div>
    `,
    referensi: {
      penulis: "Shenkin, A.",
      judul: "Micronutrients in health and disease",
      institusi: "Postgraduate Medical Journal",
      tahun: 2006,
      doi: "10.1136/pgmj.2006.047670",
      pmid: "16954450",
      url: "https://pubmed.ncbi.nlm.nih.gov/16954450/"
    },
    quiz: [
      {
        pertanyaan: "Manakah kelompok vitamin berikut yang larut dalam air dan tidak disimpan lama di dalam tubuh?",
        pilihan: [
          "Vitamin A dan Vitamin D",
          "Vitamin C dan Vitamin B-Kompleks",
          "Vitamin E dan Vitamin K",
          "Kalsium dan Kalium"
        ],
        jawabanBenar: 1,
        penjelasan: "Vitamin C dan seluruh keluarga vitamin B larut dalam air; kelebihannya diekskresikan melalui urine sehingga perlu diasup secara kontinu dari makanan harian."
      },
      {
        pertanyaan: "Mineral apakah yang berperan utama sebagai komponen inti hemoglobin untuk mengikat dan mendistribusikan oksigen ke seluruh sel tubuh?",
        pilihan: [
          "Kalsium",
          "Zat Besi (Fe)",
          "Natrium",
          "Fluorida"
        ],
        jawabanBenar: 1,
        penjelasan: "Zat besi adalah mineral mikro esensial penyusun heme dalam hemoglobin dan mioglobin yang mengikat molekul oksigen."
      },
      {
        pertanyaan: "Mengapa disarankan tidak langsung meminum teh kental atau kopi saat mengonsumsi makanan kaya zat besi?",
        pilihan: [
          "Karena teh dan kopi mengandung senyawa tanin dan polifenol yang mengikat zat besi sehingga menghambat penyerapannya",
          "Karena teh dapat mengubah zat besi menjadi racun berbahaya",
          "Karena kopi menghancurkan sel darah merah seketika",
          "Karena suhu air teh membakar vitamin di lambung"
        ],
        jawabanBenar: 0,
        penjelasan: "Senyawa tanin pada teh dan asam klorogenat pada kopi membentuk kompleks yang tidak larut dengan zat besi, mengurangi bioavailabilitasnya di usus halus."
      },
      {
        pertanyaan: "Kombinasi nutrisi manakah yang terbukti secara sinergis meningkatkan penyerapan zat besi dari sumber nabati (non-heme)?",
        pilihan: [
          "Zat besi dikonsumsi bersama Vitamin C (asam askorbat)",
          "Zat besi dikonsumsi bersama minyak jelantah",
          "Zat besi dikonsumsi bersama air soda",
          "Zat besi dikonsumsi bersama suplemen kalsium dosis tinggi"
        ],
        jawabanBenar: 0,
        penjelasan: "Vitamin C mereduksi ion feri (Fe3+) menjadi fero (Fe2+) yang jauh lebih mudah larut dan diserap oleh epitel mukosa duodenum."
      },
      {
        pertanyaan: "Vitamin apakah yang disintesis di kulit manusia dengan bantuan paparan sinar ultraviolet B (UVB) matahari?",
        pilihan: [
          "Vitamin A",
          "Vitamin B12",
          "Vitamin D",
          "Vitamin C"
        ],
        jawabanBenar: 2,
        penjelasan: "Sinar UVB memicu konversi 7-dehidrokolesterol di epidermis kulit menjadi previtamin D3, yang kemudian dihidroksilasi di hati dan ginjal menjadi bentuk aktif kalsitriol."
      }
    ]
  },

  // 7. Pentingnya Serat untuk Pencernaan
  {
    id: "materi-7",
    nomor: 7,
    judul: "Pentingnya Serat untuk Pencernaan",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "3 menit",
    ikon: "🥦",
    ringkasan: "Mengapa serat larut dan tidak larut krusial untuk mikrobioma usus, pencegahan sembelit, dan stabilisasi kolesterol darah.",
    tujuanPembelajaran: [
      "Membedakan serat larut air (*soluble fiber*) dan serat tidak larut air (*insoluble fiber*).",
      "Memahami peran serat sebagai prebiotik bagi bakteri baik usus (*gut microbiota*).",
      "Mengetahui target asupan serat harian (25 - 30 gram/hari)."
    ],
    penjelasanLengkap: `
      <h4>1. Apa Itu Serat Pangan?</h4>
      <p>Serat pangan adalah bagian dari karbohidrat tanaman yang tidak dapat dicerna oleh enzim saluran pencernaan manusia. Meskipun tidak menyumbang kalori signifikan, serat memiliki manfaat fisiologis luar biasa dari mulut hingga usus besar.</p>

      <h4>2. Dua Jenis Serat dan Fungsinya</h4>
      <ul>
        <li><strong>Serat Larut Air (*Soluble Fiber*):</strong> Menyerap air dan membentuk gel kental di lambung. Berfungsi memperlambat pengosongan lambung, menurunkan kolesterol darah dengan mengikat asam empedu, dan menstabilkan gula darah. Contoh: oatmeal, kacang-kacangan, apel, jeruk, wortel.</li>
        <li><strong>Serat Tidak Larut Air (*Insoluble Fiber*):</strong> Menambah massa feses dan mempercepat waktu transit sisa pencernaan di usus besar, mencegah konstipasi/sembelit. Contoh: bekatul gandum, kulit buah, sayuran hijau, beras merah.</li>
      </ul>

      <h4>3. Pakan bagi Mikrobioma Usus</h4>
      <p>Bakteri baik di usus besar memfermentasi serat larut menjadi <em>Short-Chain Fatty Acids (SCFA)</em> seperti butirat, asetat, dan propionat. SCFA memberi makan sel dinding kolon, meredakan peradangan sistemik, dan memperkuat sumbu usus-otak (*gut-brain axis*).</p>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Konsumsi apel beserta kulitnya (setelah dicuci bersih), tambahkan satu porsi sayur bening bayam jagung di piring makan, dan ganti camilan keripik gurih dengan kacang edamame rebus.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Kajian meta-analisis di jurnal bergengsi <em>The Lancet</em> menunjukkan bahwa setiap peningkatan 8 gram asupan serat harian berkaitan dengan penurunan risiko penyakit kardiovaskular dan diabetes tipe 2 sebesar 15-27%.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Penuhi target 25-30 gram serat per hari secara bertahap disertai minum air putih yang cukup agar feses tetap lunak dan pencernaan bekerja lancar.</p>
      </div>
    `,
    referensi: {
      penulis: "Reynolds, A., et al.",
      judul: "Carbohydrate quality and human health: a series of systematic reviews and meta-analyses",
      institusi: "The Lancet",
      tahun: 2019,
      doi: "10.1016/S0140-6736(18)31809-9",
      pmid: "30638909",
      url: "https://pubmed.ncbi.nlm.nih.gov/30638909/"
    },
    quiz: [
      {
        pertanyaan: "Berapa target asupan serat harian yang dianjurkan untuk orang dewasa menurut pedoman kesehatan?",
        pilihan: [
          "5 - 10 gram per hari",
          "25 - 30 gram per hari",
          "70 - 80 gram per hari",
          "150 gram per hari"
        ],
        jawabanBenar: 1,
        penjelasan: "Rekomendasi asupan serat harian orang dewasa berkisar antara 25 sampai 30 gram per hari untuk menjaga fungsi usus dan metabolisme yang sehat."
      },
      {
        pertanyaan: "Bagaimana cara kerja serat larut air (soluble fiber) dalam membantu menurunkan kadar kolesterol darah?",
        pilihan: [
          "Membakar kolesterol menggunakan panas lambung",
          "Membentuk gel yang mengikat asam empedu di usus sehingga diekskresikan, memaksa hati menggunakan kolesterol darah untuk membuat empedu baru",
          "Menyumbat pembuluh darah agar kolesterol tidak mengalir",
          "Mengubah kolesterol menjadi vitamin C"
        ],
        jawabanBenar: 1,
        penjelasan: "Serat larut mengikat asam empedu di lumen usus dan mengeluarkannya lewat feses. Hati kemudian menarik kolesterol dari sirkulasi darah untuk memproduksi asam empedu pengganti."
      },
      {
        pertanyaan: "Senyawa bermanfaat apa yang dihasilkan bakteri usus ketika memfermentasi serat larut pangan?",
        pilihan: [
          "Asam lemak rantai pendek (Short-Chain Fatty Acids / SCFA)",
          "Batu ginjal kalsium",
          "Asam laktat berlebih",
          "Gula rafinasi"
        ],
        jawabanBenar: 0,
        penjelasan: "Fermentasi serat oleh mikrobiota usus menghasilkan SCFA (asetat, propionat, butirat) yang menutrisi sel epitel kolon dan menekan inflamasi."
      },
      {
        pertanyaan: "Manakah jenis serat yang berfungsi utama menambah volume feses dan mencegah sembelit?",
        pilihan: [
          "Serat tidak larut air (insoluble fiber)",
          "Lemak trans",
          "Sirup jagung tinggi fruktosa",
          "Kolesterol ester"
        ],
        jawabanBenar: 0,
        penjelasan: "Serat tidak larut (seperti selulosa dan lignin) tidak larut dalam air, menambah massa feses, dan merangsang gerakan peristaltik usus."
      },
      {
        pertanyaan: "Apa yang penting diperhatikan saat meningkatkan asupan serat harian agar tidak mengalami kembung atau kram perut?",
        pilihan: [
          "Menghindari minum air putih seharian",
          "Meningkatkan asupan serat secara bertahap dan mengimbanginya dengan minum air putih yang cukup",
          "Hanya mengonsumsi makanan yang digoreng garing",
          "Tidur terlentang selama 12 jam setelah makan"
        ],
        jawabanBenar: 1,
        penjelasan: "Penambahan serat secara tiba-tiba tanpa hidrasi cukup dapat menyebabkan gas dan kembung. Naikkan konsumsi secara bertahap bersama hidrasi yang memadai."
      }
    ]
  },

  // 8. Memahami Kalori dan Kebutuhan Energi
  {
    id: "materi-8",
    nomor: 8,
    judul: "Memahami Kalori dan Kebutuhan Energi",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Menengah",
    estimasiWaktu: "4 menit",
    ikon: "🔥",
    ringkasan: "Membongkar misteri BMR, TDEE, defisit kalori, dan surplus kalori berdasarkan hukum termodinamika energi manusia.",
    tujuanPembelajaran: [
      "Mengetahui definisi kalori dan komponen Total Daily Energy Expenditure (TDEE).",
      "Memahami perbedaan Basal Metabolic Rate (BMR) dengan aktivitas fisik harian.",
      "Menerapkan prinsip defisit atau surplus kalori secara aman dan berkelanjutan."
    ],
    penjelasanLengkap: `
      <h4>1. Apa Sebenarnya Kalori Itu?</h4>
      <p>Kalori adalah satuan unit energi. Satu kilokalori (kkal) didefinisikan sebagai jumlah panas yang dibutuhkan untuk menaikkan suhu 1 kilogram air sebesar 1 derajat Celcius. Tubuh kita membutuhkan kalori untuk bernapas, memompa darah, berpikir, dan bergerak.</p>

      <h4>2. Komponen Pengeluaran Energi Harian (TDEE)</h4>
      <p>Total pengeluaran energi harian (TDEE) terbagi menjadi 4 komponen utama:</p>
      <ul>
        <li><strong>BMR (Basal Metabolic Rate, ~60-70%):</strong> Energi minimum untuk menjaga fungsi organ vital saat istirahat total.</li>
        <li><strong>NEAT (Non-Exercise Activity Thermogenesis, ~15%):</strong> Energi dari gerak spontan harian (berjalan, naik tangga, mengetik, gelisah).</li>
        <li><strong>TEF (Thermic Effect of Food, ~10%):</strong> Energi yang digunakan tubuh untuk mencerna, menyerap, dan mengolah makanan. Protein memiliki TEF tertinggi (20-30%).</li>
        <li><strong>EAT (Exercise Activity Thermogenesis, ~5-10%):</strong> Energi yang dibakar saat olahraga terstruktur.</li>
      </ul>

      <h4>3. Keseimbangan Energi: Defisit, Jaga, & Surplus</h4>
      <ul>
        <li><strong>Defisit Kalori:</strong> Asupan kalori < Pengeluaran kalori (digunakan untuk menurunkan berat badan/lemak). Defisit moderat yang aman: 300 - 500 kkal/hari.</li>
        <li><strong>Pemeliharaan (Maintenance):</strong> Asupan kalori = Pengeluaran kalori.</li>
        <li><strong>Surplus Kalori:</strong> Asupan kalori > Pengeluaran kalori (digunakan untuk pembentukan massa otot bersama latihan beban). Surplus moderat yang aman: 250 - 400 kkal/hari.</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Jika TDEE kamu 2.000 kkal/hari dan ingin memangkas lemak secara sehat tanpa kelaparan ekstrem, targetkan asupan kalori harian di kisaran 1.500 - 1.700 kkal. Jangan pernah memotong kalori di bawah angka BMR (misal makan hanya 500 kkal) karena dapat merusak fungsi metabolisme dan memicu kerontokan rambut serta hilangnya otot.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Meningkatkan NEAT (seperti memilih berdiri saat menelepon dan berjalan kaki 8.000 langkah) seringkali membakar lebih banyak total kalori harian dibandingkan sesi gym 45 menit jika sisa hari dihabiskan hanya berbaring di kasur.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Manajemen berat badan bertumpu pada keseimbangan energi jangka panjang. Pilihlah defisit atau surplus yang bertahap agar hasilnya bertahan seumur hidup.</p>
      </div>
    `,
    referensi: {
      penulis: "Hall, K. D., et al.",
      judul: "Energy balance and its components: implications for body weight regulation",
      institusi: "The American Journal of Clinical Nutrition",
      tahun: 2012,
      doi: "10.3945/ajcn.112.036350",
      pmid: "22434603",
      url: "https://pubmed.ncbi.nlm.nih.gov/22434603/"
    },
    quiz: [
      {
        pertanyaan: "Komponen pengeluaran energi harian manakah yang menyumbang porsi terbesar (sekitar 60-70%) dari Total Daily Energy Expenditure (TDEE)?",
        pilihan: [
          "Exercise Activity Thermogenesis (EAT / olahraga)",
          "Basal Metabolic Rate (BMR / metabolisme basal)",
          "Thermic Effect of Food (TEF)",
          "Peregangan otot malam hari"
        ],
        jawabanBenar: 1,
        penjelasan: "BMR menyumbang 60-70% total pengeluaran energi untuk membiayai kelangsungan hidup organ vital (jantung, otak, paru-paru, hati, ginjal)."
      },
      {
        pertanyaan: "Makronutrien manakah yang memiliki Efek Termik Makanan (Thermic Effect of Food / TEF) paling tinggi (20-30%)?",
        pilihan: [
          "Lemak jenuh",
          "Protein",
          "Karbohidrat sederhana",
          "Gula pasir"
        ],
        jawabanBenar: 1,
        penjelasan: "Tubuh memerlukan sekitar 20-30% kalori protein hanya untuk memecah dan memproses asam aminonya, menjadikannya makronutrien dengan efek termik tertinggi."
      },
      {
        pertanyaan: "Berapa batas defisit kalori moderat yang dianjurkan per hari agar penurunan berat badan sehat dan tidak merusak metabolisme?",
        pilihan: [
          "50 - 100 kkal per hari",
          "300 - 500 kkal per hari",
          "1.500 - 2.000 kkal per hari",
          "Tidak makan sama sekali selama seminggu"
        ],
        jawabanBenar: 1,
        penjelasan: "Defisit kalori 300-500 kkal/hari memungkinkan penurunan massa lemak sekitar 0,3-0,5 kg per minggu secara berkelanjutan tanpa mengikis jaringan otot atau memperlambat metabolisme."
      },
      {
        pertanyaan: "Apa kepanjangan dari NEAT yang menyumbang pengeluaran kalori aktivitas non-olahraga?",
        pilihan: [
          "New Energy Aerobic Training",
          "Non-Exercise Activity Thermogenesis",
          "Natural Energy Acid Transport",
          "Nutrition Evaluation And Tracking"
        ],
        jawabanBenar: 1,
        penjelasan: "NEAT adalah Non-Exercise Activity Thermogenesis, yaitu kalori yang terbakar dari seluruh gerakan non-olahraga sepanjang hari (berjalan, membersihkan rumah, mengetik, dsb)."
      },
      {
        pertanyaan: "Apa risiko utama menerapkan diet terlalu ekstrem dengan asupan kalori jauh di bawah BMR dalam jangka panjang?",
        pilihan: [
          "Kepadatan tulang meningkat pesat",
          "Penurunan massa otot, gangguan keseimbangan hormon tiroid/reproduksi, dan metabolisme melambat (adaptasi metabolik drastis)",
          "Kekuatan otot melonjak dua kali lipat",
          "Tubuh menjadi kebal terhadap flu"
        ],
        jawabanBenar: 1,
        penjelasan: "Defisit kalori ekstrem memicu adaptasi metabolik defensif: katabolisme otot, penurunan hormon leptin dan hormon tiroid, letih kronis, serta rebound berat badan cepat."
      }
    ]
  },

  // 9. Mitos dan Fakta Seputar Diet
  {
    id: "materi-9",
    nomor: 9,
    judul: "Mitos dan Fakta Seputar Diet",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "4 menit",
    ikon: "🧐",
    ringkasan: "Membongkar mitos populer: makan malam bikin gemuk, air es membekukan lemak, detoks jus, dan pantangan makan karbohidrat.",
    tujuanPembelajaran: [
      "Mengidentifikasi kekeliruan umum (*fad diets*) dalam pola makan populer.",
      "Memahami dasar ilmiah di balik waktu makan dan total asupan kalori.",
      "Mengadopsi pola pikir kritis terhadap klaim kesehatan sensasional di media sosial."
    ],
    penjelasanLengkap: `
      <h4>1. Membedakan Fakta Ilmiah vs Mitos Populer</h4>
      <p>Industri diet sering kali mempromosikan aturan ekstrem yang tidak memiliki landasan bukti ilmiah kuat demi menjual produk suplemen atau teh pelangsing cepat saji.</p>

      <h4>2. Fakta di Balik 4 Mitos Paling Umum</h4>
      <ul>
        <li><strong>Mitos 1: "Makan di atas jam 8 malam otomatis jadi lemak."</strong><br>
        <em>Fakta:</em> Tubuh tidak memiliki jam weker yang otomatis mengubah kalori malam menjadi lemak. Kenaikan berat badan ditentukan oleh total asupan kalori harian vs pengeluaran energi, bukan waktu pada jarum jam. Yang sering bermasalah adalah camilan malam yang padat gula/lemak saat bersantai di depan layar.</li>
        <li><strong>Mitos 2: "Minum air es bisa membekukan lemak di perut."</strong><br>
        <em>Fakta:</em> Suhu air yang masuk ke lambung segera disesuaikan oleh tubuh dengan suhu inti (±37°C). Air dingin tidak dapat membekukan lemak makanan menjadi gumpalan di lambung.</li>
        <li><strong>Mitos 3: "Detoks jus buah membersihkan racun tubuh."</strong><br>
        <em>Fakta:</em> Tubuh manusia sudah memiliki sistem detoksifikasi alami paling canggih: organ <strong>hati (liver)</strong> dan <strong>ginjal</strong>. Diet jus ekstrem justru membuang serat dan menyebabkan lonjakan gula darah tinggi.</li>
        <li><strong>Mitos 4: "Semua karbohidrat bikin gemuk dan harus dihindari."</strong><br>
        <em>Fakta:</em> Berat badan naik akibat kelebihan total kalori, bukan karbohidrat secara inheren. Karbohidrat kompleks berserat tinggi justru penting untuk energi otak dan performa fisik.</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Jika kamu lapar jam 9 malam setelah pulang lembur atau belajar, pilihlah makanan bergizi ringan seperti 1 mangkuk kecil yoghurt plain dengan potongan buah atau sebutir telur rebus, tanpa rasa bersalah berlebih.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Studi klinis skala besar DIETFITS oleh Universitas Stanford (JAMA, 2018) membandingkan diet rendah lemak vs diet rendah karbohidrat selama 12 bulan dan menyimpulkan tidak ada perbedaan penurunan berat badan yang signifikan selama kualitas makanan dijaga dan terjadi defisit kalori seimbang.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Pola makan terbaik bukanlah diet yang paling populer di TikTok, melainkan pola makan bergizi seimbang yang bisa kamu pertahankan secara konsisten selama bertahun-tahun.</p>
      </div>
    `,
    referensi: {
      penulis: "Gardner, C. D., et al.",
      judul: "Effect of Low-Fat vs Low-Carbohydrate Diet on 12-Month Weight Loss in Overweight Adults: The DIETFITS Randomized Clinical Trial",
      institusi: "JAMA (Journal of the American Medical Association)",
      tahun: 2018,
      doi: "10.1001/jama.2018.0245",
      pmid: "29466592",
      url: "https://pubmed.ncbi.nlm.nih.gov/29466592/"
    },
    quiz: [
      {
        pertanyaan: "Apakah minum air es atau air dingin saat makan dapat membekukan lemak di dalam lambung manusia?",
        pilihan: [
          "Ya, lemak langsung mengeras dan menjadi plak usus",
          "Mitos, karena suhu cairan di lambung segera dihangatkan oleh tubuh hingga mencapai suhu inti ±37°C",
          "Ya, hanya jika dicampur dengan es batu kristal",
          "Mitos, karena lemak berubah menjadi gas hidrogen"
        ],
        jawabanBenar: 1,
        penjelasan: "Secara fisiologis lambung dan organ dalam manusia bertindak sebagai termostat yang segera menghangatkan air minum ke suhu fisiologis 37°C."
      },
      {
        pertanyaan: "Apa organ utama dalam tubuh manusia yang bertugas melakukan detoksifikasi racun secara alami setiap hari?",
        pilihan: [
          "Jus buah bit dan lemon",
          "Hati (liver) dan ginjal",
          "Kelenjar ludah",
          "Usus buntu"
        ],
        jawabanBenar: 1,
        penjelasan: "Hati menyaring dan menetralkan xenobiotik/toksin lewat fase 1 dan 2 enzimatis, sedangkan ginjal membuang residu produk sampingan lewat urine."
      },
      {
        pertanyaan: "Apa faktor penentu paling dominan dalam naik atau turunnya berat badan seseorang menurut bukti ilmiah?",
        pilihan: [
          "Waktu makan tepat jam 6 sore",
          "Keseimbangan total kalori masuk dibandingkan total kalori keluar dalam jangka waktu konsisten",
          "Apakah makanan dimakan dengan sendok atau garpu",
          "Golongan darah pemilik tubuh"
        ],
        jawabanBenar: 1,
        penjelasan: "Hukum pertama termodinamika mengatur keseimbangan energi: perubahan massa tubuh merupakan fungsi dari selisih energi yang dikonsumsi dan energi yang dikeluarkan."
      },
      {
        pertanyaan: "Berdasarkan uji klinis acak DIETFITS (JAMA, 2018), bagaimana hasil perbandingan penurunan berat badan antara diet rendah lemak vs diet rendah karbohidrat?",
        pilihan: [
          "Diet rendah karbohidrat menurunkan berat badan 10 kali lebih cepat secara permanen",
          "Kedua kelompok mencapai penurunan berat badan yang setara ketika asupan kalori terkontrol dan kualitas makanan ditingkatkan",
          "Kelompok rendah lemak mengalami penambahan lemak tubuh drastis",
          "Kedua diet terbukti berbahaya bagi manusia"
        ],
        jawabanBenar: 1,
        penjelasan: "Penelitian DIETFITS membuktikan bahwa kedua pendekatan diet menghasilkan penurunan berat badan yang tidak berbeda bermakna selama kepatuhan dan defisit energi setara."
      },
      {
        pertanyaan: "Mengapa jus detoks kemasan sering kali bukan pilihan terbaik untuk menggantikan porsi makanan utuh?",
        pilihan: [
          "Karena jus buah buang serat pangan berharga dan meninggalkan konsentrasi gula bebas tinggi yang cepat diserap",
          "Karena jus buah mengandung racun timbal murni",
          "Karena tubuh manusia tidak bisa mencerna vitamin dalam cairan",
          "Karena rasa buah asli dilarang oleh dokter"
        ],
        jawabanBenar: 0,
        penjelasan: "Proses pemerasan jus memisahkan ampas serat, menyisakan fruktosa cair bebas yang memicu lonjakan gula darah dan rasa lapar cepat kembali."
      }
    ]
  },

  // 10. Nutrisi untuk Bulking yang Sehat
  {
    id: "materi-10",
    nomor: 10,
    judul: "Nutrisi untuk Bulking yang Sehat",
    kategori: "Gizi dan Nutrisi",
    tingkatKesulitan: "Lanjutan",
    estimasiWaktu: "5 menit",
    ikon: "💪",
    ringkasan: "Strategi lean bulking: surplus kalori terkontrol, pembagian makronutrien, dan pencegahan penimbunan lemak berlebih saat menambah otot.",
    tujuanPembelajaran: [
      "Membedakan 'lean bulking' vs 'dirty bulking'.",
      "Menghitung surplus kalori yang ideal untuk penambahan massa otot tanpa lemak.",
      "Mengatur jadwal makan dan nutrisi peri-workout (sebelum dan sesudah latihan)."
    ],
    penjelasanLengkap: `
      <h4>1. Filosofi Bulking: Membangun Otot, Bukan Menimbun Lemak</h4>
      <p>Banyak pemula melakukan <em>'dirty bulking'</em> dengan memakan makanan cepat saji apapun dalam jumlah raksasa. Hasilnya? Kenaikan berat badan cepat yang 80%-nya merupakan lemak tubuh (*fat mass*), bukan otot murni (*lean body mass*). Pendekatan ilmiah yang direkomendasikan adalah <strong>Lean Bulking</strong>.</p>

      <h4>2. Aturan Emas Lean Bulking</h4>
      <ul>
        <li><strong>Surplus Kalori Terkontrol:</strong> Cukup tambahkan <strong>250 - 400 kkal di atas TDEE</strong> harianmu (surplus sekitar 10-15%). Ini memberi bahan baku energi cukup untuk sintesis protein tanpa kelebihan lemak berlebih.</li>
        <li><strong>Protein Optimal:</strong> 1,6 - 2,2 gram protein per kg berat badan per hari, dibagi ke dalam 4 kali makan yang berjarak 3-4 jam.</li>
        <li><strong>Karbohidrat sebagai Penggerak Latihan:</strong> 4 - 6 gram/kg BB untuk mengisi kembali cadangan glikogen otot yang terkuras saat sesi latihan beban intens.</li>
        <li><strong>Lemak Sehat:</strong> 0,8 - 1,2 gram/kg BB untuk menjaga kestabilan hormon anabolik seperti testosteron.</li>
      </ul>

      <h4>3. Nutrisi Pra dan Pasca Latihan</h4>
      <p>Konsumsilah makanan berkarbohidrat dan berprotein 1-2 jam sebelum latihan (misal pisang dan telur rebus atau oatmeal susu). Setelah latihan, konsumsilah makanan kaya protein lengkap (20-30 gram) dan karbohidrat untuk menghentikan katabolisme otot dan mempercepat resintesis glikogen.</p>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Bila TDEE pemeliharaanmu 2.200 kkal, targetkan asupan bulking di 2.500 kkal. Tambahan 300 kkal bisa didapatkan dari 2 sendok makan selai kacang alami di atas 2 lembar roti gandum panggang plus segelas susu kedelai.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Laju maksimal penambahan massa otot alami pada pria pemula berkisar antara 0,5 - 1 kg otot per bulan pada tahun pertama latihan, dan pada wanita sekitar 0,25 - 0,5 kg per bulan. Mengharapkan kenaikan otot 5 kg dalam sebulan secara alami adalah mitos.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Otot membutuhkan waktu, stimulasi mekanis progresif (*progressive overload*), surplus kalori moderat, dan tidur nyenyak. Sabar dan konsisten adalah kunci utama.</p>
      </div>
    `,
    referensi: {
      penulis: "Iraki, J., et al.",
      judul: "Nutrition Recommendations for Bodybuilders in the Off-Season: A Narrative Review",
      institusi: "Sports (MDPI)",
      tahun: 2019,
      doi: "10.3390/sports7070154",
      pmid: "31247944",
      url: "https://pubmed.ncbi.nlm.nih.gov/31247944/"
    },
    quiz: [
      {
        pertanyaan: "Berapa kisaran surplus kalori harian yang ideal untuk program lean bulking agar penambahan lemak tubuh minimal?",
        pilihan: [
          "50 - 80 kkal per hari",
          "250 - 400 kkal per hari",
          "1.200 - 1.500 kkal per hari",
          "5.000 kkal per hari"
        ],
        jawabanBenar: 1,
        penjelasan: "Surplus moderat 250-400 kkal per hari (atau 10-15% di atas TDEE) memberikan energi yang cukup untuk anabolisme otot tanpa penimbunan lemak subkutan berlebihan."
      },
      {
        pertanyaan: "Mengapa metode 'dirty bulking' (makan junk food berkalori masif tanpa batas) tidak disarankan secara medis?",
        pilihan: [
          "Karena membuat otot tumbuh terlalu cepat dalam hitungan jam",
          "Karena mayoritas kenaikan berat badan berupa lemak visceral dan lemak subkutan serta meningkatkan risiko resistensi insulin",
          "Karena menurunkan kadar protein dalam darah secara mendadak",
          "Karena membuat tulang mengecil"
        ],
        jawabanBenar: 1,
        penjelasan: "Surplus kalori raksasa dari makanan ultra-proses menimbun lemak berlebih, mengganggu sensitivitas insulin, dan memperburuk profil lipid darah."
      },
      {
        pertanyaan: "Berapa laju pertambahan massa otot alami murni yang realistis bagi seorang pemula pria pada tahun pertama latihan beban teratur?",
        pilihan: [
          "0,5 - 1,0 kg otot per bulan",
          "5 - 7 kg otot per bulan",
          "15 kg otot per bulan",
          "Otot manusia tidak bisa bertambah sama sekali"
        ],
        jawabanBenar: 0,
        penjelasan: "Secara fisiologis natural, laju sintesis miofibrilar maksimal rata-rata hanya memungkinkan penambahan 0,5 - 1,0 kg jaringan otot murni per bulan bagi pemula."
      },
      {
        pertanyaan: "Apa fungsi utama karbohidrat pasca-latihan (post-workout meal) dalam program bulking?",
        pilihan: [
          "Menggantikan glikogen otot yang terkuras dan merangsang insulin untuk mempercepat transpor asam amino ke sel otot",
          "Mengikis jaringan otot yang baru dilatih",
          "Menyebabkan dehidrasi pada serat otot",
          "Menghentikan kerja jantung sementara"
        ],
        jawabanBenar: 0,
        penjelasan: "Karbohidrat pasca-latihan mengisi kembali glikogen otot dan memicu lonjakan insulin ringan yang bersifat anti-katabolik."
      },
      {
        pertanyaan: "Berapa rentang target asupan protein harian yang direkomendasikan dalam tinjauan nutrisi binaraga off-season (Iraki et al., 2019)?",
        pilihan: [
          "0,5 - 0,7 g/kg berat badan",
          "1,6 - 2,2 g/kg berat badan",
          "3,5 - 5,0 g/kg berat badan",
          "10 g/kg berat badan"
        ],
        jawabanBenar: 1,
        penjelasan: "Konsensus ilmiah merekomendasikan 1,6 - 2,2 g/kg berat badan/hari sebagai ambang batas optimal pembentukan otot pada fase surplus kalori."
      }
    ]
  },

  // 11. Manfaat Aktivitas Fisik bagi Tubuh
  {
    id: "materi-11",
    nomor: 11,
    judul: "Manfaat Aktivitas Fisik bagi Tubuh",
    kategori: "Olahraga dan Kebugaran",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "4 menit",
    ikon: "🏃",
    ringkasan: "Panduan rekomendasi WHO 150–300 menit per minggu dan dampak holistik gerak aktif pada kardiovaskular, metabolisme, dan otak.",
    tujuanPembelajaran: [
      "Mengetahui rekomendasi durasi aktivitas fisik mingguan menurut WHO.",
      "Memahami dampak olahraga terhadap kesehatan endotel pembuluh darah dan sensitivitas insulin.",
      "Mengenal pelepasan neurotransmiter (endorfin, dopamin, BDNF) dari olahraga."
    ],
    penjelasanLengkap: `
      <h4>1. Tubuh Manusia Diciptakan untuk Bergerak</h4>
      <p>Gaya hidup sedentari (banyak duduk) telah diklasifikasikan oleh Organisasi Kesehatan Dunia (WHO) sebagai salah satu faktor risiko kematian global terdepan. Bergerak aktif bukan sekadar soal membakar kalori, melainkan stimulasi biologis esensial bagi seluruh sistem organ.</p>

      <h4>2. Rekomendasi Global WHO</h4>
      <p>Untuk orang dewasa usia 18–64 tahun, pedoman WHO (2020) merekomendasikan:</p>
      <ul>
        <li>Minimal <strong>150 - 300 menit aktivitas aerobik intensitas sedang</strong> per minggu (seperti jalan cepat, bersepeda santai), ATAU</li>
        <li>Minimal <strong>75 - 150 menit aktivitas aerobik intensitas berat</strong> per minggu (seperti lari, lompat tali, renang cepat).</li>
        <li>Disertai <strong>latihan penguatan otot</strong> yang melibatkan kelompok otot utama minimal <strong>2 hari dalam seminggu</strong>.</li>
      </ul>

      <h4>3. Manfaat Multidimensi</h4>
      <ul>
        <li><strong>Kardiovaskular:</strong> Menurunkan tekanan darah istirahat, menguatkan daya pompa miokardium jantung, dan melenturkan pembuluh arteri.</li>
        <li><strong>Metabolisme:</strong> Memicu translokasi GLUT-4 di sel otot, memungkinkan glukosa masuk ke sel tanpa tergantung penuh pada insulin (mencegah diabetes tipe 2).</li>
        <li><strong>Kesehatan Otak:</strong> Merangsang sekresi <em>Brain-Derived Neurotrophic Factor (BDNF)</em> yang menumbuhkan neuron baru dan melindungi memori.</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Bagi 150 menit menjadi 30 menit per hari selama 5 hari (Senin sampai Jumat). Cukup jalan cepat berkeliling kampus atau komplek rumah di pagi atau sore hari.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Berjalan kaki 30 menit sehari menurunkan risiko penyakit jantung koroner hingga 19% dan stroke hingga 24% dibandingkan mereka yang tidak aktif sama sekali.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Gerak adalah obat terbaik tanpa resep dokter (*Exercise is Medicine*). Sedikit aktivitas selalu lebih baik daripada tidak sama sekali!</p>
      </div>
    `,
    referensi: {
      penulis: "Bull, F. C., et al. (WHO Guidelines)",
      judul: "World Health Organization 2020 guidelines on physical activity and sedentary behaviour",
      institusi: "British Journal of Sports Medicine",
      tahun: 2020,
      doi: "10.1136/bjsports-2020-102955",
      pmid: "33239350",
      url: "https://pubmed.ncbi.nlm.nih.gov/33239350/"
    },
    quiz: [
      {
        pertanyaan: "Berapa durasi minimal aktivitas fisik intensitas sedang yang direkomendasikan WHO per minggu untuk orang dewasa?",
        pilihan: [
          "30 menit per minggu",
          "60 menit per minggu",
          "150 - 300 menit per minggu",
          "1.000 menit per minggu"
        ],
        jawabanBenar: 2,
        penjelasan: "WHO merekomendasikan 150-300 menit aktivitas aerobik intensitas sedang (atau 75-150 menit intensitas berat) per minggu untuk orang dewasa."
      },
      {
        pertanyaan: "Berapa hari dalam seminggu orang dewasa disarankan melakukan latihan penguatan otot menurut panduan WHO?",
        pilihan: [
          "Minimal 2 hari per minggu",
          "Hanya 1 kali sebulan",
          "Harus 7 hari berturut-turut tanpa istirahat",
          "Tidak perlu latihan otot sama sekali"
        ],
        jawabanBenar: 0,
        penjelasan: "Pedoman WHO menganjurkan latihan penguatan otot seluruh tubuh minimal 2 hari atau lebih dalam seminggu."
      },
      {
        pertanyaan: "Zat neurokimiawi apakah yang dipicu pelepasannya oleh olahraga dan berperan merangsang neurogenesis (kelangsungan hidup sel saraf otak)?",
        pilihan: [
          "Brain-Derived Neurotrophic Factor (BDNF)",
          "Bilirubin",
          "Asam urat",
          "Kortisol berlebih"
        ],
        jawabanBenar: 0,
        penjelasan: "BDNF diproduksi secara signifikan saat latihan fisik, mendukung plastisitas sinaptik, pembelajaran, dan memori di hipokampus otak."
      },
      {
        pertanyaan: "Bagaimana aktivitas fisik secara langsung membantu menurunkan kadar gula darah pada pasien pra-diabetes atau diabetes?",
        pilihan: [
          "Otot yang berkontraksi menyerap glukosa darah melalui translokasi GLUT-4 secara independen tanpa tergantung penuh pada insulin",
          "Olahraga membakar pankreas sehingga tidak memproduksi gula",
          "Olahraga mengeluarkan glukosa langsung melalui keringat kulit",
          "Olahraga mengubah gula darah menjadi gas oksigen"
        ],
        jawabanBenar: 0,
        penjelasan: "Kontraksi mekanis otot memicu translokasi transporter glukosa GLUT-4 ke membran sel, menarik glukosa darah ke dalam otot secara mandiri."
      },
      {
        pertanyaan: "Apakah berjalan santai atau naik tangga termasuk ke dalam aktivitas yang membawa manfaat kesehatan?",
        pilihan: [
          "Tidak, hanya angkat beban berat di gym yang dianggap bermanfaat",
          "Ya, prinsip 'setiap gerakan bermakna' (every move counts) menegaskan bahwa aktivitas fisik ringan pun menurunkan risiko sedentari",
          "Hanya jika dilakukan dengan menahan napas",
          "Tidak ada bukti ilmiah jalan kaki bermanfaat bagi manusia"
        ],
        jawabanBenar: 1,
        penjelasan: "WHO menegaskan slogan 'Every move counts': segala bentuk aktivitas fisik yang memutus kebiasaan duduk lama berkontribusi positif bagi kesehatan metabolisme."
      }
    ]
  },

  // 12. Prinsip FITT dalam Olahraga
  {
    id: "materi-12",
    nomor: 12,
    judul: "Prinsip FITT dalam Olahraga",
    kategori: "Olahraga dan Kebugaran",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "4 menit",
    ikon: "⏱️",
    ringkasan: "Membedah formula Frequency, Intensity, Time, dan Type dari American College of Sports Medicine (ACSM) untuk merancang latihan terstruktur.",
    tujuanPembelajaran: [
      "Memahami kepanjangan dan definisi dari 4 pilar FITT.",
      "Menggunakan 'Talk Test' dan denyut nadi untuk memonitor intensitas latihan.",
      "Merancang program latihan mingguan pribadi dengan kaidah FITT."
    ],
    penjelasanLengkap: `
      <h4>1. Mengapa Perlu Kerangka FITT?</h4>
      <p>Berolahraga tanpa rencana sering membuat pemula kelelahan berlebih di minggu pertama lalu berhenti sama sekali. Formula <strong>FITT</strong> yang dirumuskan oleh <em>American College of Sports Medicine (ACSM)</em> adalah peta jalan ilmiah untuk mencapai progres kebugaran secara bertahap dan terukur.</p>

      <h4>2. Empat Komponen FITT</h4>
      <ul>
        <li><strong>F - Frequency (Frekuensi):</strong> Seberapa sering kamu berlatih dalam seminggu. Contoh: 3–4 hari per minggu untuk kardio/otot pemula.</li>
        <li><strong>I - Intensity (Intensitas):</strong> Seberapa keras tubuhmu bekerja selama sesi. Diukur dengan denyut jantung target (% MHR = 220 - usia) atau tes bicara (*Talk Test*). Pada intensitas sedang, kamu masih bisa berbicara beberapa patah kata tetapi tidak bisa bernyanyi.</li>
        <li><strong>T - Time (Waktu/Durasi):</strong> Berapa lama sesi latihan berlangsung. Pemula disarankan 30–45 menit per sesi (termasuk pemanasan dan pendinginan).</li>
        <li><strong>T - Type (Jenis Latihan):</strong> Bentuk aktivitas yang dipilih (aerobik jalan cepat, resistance training beban tubuh, latihan fleksibilitas yoga).</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Contoh resep FITT untuk mahasiswa pemula: Frekuensi 3 kali seminggu (Senin, Rabu, Jumat); Intensitas sedang (denyut nadi 120-140 bpm); Waktu 35 menit per sesi; Tipe gabungan kalistenik (push-up lutut, squat, glute bridge) dan jalan cepat.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Prinsip FITT digunakan oleh para fisioterapis dan kardiologis di seluruh dunia dalam program rehabilitasi jantung pasca-operasi untuk memulihkan kapasitas fungsional pasien secara aman.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Sesuaikan variabel FITT satu per satu. Bila ingin menambah durasi (Time), jangan menaikkan intensitas (Intensity) secara bersamaan agar terhindar dari cedera otot.</p>
      </div>
    `,
    referensi: {
      penulis: "Garber, C. E., et al. (ACSM Position Stand)",
      judul: "Quantity and Quality of Exercise for Developing and Maintaining Cardiorespiratory, Musculoskeletal, and Neuromotor Fitness in Apparently Healthy Adults",
      institusi: "Medicine & Science in Sports & Exercise",
      tahun: 2011,
      doi: "10.1249/MSS.0b013e318213fefb",
      pmid: "21694556",
      url: "https://pubmed.ncbi.nlm.nih.gov/21694556/"
    },
    quiz: [
      {
        pertanyaan: "Apa kepanjangan dari akronim prinsip latihan FITT?",
        pilihan: [
          "Fitness, Interval, Toughness, Technique",
          "Frequency, Intensity, Time, Type",
          "Fast, Intense, Timing, Target",
          "Form, Incline, Tension, Tempo"
        ],
        jawabanBenar: 1,
        penjelasan: "FITT adalah singkatan baku dari Frequency (Frekuensi), Intensity (Intensitas), Time (Waktu/Durasi), dan Type (Jenis Latihan)."
      },
      {
        pertanyaan: "Bagaimana cara melakukan 'Talk Test' untuk memastikan latihan berada pada intensitas sedang (moderate intensity)?",
        pilihan: [
          "Kamu masih dapat berbicara dalam kalimat pendek tetapi tidak bisa bernyanyi dengan lancar",
          "Kamu tidak bisa mengeluarkan suara sama sekali karena sesak napas parah",
          "Kamu bisa bernyanyi lagu seriosa dengan nada tinggi tanpa bernapas",
          "Kamu tertidur pulas saat bergerak"
        ],
        jawabanBenar: 0,
        penjelasan: "Talk Test intensitas sedang: pola pernapasan meningkat sehingga kamu masih sanggup mengobrol dalam frasa pendek namun ritme nafas tidak memungkinkan bernyanyi santai."
      },
      {
        pertanyaan: "Berapa estimasi Denyut Jantung Maksimal (Max Heart Rate) kasar untuk seseorang yang berusia 20 tahun menggunakan rumus Fox (220 - Usia)?",
        pilihan: [
          "150 bpm",
          "180 bpm",
          "200 bpm",
          "220 bpm"
        ],
        jawabanBenar: 2,
        penjelasan: "Rumus estimasi sederhana denyut jantung maksimal: 220 - Usia. Untuk usia 20 tahun: 220 - 20 = 200 denyut per menit (bpm)."
      },
      {
        pertanyaan: "Jika seorang pemula ingin meningkatkan beban latihannya, aturan keselamatan apa yang paling tepat dalam memodifikasi FITT?",
        pilihan: [
          "Tingkatkan frekuensi, intensitas, dan durasi secara serentak hingga batas kelelahan",
          "Ubah salah satu variabel saja secara bertahap (misal naikkan Time dulu sebelum menambah Intensity)",
          "Langsung lompat ke intensitas maksimal tanpa pemanasan",
          "Gandakan beban latihan setiap 2 hari sekali"
        ],
        jawabanBenar: 1,
        penjelasan: "Prinsip overload progresif aman menganjurkan memodifikasi satu variabel FITT secara bertahap (aturan 10%) untuk memberi waktu sendi dan ligamen beradaptasi."
      },
      {
        pertanyaan: "Contoh latihan manakah yang masuk ke dalam kategori variabel 'Type' fleksibilitas dan mobilitas sendi?",
        pilihan: [
          "Sprint tanjakan 100 meter",
          "Yoga dinamis dan peregangan statis",
          "Angkat barbel deadlift 100 kg",
          "Lompat tali cepat 1.000 kali"
        ],
        jawabanBenar: 1,
        penjelasan: "Yoga, pilates, dan peregangan terstruktur termasuk dalam tipe latihan fleksibilitas dan mobilitas (neuromotor exercise)."
      }
    ]
  },

  // 13. Pemanasan dan Pendinginan yang Benar
  {
    id: "materi-13",
    nomor: 13,
    judul: "Pemanasan dan Pendinginan yang Benar",
    kategori: "Olahraga dan Kebugaran",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "3 menit",
    ikon: "🧘",
    ringkasan: "Mengapa peregangan dinamis wajib sebelum latihan dan peregangan statis saat pendinginan untuk mencegah kram dan DOMS.",
    tujuanPembelajaran: [
      "Membedakan peregangan dinamis (*dynamic stretching*) dan statis (*static stretching*).",
      "Memahami fungsi pemanasan dalam menaikkan suhu jaringan dan viskositas cairan sinovial sendi.",
      "Menerapkan pendinginan untuk membantu pembersihan laktat dan stabilisasi sirkulasi vena."
    ],
    penjelasanLengkap: `
      <h4>1. Pemanasan: Mempersiapkan Sistem Tubuh</h4>
      <p>Melompat langsung ke latihan berat tanpa pemanasan ibarat menancap gas mobil dalam kondisi oli mesin beku. Pemanasan (5–10 menit) bertujuan menaikkan suhu inti tubuh, meningkatkan elastisitas otot, melumasi sendi dengan cairan sinovial, dan mengaktifkan sistem saraf motorik.</p>

      <h4>2. Aturan Peregangan: Dinamis vs Statis</h4>
      <ul>
        <li><strong>Sebelum Latihan: Peregangan Dinamis (*Dynamic Stretch*):</strong> Gerakan aktif terkontrol melalui rentang gerak penuh tanpa menahan posisi diam lama. Contoh: leg swings, arm circles, lunges dengan rotasi torso, butt kicks. Studi membuktikan peregangan statis lama sebelum angkat beban justru dapat menurunkan kekuatan ledak otot hingga 5-8%.</li>
        <li><strong>Setelah Latihan: Peregangan Statis (*Static Stretch*):</strong> Menahan posisi regangan otot secara rileks selama 15–30 detik saat otot masih hangat. Membantu mengembalikan panjang istirahat serat otot dan menenangkan sistem saraf simpatik.</li>
      </ul>

      <h4>3. Pendinginan: Menghindari Pengendapan Darah</h4>
      <p>Menghentikan lari mendadak lalu langsung duduk dapat menyebabkan darah mengendap di ekstremitas bawah (*venous pooling*), memicu pusing atau pingsan. Pendinginan berupa jalan pelan selama 3-5 menit menjaga pompa otot vena bekerja hingga denyut jantung kembali normal.</p>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Sebelum jogging: lakukan 10 kali walking lunges, 15 kali high knees, dan 10 kali ankle rotations. Setelah selesai jogging: lakukan jalan santai 3 menit, lalu regangkan paha depan (quadriceps stretch) dan betis (calf stretch) selama 20 detik per sisi.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Cairan sinovial di sendi lutut dan bahu menjadi lebih encer dan licin ketika suhu jaringan naik 1-2 derajat Celcius saat pemanasan, mengurangi gesekan antar-tulang rawan secara drastis.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Jangan pernah memotong jatah 5 menit pemanasan dinamis dan 5 menit pendinginan. Keduanya adalah asuransi terbaikmu dari cedera otot!</p>
      </div>
    `,
    referensi: {
      penulis: "Behm, D. G., et al.",
      judul: "Acute effects of muscle stretching on physical performance, range of motion, and injury incidence in healthy active individuals: a systematic review",
      institusi: "Applied Physiology, Nutrition, and Metabolism",
      tahun: 2016,
      doi: "10.1139/apnm-2015-0235",
      pmid: "26642915",
      url: "https://pubmed.ncbi.nlm.nih.gov/26642915/"
    },
    quiz: [
      {
        pertanyaan: "Jenis peregangan manakah yang paling direkomendasikan dilakukan SEBELUM sesi olahraga intensif?",
        pilihan: [
          "Peregangan statis ditahan selama 2 menit tanpa bergerak",
          "Peregangan dinamis aktif dengan gerakan terkontrol",
          "Duduk diam membungkuk hingga kepala menyentuh lantai",
          "Tidak perlu bergerak sama sekali"
        ],
        jawabanBenar: 1,
        penjelasan: "Peregangan dinamis mengaktifkan jalur neuromuskular, melancarkan sirkulasi, dan meningkatkan suhu jaringan tanpa menurunkan performa kekuatan puncak."
      },
      {
        pertanyaan: "Mengapa peregangan statis berdurasi lama (>60 detik per otot) tidak dianjurkan dilakukan tepat sebelum latihan beban maksimal?",
        pilihan: [
          "Karena dapat menurunkan kekakuan tendon (*tendon stiffness*) dan kapasitas tenaga ledak otot secara sementara",
          "Karena menyebabkan tulang patah seketika",
          "Karena membakar seluruh cadangan glukosa otak",
          "Karena membuat tubuh mengantuk dan tertidur"
        ],
        jawabanBenar: 0,
        penjelasan: "Tinjauan sistematis membuktikan peregangan statis berkepanjangan sebelum latihan menurunkan sensitivitas refleks regang dan menurunkan output tenaga ledak sebesar 5-8%."
      },
      {
        pertanyaan: "Apa risiko fisiologis utama jika kamu tiba-tiba berhenti dari lari cepat intensitas tinggi lalu langsung duduk atau berbaring tanpa pendinginan?",
        pilihan: [
          "Darah mengendap di pembuluh vena kaki (*venous pooling*) sehingga pasokan darah ke otak berkurang mendadak, memicu pusing atau pingsan",
          "Otot kaki langsung membesar dua kali lipat",
          "Kadar hemoglobin melonjak tajam",
          "Paru-paru berhenti bekerja selamanya"
        ],
        jawabanBenar: 0,
        penjelasan: "Pendinginan aktif menjaga pompa otot skelet bekerja mendorong aliran balik vena (*venous return*) ke jantung dan otak, mencegah hipotensi ortostatik."
      },
      {
        pertanyaan: "Berapa lama durasi ideal menahan satu posisi peregangan statis saat fase pendinginan setelah berolahraga?",
        pilihan: [
          "1 sampai 2 detik",
          "15 sampai 30 detik",
          "15 menit tanpa bernapas",
          "1 jam penuh"
        ],
        jawabanBenar: 1,
        penjelasan: "Rentang waktu 15 hingga 30 detik per posisi regangan statis terbukti efektif dalam memulihkan fleksibilitas jaringan tanpa memicu refleks kejang otot."
      },
      {
        pertanyaan: "Cairan pelumas alami apakah yang viskositasnya menjadi lebih encer dan licin ketika sendi dihangatkan saat pemanasan?",
        pilihan: [
          "Cairan getah bening",
          "Cairan sinovial (*synovial fluid*)",
          "Cairan serebrospinal",
          "Air empedu"
        ],
        jawabanBenar: 1,
        penjelasan: "Cairan sinovial disekresikan oleh membran sinovial ke dalam rongga sendi; pemanasan mengencerkannya sehingga melumasi tulang rawan artikular secara optimal."
      }
    ]
  },

  // 14. Perbedaan Kardio dan Strength Training
  {
    id: "materi-14",
    nomor: 14,
    judul: "Perbedaan Kardio dan Strength Training",
    kategori: "Olahraga dan Kebugaran",
    tingkatKesulitan: "Menengah",
    estimasiWaktu: "4 menit",
    ikon: "⚡",
    ringkasan: "Memahami adaptasi sistem kardiorespirasi vs otot-tulang, mitos kardio merusak otot, dan strategi menggabungkan keduanya (*concurrent training*).",
    tujuanPembelajaran: [
      "Memahami perbedaan mekanisme adaptasi fisiologis kardio vs latihan kekuatan.",
      "Mengetahui manfaat kekuatan otot untuk densitas tulang dan laju metabolisme.",
      "Mengatur urutan latihan gabungan secara efektif."
    ],
    penjelasanLengkap: `
      <h4>1. Dua Spektrum Kebugaran Fisik</h4>
      <p>Kardio (latihan aerobik) dan latihan kekuatan (*resistance/strength training*) sering diperdebatkan seolah saling bertentangan. Kenyataannya, keduanya menstimulasi adaptasi biologis yang berbeda dan saling menyempurnakan.</p>

      <h4>2. Karakteristik & Adaptasi Fisiologis</h4>
      <ul>
        <li><strong>Latihan Kardio (Aerobik):</strong> Berfokus pada kapasitas pengantaran dan pemanfaatan oksigen oleh jantung dan paru-paru. Adaptasi: peningkatan volume sekuncup jantung (*stroke volume*), pembentukan kapiler darah baru di otot (*kapilarisasi*), serta peningkatan jumlah dan ukuran mitokondria sel. Contoh: lari, berenang, bersepeda, mendayung.</li>
        <li><strong>Latihan Kekuatan (Resistance):</strong> Berfokus pada produksi tenaga melawan beban eksternal. Adaptasi: hipertrofi serat otot tipe II, perekrutan unit motorik saraf, penguatan ligamen/tendon, serta peningkatan kepadatan mineral tulang (*bone mineral density*). Contoh: angkat beban, dumbbell, kalistenik, kettlebell.</li>
      </ul>

      <h4>3. Kombinasi Terbaik: Concurrent Training</h4>
      <p>Mengombinasikan keduanya terbukti paling superior untuk menurunkan lemak visceral, menjaga kesehatan metabolik, dan memperpanjang usia harapan hidup bebas disabilitas (*healthspan*). Jika dilakukan dalam satu sesi yang sama dan tujuan utamamu adalah kekuatan otot, lakukan latihan beban terlebih dahulu sebelum sesi kardio.</p>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Jadwal mingguan ideal: 2-3 hari latihan beban seluruh tubuh (full body 40 menit) ditambah 2 hari kardio intensitas sedang (jogging santai atau sepedaan 30 menit). Tidak perlu memilih salah satu!</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Setelah usia 30 tahun, manusia kehilangan sekitar 3-8% massa otot per dekade jika tidak melakukan latihan kekuatan (kondisi yang disebut *sarkopenia*), yang memperlambat metabolisme basal tubuh secara drastis.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Kardio menjaga jantungmu tetap kuat hingga tua, sedangkan strength training menjaga tubuhmu tetap mandiri dan terhindar dari osteoporosis.</p>
      </div>
    `,
    referensi: {
      penulis: "Schroeder, E. C., et al.",
      judul: "Comparative Effectiveness of Aerobic, Resistance, and Combined Training on Cardiovascular Disease Risk Factors: A Randomized Controlled Trial",
      institusi: "PLOS ONE",
      tahun: 2019,
      doi: "10.1371/journal.pone.0210292",
      pmid: "30615677",
      url: "https://pubmed.ncbi.nlm.nih.gov/30615677/"
    },
    quiz: [
      {
        pertanyaan: "Adaptasi biologis utama apakah yang secara dominan dihasilkan dari latihan kardio aerobik teratur?",
        pilihan: [
          "Peningkatan kapasitas stroke volume jantung, kapilarisasi darah, dan densitas mitokondria",
          "Penurunan elastisitas paru-paru",
          "Pengeroposan tulang paha",
          "Penyempitan lumen arteri koroner"
        ],
        jawabanBenar: 0,
        penjelasan: "Latihan aerobik menuntut efisiensi sistem transpor oksigen, memicu hipertrofi eksentrik ventrikel kiri (menaikkan stroke volume) dan biogenesis mitokondria."
      },
      {
        pertanyaan: "Apa manfaat eksklusif yang sangat kuat dihasilkan dari latihan kekuatan (strength training) dibandingkan kardio santai?",
        pilihan: [
          "Memicu osteoporosis sejak usia muda",
          "Merangsang osteoblas untuk meningkatkan kepadatan mineral tulang dan mencegah sarkopenia (penyusutan otot)",
          "Menghilangkan seluruh cairan sendi",
          "Membuat pembuluh darah kaku"
        ],
        jawabanBenar: 1,
        penjelasan: "Beban mekanis pada tulang saat latihan beban merangsang remodeling tulang oleh osteoblas serta mempertahankan serat otot tipe II dari atrofi penuaan."
      },
      {
        pertanyaan: "Jika tujuan utama seseorang adalah membangun kekuatan dan hipertrofi otot dalam satu sesi latihan gabungan, urutan mana yang paling direkomendasikan?",
        pilihan: [
          "Lari marathon 10 km dulu sampai kehabisan tenaga, baru mencoba angkat barbel berat",
          "Latihan beban terlebih dahulu saat cadangan glikogen dan kesegaran saraf motorik optimal, lalu dilanjutkan kardio moderat",
          "Hanya melakukan kardio tanpa pernah menyentuh beban",
          "Tidur di antara setiap repetisi angkat beban"
        ],
        jawabanBenar: 1,
        penjelasan: "Melakukan latihan beban saat sistem saraf dan energi glikogen masih segar mencegah kelelahan dini yang dapat merusak teknik angkat dan menurunkan rekrutmen serat otot."
      },
      {
        pertanyaan: "Organel seluler apakah yang jumlah dan efisiensinya meningkat pesat di dalam serat otot sebagai respons latihan ketahanan kardio?",
        pilihan: [
          "Mitokondria ('pabrik energi sel')",
          "Vakuola",
          "Dinding sel selulosa",
          "Kloroplas"
        ],
        jawabanBenar: 0,
        penjelasan: "Mitokondria bertanggung jawab atas fosforilasi oksidatif; latihan aerobik merangsang biogenesis mitokondria melalui jalur PGC-1alpha."
      },
      {
        pertanyaan: "Kondisi penyusutan massa dan fungsi kekuatan otot alami akibat penuaan dan kurangnya aktivitas beban disebut dengan istilah apa?",
        pilihan: [
          "Skoliosis",
          "Sarkopenia",
          "Sinusitis",
          "Anemia"
        ],
        jawabanBenar: 1,
        penjelasan: "Sarkopenia adalah sindrom penurunan massa, kualitas, dan kekuatan otot rangka yang berkaitan dengan usia dan gaya hidup sedenter."
      }
    ]
  },

  // 15. Cara Membangun Massa Otot
  {
    id: "materi-15",
    nomor: 15,
    judul: "Cara Membangun Massa Otot",
    kategori: "Olahraga dan Kebugaran",
    tingkatKesulitan: "Lanjutan",
    estimasiWaktu: "5 menit",
    ikon: "🏋️",
    ringkasan: "Memahami 3 mekanisme hipertrofi otot: mechanical tension, muscle damage, dan metabolic stress, serta prinsip progressive overload.",
    tujuanPembelajaran: [
      "Mengenal 3 pemicu utama hipertrofi otot (Schoenfeld, 2010).",
      "Menerapkan konsep Progressive Overload secara sistematis.",
      "Mengatur volume mingguan (10–20 set per kelompok otot) dan waktu pemulihan."
    ],
    penjelasanLengkap: `
      <h4>1. Tiga Mekanisme Hipertrofi Otot</h4>
      <p>Berdasarkan riset seminal Dr. Brad Schoenfeld, pertumbuhan ukuran serat otot (*hipertrofi*) dirangsang oleh tiga mekanisme primer:</p>
      <ul>
        <li><strong>Mechanical Tension (Tegangan Mekanis):</strong> Faktor paling krusial. Terjadi ketika otot memanjang dan memendek sambil menahan beban berat melalui rentang gerak penuh.</li>
        <li><strong>Muscle Damage (Kerusakan Mikro Otot):</strong> Robekan mikro pada sarkomer serat otot akibat fase pemanjangan beban (*kontraksi eksentrik*), yang memicu respon perbaikan oleh sel satelit.</li>
        <li><strong>Metabolic Stress (Stres Metabolik):</strong> Penumpukan metabolit (seperti ion hidrogen dan laktat) serta pembengkakan seluler (*pump*) akibat latihan repetisi sedang-tinggi dengan istirahat singkat.</li>
      </ul>

      <h4>2. Kunci Utama: Progressive Overload</h4>
      <p>Otot tidak akan membesar jika terus diberikan beban yang sama seumur hidup. <strong>Progressive Overload</strong> adalah prinsip menaikkan tuntutan kerja fisik secara bertahap seiring berjalannya waktu melalui:</p>
      <ul>
        <li>Menambah berat beban (misal dari dumbell 5 kg ke 6 kg).</li>
        <li>Menambah jumlah repetisi (misal dari 8 repetisi ke 10 repetisi pada beban yang sama).</li>
        <li>Menambah jumlah set total mingguan.</li>
        <li>Memperbaiki teknik dan kontrol tempo gerakan.</li>
      </ul>

      <h4>3. Volume Mingguan Efektif</h4>
      <p>Studi ilmiah menunjukkan rentang optimal bagi kebanyakan individu adalah <strong>10 hingga 20 set keras per kelompok otot per minggu</strong>, dibagi ke dalam 2-3 sesi terpisah untuk memaksimalkan frekuensi sintesis protein.</p>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Bila hari ini kamu bisa melakukan push-up sebanyak 3 set x 8 repetisi dengan form sempurna, targetkan minggu depan mencapai 3 set x 9 repetisi. Begitu mencapai 3 set x 12 repetisi, naikkan tingkat kesulitan dengan meletakkan kaki di atas kursi (decline push-up).</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Sel satelit (*satellite cells*) adalah sel punca otot yang 'tidur' di luar serat otot. Begitu menerima sinyal stres mekanis, sel satelit bangun, membelah diri, dan menyumbangkan inti selnya (*myonuclei*) ke serat otot yang rusak agar bisa membesar lebih permanen.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Hipertrofi adalah hasil kerja keras terencana: stimulus tegangan mekanis yang progresif, asupan protein yang cukup, dan waktu istirahat yang tidak diganggu begadang.</p>
      </div>
    `,
    referensi: {
      penulis: "Schoenfeld, B. J.",
      judul: "The Mechanisms of Muscle Hypertrophy and Their Application to Resistance Training",
      institusi: "Journal of Strength and Conditioning Research",
      tahun: 2010,
      doi: "10.1519/JSC.0b013e3181e840f3",
      pmid: "20847704",
      url: "https://pubmed.ncbi.nlm.nih.gov/20847704/"
    },
    quiz: [
      {
        pertanyaan: "Faktor manakah yang dianggap sebagai pemicu paling fundamental dan dominan dalam merangsang hipertrofi otot?",
        pilihan: [
          "Tegangan mekanis (Mechanical Tension)",
          "Banyaknya keringat yang menetes ke lantai",
          "Sensasi terbakar di kulit",
          "Warna pakaian olahraga yang dikenakan"
        ],
        jawabanBenar: 0,
        penjelasan: "Tegangan mekanis yang dialami serat otot saat menahan beban melalui rentang gerak penuh adalah stimulator utama jalur molekuler hipertrofi (mTORC1)."
      },
      {
        pertanyaan: "Apakah yang dimaksud dengan prinsip Progressive Overload dalam latihan beban?",
        pilihan: [
          "Mengurangi beban setiap minggu hingga nol",
          "Meningkatkan tuntutan beban, repetisi, atau volume kerja secara bertahap seiring adaptasi kapasitas tubuh",
          "Berlatih selama 10 jam nonstop tanpa istirahat",
          "Mengonsumsi suplemen tanpa pernah berolahraga"
        ],
        jawabanBenar: 1,
        penjelasan: "Progressive overload adalah prinsip peningkatan stimulus kerja secara terukur agar otot terus tertantang untuk beradaptasi dan tumbuh."
      },
      {
        pertanyaan: "Berapa volume set mingguan optimal per kelompok otot yang disarankan oleh literatur ilmiah untuk memaksimalkan hipertrofi?",
        pilihan: [
          "1 - 2 set per bulan",
          "10 - 20 set berkualitas per minggu",
          "100 set per hari",
          "Set tidak berpengaruh sama sekali"
        ],
        jawabanBenar: 1,
        penjelasan: "Meta-analisis Schoenfeld et al. (2017) menunjukkan bahwa 10–20 set per kelompok otot per minggu menghasilkan laju hipertrofi yang signifikan lebih tinggi dibanding volume rendah (<5 set)."
      },
      {
        pertanyaan: "Fase kontraksi otot manakah yang paling banyak memicu kerusakan mikro serat otot (muscle damage) dan stimulasi sel satelit?",
        pilihan: [
          "Fase kontraksi eksentrik (saat otot memanjang sambil menahan beban turun terkontrol)",
          "Fase diam tidak bergerak di kasur",
          "Fase minum air putih",
          "Fase menghembuskan napas"
        ],
        jawabanBenar: 0,
        penjelasan: "Kontraksi eksentrik (misal saat menurunkan barbel ke dada) menghasilkan tegangan tinggi per unit luas serat otot, memicu robekan mikro sarkomer yang memicu sinyal pemulihan."
      },
      {
        pertanyaan: "Sel punca apakah yang berperan menyumbangkan inti sel baru (myonuclei) pada serat otot rangka selama fase regenerasi pasca-latihan?",
        pilihan: [
          "Sel beta pankreas",
          "Sel satelit otot (*satellite cells*)",
          "Sel darah merah",
          "Sel adiposa putih"
        ],
        jawabanBenar: 1,
        penjelasan: "Sel satelit berproliferasi dan berdiferensiasi menyatu dengan serat otot yang rusak untuk menyumbangkan nukleus baru yang mendukung sintesis protein kontraktil."
      }
    ]
  },

  // 16. Recovery dan Pentingnya Hari Istirahat
  {
    id: "materi-16",
    nomor: 16,
    judul: "Recovery dan Pentingnya Hari Istirahat",
    kategori: "Olahraga dan Kebugaran",
    tingkatKesulitan: "Menengah",
    estimasiWaktu: "4 menit",
    ikon: "🛌",
    ringkasan: "Memahami superkompensasi, bahaya overtraining syndrome, dan perbedaan antara istirahat pasif vs istirahat aktif.",
    tujuanPembelajaran: [
      "Memahami kurva adaptasi biologis dan superkompensasi tubuh.",
      "Mengenal tanda-tanda awal Overtraining Syndrome (OTS).",
      "Menerapkan strategi active recovery untuk mempercepat pemulihan jaringan."
    ],
    penjelasanLengkap: `
      <h4>1. Otot Tumbuh Saat Kamu Istirahat</h4>
      <p>Ada pepatah kebugaran ilmiah yang sangat benar: <em>'Kamu tidak tumbuh di gym; di gym kamu merusak ototmu. Kamu tumbuh saat kamu tidur dan beristirahat di rumah.'</em> Latihan fisik adalah stimulus stres (*catabolic*), sedangkan istirahat adalah fase rekonstruksi (*anabolic*).</p>

      <h4>2. Kurva Superkompensasi</h4>
      <p>Setelah sesi latihan keras, kapasitas performa tubuh menurun sementara akibat kelelahan. Selama fase pemulihan yang cukup (biasanya 24–48 jam untuk kelompok otot yang sama), tubuh tidak hanya kembali ke garis dasar, tetapi membangun kapasitas sedikit lebih tinggi dari sebelumnya—inilah yang disebut <strong>Superkompensasi</strong>.</p>

      <h4>3. Bahaya Overtraining Syndrome (OTS)</h4>
      <p>Jika kamu terus memaksakan latihan berat setiap hari tanpa memberi jeda hari istirahat (*rest day*), tubuh akan masuk ke fase <em>overtraining</em>. Gejalanya meliputi: detak jantung istirahat meningkat di pagi hari, insomnia, cedera berulang, sistem kekebalan menurun (mudah flu), dan penurunan motivasi drastis.</p>

      <h4>4. Istirahat Pasif vs Istirahat Aktif (*Active Recovery*)</h4>
      <ul>
        <li><strong>Istirahat Pasif:</strong> Istirahat total tanpa aktivitas fisik terstruktur. Bagus saat tubuh benar-benar kelelahan ekstrem atau sakit.</li>
        <li><strong>Istirahat Aktif (*Active Recovery*):</strong> Melakukan gerakan sangat ringan (jalan santai, peregangan lembut, bersepeda santai 20 menit) yang melancarkan aliran darah kaya oksigen dan nutrisi ke otot yang pegal tanpa menambah stres baru.</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Jadwalkan minimal 1 hingga 2 hari rest day dalam seminggu. Di hari istirahat, lakukan jalan kaki santai 20-30 menit di taman, lakukan peregangan ringan, dan pastikan tidur 8 jam penuh.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Nyeri otot yang muncul 24–48 jam pasca latihan baru (*Delayed Onset Muscle Soreness / DOMS*) bukan disebabkan oleh penumpukan asam laktat (laktat sudah bersih dalam 1 jam setelah latihan), melainkan oleh respon inflamasi pemulihan robekan mikro serat otot.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Hari istirahat (*Rest Day*) bukanlah tanda kemalasan atau kemunduran, melainkan pilar wajib dari program kebugaran yang cerdas dan berkelanjutan.</p>
      </div>
    `,
    referensi: {
      penulis: "Kellmann, M., et al.",
      judul: "Recovery and Performance in Sport: Consensus Statement",
      institusi: "International Journal of Sports Physiology and Performance",
      tahun: 2018,
      doi: "10.1123/ijspp.2017-0759",
      pmid: "29334269",
      url: "https://pubmed.ncbi.nlm.nih.gov/29334269/"
    },
    quiz: [
      {
        pertanyaan: "Kapan proses perbaikan dan pertumbuhan jaringan otot baru (hipertrofi) sebenarnya berlangsung?",
        pilihan: [
          "Tepat di saat sedang mengangkat barbel di gym",
          "Saat fase istirahat dan tidur yang cukup setelah latihan",
          "Hanya saat sedang makan cabai pedas",
          "Saat sedang menahan napas"
        ],
        jawabanBenar: 1,
        penjelasan: "Latihan merangsang kerusakan mikro; perbaikan dan sintesis miofibril baru terjadi selama istirahat dan didukung tidur serta nutrisi."
      },
      {
        pertanyaan: "Apa yang dimaksud dengan fenomena 'Superkompensasi' dalam ilmu kepelatihan olahraga?",
        pilihan: [
          "Kondisi tubuh mengalami cedera permanen",
          "Adaptasi tubuh di mana kapasitas kebugaran meningkat melampaui garis dasar awal setelah fase pemulihan yang cukup",
          "Membayar ganti rugi uang gym",
          "Penurunan detak jantung hingga nol"
        ],
        jawabanBenar: 1,
        penjelasan: "Superkompensasi adalah respon adaptif tubuh yang merekonstruksi jaringan dan cadangan energi melebihi kapasitas awal agar lebih siap menghadapi beban serupa di masa depan."
      },
      {
        pertanyaan: "Manakah yang merupakan tanda-tanda klinis dari Overtraining Syndrome (OTS) akibat kurang istirahat?",
        pilihan: [
          "Performa latihan meningkat drastis setiap hari",
          "Insomnia, peningkatan denyut jantung istirahat, letih kronis, dan kekebalan tubuh menurun",
          "Nafsu makan melonjak tanpa lemak bertambah",
          "Kualitas tidur menjadi sangat nyenyak 12 jam"
        ],
        jawabanBenar: 1,
        penjelasan: "Overtraining ditandai disregulasi sistem saraf otonom, peningkatan denyut nadi istirahat pagi, penurunan daya tahan tubuh, dan kelelahan berkepanjangan."
      },
      {
        pertanyaan: "Apa penyebab utama dari Delayed Onset Muscle Soreness (DOMS) yang terasa 24-48 jam setelah latihan?",
        pilihan: [
          "Penumpukan asam laktat yang membeku di otot",
          "Respon inflamasi lokal dan perbaikan robekan mikro pada serat otot dan jaringan ikat",
          "Kurang makan garam dapur",
          "Darah berhenti mengalir ke kaki"
        ],
        jawabanBenar: 1,
        penjelasan: "Riset modern membuktikan bahwa asam laktat dibersihkan dalam waktu 60 menit pasca latihan. DOMS diakibatkan peradangan mikrostruktural dari kontraksi eksentrik."
      },
      {
        pertanyaan: "Aktivitas manakah yang paling tepat dikategorikan sebagai Active Recovery (pemulihan aktif)?",
        pilihan: [
          "Sprint tanjakan 100% tenaga selama 1 jam",
          "Jalan santai ringan atau peregangan lembut 20-30 menit untuk melancarkan sirkulasi",
          "Duduk diam 14 jam tanpa bergerak sama sekali",
          "Angkat beban maksimal repetisi 1 RM"
        ],
        jawabanBenar: 1,
        penjelasan: "Pemulihan aktif menggunakan aktivitas intensitas rendah untuk memompa darah segar ke jaringan tanpa menimbulkan stres metabolik atau mekanis baru."
      }
    ]
  },

  // 17. Pentingnya Tidur untuk Pemulihan Tubuh
  {
    id: "materi-17",
    nomor: 17,
    judul: "Pentingnya Tidur untuk Pemulihan Tubuh",
    kategori: "Kesehatan dan Gaya Hidup",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "4 menit",
    ikon: "😴",
    ringkasan: "Mengapa tidur 7–9 jam adalah suplemen nomor satu: pelepasan Human Growth Hormone (HGH), konsolidasi memori, dan regulasi nafsu makan.",
    tujuanPembelajaran: [
      "Memahami arsitektur fase tidur (NREM dalam vs REM).",
      "Mengetahui peran hormon HGH dalam perbaikan jaringan saat tidur nyenyak.",
      "Mengenal dampak kurang tidur terhadap hormon lapar (Ghrelin) dan kenyang (Leptin)."
    ],
    penjelasanLengkap: `
      <h4>1. Suplemen Alami Paling Ampuh</h4>
      <p>Tidak ada suplemen atau minuman berenergi mana pun di dunia yang dapat menggantikan fungsi restoratif tidur berkualitas. Yayasan Tidur Nasional (National Sleep Foundation) merekomendasikan <strong>7 hingga 9 jam tidur per malam</strong> untuk orang dewasa muda.</p>

      <h4>2. Arsitektur Tidur: NREM & REM</h4>
      <ul>
        <li><strong>Deep Sleep (NREM Fase 3/Slow-Wave Sleep):</strong> Fase pemulihan fisik utama. Tekanan darah menurun, pernapasan melambat, dan hipofisis anterior melepaskan hingga 70% dari total harian <strong>Human Growth Hormone (HGH)</strong> untuk meregenerasi serat otot, mensintesis protein, dan memperbaiki sel tubuh yang lelah.</li>
        <li><strong>REM Sleep (Rapid Eye Movement):</strong> Fase pemulihan kognitif dan emosional. Otak memproses memori, membersihkan sampah metabolik melalui sistem glimfatik, dan mengonsolidasi keterampilan motorik baru yang dipelajari di siang hari.</li>
      </ul>

      <h4>3. Kurang Tidur & Sabotase Berat Badan</h4>
      <p>Tidur kurang dari 6 jam mengacaukan regulasi hormon metabolisme: hormon lapar <strong>Ghrelin</strong> melonjak tajam sementara hormon penekan nafsu makan <strong>Leptin</strong> anjlok. Akibatnya, kamu mendambakan makanan manis dan berlemak tinggi keesokan harinya.</p>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Terapkan aturan *Sleep Hygiene*: hentikan penggunaan layar gadget (*blue light*) 45 menit sebelum tidur, jaga suhu kamar sejuk dan gelap, serta hindari konsumsi kopi atau kafein di atas jam 2 siang.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Atlet yang tidur kurang dari 8 jam per malam memiliki risiko cedera muskuloskeletal 1,7 kali lipat lebih tinggi dibandingkan atlet yang tidur 8 jam atau lebih secara teratur.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Prioritaskan tidur seperti kamu memprioritaskan jadwal kuliah atau latihan. Tidur bukanlah waktu yang terbuang, melainkan investasi pemulihan biologis tertinggi.</p>
      </div>
    `,
    referensi: {
      penulis: "Watson, A. M.",
      judul: "Sleep and Athletic Performance",
      institusi: "Current Sports Medicine Reports (American College of Sports Medicine)",
      tahun: 2017,
      doi: "10.1249/JSR.0000000000000418",
      pmid: "29135858",
      url: "https://pubmed.ncbi.nlm.nih.gov/29135858/"
    },
    quiz: [
      {
        pertanyaan: "Berapa durasi tidur malam yang direkomendasikan secara konsisten oleh konsensus kesehatan bagi orang dewasa?",
        pilihan: [
          "2 - 3 jam per malam",
          "4 - 5 jam per malam",
          "7 - 9 jam per malam",
          "14 - 16 jam per malam"
        ],
        jawabanBenar: 2,
        penjelasan: "National Sleep Foundation dan American Academy of Sleep Medicine merekomendasikan durasi 7-9 jam tidur malam untuk orang dewasa."
      },
      {
        pertanyaan: "Hormon anabolik vital apakah yang dilepaskan dalam konsentrasi puncak saat fase tidur nyenyak (Slow-Wave/Deep Sleep)?",
        pilihan: [
          "Human Growth Hormone (HGH / Hormon Pertumbuhan)",
          "Adrenalin",
          "Kortisol stres tinggi",
          "Insulin kejut"
        ],
        jawabanBenar: 0,
        penjelasan: "Pelepasan pulsatil hormon pertumbuhan (HGH) mencapai puncaknya pada fase tidur gelombang lambat (NREM stage 3) untuk merangsang perbaikan jaringan."
      },
      {
        pertanyaan: "Bagaimana kurang tidur (kurang dari 6 jam) memengaruhi hormon pengatur nafsu makan keesokan harinya?",
        pilihan: [
          "Menaikkan hormon kenyang Leptin dan menghilangkan nafsu makan",
          "Menaikkan hormon lapar Ghrelin dan menurunkan hormon kenyang Leptin sehingga memicu makan berlebih",
          "Membuat lambung berhenti memproduksi asam",
          "Tidak ada pengaruh sama sekali pada hormon metabolisme"
        ],
        jawabanBenar: 1,
        penjelasan: "Kurang tidur secara neuroendokrin meningkatkan ghrelin (perangsang nafsu makan) dan menekan leptin (pemberi sinyal kenyang), memicu craving makanan padat kalori."
      },
      {
        pertanyaan: "Sistem pembersih sampah biologis di otak apakah yang aktif membersihkan protein beracun (seperti beta-amiloid) saat kita tidur?",
        pilihan: [
          "Sistem Glimfatik (*Glymphatic System*)",
          "Sistem Pencernaan Bawah",
          "Kelenjar Keringat Kulit",
          "Saluran Empedu Hati"
        ],
        jawabanBenar: 0,
        penjelasan: "Sistem glimfatik menggunakan cairan serebrospinal untuk membilas produk buangan metabolik dari jaringan parenkim otak saat fase tidur nyenyak."
      },
      {
        pertanyaan: "Langkah higienitas tidur (Sleep Hygiene) manakah yang terbukti efektif memicu kantuk alami secara tepat waktu?",
        pilihan: [
          "Bermain ponsel di tempat tidur dengan kecerahan maksimal",
          "Mematikan atau meredupkan lampu kamar dan menjauhkan layar biru gawai 30-60 menit sebelum tidur",
          "Minum kopi espresso tepat sebelum memejamkan mata",
          "Menyalakan lampu sorot kamar sepanjang malam"
        ],
        jawabanBenar: 1,
        penjelasan: "Cahaya biru menghambat sekresi melatonin oleh kelenjar pineal. Meredupkan lampu dan membatasi layar memfasilitasi pelepasan melatonin alami."
      }
    ]
  },

  // 18. Hidrasi dan Kebutuhan Cairan
  {
    id: "materi-18",
    nomor: 18,
    judul: "Hidrasi dan Kebutuhan Cairan",
    kategori: "Kesehatan dan Gaya Hidup",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "3 menit",
    ikon: "💧",
    ringkasan: "Mengapa dehidrasi ringan (2%) menurunkan fokus dan performa fisik, indikator warna urine, serta aturan elektrolit saat berolahraga.",
    tujuanPembelajaran: [
      "Mengetahui proporsi air dalam tubuh manusia (~60%).",
      "Menggunakan grafik warna urine untuk memantau status hidrasi.",
      "Memahami kebutuhan hidrasi ekstra sebelum, saat, dan sesudah olahraga."
    ],
    penjelasanLengkap: `
      <h4>1. Air: Pelarut Kehidupan</h4>
      <p>Sekitar 60% dari total berat tubuh orang dewasa tersusun atas air. Air adalah media transportasi nutrisi ke seluruh sel, pelumas sendi, pengatur suhu tubuh lewat keringat, serta bantalan pelindung organ vital.</p>

      <h4>2. Dampak Dehidrasi Ringan</h4>
      <p>Kehilangan cairan tubuh sebesar <strong>hanya 2% dari berat badan</strong> (misal turun 1,2 kg air pada orang berbobot 60 kg) sudah cukup untuk:</p>
      <ul>
        <li>Menurunkan konsentrasi kognitif, daya ingat kerja, dan kewaspadaan.</li>
        <li>Memicu sakit kepala tegang dan rasa lelah mendadak.</li>
        <li>Menurunkan kapasitas kekuatan dan ketahanan fisik hingga 10–15%.</li>
      </ul>

      <h4>3. Cara Praktis Mengecek Status Hidrasi</h4>
      <p>Gunakan bagan warna urine sebagai bio-indikator paling mudah:</p>
      <ul>
        <li><strong>Kuning sangat pucat / bening transparan:</strong> Hidrasi optimal.</li>
        <li><strong>Kuning cerah seperti jerami:</strong> Hidrasi cukup.</li>
        <li><strong>Kuning gelap / cokelat pekat seperti teh:</strong> Tanda dehidrasi, segera minum 2–3 gelas air putih.</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Bawalah botol minum 600 ml ke kampus atau kantor. Terapkan aturan 8 gelas harian: 1 gelas bangun tidur, 1 gelas sebelum makan pagi, 1 gelas jam 10 pagi, 1 gelas sebelum makan siang, 1 gelas jam 3 sore, 1 gelas sebelum makan malam, dan 1 gelas sebelum tidur.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Rasa haus sebenarnya adalah sinyal *terlambat* dari tubuh—saat kamu mulai merasa haus, tubuhmu biasanya sudah berada dalam kondisi dehidrasi ringan sekitar 1-2%.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Jadikan air putih sebagai pilihan minuman utamamu. Hindari mengandalkan minuman bersoda atau boba manis untuk menghilangkan rasa haus.</p>
      </div>
    `,
    referensi: {
      penulis: "Popkin, B. M., et al.",
      judul: "Water, hydration, and health",
      institusi: "Nutrition Reviews",
      tahun: 2010,
      doi: "10.1111/j.1753-4887.2010.00304.x",
      pmid: "20646222",
      url: "https://pubmed.ncbi.nlm.nih.gov/20646222/"
    },
    quiz: [
      {
        pertanyaan: "Berapa persentase rata-rata kandungan air dalam tubuh seorang manusia dewasa?",
        pilihan: [
          "Sekitar 20%",
          "Sekitar 40%",
          "Sekitar 60%",
          "Sekitar 95%"
        ],
        jawabanBenar: 2,
        penjelasan: "Tubuh manusia dewasa terdiri dari sekitar 55-65% air (rata-rata 60%), yang tersebar di intraseluler dan ekstraseluler."
      },
      {
        pertanyaan: "Berapa persentase defisit cairan tubuh yang sudah mulai menimbulkan penurunan fungsi konsentrasi dan performa ketahanan fisik?",
        pilihan: [
          "Hanya 2% dari berat badan",
          "Minimal 20% dari berat badan",
          "50% dari berat badan",
          "Dehidrasi tidak pernah memengaruhi performa"
        ],
        jawabanBenar: 0,
        penjelasan: "Dehidrasi ringan sebesar 1-2% berat badan telah terbukti menurunkan kapasitas termoregulasi, meningkatkan beban kerja kardiovaskular, dan mengaburkan fokus kognitif."
      },
      {
        pertanyaan: "Warna urine seperti apakah yang menunjukkan bahwa seseorang berada dalam status hidrasi yang optimal?",
        pilihan: [
          "Cokelat gelap menyerupai air teh pekat",
          "Kuning pucat jernih atau transparan",
          "Merah pekat menyala",
          "Biru kehijauan berbusa"
        ],
        jawabanBenar: 1,
        penjelasan: "Urine berwarna kuning sangat muda (straw-colored) atau hampir bening menandakan pengenceran zat terlarut yang seimbang dengan hidrasi cukup."
      },
      {
        pertanyaan: "Mengapa rasa haus bukan merupakan indikator ideal untuk mulai minum?",
        pilihan: [
          "Karena rasa haus menandakan tubuh sudah terlanjur mengalami dehidrasi ringan sebelum sinyal tersebut dipicu ke otak",
          "Karena rasa haus adalah ilusi yang tidak nyata",
          "Karena rasa haus hanya terjadi pada saat tidur",
          "Karena minum air saat haus menyebabkan kembung seketika"
        ],
        jawabanBenar: 0,
        penjelasan: "Osmoreseptor di hipotalamus baru terpicu saat osmolaritas plasma naik sekitar 1-2%, yang berarti tubuh sudah berada di tahap dehidrasi awal."
      },
      {
        pertanyaan: "Mineral elektrolit utama apakah yang paling banyak keluar bersama keringat saat berolahraga dan perlu diganti pada sesi latihan panjang (>60 menit)?",
        pilihan: [
          "Natrium dan Klorida",
          "Zat Besi dan Timbal",
          "Fluorida murni",
          "Kalsium fosfat batu"
        ],
        jawabanBenar: 0,
        penjelasan: "Keringat mengandung elektrolit dengan konsentrasi natrium (Na+) dan klorida (Cl-) tertinggi, yang krusial untuk menjaga tekanan osmotik darah dan transmisi impuls saraf."
      }
    ]
  },

  // 19. Mengenal Stres dan Kesehatan Mental
  {
    id: "materi-19",
    nomor: 19,
    judul: "Mengenal Stres dan Kesehatan Mental",
    kategori: "Kesehatan dan Gaya Hidup",
    tingkatKesulitan: "Menengah",
    estimasiWaktu: "4 menit",
    ikon: "🧠",
    ringkasan: "Memahami hormon stres (kortisol), respon fight-or-flight, pengaruh stres kronis pada peradangan usus, dan peran olahraga sebagai penyangga mental.",
    tujuanPembelajaran: [
      "Membedakan stres akut positif (*eustress*) dan stres kronis (*distress*).",
      "Memahami poros HPA (Hypothalamic-Pituitary-Adrenal) dan hormon kortisol.",
      "Mengenal teknik regulasi sistem saraf otonom melalui pernapasan dan aktivitas fisik."
    ],
    penjelasanLengkap: `
      <h4>1. Apa Sebenarnya Stres Itu?</h4>
      <p>Stres adalah reaksi adaptif fisiologis tubuh terhadap tuntutan atau ancaman lingkungan. Dalam dosis kecil (*eustress*), stres memicu fokus dan performa. Namun, bila berkepanjangan tanpa jeda pemulihan (*distress kronis*), stres merusak homeostasis biologis.</p>

      <h4>2. Respon Poros HPA & Hormon Kortisol</h4>
      <p>Saat menghadapi stresor, otak mengaktifkan poros <strong>HPA (Hypothalamic-Pituitary-Adrenal)</strong>, melepaskan adrenalin dan hormon <strong>kortisol</strong>. Pada kondisi kronis, kadar kortisol yang tinggi secara konstan dapat:</p>
      <ul>
        <li>Meningkatkan penumpukan lemak visceral di rongga perut.</li>
        <li>Menekan fungsi sistem kekebalan tubuh (limfosit berkurang).</li>
        <li>Mengganggu permeabilitas dinding usus (*gut barrier*) dan merusak mikrobioma.</li>
        <li>Memicu gangguan tidur dan kecemasan terus-menerus.</li>
      </ul>

      <h4>3. Olahraga sebagai Penyangga Stres</h4>
      <p>Olahraga adalah bentuk stres fisik terkontrol yang melatih sistem saraf menjadi tangguh (*resilien*). Aktivitas fisik merangsang pelepasan endorfin, dopamin, dan serotonin, serta menurunkan kepekaan amigdala terhadap rangsangan kecemasan.</p>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Saat merasa panik atau tertekan karena tugas menumpuk, lakukan teknik pernapasan <em>Box Breathing</em> (tarik napas 4 detik, tahan 4 detik, hembuskan 4 detik, tahan 4 detik) selama 2 menit untuk mengaktifkan saraf parasimpatik (rem alami tubuh).</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Studi psikofisiologis menunjukkan bahwa berjalan santai di ruang terbuka hijau selama 20 menit (*nature walk*) dapat menurunkan konsentrasi kortisol dalam saliva hingga 21%.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Kesehatan fisik dan kesehatan mental adalah dua sisi mata uang yang sama. Merawat tubuhmu melalui gerak dan makanan bergizi adalah wujud nyata mencintai kesehatan mentalmu.</p>
      </div>
    `,
    referensi: {
      penulis: "Schultchen, D., et al.",
      judul: "Bidirectional relationship between physical activity and perceived stress: An ambulatory assessment study",
      institusi: "Frontiers in Psychiatry",
      tahun: 2019,
      doi: "10.3389/fpsyt.2019.00373",
      pmid: "31214061",
      url: "https://pubmed.ncbi.nlm.nih.gov/31214061/"
    },
    quiz: [
      {
        pertanyaan: "Hormon utama apakah yang disekresikan oleh kelenjar adrenal saat tubuh menghadapi stres berkepanjangan?",
        pilihan: [
          "Insulin",
          "Kortisol",
          "Kalsitonin",
          "Melatonin"
        ],
        jawabanBenar: 1,
        penjelasan: "Kortisol adalah hormon glukokortikoid utama yang disekresikan oleh korteks adrenal melalui aktivasi poros HPA saat stres kronis."
      },
      {
        pertanyaan: "Bagian dari sistem saraf otonom manakah yang berfungsi sebagai 'rem alami' untuk menenangkan denyut jantung dan memulihkan kondisi rileks tubuh?",
        pilihan: [
          "Sistem saraf simpatik (*Fight or Flight*)",
          "Sistem saraf parasimpatik (*Rest and Digest*)",
          "Saraf motorik volunter",
          "Saraf kranial penciuman"
        ],
        jawabanBenar: 1,
        penjelasan: "Sistem saraf parasimpatik memperlambat denyut jantung, menurunkan tekanan darah, dan memfasilitasi pencernaan serta relaksasi."
      },
      {
        pertanyaan: "Bagaimana aktivitas fisik secara biologis membantu meredakan gejala kecemasan dan stres?",
        pilihan: [
          "Membakar habis jaringan otak",
          "Memicu pelepasan endorfin, serotonin, dan BDNF serta memodulasi reaktivitas amigdala",
          "Menaikkan tekanan darah secara permanen",
          "Menghentikan kerja kelenjar tiroid"
        ],
        jawabanBenar: 1,
        penjelasan: "Latihan fisik merangsang sintesis neurotransmiter pembawa rasa nyaman (endorfin, dopamin) dan melatih adaptasi saraf otonom terhadap lonjakan stresor."
      },
      {
        pertanyaan: "Apa dampak buruk elevasi hormon kortisol yang tinggi berkepanjangan terhadap komposisi tubuh?",
        pilihan: [
          "Massa otot melonjak tajam tanpa olahraga",
          "Mendorong pemecahan protein otot (katabolisme) dan penimbunan lemak visceral di rongga perut",
          "Menghilangkan seluruh nafsu makan selamanya",
          "Membuat kulit menjadi sangat tebal"
        ],
        jawabanBenar: 1,
        penjelasan: "Kortisol berlebih bersifat katabolik bagi protein otot rangka dan merangsang lipogenesis di jaringan adiposa visceral (perut)."
      },
      {
        pertanyaan: "Teknik pernapasan sederhana dengan pola 4 detik tarik, 4 detik tahan, 4 detik hembus, dan 4 detik tahan dikenal dengan sebutan apa?",
        pilihan: [
          "Hyperventilation",
          "Box Breathing (Pernapasan Kotak)",
          "Asthma Technique",
          "Sprint Breathing"
        ],
        jawabanBenar: 1,
        penjelasan: "Box breathing adalah teknik pernapasan berirama yang merangsang saraf vagus untuk menggeser dominasi sistem saraf ke mode parasimpatik."
      }
    ]
  },

  // 20. Postur Tubuh dan Pencegahan Cedera
  {
    id: "materi-20",
    nomor: 20,
    judul: "Postur Tubuh dan Pencegahan Cedera",
    kategori: "Kesehatan dan Gaya Hidup",
    tingkatKesulitan: "Pemula",
    estimasiWaktu: "4 menit",
    ikon: "🧍",
    ringkasan: "Mengatasi fenomena 'Text Neck', ergonomi meja belajar, penguatan otot inti (*core stability*), dan mekanika tubuh saat mengangkat beban.",
    tujuanPembelajaran: [
      "Memahami beban biomekanis tulang leher akibat membungkuk menatap layar gawai.",
      "Mengetahui prinsip ergonomi duduk yang sehat saat bekerja atau belajar.",
      "Menerapkan prinsip 'hip hinge' saat mengangkat benda dari lantai untuk melindungi tulang belakang."
    ],
    penjelasanLengkap: `
      <h4>1. Krisis Ergonomi Generasi Digital</h4>
      <p>Rata-rata anak muda menghabiskan 6–9 jam per hari menatap layar gawai atau laptop. Posisi kepala yang terus-menerus condong ke depan memicu sindrom <strong>Text Neck</strong>, ketegangan otot trapezius, dan nyeri punggung bawah (*low back pain*).</p>

      <h4>2. Biomekanika Tulang Leher</h4>
      <p>Dalam posisi netral tegak, kepala orang dewasa berbobot sekitar <strong>5 kg</strong>. Namun, ketika leher ditekuk ke depan:</p>
      <ul>
        <li>Kemiringan 15 derajat: Beban efektif pada tulang servikal menjadi ±<strong>12 kg</strong>.</li>
        <li>Kemiringan 30 derajat: Beban melonjak menjadi ±<strong>18 kg</strong>.</li>
        <li>Kemiringan 60 derajat (posisi menatap HP di pangkuan): Beban setara ±<strong>27 kg</strong>—seberat anak usia 8 tahun yang duduk di atas lehermu!</li>
      </ul>

      <h4>3. Tips Ergonomi & Pencegahan Cedera</h4>
      <ul>
        <li><strong>Sejajarkan Layar dengan Mata:</strong> Gunakan stand laptop atau tumpukan buku agar pandangan mata lurus horizontal tanpa menunduk.</li>
        <li><strong>Aturan 90 Derajat:</strong> Siku, panggul, dan lutut membentuk sudut sekitar 90 derajat saat duduk, dengan telapak kaki menapak rata di lantai.</li>
        <li><strong>Gunakan 'Hip Hinge' saat Mengangkat:</strong> Bila mengangkat barang berat dari lantai, tekuk lutut dan dorong pinggul ke belakang, pertahankan punggung lurus netral. Jangan pernah membungkukkan punggung atas!</li>
      </ul>

      <div class="kotak-sorotan contoh-aplikasi">
        <h5>💡 Contoh Penerapan Sehari-hari</h5>
        <p>Lakukan latihan *Chin Tuck* setiap 1 jam: tarik dagu lurus ke belakang (seperti membuat double chin) tahan 5 detik, ulangi 10 kali untuk menguatkan fleksor leher bagian dalam.</p>
      </div>

      <div class="kotak-sorotan fakta-menarik">
        <h5>✨ Fakta Menarik</h5>
        <p>Otot inti (*core*) bukan hanya otot perut 'six pack' (rectus abdominis), melainkan korset silindris yang mencakup transversus abdominis, multifidus punggung, diafragma, dan dasar panggul yang mengunci stabilitas tulang belakang.</p>
      </div>

      <div class="kotak-sorotan kesimpulan">
        <h5>📌 Kesimpulan</h5>
        <p>Postur tubuh yang baik bukanlah posisi kaku tanpa gerak, melainkan kemampuan tubuh berganti posisi secara dinamis dan menjaga kurva alami tulang belakang.</p>
      </div>
    `,
    referensi: {
      penulis: "Lau, K. T., et al.",
      judul: "Relationships between sagittal postures of thoracic and cervical spine, presence of neck pain, neck pain severity and disability",
      institusi: "Manual Therapy",
      tahun: 2010,
      doi: "10.1016/j.math.2010.03.009",
      pmid: "20452267",
      url: "https://pubmed.ncbi.nlm.nih.gov/20452267/"
    },
    quiz: [
      {
        pertanyaan: "Berapa perkiraan beban mekanis yang dialami tulang leher (tulang servikal) ketika kepala ditekuk ke depan sebesar 60 derajat saat menatap layar ponsel?",
        pilihan: [
          "Sekitar 2 kg",
          "Sekitar 5 kg",
          "Sekitar 27 kg",
          "Nol kg"
        ],
        jawabanBenar: 2,
        penjelasan: "Riset biomekanika (Hansraj, 2014) membuktikan kemiringan kepala 60 derajat meningkatkan beban gravitasi leher hingga sekitar 27 kg (60 pon)."
      },
      {
        pertanyaan: "Bagaimana posisi layar komputer/laptop yang paling ergonomis untuk mencegah ketegangan otot leher?",
        pilihan: [
          "Diletakkan di lantai dekat kaki",
          "Sejajar dengan garis pandang horizontal mata sehingga leher berada pada posisi netral",
          "Ditaruh miring 90 derajat di sisi kanan kepala",
          "Diletakkan di langit-langit kamar"
        ],
        jawabanBenar: 1,
        penjelasan: "Puncak layar sejajar dengan ketinggian mata memungkinkan mata memandang ke depan tanpa memfleksikan atau mengekstensikan tulang leher."
      },
      {
        pertanyaan: "Saat mengangkat beban berat dari lantai, teknik biomekanika manakah yang paling aman untuk mencegah cedera saraf terjepit (HNP) pada tulang belakang?",
        pilihan: [
          "Menjaga lutut tetap lurus kaku dan membungkukkan punggung",
          "Mendorong pinggul ke belakang (*hip hinge*), menekuk lutut, menjaga punggung netral, dan mengangkat menggunakan tenaga otot paha dan bokong",
          "Memutar pinggang secara mendadak saat mengangkat",
          "Menahan napas dan melompat"
        ],
        jawabanBenar: 1,
        penjelasan: "Mekanika hip hinge memindahkan momen gaya ke sendi panggul dan otot ekstensor paha (gluteus dan hamstring) yang kuat, melindungi diskus intervertebra lumbosakral."
      },
      {
        pertanyaan: "Latihan sederhana apakah yang efektif membantu mengaktifkan otot fleksor leher dalam dan mengatasi postur kepala maju (*forward head posture*)?",
        pilihan: [
          "Chin Tuck (menarik dagu ke belakang seperti membuat lipatan leher)",
          "Memutar leher 360 derajat secepat mungkin",
          "Memukul kepala dengan buku tebal",
          "Membenturkan dahi ke dinding"
        ],
        jawabanBenar: 0,
        penjelasan: "Latihan chin tuck memperkuat otot longus colli dan longus capitis sambil meregangkan otot suboksipital yang kaku."
      },
      {
        pertanyaan: "Kelompok otot manakah yang sebenarnya menyusun 'Core Stability' (stabilitas inti tubuh)?",
        pilihan: [
          "Hanya otot perut depan yang tampak kotak-kotak",
          "Kombinasi otot perut dalam (transversus abdominis), multifidus punggung, diafragma, dan otot dasar panggul yang bekerja seperti silinder pelindung",
          "Otot telapak tangan dan jari kelingking",
          "Otot daun telinga"
        ],
        jawabanBenar: 1,
        penjelasan: "Core adalah korset anatomi 3D terpadu: diafragma di atap, dasar panggul di lantai, transversus abdominis di sekeliling dinding, dan multifidus di posterior tulang belakang."
      }
    ]
  }
];;

export const DATA_MINI_GAMES = {
  "isiPiringku": {
    "instruksi": "Pilih 1 makanan pokok, 1 lauk pauk sumber protein, 1 sayuran, dan 1 buah-buahan untuk menyusun piring gizi seimbang sesuai pedoman Kemenkes RI.",
    "panduanPorsi": {
      "makananPokok": "2/3 dari 1/2 piring (~33% luas piring)",
      "laukPauk": "1/3 dari 1/2 piring (~17% luas piring)",
      "sayuran": "2/3 dari 1/2 piring (~33% luas piring)",
      "buahBuahan": "1/3 dari 1/2 piring (~17% luas piring)"
    },
    "items": [
      {
        "id": "karbo-1",
        "nama": "Nasi Merah",
        "kategori": "makananPokok",
        "emoji": "🍚",
        "kalori": "110 kkal",
        "ket": "Karbohidrat kompleks kaya serat dan mineral"
      },
      {
        "id": "karbo-2",
        "nama": "Jagung Rebus Manis",
        "kategori": "makananPokok",
        "emoji": "🌽",
        "kalori": "95 kkal",
        "ket": "Kaya lutein dan zeaxanthin untuk kesehatan mata"
      },
      {
        "id": "karbo-3",
        "nama": "Ubi Jalar Kukus",
        "kategori": "makananPokok",
        "emoji": "🍠",
        "kalori": "100 kkal",
        "ket": "Indeks glikemik rendah dan tinggi beta-karoten"
      },
      {
        "id": "protein-1",
        "nama": "Dada Ayam Panggang",
        "kategori": "laukPauk",
        "emoji": "🍗",
        "kalori": "165 kkal",
        "ket": "31g protein berkualitas tinggi rendah lemak"
      },
      {
        "id": "protein-2",
        "nama": "Tempe Bacem Bakar",
        "kategori": "laukPauk",
        "emoji": "🥢",
        "kalori": "120 kkal",
        "ket": "Protein nabati kaya isoflavon dan probiotik alami"
      },
      {
        "id": "protein-3",
        "nama": "Ikan Kembung Kukus",
        "kategori": "laukPauk",
        "emoji": "🐟",
        "kalori": "140 kkal",
        "ket": "Sangat tinggi asam lemak Omega-3 dan zat besi"
      },
      {
        "id": "sayur-1",
        "nama": "Sayur Bening Bayam",
        "kategori": "sayuran",
        "emoji": "🥬",
        "kalori": "35 kkal",
        "ket": "Kaya zat besi, folat, dan antioksidan lutein"
      },
      {
        "id": "sayur-2",
        "nama": "Tumis Kangkung Tauco",
        "kategori": "sayuran",
        "emoji": "🍲",
        "kalori": "45 kkal",
        "ket": "Tinggi serat pangan dan vitamin A"
      },
      {
        "id": "sayur-3",
        "nama": "Brokoli Kukus Wortel",
        "kategori": "sayuran",
        "emoji": "🥦",
        "kalori": "40 kkal",
        "ket": "Tinggi sulforaphane pelindung sel dan vitamin C"
      },
      {
        "id": "buah-1",
        "nama": "Pisang Ambon Segar",
        "kategori": "buahBuahan",
        "emoji": "🍌",
        "kalori": "90 kkal",
        "ket": "Sumber kalium elektrolit dan vitamin B6"
      },
      {
        "id": "buah-2",
        "nama": "Pepaya Potong Manis",
        "kategori": "buahBuahan",
        "emoji": "🍈",
        "kalori": "50 kkal",
        "ket": "Enzim papain pelancar pencernaan dan vitamin C tinggi"
      },
      {
        "id": "buah-3",
        "nama": "Semangka Merah Segar",
        "kategori": "buahBuahan",
        "emoji": "🍉",
        "kalori": "45 kkal",
        "ket": "Tinggi likopen dan 92% kandungan air hidrasi"
      }
    ]
  },
  "tebakNutrisi": {
    "instruksi": "Tebak makronutrien utama, kandungan mikronutrien, atau keunggulan gizi dari hidangan berikut dalam 8 ronde interaktif!",
    "ronde": [
      {
        "id": "tn-1",
        "makanan": "Telur Rebus Utuh",
        "emoji": "🥚",
        "pertanyaan": "Apa keunggulan gizi utama dari sebutir telur rebus utuh?",
        "pilihan": [
          "Hanya mengandung air dan garam tanpa nutrisi",
          "Protein bernilai biologis sempurna (100) dan kolin untuk kesehatan otak",
          "Mengandung 100% gula rafinasi",
          "Merupakan sumber karbohidrat sederhana murni"
        ],
        "jawabanBenar": 1,
        "penjelasan": "Telur utuh mengandung 6-7 gram protein berkualitas tinggi dengan profil asam amino lengkap, serta kolin pada kuning telur yang esensial untuk membran sel saraf."
      },
      {
        "id": "tn-2",
        "makanan": "Buah Alpukat Mentega",
        "emoji": "🥑",
        "pertanyaan": "Jenis lemak manakah yang paling mendominasi kandungan buah alpukat?",
        "pilihan": [
          "Asam lemak tak jenuh tunggal (MUFA / Asam Oleat)",
          "Lemak trans sintetis",
          "Lemak jenuh hewani",
          "Minyak mineral olahan"
        ],
        "jawabanBenar": 0,
        "penjelasan": "Alpukat adalah buah unik yang kaya akan asam lemak tak jenuh tunggal ramah jantung (MUFA), serat pangan, dan kalium yang lebih tinggi dari pisang."
      },
      {
        "id": "tn-3",
        "makanan": "Ikan Kembung Segar",
        "emoji": "🐟",
        "pertanyaan": "Asam lemak esensial apakah yang terkandung dalam konsentrasi tinggi pada ikan kembung?",
        "pilihan": [
          "Asam Lemak Omega-3 (EPA & DHA)",
          "Asam Benzoat",
          "Gluten Gandum",
          "Kolesterol Jahat Oksidasi"
        ],
        "jawabanBenar": 0,
        "penjelasan": "Ikan kembung lokal Indonesia memiliki kadar Omega-3 (EPA dan DHA) sekitar 2,2-2,6 gram per 100 gram, sangat bermanfaat untuk anti-inflamasi dan elastisitas arteri."
      },
      {
        "id": "tn-4",
        "makanan": "Oatmeal Gandum Utuh",
        "emoji": "🥣",
        "pertanyaan": "Senyawa serat larut air apakah di dalam oatmeal yang terbukti klinis membantu menurunkan kolesterol darah?",
        "pilihan": [
          "Beta-Glukan",
          "Monosodium Glutamat",
          "Laktosa Susu",
          "Asam Urat"
        ],
        "jawabanBenar": 0,
        "penjelasan": "Beta-glukan membentuk gel kental di saluran cerna yang mengikat asam empedu dan menghambat reabsorpsi kolesterol di usus halus."
      },
      {
        "id": "tn-5",
        "makanan": "Brokoli Hijau Segar",
        "emoji": "🥦",
        "pertanyaan": "Kombinasi mikronutrien dan senyawa fitokimia unggulan apa yang terdapat pada brokoli?",
        "pilihan": [
          "Vitamin C, Vitamin K, dan Sulforaphane antioksidan",
          "Natrium dan Lemak Jenuh",
          "Gula Fruktosa Cair",
          "Asam Fosfat Industri"
        ],
        "jawabanBenar": 0,
        "penjelasan": "Brokoli kaya akan vitamin C untuk imunitas, vitamin K untuk pembekuan darah normal, dan glukorafanin yang terkonversi menjadi sulforaphane pelindung sel."
      },
      {
        "id": "tn-6",
        "makanan": "Ubi Jalar Oranye",
        "emoji": "🍠",
        "pertanyaan": "Pigmen alami apakah yang memberi warna oranye pada ubi jalar dan berfungsi sebagai provitamin A?",
        "pilihan": [
          "Beta-Karoten",
          "Klorofil",
          "Melanin",
          "Hemoglobin"
        ],
        "jawabanBenar": 0,
        "penjelasan": "Beta-karoten adalah antioksidan karotenoid kuat yang diubah tubuh manusia menjadi Retinol (Vitamin A aktif) sesuai kebutuhan fisiologis."
      },
      {
        "id": "tn-7",
        "makanan": "Dada Ayam Tanpa Kulit (100g)",
        "emoji": "🍗",
        "pertanyaan": "Berapa perkiraan kandungan protein pada 100 gram dada ayam tanpa kulit matang?",
        "pilihan": [
          "Sekitar 5 gram",
          "Sekitar 31 gram",
          "Sekitar 95 gram",
          "0 gram (hanya air)"
        ],
        "jawabanBenar": 1,
        "penjelasan": "100 gram dada ayam matang tanpa kulit menyediakan sekitar 31 gram protein berkualitas tinggi dengan kandungan lemak sangat rendah (sekitar 3-4 gram)."
      },
      {
        "id": "tn-8",
        "makanan": "Tempe Kedelai Tradisional",
        "emoji": "🥢",
        "pertanyaan": "Apa keunggulan tempe dibandingkan kedelai rebus biasa akibat proses fermentasi kapang Rhizopus?",
        "pilihan": [
          "Asam fitat berkurang dan ketersediaan asam amino bebas serta isoflavon meningkat drastis",
          "Tempe kehilangan seluruh kandungan proteinnya",
          "Menghasilkan lemak trans berbahaya",
          "Mengandung racun sianida"
        ],
        "jawabanBenar": 0,
        "penjelasan": "Fermentasi kapang Rhizopus memecah protein kompleks menjadi peptida pendek yang lebih mudah dicerna serta menurunkan zat anti-nutrisi asam fitat."
      }
    ]
  },
  "mitosFakta": {
    "instruksi": "Tentukan apakah pernyataan seputar gizi, olahraga, dan kesehatan ini merupakan MITOS atau FAKTA ilmiah!",
    "daftar": [
      {
        "id": "mf-1",
        "pernyataan": "Makan makanan berkarbohidrat di atas jam 8 malam secara otomatis diubah menjadi lemak tubuh oleh metabolisme.",
        "apakahFakta": false,
        "kategori": "Gizi",
        "penjelasan": "MITOS. Kenaikan berat badan ditentukan oleh keseimbangan total kalori harian (masuk vs keluar) dalam jangka panjang, bukan jam pada dinding. Kalori makanan di malam hari diproses dengan mekanisme termodinamika yang sama.",
        "sumber": "NIH & American Journal of Clinical Nutrition"
      },
      {
        "id": "mf-2",
        "pernyataan": "Banyaknya keringat yang keluar saat berolahraga bukan merupakan indikator seberapa banyak lemak yang berhasil dibakar.",
        "apakahFakta": true,
        "kategori": "Olahraga",
        "penjelasan": "FAKTA. Keringat adalah respon termoregulasi tubuh untuk mendinginkan suhu kulit melalui evaporasi cairan, bukan tanda langsung pembakaran asam lemak di sel otot.",
        "sumber": "American College of Sports Medicine (ACSM)"
      },
      {
        "id": "mf-3",
        "pernyataan": "Meminum air es saat makan dapat membekukan minyak dan lemak makanan di dalam lambung manusia.",
        "apakahFakta": false,
        "kategori": "Gizi",
        "penjelasan": "MITOS. Tubuh manusia adalah mesin termal yang secara cepat menghangatkan cairan apa pun yang masuk ke lambung hingga mencapai suhu fisiologis tubuh (sekitar 37°C). Lemak makanan tidak dapat membeku di lambung.",
        "sumber": "Harvard Medical School Health Publishing"
      },
      {
        "id": "mf-4",
        "pernyataan": "Latihan beban teratur merangsang pembentukan massa tulang baru dan secara efektif mencegah pengeroposan tulang (osteoporosis) di masa tua.",
        "apakahFakta": true,
        "kategori": "Olahraga",
        "penjelasan": "FAKTA. Tekanan mekanis dari kontraksi otot dan beban eksternal merangsang sel osteoblas untuk mendepositkan kalsium dan matriks kolagen pada tulang rangka.",
        "sumber": "Journal of Bone and Mineral Research"
      },
      {
        "id": "mf-5",
        "pernyataan": "Seseorang wajib memotong seluruh asupan karbohidrat hingga 0 gram agar dapat menurunkan lemak tubuh secara permanen.",
        "apakahFakta": false,
        "kategori": "Gizi",
        "penjelasan": "MITOS. Uji klinis berskala besar membuktikan bahwa diet seimbang dengan karbohidrat kompleks berserat tinggi menghasilkan penurunan lemak yang sama efektifnya dengan diet rendah karbohidrat asalkan terjadi defisit kalori seimbang.",
        "sumber": "JAMA DIETFITS Randomized Clinical Trial"
      },
      {
        "id": "mf-6",
        "pernyataan": "Kurang tidur secara terus-menerus meningkatkan hormon lapar Ghrelin dan menurunkan hormon kenyang Leptin.",
        "apakahFakta": true,
        "kategori": "Gaya Hidup",
        "penjelasan": "FAKTA. Disregulasi tidur mengacaukan poros neuroendokrin nafsu makan, memicu peningkatan dorongan biologis untuk mengonsumsi makanan padat kalori keesokan harinya.",
        "sumber": "Annals of Internal Medicine & Sleep Research Society"
      },
      {
        "id": "mf-7",
        "pernyataan": "Jaringan otot yang terlatih akan berubah wujud menjadi lemak jika seseorang berhenti pergi ke gym.",
        "apakahFakta": false,
        "kategori": "Olahraga",
        "penjelasan": "MITOS. Sel otot (miosit) dan sel lemak (adiposit) adalah dua tipe jaringan biologis yang sama sekali berbeda dan tidak dapat saling bertransmutasi. Bila berhenti latihan, serat otot mengecil (atrofi), dan bila asupan kalori berlebih maka sel lemak akan membesar secara terpisah.",
        "sumber": "Mayo Clinic Sports Medicine"
      },
      {
        "id": "mf-8",
        "pernyataan": "Ikan kembung lokal Indonesia memiliki kadar asam lemak Omega-3 yang setara atau bahkan melampaui ikan salmon impor.",
        "apakahFakta": true,
        "kategori": "Gizi",
        "penjelasan": "FAKTA. Data Balitbangkes Kemenkes RI mencatat ikan kembung mengandung sekitar 2,2 gram Omega-3 per 100 gram, menyaingi salmon impor dengan harga jauh lebih ekonomis bagi masyarakat.",
        "sumber": "Kementerian Kesehatan Republik Indonesia"
      },
      {
        "id": "mf-9",
        "pernyataan": "Detoksifikasi racun tubuh hanya bisa dicapai secara optimal dengan membeli paket jus buah/sayur komersial.",
        "apakahFakta": false,
        "kategori": "Gizi",
        "penjelasan": "MITOS. Organ hati (liver) dan ginjal manusia bekerja 24 jam sehari menyaring dan menetralkan senyawa berbahaya secara fisiologis tanpa memerlukan suplemen atau jus detoks berbayar.",
        "sumber": "British Dietetic Association (BDA)"
      },
      {
        "id": "mf-10",
        "pernyataan": "Berjalan kaki 30 menit sehari dengan intensitas sedang berkaitan dengan penurunan risiko penyakit kardiovaskular dan diabetes tipe 2.",
        "apakahFakta": true,
        "kategori": "Olahraga",
        "penjelasan": "FAKTA. Studi epidemiologi global membuktikan bahwa aktivitas fisik aerobik sedang 150 menit per minggu secara konsisten menurunkan mortalitas kardiovaskular dan meningkatkan kontrol glukosa darah.",
        "sumber": "WHO 2020 Guidelines on Physical Activity"
      }
    ]
  },
  "foodDetective": {
    "instruksi": "Periksa label Informasi Nilai Gizi produk pangan kemasan berikut dan pecahkan pertanyaan detektif nutrisi secara akurat!",
    "kasus": [
      {
        "id": "fd-1",
        "namaProduk": "Minuman Teh Tarik Susu Kemasan (Botol 500 ml)",
        "kategori": "Minuman Siap Minum",
        "label": {
          "takaranSaji": "250 ml",
          "jumlahSajianPerKemasan": 2,
          "energiTotal": "140 kkal (per saji)",
          "lemakTotal": "3 g",
          "protein": "2 g",
          "karbohidratTotal": "26 g",
          "gulaTotal": "22 g",
          "natrium": "60 mg"
        },
        "pertanyaan": [
          {
            "tanya": "Berapa gram total gula yang masuk ke tubuhmu jika kamu menghabiskan seluruh isi botol 500 ml ini sendirian?",
            "pilihan": [
              "22 gram",
              "33 gram",
              "44 gram",
              "88 gram"
            ],
            "jawabanBenar": 2,
            "penjelasan": "Kemasan berisi 2 sajian. Setiap sajian mengandung 22 gram gula. Maka total gula = 22 g x 2 = 44 gram (hampir mencapai batas maksimal 50g gula harian Kemenkes!)."
          },
          {
            "tanya": "Berapa total kalori riil yang kamu dapatkan jika menghabiskan seluruh botol minuman ini?",
            "pilihan": [
              "140 kkal",
              "280 kkal",
              "500 kkal",
              "70 kkal"
            ],
            "jawabanBenar": 1,
            "penjelasan": "Energi total per saji adalah 140 kkal. Karena botol berisi 2 sajian penuh, maka 140 x 2 = 280 kkal (setara dengan sepiring nasi putih penuh)."
          },
          {
            "tanya": "Berapa persentase batas anjuran gula harian Kemenkes RI (maksimal 50 gram/hari) yang terkuras hanya dari satu botol ini?",
            "pilihan": [
              "Sekitar 20%",
              "Sekitar 44%",
              "Sekitar 88%",
              "Lebih dari 200%"
            ],
            "jawabanBenar": 2,
            "penjelasan": "44 gram dibagi 50 gram = 88% batas harian. Artinya hampir seluruh kuota gula aman harianmu habis hanya dari sebotol minuman manis kemasan."
          }
        ]
      },
      {
        "id": "fd-2",
        "namaProduk": "Keripik Kentang Renyah Balado (Bungkus 100 gram)",
        "kategori": "Makanan Ringan Gurih",
        "label": {
          "takaranSaji": "25 gram",
          "jumlahSajianPerKemasan": 4,
          "energiTotal": "130 kkal (per saji)",
          "lemakTotal": "8 g (Lemak jenuh 3.5 g)",
          "protein": "1 g",
          "karbohidratTotal": "15 g",
          "gulaTotal": "1 g",
          "natrium": "240 mg"
        },
        "pertanyaan": [
          {
            "tanya": "Berapa total natrium yang masuk ke tubuh jika kamu menghabiskan satu bungkus keripik 100 gram ini saat menonton film?",
            "pilihan": [
              "240 mg",
              "480 mg",
              "720 mg",
              "960 mg"
            ],
            "jawabanBenar": 3,
            "penjelasan": "Satu bungkus berisi 4 sajian. Natrium per saji 240 mg x 4 = 960 mg natrium (hampir 50% dari batas maksimal 2.000 mg natrium per hari menurut Kemenkes)."
          },
          {
            "tanya": "Berapa total kalori dari satu bungkus keripik 100 gram ini?",
            "pilihan": [
              "130 kkal",
              "260 kkal",
              "520 kkal",
              "1.000 kkal"
            ],
            "jawabanBenar": 2,
            "penjelasan": "130 kkal x 4 sajian = 520 kkal. Jumlah ini setara dengan kalori satu porsi makan siang lengkap bergizi seimbang!"
          },
          {
            "tanya": "Mengapa camilan seperti ini sering membuat seseorang makan berlebihan (*overeating*) tanpa merasa kenyang?",
            "pilihan": [
              "Karena densitas energinya sangat tinggi namun sangat rendah serat dan protein yang memicu hormon kenyang",
              "Karena keripik kentang mengandung obat bius lambung",
              "Karena keripik menyerap seluruh oksigen di mulut",
              "Karena suhu keripik terlalu dingin"
            ],
            "jawabanBenar": 0,
            "penjelasan": "Kombinasi garam tinggi, lemak tinggi, dan ketiadaan serat serta protein menciptakan palatabilitas ekstrem yang membajak sistem reward dopamin otak tanpa mengirim sinyal kenyang mekanis lambung."
          }
        ]
      },
      {
        "id": "fd-3",
        "namaProduk": "Sereal Gandum Utuh Madu (Kotak 300 gram)",
        "kategori": "Sarapan Siap Saji",
        "label": {
          "takaranSaji": "40 gram",
          "jumlahSajianPerKemasan": 7.5,
          "energiTotal": "150 kkal (per saji)",
          "lemakTotal": "1.5 g",
          "protein": "4 g",
          "karbohidratTotal": "30 g",
          "seratPangan": "4 g",
          "gulaTotal": "5 g",
          "natrium": "110 mg"
        },
        "pertanyaan": [
          {
            "tanya": "Mengapa produk sereal ini dapat dikategorikan sebagai pilihan sarapan yang relatif baik?",
            "pilihan": [
              "Mengandung serat pangan tinggi (4g) dan kandungan gula terkontrol (<6g per saji)",
              "Karena tidak mengandung karbohidrat sama sekali",
              "Karena berwarna cokelat keemasan",
              "Karena tidak memerlukan susu"
            ],
            "jawabanBenar": 0,
            "penjelasan": "Rasio serat terhadap karbohidrat yang baik (minimal 1g serat per 10g karbohidrat) dan gula di bawah 6g per saji menjadikannya pilihan karbohidrat kompleks berkualitas."
          },
          {
            "tanya": "Berapa gram serat pangan total yang kamu peroleh bila memadukan 1 saji sereal ini dengan 1 buah pisang (±3g serat)?",
            "pilihan": [
              "4 gram",
              "7 gram",
              "15 gram",
              "30 gram"
            ],
            "jawabanBenar": 1,
            "penjelasan": "4 gram dari sereal + 3 gram dari pisang = 7 gram serat pangan (sudah memenuhi sekitar 25-28% dari target kebutuhan serat harian 25-30g)."
          },
          {
            "tanya": "Apa urutan bahan pertama yang wajib kita periksa pada daftar komposisi (ingredients list) untuk memastikan sereal tersebut benar-benar sehat?",
            "pilihan": [
              "Gandum utuh / tepung gandum utuh (whole grain / whole wheat) di urutan pertama",
              "Gula pasir atau sirup fruktosa di urutan pertama",
              "Minyak kelapa sawit terhidrogenasi",
              "Perisa sintetik madu"
            ],
            "jawabanBenar": 0,
            "penjelasan": "Daftar komposisi diurutkan berdasarkan persentase bobot terbesar ke terkecil. Sereal gandum sehat wajib mencantumkan biji gandum utuh sebagai bahan nomor satu."
          }
        ]
      }
    ]
  },
  "fitnessChallenge": {
    "instruksi": "Selesaikan 5 stage tantangan kebugaran terencana untuk menguji pemahaman taktismu dalam merancang latihan yang aman dan efektif!",
    "stages": [
      {
        "stage": 1,
        "judul": "Stage 1: Pemanasan & Mobilitas Sendi",
        "skenario": "Kamu baru tiba di lapangan untuk jogging sore setelah 7 jam duduk di depan laptop. Betis dan pinggulmu terasa kaku. Apa langkah pembuka yang paling aman dan efektif?",
        "pilihan": [
          "Langsung sprint 100 meter sekuat tenaga untuk mengejutkan otot",
          "Lakukan 5-8 menit pemanasan dinamis (walking lunges, leg swings, ankle rotations, dan jalan cepat bertahap)",
          "Duduk membungkuk statis menyentuh jari kaki selama 5 menit tanpa bergerak",
          "Minum minuman berenergi berkafein tinggi lalu langsung lari tanjakan"
        ],
        "jawabanBenar": 1,
        "penjelasan": "Pemanasan dinamis menaikkan suhu jaringan secara bertahap, meningkatkan sirkulasi darah kapiler, dan melumasi sendi panggul serta pergelangan kaki tanpa menurunkan output tenaga ledak."
      },
      {
        "stage": 2,
        "judul": "Stage 2: Teknik & Form Gerakan",
        "skenario": "Kamu ingin melatih kekuatan otot dada dan trisep, tetapi belum sanggup melakukan push-up lantai dengan punggung lurus. Apa bentuk adaptasi teknik yang paling tepat?",
        "pilihan": [
          "Memaksakan push-up lantai meskipun pinggang melorot ke bawah dan bahu menjepit",
          "Melakukan knee push-up (bertumpu pada lutut) atau incline push-up (tangan di bangku kokoh) sambil menjaga postur leher hingga panggul lurus",
          "Berhenti melatih kekuatan otot dada selamanya",
          "Menggoyangkan kepala ke depan dan ke belakang tanpa menekuk siku"
        ],
        "jawabanBenar": 1,
        "penjelasan": "Regresi latihan yang tepat menjaga biomekanika sendi dan rekrutmen otot target tetap optimal sambil melindungi diskus tulang belakang dari hiperekstensi."
      },
      {
        "stage": 3,
        "judul": "Stage 3: Kontrol Intensitas & Tes Bicara",
        "skenario": "Di menit ke-15 latihan lari, napasmu mulai terengah-engah hebat hingga kamu sama sekali tidak sanggup mengucapkan 2 kata sekalipun. Apa maknanya dan apa tindakan bijakmu?",
        "pilihan": [
          "Artinya latihanmu gagal total, kamu harus berhenti olahraga untuk selamanya",
          "Kamu telah menembus ambang anaerobik (>85% MHR). Turunkan tempo menjadi jalan cepat atau jogging santai hingga mampu berbicara kalimat pendek (Talk Test zona sedang)",
          "Tahan napasmu selama 30 detik agar jantung berdetak lebih pelan",
          "Tingkatkan kecepatan lari dua kali lipat hingga pingsan"
        ],
        "jawabanBenar": 1,
        "penjelasan": "Bila Talk Test menunjukkan ketidakmampuan berbicara kata pendek, intensitas telah masuk zona anaerobik tinggi yang tidak berkelanjutan untuk sesi daya tahan pemula. Perlambat tempo untuk kembali ke zona aerobik aman."
      },
      {
        "stage": 4,
        "judul": "Stage 4: Nutrisi Pemulihan Pasca Latihan",
        "skenario": "Sesi latihan beban seluruh tubuh selama 45 menit telah tuntas. Otot terasa lelah dan glikogen menipis. Pilihan menu pemulihan manakah yang paling cepat mendukung sintesis protein otot?",
        "pilihan": [
          "Makan kerupuk kaleng dan es sirup manis",
          "Kombinasi 20-30 gram protein lengkap (seperti telur/ayam/tempe) dengan karbohidrat kompleks (nasi merah/kentang/pisang) dan air putih",
          "Menghindari makan dan minum apapun selama 6 jam ke depan",
          "Minum minyak goreng 2 sendok makan"
        ],
        "jawabanBenar": 1,
        "penjelasan": "Protein menyediakan asam amino esensial untuk sintesis miofibrilar, sedangkan karbohidrat memicu respon insulin anabolik yang mengembalikan cadangan glikogen otot secara sinergis."
      },
      {
        "stage": 5,
        "judul": "Stage 5: Manajemen Pemulihan & Hari Istirahat",
        "skenario": "Kamu sudah berlatih keras selama 3 hari berturut-turut. Otot paha terasa pegal (DOMS) dan kamu merasa sedikit letih. Apa keputusan terbaik untuk jadwal olahragamu hari ini?",
        "pilihan": [
          "Memaksakan angkat beban dua kali lebih berat untuk menghukum rasa malas",
          "Mengambil Active Recovery Day: jalan santai 20-30 menit di udara terbuka, minum air cukup, peregangan lembut, dan tidur 8 jam",
          "Tidur terlentang 24 jam penuh tanpa bangun sama sekali",
          "Minum obat pereda nyeri dosis ganda agar bisa latihan maraton"
        ],
        "jawabanBenar": 1,
        "penjelasan": "Active recovery melancarkan pembuangan produk metabolit dan mempercepat penyembuhan mikrotrauma otot melalui aliran darah tanpa membebani sistem saraf pusat."
      }
    ]
  }
};

export const FAKTA_HARIAN_LIST = [
  {
    "hari": 1,
    "topik": "Protein & Otot",
    "fakta": "Telur utuh memiliki Biological Value (BV) 100, menjadikannya salah satu standar referensi mutu protein tertinggi dalam ilmu gizi internasional.",
    "penjelasanIlmiah": "Seluruh asam amino esensial dalam telur hadir dalam rasio yang sangat cocok dengan kebutuhan sintesis jaringan tubuh manusia.",
    "sumber": "FAO/WHO Expert Consultation on Protein Quality",
    "url": "https://www.fao.org/nutrition/en/"
  },
  {
    "hari": 2,
    "topik": "Serat & Mikrobioma",
    "fakta": "Setiap peningkatan 8 gram asupan serat harian berkaitan dengan penurunan risiko penyakit kardiovaskular sebesar 15-27%.",
    "penjelasanIlmiah": "Serat difermentasi bakteri usus menjadi Short-Chain Fatty Acids (SCFA) yang menekan inflamasi sistemik dan mengontrol kolesterol.",
    "sumber": "The Lancet (Reynolds et al., 2019)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/30638909/"
  },
  {
    "hari": 3,
    "topik": "Aktivitas Fisik",
    "fakta": "Berjalan kaki santai 30 menit sehari mampu menurunkan risiko diabetes tipe 2 hingga 30% dengan meningkatkan translokasi GLUT-4 di otot.",
    "penjelasanIlmiah": "Kontraksi otot rangka menyerap glukosa darah secara langsung tanpa bergantung penuh pada hormon insulin.",
    "sumber": "World Health Organization 2020 Guidelines",
    "url": "https://pubmed.ncbi.nlm.nih.gov/33239350/"
  },
  {
    "hari": 4,
    "topik": "Tidur & Pemulihan",
    "fakta": "Hingga 70% sekresi Human Growth Hormone (HGH) harian manusia dilepaskan saat fase tidur nyenyak (Slow-Wave Sleep / NREM stage 3).",
    "penjelasanIlmiah": "HGH merangsang sintesis protein, regenerasi seluler, dan perbaikan mikrotrauma otot yang terjadi saat berolahraga.",
    "sumber": "Current Sports Medicine Reports (Watson, 2017)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/29135858/"
  },
  {
    "hari": 5,
    "topik": "Hidrasi & Kognisi",
    "fakta": "Dehidrasi ringan sebesar 1-2% berat badan sudah cukup untuk menurunkan konsentrasi, kewaspadaan, dan memicu sakit kepala tegang.",
    "penjelasanIlmiah": "Penurunan volume cairan intraseluler menurunkan tekanan perfusi mikrovaskular otak dan mengganggu transmisi sinaptik.",
    "sumber": "Nutrition Reviews (Popkin et al., 2010)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/20646222/"
  },
  {
    "hari": 6,
    "topik": "Kesehatan Tulang",
    "fakta": "Latihan kekuatan (beban) merangsang sel osteoblas untuk memperkuat matriks kalsium tulang melalui efek piezoelektrik mekanis.",
    "penjelasanIlmiah": "Tulang beradaptasi terhadap beban mekanik eksternal sesuai Hukum Wolff, mencegah osteoporosis dini.",
    "sumber": "American College of Sports Medicine (ACSM)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/21694556/"
  },
  {
    "hari": 7,
    "topik": "Omega-3 Lokal",
    "fakta": "Ikan kembung mengandung sekitar 2,2-2,6 gram asam lemak Omega-3 per 100 gram, setara atau bahkan lebih tinggi dari ikan salmon impor.",
    "penjelasanIlmiah": "EPA dan DHA pada ikan kembung membantu menjaga kelenturan membran eritrosit dan stabilitas ritme jantung.",
    "sumber": "Balitbangkes Kementerian Kesehatan RI",
    "url": "https://kesmas.kemkes.go.id"
  },
  {
    "hari": 8,
    "topik": "Zat Besi & Anemia",
    "fakta": "Mengonsumsi sumber vitamin C bersamaan dengan sayuran hijau dapat meningkatkan penyerapan zat besi non-heme hingga 3-4 kali lipat.",
    "penjelasanIlmiah": "Asam askorbat mereduksi ion feri (Fe3+) menjadi fero (Fe2+) yang stabil dan larut di usus halus.",
    "sumber": "Postgraduate Medical Journal (Shenkin, 2006)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/16954450/"
  },
  {
    "hari": 9,
    "topik": "Termodinamika Lemak",
    "fakta": "Keringat berlebih bukan tanda lemak terbakar, melainkan respon penguapan air untuk mencegah tubuh mengalami hipertermia (kepanasan).",
    "penjelasanIlmiah": "Oksidasi asam lemak terjadi di mitokondria dan menghasilkan produk akhir karbon dioksida (84%) yang dihembuskan lewat paru-paru dan air (16%).",
    "sumber": "British Medical Journal (Meerman & Brown, 2014)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/25516362/"
  },
  {
    "hari": 10,
    "topik": "Postur Tubuh",
    "fakta": "Membungkukkan leher 60 derajat saat menatap ponsel meningkatkan beban gravitasi pada tulang servikal hingga setara 27 kilogram.",
    "penjelasanIlmiah": "Momen inersia akibat pergeseran pusat massa kepala ke anterior meningkatkan gaya tensil pada otot trapezius dan ligamen nuchae.",
    "sumber": "Surgical Technology International (Hansraj, 2014)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/25393825/"
  },
  {
    "hari": 11,
    "topik": "Kesehatan Mental",
    "fakta": "Berjalan di alam terbuka selama 20 menit terbukti menurunkan konsentrasi hormon stres kortisol dalam saliva hingga 21%.",
    "penjelasanIlmiah": "Stimulasi visual dan auditori lingkungan alami memodulasi aktivitas amigdala dan mengaktifkan nada parasimpatik vagal.",
    "sumber": "Frontiers in Psychiatry (Schultchen et al., 2019)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/31214061/"
  },
  {
    "hari": 12,
    "topik": "Metabolisme Basal",
    "fakta": "Jaringan otot rangka membakar kalori sekitar 3 kali lebih banyak daripada jaringan lemak tubuh bahkan saat kamu sedang istirahat total.",
    "penjelasanIlmiah": "Tingkat pergantian protein (*protein turnover*) dan gradien ion pada sel otot menuntut konsumsi energi metabolik berkelanjutan.",
    "sumber": "American Journal of Clinical Nutrition (Hall et al., 2012)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/22434603/"
  },
  {
    "hari": 13,
    "topik": "Kualitas Karbohidrat",
    "fakta": "Ubi jalar dan oatmeal memiliki Indeks Glikemik rendah yang melepaskan glukosa secara perlahan, mencegah kantuk siang hari (sugar crash).",
    "penjelasanIlmiah": "Amilosa dan serat larut memperlambat laju hidrolisis enzim alfa-amilase di saluran pencernaan.",
    "sumber": "Advances in Nutrition (Slavin & Carlson, 2014)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/25398736/"
  },
  {
    "hari": 14,
    "topik": "Prinsip Pemulihan",
    "fakta": "Nyeri otot pasca-latihan (DOMS) bukan disebabkan oleh asam laktat, melainkan peradangan mikrostruktural pemulihan sarkomer otot.",
    "penjelasanIlmiah": "Asam laktat dimetabolisme kembali menjadi glikogen di hati melalui Siklus Cori dalam waktu 60 menit setelah latihan selesai.",
    "sumber": "International Journal of Sports Physiology and Performance (Kellmann et al., 2018)",
    "url": "https://pubmed.ncbi.nlm.nih.gov/29334269/"
  }
];

export const TANTANGAN_HARIAN_LIST = [
  {
    "id": "dhc-1",
    "hari": 1,
    "pertanyaan": "Apakah tidur yang cukup (7-9 jam) dapat memengaruhi efektivitas proses pemulihan dan pembentukan otot?",
    "pilihan": [
      "Tidak berpengaruh, otot hanya peduli pada angkat beban",
      "Sangat berpengaruh, karena fase deep sleep melepaskan hormon pertumbuhan (HGH) yang meregenerasi jaringan otot",
      "Hanya berpengaruh jika tidur di siang hari",
      "Tidur terlalu lama justru menghilangkan seluruh otot"
    ],
    "jawabanBenar": 1,
    "penjelasan": "Konsensus ilmiah kedokteran olahraga membuktikan bahwa mayoritas sintesis protein dan perbaikan seluler dipicu oleh pelepasan hormon pertumbuhan saat fase slow-wave sleep.",
    "sumber": "Current Sports Medicine Reports (Watson, 2017)"
  },
  {
    "id": "dhc-2",
    "hari": 2,
    "pertanyaan": "Berdasarkan pedoman Isi Piringku Kemenkes RI, berapa porsi ideal sayuran dalam satu piring makan utama?",
    "pilihan": [
      "1/6 bagian piring",
      "2/3 dari setengah piring khusus sayur dan buah",
      "Hanya 1 lembar daun selada",
      "Seluruh piring tanpa makanan pokok"
    ],
    "jawabanBenar": 1,
    "penjelasan": "Pada setengah piring yang dialokasikan untuk sayur dan buah, sayuran menempati porsi 2/3 bagian sedangkan buah-buahan menempati 1/3 bagian.",
    "sumber": "Kementerian Kesehatan Republik Indonesia (2017)"
  },
  {
    "id": "dhc-3",
    "hari": 3,
    "pertanyaan": "Apakah mengonsumsi air es dapat membekukan lemak makanan di dalam lambung manusia?",
    "pilihan": [
      "Ya, lemak langsung membeku dan menjadi plak di dinding usus",
      "Mitos, karena suhu cairan segera dihangatkan oleh tubuh hingga mencapai suhu inti 37°C",
      "Ya, hanya bila dicampur gula batu",
      "Mitos, karena air es berubah menjadi minyak di lambung"
    ],
    "jawabanBenar": 1,
    "penjelasan": "Sistem termoregulasi tubuh segera menyesuaikan suhu bolus makanan dan cairan yang masuk ke lambung menjadi suhu tubuh fisiologis normal 37°C.",
    "sumber": "Harvard Medical School Health Publishing"
  },
  {
    "id": "dhc-4",
    "hari": 4,
    "pertanyaan": "Berapa anjuran minimal durasi aktivitas fisik intensitas sedang per minggu menurut rekomendasi WHO?",
    "pilihan": [
      "15 menit per minggu",
      "60 menit per minggu",
      "150 - 300 menit per minggu",
      "1.000 menit per minggu"
    ],
    "jawabanBenar": 2,
    "penjelasan": "WHO merekomendasikan 150-300 menit aktivitas aerobik intensitas sedang atau 75-150 menit intensitas tinggi setiap minggu bagi orang dewasa.",
    "sumber": "WHO 2020 Guidelines on Physical Activity"
  },
  {
    "id": "dhc-5",
    "hari": 5,
    "pertanyaan": "Manakah jenis peregangan yang paling dianjurkan dilakukan SEBELUM berolahraga intensif?",
    "pilihan": [
      "Peregangan statis pasif ditahan 60 detik",
      "Peregangan dinamis aktif dengan gerakan terkontrol",
      "Tidak bergerak sama sekali",
      "Menekuk leher ke belakang sekuat tenaga"
    ],
    "jawabanBenar": 1,
    "penjelasan": "Peregangan dinamis mengaktifkan sistem neuromuskular dan menghangatkan jaringan tanpa menurunkan kapasitas kekuatan ledak otot.",
    "sumber": "Applied Physiology, Nutrition, and Metabolism (Behm et al., 2016)"
  },
  {
    "id": "dhc-6",
    "hari": 6,
    "pertanyaan": "Berapa gram batas maksimal anjuran konsumsi gula per orang per hari menurut Kementerian Kesehatan RI?",
    "pilihan": [
      "10 gram (1 sendok teh)",
      "50 gram (setara 4 sendok makan)",
      "120 gram (setara 1 gelas)",
      "Bebas tanpa batasan"
    ],
    "jawabanBenar": 1,
    "penjelasan": "Aturan G4-G1-L5 Kemenkes menetapkan konsumsi gula maksimal 4 sendok makan (50 gram) per orang per hari untuk mencegah diabetes.",
    "sumber": "Permenkes No. 41 Tahun 2014 Pedoman Gizi Seimbang"
  },
  {
    "id": "dhc-7",
    "hari": 7,
    "pertanyaan": "Apakah asam laktat merupakan penyebab rasa pegal dan nyeri otot (DOMS) yang muncul 24 jam setelah olahraga?",
    "pilihan": [
      "Ya, asam laktat membeku di otot selama seminggu",
      "Bukan, asam laktat sudah bersih dalam 1 jam; DOMS disebabkan oleh respon inflamasi pemulihan robekan mikro serat otot",
      "Ya, hanya bila tidak minum susu",
      "DOMS adalah tanda tulang retak"
    ],
    "jawabanBenar": 1,
    "penjelasan": "Riset membuktikan laktat darah kembali ke baseline dalam 60 menit pasca latihan. DOMS diakibatkan oleh mikrotrauma otot dan respon inflamasi perbaikan jaringan.",
    "sumber": "Journal of Strength and Conditioning Research"
  },
  {
    "id": "dhc-8",
    "hari": 8,
    "pertanyaan": "Mineral mikro esensial apakah yang merupakan inti pengikat oksigen pada sel darah merah manusia?",
    "pilihan": [
      "Zat Besi (Fe)",
      "Kalsium (Ca)",
      "Natrium (Na)",
      "Belerang (S)"
    ],
    "jawabanBenar": 0,
    "penjelasan": "Zat besi adalah ion sentral molekul heme dalam hemoglobin yang bertanggung jawab mentranspor oksigen dari paru-paru ke seluruh jaringan tubuh.",
    "sumber": "Postgraduate Medical Journal (Shenkin, 2006)"
  },
  {
    "id": "dhc-9",
    "hari": 9,
    "pertanyaan": "Mengapa kenaikan berat badan pada program 'clean/lean bulking' sengaja dibatasi hanya 0,5 - 1 kg per bulan bagi pemula?",
    "pilihan": [
      "Karena laju fisiologis maksimal sintesis otot alami berkisar di angka tersebut, dan kelebihan kalori sisanya hanya akan menjadi lemak",
      "Karena tulang manusia tidak kuat menahan beban lebih",
      "Karena timbangan berat badan akan rusak",
      "Karena otot akan mengecil jika naik lebih cepat"
    ],
    "jawabanBenar": 0,
    "penjelasan": "Secara alami, laju sintesis miofibrilar otot memiliki batas biologis. Kenaikan berat badan melebihi 1 kg/bulan pada umumnya didominasi penimbunan lemak tubuh.",
    "sumber": "Sports MDPI (Iraki et al., 2019)"
  },
  {
    "id": "dhc-10",
    "hari": 10,
    "pertanyaan": "Bagaimana posisi layar kerja/laptop yang paling ergonomis untuk mencegah sindrom Text Neck pada leher?",
    "pilihan": [
      "Diletakkan di pangkuan paha",
      "Sejajar dengan garis pandang horizontal mata",
      "Ditaruh di lantai sebelah kiri kursi",
      "Ditempel di langit-langit kamar"
    ],
    "jawabanBenar": 1,
    "penjelasan": "Menjaga batas atas layar sejajar pandangan mata mencegah fleksi tulang leher yang meningkatkan beban gravitasi kepala.",
    "sumber": "Manual Therapy (Lau et al., 2010)"
  },
  {
    "id": "dhc-11",
    "hari": 11,
    "pertanyaan": "Berapa target konsumsi serat harian yang dianjurkan untuk orang dewasa guna mendukung mikrobioma usus dan kesehatan jantung?",
    "pilihan": [
      "5 - 8 gram per hari",
      "25 - 30 gram per hari",
      "90 - 100 gram per hari",
      "Serat tidak diperlukan oleh tubuh"
    ],
    "jawabanBenar": 1,
    "penjelasan": "Konsensus nutrisi internasional menganjurkan 25-30 gram serat pangan harian dari sayur, buah, polong-polongan, dan biji-bijian utuh.",
    "sumber": "The Lancet (Reynolds et al., 2019)"
  },
  {
    "id": "dhc-12",
    "hari": 12,
    "pertanyaan": "Apa dampak buruk langsung dari kondisi dehidrasi ringan (defisit cairan 1-2% dari berat badan)?",
    "pilihan": [
      "Kekuatan fisik dan konsentrasi kognitif menurun hingga 10-15%",
      "Warna rambut langsung memutih",
      "Ukuran sepatu bertambah besar",
      "Tidak ada dampak sama sekali"
    ],
    "jawabanBenar": 0,
    "penjelasan": "Dehidrasi 1-2% secara klinis terbukti menurunkan volume sekuncup jantung, menaikkan suhu tubuh, dan menurunkan kapasitas memori kerja otak.",
    "sumber": "Nutrition Reviews (Popkin et al., 2010)"
  },
  {
    "id": "dhc-13",
    "hari": 13,
    "pertanyaan": "Aktivitas manakah yang paling akurat menggambarkan 'Active Recovery' (pemulihan aktif)?",
    "pilihan": [
      "Jalan kaki santai 20 menit di taman untuk melancarkan sirkulasi darah tanpa menambah kelelahan otot",
      "Lari maraton 42 kilometer secepat mungkin",
      "Tidur telentang tanpa bergerak selama 24 jam",
      "Angkat beban maksimal repetisi 1 RM"
    ],
    "jawabanBenar": 0,
    "penjelasan": "Pemulihan aktif menggunakan gerak intensitas rendah untuk merangsang pompa vena dan pertukaran nutrisi jaringan tanpa memicu kelelahan baru.",
    "sumber": "International Journal of Sports Physiology and Performance (Kellmann et al., 2018)"
  },
  {
    "id": "dhc-14",
    "hari": 14,
    "pertanyaan": "Apakah berjalan kaki santai atau menaiki tangga dihitung sebagai aktivitas bermanfaat bagi kesehatan menurut WHO?",
    "pilihan": [
      "Tidak, hanya olahraga berat di tempat gym yang diakui",
      "Ya, moto 'Every Move Counts' menegaskan bahwa setiap aktivitas fisik non-sedentari membawa dampak positif bagi metabolisme",
      "Hanya jika dilakukan sambil membawa beban 20 kg",
      "Hanya bila dilakukan saat matahari terik tengah hari"
    ],
    "jawabanBenar": 1,
    "penjelasan": "Pedoman WHO 2020 menegaskan bahwa memutus waktu duduk dengan aktivitas ringan (NEAT) bermanfaat nyata menurunkan risiko metabolik.",
    "sumber": "British Journal of Sports Medicine (Bull et al., 2020)"
  }
];

export const BADGE_EDUKASI_LIST = [
  {
    "id": "penjelajah-sehat",
    "nama": "Penjelajah Sehat",
    "ikon": "🌱",
    "syarat": "Menyelesaikan 1 materi edukasi",
    "jumlahSyarat": 1,
    "deskripsi": "Langkah pertama yang luar biasa dalam mempelajari sains kesehatan dan gizi untuk tubuhmu."
  },
  {
    "id": "pembelajar-aktif",
    "nama": "Pembelajar Aktif",
    "ikon": "📚",
    "syarat": "Menyelesaikan 5 materi edukasi",
    "jumlahSyarat": 5,
    "deskripsi": "Konsistensi belajar yang solid! Kamu telah menguasai fondasi nutrisi dan prinsip kebugaran."
  },
  {
    "id": "health-enthusiast",
    "nama": "Health Enthusiast",
    "ikon": "🧠",
    "syarat": "Menyelesaikan 10 materi edukasi",
    "jumlahSyarat": 10,
    "deskripsi": "Pengetahuan kesehatanmu semakin mendalam dengan pemahaman ilmiah yang kuat dan kritis."
  },
  {
    "id": "health-master",
    "nama": "Health Master",
    "ikon": "🏆",
    "syarat": "Menyelesaikan 20 materi edukasi",
    "jumlahSyarat": 20,
    "deskripsi": "Lulusan paripurna Pusat Edukasi Kesehatan GERAK! Kamu siap menjadi inspirasi hidup sehat bagi orang lain."
  }
];