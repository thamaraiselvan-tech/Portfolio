/* ========== DOM Elements ========== */
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-links');
const themeToggle = document.getElementById('theme-toggle');
const sections = document.querySelectorAll('section[id]');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

/* ========== Navbar Scroll ========== */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ========== Active Section Highlighting ========== */
function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}
window.addEventListener('scroll', updateActiveLink);

/* ========== Mobile Menu ========== */
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

/* ========== Theme Toggle ========== */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}
setTheme(localStorage.getItem('theme') || 'dark');
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ========== Scroll Animations ========== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

/* ========== Typing Effect ========== */
const typingEl = document.getElementById('typing-text');
const roles = ['AI & DS Student', 'Aspiring Full Stack Developer', 'AI Enthusiast', 'Problem Solver'];
let roleIndex = 0, charIndex = 0, isDeleting = false;
function typeEffect() {
  const current = roles[roleIndex];
  typingEl.textContent = current.substring(0, isDeleting ? charIndex-- : charIndex++);
  let speed = isDeleting ? 40 : 80;
  if (!isDeleting && charIndex === current.length + 1) { speed = 2000; isDeleting = true; }
  else if (isDeleting && charIndex < 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; speed = 400; }
  setTimeout(typeEffect, speed);
}
typeEffect();

/* ========== EmailJS Contact Form ========== */
const EMAILJS_PUBLIC_KEY = 'tEMj75LhaUCDRm58J';
const EMAILJS_SERVICE_ID = 'service_yt8xf1l';
const EMAILJS_TEMPLATE_ID = 'template_kegp27r';

function validateForm(name, email, message) {
  let valid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  ['name','email','message'].forEach(id => {
    const el = document.getElementById(id);
    const group = el.closest('.form-group');
    const val = el.value.trim();
    if (!val || (id === 'email' && !emailRegex.test(val))) {
      group.classList.add('error'); valid = false;
    } else { group.classList.remove('error'); }
  });
  return valid;
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  formStatus.className = 'form-status'; formStatus.style.display = 'none';
  if (!validateForm(name, email, message)) return;
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    formStatus.textContent = '⚠️ EmailJS not configured. See js/main.js for setup instructions.';
    formStatus.className = 'form-status error'; formStatus.style.display = 'block'; return;
  }
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Sending...';
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {from_name:name,from_email:email,message:message})
    .then(() => {
      formStatus.textContent = '✅ Message sent successfully!';
      formStatus.className = 'form-status success'; formStatus.style.display = 'block';
      contactForm.reset();
    }).catch(() => {
      formStatus.textContent = '❌ Failed to send. Please try again.';
      formStatus.className = 'form-status error'; formStatus.style.display = 'block';
    }).finally(() => { btn.disabled = false; btn.textContent = 'Send Message'; });
});

/* ========== Smooth Scroll ========== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ========== Achievement Modal ========== */
(function () {
  const modal = document.getElementById('achievement-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  const modalIcon = document.getElementById('modal-icon');
  const modalImageIcon = document.getElementById('modal-image-icon');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalDesc = document.getElementById('modal-desc');
  const modalHighlights = document.getElementById('modal-highlights');

  function openModal(card) {
    modalIcon.textContent = card.dataset.icon;
    modalImageIcon.textContent = card.dataset.icon;
    modalImage.style.background = card.dataset.image;
    modalTitle.textContent = card.dataset.title;
    modalDate.textContent = card.dataset.date;
    modalDesc.textContent = card.dataset.description;

    const highlights = card.dataset.highlights.split('|');
    modalHighlights.innerHTML = highlights.map(h => `<li>${h.trim()}</li>`).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.achievement-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
})();

