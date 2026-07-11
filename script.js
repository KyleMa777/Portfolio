console.log(
    "%c👋 Hi there! Thanks for checking under the hood.\nBased in Toronto? Let's grab a coffee!",
    "font-family: sans-serif; font-size: 16px; font-weight: bold; color: #111; padding: 10px;"
);
console.log(
    "%cBuilt with HTML, CSS, and a bit of curiosity.",
    "font-family: sans-serif; font-size: 12px; color: #555;"
);

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Lightbox (click image to zoom) ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
        const zoomableImages = document.querySelectorAll(
            '.project-image, .phone-frame img, .screen-visual img, .persona-img, ' +
            '.solution-item img, .pivot-item img, .evolution-stage img, .about-photo, ' +
            'img.hover-target'
        );

        zoomableImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            setTimeout(() => { lightboxImg.src = ''; }, 350);
            document.body.style.overflow = '';
        }

        lightbox.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /* ---------- Scroll-reveal fade-in ---------- */
    const fadeEls = document.querySelectorAll(
        '.content-wrapper, .screen-section, .problem-grid, .quote-grid, ' +
        '.persona-grid, .pivot-grid, .testing-insights, .feature-block, ' +
        '.method-flow, .metric-row, .origin-note, .growth-block, ' +
        '.footer-nav, .tldr-card, .project-image, ' +
        '.about-page-grid, .site-footer'
    );

    // Run the reveal only if supported and motion is allowed; otherwise leave
    // everything visible so content is never stuck at opacity:0.
    const prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        fadeEls.forEach(el => el.classList.add('fade-in'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        fadeEls.forEach(el => observer.observe(el));
    }

    /* ---------- Active nav link highlight ---------- */
    const navLinks = document.querySelectorAll('nav .menu-link, nav .menu-pill-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('#')[0];
        if (href === currentPage) {
            link.classList.add('is-current-page');
        }
    });

    /* ---------- Work category filtering with FLIP reflow (home page) ---------- */
    const filterChips = document.querySelectorAll('.filter-chip');
    const projGrid = document.getElementById('projGrid');

    if (filterChips.length && projGrid) {
        const tiles = Array.from(projGrid.querySelectorAll('.proj-card'));
        const prefersReduced = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const applyFilter = (f) => {
            tiles.forEach(tile => {
                const cat = tile.dataset.cat || '';
                // Placeholders only show under "all".
                let show;
                if (cat === 'placeholder') show = (f === 'all');
                else show = (f === 'all' || cat.split(/\s+/).includes(f));
                tile.dataset.shouldHide = show ? 'false' : 'true';
            });
        };

        const runFLIP = (f) => {
            if (prefersReduced) {
                applyFilter(f);
                tiles.forEach(t => t.classList.toggle('is-hidden', t.dataset.shouldHide === 'true'));
                return;
            }
            const first = new Map();
            tiles.forEach(t => { if (!t.classList.contains('is-hidden')) first.set(t, t.getBoundingClientRect()); });

            applyFilter(f);
            tiles.forEach(t => t.classList.toggle('is-hidden', t.dataset.shouldHide === 'true'));

            projGrid.classList.remove('is-animating');
            const last = new Map();
            tiles.forEach(t => { if (!t.classList.contains('is-hidden')) last.set(t, t.getBoundingClientRect()); });

            tiles.forEach(t => {
                const a = first.get(t); const b = last.get(t);
                if (a && b) {
                    const dx = a.left - b.left, dy = a.top - b.top;
                    if (dx || dy) t.style.transform = `translate(${dx}px, ${dy}px)`;
                } else if (!a && b) {
                    t.style.transform = 'scale(0.94)';
                    t.style.opacity = '0';
                }
            });

            requestAnimationFrame(() => {
                projGrid.classList.add('is-animating');
                tiles.forEach(t => {
                    if (!t.classList.contains('is-hidden')) { t.style.transform = ''; t.style.opacity = ''; }
                });
            });

            window.clearTimeout(projGrid._flipTimer);
            projGrid._flipTimer = window.setTimeout(() => projGrid.classList.remove('is-animating'), 650);
        };

        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('is-active'));
                chip.classList.add('is-active');
                runFLIP(chip.dataset.filter);
            });
        });
    }

    /* ---------- Scroll-driven reveal (homepage v2) ---------- */
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-stagger');
    const reduceReveal = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (revealEls.length) {
        if (!('IntersectionObserver' in window) || reduceReveal) {
            revealEls.forEach(el => el.classList.add('in'));
        } else {
            // Group staggered siblings so they cascade.
            const revObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        // Stagger within the same parent group.
                        const parent = el.parentElement;
                        const sibs = Array.from(parent.querySelectorAll(':scope > .reveal-stagger'));
                        const idx = sibs.indexOf(el);
                        el.style.transitionDelay = (idx > 0 ? Math.min(idx * 0.09, 0.5) : 0) + 's';
                        el.classList.add('in');
                        revObserver.unobserve(el);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
            revealEls.forEach(el => revObserver.observe(el));
        }
    }

    /* ---------- Nav solidify on scroll (home) ---------- */
    if (document.body.classList.contains('is-home')) {
        let navTick = false;
        const onNavScroll = () => {
            document.body.classList.toggle('nav-scrolled', window.scrollY > 40);
            navTick = false;
        };
        window.addEventListener('scroll', () => {
            if (!navTick) { window.requestAnimationFrame(onNavScroll); navTick = true; }
        }, { passive: true });
        onNavScroll();
    }

    /* ---------- Pill nav scroll-spy + smooth scroll (home) ---------- */
    const pillLinks = Array.from(document.querySelectorAll('.pill-link'));
    if (pillLinks.length) {
        const sections = pillLinks
            .map(l => document.getElementById(l.dataset.section))
            .filter(Boolean);

        // Smooth scroll on click.
        pillLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const id = link.dataset.section;
                const target = document.getElementById(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.replaceState(null, '', '#' + id);
                }
            });
        });

        // Scroll-spy via IntersectionObserver.
        const setCurrent = (id) => {
            pillLinks.forEach(l => l.classList.toggle('is-current', l.dataset.section === id));
        };
        if ('IntersectionObserver' in window && sections.length) {
            const spy = new IntersectionObserver((entries) => {
                // Pick the most-visible intersecting section.
                let best = null, bestRatio = 0;
                entries.forEach(en => {
                    if (en.isIntersecting && en.intersectionRatio > bestRatio) {
                        bestRatio = en.intersectionRatio;
                        best = en.target.id;
                    }
                });
                if (best) setCurrent(best);
            }, { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -40% 0px' });
            sections.forEach(s => spy.observe(s));
        }
    }

    /* ---------- Scroll progress bar (passive, rAF-throttled) ---------- */
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        let ticking = false;
        const updateProgress = () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = (height > 0 ? (winScroll / height) * 100 : 0) + '%';
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });
        updateProgress();
    }
    /* ---------- Theme toggle (light/dark) ---------- */
    const themeButtons = document.querySelectorAll('.theme-toggle');
    if (themeButtons.length) {
        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            themeButtons.forEach(btn => btn.setAttribute('aria-pressed', theme === 'dark'));
        };
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                try { localStorage.setItem('theme', next); } catch (e) {}
                applyTheme(next);
            });
        });
    }
});

function copyEmail() {
    const email = "yitao.ma@mail.utoronto.ca";
    const btn = document.getElementById("email-btn");
    if (!btn) return;

    navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = "Copied! ✔";
        btn.style.background = "#333";
        btn.style.color = "#fff";

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = "";
            btn.style.color = "";
        }, 2000);
    });
}
