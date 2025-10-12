// ==================== GALLERY CONFIGURATION ====================
// TO ADD MORE IMAGES: Just add the filename to this array!
// Place your images in the 'gallery/' folder
const GALLERY_IMAGES = [
  'ART07164.JPG',
  'ART07472.JPG',
  'ART07528.JPG',
  'ART07880.JPG',
  'ART08009.JPG',
  'ART08079.JPG',
  'TA_00063.jpg',
  'TA_00103.jpg',
  'TA_00201.jpg',
  'TA_00237.jpg',
  'TA_00281.jpg',
  'TA_00300.jpg',
  'TA_00339.jpg',
  'TA_00409.jpg',
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

// ==================== RSVP Form Submission ====================
// IMPORTANT: Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx6gF6bfUo74hdbv4CaOXBcRkNWA0dmSgGoOwYa_8LhG_jDpQSl61OKaCoK4X-st0UbNQ/exec';

const rsvpForm = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

rsvpForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Đang gửi...';

  // Get form data
  const formData = {
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    guests: document.getElementById('guests').value,
    attendance: document.getElementById('attendance').value,
    message: document.getElementById('message').value,
    timestamp: new Date().toISOString()
  };

  try {
    // Check if URL is configured
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
      throw new Error('Vui lòng cấu hình Google Script URL trong mã nguồn');
    }

    // Submit to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    // With no-cors mode, we assume success if no error is thrown
    showMessage('success', 'Cảm ơn bạn đã xác nhận tham dự! Chúng tôi rất mong được gặp bạn. 💕');
    rsvpForm.reset();

  } catch (error) {
    console.error('Error:', error);
    showMessage('error', 'Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp với chúng tôi.');
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Gửi Xác Nhận';
  }
});

function showMessage(type, text) {
  formMessage.className = `form-message ${type}`;
  formMessage.textContent = text;
  formMessage.style.display = 'block';

  // Auto-hide success message after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  }
}

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
