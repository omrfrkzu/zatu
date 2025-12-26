// ================= Mock API for City Stats =====================
// Simulates backend API with deterministic seed-based values
// Compatible with /api/stats?city= endpoint format

class StatsAPI {
  constructor() {
    this.cache = {};
  }

  // Handle fetch requests to /api/stats?city=
  async handleFetch(url) {
    try {
      const urlObj = new URL(url, window.location.origin);
      const city = urlObj.searchParams.get('city') || 'İstanbul';
      const data = await this.getStats(city);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Generate deterministic seed based on city name and time
  getSeed(city) {
    // Deterministic seed: city.length * 317 + (minutes since epoch % 101)
    const citySeed = city.length * 317;
    const timeSeed = Math.floor(Date.now() / 60000) % 101;
    return citySeed + timeSeed;
  }

  // Get stats for a city
  async getStats(city = 'İstanbul') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const seed = this.getSeed(city);
    
    // Generate deterministic values based on seed
    // activeUsers: 9000 + seed (ensures reasonable range)
    const activeUsers = 9000 + (seed % 50000);
    // last24h: (seed % 400) + 50 (range: 50-449)
    const last24h = (seed % 400) + 50;
    
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

// Intercept fetch calls to /api/stats
(function() {
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    // Check if it's a stats API call
    if (typeof url === 'string' && url.includes('/api/stats')) {
      if (!options || options.method === 'GET' || !options.method) {
        return window.statsAPI.handleFetch(url);
      }
    }
    // For all other requests, use original fetch
    return originalFetch.apply(this, arguments);
  };
})();

