

(function() {
  'use strict';

  
  const languages = {
    tr: {
      code: 'TR',
      name: 'Türkçe',
      flag: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" fill="#E30A17"/><circle cx="7" cy="9" r="4" fill="#FFFFFF"/><circle cx="8.5" cy="9" r="3.5" fill="#E30A17"/><path d="M12.5 6.5L12.8 7.3L13.6 7.1L12.9 7.6L13.2 8.4L12.5 7.9L11.8 8.4L12.1 7.6L11.4 7.1L12.2 7.3Z" fill="#FFFFFF"/></svg>`,
      flagMobile: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="2" fill="#E30A17"/><circle cx="7.5" cy="10" r="4.5" fill="#FFFFFF"/><circle cx="9" cy="10" r="4" fill="#E30A17"/><path d="M13.5 7.5L13.8 8.3L14.6 8.1L13.9 8.6L14.2 9.4L13.5 8.9L12.8 9.4L13.1 8.6L12.4 8.1L13.2 8.3Z" fill="#FFFFFF"/></svg>`
    },
    en: {
      code: 'EN',
      name: 'English',
      flag: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" fill="#012169"/><path d="M0 0L18 18M18 0L0 18" stroke="#FFFFFF" stroke-width="2"/><path d="M0 0L18 18M18 0L0 18" stroke="#C8102E" stroke-width="1.2"/><path d="M9 0V18M0 9H18" stroke="#FFFFFF" stroke-width="2.5"/><path d="M9 0V18M0 9H18" stroke="#C8102E" stroke-width="1.5"/></svg>`,
      flagMobile: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="2" fill="#012169"/><path d="M0 0l20 20M20 0L0 20" stroke="#FFFFFF" stroke-width="2"/><path d="M0 0l20 20M20 0L0 20" stroke="#C8102E" stroke-width="1.2"/><path d="M10 0v20M0 10h20" stroke="#FFFFFF" stroke-width="2.5"/><path d="M10 0v20M0 10h20" stroke="#C8102E" stroke-width="1.5"/></svg>`
    }
  };

  
  function getCurrentLanguage() {
    return localStorage.getItem('selectedLanguage') || 'tr';
  }

  
  function setCurrentLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    updateLanguageDisplay(lang);
  }

  
  function updateLanguageDisplay(lang) {
    const langData = languages[lang];
    if (!langData) return;

    
    const desktopTrigger = document.getElementById('language-dropdown-trigger');
    if (desktopTrigger) {
      const flagEl = desktopTrigger.querySelector('#language-flag');
      const codeEl = desktopTrigger.querySelector('#language-code');
      const nameEl = desktopTrigger.querySelector('#language-name-trigger');
      if (flagEl) flagEl.innerHTML = langData.flag;
      var target = nameEl || codeEl;
      if (target) target.textContent = langData.name;
    }

    
    const mobileTrigger = document.getElementById('mobile-language-dropdown-trigger');
    if (mobileTrigger) {
      const mobileFlag = mobileTrigger.querySelector('#mobile-current-flag');
      const mobileName = mobileTrigger.querySelector('#mobile-language-name');
      if (mobileFlag) mobileFlag.innerHTML = langData.flagMobile || langData.flag;
      if (mobileName) mobileName.textContent = langData.name;
    }
  }

  
  function toggleDropdown(trigger, menu) {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    trigger.setAttribute('aria-expanded', newState);
    menu.setAttribute('aria-hidden', !newState);
  }

  
  function closeDropdown(trigger, menu) {
    trigger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  
  function handleLanguageSelect(lang) {
    setCurrentLanguage(lang);
    
    
    const desktopTrigger = document.getElementById('language-dropdown-trigger');
    const desktopMenu = document.getElementById('language-dropdown-menu');
    if (desktopTrigger && desktopMenu) {
      closeDropdown(desktopTrigger, desktopMenu);
    }

    
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

    
    var currentPath = window.location.pathname;
    var currentHash = window.location.hash || '';
    var isFile = window.location.protocol === 'file:';
    var href = window.location.href;

    var isEnglishPage = isFile
      ? (href.indexOf('/en/') >= 0 || /\/en\/?(\?|#|$)/.test(href))
      : (currentPath.includes('/en/') || currentPath === '/en' || currentPath.endsWith('/en'));
    var isTurkishPage = !isEnglishPage;

    function goToUrl(path, hash) {
      if (isFile) {
        var base = href.substring(0, href.lastIndexOf('/') + 1);
        window.location.href = base + path.replace(/^\//, '') + (hash || '');
      } else {
        window.location.href = window.location.origin + path + (hash || '');
      }
    }

    if (lang === 'en' && isTurkishPage) {
      var pathWithoutLang = isFile ? (href.substring(href.lastIndexOf('/') + 1) || 'index.html') : currentPath.replace(/^\/+/, '');
      if (pathWithoutLang === '' || pathWithoutLang === 'index.html') {
        pathWithoutLang = 'index.html';
      }
      goToUrl('/en/' + pathWithoutLang, currentHash);
    } else if (lang === 'tr' && isEnglishPage) {
      if (isFile) {
        var base = href.substring(0, href.lastIndexOf('/') + 1);
        var filename = href.substring(href.lastIndexOf('/') + 1) || 'index.html';
        base = base.replace(/\/en\/?$/, '/');
        window.location.href = base + filename + currentHash;
      } else {
        var pathWithoutEn = currentPath.replace(/^\/en\/?/, '');
        if (pathWithoutEn === '' || pathWithoutEn === 'index.html') {
          pathWithoutEn = '';
        }
        goToUrl('/' + pathWithoutEn, currentHash);
      }
    }
    
    console.log('Language changed to:', lang);
  }

  
  function init() {
    
    const currentPath = window.location.pathname;
    const isEnglishPage = currentPath.includes('/en/') || currentPath === '/en' || currentPath.endsWith('/en');
    
    
    let currentLang = getCurrentLanguage();
    if (isEnglishPage) {
      currentLang = 'en';
      
      setCurrentLanguage('en');
    } else {
      currentLang = 'tr';
      
      setCurrentLanguage('tr');
    }
    
    updateLanguageDisplay(currentLang);

    
    const desktopTrigger = document.getElementById('language-dropdown-trigger');
    const desktopMenu = document.getElementById('language-dropdown-menu');
    
    if (desktopTrigger && desktopMenu) {
      
      desktopTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(desktopTrigger, desktopMenu);
      });

      
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

    
    const mobileTrigger = document.getElementById('mobile-language-dropdown-trigger');
    const mobileMenu = document.getElementById('mobile-language-dropdown-menu');
    const mobileMenuOverlay = document.getElementById('mobile-language-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-language-menu-close');
    
    
    function openMobileLanguageMenu() {
      if (mobileMenu && mobileMenuOverlay) {
        mobileMenu.setAttribute('aria-hidden', 'false');
        mobileMenuOverlay.setAttribute('aria-hidden', 'false');
        mobileMenuOverlay.classList.add('active');
        if (mobileTrigger) {
          mobileTrigger.setAttribute('aria-expanded', 'true');
        }
        
        document.body.style.overflow = 'hidden';
      }
    }
    
    
    function closeMobileLanguageMenu() {
      if (mobileMenu && mobileMenuOverlay) {
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuOverlay.setAttribute('aria-hidden', 'true');
        mobileMenuOverlay.classList.remove('active');
        if (mobileTrigger) {
          mobileTrigger.setAttribute('aria-expanded', 'false');
        }
        
        document.body.style.overflow = '';
      }
    }
    
    if (mobileTrigger && mobileMenu && mobileMenuOverlay) {
      
      mobileTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openMobileLanguageMenu();
      });

      
      mobileMenuOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMobileLanguageMenu();
      });
      
      
      if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          closeMobileLanguageMenu();
        });
      }

      
      const mobileMenuItems = mobileMenu.querySelectorAll('.mobile-language-menu-item');
      mobileMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const lang = this.getAttribute('data-locale');
          if (lang) {
            closeMobileLanguageMenu();
            
            setTimeout(() => {
              handleLanguageSelect(lang);
            }, 200);
          }
        });
      });
      
      
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
          closeMobileLanguageMenu();
        }
      });
    }

    
    document.addEventListener('click', function(e) {
      if (desktopTrigger && desktopMenu && !desktopTrigger.contains(e.target) && !desktopMenu.contains(e.target)) {
        closeDropdown(desktopTrigger, desktopMenu);
      }
    });
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

