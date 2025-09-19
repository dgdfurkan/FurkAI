/**
 * FurkAI Spor Module
 * Spor programı, streak takibi ve ilerleme yönetimi
 */

class SporModule extends BaseModule {
  constructor() {
    super('spor');
    this.currentView = 'program';
    this.programlar = [];
    this.seanslar = [];
    this.streakData = {};
  }

  /**
   * Modül HTML'ini render et
   */
  async render() {
    return `
      <div class="spor-module">
        <!-- Spor Modülü Navigasyonu -->
        <div class="module-nav-tabs">
          <button class="tab-btn active" data-tab="program">
            <span class="tab-icon">📋</span>
            <span class="tab-label">Program</span>
          </button>
          <button class="tab-btn" data-tab="seans">
            <span class="tab-icon">🏃</span>
            <span class="tab-label">Seans</span>
          </button>
          <button class="tab-btn" data-tab="streak">
            <span class="tab-icon">🔥</span>
            <span class="tab-label">Streak</span>
          </button>
          <button class="tab-btn" data-tab="istatistik">
            <span class="tab-icon">📊</span>
            <span class="tab-label">İstatistik</span>
          </button>
        </div>

        <!-- İçerik Alanı -->
        <div class="module-content-area">
          <!-- Program Sekmesi -->
          <div id="program-content" class="tab-content active">
            <div class="content-header">
              <h2>Spor Programları</h2>
              <div class="header-actions">
                <button class="btn btn-primary" id="add-program">
                  <span class="icon">+</span>
                  Program Oluştur
                </button>
              </div>
            </div>

            <div id="programlar-grid" class="programlar-grid">
              <!-- Programlar buraya yüklenecek -->
            </div>
          </div>

          <!-- Seans Sekmesi -->
          <div id="seans-content" class="tab-content">
            <div class="content-header">
              <h2>Bugünkü Seans</h2>
              <div class="header-actions">
                <button class="btn btn-primary" id="start-seans">
                  <span class="icon">▶️</span>
                  Seansı Başlat
                </button>
                <button class="btn btn-secondary" id="quick-workout">
                  <span class="icon">⚡</span>
                  Hızlı Antrenman
                </button>
              </div>
            </div>

            <div id="seans-container" class="seans-container">
              <!-- Seans içeriği buraya yüklenecek -->
            </div>
          </div>

          <!-- Streak Sekmesi -->
          <div id="streak-content" class="tab-content">
            <div class="content-header">
              <h2>Streak Takibi</h2>
            </div>

            <div class="streak-overview">
              <div class="streak-card">
                <div class="streak-number">${this.getCurrentStreak()}</div>
                <div class="streak-label">Günlük Streak</div>
              </div>
              <div class="streak-card">
                <div class="streak-number">${this.getWeeklyGoal()}</div>
                <div class="streak-label">Haftalık Hedef</div>
              </div>
              <div class="streak-card">
                <div class="streak-number">${this.getMonthlyGoal()}</div>
                <div class="streak-label">Aylık Hedef</div>
              </div>
            </div>

            <div id="streak-calendar" class="streak-calendar">
              <!-- Streak takvimi buraya yüklenecek -->
            </div>
          </div>

          <!-- İstatistik Sekmesi -->
          <div id="istatistik-content" class="tab-content">
            <div class="content-header">
              <h2>İstatistikler</h2>
              <div class="header-actions">
                <select id="stats-period" class="form-select">
                  <option value="7">Son 7 Gün</option>
                  <option value="30">Son 30 Gün</option>
                  <option value="90">Son 3 Ay</option>
                  <option value="365">Son 1 Yıl</option>
                </select>
              </div>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-value" id="total-time">0</div>
                <div class="stat-label">Toplam Süre</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🏃</div>
                <div class="stat-value" id="total-sessions">0</div>
                <div class="stat-label">Toplam Seans</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">🔥</div>
                <div class="stat-value" id="avg-calories">0</div>
                <div class="stat-label">Ortalama Kalori</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-value" id="consistency">0%</div>
                <div class="stat-label">Tutarlılık</div>
              </div>
            </div>

            <div id="stats-chart" class="stats-chart">
              <!-- Grafik buraya yüklenecek -->
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
    await this.loadData();
    this.setupUIEvents();
    await this.loadTabContent('program');
  }

  /**
   * Verileri yükle
   */
  async loadData() {
    try {
      this.programlar = await this.getData({ filter: item => item.type === 'program' });
      this.seanslar = await this.getData({ filter: item => item.type === 'seans' });
      this.streakData = await this.getData({ filter: item => item.type === 'streak' });
    } catch (error) {
      console.error('Spor modülü verileri yüklenemedi:', error);
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

    // Program olayları
    document.getElementById('add-program')?.addEventListener('click', () => {
      this.showAddProgramModal();
    });

    // Seans olayları
    document.getElementById('start-seans')?.addEventListener('click', () => {
      this.startSeans();
    });

    document.getElementById('quick-workout')?.addEventListener('click', () => {
      this.showQuickWorkoutModal();
    });

    // İstatistik olayları
    document.getElementById('stats-period')?.addEventListener('change', (e) => {
      this.updateStats(e.target.value);
    });
  }

  /**
   * Sekme değiştir
   * @param {string} tabName - Sekme adı
   */
  async switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      }
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-content`).classList.add('active');

