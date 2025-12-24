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
      // Use fetch API with /api/stats endpoint
      const url = `/api/stats?city=${encodeURIComponent(this.city)}`;
      const response = await fetch(url, { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
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
      <div class="city-stats-card loading" role="status" aria-live="polite" aria-busy="true">
        <div class="skeleton-loader">
          <div class="skeleton-line" style="width: 60%; height: 24px; margin-bottom: 16px;"></div>
          <div class="skeleton-line" style="width: 80%; height: 20px; margin-bottom: 12px;"></div>
          <div class="skeleton-line" style="width: 70%; height: 20px; margin-bottom: 12px;"></div>
          <div class="skeleton-line" style="width: 75%; height: 20px;"></div>
        </div>
        <p class="text-muted text-center mt-3">
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Veriler yükleniyor…
        </p>
      </div>
    `;
  }

  renderError() {
    // Get reference to current instance
    const self = this;
    this.container.innerHTML = `
      <div class="city-stats-card error">
        <div class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>
          <strong>Hata:</strong> ${this.error}
          <button class="btn btn-sm btn-outline-danger mt-2" onclick="(function(){ const card = window.cityStatsCard || arguments[0]; if(card) card.load(); })(${JSON.stringify(this.city)})" aria-label="Tekrar dene">
            <i class="bi bi-arrow-clockwise me-1"></i>Tekrar Dene
          </button>
        </div>
      </div>
    `;
    
    // Fix onclick handler
    const retryBtn = this.container.querySelector('button');
    if (retryBtn) {
      retryBtn.onclick = () => this.load();
    }
  }

  render() {
    if (!this.data) return;

    const html = `
      <section class="city-stats-card" aria-live="polite" aria-atomic="true">
        <h3 class="city-stats-title">${this.escapeHtml(this.data.city)} için Durum</h3>
        <div class="city-stats-content">
          <p class="city-stats-item">
            Bu şehirde şu anda <strong><span class="counter" data-value="${this.data.activeUsers}" aria-label="${this.data.activeUsers} aktif üye">0</span></strong> aktif üye
          </p>
          <p class="city-stats-item">
            Son 24 saatte <strong>+<span class="counter" data-value="${this.data.last24h}" aria-label="${this.data.last24h} yeni katılım">0</span></strong> katılım
          </p>
          <p class="city-stats-item">
            En çok katılım: <strong>${this.data.topDistricts.map(d => this.escapeHtml(d)).join(' • ')}</strong>
          </p>
        </div>
        <small class="text-muted" style="font-size: 0.75rem; display: block; margin-top: 12px;">
          Son güncelleme: <time datetime="${new Date(this.data.updatedAt).toISOString()}">${new Date(this.data.updatedAt).toLocaleTimeString('tr-TR')}</time>
        </small>
      </section>
    `;

    this.container.innerHTML = html;
    
    // Initialize counters
    this.initCounters();
  }

  // Helper to escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

    // Poll every 60 seconds (60000 ms)
    this.pollingInterval = setInterval(() => {
      this.load();
    }, 60000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  updateCity(newCity) {
    if (newCity && newCity !== this.city) {
      this.city = newCity;
      // Stop current polling
      this.stopPolling();
      // Load new data
      this.load();
      // Restart polling with new city
      this.startPolling();
    }
  }

  destroy() {
    // Stop polling
    this.stopPolling();
    
    // Destroy all counters
    Object.values(this.counters).forEach(counter => {
      if (counter && counter.destroy) {
        counter.destroy();
      }
    });
    
    // Clear references
    this.counters = {};
    this.data = null;
  }
}

// Global instance (will be initialized after DOM loads)
window.cityStatsCard = null;

