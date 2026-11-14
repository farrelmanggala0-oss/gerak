// =========================================
// GERAK - js/tanggal.js
// Utilitas tanggal murni
// =========================================

export function formatTanggal(tanggal) {
  const d = new Date(tanggal);
  const tahun = d.getFullYear();
  const bulan = String(d.getMonth() + 1).padStart(2, "0");
  const hari = String(d.getDate()).padStart(2, "0");
  return `${tahun}-${bulan}-${hari}`;
}

export function hariIni() {
  return formatTanggal(new Date());
}

export function kemarin() {
  const tgl = new Date();
  tgl.setDate(tgl.getDate() - 1);
  return formatTanggal(tgl);
}

export function selisihHari(tglAwalStr, tglAkhirStr) {
  if (!tglAwalStr || !tglAkhirStr) return 0;
  const tgl1 = new Date(tglAwalStr + "T00:00:00");
  const tgl2 = new Date(tglAkhirStr + "T00:00:00");
  const diffTime = tgl2.getTime() - tgl1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatTanggalIndonesia(tanggalStr) {
  if (!tanggalStr) return "";
  const d = new Date(tanggalStr + "T00:00:00");
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short"
  });
}