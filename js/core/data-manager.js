/**
 * FurkAI Data Manager
 * IndexedDB tabanlı veri yönetim sistemi
 */

class DataManager {
  constructor() {
    this.dbName = 'FurkAI';
    this.dbVersion = 2;
    this.db = null;
    this.stores = {
      yemek: 'yemek',
      spor: 'spor',
      namaz: 'namaz',
      ezber: 'ezber',
      zincir: 'zincir',
      todo: 'todo',
      rutinler: 'rutinler',
      settings: 'settings',
      notifications: 'notifications'
    };
  }

  /**
   * Veritabanını başlat
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB açılamadı:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB başarıyla açıldı');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        this.createStores(db);
      };
    });
  }

  /**
   * Veri depolarını oluştur
   * @param {IDBDatabase} db - Veritabanı
   */
  createStores(db) {
    // Yemek store
    if (!db.objectStoreNames.contains(this.stores.yemek)) {
      const yemekStore = db.createObjectStore(this.stores.yemek, { keyPath: 'id', autoIncrement: true });
      yemekStore.createIndex('type', 'type', { unique: false });
      yemekStore.createIndex('createdAt', 'createdAt', { unique: false });
    }

    // Spor store
    if (!db.objectStoreNames.contains(this.stores.spor)) {
      const sporStore = db.createObjectStore(this.stores.spor, { keyPath: 'id', autoIncrement: true });
      sporStore.createIndex('type', 'type', { unique: false });
      sporStore.createIndex('date', 'date', { unique: false });
    }

    // Namaz store
    if (!db.objectStoreNames.contains(this.stores.namaz)) {
      const namazStore = db.createObjectStore(this.stores.namaz, { keyPath: 'id', autoIncrement: true });
      namazStore.createIndex('date', 'date', { unique: false });
      namazStore.createIndex('vakit', 'vakit', { unique: false });
    }

    // Ezber store
    if (!db.objectStoreNames.contains(this.stores.ezber)) {
      const ezberStore = db.createObjectStore(this.stores.ezber, { keyPath: 'id', autoIncrement: true });
      ezberStore.createIndex('type', 'type', { unique: false });
      ezberStore.createIndex('nextReview', 'nextReview', { unique: false });
    }

    // Zincir store
    if (!db.objectStoreNames.contains(this.stores.zincir)) {
      const zincirStore = db.createObjectStore(this.stores.zincir, { keyPath: 'id', autoIncrement: true });
      zincirStore.createIndex('name', 'name', { unique: false });
      zincirStore.createIndex('date', 'date', { unique: false });
    }

    // Todo store
    if (!db.objectStoreNames.contains(this.stores.todo)) {
      const todoStore = db.createObjectStore(this.stores.todo, { keyPath: 'id', autoIncrement: true });
      todoStore.createIndex('date', 'date', { unique: false });
      todoStore.createIndex('module', 'module', { unique: false });
      todoStore.createIndex('priority', 'priority', { unique: false });
      todoStore.createIndex('completed', 'completed', { unique: false });
    }

    // Rutinler store
    if (!db.objectStoreNames.contains(this.stores.rutinler)) {
      const rutinlerStore = db.createObjectStore(this.stores.rutinler, { keyPath: 'id', autoIncrement: true });
      rutinlerStore.createIndex('category', 'category', { unique: false });
      rutinlerStore.createIndex('frequency', 'frequency', { unique: false });
      rutinlerStore.createIndex('isActive', 'isActive', { unique: false });
      rutinlerStore.createIndex('createdAt', 'createdAt', { unique: false });
    }

    // Settings store
    if (!db.objectStoreNames.contains(this.stores.settings)) {
      db.createObjectStore(this.stores.settings, { keyPath: 'key' });
    }

    // Notifications store
    if (!db.objectStoreNames.contains(this.stores.notifications)) {
      const notificationStore = db.createObjectStore(this.stores.notifications, { keyPath: 'id', autoIncrement: true });
      notificationStore.createIndex('scheduledTime', 'scheduledTime', { unique: false });
      notificationStore.createIndex('module', 'module', { unique: false });
    }
  }

