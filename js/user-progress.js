
class UserProgress {
  constructor() {
    this.state = {
      registered: false,
      profileCompleted: false,
      disasterCompleted: false
    };
    this.loadFromStorage();
    this.listeners = [];
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('user_progress');
      if (stored) {
        this.state = { ...this.state, ...JSON.parse(stored) };
      }
      
      
      if (localStorage.getItem('registration_step2')) {
        this.state.registered = true;
      }
      if (localStorage.getItem('profile_completed') === 'true') {
        this.state.profileCompleted = true;
      }
      if (localStorage.getItem('disaster_completed') === 'true') {
        this.state.disasterCompleted = true;
      }
    } catch (e) {
      console.error('Error loading user progress:', e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('user_progress', JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving user progress:', e);
    }
  }

  setRegistered(value) {
    this.state.registered = value;
    this.saveToStorage();
    this.notifyListeners();
  }

  setProfileCompleted(value) {
    this.state.profileCompleted = value;
    this.saveToStorage();
    this.notifyListeners();
  }

  setDisasterCompleted(value) {
    this.state.disasterCompleted = value;
    this.saveToStorage();
    this.notifyListeners();
  }

  getState() {
    return { ...this.state };
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (e) {
        console.error('Error in progress listener:', e);
      }
    });
  }
}


window.userProgress = new UserProgress();

