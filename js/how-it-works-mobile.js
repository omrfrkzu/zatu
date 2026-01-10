// ================= Mobile Accordion for How It Works Section =====================

(function() {
  'use strict';

  // Check if mobile view
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Show all steps on desktop, accordion on mobile
  function toggleMobileView() {
    const steps = document.querySelectorAll('.how-it-works-step');
    const isMobileView = isMobile();

    steps.forEach((step, index) => {
      if (isMobileView) {
        // Mobile: Show all steps but only active one is expanded
        step.style.display = 'block';
        if (index === 0 && !step.classList.contains('active')) {
          step.classList.add('active');
        }
      } else {
        // Desktop: Show all steps normally
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

  // Initialize mobile accordion
  function initMobileAccordion() {
    if (!isMobile()) {
      toggleMobileView();
      return;
    }

    const stepHeaders = document.querySelectorAll('.form-card-header-premium');
    const steps = document.querySelectorAll('.how-it-works-step');

    // Show all steps but only first one active
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

      // Remove existing listeners to avoid duplicates
      const newHeader = header.cloneNode(true);
      header.parentNode.replaceChild(newHeader, header);
      
      // Make header clickable
      newHeader.style.cursor = 'pointer';
      
      // Add click handler
      newHeader.addEventListener('click', function(e) {
        // Don't trigger if clicking on form elements or buttons
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
          return;
        }

        const isActive = step.classList.contains('active');
        
        // Close all steps
        steps.forEach(s => s.classList.remove('active'));
        
        // Open clicked step if it wasn't active
        if (!isActive) {
          step.classList.add('active');
          // Scroll to step smoothly
          setTimeout(() => {
            step.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
        
        // Update chevron icons
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

    // Ensure step 1 is open by default
    if (steps.length > 0) {
      steps[0].classList.add('active');
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initMobileAccordion();
      toggleMobileView();
    });
  } else {
    initMobileAccordion();
    toggleMobileView();
  }

  // Re-initialize on resize (if switching between mobile/desktop)
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

