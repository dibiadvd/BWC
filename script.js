// script.js - Divine Grace Church - Full functionality

// ==========================================================================
// 1. UTILITIES
// ==========================================================================

function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ==========================================================================
// 2. NAVBAR SCROLL EFFECT
// ==========================================================================

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ==========================================================================
// 3. VIDEO PARALLAX (simple translateY)
// ==========================================================================

function initVideoParallax() {
    const hero = document.querySelector('.video-parallax');
    if (!hero) return;

    const speed = parseFloat(hero.dataset.parallaxSpeed) || 0.35;

    const handleParallax = () => {
        const scrollY = window.scrollY;
        hero.style.transform = `translateY(${scrollY * speed}px)`;
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial position
    handleParallax();

    // Pause video when out of view (saves battery/data)
    const video = hero.querySelector('video');
    if (video) {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        }, { threshold: 0.1 });

        observer.observe(hero);
    }
}

// ==========================================================================
// 4. KEY MOMENTS SWIPER
// ==========================================================================

function initKeyMomentsSwiper() {
    const swiperEl = document.querySelector('.key-moments-swiper');
    if (!swiperEl) return;

    new Swiper(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        centeredSlides: false,
        autoplay: {
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640:  { slidesPerView: 2, spaceBetween: 25 },
            992:  { slidesPerView: 3, spaceBetween: 30 },
            1400: { slidesPerView: 4, spaceBetween: 35 },
        },
        speed: 850,
        effect: 'slide',
    });
}

// ==========================================================================
// 5. GALLERY LIGHTBOX WITH FADE TRANSITION
// ==========================================================================

function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.lightbox-gallery-item');
    if (!galleryItems.length) return;

    const galleryArray = Array.from(galleryItems).map(item => ({
        src: item.getAttribute('data-src'),
        title: item.getAttribute('data-title') || '',
        description: item.getAttribute('data-description') || ''
    }));

    let currentIndex = 0;
    let lightboxInstance = null;
    let isTransitioning = false;

    function updateLightboxContent(index) {
        if (index < 0 || index >= galleryArray.length || isTransitioning) return;
        
        isTransitioning = true;
        currentIndex = index;
        const item = galleryArray[index];

        const imgEl   = document.querySelector('.lightbox-image');
        const titleEl = document.querySelector('.lightbox-title');
        const descEl  = document.querySelector('.lightbox-description');

        if (lightboxInstance && imgEl) {
            // Fade out
            imgEl.style.opacity = '0';
            if (titleEl) titleEl.style.opacity = '0';
            if (descEl)  descEl.style.opacity = '0';

            setTimeout(() => {
                // Update content
                imgEl.src = item.src;
                imgEl.alt = item.title;
                if (titleEl) titleEl.innerHTML = item.title;
                if (descEl)  descEl.innerHTML = item.description;

                // Fade in
                setTimeout(() => {
                    imgEl.style.opacity = '1';
                    if (titleEl) titleEl.style.opacity = '1';
                    if (descEl)  descEl.style.opacity = '1';
                    isTransitioning = false;
                }, 60);
            }, 500); // fade-out duration
        } else {
            // First open
            const content = `
                <div class="lightbox-content">
                    <img src="${item.src}" class="lightbox-image" alt="${item.title}">
                    <div class="lightbox-caption">
                        <div class="lightbox-title">${item.title}</div>
                        <div class="lightbox-description">${item.description}</div>
                    </div>

                    ${galleryArray.length > 1 ? `
                        <div class="lightbox-nav prev" onclick="prevImage()">‹</div>
                        <div class="lightbox-nav next" onclick="nextImage()">›</div>
                    ` : ''}
                </div>
            `;

            lightboxInstance = basicLightbox.create(content, {
                closable: true,
                className: 'gallery-lightbox',
                onShow: () => {
                    window.prevImage = () => updateLightboxContent(currentIndex - 1);
                    window.nextImage = () => updateLightboxContent(currentIndex + 1);
                    document.addEventListener('keydown', handleKeydown);
                },
                onClose: () => {
                    document.removeEventListener('keydown', handleKeydown);
                    window.prevImage = null;
                    window.nextImage = null;
                    lightboxInstance = null;
                    isTransitioning = false;
                }
            });

            lightboxInstance.show();

            // Force fade-in on first load
            setTimeout(() => {
                const img = document.querySelector('.lightbox-image');
                if (img) img.style.opacity = '1';
            }, 100);
        }
    }

    function handleKeydown(e) {
        if (e.key === 'ArrowLeft')  updateLightboxContent(currentIndex - 1);
        if (e.key === 'ArrowRight') updateLightboxContent(currentIndex + 1);
        if (e.key === 'Escape')     lightboxInstance?.close();
    }

    // Open gallery from clicked thumbnail
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            updateLightboxContent(index);
        });
    });
}

// ==========================================================================
// 6. FORM VALIDATION & SUBMISSION FEEDBACK
// ==========================================================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let valid = true;
        form.querySelectorAll('input[required], textarea[required]').forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                valid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (valid) {
            // Here you would normally send to backend / EmailJS / Formspree
            alert('Thank you! Your message has been sent. We will get back to you soon.');
            form.reset();
        }
    });
}

// ==========================================================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target === '#') return;
            smoothScroll(target);
        });
    });
}

// ==========================================================================
// 8. INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 850,
        once: true,
        offset: 80,
        easing: 'ease-out-quart',
        mirror: false,
    });

    // All features
    initNavbar();
    initVideoParallax();
    initKeyMomentsSwiper();
    initGalleryLightbox();
    initContactForm();
    initSmoothScroll();

    // Optional: console log for debugging
    // console.log('Divine Grace Church site initialized');
});