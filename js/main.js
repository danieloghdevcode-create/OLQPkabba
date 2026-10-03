/**
 * OUR LADY QUEEN OF PEACE CATHOLIC CHURCH (OLQP)
 * MAIN GLOBAL JAVASCRIPT — NAVIGATION, STICKY HEADER, MOBILE DRAWER, & ACCESSIBILITY
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initDropdownA11y();
  initActiveNavLink();
  initSmoothScroll();
  initBackToTop();
  initLazyLoading();
  initParallax();
  initScrollReveal();
  initAutoScrollTracks();
  initQuickAccessMobileSliding();
  initLiturgicalTabs();
});

function removeExternalImages() {
  // Retained as no-op to preserve valid hyperlinks and assets
}

/**
 * 1. Sticky Header with Scroll Detection
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 35) {
      header.classList.add('scrolled', 'is-scrolled');
    } else {
      header.classList.remove('scrolled', 'is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/**
 * 2. Mobile Navigation Drawer & Accordion Submenus
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    toggleBtn.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open', 'is-active');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open', 'is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    toggleBtn.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open', 'is-active');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open', 'is-active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.contains('is-open') || drawer.classList.contains('is-active');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay.addEventListener('click', closeDrawer);

  // Close drawer when clicking any page link
  const drawerLinks = drawer.querySelectorAll('.mobile-nav-link, .mobile-drawer-footer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Mobile Accordion Sub-menus
  // Mobile section links remain direct links; only an explicitly marked More menu may accordion.
  const accordionItems = drawer.querySelectorAll('.mobile-nav-item[data-dropdown="more"]');
  accordionItems.forEach(item => {
    const parentLink = item.querySelector('.mobile-nav-link');
    if (parentLink) {
      parentLink.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = item.classList.contains('is-expanded');
        // Close siblings for clean accordion feel
        accordionItems.forEach(sib => {
          if (sib !== item) sib.classList.remove('is-expanded');
        });
        item.classList.toggle('is-expanded', !isExpanded);
      });
    }
  });
}

/**
 * 3. Desktop Dropdown Accessibility & Keyboard Support
 */
function initDropdownA11y() {
  const navItems = document.querySelectorAll('.nav-item.has-dropdown:has(.dropdown-right)');

  navItems.forEach(item => {
    const trigger = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');
    if (!trigger || !dropdown) return;

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    item.addEventListener('mouseenter', () => {
      trigger.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      trigger.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('is-visible');
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', !isExpanded);
        dropdown.classList.toggle('is-visible', !isExpanded);
        const firstItem = dropdown.querySelector('a');
        if (firstItem && !isExpanded) firstItem.focus();
      }
    });

    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('is-visible');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });
}

/**
 * 4. Active Navigation Link Highlighting
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-sub-item a');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('#')[0].split('/').pop();
    if (linkPath === currentPath) {
      link.classList.add('active');
      // If it's in a dropdown, also highlight parent
      const parentDropdown = link.closest('.has-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });
}

/**
 * 5. Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 15;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * 6. Back-to-Top Floating Button
 */
