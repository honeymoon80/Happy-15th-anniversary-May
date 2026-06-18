/* =============================================
   SCRIPT.JS — Galaxia de Corazones para May
   Three.js + Canvas 2D híbrido
   ============================================= */
'use strict';

// ════════════════════════════════════════════
// ESTADO GLOBAL
// ════════════════════════════════════════════
let loadProgress = 0;
let loadAccelerated = false;
let loadInterval = null;
let loadStartTime = null;

let scene, camera, renderer, heartGroup, heartParticlesMesh;
let heartGeometry, heartMaterial;
let basePositions = null;
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

// DOM refs
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
let endPlaylistModal, endPlaylistBackdrop, endPlaylistClose, endPlaylistText;
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

  endPlaylistModal    = document.getElementById('endPlaylistModal');
  endPlaylistBackdrop = document.getElementById('endPlaylistBackdrop');
  endPlaylistClose    = document.getElementById('endPlaylistClose');
  endPlaylistText     = document.getElementById('endPlaylistText');

  globalNotif = document.getElementById('globalNotif');

  const titleEl = document.getElementById('openTitle');
  if (titleEl && CONFIG.tituloApertura) titleEl.textContent = CONFIG.tituloApertura;
  const subEl = document.querySelector('.open-subtitle');
  if (subEl && CONFIG.subtituloApertura) subEl.textContent = CONFIG.subtituloApertura;
}

