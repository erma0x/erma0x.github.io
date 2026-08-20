// Shared navbar — injected on every page that includes this script.
// Provides a single cycling language toggle (IT → EN → RU → IT).
(function () {
    const FLAGS = {
        it: '<svg viewBox="0 0 640 480" width="24" height="16" aria-hidden="true"><rect width="213.3" height="480" fill="#009246"/><rect x="213.3" width="213.3" height="480" fill="#fff"/><rect x="426.6" width="213.4" height="480" fill="#CE2B37"/></svg>',
        en: '<svg viewBox="0 0 640 480" width="24" height="16" aria-hidden="true"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/><path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/><path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/><path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/></svg>',
        ru: '<svg viewBox="0 0 640 480" width="24" height="16" aria-hidden="true"><rect width="640" height="160" fill="#fff"/><rect y="160" width="640" height="160" fill="#0039A6"/><rect y="320" width="640" height="160" fill="#D52B1E"/></svg>'
    };
    const LANG_LABEL = { it: 'IT', en: 'EN', ru: 'RU' };
    const ORDER = ['it', 'en', 'ru'];

    const template = `
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="index.html#hero" class="nav-logo" data-i18n="brand_name">Elena Koulakova</a>
            <button class="nav-toggle" id="navToggle" aria-label="Menu">
                <span></span><span></span><span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="arte.html" data-i18n="nav_arte">Arte &amp; Storia</a></li>
                <li><a href="archeologia.html" data-i18n="nav_archeologia">Archeologia</a></li>
                <li><a href="enogastronomia.html" data-i18n="nav_enogastronomia">Enogastronomia &amp; Vino</a></li>
                <li><a href="eventi.html" data-i18n="nav_eventi">Eventi storici</a></li>
                <li class="nav-dropdown">
                    <button class="nav-dropdown-btn" aria-expanded="false">
                        <span data-i18n="nav_group_guida">Guida Turistica</span>
                        <svg class="nav-dropdown-arrow" viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
                    </button>
                    <ul class="nav-submenu">
                        <li><a href="index.html#contact" data-i18n="nav_contact">Contatti</a></li>
                        <li><a href="chi-sono.html" data-i18n="nav_about">Chi sono</a></li>
                        <li><a href="certificati.html" data-i18n="nav_certificati">Licenze</a></li>
                        <li><a href="index.html#testimonials" data-i18n="nav_testimonials">Recensioni</a></li>
                        <li><a href="galleria.html" data-i18n="nav_gallery">Galleria</a></li>
                        <li><a href="index.html#videos" data-i18n="nav_videos">Video</a></li>
                        <li><a href="index.html#social" data-i18n="nav_social">Social</a></li>
                        <li><a href="index.html#findme" data-i18n="nav_findme">Dove trovarmi</a></li>
                    </ul>
                </li>
            </ul>
            <div class="lang-switcher">
                <button class="lang-toggle" id="langToggle" aria-label="Language" aria-haspopup="listbox" aria-expanded="false">
                    <span class="lang-toggle-flag"></span>
                    <span class="lang-toggle-label"></span>
                    <svg class="lang-toggle-arrow" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
                </button>
                <ul class="lang-menu" id="langMenu" role="listbox" aria-label="Language">
                    <li role="option" data-lang="it"><span class="lang-menu-flag"></span><span class="lang-menu-label">Italiano</span></li>
                    <li role="option" data-lang="en"><span class="lang-menu-flag"></span><span class="lang-menu-label">English</span></li>
                    <li role="option" data-lang="ru"><span class="lang-menu-flag"></span><span class="lang-menu-label">Русский</span></li>
                </ul>
            </div>
        </div>
    </nav>`;

    function inject() {
        const existing = document.getElementById('navbar');
        const mount = document.getElementById('site-nav-mount');
        if (mount) {
            mount.outerHTML = template;
            if (existing) existing.remove();
        } else if (existing) {
            existing.outerHTML = template;
        } else {
            document.body.insertAdjacentHTML('afterbegin', template);
        }
        setupLangToggle();
    }

    function setupLangToggle() {
        const btn = document.getElementById('langToggle');
        const menu = document.getElementById('langMenu');
        if (!btn || !menu) return;
        const flagEl = btn.querySelector('.lang-toggle-flag');
        const labelEl = btn.querySelector('.lang-toggle-label');

        function currentLang() {
            const url = new URLSearchParams(window.location.search).get('lang');
            if (url && ORDER.includes(url)) return url;
            return localStorage.getItem('siteLang') || 'it';
        }
        function render(lang) {
            flagEl.innerHTML = FLAGS[lang];
            labelEl.textContent = LANG_LABEL[lang];
            btn.setAttribute('data-lang', lang);
            btn.setAttribute('aria-label', 'Language: ' + LANG_LABEL[lang]);
            menu.querySelectorAll('[data-lang]').forEach(li => {
                const l = li.getAttribute('data-lang');
                li.classList.toggle('active', l === lang);
                li.setAttribute('aria-selected', l === lang ? 'true' : 'false');
                const f = li.querySelector('.lang-menu-flag');
                if (f && !f.innerHTML) f.innerHTML = FLAGS[l];
            });
        }
        render(currentLang());

        function closeMenu() {
            menu.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
        function openMenu() {
            menu.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menu.classList.contains('open')) closeMenu(); else openMenu();
        });

        menu.addEventListener('click', (e) => {
            const li = e.target.closest('[data-lang]');
            if (!li) return;
            const next = li.getAttribute('data-lang');
            if (!ORDER.includes(next)) return;
            localStorage.setItem('siteLang', next);
            document.documentElement.lang = next;
            render(next);
            closeMenu();
            if (typeof window.applyTranslations === 'function') {
                window.applyTranslations(next);
            } else {
                location.reload();
            }
        });

        document.addEventListener('click', (e) => {
            if (!menu.classList.contains('open')) return;
            if (!e.target.closest('.lang-switcher')) closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();
