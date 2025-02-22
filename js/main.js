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
    
    // Initialize carousel if it exists
    const carousel = document.querySelector('.versatility-carousel');
    if (carousel) {
        initializeCarousel(carousel);
    }
    
    // Check if anime.js is loaded
    if (typeof anime === 'undefined') {
        console.error('Anime.js not loaded!');
        return;
    }
    
    console.log('Anime.js is loaded');
    
    // Test box animation
    anime({
        targets: '.el',
        translateX: 250,
        rotate: '1turn',
        duration: 800,
        backgroundColor: '#FFF'
    });

    // Easing demonstration
    const bars = document.querySelectorAll('.easing-bar');
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update bars on scroll
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / maxScroll;
        const translateX = scrollPercent * 300 - 150; // Move from -150px to +150px
        
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
    let currentImageIndex = 0;
    let galleryImages = [];
    const lightbox = document.getElementById('lightbox');

    if (lightbox) {  // Only initialize if lightbox exists
        document.querySelectorAll('.gallery-item img, .style-item img').forEach(img => {
            img.addEventListener('click', function() {
                const lightboxImg = document.getElementById('lightbox-img');
                // Get all images in the same container (gallery or carousel)
                const container = this.closest('.gallery-grid') || this.closest('.style-grid');
                galleryImages = Array.from(container.querySelectorAll('img'));
                currentImageIndex = galleryImages.indexOf(this);
                
                lightboxImg.src = this.src;
                lightbox.classList.add('active');
            });
        });

        // Add navigation arrows to lightbox
        const prevArrow = document.createElement('span');
        const nextArrow = document.createElement('span');
        prevArrow.className = 'lightbox-arrow lightbox-prev';
        nextArrow.className = 'lightbox-arrow lightbox-next';
        prevArrow.innerHTML = '&#10094;';  // Left arrow
        nextArrow.innerHTML = '&#10095;';  // Right arrow
        lightbox.appendChild(prevArrow);
        lightbox.appendChild(nextArrow);

        // Navigation functions
        prevArrow.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            document.getElementById('lightbox-img').src = galleryImages[currentImageIndex].src;
        });

        nextArrow.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            document.getElementById('lightbox-img').src = galleryImages[currentImageIndex].src;
        });

        // Close lightbox
        document.querySelector('.lightbox-close').addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        // Also close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    }

    // Handle page transitions
    const circles = document.querySelectorAll('.gradient-circle');
    
    // Define positions and colors for each page
    const pageStyles = {
        home: {
            circle1: { top: '-50vh', left: '-50vh', background: 'radial-gradient(circle, #40E0D0, transparent 70%)' },
            circle2: { bottom: '-60vh', right: '-60vh', background: 'radial-gradient(circle, #FF69B4, transparent 70%)' },
            circle3: { top: '50%', left: '50%', background: 'radial-gradient(circle, #87CEEB, transparent 70%)' }
        },
        professional: {
            circle1: { top: '-30vh', left: '20vw', background: 'radial-gradient(circle, #FF6B6B, transparent 70%)' },
            circle2: { bottom: '-30vh', right: '10vw', background: 'radial-gradient(circle, #4ECDC4, transparent 70%)' },
            circle3: { top: '60%', left: '30%', background: 'radial-gradient(circle, #45B7D1, transparent 70%)' }
        },
        favorite: {
            circle1: { top: '-20vh', left: '-20vw', background: 'radial-gradient(circle, #FFD93D, transparent 70%)' },
            circle2: { bottom: '-40vh', right: '30vw', background: 'radial-gradient(circle, #FF6B6B, transparent 70%)' },
            circle3: { top: '40%', left: '60%', background: 'radial-gradient(circle, #6C5B7B, transparent 70%)' }
        },
        experimental: {
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

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
        }
    });
} 