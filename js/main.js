/* ═══════════════════════════════════════════════════════
   PREMIUM PORTFOLIO JS — CYBERPUNK v3
   Interactive Particle Constellation + Premium Effects
   ═══════════════════════════════════════════════════════ */

// Force page scroll back to home (top) on refresh
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  if (window.location.hash && window.location.hash !== '#hero') {
    history.replaceState(null, null, ' ');
  }
});

const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-links');
const themeToggle = document.getElementById('theme-toggle');
const sections = document.querySelectorAll('section[id]');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const scrollProgress = document.getElementById('scroll-progress');

/* ═══════════════════════════════════
   1. LOADING SCREEN (Split Curtain)
   ═══════════════════════════════════ */
(function () {
  const loader = document.getElementById('loader');
  const counter = document.getElementById('loader-counter');
  const ringFill = document.querySelector('.loader-ring-fill');
  if (!loader) { document.body.classList.add('loaded'); return; }

  const circ = 2 * Math.PI * 90;
  const dur = 2800;
  const t0 = performance.now();

  function tick(now) {
    const raw = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - raw, 4);
    const pct = Math.round(e * 100);
    if (counter) counter.textContent = pct + '%';
    if (ringFill) ringFill.style.strokeDashoffset = circ * (1 - e);
    if (raw < 1) return requestAnimationFrame(tick);

    // Done — split curtain exit
    setTimeout(() => {
      loader.classList.add('exit');
      document.body.classList.add('loaded');
      setTimeout(() => { if (loader.parentNode) loader.remove(); }, 1400);
    }, 500);
  }
  requestAnimationFrame(tick);
})();

/* ═══════════════════════════════════
   2. INTERACTIVE PARTICLE CONSTELLATION
   Canvas-based starfield with:
   - Drifting particles
   - Connection lines between nearby particles
   - Mouse repulsion (particles push away from cursor)
   - Theme-aware colors
   ═══════════════════════════════════ */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  const PARTICLE_COUNT = 70;
  const CONNECTION_DIST = 140;
  const MOUSE_RADIUS = 130;
  let particles = [];
  let mouseX = -9999, mouseY = -9999;
  let w, h;

  function getColor() {
    const t = document.documentElement.getAttribute('data-theme');
    return t === 'dark' ? { r: 0, g: 212, b: 255 } : { r: 99, g: 102, b: 241 };
  }

  function resize() {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.15,
        size: Math.random() * 2 + 1,
        baseOpacity: Math.random() * 0.4 + 0.25,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const c = getColor();

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.pulse += 0.015;
      const opacity = p.baseOpacity * (0.5 + 0.5 * Math.sin(p.pulse));

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        p.x += (dx / dist) * force * 3;
        p.y += (dy / dist) * force * 3;
      }

      // Drift
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
      if (p.y > h + 20) p.y = -20;

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${opacity * 0.12})`;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${opacity})`;
      ctx.fill();
    }

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = 0.12 * (1 - dist / CONNECTION_DIST);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  // Mouse tracking (relative to canvas)
  hero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  resize();
  createParticles();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); createParticles(); }, 200);
  });
})();

/* ═══════════════════════════════════
   3. CUSTOM CURSOR + GLOW TRAIL
   ═══════════════════════════════════ */
