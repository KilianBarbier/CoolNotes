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
  
  // Check if file is an image
  if (file) {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (jpg, png, etc.)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const background = `url(${e.target.result}) no-repeat center / cover`;
      container.style.background = background;
    };
    reader.onerror = function() {
      alert('Error reading file');
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

const DEFAULT_FONT_SIZE = '16';
const DEFAULT_FONT_WEIGHT = '400';
const DEFAULT_PADDING = '60';

function initializeDefaults() {
  const textarea = document.querySelector('.textarea');
  // Set initial font styles
  textarea.style.fontSize = `${DEFAULT_FONT_SIZE}px`;
  textarea.style.fontWeight = DEFAULT_FONT_WEIGHT;
  
  // Set initial slider values
  document.getElementById('fontSizeSlider').value = DEFAULT_FONT_SIZE;
  document.getElementById('fontWeightSlider').value = DEFAULT_FONT_WEIGHT;
  document.getElementById('paddingSlider').value = DEFAULT_PADDING;
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark-theme';
  document.body.classList.add(savedTheme);
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
  const currentTheme = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
  localStorage.setItem('theme', currentTheme);
}

document.addEventListener("DOMContentLoaded", function () {
  initializeDefaults();
  initializeTheme();
  // Text area handling
  const textarea = document.querySelector('.textarea');
  initializeTextArea(textarea);
  
  // Sliders initialization
  initializeSliders();
  
  // Button handlers
  initializeButtons();
  
  // Layout initialization
  handleResize();
  initializeMobileLayout();
  
  // Single wiggle handler
  initializeWiggleHandler();
});

window.addEventListener('resize', initializeMobileLayout);

let overlayOpenTime;
const MIN_READ_TIME = 6000; // 6 seconds minimum reading time
let showOverlayEnabled = true;  // Variable for overlay visibility
let showTooFastMessage = true;  // Add this line - Variable for "too fast" message

// Update the dontShowAgain function
function dontShowAgain() {
  const checkbox = document.querySelector('.dont-show-again input[type="checkbox"]');
  
  // Save to localStorage
  localStorage.setItem('dontShowOverlay', checkbox.checked);
  console.log('Saved checkbox state:', checkbox.checked);
}

// Update load event listener
window.addEventListener('load', function() {
  // Get checkbox state from localStorage (converts to boolean)
  const dontShow = localStorage.getItem('dontShowOverlay') === 'true';
  console.log('Retrieved dontShow state:', dontShow);
  
  // Set checkbox state
  const checkbox = document.querySelector('.dont-show-again input[type="checkbox"]');
  checkbox.checked = dontShow;
  
  // Show overlay unless explicitly disabled
  showOverlayEnabled = !dontShow;
  
  if (showOverlayEnabled) {
    showOverlay();
    overlayOpenTime = Date.now();
  }
});

function showOverlay() {
  if (!showOverlayEnabled) return;
  
  console.log('=== Show Overlay Debug ===');
  console.log('showOverlayEnabled:', showOverlayEnabled);
  console.log('showTooFastMessage:', showTooFastMessage);
  
  const overlay = document.getElementById('overlay');
  const backdrop = document.querySelector('.overlay-backdrop');
  const page1 = document.getElementById('overlay-page1');
  const page2 = document.getElementById('overlay-page2');
  
  overlay.style.display = 'block';
  backdrop.style.display = 'block';
  page1.style.display = 'block';
  page2.style.display = 'none';
  
  overlayOpenTime = Date.now();
  console.log('Set overlay open time:', overlayOpenTime);
  console.log('========================');
}

function closeOverlay() {
  const currentTime = Date.now();
  const timeSpent = currentTime - overlayOpenTime;
  
  console.log('Close button clicked (Mobile Check)');
  console.log('Is Mobile:', window.innerWidth <= 480);
  console.log('Time spent:', timeSpent);
  
  const overlay = document.getElementById('overlay');
  const backdrop = document.querySelector('.overlay-backdrop');
  const page1 = document.getElementById('overlay-page1');
  const page2 = document.getElementById('overlay-page2');
  
  // Force display check with getComputedStyle
  const page2Visible = window.getComputedStyle(page2).display !== 'none';
  console.log('Page 2 visible:', page2Visible);
  
  // If already on page 2, just close
  if (page2Visible) {
    console.log('Closing from page 2');
    overlay.style.display = 'none';
    backdrop.style.display = 'none';
    return;
  }
  
  // If trying to close too fast on page 1
  if (timeSpent < MIN_READ_TIME) {
    console.log('Should show too fast message');
    // Force display changes
    page1.style.display = 'none';
    requestAnimationFrame(() => {
      page2.style.display = 'block';
      page2.style.opacity = '1';
    });
    overlayOpenTime = Date.now();
    return;
  }
  
  // Normal close
  console.log('Normal close');
  overlay.style.display = 'none';
  backdrop.style.display = 'none';
}

function showPageOne() {
  const page1 = document.getElementById('overlay-page1');
  const page2 = document.getElementById('overlay-page2');
  page1.style.display = 'block';
  page2.style.display = 'none';
  overlayOpenTime = Date.now(); // Reset timer when returning to page 1
}

// Helper functions
function initializeTextArea(textarea) {
  function autoResize(textarea) {
    textarea.style.height = '100%';
  }
  
  textarea.addEventListener('input', () => autoResize(textarea));
  autoResize(textarea);
  
  if (window.innerWidth > 480) {
    textarea.focus();
  }
  
  document.addEventListener('click', function (event) {
    if (event.target !== textarea && window.innerWidth > 480) {
      textarea.focus();
    }
  });
}

function initializeSliders() {
  const fontWeightSlider = document.getElementById("fontWeightSlider");
  const fontSizeSlider = document.getElementById("fontSizeSlider");
  const paddingSlider = document.getElementById("paddingSlider");
  const textarea = document.querySelector('.textarea');
  
  if (fontWeightSlider) {
    fontWeightSlider.addEventListener("input", () => {
      textarea.style.fontWeight = fontWeightSlider.value;
    });
  }
  
  if (fontSizeSlider) {
    fontSizeSlider.addEventListener("input", () => {
      textarea.style.fontSize = fontSizeSlider.value + "px";
    });
  }
  
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
}

function initializeButtons() {
  const downloadBtn = document.getElementById("downloadBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const shrinkBtn = document.querySelector('.shrink-btn');
  const bgUploadInput = document.getElementById("bgUploadInput");
  
  if (downloadBtn) {
    downloadBtn.addEventListener("click", handleDownload);
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }
  
  if (shrinkBtn) {
    shrinkBtn.style.right = isBrowser('firefox') ? '249px' : '253px';
  }
  
  if (bgUploadInput) {
    bgUploadInput.addEventListener("change", handleBackgroundUpload);
  }
}

function initializeWiggleHandler() {
  document.addEventListener('click', function(event) {
    const overlay = document.getElementById('overlay');
    const backdrop = document.querySelector('.overlay-backdrop');
    const closeBtn = document.querySelector('.close-btn');
    
    if (backdrop && closeBtn && overlay && 
        overlay.style.display === 'block' && 
        event.target === backdrop) {
        
        closeBtn.classList.remove('wiggle');
        void closeBtn.offsetWidth;
        closeBtn.classList.add('wiggle');
    }
  });
}

function handleDownload() {
  const container = document.querySelector(".container");
  const textarea = document.querySelector(".textarea");
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
}