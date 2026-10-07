# Design Specification: Gen-Z Aurora Hyperpop Theme & 3D Hologram Tilt Animations

## 1. Overview & Vision
Transform SWISH from its previous green/emerald tech palette into a high-octane **Gen-Z Aurora Hyperpop** aesthetic inspired by modern fashion and tech culture. The interface combines a deep cosmic void with **Sunset Coral**, **Neon Peach**, and **Aurora Borealis Violet/Magenta**, driven by **3D Hologram Tilt Cards** with real-time gyroscope physics and iridescent rainbow specular glints.

---

## 2. Color Palette & Typography Tokens

### Base & Backgrounds
- Canvas Background: `#06070d` (Deep Cosmic Void)
- Surface Cards / Panels: `#0d0f1a` with glassmorphic border `rgba(244, 63, 94, 0.15)`
- Border Accent: Coral-to-Aurora gradients (`linear-gradient(135deg, rgba(244,63,94,0.4), rgba(168,85,247,0.4))`)

### Vibrant Accents
- Primary: **Sunset Coral** (`#f43f5e`, `#fb7185`)
- Secondary: **Neon Peach / Sunset Orange** (`#f97316`, `#fb923c`)
- Accent Glow: **Aurora Violet / Electric Magenta** (`#a855f7`, `#ec4899`)
- High-Contrast Text: Pure White (`#ffffff`), Muted Slate (`#94a3b8`)

### Gradients & CSS Utilities
- `text-gradient-aurora`: `linear-gradient(135deg, #f43f5e 0%, #fb923c 45%, #c084fc 100%)`
- `glow-coral`: `box-shadow: 0 0 30px rgba(244, 63, 94, 0.35)`
- `glow-aurora`: `box-shadow: 0 0 35px rgba(168, 85, 247, 0.3)`

---

## 3. Crazy Animation Engine: 3D Hologram Tilt & Iridescent Glint

### Component: `HologramTiltCard`
- **Physics**: Real-time mouse position tracking relative to card bounding box (`clientX`, `clientY`).
- **3D Transform**: Smooth interpolation for `perspective(1000px) rotateX(calc(...deg)) rotateY(calc(...deg)) scale3d(1.02, 1.02, 1.02)` using spring easing.
- **Iridescent Holographic Specular Glint**:
  - An absolute overlay with dynamic radial/linear gradient simulating rainbow light refraction:
    `radial-gradient(circle at ${glintX}% ${glintY}%, rgba(255,255,255,0.4) 0%, rgba(244,63,94,0.2) 25%, rgba(168,85,247,0.2) 50%, transparent 75%)`
  - Reacts immediately to cursor movements, creating a genuine holographic foil card effect on certified phone catalog units.

---

## 4. WebGL Dynamic Background Updates

### Particle Constellation & Cyber Rings
- Particle vertex colors updated from green `#22c55e` to dual-chromatic Sunset Coral (`#f43f5e`) and Aurora Violet (`#a855f7`).
- Glowing cyber rings updated to Neon Peach with additive alpha blending and smooth orbital oscillation.

---

## 5. Storefront & Component Updates
1. **Global Styles (`src/app/globals.css` & `tailwind.config.js`)**:
   - Define custom keyframes for aurora gradient sweeps and pulse glows.
   - Update scrollbar and selection highlights to Coral/Aurora.
2. **Navbar (`src/components/store/Navbar.tsx`)**:
   - Logo dot: Sunset Coral pulse.
   - Active link pills & Cart badge: Aurora gradient with coral glow.
3. **Hero Section (`src/components/home/HeroSection.tsx`)**:
   - Headline: "Certified Used Flagships. Inspected & Verified." with `text-gradient-aurora`.
   - CTAs: Glowing Coral-to-Peach gradient button with hover physics.
4. **Catalog Grid (`src/app/catalog/page.tsx`)**:
   - Wrap phone cards in `HologramTiltCard` with iridescent glints.
   - Grade badges: Holographic foil badges for Pristine, Good, Fair.
5. **Customer Tools (`ImeiVerificationTool`, `CustomerProtectionSuite`)**:
   - Update emerald icons and borders to sunset coral and aurora violet.

---

## 6. Verification Strategy
- Recompile Next.js dev server without runtime errors.
- Test mouse interactions on phone cards to verify 3D tilt angles, spring return, and holographic glint sheen.
- Verify color contrast and accessibility across all routes (`/`, `/catalog`, `/phones/[slug]`, `/admin`).
