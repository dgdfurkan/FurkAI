/**
 * FurkAI AI Service
 * ChatGPT entegrasyonu için AI servis sınıfı
 */

class AIService {
  constructor() {
    this.apiKey = null;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-3.5-turbo';
    this.maxTokens = 1000;
    this.temperature = 0.7;
  }

  /**
   * API anahtarını ayarla
   * @param {string} apiKey - OpenAI API anahtarı
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * API anahtarının geçerli olup olmadığını kontrol et
   * @returns {boolean}
   */
  hasValidApiKey() {
    return this.apiKey && this.apiKey.startsWith('sk-');
  }

  /**
   * Yemek önerisi iste
   * @param {Object} options - Öneri seçenekleri
   * @returns {Promise<Object>}
   */
  async requestMealSuggestion(options) {
    if (!this.hasValidApiKey()) {
      throw new Error('Geçerli API anahtarı bulunamadı');
    }

    const {
      ingredients = [],
      personCount = 4,
      prepTime = 30,
      calorieRange = 'medium',
      dietPreference = 'normal',
      dislikedIngredients = []
    } = options;

    const prompt = this.buildMealSuggestionPrompt({
      ingredients,
      personCount,
      prepTime,
      calorieRange,
      dietPreference,
      dislikedIngredients
    });

    try {
      const response = await this.makeAPICall(prompt);
      return this.parseMealSuggestion(response);
    } catch (error) {
      console.error('AI yemek önerisi hatası:', error);
      throw error;
    }
  }

  /**
   * Yemek önerisi prompt'unu oluştur
   * @param {Object} options - Seçenekler
   * @returns {string} - Prompt metni
   */
  buildMealSuggestionPrompt(options) {
    const {
      ingredients,
      personCount,
      prepTime,
      calorieRange,
      dietPreference,
      dislikedIngredients
    } = options;

    let prompt = `Sen bir profesyonel şefsin. Aşağıdaki kriterlere göre yemek önerisi yap:

Mevcut malzemeler: ${ingredients.join(', ') || 'Belirtilmemiş'}
Kişi sayısı: ${personCount}
Hazırlık süresi: ${prepTime} dakika
Kalori aralığı: ${this.getCalorieRangeText(calorieRange)}
Beslenme tercihi: ${this.getDietPreferenceText(dietPreference)}
${dislikedIngredients.length > 0 ? `Sevilmeyen malzemeler: ${dislikedIngredients.join(', ')}` : ''}

Lütfen şu formatta yanıt ver:
{
  "title": "Yemek Adı",
  "description": "Kısa açıklama",
  "prepTime": ${prepTime},
  "cookTime": "pişirme süresi",
  "totalTime": "toplam süre",
  "servings": ${personCount},
  "calories": "tahmini kalori",
  "difficulty": "zorluk seviyesi (kolay/orta/zor)",
  "ingredients": [
    {
      "name": "malzeme adı",
      "amount": "miktar",
      "unit": "birim",
      "available": true/false
    }
  ],
  "instructions": [
    "Adım 1",
    "Adım 2"
  ],
  "tips": "Ek ipuçları"
}`;

    return prompt;
  }

  /**
   * Kalori aralığı metnini al
   * @param {string} range - Kalori aralığı
   * @returns {string}
   */
  getCalorieRangeText(range) {
    const ranges = {
      'low': 'Düşük (200-400 kalori)',
      'medium': 'Orta (400-600 kalori)',
      'high': 'Yüksek (600+ kalori)'
    };
    return ranges[range] || 'Orta';
  }

  /**
   * Beslenme tercihi metnini al
   * @param {string} preference - Beslenme tercihi
   * @returns {string}
   */
  getDietPreferenceText(preference) {
    const preferences = {
      'normal': 'Normal beslenme',
      'vegetarian': 'Vejetaryen',
      'vegan': 'Vegan',
      'halal': 'Helal',
      'gluten-free': 'Glutensiz'
    };
    return preferences[preference] || 'Normal beslenme';
  }

