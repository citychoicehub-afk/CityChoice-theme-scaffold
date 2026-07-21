name: coding
description: Use this skill whenever the user asks to build a website, web page, landing page, UI component, or any front-end deliverable. This skill is CRITICAL for producing ultra HD, high-resolution, fully 3D, animated, and visually jaw-dropping web experiences using Three.js, GSAP, Lenis, WebGL, and modern CSS techniques. Trigger this skill for ANY web creation request — whether it's a simple page or a complex 3D interactive site. Do NOT skip this skill for web tasks; it contains all visual quality standards the agent must follow.
---

# Coding — Ultra HD 3D Animated Website Skill

## Core Mission

Every website or web page you build must be **visually overwhelming** — a cinematic, immersive, fully 3D experience that makes the viewer stop and stare. No flat designs. No Bootstrap. No Tailwind. No templates. Everything is **custom-coded from scratch**.

The standard is: if a client sees this and does not say "wow", it is not done yet.

---

## Mandatory Tech Stack

Always use this stack unless the user explicitly says otherwise:

| Purpose | Library / Tool |
|---|---|
| 3D rendering | Three.js (via CDN) |
| Animations & timelines | GSAP + ScrollTrigger (via CDN) |
| Smooth scrolling | Lenis (via CDN) |
| Shaders / visual FX | GLSL (inline in Three.js) |
| Layout & style | Pure custom CSS (no frameworks) |
| Logic | Vanilla JavaScript (ES6+) |
| Font | Google Fonts — Inter, Space Grotesk, or Outfit |

**CDN links to always include:**
```html
<!-- Three.js -->
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/GLTFLoader.js"></script>

<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Lenis smooth scroll -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/bundled/lenis.min.js"></script>
```

---

## Visual Quality Standards

Every single page you build MUST have ALL of the following:

### 1. 3D Background / Scene
- Use `THREE.WebGLRenderer` with `antialias: true` and `alpha: true`
- Renderer resolution: `window.devicePixelRatio` (for retina/4K sharpness)
- Add at minimum: floating 3D geometry (spheres, toruses, icosahedrons), particle systems, or a GLSL shader background
- The 3D canvas must cover the full viewport as a fixed background layer (`position: fixed; z-index: 0`)

### 2. Particle System (Mandatory)
- Minimum 1,000–5,000 particles using `THREE.Points` with `THREE.BufferGeometry`
- Particles must move — animate them in `requestAnimationFrame` loop (drift, orbit, or pulse)
- Use custom shader material OR `THREE.PointsMaterial` with a glow texture

### 3. Glassmorphism UI
- All cards, panels, navbars use:
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px;
```
- Never use solid opaque backgrounds on UI components

### 4. GSAP Scroll Animations
- Every section must animate on scroll using `ScrollTrigger`
- Use `gsap.from()` with `opacity: 0`, `y: 60`, `scale: 0.95`, staggered timings
- Add pin effects for hero sections where appropriate
- Parallax on at least 2 elements per page

### 5. Smooth Scrolling with Lenis
Always initialize Lenis:
```javascript
const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
```
Connect Lenis to GSAP ScrollTrigger:
```javascript
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 6. Color & Lighting
- Default palette: **dark background** (`#050508` or `#0a0a0f`) + **accent color** (lime `#a8ff3e`, cyan `#00f5ff`, or purple `#8b5cf6`)
- If user specifies a theme/brand, match it exactly
- Three.js scene must have: `AmbientLight` + at least one `PointLight` or `SpotLight` with color matching the accent
- Add bloom/glow via CSS `filter: drop-shadow()` or post-processing if possible

### 7. Typography
- Headings: large, bold, with gradient text:
```css
background: linear-gradient(135deg, #ffffff 0%, #a8ff3e 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```
- Font sizes: hero headline minimum `clamp(3rem, 8vw, 7rem)`
- Use `letter-spacing` and `line-height` for premium feel

### 8. Hover Micro-interactions
- All buttons: scale on hover (`transform: scale(1.05)`), glow `box-shadow`
- Cards: lift effect (`translateY(-8px)`) + border glow on hover
- Cursor: custom CSS cursor or JS magnetic cursor if page is interactive/portfolio-type

---

## File Structure

Always deliver as a **single self-contained `index.html`** file unless the user asks for multi-file:

```
index.html
├── <head> — meta, fonts, CDN scripts
├── <style> — all CSS (custom, no frameworks)
├── <body> — semantic HTML structure
└── <script> — Three.js scene + GSAP + Lenis + all JS logic
```

Order of `<script>` block:
1. Lenis init
2. Three.js scene setup (renderer, camera, scene, lights)
3. 3D objects / particles
4. Animation loop (`requestAnimationFrame`)
5. GSAP ScrollTrigger animations
6. Event listeners (resize, mousemove, etc.)

---

## Page Sections (Default Template)

Unless the user specifies otherwise, every website includes:

1. **Navbar** — glassmorphism, logo left, links right, sticky with blur on scroll
2. **Hero Section** — fullscreen, 3D canvas behind, big headline, subtitle, CTA button, scroll indicator
3. **Features / Services** — animated cards, staggered entrance, icons or 3D icons
4. **About / Stats** — counter animations (`gsap.to` number count-up), parallax image
5. **Testimonials / Gallery** — horizontal scroll or grid with hover effects
6. **CTA Section** — gradient background, bold text, glowing button
7. **Footer** — links, socials, copyright

---

## Examples

