let currentLang = 'es';
let translations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/lang/${lang}.json`);
        translations = await response.json();
        renderProjects();
        applyTranslations();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function renderProjects() {
    const list = document.getElementById('project-list');
    if (!list) return;

    list.innerHTML = '';
    const projectKeys = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

    projectKeys.forEach(key => {
        const p = translations.projects ? translations.projects[key] : null;
        if (!p) return;
        const card = document.createElement('div');
        card.className = 'glass project-card animate-fade-in';
        card.innerHTML = `
            <span class="label">Case Study</span>
            <h3>${p.title}</h3>
            <p><strong>Problem:</strong> ${p.problem}</p>
            <p><strong>Automation:</strong> ${p.automation}</p>
            <p class="tools"><strong>Tools:</strong> ${p.tools}</p>
            <p><strong>Result:</strong> ${p.result}</p>
            <p style="color: #fff; font-weight: 600;">Benefit: ${p.benefit}</p>
        `;
        list.appendChild(card);
    });
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations;
        keys.forEach(k => {
            value = value ? value[k] : null;
        });
        if (value) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else {
                el.innerText = value;
            }
        }
    });
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    loadTranslations(currentLang);
}

// Navbar scroll logic
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Form logic
function handleForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('form-btn');
        const feedback = document.getElementById('form-feedback');

        btn.innerText = translations.contact.sending;
        btn.disabled = true;

        const data = new FormData(form);
        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            btn.innerText = translations.contact.send;
            btn.disabled = false;
            if (response.ok) {
                feedback.innerText = translations.contact.success;
                feedback.style.display = 'block';
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        feedback.innerText = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        feedback.innerText = "Oops! Correlation error.";
                    }
                    feedback.style.color = "var(--accent-pink)";
                    feedback.style.display = 'block';
                });
            }
        }).catch(error => {
            btn.innerText = translations.contact.send;
            btn.disabled = false;
            feedback.innerText = "Oops! There was a problem submitting your form";
            feedback.style.color = "var(--accent-pink)";
            feedback.style.display = 'block';
        });
    });
}

// Mobile Menu Logic
function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const links = document.getElementById('nav-links');

    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        links.classList.toggle('active');
    });

    // Close menu when clicking a link
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            links.classList.remove('active');
        });
    });
}

// Reveal Animation on Scroll
function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Smooth Scroll for Nav Links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// Hero Canvas Animation (Neural Network / AI Particles)
function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(58, 134, 255, 0.5)';
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p, i) => {
            p.update();
            p.draw();
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(58, 134, 255, ${0.6 * (1 - dist / 180)})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations(currentLang);
    document.getElementById('lang-switch').addEventListener('click', toggleLanguage);
    setupMobileMenu();
    setupReveal();
    setupSmoothScroll();
    handleForm();
    initHeroAnimation();
});
