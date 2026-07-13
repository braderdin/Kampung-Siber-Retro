# 🛰️ PROJEK UPGRADE MAP — Kampung Siber Retro

> **STATUS:** Laporan Audit (Non-Destrutive) | **MODE:** Perancangan | **Untuk:** Human Tech Lead (Chip Besar)
> **Objektif:** Petakan pepijat sistem profil, alirkan UX, dan cadangkan migrasi reka bentuk "Modern-Retro Cyber-Village" (Neocities × Vercel × Linear) dengan aksen Neon.

---

## 📌 RINGKASAN EKSEKUTIF

| Domain | Status | Tahap Risiko |
|---|---|---|
| Profile Store (`useProfilesStore`) | In-memory sahaja, tiada persist/Supabase | 🔴 Kritikal |
| Profile API Endpoint `/api/users/[id]` | **Tiada wujud** — dirujuk tetapi tidak dibina | 🔴 Kritikal |
| `DrizzleProfileCard` | `useQuery`/`useQueryClient` palsu (no-op cache) | 🔴 Kritikal |
| `ProfileUpdateBox` | Client Supabase baharu setiap render, tiada auth | 🟠 Tinggi |
| Theme Store ↔ CSS | `ThemeId` tidak sepadan `data-theme` CSS | 🟠 Tinggi |
| Palet Neon | `emerald/cyan` statik, bukan aksen Neon dinamik | 🟡 Sederhana |

---

## 🩺 [SYSTEM PROFILE FIXES]

### 🔴 F-01 — Tiada Endpoint API Profil (`/api/users/[id]`)
- **Pepijat:** `DrizzleProfileCard` memanggil `fetch('/api/users/${userId}')` dan `/api/users/${userId}/follow`, tetapi tiada route sepadan dalam `src/app/api/`. Carian hanya menjumpai rujukan string dalam `src/app/site/[username]/rss/route.ts`.
- **Kesan:** Kad profil **sentiasa gagal** ("Gagal memuat profil pengguna"). Alir utama profil adalah *dead flow*.
- **Fail Terlibat:**
  - `src/app/api/` *(perlu direktori baharu `users/[id]/route.ts` & `users/[id]/follow/route.ts`)*
  - `src/components/DrizzleProfileCard.tsx` *(pengguna)*
- **Cadangan:** Bina route Supabase yang mengembalikan `UserProfile` (id, username, email, avatar, bio, location, website, joinDate, reputation, followers, dsb).
- [ ] Aktifkan modul pembinaan endpoint `/api/users`

### 🔴 F-02 — `useProfilesStore` Tidak Persist & Tidak Segerak
- **Pepijat:** Store hanya `profiles: []` dalam memori. Tiada `persist` middleware, tiada panggilan Supabase, dan interface `Profile` (13 baris) **tidak sepadan** dengan `UserProfile` (21 medan) di `DrizzleProfileCard`.
- **Kesan:** Keadaan profil hilang pada reload; tiada sumber kebenaran tunggal.
- **Fail Terlibat:** `src/store/useProfilesStore.ts`
- **Cadangan:** Samakan jenis `Profile` ↔ `UserProfile`; tambah `persist` (localStorage) + lapisan `supabase` fetch pada `setProfiles`.
- [ ] Aktifkan modul penyeragaman jenis profil
- [ ] Aktifkan modul persistensi store

### 🔴 F-03 — `DrizzleProfileCard` Guna `useQuery` Palsu
- **Pepijat:** Komponen mentakrif `useQuery` & `useQueryClient` sendiri yang **tidak melakukan apa-apa** (`setQueryData: () => {}`). Tiada React Query sebenar.
- **Kesan:** `handleFollow` memanggil `queryClient.setQueryData` yang no-op → UI tidak kemas kini selepas follow/unfollow.
- **Fail Terlibat:** `src/components/DrizzleProfileCard.tsx` (baris 15–46, 153–180)
- **Cadangan:** Gantikan dengan `@tanstack/react-query` sebenar ATAU gunakan `useProfilesStore.updateProfile`.
- [ ] Aktifkan modul penggantian query sebenar

