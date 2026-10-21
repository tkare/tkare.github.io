/**
 * Types the homepage hero subtitle after the main title animation finishes.
 */
function startHeroTypingAnimation() {
    const textEl = document.getElementById('hero-typed-text');
    const cursorEl = document.querySelector('.hero-typed-cursor');
    if (!textEl || !cursorEl) return;

    const full = 'Welcome to my website!';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        textEl.textContent = full;
        return;
    }

    let i = 0;

    function tick() {
        if (i < full.length) {
            textEl.textContent = full.slice(0, i + 1);
            i += 1;
            const delay = i === 1 ? 200 : 38 + Math.floor(Math.random() * 22);
            window.setTimeout(tick, delay);
        }
    }

    tick();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');
    
    // Initialize all carousels on the page
    const carousels = document.querySelectorAll('.versatility-carousel');
    carousels.forEach(carousel => {
        initializeCarousel(carousel);
    });
    
    // Check if anime.js is loaded
    if (typeof anime === 'undefined') {
        console.error('Anime.js not loaded!');
        return;
    }
    
    console.log('Anime.js is loaded');

    // Easing demonstration
    const bars = document.querySelectorAll('.easing-bar');
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update bars on scroll
    window.addEventListener('scroll', () => {
        if (!bars.length) return;
        const scrollPercent = maxScroll > 0 ? window.scrollY / maxScroll : 0;

        bars.forEach((bar, index) => {
            const easing = anime.easing[bar.dataset.easing];
            const easedProgress = easing(scrollPercent);
            const position = easedProgress * 300 - 150; // Apply easing to the movement
            
            bar.style.transform = `translateX(${position}vw)`;
        });
    });
    
    // Update maxScroll on window resize
    window.addEventListener('resize', () => {
        maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    });

    // Text animation (if on homepage)
    if (document.querySelector('.hero h1')) {
        anime.timeline({
            easing: 'easeOutExpo',
            complete: function () {
                startHeroTypingAnimation();
            }
        })
        .add({
            targets: '.hero h1 .text-main:first-child',
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 1200,
            begin: function(anim) {
                document.querySelector('.hero h1 .text-main:first-child').style.opacity = '0';
            }
        })
        .add({
            targets: '.hero h1 .text-main:last-child',
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 1200,
            delay: 100,
            begin: function(anim) {
                document.querySelector('.hero h1 .text-main:last-child').style.opacity = '0';
            }
        }, '-=800');
    }

    // Nav hover animations
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            anime({
                targets: link,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        link.addEventListener('mouseleave', () => {
            anime({
                targets: link,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });

    // Lightbox functionality
    initLightbox();

    // Handle page transitions
    const circles = document.querySelectorAll('.gradient-circle');
    
    // Define positions and colors for each page
    const pageStyles = {
        home: {
            circle1: { top: '-50vh', left: '-50vh', background: 'radial-gradient(circle, #40E0D0, transparent 70%)' },
            circle2: { bottom: '-60vh', right: '-60vh', background: 'radial-gradient(circle, #FF69B4, transparent 70%)' },
            circle3: { top: '50%', left: '50%', background: 'radial-gradient(circle, #87CEEB, transparent 70%)' }
        },
        'graphic-design-work': {
            circle1: { top: '-30vh', left: '20vw', background: 'radial-gradient(circle, #FF6B6B, transparent 70%)' },
            circle2: { bottom: '-30vh', right: '10vw', background: 'radial-gradient(circle, #4ECDC4, transparent 70%)' },
            circle3: { top: '60%', left: '30%', background: 'radial-gradient(circle, #45B7D1, transparent 70%)' }
        },
        favorite: {
            circle1: { top: '-20vh', left: '-20vw', background: 'radial-gradient(circle, #FFD93D, transparent 70%)' },
            circle2: { bottom: '-40vh', right: '30vw', background: 'radial-gradient(circle, #FF6B6B, transparent 70%)' },
            circle3: { top: '40%', left: '60%', background: 'radial-gradient(circle, #6C5B7B, transparent 70%)' }
        },
        thesis: {
            circle1: { top: '-40vh', left: '30vw', background: 'radial-gradient(circle, #A8E6CF, transparent 70%)' },
            circle2: { bottom: '-20vh', right: '-10vw', background: 'radial-gradient(circle, #FFD3B6, transparent 70%)' },
            circle3: { top: '30%', left: '40%', background: 'radial-gradient(circle, #FF8B94, transparent 70%)' }
        }
    };

    // Function to update gradient positions and colors
    function updateGradients(page) {
        const styles = pageStyles[page];
        if (!styles) return;

        circles.forEach((circle, i) => {
            const style = styles[`circle${i + 1}`];
            circle.style.cssText = `
                ${style.top ? `top: ${style.top};` : ''}
                ${style.bottom ? `bottom: ${style.bottom};` : ''}
                ${style.left ? `left: ${style.left};` : ''}
                ${style.right ? `right: ${style.right};` : ''}
                background: ${style.background};
            `;
        });
    }

    // Listen for navigation clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const page = href.includes('#') ? 'home' : href.split('/').pop().split('.')[0];
            updateGradients(page);
        });
    });

    // Set initial positions based on current page
    const currentPage = window.location.pathname.split('/').pop().split('.')[0] || 'home';
    updateGradients(currentPage);
});

