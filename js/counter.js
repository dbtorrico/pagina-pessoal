(function() {
  const endpoint = 'https://api.countapi.xyz/hit/dbtorrico/pagina-pessoal';
  const display = document.getElementById('visitor-counter');

  if (!display) return;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  fetch(endpoint, { signal: controller.signal })
    .then(function(res) {
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('API error');
      return res.json();
    })
    .then(function(data) {
      const count = String(data.value).padStart(4, '0');
      display.textContent = '[VISITORS: ' + count + ']';
    })
    .catch(function() {
      display.textContent = '[VISITORS: ----]';
    });
})();
