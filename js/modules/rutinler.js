/**
 * Rutinler Modülü - Kullanıcı tanımlı rutinler
 * Kullanıcılar kendi rutinlerini oluşturabilir ve takip edebilir
 */

class RutinlerModule {
  constructor() {
    this.rutinler = [];
    this.currentRutin = null;
    this.isInitialized = false;
  }

  async init() {
    // Eğer zaten başlatıldıysa tekrar başlatma
    if (this.isInitialized) {
      console.log('Rutinler modülü zaten başlatılmış');
      return;
    }
    
    console.log('Rutinler modülü başlatılıyor...');
    
    try {
      // Kayıtlı rutinleri yükle - doğru store'dan
      this.rutinler = await window.DataManager.getAll('rutinler') || [];
      
      console.log('Yüklenen rutinler:', this.rutinler);
      
      // Eğer hiç rutin yoksa veya sadece boş array varsa, default rutinleri ekle
      if (!this.rutinler || this.rutinler.length === 0) {
        console.log('Rutin bulunamadı, default rutinler oluşturuluyor...');
        await this.createDefaultRutinler();
        // Rutinler oluşturulduktan sonra sayfayı yenile
        setTimeout(() => {
          if (document.getElementById('page-content')) {
            this.render();
          }
        }, 100);
      } else {
        console.log('Mevcut rutinler yüklendi:', this.rutinler.length);
      }
      
      this.isInitialized = true;
      console.log('Rutinler modülü başlatıldı, toplam rutin:', this.rutinler.length);
    } catch (error) {
      console.error('Rutinler modülü başlatılamadı:', error);
    }
  }

  async createDefaultRutinler() {
    // Eğer zaten default rutinler varsa, tekrar ekleme
    const existingRutinler = await window.DataManager.getAll('rutinler') || [];
    if (existingRutinler.length > 0) {
      console.log('Default rutinler zaten mevcut, tekrar eklenmiyor');
      this.rutinler = existingRutinler;
      return;
    }

    const defaultRutinler = [
      {
        id: 'yemek-rutini',
        name: 'Yemek Rutini',
        description: 'Günlük öğünlerinizi planlayın ve AI önerileri alın',
        category: 'yemek',
        frequency: 'daily',
        time: '08:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        reminder: true,
        goal: 'Sağlıklı beslenme alışkanlığı',
        isActive: true,
        createdAt: new Date().toISOString(),
        completedCount: 0,
        totalDays: 0,
        streak: 0,
        lastCompleted: null,
        isDefault: true
      },
      {
        id: 'spor-rutini',
        name: 'Spor Rutini',
        description: 'Günlük egzersiz ve fiziksel aktivite takibi',
        category: 'spor',
        frequency: 'daily',
        time: '18:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        reminder: true,
        goal: '30 gün üst üste egzersiz',
        isActive: true,
        createdAt: new Date().toISOString(),
        completedCount: 0,
        totalDays: 0,
        streak: 0,
        lastCompleted: null,
        isDefault: true
      },
      {
        id: 'namaz-rutini',
        name: 'Namaz Rutini',
        description: 'Günlük namaz vakitlerini takip edin',
        category: 'namaz',
        frequency: 'daily',
        time: null,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        reminder: true,
        goal: '5 vakit namazı düzenli kılma',
        isActive: true,
        createdAt: new Date().toISOString(),
        completedCount: 0,
        totalDays: 0,
        streak: 0,
        lastCompleted: null,
        isDefault: true
      },
      {
        id: 'ezber-rutini',
        name: 'Ezber Rutini',
        description: 'Günlük sure ve dua ezberleme',
        category: 'ogrenme',
        frequency: 'daily',
        time: '20:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        reminder: true,
        goal: 'Ayda 1 sure ezberleme',
        isActive: true,
        createdAt: new Date().toISOString(),
        completedCount: 0,
        totalDays: 0,
        streak: 0,
        lastCompleted: null,
        isDefault: true
      },
      {
        id: 'zincir-rutini',
        name: 'Zincir Kırma Rutini',
        description: 'Günlük rutinlerinizi takip edin ve zinciri kırmayın',
        category: 'diger',
        frequency: 'daily',
        time: null,
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        reminder: false,
        goal: '100 gün üst üste',
        isActive: true,
        createdAt: new Date().toISOString(),
        completedCount: 0,
        totalDays: 0,
        streak: 0,
        lastCompleted: null,
        isDefault: true
      }
    ];

    try {
      this.rutinler = defaultRutinler;
      
      // Her rutini ayrı ayrı store'a ekle
      for (const rutin of defaultRutinler) {
        await window.DataManager.add('rutinler', rutin);
      }
      
      console.log('Default rutinler oluşturuldu:', defaultRutinler.length);
      
      // Rutinler oluşturulduktan sonra sayfayı yenile
      setTimeout(() => {
        if (document.getElementById('page-content')) {
          this.render();
        }
      }, 200);
    } catch (error) {
      console.error('Default rutinler oluşturulamadı:', error);
    }
  }

