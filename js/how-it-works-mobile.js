

(function() {
  'use strict';

  
  function isMobile() {
    return window.innerWidth <= 768;
  }

  
  function toggleMobileView() {
    const steps = document.querySelectorAll('.how-it-works-step');
    const isMobileView = isMobile();

    steps.forEach((step, index) => {
      if (isMobileView) {
        
        step.style.display = 'block';
        if (index === 0 && !step.classList.contains('active')) {
          step.classList.add('active');
        }
      } else {
        
        step.style.display = '';
        const body = step.querySelector('.form-card-body-premium');
        if (body) {
          body.style.maxHeight = '';
          body.style.padding = '';
          body.style.opacity = '';
        }
      }
    });
  }

  
  function initMobileAccordion() {
    if (!isMobile()) {
      toggleMobileView();
      return;
    }

    const stepHeaders = document.querySelectorAll('.form-card-header-premium');
    const steps = document.querySelectorAll('.how-it-works-step');

    
    steps.forEach((step, index) => {
      step.style.display = 'block';
      if (index === 0) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    stepHeaders.forEach((header, index) => {
      const step = steps[index];
      if (!step) return;

      
      const newHeader = header.cloneNode(true);
      header.parentNode.replaceChild(newHeader, header);
      
      
      newHeader.style.cursor = 'pointer';
      
      
      newHeader.addEventListener('click', function(e) {
        
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
          return;
        }

        const isActive = step.classList.contains('active');
        
        
        steps.forEach(s => s.classList.remove('active'));
        
        
        if (!isActive) {
          step.classList.add('active');
          
          setTimeout(() => {
            step.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
        
        
        const chevrons = document.querySelectorAll('.accordion-chevron-mobile');
        chevrons.forEach((chev, idx) => {
          if (idx === index && !isActive) {
            chev.style.transform = 'rotate(180deg)';
          } else {
            chev.style.transform = 'rotate(0deg)';
          }
        });
      });
    });

    
    if (steps.length > 0) {
      steps[0].classList.add('active');
    }
  }

  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initMobileAccordion();
      toggleMobileView();
    });
  } else {
    initMobileAccordion();
    toggleMobileView();
  }

  
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      toggleMobileView();
      if (isMobile()) {
        initMobileAccordion();
      }
    }, 250);
  });
})();

