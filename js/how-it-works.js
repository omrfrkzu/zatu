// ================= How It Works Interactive Component =====================
const howItWorks = {
  currentStep: 1,
  formData: {
    step1: {},
    step2: {}
  },
  
  // Age group messages (random selection)
  ageMessages: {
    '18-25': [
      "Genç nesil olarak afet hazırlığında öncü olabilirsin.",
      "20'li yaşlarda birçok kişi mahallesinde daha güvende hissetmek istiyor.",
      "Senin gibi gençler toplumsal dayanışmada önemli bir rol oynuyor."
    ],
    '26-35': [
      "30'lu yaşlarda birçok kişi mahallesinde daha güvende hissetmek istiyor.",
      "Bu yaş grubundaki insanlar afet hazırlığına önem veriyor.",
      "Aileler ve komşularla bağlantı kurmak senin için de önemli."
    ],
    '36-50': [
      "40'lı yaşlarda deneyim ve hazırlık bir araya geliyor.",
      "Bu yaş grubundaki insanlar mahalle dayanışmasında aktif rol alıyor.",
      "Komşularınla önceden tanışmak herkes için güven veriyor."
    ],
    '51+': [
      "Deneyimli bir birey olarak topluma değer katıyorsun.",
      "50+ yaş grubundaki insanlar afet hazırlığında rehberlik ediyor.",
      "Mahalle dayanışmasında senin deneyimin çok değerli."
    ]
  },

  init() {
    this.setupEventListeners();
    this.loadSavedData();
  },

  setupEventListeners() {
    // Step 1 Form
    const form1 = document.getElementById('how-it-works-form-1');
    if (form1) {
      form1.addEventListener('submit', (e) => this.handleStep1Submit(e));
      
      // Real-time validation for Step 1
      const fullNameInput = document.getElementById('hiw-fullName');
      const phoneInput = document.getElementById('hiw-phone');
      const birthDateInput = document.getElementById('hiw-birthDate');
      
      if (fullNameInput) {
        fullNameInput.addEventListener('input', () => this.validateInput(fullNameInput));
      }
      
      if (phoneInput) {
        phoneInput.addEventListener('input', () => this.validateInput(phoneInput));
      }
      
      if (birthDateInput) {
        birthDateInput.addEventListener('change', () => {
          this.validateInput(birthDateInput);
          this.handleBirthDateChange();
        });
      }
    }

    // Step 2 Form
    const form2 = document.getElementById('how-it-works-form-2');
    if (form2) {
      form2.addEventListener('submit', (e) => this.handleStep2Submit(e));
      
      // City selection enables district
      const citySelect = document.getElementById('hiw-city');
      const districtInput = document.getElementById('hiw-district');
      const neighborhoodInput = document.getElementById('hiw-neighborhood');
      
      if (citySelect) {
        citySelect.addEventListener('change', () => {
          this.validateInput(citySelect);
          if (citySelect.value) {
            districtInput.disabled = false;
            districtInput.focus();
          } else {
            districtInput.disabled = true;
            neighborhoodInput.disabled = true;
          }
          this.checkStep2Completion();
        });
      }
      
      if (districtInput) {
        districtInput.addEventListener('input', () => {
          this.validateInput(districtInput);
          if (districtInput.value.trim()) {
            neighborhoodInput.disabled = false;
          } else {
            neighborhoodInput.disabled = true;
          }
          this.checkStep2Completion();
        });
      }
      
      if (neighborhoodInput) {
        neighborhoodInput.addEventListener('input', () => {
          this.validateInput(neighborhoodInput);
          this.checkStep2Completion();
        });
      }
      
      // Other required fields
      const buildingAgeSelect = document.getElementById('hiw-buildingAge');
      const floorInput = document.getElementById('hiw-floor');
      
      if (buildingAgeSelect) {
        buildingAgeSelect.addEventListener('change', () => {
          this.validateInput(buildingAgeSelect);
          this.checkStep2Completion();
        });
      }
      
      if (floorInput) {
        floorInput.addEventListener('input', () => {
          this.validateInput(floorInput);
          this.checkStep2Completion();
        });
      }
    }

    // Step 4 - Optional Survey
    const startSurveyBtn = document.getElementById('hiw-start-survey');
    const skipSurveyBtn = document.getElementById('hiw-skip-survey');
    
    if (startSurveyBtn) {
      startSurveyBtn.addEventListener('click', () => {
        // Redirect to survey section or show survey
        window.location.href = '#afet-anketi';
      });
    }
    
    if (skipSurveyBtn) {
      skipSurveyBtn.addEventListener('click', () => {
        this.hideOptionalStep();
      });
    }

    // Skip download button
    const skipDownloadBtn = document.getElementById('hiw-skip-download');
    if (skipDownloadBtn) {
      skipDownloadBtn.addEventListener('click', () => {
        this.showOptionalStep();
      });
    }
  },

  validateInput(input) {
    const wrapper = input.closest('.input-wrapper');
    const checkIcon = wrapper?.querySelector('.input-check');
    
    if (!input || !wrapper) return;
    
    const isValid = input.checkValidity() && input.value.trim() !== '';
    
    if (isValid) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      if (checkIcon) checkIcon.style.display = 'inline-block';
    } else {
      input.classList.remove('is-valid');
      if (checkIcon) checkIcon.style.display = 'none';
    }
    
    return isValid;
  },

  handleBirthDateChange() {
    const birthDateInput = document.getElementById('hiw-birthDate');
    const ageDisplay = document.getElementById('age-display');
    const ageBadge = ageDisplay?.querySelector('.age-badge');
    const ageMessage = ageDisplay?.querySelector('.age-message');
    
    if (!birthDateInput || !birthDateInput.value) {
      if (ageDisplay) ageDisplay.style.display = 'none';
      return;
    }
    
    const age = this.calculateAge(birthDateInput.value);
    const ageGroup = this.getAgeGroup(age);
    
    if (ageDisplay && ageBadge && ageMessage) {
      ageDisplay.style.display = 'block';
      ageBadge.textContent = `${age} yaşındasın`;
      ageBadge.className = 'age-badge';
      
      // Get random message for age group
      const messages = this.ageMessages[ageGroup] || this.ageMessages['26-35'];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      ageMessage.textContent = randomMessage;
    }
  },

  calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  getAgeGroup(age) {
    if (age >= 18 && age <= 25) return '18-25';
    if (age >= 26 && age <= 35) return '26-35';
    if (age >= 36 && age <= 50) return '36-50';
    return '51+';
  },

  checkStep2Completion() {
    const city = document.getElementById('hiw-city')?.value;
    const district = document.getElementById('hiw-district')?.value?.trim();
    const neighborhood = document.getElementById('hiw-neighborhood')?.value?.trim();
    const buildingAge = document.getElementById('hiw-buildingAge')?.value;
    const floor = document.getElementById('hiw-floor')?.value?.trim();
    
    const submitBtn = document.getElementById('hiw-step2-submit');
    
    if (city && district && neighborhood && buildingAge && floor) {
      if (submitBtn) submitBtn.disabled = false;
    } else {
      if (submitBtn) submitBtn.disabled = true;
    }
  },

  handleStep1Submit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const fullName = formData.get('fullName');
    const phone = formData.get('phone');
    const birthDate = formData.get('birthDate');
    
    // Validate
    if (!fullName || !birthDate) {
      this.showError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    // Save data
    this.formData.step1 = {
      fullName,
      phone,
      birthDate,
      age: this.calculateAge(birthDate)
    };
    
    // Show loading
    const submitBtn = document.getElementById('hiw-step1-submit');
    if (submitBtn) {
      submitBtn.querySelector('.btn-text').style.display = 'none';
      submitBtn.querySelector('.btn-loader').style.display = 'inline-block';
      submitBtn.disabled = true;
    }
    
    // Simulate API call
    setTimeout(() => {
      this.saveData();
      this.goToStep(2);
      if (submitBtn) {
        submitBtn.querySelector('.btn-text').style.display = 'inline';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
        submitBtn.disabled = false;
      }
    }, 800);
  },

  handleStep2Submit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate
    const city = formData.get('city');
    const district = formData.get('district');
    const neighborhood = formData.get('neighborhood');
    const buildingAge = formData.get('buildingAge');
    const floor = formData.get('floor');
    
    if (!city || !district || !neighborhood || !buildingAge || !floor) {
      this.showError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    // Save data
    this.formData.step2 = {
      city,
      district,
      neighborhood,
      buildingAge,
      floor
    };
    
    // Show loading
    const submitBtn = document.getElementById('hiw-step2-submit');
    if (submitBtn) {
      submitBtn.querySelector('.btn-text').style.display = 'none';
      submitBtn.querySelector('.btn-loader').style.display = 'inline-block';
      submitBtn.disabled = true;
    }
    
    // Simulate API call
    setTimeout(() => {
      this.saveData();
      this.goToStep(3);
      this.updateSuccessGreeting();
      if (submitBtn) {
        submitBtn.querySelector('.btn-text').style.display = 'inline';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
        submitBtn.disabled = false;
      }
    }, 800);
  },

  updateSuccessGreeting() {
    const greetingEl = document.getElementById('success-greeting');
    const fullName = this.formData.step1?.fullName;
    
    if (greetingEl && fullName) {
      const firstName = fullName.split(' ')[0];
      greetingEl.textContent = `Hoş geldin, ${firstName}!`;
    }
  },

  goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.how-it-works-step').forEach(el => {
      el.style.display = 'none';
      el.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`how-it-works-step-${step}`);
    if (currentStepEl) {
      currentStepEl.style.display = 'block';
      currentStepEl.classList.add('active');
      
      // Fade in animation
      setTimeout(() => {
        currentStepEl.style.opacity = '0';
        currentStepEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          currentStepEl.style.opacity = '1';
        }, 10);
      }, 10);
    }
    
    // Update progress bar
    const progress = (step / 3) * 100;
    const progressBar = document.getElementById('how-it-works-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute('aria-valuenow', progress);
    }
    
    // Update step indicators
    document.querySelectorAll('.progress-step-indicator').forEach((el, index) => {
      if (index + 1 <= step) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    
    // Hide CTA buttons when form is active
    const ctaSection = document.getElementById('how-it-works-cta');
    if (ctaSection) {
      if (step > 1) {
        ctaSection.style.display = 'none';
      } else {
        ctaSection.style.display = 'block';
      }
    }
    
    this.currentStep = step;
    
    // Scroll to step
    if (currentStepEl) {
      currentStepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  showOptionalStep() {
    const optionalStep = document.getElementById('how-it-works-step-4');
    if (optionalStep) {
      optionalStep.style.display = 'block';
      optionalStep.classList.add('active');
      
      // Update progress to show optional step
      const progressBar = document.getElementById('how-it-works-progress-bar');
      if (progressBar) {
        progressBar.style.width = '100%';
      }
    }
  },

  hideOptionalStep() {
    const optionalStep = document.getElementById('how-it-works-step-4');
    if (optionalStep) {
      optionalStep.style.display = 'none';
      optionalStep.classList.remove('active');
    }
  },

  showError(message) {
    // Simple error display (can be enhanced with toast notifications)
    alert(message);
  },

  loadSavedData() {
    // Load saved data from localStorage if available
    const savedStep1 = localStorage.getItem('how-it-works-step1');
    const savedStep2 = localStorage.getItem('how-it-works-step2');
    
    if (savedStep1) {
      try {
        const data = JSON.parse(savedStep1);
        this.formData.step1 = data;
        
        // Populate form
        const fullNameInput = document.getElementById('hiw-fullName');
        const phoneInput = document.getElementById('hiw-phone');
        const birthDateInput = document.getElementById('hiw-birthDate');
        
        if (fullNameInput && data.fullName) fullNameInput.value = data.fullName;
        if (phoneInput && data.phone) phoneInput.value = data.phone;
        if (birthDateInput && data.birthDate) {
          birthDateInput.value = data.birthDate;
          this.handleBirthDateChange();
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
    
    if (savedStep2) {
      try {
        const data = JSON.parse(savedStep2);
        this.formData.step2 = data;
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  },

  saveData() {
    // Save to localStorage
    if (this.formData.step1 && Object.keys(this.formData.step1).length > 0) {
      localStorage.setItem('how-it-works-step1', JSON.stringify(this.formData.step1));
    }
    if (this.formData.step2 && Object.keys(this.formData.step2).length > 0) {
      localStorage.setItem('how-it-works-step2', JSON.stringify(this.formData.step2));
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('how-it-works-step-1')) {
    howItWorks.init();
  }
});

// Expose to global scope for onclick handlers
window.howItWorks = howItWorks;

