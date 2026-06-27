/* ============================================
   STUDENT HUB — script.js
   Features: Dark Mode, Gallery Upload,
   Lightbox, Course Search, Form Validation
   ============================================ */

// ---- Dark Mode ----
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle('dark-mode');
  localStorage.setItem('sh-theme', isDark ? 'dark' : 'light');
  // Update all toggle buttons
  document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    btn.textContent = isDark ? '☀ Light Mode' : '🌙 Dark Mode';
  });
}

function applyTheme() {
  const saved = localStorage.getItem('sh-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
      btn.textContent = '☀ Light Mode';
    });
  }
}

// ---- Course Search ----
function initCourseSearch() {
  const input = document.getElementById('courseSearch');
  if (!input) return;

  input.addEventListener('keyup', function () {
    const val = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.course-card');
    let visible = 0;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const show = text.includes(val);
      card.style.display = show ? 'flex' : 'none';
      if (show) visible++;
    });

    const noResult = document.getElementById('noResult');
    if (noResult) noResult.style.display = visible === 0 ? 'block' : 'none';
  });
}

// ---- Contact Form Validation ----
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

    const fields = [
      { id: 'name',    min: 2,  msg: 'Please enter your full name (min 2 characters).' },
      { id: 'email',   type: 'email', msg: 'Please enter a valid email address.' },
      { id: 'subject', min: 3,  msg: 'Please enter a subject.' },
      { id: 'message', min: 10, msg: 'Your message should be at least 10 characters.' },
    ];

    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el) return;
      const group = el.closest('.form-group');
      let errEl = group.querySelector('.error-msg');
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'error-msg';
        group.appendChild(errEl);
      }
      const val = el.value.trim();
      let error = false;

      if (f.type === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = true;
      } else if (val.length < (f.min || 1)) {
        error = true;
      }

      if (error) {
        group.classList.add('has-error');
        errEl.textContent = f.msg;
        valid = false;
      }
    });

    if (valid) {
      const successEl = document.getElementById('formSuccess');
      if (successEl) {
        successEl.style.display = 'block';
        form.reset();
        setTimeout(() => { successEl.style.display = 'none'; }, 5000);
      }
    }
  });
}

// ---- Gallery Upload & Lightbox ----
function initGallery() {
  const addBtn = document.getElementById('addPhotoBtn');
  const fileInput = document.getElementById('photoFileInput');
  const grid = document.getElementById('galleryGrid');

  if (!addBtn || !fileInput || !grid) return;

  addBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', function () {
    Array.from(this.files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => addGalleryItem(grid, e.target.result, file.name);
      reader.readAsDataURL(file);
    });
    this.value = '';
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox) return;

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  window.openLightbox = function (src) {
    lightboxImg.src = src;
    lightbox.classList.add('open');
  };
}

function addGalleryItem(grid, src, name) {
  // Remove any placeholder
  const placeholder = grid.querySelector('.gallery-placeholder-wrapper');
  if (placeholder) placeholder.remove();

  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.innerHTML = `
    <img src="${src}" alt="${name}" loading="lazy">
    <div class="gallery-overlay">
      <span>🔍</span>
    </div>
  `;
  item.addEventListener('click', () => window.openLightbox(src));
  grid.appendChild(item);
}

// ---- Sticky Navbar active link ----
function highlightNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sh-navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path);
  });
}

// ---- Scroll reveal (simple) ----
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.sh-card, .course-card, .event-card, .resource-item, .faculty-card, .news-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    observer.observe(el);
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  highlightNav();
  initCourseSearch();
  initContactForm();
  initGallery();
  initScrollReveal();
});