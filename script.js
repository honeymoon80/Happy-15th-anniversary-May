/* =============================================
   SCRIPT.JS — Galaxia de Corazones para May
   Three.js + Canvas 2D híbrido
   ============================================= */
'use strict';

// ════════════════════════════════════════════
// ESTADO GLOBAL
// ════════════════════════════════════════════
let loadProgress = 0;          // 0 a 100
let loadAccelerated = false;
let loadInterval = null;
let loadStartTime = null;

let scene, camera, renderer, heartGroup, heartParticlesMesh;
let heartGeometry, heartMaterial;
let basePositions = null;      // posiciones base del corazón (sin orbita)
let particleCount = 0;
let galaxyAnimRunning = false;
let mouseNDC = { x: 0, y: 0 };
let mouseScreen = { x: window.innerWidth/2, y: window.innerHeight/2 };
let heartPulseT = 0;
let heartColorT = 0;
let orbitAngleGlobal = 0;

let audioCtx = null;
let currentSongIdx = 0;
let isPlaying = false;
let playerMinimized = false;

// DOM refs (se resuelven en DOMContentLoaded)
let openScreen, openBtn, loadScreen, galaxyScreen, birthCanvas;
let loadRingFg, loadPct, loadHeartWrap, loadHeartCanvas, loadSparkLayer;
let starsFallCanvas, starsFallCtx;
let clickFxCanvas, clickFxCtx;
let orbitLayer;
let galaxyAudio;
let playerWrap, playerToggle, playerPanel, playerDisc, playerSongName;
let playerCurTime, playerTotalTime, playerProgressFill, playerProgressThumb, playerProgressTrack;
let playerPlay, playerPrev, playerNext, playerBack10, playerFwd10, playerVol;
let playerListBtn, playerSongList;
let phraseModal, phraseBackdrop, phraseCard, phraseClose, phraseTitle, phraseText;
let phrasePolaroidWrap, phrasePolaroidImg;
let endPlaylistModal, endPlaylistBackdrop, endPlaylistClose, endPlaylistText;
let finalModal, finalBackdrop, finalClose, finalTitle, finalMsg, finalGallery, finalModalFx, finalModalFxCtx;
let globalNotif;

document.addEventListener('DOMContentLoaded', () => {
  resolveDomRefs();
  buildOpenScreenDecos();
  bindOpenScreen();
  bindLoadScreen();
  bindGalaxyInteractions();
  bindPlayer();
  bindModals();
  resizeAllCanvases();
  window.addEventListener('resize', resizeAllCanvases);
});

function resolveDomRefs() {
  openScreen        = document.getElementById('openScreen');
  openBtn           = document.getElementById('openBtn');
  loadScreen        = document.getElementById('loadScreen');
  galaxyScreen      = document.getElementById('galaxyScreen');
  birthCanvas       = document.getElementById('birthCanvas');

  loadRingFg        = document.getElementById('loadRingFg');
  loadPct           = document.getElementById('loadPct');
  loadHeartWrap     = document.getElementById('loadHeartWrap');
  loadHeartCanvas   = document.getElementById('loadHeartCanvas');
  loadSparkLayer    = document.getElementById('loadSparkLayer');

  starsFallCanvas   = document.getElementById('starsFallCanvas');
  starsFallCtx      = starsFallCanvas.getContext('2d');

  clickFxCanvas     = document.getElementById('clickFxCanvas');
  clickFxCtx        = clickFxCanvas.getContext('2d');

  orbitLayer        = document.getElementById('orbitLayer');
  galaxyAudio       = document.getElementById('galaxyAudio');

  playerWrap          = document.getElementById('playerWrap');
  playerToggle        = document.getElementById('playerToggle');
  playerPanel         = document.getElementById('playerPanel');
  playerDisc          = document.getElementById('playerDisc');
  playerSongName      = document.getElementById('playerSongName');
  playerCurTime       = document.getElementById('playerCurTime');
  playerTotalTime     = document.getElementById('playerTotalTime');
  playerProgressFill  = document.getElementById('playerProgressFill');
  playerProgressThumb = document.getElementById('playerProgressThumb');
  playerProgressTrack = document.getElementById('playerProgressTrack');
  playerPlay          = document.getElementById('playerPlay');
  playerPrev          = document.getElementById('playerPrev');
  playerNext          = document.getElementById('playerNext');
  playerBack10        = document.getElementById('playerBack10');
  playerFwd10         = document.getElementById('playerFwd10');
  playerVol           = document.getElementById('playerVol');
  playerListBtn       = document.getElementById('playerListBtn');
  playerSongList      = document.getElementById('playerSongList');

  phraseModal     = document.getElementById('phraseModal');
  phraseBackdrop  = document.getElementById('phraseBackdrop');
  phraseCard      = document.getElementById('phraseCard');
  phraseClose     = document.getElementById('phraseClose');
  phraseTitle     = document.getElementById('phraseTitle');
  phraseText      = document.getElementById('phraseText');
  phrasePolaroidWrap = document.getElementById('phrasePolaroidWrap');
  phrasePolaroidImg  = document.getElementById('phrasePolaroidImg');

  endPlaylistModal    = document.getElementById('endPlaylistModal');
  endPlaylistBackdrop = document.getElementById('endPlaylistBackdrop');
  endPlaylistClose    = document.getElementById('endPlaylistClose');
  endPlaylistText     = document.getElementById('endPlaylistText');

  finalModal    = document.getElementById('finalModal');
  finalBackdrop = document.getElementById('finalBackdrop');
  finalClose    = document.getElementById('finalClose');
  finalTitle    = document.getElementById('finalTitle');
  finalMsg      = document.getElementById('finalMsg');
  finalGallery  = document.getElementById('finalGallery');
  finalModalFx  = document.getElementById('finalModalFx');
  finalModalFxCtx = finalModalFx ? finalModalFx.getContext('2d') : null;

  globalNotif = document.getElementById('globalNotif');

  // Título personalizable / bloque de aniversario
  const titleEl = document.getElementById('openTitle');
  if (titleEl && CONFIG.tituloApertura) titleEl.textContent = CONFIG.tituloApertura;
  const subEl = document.querySelector('.open-subtitle');
  if (subEl && CONFIG.subtituloApertura) subEl.textContent = CONFIG.subtituloApertura;
  applyAnniversaryConfig();
}