(function () {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const glow = document.getElementById('cursor-glow');
  const canvas = document.getElementById('cursor-canvas');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100, gx = -100, gy = -100;
  let particles = [];
  let hue = 0;

  // Setup Canvas Context
  let ctx = null;
  if (canvas) {
    ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function handleMove(clientX, clientY) {
    const prevX = mx;
    const prevY = my;
    mx = clientX;
    my = clientY;
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;

    // Spawn sparks based on speed
    if (ctx && prevX !== -100) {
      const dx = mx - prevX;
      const dy = my - prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const count = Math.min(Math.floor(speed / 4), 6);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: mx + (Math.random() - 0.5) * 6,
          y: my + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.5 - dx * 0.1,
          vy: (Math.random() - 0.5) * 1.5 - dy * 0.1,
          size: Math.random() * 2.5 + 1.2,
          opacity: 0.95,
          hue: hue,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    }
  }

  document.addEventListener('mousemove', (e) => {
    // Fade in cursor if it was hidden
    if (dot.style.opacity !== '1') {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      if (canvas) canvas.style.opacity = '1';
    }
    handleMove(e.clientX, e.clientY);
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
    if (canvas) canvas.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    if (glow) glow.style.opacity = '0';
    if (canvas) canvas.style.opacity = '0';
  });

  // Touch tracking for mobile swipe cursor animations
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      if (canvas) canvas.style.opacity = '1';
      if (glow) glow.style.opacity = '1';
      
      const t = e.touches[0];
      mx = t.clientX;
      my = t.clientY;
      rx = mx;
      ry = my;
      gx = mx;
      gy = my;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      ring.style.transform = `translate(${rx - 24}px, ${ry - 24}px)`;
      if (glow) glow.style.transform = `translate(${gx - 150}px, ${gy - 150}px)`;

      // Active state for touch targets
      const target = e.target.closest('a, button, .project-card, .skill-card, .achievement-card, .btn, input, textarea, .interest-tag, .social-link, .skill-tag, .gallery-item');
      if (target) {
        ring.classList.add('active');
        dot.classList.add('active');
      } else {
        ring.classList.remove('active');
        dot.classList.remove('active');
      }
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    if (glow) glow.style.opacity = '0';
  }, { passive: true });

  function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 24}px, ${ry - 24}px)`;

    if (glow) {
      gx += (mx - gx) * 0.05;
      gy += (my - gy) * 0.05;
      glow.style.transform = `translate(${gx - 150}px, ${gy - 150}px)`;
      glow.style.opacity = '1';
    }

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hue = (hue + 1.5) % 360;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= p.decay;
        p.size *= 0.97;

        if (p.opacity <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity})`;
        ctx.shadowBlur = p.size * 2.5;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, ${p.opacity * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    requestAnimationFrame(loop);
  }
  loop();

  // Cursor hover states (using event delegation to support dynamically created elements)
  document.addEventListener('mouseover', (e) => {
    if (!e.target || typeof e.target.closest !== 'function') return;
    const target = e.target.closest('a, button, .project-card, .skill-card, .achievement-card, .btn, input, textarea, .interest-tag, .social-link, .skill-tag, .gallery-item');
    if (target) {
      ring.classList.add('active');
      dot.classList.add('active');
    } else {
      ring.classList.remove('active');
      dot.classList.remove('active');
    }
  });
})();

/* ═══════════════════════════════════
   4. SCROLL PROGRESS BAR
   ═══════════════════════════════════ */
function updateProgress() {
  if (!scrollProgress) return;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (h > 0) scrollProgress.style.transform = `scaleX(${window.scrollY / h})`;
}

/* ═══════════════════════════════════
   5. SMART NAVBAR
   ═══════════════════════════════════ */
let lastY = 0, navTick = false;
function handleNav() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 70);
  if (y > lastY && y > 300) navbar.classList.add('hidden');
  else navbar.classList.remove('hidden');
  lastY = y;
  navTick = false;
}
window.addEventListener('scroll', () => {
  updateProgress();
  if (!navTick) { requestAnimationFrame(handleNav); navTick = true; }
}, { passive: true });

