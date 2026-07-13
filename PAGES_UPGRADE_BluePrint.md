# 📋 PAGES_UPGRADE_BluePrint.md — Audit Konsolidasi Route & Defection Report

**Tarikh Audit:** 2026-07-14
**Pelaksana:** Master Full-Stack Systems Architect (CLINE)
**Skop:** Fasa 1–4 Konsolidasi Route, Baiki File Manager, Audit Nav, Type-Check & Laporan Rule 28

---

## ✅ 1. ROUTE YANG BERJAYA DIKONSOLIDASIKAN

### 1.1 `/site_files` → Tab "Fail Saya" dalam `/dashboard`
- **Tindakan:** `/site_files/page.tsx` dijadikan *wrapper nipis* yang mewakilkan kepada komponen baharu `src/components/FileManager.tsx`. Route asal **dikekalkan** (non-destructive) untuk pautan footer `/site_files` & `/site_files/text_editor`.
- **Tab Dashboard:** Tab ketiga `📁 Fail Saya` ditambah ke `src/app/dashboard/page.tsx` (type `ActiveTab = 'main' | 'community' | 'files'`) yang memaparkan `<FileManager embedded />`.
- **Keputusan:** Pengguna boleh akses file manager dari dashboard TANPA kekeliruan route berasingan.

### 1.2 `/settings` → Tab Dinamik Seragam
- **Tindakan:** `src/app/settings/[username]/page.tsx` dinaiktaraf dengan `SettingsTab` client tabs: `Profil | Laman | Penyokong | Kata Laluan | E-mel | Lanjutan`.
- **Pemetaan Hash → Tab:**
  - `#sites` → Tab **Laman** (`SettingsGithub`)
  - `#supporter` → Tab **Penyokong** (`SettingsTipping`)
  - `#password` → Tab **Kata Laluan** (`SettingsApiKey`)
  - `#email` → Tab **E-mel** (`SettingsNsfw`)
  - `#delete` → Tab **Lanjutan** (`SettingsDeleteAccount`)
- **Keputusan:** Semua sub-setting disatukan dalam satu view responsif.

### 1.3 Orphan Marketing Paths (`/press`, `/donate`, `/supporter`)
- **Status:** Semua 19 route dirujuk (press, donate, supporter, cli, terms, privacy, status, sitemap, contact, about, tutorials, password_reset, forgot_username, search, browse, activity, guestbook, cyber-cafe, directory) **SAH WUJUD** (`Test-Path = True`). Tiada route orphan/mati ditemui. Kekalkan sebagai halaman info berasingan demi kemudahan SEO & footer.

---

## 🛠 2. FILE MANAGER — PEBAIKAN & WIRING (Fasa 2)

### 2.1 Fix Bahasa & Typo (Malaysian Malay formal)
| Sebelum (Rosak) | Selepas (Betul) |
|---|---|
| `Had Sazen Tersampaikan!` | `🚨 Had Saiz Dilampaui!` |
| `Amanah Saiz Fail mendekati had 4.5MB Percuma!` | `⚠️ Amaran: Saiz penggunaan fail menghampiri had simpanan!` |

### 2.2 Wire Action Components ke R2 (`kampung-siber-assets`)
- **Muat Naik:** `FileManager` memanggil `/api/storage` (POST → presigned URL) kemudian `PUT` terus ke Cloudflare R2. Fail baharu dimasukkan ke state list secara langsung.
- **Fail Baru:** Buka `/site_files/text_editor?filename=...` (editor R2 sedia ada).
- **Folder Baru:** Cipta namespace folder dalam state (client).
- **Pilih:** Butang `📋 Pilih` kini `onSelectAll` (toggle pilih semua) — bukan lagi `onClick={() => {}}` mati.
- **Padam:** `onBatchDelete` & ikon trash per-item membuang dari state.

### 2.3 Storage Metric Dinamik
- Komponen `StorageUsageBar` (25MB default) dijadikan rujukan. `FileManager` mengira `totalSize` secara langsung dari `files.reduce(...)` dan memaparkan `X / 25 MB` dengan bar peratusan live (hijau/kuning/merah).