// Muestra el bloque de aniversario en vez del título normal, si está activo en CONFIG
function applyAnniversaryConfig() {
  const anniv = CONFIG.aniversario;
  const block = document.getElementById('anniversaryBlock');
  const normal = document.getElementById('normalTitleBlock');
  if (!block || !normal) return;

  if (anniv && anniv.activo) {
    const img = document.getElementById('anniversaryImg');
    const txt = document.getElementById('anniversaryText');
    if (img) img.src = `assets/img/${anniv.imagen}`;
    if (txt) txt.textContent = anniv.texto || '';
    block.classList.remove('hidden');
    normal.classList.add('hidden');
  } else {
    block.classList.add('hidden');
    normal.classList.remove('hidden');
  }
}

function resizeAllCanvases() {
  [starsFallCanvas, clickFxCanvas, finalModalFx].forEach(c => {
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  });
  if (loadHeartCanvas) {
    loadHeartCanvas.width = loadHeartWrap.clientWidth;
    loadHeartCanvas.height = loadHeartWrap.clientHeight;
  }
  if (renderer && camera) {
    const galaxyCanvas = document.getElementById('galaxyCanvas');
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
}

// ════════════════════════════════════════════
// FASE 1A — PANTALLA DE APERTURA
// ════════════════════════════════════════════
function buildOpenScreenDecos() {
  const cont = document.getElementById('openBgDeco');
  if (!cont) return;
  const emojis = ['💗','🌸','✨','💕','🌺'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('div');
    el.className = 'open-deco-item';
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    el.style.left = Math.random()*100 + '%';
    el.style.fontSize = (Math.random()*14+14) + 'px';
    el.style.animationDuration = (Math.random()*8+9) + 's';
    el.style.animationDelay = (Math.random()*6) + 's';
    cont.appendChild(el);
  }
}

function bindOpenScreen() {
  openBtn.addEventListener('click', () => {
    spawnClickParticles(window.innerWidth/2, window.innerHeight/2, 20);
    openScreen.classList.add('closing');
    setTimeout(() => {
      openScreen.style.display = 'none';
      startLoadScreen();
    }, 750);
  });
}

// ════════════════════════════════════════════
// FASE 1B — PANTALLA DE CARGA INTERACTIVA
// ════════════════════════════════════════════
function startLoadScreen() {
  loadScreen.classList.remove('hidden');
  loadProgress = 0;
  loadAccelerated = false;
  loadStartTime = performance.now();
  updateLoadRing(0);
  buildLoadSparks();
  drawLoadHeart(0);
  startStarsFall();

  const durationMs = CONFIG.duracionCarga * 1000;
  loadInterval = setInterval(() => {
    const elapsed = performance.now() - loadStartTime;
    const speedMult = loadAccelerated ? 2.6 : 1;
    let pct = Math.min(100, (elapsed * speedMult / durationMs) * 100);
    loadProgress = pct;
    updateLoadRing(pct);
    drawLoadHeart(pct);
    if (pct >= 100) {
      clearInterval(loadInterval);
      setTimeout(finishLoadScreen, 350);
    }
  }, 16);
}

function bindLoadScreen() {
  loadHeartWrap.addEventListener('click', accelerateLoad);
  loadHeartWrap.addEventListener('touchstart', e => { e.preventDefault(); accelerateLoad(); }, {passive:false});
}

function accelerateLoad() {
  loadAccelerated = true;
  // Reiniciar el cronómetro relativo manteniendo el progreso ya alcanzado,
  // para que la aceleración se sienta inmediata sin saltos.
  const elapsed = performance.now() - loadStartTime;
  const durationMs = CONFIG.duracionCarga * 1000;
  const already = elapsed / durationMs; // fracción ya recorrida a velocidad normal
  loadStartTime = performance.now() - already * durationMs; // mantiene continuidad
  spawnLoadSparkBurst();
}

function updateLoadRing(pct) {
  const circumference = 2 * Math.PI * 92;
  const offset = circumference - (pct/100) * circumference;
  loadRingFg.style.strokeDasharray = circumference;
  loadRingFg.style.strokeDashoffset = offset;
  loadPct.textContent = Math.round(pct) + '%';
}

function buildLoadSparks() {
  loadSparkLayer.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'load-spark';
    s.style.animationDuration = (Math.random()*2+2.5) + 's';
    s.style.animationDelay = (i * 0.25) + 's';
    s.style.background = CONFIG.colores[i % CONFIG.colores.length];
    loadSparkLayer.appendChild(s);
  }
}
function spawnLoadSparkBurst() {
  for (let i = 0; i < 4; i++) {
    const s = document.createElement('div');
    s.className = 'load-spark';
    s.style.animationDuration = '0.9s';
    s.style.background = CONFIG.colores[Math.floor(Math.random()*CONFIG.colores.length)];
    s.style.left = '50%'; s.style.top = '50%';
    loadSparkLayer.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}

// Dibuja un corazón de partículas que se "llena" según pct (0-100)
function drawLoadHeart(pct) {
  const ctx = loadHeartCanvas.getContext('2d');
  const w = loadHeartCanvas.width, h = loadHeartCanvas.height;
  ctx.clearRect(0, 0, w, h);
  const cx = w/2, cy = h/2;
  const scale = Math.min(w, h) / 280;

  // Pulso del corazón mientras carga
  const pulse = 1 + Math.sin(performance.now()/260) * 0.04;

  const total = 360; // puntos de contorno del corazón
  const fillCount = Math.round(total * (pct/100));

  for (let i = 0; i < total; i++) {
    const t = (i / total) * Math.PI * 2;
    // Ecuación paramétrica de corazón
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t));
    const px = cx + hx * scale * 3.6 * pulse;
    const py = cy + hy * scale * 3.6 * pulse;

    const filled = i < fillCount;
    const radius = filled ? (Math.random()*1.4+1.6) : (Math.random()*1+0.8);
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI*2);
    if (filled) {
      const col = CONFIG.colores[i % CONFIG.colores.length];
      ctx.fillStyle = col;
      ctx.shadowColor = col;
      ctx.shadowBlur = 8;
    } else {
      ctx.fillStyle = 'rgba(255,182,193,0.18)';
      ctx.shadowBlur = 0;
    }
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

