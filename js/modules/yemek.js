/**
 * FurkAI Yemek Module
 * Kiler, tarifler, haftalık plan ve AI öneri sistemi
 */

class YemekModule extends BaseModule {
  constructor() {
    super('yemek');
    this.currentView = 'kiler';
    this.kilerItems = [];
    this.tarifler = [];
    this.haftalikPlan = {};
    this.alisverisListesi = [];
  }

  /**
   * Modül HTML'ini render et
   */
  async render() {
    return `
      <div class="yemek-module">
        <!-- Yemek Modülü Navigasyonu -->
        <div class="module-nav-tabs">
          <button class="tab-btn active" data-tab="kiler">
            <span class="tab-icon">🏠</span>
            <span class="tab-label">Kiler</span>
          </button>
          <button class="tab-btn" data-tab="tarifler">
            <span class="tab-icon">📝</span>
            <span class="tab-label">Tarifler</span>
          </button>
          <button class="tab-btn" data-tab="plan">
            <span class="tab-icon">📅</span>
            <span class="tab-label">Haftalık Plan</span>
          </button>
          <button class="tab-btn" data-tab="alisveris">
            <span class="tab-icon">🛒</span>
            <span class="tab-label">Alışveriş</span>
          </button>
          <button class="tab-btn" data-tab="ai">
            <span class="tab-icon">🤖</span>
            <span class="tab-label">AI Öneri</span>
          </button>
        </div>

        <!-- İçerik Alanı -->
        <div class="module-content-area">
          <!-- Kiler Sekmesi -->
          <div id="kiler-content" class="tab-content active">
            <div class="content-header">
              <h2>Kiler Yönetimi</h2>
              <div class="header-actions">
                <button class="btn btn-primary" id="add-kiler-item">
                  <span class="icon">+</span>
                  Ürün Ekle
                </button>
                <button class="btn btn-secondary" id="barkod-tara">
                  <span class="icon">📷</span>
                  Barkod Tara
                </button>
              </div>
            </div>
            
            <div class="search-filter-bar">
              <input type="text" id="kiler-search" class="form-input" placeholder="Kilerde ara...">
              <select id="kiler-category-filter" class="form-select">
                <option value="">Tüm Kategoriler</option>
                <option value="sut">Süt Ürünleri</option>
                <option value="et">Et & Tavuk</option>
                <option value="tahil">Tahıl</option>
                <option value="sebze">Sebze</option>
                <option value="meyve">Meyve</option>
                <option value="bakliyat">Bakliyat</option>
                <option value="sos">Sos & Baharat</option>
              </select>
            </div>

            <div id="kiler-grid" class="kiler-grid">
              <!-- Kiler ürünleri buraya yüklenecek -->
            </div>
          </div>

          <!-- Tarifler Sekmesi -->
          <div id="tarifler-content" class="tab-content">
            <div class="content-header">
              <h2>Tarifler</h2>
              <div class="header-actions">
                <button class="btn btn-primary" id="add-tarif">
                  <span class="icon">+</span>
                  Tarif Ekle
                </button>
              </div>
            </div>

            <div class="search-filter-bar">
              <input type="text" id="tarif-search" class="form-input" placeholder="Tarif ara...">
              <select id="tarif-category-filter" class="form-select">
                <option value="">Tüm Kategoriler</option>
                <option value="corba">Çorba</option>
                <option value="ana-yemek">Ana Yemek</option>
                <option value="atistirmalik">Atıştırmalık</option>
                <option value="tatli">Tatlı</option>
                <option value="salata">Salata</option>
              </select>
            </div>

            <div id="tarifler-grid" class="tarifler-grid">
              <!-- Tarifler buraya yüklenecek -->
            </div>
          </div>

          <!-- Haftalık Plan Sekmesi -->
          <div id="plan-content" class="tab-content">
            <div class="content-header">
              <h2>Haftalık Yemek Planı</h2>
              <div class="header-actions">
                <button class="btn btn-primary" id="create-plan">
                  <span class="icon">✨</span>
                  Plan Oluştur
                </button>
                <button class="btn btn-secondary" id="export-plan">
                  <span class="icon">📤</span>
                  Dışa Aktar
                </button>
              </div>
            </div>

            <div id="haftalik-plan" class="haftalik-plan">
              <!-- Haftalık plan buraya yüklenecek -->
            </div>
          </div>

          <!-- Alışveriş Sekmesi -->
          <div id="alisveris-content" class="tab-content">
            <div class="content-header">
              <h2>Alışveriş Listesi</h2>
              <div class="header-actions">
                <button class="btn btn-primary" id="add-manual-item">
                  <span class="icon">+</span>
                  Manuel Ekle
                </button>
                <button class="btn btn-secondary" id="share-list">
                  <span class="icon">📤</span>
                  Paylaş
                </button>
              </div>
            </div>

            <div id="alisveris-listesi" class="alisveris-listesi">
              <!-- Alışveriş listesi buraya yüklenecek -->
            </div>
          </div>

          <!-- AI Öneri Sekmesi -->
          <div id="ai-content" class="tab-content">
            <div class="content-header">
              <h2>AI Yemek Önerisi</h2>
            </div>

            <div class="ai-request-form">
              <div class="form-group">
                <label class="form-label">Mevcut Malzemeler</label>
                <div id="selected-ingredients" class="ingredients-list">
                  <!-- Seçili malzemeler buraya yüklenecek -->
                </div>
                <button class="btn btn-outline" id="select-from-kiler">
                  Kilerden Seç
                </button>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Kişi Sayısı</label>
                  <input type="number" id="person-count" class="form-input" value="4" min="1" max="10">
                </div>
                <div class="form-group">
                  <label class="form-label">Hazırlık Süresi (dakika)</label>
                  <select id="prep-time" class="form-select">
                    <option value="15">15 dakika</option>
                    <option value="30">30 dakika</option>
                    <option value="45">45 dakika</option>
                    <option value="60">60 dakika</option>
                    <option value="90">90+ dakika</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Kalori Aralığı</label>
                  <select id="calorie-range" class="form-select">
                    <option value="low">Düşük (200-400)</option>
                    <option value="medium">Orta (400-600)</option>
                    <option value="high">Yüksek (600+)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Beslenme Tercihi</label>
                  <select id="diet-preference" class="form-select">
                    <option value="normal">Normal</option>
                    <option value="vegetarian">Vejetaryen</option>
                    <option value="vegan">Vegan</option>
                    <option value="halal">Helal</option>
                    <option value="gluten-free">Glutensiz</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Sevilmeyen Malzemeler (opsiyonel)</label>
                <input type="text" id="disliked-ingredients" class="form-input" placeholder="Örn: soğan, sarımsak">
              </div>

              <button class="btn btn-primary btn-lg" id="request-ai-suggestion">
                <span class="icon">🤖</span>
                AI Önerisi Al
              </button>
            </div>

            <div id="ai-suggestions" class="ai-suggestions">
              <!-- AI önerileri buraya yüklenecek -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Modülü başlat
   */
  async init() {
    // Verileri yükle
    await this.loadData();
    
    // UI olaylarını ayarla
    this.setupUIEvents();
    
    // İlk sekme içeriğini yükle
    await this.loadTabContent('kiler');
  }

  /**
   * Verileri yükle
   */
  async loadData() {
    try {
      this.kilerItems = await this.getData({ filter: item => item.type === 'kiler' });
      this.tarifler = await this.getData({ filter: item => item.type === 'tarif' });
      this.haftalikPlan = await this.getData({ filter: item => item.type === 'haftalik-plan' });
      this.alisverisListesi = await this.getData({ filter: item => item.type === 'alisveris' });
    } catch (error) {
      console.error('Yemek modülü verileri yüklenemedi:', error);
    }
  }

  /**
   * UI olaylarını ayarla
   */
  setupUIEvents() {
    // Sekme değiştirme
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Kiler olayları
    document.getElementById('add-kiler-item')?.addEventListener('click', () => {
      this.showAddKilerItemModal();
    });

    document.getElementById('barkod-tara')?.addEventListener('click', () => {
      this.startBarcodeScan();
    });

    // Tarif olayları
    document.getElementById('add-tarif')?.addEventListener('click', () => {
      this.showAddTarifModal();
    });

    // Plan olayları
    document.getElementById('create-plan')?.addEventListener('click', () => {
      this.showCreatePlanModal();
    });

    // Alışveriş olayları
    document.getElementById('add-manual-item')?.addEventListener('click', () => {
      this.showAddManualItemModal();
    });

    // AI olayları
    document.getElementById('request-ai-suggestion')?.addEventListener('click', () => {
      this.requestAISuggestion();
    });

    // Arama ve filtreleme
    document.getElementById('kiler-search')?.addEventListener('input', (e) => {
      this.filterKilerItems(e.target.value);
    });

    document.getElementById('kiler-category-filter')?.addEventListener('change', (e) => {
      this.filterKilerByCategory(e.target.value);
    });
  }

  /**
   * Sekme değiştir
   * @param {string} tabName - Sekme adı
   */
  async switchTab(tabName) {
    // Aktif sekme butonunu güncelle
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      }
    });

    // Aktif içeriği güncelle
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-content`).classList.add('active');

