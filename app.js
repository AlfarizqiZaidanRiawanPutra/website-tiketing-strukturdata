// =====================================================
// 1. STRUCT
// JavaScript tidak punya struct, jadi class dipakai untuk
// mengelompokkan data satu record dalam satu paket.
// =====================================================
class Penerbangan {
  constructor(id, maskapai, asal, tujuan, jam, harga, foto) {
    this.id = id; this.maskapai = maskapai; this.asal = asal;
    this.tujuan = tujuan; this.jam = jam; this.harga = harga; this.foto = foto;
  }
}
class Hotel {
  constructor(id, nama, kota, bintang, harga, foto) {
    this.id = id; this.nama = nama; this.kota = kota;
    this.bintang = bintang; this.harga = harga; this.foto = foto;
  }
}
class Pesanan {
  constructor(kode, jenis, nama, email, judul, detail, jumlah, total, metode, waktu, status = "Aktif") {
    this.kode = kode; this.jenis = jenis; this.nama = nama; this.email = email;
    this.judul = judul; this.detail = detail; this.jumlah = jumlah;
    this.total = total; this.metode = metode; this.waktu = waktu; this.status = status;
  }
}

// =====================================================
// 2. ARRAY: kumpulan struct, diakses lewat indeks
// =====================================================
const daftarPenerbangan = [
  new Penerbangan(1, "Garuda Indonesia", "Surabaya", "Jakarta",    "08:00", 1250000, "img/pesawat-garuda.jpg"),
  new Penerbangan(2, "Lion Air",         "Surabaya", "Bali",       "10:30",  650000, "img/pesawat-lion.jpg"),
  new Penerbangan(3, "Citilink",         "Surabaya", "Jakarta",    "06:15",  890000, "img/pesawat-citilink.jpg"),
  new Penerbangan(4, "Batik Air",        "Surabaya", "Medan",      "13:45", 1450000, "img/pesawat-batik.jpg"),
  new Penerbangan(5, "Super Air Jet",    "Surabaya", "Bali",       "15:20",  580000, "img/pesawat-superairjet.jpg"),
  new Penerbangan(6, "Citilink",         "Surabaya", "Yogyakarta", "07:40",  520000, "img/pesawat-citilink.jpg"),
  new Penerbangan(7, "Lion Air",         "Surabaya", "Lombok",     "09:10",  710000, "img/pesawat-lion.jpg"),
];
const daftarHotel = [
  new Hotel(1, "Kuta Beach Resort",  "Bali",       5, 1850000, "img/hotel-1.jpg"),
  new Hotel(2, "Bali Garden Inn",    "Bali",       3,  520000, "img/hotel-2.jpg"),
  new Hotel(3, "Jakarta Central",    "Jakarta",    4,  890000, "img/hotel-3.jpg"),
  new Hotel(4, "Cikini Stay",        "Jakarta",    3,  430000, "img/hotel-4.jpg"),
  new Hotel(5, "Medan Grand Palace", "Medan",      4,  760000, "img/hotel-5.jpg"),
  new Hotel(6, "Malioboro Heritage", "Yogyakarta", 4,  640000, "img/hotel-6.jpg"),
  new Hotel(7, "Senggigi Seaside",   "Lombok",     4,  980000, "img/hotel-7.jpg"),
];

// =====================================================
// 3. POINTER: linked list pesanan
// "next" menyimpan referensi ke node berikutnya (fungsinya seperti
// pointer), "head" menunjuk node pertama, null = ujung list.
// =====================================================
class Node {
  constructor(data) { this.data = data; this.next = null; }
}
class RiwayatBooking {
  constructor() { this.head = null; }

