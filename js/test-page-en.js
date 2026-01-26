

(function() {
  'use strict';

  class TestPageController {
    constructor() {
      this.currentQuestion = 0;
      this.answers = {};
      this.questions = this.generateQuestions();
      this.totalQuestions = this.questions.length;
      
      
      this.elements = {
        questionTitle: document.getElementById('question-title'),
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
          id: 'preparedness',
          title: 'How do you rate yourself in disaster preparedness?',
          options: [
            'Very prepared',
            'Somewhat prepared',
            'Not prepared',
            'Haven\'t thought about it'
          ]
        },
        {
          id: 'neighborhood',
          title: 'How well do you know your neighbors?',
          options: [
            'I know most of them',
            'I know a few',
            'I hardly know anyone',
            'I don\'t know anyone'
          ]
        },
        {
          id: 'communication',
          title: 'Do you have a communication plan for disasters?',
          options: [
            'Yes, I have a detailed plan',
            'I\'ve thought about it partially',
            'No, I don\'t have a plan',
            'Haven\'t thought about it'
          ]
        },
        {
          id: 'emergencyKit',
          title: 'Is your emergency kit ready?',
          options: [
            'Yes, fully ready',
            'Partially ready',
            'No, not ready',
            'I don\'t know'
          ]
        },
        {
          id: 'meetingPoint',
          title: 'Do you know the assembly area?',
          options: [
            'Yes, I know it',
            'I know it approximately',
            'No, I don\'t know',
            'Never heard of it'
          ]
        },
        
        
        {
          id: 'familyPlan',
          title: 'Have you discussed what to do in a disaster with your family?',
          options: [
            'Yes, we made a detailed plan',
            'We talked about it partially',
            'No, we never discussed it',
            'I don\'t have a family'
          ]
        },
        {
          id: 'contactList',
          title: 'Do you have a list of emergency contacts?',
          options: [
            'Yes, ready',
            'Partially',
            'No',
            'I don\'t think it\'s necessary'
          ]
        },
        {
          id: 'phoneCharging',
          title: 'Do you have a phone charger and backup battery?',
          options: [
            'Yes, I have both',
            'Only charger',
            'No, I have neither',
            'I don\'t know'
          ]
        },
        {
          id: 'radio',
          title: 'Do you have a battery-powered radio or wireless communication device?',
          options: [
            'Yes, I have one',
            'No, I don\'t',
            'I don\'t know',
            'I don\'t think it\'s necessary'
          ]
        },
        {
          id: 'outOfAreaContact',
          title: 'Do you have a contact person outside the city for emergencies?',
          options: [
            'Yes, I have one',
            'No, I don\'t',
            'I don\'t know',
            'I don\'t think it\'s necessary'
          ]
        },
        
        
        {
          id: 'homeSafety',
          title: 'Have you taken earthquake safety measures in your home?',
          options: [
            'Yes, I\'ve taken all measures',
            'Partially',
            'No, I haven\'t',
            'I don\'t know'
          ]
        },
        {
          id: 'furnitureFix',
          title: 'Have you secured your furniture to the walls?',
          options: [
            'Yes, I\'ve secured most of it',
            'Partially',
            'No, none of it',
            'I don\'t think it\'s necessary'
          ]
        },
        {
          id: 'gasValve',
          title: 'Do you know where the gas valve is?',
          options: [
            'Yes, I know',
            'I know approximately',
            'No, I don\'t know',
            'I don\'t use gas'
          ]
        },
        {
          id: 'fireExtinguisher',
          title: 'Do you have a fire extinguisher?',
          options: [
            'Yes, and it\'s in working condition',
            'I have one but haven\'t checked it',
            'No, I don\'t',
            'I don\'t think it\'s necessary'
          ]
        },
        {
          id: 'emergencyExit',
          title: 'Do you know the emergency exit routes?',
          options: [
            'Yes, I know all routes',
            'I know some',
            'No, I don\'t know',
            'Haven\'t thought about it'
          ]
        },
        
        
        {
          id: 'waterStorage',
          title: 'Do you have sufficient water storage? (4 liters per person per day, 3 days)',
          options: [
            'Yes, sufficient',
            'Partially',
            'No',
            'I don\'t know'
          ]
        },
        {
          id: 'foodStorage',
          title: 'Do you have emergency food storage?',
          options: [
            'Yes, more than 3 days',
            '1-3 days',
            'No',
            'I don\'t know'
          ]
        },
        {
          id: 'canOpener',
          title: 'Do you have a can opener?',
          options: [
            'Yes, I have one',
            'No, I don\'t',
            'I don\'t think it\'s necessary',
            'I don\'t use canned food'
          ]
        },
        {
          id: 'waterFilter',
          title: 'Do you have a water filtration or purification method?',
          options: [
            'Yes, I have one',
            'No, I don\'t',
            'I don\'t know',
            'I don\'t think it\'s necessary'
          ]
        },
        {
          id: 'cooking',
          title: 'Can you cook without electricity?',
          options: [
            'Yes, I have a camp stove',
            'Partially',
            'No',
            'Haven\'t thought about it'
          ]
        },
        
        
        {
          id: 'firstAidKit',
          title: 'Is your first aid kit ready?',
          options: [
            'Yes, fully ready',
            'Partially ready',
            'No, not ready',
            'I don\'t know'
          ]
        },
        {
          id: 'medications',
          title: 'Do you have backup medications you regularly use?',
          options: [
            'Yes, sufficient backup',
            'Partially',
            'No',
            'I don\'t use medications'
          ]
        },
        {
          id: 'firstAidKnowledge',
          title: 'Do you have basic first aid knowledge?',
          options: [
            'Yes, I\'ve received training',
            'I know some',
            'No, I don\'t know',
            'I don\'t think it\'s necessary'
          ]
        },
        {
          id: 'medicalRecords',
          title: 'Do you have copies of your medical records?',
          options: [
            'Yes, ready',
            'Partially',
            'No, not ready',
            'I don\'t think it\'s necessary'
          ]
        },
        {
          id: 'healthInsurance',
          title: 'Do you have access to your health insurance information?',
          options: [
            'Yes, I can access easily',
            'Partially',
            'No',
            'I don\'t know'
          ]
        },
        
        
        {
          id: 'emergencyCash',
          title: 'Do you have cash prepared for emergencies?',
          options: [
            'Yes, sufficient',
            'Partially',
            'No',
            'I don\'t think it\'s necessary'
          ]
        },
        {
          id: 'importantDocuments',
          title: 'Are copies of your important documents in a safe place?',
          options: [
            'Yes, in a safe place',
            'Partially',
            'No',
            'I don\'t know'
          ]
        },
        {
          id: 'insurance',
          title: 'Do you have access to your insurance policies?',
          options: [
            'Yes, I can access easily',
            'Partially',
            'No',
            'I don\'t have insurance'
          ]
        },
        {
          id: 'banking',
          title: 'Do you have online access to your banking information?',
          options: [
            'Yes, I have',
            'Partially',
            'No',
            'I don\'t have a bank account'
          ]
        },
        {
          id: 'backupData',
          title: 'Do you have backups of your important data?',
          options: [
            'Yes, cloud and physical backup',
            'Only cloud',
            'No',
            'I don\'t think it\'s necessary'
          ]
        },
        
        
        {
          id: 'neighborhoodNetwork',
          title: 'Is there a disaster preparedness group in your neighborhood?',
          options: [
            'Yes, I actively participate',
            'There is one but I don\'t participate',
            'No, there isn\'t',
            'I don\'t know'
          ]
        },
        {
          id: 'volunteer',
          title: 'Are you ready to volunteer in a disaster?',
          options: [
            'Yes, definitely',
            'Maybe',
            'No',
            'Haven\'t thought about it'
          ]
        },
        {
          id: 'skills',
          title: 'Do you have special skills that could be useful in a disaster?',
          options: [
            'Yes, I have several skills',
            'Partially',
            'No',
            'I don\'t know'
          ]
        },
        {
          id: 'elderlyCare',
          title: 'Can you help elderly or disabled neighbors?',
          options: [
            'Yes, I\'m ready',
            'Partially',
            'No',
            'I don\'t have such neighbors'
          ]
        },
        {
          id: 'petPreparedness',
          title: 'Have you prepared for your pet?',
          options: [
            'Yes, fully prepared',
            'Partially',
            'No',
            'I don\'t have a pet'
          ]
        },
        {
          id: 'regularReview',
          title: 'Do you regularly review your preparedness plan?',
          options: [
            'Yes, regularly',
            'Occasionally',
            'No',
            'I don\'t have a plan'
          ]
        }
      ];
    }

    init() {
      
      this.loadProgress();
      
      
      this.elements.totalSteps.textContent = this.totalQuestions;
      
      
      this.setupEventListeners();
      
      
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
      const question = this.questions[this.currentQuestion];
      
      if (!question) {
        this.completeTest();
        return;
      }
      
      
      this.elements.questionTitle.textContent = question.title;
      
      
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
      card.setAttribute('aria-label', `Option ${index + 1}: ${text}`);
      
      
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
        this.completeTest();
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
        this.elements.btnNext.innerHTML = '<span>Complete Test</span> <i class="bi bi-check-circle"></i>';
      } else {
        this.elements.btnNext.innerHTML = '<span>Next</span> <i class="bi bi-arrow-right"></i>';
      }
    }

    saveProgress() {
      const data = {
        answers: this.answers,
        currentQuestion: this.currentQuestion,
        timestamp: Date.now()
      };
      localStorage.setItem('test_page_progress_en', JSON.stringify(data));
    }

    loadProgress() {
      const saved = localStorage.getItem('test_page_progress_en');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.answers = data.answers || {};
          
          
          if (data.currentQuestion !== undefined && data.currentQuestion < this.totalQuestions) {
            showConfirmModal({
              title: 'You have saved progress',
              description: 'Would you like to continue?',
              primaryText: 'Continue',
              secondaryText: 'Reset'
            }).then((confirmed) => {
              if (confirmed) {
                this.currentQuestion = data.currentQuestion;
                this.renderQuestion();
                this.updateProgress();
              } else {
                
                localStorage.removeItem('test_page_progress_en');
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

    completeTest() {
      
      const answeredCount = Object.keys(this.answers).length;
      
      
      localStorage.removeItem('test_page_progress_en');
      
      
      alert(`Test completed! ${answeredCount} questions answered. Results page coming soon.`);
      
      
      window.location.href = 'index.html';
    }
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new TestPageController();
    });
  } else {
    new TestPageController();
  }
})();

