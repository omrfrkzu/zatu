// ================= Mock API for City Stats =====================
// Simulates backend API with random seed-based values

class StatsAPI {
  constructor() {
    this.cache = {};
    this.baseValues = {};
  }

  // Generate base value for a city (deterministic based on city name)
  getBaseValue(city) {
    if (!this.baseValues[city]) {
      let hash = 0;
      for (let i = 0; i < city.length; i++) {
        hash = ((hash << 5) - hash) + city.charCodeAt(i);
        hash = hash & hash;
      }
      this.baseValues[city] = Math.abs(hash);
    }
    return this.baseValues[city];
  }

  // Simulate incremental growth (updates every 60 seconds)
  getTimeBasedIncrement() {
    // Increment based on minutes since epoch
    return Math.floor((Date.now() / 60000) % 97);
  }

  // Get stats for a city
  async getStats(city = 'İstanbul') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const base = this.getBaseValue(city);
    const increment = this.getTimeBasedIncrement();
    
    // Generate deterministic but slightly varying values
    const activeUsers = 10000 + (base % 50000) + increment;
    const last24h = 100 + (base % 300) + (increment % 50);
    
    // Top districts based on city
    const districtsByCity = {
      'İstanbul': ['Beşiktaş', 'Kadıköy', 'Üsküdar'],
      'Ankara': ['Çankaya', 'Keçiören', 'Yenimahalle'],
      'İzmir': ['Konak', 'Bornova', 'Karşıyaka'],
      'Bursa': ['Osmangazi', 'Nilüfer', 'Yıldırım'],
      'Antalya': ['Muratpaşa', 'Kepez', 'Konyaaltı'],
      'Adana': ['Seyhan', 'Yüreğir', 'Çukurova'],
      'Gaziantep': ['Şahinbey', 'Şehitkamil', 'Oğuzeli'],
      'Eskişehir': ['Odunpazarı', 'Tepebaşı', 'Sivrihisar'],
      'Sivas': ['Merkez', 'Kangal', 'Divriği'],
      'Trabzon': ['Ortahisar', 'Akçaabat', 'Araklı']
    };

    const topDistricts = districtsByCity[city] || ['Merkez', 'İlçe 1', 'İlçe 2'];

    return {
      city: city,
      activeUsers: activeUsers,
      last24h: last24h,
      topDistricts: topDistricts,
      updatedAt: Date.now()
    };
  }
}

// Export singleton instance
window.statsAPI = new StatsAPI();

