/**
 * FurkAI Page Manager
 * Sayfa yönetim sistemi
 */

class PageManager {
  constructor() {
    this.currentPage = 'home';
    this.pages = {
      home: this.createHomePage.bind(this),
      calendar: this.createCalendarPage.bind(this),
      routines: this.createRoutinesPage.bind(this),
      settings: this.createSettingsPage.bind(this)
    };
  }

  async init() {
    console.log('PageManager başlatılıyor...');
    
    // DOM elementlerinin varlığını kontrol et
    const content = document.getElementById('page-content');
    if (!content) {
      console.error('page-content elementi bulunamadı, PageManager başlatılamıyor');
      return;
    }
    
    console.log('page-content elementi bulundu, PageManager başlatılıyor');
    
    this.setupEventListeners();
    await this.loadPage('home');
  }

  setupEventListeners() {
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        this.switchPage(page);
      });
    });

    // Header buttons
    document.getElementById('notification-btn')?.addEventListener('click', () => {
      this.showNotifications();
    });

    document.getElementById('profile-btn')?.addEventListener('click', () => {
      this.showProfile();
    });

    // FAB
    document.getElementById('fab')?.addEventListener('click', () => {
      this.handleFABClick();
    });
  }

  async switchPage(pageName) {
    if (this.currentPage === pageName) return;

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Update header
    const pageTitle = document.getElementById('page-title');
    const titles = {
      home: 'Ana Ekran',
      calendar: 'Takvim',
      routines: 'Rutinler',
      settings: 'Ayarlar'
    };
    pageTitle.textContent = titles[pageName];

    // FAB'ı sadece rutinler sayfasında göster
    const fab = document.getElementById('fab');
    if (fab) {
      if (pageName === 'routines') {
        fab.classList.add('show');
      } else {
        fab.classList.remove('show');
      }
    }

    // Load page content
    await this.loadPage(pageName);
    this.currentPage = pageName;
  }

  async loadPage(pageName) {
    const content = document.getElementById('page-content');
    if (!content) {
      console.error('page-content elementi bulunamadı');
      return;
    }
    
    if (this.pages[pageName]) {
      try {
        content.innerHTML = await this.pages[pageName]();
      } catch (error) {
        console.error('Sayfa yüklenirken hata:', error);
        content.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h3>Sayfa Yüklenemedi</h3>
            <p>${error.message}</p>
          </div>
        `;
      }
    }
  }

  createHomePage() {
    return `
      <div class="dashboard-grid">
        <!-- Günlük Özet -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">Günlük Özet</h3>
            <span class="card-icon">📈</span>
          </div>
          <div class="card-content">
            <p>Bugün için planlanan aktiviteleriniz ve ilerlemeniz</p>
          </div>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-value">5</span>
              <span class="stat-label">Tamamlanan</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">3</span>
              <span class="stat-label">Bekleyen</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">85%</span>
              <span class="stat-label">İlerleme</span>
            </div>
          </div>
        </div>

        <!-- Yemek Modülü -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">Yemek</h3>
            <span class="card-icon">🍴</span>
          </div>
          <div class="card-content">
            <p>Bugünkü öğünleriniz ve AI önerileri</p>
          </div>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-value">3</span>
              <span class="stat-label">Öğün</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">1,200</span>
              <span class="stat-label">Kalori</span>
            </div>
          </div>
        </div>

        <!-- Spor Modülü -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">Spor</h3>
            <span class="card-icon">🏃‍♂️</span>
          </div>
          <div class="card-content">
            <p>Günlük egzersiz planınız ve ilerlemeniz</p>
          </div>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-value">45</span>
              <span class="stat-label">Dakika</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">7</span>
              <span class="stat-label">Gün</span>
            </div>
          </div>
        </div>

        <!-- Namaz Modülü -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3 class="card-title">Namaz</h3>
            <span class="card-icon">🕌</span>
          </div>
          <div class="card-content">
            <p>Namaz vakitleri ve hatırlatıcılar</p>
          </div>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-value">5</span>
              <span class="stat-label">Namaz</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">100%</span>
              <span class="stat-label">Tamamlanan</span>
            </div>
          </div>
        </div>
      </div>

    `;
  }

  createCalendarPage() {
    // Todo modülünü yükle
    if (window.TodoModule) {
      window.TodoModule.render();
      return '';
    }
    
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Takvim & Görevler</h3>
          <span class="card-icon">📆</span>
        </div>
        <div class="card-content">
          <p>Günlük, haftalık ve aylık planlarınızı yönetin</p>
        </div>
      </div>

      <div class="quick-actions">
        <a href="#" class="quick-action" onclick="window.TodoModule?.render()">
          <span class="quick-action-icon">📝</span>
          <span class="quick-action-label">Görev Ekle</span>
        </a>
        <a href="#" class="quick-action" onclick="window.ModuleManager?.loadModule('yemek')">
          <span class="quick-action-icon">🍴</span>
          <span class="quick-action-label">Yemek Planı</span>
        </a>
        <a href="#" class="quick-action" onclick="window.ModuleManager?.loadModule('spor')">
          <span class="quick-action-icon">🏃‍♂️</span>
          <span class="quick-action-label">Spor Planı</span>
        </a>
        <a href="#" class="quick-action" onclick="window.ModuleManager?.loadModule('namaz')">
          <span class="quick-action-icon">🕌</span>
          <span class="quick-action-label">Namaz Vakitleri</span>
        </a>
      </div>
    `;
  }

  createRoutinesPage() {
    if (window.RutinlerModule) {
      // Rutinler modülünü sadece render et, init etme
      window.RutinlerModule.render();
      return '';
    }
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Rutinler</h3>
          <span class="card-icon">🔁</span>
        </div>
        <div class="card-content">
          <p>Günlük rutinlerinizi oluşturun ve takip edin. Her rutin için kendi kurallarınızı belirleyebilirsiniz.</p>
        </div>
      </div>

      <div class="quick-actions">
        <a href="#" class="quick-action" onclick="window.ModuleManager?.loadModule('yemek')">
          <span class="quick-action-icon">🍴</span>
          <span class="quick-action-label">Yemek Rutini</span>
        </a>
        <a href="#" class="quick-action" onclick="window.ModuleManager?.loadModule('spor')">
          <span class="quick-action-icon">🏃‍♂️</span>
          <span class="quick-action-label">Egzersiz Rutini</span>
        </a>
        <a href="#" class="quick-action" onclick="window.ModuleManager?.loadModule('todo')">
          <span class="quick-action-icon">✔️</span>
          <span class="quick-action-label">Görev Rutini</span>
        </a>
        <a href="#" class="quick-action" onclick="window.ModuleManager?.loadModule('ezber')">
          <span class="quick-action-icon">📚</span>
          <span class="quick-action-label">Ezber Rutini</span>
        </a>
        <a href="#" class="quick-action" onclick="window.ModuleManager?.loadModule('zincir')">
          <span class="quick-action-icon">🔗</span>
          <span class="quick-action-label">Zincir Takibi</span>
        </a>
        <a href="#" class="quick-action" onclick="window.ModuleManager?.loadModule('namaz')">
          <span class="quick-action-icon">🕌</span>
          <span class="quick-action-label">Namaz Rutini</span>
        </a>
      </div>
    `;
  }

  createSettingsPage() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Ayarlar</h3>
          <span class="card-icon">⚙️</span>
        </div>
        <div class="card-content">
          <p>Uygulama ayarlarınızı yönetin</p>
        </div>
      </div>

      <div class="quick-actions">
        <a href="#" class="quick-action" onclick="this.showSettingsModal()">
          <span class="quick-action-icon">🔔</span>
          <span class="quick-action-label">Bildirimler</span>
        </a>
        <a href="#" class="quick-action" onclick="this.showSettingsModal()">
          <span class="quick-action-icon">🎨</span>
          <span class="quick-action-label">Tema</span>
        </a>
        <a href="#" class="quick-action" onclick="this.showSettingsModal()">
          <span class="quick-action-icon">🤖</span>
          <span class="quick-action-label">AI Ayarları</span>
        </a>
        <a href="#" class="quick-action" onclick="this.showProfile()">
          <span class="quick-action-icon">👨‍💼</span>
          <span class="quick-action-label">Profil</span>
        </a>
      </div>
    `;
  }

  showSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex';
    }
  }

  showNotifications() {
    // Bildirimler sayfası - gelecekte implement edilecek
    console.log('Bildirimler gösteriliyor');
  }

  showProfile() {
    // Profil sayfası - gelecekte implement edilecek
    console.log('Profil gösteriliyor');
  }

  handleFABClick() {
    // FAB tıklama - mevcut sayfaya göre farklı aksiyonlar
    switch (this.currentPage) {
      case 'home':
        // Hızlı görev ekleme
        break;
      case 'calendar':
        // Takvime etkinlik ekleme
        break;
      case 'routines':
        // Yeni rutin oluşturma
        break;
      case 'settings':
        // Ayarları açma
        this.showSettingsModal();
        break;
    }
  }
}

// Global olarak erişilebilir yap
window.PageManager = new PageManager();
