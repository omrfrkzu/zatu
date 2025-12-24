// ================= Profile Survey Component =====================
class ProfileSurvey {
  constructor() {
    this.currentQuestion = 0;
    this.answers = {};
    this.userName = '';
    this.userBirthDate = null;
    this.totalQuestions = 5;
    this.completed = localStorage.getItem('profile_completed') === 'true';
    
    this.questions = [
      {
        id: 'age',
        title: 'Yaş Grubu',
        description: 'Doğum tarihinizden yaşınız otomatik hesaplanacak.',
        type: 'date',
        field: 'birthDate'
      },
      {
        id: 'location',
        title: 'Yaşadığın Yer',
        description: 'Afet sadece doğa olayı değildir, bulunduğun yerle ve yaptığın seçimlerle şekillenir.',
        type: 'location',
        fields: ['city', 'district']
      },
      {
        id: 'buildingAge',
        title: 'Binanın Yaşı',
        description: 'Yaşadığın binanın yaşı risk analizi için önemlidir.',
        type: 'select',
        options: ['0-10 yıl', '10-20 yıl', '20+ yıl'],
        field: 'buildingAge'
      },
      {
        id: 'feeling',
        title: 'Yaşadığın yerle ilgili duygun',
        description: 'Afet konusunda nasıl hissediyorsun?',
        type: 'select',
        options: [
          'Güvende hissediyorum',
          'Bazen tedirgin oluyorum',
          'Sürekli risk altında hissediyorum',
          'Hiç düşünmemeye çalışıyorum'
        ],
        field: 'feeling'
      },
      {
        id: 'floor',
        title: 'Kat Bilgisi',
        description: 'Ev/çalıştığın yer kaçıncı katta?',
        type: 'select',
        options: ['Zemin', '1. Kat', '2-3 Kat', '4+ Kat'],
        field: 'floor'
      }
    ];

    this.init();
  }

  init() {
    if (this.completed) {
      this.hideSection();
      return;
    }

    // Load saved data
    const savedData = localStorage.getItem('profile_survey_data');
    if (savedData) {
      this.answers = JSON.parse(savedData);
      this.currentQuestion = Object.keys(this.answers).length;
    }

    this.render();
  }

  hideSection() {
    const section = document.getElementById('profile-survey-section');
    if (section) {
      section.style.display = 'none';
    }
  }

  calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  getAgeMessage(age, name) {
    if (age < 26) {
      return `Gençsin ${name}, ama afet konusunda düşünmen çok değerli.`;
    } else if (age >= 26 && age <= 35) {
      return `${name}, yaşın ${age}. Geleceğin için şimdiden hazırlanıyorsun.`;
    } else {
      return `${name}, deneyimin bu ağ için çok önemli. Bilginle destek oluyorsun.`;
    }
  }

  getLocationMessage(city, cityCount = 0) {
    return `${city} artık bu ağın bir parçası. Bu şehirde şu anda ${cityCount} kişi kayıtlı.`;
  }

  getBuildingAgeMessage(answer) {
    let riskLevel = 'düşük';
    if (answer === '20+ yıl') {
      riskLevel = 'yüksek';
    } else if (answer === '10-20 yıl') {
      riskLevel = 'orta';
    }
    return `Yaşadığın bina ${answer} yaşında, bu da ${riskLevel} risk grubuna giriyor.`;
  }

  getFeelingMessage(answer, name) {
    const messages = {
      'Güvende hissediyorum': `${name}, kendini güvende hissetmen çok değerli. Bu ağı birlikte güçlendirelim.`,
      'Bazen tedirgin oluyorum': `${name}, küçük endişelerin çok insani. Bu ağ tam da bu duyguyu paylaşman için var.`,
      'Sürekli risk altında hissediyorum': `${name}, kaygılarını anlıyoruz. Artık yalnız değilsin, bu ağ senin yanında.`,
      'Hiç düşünmemeye çalışıyorum': `${name}, korktuğun şeyi görmezden gelmen çok insani. Bugün düşünmekle doğru adımı attın.`
    };
    return messages[answer] || '';
  }

