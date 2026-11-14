// =========================================
// GERAK - js/kesehatan-ui.js
// Tampilan Riwayat Kesehatan: dialog lapor keluhan saat latihan, dialog medical checkup,
// daftar riwayat, dan analisis GERAK AI (cloud bila tersedia, analisis lokal sebagai cadangan).
// =========================================

import { el, tampilToast } from "./ui.js";
import { simpanData } from "./penyimpanan.js";
import { hariIni, formatTanggalIndonesia } from "./tanggal.js";
import { formatPesanMarkdown } from "./gerak-ai.js";
import {
  BAGIAN_TUBUH,
  JENIS_KELUHAN,
  FASE_KELUHAN,
  ANJURAN_OLAHRAGA,
  riwayatKosong,
  validasiLaporanKeluhan,
  cekTandaBahaya,
  saranModifikasi,
  validasiCheckup,
  tambahKeluhan,
  tambahCheckup,
  hapusEntriKesehatan,
  keluhanTerakhirUntukGerakan,
  analisisRiwayat,
  buatPromptAnalisisAI,
  ringkasKeluhan,
  labelFaseKeluhan,
  labelAnjuran
} from "./kesehatan.js";

let appStateRef = null;
let laporanAktif = null; // { gerakan, tipeGerakan, onTersimpan }

function ambilRiwayat() {
  const data = appStateRef.data;
  if (!data.riwayatKesehatan || !Array.isArray(data.riwayatKesehatan.keluhan) || !Array.isArray(data.riwayatKesehatan.checkup)) {
    data.riwayatKesehatan = riwayatKosong();
  }
  return data.riwayatKesehatan;
}

function simpanRiwayat(riwayatBaru) {
  appStateRef.data.riwayatKesehatan = riwayatBaru;
  simpanData("gerakData", appStateRef.data);
  renderRiwayatKesehatan();
}

// Dipakai workout.js untuk menampilkan peringatan di kartu gerakan
export function cariKeluhanGerakan(namaGerakan) {
  if (!appStateRef) return null;
  return keluhanTerakhirUntukGerakan(ambilRiwayat(), namaGerakan, hariIni());
}

export function teksKeluhanSingkat(k) {
  return `${ringkasKeluhan(k)} (${formatTanggalIndonesia(k.tanggal)})`;
}

// ---------- Dialog lapor keluhan ----------

// Pilihan berupa checkbox: boleh centang lebih dari satu
function isiPilihanCentang(wadah, nama, daftar) {
  wadah.textContent = "";
  daftar.forEach(item => {
    const input = el("input", { type: "checkbox", name: nama, value: item.id });
    wadah.appendChild(el("label", { class: `chip-radio-kesehatan${item.bahaya ? " chip-bahaya" : ""}` }, input, el("span", { text: item.label })));
  });
}

export function bukaDialogLaporKeluhan({ gerakan, tipeGerakan }, onTersimpan) {
  const dialog = document.getElementById("dialogLaporKeluhan");
  const form = document.getElementById("formLaporKeluhan");
  if (!dialog || !form) return;

  laporanAktif = { gerakan, tipeGerakan, onTersimpan };
  form.reset();
  form.hidden = false;
  document.getElementById("hasilLaporKeluhan").hidden = true;
  document.getElementById("laporNamaGerakan").textContent = gerakan;
  document.getElementById("laporIntensitasNilai").textContent = "4";
  document.getElementById("laporError").textContent = "";

  if (!dialog.open) dialog.showModal();
}

