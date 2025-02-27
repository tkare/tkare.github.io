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

    // Keyboard navigation
    document.addEventListener('keydown', e => {
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
            lightbox.classList.add('active');
            console.log('Lightbox activated');

            // Previous image
            prevBtn.onclick = () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                lightboxImg.src = images[currentIndex].src;
            };

            // Next image
            nextBtn.onclick = () => {
                currentIndex = (currentIndex + 1) % images.length;
                lightboxImg.src = images[currentIndex].src;
            };

            // Update navigation buttons visibility
            prevBtn.style.display = images.length > 1 ? 'block' : 'none';
            nextBtn.style.display = images.length > 1 ? 'block' : 'none';
        });
    });

    // Close lightbox
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') lightbox.classList.remove('active');
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });
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