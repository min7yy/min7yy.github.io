// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // Mobile Navigation Toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    });

    // Enhanced smooth scrolling for all anchor links
    function smoothScrollTo(targetId) {
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            let targetPosition;
            
            // Special handling for home section to scroll to very top
            if (targetId === '#home') {
                targetPosition = 0;
            } else {
                targetPosition = targetSection.offsetTop - headerHeight - 20;
            }
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Handle all navigation links and buttons
    document.addEventListener('click', function(e) {
        // Handle navigation links
        if (e.target.matches('.nav__link')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            smoothScrollTo(targetId);
        }
        
        // Handle hero buttons and other internal links
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            smoothScrollTo(targetId);
        }
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + header.offsetHeight + 100;

        // Special case for when at the very top of the page
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav__link[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
            return;
        }

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (correspondingNavLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    // Remove active class from all nav links
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to current section's nav link
                    correspondingNavLink.classList.add('active');
                }
            }
        });

        // If at (or near) the bottom of the page, highlight Recommendations
        if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 2
        ) {
          navLinks.forEach(link => link.classList.remove('active'));
          const recLink = document.querySelector('.nav__link[href="#recommendations"]');
          if (recLink) recLink.classList.add('active');
        }
    }

    // Header scroll effect
    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(var(--color-background), 0.95)';
            header.style.boxShadow = 'var(--shadow-sm)';
        } else {
            header.style.backgroundColor = 'var(--color-background)';
            header.style.boxShadow = 'none';
        }
    }

    // Scroll event listener
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNavLink();
                handleHeaderScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (since this is a static demo)
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call delay
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close" aria-label="Close notification">&times;</button>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-base);
            padding: var(--space-16);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform var(--duration-normal) var(--ease-standard);
        `;

        // Type-specific styling
        if (type === 'success') {
            notification.style.borderLeftColor = 'var(--color-success)';
            notification.style.borderLeftWidth = '4px';
        } else if (type === 'error') {
            notification.style.borderLeftColor = 'var(--color-error)';
            notification.style.borderLeftWidth = '4px';
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Add close functionality
        const closeButton = notification.querySelector('.notification__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                hideNotification(notification);
            });
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                hideNotification(notification);
            }
        }, 5000);
    }

    function hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.card, .skills__category, .about__content, .experience__grid, .recommendations__list');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s var(--ease-standard), transform 0.6s var(--ease-standard)';
        observer.observe(el);
    });

    // Skill tags hover effect enhancement
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Smooth reveal animation for hero content
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    });

    // Performance optimization: Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu on resize to larger screen
            if (window.innerWidth > 768) {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
            }
        }, 250);
    });

    // Initialize active nav link on page load
    updateActiveNavLink();

    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Add a subtle fade-in effect for the entire page
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });

    // Add click tracking for analytics (placeholder)
    function trackClick(element, action) {
        // This would integrate with analytics services like Google Analytics
        console.log(`Analytics: ${element} clicked - ${action}`);
    }

    // Track important button clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn--primary')) {
            trackClick('primary-button', e.target.textContent);
        } else if (e.target.matches('.nav__link')) {
            trackClick('navigation-link', e.target.textContent);
        }
    });

    // Particle background
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 0;
    canvas.style.pointerEvents = 'none';

    document.getElementById('particles-bg').appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const PARTICLE_COUNT = 200;

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: randomBetween(0, canvas.width),
            y: randomBetween(0, canvas.height),
            r: randomBetween(0.7, 2.2),
            dx: randomBetween(-0.2, 0.2),
            dy: randomBetween(-0.15, 0.15),
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.globalAlpha = 1;
            p.x += p.dx;
            p.y += p.dy;
            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        }
        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});