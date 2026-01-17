console.log(
    "%c👋 Hi there! Thanks for checking under the hood.\nBased in Toronto? Let's grab a coffee!",
    "font-family: sans-serif; font-size: 16px; font-weight: bold; color: #2a45ff; padding: 10px;"
);
console.log(
    "%cBuilt with HTML, CSS, and a bit of curiosity.",
    "font-family: sans-serif; font-size: 12px; color: #555;"
);

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

window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
};

function copyEmail() {
    const email = "yitao.ma@mail.utoronto.ca"; 
    const btn = document.getElementById("email-btn");
    

    navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = "Copied! ✓";
        btn.style.background = "#4BB543"; 
        btn.style.color = "#fff";
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = ""; 
            btn.style.color = "";
        }, 2000);
    });
}