// Estrellas cayendo en el fondo de la pantalla de carga
let starsFallParticles = [];
let starsFallRunning = false;
function startStarsFall() {
  starsFallParticles = [];
  for (let i = 0; i < 90; i++) {
    starsFallParticles.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      speed: Math.random()*2+1,
      size: Math.random()*2+0.6,
      opacity: Math.random()*0.6+0.3,
    });
  }
  starsFallRunning = true;
  requestAnimationFrame(loopStarsFall);
}
function loopStarsFall() {
  if (!starsFallRunning) return;
  starsFallCtx.clearRect(0,0,starsFallCanvas.width, starsFallCanvas.height);
  starsFallParticles.forEach(s => {
    s.y += s.speed;
    if (s.y > starsFallCanvas.height) { s.y = -5; s.x = Math.random()*starsFallCanvas.width; }
    starsFallCtx.beginPath();
    starsFallCtx.arc(s.x, s.y, s.size, 0, Math.PI*2);
    starsFallCtx.fillStyle = `rgba(255,255,255,${s.opacity})`;
    starsFallCtx.fill();
  });
  if (!loadScreen.classList.contains('hidden')) requestAnimationFrame(loopStarsFall);
  else starsFallRunning = false;
}

function finishLoadScreen() {
  loadScreen.classList.add('closing');
  startBirthTransition();
  setTimeout(() => {
    loadScreen.style.display = 'none';
    starsFallRunning = false;
  }, 700);
}

// ════════════════════════════════════════════
// TRANSICIÓN — NACIMIENTO DE ESTRELLAS
// ════════════════════════════════════════════
function startBirthTransition() {
  birthCanvas.classList.remove('hidden');
  birthCanvas.width = window.innerWidth;
  birthCanvas.height = window.innerHeight;
  const ctx = birthCanvas.getContext('2d');
  const cx = birthCanvas.width/2, cy = birthCanvas.height/2;

  const stars = [];
  const totalStars = 260;
  for (let i = 0; i < totalStars; i++) {
    const angle = Math.random()*Math.PI*2;
    const speed = Math.random()*3+1.5;
    stars.push({
      x: cx, y: cy,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      size: Math.random()*2+0.8,
      color: CONFIG.colores[Math.floor(Math.random()*CONFIG.colores.length)],
      life: 1,
    });
  }

  const start = performance.now();
  const duration = 1000; // 1 segundo de crossfade + nacimiento

  galaxyScreen.classList.remove('hidden');
  galaxyScreen.style.opacity = '0';

  // La galaxia (Three.js) se inicializa una sola vez, cuando THREE ya esté listo.
  let galaxyReady = false;
  function trySetupGalaxy() {
    if (galaxyReady) return;
    if (typeof THREE === 'undefined') return; // aún cargando el CDN, se reintenta cada frame
    try {
      initGalaxyScene();
      galaxyReady = true;
    } catch (err) {
      console.error('Error inicializando la galaxia:', err);
      galaxyReady = true; // no reintentar infinito si hay un error real
      showNotif('Hubo un problema cargando la galaxia 💗 recarga la página');
    }
  }
  trySetupGalaxy();

  function loop(now) {
    try {
      const t = (now - start) / duration;
      ctx.clearRect(0,0,birthCanvas.width, birthCanvas.height);
      ctx.fillStyle = `rgba(20,6,15,${Math.max(0,1 - t)})`;
      ctx.fillRect(0,0,birthCanvas.width, birthCanvas.height);

      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        s.life -= 0.006;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Si THREE.js todavía no cargó, seguimos intentando en cada frame
      if (!galaxyReady) trySetupGalaxy();

      // Crossfade: la galaxia va apareciendo (solo si ya está inicializada)
      if (galaxyReady) {
        galaxyScreen.style.opacity = Math.min(1, t*1.3).toFixed(3);
      }

      // El nacimiento de estrellas dura como mínimo "duration" ms,
      // pero no termina hasta que la galaxia esté lista (evita pantalla negra).
      if (t < 1 || !galaxyReady) {
        requestAnimationFrame(loop);
      } else {
        birthCanvas.classList.add('hidden');
        galaxyScreen.style.opacity = '1';
        startGalaxyAnimation();
        initPlayerWithFirstSong();
      }
    } catch (err) {
      // Cualquier error inesperado no debe dejar la pantalla congelada:
      // forzamos el salto a la galaxia (o a un estado visible) en vez de morir en silencio.
      console.error('Error en la transición de nacimiento de estrellas:', err);
      birthCanvas.classList.add('hidden');
      galaxyScreen.classList.remove('hidden');
      galaxyScreen.style.opacity = '1';
      if (!galaxyAnimRunning) {
        try { startGalaxyAnimation(); initPlayerWithFirstSong(); } catch (e2) { console.error(e2); }
      }
    }
  }
  requestAnimationFrame(loop);
}

