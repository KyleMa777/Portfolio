const cursor = document.getElementById('cursor');
const hoverTargets = document.querySelectorAll('.hover-target');

document.addEventListener('mousemove', e => {
    if (!cursor) return;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        if (!cursor) return;
        cursor.classList.add('hovered');
    });
    target.addEventListener('mouseleave', () => {
        if (!cursor) return;
        cursor.classList.remove('hovered');
    });
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const images = document.querySelectorAll('img');

images.forEach(img => {
    img.addEventListener('click', () => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = img.src;
        lightbox.classList.add('open');
    });
});

if (lightbox) {
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
            lightbox.classList.remove('open');
        }
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
    }
});

const revealSelectors = [
    '.screen-section',
    '.content-wrapper',
    '.quote-card',
    '.persona-card',
    '.final-solution-grid .solution-item'
];

const revealElements = [];

revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
        el.classList.add('reveal');
        revealElements.push(el);
    });
});

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18
        }
    );
    revealElements.forEach(el => observer.observe(el));
} else {
    revealElements.forEach(el => el.classList.add('visible'));
}
