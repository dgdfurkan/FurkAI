/**
 * FurkAI Notification Manager
 * PWA bildirim yönetim sistemi - Geçici olarak devre dışı
 */

class NotificationManager {
  constructor() {
    console.log('NotificationManager geçici olarak devre dışı');
  }

  async init() {
    console.log('NotificationManager init - geçici olarak devre dışı');
    return Promise.resolve();
  }
}

// Global notification manager instance
window.NotificationManager = new NotificationManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationManager;
}