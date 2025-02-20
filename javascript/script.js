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
const DEFAULT_FONT_FAMILY = 'Inter, sans-serif';
const DEFAULT_TEXT_COLOR = '#ffffff';
const DEFAULT_BG_COLOR = 'rgba(0, 0, 0, 0.5)'; // Remis à semi-transparent noir
const DEFAULT_OPACITY = '0.7';
const DEFAULT_TEXT_ALIGN = 'center';
const DEFAULT_VERTICAL_ALIGN = 'center'; // Nouvelle constante

function initializeDefaults() {
  const textarea = document.querySelector('.textarea');
  const centerDiv = document.querySelector('.center-div');
  
  // Set initial font styles
  textarea.style.fontSize = `${DEFAULT_FONT_SIZE}px`;
  textarea.style.fontWeight = DEFAULT_FONT_WEIGHT;
  textarea.style.fontFamily = DEFAULT_FONT_FAMILY;
  textarea.style.color = DEFAULT_TEXT_COLOR;
  textarea.style.backgroundColor = 'transparent';
  centerDiv.style.backgroundColor = DEFAULT_BG_COLOR;
  textarea.style.textAlign = DEFAULT_TEXT_ALIGN;
  textarea.style.alignItems = DEFAULT_VERTICAL_ALIGN; // Ajout de l'alignement vertical
  
  // Set initial slider values
  document.getElementById('fontSizeSlider').value = DEFAULT_FONT_SIZE;
  document.getElementById('fontWeightSlider').value = DEFAULT_FONT_WEIGHT;
  document.getElementById('paddingSlider').value = DEFAULT_PADDING;
  document.getElementById('opacitySlider').value = parseFloat(DEFAULT_OPACITY) * 100;
  
  const currentBgColor = centerDiv.style.backgroundColor;
  const newBgColor = currentBgColor.replace(/[\d.]+\)$/g, `${DEFAULT_OPACITY})`);
  centerDiv.style.backgroundColor = newBgColor;
}

