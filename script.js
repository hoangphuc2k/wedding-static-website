// ==================== CONFIGURATION ====================
// GOOGLE SHEETS INTEGRATION
// Replace this URL with your Google Apps Script web app URL
// See GOOGLE_SHEETS_SETUP.md for deployment instructions
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfZ08jqTLi_VNIIU_Y-6G7fvhBEcSDwbJc6QZRBu7ghTiiynNeS0Kc45YSDws2lLUjfw/exec';

// GALLERY CONFIGURATION
// TO ADD MORE IMAGES: Just add the filename to this array!
// Place your images in the 'gallery/' folder
const GALLERY_IMAGES = [
  'ART07251.jpg',
  'ART07329.jpg',
  'ART07746.jpg',
  'ART07931.jpg',
  'ART08065.jpg',
  'ART08079.jpg',
  'TA_00063.jpg',
  'TA_00103.jpg',
  'TA_00201.jpg',
  'TA_00237.jpg',
  'TA_00281.jpg',
  'TA_00300.jpg',
  'TA_00339.jpg',
  'TA_00409.jpg',
  'TA_00498.jpg',
];

// Load gallery images dynamically
function loadGalleryImages() {
  const galleryTrack = document.getElementById('galleryTrack');
  galleryTrack.innerHTML = ''; // Clear existing content

  // Create gallery slides
  GALLERY_IMAGES.forEach((imageName, index) => {
    const slide = document.createElement('div');
    slide.className = 'gallery-slide';
    slide.innerHTML = `
      <img src="./gallery/${imageName}" alt="Khoảnh khắc đẹp ${index + 1}" loading="lazy">
    `;
    galleryTrack.appendChild(slide);
  });

  // Initialize gallery slider after images are loaded
  if (GALLERY_IMAGES.length > 0) {
    initGallerySlider();
  }
}

// Loading screen
window.addEventListener('load', function() {
  // Load gallery images first
  loadGalleryImages();

  setTimeout(() => {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
    setTimeout(() => {
      loading.style.display = 'none';
    }, 500);
  }, 1500);
});

// Countdown Timer
function updateCountdown() {
  const weddingDate = new Date('November 7, 2025 15:00:00').getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance > 0) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Gallery slider
let currentSlide = 0;
let totalSlides = 0;

function initGallerySlider() {
  const galleryTrack = document.getElementById('galleryTrack');
  const slides = galleryTrack.querySelectorAll('.gallery-slide');
  totalSlides = slides.length;
}

function showSlide(index) {
  const galleryTrack = document.getElementById('galleryTrack');
  galleryTrack.style.transform = `translateX(-${index * 100}%)`;
}

