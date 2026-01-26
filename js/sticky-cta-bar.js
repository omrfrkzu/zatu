
class StickyCtaBar {
  constructor() {
    this.bar = null;
    this.hideOnIds = ['kayit', 'profil-anketi', 'afet-anketi', 'profilini-tamamla', 'afet-anketi'];
    this.hideOnPages = ['kayit.html'];
    this.init();
  }

  init() {
    
    this.createBar();
    
    
    if (window.userProgress) {
      window.userProgress.subscribe((state) => {
        this.update(state);
      });
    }

    
    if (window.userProgress) {
      this.update(window.userProgress.getState());
    }

    
    window.addEventListener('hashchange', () => {
      this.checkVisibility();
    });

    
    this.checkVisibility();
  }

  createBar() {
    
    const existing = document.getElementById('sticky-cta-bar');
    if (existing) {
      existing.remove();
    }

    
    this.bar = document.createElement('nav');
    this.bar.id = 'sticky-cta-bar';
    this.bar.setAttribute('role', 'navigation');
    this.bar.setAttribute('aria-label', 'Hızlı eylemler');
    this.bar.className = 'sticky-cta-bar';
    
    document.body.appendChild(this.bar);
  }

  shouldHide() {
    
    const currentPage = window.location.pathname.split('/').pop();
    if (this.hideOnPages.includes(currentPage)) {
      return true;
    }

    
    const hash = window.location.hash.replace('#', '');
    if (this.hideOnIds.includes(hash)) {
      return true;
    }

    
    const sections = document.querySelectorAll('section[id]');
    for (const section of sections) {
      const id = section.getAttribute('id');
      if (this.hideOnIds.includes(id)) {
        const rect = section.getBoundingClientRect();
        
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

    
    this.checkVisibility();
  }

  handleClick(href) {
    if (href.startsWith('#')) {
      
      const targetId = href.replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        window.location.hash = href;
      }
    } else {
      
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


document.addEventListener('DOMContentLoaded', function() {
  window.stickyCtaBar = new StickyCtaBar();
  
  
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

