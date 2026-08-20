// ===== COOKIE CONSENT BANNER =====
(function () {
    if (localStorage.getItem('cookieConsent')) return;
    document.addEventListener('DOMContentLoaded', function () {
        var lang = localStorage.getItem('siteLang') || new URLSearchParams(window.location.search).get('lang') || 'it';
        var t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};
        var cookieText = t.cookie_text || 'Questo sito usa solo cookie tecnici necessari al funzionamento e a salvare la lingua scelta. Nessun cookie di profilazione. Per maggiori dettagli vedi la ';
        var cookieRejectText = t.cookie_reject || 'Solo essenziali';
        var cookieAcceptText = t.cookie_accept || 'Ho capito';
        var banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.innerHTML = '<div class="cookie-banner-inner">' +
            '<p>' + cookieText + '<a href="cookie.html">Cookie Policy</a> e la <a href="privacy.html">Privacy Policy</a>.</p>' +
            '<div class="cookie-banner-actions">' +
            '<button type="button" class="btn btn-small btn-outline" id="cookieReject">' + cookieRejectText + '</button>' +
            '<button type="button" class="btn btn-small" id="cookieAccept">' + cookieAcceptText + '</button>' +
            '</div></div>';
        document.body.appendChild(banner);
        function close(v) {
            try { localStorage.setItem('cookieConsent', v); } catch (e) {}
            banner.classList.add('cookie-banner-out');
            setTimeout(function () { banner.remove(); }, 300);
        }
        document.getElementById('cookieAccept').addEventListener('click', function () { close('accepted'); });
        document.getElementById('cookieReject').addEventListener('click', function () { close('essential'); });
    });
})();


document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('open'));
    });

    // ===== NAV DROPDOWNS =====
    const dropdowns = navMenu.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.nav-dropdown-btn');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('open');
            // Close all
            dropdowns.forEach(d => {
                d.classList.remove('open');
                d.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
            });
            // Toggle this one
            if (!isOpen) {
                dropdown.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Close dropdowns and mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            dropdowns.forEach(d => {
                d.classList.remove('open');
                d.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
            });
            navMenu.classList.remove('open');
        }
    });

    // Close dropdowns when clicking inside menu but outside any dropdown
    navMenu.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(d => {
                d.classList.remove('open');
                d.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Close dropdown when a submenu link is clicked (mobile)
    navMenu.querySelectorAll('.nav-submenu a').forEach(link => {
        link.addEventListener('click', () => {
            dropdowns.forEach(d => {
                d.classList.remove('open');
                d.querySelector('.nav-dropdown-btn').setAttribute('aria-expanded', 'false');
            });
            navMenu.classList.remove('open');
        });
    });

    // ===== LANGUAGE SWITCHER =====
    let currentLang = localStorage.getItem('siteLang') || 'it';
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && translations[urlLang]) {
        currentLang = urlLang;
        localStorage.setItem('siteLang', urlLang);
    }
    document.documentElement.lang = currentLang;
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === currentLang);
    });
    applyTranslations(currentLang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang === currentLang) return;
            currentLang = lang;
            localStorage.setItem('siteLang', lang);
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.documentElement.lang = lang;
            applyTranslations(lang);
        });
    });

    function applyTranslations(lang) {
        const t = translations[lang];
        if (!t) return;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.innerHTML = t[key];
                }
            }
        });
    }
    window.applyTranslations = applyTranslations;

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    // ===== HERO ROTATING BACKGROUND =====
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const heroImages = [
            'assets/anna-motsonelidze-BawFH-5wr0g-unsplash.jpg',
            'assets/samuele-bertoli-Xb01dmvNbUo-unsplash.jpg',
            'assets/firenze-hero.jpg',
            'assets/siena-hero.jpg'
        ];
        const slides = heroImages.map((src, i) => {
            const s = document.createElement('div');
            s.className = 'hero-bg-slide';
            s.style.backgroundImage = `url('${src}')`;
            if (i === 0) s.classList.add('is-active');
            heroBg.appendChild(s);
            const pre = new Image(); pre.src = src;
            return s;
        });
        let heroIdx = 0;
        setInterval(() => {
            slides[heroIdx].classList.remove('is-active');
            heroIdx = (heroIdx + 1) % slides.length;
            slides[heroIdx].classList.add('is-active');
        }, 4000);
    }

    // ===== HERO PARTICLES =====
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // ===== GALLERY LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCaption = document.getElementById('lightboxCaption');
        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentImageIndex = 0;
        const galleryImages = [];

        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption');
            galleryImages.push({
                src: img.src,
                alt: img.alt,
                caption: caption ? caption.textContent : ''
            });
            item.addEventListener('click', () => openLightbox(index));
        });

        function openLightbox(index) {
            currentImageIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightbox() {
            const img = galleryImages[currentImageIndex];
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.textContent = img.caption;
        }

        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-prev').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightbox();
        });
        document.querySelector('.lightbox-next').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightbox();
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                updateLightbox();
            }
            if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                updateLightbox();
            }
        });
    }

    // ===== VIDEO LAZY LOAD =====
    document.querySelectorAll('.video-placeholder').forEach(placeholder => {
        placeholder.addEventListener('click', () => {
            const videoId = placeholder.dataset.videoId;
            if (!videoId || videoId.startsWith('YOUR_')) return;
            const wrapper = placeholder.parentElement;
            wrapper.style.position = 'relative';
            wrapper.style.paddingBottom = '56.25%';
            wrapper.style.height = '0';
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&origin=${location.origin}`;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border-radius:12px;';
            iframe.onerror = () => {
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
            };
            placeholder.replaceWith(iframe);
            setTimeout(() => {
                try {
                    if (!iframe.contentWindow) {
                        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                    }
                } catch(e) {}
            }, 3000);
        });
    });

    // ===== TESTIMONIALS SLIDER =====
    const track = document.querySelector('.testimonial-track');
    const dotsContainer = document.querySelector('.testimonial-dots');
    if (track && dotsContainer) {
        const cards = document.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        const totalSlides = cards.length;

        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            document.querySelectorAll('.testimonial-dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        }

        document.querySelector('.testimonial-btn.prev').addEventListener('click', () => {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        });
        document.querySelector('.testimonial-btn.next').addEventListener('click', () => {
            goToSlide((currentSlide + 1) % totalSlides);
        });

        setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 6000);
    }

    // ===== IMAGE LAZY LOAD FADE-IN =====
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => img.classList.add('loaded'));
        }
    });

    // ===== SMOOTH SCROLL for nav links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
