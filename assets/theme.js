// ============================================================
// CITYCHOICE — Theme JavaScript
// 3D Laptop Loader + GSAP Animations + Lenis Smooth Scroll
// Complete file — DO NOT EDIT
// ============================================================

(function () {
  'use strict';

  // ─── DOM REFS ─────────────────────────────────────────────
  const loaderOverlay = document.getElementById('loaderOverlay');
  const loaderText = document.getElementById('loaderText');
  const loaderStatus = document.getElementById('loaderStatus');
  const laptopCanvas = document.getElementById('laptopCanvas');
  const heroCanvas = document.getElementById('hero3dCanvas');
  const homepageContent = document.getElementById('homepageContent');

  // ─── CHECK IF ELEMENTS EXIST ──────────────────────────────
  if (!loaderOverlay || !laptopCanvas) return;

  // ─── LENIS SMOOTH SCROLL ──────────────────────────────────
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ─── THREE.JS 3D LAPTOP SCENE ────────────────────────────
  function initLaptop3D() {
    if (typeof THREE === 'undefined') return;

    var W = laptopCanvas.clientWidth || 800;
    var H = laptopCanvas.clientHeight || 600;

    // Renderer
    var renderer = new THREE.WebGLRenderer({
      canvas: laptopCanvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    var scene = new THREE.Scene();

    // Camera
    var camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);
    camera.position.set(5, 3, 8);
    camera.lookAt(0, 0, 0);

    // Lights
    var ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);

    var mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    var accentLight = new THREE.PointLight(0x00d9ff, 0.8, 15);
    accentLight.position.set(-3, 2, 4);
    scene.add(accentLight);

    var rimLight = new THREE.DirectionalLight(0x00d9ff, 0.4);
    rimLight.position.set(-3, 1, -5);
    scene.add(rimLight);

    // ─── BUILD LAPTOP ───────────────────────────────────────

    // Materials
    var baseMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.7,
      roughness: 0.3,
    });
    var lidMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f1a,
      metalness: 0.8,
      roughness: 0.2,
    });
    var screenMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      emissive: 0x050508,
      emissiveIntensity: 0.1,
    });
    var keyboardMat = new THREE.MeshStandardMaterial({
      color: 0x222244,
      metalness: 0.4,
      roughness: 0.6,
    });
    var keyCapMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.2,
      roughness: 0.8,
    });

    // Laptop Group
    var laptopGroup = new THREE.Group();

    // Base
    var baseGeo = new THREE.BoxGeometry(4.2, 0.15, 3.0);
    var baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.1;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    laptopGroup.add(baseMesh);

    // Lid (screen back)
    var lidGeo = new THREE.BoxGeometry(4.2, 3.0, 0.12);
    var lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.set(0, 1.5, -1.5);
    lidMesh.rotation.x = -0.15;
    lidMesh.castShadow = true;
    lidMesh.receiveShadow = true;
    laptopGroup.add(lidMesh);

    // Screen (front face)
    var screenGeo = new THREE.BoxGeometry(3.9, 2.7, 0.02);
    var screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.5, -1.44);
    screenMesh.rotation.x = -0.15;
    laptopGroup.add(screenMesh);

    // Keyboard area
    var kbGeo = new THREE.BoxGeometry(3.8, 0.04, 1.6);
    var kbMesh = new THREE.Mesh(kbGeo, keyboardMat);
    kbMesh.position.set(0, 0.04, 0.2);
    laptopGroup.add(kbMesh);

    // Key caps (simplified rows)
    var keyW = 0.18;
    var keyH = 0.04;
    var keyD = 0.18;
    var keyGap = 0.04;
    var rows = 5;
    var cols = 12;
    var kbStartX = -1.7;
    var kbStartZ = -0.5;
    var keyMeshes = [];

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var kGeo = new THREE.BoxGeometry(keyW, keyH, keyD);
        var kMesh = new THREE.Mesh(kGeo, keyCapMat);
        kMesh.position.set(
          kbStartX + c * (keyW + keyGap),
          0.06,
          kbStartZ + r * (keyD + keyGap)
        );
        kMesh.castShadow = true;
        laptopGroup.add(kMesh);
        keyMeshes.push(kMesh);
      }
    }

    // Spacebar
    var spaceGeo = new THREE.BoxGeometry(1.2, keyH, keyD);
    var spaceMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.2,
      roughness: 0.8,
    });
    var spaceMesh = new THREE.Mesh(spaceGeo, spaceMat);
    spaceMesh.position.set(0, 0.06, kbStartZ + 4 * (keyD + keyGap));
    laptopGroup.add(spaceMesh);

    // Trackpad
    var trackGeo = new THREE.BoxGeometry(0.8, 0.02, 0.5);
    var trackMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a30,
      metalness: 0.6,
      roughness: 0.3,
    });
    var trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.position.set(0, 0.05, 1.1);
    laptopGroup.add(trackMesh);

    // Hinge
    var hingeGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.0, 8);
    var hingeMat = new THREE.MeshStandardMaterial({
      color: 0x222244,
      metalness: 0.9,
      roughness: 0.2,
    });
    var hingeMesh = new THREE.Mesh(hingeGeo, hingeMat);
    hingeMesh.rotation.z = Math.PI / 2;
    hingeMesh.position.set(0, 0.04, -1.48);
    laptopGroup.add(hingeMesh);

    laptopGroup.position.y = -1;
    scene.add(laptopGroup);

    // ─── PARTICLE SYSTEM ────────────────────────────────────
    var particleCount = 1500;
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);

    for (var i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 1;
    }

    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    var particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // ─── CANVAS TEXTURE FOR SCREEN ──────────────────────────
    var canvas2D = document.createElement('canvas');
    canvas2D.width = 800;
    canvas2D.height = 500;
    var ctx = canvas2D.getContext('2d');

    var texture = new THREE.CanvasTexture(canvas2D);
    texture.minFilter = THREE.LinearFilter;
    screenMat.map = texture;
    screenMat.needsUpdate = true;

    // State
    var typingState = 'idle';
    var typedText = '';
    var targetText = 'citychoice.pk';
    var typingIndex = 0;
    var bootProgress = 0;
    var clickable = true;

    function drawScreen(frame) {
      ctx.clearRect(0, 0, 800, 500);

      if (typingState === 'idle') {
        ctx.fillStyle = '#ffffff';
        ctx.font = '22px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Click to turn on', 400, 250);

        var pulse = Math.sin(frame * 0.002) * 0.3 + 0.7;
        ctx.strokeStyle = 'rgba(0, 217, 255, ' + (pulse * 0.5) + ')';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(400, 250, 60, 0, Math.PI * 2);
        ctx.stroke();

        if (Math.floor(frame / 30) % 2 === 0) {
          ctx.fillStyle = '#00d9ff';
          ctx.fillRect(405, 230, 2, 20);
        }
      } else if (typingState === 'booting') {
        var gradient = ctx.createLinearGradient(0, 0, 800, 0);
        gradient.addColorStop(0, '#050508');
        gradient.addColorStop(bootProgress, '#00d9ff');
        gradient.addColorStop(1, '#050508');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 245, 800, 10);

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '14px "Inter", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Booting... ' + Math.floor(bootProgress * 100) + '%', 400, 275);
      } else if (typingState === 'typing' || typingState === 'done') {
        // Browser window frame
        ctx.fillStyle = '#1a1a2e';
        roundRect(ctx, 80, 30, 640, 400, 8);
        ctx.fill();

        // Title bar
        ctx.fillStyle = '#0f0f1a';
        roundRect(ctx, 80, 30, 640, 36, { tl: 8, tr: 8, bl: 0, br: 0 });
        ctx.fill();

        // Traffic lights
        ctx.fillStyle = '#ff5f57';
        ctx.beginPath();
        ctx.arc(110, 48, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffbd2e';
        ctx.beginPath();
        ctx.arc(130, 48, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#28c840';
        ctx.beginPath();
        ctx.arc(150, 48, 6, 0, Math.PI * 2);
        ctx.fill();

        // URL bar
        ctx.fillStyle = '#2a2a3e';
        roundRect(ctx, 170, 38, 420, 20, 10);
        ctx.fill();

        var displayUrl = typedText || '';
        ctx.fillStyle = '#ffffff';
        ctx.font = '13px "Inter", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('https://' + displayUrl, 185, 48);

        if (typingState === 'typing' && Math.floor(frame / 20) % 2 === 0) {
          var urlWidth = ctx.measureText('https://' + displayUrl).width;
          ctx.fillStyle = '#00d9ff';
          ctx.fillRect(185 + urlWidth, 40, 2, 16);
        }

        // Page content
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        roundRect(ctx, 100, 80, 600, 340, 4);
        ctx.fill();

        if (typingState === 'typing') {
          var spinnerAngle = frame * 0.02;
          ctx.strokeStyle = '#00d9ff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(400, 250, 30, spinnerAngle, spinnerAngle + Math.PI * 1.5);
          ctx.stroke();
        }

        if (typingState === 'done') {
          ctx.fillStyle = '#00d9ff';
          ctx.font = '28px "Space Grotesk", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Welcome to CityChoice', 400, 220);

          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.font = '16px "Inter", sans-serif';
          ctx.fillText('Premium Electronics Store', 400, 260);
        }
      }

      texture.needsUpdate = true;
    }

    // Helper: roundRect
    function roundRect(ctx, x, y, w, h, r) {
      if (typeof r === 'object') {
        ctx.beginPath();
        ctx.moveTo(x + r.tl, y);
        ctx.lineTo(x + w - r.tr, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
        ctx.lineTo(x + w, y + h - r.br);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
        ctx.lineTo(x + r.bl, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
        ctx.lineTo(x, y + r.tl);
        ctx.quadraticCurveTo(x, y, x + r.tl, y);
        ctx.closePath();
      } else {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }
    }

    // ─── ANIMATION LOOP ────────────────────────────────────
    var frame = 0;

    function animate() {
      requestAnimationFrame(animate);
      frame++;

      laptopGroup.rotation.y = Math.sin(frame * 0.0005) * 0.15;
      laptopGroup.position.y = -1 + Math.sin(frame * 0.001) * 0.1;

      var pos = particleSystem.geometry.attributes.position.array;
      for (var p = 0; p < particleCount; p++) {
        pos[p * 3 + 1] += Math.sin(frame * 0.001 + p) * 0.001;
        pos[p * 3] += Math.cos(frame * 0.0005 + p * 0.1) * 0.0005;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Keyboard glow during typing
      if (typingState === 'typing') {
        var keysToGlow = Math.min(keyMeshes.length, Math.floor(frame * 0.05) % keyMeshes.length);
        for (var k = 0; k < keyMeshes.length; k++) {
          if (k < keysToGlow) {
            keyMeshes[k].material = new THREE.MeshStandardMaterial({
              color: 0x00d9ff,
              emissive: 0x00d9ff,
              emissiveIntensity: 0.4,
              transparent: true,
              opacity: 0.7,
            });
          }
        }
      }

      drawScreen(frame);
      renderer.render(scene, camera);
    }

    // ─── CLICK HANDLER ────────────────────────────────────
    function handleLaptopClick() {
      if (!clickable) return;
      clickable = false;

      gsap.to(loaderText, {
        opacity: 0,
        duration: 0.3,
        onComplete: function () {
          loaderText.style.display = 'none';
          typingState = 'booting';
          bootProgress = 0;

          var bootTl = gsap.timeline();
          bootTl.to({ val: 0 }, {
            val: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: function () {
              bootProgress = this.targets()[0].val;
            },
            onComplete: function () {
              typingState = 'typing';
              typingIndex = 0;
              typedText = '';
              if (loaderStatus) loaderStatus.textContent = 'Loading...';

              var typeInterval = setInterval(function () {
                if (typingIndex < targetText.length) {
                  typedText += targetText[typingIndex];
                  if (loaderStatus) loaderStatus.textContent = typedText;
                  typingIndex++;
                } else {
                  clearInterval(typeInterval);
                  typingState = 'done';
                  if (loaderStatus) {
                    loaderStatus.textContent = '✓ Connected!';
                    loaderStatus.style.color = '#00d9ff';
                  }

                  setTimeout(function () {
                    transitionToHomepage();
                  }, 1000);
                }
              }, 150);
            },
          });
        },
      });
    }

    // ─── TRANSITION TO HOMEPAGE ────────────────────────────
    function transitionToHomepage() {
      gsap.to(loaderOverlay, {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: function () {
          loaderOverlay.style.display = 'none';
          if (homepageContent) {
            homepageContent.style.display = 'block';

            gsap.from('#heroSection .hero__content', {
              opacity: 0,
              y: 60,
              duration: 1,
              ease: 'power3.out',
            });
            gsap.from('#heroSection .hero__media', {
              opacity: 0,
              scale: 0.9,
              duration: 1.2,
              delay: 0.2,
              ease: 'power3.out',
            });

            initLenis();
            initHero3D();
            initScrollAnimations();
            initNavbarScroll();
          }
        },
      });
    }

    // ─── EVENT LISTENERS ───────────────────────────────────
    laptopCanvas.addEventListener('click', handleLaptopClick);
    laptopCanvas.style.cursor = 'pointer';

    window.addEventListener('resize', function () {
      var w = laptopCanvas.clientWidth || 800;
      var h = laptopCanvas.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    animate();
  }

  // ─── HERO 3D PARTICLES ────────────────────────────────────
  function initHero3D() {
    if (typeof THREE === 'undefined' || !heroCanvas) return;

    var parent = heroCanvas.parentElement;
    var W = parent ? parent.clientWidth || 500 : 500;
    var H = parent ? parent.clientHeight || 600 : 600;

    var renderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 4;

    var torusMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      wireframe: true,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.3,
    });
    var torus = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.3, 64, 8), torusMat);
    scene.add(torus);

    var pCount = 800;
    var pPos = new Float32Array(pCount * 3);
    for (var pi = 0; pi < pCount * 3; pi++) {
      pPos[pi] = (Math.random() - 0.5) * 10;
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    var pMat = new THREE.PointsMaterial({
      color: 0x00d9ff,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    var pSys = new THREE.Points(pGeo, pMat);
    scene.add(pSys);

    var ambient = new THREE.AmbientLight(0x404060, 0.3);
    scene.add(ambient);

    var hFrame = 0;
    function heroAnimate() {
      requestAnimationFrame(heroAnimate);
      hFrame++;
      torus.rotation.x = hFrame * 0.005;
      torus.rotation.y = hFrame * 0.008;

      var pos = pSys.geometry.attributes.position.array;
      for (var ip = 0; ip < pCount; ip++) {
        pos[ip * 3 + 1] += Math.sin(hFrame * 0.002 + ip) * 0.002;
      }
      pSys.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    heroAnimate();

    window.addEventListener('resize', function () {
      var w = parent ? parent.clientWidth || 500 : 500;
      var h = parent ? parent.clientHeight || 600 : 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  // ─── GSAP SCROLL ANIMATIONS ───────────────────────────────
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Categories stagger
    var cats = document.querySelectorAll('.category-card');
    for (var ci = 0; ci < cats.length; ci++) {
      (function (card, index) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.7,
          delay: index * 0.15,
          ease: 'power3.out',
        });
      })(cats[ci], ci);
    }

    // Products stagger
    var prods = document.querySelectorAll('.product-card');
    for (var pi2 = 0; pi2 < prods.length; pi2++) {
      (function (card, index) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          opacity: 0,
          y: 40,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out',
        });
      })(prods[pi2], pi2);
    }

    // Features stagger
    var features = document.querySelectorAll('.feature-card');
    for (var fi = 0; fi < features.length; fi++) {
      (function (card, index) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          opacity: 0,
          y: 50,
          duration: 0.7,
          delay: index * 0.12,
          ease: 'power3.out',
        });
      })(features[fi], fi);
    }

    // CTA section
    var cta = document.getElementById('ctaSection');
    if (cta) {
      gsap.from(cta.querySelector('.heading-section'), {
        scrollTrigger: {
          trigger: cta,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
      });
    }

    // Footer
    var footer = document.getElementById('footerSection');
    if (footer) {
      gsap.from(footer, {
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }

  // ─── NAVBAR SCROLL EFFECT ─────────────────────────────────
  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    });
  }

  // ─── INIT ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // Remove no-js class
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

    // Start the 3D laptop loader
    setTimeout(function () {
      initLaptop3D();
    }, 100);
  });
})();
