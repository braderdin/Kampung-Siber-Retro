# 📟 Kampung Siber Retro 🌐

> Platform ruang kerja retro modular gred industri yang menggabungkan estetika Windows 95 klasik dengan kuasa teknologi web moden. Dibina dengan cermat, responsif sepenuhnya, dan dioptimumkan untuk fasa Kos RM0 (Free Tier Sandbox)!

---

## 🌟 Pautan Projek

*   **🤖 Repositori Kod:** [GitHub Braderdin](https://github.com/braderdin/Kampung-Siber-Retro)
*   **⚡ Pelancaran Live:** [Kampung Siber Vercel](https://kampung-siber.vercel.app/)

---

## 🛠️ Ringkasan Ekosistem (44 Keadaan Laluan Berantai)

Kampung Siber Retro dibina menggunakan **Next.js (Turbopack)** bersama pengurusan memori **Zustand store** yang sangat ringan. Kesemua komponen dipecahkan di bawah had **500 baris kod** demi kemudahan penyelenggaraan:

*   **🖥️ Papan Pemuka (/dashboard):** Hab pengurusan peribadi warga siber bersama kawalan folder direktori.
*   **📂 Pengurus Fail (/site_files):** Antaramuka grafik (GUI) ikon folder gaya Neocities dengan sistem pensuisan Grid/Senarai kompak.
*   **📝 Penyunting Teks (/site_files/text_editor):** Editor kod CodeMirror terbina untuk menyunting kod HTML/CSS/JS secara langsung di pelayar web.
*   **🌐 Hab Komuniti (/activity):** Dinding coretan status komuniti lengkap dengan fungsi interaksi sosial (*Suka, Komen, Ikut*).
*   **🌙 Suis Mod Gelap & DBP i18n:** Bar navigasi universal dengan butang pensuisan tema global dan kamus dwi-bahasa rasmi Malaysia.

---

## 🎛️ Disiplin Seni Bina & Perlindungan Storan (RM0 Free Tier)

Untuk memastikan kelangsungan operasi berjalan tanpa kos, sistem kami dilengkapi dengan kawalan sempadan keselamatan sebelah klien:
1. **Had Saiz Tegar Imej:** Maksimum **2MB** bagi setiap transaksi muat naik imej.
2. **Enjin Pemampat Klien:** Menggunakan pemampatan `<canvas>` HTML5 asli pada kualiti 0.8 sebelum dihantar ke Cloudflare R2 untuk menjamin visual kekal cantik dan ringan.
3. **Kuota Fail Maksimum:** Sekatan tegar storan akaun terkumpul sebanyak **25MB** bagi setiap warga kampung.

---

## 💻 Panduan Pembangun (Pembangunan Lokal)

Pastikan anda mempunyai persekitaran Node.js terkini, kemudian jalankan rantaian arahan di bawah:

```bash
# 1. Pasang dependensi modular
npm install

# 2. Jalankan server pembangunan tempatan
npm run dev

# 3. Jalankan ujian build industri (Standard Ubuntu)
npx tsc --noEmit && npm run build
