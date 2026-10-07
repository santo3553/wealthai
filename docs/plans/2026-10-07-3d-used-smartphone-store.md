# 3D Used Smartphone E-Commerce Platform Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a production-ready, ultra-smooth 3D used smartphone e-commerce platform featuring interactive 3D phone models with scroll-driven exploded animations, cosmetic condition simulation, customer checkout/tracking, and a secure admin panel for IMEI inventory data entry and order fulfillment.

**Architecture:** Next.js 14/15 App Router unified full-stack application with `@react-three/fiber` and Three.js PBR materials for 60+ FPS WebGL rendering, GSAP ScrollTrigger for choreographed scroll scrubbing, Prisma ORM with SQLite/Postgres for individual device tracking (IMEI, battery health, grade), and HTTP-only JWT security middleware protecting the admin operations suite.

**Tech Stack:** Next.js 14/15, React 18/19, Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP, Prisma, SQLite, Tailwind CSS, Lucide React, Zod, Bcryptjs, Jose.

---

### Task 1: Project Initialization & Dependency Setup

**Directory:** `swish-phones/`

**Files:**
- Create: `swish-phones/package.json`
- Create: `swish-phones/tsconfig.json`
- Create: `swish-phones/next.config.js`
- Create: `swish-phones/tailwind.config.js`
- Create: `swish-phones/postcss.config.js`
- Create: `swish-phones/src/app/globals.css`
- Create: `swish-phones/src/app/layout.tsx`

**Step 1: Create package.json with dependencies**
Setup Next.js, Three.js, React Three Fiber, GSAP, Prisma, Bcryptjs, Jose, Lucide React, and Zod.

**Step 2: Install dependencies**
Run: `npm install` inside `swish-phones/`
Expected: Dependencies installed successfully with zero peer conflict.

**Step 3: Setup Next.js, Tailwind, and TypeScript configuration**
Configure Next.js and Tailwind CSS with modern dark/light mode and custom font tokens.

**Step 4: Verify build works**
Run: `npm run build`
Expected: Next.js builds successfully.

**Step 5: Commit**
`git add swish-phones/`
`git commit -m "feat(setup): initialize Next.js app with Three.js and Prisma"`

---

### Task 2: Database Schema & Seed Data (Prisma Engine)

**Files:**
- Create: `swish-phones/prisma/schema.prisma`
- Create: `swish-phones/prisma/seed.ts`
- Create: `swish-phones/src/lib/prisma.ts`

**Step 1: Define Prisma Models**
Create `Product`, `DeviceInventoryItem`, `Order`, `OrderItem`, `AdminUser` schemas in `schema.prisma`.

**Step 2: Generate Prisma Client & Run Migration**
Run: `npx prisma db push`
Expected: SQLite database created at `swish-phones/prisma/dev.db`.

**Step 3: Create and Execute Seed Script**
Seed flagship models (iPhone 15 Pro, Samsung Galaxy S24 Ultra, Google Pixel 8 Pro) with individual inventory units (IMEI, battery health 92-100%, condition grades, prices) and an admin account (`admin@swishphones.com` / `AdminPass123!`).
Run: `npx tsx prisma/seed.ts`
Expected: Seed completed with 3 products, 9 inventory items, and 1 admin user.

**Step 4: Commit**
`git add swish-phones/prisma/ swish-phones/src/lib/prisma.ts`
`git commit -m "feat(db): configure Prisma schema, client, and comprehensive seed data"`

---

### Task 3: Security & Admin Authentication Layer

**Files:**
- Create: `swish-phones/src/lib/auth.ts`
- Create: `swish-phones/src/middleware.ts`
- Create: `swish-phones/src/app/api/admin/login/route.ts`
- Create: `swish-phones/src/app/api/admin/logout/route.ts`
- Create: `swish-phones/src/app/api/admin/me/route.ts`

**Step 1: Write auth utilities**
Implement bcrypt password comparison, JWT token signing, and cookie verification with Jose.

**Step 2: Implement Next.js route protection middleware**
Intercept all `/admin/*` routes (except `/admin/login`). Check for valid signed token in `admin_token` HTTP-only cookie. Redirect unauthenticated traffic to `/admin/login`.

**Step 3: Create Login API with rate limiting**
Enforce maximum 5 failed attempts per IP per 15 minutes. Validate email and password, issue signed HTTP-only cookie on success.

**Step 4: Test security gate**
Verify unauthorized curl to `/api/admin/me` returns 401 Unauthorized.
Verify valid login returns 200 with `Set-Cookie`.

**Step 5: Commit**
`git add swish-phones/src/lib/auth.ts swish-phones/src/middleware.ts swish-phones/src/app/api/admin/`
`git commit -m "feat(auth): implement secure JWT cookies, bcrypt, rate limiting, and admin middleware"`

---

### Task 4: Interactive 3D Smartphone Canvas & PBR Shader Engine