document.addEventListener("DOMContentLoaded", function () {
  initializeDefaults();
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
  // First, check if user previously checked "don't show"
  const dontShow = localStorage.getItem('dontShowOverlay') === 'true';
  console.log('Stored preference - dontShow:', dontShow);
  
  // Update checkbox to match stored state
  const checkbox = document.querySelector('.dont-show-again input[type="checkbox"]');
  const overlay = document.getElementById('overlay');
  const backdrop = document.querySelector('.overlay-backdrop');
  
  if (checkbox) {
    checkbox.checked = dontShow;
  }
  
  // If user previously chose not to show, hide overlay
  if (dontShow) {
    console.log('Overlay disabled by user preference');
    showOverlayEnabled = false;
    overlay.style.display = 'none';
    backdrop.style.display = 'none';
    return;
  }
  
  // Otherwise, show overlay
  console.log('Showing overlay');
  showOverlayEnabled = true;
  showOverlay();
  overlayOpenTime = Date.now();
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
  
  const opacitySlider = document.getElementById("opacitySlider");
  if (opacitySlider) {
    opacitySlider.addEventListener("input", () => {
      const centerDiv = document.querySelector('.center-div');
      const opacity = opacitySlider.value / 100;
      
      // Extrait les composantes RGB actuelles
      const rgbaMatch = centerDiv.style.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      
      if (rgbaMatch) {
        const [_, r, g, b] = rgbaMatch;
        centerDiv.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      } else {
        // Fallback si pas de correspondance (première initialisation ou erreur)
        const isLight = centerDiv.style.backgroundColor.includes('255, 255, 255');
        centerDiv.style.backgroundColor = isLight ? 
          `rgba(255, 255, 255, ${opacity})` : 
          `rgba(0, 0, 0, ${opacity})`;
      }
    });
  }
}

function initializeButtons() {
  const downloadBtn = document.getElementById("downloadBtn");
  const shrinkBtn = document.querySelector('.shrink-btn');
  const bgUploadInput = document.getElementById("bgUploadInput");
  
  if (downloadBtn) {
    downloadBtn.addEventListener("click", handleDownload);
  }
  
  if (shrinkBtn) {
    shrinkBtn.style.right = isBrowser('firefox') ? '249px' : '253px';
  }
  
  if (bgUploadInput) {
    bgUploadInput.addEventListener("change", handleBackgroundUpload);
  }

  // Initialize alignment buttons
  const alignButtons = document.querySelectorAll('.align-btn');
  alignButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active state from all buttons in the group
      const group = this.parentElement;
      group.querySelectorAll('.align-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active state to clicked button
      this.classList.add('active');
    });
  });
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
  const centerDiv = document.querySelector(".center-div");
  const tempDiv = document.createElement("div");
  const innerDiv = document.createElement("div");
  const preElement = document.createElement("pre");
  
  // Capture l'opacité actuelle
  const currentBgColor = centerDiv.style.backgroundColor;
  
  preElement.textContent = textarea.value;
  const currentFontSize = parseInt(textarea.style.fontSize);
  const downloadFontSize = window.innerWidth <= 480 ? 
    Math.max(currentFontSize - 4, 1) : 
    currentFontSize;

  // Capture des alignements actuels
  const textAlignment = textarea.style.textAlign || 'center';
  const verticalAlignment = textarea.style.alignItems || 'center';
  
  const alignmentStyles = {
    'left': { justify: 'flex-start', text: 'left' },
    'center': { justify: 'center', text: 'center' },
    'right': { justify: 'flex-end', text: 'right' }
  };

  const verticalAlignmentStyles = {
    'flex-start': 'flex-start',
    'center': 'center',
    'flex-end': 'flex-end'
  };

  preElement.setAttribute(
    "style",
    `
      width: 100%;
      height: 100%;
      text-align: ${alignmentStyles[textAlignment].text};
      font-family: ${textarea.style.fontFamily};
      white-space: pre-wrap;
      line-height: normal !important;
      word-wrap: break-word;
      font-weight: ${textarea.style.fontWeight};
      font-size: ${downloadFontSize}px;
      color: ${textarea.style.color};
      margin: 0;
      display: flex;
      justify-content: ${alignmentStyles[textAlignment].justify};
      align-items: ${verticalAlignmentStyles[verticalAlignment]};
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
      border-radius: 15px;
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
    })
    .catch((error) => {
      console.error("Erreur lors de la capture de l'image :", error);

      tempDiv.remove();
      textarea.style.display = "block";
    });
}

function applyFont(fontFamily, category) {
  const textarea = document.querySelector('.textarea');
  textarea.style.fontFamily = `${fontFamily}, ${category}`;
}

function invertColors() {
  const textarea = document.querySelector('.textarea');
  const centerDiv = document.querySelector('.center-div');
  const opacitySlider = document.getElementById('opacitySlider');
  
  const currentTextColor = textarea.style.color || DEFAULT_TEXT_COLOR;
  const opacity = opacitySlider.value / 100;
  
  // Inversion des couleurs en préservant l'opacité
  const isLight = currentTextColor === '#000000' || currentTextColor === 'rgb(0, 0, 0)';
  textarea.style.color = isLight ? '#ffffff' : '#000000';
  
  // Utilisation directe de rgba pour la transparence
  centerDiv.style.backgroundColor = isLight ? 
    `rgba(0, 0, 0, ${opacity})` : 
    `rgba(255, 255, 255, ${opacity})`;
    
  textarea.style.backgroundColor = 'transparent';
}

function applyTextAlign(alignment, isVertical = false) {
  const textarea = document.querySelector('.textarea');
  const centerDiv = document.querySelector('.center-div');
  
  if (isVertical) {
    console.log('Setting vertical alignment:', alignment);
    
    switch(alignment) {
      case 'top':
        textarea.style.justifyContent = 'flex-start';
        break;
      case 'center':
        textarea.style.justifyContent = 'center';
        break;
      case 'bottom':
        textarea.style.justifyContent = 'flex-end';
        break;
    }
    
    // Les valeurs actuelles
    console.log({
      alignment,
      'textarea.style.justifyContent': textarea.style.justifyContent,
      'textarea.style.flexDirection': textarea.style.flexDirection,
      'computed.display': getComputedStyle(textarea).display,
      'computed.flexDirection': getComputedStyle(textarea).flexDirection,
      'computed.justifyContent': getComputedStyle(textarea).justifyContent
    });
  } else {
    textarea.style.textAlign = alignment;
  }
}

const alignmentStyles = {
  'left': { justify: 'flex-start', text: 'left' },
  'center': { justify: 'center', text: 'center' },
  'right': { justify: 'flex-end', text: 'right' }
};