function changeSlide(direction) {
  if (totalSlides === 0) return; // No slides yet
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// Gallery slider will be initialized by loadGalleryImages()
// Auto-play gallery
let galleryAutoPlay;
window.addEventListener('load', function() {
  setTimeout(() => {
    galleryAutoPlay = setInterval(() => {
      changeSlide(1);
    }, 5000);
  }, 100);
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in-elegant').forEach(el => {
  observer.observe(el);
});

// Parallax effect on hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector('.hero-image');
  const heroContent = document.querySelector('.hero-content');

  if (heroImage && scrolled < window.innerHeight) {
    heroImage.style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.5}px)`;
  }

  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = Math.max(0, 1 - scrolled * 0.002);
  }
});

// Music Button Functionality
const musicButton = document.getElementById('musicButton');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicIcon = document.getElementById('musicIcon');
let isPlaying = false;

// Create ripple effect
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');

  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Toggle music play/pause
function toggleMusic() {
  if (isPlaying) {
    backgroundMusic.pause();
    musicButton.classList.remove('playing');
    musicButton.classList.add('paused');
    musicIcon.classList.remove('fa-music');
    musicIcon.classList.add('fa-pause');
    isPlaying = false;
  } else {
    backgroundMusic.play().catch(error => {
      console.log('Audio playback failed:', error);
    });
    musicButton.classList.remove('paused');
    musicButton.classList.add('playing');
    musicIcon.classList.remove('fa-pause');
    musicIcon.classList.add('fa-music');
    isPlaying = true;
  }
}

// Event listeners for music button
musicButton.addEventListener('click', function(event) {
  createRipple(event);
  toggleMusic();
});

// Auto-play music when page loads (with user interaction fallback)
let autoPlayAttempted = false;

function attemptAutoPlay() {
  if (autoPlayAttempted) return;
  autoPlayAttempted = true;

  backgroundMusic.play().then(() => {
    musicButton.classList.add('playing');
    musicIcon.classList.remove('fa-pause');
    musicIcon.classList.add('fa-music');
    isPlaying = true;
    console.log('Auto-play successful!');
  }).catch(() => {
    // Autoplay blocked - show paused state to encourage user to click
    musicButton.classList.add('paused');
    console.log('Auto-play blocked by browser. User needs to interact first.');
  });
}

// Try auto-play on page load
window.addEventListener('load', function() {
  setTimeout(() => {
    attemptAutoPlay();
  }, 1500);
});

// Also try auto-play on first user interaction (click, scroll, touch)
const enableAutoPlayOnInteraction = () => {
  if (!isPlaying && !autoPlayAttempted) {
    console.log('User interaction detected - attempting auto-play...');
    attemptAutoPlay();
  }
  // Remove all listeners after first attempt
  document.removeEventListener('click', enableAutoPlayOnInteraction);
  document.removeEventListener('touchstart', enableAutoPlayOnInteraction);
  document.removeEventListener('keydown', enableAutoPlayOnInteraction);
  window.removeEventListener('scroll', enableAutoPlayOnInteraction);
  document.removeEventListener('mousemove', enableAutoPlayOnInteraction);
};

// Register multiple interaction types for maximum compatibility
document.addEventListener('click', enableAutoPlayOnInteraction, { once: true });
document.addEventListener('touchstart', enableAutoPlayOnInteraction, { once: true });
document.addEventListener('keydown', enableAutoPlayOnInteraction, { once: true });
window.addEventListener('scroll', enableAutoPlayOnInteraction, { once: true, passive: true });

// Also try on mouse movement (very subtle interaction)
let mouseMoveTimeout;
const enableOnMouseMove = () => {
  clearTimeout(mouseMoveTimeout);
  mouseMoveTimeout = setTimeout(() => {
    enableAutoPlayOnInteraction();
  }, 500); // Delay to avoid triggering on accidental movements
};
document.addEventListener('mousemove', enableOnMouseMove, { once: true });

// Handle music end (for non-looping tracks)
backgroundMusic.addEventListener('ended', function() {
  musicButton.classList.remove('playing');
  musicButton.classList.add('paused');
  musicIcon.classList.remove('fa-music');
  musicIcon.classList.add('fa-pause');
  isPlaying = false;
});

// Scroll to Top Button Functionality
const scrollToTopButton = document.getElementById('scrollToTop');

// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopButton.classList.add('visible');
  } else {
    scrollToTopButton.classList.remove('visible');
  }
});

// Scroll to top when button is clicked
scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ==================== MUSIC DIALOG FUNCTIONALITY ====================
// Music dialog elements
const musicDialog = document.getElementById('musicDialog');
const musicDialogYes = document.getElementById('musicDialogYes');
const musicDialogNo = document.getElementById('musicDialogNo');

// Check if user has already made a choice
function checkMusicPreference() {
  const musicPreference = localStorage.getItem('weddingMusicPreference');

  if (musicPreference === null) {
    // No preference stored, show dialog after loading screen
    setTimeout(() => {
      showMusicDialog();
    }, 2000); // Show dialog 2 seconds after page load
  } else if (musicPreference === 'yes') {
    // User previously chose to play music, attempt autoplay
    setTimeout(() => {
      attemptAutoPlay();
    }, 1500);
  }
  // If preference is 'no', do nothing (music stays paused)
}

// Show music dialog
function showMusicDialog() {
  musicDialog.classList.remove('hidden');
}

// Hide music dialog
function hideMusicDialog() {
  musicDialog.classList.add('hidden');
}

// Handle "Yes" button click
musicDialogYes.addEventListener('click', () => {
  // Save preference
  localStorage.setItem('weddingMusicPreference', 'yes');

  // Hide dialog
  hideMusicDialog();

  // Play music
  backgroundMusic.play().then(() => {
    musicButton.classList.add('playing');
    musicButton.classList.remove('paused');
    musicIcon.classList.remove('fa-pause');
    musicIcon.classList.add('fa-music');
    isPlaying = true;
    console.log('Music started from dialog');
  }).catch(error => {
    console.log('Failed to play music:', error);
    musicButton.classList.add('paused');
  });
});

// Handle "No" button click
musicDialogNo.addEventListener('click', () => {
  // Save preference
  localStorage.setItem('weddingMusicPreference', 'no');

  // Hide dialog
  hideMusicDialog();

  // Ensure music stays paused
  backgroundMusic.pause();
  musicButton.classList.add('paused');
  musicButton.classList.remove('playing');
  musicIcon.classList.remove('fa-music');
  musicIcon.classList.add('fa-pause');
  isPlaying = false;
  console.log('User chose not to play music');
});

// Check music preference when page loads
window.addEventListener('load', function() {
  setTimeout(() => {
    checkMusicPreference();
  }, 1000);
});

// ==================== GIFT DIALOG FUNCTIONALITY ====================
const giftButton = document.getElementById('giftButton');
const giftDialog = document.getElementById('giftDialog');
const giftDialogClose = document.getElementById('giftDialogClose');
const downloadQRBtn = document.getElementById('downloadQRBtn');
const copySTKBtn = document.getElementById('copySTKBtn');
const qrImage = document.getElementById('qrImage');

// Wish form elements
const wishSection = document.getElementById('wishSection');
const qrSection = document.getElementById('qrSection');
const wishForm = document.getElementById('wishForm');
const wishName = document.getElementById('wishName');
const wishMessage = document.getElementById('wishMessage');

// Initialize: Ensure wish section is visible and QR section is hidden on page load
window.addEventListener('DOMContentLoaded', () => {
  if (wishSection && qrSection) {
    wishSection.classList.remove('hidden');
    qrSection.classList.add('hidden');
  }
});

// Open gift dialog - always show wish form first
giftButton.addEventListener('click', () => {
  giftDialog.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling

  // Reset to wish form view
  wishSection.classList.remove('hidden');
  qrSection.classList.add('hidden');

  // Clear form
  wishForm.reset();
});

// Close gift dialog - close button
giftDialogClose.addEventListener('click', () => {
  closeGiftDialog();
});

// Close gift dialog - overlay click
giftDialog.addEventListener('click', (e) => {
  if (e.target === giftDialog) {
    closeGiftDialog();
  }
});

// Close dialog function
function closeGiftDialog() {
  giftDialog.classList.add('hidden');
  document.body.style.overflow = ''; // Restore scrolling

  // Reset to wish form after a delay
  setTimeout(() => {
    wishSection.classList.remove('hidden');
    qrSection.classList.add('hidden');
    wishForm.reset();
  }, 300);
}

// Handle wish form submission
wishForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const name = wishName.value.trim();
  const message = wishMessage.value.trim();

  // Validate
  if (!name || !message) {
    showStatusMessage('Vui lòng điền đầy đủ thông tin', 'error');
    return;
  }

  // Create wish object
  const wish = {
    name: name,
    message: message,
    timestamp: new Date().toISOString()
  };

  // Show loading state
  const submitBtn = wishForm.querySelector('.gift-submit-btn');
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span><span>Đang gửi...</span>';

  // Remove any existing status messages
  const existingStatus = wishForm.querySelector('.gift-status-message');
  if (existingStatus) {
    existingStatus.remove();
  }

  try {
    // Check if Google Script URL is configured
    const isGoogleSheetsConfigured = GOOGLE_SCRIPT_URL &&
                                      GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

    if (isGoogleSheetsConfigured) {
      // Send to Google Sheets
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wish)
      });

      // Note: With no-cors mode, we can't read the response
      // But we can assume success if no error was thrown
      console.log('Wish sent to Google Sheets successfully');

      // Store in localStorage as backup
      saveToLocalStorage(wish);

      // Show success and transition to QR section
      transitionToQRSection();

    } else {
      // Google Sheets not configured, use localStorage only
      console.warn('Google Sheets not configured. Saving to localStorage only.');
      saveToLocalStorage(wish);

      // Show success and transition to QR section
      transitionToQRSection();
    }

  } catch (error) {
    console.error('Error submitting wish:', error);

    // Fallback to localStorage
    saveToLocalStorage(wish);

    // Show warning message but still proceed to QR section
    showStatusMessage('Lời chúc đã được lưu tạm thời', 'success');

    // Still transition to QR section after short delay
    setTimeout(() => {
      transitionToQRSection();
    }, 1500);

  } finally {
    // Reset button state
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;
  }
});

// Helper function to save to localStorage
function saveToLocalStorage(wish) {
  try {
    const wishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
    wishes.push(wish);
    localStorage.setItem('weddingWishes', JSON.stringify(wishes));
    console.log('Wish saved to localStorage:', wish);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Helper function to transition to QR section
function transitionToQRSection() {
  // Transition to QR section
  wishSection.classList.add('hidden');

  // Small delay for smooth transition
  setTimeout(() => {
    qrSection.classList.remove('hidden');
  }, 200);
}

// Helper function to show status messages
function showStatusMessage(message, type = 'success') {
  // Remove existing message
  const existingMessage = wishForm.querySelector('.gift-status-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `gift-status-message ${type}`;

  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  messageDiv.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;

  wishForm.appendChild(messageDiv);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (messageDiv.parentElement) {
      messageDiv.remove();
    }
  }, 3000);
}

// Download QR Code functionality
downloadQRBtn.addEventListener('click', async () => {
  try {
    // Get the QR image
    const imgSrc = qrImage.src;

    // Fetch the image as blob
    const response = await fetch(imgSrc);
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'QR-Chuyen-Khoan.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Visual feedback
    const originalHTML = downloadQRBtn.innerHTML;
    downloadQRBtn.innerHTML = '<i class="fas fa-check"></i><span>Đã Tải!</span>';
    downloadQRBtn.style.background = 'var(--sage-green)';
    downloadQRBtn.style.color = 'white';

    setTimeout(() => {
      downloadQRBtn.innerHTML = originalHTML;
      downloadQRBtn.style.background = '';
      downloadQRBtn.style.color = '';
    }, 2000);
  } catch (error) {
    console.error('Error downloading QR code:', error);

    // Fallback: open image in new tab
    window.open(qrImage.src, '_blank');
  }
});

// Copy bank account number functionality
copySTKBtn.addEventListener('click', async () => {
  const accountNumber = copySTKBtn.getAttribute('data-account');

  try {
    // Modern clipboard API
    await navigator.clipboard.writeText(accountNumber);

    // Visual feedback
    const originalHTML = copySTKBtn.innerHTML;
    copySTKBtn.classList.add('copied');
    copySTKBtn.innerHTML = '<i class="fas fa-check"></i><span>Đã Sao Chép!</span>';

    setTimeout(() => {
      copySTKBtn.classList.remove('copied');
      copySTKBtn.innerHTML = originalHTML;
    }, 2000);
  } catch (error) {
    console.error('Error copying to clipboard:', error);

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = accountNumber;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');

      // Visual feedback
      const originalHTML = copySTKBtn.innerHTML;
      copySTKBtn.classList.add('copied');
      copySTKBtn.innerHTML = '<i class="fas fa-check"></i><span>Đã Sao Chép!</span>';

      setTimeout(() => {
        copySTKBtn.classList.remove('copied');
        copySTKBtn.innerHTML = originalHTML;
      }, 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
      alert('Không thể sao chép. Vui lòng sao chép thủ công: ' + accountNumber);
    }

    document.body.removeChild(textArea);
  }
});
