# Porto Personal v2

Website portofolio pribadi Muhammad Fadly: landing page portofolio, arsip blog, dan template artikel.
Dibangun dengan **Bootstrap 5**, **HTML**, **CSS**, dan **vanilla JavaScript**. Tidak butuh Node.js, bundler, atau server.

Folder `design-system/` berisi token desain dan brand book yang dipakai sebagai dasar tampilan.

## Fitur

- Landing page satu halaman: hero, about, expertise, selected projects, process, journey, preview blog, dan contact.
- Arsip blog dengan artikel unggulan, filter kategori, pencarian, dan empty state.
- Template artikel: breadcrumb, daftar isi (disclosure di mobile), tombol copy kode, progress baca, share, prev/next, dan artikel terkait.
- Tema terang dan gelap. Pilihan pengguna disimpan di `localStorage`; kunjungan pertama mengikuti pengaturan sistem.
- Menu responsif, reveal saat scroll, dan parallax ringan di desktop. Animasi dimatikan untuk `prefers-reduced-motion`.
- Ikon dari Bootstrap Icons.

## Struktur

```
.
├── index.html                  # Landing page (portofolio)
├── 404.html                    # Halaman tidak ditemukan
├── robots.txt
├── sitemap.xml
├── blog/
│   ├── index.html              # Arsip blog
│   └── article.html            # Template artikel (dibuka dengan ?slug=...)
├── assets/
│   ├── favicon.svg
│   ├── css/
│   │   ├── tokens.css          # Variabel desain (terang dan gelap)
│   │   └── main.css            # Gaya halaman, komponen, dan blog
│   └── js/
│       ├── data/articles.js    # Isi semua artikel blog
│       ├── main.js             # Tema, header, nav, reveal, parallax, menu
│       ├── blog.js             # Arsip blog: filter dan pencarian
│       └── article.js          # Render satu artikel
└── design-system/
    ├── README.md               # Brand book
    ├── tokens.json             # Sumber token desain
    └── cover.html              # Cover sistem desain
```

## Menjalankan secara lokal

Karena halaman memuat artikel lewat JavaScript, buka lewat server lokal, bukan dengan double-click file:

```bash
# Python 3
python3 -m http.server 8000

# atau Node.js
npx serve .
```

Lalu buka `http://localhost:8000`.

## Dependensi (CDN)

Semua versi sudah dikunci. Jangan memakai `latest` atau rentang versi.

| Library | Versi | Dipakai untuk |
| --- | --- | --- |
| Bootstrap CSS | 5.3.3 | Grid, navbar, dan utilitas dasar |
| Bootstrap JS bundle | 5.3.3 | Toggle menu mobile |
| Bootstrap Icons | 1.11.3 | Ikon |
| Google Fonts | Manrope, Newsreader, JetBrains Mono | Font sans, serif, dan mono |

Tanpa CDN pun navigasi dan teks tetap bisa dibaca, hanya tampilannya lebih sederhana. Font akan memakai fallback sistem.

Bootstrap dimuat tanpa atribut `integrity`. Kalau ingin menambahkannya, ambil hash resmi dari dokumentasi Bootstrap, lalu pastikan versinya sama.

## Mengganti konten

### Identitas dan kontak

- **Nama, tagline, dan deskripsi:** `index.html` (hero, about, footer) dan `blog/index.html` (footer).
- **Email:** cari `you@example.com` lalu ganti. Ada di `index.html` dan `blog/index.html`.
- **LinkedIn:** ganti `https://www.linkedin.com/in/your-profile` di `index.html`.
- **GitHub:** sudah `https://github.com/FadlyChaniago`. Ubah bila perlu.
- **Domain:** ganti `https://example.com/` di `index.html`, `blog/index.html`, `blog/article.html`, `robots.txt`, dan `sitemap.xml`.
- **Skills dan interest:** daftar item ada di `index.html` pada bagian `#about` dan `#skills`.

### Project

Project ditulis langsung di `index.html` pada bagian `#projects`. Setiap project memiliki:

- Judul (`.project-title`).
- Deskripsi, problem, dan approach (`<dl>`).
- Tag teknologi (`.tag-list`).
- Visual placeholder (`.project-media`). Hapus baris `placeholder-note` dan elemen `.bars` setelah ada screenshot asli, lalu ganti dengan `<img>` berukuran tetap.

