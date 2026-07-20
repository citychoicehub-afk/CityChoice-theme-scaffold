// CityChoice theme entry point.
// Loaded via layout/theme.liquid with the `theme.js` asset.
// Vendors are copied into assets/js from node_modules (see README asset pipeline).

import '../styles/base/base.css';

// Animation vendors (bundled/copied at build, loaded as assets)
// import 'gsap';
// import Lenis from 'lenis';
// import Swiper from 'swiper';
// import * as THREE from 'three';

function initTheme() {
  // Smooth scroll, header behavior, cart, etc. wired here later.
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
}

if (document.readyState !== 'loading') {
  initTheme();
} else {
  document.addEventListener('DOMContentLoaded', initTheme);
}