// ════════════════════════════════════════════
// FASE 2 — GALAXIA (THREE.JS)
// ════════════════════════════════════════════
function initGalaxyScene() {
  const canvas = document.getElementById('galaxyCanvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 220);

  // Fondo estrellado distante
  scene.add(buildBackgroundStars());

  heartGroup = new THREE.Group();
  scene.add(heartGroup);

  particleCount = CONFIG.cantidadParticulas;
  buildHeartParticles();

  // Mouse tracking para efecto viento
  window.addEventListener('mousemove', e => {
    mouseScreen.x = e.clientX; mouseScreen.y = e.clientY;
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
  window.addEventListener('touchmove', e => {
    if (!e.touches[0]) return;
    mouseScreen.x = e.touches[0].clientX; mouseScreen.y = e.touches[0].clientY;
  }, {passive:true});
}

function buildBackgroundStars() {
  const starCount = 2200;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 700 + Math.random()*500;
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos((Math.random()*2)-1);
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color:0xffffff, size:1.1, transparent:true, opacity:0.55 });
  return new THREE.Points(geo, mat);
}

// Genera las posiciones del corazón en 3D (forma esférica de corazón "engrosado")
function heartShapePoint(u, v) {
  // u: 0..2PI (contorno del corazón), v: 0..1 (radio interior/grosor)
  const hx = 16 * Math.pow(Math.sin(u), 3);
  const hy = 13*Math.cos(u) - 5*Math.cos(2*u) - 2*Math.cos(3*u) - Math.cos(4*u);
  const scale = CONFIG.radioCorazon / 16;
  const jitter = (Math.random()-0.5) * 6 * (1 - v*0.5);
  const depth = (Math.random()-0.5) * 14 * v;
  return {
    x: hx * scale * v + jitter*0.3,
    y: hy * scale * v + jitter*0.3,
    z: depth,
  };
}

function buildHeartParticles() {
  const positions = new Float32Array(particleCount * 3);
  const colors    = new Float32Array(particleCount * 3);
  const sizes     = new Float32Array(particleCount);
  basePositions   = new Float32Array(particleCount * 3);

  const colorObjs = CONFIG.colores.map(c => new THREE.Color(c));

  for (let i = 0; i < particleCount; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = 0.25 + Math.random() * 0.85; // grosor variable, evita centro vacío
    const p = heartShapePoint(u, v);

    positions[i*3]   = p.x;
    positions[i*3+1] = p.y;
    positions[i*3+2] = p.z;
    basePositions[i*3]   = p.x;
    basePositions[i*3+1] = p.y;
    basePositions[i*3+2] = p.z;

    const col = colorObjs[Math.floor(Math.random()*colorObjs.length)];
    colors[i*3] = col.r; colors[i*3+1] = col.g; colors[i*3+2] = col.b;

    sizes[i] = Math.random()*1.8 + 0.9;
  }

  heartGeometry = new THREE.BufferGeometry();
  heartGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  heartGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  heartGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  heartMaterial = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  heartParticlesMesh = new THREE.Points(heartGeometry, heartMaterial);
  heartGroup.add(heartParticlesMesh);

  // Halo suave detrás del corazón
  const haloGeo = new THREE.SphereGeometry(CONFIG.radioCorazon*1.5, 24, 24);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xFF85A2, transparent:true, opacity:0.045,
    side: THREE.BackSide,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  heartGroup.add(halo);
}

// ════════════════════════════════════════════
// ANIMACIÓN PRINCIPAL DE LA GALAXIA
// ════════════════════════════════════════════
function startGalaxyAnimation() {
  galaxyAnimRunning = true;
  buildOrbitElements(); // frases, palabras clave, imágenes (HTML sobre el canvas)
  requestAnimationFrame(animateGalaxy);
}

function animateGalaxy(now) {
  if (!galaxyAnimRunning) return;

  try {
    // Pulso del corazón: escala 1.0 -> 1.08 -> 1.0
    heartPulseT += 0.018;
    const pulseScale = 1 + Math.sin(heartPulseT) * 0.04;
    heartGroup.scale.set(pulseScale, pulseScale, pulseScale);

    // Rotación lenta de la galaxia completa (órbita de partículas)
    orbitAngleGlobal += CONFIG.velocidadOrbita;
    heartGroup.rotation.y = orbitAngleGlobal;

    // Color del corazón cambia gradualmente entre tonos pastel (ciclo lento)
    heartColorT += 0.0015;
    applyHeartColorCycle(heartColorT);

    // Efecto "viento": las partículas se apartan ligeramente cerca del mouse
    applyWindEffect();

    renderer.render(scene, camera);

    // Sincronizar overlay HTML (frases/palabras/imágenes) con la rotación 3D
    updateOrbitOverlayPositions();
  } catch (err) {
    // Un error en un solo frame no debe congelar la galaxia para siempre.
    console.error('Error en animateGalaxy:', err);
  }

  requestAnimationFrame(animateGalaxy);
}

// Cicla los colores pastel de las partículas suavemente
function applyHeartColorCycle(t) {
  const colors = heartGeometry.attributes.color;
  const baseColors = CONFIG.colores.map(c => new THREE.Color(c));
  const shift = Math.sin(t) * 0.5 + 0.5; // 0..1
  for (let i = 0; i < particleCount; i += 7) { // muestreo parcial para rendimiento
    const c1 = baseColors[i % baseColors.length];
    const c2 = baseColors[(i+1) % baseColors.length];
    const r = c1.r + (c2.r - c1.r) * shift;
    const g = c1.g + (c2.g - c1.g) * shift;
    const b = c1.b + (c2.b - c1.b) * shift;
    colors.array[i*3] = r; colors.array[i*3+1] = g; colors.array[i*3+2] = b;
  }
  colors.needsUpdate = true;
}

// Aparta partículas cerca de la posición proyectada del mouse (efecto viento)
function applyWindEffect() {
  const positions = heartGeometry.attributes.position;
  // Proyectar mouse a coordenadas de mundo aproximadas (plano z=0 del grupo)
  const vector = new THREE.Vector3(mouseNDC.x, mouseNDC.y, 0.5);
  vector.unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

  // Convertir a espacio local del heartGroup (deshacer rotación actual)
  const localPos = heartGroup.worldToLocal(worldPos.clone());

  const windRadius = 38;
  for (let i = 0; i < particleCount; i += 3) { // muestreo parcial para rendimiento
    const bx = basePositions[i*3], by = basePositions[i*3+1], bz = basePositions[i*3+2];
    const dx = bx - localPos.x, dy = by - localPos.y;
    const distSq = dx*dx + dy*dy;
    if (distSq < windRadius*windRadius) {
      const dist = Math.sqrt(distSq) || 0.01;
      const force = (1 - dist/windRadius) * 9;
      positions.array[i*3]   = bx + (dx/dist) * force;
      positions.array[i*3+1] = by + (dy/dist) * force;
    } else {
      positions.array[i*3]   = bx;
      positions.array[i*3+1] = by;
    }
  }
  positions.needsUpdate = true;
}

// ════════════════════════════════════════════
// ELEMENTOS ORBITANTES (frases, palabras clave, imágenes)
// Implementados como overlay HTML posicionado dinámicamente
// para máxima nitidez de texto e imágenes.
// ════════════════════════════════════════════
let orbitElements = []; // {el, radius, speed, angle, baseSize, type}

function buildOrbitElements() {
  orbitLayer.innerHTML = '';
  orbitElements = [];

  // ── Frases cortas (8) — registran su clic para el modal final ──
  CONFIG.frases.forEach((frase, i) => {
    const el = document.createElement('div');
    el.className = 'orbit-phrase';
    el.textContent = frase;
    el.addEventListener('click', () => {
      const fotoArchivo = CONFIG.fotosFrases ? CONFIG.fotosFrases[frase] : null;
      openPhraseModal(frase, CONFIG.mensajesLargos[frase] || frase, true, fotoArchivo);
      registrarFraseVista(frase);
    });
    orbitLayer.appendChild(el);
    orbitElements.push({
      el, radius: 150 + (i%4)*22, speed: 0.16 + i*0.01,
      angle: (i / CONFIG.frases.length) * Math.PI * 2,
      depthAmp: 0.35, vertAmp: 28 + i*5, type:'phrase',
    });
  });

  // ── Palabras clave ─────────────────────────
  const kwEntries = Object.entries(CONFIG.palabrasClave);
  kwEntries.forEach(([palabra, mensaje], i) => {
    const el = document.createElement('div');
    el.className = 'orbit-keyword';
    el.textContent = palabra;
    el.addEventListener('click', () => openPhraseModal(palabra, mensaje, false));
    orbitLayer.appendChild(el);
    orbitElements.push({
      el, radius: 210 + (i%3)*22, speed: 0.12 + i*0.012,
      angle: (i / kwEntries.length) * Math.PI * 2 + 1.2,
      depthAmp: 0.4, vertAmp: 24 + i*5, type:'keyword',
    });
  });

  // ── Imágenes orbitando (28, repartidas en 3 anillos: cerca/medio/lejos) ──
  const totalImgs = CONFIG.imagenes.length;
  const minSize = CONFIG.imgOrbitMinSize || 80;
  const maxSize = CONFIG.imgOrbitMaxSize || 120;

  // 3 anillos concéntricos con distinto radio y velocidad propia
  const anillos = [
    { radioBase: 230, speedBase: 0.085, vertAmpBase: 16 }, // cerca
    { radioBase: 300, speedBase: 0.060, vertAmpBase: 24 }, // medio
    { radioBase: 380, speedBase: 0.040, vertAmpBase: 34 }, // lejos
  ];

  CONFIG.imagenes.forEach((img, i) => {
    const anillo = anillos[i % anillos.length];
    const within = Math.floor(i / anillos.length); // posición dentro del anillo
    const countInRing = Math.ceil(totalImgs / anillos.length);

    // Tamaño variable entre min y max, distribuido de forma pseudo-aleatoria pero estable
    const sizeT = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const size = Math.round(minSize + Math.abs(sizeT) * (maxSize - minSize));

    const wrap = document.createElement('div');
    wrap.className = 'orbit-img-wrap';
    wrap.style.width = size + 'px';
    wrap.style.height = size + 'px';
    wrap.innerHTML = `<img src="assets/img/${img}" alt="recuerdo ${i+1}" loading="lazy"
      onerror="this.parentElement.style.background='linear-gradient(135deg,#FFD1DC,#FFB6C1)';this.style.display='none'">`;
    orbitLayer.appendChild(wrap);

    orbitElements.push({
      el: wrap,
      radius: anillo.radioBase + (within % 2) * 18,
      speed: anillo.speedBase + (within * 0.004),
      angle: (within / countInRing) * Math.PI * 2 + anillo.radioBase * 0.01,
      depthAmp: 0.5,
      vertAmp: anillo.vertAmpBase + (within % 3) * 5,
      type: 'image',
    });
  });
}

// ── Registro de frases vistas (para el modal final) ──────────────────
let frasesVistas = new Set();
function registrarFraseVista(frase) {
  frasesVistas.add(frase);
  if (frasesVistas.size >= CONFIG.frases.length) {
    // Pequeño delay para que el usuario primero vea la carta de la última frase
    setTimeout(() => openFinalModal(), 600);
  }
}

// Actualiza la posición 2D (pantalla) de cada elemento orbitante,
// simulando profundidad (escala + z-index) según el ángulo de órbita.
function updateOrbitOverlayPositions() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const t = performance.now() / 1000;

  orbitElements.forEach(o => {
    o.angle += o.speed * 0.01;
    const x = Math.cos(o.angle) * o.radius;
    const zFactor = Math.sin(o.angle); // -1..1 simula profundidad
    const y = Math.sin(o.angle * 0.7 + t*0.3) * o.vertAmp * 0.4 + Math.sin(o.angle) * (o.vertAmp*0.3);

    const depthScale = 0.65 + (zFactor*0.5+0.5) * o.depthAmp + 0.5;
    const screenX = cx + x;
    const screenY = cy + y * 0.6 - 20;

    o.el.style.left = screenX + 'px';
    o.el.style.top  = screenY + 'px';
    o.el.style.transform = `translate(-50%,-50%) scale(${depthScale.toFixed(3)})`;
    o.el.style.zIndex = Math.round((zFactor+1) * 50) + 5;
    o.el.style.opacity = (0.55 + (zFactor*0.5+0.5)*0.45).toFixed(2);
  });
}