  /**
   * API çağrısı yap
   * @param {string} prompt - Prompt metni
   * @returns {Promise<Object>}
   */
  async makeAPICall(prompt) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Sen profesyonel bir şefsin. Sadece JSON formatında yanıt ver.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Hatası: ${error.error?.message || 'Bilinmeyen hata'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Yemek önerisi yanıtını parse et
   * @param {string} response - API yanıtı
   * @returns {Object}
   */
  parseMealSuggestion(response) {
    try {
      // JSON'u temizle ve parse et
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const suggestion = JSON.parse(cleanResponse);
      
      // Veriyi doğrula ve normalize et
      return {
        title: suggestion.title || 'Önerilen Yemek',
        description: suggestion.description || '',
        prepTime: parseInt(suggestion.prepTime) || 30,
        cookTime: suggestion.cookTime || '30 dakika',
        totalTime: suggestion.totalTime || '60 dakika',
        servings: parseInt(suggestion.servings) || 4,
        calories: suggestion.calories || '400-500',
        difficulty: suggestion.difficulty || 'orta',
        ingredients: Array.isArray(suggestion.ingredients) ? suggestion.ingredients : [],
        instructions: Array.isArray(suggestion.instructions) ? suggestion.instructions : [],
        tips: suggestion.tips || '',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('AI yanıtı parse edilemedi:', error);
      throw new Error('AI yanıtı işlenemedi');
    }
  }

  /**
   * Spor önerisi iste
   * @param {Object} options - Öneri seçenekleri
   * @returns {Promise<Object>}
   */
  async requestWorkoutSuggestion(options) {
    if (!this.hasValidApiKey()) {
      throw new Error('Geçerli API anahtarı bulunamadı');
    }

    const {
      duration = 30,
      intensity = 'medium',
      equipment = [],
      goals = [],
      experience = 'intermediate'
    } = options;

    const prompt = this.buildWorkoutSuggestionPrompt({
      duration,
      intensity,
      equipment,
      goals,
      experience
    });

    try {
      const response = await this.makeAPICall(prompt);
      return this.parseWorkoutSuggestion(response);
    } catch (error) {
      console.error('AI spor önerisi hatası:', error);
      throw error;
    }
  }

  /**
   * Spor önerisi prompt'unu oluştur
   * @param {Object} options - Seçenekler
   * @returns {string}
   */
  buildWorkoutSuggestionPrompt(options) {
    const {
      duration,
      intensity,
      equipment,
      goals,
      experience
    } = options;

    let prompt = `Sen bir profesyonel fitness antrenörüsün. Aşağıdaki kriterlere göre antrenman programı öner:

Süre: ${duration} dakika
Yoğunluk: ${intensity}
Mevcut ekipmanlar: ${equipment.join(', ') || 'Sadece vücut ağırlığı'}
Hedefler: ${goals.join(', ') || 'Genel fitness'}
Deneyim seviyesi: ${experience}

Lütfen şu formatta yanıt ver:
{
  "title": "Antrenman Adı",
  "description": "Kısa açıklama",
  "duration": ${duration},
  "intensity": "${intensity}",
  "calories": "tahmini kalori yakımı",
  "exercises": [
    {
      "name": "Egzersiz adı",
      "sets": "set sayısı",
      "reps": "tekrar sayısı",
      "duration": "süre",
      "rest": "dinlenme süresi",
      "instructions": "nasıl yapılır"
    }
  ],
  "tips": "Ek ipuçları"
}`;

    return prompt;
  }

  /**
   * Spor önerisi yanıtını parse et
   * @param {string} response - API yanıtı
   * @returns {Object}
   */
  parseWorkoutSuggestion(response) {
    try {
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const suggestion = JSON.parse(cleanResponse);
      
      return {
        title: suggestion.title || 'Önerilen Antrenman',
        description: suggestion.description || '',
        duration: parseInt(suggestion.duration) || 30,
        intensity: suggestion.intensity || 'medium',
        calories: suggestion.calories || '200-300',
        exercises: Array.isArray(suggestion.exercises) ? suggestion.exercises : [],
        tips: suggestion.tips || '',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('AI spor yanıtı parse edilemedi:', error);
      throw new Error('AI yanıtı işlenemedi');
    }
  }

  /**
   * Genel öneri iste
   * @param {string} prompt - Öneri metni
   * @returns {Promise<string>}
   */
  async requestGeneralSuggestion(prompt) {
    if (!this.hasValidApiKey()) {
      throw new Error('Geçerli API anahtarı bulunamadı');
    }

    try {
      const response = await this.makeAPICall(prompt);
      return response;
    } catch (error) {
      console.error('AI genel öneri hatası:', error);
      throw error;
    }
  }

  /**
   * API kullanım istatistiklerini al
   * @returns {Object}
   */
  getUsageStats() {
    // Bu bilgiyi localStorage'da saklayabiliriz
    const stats = JSON.parse(localStorage.getItem('ai_usage_stats') || '{}');
    return {
      totalRequests: stats.totalRequests || 0,
      successfulRequests: stats.successfulRequests || 0,
      failedRequests: stats.failedRequests || 0,
      lastRequest: stats.lastRequest || null
    };
  }

  /**
   * Kullanım istatistiklerini güncelle
   * @param {boolean} success - İstek başarılı mı
   */
  updateUsageStats(success) {
    const stats = this.getUsageStats();
    stats.totalRequests++;
    if (success) {
      stats.successfulRequests++;
    } else {
      stats.failedRequests++;
    }
    stats.lastRequest = new Date().toISOString();
    
    localStorage.setItem('ai_usage_stats', JSON.stringify(stats));
  }
}

// Global AI service instance
window.AIService = new AIService();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIService;
}
