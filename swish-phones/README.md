# SWISH — 3D Certified Used & Refurbished Smartphone Platform

An immersive, high-performance e-commerce platform and operational suite for selling certified pre-owned smartphones. Built with **Next.js 14 App Router**, **React Three Fiber (Three.js)**, **GSAP**, **Prisma ORM**, and **SQLite/PostgreSQL**.

---

## 🌟 Key Features

### 1. 🎮 Real-Time 3D Interactive Lab
- **Photorealistic PBR Materials**: Titanium chassis, reflection-mapped sapphire camera lenses, emissive OLED display with dynamic screen wallpaper.
- **Exploded View Hardware Diagnostics**: Interactive separation of internal components (A17 Pro logic board, lithium battery cell with MagSafe induction coil, front screen glass, and back chassis).
- **Cosmetic Condition Simulator**: Real-time rendering of condition grades (**Pristine**, **Good**, **Fair**) with dynamic material roughness and micro-scuff textures.
- **360° Free Orbit & Gyroscope Physics**: Multi-touch and mouse-drag rotation with smooth momentum damping.

### 2. 📱 Certified Storefront Catalog & Product Studio
- **Refurbished Standards**: 50-point diagnostic verification, min 90% battery health guarantee, and 12-month hardware warranty.
- **Dynamic Filtering**: Filter stock by brand (Apple, Samsung, Google), condition grade, storage tier, and battery health.
- **Interactive Product Page (`/phones/[slug]`)**: 3D viewer, live colorway changer, condition selector with dynamic price recalculation.

### 3. 💳 Multi-Payment Checkout & Public Order Tracker
- **Streamlined Checkout (`/checkout`)**: Multi-payment support including Demo Stripe Card, Cash on Delivery (COD), and Bank Wire Transfer.
- **Individual IMEI Unit Allocation**: Automatically matches available serialized units to customer orders.
- **Public Order Tracker (`/track-order`)**: Real-time milestone tracker (Confirmed $\rightarrow$ Diagnostic Testing $\rightarrow$ In Transit with Courier $\rightarrow$ Delivered).

### 4. 🛡️ Secure Admin Operations Suite (`/admin`)
- **Protected Route Guards**: Next.js Edge Middleware intercepts `/admin/*` and `/api/admin/*`, enforcing signed HTTP-only JWT cookies.
- **Brute-Force Rate Limiting**: In-memory IP tracking restricts failed attempts to 5 per 15 minutes.
- **Device Ingestion Studio (`/admin/inventory`)**: Rapid IMEI data entry, battery health % recording, condition grading, and live stock toggles (`Available` $\leftrightarrow$ `Sold`).
- **Fulfillment Pipeline (`/admin/orders`)**: Advance order status, attach carrier tracking codes, and print official 50-point Refurbishment Warranty Certificates & Invoices.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed Flagship Inventory
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Admin Credentials
- **Portal URL**: `/admin/login`
- **Email**: `admin@swishphones.com`
- **Password**: `AdminPass123!`
