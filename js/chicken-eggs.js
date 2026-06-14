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

  // ===== Render (placeholder funcional — refinado p/ cartoon no T3) =====
  function render(t) {
    // céu
    ctx.fillStyle = '#8ed0ff';
    ctx.fillRect(0, 0, C.worldWidth, C.worldHeight);

    // água (perigo)
    ctx.fillStyle = '#2e86c1';
    ctx.fillRect(0, C.waterSurfaceY, C.worldWidth, C.worldHeight - C.waterSurfaceY);

    // portal (faixa direita)
    const b = portalZoneBounds();
    ctx.fillStyle = '#5b2a86';
    ctx.fillRect(b.left, 0, C.portalStripWidth, C.worldHeight);

    // almofada
    const box = pillowAabb(state.pillow);
    ctx.fillStyle = '#ff6f91';
    ctx.fillRect(box.left, box.top, C.pillowWidth, C.pillowHeight);

    // ovos
    state.eggs.forEach(function (egg) {
      const sq = (eggSquash[egg.uid] || { s: 1 }).s;
      ctx.save();
      ctx.translate(egg.x, egg.y);
      ctx.scale(1 / sq, sq);
      ctx.fillStyle = '#fff6da';
      ctx.beginPath();
      ctx.ellipse(0, 0, C.eggRadius * 0.85, C.eggRadius, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // HUD score central
    ctx.fillStyle = '#ffe448';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    if (state.status !== STATUS.WAITING_START) {
      ctx.fillText(String(state.sessionScore), C.worldWidth * 0.5, C.worldHeight * 0.22);
    }

    // overlays simples
    if (state.status === STATUS.WAITING_START) {
      drawOverlayText('SAVE THE CHICKEN EGGS', 'Clique ou ENTER para começar');
    } else if (state.status === STATUS.WON) {
      drawOverlayText('VOCÊ ZEROU!', 'Pontos: ' + state.sessionScore);
    }
  }

  function drawOverlayText(title, msg) {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, C.worldWidth, C.worldHeight);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 64px Arial';
    ctx.fillText(title, C.worldWidth * 0.5, C.worldHeight * 0.45);
    ctx.font = '32px Arial';
    ctx.fillText(msg, C.worldWidth * 0.5, C.worldHeight * 0.45 + 56);
  }

  // _step: executa a lógica de um frame sem rAF/render (uso em testes headless).
  function testStep(dt, mx, opts) {
    opts = opts || { mouseMoved: true };
    mouseX = mx;
    if (state.status === STATUS.WON) {
      winTimer -= dt;
      if (winTimer <= 0) startOrRestart();
    } else {
      const prev = state.status;
      state = advanceState(state, mouseX, dt, opts);
      pillowCenterX = state.pillow.centerX;
      if (state.status === STATUS.WON && prev === STATUS.PLAYING) winTimer = 4.0;
      if (state.status === STATUS.LOST) {
        const kp = state.pillow;
        state = initialState();
        state.pillow = kp;
        pillowCenterX = kp.centerX;
        eggSquash = {};
      }
    }
    return debugState();
  }

  function debugState() {
    return {
      status: state.status,
      score: state.sessionScore,
      level: state.level,
      eggs: state.eggs.map(function (e) { return { x: e.x, y: e.y, vx: e.vx, vy: e.vy }; }),
      pillow: state.pillow.centerX
    };
  }

  return { init: init, stop: stop, _debug: debugState, _step: testStep };
})();
