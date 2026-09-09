# Training Institute — Admin Panel

The staff control panel (Admin Panel) for **Training Institute**. Manage products,
categories, orders, content, media and people — with a sidebar, routes and
per-row actions all gated by the signed-in user's role permissions.

Built with React 18 + Vite + TypeScript, talking to the [API server](../server.TrainingInstituteManagement)
over REST.

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | **React 18** + **Vite** + TypeScript |
| Data | **Redux Toolkit / RTK Query** + redux-persist |
| UI | **Ant Design** + **Tailwind CSS** |
| Charts | **Recharts** (dashboard) |
| Icons | lucide-react + react-icons |
| Routing | react-router-dom v6 |
| Rich text | TinyMCE / Quill / Jodit |
| Export | xlsx, jsPDF |
| Realtime | socket.io-client (live notifications) |

---

## Getting started

### 1. Install

```bash
npm install
```

> `postinstall` copies TinyMCE assets into `public/tinymce`.

### 2. Environment

Create `.env.development` (Vite reads `VITE_`-prefixed vars):

```ini
VITE_PUBLIC_API_URL=http://localhost:5005/api
VITE_PUBLIC_SERVER_URL=http://localhost:5005
VITE_PUBLIC_APP_DOMAIN=http://localhost:3010
VITE_PUBLIC_IMAGE_ACCESS_URL=http://localhost:5005
VITE_PUBLIC_TINY_API_KEY=your-tinymce-key
```

### 3. Run

```bash
npm run dev      # Vite dev server  →  http://localhost:3010
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server on port `3010` |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Project structure

```
src/
├── components/
│   ├── Dashboard/Sidebar/   # section-grouped, permission-filtered sidebar
│   ├── modal/               # create/update/permission modals
│   ├── Form/                # shared form inputs
│   └── Common/              # PageHeader, PermissionGate, RichEditor, …
├── pages/                   # one folder per screen (Dashboard, Products, Orders, …)
│   ├── Dashboard/           # e-commerce dashboard (stats, charts, modals)
│   ├── ContentManagement/   # CMS pages (Home, About, Contact, policies …)
│   └── UserGuide/           # in-app help guide
├── redux/
│   ├── api/baseApi.ts       # RTK Query base
│   └── features/            # per-domain API slices + auth slice
├── routes/                  # routes.tsx, ProtectedRoute, routePermissions
├── hooks/                   # useMe, useHasPermission, useFilteredSidebar, …
└── utils/                   # permission helpers, formatters, …
```

---

## How access control works

- **`/user/me`** returns the user + their role permissions. `useMe()` caches it
  and polls, so a permission change made by an admin auto-reloads affected
  users within a minute.
- **Sidebar** items with a `module` are hidden unless the role has access
  (`useFilteredSidebar`); items without a `module` (Dashboard, Profile, User
  Guide) are always visible.
- **Routes** are guarded by `routePermissions.ts` + `ProtectedRoute`.
- **Row actions** (status toggle, edit, delete) are wrapped in `PermissionGate`
  / `useHasPermission`, so they disable or disappear without the right access.
- **SUPER_ADMIN** bypasses everything and is hidden from role/user lists.

---

## Notable features

- **E-commerce dashboard** — revenue, orders, top products, order-status donut,
  clickable stat cards with detail modals, all split into small components.
- **Content Management** — edit the storefront's public pages (Home, About,
  Contact, Checkout, policies) section-by-section with rich-text editors.
- **Media Library** — upload to R2, organise in folders, Media Bin with restore.
- **Orders** — full lifecycle, status filters, SKU column, per-month order
  numbers, order bin.
