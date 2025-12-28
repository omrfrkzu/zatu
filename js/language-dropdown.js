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

    const mobileTrigger = document.getElementById('mobile-language-dropdown-trigger');
    const mobileMenu = document.getElementById('mobile-language-dropdown-menu');
    if (mobileTrigger && mobileMenu) {
      closeDropdown(mobileTrigger, mobileMenu);
    }

    // Here you can add language switching logic
    // For now, we just update the display
    console.log('Language changed to:', lang);
  }

  // Initialize on DOM ready
  function init() {
    // Set initial language
    const currentLang = getCurrentLanguage();
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

    // Mobile dropdown
    const mobileTrigger = document.getElementById('mobile-language-dropdown-trigger');
    const mobileMenu = document.getElementById('mobile-language-dropdown-menu');
    
    if (mobileTrigger && mobileMenu) {
      // Toggle on trigger click
      mobileTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(mobileTrigger, mobileMenu);
      });

      // Handle menu item clicks
      const mobileMenuItems = mobileMenu.querySelectorAll('.language-menu-item');
      mobileMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          const lang = this.getAttribute('data-locale');
          if (lang) {
            handleLanguageSelect(lang);
          }
        });
      });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (desktopTrigger && desktopMenu && !desktopTrigger.contains(e.target) && !desktopMenu.contains(e.target)) {
        closeDropdown(desktopTrigger, desktopMenu);
      }
      if (mobileTrigger && mobileMenu && !mobileTrigger.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeDropdown(mobileTrigger, mobileMenu);
      }
    });

    // Close dropdowns on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (desktopTrigger && desktopMenu) {
          closeDropdown(desktopTrigger, desktopMenu);
        }
        if (mobileTrigger && mobileMenu) {
          closeDropdown(mobileTrigger, mobileMenu);
        }
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

