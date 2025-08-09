// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Update ScrollTrigger when Lenis scrolls
lenis.on('scroll', ScrollTrigger.update);

// Image loading optimization
function handleImageLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  images.forEach(img => {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
    
    // If image is already loaded
    if (img.complete) {
      img.classList.add('loaded');
    }
  });
}

// Loading Screen Animation
class LoadingScreen {
  constructor() {
    this.loader = document.getElementById('loader');
    this.init();
  }

  init() {
    // Animate loading bar
    gsap.to('.loader-bar', {
      width: '100%',
      duration: 2,
      ease: 'power2.out'
    });

    // Hide loader after animation
    gsap.to(this.loader, {
      opacity: 0,
      duration: 0.8,
      delay: 2.2,
      ease: 'power2.inOut',
      onComplete: () => {
        this.loader.style.display = 'none';
        this.initPageAnimations();
      }
    });
  }

  initPageAnimations() {
    // Hero text animations
    const heroTitleLines = document.querySelectorAll('.hero-title-line');
    
    gsap.timeline()
      .to(heroTitleLines, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      })
      .to('.hero-subtitle', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.5')
      .to('.hero-description', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6')
      .to('.hero-cta', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.4');
  }
}

// Custom Cursor
class CustomCursor {
  constructor() {
    this.cursor = document.getElementById('cursor');
    this.follower = document.getElementById('cursor-follower');
    this.init();
  }

  init() {
    if (!this.cursor || !this.follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(this.cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0,
      });
    });

    // Smooth follower animation
    const updateFollower = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;

      gsap.set(this.follower, {
        x: followerX,
        y: followerY,
      });

      requestAnimationFrame(updateFollower);
    };
    updateFollower();

    // Magnetic effect for buttons
    const magneticElements = document.querySelectorAll('.btn--primary, .slider-btn, .attraction-card, .experience-card');
    
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(this.cursor, {
          scale: 1.5,
          duration: 0.3,
        });
        gsap.to(this.follower, {
          scale: 1.5,
          duration: 0.3,
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(this.cursor, {
          scale: 1,
          duration: 0.3,
        });
        gsap.to(this.follower, {
          scale: 1,
          duration: 0.3,
        });
      });

      // Only apply magnetic effect to buttons, not cards
      if (el.classList.contains('btn--primary') || el.classList.contains('slider-btn')) {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(el, {
            x: x * 0.1,
            y: y * 0.1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      }
    });
  }
}

