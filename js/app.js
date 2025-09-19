/**
 * FurkAI Main Application
 * Ana uygulama sınıfı ve başlatma mantığı
 */

class FurkAIApp {
  constructor() {
    this.isInitialized = false;
    this.currentTheme = 'dark';
    this.currentView = 'daily';
    this.loadingScreen = null;
    this.appContainer = null;
  }

  /**
   * Uygulamayı başlat
   */
  async init() {
    try {
      console.log('FurkAI başlatılıyor...');
      
      // DOM elementlerini al
      this.loadingScreen = document.getElementById('loading-screen');
      this.appContainer = document.getElementById('app');
      
      console.log('DOM elementleri:', {
        loadingScreen: !!this.loadingScreen,
        appContainer: !!this.appContainer
      });
      
      if (!this.loadingScreen || !this.appContainer) {
        throw new Error('Gerekli DOM elementleri bulunamadı');
      }
      
      // Global değişkenleri kontrol et
      console.log('Global değişkenler:', {
        DataManager: !!window.DataManager,
        ModuleManager: !!window.ModuleManager,
        EventSystem: !!window.EventSystem,
        FurkAIEvents: !!window.FurkAIEvents
      });
      
      if (!window.DataManager) {
        throw new Error('DataManager yüklenemedi');
      }
      
      if (!window.ModuleManager) {
        throw new Error('ModuleManager yüklenemedi');
      }
      
      // Veritabanını başlat
      await window.DataManager.init();
      console.log('Veritabanı başlatıldı');
      
      // Bildirim yöneticisini başlat
      if (window.NotificationManager) {
        await window.NotificationManager.init();
        console.log('Bildirim yöneticisi başlatıldı');
      } else {
        console.warn('NotificationManager yüklenemedi, bildirimler devre dışı');
      }
      
      // Modül yöneticisini başlat
      await window.ModuleManager.init();
      console.log('Modül yöneticisi başlatıldı');
      
      // Todo modülünü başlat
      if (window.TodoModule) {
        await window.TodoModule.init();
        console.log('Todo modülü başlatıldı');
      } else {
        console.warn('TodoModule yüklenemedi');
      }

      // Tutorial yöneticisini başlat
      if (window.TutorialManager) {
        await window.TutorialManager.init();
        console.log('Tutorial yöneticisi başlatıldı');
      } else {
        console.warn('TutorialManager yüklenemedi');
      }

      // Rutinler modülünü başlat
      if (window.RutinlerModule) {
        await window.RutinlerModule.init();
        console.log('Rutinler modülü başlatıldı');
      } else {
        console.warn('RutinlerModule yüklenemedi');
      }
      
      // UI olaylarını ayarla
      this.setupUIEvents();
      
      // Ayarları yükle
      await this.loadSettings();
      
      // Uygulamayı göster
      this.showApp();
      
      // Sayfa yöneticisini başlat (DOM tamamen hazır olduktan sonra)
      setTimeout(async () => {
        console.log('PageManager başlatılmaya çalışılıyor...');
        const content = document.getElementById('page-content');
        console.log('page-content elementi:', content);
        
        if (window.PageManager && content) {
          try {
            await window.PageManager.init();
            console.log('Sayfa yöneticisi başlatıldı');
          } catch (error) {
            console.error('PageManager başlatma hatası:', error);
          }
        } else {
          console.warn('PageManager veya page-content elementi bulunamadı');
        }
      }, 100);
      
      this.isInitialized = true;
      console.log('FurkAI başarıyla başlatıldı');
      
    } catch (error) {
      console.error('FurkAI başlatılamadı:', error);
      this.showError(`Uygulama başlatılamadı: ${error.message}`);
    }
  }

