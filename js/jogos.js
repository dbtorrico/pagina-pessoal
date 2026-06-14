(function () {
  var listView = document.getElementById('jogos-list-view');
  var gameView = document.getElementById('jogos-game-view');
  var btnBack = document.getElementById('btn-back-jogos');
  var scoreDisplay = document.getElementById('snake-score-display');

  function showGame(gameId) {
    if (listView) listView.style.display = 'none';
    if (gameView) gameView.classList.add('active');

    if (gameId === 'snake' && typeof Snake !== 'undefined') {
      Snake.init('snake-canvas', function (score) {
        if (scoreDisplay) {
          scoreDisplay.textContent = 'SCORE: ' + String(score).padStart(4, '0');
        }
      });
    }
  }

  function showList() {
    if (typeof Snake !== 'undefined') Snake.stop();
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