  getFloorMessage(answer) {
    if (answer === '4+ Kat') {
      return 'Yüksek katlar afet riskini artırabilir, hazırlıklı olmanı öneriyoruz.';
    }
    return 'Kat bilgin not edildi. Bu bilgi analizde değerlendirilecek.';
  }

  getFinalMessage() {
    const name = this.userName || 'Kullanıcı';
    const location = this.answers.city && this.answers.district 
      ? `${this.answers.district}, ${this.answers.city}` 
      : 'şehrinde';
    const buildingAge = this.answers.buildingAge || 'bilinmeyen';
    const floor = this.answers.floor || 'bilinmeyen';

    return `
      <p><strong>${name}</strong>, gününün çoğunu <strong>${location}</strong>'da geçiriyorsun.</p>
      <p>Yaklaşık <strong>${buildingAge}</strong> yıllık bir binada, <strong>${floor}</strong> katta yaşıyorsun.</p>
      <p>Bu bilgiler, senin için doğru afet önerileri oluşturmamızı sağlıyor.</p>
    `;
  }

  render() {
    const container = document.getElementById('profile-questions');
    if (!container) return;

    if (this.currentQuestion >= this.totalQuestions) {
      this.showResult();
      return;
    }

    const question = this.questions[this.currentQuestion];
    container.innerHTML = this.renderQuestion(question);
    this.updateProgress();
  }

  renderQuestion(question) {
    let html = `<div class="survey-question-card mb-4">`;
    html += `<h3 class="mb-3">${question.title}</h3>`;
    if (question.description) {
      html += `<p class="text-muted mb-4">${question.description}</p>`;
    }

    if (question.type === 'date') {
      html += `
        <div class="mb-3">
          <label for="profile-${question.field}" class="form-label">Doğum Tarihi <span class="text-danger">*</span></label>
          <input type="date" class="form-control" id="profile-${question.field}" required>
        </div>
        <button type="button" class="btn btn-primary" onclick="profileSurvey.nextQuestion()">Devam Et</button>
      `;
    } else if (question.type === 'location') {
      html += `
        <div class="mb-3">
          <label for="profile-city" class="form-label">İl <span class="text-danger">*</span></label>
          <select class="form-select" id="profile-city" required>
            <option value="">İl seçiniz</option>
            <option value="Adana">Adana</option>
            <option value="Ankara">Ankara</option>
            <option value="Antalya">Antalya</option>
            <option value="İstanbul">İstanbul</option>
            <option value="İzmir">İzmir</option>
            <option value="Bursa">Bursa</option>
            <option value="Eskişehir">Eskişehir</option>
            <option value="Sivas">Sivas</option>
            <option value="Gaziantep">Gaziantep</option>
            <option value="Trabzon">Trabzon</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="profile-district" class="form-label">İlçe <span class="text-danger">*</span></label>
          <input type="text" class="form-control" id="profile-district" required placeholder="İlçe adınız">
        </div>
        <button type="button" class="btn btn-primary" onclick="profileSurvey.nextQuestion()">Devam Et</button>
      `;
    } else if (question.type === 'select') {
      html += `<div class="mb-3">`;
      question.options.forEach((option, index) => {
        html += `
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="profile-${question.field}" id="profile-${question.field}-${index}" value="${option}" required>
            <label class="form-check-label" for="profile-${question.field}-${index}">${option}</label>
          </div>
        `;
      });
      html += `</div>`;
      html += `<button type="button" class="btn btn-primary" onclick="profileSurvey.nextQuestion()">Devam Et</button>`;
    }

    html += `</div>`;
    return html;
  }

