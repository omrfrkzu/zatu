// ================= Quiz Component =====================
(function() {
  'use strict';

  // Quiz Questions (5 questions)
  const QUESTIONS = [
    {
      id: 1,
      title: "Afet durumunda en çok endişelendiğin konu nedir?",
      helper: "Seçtiğin cevap, profilini oluşturmamıza yardımcı olacak.",
      type: "single-choice",
      options: [
        { value: "safety", label: "Güvenliğim ve ailemin güvenliği" },
        { value: "communication", label: "İletişim kopması ve haber alamama" },
        { value: "resources", label: "Temel ihtiyaçlar (su, yiyecek, ilaç)" },
        { value: "isolation", label: "Yalnız kalma ve yardım alamama" }
      ]
    },
    {
      id: 2,
      title: "Afet anında komşularınla iletişim kurmak ne kadar önemli?",
      helper: "Bu bilgi, ağdaki önceliklerini belirlememize yardımcı olur.",
      type: "scale",
      options: [
        { value: 1, label: "Çok Önemli" },
        { value: 2, label: "Önemli" },
        { value: 3, label: "Orta" },
        { value: 4, label: "Az Önemli" },
        { value: 5, label: "Önemsiz" }
      ]
    },
    {
      id: 3,
      title: "Hangi yaş grubundasın?",
      helper: "Yaş bilgisi, ağ içindeki çeşitliliği artırır.",
      type: "age"
    },
    {
      id: 4,
      title: "Daha önce bir afet deneyimi yaşadın mı?",
      helper: "Deneyimlerin, ağdaki bilgi paylaşımına katkı sağlar.",
      type: "single-choice",
      options: [
        { value: "yes-major", label: "Evet, büyük bir afet" },
        { value: "yes-minor", label: "Evet, küçük bir afet" },
        { value: "no", label: "Hayır, hiç yaşamadım" },
        { value: "prefer-not", label: "Belirtmek istemiyorum" }
      ]
    },
    {
      id: 5,
      title: "Zatu ağında en çok hangi özelliği kullanmak istersin?",
      helper: "Bu bilgi, platform geliştirmelerinde öncelik belirlememize yardımcı olur.",
      type: "single-choice",
      options: [
        { value: "communication", label: "Komşularla iletişim kurma" },
        { value: "resources", label: "Kaynak paylaşımı (su, yiyecek, ilaç)" },
        { value: "safety", label: "Güvenlik durumu bildirme" },
        { value: "coordination", label: "Koordinasyon ve planlama" }
      ]
    }
  ];

  // Scoring rules (2-8 scale)
  const SCORING_RULES = {
    1: { // Question 1 weights
      "safety": 2,
      "communication": 3,
      "resources": 4,
      "isolation": 5
    },
    2: { // Question 2 weights (scale 1-5, reverse: 1=high concern)
      "1": 6, // Very important = high concern
      "2": 5,
      "3": 4,
      "4": 3,
      "5": 2 // Not important = low concern
    },
    3: { // Question 3 age (older = slightly higher concern)
      "18-30": 2,
      "31-45": 3,
      "46-60": 4,
      "61+": 5
    },
    4: { // Question 4 experience
      "yes-major": 6,
      "yes-minor": 4,
      "no": 3,
      "prefer-not": 3
    },
    5: { // Question 5 feature preference
      "communication": 3,
      "resources": 4,
      "safety": 5,
      "coordination": 4
    }
  };

  // Result categories
  const RESULT_CATEGORIES = {
    low: {
      min: 2,
      max: 4,
      badge: "Düşük Endişe",
      description: "Afet durumunda hazırlıklı ve sakin bir yaklaşımın var. Zatu ağında aktif olarak yer alarak deneyimlerini paylaşabilirsin."
    },
    medium: {
      min: 5,
      max: 6,
      badge: "Orta Endişe",
      description: "Afet konusunda farkındalığın var ve hazırlık yapmak istiyorsun. Zatu ağında komşularınla bağlantı kurarak güvenliğini artırabilirsin."
    },
    high: {
      min: 7,
      max: 8,
      badge: "Yüksek Endişe",
      description: "Afet durumunda endişelerin yüksek. Zatu ağında komşularınla önceden bağlantı kurarak ve hazırlık yaparak kendini daha güvende hissedebilirsin."
    }
  };

  // State
  let currentStep = 0;
  let answers = {};
  let isLoading = false;

  // DOM Elements
  const quizContainer = document.getElementById('quiz-container');
  const quizCard = document.getElementById('quiz-card');
  const progressHeader = document.getElementById('quiz-progress-header');
  const stepLabel = document.getElementById('quiz-step-label');
  const progressPercent = document.getElementById('quiz-progress-percent');
  const progressBar = document.getElementById('quiz-progress-bar');
  const questionTitle = document.getElementById('quiz-question-title');
  const questionHelper = document.getElementById('quiz-question-helper');
  const inputWrapper = document.getElementById('quiz-input-wrapper');
  const errorMessage = document.getElementById('quiz-error-message');
  const backBtn = document.getElementById('quiz-back-btn');
  const nextBtn = document.getElementById('quiz-next-btn');
  const resultScreen = document.getElementById('quiz-result-screen');
  const quizCloseBtn = document.getElementById('quiz-close-btn');

  // Initialize
  function init() {
    loadProgress();
    renderQuestion();
    attachEventListeners();
  }

  // Load progress from localStorage
  function loadProgress() {
    const saved = localStorage.getItem('quiz_progress');
    if (saved) {
      const data = JSON.parse(saved);
      currentStep = data.step || 0;
      answers = data.answers || {};
    }
  }

  // Save progress to localStorage
  function saveProgress() {
    localStorage.setItem('quiz_progress', JSON.stringify({
      step: currentStep,
      answers: answers
    }));
  }

  // Render question
  function renderQuestion() {
    if (currentStep >= QUESTIONS.length) {
      showResult();
      return;
    }

    const question = QUESTIONS[currentStep];
    const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

    // Update progress
    stepLabel.textContent = `Soru ${currentStep + 1}/${QUESTIONS.length}`;
    progressPercent.textContent = `${Math.round(progress)}%`;
    progressBar.style.width = `${progress}%`;

    // Update question
    questionTitle.textContent = question.title;
    questionHelper.textContent = question.helper;

    // Render input based on type
    renderInput(question);

    // Update buttons
    backBtn.disabled = currentStep === 0;
    nextBtn.disabled = !answers[currentStep];

    // Hide error
    hideError();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render input component
  function renderInput(question) {
    inputWrapper.innerHTML = '';

    switch (question.type) {
      case 'single-choice':
        renderSingleChoice(question);
        break;
      case 'scale':
        renderScale(question);
        break;
      case 'age':
        renderAgeInput(question);
        break;
    }
  }

  // Render single choice options
  function renderSingleChoice(question) {
    question.options.forEach(option => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'quiz-option-card';
      if (answers[currentStep] === option.value) {
        card.classList.add('selected');
      }

      card.innerHTML = `
        <input type="radio" name="question-${question.id}" value="${option.value}" 
               ${answers[currentStep] === option.value ? 'checked' : ''}>
        <span class="quiz-option-label">${option.label}</span>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const radio = card.querySelector('input[type="radio"]');
        radio.checked = true;
        answers[currentStep] = option.value;
        saveProgress();
        nextBtn.disabled = false;
        hideError();
      });

      inputWrapper.appendChild(card);
    });
  }

  // Render scale options
  function renderScale(question) {
    const container = document.createElement('div');
    container.className = 'quiz-slider-container';

    const scale = document.createElement('div');
    scale.className = 'quiz-slider-scale';

    question.options.forEach(option => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-slider-option';
      if (answers[currentStep] === String(option.value)) {
        btn.classList.add('selected');
      }
      btn.textContent = option.label;
      btn.value = option.value;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.quiz-slider-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[currentStep] = String(option.value);
        saveProgress();
        nextBtn.disabled = false;
        hideError();
      });

      scale.appendChild(btn);
    });

    container.appendChild(scale);
    inputWrapper.appendChild(container);
  }

  // Render age input
  function renderAgeInput(question) {
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'quiz-age-input';
    input.placeholder = 'Yaşını gir';
    input.min = 18;
    input.max = 120;
    input.value = answers[currentStep] || '';

    input.addEventListener('input', (e) => {
      const age = parseInt(e.target.value);
      if (age >= 18 && age <= 120) {
        answers[currentStep] = age;
        saveProgress();
        nextBtn.disabled = false;
        hideError();
      } else {
        nextBtn.disabled = true;
      }
    });

    input.addEventListener('blur', () => {
      const age = parseInt(input.value);
      if (age < 18 || age > 120) {
        showError('Lütfen 18 ile 120 arasında bir yaş girin.');
        nextBtn.disabled = true;
      }
    });

    inputWrapper.appendChild(input);
  }

  // Show error
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
  }

  // Hide error
  function hideError() {
    errorMessage.classList.remove('show');
  }

  // Validate current answer
  function validateAnswer() {
    if (!answers[currentStep]) {
      showError('Lütfen bir seçenek seç veya cevabını gir.');
      return false;
    }

    // Age validation
    if (QUESTIONS[currentStep].type === 'age') {
      const age = parseInt(answers[currentStep]);
      if (age < 18 || age > 120) {
        showError('Lütfen 18 ile 120 arasında bir yaş girin.');
        return false;
      }
    }

    return true;
  }

  // Next question
  function nextQuestion() {
    if (!validateAnswer()) {
      return;
    }

    if (isLoading) return;
    isLoading = true;
    nextBtn.classList.add('loading');

    setTimeout(() => {
      currentStep++;
      saveProgress();

      // Fade out
      quizCard.classList.add('fade-out');

      setTimeout(() => {
        renderQuestion();
        quizCard.classList.remove('fade-out');
        isLoading = false;
        nextBtn.classList.remove('loading');
      }, 200);
    }, 300);
  }

  // Previous question
  function prevQuestion() {
    if (currentStep === 0 || isLoading) return;

    currentStep--;
    saveProgress();

    quizCard.classList.add('fade-out');

    setTimeout(() => {
      renderQuestion();
      quizCard.classList.remove('fade-out');
    }, 200);
  }

  // Calculate score
  function calculateScore() {
    let totalScore = 0;

    QUESTIONS.forEach((question, index) => {
      const answer = answers[index];
      if (!answer) return;

      const rules = SCORING_RULES[question.id];
      if (!rules) return;

      if (question.type === 'age') {
        const age = parseInt(answer);
        if (age >= 18 && age <= 30) totalScore += rules["18-30"];
        else if (age >= 31 && age <= 45) totalScore += rules["31-45"];
        else if (age >= 46 && age <= 60) totalScore += rules["46-60"];
        else if (age >= 61) totalScore += rules["61+"];
      } else {
        totalScore += rules[answer] || 0;
      }
    });

    // Average and round (2-8 scale)
    const avgScore = totalScore / QUESTIONS.length;
    return Math.round(avgScore * 10) / 10;
  }

  // Get result category
  function getResultCategory(score) {
    if (score >= 2 && score <= 4) return 'low';
    if (score >= 5 && score <= 6) return 'medium';
    return 'high';
  }

  // Show result screen
  function showResult() {
    const score = calculateScore();
    const category = getResultCategory(score);
    const result = RESULT_CATEGORIES[category];

    // Hide quiz card
    quizCard.style.display = 'none';
    progressHeader.style.display = 'none';

    // Show result
    resultScreen.style.display = 'block';
    document.getElementById('quiz-result-badge').textContent = result.badge;
    document.getElementById('quiz-result-badge').className = `quiz-result-badge ${category}`;
    document.getElementById('quiz-result-description').textContent = result.description;

    // Mark profile as completed
    localStorage.setItem('profile_completed', 'true');
    localStorage.removeItem('quiz_progress'); // Clear progress

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Event listeners
  function attachEventListeners() {
    nextBtn.addEventListener('click', nextQuestion);
    backBtn.addEventListener('click', prevQuestion);
    quizCloseBtn.addEventListener('click', () => {
      if (confirm('Testi yarıda bırakmak istediğine emin misin? İlerlemen kaydedilecek.')) {
        window.location.href = 'index.html';
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

