// ================= Profile Test Wizard Component =====================

(function() {
  'use strict';

  class ProfileTestWizard {
    constructor() {
      this.currentQuestion = 0;
      this.answers = {};
      this.totalQuestions = 5;
      this.modal = null;
      this.questions = [
        {
          id: 'preparedness',
          title: 'Afet hazırlığında kendini nasıl değerlendiriyorsun?',
          description: 'Yaşadığın yerde afet için ne kadar hazırlıklısın?',
          options: [
            'Çok hazırlıklıyım',
            'Biraz hazırlıklıyım',
            'Hazırlıklı değilim',
            'Hiç düşünmedim'
          ],
          field: 'preparedness'
        },
        {
          id: 'neighborhood',
          title: 'Mahallendeki komşularını ne kadar tanıyorsun?',
          description: 'Apartmanında veya mahallende kaç kişiyi tanıyorsun?',
          options: [
            'Çoğunu tanıyorum',
            'Birkaçını tanıyorum',
            'Neredeyse hiç kimseyi tanımıyorum',
            'Hiç kimseyi tanımıyorum'
          ],
          field: 'neighborhood'
        },
        {
          id: 'communication',
          title: 'Afet anında iletişim kurma planın var mı?',
          description: 'Ailen ve yakınlarınla nasıl iletişim kuracaksın?',
          options: [
            'Evet, detaylı bir planım var',
            'Kısmen düşündüm',
            'Hayır, planım yok',
            'Hiç düşünmedim'
          ],
          field: 'communication'
        },
        {
          id: 'emergencyKit',
          title: 'Acil durum çantan hazır mı?',
          description: 'Afet için hazırladığın bir çanta veya malzeme var mı?',
          options: [
            'Evet, tam hazır',
            'Kısmen hazır',
            'Hayır, hazır değil',
            'Bilmiyorum'
          ],
          field: 'emergencyKit'
        },
        {
          id: 'meetingPoint',
          title: 'Toplanma alanını biliyor musun?',
          description: 'Yaşadığın yerdeki en yakın toplanma noktasını biliyor musun?',
          options: [
            'Evet, biliyorum',
            'Yaklaşık olarak biliyorum',
            'Hayır, bilmiyorum',
            'Hiç duymadım'
          ],
          field: 'meetingPoint'
        }
      ];

      this.init();
    }

    init() {
      // Load saved progress
      const savedData = localStorage.getItem('profile_test_data');
      if (savedData) {
        try {
          this.answers = JSON.parse(savedData);
          const answeredCount = Object.keys(this.answers).length;
          if (answeredCount > 0 && answeredCount < this.totalQuestions) {
            this.currentQuestion = answeredCount;
          }
        } catch (e) {
          console.error('Error loading saved test data:', e);
        }
      }

      // Setup button handlers
      const startBtn = document.getElementById('start-profile-test-btn');
      if (startBtn) {
        startBtn.addEventListener('click', () => this.open());
      }

      const closeBtn = document.getElementById('profile-test-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      const nextBtn = document.getElementById('profile-test-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.nextQuestion());
      }

      const backBtn = document.getElementById('profile-test-back');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.prevQuestion());
      }

      // Close on overlay click
      const overlay = document.querySelector('.profile-test-modal-overlay');
      if (overlay) {
        overlay.addEventListener('click', () => this.close());
      }

      // Close on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });
    }

    open() {
      this.modal = document.getElementById('profile-test-modal');
      if (!this.modal) return;

      // Check if user is logged in (for now, just proceed)
      // In future: check localStorage or session for user auth
      
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

    render() {
      const body = document.getElementById('profile-test-body');
      const footer = document.getElementById('profile-test-footer');
      if (!body || !footer) return;

      if (this.currentQuestion >= this.totalQuestions) {
        this.renderCompletion();
        return;
      }

      const question = this.questions[this.currentQuestion];
      if (!question) return;

      // Render question
      body.innerHTML = `
        <div class="profile-test-question">
          <h3 class="profile-test-question-title">${this.escapeHtml(question.title)}</h3>
          ${question.description ? `<p class="profile-test-question-description">${this.escapeHtml(question.description)}</p>` : ''}
          
          <div class="profile-test-options" role="radiogroup" aria-labelledby="profile-test-question-title">
            ${question.options.map((option, index) => {
              const savedValue = this.answers[question.field];
              const isChecked = savedValue === option;
              return `
                <label class="profile-test-option ${isChecked ? 'selected' : ''}" for="profile-test-${question.field}-${index}">
                  <input 
                    type="radio" 
                    name="profile-test-${question.field}" 
                    id="profile-test-${question.field}-${index}" 
                    value="${this.escapeHtml(option)}"
                    ${isChecked ? 'checked' : ''}
                    data-field="${question.field}">
                  <span class="profile-test-option-text">${this.escapeHtml(option)}</span>
                  <i class="bi bi-check-circle-fill profile-test-option-check"></i>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      `;

      // Setup option click handlers
      const options = body.querySelectorAll('.profile-test-option input[type="radio"]');
      options.forEach(option => {
        option.addEventListener('change', () => {
          this.selectOption(question.field, option.value);
        });
      });

      // Update footer buttons
      const backBtn = document.getElementById('profile-test-back');
      const nextBtn = document.getElementById('profile-test-next');
      
      if (backBtn) {
        backBtn.style.display = this.currentQuestion > 0 ? 'inline-flex' : 'none';
      }
      
      if (nextBtn) {
        const hasAnswer = !!this.answers[question.field];
        nextBtn.disabled = !hasAnswer;
        
        if (this.currentQuestion === this.totalQuestions - 1) {
          nextBtn.innerHTML = 'Testi Tamamla <i class="bi bi-check-circle ms-2"></i>';
        } else {
          nextBtn.innerHTML = 'Devam Et <i class="bi bi-arrow-right ms-2"></i>';
        }
      }
    }

    selectOption(field, value) {
      this.answers[field] = value;
      this.saveProgress();
      
      // Update UI
      const options = document.querySelectorAll('.profile-test-option');
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

      // Enable next button
      const nextBtn = document.getElementById('profile-test-next');
      if (nextBtn) {
        nextBtn.disabled = false;
      }
    }

    nextQuestion() {
      const question = this.questions[this.currentQuestion];
      if (!question || !this.answers[question.field]) {
        return; // Can't proceed without answer
      }

      if (this.currentQuestion < this.totalQuestions - 1) {
        this.currentQuestion++;
        this.render();
        this.updateProgress();
        
        // Scroll to top of modal body
        const body = document.getElementById('profile-test-body');
        if (body) {
          body.scrollTop = 0;
        }
      } else {
        this.completeTest();
      }
    }

    prevQuestion() {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.render();
        this.updateProgress();
        
        // Scroll to top of modal body
        const body = document.getElementById('profile-test-body');
        if (body) {
          body.scrollTop = 0;
        }
      }
    }

    updateProgress() {
      const progressFill = document.getElementById('profile-test-progress-fill');
      const progressText = document.getElementById('profile-test-progress-text');
      
      if (progressFill) {
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
      }
      
      if (progressText) {
        progressText.textContent = `Soru ${this.currentQuestion + 1} / ${this.totalQuestions}`;
      }
    }

    renderCompletion() {
      const body = document.getElementById('profile-test-body');
      const footer = document.getElementById('profile-test-footer');
      
      if (!body || !footer) return;

      body.innerHTML = `
        <div class="profile-test-completion">
          <div class="profile-test-completion-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <h3 class="profile-test-completion-title">Analiz Tamamlandı!</h3>
          <p class="profile-test-completion-message">
            Yanıtların kaydedildi ve profilin güncellendi.
          </p>
          <div class="profile-test-completion-actions">
            <button type="button" class="btn btn-primary-premium-cta" id="profile-test-go-profile">
              Profilime Git
            </button>
            <button type="button" class="btn btn-outline-secondary" id="profile-test-go-home">
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      `;

      footer.style.display = 'none';

      // Setup completion button handlers
      const goProfileBtn = document.getElementById('profile-test-go-profile');
      const goHomeBtn = document.getElementById('profile-test-go-home');
      
      if (goProfileBtn) {
        goProfileBtn.addEventListener('click', () => {
          // Navigate to profile (or close modal for now)
          this.close();
          // In future: window.location.href = '/profile';
        });
      }
      
      if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
          this.close();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }

    completeTest() {
      // Save completion
      localStorage.setItem('profile_completed', 'true');
      localStorage.setItem('profile_test_data', JSON.stringify(this.answers));
      
      // Update user progress
      if (window.userProgress) {
        window.userProgress.setProfileCompleted(true);
      }

      // Submit to backend (mock for now)
      this.submitToBackend();

      // Show completion screen
      this.renderCompletion();
      this.updateProgress();
    }

    async submitToBackend() {
      // Mock submission - in production, this would be a real API call
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Profile test submitted:', this.answers);
        
        // In production:
        // const response = await fetch('/api/profile/test', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(this.answers)
        // });
        // const data = await response.json();
      } catch (error) {
        console.error('Error submitting profile test:', error);
      }
    }

    saveProgress() {
      try {
        localStorage.setItem('profile_test_data', JSON.stringify(this.answers));
        localStorage.setItem('profile_test_current_question', this.currentQuestion.toString());
      } catch (e) {
        console.error('Error saving test progress:', e);
      }
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.profileTestWizard = new ProfileTestWizard();
    });
  } else {
    window.profileTestWizard = new ProfileTestWizard();
  }
})();

