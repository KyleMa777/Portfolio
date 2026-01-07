document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');
    const hoverTargets = document.querySelectorAll('.hover-target');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const zoomableImages = document.querySelectorAll('.project-image, .phone-frame img');

    zoomableImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
        document.body.style.overflow = '';
    }

    lightbox.addEventListener('click', closeLightbox);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});