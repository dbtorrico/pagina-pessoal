const Snake = (function () {
  const CELL = 20;
  const COLS = 20;
  const ROWS = 20;
  const TICK = 150;

  let canvas, ctx, onScoreUpdate;
  let state = 'IDLE';
  let snake, dir, nextDir, food, score, intervalId;

  function init(canvasId, scoreCallback) {
    canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;
    ctx = canvas.getContext('2d');
    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;
    onScoreUpdate = scoreCallback || function () {};

    document.addEventListener('keydown', handleKey);
    state = 'IDLE';
    showOverlay('SNAKE', 'Pressione ENTER para iniciar', '');
    renderIdle();
  }

  function stop() {
    clearInterval(intervalId);
    document.removeEventListener('keydown', handleKey);
    state = 'IDLE';
  }

  function startGame() {
    clearInterval(intervalId);
    score = 0;
    onScoreUpdate(0);
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    spawnFood();
    hideOverlay();
    state = 'RUNNING';
    intervalId = setInterval(tick, TICK);
  }

  function tick() {
    // Aplicar direção pendente (evitar reverso)
    const d = nextDir;
    if (!(d.x === -dir.x && d.y === -dir.y)) {
      dir = d;
    }

    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Colisão com parede
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
      gameOver();
      return;
    }

    // Colisão com corpo (excluindo cauda que vai ser removida)
    if (snake.slice(0, snake.length - 1).some(function (s) {
      return s.x === head.x && s.y === head.y;
    })) {
      gameOver();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      onScoreUpdate(score);
      spawnFood();
      // não remove cauda — cobra cresce
    } else {
      snake.pop();
    }

    render();
  }

  function gameOver() {
    clearInterval(intervalId);
    state = 'GAME_OVER';
    showOverlay('GAME OVER', 'Pressione ENTER para reiniciar', 'SCORE: ' + String(score).padStart(4, '0'));
  }

  function spawnFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      };
    } while (snake.some(function (s) { return s.x === pos.x && s.y === pos.y; }));
    food = pos;
  }

  function render() {
    // Fundo
    ctx.fillStyle = '#050a05';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grade sutil
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(canvas.width, y * CELL);
      ctx.stroke();
    }

    // Corpo da cobra
    ctx.fillStyle = '#00FF41';
    snake.slice(1).forEach(function (s) {
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    });

    // Cabeça (mais clara)
    ctx.fillStyle = '#CCFFCC';
    ctx.fillRect(snake[0].x * CELL + 1, snake[0].y * CELL + 1, CELL - 2, CELL - 2);

    // Comida (com glow)
    ctx.shadowColor = '#00FF41';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#CCFFCC';
    ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
    ctx.shadowBlur = 0;
  }

  function renderIdle() {
    if (!ctx) return;
    ctx.fillStyle = '#050a05';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function showOverlay(title, message, scoreText) {
    var overlay = document.getElementById('game-overlay');
    var titleEl = document.getElementById('overlay-title');
    var msgEl = document.getElementById('overlay-message');
    var scoreEl = document.getElementById('overlay-score');
    if (!overlay) return;
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (scoreEl) scoreEl.textContent = scoreText;
    overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    var overlay = document.getElementById('game-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  function handleKey(e) {
    var map = {
      'ArrowUp':    { x: 0, y: -1 },
      'ArrowDown':  { x: 0, y: 1 },
      'ArrowLeft':  { x: -1, y: 0 },
      'ArrowRight': { x: 1, y: 0 },
      'w': { x: 0, y: -1 }, 'W': { x: 0, y: -1 },
      's': { x: 0, y: 1 },  'S': { x: 0, y: 1 },
      'a': { x: -1, y: 0 }, 'A': { x: -1, y: 0 },
      'd': { x: 1, y: 0 },  'D': { x: 1, y: 0 }
    };

    // Previne scroll da página com setas
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }

    if (map[e.key] && state === 'RUNNING') {
      nextDir = map[e.key];
      return;
    }

    if ((e.key === 'Enter' || e.key === ' ') &&
        (state === 'IDLE' || state === 'GAME_OVER')) {
      e.preventDefault();
      startGame();
    }
  }

  return { init: init, stop: stop };
})();