function tampilkanHasilLaporan(laporan) {
  const form = document.getElementById("formLaporKeluhan");
  const hasil = document.getElementById("hasilLaporKeluhan");
  const bahaya = cekTandaBahaya(laporan);
  const saran = saranModifikasi(laporan.tipeGerakan, laporan.bagianTubuh, laporan.jenis);

  hasil.textContent = "";
  hasil.appendChild(el("span", { class: "label", text: "Laporan tersimpan" }));
  hasil.appendChild(el("h3", { text: bahaya.bahaya ? "Berhenti dulu ya" : "Makasih udah lapor 🙏" }));
  hasil.appendChild(el("div", {
    class: `kotak-tanda-${bahaya.bahaya ? "bahaya" : "aman"}`,
    attrs: { role: bahaya.bahaya ? "alert" : "status" },
    text: bahaya.pesan
  }));

  if (!bahaya.bahaya) {
    hasil.appendChild(el("h4", { text: "Saran posisi & versi lebih ringan" }));
    const ul = el("ul", { class: "daftar-saran-kesehatan" });
    saran.forEach(s => ul.appendChild(el("li", { text: s })));
    hasil.appendChild(ul);
  }

  const aksi = el("div", { class: "aksi-hasil-lapor" });
  if (!bahaya.bahaya) {
    const btnVideo = el("button", { type: "button", class: "tombol tombol-utama", text: "🎬 Lihat video simulasi" });
    btnVideo.addEventListener("click", () => {
      document.getElementById("dialogLaporKeluhan").close();
      if (laporanAktif && laporanAktif.bukaVideo) laporanAktif.bukaVideo();
    });
    aksi.appendChild(btnVideo);
  }
  const btnSelesai = el("button", { type: "button", class: "tombol tombol-garis", text: "Tutup" });
  btnSelesai.addEventListener("click", () => document.getElementById("dialogLaporKeluhan").close());
  aksi.appendChild(btnSelesai);
  hasil.appendChild(aksi);

  form.hidden = true;
  hasil.hidden = false;
  hasil.querySelector("h3").setAttribute("tabindex", "-1");
  hasil.querySelector("h3").focus();
}

function inisialisasiDialogLapor() {
  const form = document.getElementById("formLaporKeluhan");
  if (!form) return;

  isiPilihanCentang(document.getElementById("pilihanBagianTubuh"), "bagianTubuh", BAGIAN_TUBUH);
  isiPilihanCentang(document.getElementById("pilihanJenisKeluhan"), "jenisKeluhan", JENIS_KELUHAN);
  const selectFase = document.getElementById("laporFase");
  FASE_KELUHAN.forEach(f => selectFase.appendChild(el("option", { value: f.id, text: f.label })));

  const range = document.getElementById("laporIntensitas");
  range.addEventListener("input", () => {
    document.getElementById("laporIntensitasNilai").textContent = range.value;
  });

  form.addEventListener("change", () => {
    document.getElementById("laporError").textContent = "";
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!laporanAktif) return;
    const terpilih = nama => [...form.querySelectorAll(`input[name="${nama}"]:checked`)].map(input => input.value);
    const hasil = validasiLaporanKeluhan({
      gerakan: laporanAktif.gerakan,
      tipeGerakan: laporanAktif.tipeGerakan,
      bagianTubuh: terpilih("bagianTubuh"),
      jenis: terpilih("jenisKeluhan"),
      fase: selectFase.value,
      intensitas: range.value,
      catatan: document.getElementById("laporCatatan").value
    }, hariIni());

    if (!hasil.ok) {
      document.getElementById("laporError").textContent = hasil.pesan;
      return;
    }

    simpanRiwayat(tambahKeluhan(ambilRiwayat(), hasil.data));
    if (typeof laporanAktif.onTersimpan === "function") {
      laporanAktif.bukaVideo = laporanAktif.onTersimpan(hasil.data);
    }
    tampilkanHasilLaporan(hasil.data);
  });
}

// ---------- Dialog medical checkup ----------

function inisialisasiDialogCheckup() {
  const dialog = document.getElementById("dialogCheckup");
  const form = document.getElementById("formCheckup");
  const tombol = document.getElementById("btnTambahCheckup");
  if (!dialog || !form || !tombol) return;

  const selectAnjuran = document.getElementById("checkupAnjuran");
  ANJURAN_OLAHRAGA.forEach(a => selectAnjuran.appendChild(el("option", { value: a.id, text: a.label })));
  selectAnjuran.value = "tidak-ada";

  tombol.addEventListener("click", () => {
    form.reset();
    selectAnjuran.value = "tidak-ada";
    const tanggal = document.getElementById("checkupTanggal");
    tanggal.max = hariIni();
    tanggal.value = hariIni();
    document.getElementById("checkupError").textContent = "";
    dialog.showModal();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const nilai = id => document.getElementById(id).value;
    if (nilai("checkupTanggal") > hariIni()) {
      document.getElementById("checkupError").textContent = "Tanggal checkup tidak boleh di masa depan.";
      return;
    }
    const hasil = validasiCheckup({
      tanggal: nilai("checkupTanggal"),
      tempat: nilai("checkupTempat"),
      sistolik: nilai("checkupSistolik"),
      diastolik: nilai("checkupDiastolik"),
      detakIstirahat: nilai("checkupDetak"),
      gulaDarah: nilai("checkupGula"),
      kolesterol: nilai("checkupKolesterol"),
      anjuranOlahraga: nilai("checkupAnjuran"),
      catatanDokter: nilai("checkupCatatan")
    });
    if (!hasil.ok) {
      document.getElementById("checkupError").textContent = hasil.pesan;
      return;
    }
    simpanRiwayat(tambahCheckup(ambilRiwayat(), hasil.data));
    dialog.close();
    tampilToast("🩺 Hasil medical checkup tersimpan");
  });
}

