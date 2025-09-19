/**
 * FurkAI Zincir Module
 * Don't Break The Chain - Alışkanlık takibi
 */

class ZincirModule extends BaseModule {
  constructor() {
    super('zincir');
    this.currentView = 'zincirler';
    this.zincirler = [];
    this.kayitlar = [];
  }

  async render() {
    return `
      <div class="zincir-module">
        <div class="module-nav-tabs">
          <button class="tab-btn active" data-tab="zincirler">
            <span class="tab-icon">⛓️</span>
            <span class="tab-label">Zincirler</span>
          </button>
          <button class="tab-btn" data-tab="takvim">
            <span class="tab-icon">📅</span>
            <span class="tab-label">Takvim</span>
          </button>
          <button class="tab-btn" data-tab="rozetler">
            <span class="tab-icon">🏆</span>
            <span class="tab-label">Rozetler</span>
          </button>
        </div>

        <div class="module-content-area">
          <div id="zincirler-content" class="tab-content active">
            <div class="content-header">
              <h2>Alışkanlık Zincirleri</h2>
              <div class="header-actions">
                <button class="btn btn-primary" id="add-zincir">
                  <span class="icon">+</span>
                  Zincir Oluştur
                </button>
              </div>
            </div>

            <div id="zincirler-grid" class="zincirler-grid">
              <!-- Zincirler buraya yüklenecek -->
            </div>
          </div>

          <div id="takvim-content" class="tab-content">
            <div class="content-header">
              <h2>Zincir Takvimi</h2>
            </div>

            <div id="zincir-takvimi" class="zincir-takvimi">
              <!-- Takvim buraya yüklenecek -->
            </div>
          </div>

          <div id="rozetler-content" class="tab-content">
            <div class="content-header">
              <h2>Rozetler</h2>
            </div>

            <div id="rozetler-grid" class="rozetler-grid">
              <!-- Rozetler buraya yüklenecek -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async init() {
    await this.loadData();
    this.setupUIEvents();
    await this.loadTabContent('zincirler');
  }

  async loadData() {
    try {
      this.zincirler = await this.getData({ filter: item => item.type === 'zincir' });
      this.kayitlar = await this.getData({ filter: item => item.type === 'kayit' });
    } catch (error) {
      console.error('Zincir modülü verileri yüklenemedi:', error);
    }
  }

  setupUIEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    document.getElementById('add-zincir')?.addEventListener('click', () => {
      this.showAddZincirModal();
    });
  }

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

  async loadTabContent(tabName) {
    switch (tabName) {
      case 'zincirler':
        await this.renderZincirlerGrid();
        break;
      case 'takvim':
        await this.renderZincirTakvimi();
        break;
      case 'rozetler':
        await this.renderRozetlerGrid();
        break;
    }
  }

  async renderZincirlerGrid() {
    const grid = document.getElementById('zincirler-grid');
    
    if (this.zincirler.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⛓️</div>
          <h3>Zincir Yok</h3>
          <p>Henüz hiç alışkanlık zinciri oluşturulmamış. İlk zincirinizi oluşturun!</p>
          <button class="btn btn-primary" onclick="window.ModuleManager.modules.get('zincir').instance.showAddZincirModal()">
            Zincir Oluştur
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.zincirler.map(zincir => `
      <div class="zincir-card" data-id="${zincir.id}">
        <div class="zincir-header">
          <h3 class="zincir-title">${zincir.name}</h3>
          <div class="zincir-streak">${this.getCurrentStreak(zincir.id)} gün</div>
        </div>
        <div class="zincir-content">
          <p class="zincir-description">${zincir.description}</p>
          <div class="zincir-meta">
            <span class="zincir-frequency">${this.getFrequencyText(zincir.frequency)}</span>
            <span class="zincir-target">Hedef: ${zincir.targetDays} gün</span>
          </div>
          <div class="zincir-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${this.getProgressPercentage(zincir)}%"></div>
            </div>
            <span class="progress-text">${this.getProgressPercentage(zincir)}%</span>
          </div>
        </div>
        <div class="zincir-actions">
          <button class="btn btn-primary btn-sm" onclick="window.ModuleManager.modules.get('zincir').instance.completeToday(${zincir.id})">
            Bugünü Tamamla
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.ModuleManager.modules.get('zincir').instance.editZincir(${zincir.id})">
            Düzenle
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.ModuleManager.modules.get('zincir').instance.deleteZincir(${zincir.id})">
            Sil
          </button>
        </div>
      </div>
    `).join('');
  }

  getCurrentStreak(zincirId) {
    // Streak hesaplama mantığı implement edilecek
    return 7;
  }

  getFrequencyText(frequency) {
    const frequencies = {
      'daily': 'Günlük',
      'weekly': 'Haftalık',
      'custom': 'Özel'
    };
    return frequencies[frequency] || 'Günlük';
  }

  getProgressPercentage(zincir) {
    const currentStreak = this.getCurrentStreak(zincir.id);
    return Math.min((currentStreak / zincir.targetDays) * 100, 100);
  }

  showAddZincirModal() {
    console.log('Zincir ekleme modalı açılıyor...');
  }

  completeToday(zincirId) {
    console.log('Bugün tamamlanıyor:', zincirId);
  }

  editZincir(id) {
    console.log('Zincir düzenleniyor:', id);
  }

  async deleteZincir(id) {
    if (confirm('Bu zinciri silmek istediğinizden emin misiniz?')) {
      try {
        await this.deleteData(id);
        await this.loadData();
        await this.renderZincirlerGrid();
      } catch (error) {
        console.error('Zincir silinemedi:', error);
      }
    }
  }

  async renderZincirTakvimi() {
    console.log('Zincir takvimi render ediliyor...');
  }

  async renderRozetlerGrid() {
    console.log('Rozetler grid render ediliyor...');
  }

  async cleanup() {
    // Temizleme işlemleri
  }
}

window.ModuleManager.registerModule('zincir', new ZincirModule());

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ZincirModule;
}
