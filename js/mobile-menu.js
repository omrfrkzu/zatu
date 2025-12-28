// ================= Mobile Menu Component =====================
(function() {
  'use strict';

  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const mobileMenuWrapper = document.getElementById('mobile-menu-wrapper');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const menuLinks = document.querySelectorAll('.mobile-nav-item');
  let isOpen = false;
  let previousHash = window.location.hash;

  // Check if mobile menu elements exist
  if (!menuToggle || !mobileMenuWrapper) {
    return;
  }

  // Open menu
  function openMenu() {
    if (isOpen) return;
    
    isOpen = true;
    mobileMenuWrapper.classList.add('active');
    mobileMenuWrapper.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  }

  // Close menu
  function closeMenu() {
    if (!isOpen) return;
    
    isOpen = false;
    mobileMenuWrapper.classList.remove('active');
    mobileMenuWrapper.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Unlock body scroll
    document.body.style.overflow = '';
    
    // Return focus to toggle button
    if (menuToggle) {
      menuToggle.focus();
    }
  }

  // Toggle menu
  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Handle ESC key
  function handleEscape(e) {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  }

  // Handle click on overlay
  function handleOverlayClick(e) {
    if (isOpen) {
      closeMenu();
    }
  }

  // Handle hash/route changes
  function handleHashChange() {
    const currentHash = window.location.hash;
    if (currentHash !== previousHash && isOpen) {
      closeMenu();
    }
    previousHash = currentHash;
  }

  // Handle link clicks - close menu and scroll smoothly
  function handleLinkClick(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      // Anchor link - close menu first, then scroll
      closeMenu();
      
      // Wait for menu to close, then scroll
      setTimeout(() => {
        const targetId = href.replace('#', '');
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      // Page link - close menu immediately
      closeMenu();
    }
  }

  // Event listeners
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  // ESC key handler
  window.addEventListener('keydown', handleEscape);

  // Overlay click handler
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', handleOverlayClick);
  }

  // Hash change handler
  window.addEventListener('hashchange', handleHashChange);

  // Link click handlers
  menuLinks.forEach(link => {
    link.addEventListener('click', handleLinkClick);
  });

  // Close on window resize to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024 && isOpen) {
        closeMenu();
      }
    }, 250);
  });

  // Initialize - ensure menu is closed on load
  closeMenu();

})();

