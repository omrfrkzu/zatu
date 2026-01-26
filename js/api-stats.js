



class StatsAPI {
  constructor() {
    this.cache = {};
  }

  
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

  
  getSeed(city) {
    
    const citySeed = city.length * 317;
    const timeSeed = Math.floor(Date.now() / 60000) % 101;
    return citySeed + timeSeed;
  }

  
  async getStats(city = 'İstanbul') {
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const seed = this.getSeed(city);
    
    
    
    const activeUsers = 9000 + (seed % 50000);
    
    const last24h = (seed % 400) + 50;
    
    
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


window.statsAPI = new StatsAPI();


(function() {
  const originalFetch = window.fetch;
  window.fetch = async function(url, options) {
    
    if (typeof url === 'string' && url.includes('/api/stats')) {
      if (!options || options.method === 'GET' || !options.method) {
        return window.statsAPI.handleFetch(url);
      }
    }
    
    return originalFetch.apply(this, arguments);
  };
})();