// ════════════════════════════════════════════
// INTERACCIONES GLOBALES DE LA GALAXIA
// (clic en fondo vacío -> partículas + frase corta)
// ════════════════════════════════════════════
function bindGalaxyInteractions() {
  document.addEventListener('click', e => {
    if (galaxyScreen.classList.contains('hidden')) return;
    if (e.target.closest('.orbit-phrase, .orbit-keyword, .orbit-img-wrap, .player-wrap, .phrase-modal, button, input')) return;
    spawnClickParticles(e.clientX, e.clientY, 32);
  });
  document.addEventListener('touchstart', e => {
    if (galaxyScreen.classList.contains('hidden')) return;
    if (e.target.closest('.orbit-phrase, .orbit-keyword, .orbit-img-wrap, .player-wrap, .phrase-modal, button, input')) return;
    const t = e.touches[0];
    spawnClickParticles(t.clientX, t.clientY, 32);
  }, {passive:true});
}

// ════════════════════════════════════════════
// PARTÍCULAS DE CLIC (emojis + frases cortas)
// Canvas 2D overlay para máximo rendimiento
// ════════════════════════════════════════════
let clickParticles = [];
let clickFxLoopRunning = false;

function spawnClickParticles(x, y, count) {
  for (let i = 0; i < count; i++) {
    const useEmoji = Math.random() > 0.4;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3.4 + 1.4;
    clickParticles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      gravity: 0.05,
      life: 1,
      decay: Math.random()*0.012 + 0.012,
      rotation: Math.random()*360,
      rotSpeed: (Math.random()-0.5)*6,
      size: useEmoji ? (Math.random()*14+16) : (Math.random()*5+11),
      text: useEmoji
        ? CONFIG.emojisClick[Math.floor(Math.random()*CONFIG.emojisClick.length)]
        : CONFIG.frasesClicCorto[Math.floor(Math.random()*CONFIG.frasesClicCorto.length)],
      isEmoji: useEmoji,
      color: CONFIG.colores[Math.floor(Math.random()*CONFIG.colores.length)],
    });
  }
  if (!clickFxLoopRunning) {
    clickFxLoopRunning = true;
    requestAnimationFrame(loopClickFx);
  }
}