// ---------- Render riwayat ----------

function kotakStat(angka, keterangan) {
  return el("div", { class: "stat-kesehatan" },
    el("b", { text: angka }),
    el("span", { text: keterangan })
  );
}

function tombolHapus(jenis, id, teks) {
  const btn = el("button", { type: "button", class: "tombol-hapus-kesehatan", text: "Hapus", attrs: { "aria-label": `Hapus ${teks}` } });
  btn.addEventListener("click", () => {
    simpanRiwayat(hapusEntriKesehatan(ambilRiwayat(), jenis, id));
    tampilToast("Catatan dihapus");
  });
  return btn;
}

function renderAnalisisLokal(wadah, analisis, catatanSumber) {
  wadah.textContent = "";
  if (catatanSumber) wadah.appendChild(el("p", { class: "sumber-analisis", text: catatanSumber }));
  if (analisis.peringatan.length) {
    const ul = el("ul", { class: "daftar-peringatan-kesehatan" });
    analisis.peringatan.forEach(p => ul.appendChild(el("li", { text: p })));
    wadah.appendChild(ul);
  }
  const ul = el("ul", { class: "daftar-saran-kesehatan" });
  analisis.rekomendasi.forEach(r => ul.appendChild(el("li", { text: r })));
  wadah.appendChild(ul);
}

export function renderRiwayatKesehatan() {
  if (!appStateRef) return;
  const ringkasan = document.getElementById("ringkasanKesehatan");
  const daftarKeluhan = document.getElementById("daftarKeluhanKesehatan");
  const daftarCheckup = document.getElementById("daftarCheckupKesehatan");
  const isiAnalisis = document.getElementById("isiAnalisisKesehatan");
  if (!ringkasan || !daftarKeluhan || !daftarCheckup || !isiAnalisis) return;

  const riwayat = ambilRiwayat();
  const analisis = analisisRiwayat(riwayat, hariIni());

  ringkasan.textContent = "";
  ringkasan.appendChild(kotakStat(String(analisis.keluhan30Hari), "Keluhan 30 hari terakhir"));
  ringkasan.appendChild(kotakStat(analisis.bagianTerbanyak ? analisis.bagianTerbanyak.label : "-", "Bagian tubuh tersering"));
  ringkasan.appendChild(kotakStat(analisis.checkupTerakhir ? formatTanggalIndonesia(analisis.checkupTerakhir.tanggal) : "Belum ada", "Checkup terakhir"));

  renderAnalisisLokal(isiAnalisis, analisis);

  daftarKeluhan.textContent = "";
  if (riwayat.keluhan.length === 0) {
    daftarKeluhan.appendChild(el("li", { class: "kosong-kesehatan", text: "Belum ada keluhan. Kalau ada gerakan yang bikin nggak kuat, tekan \"😣 Ada keluhan\" di sesi latihan." }));
  }
  riwayat.keluhan.forEach(k => {
    const bahaya = cekTandaBahaya(k).bahaya;
    const judul = `${k.gerakan}: ${ringkasKeluhan(k)}`;
    daftarKeluhan.appendChild(el("li", { class: `item-kesehatan${bahaya ? " item-bahaya" : ""}` },
      el("div", { class: "isi-item-kesehatan" },
        el("span", { class: "tanggal-kesehatan", text: `${formatTanggalIndonesia(k.tanggal)} · ${labelFaseKeluhan(k.fase)} · ${k.intensitas}/10${bahaya ? " · Tanda bahaya" : ""}` }),
        el("b", { text: judul }),
        k.catatan ? el("p", { text: k.catatan }) : null
      ),
      tombolHapus("keluhan", k.id, judul)
    ));
  });

  daftarCheckup.textContent = "";
  if (riwayat.checkup.length === 0) {
    daftarCheckup.appendChild(el("li", { class: "kosong-kesehatan", text: "Belum ada hasil checkup. Tekan \"🩺 Catat medical checkup\" untuk menambahkan." }));
  }
  riwayat.checkup.forEach(c => {
    const angka = [
      c.sistolik || c.diastolik ? `Tensi ${c.sistolik || "-"}/${c.diastolik || "-"}` : "",
      c.detakIstirahat ? `Detak ${c.detakIstirahat} bpm` : "",
      c.gulaDarah ? `Gula ${c.gulaDarah} mg/dL` : "",
      c.kolesterol ? `Kolesterol ${c.kolesterol} mg/dL` : ""
    ].filter(Boolean).join(" · ") || "Tanpa angka";
    const judul = `Checkup ${formatTanggalIndonesia(c.tanggal)}`;
    daftarCheckup.appendChild(el("li", { class: "item-kesehatan" },
      el("div", { class: "isi-item-kesehatan" },
        el("span", { class: "tanggal-kesehatan", text: `${formatTanggalIndonesia(c.tanggal)}${c.tempat ? " · " + c.tempat : ""}` }),
        el("b", { text: angka }),
        el("p", { text: `Anjuran: ${labelAnjuran(c.anjuranOlahraga)}${c.catatanDokter ? " · " + c.catatanDokter : ""}` })
      ),
      tombolHapus("checkup", c.id, judul)
    ));
  });
}

