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
      },
      {
        id: 'sureler-rutini',
        name: 'Sureler',
        description: 'Kur\'an-ı Kerim surelerini okuyun, ezberleyin ve anlayın',
        category: 'sureler',
        frequency: 'daily',
        time: '20:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        reminder: true,
        goal: 'Kur\'an okuma ve ezberleme alışkanlığı',
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
      <div class="rutin-card" data-rutin-id="${rutin.id}" onclick="window.RutinlerModule?.openRutinDetail('${rutin.id}')">
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

// Rutin detay sayfasını aç
window.RutinlerModule.openRutinDetail = function(rutinId) {
  const rutin = window.RutinlerModule.rutinler.find(r => r.id == rutinId);
  if (!rutin) return;

  // Rutin türüne göre farklı sayfalar aç
  switch(rutin.category) {
    case 'yemek':
      window.RutinlerModule.openYemekRutini(rutin);
      break;
    case 'spor':
      window.RutinlerModule.openSporRutini(rutin);
      break;
    case 'namaz':
      window.RutinlerModule.openNamazRutini(rutin);
      break;
    case 'ezber':
      window.RutinlerModule.openEzberRutini(rutin);
      break;
    case 'zincir':
      window.RutinlerModule.openZincirRutini(rutin);
      break;
    case 'sureler':
      window.RutinlerModule.openSurelerRutini(rutin);
      break;
    default:
      window.RutinlerModule.showRutinDetail(rutinId);
  }
};

// Yemek rutini detay sayfası
window.RutinlerModule.openYemekRutini = function(rutin) {
  const content = document.getElementById('page-content');
  if (!content) return;

  content.innerHTML = `
    <div class="rutin-detail-container">
      <div class="rutin-detail-header">
        <button class="btn btn-secondary" onclick="window.PageManager?.switchPage('routines')">
          ← Geri
        </button>
        <h2>🍴 ${rutin.name}</h2>
        <div class="rutin-status-badge ${rutin.isActive ? 'active' : 'inactive'}">
          ${rutin.isActive ? 'Aktif' : 'Pasif'}
        </div>
      </div>

      <div class="rutin-detail-content">
        <div class="dashboard-grid">
          <!-- Bugünkü Öğünler -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Bugünkü Öğünler</h3>
              <span class="card-icon">🍽️</span>
            </div>
            <div class="card-content">
              <div class="meal-list">
                <div class="meal-item">
                  <span class="meal-time">08:00</span>
                  <span class="meal-name">Kahvaltı</span>
                  <span class="meal-status">✅</span>
                </div>
                <div class="meal-item">
                  <span class="meal-time">13:00</span>
                  <span class="meal-name">Öğle Yemeği</span>
                  <span class="meal-status">⏰</span>
                </div>
                <div class="meal-item">
                  <span class="meal-time">19:00</span>
                  <span class="meal-name">Akşam Yemeği</span>
                  <span class="meal-status">⏰</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Kalori Takibi -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Kalori Takibi</h3>
              <span class="card-icon">🔥</span>
            </div>
            <div class="card-content">
              <div class="calorie-progress">
                <div class="calorie-circle">
                  <span class="calorie-current">0</span>
                  <span class="calorie-target">/ 2000</span>
                </div>
                <div class="calorie-info">
                  <p>Hedef: 2000 kalori</p>
                  <p>Kalan: 2000 kalori</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Su Takibi -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Su Takibi</h3>
              <span class="card-icon">💧</span>
            </div>
            <div class="card-content">
              <div class="water-progress">
                <div class="water-glasses">
                  ${Array(8).fill(0).map((_, i) => 
                    `<div class="water-glass">💧</div>`
                  ).join('')}
                </div>
                <p>0 / 8 bardak</p>
              </div>
            </div>
          </div>

          <!-- AI Öneriler -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">AI Öneriler</h3>
              <span class="card-icon">🤖</span>
            </div>
            <div class="card-content">
              <div class="ai-suggestions">
                <div class="suggestion-item">
                  <span class="suggestion-icon">🥗</span>
                  <span class="suggestion-text">Öğle yemeği için salata önerisi</span>
                </div>
                <div class="suggestion-item">
                  <span class="suggestion-icon">💧</span>
                  <span class="suggestion-text">Daha fazla su içmeyi unutmayın</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rutin-actions">
          <button class="btn btn-primary" onclick="window.RutinlerModule?.addMeal()">
            <span class="icon">+</span>
            Öğün Ekle
          </button>
          <button class="btn btn-secondary" onclick="window.RutinlerModule?.getAIRecommendation()">
            <span class="icon">🤖</span>
            AI Önerisi Al
          </button>
        </div>
      </div>
    </div>
  `;
};

// Spor rutini detay sayfası
window.RutinlerModule.openSporRutini = function(rutin) {
  const content = document.getElementById('page-content');
  if (!content) return;

  content.innerHTML = `
    <div class="rutin-detail-container">
      <div class="rutin-detail-header">
        <button class="btn btn-secondary" onclick="window.PageManager?.switchPage('routines')">
          ← Geri
        </button>
        <h2>🏃‍♂️ ${rutin.name}</h2>
        <div class="rutin-status-badge ${rutin.isActive ? 'active' : 'inactive'}">
          ${rutin.isActive ? 'Aktif' : 'Pasif'}
        </div>
      </div>

      <div class="rutin-detail-content">
        <div class="dashboard-grid">
          <!-- Bugünkü Egzersizler -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Bugünkü Egzersizler</h3>
              <span class="card-icon">💪</span>
            </div>
            <div class="card-content">
              <div class="exercise-list">
                <div class="exercise-item">
                  <span class="exercise-name">Koşu</span>
                  <span class="exercise-duration">30 dk</span>
                  <span class="exercise-status">✅</span>
                </div>
                <div class="exercise-item">
                  <span class="exercise-name">Push-up</span>
                  <span class="exercise-duration">3x15</span>
                  <span class="exercise-status">⏰</span>
                </div>
                <div class="exercise-item">
                  <span class="exercise-name">Plank</span>
                  <span class="exercise-duration">2x60sn</span>
                  <span class="exercise-status">⏰</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Kalori Yakımı -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Kalori Yakımı</h3>
              <span class="card-icon">🔥</span>
            </div>
            <div class="card-content">
              <div class="calorie-burn">
                <div class="calorie-circle">
                  <span class="calorie-current">0</span>
                  <span class="calorie-target">/ 500</span>
                </div>
                <div class="calorie-info">
                  <p>Hedef: 500 kalori</p>
                  <p>Kalan: 500 kalori</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Adım Sayacı -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Adım Sayacı</h3>
              <span class="card-icon">👟</span>
            </div>
            <div class="card-content">
              <div class="step-counter">
                <div class="step-circle">
                  <span class="step-current">0</span>
                  <span class="step-target">/ 10,000</span>
                </div>
                <div class="step-info">
                  <p>Hedef: 10,000 adım</p>
                  <p>Kalan: 10,000 adım</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Haftalık İlerleme -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Haftalık İlerleme</h3>
              <span class="card-icon">📊</span>
            </div>
            <div class="card-content">
              <div class="weekly-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 75%"></div>
                </div>
                <div class="progress-stats">
                  <div class="stat-item">
                    <span class="stat-value">5</span>
                    <span class="stat-label">Gün</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">7</span>
                    <span class="stat-label">Hedef</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Motivasyon -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Motivasyon</h3>
              <span class="card-icon">💪</span>
            </div>
            <div class="card-content">
              <div class="motivation-quotes">
                <div class="quote-item">
                  <span class="quote-icon">💪</span>
                  <span class="quote-text">"Her adım seni hedefine yaklaştırıyor!"</span>
                </div>
                <div class="quote-item">
                  <span class="quote-icon">🏆</span>
                  <span class="quote-text">"Bugün 7 günlük zincirin var!"</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Spor Programı -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Spor Programı</h3>
              <span class="card-icon">📅</span>
            </div>
            <div class="card-content">
              <div class="workout-schedule">
                <div class="schedule-item">
                  <span class="schedule-day">Pazartesi</span>
                  <span class="schedule-workout">Koşu + Kardiyo</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-day">Salı</span>
                  <span class="schedule-workout">Güç Antrenmanı</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-day">Çarşamba</span>
                  <span class="schedule-workout">Yoga + Esneklik</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-day">Perşembe</span>
                  <span class="schedule-workout">Koşu + Kardiyo</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-day">Cuma</span>
                  <span class="schedule-workout">Güç Antrenmanı</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-day">Cumartesi</span>
                  <span class="schedule-workout">Aktif Dinlenme</span>
                </div>
                <div class="schedule-item">
                  <span class="schedule-day">Pazar</span>
                  <span class="schedule-workout">Dinlenme</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rutin-actions">
          <button class="btn btn-primary" onclick="window.RutinlerModule?.startWorkout()">
            <span class="icon">▶️</span>
            Antrenman Başlat
          </button>
          <button class="btn btn-secondary" onclick="window.RutinlerModule?.logExercise()">
            <span class="icon">📝</span>
            Egzersiz Kaydet
          </button>
        </div>
      </div>
    </div>
  `;
};

// Namaz rutini detay sayfası
window.RutinlerModule.openNamazRutini = function(rutin) {
  const content = document.getElementById('page-content');
  if (!content) return;

  content.innerHTML = `
    <div class="rutin-detail-container">
      <div class="rutin-detail-header">
        <button class="btn btn-secondary" onclick="window.PageManager?.switchPage('routines')">
          ← Geri
        </button>
        <h2>🕌 ${rutin.name}</h2>
        <div class="rutin-status-badge ${rutin.isActive ? 'active' : 'inactive'}">
          ${rutin.isActive ? 'Aktif' : 'Pasif'}
        </div>
      </div>

      <div class="rutin-detail-content">
        <div class="dashboard-grid">
          <!-- Namaz Vakitleri -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Bugünkü Namaz Vakitleri</h3>
              <span class="card-icon">🕌</span>
            </div>
            <div class="card-content">
              <div class="prayer-times">
                <div class="prayer-item">
                  <span class="prayer-name">Sabah</span>
                  <span class="prayer-time">05:45</span>
                  <span class="prayer-status">✅</span>
                </div>
                <div class="prayer-item">
                  <span class="prayer-name">Öğle</span>
                  <span class="prayer-time">12:30</span>
                  <span class="prayer-status">⏰</span>
                </div>
                <div class="prayer-item">
                  <span class="prayer-name">İkindi</span>
                  <span class="prayer-time">15:45</span>
                  <span class="prayer-status">⏰</span>
                </div>
                <div class="prayer-item">
                  <span class="prayer-name">Akşam</span>
                  <span class="prayer-time">18:15</span>
                  <span class="prayer-status">⏰</span>
                </div>
                <div class="prayer-item">
                  <span class="prayer-name">Yatsı</span>
                  <span class="prayer-time">19:45</span>
                  <span class="prayer-status">⏰</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Namaz Takibi -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Namaz Takibi</h3>
              <span class="card-icon">📿</span>
            </div>
            <div class="card-content">
              <div class="prayer-progress">
                <div class="prayer-circle">
                  <span class="prayer-current">1</span>
                  <span class="prayer-target">/ 5</span>
                </div>
                <div class="prayer-info">
                  <p>Bugün: 1/5 namaz</p>
                  <p>Zincir: 7 gün</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Kıble Yönü -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Kıble Yönü</h3>
              <span class="card-icon">🧭</span>
            </div>
            <div class="card-content">
              <div class="qibla-direction">
                <div class="compass">
                  <div class="compass-needle" style="transform: rotate(45deg);"></div>
                  <div class="compass-label">Kıble</div>
                </div>
                <div class="direction-info">
                  <p>Yön: Güneydoğu</p>
                  <p>Açı: 45°</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Hatırlatıcılar -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Hatırlatıcılar</h3>
              <span class="card-icon">🔔</span>
            </div>
            <div class="card-content">
              <div class="reminder-settings">
                <div class="reminder-item">
                  <span class="reminder-name">Namaz Vakti</span>
                  <span class="reminder-status">✅</span>
                </div>
                <div class="reminder-item">
                  <span class="reminder-name">5 Dakika Öncesi</span>
                  <span class="reminder-status">✅</span>
                </div>
                <div class="reminder-item">
                  <span class="reminder-name">Ezân</span>
                  <span class="reminder-status">✅</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Haftalık İstatistik -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Haftalık İstatistik</h3>
              <span class="card-icon">📊</span>
            </div>
            <div class="card-content">
              <div class="weekly-stats">
                <div class="stat-item">
                  <span class="stat-value">35</span>
                  <span class="stat-label">Namaz</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">100%</span>
                  <span class="stat-label">Başarı</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">7</span>
                  <span class="stat-label">Gün</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Dua ve Zikir -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Dua ve Zikir</h3>
              <span class="card-icon">📿</span>
            </div>
            <div class="card-content">
              <div class="dua-list">
                <div class="dua-item">
                  <span class="dua-icon">🤲</span>
                  <span class="dua-text">Sabah Duası</span>
                </div>
                <div class="dua-item">
                  <span class="dua-icon">📿</span>
                  <span class="dua-text">Tesbih (33x)</span>
                </div>
                <div class="dua-item">
                  <span class="dua-icon">🤲</span>
                  <span class="dua-text">Akşam Duası</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rutin-actions">
          <button class="btn btn-primary" onclick="window.RutinlerModule?.markPrayerCompleted()">
            <span class="icon">✅</span>
            Namaz Kaydet
          </button>
          <button class="btn btn-secondary" onclick="window.RutinlerModule?.setReminder()">
            <span class="icon">🔔</span>
            Hatırlatıcı Ayarla
          </button>
        </div>
      </div>
    </div>
  `;
};

// Ezber rutini detay sayfası (Diyanet sureleri)
window.RutinlerModule.openEzberRutini = function(rutin) {
  const content = document.getElementById('page-content');
  if (!content) return;

  content.innerHTML = `
    <div class="rutin-detail-container">
      <div class="rutin-detail-header">
        <button class="btn btn-secondary" onclick="window.PageManager?.switchPage('routines')">
          ← Geri
        </button>
        <h2>📚 ${rutin.name}</h2>
        <div class="rutin-status-badge ${rutin.isActive ? 'active' : 'inactive'}">
          ${rutin.isActive ? 'Aktif' : 'Pasif'}
        </div>
      </div>

      <div class="rutin-detail-content">
        <div class="dashboard-grid">
          <!-- Bugünkü Ezber -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Bugünkü Ezber</h3>
              <span class="card-icon">📖</span>
            </div>
            <div class="card-content">
              <div class="memorization-list">
                <div class="memorization-item">
                  <span class="surah-name">Fatiha Suresi</span>
                  <span class="memorization-status">✅</span>
                </div>
                <div class="memorization-item">
                  <span class="surah-name">Bakara 1-5</span>
                  <span class="memorization-status">⏰</span>
                </div>
                <div class="memorization-item">
                  <span class="surah-name">İhlas Suresi</span>
                  <span class="memorization-status">✅</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ezber İlerlemesi -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Ezber İlerlemesi</h3>
              <span class="card-icon">📊</span>
            </div>
            <div class="card-content">
              <div class="memorization-progress">
                <div class="progress-circle">
                  <span class="progress-current">15</span>
                  <span class="progress-target">/ 30</span>
                </div>
                <div class="progress-info">
                  <p>Ezberlenen: 15 sure</p>
                  <p>Hedef: 30 sure</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sure Listesi -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Sure Listesi</h3>
              <span class="card-icon">📋</span>
            </div>
            <div class="card-content">
              <div class="surah-list">
                <div class="surah-item">
                  <span class="surah-number">1</span>
                  <span class="surah-name">Fatiha</span>
                  <span class="surah-status">✅</span>
                </div>
                <div class="surah-item">
                  <span class="surah-number">2</span>
                  <span class="surah-name">Bakara (1-5)</span>
                  <span class="surah-status">⏰</span>
                </div>
                <div class="surah-item">
                  <span class="surah-number">112</span>
                  <span class="surah-name">İhlas</span>
                  <span class="surah-status">✅</span>
                </div>
                <div class="surah-item">
                  <span class="surah-number">113</span>
                  <span class="surah-name">Felak</span>
                  <span class="surah-status">⏰</span>
                </div>
                <div class="surah-item">
                  <span class="surah-number">114</span>
                  <span class="surah-name">Nas</span>
                  <span class="surah-status">⏰</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ezber Tekrarı -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Ezber Tekrarı</h3>
              <span class="card-icon">🔄</span>
            </div>
            <div class="card-content">
              <div class="review-schedule">
                <div class="review-item">
                  <span class="review-day">Bugün</span>
                  <span class="review-surah">Fatiha, İhlas</span>
                </div>
                <div class="review-item">
                  <span class="review-day">Yarın</span>
                  <span class="review-surah">Bakara 1-5</span>
                </div>
                <div class="review-item">
                  <span class="review-day">Haftalık</span>
                  <span class="review-surah">Tüm ezberler</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ezber İstatistikleri -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">İstatistikler</h3>
              <span class="card-icon">📈</span>
            </div>
            <div class="card-content">
              <div class="memorization-stats">
                <div class="stat-item">
                  <span class="stat-value">15</span>
                  <span class="stat-label">Ezberlenen</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">7</span>
                  <span class="stat-label">Gün</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">85%</span>
                  <span class="stat-label">Başarı</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ezber Rehberi -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Ezber Rehberi</h3>
              <span class="card-icon">💡</span>
            </div>
            <div class="card-content">
              <div class="memorization-tips">
                <div class="tip-item">
                  <span class="tip-icon">🎯</span>
                  <span class="tip-text">Günde 1-2 ayet ezberle</span>
                </div>
                <div class="tip-item">
                  <span class="tip-icon">🔄</span>
                  <span class="tip-text">Düzenli tekrar yap</span>
                </div>
                <div class="tip-item">
                  <span class="tip-icon">📖</span>
                  <span class="tip-text">Anlamını öğren</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rutin-actions">
          <button class="btn btn-primary" onclick="window.RutinlerModule?.startMemorization()">
            <span class="icon">▶️</span>
            Ezber Başlat
          </button>
          <button class="btn btn-secondary" onclick="window.RutinlerModule?.reviewMemorization()">
            <span class="icon">🔄</span>
            Tekrar Yap
          </button>
        </div>
      </div>
    </div>
  `;
};

// Zincir kırma rutini detay sayfası
window.RutinlerModule.openZincirRutini = function(rutin) {
  const content = document.getElementById('page-content');
  if (!content) return;

  content.innerHTML = `
    <div class="rutin-detail-container">
      <div class="rutin-detail-header">
        <button class="btn btn-secondary" onclick="window.PageManager?.switchPage('routines')">
          ← Geri
        </button>
        <h2>🔗 ${rutin.name}</h2>
        <div class="rutin-status-badge ${rutin.isActive ? 'active' : 'inactive'}">
          ${rutin.isActive ? 'Aktif' : 'Pasif'}
        </div>
      </div>

      <div class="rutin-detail-content">
        <div class="dashboard-grid">
          <!-- Zincir Durumu -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Zincir Durumu</h3>
              <span class="card-icon">🔗</span>
            </div>
            <div class="card-content">
              <div class="chain-status">
                <div class="chain-circle">
                  <span class="chain-current">7</span>
                  <span class="chain-target">Gün</span>
                </div>
                <div class="chain-info">
                  <p>Mevcut Zincir: 7 gün</p>
                  <p>En Uzun Zincir: 15 gün</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Kötü Alışkanlıklar -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Kötü Alışkanlıklar</h3>
              <span class="card-icon">🚫</span>
            </div>
            <div class="card-content">
              <div class="bad-habits-list">
                <div class="habit-item">
                  <span class="habit-name">Sigara</span>
                  <span class="habit-status">✅</span>
                </div>
                <div class="habit-item">
                  <span class="habit-name">Sosyal Medya</span>
                  <span class="habit-status">⏰</span>
                </div>
                <div class="habit-item">
                  <span class="habit-name">Geç Yatma</span>
                  <span class="habit-status">⏰</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Motivasyon -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Motivasyon</h3>
              <span class="card-icon">💪</span>
            </div>
            <div class="card-content">
              <div class="motivation-quotes">
                <div class="quote-item">
                  <span class="quote-icon">🎯</span>
                  <span class="quote-text">"Her gün bir adım daha!"</span>
                </div>
                <div class="quote-item">
                  <span class="quote-icon">🏆</span>
                  <span class="quote-text">"7 günlük zincirin var!"</span>
                </div>
                <div class="quote-item">
                  <span class="quote-icon">💎</span>
                  <span class="quote-text">"Sen güçlüsün!"</span>
                </div>
              </div>
            </div>
          </div>

          <!-- İlerleme Grafiği -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Haftalık İlerleme</h3>
              <span class="card-icon">📊</span>
            </div>
            <div class="card-content">
              <div class="progress-chart">
                <div class="chart-bars">
                  <div class="chart-bar" style="height: 100%"></div>
                  <div class="chart-bar" style="height: 100%"></div>
                  <div class="chart-bar" style="height: 100%"></div>
                  <div class="chart-bar" style="height: 100%"></div>
                  <div class="chart-bar" style="height: 100%"></div>
                  <div class="chart-bar" style="height: 100%"></div>
                  <div class="chart-bar" style="height: 100%"></div>
                </div>
                <div class="chart-labels">
                  <span>Pzt</span>
                  <span>Sal</span>
                  <span>Çar</span>
                  <span>Per</span>
                  <span>Cum</span>
                  <span>Cmt</span>
                  <span>Paz</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Alternatif Aktiviteler -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Alternatif Aktiviteler</h3>
              <span class="card-icon">🎯</span>
            </div>
            <div class="card-content">
              <div class="alternative-activities">
                <div class="activity-item">
                  <span class="activity-icon">📚</span>
                  <span class="activity-text">Kitap Oku</span>
                </div>
                <div class="activity-item">
                  <span class="activity-icon">🏃‍♂️</span>
                  <span class="activity-text">Yürüyüş Yap</span>
                </div>
                <div class="activity-item">
                  <span class="activity-icon">🧘‍♂️</span>
                  <span class="activity-text">Meditasyon</span>
                </div>
                <div class="activity-item">
                  <span class="activity-icon">🎨</span>
                  <span class="activity-text">Sanat Yap</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Başarı Rozetleri -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Başarı Rozetleri</h3>
              <span class="card-icon">🏅</span>
            </div>
            <div class="card-content">
              <div class="achievement-badges">
                <div class="badge-item earned">
                  <span class="badge-icon">🥉</span>
                  <span class="badge-text">3 Gün</span>
                </div>
                <div class="badge-item earned">
                  <span class="badge-icon">🥈</span>
                  <span class="badge-text">7 Gün</span>
                </div>
                <div class="badge-item">
                  <span class="badge-icon">🥇</span>
                  <span class="badge-text">30 Gün</span>
                </div>
                <div class="badge-item">
                  <span class="badge-icon">💎</span>
                  <span class="badge-text">100 Gün</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rutin-actions">
          <button class="btn btn-primary" onclick="window.RutinlerModule?.markDayCompleted()">
            <span class="icon">✅</span>
            Günü Tamamla
          </button>
          <button class="btn btn-secondary" onclick="window.RutinlerModule?.addAlternativeActivity()">
            <span class="icon">➕</span>
            Alternatif Ekle
          </button>
        </div>
      </div>
    </div>
  `;
};


// Sureler rutini detay sayfası
window.RutinlerModule.openSurelerRutini = function(rutin) {
  const content = document.getElementById("page-content");
  if (!content) return;

  content.innerHTML = `
    <div class="rutin-detail-container">
      <div class="rutin-detail-header">
        <button class="btn btn-secondary" onclick="window.PageManager?.switchPage('routines')">
          ← Geri
        </button>
        <h2>📖 ${rutin.name}</h2>
        <div class="rutin-status-badge ${rutin.isActive ? 'active' : 'inactive'}">
          ${rutin.isActive ? 'Aktif' : 'Pasif'}
        </div>
      </div>

      <div class="rutin-detail-content">
        <div class="dashboard-grid">
          <!-- Bugünkü Okuma -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Bugünkü Okuma</h3>
              <span class="card-icon">📖</span>
            </div>
            <div class="card-content">
              <div class="reading-list">
                <div class="reading-item">
                  <span class="surah-name">Fatiha Suresi</span>
                  <span class="reading-status">⏰</span>
                </div>
                <div class="reading-item">
                  <span class="surah-name">İhlas Suresi</span>
                  <span class="reading-status">⏰</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Okuma İlerlemesi -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Okuma İlerlemesi</h3>
              <span class="card-icon">📊</span>
            </div>
            <div class="card-content">
              <div class="reading-progress">
                <div class="progress-circle">
                  <span class="progress-current">0</span>
                  <span class="progress-target">/ 114</span>
                </div>
                <div class="progress-info">
                  <p>Okunan: 0 sure</p>
                  <p>Hedef: 114 sure</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sure Listesi -->
          <div class="dashboard-card">
            <div class="card-header">
              <h3 class="card-title">Sure Listesi</h3>
              <span class="card-icon">📋</span>
            </div>
            <div class="card-content">
              <div class="surah-list">
                <div class="surah-item" onclick="window.RutinlerModule?.openSurahDetail(1)">
                  <span class="surah-number">1</span>
                  <span class="surah-name">Fatiha</span>
                  <span class="surah-status">⏰</span>
                </div>
                <div class="surah-item" onclick="window.RutinlerModule?.openSurahDetail(2)">
                  <span class="surah-number">2</span>
                  <span class="surah-name">Bakara</span>
                  <span class="surah-status">⏰</span>
                </div>
                <div class="surah-item" onclick="window.RutinlerModule?.openSurahDetail(112)">
                  <span class="surah-number">112</span>
                  <span class="surah-name">İhlas</span>
                  <span class="surah-status">⏰</span>
                </div>
                <div class="surah-item" onclick="window.RutinlerModule?.openSurahDetail(113)">
                  <span class="surah-number">113</span>
                  <span class="surah-name">Felak</span>
                  <span class="surah-status">⏰</span>
                </div>
                <div class="surah-item" onclick="window.RutinlerModule?.openSurahDetail(114)">
                  <span class="surah-number">114</span>
                  <span class="surah-name">Nas</span>
                  <span class="surah-status">⏰</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rutin-actions">
          <button class="btn btn-primary" onclick="window.RutinlerModule?.startReading()">
            <span class="icon">▶️</span>
            Okumaya Başla
          </button>
          <button class="btn btn-secondary" onclick="window.RutinlerModule?.openRutinSettings('${rutin.id}')">
            <span class="icon">⚙️</span>
            Ayarlar
          </button>
        </div>
      </div>
    </div>
  `;
};


// Rutin ayarları sayfası
window.RutinlerModule.openRutinSettings = function(rutinId) {
  const rutin = window.RutinlerModule.rutinler.find(r => r.id === rutinId);
  if (!rutin) return;

  const content = document.getElementById("page-content");
  if (!content) return;

  content.innerHTML = `
    <div class="rutin-settings-container">
      <div class="rutin-settings-header">
        <button class="btn btn-secondary" onclick="window.RutinlerModule?.openRutinDetail('${rutin.id}')">
          ← Geri
        </button>
        <h2>⚙️ ${rutin.name} Ayarları</h2>
      </div>

      <div class="rutin-settings-content">
        <div class="settings-section">
          <h3 class="settings-title">📅 Sıklık Ayarları</h3>
          <div class="setting-item">
            <label class="setting-label">Rutin Sıklığı</label>
            <select class="setting-select" id="frequency-select">
              <option value="daily" ${rutin.frequency === 'daily' ? 'selected' : ''}>Günlük</option>
              <option value="weekly" ${rutin.frequency === 'weekly' ? 'selected' : ''}>Haftalık</option>
              <option value="custom" ${rutin.frequency === 'custom' ? 'selected' : ''}>Özel</option>
            </select>
          </div>

          <div class="setting-item" id="time-setting" style="display: ${rutin.frequency === 'daily' ? 'block' : 'none'}">
            <label class="setting-label">Saat</label>
            <input type="time" class="setting-input" id="time-input" value="${rutin.time || '09:00'}">
          </div>

          <div class="setting-item" id="days-setting" style="display: ${rutin.frequency === 'weekly' ? 'block' : 'none'}">
            <label class="setting-label">Günler</label>
            <div class="days-selector">
              <label class="day-checkbox">
                <input type="checkbox" value="monday" ${rutin.days.includes('monday') ? 'checked' : ''}>
                <span>Pazartesi</span>
              </label>
              <label class="day-checkbox">
                <input type="checkbox" value="tuesday" ${rutin.days.includes('tuesday') ? 'checked' : ''}>
                <span>Salı</span>
              </label>
              <label class="day-checkbox">
                <input type="checkbox" value="wednesday" ${rutin.days.includes('wednesday') ? 'checked' : ''}>
                <span>Çarşamba</span>
              </label>
              <label class="day-checkbox">
                <input type="checkbox" value="thursday" ${rutin.days.includes('thursday') ? 'checked' : ''}>
                <span>Perşembe</span>
              </label>
              <label class="day-checkbox">
                <input type="checkbox" value="friday" ${rutin.days.includes('friday') ? 'checked' : ''}>
                <span>Cuma</span>
              </label>
              <label class="day-checkbox">
                <input type="checkbox" value="saturday" ${rutin.days.includes('saturday') ? 'checked' : ''}>
                <span>Cumartesi</span>
              </label>
              <label class="day-checkbox">
                <input type="checkbox" value="sunday" ${rutin.days.includes('sunday') ? 'checked' : ''}>
                <span>Pazar</span>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-title">🔔 Hatırlatıcı Ayarları</h3>
          <div class="setting-item">
            <label class="setting-label">Hatırlatıcı</label>
            <label class="toggle-switch">
              <input type="checkbox" id="reminder-toggle" ${rutin.reminder ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-item" id="reminder-time-setting" style="display: ${rutin.reminder ? 'block' : 'none'}">
            <label class="setting-label">Hatırlatma Zamanı</label>
            <select class="setting-select" id="reminder-time-select">
              <option value="0">Tam zamanında</option>
              <option value="5">5 dakika önce</option>
              <option value="10">10 dakika önce</option>
              <option value="15">15 dakika önce</option>
              <option value="30">30 dakika önce</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-title">🎯 Hedef Ayarları</h3>
          <div class="setting-item">
            <label class="setting-label">Hedef</label>
            <input type="text" class="setting-input" id="goal-input" value="${rutin.goal || ''}" placeholder="Hedefinizi yazın...">
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-title">📊 Durum</h3>
          <div class="setting-item">
            <label class="setting-label">Rutin Durumu</label>
            <label class="toggle-switch">
              <input type="checkbox" id="active-toggle" ${rutin.isActive ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-actions">
          <button class="btn btn-primary" onclick="window.RutinlerModule?.saveRutinSettings('${rutin.id}')">
            <span class="icon">💾</span>
            Kaydet
          </button>
          <button class="btn btn-danger" onclick="window.RutinlerModule?.deleteRutin('${rutin.id}')">
            <span class="icon">🗑️</span>
            Sil
          </button>
        </div>
      </div>
    </div>
  `;

  // Event listeners
  document.getElementById('frequency-select').addEventListener('change', function() {
    const frequency = this.value;
    const timeSetting = document.getElementById('time-setting');
    const daysSetting = document.getElementById('days-setting');
    
    if (frequency === 'daily') {
      timeSetting.style.display = 'block';
      daysSetting.style.display = 'none';
    } else if (frequency === 'weekly') {
      timeSetting.style.display = 'none';
      daysSetting.style.display = 'block';
    } else {
      timeSetting.style.display = 'none';
      daysSetting.style.display = 'none';
    }
  });

  document.getElementById('reminder-toggle').addEventListener('change', function() {
    const reminderTimeSetting = document.getElementById('reminder-time-setting');
    reminderTimeSetting.style.display = this.checked ? 'block' : 'none';
  });
};

// Rutin ayarlarını kaydet
window.RutinlerModule.saveRutinSettings = function(rutinId) {
  const rutin = window.RutinlerModule.rutinler.find(r => r.id === rutinId);
  if (!rutin) return;

  // Ayarları al
  const frequency = document.getElementById('frequency-select').value;
  const time = document.getElementById('time-input').value;
  const reminder = document.getElementById('reminder-toggle').checked;
  const active = document.getElementById('active-toggle').checked;
  const goal = document.getElementById('goal-input').value;

  // Günleri al
  const dayCheckboxes = document.querySelectorAll('.day-checkbox input[type="checkbox"]:checked');
  const days = Array.from(dayCheckboxes).map(cb => cb.value);

  // Rutini güncelle
  rutin.frequency = frequency;
  rutin.time = time;
  rutin.reminder = reminder;
  rutin.isActive = active;
  rutin.goal = goal;
  rutin.days = days.length > 0 ? days : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Veritabanını güncelle
  window.DataManager.update('rutinler', rutinId, rutin);

  // Başarı mesajı
  alert('Rutin ayarları kaydedildi!');

  // Rutin detay sayfasına dön
  window.RutinlerModule.openRutinDetail(rutinId);
};
