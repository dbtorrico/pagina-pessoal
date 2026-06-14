(function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');

  function showSection(sectionId) {
    // Esconde todas as seções
    sections.forEach(s => s.classList.remove('active'));
    // Mostra a seção alvo
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');

    // Atualiza link ativo
    navLinks.forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector('[data-section="' + sectionId + '"]');
    if (activeLink) activeLink.classList.add('active');

    // Fecha sidebar se mobile
    if (sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    }
  }

  // Event listeners nos links de navegação (sidebar + links internos com data-section)
  document.querySelectorAll('[data-section]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showSection(this.dataset.section);
    });
  });

  // Hamburger toggle
  hamburger.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });

  // Overlay fecha sidebar
  overlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });

  // Escape fecha sidebar
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    }
  });

  // Estado inicial
  showSection('poko-loko-lab');
})();
