/**
 * Theme Manager - Tema yönetimi için
 */
class ThemeManager {
  constructor() {
    this.currentTheme = 'modern-blue';
    this.themes = null;
    this.init();
  }

  async init() {
    try {
      // Temaları yükle
      await this.loadThemes();
      
      // Kayıtlı temayı al
      const savedTheme = localStorage.getItem('furkai-theme');
      if (savedTheme && this.themes.find(t => t.id === savedTheme)) {
        this.currentTheme = savedTheme;
      }
      
      // Temayı uygula
      this.applyTheme(this.currentTheme);
      
      console.log('ThemeManager başlatıldı:', this.currentTheme);
    } catch (error) {
      console.error('ThemeManager başlatılamadı:', error);
    }
  }

  async loadThemes() {
    try {
      const response = await fetch('/FurkAI/data/themes.json');
      const data = await response.json();
      this.themes = data.themes;
      console.log('Temalar yüklendi:', this.themes.length);
    } catch (error) {
      console.error('Temalar yüklenemedi:', error);
      // Fallback tema
      this.themes = [{
        id: 'modern-blue',
        name: 'Modern Mavi',
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#F59E0B',
          accent-secondary: '#EF4444',
          background: 'linear-gradient(135deg, #E0F2FE 0%, #F0FDF4 50%, #E0F2FE 100%)',
          surface: 'rgba(255, 255, 255, 0.9)',
          surface-secondary: 'rgba(255, 255, 255, 0.7)',
          text-primary: '#1F2937',
          text-secondary: '#6B7280',
          border: 'rgba(59, 130, 246, 0.2)',
          shadow: 'rgba(0, 0, 0, 0.1)'
        }
      }];
    }
  }

  applyTheme(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) {
      console.error('Tema bulunamadı:', themeId);
      return;
    }

    this.currentTheme = themeId;
    
    // CSS değişkenlerini güncelle
    const root = document.documentElement;
    const colors = theme.colors;
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-secondary', colors.accent-secondary);
    root.style.setProperty('--color-bg-primary', colors.background);
    root.style.setProperty('--color-bg-secondary', colors.surface);
    root.style.setProperty('--color-bg-tertiary', colors.surface-secondary);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-shadow', colors.shadow);

    // Arkaplanı güncelle
    document.body.style.background = colors.background;
    
    // LocalStorage'a kaydet
    localStorage.setItem('furkai-theme', themeId);
    
    console.log('Tema uygulandı:', theme.name);
  }

  getCurrentTheme() {
    return this.themes.find(t => t.id === this.currentTheme);
  }

  getAllThemes() {
    return this.themes || [];
  }

  setTheme(themeId) {
    this.applyTheme(themeId);
  }

  // Tema önizlemesi için
  previewTheme(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    const colors = theme.colors;
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-secondary', colors.accent-secondary);
    root.style.setProperty('--color-bg-primary', colors.background);
    root.style.setProperty('--color-bg-secondary', colors.surface);
    root.style.setProperty('--color-bg-tertiary', colors.surface-secondary);
    root.style.setProperty('--color-text-primary', colors.textPrimary);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-shadow', colors.shadow);

    document.body.style.background = colors.background;
  }

  // Önizlemeyi geri al
  resetPreview() {
    this.applyTheme(this.currentTheme);
  }
}

// Global olarak erişilebilir yap
window.ThemeManager = new ThemeManager();
