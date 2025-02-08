function isBrowser(browser) {
  return navigator.userAgent.toLowerCase().indexOf(browser) > -1;
}

function updatePadding(container, val, width, height) {
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
    sidePanel.style.transform = 'translateX(0)';
    shrinkBtn.style.right = rightPosition;
    shrinkBtnImg.style.transform = 'rotate(0deg) scale(0.3)';
  } else {
    sidePanel.style.transform = 'translateX(100%)';
    shrinkBtn.style.right = '-50px';
    shrinkBtnImg.style.transform = 'rotate(-180deg) scale(0.3)';
  }
}

function applyBackground(id) {
  const container = document.querySelector('.container');
  const img = document.getElementById(id);
  const background = `url(${img.src.replace('.jpg', '.webp')}) no-repeat center / cover`;
  container.style.background = background;
}

function handleBackgroundUpload(event) {
  const container = document.querySelector('.container');
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const background = `url(${e.target.result}) no-repeat center / cover`;
      container.style.background = background;
    };
    reader.readAsDataURL(file);
  }
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

applyAspectRatio(3, 2);

document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.querySelector('.textarea');

  function autoResize(textarea) {
    textarea.style.height = '100%';
  }

  textarea.addEventListener('input', function () {
    autoResize(textarea);
  });

  autoResize(textarea);

  textarea.focus();

  document.addEventListener('click', function (event) {
    if (event.target !== textarea) {
      textarea.focus();
    }
  });

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

  const shrinkBtn = document.querySelector('.shrink-btn');
  if (isBrowser('firefox')) {
    shrinkBtn.style.right = '249px';
  } else {
    shrinkBtn.style.right = '251px';
  }

  const bgUploadInput = document.getElementById("bgUploadInput");
  if (bgUploadInput) {
    bgUploadInput.addEventListener("change", handleBackgroundUpload);
  }
});