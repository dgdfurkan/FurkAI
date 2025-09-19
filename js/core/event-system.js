/**
 * FurkAI Event System
 * SOLID principles ile tasarlanmış olay yönetim sistemi
 */

class EventSystem {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
  }

  /**
   * Olay dinleyicisi ekle
   * @param {string} eventName - Olay adı
   * @param {Function} callback - Geri çağırma fonksiyonu
   * @param {Object} context - Bağlam (this)
   */
  on(eventName, callback, context = null) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    this.events.get(eventName).push({
      callback,
      context,
      once: false
    });
  }

  /**
   * Tek seferlik olay dinleyicisi ekle
   * @param {string} eventName - Olay adı
   * @param {Function} callback - Geri çağırma fonksiyonu
   * @param {Object} context - Bağlam (this)
   */
  once(eventName, callback, context = null) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    this.events.get(eventName).push({
      callback,
      context,
      once: true
    });
  }

  /**
   * Olay tetikle
   * @param {string} eventName - Olay adı
   * @param {...any} args - Olay argümanları
   */
  emit(eventName, ...args) {
    const listeners = this.events.get(eventName);
    if (!listeners) return;

    // Once listeners'ı ayrı tut
    const onceListeners = [];
    const regularListeners = [];

    listeners.forEach(listener => {
      if (listener.once) {
        onceListeners.push(listener);
      } else {
        regularListeners.push(listener);
      }
    });

    // Regular listeners'ı çalıştır
    regularListeners.forEach(listener => {
      try {
        if (listener.context) {
          listener.callback.apply(listener.context, args);
        } else {
          listener.callback(...args);
        }
      } catch (error) {
        console.error(`Event listener error for ${eventName}:`, error);
      }
    });

    // Once listeners'ı çalıştır ve kaldır
    onceListeners.forEach(listener => {
      try {
        if (listener.context) {
          listener.callback.apply(listener.context, args);
        } else {
          listener.callback(...args);
        }
      } catch (error) {
        console.error(`Event listener error for ${eventName}:`, error);
      }
    });

    // Once listeners'ı temizle
    if (onceListeners.length > 0) {
      this.events.set(eventName, regularListeners);
    }
  }

  /**
   * Olay dinleyicisini kaldır
   * @param {string} eventName - Olay adı
   * @param {Function} callback - Geri çağırma fonksiyonu
   */
  off(eventName, callback) {
    const listeners = this.events.get(eventName);
    if (!listeners) return;

    const filteredListeners = listeners.filter(listener => 
      listener.callback !== callback
    );

    if (filteredListeners.length === 0) {
      this.events.delete(eventName);
    } else {
      this.events.set(eventName, filteredListeners);
    }
  }

  /**
   * Tüm olay dinleyicilerini kaldır
   * @param {string} eventName - Olay adı (opsiyonel)
   */
  removeAllListeners(eventName = null) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }

  /**
   * Olay dinleyicisi sayısını al
   * @param {string} eventName - Olay adı
   * @returns {number}
   */
  listenerCount(eventName) {
    const listeners = this.events.get(eventName);
    return listeners ? listeners.length : 0;
  }

  /**
   * Tüm olay adlarını al
   * @returns {Array<string>}
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
}

// Global event system instance
window.EventSystem = new EventSystem();

// FurkAI specific events
window.FurkAIEvents = {
  // Module events
  MODULE_CHANGED: 'module:changed',
  MODULE_LOADED: 'module:loaded',
  MODULE_UNLOADED: 'module:unloaded',
  
  // Data events
  DATA_SAVED: 'data:saved',
  DATA_LOADED: 'data:loaded',
  DATA_DELETED: 'data:deleted',
  
  // UI events
  VIEW_CHANGED: 'view:changed',
  THEME_CHANGED: 'theme:changed',
  MODAL_OPENED: 'modal:opened',
  MODAL_CLOSED: 'modal:closed',
  
  // Notification events
  NOTIFICATION_REQUESTED: 'notification:requested',
  NOTIFICATION_SENT: 'notification:sent',
  NOTIFICATION_CLICKED: 'notification:clicked',
  
  // Yemek module events
  YEMEK_PLAN_CREATED: 'yemek:plan:created',
  YEMEK_PLAN_UPDATED: 'yemek:plan:updated',
  KILER_ITEM_ADDED: 'kiler:item:added',
  KILER_ITEM_UPDATED: 'kiler:item:updated',
  KILER_ITEM_DELETED: 'kiler:item:deleted',
  TARIF_CREATED: 'tarif:created',
  TARIF_UPDATED: 'tarif:updated',
  ALISVERIS_LISTE_UPDATED: 'alisveris:liste:updated',
  
  // Spor module events
  SPOR_PROGRAM_CREATED: 'spor:program:created',
  SPOR_SEANS_STARTED: 'spor:seans:started',
  SPOR_SEANS_COMPLETED: 'spor:seans:completed',
  SPOR_STREAK_UPDATED: 'spor:streak:updated',
  
  // Namaz module events
  NAMAZ_VAKIT_ADDED: 'namaz:vakit:added',
  NAMAZ_VAKIT_UPDATED: 'namaz:vakit:updated',
  NAMAZ_KILINDI: 'namaz:kilindi',
  
  // Ezber module events
  EZBER_HEDEF_ADDED: 'ezber:hedef:added',
  EZBER_TEKRAR_COMPLETED: 'ezber:tekrar:completed',
  EZBER_PROGRESS_UPDATED: 'ezber:progress:updated',
  
  // Zincir module events
  ZINCIR_CREATED: 'zincir:created',
  ZINCIR_COMPLETED: 'zincir:completed',
  ZINCIR_BROKEN: 'zincir:broken',
  
  // Todo module events
  TODO_CREATED: 'todo:created',
  TODO_UPDATED: 'todo:updated',
  TODO_COMPLETED: 'todo:completed',
  TODO_DELETED: 'todo:deleted',
  
  // AI events
  AI_REQUEST_STARTED: 'ai:request:started',
  AI_REQUEST_COMPLETED: 'ai:request:completed',
  AI_REQUEST_FAILED: 'ai:request:failed'
};

// Event system helper functions
window.EventHelpers = {
  /**
   * Debounced event emitter
   * @param {string} eventName - Olay adı
   * @param {number} delay - Gecikme (ms)
   * @param {...any} args - Olay argümanları
   */
  debounceEmit(eventName, delay, ...args) {
    clearTimeout(this._debounceTimers?.[eventName]);
    this._debounceTimers = this._debounceTimers || {};
    
    this._debounceTimers[eventName] = setTimeout(() => {
      window.EventSystem.emit(eventName, ...args);
    }, delay);
  },

  /**
   * Throttled event emitter
   * @param {string} eventName - Olay adı
   * @param {number} limit - Limit (ms)
   * @param {...any} args - Olay argümanları
   */
  throttleEmit(eventName, limit, ...args) {
    this._throttleTimers = this._throttleTimers || {};
    
    if (!this._throttleTimers[eventName]) {
      this._throttleTimers[eventName] = true;
      window.EventSystem.emit(eventName, ...args);
      
      setTimeout(() => {
        this._throttleTimers[eventName] = false;
      }, limit);
    }
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EventSystem, FurkAIEvents, EventHelpers };
}