// ---------- Analisis GERAK AI ----------

async function jalankanAnalisisAI() {
  const tombol = document.getElementById("btnAnalisisKesehatanAI");
  const wadah = document.getElementById("isiAnalisisKesehatan");
  const riwayat = ambilRiwayat();
  const analisis = analisisRiwayat(riwayat, hariIni());

  if (analisis.kosong) {
    renderAnalisisLokal(wadah, analisis);
    tampilToast("Belum ada catatan untuk dianalisis");
    return;
  }

  tombol.disabled = true;
  tombol.textContent = "Menganalisis…";
  wadah.setAttribute("aria-busy", "true");

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: buatPromptAnalisisAI(analisis, riwayat),
        history: [],
        userMode: "member",
        userName: "",
        context: { halaman: "workout", seksi: "workoutRiwayatKesehatan", seksiJudul: "Riwayat Kesehatan" }
      })
    });
    const hasil = response.ok ? await response.json() : null;

    if (hasil && hasil.sukses && hasil.sumber === "gemini_free_tier" && hasil.balasan) {
      wadah.textContent = "";
      wadah.appendChild(el("p", { class: "sumber-analisis", text: "Dianalisis oleh GERAK AI (Gemini)." }));
      const isi = el("div", { class: "isi-balasan-ai" });
      isi.innerHTML = formatPesanMarkdown(hasil.balasan); // formatPesanMarkdown sudah meng-escape HTML
      wadah.appendChild(isi);
    } else {
      renderAnalisisLokal(wadah, analisis, "GERAK AI cloud belum aktif, jadi ini analisis lokal GERAK dari riwayatmu.");
    }
  } catch (err) {
    renderAnalisisLokal(wadah, analisis, "Koneksi ke GERAK AI gagal, jadi ini analisis lokal GERAK dari riwayatmu.");
  } finally {
    tombol.disabled = false;
    tombol.textContent = "Analisis dengan GERAK AI";
    wadah.removeAttribute("aria-busy");
  }
}

// ---------- Inisialisasi ----------

export function inisialisasiKesehatan(appState) {
  appStateRef = appState;
  inisialisasiDialogLapor();
  inisialisasiDialogCheckup();
  const tombolAI = document.getElementById("btnAnalisisKesehatanAI");
  if (tombolAI) tombolAI.addEventListener("click", jalankanAnalisisAI);
  renderRiwayatKesehatan();
}