/** Set once so repeated initLightbox() does not stack duplicate key handlers */
let lightboxGlobalKeydownBound = false;

// Carousel initialization function
function initializeCarousel(carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create indicators
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    carousel.appendChild(indicatorsContainer);

    // Initialize first slide
    slides[0].classList.add('active');

    function updateIndicators() {
        carousel.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;
        slides[currentIndex].classList.add('active');
        updateIndicators();
        
        // Reinitialize lightbox after slide change
        initLightbox();
    }

    // Event listeners
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch support for mobile
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    carousel.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) >= 50) {
            goToSlide(currentIndex + (diff > 0 ? 1 : -1));
        }
    }, false);

    // Keyboard navigation (ignore when lightbox is open — it uses the same keys)
    document.addEventListener('keydown', e => {
        if (document.querySelector('.lightbox')?.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
        }
    });
}

// Add this function to handle lightbox functionality
function initLightbox() {
    console.log('Initializing lightbox...');

    // Create lightbox elements if they don't exist
    if (!document.querySelector('.lightbox')) {
        console.log('Creating lightbox elements...');
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" src="" alt="">
            <span class="lightbox-prev">&#10094;</span>
            <span class="lightbox-next">&#10095;</span>
        `;
        document.body.appendChild(lightbox);
    }

    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Log all clickable images found
    const allImages = document.querySelectorAll('.gallery-item img, .style-item img');
    console.log('Found clickable images:', allImages.length);

    // Add click event to all images
    allImages.forEach(img => {
        console.log('Adding click listener to image:', img.src);
        img.addEventListener('click', function() {
            console.log('Image clicked:', this.src);
            
            // Get all images in the same container (gallery or carousel slide)
            const container = this.closest('.gallery-grid') || 
                            this.closest('.style-grid') || 
                            this.closest('.carousel-slide');
            console.log('Container found:', container);
            
            const images = Array.from(container.querySelectorAll('img'));
            console.log('Images in container:', images.length);
            let currentIndex = images.indexOf(this);

            // Show lightbox with clicked image
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Lightbox activated');

            // Previous image
            prevBtn.onclick = () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.alt = images[currentIndex].alt || '';
            };

            // Next image
            nextBtn.onclick = () => {
                currentIndex = (currentIndex + 1) % images.length;
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.alt = images[currentIndex].alt || '';
            };

            // Update navigation buttons visibility
            prevBtn.style.display = images.length > 1 ? 'block' : 'none';
            nextBtn.style.display = images.length > 1 ? 'block' : 'none';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard: one capture-phase listener for all opens (don’t register per initLightbox call)
    if (!lightboxGlobalKeydownBound) {
        lightboxGlobalKeydownBound = true;
        document.addEventListener(
            'keydown',
            (e) => {
                const lb = document.querySelector('.lightbox');
                if (!lb?.classList.contains('active')) return;
                const prev = lb.querySelector('.lightbox-prev');
                const next = lb.querySelector('.lightbox-next');
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    lb.classList.remove('active');
                    document.body.style.overflow = '';
                    return;
                }
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.key === 'ArrowLeft') prev?.click();
                    else next?.click();
                }
            },
            true
        );
    }
}

// Make sure initLightbox is called after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing lightbox...');
    initLightbox();
});

// Also reinitialize after any dynamic content changes
function updateCarousel(index) {
    // ... existing carousel update code ...
    console.log('Carousel updated, reinitializing lightbox...');
    initLightbox();
}

// Add section navigation highlighting
function updateSectionNav() {
    const sections = document.querySelectorAll('section, .sub-category');
    const navLinks = document.querySelectorAll('.section-nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const scroll = window.scrollY;
        
        if (scroll >= sectionTop && scroll < sectionTop + sectionHeight) {
            currentSection = '#' + section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', updateSectionNav);
document.addEventListener('DOMContentLoaded', updateSectionNav);

// Update the smooth scrolling function to account for header height
document.querySelectorAll('.section-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20; // Added extra 20px padding
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Control section nav visibility
function updateSectionNavVisibility() {
    const nav = document.querySelector('.section-nav');
    const header = document.querySelector('.category-header');
    const headerBottom = header.getBoundingClientRect().bottom;
    
    // Show nav only after header is scrolled past
    if (headerBottom <= 0) {
        nav.classList.add('visible');
    } else {
        nav.classList.remove('visible');
    }
}

// Add scroll event listener for nav visibility
window.addEventListener('scroll', updateSectionNavVisibility);
document.addEventListener('DOMContentLoaded', updateSectionNavVisibility); 