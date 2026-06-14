(function() {
  // Animação desabilitada — fundo estático preto
  return;

  // Respeita prefers-reduced-motion — se ativado, não inicia a animação
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('matrix-rain');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const charset = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789$%@#&*?!';
  const fontSize = 20;
  let drops = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(0).map(function() {
      return Math.floor(Math.random() * -50);
    });
  }

  function draw() {
    // Sobrepõe retângulo semi-transparente para criar efeito de fade/rastro
    ctx.fillStyle = 'rgba(5, 10, 5, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px VT323, monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = charset[Math.floor(Math.random() * charset.length)];

      // Char no topo da trilha em branco esverdeado (#CCFFCC), restante em verde Matrix (#00FF41)
      ctx.fillStyle = Math.random() > 0.95 ? '#CCFFCC' : '#00FF41';

      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      // Reseta a coluna aleatoriamente ao atingir o fundo
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();
