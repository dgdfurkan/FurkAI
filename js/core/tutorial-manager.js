/**
 * Tutorial Manager - Kullanıcı tanıtım sistemi
 * İlk kez açan kullanıcılara uygulamayı tanıtır
 */

class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.steps = [];
    this.isActive = false;
    this.hasSeenTutorial = false;
  }

  async init() {
    console.log('TutorialManager başlatılıyor...');
    
    // Kullanıcı daha önce tutorial'ı görmüş mü kontrol et
    this.hasSeenTutorial = await window.DataManager.get('tutorial_completed', false);
    
    if (!this.hasSeenTutorial) {
      this.setupTutorialSteps();
      this.showWelcomeModal();
    }
  }

  setupTutorialSteps() {
    this.steps = [
      {
        id: 'welcome',
        title: 'FurkAI\'ya Hoş Geldiniz! 🎉',
        content: 'FurkAI, günlük rutinlerinizi yönetmenize yardımcı olan kişisel asistanınızdır.',
        target: null,
        position: 'center',
        page: null
      },
      {
        id: 'navigation',
        title: 'Alt Navigasyon 📱',
        content: 'Ana Ekran, Takvim, Rutinler ve Ayarlar arasında geçiş yapabilirsiniz.',
        target: '.bottom-nav',
        position: 'top',
        page: 'home'
      },
      {
        id: 'dashboard',
        title: 'Ana Ekran Dashboard 📊',
        content: 'Günlük özetinizi, yemek planlarınızı, spor ve namaz rutinlerinizi burada görebilirsiniz.',
        target: '.dashboard-grid',
        position: 'center',
        page: 'home'
      },
      {
        id: 'routines',
        title: 'Rutinler Sayfası 🔁',
        content: 'Kendi rutinlerinizi oluşturun ve takip edin. Her rutin için kurallarınızı belirleyebilirsiniz.',
        target: '[data-page="routines"]',
        position: 'top',
        page: 'routines'
      },
      {
        id: 'routines-content',
        title: 'Rutinler Modülü 📋',
        content: 'Burada rutinlerinizi görebilir, yeni rutin oluşturabilir ve mevcut rutinlerinizi yönetebilirsiniz.',
        target: '.rutinler-container',
        position: 'center',
        page: 'routines'
      },
      {
        id: 'fab',
        title: 'Hızlı Ekleme ➕',
        content: 'Rutinler sayfasında yeni rutin eklemek için + butonunu kullanabilirsiniz.',
        target: '.fab',
        position: 'left',
        page: 'routines'
      },
      {
        id: 'settings',
        title: 'Ayarlar ⚙️',
        content: 'Bildirimler, tema, AI ayarları ve profil bilgilerinizi burada yönetebilirsiniz.',
        target: '[data-page="settings"]',
        position: 'top',
        page: 'settings'
      }
    ];
  }

  showWelcomeModal() {
    const modal = document.createElement('div');
    modal.className = 'tutorial-modal';
    modal.innerHTML = `
      <div class="tutorial-overlay">
        <div class="tutorial-content">
          <div class="tutorial-header">
            <h2>FurkAI'ya Hoş Geldiniz! 🎉</h2>
            <button class="tutorial-close" onclick="window.TutorialManager?.skipTutorial()">×</button>
          </div>
          <div class="tutorial-body">
            <p>FurkAI, günlük rutinlerinizi yönetmenize yardımcı olan kişisel asistanınızdır.</p>
            <div class="tutorial-features">
              <div class="feature-item">
                <span class="feature-icon">🍴</span>
                <span class="feature-text">Yemek planlama ve AI önerileri</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🏃‍♂️</span>
                <span class="feature-text">Spor ve egzersiz takibi</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🕌</span>
                <span class="feature-text">Namaz vakitleri ve hatırlatıcılar</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📚</span>
                <span class="feature-text">Ezber ve öğrenme takibi</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔗</span>
                <span class="feature-text">Zincir takibi ve motivasyon</span>
              </div>
            </div>
          </div>
          <div class="tutorial-footer">
            <button class="btn btn-secondary" onclick="window.TutorialManager?.skipTutorial()">
              Atlayın
            </button>
            <button class="btn btn-primary" onclick="window.TutorialManager?.startTutorial()">
              Turu Başlat
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.isActive = true;
    
    // Modal dışına tıklamayı engelle
    this.blockInteractions();
  }

  async startTutorial() {
    // Welcome modal'ı kapat
    const modal = document.querySelector('.tutorial-modal');
    if (modal) {
      modal.remove();
    }

    // Interaction blocking'i kaldır (welcome modal için)
    this.unblockInteractions();

    this.currentStep = 0;
    this.isActive = true;
    
    // İlk adımı göster
    await this.showStep(0);
  }

  async showStep(stepIndex) {
    if (stepIndex >= this.steps.length) {
      await this.completeTutorial();
      return;
    }

    const step = this.steps[stepIndex];
    this.currentStep = stepIndex;

    // Sayfa geçişi yap
    if (step.page && window.PageManager) {
      await window.PageManager.switchPage(step.page);
      // Sayfa yüklenmesi için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Önceki tooltip'i temizle
    this.clearTooltip();

    // Yeni tooltip oluştur
    const tooltip = document.createElement('div');
    tooltip.className = 'tutorial-tooltip';
    tooltip.id = 'tutorial-tooltip';
    
    tooltip.innerHTML = `
      <div class="tooltip-content">
        <div class="tooltip-header">
          <h3>${step.title}</h3>
          <button class="tooltip-close" onclick="window.TutorialManager?.skipTutorial()">×</button>
        </div>
        <div class="tooltip-body">
          <p>${step.content}</p>
        </div>
        <div class="tooltip-footer">
          <div class="tooltip-progress">
            <span>${stepIndex + 1} / ${this.steps.length}</span>
          </div>
          <div class="tooltip-actions">
            ${stepIndex > 0 ? '<button class="btn btn-secondary" onclick="window.TutorialManager?.previousStep()">Geri</button>' : ''}
            <button class="btn btn-primary" onclick="window.TutorialManager?.nextStep()">
              ${stepIndex === this.steps.length - 1 ? 'Tamamla' : 'İleri'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(tooltip);

    // Tooltip'i hedef elemente göre konumlandır
    if (step.target) {
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        this.positionTooltip(tooltip, targetElement, step.position);
      } else {
        // Hedef element bulunamazsa merkeze yerleştir
        this.positionTooltip(tooltip, null, 'center');
      }
    } else {
      this.positionTooltip(tooltip, null, 'center');
    }

    // Highlight efekti ekle
    if (step.target) {
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        targetElement.classList.add('tutorial-highlight');
      }
    }
  }

  positionTooltip(tooltip, targetElement, position) {
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top, left;

    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      
      switch (position) {
        case 'top':
          top = targetRect.top - rect.height - 20;
          left = targetRect.left + (targetRect.width - rect.width) / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + 20;
          left = targetRect.left + (targetRect.width - rect.width) / 2;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - rect.height) / 2;
          left = targetRect.left - rect.width - 20;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - rect.height) / 2;
          left = targetRect.right + 20;
          break;
        default:
          top = targetRect.top + (targetRect.height - rect.height) / 2;
          left = targetRect.left + (targetRect.width - rect.width) / 2;
      }
    } else {
      // Merkeze yerleştir
      top = (viewportHeight - rect.height) / 2;
      left = (viewportWidth - rect.width) / 2;
    }

    // Viewport sınırları içinde tut
    top = Math.max(20, Math.min(top, viewportHeight - rect.height - 20));
    left = Math.max(20, Math.min(left, viewportWidth - rect.width - 20));

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  clearTooltip() {
    const tooltip = document.getElementById('tutorial-tooltip');
    if (tooltip) {
      tooltip.remove();
    }

    // Highlight efektini kaldır
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight');
    });
  }

  async nextStep() {
    await this.showStep(this.currentStep + 1);
  }

  async previousStep() {
    if (this.currentStep > 0) {
      await this.showStep(this.currentStep - 1);
    }
  }

  async skipTutorial() {
    this.clearTooltip();
    
    // Modal'ı kapat
    const modal = document.querySelector('.tutorial-modal');
    if (modal) {
      modal.remove();
    }

    // Interaction blocking'i kaldır
    this.unblockInteractions();

    this.isActive = false;
    await this.completeTutorial();
  }

  async completeTutorial() {
    this.isActive = false;
    this.hasSeenTutorial = true;
    
    // Tutorial tamamlandı olarak işaretle
    await window.DataManager.set('tutorial_completed', true);
    
    console.log('Tutorial tamamlandı');
    
    // Interaction blocking'i kaldır
    this.unblockInteractions();
    
    // Başarı mesajı göster
    this.showCompletionMessage();
  }

  showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'tutorial-completion';
    message.innerHTML = `
      <div class="completion-content">
        <div class="completion-icon">🎉</div>
        <h3>Tutorial Tamamlandı!</h3>
        <p>Artık FurkAI'yı kullanmaya hazırsınız!</p>
      </div>
    `;

    document.body.appendChild(message);

    // 3 saniye sonra kaldır
    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  // Interaction blocking metodları
  blockInteractions() {
    // Body'ye overlay ekle
    const overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay-blocker';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9998;
      background: transparent;
      pointer-events: auto;
    `;
    
    // Tıklamaları engelle
    overlay.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    
    document.body.appendChild(overlay);
  }

  unblockInteractions() {
    const overlay = document.getElementById('tutorial-overlay-blocker');
    if (overlay) {
      overlay.remove();
    }
  }

  // Tutorial'ı tekrar göster
  async showTutorialAgain() {
    this.hasSeenTutorial = false;
    await window.DataManager.set('tutorial_completed', false);
    await this.init();
  }
}

// Global olarak erişilebilir yap
window.TutorialManager = new TutorialManager();
