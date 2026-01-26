



(function() {
  'use strict';

  
  const API_BASE = '/api/survey';

  
  async function submitProfileSurvey(data) {
    
    await new Promise(resolve => setTimeout(resolve, 500));

    
    console.log('Profile Survey Submission:', {
      timestamp: new Date().toISOString(),
      data: data
    });

    
    return {
      success: true,
      message: 'Profil anketi başarıyla kaydedildi',
      data: {
        profileId: 'profile_' + Date.now(),
        completedAt: new Date().toISOString()
      }
    };
  }

  
  async function submitDisasterSurvey(data) {
    
    await new Promise(resolve => setTimeout(resolve, 500));

    
    console.log('Disaster Survey Submission:', {
      timestamp: new Date().toISOString(),
      data: data
    });

    
    return {
      success: true,
      message: 'Afet görüşleri anketi başarıyla kaydedildi',
      data: {
        surveyId: 'disaster_' + Date.now(),
        completedAt: new Date().toISOString()
      }
    };
  }

  
  window.mockAPI = {
    submitProfileSurvey,
    submitDisasterSurvey
  };

  
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    
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

    
    return originalFetch.apply(this, arguments);
  };

})();

