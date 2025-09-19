/**
 * FurkAI Ezber Module
 * Spaced repetition sistemi ile ezber takibi
 */

class EzberModule extends BaseModule {
  constructor() {
    super('ezber');
    this.currentView = 'hedefler';
    this.hedefler = [];
    this.tekrarlar = [];
    this.progress = {};
  }

  async render() {
    return `
      <div class="ezber-module">
        <div class="module-nav-tabs">
          <button class="tab-btn active" data-tab="hedefler">
            <span class="tab-icon">🎯</span>
            <span class="tab-label">Hedefler</span>
          </button>
          <button class="tab-btn" data-tab="tekrar">
            <span class="tab-icon">🔄</span>
            <span class="tab-label">Tekrar</span>
          </button>
          <button class="tab-btn" data-tab="progress">
            <span class="tab-icon">📈</span>
            <span class="tab-label">İlerleme</span>
          </button>
        </div>

        <div class="module-content-area">
          <div id="hedefler-content" class="tab-content active">
            <div class="content-header">
              <h2>Ezber Hedefleri</h2>
              <div class="header-actions">
                <button class="btn btn-primary" id="add-hedef">
                  <span class="icon">+</span>
                  Hedef Ekle
                </button>
              </div>
            </div>

            <div id="hedefler-list" class="hedefler-list">
              <!-- Hedefler buraya yüklenecek -->
            </div>
          </div>

          <div id="tekrar-content" class="tab-content">
            <div class="content-header">
              <h2>Bugünkü Tekrarlar</h2>
            </div>

            <div id="tekrar-container" class="tekrar-container">
              <!-- Tekrar içeriği buraya yüklenecek -->
            </div>
          </div>

          <div id="progress-content" class="tab-content">
            <div class="content-header">
              <h2>İlerleme Takibi</h2>
            </div>

            <div id="progress-container" class="progress-container">
              <!-- İlerleme içeriği buraya yüklenecek -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async init() {
    await this.loadData();
    this.setupUIEvents();
    await this.loadTabContent('hedefler');
  }

  async loadData() {
    try {
      this.hedefler = await this.getData({ filter: item => item.type === 'hedef' });
      this.tekrarlar = await this.getData({ filter: item => item.type === 'tekrar' });
      this.progress = await this.getData({ filter: item => item.type === 'progress' });
    } catch (error) {
      console.error('Ezber modülü verileri yüklenemedi:', error);
    }
  }

  setupUIEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    document.getElementById('add-hedef')?.addEventListener('click', () => {
      this.showAddHedefModal();
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
      case 'hedefler':
        await this.renderHedeflerList();
        break;
      case 'tekrar':
        await this.renderTekrarContainer();
        break;
      case 'progress':
        await this.renderProgressContainer();
        break;
    }
  }

  async renderHedeflerList() {
    const list = document.getElementById('hedefler-list');
    
    if (this.hedefler.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎯</div>
          <h3>Hedef Yok</h3>
          <p>Henüz hiç ezber hedefi eklenmemiş. İlk hedefinizi ekleyin!</p>
          <button class="btn btn-primary" onclick="window.ModuleManager.modules.get('ezber').instance.showAddHedefModal()">
            Hedef Ekle
          </button>
        </div>
      `;
      return;
    }

    list.innerHTML = this.hedefler.map(hedef => `
      <div class="hedef-card" data-id="${hedef.id}">
        <div class="hedef-info">
          <h3 class="hedef-title">${hedef.title}</h3>
          <p class="hedef-description">${hedef.description}</p>
          <div class="hedef-meta">
            <span class="hedef-type">${this.getHedefTypeName(hedef.type)}</span>
            <span class="hedef-difficulty">${this.getDifficultyName(hedef.difficulty)}</span>
            <span class="hedef-target-date">Hedef: ${this.formatDate(hedef.targetDate)}</span>
          </div>
          <div class="hedef-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${hedef.progress}%"></div>
            </div>
            <span class="progress-text">${hedef.progress}%</span>
          </div>
        </div>
        <div class="hedef-actions">
          <button class="btn btn-primary btn-sm" onclick="window.ModuleManager.modules.get('ezber').instance.startTekrar(${hedef.id})">
            Tekrar Yap
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.ModuleManager.modules.get('ezber').instance.editHedef(${hedef.id})">
            Düzenle
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.ModuleManager.modules.get('ezber').instance.deleteHedef(${hedef.id})">
            Sil
          </button>
        </div>
      </div>
    `).join('');
  }

  getHedefTypeName(type) {
    const types = {
      'sure': 'Sure',
      'ayet': 'Ayet',
      'hadis': 'Hadis',
      'dua': 'Dua',
      'siir': 'Şiir',
      'other': 'Diğer'
    };
    return types[type] || 'Diğer';
  }

  getDifficultyName(difficulty) {
    const difficulties = {
      'easy': 'Kolay',
      'medium': 'Orta',
      'hard': 'Zor'
    };
    return difficulties[difficulty] || 'Orta';
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('tr-TR');
  }

  showAddHedefModal() {
    console.log('Hedef ekleme modalı açılıyor...');
  }

  startTekrar(id) {
    console.log('Tekrar başlatılıyor:', id);
  }

  editHedef(id) {
    console.log('Hedef düzenleniyor:', id);
  }

  async deleteHedef(id) {
    if (confirm('Bu hedefi silmek istediğinizden emin misiniz?')) {
      try {
        await this.deleteData(id);
        await this.loadData();
        await this.renderHedeflerList();
      } catch (error) {
        console.error('Hedef silinemedi:', error);
      }
    }
  }

  async renderTekrarContainer() {
    console.log('Tekrar container render ediliyor...');
  }

  async renderProgressContainer() {
    console.log('İlerleme container render ediliyor...');
  }

  async cleanup() {
    // Temizleme işlemleri
  }
}

window.ModuleManager.registerModule('ezber', new EzberModule());

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EzberModule;
}
