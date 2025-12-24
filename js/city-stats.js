// ================= City Stats Card Component =====================
class CityStatsCard {
  constructor(containerId, city = 'İstanbul') {
    this.container = document.getElementById(containerId);
    this.city = city;
    this.data = null;
    this.loading = false;
    this.error = null;
    this.pollingInterval = null;
    this.counters = {};
    
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    this.init();
  }

  async init() {
    await this.load();
    this.startPolling();
  }

  async load() {
    if (this.loading) return;
    
    this.loading = true;
    this.error = null;
    this.renderLoading();

    try {
      if (!window.statsAPI) {
        throw new Error('Stats API not loaded');
      }

      const data = await window.statsAPI.getStats(this.city);
      this.data = data;
      this.render();
    } catch (error) {
      console.error('Error loading stats:', error);
      this.error = 'Geçici bir sorun oluştu. Tekrar dene.';
      this.renderError();
    } finally {
      this.loading = false;
    }
  }

  renderLoading() {
    this.container.innerHTML = `
      <div class="city-stats-card loading">
        <div class="skeleton-loader">
          <div class="skeleton-line" style="width: 60%; height: 24px; margin-bottom: 16px;"></div>
          <div class="skeleton-line" style="width: 80%; height: 20px; margin-bottom: 12px;"></div>
          <div class="skeleton-line" style="width: 70%; height: 20px; margin-bottom: 12px;"></div>
          <div class="skeleton-line" style="width: 75%; height: 20px;"></div>
        </div>
        <p class="text-muted text-center mt-3">Veriler yükleniyor…</p>
      </div>
    `;
  }

  renderError() {
    this.container.innerHTML = `
      <div class="city-stats-card error">
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          ${this.error}
          <button class="btn btn-sm btn-outline-danger mt-2" onclick="cityStatsCard.load()">Tekrar Dene</button>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.data) return;

    const html = `
      <section class="city-stats-card" aria-live="polite">
        <h3 class="city-stats-title">${this.data.city} için Durum</h3>
        <div class="city-stats-content">
          <p class="city-stats-item">
            Bu şehirde şu anda <strong><span class="counter" data-value="${this.data.activeUsers}">0</span></strong> aktif üye
          </p>
          <p class="city-stats-item">
            Son 24 saatte <strong>+<span class="counter" data-value="${this.data.last24h}">0</span></strong> katılım
          </p>
          <p class="city-stats-item">
            En çok katılım: <strong>${this.data.topDistricts.join(' • ')}</strong>
          </p>
        </div>
        <small class="text-muted" style="font-size: 0.75rem; display: block; margin-top: 12px;">
          Son güncelleme: ${new Date(this.data.updatedAt).toLocaleTimeString('tr-TR')}
        </small>
      </section>
    `;

    this.container.innerHTML = html;
    
    // Initialize counters
    this.initCounters();
  }

  initCounters() {
    const counterElements = this.container.querySelectorAll('.counter[data-value]');
    
    counterElements.forEach((el, index) => {
      const value = parseInt(el.getAttribute('data-value'));
      const counterId = `counter-${index}`;
      
      // Destroy existing counter if any
      if (this.counters[counterId]) {
        this.counters[counterId].destroy();
      }
      
      // Create new counter
      const counter = new Counter(el, value, 800);
      counter.start();
      this.counters[counterId] = counter;
    });
  }

  startPolling() {
    // Clear existing interval
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Poll every 60 seconds
    this.pollingInterval = setInterval(() => {
      this.load();
    }, 60000);
  }

  updateCity(newCity) {
    if (newCity !== this.city) {
      this.city = newCity;
      this.load();
    }
  }

  destroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    
    // Destroy all counters
    Object.values(this.counters).forEach(counter => {
      if (counter && counter.destroy) {
        counter.destroy();
      }
    });
  }
}

// Global instance (will be initialized after DOM loads)
window.cityStatsCard = null;

