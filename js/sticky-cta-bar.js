// ================= Sticky CTA Bar Component =====================
class StickyCtaBar {
  constructor() {
    this.bar = null;
    this.hideOnIds = ['kayit', 'profil-anketi', 'afet-anketi', 'profilini-tamamla', 'afet-anketi'];
    this.hideOnPages = ['kayit.html'];
    this.init();
  }

  init() {
    // Create bar element
    this.createBar();
    
    // Listen to progress changes
    if (window.userProgress) {
      window.userProgress.subscribe((state) => {
        this.update(state);
      });
    }

    // Initial update
    if (window.userProgress) {
      this.update(window.userProgress.getState());
    }

    // Check hash changes
    window.addEventListener('hashchange', () => {
      this.checkVisibility();
    });

    // Check on page load
    this.checkVisibility();
  }

  createBar() {
    // Remove existing bar if any
    const existing = document.getElementById('sticky-cta-bar');
    if (existing) {
      existing.remove();
    }

    // Create bar
    this.bar = document.createElement('nav');
    this.bar.id = 'sticky-cta-bar';
    this.bar.setAttribute('role', 'navigation');
    this.bar.setAttribute('aria-label', 'Hızlı eylemler');
    this.bar.className = 'sticky-cta-bar';
    
    document.body.appendChild(this.bar);
  }

  shouldHide() {
    // Check if current page should hide bar
    const currentPage = window.location.pathname.split('/').pop();
    if (this.hideOnPages.includes(currentPage)) {
      return true;
    }

    // Check hash
    const hash = window.location.hash.replace('#', '');
    if (this.hideOnIds.includes(hash)) {
      return true;
    }

    // Check if we're in registration/survey sections (with some tolerance)
    const sections = document.querySelectorAll('section[id]');
    for (const section of sections) {
      const id = section.getAttribute('id');
      if (this.hideOnIds.includes(id)) {
        const rect = section.getBoundingClientRect();
        // Hide if section is visible (within viewport)
        if (rect.top < window.innerHeight && rect.bottom > -100) {
          return true;
        }
      }
    }

    return false;
  }

  checkVisibility() {
    if (!this.bar) return;

    if (this.shouldHide()) {
      this.bar.classList.add('d-none');
    } else {
      this.bar.classList.remove('d-none');
    }
  }

  getCTAs(state) {
    const ctas = [];

    if (!state.registered) {
      ctas.push({
        label: 'Ulusal Afet Ağına Katıl',
        id: 'kayit',
        href: 'kayit.html',
        variant: 'primary'
      });
    }

    if (state.registered && !state.profileCompleted) {
      ctas.push({
        label: 'PROFİLİNİ TAMAMLA',
        id: 'profilini-tamamla',
        href: '#profilini-tamamla',
        variant: 'secondary'
      });
    }

    if (state.profileCompleted && !state.disasterCompleted) {
      ctas.push({
        label: 'AFET GÖRÜŞLERİ',
        id: 'afet-anketi',
        href: '#afet-anketi',
        variant: 'secondary'
      });
    }

    return ctas;
  }

  update(state) {
    if (!this.bar) return;

    const ctas = this.getCTAs(state);

    if (ctas.length === 0) {
      this.bar.classList.add('d-none');
      return;
    }

    // Build HTML
    let html = '<div class="sticky-cta-bar-content">';
    
    ctas.forEach((cta, index) => {
      const isPrimary = cta.variant === 'primary';
      const btnClass = isPrimary 
        ? 'btn btn-primary sticky-cta-btn sticky-cta-btn-primary' 
        : 'btn btn-outline sticky-cta-btn sticky-cta-btn-secondary';
      
      html += `
        <button 
          class="${btnClass}"
          onclick="stickyCtaBar.handleClick('${cta.href}')"
          aria-label="${cta.label}"
          ${index === 0 ? 'autofocus' : ''}
        >
          ${cta.label}
        </button>
      `;
    });

    html += '</div>';
    this.bar.innerHTML = html;

    // Check visibility
    this.checkVisibility();
  }

  handleClick(href) {
    if (href.startsWith('#')) {
      // Scroll to section
      const targetId = href.replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash
        window.location.hash = href;
      }
    } else {
      // Navigate to page
      window.location.href = href;
    }
  }

  destroy() {
    if (this.bar) {
      this.bar.remove();
      this.bar = null;
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  window.stickyCtaBar = new StickyCtaBar();
  
  // Also check visibility on scroll
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (window.stickyCtaBar) {
        window.stickyCtaBar.checkVisibility();
      }
    }, 100);
  });
});

