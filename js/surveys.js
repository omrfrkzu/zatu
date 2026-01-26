
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

    
    const savedData = localStorage.getItem('profile_survey_data');
    if (savedData) {
      this.answers = JSON.parse(savedData);
      const answeredCount = Object.keys(this.answers).length;
      
      this.currentQuestion = Math.min(answeredCount, this.totalQuestions - 1);
    } else {
      
      this.currentQuestion = 0;
    }

    this.render();
    this.updateProgress();
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
    let html = `<div class="survey-question-card mb-4" role="region" aria-labelledby="profile-question-title">`;
    html += `<h3 class="mb-3" id="profile-question-title">${question.title}</h3>`;
    if (question.description) {
      html += `<p class="text-muted mb-4">${question.description}</p>`;
    }

    
    html += `<div id="profile-message-area" class="mb-3" aria-live="polite" aria-atomic="true"></div>`;

    if (question.type === 'date') {
      const savedValue = this.answers[question.field] || '';
      html += `
        <div class="mb-3">
          <label for="profile-${question.field}" class="form-label">Doğum Tarihi <span class="text-danger">*</span></label>
          <input type="date" class="form-control" id="profile-${question.field}" value="${savedValue}" required aria-required="true">
        </div>
      `;
    } else if (question.type === 'location') {
      const savedCity = this.answers.city || '';
      const savedDistrict = this.answers.district || '';
      html += `
        <div class="mb-3">
          <label for="profile-city" class="form-label">İl <span class="text-danger">*</span></label>
          <select class="form-select" id="profile-city" required aria-required="true">
            <option value="">İl seçiniz</option>
            <option value="Adana" ${savedCity === 'Adana' ? 'selected' : ''}>Adana</option>
            <option value="Ankara" ${savedCity === 'Ankara' ? 'selected' : ''}>Ankara</option>
            <option value="Antalya" ${savedCity === 'Antalya' ? 'selected' : ''}>Antalya</option>
            <option value="İstanbul" ${savedCity === 'İstanbul' ? 'selected' : ''}>İstanbul</option>
            <option value="İzmir" ${savedCity === 'İzmir' ? 'selected' : ''}>İzmir</option>
            <option value="Bursa" ${savedCity === 'Bursa' ? 'selected' : ''}>Bursa</option>
            <option value="Eskişehir" ${savedCity === 'Eskişehir' ? 'selected' : ''}>Eskişehir</option>
            <option value="Sivas" ${savedCity === 'Sivas' ? 'selected' : ''}>Sivas</option>
            <option value="Gaziantep" ${savedCity === 'Gaziantep' ? 'selected' : ''}>Gaziantep</option>
            <option value="Trabzon" ${savedCity === 'Trabzon' ? 'selected' : ''}>Trabzon</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="profile-district" class="form-label">İlçe <span class="text-danger">*</span></label>
          <input type="text" class="form-control" id="profile-district" value="${savedDistrict}" required placeholder="İlçe adınız" aria-required="true">
        </div>
      `;
    } else if (question.type === 'select') {
      const savedValue = this.answers[question.field] || '';
      html += `<div class="mb-3" role="radiogroup" aria-labelledby="profile-question-title">`;
      question.options.forEach((option, index) => {
        const isChecked = savedValue === option;
        html += `
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="profile-${question.field}" id="profile-${question.field}-${index}" value="${option}" ${isChecked ? 'checked' : ''} required aria-required="true">
            <label class="form-check-label" for="profile-${question.field}-${index}">${option}</label>
          </div>
        `;
      });
      html += `</div>`;
    }

    
    html += `<div class="d-flex justify-content-between mt-4">`;
    html += `<button type="button" class="btn btn-outline-secondary" onclick="profileSurvey.prevQuestion()" ${this.currentQuestion === 0 ? 'disabled' : ''} aria-label="Önceki soru">Geri</button>`;
    
    if (this.currentQuestion < this.totalQuestions - 1) {
      html += `<button type="button" class="btn btn-primary" onclick="profileSurvey.nextQuestion()" aria-label="Sonraki soru">İleri</button>`;
    } else {
      html += `<button type="button" class="btn btn-success" onclick="profileSurvey.completeSurvey()" aria-label="Anketi tamamla">Tamamla</button>`;
    }
    html += `</div>`;

    html += `</div>`;
    return html;
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.render();
    }
  }

  nextQuestion() {
    const question = this.questions[this.currentQuestion];
    let answer = null;
    let message = '';

    
    if (question.type === 'date') {
      const birthDate = document.getElementById(`profile-${question.field}`).value;
      if (!birthDate) {
        this.showError('Lütfen doğum tarihinizi giriniz.');
        return;
      }
      this.userBirthDate = birthDate;
      const age = this.calculateAge(birthDate);
      this.answers[question.field] = birthDate;
      this.answers.age = age;
      
      
      if (!this.userName) {
        const regData = localStorage.getItem('registration_step1');
        if (regData) {
          try {
            const data = JSON.parse(regData);
            this.userName = data.name || 'Kullanıcı';
          } catch (e) {
            this.userName = 'Kullanıcı';
          }
        } else {
          this.userName = 'Kullanıcı';
        }
      }
      
      message = this.getAgeMessage(age, this.userName);
    } else if (question.type === 'location') {
      const city = document.getElementById('profile-city').value;
      const district = document.getElementById('profile-district').value;
      if (!city || !district) {
        this.showError('Lütfen il ve ilçe bilgilerinizi giriniz.');
        return;
      }
      this.answers.city = city;
      this.answers.district = district;
      
      message = this.getLocationMessage(city, Math.floor(Math.random() * 100) + 1);
    } else if (question.type === 'select') {
      const selected = document.querySelector(`input[name="profile-${question.field}"]:checked`);
      if (!selected) {
        this.showError('Lütfen bir seçenek seçiniz.');
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

    
    if (message) {
      this.showMessage(message);
    }

    
    localStorage.setItem('profile_survey_data', JSON.stringify(this.answers));

    
    this.currentQuestion++;
    
    
    this.updateProgress();
    
    
    setTimeout(() => {
      this.render();
    }, 1500);
  }

  completeSurvey() {
    const question = this.questions[this.currentQuestion];
    let answer = null;

    
    if (question.type === 'select') {
      const selected = document.querySelector(`input[name="profile-${question.field}"]:checked`);
      if (!selected) {
        this.showError('Lütfen bir seçenek seçiniz.');
        return;
      }
      answer = selected.value;
      this.answers[question.field] = answer;
    }

    
    localStorage.setItem('profile_survey_data', JSON.stringify(this.answers));
    
    
    this.showResult();
  }

  showError(message) {
    const messageArea = document.getElementById('profile-message-area');
    if (messageArea) {
      messageArea.innerHTML = `<div class="alert alert-danger" role="alert"><i class="bi bi-exclamation-circle me-2"></i>${message}</div>`;
      setTimeout(() => {
        messageArea.innerHTML = '';
      }, 3000);
    }
  }

  showMessage(message) {
    const messageArea = document.getElementById('profile-message-area');
    if (messageArea) {
      messageArea.innerHTML = `<div class="alert alert-info" role="status"><i class="bi bi-info-circle me-2"></i>${message}</div>`;
      
    }
  }

  updateProgress() {
    
    
    
    const displayQuestion = Math.max(1, this.currentQuestion + 1);
    
    let progress = 0;
    if (this.currentQuestion <= 1) {
      progress = 33; 
    } else if (this.currentQuestion <= 3) {
      progress = 66; 
    } else {
      progress = 100; 
    }
    
    const progressBar = document.getElementById('profile-progress-bar');
    const progressText = document.getElementById('profile-progress-text');
    
    if (progressBar) {
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', progress);
    }
    if (progressText) {
      progressText.textContent = `Soru ${displayQuestion}/${this.totalQuestions}`;
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

    
    const progressBar = document.getElementById('profile-progress-bar');
    const progressText = document.getElementById('profile-progress-text');
    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.setAttribute('aria-valuenow', 100);
    }
    if (progressText) {
      progressText.textContent = `Tamamlandı (${this.totalQuestions}/${this.totalQuestions})`;
    }
    
    
    localStorage.setItem('profile_completed', 'true');
    
    
    if (window.userProgress) {
      window.userProgress.setProfileCompleted(true);
    }
    
    
    if (typeof toastr !== 'undefined') {
      toastr.success('Profil anketi tamamlandı! Teşekkürler.', 'Başarılı', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
    }
    
    
    this.submitToBackend();
    
    
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
      
      if (response.ok) {
        const result = await response.json();
        console.log('Profile survey submitted successfully:', result);
      } else {
        console.error('Failed to submit profile survey:', response.status);
      }
    } catch (error) {
      console.error('Error submitting profile survey:', error);
      
      console.log('Backend submission simulated:', this.answers);
    }
  }
}


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

    
    const savedData = localStorage.getItem('disaster_survey_data');
    if (savedData) {
      this.answers = JSON.parse(savedData);
      const answeredCount = Object.keys(this.answers).length;
      
      this.currentQuestion = Math.min(answeredCount, this.totalQuestions - 1);
    } else {
      
      this.currentQuestion = 0;
    }

    this.render();
    this.updateProgress();
  }

  hideSection() {
    const section = document.getElementById('disaster-survey-section');
    if (section) {
      section.style.display = 'none';
    }
  }

  getTrustedInstitutionMessage(answer) {
    const messages = {
      'AFAD': 'AFAD\'a güven duyman önemli. Ulusal Afet Ağı da AFAD\'la entegre çalışır.',
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
      return 'Evet, Ulusal Afet Ağı tam da bu ihtiyaca cevap vermek için geliştirildi.';
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
    let html = `<div class="survey-question-card mb-4" role="region" aria-labelledby="disaster-question-title">`;
    html += `<h3 class="mb-3" id="disaster-question-title">${question.title}</h3>`;
    if (question.description) {
      html += `<p class="text-muted mb-4">${question.description}</p>`;
    }

    
    html += `<div id="disaster-message-area" class="mb-3" aria-live="polite" aria-atomic="true"></div>`;

    const savedValue = this.answers[question.field] || '';
    html += `<div class="mb-3" role="radiogroup" aria-labelledby="disaster-question-title">`;
    question.options.forEach((option, index) => {
      const isChecked = savedValue === option;
      html += `
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="disaster-${question.field}" id="disaster-${question.field}-${index}" value="${option}" ${isChecked ? 'checked' : ''} required aria-required="true">
          <label class="form-check-label" for="disaster-${question.field}-${index}">${option}</label>
        </div>
      `;
    });
    html += `</div>`;

    
    html += `<div class="d-flex justify-content-between mt-4">`;
    html += `<button type="button" class="btn btn-outline-secondary" onclick="disasterSurvey.prevQuestion()" ${this.currentQuestion === 0 ? 'disabled' : ''} aria-label="Önceki soru">Geri</button>`;
    
    if (this.currentQuestion < this.totalQuestions - 1) {
      html += `<button type="button" class="btn btn-danger" onclick="disasterSurvey.nextQuestion()" aria-label="Sonraki soru">İleri</button>`;
    } else {
      html += `<button type="button" class="btn btn-danger" onclick="disasterSurvey.completeSurvey()" aria-label="Anketi tamamla">Tamamla</button>`;
    }
    html += `</div>`;

    html += `</div>`;
    return html;
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.render();
    }
  }

  nextQuestion() {
    const question = this.questions[this.currentQuestion];
    const selected = document.querySelector(`input[name="disaster-${question.field}"]:checked`);
    
    if (!selected) {
      this.showError('Lütfen bir seçenek seçiniz.');
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

    
    localStorage.setItem('disaster_survey_data', JSON.stringify(this.answers));

    
    this.currentQuestion++;
    
    
    this.updateProgress();
    
    
    setTimeout(() => {
      this.render();
    }, 1500);
  }

  completeSurvey() {
    const question = this.questions[this.currentQuestion];
    const selected = document.querySelector(`input[name="disaster-${question.field}"]:checked`);
    
    if (!selected) {
      this.showError('Lütfen bir seçenek seçiniz.');
      return;
    }

    const answer = selected.value;
    this.answers[question.field] = answer;

    
    localStorage.setItem('disaster_survey_data', JSON.stringify(this.answers));
    
    
    this.showResult();
  }

  showError(message) {
    const messageArea = document.getElementById('disaster-message-area');
    if (messageArea) {
      messageArea.innerHTML = `<div class="alert alert-danger" role="alert"><i class="bi bi-exclamation-circle me-2"></i>${message}</div>`;
      setTimeout(() => {
        messageArea.innerHTML = '';
      }, 3000);
    }
  }

  showMessage(message) {
    const messageArea = document.getElementById('disaster-message-area');
    if (messageArea) {
      messageArea.innerHTML = `<div class="alert alert-info" role="status"><i class="bi bi-info-circle me-2"></i>${message}</div>`;
      
    }
  }

  updateProgress() {
    
    
    
    const displayQuestion = Math.max(1, this.currentQuestion + 1);
    
    let progress = 0;
    if (this.currentQuestion <= 1) {
      progress = 33; 
    } else if (this.currentQuestion <= 3) {
      progress = 66; 
    } else {
      progress = 100; 
    }
    
    const progressBar = document.getElementById('disaster-progress-bar');
    const progressText = document.getElementById('disaster-progress-text');
    
    if (progressBar) {
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', progress);
    }
    if (progressText) {
      progressText.textContent = `Soru ${displayQuestion}/${this.totalQuestions}`;
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

    
    const progressBar = document.getElementById('disaster-progress-bar');
    const progressText = document.getElementById('disaster-progress-text');
    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.setAttribute('aria-valuenow', 100);
    }
    if (progressText) {
      progressText.textContent = `Tamamlandı (${this.totalQuestions}/${this.totalQuestions})`;
    }
    
    
    localStorage.setItem('disaster_completed', 'true');
    
    
    if (window.userProgress) {
      window.userProgress.setDisasterCompleted(true);
    }
    
    
    if (typeof toastr !== 'undefined') {
      toastr.success('Afet görüşleri anketi tamamlandı! Teşekkürler.', 'Başarılı', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
    }
    
    
    this.submitToBackend();
    
    
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
      
      if (response.ok) {
        const result = await response.json();
        console.log('Disaster survey submitted successfully:', result);
      } else {
        console.error('Failed to submit disaster survey:', response.status);
      }
    } catch (error) {
      console.error('Error submitting disaster survey:', error);
      
      console.log('Backend submission simulated:', this.answers);
    }
  }
}


document.addEventListener('DOMContentLoaded', function() {
  window.profileSurvey = new ProfileSurvey();
  window.disasterSurvey = new DisasterSurvey();
});

