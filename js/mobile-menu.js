// ================= Mobile Menu Component =====================
(function() {
  'use strict';

  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');
  const firstLink = document.querySelector('.mobile-nav-link[data-first-link]');
  let isOpen = false;
  let previousHash = window.location.hash;

  // Check if mobile menu elements exist
  if (!menuToggle || !mobileMenu) {
    return;
  }

  // Open menu
  function openMenu() {
    if (isOpen) return;
    
    isOpen = true;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first link after a short delay
    setTimeout(() => {
      if (firstLink) {
        firstLink.focus();
      }
    }, 100);
  }

  // Close menu
  function closeMenu() {
    if (!isOpen) return;
    
    isOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
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

  // Handle click outside menu
  function handleClickOutside(e) {
    if (isOpen && mobileMenu.contains(e.target) && !e.target.closest('.mobile-menu-header') && !e.target.closest('.mobile-menu-nav')) {
      // Click was inside menu content, don't close
      return;
    }
    
    // If click was on backdrop or outside menu
    if (isOpen && e.target === mobileMenu) {
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

  // Click outside handler
  mobileMenu.addEventListener('click', handleClickOutside);

  // Hash change handler
  window.addEventListener('hashchange', handleHashChange);

  // Link click handlers
  menuLinks.forEach(link => {
    link.addEventListener('click', handleLinkClick);
  });

  // Close menu on window resize (if switching to desktop)
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

