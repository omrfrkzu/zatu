// ================= Registration Page Controller =====================

(function() {
  'use strict';

  class RegistrationPageController {
    constructor() {
      this.currentStep = 0;
      this.formData = {};
      this.steps = this.generateSteps();
      this.totalSteps = this.steps.length;
      
      // DOM elements
      this.elements = {
        stepTitle: document.getElementById('step-title'),
        contentContainer: document.getElementById('content-container'),
        stepContainer: document.getElementById('step-container'),
        btnBack: document.getElementById('btn-back'),
        btnNext: document.getElementById('btn-next'),
        currentStep: document.getElementById('current-step'),
        totalSteps: document.getElementById('total-steps'),
        progressBarFill: document.getElementById('progress-bar-fill'),
        loadingOverlay: document.getElementById('loading-overlay')
      };
      
      this.init();
    }

    generateSteps() {
      return [
        {
          id: 'basic-info',
          title: 'Temel bilgilerini gir',
          content: () => this.renderBasicInfoStep()
        },
        {
          id: 'location',
          title: 'Konum bilgilerini paylaş',
          content: () => this.renderLocationStep()
        },
        {
          id: 'building',
          title: 'Bina bilgilerini tamamla',
          content: () => this.renderBuildingStep()
        },
        {
          id: 'success',
          title: 'Kayıt tamamlandı!',
          content: () => this.renderSuccessStep()
        }
      ];
    }

    init() {
      // Set total steps
      this.elements.totalSteps.textContent = this.totalSteps;
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Render first step
      this.renderStep();
      
      // Update progress
      this.updateProgress();
      
      // Load saved progress
      this.loadProgress();
    }

    setupEventListeners() {
      // Navigation buttons
      this.elements.btnBack.addEventListener('click', () => this.prevStep());
      this.elements.btnNext.addEventListener('click', () => this.nextStep());
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !this.elements.btnBack.disabled) {
          this.prevStep();
        } else if (e.key === 'ArrowRight' && !this.elements.btnNext.disabled) {
          this.nextStep();
        }
      });
      
      // Save progress on unload
      window.addEventListener('beforeunload', () => this.saveProgress());
    }

    renderStep() {
      const step = this.steps[this.currentStep];
      
      if (!step) {
        return;
      }
      
      // Update step title
      this.elements.stepTitle.textContent = step.title;
      
      // Clear and render content
      this.elements.contentContainer.innerHTML = '';
      const content = step.content();
      if (content) {
        this.elements.contentContainer.appendChild(content);
      }
      
      // Setup step-specific handlers
      this.setupStepHandlers();
      
      // Update navigation buttons
      this.updateNavigationButtons();
    }

    renderBasicInfoStep() {
      const container = document.createElement('div');
      container.className = 'registration-form-container';
      
      // Name input
      const nameGroup = this.createInputGroup({
        id: 'fullName',
        label: 'Ad Soyad',
        type: 'text',
        placeholder: 'Adınız ve soyadınız',
        required: true,
        value: this.formData.fullName || ''
      });
      container.appendChild(nameGroup);
      
      // Phone input
      const phoneGroup = this.createInputGroup({
        id: 'phone',
        label: 'Telefon Numarası',
        helpText: 'Acil bildirimler için – önerilen',
        type: 'tel',
        placeholder: '05XX XXX XX XX',
        required: true,
        pattern: '[0-9]{10,11}',
        value: this.formData.phone || ''
      });
      container.appendChild(phoneGroup);
      
      // Birth date input
      const birthDateGroup = this.createInputGroup({
        id: 'birthDate',
        label: 'Doğum Tarihi',
        type: 'date',
        required: true,
        value: this.formData.birthDate || ''
      });
      container.appendChild(birthDateGroup);
      
      // Data consent checkbox
      const consentGroup = this.createCheckboxGroup({
        id: 'dataConsent',
        label: 'Verilerimin işlenmesini kabul ediyorum.',
        required: true,
        checked: this.formData.dataConsent || false
      });
      container.appendChild(consentGroup);
      
      return container;
    }

    renderLocationStep() {
      const container = document.createElement('div');
      container.className = 'registration-form-container';
      
      // City select
      const cityGroup = this.createSelectGroup({
        id: 'city',
        label: 'İl',
        required: true,
        options: [
          { value: '', text: 'İl seçiniz' },
          { value: '01', text: 'Adana' },
          { value: '06', text: 'Ankara' },
          { value: '07', text: 'Antalya' },
          { value: '16', text: 'Bursa' },
          { value: '26', text: 'Eskişehir' },
          { value: '27', text: 'Gaziantep' },
          { value: '34', text: 'İstanbul' },
          { value: '35', text: 'İzmir' },
          { value: '58', text: 'Sivas' },
          { value: '61', text: 'Trabzon' }
        ],
        value: this.formData.city || ''
      });
      container.appendChild(cityGroup);
      
      // District input
      const districtGroup = this.createInputGroup({
        id: 'district',
        label: 'İlçe',
        type: 'text',
        placeholder: 'İlçe adınız',
        required: true,
        disabled: !this.formData.city,
        value: this.formData.district || ''
      });
      container.appendChild(districtGroup);
      
      // Neighborhood input
      const neighborhoodGroup = this.createInputGroup({
        id: 'neighborhood',
        label: 'Mahalle',
        type: 'text',
        placeholder: 'Mahalle adınız',
        required: true,
        disabled: !this.formData.district,
        value: this.formData.neighborhood || ''
      });
      container.appendChild(neighborhoodGroup);
      
      // Enable district when city is selected
      const citySelect = container.querySelector('#city');
      if (citySelect) {
        citySelect.addEventListener('change', (e) => {
          const districtInput = container.querySelector('#district');
          if (districtInput) {
            districtInput.disabled = !e.target.value;
            if (!e.target.value) {
              districtInput.value = '';
              const neighborhoodInput = container.querySelector('#neighborhood');
              if (neighborhoodInput) {
                neighborhoodInput.value = '';
                neighborhoodInput.disabled = true;
              }
            }
          }
        });
      }
      
      // Enable neighborhood when district is filled
      const districtInput = container.querySelector('#district');
      if (districtInput) {
        districtInput.addEventListener('input', (e) => {
          const neighborhoodInput = container.querySelector('#neighborhood');
          if (neighborhoodInput) {
            neighborhoodInput.disabled = !e.target.value.trim();
            if (!e.target.value.trim()) {
              neighborhoodInput.value = '';
            }
          }
        });
      }
      
      return container;
    }

    renderBuildingStep() {
      const container = document.createElement('div');
      container.className = 'registration-form-container';
      
      // Building age select
      const buildingAgeGroup = this.createSelectGroup({
        id: 'buildingAge',
        label: 'Bina Yaşı',
        required: true,
        options: [
          { value: '', text: 'Seçiniz' },
          { value: '0-5', text: '0-5 yıl' },
          { value: '6-10', text: '6-10 yıl' },
          { value: '11-20', text: '11-20 yıl' },
          { value: '21-30', text: '21-30 yıl' },
          { value: '30+', text: '30+ yıl' }
        ],
        value: this.formData.buildingAge || ''
      });
      container.appendChild(buildingAgeGroup);
      
      // Floor input
      const floorGroup = this.createInputGroup({
        id: 'floor',
        label: 'Kat Bilgisi',
        type: 'number',
        placeholder: 'Bulunduğunuz kat',
        required: true,
        min: 0,
        max: 100,
        value: this.formData.floor || ''
      });
      container.appendChild(floorGroup);
      
      return container;
    }

    renderSuccessStep() {
      const container = document.createElement('div');
      container.className = 'registration-success-container';
      
      const icon = document.createElement('div');
      icon.className = 'registration-success-icon';
      icon.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
      
      const title = document.createElement('h2');
      title.className = 'registration-success-title';
      title.textContent = 'Kayıt tamamlandı!';
      
      const text = document.createElement('p');
      text.className = 'registration-success-text';
      text.textContent = `Merhaba ${this.formData.fullName || 'Kullanıcı'}, artık bulunduğun bölgeye özel bildirimleri alabilirsin.`;
      
      container.appendChild(icon);
      container.appendChild(title);
      container.appendChild(text);
      
      // Hide navigation buttons on success
      this.elements.btnBack.style.display = 'none';
      this.elements.btnNext.style.display = 'none';
      
      return container;
    }

    createInputGroup({ id, label, type, placeholder, required, helpText, pattern, disabled, min, max, value }) {
      const group = document.createElement('div');
      group.className = 'registration-form-group';
      
      const labelEl = document.createElement('label');
      labelEl.className = 'registration-label';
      labelEl.setAttribute('for', id);
      labelEl.innerHTML = label + (required ? '<span class="required">*</span>' : '');
      if (helpText) {
        const help = document.createElement('span');
        help.className = 'text-muted';
        help.style.fontSize = '0.85rem';
        help.textContent = ` (${helpText})`;
        labelEl.appendChild(help);
      }
      
      const wrapper = document.createElement('div');
      wrapper.className = 'registration-input-wrapper';
      
      const input = document.createElement('input');
      input.type = type;
      input.id = id;
      input.name = id;
      input.className = 'registration-input';
      if (placeholder) input.placeholder = placeholder;
      if (required) input.required = true;
      if (pattern) input.pattern = pattern;
      if (disabled !== undefined) input.disabled = disabled;
      if (min !== undefined) input.min = min;
      if (max !== undefined) input.max = max;
      if (value) input.value = value;
      
      const check = document.createElement('i');
      check.className = 'bi bi-check-circle-fill registration-input-check';
      
      const error = document.createElement('div');
      error.className = 'registration-error';
      error.id = `${id}-error`;
      
      wrapper.appendChild(input);
      wrapper.appendChild(check);
      
      group.appendChild(labelEl);
      group.appendChild(wrapper);
      if (helpText && !labelEl.querySelector('.text-muted')) {
        const help = document.createElement('div');
        help.className = 'registration-help-text';
        help.textContent = helpText;
        group.appendChild(help);
      }
      group.appendChild(error);
      
      // Validation
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        this.formData[id] = input.value;
        this.saveProgress();
        this.updateNavigationButtons();
        error.classList.remove('show');
      });
      
      return group;
    }

    createSelectGroup({ id, label, required, options, value }) {
      const group = document.createElement('div');
      group.className = 'registration-form-group';
      
      const labelEl = document.createElement('label');
      labelEl.className = 'registration-label';
      labelEl.setAttribute('for', id);
      labelEl.innerHTML = label + (required ? '<span class="required">*</span>' : '');
      
      const wrapper = document.createElement('div');
      wrapper.className = 'registration-input-wrapper';
      
      const select = document.createElement('select');
      select.id = id;
      select.name = id;
      select.className = 'registration-select';
      if (required) select.required = true;
      
      options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        if (opt.value === value) option.selected = true;
        select.appendChild(option);
      });
      
      const check = document.createElement('i');
      check.className = 'bi bi-check-circle-fill registration-input-check';
      
      const error = document.createElement('div');
      error.className = 'registration-error';
      error.id = `${id}-error`;
      
      wrapper.appendChild(select);
      wrapper.appendChild(check);
      
      group.appendChild(labelEl);
      group.appendChild(wrapper);
      group.appendChild(error);
      
      // Validation
      select.addEventListener('change', () => {
        this.formData[id] = select.value;
        this.saveProgress();
        this.validateField(select);
        this.updateNavigationButtons();
      });
      
      return group;
    }

    createCheckboxGroup({ id, label, required, checked }) {
      const group = document.createElement('div');
      group.className = 'registration-form-group';
      
      const wrapper = document.createElement('div');
      wrapper.className = 'registration-checkbox-wrapper';
      if (checked) wrapper.classList.add('checked');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = id;
      checkbox.name = id;
      checkbox.className = 'registration-checkbox';
      if (required) checkbox.required = true;
      if (checked) checkbox.checked = true;
      
      const labelEl = document.createElement('label');
      labelEl.className = 'registration-checkbox-label';
      labelEl.setAttribute('for', id);
      labelEl.innerHTML = label + (required ? '<span class="required">*</span>' : '');
      
      const error = document.createElement('div');
      error.className = 'registration-error';
      error.id = `${id}-error`;
      
      wrapper.appendChild(checkbox);
      wrapper.appendChild(labelEl);
      
      group.appendChild(wrapper);
      group.appendChild(error);
      
      // Toggle checked class
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          wrapper.classList.add('checked');
        } else {
          wrapper.classList.remove('checked');
        }
        this.formData[id] = checkbox.checked;
        this.saveProgress();
        this.validateField(checkbox);
        this.updateNavigationButtons();
      });
      
      return group;
    }

    validateField(field) {
      const errorEl = document.getElementById(`${field.id}-error`);
      if (!errorEl) return true;
      
      let isValid = true;
      let errorMessage = '';
      
      if (field.required && !field.value && !field.checked) {
        isValid = false;
        errorMessage = 'Bu alan zorunludur';
      } else if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
          isValid = false;
          errorMessage = 'Geçerli bir telefon numarası giriniz (10-11 hane)';
        }
      }
      
      if (isValid) {
        errorEl.classList.remove('show');
        field.setCustomValidity('');
      } else {
        errorEl.textContent = errorMessage;
        errorEl.classList.add('show');
        field.setCustomValidity(errorMessage);
      }
      
      return isValid;
    }

    validateCurrentStep() {
      const step = this.steps[this.currentStep];
      if (!step || step.id === 'success') return true;
      
      const container = this.elements.contentContainer;
      const fields = container.querySelectorAll('input[required], select[required], input[type="checkbox"][required]');
      
      let allValid = true;
      fields.forEach(field => {
        if (!this.validateField(field)) {
          allValid = false;
        }
      });
      
      return allValid;
    }

    prevStep() {
      if (this.currentStep > 0) {
        this.showTransition(() => {
          this.currentStep--;
          this.renderStep();
          this.updateProgress();
        });
      }
    }

    nextStep() {
      if (!this.validateCurrentStep()) {
        return;
      }
      
      // Save current step data
      this.saveStepData();
      
      if (this.currentStep < this.totalSteps - 1) {
        this.showTransition(() => {
          this.currentStep++;
          this.renderStep();
          this.updateProgress();
        });
      } else {
        this.completeRegistration();
      }
    }

    saveStepData() {
      const container = this.elements.contentContainer;
      const inputs = container.querySelectorAll('input, select');
      inputs.forEach(input => {
        if (input.type === 'checkbox') {
          this.formData[input.id] = input.checked;
        } else {
          this.formData[input.id] = input.value;
        }
      });
      this.saveProgress();
    }

    showTransition(callback) {
      this.elements.stepContainer.classList.add('fade-out');
      this.elements.contentContainer.classList.add('fade-out');
      this.elements.loadingOverlay.classList.add('active');
      
      setTimeout(() => {
        callback();
        this.elements.stepContainer.classList.remove('fade-out');
        this.elements.contentContainer.classList.remove('fade-out');
        this.elements.loadingOverlay.classList.remove('active');
      }, 300);
    }

    updateProgress() {
      const progress = ((this.currentStep + 1) / this.totalSteps) * 100;
      this.elements.progressBarFill.style.width = `${progress}%`;
      this.elements.currentStep.textContent = this.currentStep + 1;
    }

    updateNavigationButtons() {
      // Back button
      this.elements.btnBack.disabled = this.currentStep === 0;
      
      // Next button
      const isValid = this.validateCurrentStep();
      this.elements.btnNext.disabled = !isValid;
      
      // Update next button text
      if (this.currentStep === this.totalSteps - 1) {
        this.elements.btnNext.innerHTML = '<span>Tamamla</span> <i class="bi bi-check-circle"></i>';
      } else {
        this.elements.btnNext.innerHTML = '<span>Devam Et</span> <i class="bi bi-arrow-right"></i>';
      }
    }

    setupStepHandlers() {
      // Auto-validate on input
      const container = this.elements.contentContainer;
      const inputs = container.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          this.saveStepData();
          this.updateNavigationButtons();
        });
        input.addEventListener('change', () => {
          this.saveStepData();
          this.updateNavigationButtons();
        });
      });
    }

    saveProgress() {
      const data = {
        formData: this.formData,
        currentStep: this.currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem('registration_page_progress', JSON.stringify(data));
    }

    loadProgress() {
      const saved = localStorage.getItem('registration_page_progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.formData = data.formData || {};
          
          if (data.currentStep !== undefined && data.currentStep < this.totalSteps && data.currentStep > 0) {
            showConfirmModal({
              title: 'Kaydedilmiş ilerlemeniz var',
              description: 'Devam etmek ister misiniz?',
              primaryText: 'Devam Et',
              secondaryText: 'Sıfırla'
            }).then((confirmed) => {
              if (confirmed) {
                this.currentStep = data.currentStep;
                this.renderStep();
                this.updateProgress();
              } else {
                localStorage.removeItem('registration_page_progress');
                this.formData = {};
                this.currentStep = 0;
                this.renderStep();
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

    completeRegistration() {
      // Save final data
      this.saveStepData();
      
      // Clear saved progress
      localStorage.removeItem('registration_page_progress');
      
      // Show success step
      this.renderStep();
      this.updateProgress();
      
      // Optional: Submit to backend
      // this.submitToBackend();
    }

    submitToBackend() {
      // TODO: Implement backend submission
      console.log('Submitting registration data:', this.formData);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new RegistrationPageController();
    });
  } else {
    new RegistrationPageController();
  }
})();

