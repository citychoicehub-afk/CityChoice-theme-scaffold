# CityChoice Homepage Implementation - TODO

## Step 1: ✅ Update `layout/theme.liquid` — DONE ✅
- [x] Add CDN scripts (Three.js r128, GSAP 3.12 + ScrollTrigger, Lenis)
- [x] Add glassmorphism navbar (Home, Shop, About, Contact)
- [x] Update meta and structure

## Step 2: ✅ Rewrite `sections/main.liquid` — DONE ✅
- [x] 3D Laptop Loader HTML structure
- [x] Homepage sections (Hero, Categories, Products, Features, CTA, Footer)
- [x] Liquid schema for Shopify editor

## Step 3: ✅ Polish 3D Laptop Loader (Camera + Model + Browser Theme)
- [x] Fix camera — laptop faces user directly (0, 1.2, 4.5)
- [x] Polish model — beveled edges, bezel, camera dot, logo, dual hinge, detailed keyboard
- [x] Light theme browser window on screen (white bg, grey title bar, skeleton loader, stats cards)
- [x] "Click to turn on" text inside canvas (not separate HTML element)
- [x] Remove loader-text HTML from sections/main.liquid

## Step 4: ✅ Update `assets/theme.css` — Loader BG + Glassmorphism
- [ ] Glassmorphism background for loader (blur, gradient, frosted glass)
- [ ] Enhanced particle effects styling
- [ ] Mouse hover/follow effects
- [ ] Responsive loader styles

## Step 5: ✅ JS Enhancement — Mouse Effects + BG Particles
- [ ] Mouse parallax effect on laptop
- [ ] Enhanced particle system (more particles + varied colors)
- [ ] Glassmorphism scene background
- [ ] Ambient glow effects

## Step 6: ✅ Update `locales/en.default.json`
- [ ] Already complete

## Step 7: ✅ Test live preview
- [ ] Run `npm run dev` or `shopify theme dev`
- [ ] Verify loader works (click → boot → typing → transition)
- [ ] Verify all sections animate
- [ ] Verify mobile responsiveness