function loopClickFx() {
  clickFxCtx.clearRect(0, 0, clickFxCanvas.width, clickFxCanvas.height);
  for (let i = clickParticles.length - 1; i >= 0; i--) {
    const p = clickParticles[i];
    p.x += p.vx; p.y += p.vy;
    p.vy += p.gravity;
    p.life -= p.decay;
    p.rotation += p.rotSpeed;

    if (p.life <= 0) { clickParticles.splice(i, 1); continue; }

    clickFxCtx.save();
    clickFxCtx.globalAlpha = Math.max(0, p.life);
    clickFxCtx.translate(p.x, p.y);
    clickFxCtx.rotate(p.rotation * Math.PI/180);
    if (p.isEmoji) {
      clickFxCtx.font = `${p.size}px sans-serif`;
      clickFxCtx.textAlign = 'center';
      clickFxCtx.textBaseline = 'middle';
      clickFxCtx.shadowColor = p.color;
      clickFxCtx.shadowBlur = 10;
      clickFxCtx.fillText(p.text, 0, 0);
    } else {
      clickFxCtx.font = `600 ${p.size}px 'Dancing Script', cursive`;
      clickFxCtx.textAlign = 'center';
      clickFxCtx.textBaseline = 'middle';
      clickFxCtx.fillStyle = p.color;
      clickFxCtx.shadowColor = p.color;
      clickFxCtx.shadowBlur = 8;
      clickFxCtx.fillText(p.text, 0, 0);
    }
    clickFxCtx.restore();
  }
  if (clickParticles.length > 0) {
    requestAnimationFrame(loopClickFx);
  } else {
    clickFxLoopRunning = false;
  }
}

