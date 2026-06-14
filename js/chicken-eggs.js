// Save the Chicken Eggs — port em construção (T2/T3).
// Stub temporário: expõe a API { init, stop } para o registry do jogos.js.
const ChickenEggs = (function () {
  function init(canvasId, onScore) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    canvas.width = 1420;
    canvas.height = 500;
    ctx.fillStyle = '#0a1a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (onScore) onScore(0);
  }
  function stop() {}
  return { init: init, stop: stop };
})();