    // İçeriği yükle
    await this.loadTabContent(tabName);
  }

  /**
   * Sekme içeriğini yükle
   * @param {string} tabName - Sekme adı
   */
  async loadTabContent(tabName) {
    switch (tabName) {
      case 'kiler':
        await this.renderKilerGrid();
        break;
      case 'tarifler':
        await this.renderTariflerGrid();
        break;
      case 'plan':
        await this.renderHaftalikPlan();
        break;
      case 'alisveris':
        await this.renderAlisverisListesi();
        break;
      case 'ai':
        await this.renderAIContent();
        break;
    }
  }

  /**
   * Kiler grid'ini render et
   */
  async renderKilerGrid() {
    const grid = document.getElementById('kiler-grid');
    
    if (this.kilerItems.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏠</div>
          <h3>Kiler Boş</h3>
          <p>Henüz hiç ürün eklenmemiş. İlk ürününüzü ekleyin!</p>
          <button class="btn btn-primary" onclick="window.ModuleManager.modules.get('yemek').instance.showAddKilerItemModal()">
            Ürün Ekle
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.kilerItems.map(item => `
      <div class="kiler-item-card" data-id="${item.id}">
        <div class="item-image">
          ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `<div class="item-icon">${this.getCategoryIcon(item.category)}</div>`}
        </div>
        <div class="item-info">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-category">${this.getCategoryName(item.category)}</p>
          <p class="item-quantity">${item.quantity} ${item.unit}</p>
          ${item.expiryDate ? `<p class="item-expiry ${this.getExpiryClass(item.expiryDate)}">SKT: ${this.formatDate(item.expiryDate)}</p>` : ''}
        </div>
        <div class="item-actions">
          <button class="btn btn-sm btn-secondary" onclick="window.ModuleManager.modules.get('yemek').instance.editKilerItem(${item.id})">
            ✏️
          </button>
          <button class="btn btn-sm btn-outline" onclick="window.ModuleManager.modules.get('yemek').instance.deleteKilerItem(${item.id})">
            🗑️
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Kategori ikonunu al
   * @param {string} category - Kategori
   * @returns {string} - İkon
   */
  getCategoryIcon(category) {
    const icons = {
      'sut': '🥛',
      'et': '🥩',
      'tahil': '🌾',
      'sebze': '🥬',
      'meyve': '🍎',
      'bakliyat': '🫘',
      'sos': '🧂'
    };
    return icons[category] || '📦';
  }

  /**
   * Kategori adını al
   * @param {string} category - Kategori
   * @returns {string} - Kategori adı
   */
  getCategoryName(category) {
    const names = {
      'sut': 'Süt Ürünleri',
      'et': 'Et & Tavuk',
      'tahil': 'Tahıl',
      'sebze': 'Sebze',
      'meyve': 'Meyve',
      'bakliyat': 'Bakliyat',
      'sos': 'Sos & Baharat'
    };
    return names[category] || 'Diğer';
  }

  /**
   * Son kullanma tarihi sınıfını al
   * @param {string} expiryDate - Son kullanma tarihi
   * @returns {string} - CSS sınıfı
   */
  getExpiryClass(expiryDate) {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'expiring-soon';
    if (diffDays <= 7) return 'expiring-week';
    return 'expiring-later';
  }

  /**
   * Tarihi formatla
   * @param {string} date - Tarih
   * @returns {string} - Formatlanmış tarih
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('tr-TR');
  }

  /**
   * Kiler ürünü ekleme modalını göster
   */
  showAddKilerItemModal() {
    // Modal implement edilecek
    console.log('Kiler ürünü ekleme modalı açılıyor...');
  }

  /**
   * Barkod tarama başlat
   */
  startBarcodeScan() {
    // Barkod tarama implement edilecek
    console.log('Barkod tarama başlatılıyor...');
  }

  /**
   * Kiler ürününü düzenle
   * @param {number} id - Ürün ID'si
   */
  editKilerItem(id) {
    console.log('Kiler ürünü düzenleniyor:', id);
  }

  /**
   * Kiler ürününü sil
   * @param {number} id - Ürün ID'si
   */
  async deleteKilerItem(id) {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await this.deleteData(id);
        await this.loadData();
        await this.renderKilerGrid();
      } catch (error) {
        console.error('Ürün silinemedi:', error);
      }
    }
  }

  /**
   * Kiler ürünlerini filtrele
   * @param {string} searchTerm - Arama terimi
   */
  filterKilerItems(searchTerm) {
    const cards = document.querySelectorAll('.kiler-item-card');
    cards.forEach(card => {
      const name = card.querySelector('.item-name').textContent.toLowerCase();
      const category = card.querySelector('.item-category').textContent.toLowerCase();
      const matches = name.includes(searchTerm.toLowerCase()) || category.includes(searchTerm.toLowerCase());
      card.style.display = matches ? 'block' : 'none';
    });
  }

  /**
   * Kiler ürünlerini kategoriye göre filtrele
   * @param {string} category - Kategori
   */
  filterKilerByCategory(category) {
    const cards = document.querySelectorAll('.kiler-item-card');
    cards.forEach(card => {
      const itemCategory = card.querySelector('.item-category').textContent;
      const categoryName = this.getCategoryName(category);
      const matches = !category || itemCategory === categoryName;
      card.style.display = matches ? 'block' : 'none';
    });
  }

  /**
   * AI önerisi iste
   */
  async requestAISuggestion() {
    const openaiKey = await window.DataManager.getSetting('openai_key');
    
    if (!openaiKey) {
      alert('AI önerisi için OpenAI API anahtarınızı ayarlardan ekleyin.');
      return;
    }

    // AI servisini ayarla
    window.AIService.setApiKey(openaiKey);

    // Form verilerini al
    const ingredients = this.getSelectedIngredients();
    const personCount = parseInt(document.getElementById('person-count').value) || 4;
    const prepTime = parseInt(document.getElementById('prep-time').value) || 30;
    const calorieRange = document.getElementById('calorie-range').value || 'medium';
    const dietPreference = document.getElementById('diet-preference').value || 'normal';
    const dislikedIngredients = document.getElementById('disliked-ingredients').value
      .split(',').map(item => item.trim()).filter(item => item);

    if (ingredients.length === 0) {
      alert('Lütfen en az bir malzeme seçin.');
      return;
    }

    // Loading göster
    const suggestionsContainer = document.getElementById('ai-suggestions');
    suggestionsContainer.innerHTML = `
      <div class="ai-loading">
        <div class="loading-spinner"></div>
        <p>AI yemek önerisi hazırlanıyor...</p>
      </div>
    `;

    try {
      // AI önerisi iste
      const suggestion = await window.AIService.requestMealSuggestion({
        ingredients,
        personCount,
        prepTime,
        calorieRange,
        dietPreference,
        dislikedIngredients
      });

      // Başarılı istatistiği güncelle
      window.AIService.updateUsageStats(true);

      // Öneriyi göster
      this.displayAISuggestion(suggestion);

    } catch (error) {
      console.error('AI önerisi hatası:', error);
      
      // Hata istatistiği güncelle
      window.AIService.updateUsageStats(false);

      // Hata mesajını göster
      suggestionsContainer.innerHTML = `
        <div class="ai-error">
          <div class="error-icon">⚠️</div>
          <h3>AI Önerisi Alınamadı</h3>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="window.ModuleManager.modules.get('yemek').instance.requestAISuggestion()">
            Tekrar Dene
          </button>
        </div>
      `;
    }
  }

  /**
   * Seçili malzemeleri al
   * @returns {Array} - Malzeme listesi
   */
  getSelectedIngredients() {
    const ingredientsContainer = document.getElementById('selected-ingredients');
    const chips = ingredientsContainer.querySelectorAll('.ingredient-chip');
    return Array.from(chips).map(chip => chip.textContent.trim());
  }

  /**
   * AI önerisini göster
   * @param {Object} suggestion - AI önerisi
   */
  displayAISuggestion(suggestion) {
    const suggestionsContainer = document.getElementById('ai-suggestions');
    
    suggestionsContainer.innerHTML = `
      <div class="ai-suggestion-card">
        <div class="suggestion-header">
          <h3 class="suggestion-title">${suggestion.title}</h3>
          <div class="suggestion-meta">
            <span class="meta-item">⏱️ ${suggestion.totalTime}</span>
            <span class="meta-item">👥 ${suggestion.servings} kişi</span>
            <span class="meta-item">🔥 ${suggestion.calories} kalori</span>
            <span class="meta-item">📊 ${suggestion.difficulty}</span>
          </div>
        </div>
        
        <div class="suggestion-description">
          ${suggestion.description}
        </div>

        <div class="suggestion-ingredients">
          <h4>Malzemeler:</h4>
          <ul>
            ${suggestion.ingredients.map(ingredient => `
              <li class="${ingredient.available ? 'available' : 'missing'}">
                ${ingredient.amount} ${ingredient.unit} ${ingredient.name}
                ${!ingredient.available ? '<span class="missing-badge">Eksik</span>' : ''}
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="suggestion-instructions">
          <h4>Hazırlık:</h4>
          <ol>
            ${suggestion.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
          </ol>
        </div>

        ${suggestion.tips ? `
          <div class="suggestion-tips">
            <h4>💡 İpuçları:</h4>
            <p>${suggestion.tips}</p>
          </div>
        ` : ''}

        <div class="suggestion-actions">
          <button class="btn btn-primary" onclick="window.ModuleManager.modules.get('yemek').instance.addSuggestionToPlan('${suggestion.title}')">
            Planıma Ekle
          </button>
          <button class="btn btn-secondary" onclick="window.ModuleManager.modules.get('yemek').instance.saveSuggestionAsRecipe('${suggestion.title}')">
            Tarif Olarak Kaydet
          </button>
          <button class="btn btn-outline" onclick="window.ModuleManager.modules.get('yemek').instance.requestAISuggestion()">
            Yeni Öneri
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Öneriyi plana ekle
   * @param {string} suggestionTitle - Öneri başlığı
   */
  addSuggestionToPlan(suggestionTitle) {
    console.log('Öneri plana ekleniyor:', suggestionTitle);
    // Plan ekleme mantığı implement edilecek
  }

  /**
   * Öneriyi tarif olarak kaydet
   * @param {string} suggestionTitle - Öneri başlığı
   */
  saveSuggestionAsRecipe(suggestionTitle) {
    console.log('Öneri tarif olarak kaydediliyor:', suggestionTitle);
    // Tarif kaydetme mantığı implement edilecek
  }

  /**
   * Modülü temizle
   */
  async cleanup() {
    // Temizleme işlemleri
  }
}

// Modülü kaydet
window.ModuleManager.registerModule('yemek', new YemekModule());

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = YemekModule;
}