function resizeAllCanvases() {
  [starsFallCanvas, clickFxCanvas].forEach(c => {
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
// FASE 1B — PANTALLA DE CARGA
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
  const elapsed = performance.now() - loadStartTime;
  const durationMs = CONFIG.duracionCarga * 1000;
  const already = elapsed / durationMs;
  loadStartTime = performance.now() - already * durationMs;
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

function drawLoadHeart(pct) {
  const ctx = loadHeartCanvas.getContext('2d');
  const w = loadHeartCanvas.width, h = loadHeartCanvas.height;
  ctx.clearRect(0, 0, w, h);
  const cx = w/2, cy = h/2;
  const scale = Math.min(w, h) / 280;
  const pulse = 1 + Math.sin(performance.now()/260) * 0.04;
  const total = 360;
  const fillCount = Math.round(total * (pct/100));

  for (let i = 0; i < total; i++) {
    const t = (i / total) * Math.PI * 2;
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
  const duration = 1000;

  initGalaxyScene();
  galaxyScreen.classList.remove('hidden');
  galaxyScreen.style.opacity = '0';

  function loop(now) {
    const t = (now - start) / duration;
    ctx.clearRect(0,0,birthCanvas.width, birthCanvas.height);
    ctx.fillStyle = `rgba(20,6,15,${1 - t})`;
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

    galaxyScreen.style.opacity = Math.min(1, t*1.3).toFixed(3);

    if (t < 1) {
      requestAnimationFrame(loop);
    } else {
      birthCanvas.classList.add('hidden');
      galaxyScreen.style.opacity = '1';
      // ✅ INICIAR GALAXIA AQUÍ
      startGalaxyAnimation();
      initPlayerWithFirstSong();
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

  scene.add(buildBackgroundStars());

  heartGroup = new THREE.Group();
  scene.add(heartGroup);

  particleCount = CONFIG.cantidadParticulas;
  buildHeartParticles();

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

function heartShapePoint(u, v) {
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
    const v = 0.25 + Math.random() * 0.85;
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
  if (galaxyAnimRunning) return;
  console.log('🚀 Iniciando galaxia...');
  galaxyAnimRunning = true;
  buildOrbitElements();
  requestAnimationFrame(animateGalaxy);
}

function animateGalaxy(now) {
  if (!galaxyAnimRunning) return;

  heartPulseT += 0.018;
  const pulseScale = 1 + Math.sin(heartPulseT) * 0.04;
  heartGroup.scale.set(pulseScale, pulseScale, pulseScale);

  orbitAngleGlobal += CONFIG.velocidadOrbita;
  heartGroup.rotation.y = orbitAngleGlobal;

  heartColorT += 0.0015;
  applyHeartColorCycle(heartColorT);

  applyWindEffect();

  renderer.render(scene, camera);

  updateOrbitOverlayPositions();

  requestAnimationFrame(animateGalaxy);
}

function applyHeartColorCycle(t) {
  const colors = heartGeometry.attributes.color;
  const baseColors = CONFIG.colores.map(c => new THREE.Color(c));
  const shift = Math.sin(t) * 0.5 + 0.5;
  for (let i = 0; i < particleCount; i += 7) {
    const c1 = baseColors[i % baseColors.length];
    const c2 = baseColors[(i+1) % baseColors.length];
    const r = c1.r + (c2.r - c1.r) * shift;
    const g = c1.g + (c2.g - c1.g) * shift;
    const b = c1.b + (c2.b - c1.b) * shift;
    colors.array[i*3] = r; colors.array[i*3+1] = g; colors.array[i*3+2] = b;
  }
  colors.needsUpdate = true;
}

function applyWindEffect() {
  const positions = heartGeometry.attributes.position;
  const vector = new THREE.Vector3(mouseNDC.x, mouseNDC.y, 0.5);
  vector.unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));
  const localPos = heartGroup.worldToLocal(worldPos.clone());

  const windRadius = 38;
  for (let i = 0; i < particleCount; i += 3) {
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
// ELEMENTOS ORBITANTES
// ════════════════════════════════════════════
let orbitElements = [];

function buildOrbitElements() {
  orbitLayer.innerHTML = '';
  orbitElements = [];

  CONFIG.frases.forEach((frase, i) => {
    const el = document.createElement('div');
    el.className = 'orbit-phrase';
    el.textContent = frase;
    el.addEventListener('click', () => openPhraseModal(frase, CONFIG.mensajesLargos[frase] || frase, true));
    orbitLayer.appendChild(el);
    orbitElements.push({
      el, radius: 150 + (i%3)*26, speed: 0.18 + i*0.015,
      angle: (i / CONFIG.frases.length) * Math.PI * 2,
      depthAmp: 0.35, vertAmp: 30 + i*6, type:'phrase',
    });
  });

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

  CONFIG.imagenes.forEach((img, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'orbit-img-wrap';
    // ✅ RUTA CORRECTA PARA GITHUB PAGES
    wrap.innerHTML = `<img src="img/${img}" alt="recuerdo ${i+1}"
      onerror="this.parentElement.style.background='linear-gradient(135deg,#FFD1DC,#FFB6C1)';this.style.display='none'">`;
    orbitLayer.appendChild(wrap);
    orbitElements.push({
      el: wrap, radius: 260 + (i%2)*30, speed: 0.09 + i*0.01,
      angle: (i / CONFIG.imagenes.length) * Math.PI * 2 + 2.4,
      depthAmp: 0.5, vertAmp: 18 + i*4, type:'image',
    });
  });
}

function updateOrbitOverlayPositions() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const t = performance.now() / 1000;

  orbitElements.forEach(o => {
    o.angle += o.speed * 0.01;
    const x = Math.cos(o.angle) * o.radius;
    const zFactor = Math.sin(o.angle);
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
// INTERACCIONES
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
// PARTÍCULAS DE CLIC
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
// MODALES
// ════════════════════════════════════════════
function openPhraseModal(titulo, texto, isPhrase) {
  phraseTitle.textContent = titulo;
  phraseText.textContent = texto;
  phraseCard.style.borderColor = isPhrase ? 'rgba(255,182,193,0.7)' : 'rgba(255,255,255,0.8)';
  phraseModal.classList.remove('hidden');
  spawnClickParticles(window.innerWidth/2, window.innerHeight/3, 14);
}

function closePhraseModal() { phraseModal.classList.add('hidden'); }

function bindModals() {
  phraseClose.addEventListener('click', closePhraseModal);
  phraseBackdrop.addEventListener('click', closePhraseModal);
  endPlaylistClose.addEventListener('click', () => endPlaylistModal.classList.add('hidden'));
  endPlaylistBackdrop.addEventListener('click', () => endPlaylistModal.classList.add('hidden'));

  history.pushState({page:'home'}, '');
  window.addEventListener('popstate', () => {
    if (!phraseModal.classList.contains('hidden')) {
      closePhraseModal();
      history.pushState({page:'home'}, '');
    } else if (!endPlaylistModal.classList.contains('hidden')) {
      endPlaylistModal.classList.add('hidden');
      history.pushState({page:'home'}, '');
    }
  });
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
    if (currentSongIdx >= CONFIG.canciones.length - 1) {
      showEndPlaylistMessage();
      changeSong(1);
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
  // ✅ RUTA CORRECTA PARA GITHUB PAGES
  galaxyAudio.src = `music/${song.archivo}`;
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
// NOTIFICACIÓN GLOBAL
// ════════════════════════════════════════════
let notifTimer = null;

function showNotif(msg) {
  if (!globalNotif) return;
  globalNotif.textContent = msg;
  globalNotif.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => globalNotif.classList.remove('show'), 3500);
}

// ════════════════════════════════════════════
// ✅ GARANTIZAR QUE LA GALAXIA ARRANQUE EN GITHUB PAGES
// ════════════════════════════════════════════
function ensureGalaxyStarts() {
  if (galaxyAnimRunning) {
    console.log('✅ Galaxia ya está corriendo.');
    return;
  }
  if (typeof THREE !== 'undefined' && document.getElementById('galaxyCanvas')) {
    console.log('🚀 Iniciando galaxia desde ensureGalaxyStarts()...');
    startGalaxyAnimation();
  } else {
    console.log('⏳ Esperando recursos para la galaxia...');
    setTimeout(ensureGalaxyStarts, 300);
  }
}

// Iniciar cuando todo esté cargado
window.addEventListener('load', () => {
  setTimeout(ensureGalaxyStarts, 500);
});

// Fallback: si después de 6 segundos no empezó, forzar
setTimeout(() => {
  if (!galaxyAnimRunning) {
    console.log('🔄 Fallback: forzando inicio de galaxia...');
    startGalaxyAnimation();
  }
}, 6000);