  /**
   * Veri ekle
   * @param {string} storeName - Store adı
   * @param {Object} data - Veri
   * @returns {Promise<number>} - Eklenen verinin ID'si
   */
  async add(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Timestamp ekle
      data.createdAt = new Date().toISOString();
      data.updatedAt = new Date().toISOString();

      const request = store.add(data);

      request.onsuccess = () => {
        window.EventSystem.emit(window.FurkAIEvents.DATA_SAVED, storeName, data);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Veri eklenemedi:', request.error);
        reject(request.error);
      };
    });
  }

  async update(storeName, id, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Timestamp güncelle
      data.updatedAt = new Date().toISOString();

      const request = store.put({ ...data, id });

      request.onsuccess = () => {
        window.EventSystem.emit(window.FurkAIEvents.DATA_SAVED, storeName, data);
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Veri güncellenemedi:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Veri güncelle
   * @param {string} storeName - Store adı
   * @param {Object} data - Güncellenecek veri
   * @returns {Promise<void>}
   */
  async update(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Timestamp güncelle
      data.updatedAt = new Date().toISOString();

      const request = store.put(data);

      request.onsuccess = () => {
        window.EventSystem.emit(window.FurkAIEvents.DATA_SAVED, storeName, data);
        resolve();
      };

      request.onerror = () => {
        console.error('Veri güncellenemedi:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Veri sil
   * @param {string} storeName - Store adı
   * @param {number} id - Veri ID'si
   * @returns {Promise<void>}
   */
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.delete(id);

      request.onsuccess = () => {
        window.EventSystem.emit(window.FurkAIEvents.DATA_DELETED, storeName, id);
        resolve();
      };

      request.onerror = () => {
        console.error('Veri silinemedi:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * ID ile veri getir
   * @param {string} storeName - Store adı
   * @param {number} id - Veri ID'si
   * @returns {Promise<Object>}
   */
  async getById(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Veri getirilemedi:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Tüm verileri getir
   * @param {string} storeName - Store adı
   * @param {Object} options - Seçenekler
   * @returns {Promise<Array>}
   */
  async getAll(storeName, options = {}) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      let request;
      if (options.index) {
        const index = store.index(options.index);
        request = options.value ? index.getAll(options.value) : index.getAll();
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => {
        let results = request.result;
        
        // Filtreleme
        if (options.filter) {
          results = results.filter(options.filter);
        }
        
        // Sıralama
        if (options.sort) {
          results.sort(options.sort);
        }
        
        // Limit
        if (options.limit) {
          results = results.slice(0, options.limit);
        }

        resolve(results);
      };

      request.onerror = () => {
        console.error('Veriler getirilemedi:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Arama yap
   * @param {string} storeName - Store adı
   * @param {string} indexName - Index adı
   * @param {any} value - Arama değeri
   * @returns {Promise<Array>}
   */
  async search(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);

      const request = index.getAll(value);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Arama yapılamadı:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Sayım yap
   * @param {string} storeName - Store adı
   * @returns {Promise<number>}
   */
  async count(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Sayım yapılamadı:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Veritabanını temizle
   * @param {string} storeName - Store adı (opsiyonel)
   * @returns {Promise<void>}
   */
  async clear(storeName = null) {
    return new Promise((resolve, reject) => {
      const stores = storeName ? [storeName] : Object.values(this.stores);
      const transaction = this.db.transaction(stores, 'readwrite');

      let completed = 0;
      const total = stores.length;

      stores.forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };

        request.onerror = () => {
          console.error('Store temizlenemedi:', request.error);
          reject(request.error);
        };
      });
    });
  }

  /**
   * Veri dışa aktar
   * @param {string} storeName - Store adı (opsiyonel)
   * @returns {Promise<Object>}
   */
  async export(storeName = null) {
    const exportData = {};
    const stores = storeName ? [storeName] : Object.keys(this.stores);

    for (const store of stores) {
      exportData[store] = await this.getAll(store);
    }

    return exportData;
  }

  /**
   * Veri içe aktar
   * @param {Object} data - İçe aktarılacak veri
   * @returns {Promise<void>}
   */
  async import(data) {
    for (const [storeName, items] of Object.entries(data)) {
      if (this.stores[storeName]) {
        for (const item of items) {
          // ID'yi kaldır, yeni ID oluşturulsun
          delete item.id;
          await this.add(storeName, item);
        }
      }
    }
  }

  /**
   * Ayarları kaydet
   * @param {string} key - Ayar anahtarı
   * @param {any} value - Ayar değeri
   * @returns {Promise<void>}
   */
  async saveSetting(key, value) {
    return this.update(this.stores.settings, { key, value });
  }

  /**
   * Ayarı getir
   * @param {string} key - Ayar anahtarı
   * @param {any} defaultValue - Varsayılan değer
   * @returns {Promise<any>}
   */
  async getSetting(key, defaultValue = null) {
    try {
      const result = await this.getById(this.stores.settings, key);
      return result ? result.value : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }
}

// Global data manager instance
window.DataManager = new DataManager();

// Kolay erişim için get ve set metodları
window.DataManager.get = window.DataManager.getSetting.bind(window.DataManager);
window.DataManager.set = window.DataManager.saveSetting.bind(window.DataManager);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataManager;
}
