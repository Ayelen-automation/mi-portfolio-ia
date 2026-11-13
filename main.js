let currentLang = 'es';
let translations = {};

// ── Cambio de idioma ──────────────────────────────────────────
async function loadTranslations(lang) {
    try {
        const response = await fetch(`/lang/${lang}.json`);
        if (!response.ok) throw new Error('Fetch failed');
        translations = await response.json();
        applyTranslations();
        // Para el idioma EN renderizamos los proyectos en inglés en el div
        // Para ES el HTML ya tiene el contenido correcto en español
        if (lang === 'en') {
            renderProjectsEN();
        } else {
            renderProjectsES();
        }
    } catch (error) {
        // Si falla el fetch, el contenido HTML estático en español sigue visible
        console.warn('i18n fetch failed — static HTML content remains visible.', error);
    }
}

function applyTranslations() {
    if (translations.title) {
        document.title = translations.title;
    }
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations;
        keys.forEach(k => { value = value ? value[k] : null; });
        if (value) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else {
                el.textContent = value;
            }
        }
    });
}

function renderProjectsES() {
    const list = document.getElementById('project-list-dynamic');
    if (!list) return;
    list.innerHTML = '';
}

function renderProjectsEN() {
    // For English, inject translated project cards
    const grid = document.querySelector('#projects .project-grid');
    if (!grid || !translations.projects) return;

    const pKeys = ['p1','p2','p3','p4','p5'];
    const images = {
        p1: './n8n-1.png', p2: './n8n-3.png', p3: './n8n-2.png',
        p4: './n8n-4.png', p5: null
    };

    grid.innerHTML = pKeys.map(key => {
        const p = translations.projects[key];
        if (!p) return '';

        const imgHtml = images[key]
            ? `<div class="project-img-wrapper"><a href="${images[key]}" target="_blank" rel="noopener noreferrer" class="project-img-link" title="Click to view full workflow in HD"><img src="${images[key]}" alt="${p.title}" class="project-img" loading="lazy"></a></div>`
            : '';

        const badgeHtml = p.badge
            ? `<span class="badge-demo">${p.badge}</span>`
            : `<span class="label">Self-managed project</span>`;

        const linkedinBtn = p.linkedinUrl
            ? `<div class="project-action-btn"><a href="${p.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline"><i class="fab fa-linkedin"></i> ${p.linkedinBtn}</a></div>`
            : '';

        return `
            <div class="glass project-card animate-fade-in">
                ${imgHtml}
                <div class="project-card-body">
                    ${badgeHtml}
                    <h3>${p.title}</h3>
                    <p><strong>Challenge:</strong> ${p.problem}</p>
                    <p><strong>Solution:</strong> ${p.automation}</p>
                    <p class="tools">⚙ ${p.tools}</p>
                    <p><strong>Result:</strong> ${p.result}</p>
                    <p class="result-highlight">✦ ${p.benefit}</p>
                    ${linkedinBtn}
                </div>
            </div>`;
    }).join('');
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    document.documentElement.lang = currentLang;
    const langBtn = document.getElementById('lang-switch');
    if (langBtn) langBtn.textContent = currentLang === 'en' ? 'EN / ES' : 'ES / EN';

    if (currentLang === 'es') {
        // Reload page in Spanish = reload the static HTML
        location.reload();
    } else {
        loadTranslations('en');
    }
}

// ── Navbar scroll ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Contact form ──────────────────────────────────────────────
function handleForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn  = document.getElementById('form-btn');
        const fb   = document.getElementById('form-feedback');

        btn.textContent = 'Enviando…';
        btn.disabled = true;

        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
        .then(res => {
            btn.disabled = false;
            btn.textContent = 'Enviar Mensaje';
            if (res.ok) {
                fb.textContent = '¡Muchas gracias! Tu mensaje fue enviado correctamente.';
                fb.style.color = '#4ade80';
                fb.style.display = 'block';
                form.reset();
            } else {
                fb.textContent = 'Hubo un error al enviar. Escribime por WhatsApp o email directamente.';
                fb.style.color = 'var(--accent-pink)';
                fb.style.display = 'block';
            }
        })
        .catch(() => {
            btn.disabled = false;
            btn.textContent = 'Enviar Mensaje';
            fb.textContent = 'Sin conexión. Escribime por WhatsApp o email.';
            fb.style.color = 'var(--accent-pink)';
            fb.style.display = 'block';
        });
    });
}

// ── Mobile menu ───────────────────────────────────────────────
function setupMobileMenu() {
    const btn   = document.getElementById('mobile-menu-btn');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        links.classList.toggle('active');
    });

    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            btn.classList.remove('active');
            links.classList.remove('active');
        });
    });
}

// ── Scroll reveal ─────────────────────────────────────────────
function setupReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.02, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── Smooth scroll ─────────────────────────────────────────────
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ── Hero canvas particles ─────────────────────────────────────
function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [], w, h;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }

    class Particle {
        constructor() {
            this.x  = Math.random() * w;
            this.y  = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.r  = Math.random() * 2;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(217,70,239,0.5)';
            ctx.fill();
        }
    }

    function init() { particles = []; for (let i = 0; i < 80; i++) particles.push(new Particle()); }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p, i) => {
            p.update(); p.draw();
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x, dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(217,70,239,${0.6*(1-dist/180)})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize(); init(); animate();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lang-switch')?.addEventListener('click', toggleLanguage);
    setupMobileMenu();
    setupReveal();
    setupSmoothScroll();
    handleForm();
    initHeroAnimation();
});