  /**
   * UI olaylarını ayarla
   */
  setupUIEvents() {
    // Görünüm değiştirme
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const view = button.dataset.view;
        this.switchView(view);
      });
    });

    // Ayarlar modalı
    const settingsModal = document.getElementById('settings-modal');
    const modalClose = settingsModal?.querySelector('.modal-close');

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        this.closeSettings();
      });
    }

    // Modal dışına tıklama
    if (settingsModal) {
      settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
          this.closeSettings();
        }
      });
    }

    // Tema değiştirme
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        this.switchTheme(theme);
      });
    });

    // Bildirim ayarları
    const notificationsToggle = document.getElementById('notifications-enabled');
    if (notificationsToggle) {
      notificationsToggle.addEventListener('change', (e) => {
        this.toggleNotifications(e.target.checked);
      });
    }

    // FAB (Floating Action Button)
    const fab = document.getElementById('fab');
    if (fab) {
      fab.addEventListener('click', () => {
        this.handleFABClick();
      });
    }

    // Klavye kısayolları
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // PWA yükleme olayları
    window.addEventListener('beforeinstallprompt', (e) => {
      this.handleInstallPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA yüklendi');
    });

    // Online/Offline olayları
    window.addEventListener('online', () => {
      this.handleOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      this.handleOnlineStatus(false);
    });
  }

  /**
   * Ayarları yükle
   */
  async loadSettings() {
    try {
      // Tema ayarı
      const savedTheme = await window.DataManager.getSetting('theme', 'dark');
      this.switchTheme(savedTheme);

      // Bildirim ayarı
      const notificationsEnabled = await window.DataManager.getSetting('notifications', false);
      document.getElementById('notifications-enabled').checked = notificationsEnabled;

      // OpenAI API anahtarı
      const openaiKey = await window.DataManager.getSetting('openai_key', '');
      document.getElementById('openai-key').value = openaiKey;

      // Görünüm ayarı
      const savedView = await window.DataManager.getSetting('view', 'daily');
      this.switchView(savedView);

    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
    }
  }

  /**
   * Uygulamayı göster
   */
  showApp() {
    this.loadingScreen.style.display = 'none';
    this.appContainer.style.display = 'flex';
    
    // Animasyon ekle
    this.appContainer.style.opacity = '0';
    this.appContainer.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
      this.appContainer.style.transition = 'all 0.3s ease-out';
      this.appContainer.style.opacity = '1';
      this.appContainer.style.transform = 'translateY(0)';
    });
  }

  /**
   * Hata göster
   * @param {string} message - Hata mesajı
   */
  showError(message) {
    if (this.loadingScreen) {
      this.loadingScreen.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Hata</h3>
          <p>${message}</p>
          <button class="btn btn-primary" onclick="location.reload()">Yeniden Dene</button>
          <button class="btn btn-secondary" onclick="window.open('debug.html', '_blank')">Debug Sayfası</button>
        </div>
      `;
    } else {
      // Fallback: document.body'e hata mesajı ekle
      document.body.innerHTML = `
        <div style="padding: 20px; text-align: center; background-color: #1a1b23; color: #ffffff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
          <h1 style="color: #f44336;">FurkAI Başlatılamadı</h1>
          <p style="margin: 20px 0; color: #b0b0b0;">${message}</p>
          <button onclick="location.reload()" style="background-color: #4fc3f7; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin: 10px;">Yeniden Dene</button>
          <button onclick="window.open('debug.html', '_blank')" style="background-color: #2d2e3a; color: white; border: 1px solid #404040; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin: 10px;">Debug Sayfası</button>
        </div>
      `;
    }
  }

  /**
   * Görünümü değiştir
   * @param {string} view - Görünüm adı
   */
  switchView(view) {
    if (this.currentView === view) return;

    // Butonları güncelle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === view) {
        btn.classList.add('active');
      }
    });

    this.currentView = view;
    
    // Ayarı kaydet
    window.DataManager.saveSetting('view', view);
    
    // Olayı tetikle
    window.EventSystem.emit(window.FurkAIEvents.VIEW_CHANGED, view);
  }

  /**
   * Temayı değiştir
   * @param {string} theme - Tema adı
   */
  switchTheme(theme) {
    if (this.currentTheme === theme) return;

    // Butonları güncelle
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      }
    });

    // Tema değiştir
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    
    // Ayarı kaydet
    window.DataManager.saveSetting('theme', theme);
    
    // Olayı tetikle
    window.EventSystem.emit(window.FurkAIEvents.THEME_CHANGED, theme);
  }

  /**
   * Ayarları aç
   */
  openSettings() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'flex';
    
    // Animasyon
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });

    window.EventSystem.emit(window.FurkAIEvents.MODAL_OPENED, 'settings');
  }

  /**
   * Ayarları kapat
   */
  closeSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('show');
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);

    window.EventSystem.emit(window.FurkAIEvents.MODAL_CLOSED, 'settings');
  }

  /**
   * Bildirimleri aç/kapat
   * @param {boolean} enabled - Bildirimler açık mı
   */
  async toggleNotifications(enabled) {
    if (enabled) {
      const granted = await window.NotificationManager.requestPermission();
      if (!granted) {
        document.getElementById('notifications-enabled').checked = false;
        return;
      }
    }

    await window.DataManager.saveSetting('notifications', enabled);
  }

  /**
   * FAB tıklama olayını işle
   */
  handleFABClick() {
    const currentModule = window.ModuleManager.currentModule;
    
    // Mevcut modüle göre hızlı ekleme
    switch (currentModule) {
      case 'yemek':
        this.showQuickAddModal('yemek');
        break;
      case 'spor':
        this.showQuickAddModal('spor');
        break;
      case 'todo':
        this.showQuickAddModal('todo');
        break;
      default:
        // Varsayılan olarak todo ekleme
        this.showQuickAddModal('todo');
    }
  }

  /**
   * Hızlı ekleme modalını göster
   * @param {string} module - Modül adı
   */
  showQuickAddModal(module) {
    // Bu fonksiyon modül spesifik olarak implement edilecek
    console.log(`Hızlı ekleme: ${module}`);
  }

  /**
   * Klavye kısayollarını işle
   * @param {KeyboardEvent} e - Klavye olayı
   */
  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K: Arama
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.showSearch();
    }

    // Ctrl/Cmd + ,: Ayarlar
    if ((e.ctrlKey || e.metaKey) && e.key === ',') {
      e.preventDefault();
      this.openSettings();
    }

    // Escape: Modalları kapat
    if (e.key === 'Escape') {
      this.closeSettings();
    }
  }

  /**
   * Arama göster
   */
  showSearch() {
    // Arama modalı implement edilecek
    console.log('Arama açılıyor...');
  }

  /**
   * PWA yükleme istemini işle
   * @param {Event} e - Yükleme istemi olayı
   */
  handleInstallPrompt(e) {
    e.preventDefault();
    
    // Yükleme butonu göster
    const installBtn = document.createElement('button');
    installBtn.textContent = 'Uygulamayı Yükle';
    installBtn.className = 'btn btn-primary';
    installBtn.onclick = () => {
      e.prompt();
      e.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA yükleme kabul edildi');
        }
        installBtn.remove();
      });
    };
    
    // Header'a ekle
    const headerActions = document.querySelector('.header-actions');
    headerActions.appendChild(installBtn);
  }

  /**
   * Online/Offline durumunu işle
   * @param {boolean} isOnline - Online mı
   */
  handleOnlineStatus(isOnline) {
    if (isOnline) {
      console.log('İnternet bağlantısı sağlandı');
    } else {
      console.log('İnternet bağlantısı kesildi');
    }
  }

  /**
   * Uygulamayı kapat
   */
  async cleanup() {
    if (!this.isInitialized) return;

    try {
      // Modülleri temizle
      const modules = window.ModuleManager.getModules();
      for (const moduleName of modules) {
        await window.ModuleManager.unloadModule(moduleName);
      }

      // Olay dinleyicilerini temizle
      window.EventSystem.removeAllListeners();

      console.log('FurkAI temizlendi');
    } catch (error) {
      console.error('Temizleme hatası:', error);
    }
  }
}

// Global app instance
window.FurkAIApp = new FurkAIApp();

// Uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
  window.FurkAIApp.init();
});

// Sayfa kapatılırken temizle
window.addEventListener('beforeunload', () => {
  window.FurkAIApp.cleanup();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FurkAIApp;
}
