function updatePadding(container, val, width, height) {
  // Nouvelle logique: on considère le padBlock comme la valeur du slider
  // et le padInline = padBlock * (width/height)
  const paddingBlock = val;
  const paddingInline = val * (width / height);
  container.style.paddingBlock = `${paddingBlock}px`;
  container.style.paddingInline = `${paddingInline}px`;
}

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
  const container = document.querySelector('.container');
  const img = document.getElementById(id);
  const background = `url(${img.src}) no-repeat center / cover`;
  container.style.background = background;
} 

function applyAspectRatio(width, height) {
  const container = document.querySelector('.container');
  container.style.setProperty('--aspect-ratio', `${width} / ${height}`);
  container.style.aspectRatio = `${width} / ${height}`;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const containerWidth = Math.min(0.9 * viewportWidth, 0.9 * viewportHeight * (width / height));
  container.style.width = `${containerWidth}px`;

  // Remove slider listener from here to avoid duplicate registrations
}

// Set default aspect ratio to 3:2
applyAspectRatio(3, 2);

document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.querySelector('.textarea');

  // Ajuste la hauteur de la textarea
  function autoResize(textarea) {
    textarea.style.height = '100%';
    // textarea.style.height = textarea.scrollHeight + 'px'; // supprimez ou commentez si besoin
  }

  // Ajuster la hauteur sur saisie
  textarea.addEventListener('input', function () {
    autoResize(textarea);
  });

  // Hauteur initiale
  autoResize(textarea);

  // Focus initial
  textarea.focus();

  // Maintenir le focus
  document.addEventListener('click', function (event) {
    if (event.target !== textarea) {
      textarea.focus();
    }
  });

  // Écouter le slider de padding (unique listener)
  const paddingSlider = document.getElementById("paddingSlider");
  if (paddingSlider) {
    paddingSlider.addEventListener("input", function () {
      const container = document.querySelector(".container");
      const aspectRatio = container.style.getPropertyValue('--aspect-ratio').split('/');
      const width = parseFloat(aspectRatio[0]);
      const height = parseFloat(aspectRatio[1]);
      const val = parseInt(this.value);

      updatePadding(container, val, width, height);
    });
  }
});