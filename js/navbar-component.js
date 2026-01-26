



(function() {
  'use strict';

  
  function getPageContext() {
    const path = window.location.pathname;
    const isEnglish = path.includes('/en/') || path === '/en' || path.endsWith('/en');
    const isRoot = !isEnglish;
    
    
    let basePath = '';
    if (isEnglish) {
      basePath = '../';
    }
    
    return {
      isEnglish,
      isRoot,
      basePath
    };
  }

  
  function getNavbarHTML(context) {
    const { isEnglish, basePath } = context;
    
    
    const texts = isEnglish ? {
      menu: 'Menu',
      close: 'Close',
      mainMenu: 'Main Menu',
      whyWeExist: 'Why We Exist?',
      howItWorks: 'How It Works?',
      joinNetwork: 'Join Network',
      completeProfile: 'Complete Your Profile',
      disasterOpinions: 'Disaster Opinions',
      ctaButton: 'BE PART OF THE NETWORK',
      languageSelection: 'Language selection',
      darkMode: 'Dark mode',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      turkish: 'Türkçe',
      english: 'English',
      selectLanguage: 'Select Language',
      whyWeExistHref: '#why-we-exist',
      howItWorksHref: '#how-it-works',
      joinNetworkHref: 'kayit.html',
      completeProfileHref: '#complete-profile',
      disasterOpinionsHref: '#disaster-opinions',
      logoAlt: 'National Disaster Network',
      homeHref: '#top'
    } : {
      menu: 'Menü',
      close: 'Kapat',
      mainMenu: 'Ana Menü',
      whyWeExist: 'Neden Varız?',
      howItWorks: 'Nasıl Çalışır?',
      joinNetwork: 'Ağa Katıl',
      completeProfile: 'Profilini Tamamla',
      disasterOpinions: 'Afet Görüşleri',
      ctaButton: 'Ağa Katıl',
      languageSelection: 'Dil seçimi',
      darkMode: 'Karanlık mod',
      openMenu: 'Menüyü aç',
      closeMenu: 'Menüyü kapat',
      turkish: 'Türkçe',
      english: 'English',
      selectLanguage: 'Dil Seç',
      whyWeExistHref: '#neden-variz',
      howItWorksHref: '#nasil-calisir',
      joinNetworkHref: 'kayit.html',
      completeProfileHref: '#profilini-tamamla',
      disasterOpinionsHref: '#afet-anketi',
      logoAlt: 'Ulusal Afet Ağı',
      homeHref: '#top'
    };

    
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') ||
                       window.location.pathname.endsWith('/en/') ||
                       window.location.pathname.endsWith('/en/index.html');
    
    
    if (!isIndexPage) {
      const indexPath = isEnglish ? 'index.html' : 'index.html';
      texts.whyWeExistHref = indexPath + texts.whyWeExistHref;
      texts.howItWorksHref = indexPath + texts.howItWorksHref;
      texts.completeProfileHref = indexPath + texts.completeProfileHref;
      texts.disasterOpinionsHref = indexPath + texts.disasterOpinionsHref;
      texts.homeHref = indexPath;
    }

    
    const currentFlag = isEnglish ? `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http:
        <rect width="18" height="18" fill="#012169"/>
        <path d="M0 0L18 18M18 0L0 18" stroke="#FFFFFF" stroke-width="2"/>
        <path d="M0 0L18 18M18 0L0 18" stroke="#C8102E" stroke-width="1.2"/>
        <path d="M9 0V18M0 9H18" stroke="#FFFFFF" stroke-width="2.5"/>
        <path d="M9 0V18M0 9H18" stroke="#C8102E" stroke-width="1.5"/>
      </svg>
    ` : `
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http:
        <rect width="18" height="18" fill="#E30A17"/>
        <circle cx="7" cy="9" r="4" fill="#FFFFFF"/>
        <circle cx="8.5" cy="9" r="3.5" fill="#E30A17"/>
        <path d="M12.5 6.5L12.8 7.3L13.6 7.1L12.9 7.6L13.2 8.4L12.5 7.9L11.8 8.4L12.1 7.6L11.4 7.1L12.2 7.3Z" fill="#FFFFFF"/>
      </svg>
    `;

    const currentFlagMobile = isEnglish ? `
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http:
        <rect width="20" height="20" rx="2" fill="#012169"/>
        <path d="M0 0l20 20M20 0L0 20" stroke="white" stroke-width="2"/>
        <path d="M0 0l20 20M20 0L0 20" stroke="#C8102E" stroke-width="1.2"/>
      </svg>
    ` : `
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http:
        <rect width="20" height="20" rx="2" fill="#E30A17"/>
        <circle cx="7.5" cy="10" r="4.5" fill="#FFFFFF"/>
        <circle cx="9" cy="10" r="4" fill="#E30A17"/>
        <path d="M13.5 7.5L13.8 8.3L14.6 8.1L13.9 8.6L14.2 9.4L13.5 8.9L12.8 9.4L13.1 8.6L12.4 8.1L13.2 8.3Z" fill="#FFFFFF"/>
      </svg>
    `;

    const currentLanguageCode = isEnglish ? 'EN' : 'TR';
    const currentLanguageName = isEnglish ? 'English' : 'Türkçe';

    return `
  <!-- ======= start Header ======= -->
  <header id="site-header" class="header-sticky">
    <div class="nav-shell">
      <!-- Left: Logo -->
      <div class="nav-left">
        <a class="navbar-brand" href="${texts.homeHref}"><img src="${basePath}images/logo1.png" class="logo" alt="${texts.logoAlt}"></a>
      </div>
      
      <!-- Center: Nav Links (Absolute Centered on Desktop) -->
      <nav class="nav-center desktop-nav">
        <div class="navbar-collapse">
          <ul class="navbar-nav menu" id="navbar">
            <li class="nav-item">
              <a class="nav-link" href="${texts.whyWeExistHref}">${texts.whyWeExist}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${texts.howItWorksHref}">${texts.howItWorks}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${texts.joinNetworkHref}">${texts.joinNetwork}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${texts.completeProfileHref}">${texts.completeProfile}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${texts.disasterOpinionsHref}">${texts.disasterOpinions}</a>
            </li>
          </ul>
        </div>
      </nav>
      
      <!-- Right: Actions (Desktop: Language + CTA + Theme | Mobile: Theme + Hamburger) -->
      <div class="nav-right">
        <!-- Language Dropdown (Desktop Only) -->
        <div class="language-dropdown-wrapper desktop-language-dropdown">
          <button 
            type="button" 
            id="language-dropdown-trigger" 
            class="language-dropdown-trigger" 
            aria-haspopup="menu" 
            aria-expanded="false"
            aria-label="${texts.languageSelection}">
            <span class="language-flag" id="language-flag">
              ${currentFlag}
            </span>
            <span class="language-code" id="language-code">${currentLanguageCode}</span>
            <i class="bi bi-chevron-down language-chevron"></i>
          </button>
          <div id="language-dropdown-menu" class="language-dropdown-menu" role="menu" aria-hidden="true">
            <button 
              type="button" 
              class="language-menu-item" 
              role="menuitem" 
              data-lang="tr"
              aria-label="Türkçe">
              <span class="language-flag">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http:
                  <rect width="18" height="18" fill="#E30A17"/>
                  <circle cx="7" cy="9" r="4" fill="#FFFFFF"/>
                  <circle cx="8.5" cy="9" r="3.5" fill="#E30A17"/>
                  <path d="M12.5 6.5L12.8 7.3L13.6 7.1L12.9 7.6L13.2 8.4L12.5 7.9L11.8 8.4L12.1 7.6L11.4 7.1L12.2 7.3Z" fill="#FFFFFF"/>
                </svg>
              </span>
              <span class="language-code-small">TR</span>
              <span class="language-name">${texts.turkish}</span>
            </button>
            <button 
              type="button" 
              class="language-menu-item" 
              role="menuitem" 
              data-lang="en"
              aria-label="English">
              <span class="language-flag">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http:
                  <rect width="18" height="18" fill="#012169"/>
                  <path d="M0 0L18 18M18 0L0 18" stroke="#FFFFFF" stroke-width="2"/>
                  <path d="M0 0L18 18M18 0L0 18" stroke="#C8102E" stroke-width="1.2"/>
                  <path d="M9 0V18M0 9H18" stroke="#FFFFFF" stroke-width="2.5"/>
                  <path d="M9 0V18M0 9H18" stroke="#C8102E" stroke-width="1.5"/>
                </svg>
              </span>
              <span class="language-code-small">EN</span>
              <span class="language-name">${texts.english}</span>
            </button>
          </div>
        </div>
        
        <!-- CTA Button (Desktop Only) -->
        <a class="btn btn-cta desktop-cta" href="${texts.joinNetworkHref}" aria-label="${texts.joinNetwork} – 2 Dakikada Kayıt">${texts.ctaButton}</a>
        
        <!-- Dark Mode Toggle (Visible on both desktop and mobile) -->
        <button id="mode-toggle" class="btn-light-mode switch-button mode-toggle-universal" aria-label="${texts.darkMode}">
          <i id="mode-icon" class="bi bi-moon-fill"></i>
        </button>
        
        <!-- Mobile Actions: Hamburger (Mobile only) -->
        <div class="mobile-actions">
          <button id="mobile-menu-toggle" class="mobile-menu-toggle" type="button" aria-controls="mobile-menu" aria-expanded="false" aria-label="${texts.openMenu}">
            <i class="bi bi-list" id="menu-icon"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
  <!-- ======= end Header ======= -->

  <!-- ======= Mobile Menu Drawer (Fixed Overlay) ======= -->
  <div id="mobile-menu-wrapper" class="mobile-menu-wrapper" aria-hidden="true">
    <!-- Overlay -->
    <button 
      id="mobile-menu-overlay" 
      class="mobile-menu-overlay" 
      aria-label="${texts.closeMenu}"
      type="button">
    </button>
    
    <!-- Drawer Panel -->
    <aside 
      id="mobile-menu" 
      class="mobile-menu-drawer" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="mobile-menu-title">
      <!-- Header with Swipe Handle -->
      <div class="mobile-menu-header">
        <div class="mobile-menu-swipe-handle"></div>
        <div class="mobile-menu-header-content">
          <h2 id="mobile-menu-title" class="mobile-menu-title">${texts.menu}</h2>
          <button 
            id="mobile-menu-close" 
            class="mobile-menu-close" 
            aria-label="${texts.close}" 
            type="button">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="mobile-menu-nav">
        <!-- Primary Section -->
        <div class="mobile-menu-section">
          <div class="mobile-menu-section-label">${texts.mainMenu}</div>
          <a href="${texts.whyWeExistHref}" class="mobile-nav-item">
            <i class="bi bi-question-circle" aria-hidden="true"></i>
            <span>${texts.whyWeExist}</span>
            <i class="bi bi-chevron-right mobile-nav-chevron" aria-hidden="true"></i>
          </a>
          <a href="${texts.howItWorksHref}" class="mobile-nav-item">
            <i class="bi bi-gear" aria-hidden="true"></i>
            <span>${texts.howItWorks}</span>
            <i class="bi bi-chevron-right mobile-nav-chevron" aria-hidden="true"></i>
          </a>
          <a href="${texts.disasterOpinionsHref}" class="mobile-nav-item">
            <i class="bi bi-chat-dots" aria-hidden="true"></i>
            <span>${texts.disasterOpinions}</span>
            <i class="bi bi-chevron-right mobile-nav-chevron" aria-hidden="true"></i>
          </a>
        </div>

      </nav>

      <!-- Bottom Actions (Fixed at bottom) -->
      <div class="mobile-menu-footer">
        <!-- Language Selector (Compact) -->
        <div class="mobile-language-compact">
          <button 
            type="button" 
            id="mobile-language-dropdown-trigger" 
            class="mobile-language-trigger" 
            aria-haspopup="dialog" 
            aria-expanded="false"
            aria-label="${texts.languageSelection}">
            <span class="language-flag" id="mobile-current-flag">
              ${currentFlagMobile}
            </span>
            <span class="language-name-compact" id="mobile-language-name">${currentLanguageName}</span>
            <i class="bi bi-chevron-down language-chevron"></i>
          </button>
        </div>
        
        <!-- Language Selection Bottom Sheet Modal -->
        <div class="mobile-language-menu-overlay" id="mobile-language-menu-overlay" aria-hidden="true"></div>
        <div class="mobile-language-menu" id="mobile-language-dropdown-menu" role="dialog" aria-modal="true" aria-labelledby="mobile-language-menu-title" aria-hidden="true">
          <div class="mobile-language-menu-header">
            <h3 class="mobile-language-menu-title" id="mobile-language-menu-title">${texts.selectLanguage}</h3>
            <button class="mobile-language-menu-close" id="mobile-language-menu-close" aria-label="${texts.close}" type="button">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="mobile-language-menu-items">
            <button class="mobile-language-menu-item" data-locale="tr" role="menuitem" type="button">
              <span class="language-flag">
                <svg width="28" height="28" viewBox="0 0 20 20" fill="none" xmlns="http:
                  <rect width="20" height="20" rx="2" fill="#E30A17"/>
                  <circle cx="7.5" cy="10" r="4.5" fill="#FFFFFF"/>
                  <circle cx="9" cy="10" r="4" fill="#E30A17"/>
                  <path d="M13.5 7.5L13.8 8.3L14.6 8.1L13.9 8.6L14.2 9.4L13.5 8.9L12.8 9.4L13.1 8.6L12.4 8.1L13.2 8.3Z" fill="#FFFFFF"/>
                </svg>
              </span>
              <span class="language-code">TR</span>
              <span class="language-name">${texts.turkish}</span>
            </button>
            <button class="mobile-language-menu-item" data-locale="en" role="menuitem" type="button">
              <span class="language-flag">
                <svg width="28" height="28" viewBox="0 0 20 20" fill="none" xmlns="http:
                  <rect width="20" height="20" rx="2" fill="#012169"/>
                  <path d="M0 0l20 20M20 0L0 20" stroke="white" stroke-width="2"/>
                  <path d="M0 0l20 20M20 0L0 20" stroke="#C8102E" stroke-width="1.2"/>
                </svg>
              </span>
              <span class="language-code">EN</span>
              <span class="language-name">${texts.english}</span>
            </button>
          </div>
        </div>

        <!-- CTA Button -->
        <a href="${texts.joinNetworkHref}" class="mobile-menu-cta">
          ${texts.joinNetwork}
          <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </aside>
  </div>
  <!-- ======= end Mobile Menu Drawer ======= -->
    `;
  }

  
  function loadNavbar() {
    const context = getPageContext();
    const navbarHTML = getNavbarHTML(context);
    
    
    const existingHeader = document.getElementById('site-header');
    const existingMobileMenu = document.getElementById('mobile-menu-wrapper');
    
    if (existingHeader && existingMobileMenu) {
      
      const headerContainer = existingHeader.parentElement;
      const mobileMenuContainer = existingMobileMenu.parentElement;
      
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = navbarHTML;
      
      
      const newHeader = tempDiv.querySelector('#site-header');
      if (newHeader) {
        existingHeader.replaceWith(newHeader);
      }
      
      
      const newMobileMenu = tempDiv.querySelector('#mobile-menu-wrapper');
      if (newMobileMenu) {
        existingMobileMenu.replaceWith(newMobileMenu);
      }
    } else {
      
      const body = document.body;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = navbarHTML;
      
      
      const firstChild = body.firstElementChild;
      if (firstChild) {
        body.insertBefore(tempDiv.querySelector('#site-header'), firstChild);
        body.insertBefore(tempDiv.querySelector('#mobile-menu-wrapper'), firstChild.nextSibling);
      } else {
        body.insertAdjacentHTML('afterbegin', navbarHTML);
      }
    }
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
  } else {
    loadNavbar();
  }

})();