/* Active link */
function updateActive() {
  const pos = window.scrollY + 160;
  sections.forEach(s => {
    const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
    if (link) {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}
window.addEventListener('scroll', updateActive, { passive: true });

/* Mobile Menu */
menuToggle.addEventListener('click', () => { menuToggle.classList.toggle('active'); navMenu.classList.toggle('active'); });
navLinks.forEach(l => l.addEventListener('click', () => { menuToggle.classList.remove('active'); navMenu.classList.remove('active'); }));

/* Theme Toggle */
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
}
setTheme(localStorage.getItem('theme') || 'dark');
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ═══════════════════════════════════
   6. SCROLL ANIMATIONS
   ═══════════════════════════════════ */
const animObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('.animate-on-scroll, .anim-left, .anim-right, .anim-scale').forEach(el => animObs.observe(el));

/* ═══════════════════════════════════
   7. COUNTER ANIMATION
   ═══════════════════════════════════ */
const counters = document.querySelectorAll('.stat-number[data-count]');
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 2000, t0 = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    cntObs.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(el => cntObs.observe(el));

/* Typing Effect */
const typingEl = document.getElementById('typing-text');
const roles = ['AI & DS Student', 'Aspiring Full Stack Developer', 'AI Enthusiast', 'Problem Solver'];
let rIdx = 0, cIdx = 0, del = false;
function typeLoop() {
  const c = roles[rIdx];
  typingEl.textContent = c.substring(0, del ? cIdx-- : cIdx++);
  let s = del ? 30 : 65;
  if (!del && cIdx === c.length + 1) { s = 2500; del = true; }
  else if (del && cIdx < 0) { del = false; rIdx = (rIdx + 1) % roles.length; s = 500; }
  setTimeout(typeLoop, s);
}
typeLoop();

/* ═══════════════════════════════════
   8. 3D TILT on Project Cards
   ═══════════════════════════════════ */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  // Dynamically wrap project card children in a .project-card-inner div
  // so we can apply 3D tilt to the inner wrapper and spherical scrolling to the outer card.
  document.querySelectorAll('.project-card').forEach(card => {
    if (card.querySelector('.project-card-inner')) return; // Avoid double wrapping
    const inner = document.createElement('div');
    inner.className = 'project-card-inner';
    while (card.firstChild) {
      inner.appendChild(card.firstChild);
    }
    card.appendChild(inner);
  });

  document.querySelectorAll('.project-card').forEach(card => {
    const inner = card.querySelector('.project-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `perspective(700px) rotateX(${y * -14}deg) rotateY(${x * 14}deg) scale(1.03)`;
    });
    card.addEventListener('mouseenter', () => { inner.style.transition = 'none'; });
    card.addEventListener('mouseleave', () => {
      inner.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      inner.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
    });
  });
})();

/* ═══════════════════════════════════
   9. CARD GLOW FOLLOW (visible light on hover)
   ═══════════════════════════════════ */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.glow-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--glow-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--glow-y', (e.clientY - r.top) + 'px');
    });
  });
})();

