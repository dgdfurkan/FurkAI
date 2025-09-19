/**
 * FurkAI Namaz Module
 * Namaz vakitleri ve hatırlatma sistemi
 */

class NamazModule extends BaseModule {
  constructor() {
    super('namaz');
    this.currentView = 'vakitler';
    this.vakitler = [];
    this.namazKayitlari = [];
  }

  async render() {
    return `
      <div class="namaz-module">
        <div class="module-nav-tabs">
          <button class="tab-btn active" data-tab="vakitler">
            <span class="tab-icon">🕐</span>
            <span class="tab-label">Vakitler</span>
          </button>
          <button class="tab-btn" data-tab="kayit">
            <span class="tab-icon">📝</span>
            <span class="tab-label">Kayıt</span>
          </button>
          <button class="tab-btn" data-tab="takvim">
            <span class="tab-icon">📅</span>
            <span class="tab-label">Takvim</span>
          </button>
        </div>

        <div class="module-content-area">
          <div id="vakitler-content" class="tab-content active">
            <div class="content-header">
              <h2>Namaz Vakitleri</h2>
              <div class="header-actions">
                <button class="btn btn-primary" id="add-vakit">
                  <span class="icon">+</span>
                  Vakit Ekle
                </button>
                <button class="btn btn-secondary" id="import-ics">
                  <span class="icon">📥</span>
                  ICS İçe Aktar
                </button>
              </div>
            </div>

            <div id="vakitler-list" class="vakitler-list">
              <!-- Vakitler buraya yüklenecek -->
            </div>
          </div>

          <div id="kayit-content" class="tab-content">
            <div class="content-header">
              <h2>Namaz Kayıtları</h2>
            </div>

            <div id="namaz-kayitlari" class="namaz-kayitlari">
              <!-- Kayıtlar buraya yüklenecek -->
            </div>
          </div>

          <div id="takvim-content" class="tab-content">
            <div class="content-header">
              <h2>Namaz Takvimi</h2>
              <div class="header-actions">
                <button class="btn btn-secondary" id="export-ics">
                  <span class="icon">📤</span>
                  ICS Dışa Aktar
                </button>
              </div>
            </div>

            <div id="namaz-takvimi" class="namaz-takvimi">
              <!-- Takvim buraya yüklenecek -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async init() {
    await this.loadData();
    this.setupUIEvents();
    await this.loadTabContent('vakitler');
  }

  async loadData() {
    try {
      this.vakitler = await this.getData({ filter: item => item.type === 'vakit' });
      this.namazKayitlari = await this.getData({ filter: item => item.type === 'kayit' });
    } catch (error) {
      console.error('Namaz modülü verileri yüklenemedi:', error);
    }
  }

  setupUIEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    document.getElementById('add-vakit')?.addEventListener('click', () => {
      this.showAddVakitModal();
    });

    document.getElementById('import-ics')?.addEventListener('click', () => {
      this.importICS();
    });

    document.getElementById('export-ics')?.addEventListener('click', () => {
      this.exportICS();
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
      case 'vakitler':
        await this.renderVakitlerList();
        break;
      case 'kayit':
        await this.renderNamazKayitlari();
        break;
      case 'takvim':
        await this.renderNamazTakvimi();
        break;
    }
  }

  async renderVakitlerList() {
    const list = document.getElementById('vakitler-list');
    
    if (this.vakitler.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🕐</div>
          <h3>Vakit Yok</h3>
          <p>Henüz hiç namaz vakti eklenmemiş. İlk vaktinizi ekleyin!</p>
          <button class="btn btn-primary" onclick="window.ModuleManager.modules.get('namaz').instance.showAddVakitModal()">
            Vakit Ekle
          </button>
        </div>
      `;
      return;
    }

    list.innerHTML = this.vakitler.map(vakit => `
      <div class="vakit-card" data-id="${vakit.id}">
        <div class="vakit-info">
          <h3 class="vakit-name">${vakit.name}</h3>
          <p class="vakit-time">${vakit.time}</p>
          <p class="vakit-repeat">${this.getRepeatText(vakit.repeat)}</p>
        </div>
        <div class="vakit-actions">
          <button class="btn btn-sm btn-secondary" onclick="window.ModuleManager.modules.get('namaz').instance.editVakit(${vakit.id})">
            ✏️
          </button>
          <button class="btn btn-sm btn-outline" onclick="window.ModuleManager.modules.get('namaz').instance.deleteVakit(${vakit.id})">
            🗑️
          </button>
        </div>
      </div>
    `).join('');
  }

  getRepeatText(repeat) {
    const repeats = {
      'daily': 'Günlük',
      'weekly': 'Haftalık',
      'monthly': 'Aylık',
      'custom': 'Özel'
    };
    return repeats[repeat] || 'Tek seferlik';
  }

  showAddVakitModal() {
    console.log('Vakit ekleme modalı açılıyor...');
  }

  editVakit(id) {
    console.log('Vakit düzenleniyor:', id);
  }

  async deleteVakit(id) {
    if (confirm('Bu vakti silmek istediğinizden emin misiniz?')) {
      try {
        await this.deleteData(id);
        await this.loadData();
        await this.renderVakitlerList();
      } catch (error) {
        console.error('Vakit silinemedi:', error);
      }
    }
  }

  importICS() {
    console.log('ICS içe aktarma...');
  }

  exportICS() {
    console.log('ICS dışa aktarma...');
  }

  async renderNamazKayitlari() {
    console.log('Namaz kayıtları render ediliyor...');
  }

  async renderNamazTakvimi() {
    console.log('Namaz takvimi render ediliyor...');
  }

  async cleanup() {
    // Temizleme işlemleri
  }
}

window.ModuleManager.registerModule('namaz', new NamazModule());

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NamazModule;
}
