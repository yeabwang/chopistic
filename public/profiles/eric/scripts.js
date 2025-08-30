// ===== MOBILE NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.section-title, .about-card, .skill-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ===== NAVBAR BACKGROUND ON SCROLL =====
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background when scrolled
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // ===== SKILL ITEMS INTERACTIVE FEATURES =====
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(item => {
        // Add keyboard support for skill items
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Add touch support for mobile devices
        let touchStartTime = 0;
        let touchEndTime = 0;

        item.addEventListener('touchstart', function() {
            touchStartTime = new Date().getTime();
        });

        item.addEventListener('touchend', function() {
            touchEndTime = new Date().getTime();
            const touchDuration = touchEndTime - touchStartTime;
            
            // If it's a quick tap (less than 200ms), treat it as a click
            if (touchDuration < 200) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            }
        });
    });

    // ===== CONTACT FORM VALIDATION (if using form instead of mailto) =====
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const email = this.querySelector('input[type="email"]');
            const message = this.querySelector('textarea');
            
            if (!email.value || !message.value) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!isValidEmail(email.value)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // If validation passes, you can submit the form
            // For MVP, we'll just show a success message
            alert('Thank you for your message! I\'ll get back to you soon.');
            this.reset();
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    // Debounce scroll events for better performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        // Any scroll-based functionality can go here
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    // Add skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ===== ERROR HANDLING =====
    // Handle image loading errors
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });

    // ===== CONSOLE LOG FOR DEVELOPMENT =====
    console.log('Personal Portfolio loaded successfully! 🚀');
    console.log('Features: Mobile navigation, scroll animations, accessibility support');
});

// ===== SERVICE WORKER REGISTRATION (for future PWA features) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