// Navigation
class Navigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.init();
  }

  init() {
    // Scroll effect on navbar
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: (self) => {
        if (self.direction === -1) {
          this.showNav();
        } else {
          if (self.progress > 0.1) {
            this.hideNav();
          }
        }
      },
      onToggle: (self) => {
        if (self.isActive) {
          this.navbar.classList.add('scrolled');
        } else {
          this.navbar.classList.remove('scrolled');
        }
      }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          lenis.scrollTo(target, {
            duration: 1.5,
            offset: -100
          });
        }
      });
    });

    // Hero CTA scroll
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
      heroCta.addEventListener('click', () => {
        lenis.scrollTo('#destinations', {
          duration: 1.5,
          offset: -100
        });
      });
    }
  }

  showNav() {
    gsap.to(this.navbar, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  hideNav() {
    gsap.to(this.navbar, {
      y: -100,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
}

// Destinations Slider
class DestinationsSlider {
  constructor() {
    this.slides = document.querySelectorAll('.destination-slide');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.currentSlide = 0;
    this.isAnimating = false;
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    if (!this.slides.length) return;

    this.bindEvents();
    this.startAutoplay();
  }

  bindEvents() {
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    this.prevBtn?.addEventListener('click', () => this.prevSlide());

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Pause autoplay on hover
    const slider = document.querySelector('.destinations-slider');
    slider?.addEventListener('mouseenter', () => this.stopAutoplay());
    slider?.addEventListener('mouseleave', () => this.startAutoplay());
  }

  nextSlide() {
    if (this.isAnimating) return;
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlide();
  }

  prevSlide() {
    if (this.isAnimating) return;
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateSlide();
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentSlide) return;
    this.currentSlide = index;
    this.updateSlide();
  }

  updateSlide() {
    this.isAnimating = true;

    // Update slides
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });

    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });

    // Animate content
    const currentContent = this.slides[this.currentSlide].querySelector('.destination-content');
    if (currentContent) {
      gsap.fromTo(currentContent.children, 
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power2.out'
        }
      );
    }

    setTimeout(() => {
      this.isAnimating = false;
    }, 1000);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollTriggers();
    this.setupParallaxEffects();
    this.setupStaggerAnimations();
  }

  setupScrollTriggers() {
    // Generic fade in animations for section headers
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.fromTo(header.children,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Attractions grid animation
    gsap.utils.toArray('.attraction-card').forEach((card, index) => {
      gsap.fromTo(card,
        {
          y: 100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Experience cards animation
    gsap.utils.toArray('.experience-card').forEach((card, index) => {
      gsap.fromTo(card,
        {
          y: 60,
          opacity: 0,
          rotationX: 15
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.8,
          delay: index * 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Food items animation
    gsap.utils.toArray('.food-item').forEach((item, index) => {
      gsap.fromTo(item,
        {
          scale: 0,
          rotation: 180,
          opacity: 0
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Craft items animation
    gsap.utils.toArray('.craft-item').forEach((item, index) => {
      gsap.fromTo(item,
        {
          y: 50,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  setupParallaxEffects() {
    // Hero parallax
    gsap.to('.hero-bg-image', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Culture background parallax
    gsap.to('.culture-bg', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.culture',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  setupStaggerAnimations() {
    // Trip highlights animation
    const highlights = document.querySelectorAll('.trip-highlights li');
    if (highlights.length) {
      gsap.fromTo(highlights,
        {
          x: -30,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.trip-highlights',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Footer sections animation
    gsap.utils.toArray('.footer-section').forEach((section, index) => {
      gsap.fromTo(section,
        {
          y: 40,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.footer',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }
}

// Interactive Elements
class InteractiveElements {
  constructor() {
    this.init();
  }

  init() {
    this.setupHoverEffects();
    this.setupFormInteractions();
    this.setupScrollIndicator();
  }

  setupHoverEffects() {
    // Attraction cards hover effect
    document.querySelectorAll('.attraction-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.03,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        const overlay = card.querySelector('.attraction-overlay');
        gsap.to(overlay, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        const overlay = card.querySelector('.attraction-overlay');
        gsap.to(overlay, {
          y: 10,
          opacity: 0.9,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Experience cards hover effect
    document.querySelectorAll('.experience-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Food items hover effect
    document.querySelectorAll('.food-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          y: -5,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        const icon = item.querySelector('.food-icon');
        gsap.to(icon, {
          scale: 1.2,
          rotation: 10,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        const icon = item.querySelector('.food-icon');
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Craft items hover effect
    document.querySelectorAll('.craft-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          y: -5,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  setupFormInteractions() {
    const planBtn = document.querySelector('.plan-btn');
    const form = document.querySelector('.planner-form');
    
    if (planBtn && form) {
      planBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Simple form validation
        const selects = form.querySelectorAll('select');
        let isValid = true;
        
        selects.forEach(select => {
          if (!select.value) {
            isValid = false;
            gsap.to(select, {
              borderColor: '#ff4444',
              duration: 0.3
            });
          } else {
            gsap.to(select, {
              borderColor: 'var(--color-border)',
              duration: 0.3
            });
          }
        });

        if (isValid) {
          // Success animation
          gsap.to(planBtn, {
            scale: 1.1,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
            onComplete: () => {
              planBtn.textContent = 'Planning Your Trip...';
              planBtn.disabled = true;
              setTimeout(() => {
                planBtn.textContent = 'Trip Planned! ✓';
                planBtn.style.background = '#4CAF50';
                setTimeout(() => {
                  planBtn.textContent = 'Plan My Trip';
                  planBtn.style.background = '#8B4513';
                  planBtn.disabled = false;
                }, 3000);
              }, 1500);
            }
          });
        } else {
          // Error animation
          gsap.to(form, {
            x: -10,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: 'power2.inOut'
          });
        }
      });
    }
  }

  setupScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
      ScrollTrigger.create({
        start: 'top -100',
        end: 99999,
        onUpdate: (self) => {
          gsap.to(indicator, {
            opacity: self.direction === -1 ? 0.7 : 0,
            duration: 0.3
          });
        }
      });

      indicator.addEventListener('click', () => {
        lenis.scrollTo('#destinations', {
          duration: 1.5,
          offset: -100
        });
      });
    }
  }
}

// Text Animations
class TextAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupTextRevealEffects();
  }

  setupTextRevealEffects() {
    // Section titles reveal
    gsap.utils.toArray('.section-title').forEach(title => {
      const chars = title.textContent.split('');
      title.innerHTML = chars.map(char => 
        `<span style="display:inline-block;opacity:0;transform:translateY(50px)">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
      
      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(title.children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power2.out'
          });
        }
      });
    });
  }
}

// Progress Indicator
class ProgressIndicator {
  constructor() {
    this.createProgressBar();
  }

  createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #8B4513, #DEB887);
      z-index: 10000;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    ScrollTrigger.create({
      onUpdate: (self) => {
        progressBar.style.width = `${self.progress * 100}%`;
      }
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Handle image loading first
  handleImageLoading();
  
  // Initialize all components
  new LoadingScreen();
  new CustomCursor();
  new Navigation();
  new DestinationsSlider();
  new ScrollAnimations();
  new InteractiveElements();
  new TextAnimations();
  new ProgressIndicator();

  // Refresh ScrollTrigger after everything is loaded
  ScrollTrigger.refresh();
});

// Handle window resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
    gsap.globalTimeline.pause();
  } else {
    // Resume animations when tab becomes visible
    gsap.globalTimeline.resume();
  }
});

// Performance optimization
window.addEventListener('load', () => {
  // Force ScrollTrigger refresh after all resources are loaded
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
});