Teks saat ini masih contoh. Ganti dengan studi kasus nyata sebelum dibagikan. Jangan mencantumkan data internal perusahaan atau detail sistem yang bersifat rahasia.

### Journey

Bagian `#journey` memakai teks dalam kurung seperti `[Role]`, `[Organisation]`, dan `[Period]`. Ganti dengan data sendiri. Kalau mau menghapus placeholder, cukup hapus item `<li>` yang tidak dipakai.

### Artikel blog

Semua artikel ada di `assets/js/data/articles.js` sebagai array `window.ARTICLES`. Tambahkan objek baru di awal array agar muncul paling atas.

```js
{
  slug: "judul-artikel-dalam-slug",   // unik, dipakai di URL
  title: "Judul Artikel",
  category: "Technical Notes",        // lihat daftar kategori di bawah
  excerpt: "Ringkasan satu-dua kalimat.",
  date: "2026-10-19",                 // format YYYY-MM-DD
  readingTime: "5 min read",
  tags: ["SQL", "PostgreSQL"],
  featured: false,                    // true = tampil di landing page dan sebagai featured di arsip
  body: [
    { t: "p", x: "Paragraf biasa." },
    { t: "h2", x: "Subjudul" },
    { t: "ul", items: ["Poin pertama", "Poin kedua"] },
    { t: "code", x: "print('halo')" },
    { t: "quote", x: "Kutipan." }
  ]
}
```

Jenis blok yang didukung: `p`, `h2`, `ul`, `code`, dan `quote`. Teks selalu dimasukkan dengan `textContent`, jadi jangan menulis HTML di dalamnya.

Kategori yang dipakai saat ini: Technical Notes, Work & Lessons Learned, Data & Automation, Personal Reflections. Kategori baru otomatis muncul sebagai filter di arsip.

Di landing page, tiga artikel dengan `featured: true` pertama yang tampil. Pastikan artikel unggulan ada dalam daftar.

### Warna dan font

- Token warna, font, spacing, radius, shadow, layout, dan motion ada di `assets/css/tokens.css`.
- Sumber token yang sama ada di `design-system/tokens.json`. Kalau mengubah satu, ubah juga yang lain.
- Jangan menulis warna mentah di `main.css`. Gunakan variabel dari `tokens.css`.

Kontras teks sudah dicek untuk tema terang dan gelap. Kalau mengganti warna, cek ulang kontrasnya minimal 4.5:1 untuk teks dan 3:1 untuk garis kontrol serta focus ring.

## Aksesibilitas

- Skip link di awal setiap halaman.
- Fokus keyboard terlihat di semua elemen interaktif.
- Tombol tema dan menu punya label.
- Animasi dinonaktifkan untuk pengguna yang memilih reduced motion.
- Sudah diuji tanpa overflow horizontal di lebar 390px dan 1280px. Uji ulang di perangkat asli sebelum publish.

## Deploy

Tidak ada langkah build. Upload semua file di root repo ke hosting statis apa pun, misalnya:

- **GitHub Pages:** Settings → Pages → Deploy from a branch → `main` / root.
- **Netlify atau Cloudflare Pages:** hubungkan repo, tanpa build command, output directory `/`.
- **Hosting biasa:** upload isinya lewat FTP atau panel hosting.

Semua path di situs bersifat relatif, jadi tetap berfungsi kalau situs diletakkan di subfolder.

Sebelum publish:

1. Ganti semua `example.com` dan `you@example.com`.
2. Cek `robots.txt` dan `sitemap.xml`.
3. Buka `index.html`, `blog/index.html`, satu artikel, dan `404.html` di mobile dan desktop.

## Batasan yang perlu diketahui

- **URL artikel memakai query string** (`blog/article.html?slug=...`), bukan `/blog/slug/`. Hosting statis tidak bisa membuat URL seperti itu tanpa membuat file per artikel. Kalau mau URL bersih, pakai hosting yang mendukung rewrite, atau generator statis.
- **Tidak ada pagination.** Arsip menampilkan semua artikel. Mulai terasa perlu ketika artikel lebih dari sekitar 20.
- **Tidak ada form kontak.** Kontak memakai `mailto:` dan link sosial, sesuai prinsip tanpa backend.
- **Sitemap tidak otomatis.** Kalau menambah artikel, tambahkan URL-nya di `sitemap.xml`.
