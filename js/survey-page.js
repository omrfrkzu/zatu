// ================= Survey Page Controller =====================

(function() {
  'use strict';

  class SurveyPageController {
    constructor() {
      this.currentQuestion = 0;
      this.answers = {};
      this.questions = this.generateQuestions();
      this.totalQuestions = this.questions.length;
      
      // DOM elements
      this.elements = {
        questionTitle: document.getElementById('question-title'),
        questionDescription: null, // Will be created dynamically
        answersContainer: document.getElementById('answers-container'),
        questionContainer: document.getElementById('question-container'),
        btnBack: document.getElementById('btn-back'),
        btnNext: document.getElementById('btn-next'),
        currentStep: document.getElementById('current-step'),
        totalSteps: document.getElementById('total-steps'),
        progressBarFill: document.getElementById('progress-bar-fill'),
        loadingOverlay: document.getElementById('loading-overlay')
      };
      
      this.init();
    }

    generateQuestions() {
      return [
        {
          id: 'trustedInstitution',
          title: 'Afet anında ilk güvendiğin kurum',
          description: 'Kriz anında hangi kuruma güveniyorsun?',
          options: [
            'AFAD',
            'Belediye',
            'Ordu',
            'Gönüllüler',
            'Kimse'
          ]
        },
        {
          id: 'feelingAlone',
          title: 'Afet hazırlığında yalnız hissediyor musun?',
          description: 'Hazırlık konusunda kendini nasıl hissediyorsun?',
          options: [
            'Evet',
            'Bazen',
            'Hayır'
          ]
        },
        {
          id: 'institutionsReach',
          title: 'Kurumlar herkese yetişebilir mi?',
          description: 'Resmi kurumların herkese yetişebileceğini düşünüyor musun?',
          options: [
            'Evet',
            'Hayır',
            'Emin değilim'
          ]
        },
        {
          id: 'powerSource',
          title: 'Afette asıl güç kimden gelmeli?',
          description: 'Kriz anında gücün kaynağı ne olmalı?',
          options: [
            'Devlet',
            'Devlet + Halk',
            'Birey',
            'Bilmiyorum'
          ]
        },
        {
          id: 'needNewSystem',
          title: 'Türkiye\'nin yeni bir sisteme ihtiyacı var mı?',
          description: 'Mevcut sistem yeterli mi, yoksa yeni bir yaklaşım gerekli mi?',
          options: [
            'Kesinlikle var',
            'Olabilir',
            'Zaten yeterli',
            'Emin değilim'
          ]
        }
      ];
    }

    init() {
      // Set total steps
      this.elements.totalSteps.textContent = this.totalQuestions;
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Load saved progress
      this.loadProgress();
      
      // Render first question
      this.renderQuestion();
      
      // Update progress
      this.updateProgress();
    }

    setupEventListeners() {
      // Navigation buttons
      this.elements.btnBack.addEventListener('click', () => this.prevQuestion());
      this.elements.btnNext.addEventListener('click', () => this.nextQuestion());
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !this.elements.btnBack.disabled) {
          this.prevQuestion();
        } else if (e.key === 'ArrowRight' && !this.elements.btnNext.disabled) {
          this.nextQuestion();
        }
      });
      
      // Save progress on unload
      window.addEventListener('beforeunload', () => this.saveProgress());
    }

    renderQuestion() {
      if (this.currentQuestion >= this.totalQuestions) {
        this.renderCompletion();
        return;
      }
      
      const question = this.questions[this.currentQuestion];
      
      if (!question) {
        return;
      }
      
      // Update question title
      this.elements.questionTitle.textContent = question.title;
      
      // Add description if exists
      const wrapper = this.elements.questionContainer.querySelector('.test-question-wrapper');
      if (question.description) {
        // Remove existing description if any
        const existingDesc = wrapper.querySelector('.survey-question-description');
        if (existingDesc) {
          existingDesc.remove();
        }
        
        const desc = document.createElement('p');
        desc.className = 'survey-question-description';
        desc.textContent = question.description;
        wrapper.appendChild(desc);
        this.elements.questionDescription = desc;
      } else {
        // Remove description if question doesn't have one
        const existingDesc = wrapper.querySelector('.survey-question-description');
        if (existingDesc) {
          existingDesc.remove();
        }
      }
      
      // Clear and render answers
      this.elements.answersContainer.innerHTML = '';
      
      question.options.forEach((option, index) => {
        const card = this.createAnswerCard(option, index);
        this.elements.answersContainer.appendChild(card);
      });
      
      // Update navigation buttons
      this.updateNavigationButtons();
      
      // Restore selected answer if exists
      if (this.answers[question.id] !== undefined) {
        const selectedIndex = this.answers[question.id];
        const cards = this.elements.answersContainer.querySelectorAll('.test-answer-card');
        if (cards[selectedIndex]) {
          cards[selectedIndex].classList.add('selected');
          this.elements.btnNext.disabled = false;
        }
      }
    }

    createAnswerCard(text, index) {
      const card = document.createElement('div');
      card.className = 'test-answer-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Seçenek ${index + 1}: ${text}`);
      
      // Answer text
      const textDiv = document.createElement('div');
      textDiv.className = 'test-answer-text';
      textDiv.textContent = text;
      
      // Icon
      const iconDiv = document.createElement('div');
      iconDiv.className = 'test-answer-icon';
      const icon = document.createElement('i');
      icon.className = 'bi bi-circle';
      iconDiv.appendChild(icon);
      
      card.appendChild(textDiv);
      card.appendChild(iconDiv);
      
      // Click handler
      card.addEventListener('click', () => this.selectAnswer(index));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectAnswer(index);
        }
      });
      
      // Animation delay
      card.style.animationDelay = `${index * 0.05}s`;
      
      return card;
    }

    selectAnswer(index) {
      const question = this.questions[this.currentQuestion];
      const cards = this.elements.answersContainer.querySelectorAll('.test-answer-card');
      
      // Remove previous selection
      cards.forEach((card, i) => {
        card.classList.remove('selected');
        const icon = card.querySelector('.test-answer-icon i');
        icon.className = 'bi bi-circle';
      });
      
      // Add selection
      cards[index].classList.add('selected');
      
      // Update icon
      const icon = cards[index].querySelector('.test-answer-icon i');
      icon.className = 'bi bi-check-circle-fill';
      
      // Save answer
      this.answers[question.id] = index;
      this.saveProgress();
      
      // Enable next button
      this.elements.btnNext.disabled = false;
    }

    prevQuestion() {
      if (this.currentQuestion > 0) {
        this.showTransition(() => {
          this.currentQuestion--;
          this.renderQuestion();
          this.updateProgress();
        });
      }
    }

    nextQuestion() {
      const question = this.questions[this.currentQuestion];
      
      // Check if answer is selected
      if (this.answers[question.id] === undefined) {
        return;
      }
      
      if (this.currentQuestion < this.totalQuestions - 1) {
        this.showTransition(() => {
          this.currentQuestion++;
          this.renderQuestion();
          this.updateProgress();
        });
      } else {
        this.completeSurvey();
      }
    }

    showTransition(callback) {
      // Add fade-out class
      this.elements.questionContainer.classList.add('fade-out');
      this.elements.answersContainer.classList.add('fade-out');
      this.elements.loadingOverlay.classList.add('active');
      
      // Execute callback after animation
      setTimeout(() => {
        callback();
        
        // Remove fade-out class
        this.elements.questionContainer.classList.remove('fade-out');
        this.elements.answersContainer.classList.remove('fade-out');
        this.elements.loadingOverlay.classList.remove('active');
      }, 300);
    }

    updateProgress() {
      const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
      this.elements.progressBarFill.style.width = `${progress}%`;
      this.elements.currentStep.textContent = this.currentQuestion + 1;
    }

    updateNavigationButtons() {
      // Back button
      this.elements.btnBack.disabled = this.currentQuestion === 0;
      
      // Next button
      const question = this.questions[this.currentQuestion];
      this.elements.btnNext.disabled = this.answers[question.id] === undefined;
      
      // Update next button text
      if (this.currentQuestion === this.totalQuestions - 1) {
        this.elements.btnNext.innerHTML = '<span>Tamamla</span> <i class="bi bi-check-circle"></i>';
      } else {
        this.elements.btnNext.innerHTML = '<span>İleri</span> <i class="bi bi-arrow-right"></i>';
      }
    }

    renderCompletion() {
      // Update title
      this.elements.questionTitle.textContent = 'Teşekkürler!';
      
      // Remove description if exists
      const wrapper = this.elements.questionContainer.querySelector('.test-question-wrapper');
      const existingDesc = wrapper.querySelector('.survey-question-description');
      if (existingDesc) {
        existingDesc.remove();
      }
      
      // Clear answers container
      this.elements.answersContainer.innerHTML = '';
      
      // Create success message
      const successContainer = document.createElement('div');
      successContainer.className = 'survey-success-container';
      
      const icon = document.createElement('div');
      icon.className = 'survey-success-icon';
      icon.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
      
      const title = document.createElement('h2');
      title.className = 'survey-success-title';
      title.textContent = 'Görüşleriniz kaydedildi';
      
      const text = document.createElement('p');
      text.className = 'survey-success-text';
      text.textContent = 'Paylaştığınız görüşler, ağımızı geliştirmemize yardımcı olacak. Katkınız için teşekkür ederiz!';
      
      const actionDiv = document.createElement('div');
      actionDiv.className = 'survey-success-action';
      const homeBtn = document.createElement('a');
      homeBtn.href = 'index.html';
      homeBtn.className = 'btn test-nav-btn test-nav-btn-next';
      homeBtn.innerHTML = '<span>Ana Sayfaya Dön</span> <i class="bi bi-arrow-right"></i>';
      actionDiv.appendChild(homeBtn);
      
      successContainer.appendChild(icon);
      successContainer.appendChild(title);
      successContainer.appendChild(text);
      successContainer.appendChild(actionDiv);
      
      this.elements.answersContainer.appendChild(successContainer);
      
      // Hide navigation buttons
      this.elements.btnBack.style.display = 'none';
      this.elements.btnNext.style.display = 'none';
      
      // Update progress to 100%
      this.updateProgress();
    }

    saveProgress() {
      const data = {
        answers: this.answers,
        currentQuestion: this.currentQuestion,
        timestamp: Date.now()
      };
      localStorage.setItem('survey_page_progress', JSON.stringify(data));
    }

    loadProgress() {
      const saved = localStorage.getItem('survey_page_progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.answers = data.answers || {};
          
          // Resume from last question if incomplete
          if (data.currentQuestion !== undefined && data.currentQuestion < this.totalQuestions) {
            showConfirmModal({
              title: 'Kaydedilmiş ilerlemeniz var',
              description: 'Devam etmek ister misiniz?',
              primaryText: 'Devam Et',
              secondaryText: 'Sıfırla'
            }).then((confirmed) => {
              if (confirmed) {
                this.currentQuestion = data.currentQuestion;
                this.renderQuestion();
                this.updateProgress();
              } else {
                // Clear saved progress
                localStorage.removeItem('survey_page_progress');
                this.answers = {};
                this.currentQuestion = 0;
                this.renderQuestion();
                this.updateProgress();
              }
            });
            return; // Exit early, modal will handle continuation
          }
        } catch (e) {
          console.error('Error loading progress:', e);
        }
      }
    }

    completeSurvey() {
      // Save final answers
      this.saveProgress();
      
      // Submit to backend (optional)
      this.submitToBackend();
      
      // Show completion screen
      this.renderCompletion();
    }

    submitToBackend() {
      // TODO: Implement backend submission
      console.log('Submitting survey data:', this.answers);
      
      // Clear saved progress after successful submission
      setTimeout(() => {
        localStorage.removeItem('survey_page_progress');
      }, 1000);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new SurveyPageController();
    });
  } else {
    new SurveyPageController();
  }
})();

