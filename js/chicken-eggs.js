// Save the Chicken Eggs — port JS do jogo pygame (dbtorrico/save-the-chicken-eggs).
// A lógica espelha os módulos puros do original (types/physics/collision/input/rules).
// O render é uma camada nova (estilo cartoon). API: { init(canvasId, onScore), stop() }.
const ChickenEggs = (function () {
  'use strict';

  // ===== Constantes (espelha constants.py GameConstants) =====
  const C = {
    worldWidth: 1420,
    worldHeight: 500,
    waterSurfaceY: 444,
    gravity: 980,
    eggRadius: 18,
    pillowWidth: 176,
    pillowHeight: 42,
    pillowY: 388,
    pillowMargin: 8,
    pillowKeyboardSpeed: 520,
    pillowMouseMoveEpsilon: 1.0,
    pillowVelocityToEggVx: 0.58,
    eggRestitution: 1.0,
    wallRestitution: 1.0,
    eggSpawnX: 74,
    eggSpawnY: 112,
    eggLaunchInterval: 0.2,
    eggInitialVx: 138,
    eggInitialVy: 88,
    physicsSubsteps: 4,
    portalStripWidth: 108,
    maxLevel: 10
  };

  const STATUS = {
    WAITING_START: 'WAITING_START',
    PLAYING: 'PLAYING',
    WON: 'WON',
    LOST: 'LOST'
  };

  const HIGH_SCORE_KEY = 'stc-eggs-highscore';

  // ===== Física (physics.py) =====
  function stepEgg(egg, gravity, dt) {
    const vy = egg.vy + gravity * dt;
    return { x: egg.x + egg.vx * dt, y: egg.y + vy * dt, vx: egg.vx, vy: vy, uid: egg.uid };
  }

  function resolveCeilingBounce(egg, radius, restitution) {
    const top = egg.y - radius;
    if (top >= 0) return egg;
    const penetration = -top;
    const y = egg.y + penetration;
    const vy = egg.vy < 0 ? -egg.vy * restitution : egg.vy;
    return { x: egg.x, y: y, vx: egg.vx, vy: vy, uid: egg.uid };
  }

  function resolveLeftWallBounce(egg, radius, restitution) {
    const left = egg.x - radius;
    if (left >= 0) return egg;
    const penetration = -left;
    const x = egg.x + penetration;
    const vx = egg.vx < 0 ? -egg.vx * restitution : egg.vx;
    return { x: x, y: egg.y, vx: vx, vy: egg.vy, uid: egg.uid };
  }

  // ===== Colisão (collision.py) =====
  function pillowAabb(pillow) {
    const hw = C.pillowWidth * 0.5;
    const hh = C.pillowHeight * 0.5;
    return {
      left: pillow.centerX - hw,
      top: C.pillowY - hh,
      right: pillow.centerX + hw,
      bottom: C.pillowY + hh
    };
  }

  function reflectVelocity(vx, vy, nx, ny, restitution) {
    const vn = vx * nx + vy * ny;
    if (vn >= 0) return [vx, vy];
    return [vx - (1 + restitution) * vn * nx, vy - (1 + restitution) * vn * ny];
  }

  function clampVal(value, lo, hi) {
    return value < lo ? lo : value > hi ? hi : value;
  }

  function circleAabb(cx, cy, radius, left, top, right, bottom) {
    const closestX = clampVal(cx, left, right);
    const closestY = clampVal(cy, top, bottom);
    const dx = cx - closestX;
    const dy = cy - closestY;
    const distSq = dx * dx + dy * dy;
    if (distSq > radius * radius) return null;
    if (distSq > 1e-12) {
      const dist = Math.sqrt(distSq);
      return [dx / dist, dy / dist, radius - dist];
    }
    // centro dentro do AABB: empurra pela face mais próxima
    const dl = cx - left;
    const dr = right - cx;
    const dtp = cy - top;
    const db = bottom - cy;
    const m = Math.min(dl, dr, dtp, db);
    if (m === dl) return [-1, 0, dl + radius];
    if (m === dr) return [1, 0, dr + radius];
    if (m === dtp) return [0, -1, dtp + radius];
    return [0, 1, db + radius];
  }

  function resolvePillowCollision(egg, pillow, pillowVx) {
    const box = pillowAabb(pillow);
    const hit = circleAabb(egg.x, egg.y, C.eggRadius, box.left, box.top, box.right, box.bottom);
    if (hit === null) return [egg, false];
    const nx = hit[0], ny = hit[1], penetration = hit[2];
    const eps = 0.5;
    const newX = egg.x + nx * (penetration + eps);
    const newY = egg.y + ny * (penetration + eps);
    let [nvx, nvy] = reflectVelocity(egg.vx, egg.vy, nx, ny, C.eggRestitution);
    nvx += pillowVx * C.pillowVelocityToEggVx;
    return [{ x: newX, y: newY, vx: nvx, vy: nvy, uid: egg.uid }, true];
  }

  // ===== Input (input_model.py) =====
  function clampPillowCenterX(cx, half, w, margin) {
    const lo = half + margin;
    const hi = w - half - margin;
    if (hi < lo) return w / 2;
    return Math.max(lo, Math.min(hi, cx));
  }

  function pillowFromMouse(mouseX, half, w, margin) {
    return clampPillowCenterX(mouseX, half, w, margin);
  }

  function pillowFromKeyboard(prev, half, w, margin, keyLeft, keyRight, speed, dt) {
    let dx = 0;
    if (keyLeft) dx -= speed * dt;
    if (keyRight) dx += speed * dt;
    return clampPillowCenterX(prev + dx, half, w, margin);
  }

  // ===== Regras (rules.py) =====
  let eggUidSeq = 1;

  function spawnEgg() {
    return {
      x: C.eggSpawnX,
      y: C.eggSpawnY,
      vx: C.eggInitialVx,
      vy: C.eggInitialVy,
      uid: eggUidSeq++
    };
  }

  function playingLevelState(pillow, level, sessionScore) {
    const pending = Math.max(0, level - 1);
    const timer = pending > 0 ? C.eggLaunchInterval : 0;
    return {
      eggs: [spawnEgg()],
      pillow: pillow,
      hasBounced: false,
      status: STATUS.PLAYING,
      level: level,
      eggsRemainingToLaunch: pending,
      launchTimer: timer,
      sessionScore: sessionScore,
      eggHitPillow: [false]
    };
  }

  function portalZoneBounds() {
    return { left: C.worldWidth - C.portalStripWidth, top: 0, right: C.worldWidth, bottom: C.worldHeight };
  }

  function eggInPortal(egg) {
    const b = portalZoneBounds();
    return b.left <= egg.x && egg.x <= b.right && b.top <= egg.y && egg.y <= b.bottom;
  }

  function eggExitedRight(egg) {
    return egg.x - C.eggRadius >= C.worldWidth;
  }

  function eggCountsAsScored(egg) {
    return eggInPortal(egg) || eggExitedRight(egg);
  }

  function eggTouchingWater(egg) {
    return egg.y + C.eggRadius >= C.waterSurfaceY;
  }

  function waitingStartState() {
    return {
      eggs: [],
      pillow: { centerX: C.worldWidth * 0.5 },
      hasBounced: false,
      status: STATUS.WAITING_START,
      level: 1,
      eggsRemainingToLaunch: 0,
      launchTimer: 0,
      sessionScore: 0,
      eggHitPillow: []
    };
  }

  function initialState() {
    return {
      eggs: [spawnEgg()],
      pillow: { centerX: C.worldWidth * 0.5 },
      hasBounced: false,
      status: STATUS.PLAYING,
      level: 1,
      eggsRemainingToLaunch: 0,
      launchTimer: 0,
      sessionScore: 0,
      eggHitPillow: [false]
    };
  }

  function pillowCenterXForFrame(prevCenterX, mouseX, keyLeft, keyRight, dt, mouseMoved) {
    const half = C.pillowWidth * 0.5;
    if (keyLeft || keyRight) {
      return pillowFromKeyboard(prevCenterX, half, C.worldWidth, C.pillowMargin, keyLeft, keyRight, C.pillowKeyboardSpeed, dt);
    }
    if (mouseMoved) {
      return pillowFromMouse(mouseX, half, C.worldWidth, C.pillowMargin);
    }
    return prevCenterX;
  }

  function dequeueEggSpawnsAfterStep(eggs, pending, timer, dt) {
    timer -= dt;
    while (pending > 0 && timer <= 0) {
      eggs.push(spawnEgg());
      pending -= 1;
      timer = pending > 0 ? timer + C.eggLaunchInterval : 0;
    }
    return [eggs, pending, timer];
  }

  function advanceState(state, mouseX, dt, opts) {
    opts = opts || {};
    const applyPillowMomentum = !!opts.applyPillowMomentum;
    const keyLeft = !!opts.keyLeft;
    const keyRight = !!opts.keyRight;
    const mouseMoved = opts.mouseMoved !== false;

    if (state.status === STATUS.WAITING_START) {
      const px = pillowCenterXForFrame(state.pillow.centerX, mouseX, keyLeft, keyRight, dt, mouseMoved);
      return Object.assign({}, state, {
        pillow: { centerX: px },
        hasBounced: false,
        eggHitPillow: state.eggs.map(function () { return false; })
      });
    }
    if (state.status !== STATUS.PLAYING) {
      return Object.assign({}, state, { eggHitPillow: state.eggs.map(function () { return false; }) });
    }
    if (state.eggs.length === 0 && state.eggsRemainingToLaunch === 0) {
      return Object.assign({}, state, { eggHitPillow: [] });
    }

    const prevPillowX = state.pillow.centerX;
    const px = pillowCenterXForFrame(prevPillowX, mouseX, keyLeft, keyRight, dt, mouseMoved);
    const rawPillowVx = dt > 1e-9 ? (px - prevPillowX) / dt : 0;
    const pillowVx = applyPillowMomentum ? rawPillowVx : 0;
    const pillow = { centerX: px };

    let eggs = state.eggs.slice();
    let pending = state.eggsRemainingToLaunch;
    let launchTimer = state.launchTimer;
    let hasBounced = state.hasBounced;
    let sessionScore = state.sessionScore;
    const eggHitPillow = eggs.map(function () { return false; });

    const sub = Math.max(1, C.physicsSubsteps);
    const subDt = dt / sub;
    for (let k = 0; k < sub; k++) {
      const frac = (k + 1) / sub;
      const subPillow = { centerX: prevPillowX + (px - prevPillowX) * frac };
      const nextEggs = [];
      for (let idx = 0; idx < eggs.length; idx++) {
        let e = stepEgg(eggs[idx], C.gravity, subDt);
        e = resolveCeilingBounce(e, C.eggRadius, C.wallRestitution);
        e = resolveLeftWallBounce(e, C.eggRadius, C.wallRestitution);
        const res = resolvePillowCollision(e, subPillow, pillowVx);
        e = res[0];
        if (res[1]) {
          hasBounced = true;
          eggHitPillow[idx] = true;
        }
        nextEggs.push(e);
      }
      eggs = nextEggs;
    }

    // água = perdeu
    for (let i = 0; i < eggs.length; i++) {
      if (eggTouchingWater(eggs[i])) {
        return {
          eggs: [], pillow: pillow, hasBounced: hasBounced, eggHitPillow: [],
          status: STATUS.LOST, level: state.level,
          eggsRemainingToLaunch: 0, launchTimer: 0, sessionScore: sessionScore
        };
      }
    }

    // pontuação: portal ou saiu pela direita
    const still = [];
    const stillHits = [];
    let scoredThisFrame = 0;
    for (let i = 0; i < eggs.length; i++) {
      if (eggCountsAsScored(eggs[i])) {
        scoredThisFrame += 1;
        continue;
      }
      still.push(eggs[i]);
      stillHits.push(eggHitPillow[i]);
    }
    sessionScore += scoredThisFrame;

    if (still.length === 0) {
      const nextLevel = state.level + 1;
      if (nextLevel <= C.maxLevel) {
        return playingLevelState(pillow, nextLevel, sessionScore);
      }
      return {
        eggs: [], pillow: pillow, hasBounced: hasBounced, eggHitPillow: [],
        status: STATUS.WON, level: state.level,
        eggsRemainingToLaunch: 0, launchTimer: 0, sessionScore: sessionScore
      };
    }

    const lenBefore = still.length;
    const dq = dequeueEggSpawnsAfterStep(still, pending, launchTimer, dt);
    pending = dq[1];
    launchTimer = dq[2];
    for (let i = 0; i < dq[0].length - lenBefore; i++) stillHits.push(false);

    return {
      eggs: dq[0], pillow: pillow, hasBounced: hasBounced, eggHitPillow: stillHits,
      status: STATUS.PLAYING, level: state.level,
      eggsRemainingToLaunch: pending, launchTimer: launchTimer, sessionScore: sessionScore
    };
  }

  // ===== Runtime (loop + input + render) =====
  let canvas, ctx, onScoreUpdate;
  let state, pillowCenterX, lastMouseX, mouseX;
  let keyLeft, keyRight;
  let eggSquash; // Map uid -> { s, v }
  let rafId, lastTs, highScore, winTimer, lastReportedScore;
  let running = false;

  function loadHighScore() {
    try {
      const v = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
      return isNaN(v) ? 0 : Math.max(0, v);
    } catch (e) { return 0; }
  }

  function saveHighScore(v) {
    try { localStorage.setItem(HIGH_SCORE_KEY, String(Math.max(0, v | 0))); } catch (e) {}
  }

  function init(canvasId, scoreCallback) {
    canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;
    ctx = canvas.getContext('2d');
    canvas.width = C.worldWidth;
    canvas.height = C.worldHeight;
    onScoreUpdate = scoreCallback || function () {};

    // esconde o overlay HTML compartilhado — este jogo desenha telas no canvas
    const htmlOverlay = document.getElementById('game-overlay');
    if (htmlOverlay) htmlOverlay.classList.add('hidden');

    state = waitingStartState();
    pillowCenterX = state.pillow.centerX;
    lastMouseX = null;
    mouseX = pillowCenterX;
    keyLeft = false;
    keyRight = false;
    eggSquash = {};
    highScore = loadHighScore();
    winTimer = 0;
    lastReportedScore = -1;

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (canvas) {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    }
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) {
      mouseX = (e.clientX - rect.left) * (C.worldWidth / rect.width);
    }
  }

  function startOrRestart() {
    state = initialState();
    pillowCenterX = state.pillow.centerX;
    eggSquash = {};
    winTimer = 0;
  }

  function onClick() {
    if (state.status !== STATUS.PLAYING) startOrRestart();
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowLeft') { keyLeft = true; e.preventDefault(); }
    else if (e.key === 'ArrowRight') { keyRight = true; e.preventDefault(); }
    else if (e.key === 'Enter' || e.key === ' ') {
      if (state.status !== STATUS.PLAYING) { startOrRestart(); e.preventDefault(); }
    } else if (e.key === 'r' || e.key === 'R') {
      startOrRestart();
    }
  }

  function onKeyUp(e) {
    if (e.key === 'ArrowLeft') keyLeft = false;
    else if (e.key === 'ArrowRight') keyRight = false;
  }

  function updateSquash(dt) {
    const alive = {};
    state.eggs.forEach(function (egg) { alive[egg.uid] = true; });
    Object.keys(eggSquash).forEach(function (uid) {
      if (!alive[uid]) delete eggSquash[uid];
    });
    const hits = state.eggHitPillow || [];
    state.eggs.forEach(function (egg, i) {
      if (!eggSquash[egg.uid]) eggSquash[egg.uid] = { s: 1, v: 0 };
      const sq = eggSquash[egg.uid];
      if (i < hits.length && hits[i]) sq.v = -0.32;
      sq.v += (1 - sq.s) * 16 * dt;
      sq.s += sq.v;
      if (sq.s < 0.66) sq.s = 0.66;
      if (sq.s > 1) { sq.s = 1; sq.v = 0; }
    });
  }

  function loop(ts) {
    if (!running) return;
    if (!lastTs) lastTs = ts;
    let dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (dt > 1 / 30) dt = 1 / 30; // clamp anti-tunneling

    // mouse_moved (replica lógica do original)
    let mouseMoved = lastMouseX === null || Math.abs(mouseX - lastMouseX) > C.pillowMouseMoveEpsilon;

    if (state.status === STATUS.WON) {
      winTimer -= dt;
      if (winTimer <= 0) startOrRestart();
    } else {
      const prevStatus = state.status;
      state = advanceState(state, mouseX, dt, { keyLeft: keyLeft, keyRight: keyRight, mouseMoved: mouseMoved });
      pillowCenterX = state.pillow.centerX;
      if (state.status === STATUS.WON && prevStatus === STATUS.PLAYING) winTimer = 4.0;
      if (state.status === STATUS.LOST) {
        // mantém a almofada onde estava; recomeça na fase 1
        const keepPillow = state.pillow;
        state = initialState();
        state.pillow = keepPillow;
        pillowCenterX = keepPillow.centerX;
        eggSquash = {};
      }
    }

    lastMouseX = mouseX;

    if (state.sessionScore > highScore) {
      highScore = state.sessionScore;
      saveHighScore(highScore);
    }
    if (state.sessionScore !== lastReportedScore) {
      lastReportedScore = state.sessionScore;
      onScoreUpdate(state.sessionScore);
    }

    updateSquash(dt);
    render(ts / 1000);

    rafId = requestAnimationFrame(loop);
  }

  // ===== Render cartoon =====
  const FONT = "'Baloo 2', 'Comic Sans MS', 'Segoe UI', Arial, sans-serif";

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function hsv(h, s, v) {
    h = ((h % 360) + 360) % 360 / 60;
    const i = Math.floor(h), f = h - i;
    const p = v * (1 - s), q = v * (1 - s * f), tt = v * (1 - s * (1 - f));
    let r, g, b;
    if (i % 6 === 0) { r = v; g = tt; b = p; }
    else if (i === 1) { r = q; g = v; b = p; }
    else if (i === 2) { r = p; g = v; b = tt; }
    else if (i === 3) { r = p; g = q; b = v; }
    else if (i === 4) { r = tt; g = p; b = v; }
    else { r = v; g = p; b = q; }
    return 'rgb(' + (r * 255 | 0) + ',' + (g * 255 | 0) + ',' + (b * 255 | 0) + ')';
  }

  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, C.waterSurfaceY);
    g.addColorStop(0, '#5fc3ff');
    g.addColorStop(1, '#c8efff');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, C.worldWidth, C.waterSurfaceY);
  }

  function drawCloud(cx, cy, t, scale) {
    const bob = Math.sin(t * 1.2 + cx * 0.01) * 5;
    const blobs = [[-34, 4, 26], [0, -8, 34], [30, 2, 28], [60, 6, 22]];
    ctx.fillStyle = '#ffffff';
    blobs.forEach(function (b) {
      ctx.beginPath();
      ctx.arc(cx + b[0] * scale, cy + (b[1] + bob) * scale, b[2] * scale, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawWater(t) {
    const top = C.waterSurfaceY;
    const g = ctx.createLinearGradient(0, top, 0, C.worldHeight);
    g.addColorStop(0, '#39b6e8');
    g.addColorStop(1, '#1f7fb8');
    ctx.fillStyle = g;
    ctx.fillRect(0, top, C.worldWidth, C.worldHeight - top);
    // ondinha
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let x = 0; x <= C.worldWidth; x += 14) {
      const y = top + 4 + Math.sin(x * 0.045 + t * 3) * 5;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  function drawCoop(t) {
    // morrinho
    const shoreY = C.waterSurfaceY;
    ctx.fillStyle = '#8a5a32';
    ctx.beginPath();
    ctx.moveTo(0, shoreY);
    ctx.lineTo(300, shoreY);
    ctx.lineTo(250, 150);
    ctx.lineTo(0, 165);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#62c24a';
    ctx.beginPath();
    ctx.moveTo(0, shoreY - 6);
    ctx.lineTo(300, shoreY - 6);
    ctx.lineTo(250, 132);
    ctx.lineTo(0, 148);
    ctx.closePath();
    ctx.fill();

    // galinha cartoon
    const bob = Math.sin(t * 3) * 4;
    const cx = 120, cy = 250 + bob;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(120,80,40,0.35)';
    // corpo
    ctx.fillStyle = '#f6d860';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 60, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    // cabeça
    ctx.beginPath();
    ctx.arc(cx + 40, cy - 42, 30, 0, Math.PI * 2);
    ctx.fill();
    // crista
    ctx.fillStyle = '#e94f4f';
    [[-10, -28], [4, -36], [18, -28]].forEach(function (p) {
      ctx.beginPath();
      ctx.arc(cx + 40 + p[0], cy - 42 + p[1], 11, 0, Math.PI * 2);
      ctx.fill();
    });
    // bico
    ctx.fillStyle = '#f4922e';
    ctx.beginPath();
    ctx.moveTo(cx + 68, cy - 44);
    ctx.lineTo(cx + 92, cy - 38);
    ctx.lineTo(cx + 66, cy - 30);
    ctx.closePath();
    ctx.fill();
    // olho
    ctx.fillStyle = '#2a2a33';
    ctx.beginPath();
    ctx.arc(cx + 50, cy - 48, 4.5, 0, Math.PI * 2);
    ctx.fill();
    // asa batendo
    const flap = Math.sin(t * 6) * 10;
    ctx.fillStyle = '#eac84a';
    ctx.beginPath();
    ctx.ellipse(cx - 8, cy + 2 + flap * 0.2, 26, 18, flap * 0.02, 0, Math.PI * 2);
    ctx.fill();
    // patinhas
    ctx.strokeStyle = '#d98b2b';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx - 12, cy + 48); ctx.lineTo(cx - 14, cy + 64); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 12, cy + 48); ctx.lineTo(cx + 14, cy + 64); ctx.stroke();
  }

  function drawPortal(t) {
    const b = portalZoneBounds();
    const w = C.portalStripWidth, x0 = b.left;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, 0, w, C.worldHeight);
    ctx.clip();
    // fundo
    ctx.fillStyle = '#1a1038';
    ctx.fillRect(x0, 0, w, C.worldHeight);
    // espiral
    const cx = x0 + w * 0.5, cy = C.worldHeight * 0.5;
    const spin = t * 2.2;
    for (let arm = 0; arm < 3; arm++) {
      const phase = arm * (Math.PI * 2 / 3);
      let prev = null;
      ctx.lineWidth = 3;
      for (let i = 1; i < 220; i++) {
        const theta = spin + phase + i * 0.13;
        const r = Math.min(0.85 * theta * 0.11 * 14, Math.max(w, C.worldHeight) * 0.62);
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        const hue = (i * 2.2 + arm * 40 + t * 90) % 360;
        if (prev) {
          ctx.strokeStyle = hsv(hue, 0.85, 0.98);
          ctx.beginPath();
          ctx.moveTo(prev[0], prev[1]);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        prev = [x, y];
      }
    }
    ctx.restore();
    // moldura
    ctx.strokeStyle = '#a98bff';
    ctx.lineWidth = 4;
    ctx.strokeRect(x0 + 2, 2, w - 4, C.worldHeight - 4);
  }

  function drawPillow(t) {
    const box = pillowAabb(state.pillow);
    const x = box.left, y = box.top, w = C.pillowWidth, h = C.pillowHeight;
    // sombra
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    roundRect(x, y + 6, w, h, 16); ctx.fill();
    // base
    ctx.fillStyle = '#ff6f91';
    roundRect(x, y, w, h, 16); ctx.fill();
    // listras
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < w; i += 30) {
      roundRect(x + i + 6, y + 6, 14, h - 12, 6); ctx.fill();
    }
    // contorno
    ctx.strokeStyle = '#c84b6e';
    ctx.lineWidth = 4;
    roundRect(x, y, w, h, 16); ctx.stroke();
  }

  function drawEgg(egg, hueShift) {
    const sq = (eggSquash[egg.uid] || { s: 1 }).s;
    ctx.save();
    ctx.translate(egg.x, egg.y);
    ctx.scale(1 / sq, sq);
    const r = C.eggRadius;
    // corpo (formato de ovo)
    ctx.fillStyle = '#fff7e0';
    ctx.strokeStyle = hsv(40 + hueShift * 12, 0.5, 0.7);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 2, r * 0.82, r * 1.02, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // brilho
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.28, -r * 0.4, r * 0.22, r * 0.32, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // rostinho
    ctx.fillStyle = '#3a3340';
    ctx.beginPath(); ctx.arc(-r * 0.28, 2, 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.28, 2, 2.4, 0, Math.PI * 2); ctx.fill();
    // blush
    ctx.fillStyle = 'rgba(255,140,160,0.6)';
    ctx.beginPath(); ctx.arc(-r * 0.42, r * 0.34, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.42, r * 0.34, 3.2, 0, Math.PI * 2); ctx.fill();
    // sorriso
    ctx.strokeStyle = '#3a3340';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, r * 0.22, r * 0.22, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  function drawHud() {
    if (state.status === STATUS.PLAYING) {
      // score central grande
      ctx.textAlign = 'center';
      ctx.font = '800 64px ' + FONT;
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#7a3b12';
      ctx.fillStyle = '#ffe14a';
      const sx = C.worldWidth * 0.5, sy = C.worldHeight * 0.2;
      ctx.strokeText(String(state.sessionScore), sx, sy);
      ctx.fillText(String(state.sessionScore), sx, sy);
      // fase (canto esquerdo)
      ctx.textAlign = 'left';
      ctx.font = '700 26px ' + FONT;
      ctx.fillStyle = '#2a3340';
      ctx.fillText('Fase ' + state.level + '/' + C.maxLevel, 320, 40);
      // recorde (canto direito, antes do portal)
      ctx.textAlign = 'right';
      ctx.fillText('Recorde: ' + highScore, C.worldWidth - C.portalStripWidth - 16, 40);
    }
  }

  function drawOverlay(title, msg, sub) {
    ctx.fillStyle = 'rgba(20,16,48,0.55)';
    ctx.fillRect(0, 0, C.worldWidth, C.worldHeight);
    ctx.textAlign = 'center';
    const cx = C.worldWidth * 0.5, cy = C.worldHeight * 0.42;
    ctx.font = '800 76px ' + FONT;
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#3a1d6e';
    ctx.fillStyle = '#ffe14a';
    ctx.strokeText(title, cx, cy);
    ctx.fillText(title, cx, cy);
    ctx.font = '600 34px ' + FONT;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(msg, cx, cy + 56);
    if (sub) {
      ctx.font = '500 24px ' + FONT;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(sub, cx, cy + 96);
    }
  }

  function render(t) {
    drawSky();
    drawCloud(C.worldWidth * 0.30, 80, t, 1.0);
    drawCloud(C.worldWidth * 0.55, 120, t + 1.7, 0.8);
    drawCloud(C.worldWidth * 0.78, 70, t + 0.5, 0.7);
    drawWater(t);
    drawCoop(t);
    drawPortal(t);
    drawPillow(t);
    state.eggs.forEach(function (egg, i) { drawEgg(egg, i); });
    drawHud();

    if (state.status === STATUS.WAITING_START) {
      drawOverlay('SAVE THE CHICKEN EGGS', 'Clique ou ENTER para começar',
        'Mova a almofada com o mouse ou as setas ← →');
    } else if (state.status === STATUS.WON) {
      drawOverlay('VOCÊ ZEROU! 🥚', 'Pontos: ' + state.sessionScore + '  •  Recorde: ' + highScore,
        'Recomeçando…');
    }
  }

  return { init: init, stop: stop };
})();
