function isBrowser(browser) {
  return navigator.userAgent.toLowerCase().indexOf(browser) > -1;
}

function updatePadding(container, val, width, height) {
  const paddingBlock = val;
  const paddingInline = val * (width / height);
  container.style.paddingBlock = `${paddingBlock}px`;
  container.style.paddingInline = `${paddingInline}px`;
}

function initializeMobileLayout() {
  const sidePanel = document.getElementById('sidePanel');
  const shrinkBtn = document.querySelector('.shrink-btn');
  const shrinkBtnImg = document.querySelector('.shrink-btn img');

  if (window.innerWidth <= 480) {
    sidePanel.classList.remove('normal-side-panel');
    sidePanel.classList.add('mobile-side-panel', 'hidden-panel-mobile');
    shrinkBtn.classList.add('mobile-shrink-btn');
    sidePanel.style.bottom = '-298px';
    shrinkBtn.style.bottom = '0px';
    shrinkBtnImg.style.transform = 'rotate(-180deg) scale(0.3)';
  } else {
    sidePanel.classList.remove('mobile-side-panel', 'hidden-panel-mobile');
    sidePanel.classList.add('normal-side-panel');
    shrinkBtn.classList.remove('mobile-shrink-btn');
    sidePanel.style.transform = 'translateX(0)';
    shrinkBtn.style.right = isBrowser('firefox') ? '249px' : '253px';
    shrinkBtnImg.style.transform = 'rotate(0deg) scale(0.3)';
  }
}

