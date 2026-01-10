// ================= How It Works Step-Based Form Management =====================

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

    // Initialize stepper visual states
    initializeStepper: function() {
      const stepper = document.getElementById('how-it-works-stepper');
      if (!stepper) return;

      const isDesktop = window.innerWidth >= 1024;

      // Set initial states
      this.updateStepperState(1);
      
      // Show only step 1 initially
      if (isDesktop) {
        // Desktop: Show all step headers, but only step 1 body expanded
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
        // Mobile: Show only step 1
        this.showStep(1);
      }
    },

    // Update stepper visual states (active, completed, pending)
    updateStepperState: function(activeStep) {
      const stepper = document.getElementById('how-it-works-stepper');
      if (!stepper) return;

      const items = stepper.querySelectorAll('.stepper-item-premium');
      
      items.forEach((item, index) => {
        const stepNum = index + 1;
        const circle = item.querySelector('.stepper-circle-premium');
        const number = item.querySelector('.stepper-number-premium');
        const check = item.querySelector('.stepper-check');
        
        // Remove all state classes
        item.classList.remove('active', 'completed', 'pending');
        circle.classList.remove('active', 'completed', 'pending');
        
        if (stepNum < activeStep) {
          // Completed step
          item.classList.add('completed');
          circle.classList.add('completed');
          number.style.display = 'none';
          if (check) check.style.display = 'block';
        } else if (stepNum === activeStep) {
          // Active step
          item.classList.add('active');
          circle.classList.add('active');
          number.style.display = 'block';
          if (check) check.style.display = 'none';
        } else {
          // Pending step
          item.classList.add('pending');
          circle.classList.add('pending');
          number.style.display = 'block';
          if (check) check.style.display = 'none';
        }
      });
    },

    // Show specific step, hide others
    showStep: function(stepNum) {
      const isDesktop = window.innerWidth >= 1024;
      
      // Hide all steps
      const allSteps = document.querySelectorAll('.how-it-works-step[data-step]');
      allSteps.forEach(step => {
        if (isDesktop) {
          // Desktop: Use accordion (only one visible)
          step.classList.remove('active');
        } else {
          // Mobile: Use display none/block
          step.style.display = 'none';
          step.classList.remove('active');
        }
      });

      // Show requested step
      const targetStep = document.getElementById(`how-it-works-step-${stepNum}`);
      if (targetStep) {
        if (isDesktop) {
          // Desktop: Use active class for accordion
          targetStep.classList.add('active');
        } else {
          // Mobile: Use display block
          targetStep.style.display = 'block';
          targetStep.classList.add('active');
        }
        
        // Scroll to step smoothly (only on desktop, mobile handles its own)
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

    // Complete current step and move to next
    completeStep: function(stepNum) {
      // Mark current step as completed
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

      // Move to next step if available
      if (stepNum < this.totalSteps) {
        setTimeout(() => {
          this.showStep(stepNum + 1);
        }, 500);
      } else {
        // All steps completed - show success section and optional section
        this.showSuccessSection();
        this.showOptionalSection();
      }
    },

    // Show success section (QR code, app download)
    showSuccessSection: function() {
      const successSection = document.getElementById('registration-success-section');
      if (successSection) {
        successSection.style.display = 'block';
        setTimeout(() => {
          successSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
      }
    },

    // Show optional "Afet Görüşlerini Paylaş" section
    showOptionalSection: function() {
      const optionalSection = document.getElementById('how-it-works-optional');
      if (optionalSection) {
        optionalSection.style.display = 'block';
        setTimeout(() => {
          optionalSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
      }
    },

    // Setup form submission handlers
    setupFormHandlers: function() {
      const isDesktop = window.innerWidth >= 1024;
      
      // Desktop: Make step headers clickable for accordion
      if (isDesktop) {
        this.setupDesktopAccordion();
      }

      // Step 1 form
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

      // Step 2 form
      const form2 = document.getElementById('how-it-works-form-2');
      if (form2) {
        form2.addEventListener('submit', (e) => {
          e.preventDefault();
          if (this.validateForm(form2)) {
            this.saveStepData(2, new FormData(form2));
            this.completeStep(2);
          }
        });

        // Enable/disable submit button based on form validity
        const citySelect = document.getElementById('hiw-city');
        if (citySelect) {
          citySelect.addEventListener('change', () => {
            this.validateStep2();
          });
        }

        // Validate on all form inputs
        const formInputs = form2.querySelectorAll('input, select');
        formInputs.forEach(input => {
          input.addEventListener('input', () => {
            this.validateStep2();
          });
          input.addEventListener('change', () => {
            this.validateStep2();
          });
        });

        // Back button
        const backBtn = document.getElementById('hiw-step2-back');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            this.goToStep(1);
          });
        }
      }

      // Step 3 - no form, just completion
      // Optional section handlers
      const startSurveyBtn = document.getElementById('hiw-start-survey');
      if (startSurveyBtn) {
        startSurveyBtn.addEventListener('click', () => {
          // Navigate to survey section
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

    // Validate form
    validateForm: function(form) {
      return form.checkValidity();
    },

    // Validate step 2 (city selection enables district/neighborhood)
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

      // Enable submit button if form is valid
      if (submitBtn && form2) {
        submitBtn.disabled = !form2.checkValidity();
      }
    },

    // Save step data to localStorage
    saveStepData: function(stepNum, formData) {
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      localStorage.setItem(`registration_step${stepNum}`, JSON.stringify(data));
      
      // Update user progress
      if (window.userProgress) {
        if (stepNum === 2) {
          window.userProgress.setRegistered(true);
        }
      }
    },

    // Load saved progress (without scrolling)
    loadSavedProgress: function() {
      // Check if step 2 is completed
      const step2Data = localStorage.getItem('registration_step2');
      if (step2Data) {
        try {
          const data = JSON.parse(step2Data);
          // Restore form values
          if (data.city) {
            const citySelect = document.getElementById('hiw-city');
            if (citySelect) {
              citySelect.value = data.city;
              this.validateStep2();
            }
          }
          // If step 2 is completed, show step 3 (without scrolling)
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
    
    // Show step without scrolling (for initial page load)
    showStepWithoutScroll: function(stepNum) {
      const isDesktop = window.innerWidth >= 1024;
      
      // Hide all steps
      const allSteps = document.querySelectorAll('.how-it-works-step[data-step]');
      allSteps.forEach(step => {
        if (isDesktop) {
          // Desktop: Use accordion (only one visible)
          step.classList.remove('active');
        } else {
          // Mobile: Use display none/block
          step.style.display = 'none';
          step.classList.remove('active');
        }
      });

      // Show requested step
      const targetStep = document.getElementById(`how-it-works-step-${stepNum}`);
      if (targetStep) {
        if (isDesktop) {
          // Desktop: Use active class for accordion
          targetStep.classList.add('active');
        } else {
          // Mobile: Use display block
          targetStep.style.display = 'block';
          targetStep.classList.add('active');
        }
      }

      this.currentStep = stepNum;
      this.updateStepperState(stepNum);
    },

    // Public method to go to specific step (for back button)
    goToStep: function(stepNum) {
      if (stepNum >= 1 && stepNum <= this.totalSteps) {
        this.showStep(stepNum);
      }
    },

    // Setup desktop accordion behavior
    setupDesktopAccordion: function() {
      const stepHeaders = document.querySelectorAll('.form-card-header-premium');
      
      stepHeaders.forEach((header) => {
        const step = header.closest('.how-it-works-step');
        if (!step) return;

        // Make header clickable
        header.style.cursor = 'pointer';
        
        header.addEventListener('click', (e) => {
          // Don't trigger if clicking on form elements
          if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
            return;
          }

          const stepNum = parseInt(step.getAttribute('data-step'));
          const isActive = step.classList.contains('active');
          
          // Only allow opening if step is accessible (previous steps completed)
          if (!isActive && stepNum > this.currentStep) {
            return; // Can't jump ahead
          }

          // Toggle step
          if (!isActive) {
            // Close all steps
            document.querySelectorAll('.how-it-works-step').forEach(s => {
              s.classList.remove('active');
            });
            // Open clicked step
            step.classList.add('active');
            this.currentStep = stepNum;
            this.updateStepperState(stepNum);
            
            // Scroll to step
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

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      HowItWorksSteps.init();
    });
  } else {
    HowItWorksSteps.init();
  }

  // Export to global scope
  window.howItWorks = HowItWorksSteps;
})();

