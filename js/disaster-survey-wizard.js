

(function() {
  'use strict';

  class DisasterSurveyWizard {
    constructor() {
      this.currentQuestion = 0;
      this.answers = {};
      this.totalQuestions = 5;
      this.modal = null;
      this.questions = [
        {
          id: 'trustedInstitution',
          title: 'Afet anında ilk güvendiğin kurum',
          description: 'Kriz anında hangi kuruma güveniyorsun?',
          options: ['AFAD', 'Belediye', 'Ordu', 'Gönüllüler', 'Kimse'],
          field: 'trustedInstitution'
        },
        {
          id: 'feelingAlone',
          title: 'Afet hazırlığında yalnız hissediyor musun?',
          description: 'Hazırlık konusunda kendini nasıl hissediyorsun?',
          options: ['Evet', 'Bazen', 'Hayır'],
          field: 'feelingAlone'
        },
        {
          id: 'institutionsReach',
          title: 'Kurumlar herkese yetişebilir mi?',
          description: 'Resmi kurumların herkese yetişebileceğini düşünüyor musun?',
          options: ['Evet', 'Hayır', 'Emin değilim'],
          field: 'institutionsReach'
        },
        {
          id: 'powerSource',
          title: 'Afette asıl güç kimden gelmeli?',
          description: 'Kriz anında gücün kaynağı ne olmalı?',
          options: ['Devlet', 'Devlet + Halk', 'Birey', 'Bilmiyorum'],
          field: 'powerSource'
        },
        {
          id: 'needNewSystem',
          title: 'Türkiye\'nin yeni bir sisteme ihtiyacı var mı?',
          description: 'Mevcut sistem yeterli mi, yoksa yeni bir yaklaşım gerekli mi?',
          options: ['Kesinlikle var', 'Olabilir', 'Zaten yeterli', 'Emin değilim'],
          field: 'needNewSystem'
        }
      ];

      this.init();
    }

    init() {
      
      this.checkSkipState();

      
      const savedData = localStorage.getItem('disaster_survey_data');
      if (savedData) {
        try {
          this.answers = JSON.parse(savedData);
          const answeredCount = Object.keys(this.answers).length;
          if (answeredCount > 0 && answeredCount < this.totalQuestions) {
            this.currentQuestion = answeredCount;
          }
        } catch (e) {
          console.error('Error loading saved disaster survey data:', e);
        }
      }

      
      const startBtn = document.getElementById('disaster-start-btn');
      if (startBtn) {
        startBtn.addEventListener('click', () => this.open());
      }

      const skipBtn = document.getElementById('disaster-skip-btn');
      if (skipBtn) {
        skipBtn.addEventListener('click', () => this.skip());
      }

      const closeBtn = document.getElementById('disaster-survey-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      const nextBtn = document.getElementById('disaster-survey-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.nextQuestion());
      }

      const backBtn = document.getElementById('disaster-survey-back');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.prevQuestion());
      }

      
      const overlay = document.querySelector('.disaster-survey-modal-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => this.close());
      }

      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });
    }

    checkSkipState() {
      const skipState = localStorage.getItem('skipAfetGorusleri');
      if (skipState === '1') {
        const section = document.getElementById('disaster-survey-section');
        if (section) {
          section.style.display = 'none';
        }
      }
    }

    open() {
      this.modal = document.getElementById('disaster-survey-modal');
      if (!this.modal) return;

      this.modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      this.render();
      this.updateProgress();
    }

    close() {
      if (this.modal) {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    isOpen() {
      return this.modal && this.modal.style.display === 'flex';
    }

    skip() {
      
      localStorage.setItem('skipAfetGorusleri', '1');

      
      const section = document.getElementById('disaster-survey-section');
      if (section) {
        
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease';
        section.style.opacity = '0';
        section.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
          section.style.display = 'none';
          
          this.scrollToNextSection();
        }, 300);
      }
    }

    scrollToNextSection() {
      
      const currentSection = document.getElementById('disaster-survey-section');
      if (!currentSection) return;

      const nextSection = currentSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        
        const footer = document.querySelector('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    render() {
      const body = document.getElementById('disaster-survey-body');
      const footer = document.getElementById('disaster-survey-footer');
      if (!body || !footer) return;

      if (this.currentQuestion >= this.totalQuestions) {
        this.renderCompletion();
        return;
      }

      const question = this.questions[this.currentQuestion];
      if (!question) return;

      
      body.innerHTML = `
        <div class="disaster-survey-question">
          <h3 class="disaster-survey-question-title">${this.escapeHtml(question.title)}</h3>
          ${question.description ? `<p class="disaster-survey-question-description">${this.escapeHtml(question.description)}</p>` : ''}
          
          <div class="disaster-survey-options" role="radiogroup" aria-labelledby="disaster-survey-question-title">
            ${question.options.map((option, index) => {
              const savedValue = this.answers[question.field];
              const isChecked = savedValue === option;
              return `
                <label class="disaster-survey-option ${isChecked ? 'selected' : ''}" for="disaster-survey-${question.field}-${index}">
                  <input 
                    type="radio" 
                    name="disaster-survey-${question.field}" 
                    id="disaster-survey-${question.field}-${index}" 
                    value="${this.escapeHtml(option)}"
                    ${isChecked ? 'checked' : ''}
                    data-field="${question.field}">
                  <span class="disaster-survey-option-text">${this.escapeHtml(option)}</span>
                  <i class="bi bi-check-circle-fill disaster-survey-option-check"></i>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      `;

      
      const options = body.querySelectorAll('.disaster-survey-option input[type="radio"]');
      options.forEach(option => {
        option.addEventListener('change', () => {
          this.selectOption(question.field, option.value);
        });
      });

      
      const backBtn = document.getElementById('disaster-survey-back');
      const nextBtn = document.getElementById('disaster-survey-next');
      
      if (backBtn) {
        backBtn.style.display = this.currentQuestion > 0 ? 'inline-flex' : 'none';
      }
      
      if (nextBtn) {
        const hasAnswer = !!this.answers[question.field];
        nextBtn.disabled = !hasAnswer;
        
        if (this.currentQuestion === this.totalQuestions - 1) {
          nextBtn.innerHTML = 'Anketi Tamamla <i class="bi bi-check-circle ms-2"></i>';
        } else {
          nextBtn.innerHTML = 'İleri <i class="bi bi-arrow-right ms-2"></i>';
        }
      }
    }

    selectOption(field, value) {
      this.answers[field] = value;
      this.saveProgress();
      
      
      const options = document.querySelectorAll('.disaster-survey-option');
      options.forEach(opt => {
        const input = opt.querySelector('input[type="radio"]');
        if (input && input.dataset.field === field) {
          if (input.value === value) {
            opt.classList.add('selected');
          } else {
            opt.classList.remove('selected');
          }
        }
      });

      
      const nextBtn = document.getElementById('disaster-survey-next');
      if (nextBtn) {
        nextBtn.disabled = false;
      }
    }

    nextQuestion() {
      const question = this.questions[this.currentQuestion];
      if (!question || !this.answers[question.field]) {
        return; 
      }

      if (this.currentQuestion < this.totalQuestions - 1) {
        this.currentQuestion++;
        this.render();
        this.updateProgress();
        
        
        const body = document.getElementById('disaster-survey-body');
        if (body) {
          body.scrollTop = 0;
        }
      } else {
        this.completeSurvey();
      }
    }

    prevQuestion() {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.render();
        this.updateProgress();
        
        
        const body = document.getElementById('disaster-survey-body');
        if (body) {
          body.scrollTop = 0;
        }
      }
    }

    updateProgress() {
      const progressFill = document.getElementById('disaster-survey-progress-fill');
      const progressText = document.getElementById('disaster-survey-progress-text');
      
      if (progressFill) {
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
      }
      
      if (progressText) {
        progressText.textContent = `Soru ${this.currentQuestion + 1} / ${this.totalQuestions}`;
      }
    }

    renderCompletion() {
      const body = document.getElementById('disaster-survey-body');
      const footer = document.getElementById('disaster-survey-footer');
      
      if (!body || !footer) return;

      body.innerHTML = `
        <div class="disaster-survey-completion">
          <div class="disaster-survey-completion-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <h3 class="disaster-survey-completion-title">Teşekkürler, yanıtların kaydedildi!</h3>
          <p class="disaster-survey-completion-message">
            Görüşlerin şehrinin afet hazırlık planına katkı sağlayacak. Yanıtların anonim olarak analiz edilecek.
          </p>
          <div class="disaster-survey-completion-actions">
            <button type="button" class="btn btn-primary-premium-cta" id="disaster-survey-go-home">
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      `;

      footer.style.display = 'none';

      
      const goHomeBtn = document.getElementById('disaster-survey-go-home');
      if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
          this.close();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }

    completeSurvey() {
      
      localStorage.setItem('disaster_completed', 'true');
      localStorage.setItem('disaster_survey_data', JSON.stringify(this.answers));
      
      
      if (window.userProgress) {
        window.userProgress.setDisasterCompleted(true);
      }

      
      this.submitToBackend();

      
      this.renderCompletion();
      this.updateProgress();
    }

    async submitToBackend() {
      
      try {
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Disaster survey submitted:', this.answers);
        
        
        
        
        
        
        
        
      } catch (error) {
        console.error('Error submitting disaster survey:', error);
      }
    }

    saveProgress() {
      try {
        localStorage.setItem('disaster_survey_data', JSON.stringify(this.answers));
        localStorage.setItem('disaster_survey_current_question', this.currentQuestion.toString());
      } catch (e) {
        console.error('Error saving disaster survey progress:', e);
      }
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.disasterSurveyWizard = new DisasterSurveyWizard();
    });
  } else {
    window.disasterSurveyWizard = new DisasterSurveyWizard();
  }
})();