### 🔴 F-04 — Logik Aras (Level) Profil Silap
- **Pepijat:** `levelInfo = Math.floor(Math.log(reputation+1)/Math.log(10))+1` dan `nextLevel = levelInfo*10` menghasilkan kemajuan tidak intuitif (modulus salah). Lajur `LevelBadge` pula guna ambang berbeza (`<10 bronze`, dll.).
- **Kesan:** Bar kemajuan dan lencana aras tidak konsisten.
- **Fail Terlibat:** `src/components/DrizzleProfileCard.tsx` (baris 270–272, 481–488)
- [ ] Aktifkan modul pembetulan matematik aras

### 🟠 F-05 — `ProfileUpdateBox` Tiada Auth & Bocor Client
- **Pepijat:** `createClient` dibina semula pada setiap render; tiada `auth.getSession()`; `error` daripada insert ditelan (`console.error` sahaja); `data[0].id` diandaikan `number` tetapi tiada jaminan skema.
- **Kesan:** Status boleh dimasukkan untuk username palsu; tiada maklum balas ralat kepada pengguna.
- **Fail Terlibat:** `src/components/ProfileUpdateBox.tsx` (baris 8–11, 60–75)
- **Cadangan:** Pindah client ke singleton `src/lib/supabase.ts`; semak sesi; papar `error` state.
- [ ] Aktifkan modul pembetulan auth & singleton client

### 🟠 F-06 — `Crown` Sentiasa Dipaparkan
- **Pepijat:** `<Crown className="h-4 w-4 text-yellow-400" />` di render tanpa syarat dalam `DrizzleProfileCard` (baris 322), memberi gambaran semua pengguna bertaraf diraja.
- **Fail Terlibat:** `src/components/DrizzleProfileCard.tsx`
- [ ] Aktifkan modul syarat paparan mahkota

### 🟡 F-07 — Komponen Profil Sampling Tidak Dihidrasi
- **Pepijat:** `ProfileBioEditor`, `ProfileCardExporter`, `ProfileStatusBadge` belum diaudit hidrasi; risiko SSR mismatch pada teks Melayu/Inggeris.
- **Fail Terlibat:** `src/components/ProfileBioEditor.tsx`, `ProfileCardExporter.tsx`, `ProfileStatusBadge.tsx`
- [ ] Aktifkan modul audit hidrasi komponen profil

---

## 🧭 [UI GRID & UX FLOW ENHANCEMENTS]

### 🟠 U-01 — Jurang Sapuhan Tema (`useThemeStore` ↔ CSS)
- **Pepijat:** `ThemeId = 'space' | 'gray' | 'matrix'` **tidak sepadan** dengan `data-theme="space-neon" | "windows-gray" | "retro-matrix"` dalam `globals.css`. Tiada `useEffect` yang menetapkan `document.documentElement.dataset.theme`. `CrtThemeController` hanya urus kelas `crt-theme`, bukan `data-theme`.
- **Kesan:** Pemilih tema (`ThemeShowcase`) mengubah state tetapi **tidak mengubah rupa** laman.
- **Fail Terlibat:** `src/store/useThemeStore.ts`, `src/app/globals.css`, `src/components/ThemeShowcase.tsx`, `CrtThemeController.tsx`
- **Cadangan:** Satukan nilai enum ↔ `data-theme`; tetapkan `data-theme` pada hidrasi.
- [ ] Aktifkan modul penyelarasan tema

### 🟡 U-02 — Grid Responsif Tidak Seragam
- **Pepijat:** `DashboardProfileBanner`, `FeaturedSitesGrid`, `SiteDirectoryGrid` menggunakan campuran `max-w-7xl` vs tiada bekas; ruang padding tidak konsisten antara mobile/desktop.
- **Fail Terlibat:** `src/components/DashboardProfileBanner.tsx`, `FeaturedSitesGrid.tsx`, `SiteDirectoryGrid.tsx`
- **Cadangan:** Perkenalkan token spacing `--space-* ` dan kelas grid `cyber-grid` seragam.
- [ ] Aktifkan modul penyeragaman grid

