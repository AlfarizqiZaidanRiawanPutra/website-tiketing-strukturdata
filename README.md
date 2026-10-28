# ✈️ Tiketing | Pemesanan Tiket Pesawat dan Hotel

Aplikasi web sederhana untuk mencari dan memesan **tiket pesawat** dan **hotel**, lengkap dengan e-tiket, pembatalan, dan penghapusan pesanan. Dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework dan tanpa backend), sekaligus sebagai media peragaan konsep **struktur data dan algoritma**: struct, array, pointer (linked list), sorting, dan searching.

## 👤 Identitas

| Alfarizqi Zaidan Riawan Putra |
| 25050974008 |

## ✨ Fitur

- **Cari penerbangan dan hotel** berdasarkan kota tujuan, dengan tab Pesawat / Hotel.
- **Destinasi populer** (Bali, Jakarta, Medan, Yogyakarta, Lombok) sekali klik untuk langsung mencari.
- **Urutkan harga termurah** pada hasil pencarian.
- **Pemesanan** lewat dialog: nama, email, jumlah penumpang/malam, metode pembayaran, dan total harga otomatis.
- **E-tiket / voucher hotel** dengan kode unik dan barcode, serta tombol cetak.
- **Pesanan saya**: daftar pesanan tersimpan di browser (tidak hilang saat halaman dimuat ulang).
- **Pembatalan pesanan** dengan biaya pembatalan 20% dan perhitungan dana kembali.
- **Hapus pesanan** satu per satu, atau hapus semua yang berstatus dibatalkan.
- **Mode penilaian**: halaman khusus yang menampilkan log langkah demi langkah algoritma dan visualisasi linked list.
- Tampilan responsif (desktop dan mobile).

## 🧠 Konsep Struktur Data dan Algoritma

Semua logika inti ada di `app.js`.

| Konsep | Implementasi | Lokasi |
| --- | --- | --- |
| **Struct** | `class Penerbangan`, `Hotel`, `Pesanan` untuk mengelompokkan data satu record (JavaScript tidak punya struct, jadi memakai class) | `app.js` bagian 1 |
| **Array** | `daftarPenerbangan` dan `daftarHotel`, kumpulan struct yang diakses lewat indeks | `app.js` bagian 2 |
| **Pointer / Linked List** | `Node` dan `RiwayatBooking` menyimpan pesanan. Properti `next` berfungsi seperti pointer, `head` menunjuk node pertama, `null` menandai ujung list | `app.js` bagian 3 |
| **Sorting** | **Bubble Sort** berdasarkan harga naik, kompleksitas O(n²), disertai log perbandingan dan penukaran | `app.js` bagian 4 |
| **Searching** | **Linear Search** pada kolom tujuan (pesawat) atau kota (hotel), kompleksitas O(n), disertai log tiap pemeriksaan | `app.js` bagian 5 |

Operasi pada linked list: `tambah` (sambung di ujung), `keArray` (telusuri dari head sampai null), `cari`, `batalkan` (ubah status node), `hapus` (lepas node dengan mengubah pointer `next`), dan `hapusDibatalkan`.

## 📁 Struktur Proyek

```
.
├── index.html      # Beranda: pencarian, destinasi, hasil, pesanan saya, dialog pemesanan
├── tiket.html      # Halaman e-tiket / voucher, pembatalan, dan penghapusan
├── penilaian.html  # Mode penilaian: log search, log sort, visualisasi linked list
├── style.css       # Seluruh gaya tampilan
├── app.js          # Struct, array, linked list, bubble sort, linear search, fungsi bantu
├── beranda.js      # Logika halaman beranda (UI, pencarian, pemesanan)
└── img/            # Foto destinasi, pesawat, dan hotel (lihat catatan di bawah)
```

## 🚀 Cara Menjalankan

Tidak perlu instalasi apa pun.

1. Clone repositori:
   ```bash
   git clone https://github.com/<username>/<nama-repo>.git
   cd <nama-repo>
   ```
2. Buka `index.html` di browser (klik dua kali, atau gunakan ekstensi seperti *Live Server* di VS Code).

Atau jalankan server lokal sederhana:

```bash
python -m http.server 8000
# lalu buka http://localhost:8000
```

> Font dan ikon dimuat dari CDN (Google Fonts dan Bootstrap Icons), jadi dibutuhkan koneksi internet untuk tampilan terbaik.

## 🖼️ Catatan Folder `img/`

Aplikasi memanggil gambar dari folder `img/`, misalnya:

- `img/hero.jpg`
- `img/bali.jpg`, `jakarta.jpg`, `medan.jpg`, `yogyakarta.jpg`, `lombok.jpg`
- `img/pesawat-garuda.jpg`, `pesawat-lion.jpg`, `pesawat-citilink.jpg`, `pesawat-batik.jpg`, `pesawat-superairjet.jpg`
- `img/hotel-1.jpg` sampai `img/hotel-7.jpg`

Jika file foto belum ada, tampilan otomatis memakai **latar gradien biru** sebagai cadangan, jadi aplikasi tetap berfungsi.

## 💾 Penyimpanan Data

| Data | Penyimpanan | Keterangan |
| --- | --- | --- |
| Daftar pesanan | `localStorage` (`pesanan`) | Dimuat ulang ke linked list saat halaman dibuka |
| Nomor urut kode | `localStorage` (`urutKode`) | Terus naik dan tidak dipakai ulang setelah penghapusan |
| Log search dan sort | `sessionStorage` (`log`) | Dibaca oleh halaman penilaian |

Data hanya tersimpan di browser masing-masing pengguna. Untuk mengosongkan data, hapus data situs lewat pengaturan browser.

## 🧾 Aturan Bisnis

- Kode pesanan: `TKT-00001` untuk tiket pesawat dan `HTL-00001` untuk hotel.
- Total = harga × jumlah penumpang (atau malam), jumlah antara 1 sampai 10.
- Pembatalan dikenai biaya **20%** (`POTONGAN_BATAL` di `app.js`), dana kembali 80% ke metode pembayaran awal.
- Pesanan yang sudah dibatalkan tidak dapat dibatalkan lagi, tetapi dapat dihapus dari daftar.

## 🧪 Mode Penilaian

Buka `penilaian.html` (tautan ada di footer beranda) untuk melihat:

1. **Log pencarian (linear search)**: tiap indeks yang diperiksa beserta hasil cocok atau tidak.
2. **Log pengurutan (bubble sort)**: tiap pass, perbandingan, dan penukaran, ditutup dengan ringkasan jumlah operasi.
3. **Visualisasi linked list**: rantai `head → node → ... → null` dari seluruh pesanan.

Alur demo: lakukan pencarian dan klik **Harga termurah** di beranda, buat beberapa pesanan, lalu buka halaman penilaian.

## 🛠️ Teknologi

- HTML5 (termasuk elemen `<dialog>`)
- CSS3 (Grid, Flexbox, CSS variables, media query)
- JavaScript (ES6+, tanpa library)
- [Bootstrap Icons](https://icons.getbootstrap.com/) dan [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via CDN

## 📌 Catatan

Proyek ini dibuat untuk keperluan pembelajaran. Pembayaran bersifat simulasi dan tidak terhubung ke layanan pembayaran maupun server mana pun.