  nextQuestion() {
    const question = this.questions[this.currentQuestion];
    let answer = null;
    let message = '';

    if (question.type === 'date') {
      const birthDate = document.getElementById(`profile-${question.field}`).value;
      if (!birthDate) {
        alert('Lütfen doğum tarihinizi giriniz.');
        return;
      }
      this.userBirthDate = birthDate;
      const age = this.calculateAge(birthDate);
      this.answers[question.field] = birthDate;
      this.answers.age = age;
      
      // Get name from previous answer or prompt
      if (!this.userName) {
        this.userName = prompt('Lütfen adınızı giriniz:') || 'Kullanıcı';
      }
      message = this.getAgeMessage(age, this.userName);
    } else if (question.type === 'location') {
      const city = document.getElementById('profile-city').value;
      const district = document.getElementById('profile-district').value;
      if (!city || !district) {
        alert('Lütfen il ve ilçe bilgilerinizi giriniz.');
        return;
      }
      this.answers.city = city;
      this.answers.district = district;
      message = this.getLocationMessage(city, Math.floor(Math.random() * 100) + 1);
    } else if (question.type === 'select') {
      const selected = document.querySelector(`input[name="profile-${question.field}"]:checked`);
      if (!selected) {
        alert('Lütfen bir seçenek seçiniz.');
        return;
      }
      answer = selected.value;
      this.answers[question.field] = answer;

      if (question.id === 'buildingAge') {
        message = this.getBuildingAgeMessage(answer);
      } else if (question.id === 'feeling') {
        message = this.getFeelingMessage(answer, this.userName || 'Kullanıcı');
      } else if (question.id === 'floor') {
        message = this.getFloorMessage(answer);
      }
    }

    // Show message
    if (message) {
      this.showMessage(message);
    }

    // Save progress
    localStorage.setItem('profile_survey_data', JSON.stringify(this.answers));

    this.currentQuestion++;
    setTimeout(() => {
      this.render();
    }, 1500);
  }

  showMessage(message) {
    const container = document.getElementById('profile-questions');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'alert alert-info mt-3';
    messageDiv.innerHTML = `<i class="bi bi-info-circle me-2"></i>${message}`;
    container.appendChild(messageDiv);
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  updateProgress() {
    const progress = (this.currentQuestion / this.totalQuestions) * 100;
    const progressBar = document.getElementById('profile-progress-bar');
    const progressText = document.getElementById('profile-progress-text');
    
    if (progressBar) {
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', progress);
    }
    if (progressText) {
      progressText.textContent = `Soru ${this.currentQuestion}/${this.totalQuestions}`;
    }
  }

  showResult() {
    const questionsDiv = document.getElementById('profile-questions');
    const resultDiv = document.getElementById('profile-result');
    const resultContent = document.getElementById('profile-result-content');

    if (questionsDiv) questionsDiv.classList.add('d-none');
    if (resultDiv) {
      resultDiv.classList.remove('d-none');
      resultContent.innerHTML = this.getFinalMessage();
    }

    this.updateProgress();
    
    // Mark as completed
    localStorage.setItem('profile_completed', 'true');
    
    // Update user progress
    if (window.userProgress) {
      window.userProgress.setProfileCompleted(true);
    }
    
    // Send to backend
    this.submitToBackend();
    
    // Hide section after delay
    setTimeout(() => {
      this.hideSection();
    }, 5000);
  }

  async submitToBackend() {
    try {
      const response = await fetch('/api/survey/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.answers)
      });
      // Handle response if needed
    } catch (error) {
      console.log('Backend submission simulated:', this.answers);
    }
  }
}