// ════════════════════════════════════════════
// MODAL DE FRASE / PALABRA CLAVE
// ════════════════════════════════════════════
function openPhraseModal(titulo, texto, isPhrase, fotoArchivo) {
  phraseTitle.textContent = titulo;
  phraseText.textContent = texto;
  phraseCard.style.borderColor = isPhrase ? 'rgba(255,182,193,0.7)' : 'rgba(255,255,255,0.8)';

  // Foto polaroid (solo si se provee un archivo, ej. en frases con fotosFrases)
  if (fotoArchivo && phrasePolaroidWrap && phrasePolaroidImg) {
    phrasePolaroidImg.src = `assets/img/${fotoArchivo}`;
    phrasePolaroidWrap.classList.remove('hidden');
  } else if (phrasePolaroidWrap) {
    phrasePolaroidWrap.classList.add('hidden');
  }

  phraseModal.classList.remove('hidden');
  spawnClickParticles(window.innerWidth/2, window.innerHeight/3, 14);
}
function closePhraseModal() { phraseModal.classList.add('hidden'); }

function bindModals() {
  phraseClose.addEventListener('click', closePhraseModal);
  phraseBackdrop.addEventListener('click', closePhraseModal);
  endPlaylistClose.addEventListener('click', () => endPlaylistModal.classList.add('hidden'));
  endPlaylistBackdrop.addEventListener('click', () => endPlaylistModal.classList.add('hidden'));
  if (finalClose) finalClose.addEventListener('click', closeFinalModal);
  if (finalBackdrop) finalBackdrop.addEventListener('click', closeFinalModal);

  // Botón atrás del móvil cierra modales abiertos
  history.pushState({page:'home'}, '');
  window.addEventListener('popstate', () => {
    if (!phraseModal.classList.contains('hidden')) {
      closePhraseModal();
      history.pushState({page:'home'}, '');
    } else if (!endPlaylistModal.classList.contains('hidden')) {
      endPlaylistModal.classList.add('hidden');
      history.pushState({page:'home'}, '');
    } else if (finalModal && !finalModal.classList.contains('hidden')) {
      closeFinalModal();
      history.pushState({page:'home'}, '');
    }
  });
}

// ════════════════════════════════════════════
// MODAL FINAL ESPECTACULAR (al completar las 8 frases)
// ════════════════════════════════════════════
let finalFxParticles = [];
let finalFxRunning = false;

function openFinalModal() {
  if (!finalModal || !finalModal.classList.contains('hidden')) return; // ya está abierto, evitar duplicar

  const cfg = CONFIG.modalFinal || {};
  if (finalTitle) finalTitle.textContent = cfg.titulo || '';
  if (finalMsg)   finalMsg.textContent   = cfg.mensaje || '';

  if (finalGallery) {
    finalGallery.innerHTML = '';
    (cfg.imagenes || []).forEach((img, i) => {
      const item = document.createElement('div');
      item.className = 'final-gallery-item';
      item.innerHTML = `<img src="assets/img/${img}" alt="recuerdo final ${i+1}" loading="lazy"
        onerror="this.style.display='none'">`;
      finalGallery.appendChild(item);
    });
  }

  finalModal.classList.remove('hidden');
  launchConfetti(80);
  spawnClickParticles(window.innerWidth/2, window.innerHeight/2, 36);
  startFinalModalFx();
  history.pushState({page:'final'}, '');
}

function closeFinalModal() {
  if (!finalModal) return;
  finalModal.classList.add('hidden');
  finalFxRunning = false;
}

// Partículas de brillo flotando dentro del modal final (canvas propio)
function startFinalModalFx() {
  if (!finalModalFx || !finalModalFxCtx) return;
  finalModalFx.width = window.innerWidth;
  finalModalFx.height = window.innerHeight;
  finalFxParticles = [];
  const colors = CONFIG.colores;
  for (let i = 0; i < 60; i++) {
    finalFxParticles.push({
      x: Math.random()*finalModalFx.width,
      y: Math.random()*finalModalFx.height,
      size: Math.random()*2.4+0.8,
      speedY: Math.random()*0.5+0.15,
      drift: (Math.random()-0.5)*0.4,
      opacity: Math.random()*0.6+0.25,
      color: colors[Math.floor(Math.random()*colors.length)],
      twinkle: Math.random()*Math.PI*2,
    });
  }
  finalFxRunning = true;
  requestAnimationFrame(loopFinalModalFx);
}

function loopFinalModalFx() {
  if (!finalFxRunning || !finalModalFxCtx) return;
  finalModalFxCtx.clearRect(0,0,finalModalFx.width, finalModalFx.height);
  finalFxParticles.forEach(p => {
    p.y -= p.speedY;
    p.x += p.drift;
    p.twinkle += 0.05;
    if (p.y < -10) { p.y = finalModalFx.height + 10; p.x = Math.random()*finalModalFx.width; }
    const tw = (Math.sin(p.twinkle)*0.3+0.7);
    finalModalFxCtx.beginPath();
    finalModalFxCtx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    finalModalFxCtx.fillStyle = p.color;
    finalModalFxCtx.globalAlpha = p.opacity * tw;
    finalModalFxCtx.shadowColor = p.color;
    finalModalFxCtx.shadowBlur = 8;
    finalModalFxCtx.fill();
  });
  finalModalFxCtx.globalAlpha = 1;
  finalModalFxCtx.shadowBlur = 0;
  if (finalModal && !finalModal.classList.contains('hidden')) {
    requestAnimationFrame(loopFinalModalFx);
  } else {
    finalFxRunning = false;
  }
}

