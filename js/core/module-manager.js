/**
 * FurkAI Module Manager
 * Modüler mimari için modül yönetim sistemi
 */

class ModuleManager {
  constructor() {
    this.modules = new Map();
    this.currentModule = null;
    this.moduleContainer = null;
  }

  /**
   * Modül yöneticisini başlat
   */
  async init() {
    this.moduleContainer = document.getElementById('page-content');
    
    if (!this.moduleContainer) {
      console.error('page-content elementi bulunamadı, ModuleManager başlatılamıyor');
      return;
    }
    
    // Modül değiştirme olaylarını dinle
    window.EventSystem.on(window.FurkAIEvents.MODULE_CHANGED, this.loadModule.bind(this));
    
    // Modül butonlarına tıklama olaylarını ekle
    this.setupModuleButtons();
    
    // Varsayılan modülü yükle
    const defaultModule = this.getModuleFromURL() || 'yemek';
    await this.loadModule(defaultModule);
  }

  /**
   * Modül butonlarını ayarla
   */
  setupModuleButtons() {
    const moduleButtons = document.querySelectorAll('.module-btn');
    
    moduleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const moduleName = button.dataset.module;
        this.switchModule(moduleName);
      });
    });
  }

  /**
   * Modülü kaydet
   * @param {string} name - Modül adı
   * @param {Object} module - Modül objesi
   */
  registerModule(name, module) {
    this.modules.set(name, {
      name,
      instance: module,
      loaded: false,
      element: null
    });
  }

  /**
   * Modülü yükle
   * @param {string} moduleName - Modül adı
   */
  async loadModule(moduleName) {
    if (this.currentModule === moduleName) return;

    // Mevcut modülü kapat
    if (this.currentModule) {
      await this.unloadModule(this.currentModule);
    }

    // Yeni modülü yükle
    const module = this.modules.get(moduleName);
    if (!module) {
      console.error(`Modül bulunamadı: ${moduleName}`);
      return;
    }

    try {
      // Modül HTML'ini oluştur
      const moduleHTML = await module.instance.render();
      
      if (!this.moduleContainer) {
        console.error('moduleContainer bulunamadı, modül yüklenemiyor');
        return;
      }
      
      this.moduleContainer.innerHTML = moduleHTML;
      
      // Modül elementini kaydet
      module.element = this.moduleContainer;
      module.loaded = true;
      
      // Modülü başlat
      if (typeof module.instance.init === 'function') {
        await module.instance.init();
      }

      // UI'yi güncelle
      this.updateModuleButtons(moduleName);
      
      // Olayı tetikle
      window.EventSystem.emit(window.FurkAIEvents.MODULE_LOADED, moduleName);
      
      this.currentModule = moduleName;
      
    } catch (error) {
      console.error(`Modül yüklenemedi: ${moduleName}`, error);
      this.showError(`Modül yüklenemedi: ${moduleName}`);
    }
  }

  /**
   * Modülü kapat
   * @param {string} moduleName - Modül adı
   */
  async unloadModule(moduleName) {
    const module = this.modules.get(moduleName);
    if (!module || !module.loaded) return;

    try {
      // Modül temizleme işlemi
      if (typeof module.instance.cleanup === 'function') {
        await module.instance.cleanup();
      }

      // Modül durumunu güncelle
      module.loaded = false;
      module.element = null;

      // Olayı tetikle
      window.EventSystem.emit(window.FurkAIEvents.MODULE_UNLOADED, moduleName);
      
    } catch (error) {
      console.error(`Modül kapatılamadı: ${moduleName}`, error);
    }
  }

  /**
   * Modülü değiştir
   * @param {string} moduleName - Modül adı
   */
  switchModule(moduleName) {
    window.EventSystem.emit(window.FurkAIEvents.MODULE_CHANGED, moduleName);
    
    // URL'yi güncelle
    this.updateURL(moduleName);
  }

  /**
   * Modül butonlarını güncelle
   * @param {string} activeModule - Aktif modül adı
   */
  updateModuleButtons(activeModule) {
    const moduleButtons = document.querySelectorAll('.module-btn');
    
    moduleButtons.forEach(button => {
      if (button.dataset.module === activeModule) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  /**
   * URL'den modül adını al
   * @returns {string|null}
   */
  getModuleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('module');
  }

  /**
   * URL'yi güncelle
   * @param {string} moduleName - Modül adı
   */
  updateURL(moduleName) {
    const url = new URL(window.location);
    url.searchParams.set('module', moduleName);
    window.history.pushState({}, '', url);
  }

  /**
   * Hata göster
   * @param {string} message - Hata mesajı
   */
  showError(message) {
    this.moduleContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Hata</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="location.reload()">Yeniden Yükle</button>
      </div>
    `;
  }

  /**
   * Modül listesini al
   * @returns {Array}
   */
  getModules() {
    return Array.from(this.modules.keys());
  }

  /**
   * Modül durumunu al
   * @param {string} moduleName - Modül adı
   * @returns {Object|null}
   */
  getModuleStatus(moduleName) {
    return this.modules.get(moduleName) || null;
  }
}

/**
 * Base Module Class
 * Tüm modüller bu sınıftan türetilir
 */
class BaseModule {
  constructor(name) {
    this.name = name;
    this.dataManager = window.DataManager;
    this.eventSystem = window.EventSystem;
    this.events = window.FurkAIEvents;
  }

  /**
   * Modül HTML'ini render et (override edilmeli)
   * @returns {Promise<string>}
   */
  async render() {
    throw new Error('render() method must be implemented');
  }

  /**
   * Modülü başlat (override edilebilir)
   */
  async init() {
    // Varsayılan implementasyon
  }

  /**
   * Modülü temizle (override edilebilir)
   */
  async cleanup() {
    // Varsayılan implementasyon
  }

  /**
   * Veri kaydet
   * @param {Object} data - Kaydedilecek veri
   * @returns {Promise<number>}
   */
  async saveData(data) {
    return this.dataManager.add(this.name, data);
  }

  /**
   * Veri güncelle
   * @param {Object} data - Güncellenecek veri
   * @returns {Promise<void>}
   */
  async updateData(data) {
    return this.dataManager.update(this.name, data);
  }

  /**
   * Veri sil
   * @param {number} id - Veri ID'si
   * @returns {Promise<void>}
   */
  async deleteData(id) {
    return this.dataManager.delete(this.name, id);
  }

  /**
   * Veri getir
   * @param {Object} options - Seçenekler
   * @returns {Promise<Array>}
   */
  async getData(options = {}) {
    return this.dataManager.getAll(this.name, options);
  }

  /**
   * ID ile veri getir
   * @param {number} id - Veri ID'si
   * @returns {Promise<Object>}
   */
  async getDataById(id) {
    return this.dataManager.getById(this.name, id);
  }

  /**
   * Arama yap
   * @param {string} indexName - Index adı
   * @param {any} value - Arama değeri
   * @returns {Promise<Array>}
   */
  async searchData(indexName, value) {
    return this.dataManager.search(this.name, indexName, value);
  }

  /**
   * Olay dinle
   * @param {string} eventName - Olay adı
   * @param {Function} callback - Geri çağırma fonksiyonu
   */
  on(eventName, callback) {
    this.eventSystem.on(eventName, callback, this);
  }

  /**
   * Olay tetikle
   * @param {string} eventName - Olay adı
   * @param {...any} args - Olay argümanları
   */
  emit(eventName, ...args) {
    this.eventSystem.emit(eventName, ...args);
  }

  /**
   * Olay dinlemeyi durdur
   * @param {string} eventName - Olay adı
   * @param {Function} callback - Geri çağırma fonksiyonu
   */
  off(eventName, callback) {
    this.eventSystem.off(eventName, callback);
  }
}

// Global module manager instance
window.ModuleManager = new ModuleManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModuleManager, BaseModule };
}
