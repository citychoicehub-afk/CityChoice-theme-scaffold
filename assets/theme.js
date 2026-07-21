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

  // ─── GLASSMORPHISM BACKGROUND ELEMENT ────────────────────
  var glassBg = document.createElement('div');
  glassBg.className = 'glass-bg';
  loaderOverlay.prepend(glassBg);

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

    // Camera — directly facing the user for a front view
    var camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);
    camera.lookAt(0, 0.2, 0);

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
    // Helper: create rounded rectangle shape for beveled edges
    function createRoundedBox(w, h, d, r, mat) {
      var shape = new THREE.Shape();
      shape.moveTo(-w/2 + r, -h/2);
      shape.lineTo(w/2 - r, -h/2);
      shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
      shape.lineTo(w/2, h/2 - r);
      shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
      shape.lineTo(-w/2 + r, h/2);
      shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
      shape.lineTo(-w/2, -h/2 + r);
      shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);

      var extrudeSettings = { depth: d, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 4 };
      var geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.translate(0, 0, -d/2);
      var mesh = new THREE.Mesh(geo, mat);
      return mesh;
    }

    // Materials
    var baseMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.75,
      roughness: 0.25,
    });
    var lidMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f1a,
      metalness: 0.85,
      roughness: 0.15,
    });
    var screenMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      emissive: 0x050508,
      emissiveIntensity: 0.1,
    });
    var keyboardMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a30,
      metalness: 0.5,
      roughness: 0.5,
    });
    var keyCapMat = new THREE.MeshStandardMaterial({
      color: 0x252540,
      metalness: 0.3,
      roughness: 0.7,
    });
    var bezelMat = new THREE.MeshStandardMaterial({
      color: 0x080810,
      metalness: 0.9,
      roughness: 0.1,
    });
    var accentMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.3,
    });
    var logoMat = new THREE.MeshStandardMaterial({
      color: 0x333355,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Laptop Group
    var laptopGroup = new THREE.Group();

    // ── Base with rounded edges ──
    var baseMesh = createRoundedBox(4.2, 3.0, 0.15, 0.2, baseMat);
    baseMesh.position.y = -0.1;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    laptopGroup.add(baseMesh);

    // Base bottom edge rim (thin metal strip)
    var rimGeo = new THREE.BoxGeometry(4.25, 0.02, 3.05);
    var rimMat = new THREE.MeshStandardMaterial({ color: 0x222244, metalness: 0.9, roughness: 0.2 });
    var rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.set(0, -0.18, 0);
    laptopGroup.add(rimMesh);

    // Base front edge accent line
    var accentLineGeo = new THREE.BoxGeometry(3.6, 0.01, 0.02);
    var accentLineMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.15,
    });
    var accentLine = new THREE.Mesh(accentLineGeo, accentLineMat);
    accentLine.position.set(0, -0.02, 1.49);
    laptopGroup.add(accentLine);

    // ── Lid (screen back) with rounded corners ──
    var lidMesh = createRoundedBox(4.2, 3.0, 0.12, 0.15, lidMat);
    lidMesh.position.set(0, 1.5, -1.5);
    lidMesh.rotation.x = -0.15;
    lidMesh.castShadow = true;
    lidMesh.receiveShadow = true;
    laptopGroup.add(lidMesh);

    // Lid logo (CityChoice - small shiny emblem on back)
    var logoGeo = new THREE.CircleGeometry(0.15, 16);
    var logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.set(0, 2.8, -1.44);
    logoMesh.rotation.x = -0.15;
    laptopGroup.add(logoMesh);

    // Small logo ring
    var logoRingGeo = new THREE.RingGeometry(0.15, 0.18, 24);
    var logoRingMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.1,
      side: THREE.DoubleSide,
    });
    var logoRing = new THREE.Mesh(logoRingGeo, logoRingMat);
    logoRing.position.set(0, 2.8, -1.44);
    logoRing.rotation.x = -0.15;
    laptopGroup.add(logoRing);

    // ── Screen Bezel (black border around screen) ──
    var bezelGeo = new THREE.BoxGeometry(4.0, 2.85, 0.015);
    var bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, 1.5, -1.44);
    bezelMesh.rotation.x = -0.15;
    laptopGroup.add(bezelMesh);

    // Screen (active area - inside bezel)
    var screenGeo = new THREE.BoxGeometry(3.7, 2.5, 0.02);
    var screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.5, -1.44);
    screenMesh.rotation.x = -0.15;
    laptopGroup.add(screenMesh);

    // Camera dot (tiny lens on top bezel center)
    var cameraGeo = new THREE.SphereGeometry(0.03, 8, 8);
    var cameraMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.1,
      roughness: 0.9,
    });
    var cameraMesh = new THREE.Mesh(cameraGeo, cameraMat);
    cameraMesh.position.set(0, 2.95, -1.43);
    cameraMesh.rotation.x = -0.15;
    laptopGroup.add(cameraMesh);

    // Camera LED (tiny green dot next to camera)
    var ledGeo = new THREE.SphereGeometry(0.015, 6, 6);
    var ledMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.5,
    });
    var ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.25, 2.95, -1.43);
    ledMesh.rotation.x = -0.15;
    laptopGroup.add(ledMesh);

    // ── Keyboard area (more detailed) ──
    var kbGeo = new THREE.BoxGeometry(3.8, 0.03, 1.6);
    var kbMesh = new THREE.Mesh(kbGeo, keyboardMat);
    kbMesh.position.set(0, 0.03, 0.2);
    laptopGroup.add(kbMesh);

    // Keyboard recess (slight depression)
    var recessGeo = new THREE.BoxGeometry(3.5, 0.01, 1.35);
    var recessMat = new THREE.MeshStandardMaterial({ color: 0x15152a, metalness: 0.3, roughness: 0.8 });
    var recessMesh = new THREE.Mesh(recessGeo, recessMat);
    recessMesh.position.set(0, 0.025, 0.2);
    laptopGroup.add(recessMesh);

    // Key caps with beveled appearance (multiple rows)
    var keyW = 0.16;
    var keyH = 0.03;
    var keyD = 0.16;
    var keyGap = 0.035;
    var rows = 5;
    var cols = 12;
    var kbStartX = -1.68;
    var kbStartZ = -0.45;
    var keyMeshes = [];

    for (var r = 0; r < rows; r++) {
      var rowOffset = 0;
      // Offset certain rows for keyboard stagger
      if (r === 1) rowOffset = 0.04;
      if (r === 2) rowOffset = 0.08;
      if (r === 3) rowOffset = 0.12;

      for (var c = 0; c < cols; c++) {
        var kGeo = new THREE.BoxGeometry(keyW, keyH, keyD);
        var kMat = new THREE.MeshStandardMaterial({
          color: r % 2 === 0 ? 0x252540 : 0x2a2a45,
          metalness: 0.2,
          roughness: 0.8,
        });
        var kMesh = new THREE.Mesh(kGeo, kMat);
        kMesh.position.set(
          kbStartX + c * (keyW + keyGap) + (r === 0 ? 0.12 : 0),
          0.05,
          kbStartZ + r * (keyD + keyGap) + rowOffset
        );
        kMesh.castShadow = true;
        laptopGroup.add(kMesh);
        keyMeshes.push(kMesh);
      }
    }

    // Spacebar (longer)
    var spaceGeo = new THREE.BoxGeometry(1.4, keyH, keyD);
    var spaceMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a45,
      metalness: 0.2,
      roughness: 0.8,
    });
    var spaceMesh = new THREE.Mesh(spaceGeo, spaceMat);
    spaceMesh.position.set(0, 0.05, kbStartZ + 4 * (keyD + keyGap));
    laptopGroup.add(spaceMesh);

    // Trackpad (glass-like)
    var trackGeo = new THREE.BoxGeometry(0.9, 0.015, 0.55);
    var trackMat = new THREE.MeshStandardMaterial({
      color: 0x181830,
      metalness: 0.7,
      roughness: 0.2,
    });
    var trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.position.set(0, 0.04, 1.15);
    laptopGroup.add(trackMesh);

    // Trackpad border
    var trackBorderGeo = new THREE.BoxGeometry(0.95, 0.005, 0.6);
    var trackBorderMat = new THREE.MeshStandardMaterial({
      color: 0x333366,
      metalness: 0.6,
      roughness: 0.4,
    });
    var trackBorder = new THREE.Mesh(trackBorderGeo, trackBorderMat);
    trackBorder.position.set(0, 0.035, 1.15);
    laptopGroup.add(trackBorder);

    // ── Hinge (more detailed) ──
    var hingeMat = new THREE.MeshStandardMaterial({
      color: 0x222244,
      metalness: 0.9,
      roughness: 0.15,
    });

    // Left hinge
    var hingeLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 10), hingeMat);
    hingeLeft.rotation.z = Math.PI / 2;
    hingeLeft.position.set(-1.7, 0.04, -1.48);
    laptopGroup.add(hingeLeft);

    // Right hinge
    var hingeRight = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 10), hingeMat);
    hingeRight.rotation.z = Math.PI / 2;
    hingeRight.position.set(1.7, 0.04, -1.48);
    laptopGroup.add(hingeRight);

    // Hinge center bar
    var hingeCenter = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), hingeMat);
    hingeCenter.position.set(0, 0.04, -1.48);
    laptopGroup.add(hingeCenter);

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
        // Browser window frame — LIGHT THEME
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, 80, 30, 640, 400, 8);
        ctx.fill();

        // Browser shadow (subtle outer glow)
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        roundRect(ctx, 80, 30, 640, 400, 8);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Title bar — light grey
        ctx.fillStyle = '#f0f0f4';
        roundRect(ctx, 80, 30, 640, 36, { tl: 8, tr: 8, bl: 0, br: 0 });
        ctx.fill();

        // Title bar bottom border
        ctx.fillStyle = '#e0e0e8';
        ctx.fillRect(80, 65, 640, 1);

        // Traffic lights (macOS style)
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

        // URL bar — light background
        ctx.fillStyle = '#e8e8ee';
        roundRect(ctx, 170, 38, 420, 20, 10);
        ctx.fill();

        // URL text
        var displayUrl = typedText || '';
        ctx.fillStyle = '#666677';
        ctx.font = '12px "Inter", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('https://' + displayUrl, 185, 48);

        // Lock icon (subtle)
        ctx.fillStyle = '#888899';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('🔒', 172, 48);

        // Typing cursor in URL bar
        if (typingState === 'typing' && Math.floor(frame / 20) % 2 === 0) {
          var urlWidth = ctx.measureText('https://' + displayUrl).width;
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(185 + urlWidth, 40, 2, 16);
        }

        // Page content — white background with light grey areas
        ctx.fillStyle = '#f8f8fc';
        roundRect(ctx, 100, 80, 600, 340, 4);
        ctx.fill();

        // Page content border
        ctx.strokeStyle = '#e8e8f0';
        ctx.lineWidth = 1;
        roundRect(ctx, 100, 80, 600, 340, 4);
        ctx.stroke();

        if (typingState === 'typing') {
          // Loading spinner (blue)
          var spinnerAngle = frame * 0.02;
          ctx.strokeStyle = '#2563eb';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(400, 250, 30, spinnerAngle, spinnerAngle + Math.PI * 1.5);
          ctx.stroke();

          // Simulated page skeleton loader
          ctx.fillStyle = '#e0e0e8';
          roundRect(ctx, 130, 110, 540, 16, 4);
          ctx.fill();
          ctx.fillStyle = '#e8e8f0';
          roundRect(ctx, 130, 140, 400, 12, 4);
          ctx.fill();
          roundRect(ctx, 130, 165, 500, 12, 4);
          ctx.fill();
          roundRect(ctx, 130, 190, 350, 12, 4);
          ctx.fill();

          // Card skeleton
          ctx.fillStyle = '#f0f0f6';
          roundRect(ctx, 130, 230, 160, 120, 8);
          ctx.fill();
          roundRect(ctx, 310, 230, 160, 120, 8);
          ctx.fill();
          roundRect(ctx, 490, 230, 160, 120, 8);
          ctx.fill();
        }

        if (typingState === 'done') {
          // Page content — welcome message
          ctx.fillStyle = '#111827';
          ctx.font = '24px "Space Grotesk", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Welcome to CityChoice', 400, 180);

          ctx.fillStyle = '#6b7280';
          ctx.font = '14px "Inter", sans-serif';
          ctx.fillText('Premium Electronics Store', 400, 210);

          // Decorative line
          ctx.strokeStyle = '#00d9ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(300, 235);
          ctx.lineTo(500, 235);
          ctx.stroke();

          // Stats cards
          var cardColors = ['#e8f4ff', '#f0fdf4', '#fefce8'];
          var cardLabels = ['Products', 'Categories', 'Offers'];
          for (var ci = 0; ci < 3; ci++) {
            ctx.fillStyle = cardColors[ci];
            roundRect(ctx, 130 + ci * 180, 260, 150, 80, 8);
            ctx.fill();

            ctx.fillStyle = '#374151';
            ctx.font = '13px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cardLabels[ci], 205 + ci * 180, 290);

            ctx.fillStyle = '#111827';
            ctx.font = '18px "Space Grotesk", sans-serif';
            ctx.fillText(ci === 0 ? '500+' : ci === 1 ? '12' : '40%', 205 + ci * 180, 310);
          }
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

    // Mouse tracking variables
    var mouseX = 0;
    var mouseY = 0;
    var targetRotY = 0;
    var targetRotX = 0;
    var currentRotY = 0;
    var currentRotX = 0;

    // ─── MOUSE TRACKING ────────────────────────────────────
    function initMouseTracking() {
      document.addEventListener('mousemove', function (e) {
        var rect = laptopCanvas.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      });

      // Touch support for mobile
      document.addEventListener('touchmove', function (e) {
        var touch = e.touches[0];
        var rect = laptopCanvas.getBoundingClientRect();
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
      }, { passive: true });
    }

    initMouseTracking();

    // ─── ENHANCED PARTICLES with sizes for depth ──────────
    var particleSizes = new Float32Array(particleCount);
    var particleSpeeds = new Float32Array(particleCount);
    var particlePhases = new Float32Array(particleCount);
    for (var pi = 0; pi < particleCount; pi++) {
      particleSizes[pi] = 0.015 + Math.random() * 0.05;
      particleSpeeds[pi] = 0.0005 + Math.random() * 0.002;
      particlePhases[pi] = Math.random() * Math.PI * 2;
    }
    // Store original positions for mouse interaction
    var origPositions = new Float32Array(positions);

    // ─── ANIMATION LOOP ────────────────────────────────────
    var frame = 0;

    function animate() {
      requestAnimationFrame(animate);
      frame++;

      // ── Mouse-driven parallax rotation ──
      targetRotY = mouseX * 0.12;
      targetRotX = mouseY * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;

      laptopGroup.rotation.y = currentRotY + Math.sin(frame * 0.0005) * 0.05;
      laptopGroup.rotation.x = currentRotX + Math.sin(frame * 0.0008) * 0.02;
      laptopGroup.position.y = -1 + Math.sin(frame * 0.001) * 0.08;

      // ── Enhanced particles with mouse interaction ──
      var pos = particleSystem.geometry.attributes.position.array;
      var mouseInfluenceX = mouseX * 0.5;
      var mouseInfluenceY = mouseY * 0.3;

      for (var p = 0; p < particleCount; p++) {
        // Gentle floating motion
        pos[p * 3] = origPositions[p * 3] + Math.sin(frame * particleSpeeds[p] + particlePhases[p]) * 0.3 + mouseInfluenceX * 0.1;
        pos[p * 3 + 1] = origPositions[p * 3 + 1] + Math.sin(frame * particleSpeeds[p] * 1.3 + particlePhases[p] * 1.5) * 0.3 + mouseInfluenceY * 0.1;
        pos[p * 3 + 2] = origPositions[p * 3 + 2] + Math.sin(frame * particleSpeeds[p] * 0.7 + particlePhases[p] * 2) * 0.2;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // ── Particle size variation (breathing effect) ──
      var sizes = particleSystem.geometry.attributes.size;
      if (!sizes) {
        var sizeAttr = new THREE.BufferAttribute(particleSizes, 1);
        particleGeo.setAttribute('size', sizeAttr);
        // Need a custom shader or use points material with size attenuation
        // Since we can't use per-vertex sizes easily, skip this
      }

      // Pulse particle opacity
      particleMat.opacity = 0.4 + Math.sin(frame * 0.001) * 0.15;

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
