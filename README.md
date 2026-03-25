# SaaS Admin Dashboard

Modern admin dashboard built with **React, TypeScript and Material UI**.  
The goal of this project is to showcase scalable frontend architecture, clean code practices and real-world UI patterns used in SaaS applications.

The project is being built iteratively, with the core application shell and shared UI foundations already in place while feature modules are actively in progress.

---

## ✨ Features

- 📊 Analytics dashboard with KPIs and charts
- 👥 Users management (table, filters, details view)
- 📦 Subscription & billing overview
- 🧾 Audit log / events tracking
- ⚙️ Settings with form validation
- 🌙 Dark mode support (optional)
- 🔍 Filtering, sorting and pagination
- ⚡ Mocked API with realistic data

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
- base pages for dashboard, users, billing, events and settings
- next step: domain types, mock data, service layer and richer dashboard content

---

## 🏗️ Architecture

The project follows a **feature-based architecture** to ensure scalability and separation of concerns.

### Key principles:

- separation of UI and data logic
- reusable components
- typed API layer
- domain-driven structure
- predictable data fetching with React Query

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start dev server
npm run dev

# run tests
npm run test

# build
npm run build
```
