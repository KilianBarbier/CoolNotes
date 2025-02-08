function togglePanel() {
    const panel = document.getElementById("sidePanel");
    const icon = document.getElementById("toggleIcon");
    panel.classList.toggle("hidden-panel");
    if (panel.classList.contains("hidden-panel")) {
      icon.style.transform = "scale(0.3) rotate(-180deg)";
    } else {
      icon.style.transform = "scale(0.3) rotate(0deg)";
    }
  }
  
  function applyBackground(id) {
    const content = document.querySelector('.content');
    const img = document.getElementById(id);
    const background = `url(${img.src}) no-repeat center / cover`;
    content.style.background = background;
  }
  
  function applyAspectRatio(width, height) {
    const container = document.querySelector('.container');
    container.style.setProperty('--aspect-ratio', `${width} / ${height}`);
    container.style.aspectRatio = `${width} / ${height}`;
  
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const containerWidth = Math.min(0.9 * viewportWidth, 0.9 * viewportHeight * (width / height));
    container.style.width = `${containerWidth}px`;
  }
  
  // Set default aspect ratio to 3:2
  applyAspectRatio(3, 2);

  document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.querySelector('.textarea');
  
    // Fonction pour ajuster la hauteur de la textarea
    function autoResize(textarea) {
      textarea.style.height = 'auto'; // Réinitialise la hauteur
      textarea.style.height = textarea.scrollHeight + 'px'; // Ajuste la hauteur au contenu
    }
  
    // Ajoute un écouteur d'événement pour ajuster la hauteur lors de la saisie
    textarea.addEventListener('input', function () {
      autoResize(textarea);
    });
  
    // Ajuste la hauteur initiale
    autoResize(textarea);
  });

  document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.querySelector('.textarea');

    // Focus sur la textarea par défaut
    textarea.focus();

    // Fonction pour ajuster la hauteur de la textarea
    function autoResize(textarea) {
      textarea.style.height = 'auto'; // Réinitialise la hauteur
      textarea.style.height = textarea.scrollHeight + 'px'; // Ajuste la hauteur au contenu
    }

    // Ajoute un écouteur d'événement pour ajuster la hauteur lors de la saisie
    textarea.addEventListener('input', function () {
      autoResize(textarea);
    });

    // Ajuste la hauteur initiale
    autoResize(textarea);

    // Maintenir le focus sur la textarea
    document.addEventListener('click', function (event) {
      if (event.target !== textarea) {
        textarea.focus();
      }
    });
  });
