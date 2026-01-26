

class CustomModal {
  constructor() {
    this.modalId = 'custom-modal-' + Date.now();
    this.resolve = null;
  }

  
  show(options = {}) {
    return new Promise((resolve) => {
      this.resolve = resolve;

      const {
        title = 'Kaydedilmiş ilerlemeniz var',
        description = 'Devam etmek ister misiniz?',
        primaryText = 'Devam Et',
        secondaryText = 'Sıfırla'
      } = options;

      
      const modalHTML = `
        <div class="modal-backdrop" id="${this.modalId}">
          <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="${this.modalId}-title" aria-describedby="${this.modalId}-description">
            <div class="modal-header">
              <h3 class="modal-title" id="${this.modalId}-title">${this.escapeHtml(title)}</h3>
              <button class="modal-close-btn" aria-label="Kapat" type="button">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="modal-body">
              <p class="modal-description" id="${this.modalId}-description">${this.escapeHtml(description)}</p>
            </div>
            <div class="modal-footer">
              <button class="modal-btn modal-btn-secondary" type="button" data-action="cancel">
                ${this.escapeHtml(secondaryText)}
              </button>
              <button class="modal-btn modal-btn-primary" type="button" data-action="confirm" autofocus>
                ${this.escapeHtml(primaryText)}
              </button>
            </div>
          </div>
        </div>
      `;

      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = modalHTML;
      const modal = tempDiv.firstElementChild;
      document.body.appendChild(modal);

      
      const backdrop = document.getElementById(this.modalId);
      const container = backdrop.querySelector('.modal-container');
      const closeBtn = backdrop.querySelector('.modal-close-btn');
      const primaryBtn = backdrop.querySelector('[data-action="confirm"]');
      const secondaryBtn = backdrop.querySelector('[data-action="cancel"]');

      
      const focusableElements = [primaryBtn, secondaryBtn, closeBtn].filter(el => el);
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      
      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      };

      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          this.close(false);
        }
      };

      
      const closeModal = (result) => {
        this.close(result);
      };

      primaryBtn.addEventListener('click', () => closeModal(true));
      secondaryBtn.addEventListener('click', () => closeModal(false));
      closeBtn.addEventListener('click', () => closeModal(false));
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeModal(false);
        }
      });

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);

      
      this.handlers = {
        escape: handleEscape,
        tab: handleTabKey
      };

      
      document.body.style.overflow = 'hidden';

      
      requestAnimationFrame(() => {
        backdrop.classList.add('show');
        firstFocusable.focus();
      });
    });
  }

  
  close(result) {
    const backdrop = document.getElementById(this.modalId);
    if (!backdrop) return;

    
    if (this.handlers) {
      document.removeEventListener('keydown', this.handlers.escape);
      document.removeEventListener('keydown', this.handlers.tab);
    }

    
    backdrop.classList.remove('show');

    
    setTimeout(() => {
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      document.body.style.overflow = '';
      if (this.resolve) {
        this.resolve(result);
      }
    }, 300);
  }

  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}


function showConfirmModal(options) {
  const modal = new CustomModal();
  return modal.show(options);
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CustomModal, showConfirmModal };
}


