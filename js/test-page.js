// ================= Test Page Controller =====================

(function() {
  'use strict';

  class TestPageController {
    constructor() {
      this.currentQuestion = 0;
      this.answers = {};
      this.questions = this.generateQuestions();
      this.totalQuestions = this.questions.length;
      
      // DOM elements
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
        // Genel Hazırlık (1-5)
        {
          id: 'preparedness',
          title: 'Afet hazırlığında kendini nasıl değerlendiriyorsun?',
          options: [
            'Çok hazırlıklıyım',
            'Biraz hazırlıklıyım',
            'Hazırlıklı değilim',
            'Hiç düşünmedim'
          ]
        },
        {
          id: 'neighborhood',
          title: 'Mahallendeki komşularını ne kadar tanıyorsun?',
          options: [
            'Çoğunu tanıyorum',
            'Birkaçını tanıyorum',
            'Neredeyse hiç kimseyi tanımıyorum',
            'Hiç kimseyi tanımıyorum'
          ]
        },
        {
          id: 'communication',
          title: 'Afet anında iletişim kurma planın var mı?',
          options: [
            'Evet, detaylı bir planım var',
            'Kısmen düşündüm',
            'Hayır, planım yok',
            'Hiç düşünmedim'
          ]
        },
        {
          id: 'emergencyKit',
          title: 'Acil durum çantan hazır mı?',
          options: [
            'Evet, tam hazır',
            'Kısmen hazır',
            'Hayır, hazır değil',
            'Bilmiyorum'
          ]
        },
        {
          id: 'meetingPoint',
          title: 'Toplanma alanını biliyor musun?',
          options: [
            'Evet, biliyorum',
            'Yaklaşık olarak biliyorum',
            'Hayır, bilmiyorum',
            'Hiç duymadım'
          ]
        },
        
        // Aile ve İletişim (6-10)
        {
          id: 'familyPlan',
          title: 'Ailenle afet durumunda ne yapacağınızı konuştunuz mu?',
          options: [
            'Evet, detaylı plan yaptık',
            'Kısmen konuştuk',
            'Hayır, hiç konuşmadık',
            'Ailem yok'
          ]
        },
        {
          id: 'contactList',
          title: 'Acil durumda aranacak kişilerin listesi hazır mı?',
          options: [
            'Evet, hazır',
            'Kısmen',
            'Hayır',
            'Gerekli görmüyorum'
          ]
        },
        {
          id: 'phoneCharging',
          title: 'Telefon şarj cihazı ve yedek batarya var mı?',
          options: [
            'Evet, her ikisi de var',
            'Sadece şarj cihazı var',
            'Hayır, hiçbiri yok',
            'Bilmiyorum'
          ]
        },
        {
          id: 'radio',
          title: 'Pilli radyo veya kablosuz haberleşme cihazın var mı?',
          options: [
            'Evet, var',
            'Hayır, yok',
            'Bilmiyorum',
            'Gerekli görmüyorum'
          ]
        },
        {
          id: 'outOfAreaContact',
          title: 'Şehir dışında acil durumda ulaşabileceğin bir kişi var mı?',
          options: [
            'Evet, var',
            'Hayır, yok',
            'Bilmiyorum',
            'Gerekli görmüyorum'
          ]
        },
        
        // Barınma ve Güvenlik (11-15)
        {
          id: 'homeSafety',
          title: 'Evinde deprem güvenliği önlemleri aldın mı?',
          options: [
            'Evet, tüm önlemleri aldım',
            'Kısmen aldım',
            'Hayır, almadım',
            'Bilmiyorum'
          ]
        },
        {
          id: 'furnitureFix',
          title: 'Eşyalarını duvara sabitledin mi?',
          options: [
            'Evet, çoğunu sabitledim',
            'Kısmen',
            'Hayır, hiçbirini',
            'Gerekli görmüyorum'
          ]
        },
        {
          id: 'gasValve',
          title: 'Doğalgaz vanasının yerini biliyor musun?',
          options: [
            'Evet, biliyorum',
            'Yaklaşık olarak biliyorum',
            'Hayır, bilmiyorum',
            'Doğalgaz kullanmıyorum'
          ]
        },
        {
          id: 'fireExtinguisher',
          title: 'Yangın söndürücü var mı?',
          options: [
            'Evet, var ve çalışır durumda',
            'Var ama kontrol etmedim',
            'Hayır, yok',
            'Gerekli görmüyorum'
          ]
        },
        {
          id: 'emergencyExit',
          title: 'Acil çıkış yollarını biliyor musun?',
          options: [
            'Evet, tüm yolları biliyorum',
            'Kısmen biliyorum',
            'Hayır, bilmiyorum',
            'Düşünmedim'
          ]
        },
        
        // Su ve Gıda (16-20)
        {
          id: 'waterStorage',
          title: 'Yeterli su stokun var mı? (Kişi başı günde 4 litre, 3 gün)',
          options: [
            'Evet, yeterli var',
            'Kısmen var',
            'Hayır, yok',
            'Bilmiyorum'
          ]
        },
        {
          id: 'foodStorage',
          title: 'Acil durum için gıda stokun var mı?',
          options: [
            'Evet, 3 günden fazla',
            '1-3 gün',
            'Hayır, yok',
            'Bilmiyorum'
          ]
        },
        {
          id: 'canOpener',
          title: 'Konserve açacağın var mı?',
          options: [
            'Evet, var',
            'Hayır, yok',
            'Gerekli görmüyorum',
            'Konserve kullanmıyorum'
          ]
        },
        {
          id: 'waterFilter',
          title: 'Su filtreleme veya arıtma yöntemin var mı?',
          options: [
            'Evet, var',
            'Hayır, yok',
            'Bilmiyorum',
            'Gerekli görmüyorum'
          ]
        },
        {
          id: 'cooking',
          title: 'Elektrik olmadan yemek pişirebilir misin?',
          options: [
            'Evet, kamp ocağım var',
            'Kısmen',
            'Hayır',
            'Düşünmedim'
          ]
        },
        
        // İlk Yardım ve Sağlık (21-25)
        {
          id: 'firstAidKit',
          title: 'İlk yardım çantan hazır mı?',
          options: [
            'Evet, tam hazır',
            'Kısmen hazır',
            'Hayır, hazır değil',
            'Bilmiyorum'
          ]
        },
        {
          id: 'medications',
          title: 'Düzenli kullandığın ilaçların yedeği var mı?',
          options: [
            'Evet, yeterli yedek var',
            'Kısmen',
            'Hayır, yok',
            'İlaç kullanmıyorum'
          ]
        },
        {
          id: 'firstAidKnowledge',
          title: 'Temel ilk yardım bilgin var mı?',
          options: [
            'Evet, eğitim aldım',
            'Kısmen biliyorum',
            'Hayır, bilmiyorum',
            'Gerekli görmüyorum'
          ]
        },
        {
          id: 'medicalRecords',
          title: 'Tıbbi kayıtlarının kopyası hazır mı?',
          options: [
            'Evet, hazır',
            'Kısmen',
            'Hayır, hazır değil',
            'Gerekli görmüyorum'
          ]
        },
        {
          id: 'healthInsurance',
          title: 'Sağlık sigortası bilgilerine erişimin var mı?',
          options: [
            'Evet, kolayca erişebilirim',
            'Kısmen',
            'Hayır, yok',
            'Bilmiyorum'
          ]
        },
        
        // Finansal Hazırlık (26-30)
        {
          id: 'emergencyCash',
          title: 'Acil durum için nakit paran hazır mı?',
          options: [
            'Evet, yeterli var',
            'Kısmen',
            'Hayır, yok',
            'Gerekli görmüyorum'
          ]
        },
        {
          id: 'importantDocuments',
          title: 'Önemli belgelerin kopyaları güvenli yerde mi?',
          options: [
            'Evet, güvenli yerde',
            'Kısmen',
            'Hayır',
            'Bilmiyorum'
          ]
        },
        {
          id: 'insurance',
          title: 'Sigorta poliçelerine erişimin var mı?',
          options: [
            'Evet, kolayca erişebilirim',
            'Kısmen',
            'Hayır, yok',
            'Sigortam yok'
          ]
        },
        {
          id: 'banking',
          title: 'Banka bilgilerine online erişimin var mı?',
          options: [
            'Evet, var',
            'Kısmen',
            'Hayır, yok',
            'Banka hesabım yok'
          ]
        },
        {
          id: 'backupData',
          title: 'Önemli verilerinin yedeği var mı?',
          options: [
            'Evet, bulut ve fiziksel yedek',
            'Sadece bulut',
            'Hayır, yok',
            'Gerekli görmüyorum'
          ]
        },
        
        // Toplumsal Bağlantı (31-36)
        {
          id: 'neighborhoodNetwork',
          title: 'Mahallende afet hazırlık grubu var mı?',
          options: [
            'Evet, aktif olarak katılıyorum',
            'Var ama katılmıyorum',
            'Hayır, yok',
            'Bilmiyorum'
          ]
        },
        {
          id: 'volunteer',
          title: 'Afet durumunda gönüllü olmaya hazır mısın?',
          options: [
            'Evet, kesinlikle',
            'Belki',
            'Hayır',
            'Düşünmedim'
          ]
        },
        {
          id: 'skills',
          title: 'Afet durumunda faydalı olabilecek özel becerilerin var mı?',
          options: [
            'Evet, birkaç becerim var',
            'Kısmen',
            'Hayır',
            'Bilmiyorum'
          ]
        },
        {
          id: 'elderlyCare',
          title: 'Yaşlı veya engelli komşularına yardım edebilir misin?',
          options: [
            'Evet, hazırım',
            'Kısmen',
            'Hayır',
            'Böyle komşum yok'
          ]
        },
        {
          id: 'petPreparedness',
          title: 'Evcil hayvanın için hazırlık yaptın mı?',
          options: [
            'Evet, tam hazırlık yaptım',
            'Kısmen',
            'Hayır',
            'Evcil hayvanım yok'
          ]
        },
        {
          id: 'regularReview',
          title: 'Hazırlık planını düzenli olarak gözden geçiriyor musun?',
          options: [
            'Evet, düzenli olarak',
            'Ara sıra',
            'Hayır',
            'Planım yok'
          ]
        }
      ];
    }

    init() {
      // Load saved progress
      this.loadProgress();
      
      // Set total steps
      this.elements.totalSteps.textContent = this.totalQuestions;
      
      // Setup event listeners
      this.setupEventListeners();
      
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
      const question = this.questions[this.currentQuestion];
      
      if (!question) {
        this.completeTest();
        return;
      }
      
      // Update question title
      this.elements.questionTitle.textContent = question.title;
      
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
        this.completeTest();
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
        this.elements.btnNext.innerHTML = '<span>Testi Tamamla</span> <i class="bi bi-check-circle"></i>';
      } else {
        this.elements.btnNext.innerHTML = '<span>İleri</span> <i class="bi bi-arrow-right"></i>';
      }
    }

    saveProgress() {
      const data = {
        answers: this.answers,
        currentQuestion: this.currentQuestion,
        timestamp: Date.now()
      };
      localStorage.setItem('test_page_progress', JSON.stringify(data));
    }

    loadProgress() {
      const saved = localStorage.getItem('test_page_progress');
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
                localStorage.removeItem('test_page_progress');
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

    completeTest() {
      // Calculate score or prepare results
      const answeredCount = Object.keys(this.answers).length;
      
      // Clear saved progress
      localStorage.removeItem('test_page_progress');
      
      // Redirect to results page or show completion message
      alert(`Test tamamlandı! ${answeredCount} soru cevaplandı. Sonuçlar sayfası yakında eklenecek.`);
      
      // For now, redirect to homepage
      window.location.href = 'index.html';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new TestPageController();
    });
  } else {
    new TestPageController();
  }
})();