// ================= Disaster Survey Component =====================
class DisasterSurvey {
  constructor() {
    this.currentQuestion = 0;
    this.answers = {};
    this.totalQuestions = 5;
    this.completed = localStorage.getItem('disaster_completed') === 'true';
    
    this.questions = [
      {
        id: 'trustedInstitution',
        title: 'Afet anında ilk güvendiğin kurum',
        description: 'Kriz anında hangi kuruma güveniyorsun?',
        type: 'select',
        options: ['AFAD', 'Belediye', 'Ordu', 'Gönüllüler', 'Kimse'],
        field: 'trustedInstitution'
      },
      {
        id: 'feelingAlone',
        title: 'Afet hazırlığında yalnız hissediyor musun?',
        description: 'Hazırlık konusunda kendini nasıl hissediyorsun?',
        type: 'select',
        options: ['Evet', 'Bazen', 'Hayır'],
        field: 'feelingAlone'
      },
      {
        id: 'institutionsReach',
        title: 'Kurumlar herkese yetişebilir mi?',
        description: 'Resmi kurumların herkese yetişebileceğini düşünüyor musun?',
        type: 'select',
        options: ['Evet', 'Hayır', 'Emin değilim'],
        field: 'institutionsReach'
      },
      {
        id: 'powerSource',
        title: 'Afette asıl güç kimden gelmeli?',
        description: 'Kriz anında gücün kaynağı ne olmalı?',
        type: 'select',
        options: ['Devlet', 'Devlet + Halk', 'Birey', 'Bilmiyorum'],
        field: 'powerSource'
      },
      {
        id: 'needNewSystem',
        title: 'Türkiye\'nin yeni bir sisteme ihtiyacı var mı?',
        description: 'Mevcut sistem yeterli mi, yoksa yeni bir yaklaşım gerekli mi?',
        type: 'select',
        options: ['Kesinlikle var', 'Olabilir', 'Zaten yeterli', 'Emin değilim'],
        field: 'needNewSystem'
      }
    ];

    this.init();
  }

  init() {
    if (this.completed) {
      this.hideSection();
      return;
    }

    // Load saved data
    const savedData = localStorage.getItem('disaster_survey_data');
    if (savedData) {
      this.answers = JSON.parse(savedData);
      this.currentQuestion = Object.keys(this.answers).length;
    }

    this.render();
  }

  hideSection() {
    const section = document.getElementById('disaster-survey-section');
    if (section) {
      section.style.display = 'none';
    }
  }

  getTrustedInstitutionMessage(answer) {
    const messages = {
      'AFAD': 'AFAD\'a güven duyman önemli. Zatu da AFAD\'la entegre çalışır.',
      'Belediye': 'Yerel yönetimlere güvenin güçlü bir toplum için çok önemli.',
      'Ordu': 'Orduya duyduğun güven, kriz anında dayanışmanın göstergesi.',
      'Gönüllüler': 'Gönüllülere güvenmen, toplumsal dayanışmanın kalbini temsil eder.',
      'Kimse': 'Kendine güvenmen değerli, ama birlikte daha güçlüyüz.'
    };
    return messages[answer] || '';
  }

  getFeelingAloneMessage(answer) {
    if (answer === 'Evet' || answer === 'Bazen') {
      return 'Bu duyguyu paylaşan binlerce kişi var. Yalnız değilsin.';
    }
    return 'Harika! Hazırlıklı hissetmen hem seni hem çevreni güçlendirir.';
  }

  getInstitutionsReachMessage(answer) {
    if (answer === 'Hayır' || answer === 'Emin değilim') {
      return 'Gerçekçi bir farkındalığın var. Bu ağ tam da bu boşluğu doldurmak için kuruldu.';
    }
    return 'Harika! Kurumlarla birlikte daha güçlü bir sistem kuruyoruz.';
  }

  getPowerSourceMessage(answer) {
    const messages = {
      'Devlet + Halk': 'Dayanışmaya inanman çok değerli. Gerçek güç birlikte hareket etmekte.',
      'Birey': 'Bireysel farkındalığın toplum için ilham verici.',
      'Devlet': 'Devletin rolü önemli, ama toplumsal destekle daha güçlü olabiliriz.',
      'Bilmiyorum': 'Bu konuda düşünmen bile büyük bir adım.'
    };
    return messages[answer] || '';
  }

  getNeedNewSystemMessage(answer) {
    if (answer === 'Kesinlikle var' || answer === 'Olabilir') {
      return 'Evet, Zatu tam da bu ihtiyaca cevap vermek için geliştirildi.';
    }
    return 'Farklı düşünceleri duymak değerli. Geri bildirimin sistemin gelişmesine katkı sağlar.';
  }

  getFinalMessage() {
    return `
      <p><strong>Sorulara verdiğin cevaplar arasında net bir ortak nokta var:</strong></p>
      <p>Afet anında yalnız kalmak istemiyorsun.</p>
      <p>Bu bir zayıflık değil; insan olmanın en gerçek hali.</p>
      <p><strong>Ulusal Afet Ağı tam da bu gerçeğin üzerine kuruldu.</strong></p>
    `;
  }

