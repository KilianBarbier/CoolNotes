// Add this function at the top of your script file
function isBrowser(browser) {
  return navigator.userAgent.toLowerCase().indexOf(browser) > -1;
}

function updatePadding(container, val, width, height) {
  // Nouvelle logique: on considère le padBlock comme la valeur du slider
  // et le padInline = padBlock * (width/height)
  const paddingBlock = val;
  const paddingInline = val * (width / height);
  container.style.paddingBlock = `${paddingBlock}px`;
  container.style.paddingInline = `${paddingInline}px`;
}

function togglePanel() {
  const sidePanel = document.getElementById('sidePanel');
  const shrinkBtn = document.querySelector('.shrink-btn');
  const shrinkBtnImg = document.querySelector('.shrink-btn img');
  const rightPosition = isBrowser('firefox') ? '249px' : '251px';

  if (sidePanel.style.transform === 'translateX(100%)') {
    // Panel opening
    sidePanel.style.transform = 'translateX(0)';
    shrinkBtn.style.right = rightPosition;
    shrinkBtnImg.style.transform = 'rotate(0deg) scale(0.3)';
  } else {
    // Panel closing
    sidePanel.style.transform = 'translateX(100%)';
    shrinkBtn.style.right = '-50px';
    shrinkBtnImg.style.transform = 'rotate(-180deg) scale(0.3)';
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

  // Add this code where you initialize your page
  const shrinkBtn = document.querySelector('.shrink-btn');
  if (isBrowser('firefox')) {
    shrinkBtn.style.right = '249px';
  } else {
    shrinkBtn.style.right = '251px';
  }
});