// Confeti simple para el momento del modal final (reutiliza el canvas de clic)
function launchConfetti(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      spawnClickParticles(
        Math.random()*window.innerWidth,
        -10,
        1
      );
    }, i*18);
  }
}

// ════════════════════════════════════════════
// REPRODUCTOR DE MÚSICA
// ════════════════════════════════════════════
function bindPlayer() {
  playerToggle.addEventListener('click', e => { e.stopPropagation(); togglePlayerPanel(); });
  playerPlay.addEventListener('click', e => { e.stopPropagation(); togglePlay(); });
  playerPrev.addEventListener('click', e => { e.stopPropagation(); changeSong(-1); });
  playerNext.addEventListener('click', e => { e.stopPropagation(); changeSong(1); });
  playerBack10.addEventListener('click', e => { e.stopPropagation(); seekRelative(-10); });
  playerFwd10.addEventListener('click', e => { e.stopPropagation(); seekRelative(10); });
  playerListBtn.addEventListener('click', e => { e.stopPropagation(); playerSongList.classList.toggle('hidden'); });

  playerVol.addEventListener('input', e => {
    e.stopPropagation();
    galaxyAudio.volume = e.target.value;
    const pct = e.target.value * 100;
    e.target.style.background = `linear-gradient(90deg,#FF6B81 ${pct}%,rgba(255,182,193,0.2) ${pct}%)`;
  });

  playerProgressTrack.addEventListener('click', e => {
    if (!galaxyAudio.duration) return;
    const r = playerProgressTrack.getBoundingClientRect();
    galaxyAudio.currentTime = ((e.clientX - r.left) / r.width) * galaxyAudio.duration;
  });

  galaxyAudio.addEventListener('timeupdate', updatePlayerProgress);
  galaxyAudio.addEventListener('play',  () => { isPlaying = true;  playerPlay.textContent='⏸'; playerDisc.classList.add('playing'); });
  galaxyAudio.addEventListener('pause', () => { isPlaying = false; playerPlay.textContent='▶'; playerDisc.classList.remove('playing'); });
  galaxyAudio.addEventListener('ended', () => {
    // ¿Era la última canción de la playlist?
    if (currentSongIdx >= CONFIG.canciones.length - 1) {
      showEndPlaylistMessage();
      changeSong(1); // reinicia desde la primera de todas formas
    } else {
      changeSong(1);
    }
  });

  buildSongList();
}

function buildSongList() {
  playerSongList.innerHTML = '';
  CONFIG.canciones.forEach((song, i) => {
    const item = document.createElement('div');
    item.className = 'player-song-item' + (i === currentSongIdx ? ' active' : '');
    item.innerHTML = `<span class="num">${i+1}.</span><span>${song.nombre}</span>`;
    item.addEventListener('click', e => {
      e.stopPropagation();
      loadSong(i, true);
      playerSongList.classList.add('hidden');
    });
    playerSongList.appendChild(item);
  });
}

function initPlayerWithFirstSong() {
  if (!CONFIG.canciones.length) return;
  loadSong(0, false);
  const tryPlay = () => {
    galaxyAudio.play().catch(() => {});
    document.removeEventListener('click', tryPlay);
    document.removeEventListener('touchstart', tryPlay);
  };
  document.addEventListener('click', tryPlay, {once:true});
  document.addEventListener('touchstart', tryPlay, {once:true, passive:true});
  setTimeout(() => galaxyAudio.play().catch(() => {}), 500);
}

function loadSong(idx, autoplay) {
  currentSongIdx = ((idx % CONFIG.canciones.length) + CONFIG.canciones.length) % CONFIG.canciones.length;
  const song = CONFIG.canciones[currentSongIdx];
  galaxyAudio.src = `assets/music/${song.archivo}`;
  playerSongName.textContent = song.nombre;
  if (autoplay) galaxyAudio.play().catch(() => {});
  buildSongList();
}

function togglePlay() {
  if (isPlaying) galaxyAudio.pause();
  else galaxyAudio.play().catch(() => {});
}
function changeSong(dir) { loadSong(currentSongIdx + dir, true); }
function seekRelative(sec) {
  if (!galaxyAudio.duration) return;
  galaxyAudio.currentTime = Math.max(0, Math.min(galaxyAudio.duration, galaxyAudio.currentTime + sec));
}
function updatePlayerProgress() {
  if (!galaxyAudio.duration) return;
  const pct = galaxyAudio.currentTime / galaxyAudio.duration * 100;
  playerProgressFill.style.width = pct + '%';
  playerProgressThumb.style.left = pct + '%';
  playerCurTime.textContent = fmtTime(galaxyAudio.currentTime);
  playerTotalTime.textContent = fmtTime(galaxyAudio.duration);
}
function fmtTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s/60), ss = Math.floor(s%60);
  return m + ':' + (ss<10?'0':'') + ss;
}
function togglePlayerPanel() {
  playerMinimized = !playerMinimized;
  playerPanel.classList.toggle('minimized', playerMinimized);
}

function showEndPlaylistMessage() {
  endPlaylistText.textContent = CONFIG.mensajeFinPlaylist;
  endPlaylistModal.classList.remove('hidden');
  spawnClickParticles(window.innerWidth/2, window.innerHeight/2, 20);
}

// ════════════════════════════════════════════
// NOTIFICACIÓN GLOBAL (utilidad)
// ════════════════════════════════════════════
let notifTimer = null;
function showNotif(msg) {
  if (!globalNotif) return;
  globalNotif.textContent = msg;
  globalNotif.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => globalNotif.classList.remove('show'), 3500);
}
