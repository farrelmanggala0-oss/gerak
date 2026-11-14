// =========================================
// GERAK - data/panduan-simulasi.js
// Panduan video simulasi per pola gerakan.
// Video di assets/workout/simulasi/ adalah ANIMASI ILUSTRASI buatan GERAK (loop 4 detik),
// bukan rekaman pelatih. Tim bisa mengganti file .mp4 dengan rekaman asli tanpa ubah kode.
// fase: waktu (detik) di dalam loop 4 detik, dipakai untuk menyorot langkah yang sedang tampil.
// =========================================

const folder = "assets/workout/simulasi/";

export const PANDUAN_SIMULASI = {
  squat: {
    judul: "Squat",
    video: folder + "squat.mp4",
    poster: folder + "squat.jpg",
    fase: [
      { label: "Turun pelan", mulai: 0, akhir: 2 },
      { label: "Tahan", mulai: 2, akhir: 3 },
      { label: "Dorong naik", mulai: 3, akhir: 4 }
    ],
    langkah: [
      "Berdiri, kaki selebar bahu, ujung jari kaki sedikit keluar.",
      "Dorong pinggul ke belakang seperti mau duduk, dada tetap terangkat.",
      "Turun sampai paha sejajar lantai atau senyamanmu.",
      "Dorong lantai dengan tumit untuk berdiri lagi."
    ],
    hindari: ["Lutut masuk ke dalam", "Tumit terangkat", "Punggung membungkuk"],
    versiRingan: "Box squat: turun sampai pantat menyentuh kursi, lalu berdiri lagi."
  },
  lunge: {
    judul: "Lunge",
    video: folder + "lunge.mp4",
    poster: folder + "lunge.jpg",
    fase: [
      { label: "Turun lurus ke bawah", mulai: 0, akhir: 2 },
      { label: "Tahan", mulai: 2, akhir: 3 },
      { label: "Dorong naik", mulai: 3, akhir: 4 }
    ],
    langkah: [
      "Berdiri tegak, langkahkan satu kaki ke depan.",
      "Turunkan badan lurus ke bawah sampai kedua lutut sekitar 90°.",
      "Lutut belakang hampir menyentuh lantai, badan tetap tegak.",
      "Dorong kaki depan untuk kembali naik."
    ],
    hindari: ["Badan condong ke depan", "Lutut depan goyang ke dalam", "Langkah terlalu pendek"],
    versiRingan: "Lunge di tempat sambil pegang kursi, turun lebih dangkal."
  },
  pushup: {
    judul: "Push-up",
    video: folder + "pushup.mp4",
    poster: folder + "pushup.jpg",
    fase: [
      { label: "Turun pelan", mulai: 0, akhir: 2 },
      { label: "Tahan", mulai: 2, akhir: 3 },
      { label: "Dorong naik", mulai: 3, akhir: 4 }
    ],
    langkah: [
      "Tangan di lantai sedikit lebih lebar dari bahu.",
      "Badan lurus dari kepala sampai tumit, perut dikencangkan.",
      "Tekuk siku sekitar 45° dari badan sampai dada dekat lantai.",
      "Dorong lantai sampai lengan lurus lagi."
    ],
    hindari: ["Pinggul turun atau naik", "Siku dibuka lebar ke samping", "Kepala menunduk ke lantai"],
    versiRingan: "Knee push-up (lutut di lantai) atau push-up dengan tangan di meja/tembok."
  },
  plank: {
    judul: "Plank / otot inti",
    video: folder + "plank.mp4",
    poster: folder + "plank.jpg",
    fase: [
      { label: "Tahan lurus, napas tetap jalan", mulai: 0, akhir: 4 }
    ],
    langkah: [
      "Siku tepat di bawah bahu, lengan bawah menempel lantai.",
      "Luruskan kaki, bertumpu di ujung jari kaki.",
      "Kencangkan perut dan pantat sampai badan lurus.",
      "Tahan sambil bernapas normal."
    ],
    hindari: ["Pinggul turun (punggung melengkung)", "Pantat terlalu tinggi", "Menahan napas"],
    versiRingan: "Plank dengan lutut di lantai, tahan 10–15 detik dulu."
  },
  bridge: {
    judul: "Glute bridge / hip hinge",
    video: folder + "bridge.mp4",
    poster: folder + "bridge.jpg",
    fase: [
      { label: "Angkat pinggul", mulai: 0, akhir: 2 },
      { label: "Tahan, remas pantat", mulai: 2, akhir: 3 },
      { label: "Turun pelan", mulai: 3, akhir: 4 }
    ],
    langkah: [
      "Berbaring, lutut ditekuk, telapak kaki menapak selebar pinggul.",
      "Tekan lantai dengan tumit dan angkat pinggul.",
      "Berhenti saat bahu, pinggul, dan lutut segaris.",
      "Turunkan pinggul pelan-pelan."
    ],
    hindari: ["Punggung melengkung berlebihan", "Bertumpu di leher", "Kaki terlalu jauh dari pantat"],
    versiRingan: "Angkat pinggul setengah saja dan tahan 2 detik."
  },
  curl: {
    judul: "Bicep curl / tarik",
    video: folder + "curl.mp4",
    poster: folder + "curl.jpg",
    fase: [
      { label: "Angkat", mulai: 0, akhir: 2 },
      { label: "Tahan", mulai: 2, akhir: 3 },
      { label: "Turun pelan", mulai: 3, akhir: 4 }
    ],
    langkah: [
      "Berdiri tegak, pegang beban (botol air/dumbbell).",
      "Siku menempel di samping badan.",
      "Tekuk siku dan angkat beban ke arah bahu.",
      "Turunkan pelan sampai lengan hampir lurus."
    ],
    hindari: ["Mengayun badan", "Siku maju ke depan", "Beban terlalu berat"],
    versiRingan: "Pakai botol air 600 ml atau duduk bersandar di kursi."
  },
  recovery: {
    judul: "Peregangan (cat-cow)",
    video: folder + "recovery.mp4",
    poster: folder + "recovery.jpg",
    fase: [
      { label: "Bulatkan punggung, buang napas", mulai: 0, akhir: 2 },
      { label: "Tahan", mulai: 2, akhir: 3 },
      { label: "Turunkan perut, tarik napas", mulai: 3, akhir: 4 }
    ],
    langkah: [
      "Posisi merangkak: tangan di bawah bahu, lutut di bawah pinggul.",
      "Buang napas sambil membulatkan punggung ke atas, kepala menunduk.",
      "Tarik napas sambil menurunkan perut dan mengangkat dada.",
      "Gerak pelan mengikuti napas."
    ],
    hindari: ["Gerakan cepat dan menyentak", "Menahan napas", "Memaksa sampai nyeri"],
    versiRingan: "Lakukan sambil duduk di kursi: bulatkan dan tegakkan punggung."
  },
  cardio: {
    judul: "Kardio (jogging di tempat)",
    video: folder + "cardio.mp4",
    poster: folder + "cardio.jpg",
    fase: [
      { label: "Ritme stabil, masih bisa ngobrol", mulai: 0, akhir: 4 }
    ],
    langkah: [
      "Badan tegak sedikit condong ke depan.",
      "Ayun lengan berlawanan dengan kaki, siku sekitar 90°.",
      "Mendarat dengan bagian tengah telapak kaki.",
      "Jaga napas teratur, masih bisa bicara pendek."
    ],
    hindari: ["Mendarat dengan tumit keras", "Bahu tegang naik", "Tempo terlalu cepat sejak awal"],
    versiRingan: "Jalan cepat di tempat atau jalan santai 10–15 menit."
  }
};

export function dapatkanPanduanSimulasi(tipe) {
  return PANDUAN_SIMULASI[tipe] || PANDUAN_SIMULASI.cardio;
}