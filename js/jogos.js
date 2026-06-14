(function () {
  var listView = document.getElementById('jogos-list-view');
  var gameView = document.getElementById('jogos-game-view');
  var btnBack = document.getElementById('btn-back-jogos');
  var scoreDisplay = document.getElementById('game-score-display');
  var titleEl = document.getElementById('game-title-active');

  var CANVAS_ID = 'game-canvas';

  // Registry de jogos: cada entrada referencia um módulo IIFE com { init, stop }.
  var games = {
    snake: {
      module: typeof Snake !== 'undefined' ? Snake : null,
      title: 'SNAKE',
      scoreLabel: 'SCORE'
    },
    eggs: {
      module: typeof ChickenEggs !== 'undefined' ? ChickenEggs : null,
      title: 'SAVE THE CHICKEN EGGS',
      scoreLabel: 'PONTOS'
    }
  };

  var active = null; // entrada do registry atualmente em jogo

  function formatScore(label, score) {
    return label + ': ' + String(score).padStart(4, '0');
  }

  function showGame(gameId) {
    var entry = games[gameId];
    if (!entry || !entry.module) return;
    active = entry;

    if (listView) listView.style.display = 'none';
    if (gameView) gameView.classList.add('active');
    if (titleEl) titleEl.textContent = entry.title;
    if (scoreDisplay) scoreDisplay.textContent = formatScore(entry.scoreLabel, 0);

    entry.module.init(CANVAS_ID, function (score) {
      if (scoreDisplay) {
        scoreDisplay.textContent = formatScore(entry.scoreLabel, score);
      }
    });
  }

  function showList() {
    if (active && active.module) active.module.stop();
    active = null;
    if (gameView) gameView.classList.remove('active');
    if (listView) listView.style.display = '';
    if (scoreDisplay) scoreDisplay.textContent = 'SCORE: 0000';
  }

  // Click nos cards de jogo
  document.querySelectorAll('.game-card').forEach(function (card) {
    card.addEventListener('click', function () {
      showGame(this.dataset.game);
    });
  });

  // Botão Voltar
  if (btnBack) btnBack.addEventListener('click', showList);
})();