  render() {
    const container = document.getElementById('disaster-questions');
    if (!container) return;

    if (this.currentQuestion >= this.totalQuestions) {
      this.showResult();
      return;
    }

    const question = this.questions[this.currentQuestion];
    container.innerHTML = this.renderQuestion(question);
    this.updateProgress();
  }

  renderQuestion(question) {
    let html = `<div class="survey-question-card mb-4">`;
    html += `<h3 class="mb-3">${question.title}</h3>`;
    if (question.description) {
      html += `<p class="text-muted mb-4">${question.description}</p>`;
    }

    html += `<div class="mb-3">`;
    question.options.forEach((option, index) => {
      html += `
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="disaster-${question.field}" id="disaster-${question.field}-${index}" value="${option}" required>
          <label class="form-check-label" for="disaster-${question.field}-${index}">${option}</label>
        </div>
      `;
    });
    html += `</div>`;
    html += `<button type="button" class="btn btn-danger" onclick="disasterSurvey.nextQuestion()">Devam Et</button>`;
    html += `</div>`;
    return html;
  }

  nextQuestion() {
    const question = this.questions[this.currentQuestion];
    const selected = document.querySelector(`input[name="disaster-${question.field}"]:checked`);
    
    if (!selected) {
      alert('Lütfen bir seçenek seçiniz.');
      return;
    }

    const answer = selected.value;
    this.answers[question.field] = answer;

    let message = '';
    switch (question.id) {
      case 'trustedInstitution':
        message = this.getTrustedInstitutionMessage(answer);
        break;
      case 'feelingAlone':
        message = this.getFeelingAloneMessage(answer);
        break;
      case 'institutionsReach':
        message = this.getInstitutionsReachMessage(answer);
        break;
      case 'powerSource':
        message = this.getPowerSourceMessage(answer);
        break;
      case 'needNewSystem':
        message = this.getNeedNewSystemMessage(answer);
        break;
    }

    if (message) {
      this.showMessage(message);
    }

    // Save progress
    localStorage.setItem('disaster_survey_data', JSON.stringify(this.answers));

    this.currentQuestion++;
    setTimeout(() => {
      this.render();
    }, 1500);
  }

  showMessage(message) {
    const container = document.getElementById('disaster-questions');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'alert alert-info mt-3';
    messageDiv.innerHTML = `<i class="bi bi-info-circle me-2"></i>${message}`;
    container.appendChild(messageDiv);
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  updateProgress() {
    const progress = (this.currentQuestion / this.totalQuestions) * 100;
    const progressBar = document.getElementById('disaster-progress-bar');
    const progressText = document.getElementById('disaster-progress-text');
    
    if (progressBar) {
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', progress);
    }
    if (progressText) {
      progressText.textContent = `Soru ${this.currentQuestion}/${this.totalQuestions}`;
    }
  }

  showResult() {
    const questionsDiv = document.getElementById('disaster-questions');
    const resultDiv = document.getElementById('disaster-result');
    const resultContent = document.getElementById('disaster-result-content');

    if (questionsDiv) questionsDiv.classList.add('d-none');
    if (resultDiv) {
      resultDiv.classList.remove('d-none');
      resultContent.innerHTML = this.getFinalMessage();
    }

    this.updateProgress();
    
    // Mark as completed
    localStorage.setItem('disaster_completed', 'true');
    
    // Send to backend
    this.submitToBackend();
    
    // Hide section after delay
    setTimeout(() => {
      this.hideSection();
    }, 5000);
  }

  async submitToBackend() {
    try {
      const response = await fetch('/api/survey/disaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.answers)
      });
      // Handle response if needed
    } catch (error) {
      console.log('Backend submission simulated:', this.answers);
    }
  }
}

// Initialize surveys when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.profileSurvey = new ProfileSurvey();
  window.disasterSurvey = new DisasterSurvey();
});

