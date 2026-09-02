# Imago Marketplace

Frontend marketplace portal untuk Imago — pengganti Collab admin portal lama dengan UI yang lebih modern dan clean.

## Tech Stack

- **Build tool:** Vite + React + TypeScript
- **Styling:** Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Routing:** react-router-dom
- **State management:** Zustand
- **Data fetching:** @tanstack/react-query + axios (siap dipakai, belum aktif — backend belum tersedia)
- **i18n:** i18next + react-i18next (EN/ID)
- **Icons:** lucide-react
- **Deployment:** Docker (multi-stage build ke nginx)

## Prerequisites

- Node.js 20+
- npm
- Docker and Docker Compose (untuk deployment)

## Getting Started

### 1. Install dependencies

    npm install

### 2. Setup environment variables

    cp .env.example .env

Sesuaikan VITE_API_BASE_URL di .env dengan endpoint backend kamu (default: http://localhost:3000/api).

### 3. Jalankan development server

    npm run dev

App akan jalan di http://localhost:5174.

### 4. Build untuk production

    npm run build

Hasil build ada di folder dist/.

## Docker

### Build and jalankan dengan Docker Compose

    docker compose up -d --build

App akan bisa diakses di http://localhost:8080.

### Perintah operasional lainnya

    docker compose down
    docker compose up -d --build
    docker compose logs -f imago-marketplace

Catatan: VITE_API_BASE_URL di-inject saat build time, bukan runtime. Kalau backend URL berubah, perlu rebuild image, bukan sekadar restart container.

## Struktur Folder

    src/
    |-- components/
    |   |-- layout/          Sidebar, Topbar, AppLayout
    |   |-- Modal.tsx
    |   |-- LanguageSwitcher.tsx
    |   `-- ProtectedRoute.tsx
    |-- features/
    |   |-- auth/            Login, Register, auth store
    |   |-- dashboard/       Dashboard dengan stat cards
    |   |-- categories/      CRUD kategori produk
    |   |-- templates/       CRUD template
    |   |-- libraries/       CRUD library aset
    |   `-- users/           CRUD user and role management
    |-- i18n/                Konfigurasi and locale files (EN/ID)
    |-- lib/
    |   `-- api.ts           Axios instance and interceptor
    `-- main.tsx             Entry point and routing

### Pola Feature (CRUD)

Setiap feature module mengikuti struktur konsisten:

    features/<name>/
    |-- types.ts              Interface data model
    |-- store/<name>Store.ts  Zustand store (add/update/delete/toggleStatus)
    `-- pages/<Name>Page.tsx  Table + search + modal add/edit + modal delete confirm

## Status Fitur

| Fitur | Status | Keterangan |
|---|---|---|
| Login / Register | Done | Dummy auth (admin@imago.us / password123), persist ke localStorage |
| Dashboard | Done | Stat cards dengan dummy data |
| Categories | Done | CRUD lengkap |
| Templates | Done | CRUD lengkap |
| Libraries | Done | CRUD lengkap |
| Users | Done | CRUD lengkap dengan role management |
| License | Pending | Belum dikerjakan |
| Multi-language (EN/ID) | Done | Toggle via Topbar / halaman login |
| Docker deployment | Done | Multi-stage build, nginx serve |
| Backend integration | Pending | Masih dummy data, belum terhubung ke API asli |

## Catatan Penting

- Semua data saat ini adalah dummy (in-memory via Zustand, kecuali auth yang persist ke localStorage). Data CRUD akan reset ke initial state setiap refresh browser.
- Struktur lib/api.ts sudah siap dengan axios interceptor untuk auth token, tinggal disambungkan ke endpoint backend asli begitu tersedia.
- Type-only imports (interface/type) wajib menggunakan `import type { X } from '...'` karena verbatimModuleSyntax aktif di tsconfig — akan error saat build (tsc -b) kalau tidak diikuti.

## Scripts

| Command | Deskripsi |
|---|---|
| npm run dev | Jalankan development server |
| npm run build | Build untuk production (tsc -b && vite build) |
| npm run preview | Preview hasil build secara lokal |
| npm run lint | Jalankan ESLint |
