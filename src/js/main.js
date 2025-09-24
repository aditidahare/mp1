const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const menuBtn = document.querySelector('.menu-btn');
const linkList = document.getElementById('nav-links');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    linkList?.classList.toggle('show');
  });
}

// ✅ changed selector to match <header id="top" ...>
const header = document.getElementById('top');
const progress = document.getElementById('progress');
const links = Array.from(document.querySelectorAll('#nav-links a[data-target]'));
const sections = Array.from(document.querySelectorAll('section.section, section.hero, section.light'));

function updateUI() {
  if (header) {
    if (window.scrollY > 80) header.classList.add('small');
    else header.classList.remove('small');
  }

  const doc = document.documentElement;
  const sc = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
  if (progress) progress.style.width = (sc * 100) + '%';

  let current = sections[0];
  const rect = header ? header.getBoundingClientRect() : { bottom: 0 };
  const y = window.scrollY + rect.bottom;

  for (const s of sections) {
    const r = s.getBoundingClientRect();
    const top = window.scrollY + r.top;
    const bottom = top + r.height;
    if (top <= y && y < bottom) current = s;
  }
  if (window.innerHeight + window.scrollY >= doc.scrollHeight - 1) {
    current = sections[sections.length - 1];
  }
  const id = current ? current.id : '';
  links.forEach(a => a.classList.toggle('active', a.dataset.target === id));
}

window.addEventListener('scroll', updateUI);
window.addEventListener('resize', updateUI);
updateUI();

links.forEach(a => a.addEventListener('click', () => {
  linkList?.classList.remove('show');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.15 });
document.querySelectorAll('.fade').forEach(el => obs.observe(el));

const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
openModal?.addEventListener('click', () => { modal?.classList.add('show'); modal?.setAttribute('aria-hidden', 'false'); });
closeModal?.addEventListener('click', () => { modal?.classList.remove('show'); modal?.setAttribute('aria-hidden', 'true'); });
modal?.addEventListener('click', (e) => {
  if (e.target === modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); }
});

const track = document.getElementById('car-track');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const dotsWrap = document.getElementById('dots');
const slides = track ? Array.from(track.querySelectorAll('.slide')) : [];
const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.dot')) : [];
let i = 0;

function show(n) {
  if (!track || slides.length === 0) return;
  i = (n + slides.length) % slides.length;
  track.style.transform = `translateX(-${i * 100}%)`;
  slides.forEach((s, k) => s.classList.toggle('current', k === i));
  dots.forEach((d, k) => d.classList.toggle('current', k === i));
}
prev?.addEventListener('click', () => show(i - 1));
next?.addEventListener('click', () => show(i + 1));
dots.forEach((d, k) => d.addEventListener('click', () => show(k)));
let auto = setInterval(() => show(i + 1), 5000);
[prev, next, track, ...dots].forEach(el => el?.addEventListener('mouseenter', () => clearInterval(auto)));
[prev, next, track, ...dots].forEach(el => el?.addEventListener('mouseleave', () => auto = setInterval(() => show(i + 1), 5000)));

const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button');
  const txt = btn?.querySelector('.btn-text');
  if (!btn || !txt) return;
  txt.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    txt.textContent = 'Sent!';
    setTimeout(() => { txt.textContent = 'Send'; btn.disabled = false; form.reset(); }, 900);
  }, 900);
});
