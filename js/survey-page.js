

(function() {
  'use strict';

  class SurveyPageController {
    constructor() {
      this.currentQuestion = 0;
      this.answers = {};
      this.questions = this.generateQuestions();
      this.totalQuestions = this.questions.length;
      
      
      this.elements = {
        questionTitle: document.getElementById('question-title'),
        questionDescription: null, 
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
      
      this.elements.totalSteps.textContent = this.totalQuestions;
      
      
      this.setupEventListeners();
      
      
      this.loadProgress();
      
      
      this.renderQuestion();
      
      
      this.updateProgress();
    }

    setupEventListeners() {
      
      this.elements.btnBack.addEventListener('click', () => this.prevQuestion());
      this.elements.btnNext.addEventListener('click', () => this.nextQuestion());
      
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !this.elements.btnBack.disabled) {
          this.prevQuestion();
        } else if (e.key === 'ArrowRight' && !this.elements.btnNext.disabled) {
          this.nextQuestion();
        }
      });
      
      
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
      
      
      this.elements.questionTitle.textContent = question.title;
      
      
      const wrapper = this.elements.questionContainer.querySelector('.test-question-wrapper');
      if (question.description) {
        
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
        
        const existingDesc = wrapper.querySelector('.survey-question-description');
        if (existingDesc) {
          existingDesc.remove();
        }
      }
      
      
      this.elements.answersContainer.innerHTML = '';
      
      question.options.forEach((option, index) => {
        const card = this.createAnswerCard(option, index);
        this.elements.answersContainer.appendChild(card);
      });
      
      
      this.updateNavigationButtons();
      
      
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
      
      
      const textDiv = document.createElement('div');
      textDiv.className = 'test-answer-text';
      textDiv.textContent = text;
      
      
      const iconDiv = document.createElement('div');
      iconDiv.className = 'test-answer-icon';
      const icon = document.createElement('i');
      icon.className = 'bi bi-circle';
      iconDiv.appendChild(icon);
      
      card.appendChild(textDiv);
      card.appendChild(iconDiv);
      
      
      card.addEventListener('click', () => this.selectAnswer(index));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectAnswer(index);
        }
      });
      
      
      card.style.animationDelay = `${index * 0.05}s`;
      
      return card;
    }

    selectAnswer(index) {
      const question = this.questions[this.currentQuestion];
      const cards = this.elements.answersContainer.querySelectorAll('.test-answer-card');
      
      
      cards.forEach((card, i) => {
        card.classList.remove('selected');
        const icon = card.querySelector('.test-answer-icon i');
        icon.className = 'bi bi-circle';
      });
      
      
      cards[index].classList.add('selected');
      
      
      const icon = cards[index].querySelector('.test-answer-icon i');
      icon.className = 'bi bi-check-circle-fill';
      
      
      this.answers[question.id] = index;
      this.saveProgress();
      
      
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
      
      this.elements.questionContainer.classList.add('fade-out');
      this.elements.answersContainer.classList.add('fade-out');
      this.elements.loadingOverlay.classList.add('active');
      
      
      setTimeout(() => {
        callback();
        
        
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
      
      this.elements.btnBack.disabled = this.currentQuestion === 0;
      
      
      const question = this.questions[this.currentQuestion];
      this.elements.btnNext.disabled = this.answers[question.id] === undefined;
      
      
      if (this.currentQuestion === this.totalQuestions - 1) {
        this.elements.btnNext.innerHTML = '<span>Tamamla</span> <i class="bi bi-check-circle"></i>';
      } else {
        this.elements.btnNext.innerHTML = '<span>İleri</span> <i class="bi bi-arrow-right"></i>';
      }
    }

    renderCompletion() {
      
      this.elements.questionTitle.textContent = 'Teşekkürler!';
      
      
      const wrapper = this.elements.questionContainer.querySelector('.test-question-wrapper');
      const existingDesc = wrapper.querySelector('.survey-question-description');
      if (existingDesc) {
        existingDesc.remove();
      }
      
      
      this.elements.answersContainer.innerHTML = '';
      
      
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
      
      
      this.elements.btnBack.style.display = 'none';
      this.elements.btnNext.style.display = 'none';
      
      
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
                
                localStorage.removeItem('survey_page_progress');
                this.answers = {};
                this.currentQuestion = 0;
                this.renderQuestion();
                this.updateProgress();
              }
            });
            return; 
          }
        } catch (e) {
          console.error('Error loading progress:', e);
        }
      }
    }

    completeSurvey() {
      
      this.saveProgress();
      
      
      this.submitToBackend();
      
      
      this.renderCompletion();
    }

    submitToBackend() {
      
      console.log('Submitting survey data:', this.answers);
      
      
      setTimeout(() => {
        localStorage.removeItem('survey_page_progress');
      }, 1000);
    }
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new SurveyPageController();
    });
  } else {
    new SurveyPageController();
  }
})();