**Files:**
- Create: `swish-phones/src/components/canvas/PhoneMesh.tsx`
- Create: `swish-phones/src/components/canvas/ExplodedParts.tsx`
- Create: `swish-phones/src/components/canvas/PhoneScene.tsx`
- Create: `swish-phones/src/components/canvas/ConditionOverlay.tsx`

**Step 1: Build Photorealistic 3D Smartphone Geometry & Materials**
Construct procedural/PBR phone components:
- Titanium/Aluminum curved chassis with brushed metallic reflection.
- Front glass with OLED display rendering interactive smartphone screen graphics.
- Triple camera island with sapphire glass depth lenses and gold/black bezel rings.
- Dynamic color selector (Natural Titanium, Space Black, Deep Blue, Desert Gold).

**Step 2: Build Exploded Internal Diagnostic Components**
Construct internal layers:
- Logic motherboard with A17/Snapdragon processor chip.
- Lithium-ion battery cell with diagnostic labeling.
- Taptic Engine & wireless charging magnetic coil.
- Wire displacement along Z-axis controlled by progress prop `explodeFactor` (0 to 1).

**Step 3: Build Condition Grade Shader Simulation**
Add dynamic roughness maps and micro-scuff textures for:
- `PRISTINE`: 0 scuffs, high gloss, flawless bevels.
- `GOOD`: Minor micro-abrasions along bottom edges.
- `FAIR`: Noticeable surface wear on corners and rear glass.

**Step 4: Build Canvas Container with Performance Optimization**
Configure `@react-three/fiber` Canvas with `dpr={[1, 1.8]}`, studio lighting, soft shadows, auto-rotate toggle, and WebGL error boundaries.

**Step 5: Commit**
`git add swish-phones/src/components/canvas/`
`git commit -m "feat(3d): create 3D smartphone model, exploded parts, and condition wear engine"`

---

### Task 5: Scroll-Driven Choreography & Hero Experience

**Files:**
- Create: `swish-phones/src/components/home/HeroSection.tsx`
- Create: `swish-phones/src/components/home/ExplodedDiagnosticSection.tsx`
- Create: `swish-phones/src/components/home/ConditionSimulatorSection.tsx`
- Create: `swish-phones/src/components/home/InteractiveShowcase.tsx`
- Create: `swish-phones/src/app/page.tsx`

**Step 1: Build Smooth Scroll Container**
Synchronize scroll events with GSAP timelines to scrub 3D phone rotation and part separation.

**Step 2: Implement Stage Transitions**
- Stage 1: Floating hero phone with interactive 3D mouse tilt.
- Stage 2: Scroll triggers exploded view, highlighting 50-point diagnostic tests (Battery, Logic Board, Cameras).
- Stage 3: Smooth 360-degree reassembly spin.
- Stage 4: Live cosmetic grade comparison widget.

**Step 3: Test 60 FPS performance**
Verify smooth frame rendering during continuous scroll scrubbing without stutter or frame drops.

**Step 4: Commit**
`git add swish-phones/src/components/home/ swish-phones/src/app/page.tsx`
`git commit -m "feat(scroll): integrate GSAP scroll-driven 3D choreography and landing page"`

---

### Task 6: Storefront Catalog & Product Detail Experience

**Files:**
- Create: `swish-phones/src/components/store/Navbar.tsx`
- Create: `swish-phones/src/components/store/ProductCard.tsx`
- Create: `swish-phones/src/components/store/FiltersBar.tsx`
- Create: `swish-phones/src/app/catalog/page.tsx`
- Create: `swish-phones/src/app/phones/[slug]/page.tsx`
- Create: `swish-phones/src/app/api/products/route.ts`

**Step 1: Build Catalog with Dynamic Filters**
Filter available used phones by Brand, Storage (128GB/256GB/512GB), Condition Grade (`Pristine`, `Good`, `Fair`), and Battery Health (>90%).

**Step 2: Build Interactive Product Detail Page**
- Embed 360-degree 3D viewer for the selected device.
- Live selector for Color, Storage, and Condition Grade.
- Live price update based on grade discount.
- Display verified battery health %, IMEI warranty guarantee, and add-to-cart button.

**Step 3: Commit**
`git add swish-phones/src/components/store/ swish-phones/src/app/catalog/ swish-phones/src/app/phones/`
`git commit -m "feat(store): build catalog filtering and 3D-assisted product detail page"`

---

### Task 7: Cart, Checkout & Public Order Tracking

**Files:**
- Create: `swish-phones/src/context/CartContext.tsx`
- Create: `swish-phones/src/components/cart/CartDrawer.tsx`
- Create: `swish-phones/src/app/checkout/page.tsx`
- Create: `swish-phones/src/app/api/orders/create/route.ts`
- Create: `swish-phones/src/app/track-order/page.tsx`
- Create: `swish-phones/src/app/api/orders/track/route.ts`

