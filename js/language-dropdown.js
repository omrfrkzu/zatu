// ================= Language Dropdown Functionality =====================

(function() {
  'use strict';

  // Language data
  const languages = {
    tr: {
      code: 'TR',
      name: 'Türkçe',
      flag: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="flag-icon">
        <rect width="18" height="18" fill="#E30A17"/>
        <circle cx="7" cy="9" r="4" fill="#FFFFFF"/>
        <circle cx="8.5" cy="9" r="3.5" fill="#E30A17"/>
        <path d="M12.5 6.5L12.8 7.3L13.6 7.1L12.9 7.6L13.2 8.4L12.5 7.9L11.8 8.4L12.1 7.6L11.4 7.1L12.2 7.3Z" fill="#FFFFFF"/>
      </svg>`,
      flagMobile: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" rx="2" fill="#E30A17"/>
        <circle cx="7.5" cy="10" r="4.5" fill="#FFFFFF"/>
        <circle cx="9" cy="10" r="4" fill="#E30A17"/>
        <path d="M13.5 7.5L13.8 8.3L14.6 8.1L13.9 8.6L14.2 9.4L13.5 8.9L12.8 9.4L13.1 8.6L12.4 8.1L13.2 8.3Z" fill="#FFFFFF"/>
      </svg>`
    },
    en: {
      code: 'EN',
      name: 'English',
      flag: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="flag-icon">
        <rect width="18" height="18" fill="#012169"/>
        <path d="M0 0L18 18M18 0L0 18" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M0 0L18 18M18 0L0 18" stroke="#C8102E" stroke-width="1.2"/>
        <path d="M9 0V18M0 9H18" stroke="#FFFFFF" stroke-width="2.5"/>
        <path d="M9 0V18M0 9H18" stroke="#C8102E" stroke-width="1.5"/>
      </svg>`,
      flagMobile: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="20" rx="2" fill="#012169"/>
        <path d="M0 0l20 20M20 0L0 20" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M0 0l20 20M20 0L0 20" stroke="#C8102E" stroke-width="1.2"/>
        <path d="M10 0v20M0 10h20" stroke="#FFFFFF" stroke-width="2.5"/>
        <path d="M10 0v20M0 10h20" stroke="#C8102E" stroke-width="1.5"/>
      </svg>`
    }
  };

  // Get current language from localStorage or default to 'tr'
  function getCurrentLanguage() {
    return localStorage.getItem('selectedLanguage') || 'tr';
  }

  // Set current language
  function setCurrentLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    updateLanguageDisplay(lang);
  }

  // Update language display
  function updateLanguageDisplay(lang) {
    const langData = languages[lang];
    if (!langData) return;

    // Update desktop trigger
    const desktopTrigger = document.getElementById('language-dropdown-trigger');
    if (desktopTrigger) {
      const flagEl = desktopTrigger.querySelector('#language-flag');
      const codeEl = desktopTrigger.querySelector('#language-code');
      if (flagEl) flagEl.innerHTML = langData.flag;
      if (codeEl) codeEl.textContent = langData.code;
    }

    // Update mobile trigger
    const mobileTrigger = document.getElementById('mobile-language-dropdown-trigger');
    if (mobileTrigger) {
      const mobileFlag = mobileTrigger.querySelector('#mobile-current-flag');
      const mobileName = mobileTrigger.querySelector('#mobile-language-name');
      if (mobileFlag) mobileFlag.innerHTML = langData.flagMobile || langData.flag;
      if (mobileName) mobileName.textContent = langData.name;
    }
  }

  // Toggle dropdown menu
  function toggleDropdown(trigger, menu) {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    trigger.setAttribute('aria-expanded', newState);
    menu.setAttribute('aria-hidden', !newState);
  }

  // Close dropdown menu
  function closeDropdown(trigger, menu) {
    trigger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  // Handle language selection
  function handleLanguageSelect(lang) {
    setCurrentLanguage(lang);
    
    // Close all dropdowns
    const desktopTrigger = document.getElementById('language-dropdown-trigger');
    const desktopMenu = document.getElementById('language-dropdown-menu');
    if (desktopTrigger && desktopMenu) {
      closeDropdown(desktopTrigger, desktopMenu);
    }

    // Close mobile bottom sheet modal
    const mobileMenu = document.getElementById('mobile-language-dropdown-menu');
    const mobileMenuOverlay = document.getElementById('mobile-language-menu-overlay');
    if (mobileMenu && mobileMenuOverlay) {
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenuOverlay.setAttribute('aria-hidden', 'true');
      mobileMenuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    const mobileTrigger = document.getElementById('mobile-language-dropdown-trigger');
    if (mobileTrigger) {
      mobileTrigger.setAttribute('aria-expanded', 'false');
    }

    // Get current path
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    // Determine if we're currently on /en or root
    const isEnglishPage = currentPath.includes('/en/') || currentPath === '/en' || currentPath.endsWith('/en');
    const isTurkishPage = !isEnglishPage;
    
    // Redirect based on selected language
    if (lang === 'en' && isTurkishPage) {
      // Switch to English: redirect to /en
      let pathWithoutLang = currentPath.replace(/^\//, '').replace(/^tr\//, '');
      if (pathWithoutLang === '' || pathWithoutLang === 'index.html') {
        pathWithoutLang = '';
      }
      const newPath = '/en/' + pathWithoutLang;
      window.location.href = newPath + currentHash;
    } else if (lang === 'tr' && isEnglishPage) {
      // Switch to Turkish: redirect to root
      let pathWithoutEn = currentPath.replace(/^\/en\//, '').replace(/^en\//, '');
      if (pathWithoutEn === '' || pathWithoutEn === 'index.html') {
        pathWithoutEn = '';
      }
      const newPath = '/' + pathWithoutEn;
      window.location.href = newPath + currentHash;
    }
    
    console.log('Language changed to:', lang);
  }

  // Initialize on DOM ready
  function init() {
    // Detect current language from URL path
    const currentPath = window.location.pathname;
    const isEnglishPage = currentPath.includes('/en/') || currentPath === '/en' || currentPath.endsWith('/en');
    
    // Set initial language based on URL or localStorage
    let currentLang = getCurrentLanguage();
    if (isEnglishPage) {
      currentLang = 'en';
      // Update localStorage to match URL
      setCurrentLanguage('en');
    } else {
      currentLang = 'tr';
      // Update localStorage to match URL
      setCurrentLanguage('tr');
    }
    
    updateLanguageDisplay(currentLang);

    // Desktop dropdown
    const desktopTrigger = document.getElementById('language-dropdown-trigger');
    const desktopMenu = document.getElementById('language-dropdown-menu');
    
    if (desktopTrigger && desktopMenu) {
      // Toggle on trigger click
      desktopTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(desktopTrigger, desktopMenu);
      });

      // Handle menu item clicks
      const menuItems = desktopMenu.querySelectorAll('.language-menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          const lang = this.getAttribute('data-lang');
          if (lang) {
            handleLanguageSelect(lang);
          }
        });
      });
    }

    // Mobile dropdown - Bottom Sheet Modal
    const mobileTrigger = document.getElementById('mobile-language-dropdown-trigger');
    const mobileMenu = document.getElementById('mobile-language-dropdown-menu');
    const mobileMenuOverlay = document.getElementById('mobile-language-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-language-menu-close');
    
    // Function to open mobile language menu
    function openMobileLanguageMenu() {
      if (mobileMenu && mobileMenuOverlay) {
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenuOverlay.setAttribute('aria-hidden', 'false');
        mobileMenuOverlay.classList.add('active');
        if (mobileTrigger) {
          mobileTrigger.setAttribute('aria-expanded', 'true');
        }
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
      }
    }
    
    // Function to close mobile language menu
    function closeMobileLanguageMenu() {
      if (mobileMenu && mobileMenuOverlay) {
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuOverlay.setAttribute('aria-hidden', 'true');
        mobileMenuOverlay.classList.remove('active');
        if (mobileTrigger) {
          mobileTrigger.setAttribute('aria-expanded', 'false');
        }
        // Restore body scroll
        document.body.style.overflow = '';
      }
    }
    
    if (mobileTrigger && mobileMenu && mobileMenuOverlay) {
      // Open on trigger click
      mobileTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openMobileLanguageMenu();
      });

      // Close on overlay click
      mobileMenuOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMobileLanguageMenu();
      });
      
      // Close on close button click
      if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          closeMobileLanguageMenu();
        });
      }

      // Handle menu item clicks
      const mobileMenuItems = mobileMenu.querySelectorAll('.mobile-language-menu-item');
      mobileMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const lang = this.getAttribute('data-locale');
          if (lang) {
            closeMobileLanguageMenu();
            // Small delay to allow modal to close smoothly
            setTimeout(() => {
              handleLanguageSelect(lang);
            }, 200);
          }
        });
      });
      
      // Close on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
          closeMobileLanguageMenu();
        }
      });
    }

    // Close desktop dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (desktopTrigger && desktopMenu && !desktopTrigger.contains(e.target) && !desktopMenu.contains(e.target)) {
        closeDropdown(desktopTrigger, desktopMenu);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