    await this.loadTabContent(tabName);
  }

  /**
   * Sekme içeriğini yükle
   * @param {string} tabName - Sekme adı
   */
  async loadTabContent(tabName) {
    switch (tabName) {
      case 'program':
        await this.renderProgramlarGrid();
        break;
      case 'seans':
        await this.renderSeansContainer();
        break;
      case 'streak':
        await this.renderStreakCalendar();
        break;
      case 'istatistik':
        await this.renderStats();
        break;
    }
  }

  /**
   * Programlar grid'ini render et
   */
  async renderProgramlarGrid() {
    const grid = document.getElementById('programlar-grid');
    
    if (this.programlar.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>Program Yok</h3>
          <p>Henüz hiç spor programı oluşturulmamış. İlk programınızı oluşturun!</p>
          <button class="btn btn-primary" onclick="window.ModuleManager.modules.get('spor').instance.showAddProgramModal()">
            Program Oluştur
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.programlar.map(program => `
      <div class="program-card" data-id="${program.id}">
        <div class="program-header">
          <h3 class="program-title">${program.name}</h3>
          <div class="program-type">${this.getProgramTypeName(program.type)}</div>
        </div>
        <div class="program-content">
          <p class="program-description">${program.description}</p>
          <div class="program-meta">
            <span class="program-duration">${program.duration} dk</span>
            <span class="program-frequency">${program.frequency} gün/hafta</span>
          </div>
          <div class="program-exercises">
            <h4>Egzersizler:</h4>
            <ul>
              ${program.exercises.map(exercise => `<li>${exercise.name} - ${exercise.sets}x${exercise.reps}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="program-actions">
          <button class="btn btn-primary btn-sm" onclick="window.ModuleManager.modules.get('spor').instance.startProgram(${program.id})">
            Başlat
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.ModuleManager.modules.get('spor').instance.editProgram(${program.id})">
            Düzenle
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.ModuleManager.modules.get('spor').instance.deleteProgram(${program.id})">
            Sil
          </button>
        </div>
      </div>
    `).join('');
  }

  /**
   * Program tipi adını al
   * @param {string} type - Program tipi
   * @returns {string} - Program tipi adı
   */
  getProgramTypeName(type) {
    const types = {
      'full-body': 'Tam Vücut',
      'upper-lower': 'Üst-Alt',
      'push-pull-legs': 'Push-Pull-Legs',
      'hiit': 'HIIT',
      'cardio': 'Kardiyo',
      'strength': 'Güç',
      'flexibility': 'Esneklik'
    };
    return types[type] || 'Diğer';
  }

  /**
   * Mevcut streak'i al
   * @returns {number} - Streak günü
   */
  getCurrentStreak() {
    // Streak hesaplama mantığı implement edilecek
    return 7;
  }

  /**
   * Haftalık hedefi al
   * @returns {number} - Haftalık hedef
   */
  getWeeklyGoal() {
    return 3;
  }

  /**
   * Aylık hedefi al
   * @returns {number} - Aylık hedef
   */
  getMonthlyGoal() {
    return 12;
  }

  /**
   * Program ekleme modalını göster
   */
  showAddProgramModal() {
    console.log('Program ekleme modalı açılıyor...');
  }

  /**
   * Programı başlat
   * @param {number} programId - Program ID'si
   */
  startProgram(programId) {
    console.log('Program başlatılıyor:', programId);
  }

  /**
   * Programı düzenle
   * @param {number} programId - Program ID'si
   */
  editProgram(programId) {
    console.log('Program düzenleniyor:', programId);
  }

  /**
   * Programı sil
   * @param {number} programId - Program ID'si
   */
  async deleteProgram(programId) {
    if (confirm('Bu programı silmek istediğinizden emin misiniz?')) {
      try {
        await this.deleteData(programId);
        await this.loadData();
        await this.renderProgramlarGrid();
      } catch (error) {
        console.error('Program silinemedi:', error);
      }
    }
  }

  /**
   * Seansı başlat
   */
  startSeans() {
    console.log('Seans başlatılıyor...');
  }

  /**
   * Hızlı antrenman modalını göster
   */
  showQuickWorkoutModal() {
    console.log('Hızlı antrenman modalı açılıyor...');
  }

  /**
   * Seans container'ını render et
   */
  async renderSeansContainer() {
    const container = document.getElementById('seans-container');
    container.innerHTML = `
      <div class="seans-timer">
        <div class="timer-display">00:00</div>
        <div class="timer-controls">
          <button class="btn btn-primary" id="start-timer">Başlat</button>
          <button class="btn btn-secondary" id="pause-timer">Duraklat</button>
          <button class="btn btn-outline" id="reset-timer">Sıfırla</button>
        </div>
      </div>
      <div class="seans-exercises">
        <h3>Bugünkü Egzersizler</h3>
        <div class="exercise-list">
          <!-- Egzersizler buraya yüklenecek -->
        </div>
      </div>
    `;
  }

  /**
   * Streak takvimini render et
   */
  async renderStreakCalendar() {
    const calendar = document.getElementById('streak-calendar');
    calendar.innerHTML = `
      <div class="calendar-grid">
        <!-- Takvim ızgarası buraya yüklenecek -->
      </div>
    `;
  }

  /**
   * İstatistikleri render et
   */
  async renderStats() {
    // İstatistik hesaplama ve render etme implement edilecek
    console.log('İstatistikler render ediliyor...');
  }

  /**
   * İstatistikleri güncelle
   * @param {string} period - Dönem
   */
  updateStats(period) {
    console.log('İstatistikler güncelleniyor:', period);
  }

  /**
   * Modülü temizle
   */
  async cleanup() {
    // Temizleme işlemleri
  }
}

// Modülü kaydet
window.ModuleManager.registerModule('spor', new SporModule());

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SporModule;
}
