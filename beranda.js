const $ = id => document.getElementById(id);

let jenis = "penerbangan";              // tab aktif: penerbangan atau hotel
let dataTampil = [...daftarPenerbangan]; // daftar yang sedang tampil
let terpilih = null;                    // item yang sedang dipesan

const sumber = () => (jenis === "hotel" ? daftarHotel : daftarPenerbangan);
const kolom = x => (jenis === "hotel" ? x.kota : x.tujuan);

// Log terakhir disimpan untuk ditampilkan di halaman penilaian
function catat(tipe, log) {
  try {
    const l = JSON.parse(sessionStorage.getItem("log") || "{}");
    l[tipe] = log;
    sessionStorage.setItem("log", JSON.stringify(l));
  } catch (e) {}
}

function kartu(x) {
  const hotel = jenis === "hotel";
  const judul = hotel ? x.nama : `${x.asal} <i class="bi bi-arrow-right"></i> ${x.tujuan}`;
  const info = hotel
    ? `<i class="bi bi-geo-alt"></i> ${x.kota} · ${'<i class="bi bi-star-fill bintang"></i>'.repeat(x.bintang)}`
    : `<i class="bi bi-airplane"></i> ${x.maskapai} · <i class="bi bi-clock"></i> ${x.jam}`;
  return `
    <article class="kartu">
      <div class="foto" style="--foto:url('${x.foto}')"></div>
      <div class="isi"><h3>${judul}</h3><p>${info}</p></div>
      <div class="harga">
        <b>${rupiah(x.harga)}</b><small>${hotel ? "per malam" : "per orang"}</small>
        <button class="btn btn-kuning" onclick="pesan(${x.id})">Pesan</button>
      </div>
    </article>`;
}

function tampilkan(data) {
  $("daftar").innerHTML = data.length
    ? data.map(kartu).join("")
    : `<div class="kosong"><i class="bi bi-search"></i> Tidak ada hasil. Coba kota lain.</div>`;
}

function cari() {
  const kunci = $("kata").value.trim().toLowerCase();
  const log = [];
  dataTampil = kunci ? linearSearch(sumber(), kunci, kolom, log) : [...sumber()];
  if (kunci) catat("cari", log);
  tampilkan(dataTampil);
}

function urutkan() {
  const log = [];
  dataTampil = bubbleSort(dataTampil, log);
  catat("urut", log);
  tampilkan(dataTampil);
}

function gantiTab(j) {
  jenis = j;
  document.querySelectorAll(".tab button").forEach(b => b.classList.toggle("aktif", b.dataset.jenis === j));
  const hotel = j === "hotel";
  $("asalBox").hidden = hotel;
  $("lblKata").textContent = hotel ? "Kota" : "Ke";
  $("kata").placeholder = hotel ? "Kota menginap" : "Kota tujuan";
  $("judulHasil").textContent = hotel ? "Hotel tersedia" : "Penerbangan tersedia";
  $("kata").value = "";
  dataTampil = [...sumber()];
  tampilkan(dataTampil);
}

// ----- Pemesanan -----
function hitungTotal() {
  $("total").textContent = rupiah(terpilih.harga * (+$("jumlah").value || 1));
}

function pesan(id) {
  terpilih = sumber().find(x => x.id === id);
  const hotel = jenis === "hotel";
  $("dlgJudul").textContent = hotel ? "Pesan hotel" : "Pesan tiket pesawat";
  $("dlgRingkas").textContent = hotel
    ? `${terpilih.nama} · ${terpilih.kota}`
    : `${terpilih.asal} → ${terpilih.tujuan} · ${terpilih.maskapai} ${terpilih.jam}`;
  $("lblJumlah").textContent = hotel ? "Jumlah malam" : "Jumlah penumpang";
  $("jumlah").value = 1;
  hitungTotal();
  $("dlg").showModal();
}

$("form").addEventListener("submit", e => {
  e.preventDefault();
  const hotel = jenis === "hotel";
  const jumlah = +$("jumlah").value;
  const p = new Pesanan(
    buatKode(jenis), jenis, $("nama").value.trim(), $("email").value.trim(),
    hotel ? terpilih.nama : `${terpilih.asal} → ${terpilih.tujuan}`,
    hotel ? `${terpilih.kota} · ${terpilih.bintang} bintang` : `${terpilih.maskapai} · ${terpilih.jam}`,
    jumlah, terpilih.harga * jumlah, $("metode").value, new Date().toLocaleString("id-ID")
  );
  riwayat.tambah(p);   // masuk ke linked list
  simpan();
  location.href = "tiket.html?kode=" + p.kode;
});

function tampilPesanan() {
  const semua = riwayat.keArray();
  $("pesanan").hidden = semua.length === 0;
  $("btnHapusBatal").hidden = !semua.some(p => p.status === "Dibatalkan");
  $("daftarPesanan").innerHTML = semua.map(p => {
    const batal = p.status === "Dibatalkan";
    return `
    <div class="pesanan${batal ? " dibatal" : ""}">
      <a class="tautan" href="tiket.html?kode=${p.kode}">
        <i class="bi bi-${p.jenis === "hotel" ? "building" : "airplane"}"></i>
        <span><b>${p.judul}</b><small>${p.kode} · ${rupiah(p.total)}${batal ? " · Dibatalkan" : ""}</small></span>
      </a>
      ${batal
        ? `<button class="hapus" title="Hapus pesanan" onclick="hapusPesanan('${p.kode}')"><i class="bi bi-trash"></i></button>`
        : `<i class="bi bi-chevron-right"></i>`}
    </div>`;
  }).join("");
}

function hapusPesanan(kode) {
  if (!confirm("Hapus pesanan " + kode + " dari daftar?")) return;
  riwayat.hapus(kode);   // lepas node dari linked list
  simpan();
  tampilPesanan();
}

function hapusSemuaBatal() {
  if (!confirm("Hapus semua pesanan yang sudah dibatalkan?")) return;
  riwayat.hapusDibatalkan();
  simpan();
  tampilPesanan();
}

// ----- Pasang event -----
document.querySelectorAll(".tab button").forEach(b => b.addEventListener("click", () => gantiTab(b.dataset.jenis)));
document.querySelectorAll(".dest").forEach(b => b.addEventListener("click", () => {
  $("kata").value = b.dataset.kota;
  cari();
  $("hasil").scrollIntoView();
}));
$("btnCari").addEventListener("click", cari);
$("kata").addEventListener("keydown", e => { if (e.key === "Enter") cari(); });
$("btnUrut").addEventListener("click", urutkan);
$("btnHapusBatal").addEventListener("click", hapusSemuaBatal);
$("jumlah").addEventListener("input", hitungTotal);
$("btnBatal").addEventListener("click", () => $("dlg").close());

tampilkan(dataTampil);
tampilPesanan();