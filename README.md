# Imago Marketplace

Frontend marketplace portal for Imago — a replacement for the legacy Collab admin portal with a more modern and clean UI.

## Tech Stack

- **Build tool:** Vite + React + TypeScript
- **Styling:** Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Routing:** react-router-dom
- **State management:** Zustand
- **Data fetching:** @tanstack/react-query + axios (ready to use, not yet active — backend not available yet)
- **i18n:** i18next + react-i18next (EN/ID)
- **Icons:** lucide-react
- **Deployment:** Docker (multi-stage build to nginx)

## Prerequisites

- Node.js 20+
- npm
- Docker and Docker Compose (for deployment)

## Getting Started

### 1. Install dependencies

    npm install

### 2. Setup environment variables

    cp .env.example .env

Adjust VITE_API_BASE_URL in .env to match your backend endpoint (default: http://localhost:3000/api).

### 3. Run the development server

    npm run dev

The app will run at http://localhost:5174.

### 4. Build for production

    npm run build

The build output will be in the dist/ folder.

## Docker

### Build and run with Docker Compose

    docker compose up -d --build

The app will be accessible at http://localhost:8080.

### Other operational commands

    docker compose down
    docker compose up -d --build
    docker compose logs -f imago-marketplace

Note: VITE_API_BASE_URL is injected at build time, not runtime. If the backend URL changes, you need to rebuild the image, not just restart the container.

## Folder Structure

    src/
    |-- components/
    |   |-- layout/          Sidebar, Topbar, AppLayout
    |   |-- Modal.tsx
    |   |-- LanguageSwitcher.tsx
    |   `-- ProtectedRoute.tsx
    |-- features/
    |   |-- auth/            Login, Register, auth store
    |   |-- dashboard/       Dashboard with stat cards
    |   |-- categories/      Product category CRUD
    |   |-- templates/       Template CRUD
    |   |-- libraries/       Asset library CRUD
    |   `-- users/           User and role management CRUD
    |-- i18n/                Configuration and locale files (EN/ID)
    |-- lib/
    |   `-- api.ts           Axios instance and interceptor
    `-- main.tsx             Entry point and routing

### Feature Pattern (CRUD)

Every feature module follows a consistent structure:

    features/<name>/
    |-- types.ts              Data model interface
    |-- store/<name>Store.ts  Zustand store (add/update/delete/toggleStatus)
    `-- pages/<Name>Page.tsx  Table + search + add/edit modal + delete confirm modal

## Feature Status

| Feature | Status | Notes |
|---|---|---|
| Login / Register | Done | Dummy auth (admin@imago.us / password123), persisted to localStorage |
| Dashboard | Done | Stat cards with dummy data |
| Categories | Done | Full CRUD |
| Templates | Done | Full CRUD |
| Libraries | Done | Full CRUD |
| Users | Done | Full CRUD with role management |
| License | Pending | Not yet implemented |
| Multi-language (EN/ID) | Done | Toggle via Topbar / login page |
| Docker deployment | Done | Multi-stage build, served via nginx |
| Backend integration | Pending | Still using dummy data, not yet connected to a real API |

## Important Notes

- All data is currently dummy data (in-memory via Zustand, except auth which persists to localStorage). CRUD data resets to its initial state on every browser refresh.
- The lib/api.ts structure is ready, with an axios interceptor for the auth token — it just needs to be connected to the real backend endpoint once available.
- Type-only imports (interface/type) must use `import type { X } from '...'` since verbatimModuleSyntax is enabled in tsconfig — the build (tsc -b) will fail if this isn't followed.

## Scripts

| Command | Description |
|---|---|
| npm run dev | Run the development server |
| npm run build | Build for production (tsc -b && vite build) |
| npm run preview | Preview the production build locally |
| npm run lint | Run ESLint |