/* ═══════════════════════════════════
   10. MAGNETIC BUTTONS
   ═══════════════════════════════════ */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2;
      const dy = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`;
    });
    btn.addEventListener('mouseenter', () => { btn.style.transition = 'box-shadow 0.5s ease'; });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();

/* ═══════════════════════════════════
   11. BUTTON RIPPLE EFFECT
   ═══════════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  });
});

/* ═══════════════════════════════════
   12. HERO PARALLAX
   ═══════════════════════════════════ */
(function () {
  const bgText = document.querySelector('.hero-bg-text');
  const hero = document.querySelector('.hero');
  if (!bgText || !hero) return;
  let pTick = false;
  window.addEventListener('scroll', () => {
    if (pTick) return;
    pTick = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < hero.offsetHeight * 1.2) {
        bgText.style.transform = `translate(-50%, calc(-50% + ${y * 0.35}px))`;
      }
      pTick = false;
    });
  }, { passive: true });
})();

/* Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════
   13. EMAILJS CONTACT FORM
   ═══════════════════════════════════ */
const EJS_KEY = 'tEMj75LhaUCDRm58J';
const EJS_SVC = 'service_yt8xf1l';
const EJS_TPL = 'template_kegp27r';

function validateForm() {
  let ok = true;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    const g = el.closest('.form-group');
    const v = el.value.trim();
    if (!v || (id === 'email' && !re.test(v))) { g.classList.add('error'); ok = false; }
    else g.classList.remove('error');
  });
  return ok;
}
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formStatus.className = 'form-status'; formStatus.style.display = 'none';
  if (!validateForm()) return;
  const btn = contactForm.querySelector('button[type="submit"]');
  const sp = btn.querySelector('span:first-child');
  btn.disabled = true;
  if (sp) sp.textContent = 'Sending...';
  emailjs.send(EJS_SVC, EJS_TPL, {
    from_name: document.getElementById('name').value,
    from_email: document.getElementById('email').value,
    message: document.getElementById('message').value,
  }).then(() => {
    formStatus.textContent = '✅ Message sent successfully!';
    formStatus.className = 'form-status success'; formStatus.style.display = 'block';
    contactForm.reset();
  }).catch(() => {
    formStatus.textContent = '❌ Failed to send. Please try again.';
    formStatus.className = 'form-status error'; formStatus.style.display = 'block';
  }).finally(() => { btn.disabled = false; if (sp) sp.textContent = 'Send Message'; });
});

/* ═══════════════════════════════════
   14. ACHIEVEMENT MODAL
   ═══════════════════════════════════ */
(function () {
  const modal = document.getElementById('achievement-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;
  const $ = id => document.getElementById(id);
  const modalBody = modal.querySelector('.achievement-modal-body');



  function open(c) {
    $('modal-icon').textContent = c.dataset.icon;
    $('modal-image-icon').textContent = c.dataset.icon;
    $('modal-image').style.background = c.dataset.image;
    $('modal-title').textContent = c.dataset.title;
    $('modal-date').textContent = c.dataset.date;
    $('modal-desc').textContent = c.dataset.description;

    // Reset scroll position to top when opening modal
    if (modalBody) {
      modalBody.scrollTop = 0;
    }

    // Populate certificate grid gallery if present
    const gallery = $('modal-gallery');
    const grid = $('modal-gallery-grid');
    if (gallery && grid) {
      if (c.dataset.grid) {
        try {
          const items = JSON.parse(c.dataset.grid);
          if (items && items.length > 0) {
            grid.innerHTML = items.map((item, idx) => {
              const hasImg = item.bg && item.bg.includes('url(');
              const imgSrc = hasImg ? item.bg.replace(/url\(['\"]?|['\"]?\)/g, '') : '';
              return `
                <div class="gallery-item" ${hasImg ? `data-certificate-src="${imgSrc}" style="cursor: pointer;"` : ''}>
                  <div class="gallery-img-placeholder">
                    ${hasImg ? `<img id="gallery-img-${idx}" src="" alt="${item.title}" class="gallery-img" />` : (item.icon || '📜')}
                  </div>
                  <div class="gallery-info">
                    <h5>${item.title}</h5>
                    <p>${item.desc}</p>
                  </div>
                </div>
              `;
            }).join('');
            gallery.style.display = 'block';

            // Decode and fade in images asynchronously to prevent layout/scroll jank
            items.forEach((item, idx) => {
              const imgEl = document.getElementById(`gallery-img-${idx}`);
              if (!imgEl) return;

              const hasImg = item.bg && item.bg.includes('url(');
              if (hasImg) {
                const imgSrc = item.bg.replace(/url\(['\"]?|['\"]?\)/g, '');
                const img = new Image();
                img.src = imgSrc;
                if (img.decode) {
                  img.decode().then(() => {
                    imgEl.src = imgSrc;
                    imgEl.classList.add('loaded');
                  }).catch(err => {
                    console.warn("Failed to decode image asynchronously:", err);
                    imgEl.src = imgSrc;
                    imgEl.classList.add('loaded');
                  });
                } else {
                  // Fallback for browsers that do not support Image.decode()
                  img.onload = () => {
                    imgEl.src = imgSrc;
                    imgEl.classList.add('loaded');
                  };
                  img.onerror = () => {
                    imgEl.classList.add('loaded');
                  };
                }
              }
            });

            // Add click event to each item that has a certificate source
            grid.querySelectorAll('.gallery-item[data-certificate-src]').forEach(item => {
              item.addEventListener('click', (e) => {
                e.stopPropagation(); // Avoid triggering parent clicks
                openLightbox(item.dataset.certificateSrc);
              });
            });
          } else {
            gallery.style.display = 'none';
          }
        } catch (err) {
          console.error("Error parsing certificate grid JSON:", err);
          gallery.style.display = 'none';
        }
      } else {
        gallery.style.display = 'none';
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const gallery = $('modal-gallery');
    if (gallery) gallery.style.display = 'none';
  }

  // Lightbox Modal logic
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src) {
    if (lightbox && lightboxImg) {
      lightboxImg.src = src;
      lightbox.classList.add('active');
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      if (lightboxImg) lightboxImg.src = ''; // Clear image src
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.querySelectorAll('.achievement-card').forEach(c => c.addEventListener('click', () => open(c)));
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      } else if (modal.classList.contains('active')) {
        close();
      }
    }
  });

  // Pre-decode all achievements certificates in background after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.achievement-card').forEach(card => {
        if (card.dataset.grid) {
          try {
            const items = JSON.parse(card.dataset.grid);
            items.forEach(item => {
              if (item.bg && item.bg.includes('url(')) {
                const imgSrc = item.bg.replace(/url\(['\"]?|['\"]?\)/g, '');
                const img = new Image();
                img.src = imgSrc;
                if (img.decode) {
                  img.decode().catch(() => { });
                }
              }
            });
          } catch (e) { }
        }
      });
    }, 1500);
  });
})();

/* Back-to-Top Button logic removed */

/* ═══════════════════════════════════
   16. BACKGROUND ORB PARALLAX
   ═══════════════════════════════════ */
(function () {
  const meshContainers = document.querySelectorAll('.mesh-parallax');
  if (!meshContainers.length) return;

  let tick = false;
  window.addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      meshContainers.forEach(container => {
        const speedAttr = container.getAttribute('style');
        const match = speedAttr.match(/--speed:\s*(-?[\d.]+)/);
        if (match) {
          const speed = parseFloat(match[1]);
          container.style.transform = `translateY(${y * speed}px)`;
        }
      });
      tick = false;
    });
  }, { passive: true });
})();

/* ═══════════════════════════════════
   17. SECTION SCROLL PARALLAX
   ═══════════════════════════════════ */
(function () {
  if (window.innerWidth <= 768) return;

  const sections = document.querySelectorAll('section[id]');
  if (!sections.length) return;

  const speedMap = {
    'hero': 0.22,
    'about': 0.15,
    'skills': 0.12,
    'projects': 0.16,
    'internships': 0.12,
    'education': 0.15,
    'achievements': 0.14,
    'contact': 0.18
  };

  const items = Array.from(sections).map(sec => {
    const container = sec.querySelector('.container');
    const speed = speedMap[sec.id] || 0.15;
    return {
      sec,
      container,
      speed,
      targetY: 0,
      currentY: 0,
      targetScale: 1,
      currentScale: 1
    };
  });

  let isRunning = false;

  function updateParallax() {
    const viewportHeight = window.innerHeight;
    let needsMoreFrames = false;

    items.forEach(item => {
      if (!item.container) return;

      const rect = item.sec.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) {
        item.targetY = rect.top * item.speed;
        const progress = Math.min(Math.abs(rect.top) / viewportHeight, 1);
        item.targetScale = 1 - progress * 0.05;
      }
    });

    items.forEach(item => {
      if (!item.container) return;

      const diffY = item.targetY - item.currentY;
      const diffScale = item.targetScale - item.currentScale;

      if (Math.abs(diffY) > 0.05 || Math.abs(diffScale) > 0.001) {
        item.currentY += diffY * 0.12;
        item.currentScale += diffScale * 0.12;
        item.container.style.transform = `translate3d(0, ${item.currentY}px, 0) scale(${item.currentScale})`;
        needsMoreFrames = true;
      } else {
        item.currentY = item.targetY;
        item.currentScale = item.targetScale;
        item.container.style.transform = `translate3d(0, ${item.targetY}px, 0) scale(${item.targetScale})`;
      }
    });

    if (needsMoreFrames) {
      requestAnimationFrame(updateParallax);
    } else {
      isRunning = false;
    }
  }

  window.addEventListener('scroll', () => {
    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });

  isRunning = true;
  requestAnimationFrame(updateParallax);
})();

/* ═══════════════════════════════════
   18. PROJECTS CAROUSEL
   ═══════════════════════════════════ */
(function () {
  const grid = document.getElementById('projects-grid');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!grid || !dotsContainer) return;

  let isJumping = false;
  let scrollTimeout = null;

  const prevBtn = document.getElementById('proj-prev');
  const nextBtn = document.getElementById('proj-next');

  const cards = grid.querySelectorAll('.project-card');
  if (!cards.length) return;

  // Clone cards for infinite loop scrolling
  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);
  grid.appendChild(firstClone);
  grid.insertBefore(lastClone, cards[0]);

  // Init hover effects (tilt and glow) on clones
  initCloneEffects(firstClone);
  initCloneEffects(lastClone);

  function initCloneEffects(card) {
    if (window.matchMedia('(hover: none)').matches) return;
    const inner = card.querySelector('.project-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `perspective(700px) rotateX(${y * -14}deg) rotateY(${x * 14}deg) scale(1.03)`;
    });
    card.addEventListener('mouseenter', () => { inner.style.transition = 'none'; });
    card.addEventListener('mouseleave', () => {
      inner.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      inner.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
    });
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--glow-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--glow-y', (e.clientY - r.top) + 'px');
    });
  }

  // Set initial scroll to first real card (index 1)
  scrollToCard(1, 'auto');
  window.addEventListener('load', () => {
    scrollToCard(1, 'auto');
  });

  // Dynamically generate pagination dots
  cards.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot${idx === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to project ${idx + 1}`);
    dot.addEventListener('click', () => {
      scrollToCard(idx + 1);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  function getActiveCardIndex() {
    const scrollLeft = grid.scrollLeft;
    const containerWidth = grid.clientWidth;
    const allCards = grid.querySelectorAll('.project-card');
    
    let closestIdx = 1;
    let minDistance = Infinity;

    allCards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const viewportCenter = scrollLeft + containerWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    return closestIdx;
  }

  function scrollToCard(idx, behavior = 'smooth') {
    const allCards = grid.querySelectorAll('.project-card');
    if (!allCards[idx]) return;
    const card = allCards[idx];
    const containerWidth = grid.clientWidth;
    const cardWidth = card.clientWidth;
    const cardLeft = card.offsetLeft;
    const targetLeft = cardLeft - (containerWidth - cardWidth) / 2;
    
    // Temporarily turn off scroll-snap to prevent browser fighting during instant snaps
    if (behavior === 'auto') {
      grid.style.scrollSnapType = 'none';
      grid.scrollTo({
        left: targetLeft,
        behavior: 'auto'
      });
      
      // Let layout update first, then restore snapping in next frame
      requestAnimationFrame(() => {
        grid.style.scrollSnapType = 'x mandatory';
      });
    } else {
      grid.scrollTo({
        left: targetLeft,
        behavior: behavior
      });
    }
  }



  // Autoplay functionality
  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 3000; // Auto scroll every 3 seconds

  function startAutoplay() {
    if (autoplayInterval) return;
    autoplayInterval = setInterval(() => {
      const activeIdx = getActiveCardIndex();
      scrollToCard(activeIdx + 1);
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Start autoplay initially
  startAutoplay();

  // Pause on hover or touch interactions
  const carouselContainer = document.querySelector('.projects-carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);
    carouselContainer.addEventListener('touchstart', stopAutoplay, { passive: true });
    carouselContainer.addEventListener('touchend', startAutoplay, { passive: true });
  }

  // Previous button click
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const activeIdx = getActiveCardIndex();
      scrollToCard(activeIdx - 1);
      resetAutoplay();
    });
  }

  // Next button click
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const activeIdx = getActiveCardIndex();
      scrollToCard(activeIdx + 1);
      resetAutoplay();
    });
  }

  function updateDots() {
    const activeIdx = getActiveCardIndex();
    let dotIdx = activeIdx - 1;
    if (dotIdx < 0) dotIdx = cards.length - 1;
    if (dotIdx >= cards.length) dotIdx = 0;

    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === dotIdx);
    });
  }

  function handleLoopJump() {
    if (isJumping) return;

    const allCards = grid.querySelectorAll('.project-card');
    const activeIdx = getActiveCardIndex();

    if (activeIdx === 0) {
      isJumping = true;
      scrollToCard(cards.length, 'auto');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isJumping = false;
        });
      });
    } else if (activeIdx === allCards.length - 1) {
      isJumping = true;
      scrollToCard(1, 'auto');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isJumping = false;
        });
      });
    }
  }

  grid.addEventListener('scroll', () => {
    // Update dots active status in real-time
    updateDots();

    // Debounce loop jump to run only when scroll has settled
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      handleLoopJump();
    }, 150);
  }, { passive: true });
})();





