// Modern Medical Care Alliance JavaScript functionality

class MedicalCareAlliance {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.isScrolled = false;
        this.mobileMenuOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSlider();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupProductFilters();
        this.setupNewsFilters();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Hero slider events
        const nextBtn = document.querySelector('.slider-btn.next');
        const prevBtn = document.querySelector('.slider-btn.prev');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        
        // Slider dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Navigation links smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Auto-advance slider
        this.startSliderAutoplay();
    }

    initializeSlider() {
        const slides = document.querySelectorAll('.slide');
        this.totalSlides = slides.length;
        
        if (this.totalSlides > 0) {
            this.showSlide(0);
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(this.currentSlide);
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.showSlide(this.currentSlide);
    }

    showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    startSliderAutoplay() {
        if (this.totalSlides > 1) {
            setInterval(() => {
                this.nextSlide();
            }, 6000); // Auto-advance every 6 seconds
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header scroll effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (scrollTop > 50 && !this.isScrolled) {
                this.isScrolled = true;
                navbar.classList.add('scrolled');
            } else if (scrollTop <= 50 && this.isScrolled) {
                this.isScrolled = false;
                navbar.classList.remove('scrolled');
            }
        }

        // Parallax effects
        this.updateParallax();
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    setupScrollEffects() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        
        // Close menu when clicking on nav links
        if (mobileMenu) {
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (this.mobileMenuOpen) {
                        this.toggleMobileMenu();
                    }
                });
            });
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu && mobileMenuBtn) {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            
            if (this.mobileMenuOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'auto';
        }
    }

    setupProductFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.textContent.toLowerCase().trim();
                
                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('bg-primary-600', 'text-white');
                    btn.classList.add('bg-gray-100', 'text-gray-700');
                });
                button.classList.remove('bg-gray-100', 'text-gray-700');
                button.classList.add('bg-primary-600', 'text-white');
                
                // Filter products
                this.filterProducts(category);
            });
        });
    }

    filterProducts(category) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all products' || category === 'all' || 
                (cardCategory && cardCategory.toLowerCase().includes(category.replace(/s$/, '')))) {
                card.style.display = 'block';
                // Animate in
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                // Hide after animation
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    setupNewsFilters() {
        const newsFilterButtons = document.querySelectorAll('.news-filter-btn');
        
        newsFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.textContent.toLowerCase().trim();
                
                // Update active button
                newsFilterButtons.forEach(btn => {
                    btn.classList.remove('bg-primary-600', 'text-white');
                    btn.classList.add('bg-gray-100', 'text-gray-700');
                });
                button.classList.remove('bg-gray-100', 'text-gray-700');
                button.classList.add('bg-primary-600', 'text-white');
                
                // Filter news articles
                this.filterNews(category);
            });
        });
    }

    filterNews(category) {
        const newsCards = document.querySelectorAll('.news-card');
        
        newsCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all news' || category === 'all' || 
                (cardCategory && cardCategory.toLowerCase() === category)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    setupAnimations() {
        // Add hover effects to cards
        document.querySelectorAll('.product-card, .news-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        // Add click effects to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('nav').offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-black',
            info: 'bg-blue-500 text-white'
        };
        
        notification.classList.add(...colors[type].split(' '));
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MedicalCareAlliance();
    
    // Initialize image loading
    initializeImageLoading();
    
    // Initialize Google Maps
    if (typeof google !== 'undefined' && google.maps) {
        initializeMap();
    }
    
    // Add ripple animation styles
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(rippleStyles);
});

// Image loading with fallback
function initializeImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('opacity-0');
                img.classList.add('opacity-100');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Google Maps initialization
function initializeMap() {
    const mapElement = document.getElementById('google-map');
    if (!mapElement) return;
    
    const point = new google.maps.LatLng(24.6673385, 46.7070681);
    
    const mapOptions = {
        zoom: 15,
        center: point,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                featureType: 'all',
                elementType: 'geometry.fill',
                stylers: [{ color: '#f8fafc' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#3b82f6' }]
            }
        ]
    };
    
    const map = new google.maps.Map(mapElement, mapOptions);
    
    new google.maps.Marker({
        position: point,
        map: map,
        title: 'تحالف الرعاية الطبية',
        icon: {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMyNTYzZWIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz4KPC9zdmc+Cjwvc3ZnPgo=',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
}

// Export for potential use in other modules
window.MedicalCareAlliance = MedicalCareAlliance;