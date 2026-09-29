/**
 * DIGIT MAXZ - CORE JAVASCRIPT
 * Controls header stickiness, mobile navigation drawer, FAQ accordions, and scroll animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initFaqAccordions();
  initScrollAnimations();
  initDynamicYear();
});

// Sticky Header on Scroll
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// Mobile Navigation Toggle & Dropdowns
function initMobileNav() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (!mobileToggle || !mainNav) return;

  mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  // Handle accordion sub-menus on mobile
  const navItems = mainNav.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const hasDropdown = item.querySelector('.mega-menu, .dropdown-simple');

    if (hasDropdown && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  // Close nav on click outside
  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
      mainNav.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });
}

// FAQ Accordion Interaction
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close sibling FAQs for clean single-open accordion feel
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Scroll Reveal with IntersectionObserver
function initScrollAnimations() {
  const animatedEls = document.querySelectorAll('.fade-up');
  if (!animatedEls.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    animatedEls.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    animatedEls.forEach(el => el.classList.add('visible'));
  }
}

// Auto Update Copyright Year
function initDynamicYear() {
  const yearEls = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = currentYear;
  });
}