**Step 1: Implement Cart State**
Context managing cart items with quantity, selected condition grade, and pricing.

**Step 2: Build Checkout Experience**
- Customer details form with shipping address and phone number.
- Payment selection: Demo Card (Stripe test mode simulation), Cash on Delivery, Bank Transfer.
- Server action/API to create order record, reserve inventory unit, and generate unique Order ID (`SW-2026-XXXX`).

**Step 3: Build Public Order Tracking Page (`/track-order`)**
Allows customers to enter Order ID + Email to view live status progression (Pending $\rightarrow$ Quality Testing $\rightarrow$ Shipped with Tracking Number $\rightarrow$ Delivered).

**Step 4: Commit**
`git add swish-phones/src/context/ swish-phones/src/components/cart/ swish-phones/src/app/checkout/ swish-phones/src/app/track-order/ swish-phones/src/app/api/orders/`
`git commit -m "feat(checkout): add cart, checkout workflow, and customer order tracker"`

---

### Task 8: Admin Operations Panel (Inventory & Data Entry Studio)

**Files:**
- Create: `swish-phones/src/app/admin/login/page.tsx`
- Create: `swish-phones/src/app/admin/layout.tsx`
- Create: `swish-phones/src/app/admin/page.tsx`
- Create: `swish-phones/src/app/admin/inventory/page.tsx`
- Create: `swish-phones/src/app/api/admin/inventory/route.ts`

**Step 1: Admin Login Interface**
Clean, modern glassmorphic login screen with CSRF protection and error handling.

**Step 2: Admin Dashboard Overview**
Metric cards: Total Revenue, Total Units in Stock, Orders Requiring Testing, ASP (Average Selling Price).

**Step 3: Inventory Data Entry Studio**
- Quick Device Ingestion Modal:
  - Base Model selector (Apple, Samsung, Google).
  - IMEI / Serial barcode input with duplicate check.
  - Storage tier, color, and Battery Health percentage input.
  - Condition Grade selector (`Pristine`, `Good`, `Fair`).
  - Selling price & inspection notes.
- Real-time inventory table with status filter (`In Stock`, `Reserved`, `Sold`) and quick edit/delete actions.

**Step 4: Commit**
`git add swish-phones/src/app/admin/`
`git commit -m "feat(admin): build admin dashboard, auth gate, and inventory data entry studio"`

---

### Task 9: Order Fulfillment Pipeline & Refurbishment Certificate

**Files:**
- Create: `swish-phones/src/app/admin/orders/page.tsx`
- Create: `swish-phones/src/app/api/admin/orders/route.ts`
- Create: `swish-phones/src/components/admin/OrderDetailsModal.tsx`
- Create: `swish-phones/src/components/admin/RefurbishmentCertificate.tsx`

**Step 1: Build Order Fulfillment Pipeline**
Interactive order pipeline table with status badges and filters:
1. `PENDING_REVIEW`
2. `DIAGNOSTIC_PACKAGING`
3. `SHIPPED` (prompts admin to input Courier Carrier and Tracking Number)
4. `DELIVERED`
5. `CANCELLED`

**Step 2: Build Printable Refurbishment Warranty Certificate & Invoice**
One-click print/download modal displaying order items, verified IMEI numbers, 50-point diagnostic checkmark certificate, and 12-month warranty stamp.

**Step 3: Commit**
`git add swish-phones/src/app/admin/orders/ swish-phones/src/components/admin/`
`git commit -m "feat(orders): implement order status pipeline and printable warranty certificate"`

---

### Task 10: End-to-End Verification & Production Build

**Files:**
- Test all customer and admin flows
- Documentation: `swish-phones/README.md`

**Step 1: Run Full Production Build**
Run: `npm run build`
Expected: Next.js builds all static and dynamic pages with 0 errors.

**Step 2: Verify End-to-End User Flow**
1. Browse 3D landing page and test scroll exploded view.
2. Filter catalog, select an iPhone 15 Pro (Pristine grade, 98% battery health).
3. Complete checkout with Cash on Delivery / Demo Card.
4. Open `/track-order` and verify order status is `PENDING_REVIEW`.

**Step 3: Verify Admin Operations & Security**
1. Try accessing `/admin` without logging in $\rightarrow$ redirects to `/admin/login`.
2. Login with `admin@swishphones.com` / `AdminPass123!`.
3. Check `/admin/inventory` $\rightarrow$ add a new refurbished phone unit with IMEI.
4. Check `/admin/orders` $\rightarrow$ find the placed order, advance status to `SHIPPED`, add tracking number `TRK-9821457`.
5. Check `/track-order` $\rightarrow$ customer sees `SHIPPED` status with live tracking number.
6. Print Refurbishment Certificate & Invoice.

**Step 4: Commit & Finalize**
`git add swish-phones/`
`git commit -m "feat(release): verify all 3D features, admin workflows, and finalize documentation"`
