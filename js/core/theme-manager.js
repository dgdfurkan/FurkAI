/**
 * Theme Manager - Tema yönetimi için
 */
class ThemeManager {
  constructor() {
    this.currentThemeId = 'modern-blue';
    this.themes = [];
    this.defaultTheme = null;
  }

  async init() {
    try {
      // Temaları yükle
      await this.loadThemes();
      
      // Kayıtlı temayı al
      const savedThemeId = window.DataManager?.getSetting('themeId');
      const themeToApply = this.getThemeById(savedThemeId) || this.defaultTheme;
      this.applyTheme(themeToApply);
      
      console.log('ThemeManager başlatıldı:', this.currentThemeId);
    } catch (error) {
      console.error('ThemeManager başlatılamadı:', error);
    }
  }

  async loadThemes() {
    try {
      const response = await fetch('/FurkAI/data/themes.json');
      const data = await response.json();
      this.themes = data.themes;
      this.defaultTheme = this.themes.find(t => t.id === 'modern-blue');
      console.log('Temalar yüklendi:', this.themes.length);
    } catch (error) {
      console.error('Temalar yüklenemedi:', error);
      // Fallback tema
      this.themes = [{
        id: 'modern-blue',
        name: 'Modern Mavi',
        description: 'Açık mavi-yeşil gradient arkaplan, beyaz kartlar',
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#F59E0B',
          accentSecondary: '#EF4444',
          background: 'linear-gradient(135deg, #E0F2FE 0%, #F0FDF4 50%, #E0F2FE 100%)',
          surface: 'rgba(255, 255, 255, 0.95)',
          bgPrimary: '#ffffff',
          bgSecondary: 'rgba(255, 255, 255, 0.9)',
          bgTertiary: 'rgba(240, 240, 240, 0.7)',
          textPrimary: '#1F2937',
          textSecondary: '#6B7280',
          border: 'rgba(59, 130, 246, 0.2)',
          shadow: 'rgba(0, 0, 0, 0.1)'
        }
      }];
      this.defaultTheme = this.themes[0];
    }
  }

  getAllThemes() {
    return this.themes;
  }

  getThemeById(themeId) {
    return this.themes.find(theme => theme.id === themeId);
  }

  getCurrentTheme() {
    return this.getThemeById(this.currentThemeId) || this.defaultTheme;
  }

  applyTheme(theme) {
    if (!theme) return;
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme.colors)) {
      root.style.setProperty(`--color-${key}`, value);
    }
    this.currentThemeId = theme.id;
    if (window.DataManager) {
      window.DataManager.saveSetting('themeId', theme.id);
    }
    console.log(`Tema uygulandı: ${theme.name}`);
  }

  setTheme(themeId) {
    const theme = this.getThemeById(themeId);
    if (theme) {
      this.applyTheme(theme);
      // Update theme selector UI if it's visible
      if (window.PageManager && window.PageManager.currentPage === 'settings') {
        window.PageManager.loadThemeSelector();
      }
    }
  }

  previewTheme(themeId) {
    const theme = this.getThemeById(themeId);
    if (!theme) return;
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme.colors)) {
      root.style.setProperty(`--color-${key}`, value);
    }
  }

  resetPreview() {
    this.applyTheme(this.getCurrentTheme());
  }
}

window.ThemeManager = new ThemeManager();