---

## 🔗 3. AUDIT NAVIGATION (Fasa 3)

- **RetroNavbar:** Semua item guna `router.push(href)` ke route sah (`/dashboard`, `/directory`, `/guestbook`, `/settings`, `/help`, `/status`, `/contact`). Tiada `href="#"`.
- **RetroFooter / footer-links.tsx:** Semua 10+ pautan community guna `handleNavigation(link.href)` → `router.push`. Tiada dead anchor.
- **Satu-satunya `href="#"`** berada dalam `RetroToolbar.tsx` sebagai *template snippet* editor HTML (`<a href="#">Link Text</a>`) — ini adalah kandungan contoh, BUKAN nav link mati. Tidak diubah.
- **Keputusan:** 0 broken links / 0 dead `href="#"`.

---

## 🧪 4. TYPE-SAFETY COMPILATION (Fasa 4)

- Perintah: `npx tsc --noEmit`
- **Keputusan:** ✅ BERSIH (tiada error TypeScript).
- Satu isu dibetulkan semasa proses: `FileManagerActions` terlepas destructure `onSelectAll` → ditambah.

---

## ⚠️ 5. DEFECTION AUDIT & ROADMAP PERBAIKAN (Rule 28)

### 5.1 Anomali / Bug Dikesan
1. **Mock R2 List:** `FileManager` masih menggunakan data mock untuk *list* fail (tiada `/api/storage/list`). Muat naik berfungsi ke R2 sebenar, tetapi senarai tidak persist selepas reload.
   - *Cadangan:* Tambah `GET /api/storage/list` yang menyenaraikan objek R2 (`listObjectsV2`) dan kembalikan metadata ke klien.
2. **Folder hanya client-state:** Folder baru tidak disimpan ke R2 (tiada "empty folder" di object storage).
   - *Cadangan:* Simpan struktur folder dalam metadata DB (Supabase) atau placeholder `.keep` object.
3. **SettingsTab label kaku bahasa EN (Laman/Profil)** — sudah BM, tetapi komponen `SettingsGithub`/`SettingsNsfw`/`SettingsApiKey`/`SettingsDeleteAccount` mempunyai komen penanda palsu (copy-paste salah: "// Start: SettingsNsfw Component" di dalam `SettingsTipping`). Fungsi pada masa ini sah, tetapi perlu pembersihan komen.
   - *Cadangan:* Refactor komen penanda mengikut nama komponen sebenar.
4. **Delete belum panggil API:** Padam hanya buang dari React state, belum panggil `DELETE /api/storage` (route delete belum wujud).
   - *Cadangan:* Cipta `DELETE /api/storage` dengan `deleteObject` R2 + validasi sesi.
5. **Edit ikon & Rename ikon sama (✏️):** `FileManagerGrid` guna `✏️` untuk kedua-dua edit dan rename — mengelirukan UX.
   - *Cadangan:* Bezakan ikon (edit → ✏️, rename → 🏷️).

### 5.2 Visual / Layout Anomalies
- Tab settings menggunakan `flex-wrap` + `min-w-[100px]` — responsif baik di mobile (375px) & desktop (1920px). Tiada overflow dikesan.
- `FileManager` dengan `embedded` mengekalkan padding luar; di dashboard tab, card mengembang penuh (`lg:col-span-3`). Tiada clipping.

---

## 🚀 6. FAIL DIUBAH SUAI (Ringkasan)
1. `src/components/FileManager.tsx` *(BAHARU)* — Unified R2-wired file manager.
2. `src/components/FileManagerActions.tsx` — `Pilih` berfungsi, create folder/file hantar nama.
3. `src/app/site_files/page.tsx` — wrapper delegasi ke `FileManager`.
4. `src/app/dashboard/page.tsx` — tab "Fail Saya" baharu.
5. `src/app/settings/[username]/page.tsx` — tab dinamik seragam (`#sites/#supporter/#password/#email/#delete`).

## 🧹 7. RULE 29 CLEANUP
- Dev server loop (`npm run dev`) ditamatkan untuk bebaskan RAM/CPU selepas audit.