### 🟡 U-03 — Kekurangan Keadaan Butang & Transisi
- **Pepijat:** Banyak butang (`retro-btn-primary`, `retro-btn-secondary`) tiada keadaan `:focus-visible`, `:active`, atau transisi keluar/masuk. Tiada *page transition* selaras.
- **Fail Terlibat:** `src/app/globals.css`, `src/components/RetroToolbar.tsx`, `RetroNavbar.tsx`, `PageTransitionOverlay.tsx`
- **Cadangan:** Tambah sistem butang neon dengan 4 keadaan + `transition` global.
- [ ] Aktifkan modul keadaan butang neon

### 🟡 U-04 — Alir "Dead" (Tiada Halaman Sambungan)
- **Pepijat:** `DrizzleProfileCard` pautan sosial (`twitter/github/instagram`) tiada ikon `linkedin` walaupun `SocialLinks` menyokongnya; butang "Email" menyalin email mentah ke clipboard tanpa pengesahan.
- **Fail Terlibat:** `src/components/DrizzleProfileCard.tsx` (baris 207–247, 411–417)
- [ ] Aktifkan modul pelengkapan pautan sosial & pengesahan

---

## 🌈 [VERCEL/LINEAR NEON THEME MIGRATION]

### 🎨 T-01 — Paradigma "Modern-Retro Cyber-Village"
- **Konsep:** Gabungkan semangat micro-komuniti **Neocities** (self-expression, grid peribadi) dengan grid sempadan tajam & tipografi elitis **Vercel/Linear**.
- **Palet Asas (Dark-First):**
  - `--bg-pitch: #060814` (pitch black)
  - `--bg-charcoal: #0e1330` (deep charcoal)
  - `--neon-cyan: #00ffff` (Cyber Neon Cyan)
  - `--neon-magenta: #ff007f` (Synthwave Magenta)
  - `--neon-volt: #aaff00` (Retro Volt Green)
- **Fail Terlibat:** `src/app/globals.css` *(tambah bucket `--cyber-*`)*, `src/store/useThemeStore.ts`
- [ ] Aktifkan modul token neon

### 🎨 T-02 — Sistem Tipografi & Grid Sempadan
- **Cadangan:** Gunakan `VT323` (pixel) untuk aksara mikro + `Geist/Inter` (sans) untuk badan — gaya Linear. Sempadan `1px solid var(--neon-cyan)` dengan `box-shadow: 0 0 12px var(--neon-glow)`.
- **Fail Terlibat:** `src/app/globals.css`, `src/styles/`
- [ ] Aktifkan modul tipografi hibrid
- [ ] Aktifkan modul kelas grid sempadan neon

### 🎨 T-03 — Ganti Aksen `emerald/cyan` Statik → Pembolehubah Neon
- **Pepijat:** `DrizzleProfileCard` & `ProfileCardSkeleton` keras-kod `from-emerald-500 to-cyan-500`. Perlu ditukar ke `var(--neon-cyan)` supaya tema neon dinamik.
- **Fail Terlibat:** `src/components/DrizzleProfileCard.tsx` (baris 277, 284, 299, 368, 503)
- [ ] Aktifkan modul migrasi aksen neon

### 🎨 T-04 — Mod "CRT" Sebagai Lapisan Neon
- **Cadangan:** `CrtThemeController` kekal, tetapi tambah *overlay scanline* dengan `mix-blend-mode` neon rather than gray toggle sahaja.
- **Fail Terlibat:** `src/components/CrtThemeController.tsx`, `src/app/globals.css`
- [ ] Aktifkan modul overlay CRT neon

---

## ✅ PETUNJUK KELULUSAN MODUL

Setiap kotak `- [ ]` di atas boleh dicentang secara berasingan oleh Human Tech Lead untuk mengaktifkan modul berkenaan pada fasa pelaksanaan seterusnya. Tiada fail fungsi diubah suai dalam fasa audit ini.

**Tanda Tangan Audit:** Elite Full-Stack Systems Architect (Mode Perancangan) — 2026-07-14