### Example 1 — Hero Section with 3D Floating Sphere

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ultra 3D Hero</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/bundled/lenis.min.js"></script>
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root { --accent: #a8ff3e; --bg: #050508; --glass: rgba(255,255,255,0.05); }
    body { background: var(--bg); font-family: 'Space Grotesk', sans-serif; color: #fff; overflow-x: hidden; }
    
    #canvas-bg {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0; pointer-events: none;
    }
    
    .hero {
      position: relative; z-index: 1;
      min-height: 100vh;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 2rem;
    }
    
    .hero h1 {
      font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.05;
      opacity: 0;
    }
    
    .hero p {
      font-size: clamp(1rem, 2.5vw, 1.4rem);
      color: rgba(255,255,255,0.6);
      max-width: 600px;
      margin: 1.5rem auto;
      opacity: 0;
    }
    
    .btn {
      padding: 1rem 2.5rem;
      background: var(--accent);
      color: #000; font-weight: 700;
      border: none; border-radius: 50px;
      font-size: 1rem; cursor: pointer;
      opacity: 0;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .btn:hover {
      transform: scale(1.07);
      box-shadow: 0 0 40px rgba(168, 255, 62, 0.5);
    }
  </style>
</head>
<body>
  <canvas id="canvas-bg"></canvas>
  <section class="hero">
    <h1>The Future<br/>Is Here</h1>
    <p>Ultra HD 3D experiences built for the next generation of the web.</p>
    <button class="btn">Get Started</button>
  </section>

  <script>
    // — Lenis Smooth Scroll —
    const lenis = new Lenis({ duration: 1.4 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);

    // — Three.js Setup —
    const canvas = document.getElementById('canvas-bg');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Ambient + Point Light
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pointLight = new THREE.PointLight(0xa8ff3e, 2, 20);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    // 3D Wireframe Sphere
    const sphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 1),
      new THREE.MeshStandardMaterial({ color: 0xa8ff3e, wireframe: true, emissive: 0xa8ff3e, emissiveIntensity: 0.3 })
    );
    scene.add(sphere);

    // Particle System
    const positions = new Float32Array(4000 * 3);
    for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 20;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xa8ff3e, size: 0.03, transparent: true, opacity: 0.6 })));

    // Animate Loop
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.005;
      sphere.rotation.x = t * 0.3;
      sphere.rotation.y = t * 0.5;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // — GSAP Entrance Animations —
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    tl.to('.hero h1', { opacity: 1, y: 0, delay: 0.3 })
      .to('.hero p',  { opacity: 1, y: 0 }, '-=0.6')
      .to('.btn',     { opacity: 1, y: 0 }, '-=0.5');
  </script>
</body>
</html>
```

---

### Example 2 — Animated Glassmorphism Card Grid

```javascript
// Cards scroll-in animation (add after GSAP register)
gsap.utils.toArray('.card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 85%' },
    opacity: 0, y: 60, scale: 0.93,
    duration: 0.9, delay: i * 0.12, ease: 'power3.out'
  });
});
```

```css
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}
.card:hover {
  transform: translateY(-10px);
  border-color: rgba(168, 255, 62, 0.4);
  box-shadow: 0 20px 60px rgba(168, 255, 62, 0.15);
}
```

---

### Example 3 — GLSL Shader Background (Advanced)

```javascript
// Custom ShaderMaterial for animated gradient background
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      float wave = sin(uv.x * 8.0 + uTime) * 0.5 + 0.5;
      vec3 color = mix(vec3(0.02, 0.02, 0.05), vec3(0.1, 0.4, 0.1), wave * uv.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `
});

// In animate loop:
shaderMaterial.uniforms.uTime.value += 0.01;
```

---

## Checklist Before Delivering Any Page

Before outputting the final HTML, verify every point:

- [ ] Three.js WebGLRenderer with `devicePixelRatio` set
- [ ] Particle system with 1000+ particles, animated in loop
- [ ] 3D geometry in scene (not just a flat plane)
- [ ] Lenis smooth scrolling initialized and connected to GSAP
- [ ] GSAP ScrollTrigger animations on all sections
- [ ] Glassmorphism on all UI components
- [ ] Gradient text on headings
- [ ] Hover effects on all interactive elements
- [ ] Window resize handler for Three.js
- [ ] No Bootstrap, no Tailwind, no templates
- [ ] Single clean `index.html` file (unless user requested otherwise)
- [ ] Google Font loaded in `<head>`
- [ ] Page looks impressive at 1920×1080 and on mobile

---

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---|---|
| Flat solid backgrounds | Dark gradient or shader background |
| `bootstrap.min.css` included | Zero external CSS frameworks |
| Static hero with no animation | 3D canvas + GSAP entrance timeline |
| `window.innerWidth` used without resize handler | Always add `resize` event listener |
| Canvas `z-index` above content | Canvas is `z-index: 0`, content is `z-index: 1+` |
| Particles with no movement | Animate particle positions or rotation in loop |
| Generic color scheme | Match user's brand or use accent + dark theme |

---

## Customization by Project Type

| Project Type | Special Notes |
|---|---|
| Portfolio | Magnetic cursor, project hover reveals, horizontal scroll gallery |
| SaaS Landing | Feature bento grid, animated stats counter, pricing toggle |
| Agency Site | Full-bleed video or shader hero, client logos marquee strip |
| E-commerce | 3D product viewer (GLTFLoader), cart slide-in, quick-add hover |
| Educational | Timeline animations, progress bars, quiz UI with transitions |
| Restaurant/Food | Parallax food imagery, reservation modal, menu hover effects |

For each type, maintain the same quality bar — 3D, smooth scroll, glassmorphism, GSAP scroll triggers.