/* ─── THEME TOGGLE ───────────────────────────────────────────────── */
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;
const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);
themeBtn.textContent = saved === 'dark' ? '🌙' : '☀️';

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', next);
});

/* ─── MOBILE MENU ────────────────────────────────────────────────── */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ─── YEAR ───────────────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── TYPEWRITER ─────────────────────────────────────────────────── */
const phrases = [
  'Full Stack Developer',
  'React & Node.js Expert',
  'API Architect',
  'Open Source Contributor',
  'Performance Enthusiast',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const target = document.getElementById('typeTarget');
function type() {
  const phrase = phrases[phraseIdx];
  const cursor = '<span class="cursor"></span>';
  if (!deleting) {
    charIdx++;
    target.innerHTML = phrase.slice(0, charIdx) + cursor;
    if (charIdx === phrase.length) { deleting = true; setTimeout(type, 2200); return; }
  } else {
    charIdx--;
    target.innerHTML = phrase.slice(0, charIdx) + cursor;
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 55 : 90);
}
type();

/* ─── PARTICLE CANVAS ────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const COUNT = 55;
  const CODES = ['<div>', 'fn()', 'const', '=>', '{}', '[]', 'async', 'import', 'type', '404', 'git', 'npm', '// ok'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); this.y = Math.random() * H; }
    reset() {
      this.x = Math.random() * W;
      this.y = H + 20;
      this.speed = 0.3 + Math.random() * 0.6;
      this.opacity = 0.1 + Math.random() * 0.3;
      this.text = CODES[Math.floor(Math.random() * CODES.length)];
      this.size = 9 + Math.random() * 5;
      this.drift = (Math.random() - 0.5) * 0.3;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#7c6af5';
      ctx.font = `${this.size}px Space Mono, monospace`;
      ctx.fillText(this.text, this.x, this.y);
    }
  }

  const particles = [];
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─── SCROLL REVEAL ──────────────────────────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─── SKILL BARS ─────────────────────────────────────────────────── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const wrap = e.target;
    const bars = JSON.parse(wrap.dataset.bars || '[]');
    wrap.innerHTML = bars.map(b => `
      <div class="bar-row">
        <span class="bar-label">${b.label}</span>
        <span class="bar-pct">${b.pct}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" data-pct="${b.pct}"></div>
      </div>
    `).join('');
    requestAnimationFrame(() =>
      wrap.querySelectorAll('.bar-fill').forEach(f =>
        f.style.width = f.dataset.pct + '%'
      )
    );
    barObserver.unobserve(wrap);
  });
}, { threshold: 0.3 });
document.querySelectorAll('[data-bars]').forEach(el => barObserver.observe(el));

/* ─── PROJECT FILTER ─────────────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});

/* ─── VIDEO MODAL ────────────────────────────────────────────────── */
const modal          = document.getElementById('videoModal');
const modalClose     = document.getElementById('modalClose');
const modalTitle     = document.getElementById('modalTitle');
const modalDesc      = document.getElementById('modalDesc');
const modalVideoWrap = document.getElementById('modalVideoWrap');

function openModal(card) {
  const title = card.dataset.title || 'Project Demo';
  const desc  = card.dataset.desc  || '';
  const src   = card.dataset.video || '';

  modalTitle.textContent = title;
  modalDesc.textContent  = desc;

  if (src) {
    modalVideoWrap.innerHTML = `<video src="${src}" controls autoplay style="width:100%;height:100%;"></video>`;
  } else {
    modalVideoWrap.innerHTML = `
      <div style="width:100%;height:100%;min-height:300px;display:flex;flex-direction:column;
                  align-items:center;justify-content:center;gap:14px;
                  background:var(--bg3);color:var(--muted);font-family:var(--mono);">
        <div style="font-size:3rem;">📹</div>
        <p style="font-size:0.85rem;text-align:center;max-width:300px;line-height:1.6;">
          Add your MP4 by setting<br>
          <code style="color:var(--accent);">data-video="your-file.mp4"</code><br>
          on the project card element.
        </p>
      </div>`;
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  const vid = modalVideoWrap.querySelector('video');
  if (vid) { vid.pause(); vid.src = ''; }
  setTimeout(() => { modalVideoWrap.innerHTML = ''; }, 300);
}

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));
});
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ─── HOVER VIDEO PREVIEW ────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  const video = card.querySelector('.project-thumb video');
  if (!video) return;
  card.addEventListener('mouseenter', () => video.play().catch(() => {}));
  card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

/* ─── CONTACT FORM ───────────────────────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  /*
    WIRE UP TO YOUR BACKEND:
    Replace this block with a fetch() to your API endpoint, e.g.:
    fetch('/api/contact', { method: 'POST', body: new FormData(this) })

    Or use Formspree (free):
    Set form action="https://formspree.io/f/YOUR_ID" method="POST"
  */
  this.style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
});

/* ─── NAV ACTIVE STATE ───────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
}, { passive: true });
