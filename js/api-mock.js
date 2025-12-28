// ================= Mock API Handlers =====================
// These simulate API endpoints for survey submissions
// In production, replace with actual backend endpoints

(function() {
  'use strict';

  // Mock API base URL (in production, replace with actual API URL)
  const API_BASE = '/api/survey';

  /**
   * Mock API handler for profile survey submission
   * @param {Object} data - Survey answers
   * @returns {Promise<Object>} Mock response
   */
  async function submitProfileSurvey(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Log submission (in production, this would be sent to backend)
    console.log('Profile Survey Submission:', {
      timestamp: new Date().toISOString(),
      data: data
    });

    // Mock successful response
    return {
      success: true,
      message: 'Profil anketi başarıyla kaydedildi',
      data: {
        profileId: 'profile_' + Date.now(),
        completedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Mock API handler for disaster survey submission
   * @param {Object} data - Survey answers
   * @returns {Promise<Object>} Mock response
   */
  async function submitDisasterSurvey(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Log submission (in production, this would be sent to backend)
    console.log('Disaster Survey Submission:', {
      timestamp: new Date().toISOString(),
      data: data
    });

    // Mock successful response
    return {
      success: true,
      message: 'Afet görüşleri anketi başarıyla kaydedildi',
      data: {
        surveyId: 'disaster_' + Date.now(),
        completedAt: new Date().toISOString()
      }
    };
  }

  // Expose functions globally
  window.mockAPI = {
    submitProfileSurvey,
    submitDisasterSurvey
  };

  // Intercept fetch calls to /api/survey/* if needed
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    // Check if it's a survey API call
    if (url.includes('/api/survey/profile') && options && options.method === 'POST') {
      try {
        const body = JSON.parse(options.body);
        const response = await submitProfileSurvey(body);
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.includes('/api/survey/disaster') && options && options.method === 'POST') {
      try {
        const body = JSON.parse(options.body);
        const response = await submitDisasterSurvey(body);
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // For all other requests, use original fetch
    return originalFetch.apply(this, arguments);
  };

})();

