console.log(
    "%c👋 Hi there! Thanks for checking under the hood.\nBased in Toronto? Let's grab a coffee!",
    "font-family: sans-serif; font-size: 16px; font-weight: bold; color: #111; padding: 10px;"
);
console.log(
    "%cBuilt with HTML, CSS, and a bit of curiosity.",
    "font-family: sans-serif; font-size: 12px; color: #555;"
);

document.addEventListener('DOMContentLoaded', () => {

    const cursor = document.getElementById('cursor');
    if (cursor) {
        let cursorX = 0, cursorY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function animateCursor() {
            currentX += (cursorX - currentX) * 0.15;
            currentY += (cursorY - currentY) * 0.15;
            cursor.style.left = currentX + 'px';
            cursor.style.top = currentY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const hoverTargets = document.querySelectorAll('.hover-target');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            target.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
        const zoomableImages = document.querySelectorAll(
            '.project-image, .phone-frame img, .screen-visual img, .persona-img, ' +
            '.solution-item img, .pivot-item img, .about-photo, ' +
            'img[cursor="zoom-in"], img.hover-target'
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

    const fadeEls = document.querySelectorAll(
        '.content-wrapper, .screen-section, .problem-grid, .quote-grid, ' +
        '.persona-grid, .pivot-grid, .final-solution-grid, .testing-insights, ' +
        '.figma-container, .footer-nav, .work-card, .tldr-card, .project-image, ' +
        '.about-page-grid, .site-footer'
    );

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

    const navLinks = document.querySelectorAll('nav .menu-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('#')[0];
        if (href === currentPage) {
            link.style.color = 'var(--text-main)';
        }
    });
});

window.onscroll = function() {
    const bar = document.getElementById("progressBar");
    if (!bar) return;
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    bar.style.width = scrolled + "%";
};

function copyEmail() {
    const email = "yitao.ma@mail.utoronto.ca";
    const btn = document.getElementById("email-btn");

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
