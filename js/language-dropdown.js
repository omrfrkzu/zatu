// ================= Language Dropdown Component =====================
(function() {
  'use strict';

  const LANGUAGE_KEY = 'zatu-language';
  const DEFAULT_LANG = 'tr';
  
  // Flag SVGs
  const FLAGS = {
    tr: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="flag-icon">
      <rect width="18" height="6" fill="#E30A17"/>
      <rect y="6" width="18" height="6" fill="#FFFFFF"/>
      <rect y="12" width="18" height="6" fill="#E30A17"/>
      <circle cx="9" cy="9" r="3" fill="#E30A17"/>
      <circle cx="9" cy="9" r="2" fill="#FFFFFF"/>
      <circle cx="9" cy="9" r="1.2" fill="#E30A17"/>
    </svg>`,
    en: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="flag-icon">
      <rect width="18" height="18" fill="#012169"/>
      <path d="M0 0L18 18M18 0L0 18" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M0 0L18 18M18 0L0 18" stroke="#C8102E" stroke-width="1.2"/>
      <path d="M9 0V18M0 9H18" stroke="#FFFFFF" stroke-width="2.5"/>
      <path d="M9 0V18M0 9H18" stroke="#C8102E" stroke-width="1.5"/>
    </svg>`
  };

  const LANGUAGE_NAMES = {
    tr: { name: 'Türkçe', code: 'TR' },
    en: { name: 'English', code: 'EN' }
  };
  
  // Get current language from cookie/localStorage
  function getCurrentLanguage() {
    // Try cookie first
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === LANGUAGE_KEY) {
        return value || DEFAULT_LANG;
      }
    }
    
    // Fallback to localStorage
    return localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANG;
  }

  // Set language in cookie and localStorage
  function setLanguage(lang) {
    // Set cookie (expires in 1 year)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${LANGUAGE_KEY}=${lang};expires=${expires.toUTCString()};path=/`;
    
    // Set localStorage
    localStorage.setItem(LANGUAGE_KEY, lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  // Update dropdown UI
  function updateDropdownUI(lang) {
    const langInfo = LANGUAGE_NAMES[lang] || LANGUAGE_NAMES[DEFAULT_LANG];
    
    // Desktop dropdown
    const desktopFlag = document.getElementById('language-flag');
    const desktopCode = document.getElementById('language-code');
    
    if (desktopFlag) {
      desktopFlag.innerHTML = FLAGS[lang] || FLAGS[DEFAULT_LANG];
    }
    if (desktopCode) {
      desktopCode.textContent = langInfo.code;
    }

    // Mobile dropdown
    const mobileFlag = document.getElementById('mobile-language-flag');
    const mobileCode = document.getElementById('mobile-language-code');
    
    if (mobileFlag) {
      mobileFlag.innerHTML = FLAGS[lang] || FLAGS[DEFAULT_LANG];
    }
    if (mobileCode) {
      mobileCode.textContent = langInfo.code;
    }
  }

  // Handle language change
  function handleLanguageChange(lang) {
    setLanguage(lang);
    updateDropdownUI(lang);
    closeAllDropdowns();
    
    // Here you would typically reload translations or update content
    console.log('Language changed to:', lang);
    
    // If you have translation files, load them here
    // loadTranslations(lang);
  }

  // Dropdown management
  function initDropdown(triggerId, menuId) {
    const trigger = document.getElementById(triggerId);
    const menu = document.getElementById(menuId);
    
    if (!trigger || !menu) return;

    let isOpen = false;

    function openDropdown() {
      isOpen = true;
      menu.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      isOpen = false;
      menu.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown() {
      if (isOpen) {
        closeDropdown();
      } else {
        closeAllDropdowns();
        openDropdown();
      }
    }

    // Toggle on click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !trigger.contains(e.target) && !menu.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeDropdown();
        trigger.focus();
      }
    });

    // Handle menu item clicks
    const menuItems = menu.querySelectorAll('.language-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = item.getAttribute('data-lang');
        if (lang) {
          handleLanguageChange(lang);
        }
      });

      // Keyboard navigation
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const lang = item.getAttribute('data-lang');
          if (lang) {
            handleLanguageChange(lang);
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = item.nextElementSibling;
          if (next) next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = item.previousElementSibling;
          if (prev) prev.focus();
        }
      });
    });

    return { openDropdown, closeDropdown, isOpen: () => isOpen };
  }

  // Close all dropdowns
  function closeAllDropdowns() {
    const triggers = document.querySelectorAll('.language-dropdown-trigger, .mobile-language-dropdown-trigger');
    const menus = document.querySelectorAll('.language-dropdown-menu, .mobile-language-dropdown-menu');
    
    triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
    });
    
    menus.forEach(menu => {
      menu.setAttribute('aria-hidden', 'true');
    });
  }

  // Initialize language dropdown
  function initLanguageDropdown() {
    const currentLang = getCurrentLanguage();
    
    // Set initial language
    setLanguage(currentLang);
    updateDropdownUI(currentLang);

    // Initialize desktop dropdown
    initDropdown('language-dropdown-trigger', 'language-dropdown-menu');

    // Initialize mobile dropdown
    initDropdown('mobile-language-dropdown-trigger', 'mobile-language-dropdown-menu');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageDropdown);
  } else {
    initLanguageDropdown();
  }

  // Expose API for external use
  window.LanguageDropdown = {
    getCurrentLanguage,
    setLanguage: handleLanguageChange,
    onLanguageChange: (callback) => {
      window.addEventListener('languageChanged', (e) => callback(e.detail.lang));
    }
  };
})();


