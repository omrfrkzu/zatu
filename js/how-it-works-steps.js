

(function() {
  'use strict';

  const HowItWorksSteps = {
    currentStep: 1,
    totalSteps: 3,
    
    init: function() {
      this.setupFormHandlers();
      this.initializeStepper();
      this.loadSavedProgress();
    },

    
    initializeStepper: function() {
      const stepper = document.getElementById('how-it-works-stepper');
      if (!stepper) return;

      const isDesktop = window.innerWidth >= 1024;

      
      this.updateStepperState(1);
      
      
      if (isDesktop) {
        
        const allSteps = document.querySelectorAll('.how-it-works-step[data-step]');
        allSteps.forEach((step, index) => {
          if (index === 0) {
            step.classList.add('active');
          } else {
            step.classList.remove('active');
          }
        });
        this.currentStep = 1;
      } else {
        
        this.showStep(1);
      }
    },

    
    updateStepperState: function(activeStep) {
      const stepper = document.getElementById('how-it-works-stepper');
      if (!stepper) return;

      const items = stepper.querySelectorAll('.stepper-item-premium');
      
      items.forEach((item, index) => {
        const stepNum = index + 1;
        const circle = item.querySelector('.stepper-circle-premium');
        const number = item.querySelector('.stepper-number-premium');
        const check = item.querySelector('.stepper-check');
        
        
        item.classList.remove('active', 'completed', 'pending');
        circle.classList.remove('active', 'completed', 'pending');
        
        if (stepNum < activeStep) {
          
          item.classList.add('completed');
          circle.classList.add('completed');
          number.style.display = 'none';
          if (check) check.style.display = 'block';
        } else if (stepNum === activeStep) {
          
          item.classList.add('active');
          circle.classList.add('active');
          number.style.display = 'block';
          if (check) check.style.display = 'none';
        } else {
          
          item.classList.add('pending');
          circle.classList.add('pending');
          number.style.display = 'block';
          if (check) check.style.display = 'none';
        }
      });
    },

    
    showStep: function(stepNum) {
      const isDesktop = window.innerWidth >= 1024;
      
      
      const allSteps = document.querySelectorAll('.how-it-works-step[data-step]');
      allSteps.forEach(step => {
        if (isDesktop) {
          
          step.classList.remove('active');
        } else {
          
          step.style.display = 'none';
          step.classList.remove('active');
        }
      });

      
      const targetStep = document.getElementById(`how-it-works-step-${stepNum}`);
      if (targetStep) {
        if (isDesktop) {
          
          targetStep.classList.add('active');
        } else {
          
          targetStep.style.display = 'block';
          targetStep.classList.add('active');
        }
        
        
        if (isDesktop) {
          setTimeout(() => {
            const formCard = targetStep.closest('.form-card-premium');
            if (formCard) {
              formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        } else {
          setTimeout(() => {
            targetStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      }

      this.currentStep = stepNum;
      this.updateStepperState(stepNum);
    },

    
    completeStep: function(stepNum) {
      
      const stepper = document.getElementById('how-it-works-stepper');
      if (!stepper) return;

      const item = stepper.querySelector(`.stepper-item-premium[data-step="${stepNum}"]`);
      if (item) {
        item.classList.add('completed');
        item.classList.remove('active');
        const circle = item.querySelector('.stepper-circle-premium');
        const number = item.querySelector('.stepper-number-premium');
        const check = item.querySelector('.stepper-check');
        
        if (circle) {
          circle.classList.add('completed');
          circle.classList.remove('active');
        }
        if (number) number.style.display = 'none';
        if (check) check.style.display = 'block';
      }

      
      if (stepNum < this.totalSteps) {
        setTimeout(() => {
          this.showStep(stepNum + 1);
        }, 500);
      } else {
        
        this.showSuccessSection();
        this.showOptionalSection();
      }
    },

    
    showSuccessSection: function() {
      const successSection = document.getElementById('registration-success-section');
      if (successSection) {
        successSection.style.display = 'block';
        setTimeout(() => {
          successSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
      }
    },

    
    showOptionalSection: function() {
      const optionalSection = document.getElementById('how-it-works-optional');
      if (optionalSection) {
        optionalSection.style.display = 'block';
        setTimeout(() => {
          optionalSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
      }
    },

    
    setupFormHandlers: function() {
      const isDesktop = window.innerWidth >= 1024;
      
      
      if (isDesktop) {
        this.setupDesktopAccordion();
      }

      
      const form1 = document.getElementById('how-it-works-form-1');
      if (form1) {
        form1.addEventListener('submit', (e) => {
          e.preventDefault();
          if (this.validateForm(form1)) {
            this.saveStepData(1, new FormData(form1));
            this.completeStep(1);
          }
        });
      }

      
      const form2 = document.getElementById('how-it-works-form-2');
      if (form2) {
        form2.addEventListener('submit', (e) => {
          e.preventDefault();
          if (this.validateForm(form2)) {
            this.saveStepData(2, new FormData(form2));
            this.completeStep(2);
          }
        });

        
        const citySelect = document.getElementById('hiw-city');
        if (citySelect) {
          citySelect.addEventListener('change', () => {
            this.validateStep2();
          });
        }

        
        const formInputs = form2.querySelectorAll('input, select');
        formInputs.forEach(input => {
          input.addEventListener('input', () => {
            this.validateStep2();
          });
          input.addEventListener('change', () => {
            this.validateStep2();
          });
        });

        
        const backBtn = document.getElementById('hiw-step2-back');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            this.goToStep(1);
          });
        }
      }

      
      
      const startSurveyBtn = document.getElementById('hiw-start-survey');
      if (startSurveyBtn) {
        startSurveyBtn.addEventListener('click', () => {
          
          const surveySection = document.getElementById('afet-anketi');
          if (surveySection) {
            surveySection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }

      const skipSurveyBtn = document.getElementById('hiw-skip-survey');
      if (skipSurveyBtn) {
        skipSurveyBtn.addEventListener('click', () => {
          const optionalSection = document.getElementById('how-it-works-optional');
          if (optionalSection) {
            optionalSection.style.display = 'none';
          }
        });
      }
    },

    
    validateForm: function(form) {
      return form.checkValidity();
    },

    
    validateStep2: function() {
      const citySelect = document.getElementById('hiw-city');
      const districtInput = document.getElementById('hiw-district');
      const neighborhoodInput = document.getElementById('hiw-neighborhood');
      const submitBtn = document.getElementById('hiw-step2-submit');
      const form2 = document.getElementById('how-it-works-form-2');

      if (citySelect && citySelect.value) {
        if (districtInput) districtInput.disabled = false;
        if (neighborhoodInput) neighborhoodInput.disabled = false;
      } else {
        if (districtInput) {
          districtInput.disabled = true;
          districtInput.value = '';
        }
        if (neighborhoodInput) {
          neighborhoodInput.disabled = true;
          neighborhoodInput.value = '';
        }
      }

      
      if (submitBtn && form2) {
        submitBtn.disabled = !form2.checkValidity();
      }
    },

    
    saveStepData: function(stepNum, formData) {
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      localStorage.setItem(`registration_step${stepNum}`, JSON.stringify(data));
      
      
      if (window.userProgress) {
        if (stepNum === 2) {
          window.userProgress.setRegistered(true);
        }
      }
    },

    
    loadSavedProgress: function() {
      
      const step2Data = localStorage.getItem('registration_step2');
      if (step2Data) {
        try {
          const data = JSON.parse(step2Data);
          
          if (data.city) {
            const citySelect = document.getElementById('hiw-city');
            if (citySelect) {
              citySelect.value = data.city;
              this.validateStep2();
            }
          }
          
          if (data.city && data.district && data.neighborhood && data.buildingAge && data.floor) {
            this.completeStep(1);
            this.completeStep(2);
            this.showStepWithoutScroll(3);
          } else if (data.city) {
            this.completeStep(1);
            this.showStepWithoutScroll(2);
          }
        } catch (e) {
          console.error('Error loading saved progress:', e);
        }
      }
    },
    
    
    showStepWithoutScroll: function(stepNum) {
      const isDesktop = window.innerWidth >= 1024;
      
      
      const allSteps = document.querySelectorAll('.how-it-works-step[data-step]');
      allSteps.forEach(step => {
        if (isDesktop) {
          
          step.classList.remove('active');
        } else {
          
          step.style.display = 'none';
          step.classList.remove('active');
        }
      });

      
      const targetStep = document.getElementById(`how-it-works-step-${stepNum}`);
      if (targetStep) {
        if (isDesktop) {
          
          targetStep.classList.add('active');
        } else {
          
          targetStep.style.display = 'block';
          targetStep.classList.add('active');
        }
      }

      this.currentStep = stepNum;
      this.updateStepperState(stepNum);
    },

    
    goToStep: function(stepNum) {
      if (stepNum >= 1 && stepNum <= this.totalSteps) {
        this.showStep(stepNum);
      }
    },

    
    setupDesktopAccordion: function() {
      const stepHeaders = document.querySelectorAll('.form-card-header-premium');
      
      stepHeaders.forEach((header) => {
        const step = header.closest('.how-it-works-step');
        if (!step) return;

        
        header.style.cursor = 'pointer';
        
        header.addEventListener('click', (e) => {
          
          if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
            return;
          }

          const stepNum = parseInt(step.getAttribute('data-step'));
          const isActive = step.classList.contains('active');
          
          
          if (!isActive && stepNum > this.currentStep) {
            return; 
          }

          
          if (!isActive) {
            
            document.querySelectorAll('.how-it-works-step').forEach(s => {
              s.classList.remove('active');
            });
            
            step.classList.add('active');
            this.currentStep = stepNum;
            this.updateStepperState(stepNum);
            
            
            setTimeout(() => {
              const formCard = step.closest('.form-card-premium');
              if (formCard) {
                formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          }
        });
      });
    }
  };

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      HowItWorksSteps.init();
    });
  } else {
    HowItWorksSteps.init();
  }

  
  window.howItWorks = HowItWorksSteps;
})();