function togglePanel() {
  const sidePanel = document.getElementById('sidePanel');
  const shrinkBtn = document.querySelector('.shrink-btn');
  const shrinkBtnImg = document.querySelector('.shrink-btn img');
  const rightPosition = isBrowser('firefox') ? '249px' : '253px';

  if (window.innerWidth <= 480) {
    // Version mobile
    if (sidePanel.classList.contains('hidden-panel-mobile')) {
      sidePanel.classList.remove('hidden-panel-mobile');
      sidePanel.style.bottom = '0px';
      shrinkBtn.style.bottom = '300px';
      shrinkBtnImg.style.transform = 'rotate(0deg) scale(0.3)';
    } else {
      sidePanel.classList.add('hidden-panel-mobile');
      sidePanel.style.bottom = '-298px';
      shrinkBtn.style.bottom = '0px';
      shrinkBtnImg.style.transform = 'rotate(-180deg) scale(0.3)';
    }
  } else {
    // Version desktop
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

function handleResize() {
  const container = document.querySelector('.container');
  const aspectRatio = container.style.getPropertyValue('--aspect-ratio').split('/');
  const width = parseFloat(aspectRatio[0]);
  const height = parseFloat(aspectRatio[1]);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const containerWidth = Math.min(0.9 * viewportWidth, 0.9 * viewportHeight * (width / height));
  container.style.width = `${containerWidth}px`;
}

window.addEventListener('resize', handleResize);

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

  if (window.innerWidth > 480) {
    textarea.focus();
  }

  document.addEventListener('click', function (event) {
    if (event.target !== textarea && window.innerWidth > 480) {
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
    shrinkBtn.style.right = '253px';
  }

  const bgUploadInput = document.getElementById("bgUploadInput");
  if (bgUploadInput) {
    bgUploadInput.addEventListener("change", handleBackgroundUpload);
  }

  handleResize();
  initializeMobileLayout();
});

window.addEventListener('resize', initializeMobileLayout);

let overlayOpenTime;
const MIN_READ_TIME = 6000; // 6 seconds minimum reading time
let showOverlayEnabled = true;  // Variable for overlay visibility
let showTooFastMessage = true;  // Add this line - Variable for "too fast" message

// Update the dontShowAgain function
function dontShowAgain() {
  const checkbox = document.querySelector('.dont-show-again input[type="checkbox"]');
  if (checkbox.checked) {
    showOverlayEnabled = false;
    showTooFastMessage = false;  // Add this line
    localStorage.setItem('showOverlay', 'false');
    localStorage.setItem('showTooFastMessage', 'false');  // Add this line
  } else {
    showOverlayEnabled = true;
    showTooFastMessage = true;  // Add this line
    localStorage.removeItem('showOverlay');
    localStorage.removeItem('showTooFastMessage');  // Add this line
  }
}

// Remove preloadAndCacheOverlayBackground and loadOverlayBackground functions

// Modify the load event listener
window.addEventListener('load', function() {
  overlayOpenTime = Date.now();
  showOverlayEnabled = localStorage.getItem('showOverlay') !== 'false';
  showTooFastMessage = localStorage.getItem('showTooFastMessage') !== 'false';  // Add this line
  
  if (showOverlayEnabled) {
    showOverlay();
  }
});

function showOverlay() {
  if (!showOverlayEnabled) return;  // Skip if disabled
  
  const overlay = document.getElementById('overlay');
  const backdrop = document.querySelector('.overlay-backdrop');
  overlay.style.display = 'block';
  backdrop.style.display = 'block';
}

// Modify the closeOverlay function
function closeOverlay() {
  const timeSpent = Date.now() - overlayOpenTime;
  const overlay = document.getElementById('overlay');
  const backdrop = document.querySelector('.overlay-backdrop');
  const page1 = document.getElementById('overlay-page1');
  const page2 = document.getElementById('overlay-page2');
  
  // Check if we're on page 2
  if (page2.style.display === 'block') {
    // Close immediately if on page 2
    overlay.style.display = 'none';
    backdrop.style.display = 'none';
    return;
  }
  
  if (timeSpent < MIN_READ_TIME && showTooFastMessage) {
    // Show "too fast" message
    page1.style.display = 'none';
    page2.style.display = 'block';
    return; // Prevent close
  }
  
  // Normal close if enough time has passed
  overlay.style.display = 'none';
  backdrop.style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.getElementById("downloadBtn");
  const container = document.querySelector(".container");
  const textarea = document.querySelector(".textarea");
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  const fontWeightSlider = document.getElementById("fontWeightSlider");
  const fontSizeSlider = document.getElementById("fontSizeSlider");

  fontWeightSlider.addEventListener("input", function () {
    textarea.style.fontWeight = fontWeightSlider.value;
  });

  fontSizeSlider.addEventListener("input", function () {
    textarea.style.fontSize = fontSizeSlider.value + "px";
  });

  downloadBtn.addEventListener("click", function () {
    const tempDiv = document.createElement("div");
    const innerDiv = document.createElement("div");
    const preElement = document.createElement("pre");
    preElement.textContent = textarea.value;
    const currentFontSize = parseInt(textarea.style.fontSize);
    const downloadFontSize = window.innerWidth <= 480 ? 
      Math.max(currentFontSize - 4, 1) : // Réduction de 2pt avec minimum 1pt
      currentFontSize;

    preElement.setAttribute(
      "style",
      `
        width: 100%;
        height: 100%;
        text-align: center;
        box-sizing: border-box;
        font-family: 'Inter', sans-serif;
        white-space: pre-wrap;
        line-height: normal !important;
        word-wrap: break-word;
        background-color: ${container.style.backgroundColor};
        font-weight: ${textarea.style.fontWeight};
        font-size: ${downloadFontSize}px;
        color: ${textarea.style.color};
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin-top: -18px;
      `
    );

    innerDiv.setAttribute(
      "style",
      `
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      `
    );

    tempDiv.setAttribute(
      "style",
      `
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
      `
    );

    innerDiv.appendChild(preElement);
    tempDiv.appendChild(innerDiv);

    textarea.style.display = "none";
    container.querySelector(".center-div").appendChild(tempDiv);

    const centerDiv = container.querySelector(".center-div");
    centerDiv.style.backdropFilter = "blur(10px)";

    html2canvas(container, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: true,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
    })
      .then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "container.png";
        link.click();

        tempDiv.remove();
        textarea.style.display = "block";
        centerDiv.style.backdropFilter = "blur(10px)";
      })
      .catch((error) => {
        console.error("Erreur lors de la capture de l'image :", error);

        tempDiv.remove();
        textarea.style.display = "block";
      });
  });

  themeToggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
  });

  document.body.classList.add("dark-theme");

  // Add wiggle functionality
  document.addEventListener('click', function(event) {
    const overlay = document.getElementById('overlay');
    const backdrop = document.querySelector('.overlay-backdrop');
    const closeBtn = document.querySelector('.close-btn');
    
    if (backdrop && closeBtn && overlay && 
        overlay.style.display === 'block' && 
        event.target === backdrop) {
        
        closeBtn.classList.remove('wiggle');
        void closeBtn.offsetWidth; // Force reflow
        closeBtn.classList.add('wiggle');
    }
  });

  // Single click event listener for wiggle
  document.addEventListener('click', function(event) {
    const overlay = document.getElementById('overlay');
    const backdrop = document.querySelector('.overlay-backdrop');
    const closeBtn = document.querySelector('.close-btn');
    
    if (backdrop && 
        closeBtn && 
        overlay && 
        overlay.style.display !== 'none' && 
        event.target === backdrop) {
        
        console.log('Wiggle animation triggered');
        closeBtn.classList.remove('wiggle');
        void closeBtn.offsetWidth;
        closeBtn.classList.add('wiggle');
    }
  });
});

document.addEventListener('click', function(event) {
  const overlay = document.getElementById('overlay');
  const backdrop = document.querySelector('.overlay-backdrop');
  const closeBtn = document.querySelector('.close-btn');
  
  console.log('Click detected');
  console.log('Overlay display:', overlay?.style.display);
  console.log('Clicked element:', event.target);
  console.log('Is backdrop?:', event.target === backdrop);
  
  if (backdrop && closeBtn && overlay && 
      overlay.style.display === 'block' && 
      event.target === backdrop) {
      
      console.log('Wiggle animation triggered');
      closeBtn.classList.remove('wiggle');
      void closeBtn.offsetWidth;
      closeBtn.classList.add('wiggle');
  }
});