  tambah(data) {                       // sambungkan node baru di ujung list
    const baru = new Node(data);
    if (this.head === null) { this.head = baru; return; }
    let bantu = this.head;
    while (bantu.next !== null) bantu = bantu.next;
    bantu.next = baru;
  }
  keArray() {                          // telusuri pointer dari head sampai null
    const hasil = [];
    let bantu = this.head;
    while (bantu !== null) { hasil.push(bantu.data); bantu = bantu.next; }
    return hasil;
  }
  cari(kode) {
    let bantu = this.head;
    while (bantu !== null) {
      if (bantu.data.kode === kode) return bantu.data;
      bantu = bantu.next;
    }
    return null;
  }
  batalkan(kode) {                     // cari node, lalu ubah statusnya
    const p = this.cari(kode);
    if (p === null || p.status === "Dibatalkan") return false;
    p.status = "Dibatalkan";
    p.waktuBatal = new Date().toLocaleString("id-ID");
    return true;
  }
  hapus(kode) {                        // lepas satu node dengan mengubah pointer next
    if (this.head === null) return false;
    if (this.head.data.kode === kode) { this.head = this.head.next; return true; }
    let bantu = this.head;
    while (bantu.next !== null) {
      if (bantu.next.data.kode === kode) { bantu.next = bantu.next.next; return true; }
      bantu = bantu.next;
    }
    return false;
  }
  hapusDibatalkan() {                  // lepas semua node berstatus Dibatalkan
    while (this.head !== null && this.head.data.status === "Dibatalkan") this.head = this.head.next;
    let bantu = this.head;
    while (bantu !== null && bantu.next !== null) {
      if (bantu.next.data.status === "Dibatalkan") bantu.next = bantu.next.next;
      else bantu = bantu.next;
    }
  }
}
const riwayat = new RiwayatBooking();

// Penyimpanan di browser (localStorage) agar pesanan tidak hilang
function simpan() {
  try { localStorage.setItem("pesanan", JSON.stringify(riwayat.keArray())); } catch (e) {}
}
(function muat() {
  try { JSON.parse(localStorage.getItem("pesanan") || "[]").forEach(p => riwayat.tambah(p)); } catch (e) {}
})();

// =====================================================
// 4. SORTING: Bubble Sort harga naik + log (O(n^2))
// =====================================================
function bubbleSort(data, log) {
  const a = [...data];                 // salinan, data asli tidak berubah
  let banding = 0, tukar = 0;
  log.push(`Mengurutkan ${a.length} data berdasarkan harga (naik)`);
  for (let i = 0; i < a.length - 1; i++) {
    log.push(`Pass ${i + 1}`);
    for (let j = 0; j < a.length - i - 1; j++) {
      banding++;
      let baris = `  Bandingkan ${a[j].harga} dengan ${a[j + 1].harga}`;
      if (a[j].harga > a[j + 1].harga) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        tukar++;
        baris += " -> ditukar";
      } else {
        baris += " -> tetap";
      }
      log.push(baris);
    }
  }
  log.push(`Selesai: ${banding} perbandingan, ${tukar} penukaran.`);
  return a;
}

// =====================================================
// 5. SEARCHING: Linear Search + log (O(n))
// "ambil" menentukan kolom yang dicari (tujuan atau kota)
// =====================================================
function linearSearch(data, kunci, ambil, log) {
  const hasil = [];
  log.push(`Mencari "${kunci}" di ${data.length} data`);
  for (let i = 0; i < data.length; i++) {
    const nilai = ambil(data[i]).toLowerCase();
    if (nilai.includes(kunci)) {
      hasil.push(data[i]);
      log.push(`Indeks ${i}: ${nilai} -> COCOK`);
    } else {
      log.push(`Indeks ${i}: ${nilai} -> tidak cocok`);
    }
  }
  log.push(`Selesai: ${hasil.length} ditemukan dari ${data.length} pemeriksaan.`);
  return hasil;
}

// =====================================================
// Fungsi bantu
// =====================================================
const POTONGAN_BATAL = 0.2;   // biaya pembatalan 20%
const rupiah = n => "Rp " + n.toLocaleString("id-ID");
function buatKode(jenis) {           // nomor terus naik, tidak dipakai ulang setelah penghapusan
  let urut = 0;
  try { urut = +localStorage.getItem("urutKode") || 0; } catch (e) {}
  urut = Math.max(urut, ...riwayat.keArray().map(p => +p.kode.slice(4)), 0) + 1;
  try { localStorage.setItem("urutKode", urut); } catch (e) {}
  return (jenis === "hotel" ? "HTL-" : "TKT-") + String(urut).padStart(5, "0");
}