function initBackToTop() {
  let btn = document.querySelector('.back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Return to top of page');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
    `;
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 7. Native lazy loading and asynchronous image decoding
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img');
  images.forEach((image, index) => {
    if (!image.hasAttribute('loading')) {
      image.setAttribute('loading', index < 2 ? 'eager' : 'lazy');
    }
    image.setAttribute('decoding', 'async');
  });
}

/**
 * 8. Subtle parallax movement for page hero backgrounds
 */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.page-hero:not(.home-hero), [data-parallax]:not(.home-hero)');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!parallaxElements.length || prefersReducedMotion) return;

  let frameRequested = false;
  const updateParallax = () => {
    const viewportHeight = window.innerHeight;
    parallaxElements.forEach(element => {
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > viewportHeight) return;
      const distanceFromCenter = (bounds.top + bounds.height / 2) - viewportHeight / 2;
      const offset = Math.max(-110, Math.min(110, distanceFromCenter * -0.16));
      element.style.setProperty('--parallax-offset', `${offset}px`);
      element.style.backgroundPosition = `center calc(50% + ${offset}px)`;
      element.classList.add('parallax-active');
    });
    frameRequested = false;
  };

  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateParallax);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  requestUpdate();
}

/**
 * 9. Lightweight reveal animation for content entering the viewport
 */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll(
    'main section:not(.page-hero), .ministry-card, .event-card, .gallery-item'
  );
  if (prefersReducedMotion || !revealElements.length || !('IntersectionObserver' in window)) return;

  revealElements.forEach(element => element.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px' });

  revealElements.forEach(element => observer.observe(element));
}

/**
 * 10. Continuous Smooth Conveyor-Belt Glide for Quick-Access Cards
 * Shows the first card still for 2 seconds upon page load, then starts a slow, continuous,
 * never-ending glide from East to West (right to left) in an infinite seamless loop.
 * Never stops until the page is refreshed. Pauses gracefully during touch/drag and resumes when released.
 */
function initAutoScrollTracks() {
  const tracks = document.querySelectorAll('.horizontal-scroll-track');
  if (!tracks.length) return;

  tracks.forEach(track => {
    // Only select genuine original items (avoid cloning repeatedly)
    const originalItems = Array.from(track.children).filter(el => !el.classList.contains('carousel-dots') && !el.dataset.isClone);
    const count = originalItems.length;
    if (count <= 1) return;

    // Clone all original cards to create the seamless infinite circular conveyor belt
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      clone.dataset.isClone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    let currentScroll = 0;
    let isPaused = true; // Starts still for the initial 2 seconds
    let isUserInteracting = false;
    let isVisible = true;
    let resumeTimeout = null;

    // Measured distance of one full set of original cards
    let loopDistance = 0;
    function calculateLoopDistance() {
      const allItems = Array.from(track.children).filter(el => !el.classList.contains('carousel-dots'));
      if (allItems.length >= count + 1) {
        loopDistance = allItems[count].offsetLeft - allItems[0].offsetLeft;
      }
    }
    calculateLoopDistance();

    function isTrackScrollable() {
      return track.scrollWidth > track.clientWidth + 10;
    }

    // Slow, comfortable reading speed: ~0.65px per frame (~39px per second at 60fps)
    const GLIDE_SPEED = 0.65;

    function step() {
      if (!isPaused && !isUserInteracting && isVisible && isTrackScrollable()) {
        currentScroll += GLIDE_SPEED;

        // When we have scrolled one full set of cards, seamlessly wrap by loopDistance
        if (loopDistance > 0 && currentScroll >= loopDistance) {
          currentScroll -= loopDistance;
        }

        track.scrollLeft = currentScroll;
      }
      requestAnimationFrame(step);
    }

    // Start animation loop
    requestAnimationFrame(step);

    // Initial 2-second still state: first card shows still for 2s, then begins non-stop glide
    setTimeout(() => {
      calculateLoopDistance();
      currentScroll = track.scrollLeft;
      isPaused = false;
    }, 2000);

    // Pause on touch so the visitor can read or tap links without movement
    track.addEventListener('touchstart', () => {
      isUserInteracting = true;
      if (resumeTimeout) clearTimeout(resumeTimeout);
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        calculateLoopDistance();
        currentScroll = track.scrollLeft;
        isUserInteracting = false;
      }, 1200);
    }, { passive: true });

    track.addEventListener('mouseenter', () => {
      isUserInteracting = true;
    });

    track.addEventListener('mouseleave', () => {
      calculateLoopDistance();
      currentScroll = track.scrollLeft;
      isUserInteracting = false;
    });

    // Pause when scrolled out of viewport to save battery/performance
    if ('IntersectionObserver' in window) {
      const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            calculateLoopDistance();
            currentScroll = track.scrollLeft;
          }
        });
      }, { threshold: 0.05 });
      visibilityObserver.observe(track);
    }

    window.addEventListener('resize', () => {
      calculateLoopDistance();
      currentScroll = track.scrollLeft;
    });
  });
}

/**
 * 11. Quick-Access Ribbon: Stationary on Desktop, Smooth Auto-Sliding on Mobile (Zero Duplicates)
 */
function initQuickAccessMobileSliding() {
  const track = document.querySelector('.quick-access-track');
  if (!track) return;

  let isPaused = true;
  let isUserInteracting = false;
  let isVisible = true;
  let resumeTimeout = null;
  const SPEED = 0.65; // ~39px/sec at 60fps

  function isMobile() {
    return window.innerWidth <= 900;
  }

  function step() {
    if (isMobile() && !isPaused && !isUserInteracting && isVisible) {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll > 15) {
        track.scrollLeft += SPEED;

        if (track.scrollLeft >= maxScroll - 1) {
          // Reached the last card: pause to let user read, then smoothly glide back to start
          isPaused = true;
          setTimeout(() => {
            if (isMobile() && !isUserInteracting) {
              track.scrollTo({ left: 0, behavior: 'smooth' });
              setTimeout(() => {
                isPaused = false;
              }, 1800);
            } else {
              isPaused = false;
            }
          }, 2500);
        }
      }
    } else if (!isMobile()) {
      if (track.scrollLeft !== 0) {
        track.scrollLeft = 0;
      }
    }
    requestAnimationFrame(step);
  }

  // Start animation loop
  requestAnimationFrame(step);

  // Initial 2.5-second still state on page load for mobile users
  setTimeout(() => {
    isPaused = false;
  }, 2500);

  // Pause on touch so the visitor can read, tap links, or swipe manually
  track.addEventListener('touchstart', () => {
    isUserInteracting = true;
    if (resumeTimeout) clearTimeout(resumeTimeout);
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isUserInteracting = false;
    }, 3000);
  }, { passive: true });

  track.addEventListener('mouseenter', () => {
    isUserInteracting = true;
  });

  track.addEventListener('mouseleave', () => {
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isUserInteracting = false;
    }, 2000);
  });

  const cards = Array.from(track.querySelectorAll('.quick-card'));

  function equalizeHeights() {
    // Reset any previously assigned inline heights to measure natural rendered height
    cards.forEach(card => {
      card.style.minHeight = '';
      card.style.height = '';
    });

    if (isMobile()) {
      let maxHeight = 0;
      cards.forEach(card => {
        const h = card.getBoundingClientRect().height;
        if (h > maxHeight) maxHeight = h;
      });

      if (maxHeight > 0) {
        const uniformHeight = Math.ceil(maxHeight) + 'px';
        cards.forEach(card => {
          card.style.minHeight = uniformHeight;
          card.style.height = uniformHeight;
        });
      }
    } else {
      // Desktop: rely on CSS grid stretch and ensure full cell fill
      cards.forEach(card => {
        card.style.minHeight = '';
        card.style.height = '100%';
      });
    }
  }

  // Run immediately and once web fonts are fully loaded
  equalizeHeights();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(equalizeHeights);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(track);
  }

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      track.scrollLeft = 0;
    }
    equalizeHeights();
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(equalizeHeights, 150);
  });
}

/**
  * Interactive Liturgical Tabs Handler
  */
function initLiturgicalTabs() {
  const tabBtns = document.querySelectorAll('.liturgical-tab-btn');
  const tabPanels = document.querySelectorAll('.liturgical-tab-panel');
  if (!tabBtns.length || !tabPanels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-tab');
      if (!targetId) return;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => {
        p.classList.remove('active');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}


