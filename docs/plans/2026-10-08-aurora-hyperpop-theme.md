# Gen-Z Aurora Hyperpop Theme & 3D Hologram Tilt Animations Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform the visual identity of SWISH into a vibrant Gen-Z Aurora Hyperpop aesthetic featuring Sunset Coral, Neon Peach, and Aurora Violet, powered by interactive 3D Hologram Tilt phone cards with real-time gyroscope physics and iridescent specular glints.

**Architecture:** Tailwind CSS extensions and CSS 3D perspective layers provide the foundation. A dedicated React component `HologramTiltCard` tracks pointer coordinates to drive matrix transforms and rainbow radial reflections, while Three.js shaders in `DynamicBackground3D` render dual-chromatic particle fields.

**Tech Stack:** Next.js 14, Tailwind CSS, Lucide React, Three.js, React Three Fiber, Framer Motion / Spring physics.

---

### Task 1: Color Tokens, Tailwind Configuration & Global Aurora Styles

**Files:**
- Modify: `swish-phones/tailwind.config.js`
- Modify: `swish-phones/src/app/globals.css`

**Step 1: Update Tailwind configuration**
Add `coral`, `peach`, `aurora`, and `void` color tokens, along with keyframe animations for aurora pulse and iridescent glints.

**Step 2: Update `globals.css`**
Add `.text-gradient-aurora`, `.glow-coral`, `.glow-aurora`, and updated selection/scrollbar styles.

**Step 3: Verification**
Verify Tailwind recompiles cleanly with no syntax errors.

---

### Task 2: 3D Hologram Tilt Card Component with Gyroscope & Specular Glint Physics

**Files:**
- Create: `swish-phones/src/components/ui/HologramTiltCard.tsx`

**Step 1: Build `HologramTiltCard`**
Implement pointer event listeners (`onMouseMove`, `onMouseLeave`), calculate normalized coordinates (-1 to 1), derive 3D tilt angles (`rotateX`, `rotateY`), and render a dynamic iridescent rainbow reflection sheen overlay.

**Step 2: Verification**
Test component import and render with mock content.

---

### Task 3: WebGL Dynamic 3D Background Transformation to Aurora Hyperpop

**Files:**
- Modify: `swish-phones/src/components/canvas/DynamicBackground3D.tsx`

**Step 1: Update Particle & Ring Shaders**
Change vertex colors and material colors from emerald to dual Sunset Coral (`#f43f5e`) and Aurora Violet (`#a855f7`), and ring glow to Neon Peach (`#f97316`).

**Step 2: Verification**
Verify Three.js canvas renders without WebGL shader compilation warnings.

---

### Task 4: Storefront & Navigation Reskin

**Files:**
- Modify: `swish-phones/src/components/store/Navbar.tsx`
- Modify: `swish-phones/src/components/home/HeroSection.tsx`
- Modify: `swish-phones/src/components/home/RefurbishedStandards.tsx`
- Modify: `swish-phones/src/components/services/ImeiVerificationTool.tsx`
- Modify: `swish-phones/src/components/services/CustomerProtectionSuite.tsx`
- Modify: `swish-phones/src/app/page.tsx`

**Step 1: Apply Aurora Hyperpop tokens**
Replace all residual emerald classes (`emerald-500`, `emerald-400`, `emerald-950`) with vibrant coral, peach, and aurora violet accents across buttons, badges, icons, and CTA banners.

**Step 2: Verification**
Confirm homepage `/` responds with HTTP 200 and updated color tokens.

---

### Task 5: Catalog Integration with 3D Hologram Tilt Cards

**Files:**
- Modify: `swish-phones/src/app/catalog/page.tsx`

**Step 1: Wrap phone cards in `HologramTiltCard`**
Wrap each phone product card in `HologramTiltCard` with iridescent foil badges for condition grades (`Pristine`, `Good`, `Fair`).

**Step 2: Verification**
Verify `/catalog` loads and renders cards with 3D tilt physics and specular sheen.

---

### Task 6: Verification & End-to-End Visual Testing

**Files:**
- Test all storefront routes (`/`, `/catalog`, `/phones/iphone-15-pro`, `/track-order`, `/admin`).

**Step 1: Run HTTP status verification**
Check 200 OK on all routes.

**Step 2: Check dev server logs**
Ensure 0 runtime compilation errors and clean Tailwind bundling.
