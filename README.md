# SaaS Admin Dashboard

Modern admin dashboard built with **React, TypeScript and Material UI**.  
The goal of this project is to showcase scalable frontend architecture, clean code practices and real-world UI patterns used in SaaS applications.

The project is being built iteratively, with a working application shell, typed feature modules, and a mocked API layer that lets the app run without a backend.

---

## ✨ Features

- 📊 Dashboard with KPI cards and recent activity feed
- 👥 Users page with data loaded into a MUI table
- 📦 Billing overview page scaffold
- 🧾 Events page scaffold
- ⚙️ Settings page scaffold
- ⚡ Mocked API with realistic domain data
- 🔄 Data fetching with TanStack Query
- 🧪 Page-level tests with Vitest and React Testing Library

---

## 🧱 Tech Stack

- **React + TypeScript**
- **Vite**
- **Material UI (MUI)**
- **React Router**
- **TanStack Query**
- **React Hook Form + Zod**
- **MSW (Mock Service Worker)**
- **Recharts / Nivo**
- **Vitest + React Testing Library**

---

## 🚧 Current Status

- app shell with sidebar, topbar and routing
- shared UI foundations such as `PageHeader`, `SectionCard`, `StatCard`, `EmptyState`, `LoadingState` and `ErrorState`
- typed domain models for dashboard stats, users, and audit events
- mock API layer built with `MSW`
- API client and feature hooks built on top of `TanStack Query`
- dashboard and users pages connected to mocked endpoints
- page tests for dashboard and users flows
- app currently runs fully without a real backend

---

## 🏗️ Architecture

The project follows a **feature-based architecture** to ensure scalability and separation of concerns.

### Key principles:

- separation of UI and data logic
- reusable components
- typed API layer
- domain-driven structure
- predictable data fetching with React Query

Example structure:

```text
src/
  app/
  entities/
  features/
  mocks/
  pages/
  shared/
  test/
```

`entities` holds domain models and mock data, `features` contains API/hooks, `pages` composes screens, and `shared` contains reusable UI and infrastructure.

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start dev server
npm run dev

# run tests
npm run test

# run lint
npm run lint

# build
npm run build
```

## 🔌 Mock API

The app currently starts `MSW` automatically and serves mocked responses for:

- `/api/dashboard/stats`
- `/api/users`
- `/api/events`

This means the frontend can be previewed or deployed without a real backend during the current stage of the project.
