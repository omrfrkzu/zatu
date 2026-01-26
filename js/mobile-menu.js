
(function() {
  'use strict';

  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const mobileMenuWrapper = document.getElementById('mobile-menu-wrapper');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuDrawer = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-nav-item');
  let isOpen = false;
  let previousHash = window.location.hash;
  
  
  let touchStartY = 0;
  let touchCurrentY = 0;
  let isDragging = false;

  
  if (!menuToggle || !mobileMenuWrapper) {
    return;
  }

  
  function openMenu() {
    if (isOpen) return;
    
    isOpen = true;
    mobileMenuWrapper.classList.add('active');
    mobileMenuWrapper.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    
    
    document.body.style.overflow = 'hidden';
  }

  
  function closeMenu() {
    if (!isOpen) return;
    
    isOpen = false;
    mobileMenuWrapper.classList.remove('active');
    mobileMenuWrapper.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    
    if (mobileMenuDrawer) {
      mobileMenuDrawer.style.transform = '';
    }
    
    
    document.body.style.overflow = '';
    
    
    if (menuToggle) {
      menuToggle.focus();
    }
  }

  
  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  
  function handleEscape(e) {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  }

  
  function handleOverlayClick(e) {
    if (isOpen) {
      closeMenu();
    }
  }

  
  function handleHashChange() {
    const currentHash = window.location.hash;
    if (currentHash !== previousHash && isOpen) {
      closeMenu();
    }
    previousHash = currentHash;
  }

  
  function handleLinkClick(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      
      closeMenu();
      
      
      setTimeout(() => {
        const targetId = href.replace('#', '');
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      
      closeMenu();
    }
  }

  
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  
  window.addEventListener('keydown', handleEscape);

  
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', handleOverlayClick);
  }

  
  window.addEventListener('hashchange', handleHashChange);

  
  menuLinks.forEach(link => {
    link.addEventListener('click', handleLinkClick);
  });

  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024 && isOpen) {
        closeMenu();
      }
    }, 250);
  });

  
  if (mobileMenuDrawer) {
    
    mobileMenuDrawer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        isDragging = true;
      }
    }, { passive: true });

    
    mobileMenuDrawer.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        touchCurrentY = e.touches[0].clientY;
        const deltaY = touchCurrentY - touchStartY;
        
        
        if (deltaY > 0) {
          const translateY = Math.min(deltaY, 100);
          mobileMenuDrawer.style.transform = `translateY(${translateY}px)`;
        }
      }
    }, { passive: true });

    
    mobileMenuDrawer.addEventListener('touchend', (e) => {
      if (isDragging) {
        const deltaY = touchCurrentY - touchStartY;
        const threshold = 50; 
        
        if (deltaY > threshold) {
          closeMenu();
        } else {
          
          mobileMenuDrawer.style.transform = '';
        }
        
        isDragging = false;
        touchStartY = 0;
        touchCurrentY = 0;
      }
    }, { passive: true });
  }

  
  if (mobileMenuDrawer) {
    
    mobileMenuDrawer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && isOpen) {
        touchStartY = e.touches[0].clientY;
        isDragging = true;
      }
    }, { passive: true });

    
    mobileMenuDrawer.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1 && isOpen) {
        touchCurrentY = e.touches[0].clientY;
        const deltaY = touchCurrentY - touchStartY;
        
        
        if (deltaY > 0) {
          const translateY = Math.min(deltaY, 200);
          mobileMenuDrawer.style.transform = `translateY(${translateY}px)`;
        }
      }
    }, { passive: true });

    
    mobileMenuDrawer.addEventListener('touchend', (e) => {
      if (isDragging && isOpen) {
        const deltaY = touchCurrentY - touchStartY;
        const threshold = 80; 
        
        if (deltaY > threshold) {
          closeMenu();
        } else {
          
          mobileMenuDrawer.style.transform = '';
        }
        
        isDragging = false;
        touchStartY = 0;
        touchCurrentY = 0;
      }
    }, { passive: true });
  }

  
  closeMenu();

})();

