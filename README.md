# Zoom Property — Admin Panel

The staff administrative control panel for **Zoom Property**, a real estate management platform. Manage property listings, development projects, areas/locations, enquiries, editorial content, media assets, and employee personnel — with a sidebar, routes, and action buttons all gated by fine-grained role permissions.

Built with **React 18 + Vite + TypeScript**, communicating with the [API Server](../server.zoom-property) over REST.

---

## Tech Stack

| Area | Choice |
|------|--------|
| Framework | **React 18** + **Vite** + **TypeScript** |
| State & Data | **Redux Toolkit / RTK Query** + `redux-persist` |
| UI Components | **Ant Design** + **Tailwind CSS** |
| Animations | **Framer Motion** |
| Icons | `lucide-react` + `@ant-design/icons` |
| Routing | `react-router-dom` v6 |
| Rich Text | TinyMCE |
| Notifications | `react-toastify` + `socket.io-client` |

---

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Create `.env.development` (Vite reads `VITE_`-prefixed environment variables):

```ini
VITE_PUBLIC_API_URL=http://localhost:5005/api
VITE_PUBLIC_SERVER_URL=http://localhost:5005
VITE_PUBLIC_APP_DOMAIN=http://localhost:3010
VITE_PUBLIC_IMAGE_ACCESS_URL=http://localhost:5005
VITE_PUBLIC_TINY_API_KEY=your-tinymce-key
```

### 3. Run Development Server

```bash
npm run dev      # Starts Vite dev server on http://localhost:3010
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port `3010` |
| `npm run build` | Compile production build (`tsc && vite build`) |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint check |

---

## Project Structure

```
src/
├── access/                  # Action permissions catalog & route access rules
├── api/                     # Base RTK Query setup (baseApi.ts)
├── components/
│   ├── Common/              # PageHeader, PageMeta, PermissionGate, RichTextEditor
│   ├── Dashboard/Sidebar/   # Permission-filtered sidebar navigation
│   ├── Details/             # Detail view kit components
│   ├── Form/                # Shared form fields & address components
│   ├── modal/               # Create/edit/permission dialogs
│   └── shared/              # ID card modal, media uploader, record history
├── hooks/                   # useMe, useHasPermission, useFilteredSidebar
├── layout/                  # MainLayout with header, sidebar & drawer
├── pages/
│   ├── ActionLog/           # Audit action logs & error logs
│   ├── Areas/               # Neighbourhood & area management
│   ├── Blog/                # Editorial blog posts
│   ├── Dashboard/           # Overview KPI metrics & listing trends
│   ├── Inquiries/           # Contact messages & quotation requests
│   ├── Projects/            # Property development projects
│   ├── Properties/          # Property listing management (create, edit, view)
│   ├── Reports/             # Analytics & operational summaries
│   ├── Reviews/             # Testimonials & client reviews
│   ├── Settings/            # Company details, ID cards, amenities, countries
│   └── Users/               # Employee directory, roles, and designations
├── redux/
│   ├── api/baseApi.ts       # RTK Query base API
│   └── features/            # Feature-specific API slices & auth slice
├── routes/                  # App router, ProtectedRoute, route permissions
└── utils/                   # Formatting, permission checks, table exports
```

---

## Access Control & Security

- **`/user/me`**: Returns the current user's profile and granted role permissions.
- **Sidebar Filtering**: Items with a `module` are automatically filtered based on user access (`useFilteredSidebar`).
- **Route Protection**: URL paths are guarded by `routePermissions.ts` and `ProtectedRoute`.
- **Action Buttons**: UI actions (edit, delete, status toggle) are gated using `PermissionGate` and `useHasPermission`.
- **SUPER_ADMIN**: Super Admin accounts bypass permission checks and are hidden from user management lists.

---

## Key Features

- 🏡 **Property Management**: Full lifecycle tracking (Draft, Available, Reserved, Sold, Rented, Archived) with automatic slug generation and price cut detection.
- 🏢 **Development Projects**: Manage real estate projects and stage timelines.
- 📬 **Enquiry Inbox**: Manage contact messages and quotation requests from buyers and tenants.
- 👥 **HR Personnel**: Manage employees, designations, ID card generation, and custom role permissions.
- 🖼️ **Media Manager & Bin**: Upload, organize, and soft-delete/restore media files.
- 📜 **Audit History**: Track creation, updates, and status changes for records.
