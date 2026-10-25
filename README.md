# Ledger Watch

Dashboard pasar kripto real-time dibangun dengan React + Vite, menampilkan data
langsung dari [CoinGecko API](https://www.coingecko.com/en/api) (gratis, tanpa
API key).

## Fitur

- Tabel 60 koin teratas berdasarkan kapitalisasi pasar, dengan perubahan harga
  1 jam / 24 jam / 7 hari dan grafik mini (sparkline).
- Ticker tape berjalan menampilkan koin dengan pergerakan harga terbesar.
- Pencarian dan pengurutan (kapitalisasi pasar, perubahan 24 jam, volume).
- Panel detail per koin dengan grafik interaktif (24 jam / 7 hari / 30 hari / 1 tahun).
- Data diperbarui otomatis setiap 60 detik.

## Menjalankan secara lokal

\`\`\`bash
npm install
npm run dev
\`\`\`

Buka \`http://localhost:5163\`.

## Build untuk produksi

\`\`\`bash
npm run build
\`\`\`

Hasil build ada di folder \`dist/\`.

## Deploy ke Netlify

Project ini sudah menyertakan \`netlify.toml\` dan \`public/_redirects\`, jadi
tinggal:

1. Push project ini ke repository GitHub.
2. Di Netlify, pilih **Add new site → Import an existing project**, hubungkan
   repo-nya.
3. Build command: \`npm run build\`, publish directory: \`dist\` (sudah terisi
   otomatis lewat \`netlify.toml\`).
4. Deploy.

Tidak perlu environment variable — CoinGecko API publik dan tidak butuh key
untuk endpoint yang dipakai di sini.

## Struktur

\`\`\`
src/
├── components/   # Header, tabel, panel detail, kontrol pencarian/sort
├── hooks/        # useMarkets (daftar koin), useCoinChart (grafik per koin)
├── utils/        # formatter angka/mata uang
├── App.jsx
└── App.css
\`\`\`