  async loadRutinler() {
    try {
      this.rutinler = await window.DataManager.getAll('rutinler') || [];
      console.log('Rutinler yüklendi:', this.rutinler.length);
    } catch (error) {
      console.error('Rutinler yüklenemedi:', error);
      this.rutinler = [];
    }
  }

  async render() {
    const content = document.getElementById('page-content');
    if (!content) {
      console.error('page-content elementi bulunamadı, Rutinler modülü render edilemiyor');
      return;
    }

    // Rutinleri tekrar yükle (sayfa değişince)
    await this.loadRutinler();
    
    // Eğer hiç rutin yoksa ve rutinler sayfasındaysak, default rutinleri oluştur
    if ((!this.rutinler || this.rutinler.length === 0) && !this.isInitialized) {
      console.log('Rutinler sayfasında rutin bulunamadı, default rutinler oluşturuluyor...');
      await this.createDefaultRutinler();
      this.isInitialized = true;
    }

    try {
      content.innerHTML = `
        <div class="rutinler-container">
          <div class="rutinler-header">
            <h2>Rutinlerim</h2>
            <p>Günlük rutinlerinizi oluşturun ve takip edin</p>
          </div>

          <div class="rutinler-grid">
            ${this.rutinler.length === 0 ? this.renderEmptyState() : this.renderRutinler()}
          </div>

          <div class="rutinler-actions">
            <button class="btn btn-primary" onclick="window.RutinlerModule?.showAddRutinModal()">
              <span class="icon">+</span>
              Yeni Rutin
            </button>
            <button class="btn btn-secondary" onclick="window.RutinlerModule?.showRutinTemplates()">
              <span class="icon">📋</span>
              Şablonlar
            </button>
          </div>
        </div>

        <!-- Rutin Ekleme Modal -->
        <div id="rutin-modal" class="modal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h3 id="rutin-modal-title">Yeni Rutin Oluştur</h3>
              <button class="modal-close" onclick="window.RutinlerModule?.closeRutinModal()">×</button>
            </div>
            <div class="modal-body">
              <form id="rutin-form">
                <div class="form-group">
                  <label for="rutin-name">Rutin Adı</label>
                  <input type="text" id="rutin-name" placeholder="Örn: Sabah Rutini" required>
                </div>
                
                <div class="form-group">
                  <label for="rutin-description">Açıklama</label>
                  <textarea id="rutin-description" placeholder="Bu rutinin ne hakkında olduğunu açıklayın" rows="3"></textarea>
                </div>

                <div class="form-group">
                  <label for="rutin-category">Kategori</label>
                  <select id="rutin-category" required>
                    <option value="">Kategori Seçin</option>
                    <option value="sabah">Sabah Rutini</option>
                    <option value="aksam">Akşam Rutini</option>
                    <option value="spor">Spor</option>
                    <option value="yemek">Yemek</option>
                    <option value="namaz">Namaz</option>
                    <option value="ogrenme">Öğrenme</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="rutin-frequency">Sıklık</label>
                  <select id="rutin-frequency" required>
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="monthly">Aylık</option>
                    <option value="custom">Özel</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="rutin-time">Zaman (Opsiyonel)</label>
                  <input type="time" id="rutin-time">
                </div>

                <div class="form-group">
                  <label for="rutin-days">Günler (Haftalık için)</label>
                  <div class="day-selector">
                    <label class="day-option">
                      <input type="checkbox" value="monday"> Pazartesi
                    </label>
                    <label class="day-option">
                      <input type="checkbox" value="tuesday"> Salı
                    </label>
                    <label class="day-option">
                      <input type="checkbox" value="wednesday"> Çarşamba
                    </label>
                    <label class="day-option">
                      <input type="checkbox" value="thursday"> Perşembe
                    </label>
                    <label class="day-option">
                      <input type="checkbox" value="friday"> Cuma
                    </label>
                    <label class="day-option">
                      <input type="checkbox" value="saturday"> Cumartesi
                    </label>
                    <label class="day-option">
                      <input type="checkbox" value="sunday"> Pazar
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label for="rutin-reminder">Hatırlatıcı</label>
                  <div class="switch-group">
                    <input type="checkbox" id="rutin-reminder">
                    <label for="rutin-reminder">Hatırlatıcı aktif</label>
                  </div>
                </div>

                <div class="form-group">
                  <label for="rutin-goal">Hedef (Opsiyonel)</label>
                  <input type="text" id="rutin-goal" placeholder="Örn: 30 gün üst üste">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" onclick="window.RutinlerModule?.closeRutinModal()">
                İptal
              </button>
              <button class="btn btn-primary" onclick="window.RutinlerModule?.saveRutin()">
                Kaydet
              </button>
            </div>
          </div>
        </div>

        <!-- Rutin Detay Modal -->
        <div id="rutin-detail-modal" class="modal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h3 id="rutin-detail-title">Rutin Detayları</h3>
              <button class="modal-close" onclick="window.RutinlerModule?.closeRutinDetailModal()">×</button>
            </div>
            <div class="modal-body" id="rutin-detail-body">
              <!-- Dinamik içerik -->
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" onclick="window.RutinlerModule?.closeRutinDetailModal()">
                Kapat
              </button>
              <button class="btn btn-warning" onclick="window.RutinlerModule?.editRutin()">
                Düzenle
              </button>
              <button class="btn btn-error" onclick="window.RutinlerModule?.deleteRutin()">
                Sil
              </button>
            </div>
          </div>
        </div>
      `;

      this.setupEventListeners();
    } catch (error) {
      console.error('Rutinler modülü render hatası:', error);
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Rutinler Modülü Yüklenemedi</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">🔁</div>
        <h3>Henüz Rutin Yok</h3>
        <p>İlk rutininizi oluşturmak için "Yeni Rutin" butonuna tıklayın</p>
        <div class="empty-state-actions">
          <button class="btn btn-primary" onclick="window.RutinlerModule?.showAddRutinModal()">
            <span class="icon">+</span>
            İlk Rutinimi Oluştur
          </button>
        </div>
      </div>
    `;
  }

  renderRutinler() {
    return this.rutinler.map(rutin => `
      <div class="rutin-card" data-rutin-id="${rutin.id}">
        <div class="rutin-card-header">
          <div class="rutin-icon">${this.getCategoryIcon(rutin.category)}</div>
          <div class="rutin-info">
            <h3 class="rutin-name">${rutin.name}</h3>
            <p class="rutin-category">${this.getCategoryName(rutin.category)}</p>
          </div>
          <div class="rutin-status">
            <span class="status-badge ${rutin.isActive ? 'active' : 'inactive'}">
              ${rutin.isActive ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        </div>
        
        <div class="rutin-card-body">
          <p class="rutin-description">${rutin.description || 'Açıklama yok'}</p>
          
          <div class="rutin-stats">
            <div class="stat-item">
              <span class="stat-number">${rutin.completedCount || 0}</span>
              <span class="stat-label">Tamamlanan</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${rutin.streak || 0}</span>
              <span class="stat-label">Zincir</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${this.calculateSuccessRate(rutin)}%</span>
              <span class="stat-label">Başarı</span>
            </div>
          </div>
        </div>

        <div class="rutin-card-footer">
          <button class="btn btn-sm btn-primary" onclick="window.RutinlerModule?.completeRutin('${rutin.id}')">
            <span class="icon">✓</span>
            Tamamla
          </button>
          <button class="btn btn-sm btn-secondary" onclick="window.RutinlerModule?.showRutinDetail('${rutin.id}')">
            <span class="icon">👁️</span>
            Detay
          </button>
        </div>
      </div>
    `).join('');
  }

  getCategoryIcon(category) {
    const icons = {
      sabah: '🌅',
      aksam: '🌙',
      spor: '🏃‍♂️',
      yemek: '🍴',
      namaz: '🕌',
      ogrenme: '📚',
      diger: '📋'
    };
    return icons[category] || '📋';
  }

  getCategoryName(category) {
    const names = {
      sabah: 'Sabah Rutini',
      aksam: 'Akşam Rutini',
      spor: 'Spor',
      yemek: 'Yemek',
      namaz: 'Namaz',
      ogrenme: 'Öğrenme',
      diger: 'Diğer'
    };
    return names[category] || 'Diğer';
  }

  calculateSuccessRate(rutin) {
    if (!rutin.totalDays || rutin.totalDays === 0) return 0;
    return Math.round((rutin.completedCount / rutin.totalDays) * 100);
  }

  setupEventListeners() {
    // Modal kapatma
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });
  }

  showAddRutinModal() {
    const modal = document.getElementById('rutin-modal');
    const title = document.getElementById('rutin-modal-title');
    const form = document.getElementById('rutin-form');
    
    title.textContent = 'Yeni Rutin Oluştur';
    form.reset();
    modal.style.display = 'flex';
  }

  closeRutinModal() {
    const modal = document.getElementById('rutin-modal');
    modal.style.display = 'none';
  }

  async saveRutin() {
    const form = document.getElementById('rutin-form');
    const formData = new FormData(form);
    
    const rutin = {
      id: Date.now().toString(),
      name: document.getElementById('rutin-name').value,
      description: document.getElementById('rutin-description').value,
      category: document.getElementById('rutin-category').value,
      frequency: document.getElementById('rutin-frequency').value,
      time: document.getElementById('rutin-time').value,
      days: Array.from(document.querySelectorAll('.day-selector input:checked')).map(cb => cb.value),
      reminder: document.getElementById('rutin-reminder').checked,
      goal: document.getElementById('rutin-goal').value,
      isActive: true,
      createdAt: new Date().toISOString(),
      completedCount: 0,
      totalDays: 0,
      streak: 0,
      lastCompleted: null
    };

    // Validasyon
    if (!rutin.name || !rutin.category || !rutin.frequency) {
      alert('Lütfen gerekli alanları doldurun');
      return;
    }

    try {
      // Rutini store'a ekle
      await window.DataManager.add('rutinler', rutin);
      
      // Local array'e ekle
      this.rutinler.push(rutin);
      
      this.closeRutinModal();
      this.render(); // Sayfayı yenile
      
      console.log('Rutin kaydedildi:', rutin);
    } catch (error) {
      console.error('Rutin kaydedilemedi:', error);
      alert('Rutin kaydedilemedi. Lütfen tekrar deneyin.');
    }
  }

  showRutinDetail(rutinId) {
    const rutin = this.rutinler.find(r => r.id === rutinId);
    if (!rutin) return;

    const modal = document.getElementById('rutin-detail-modal');
    const title = document.getElementById('rutin-detail-title');
    const body = document.getElementById('rutin-detail-body');

    title.textContent = rutin.name;
    body.innerHTML = `
      <div class="rutin-detail">
        <div class="detail-section">
          <h4>Açıklama</h4>
          <p>${rutin.description || 'Açıklama yok'}</p>
        </div>
        
        <div class="detail-section">
          <h4>Bilgiler</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Kategori:</span>
              <span class="detail-value">${this.getCategoryName(rutin.category)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sıklık:</span>
              <span class="detail-value">${this.getFrequencyName(rutin.frequency)}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Zaman:</span>
              <span class="detail-value">${rutin.time || 'Belirtilmemiş'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Hatırlatıcı:</span>
              <span class="detail-value">${rutin.reminder ? 'Aktif' : 'Pasif'}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>İstatistikler</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${rutin.completedCount || 0}</div>
              <div class="stat-label">Tamamlanan</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${rutin.streak || 0}</div>
              <div class="stat-label">Zincir</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${this.calculateSuccessRate(rutin)}%</div>
              <div class="stat-label">Başarı Oranı</div>
            </div>
          </div>
        </div>

        ${rutin.goal ? `
        <div class="detail-section">
          <h4>Hedef</h4>
          <p>${rutin.goal}</p>
        </div>
        ` : ''}
      </div>
    `;

    modal.style.display = 'flex';
    this.currentRutin = rutin;
  }

  getFrequencyName(frequency) {
    const names = {
      daily: 'Günlük',
      weekly: 'Haftalık',
      monthly: 'Aylık',
      custom: 'Özel'
    };
    return names[frequency] || 'Bilinmiyor';
  }

  closeRutinDetailModal() {
    const modal = document.getElementById('rutin-detail-modal');
    modal.style.display = 'none';
    this.currentRutin = null;
  }

  async completeRutin(rutinId) {
    const rutin = this.rutinler.find(r => r.id === rutinId);
    if (!rutin) return;

    const today = new Date().toDateString();
    
    // Bugün zaten tamamlanmış mı kontrol et
    if (rutin.lastCompleted === today) {
      alert('Bu rutin bugün zaten tamamlandı!');
      return;
    }

    try {
      rutin.completedCount = (rutin.completedCount || 0) + 1;
      rutin.totalDays = (rutin.totalDays || 0) + 1;
      rutin.lastCompleted = today;
      
      // Zincir hesapla
      rutin.streak = this.calculateStreak(rutin);

      await window.DataManager.set('rutinler', this.rutinler);
      this.render(); // Sayfayı yenile
      
      // Başarı mesajı
      this.showSuccessMessage(`${rutin.name} rutini tamamlandı! 🎉`);
      
    } catch (error) {
      console.error('Rutin tamamlanamadı:', error);
      alert('Rutin tamamlanamadı. Lütfen tekrar deneyin.');
    }
  }

  calculateStreak(rutin) {
    // Basit zincir hesaplama - gerçek uygulamada daha karmaşık olabilir
    return rutin.streak || 0;
  }

  showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  showRutinTemplates() {
    alert('Rutin şablonları yakında eklenecek!');
  }

  editRutin() {
    if (!this.currentRutin) return;
    alert('Rutin düzenleme yakında eklenecek!');
  }

  async deleteRutin() {
    if (!this.currentRutin) return;
    
    if (confirm(`"${this.currentRutin.name}" rutinini silmek istediğinizden emin misiniz?`)) {
      try {
        this.rutinler = this.rutinler.filter(r => r.id !== this.currentRutin.id);
        await window.DataManager.set('rutinler', this.rutinler);
        
        this.closeRutinDetailModal();
        this.render(); // Sayfayı yenile
        
        console.log('Rutin silindi:', this.currentRutin.name);
      } catch (error) {
        console.error('Rutin silinemedi:', error);
        alert('Rutin silinemedi. Lütfen tekrar deneyin.');
      }
    }
  }
}

// Global olarak erişilebilir yap
window.RutinlerModule = new RutinlerModule();

// Debug fonksiyonları - Console'dan çağırabilirsiniz
window.RutinlerModule.forceAddDefaultRutinler = async function() {
  console.log('Default rutinler zorla ekleniyor...');
  await this.createDefaultRutinler();
  this.render();
};

window.RutinlerModule.resetRutinler = async function() {
  console.log('Rutinler temizleniyor ve default rutinler ekleniyor...');
  
  // Store'daki tüm rutinleri sil
  try {
    const allRutinler = await window.DataManager.getAll('rutinler');
    for (const rutin of allRutinler) {
      await window.DataManager.delete('rutinler', rutin.id);
    }
  } catch (error) {
    console.log('Store temizleme hatası (normal):', error);
  }
  
  this.rutinler = [];
  await this.createDefaultRutinler();
  this.render();
};

// Cache temizleme fonksiyonu
window.RutinlerModule.clearAllCache = async function() {
  console.log('Tüm cache temizleniyor...');
  
  // IndexedDB'yi temizle
  if (window.DataManager && window.DataManager.db) {
    const stores = ['rutinler', 'settings', 'todo', 'yemek', 'spor', 'namaz', 'ezber', 'zincir'];
    for (const storeName of stores) {
      try {
        const items = await window.DataManager.getAll(storeName);
        for (const item of items) {
          await window.DataManager.delete(storeName, item.id);
        }
      } catch (error) {
        console.log(`${storeName} store temizleme hatası:`, error);
      }
    }
  }
  
  // Service Worker cache'i temizle
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
    }
  }
  
  // Local Storage temizle
  localStorage.clear();
  
  console.log('Cache temizleme tamamlandı! Sayfayı yenileyin.');
  alert('Cache temizlendi! Sayfayı yenileyin.');
};
