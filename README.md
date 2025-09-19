# FurkAI - Personal Assistant PWA

FurkAI, günlük rutinlerinizi yönetmenize yardımcı olan modern bir Progressive Web App (PWA) kişisel asistanıdır.

## 🚀 Özellikler

### 📱 Modern Arayüz
- **Bottom Navigation**: Ana Ekran, Takvim, Rutinler, Ayarlar
- **Dashboard**: Günlük özet ve hızlı erişim kartları
- **Glassmorphism**: Modern cam efekti tasarım
- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Tutorial**: İlk kullanıcılar için interaktif rehber

### 🔁 Rutinler Modülü
- **Hazır Şablonlar**: Yemek, Spor, Namaz, Ezber, Zincir rutinleri
- **Özel Rutinler**: Kendi rutinlerinizi oluşturun
- **Takip Sistemi**: Tamamlanan, zincir, başarı oranı
- **Hatırlatıcılar**: Zaman bazlı bildirimler
- **Kategoriler**: Sabah, Akşam, Spor, Yemek, Namaz, Öğrenme

### 🍴 Yemek Modülü
- **AI Önerileri**: ChatGPT entegrasyonu ile akıllı yemek önerileri
- **Pantry Yönetimi**: Mutfak malzemelerinizi takip edin
- **Tarifler**: Favori tariflerinizi kaydedin
- **Haftalık Planlama**: Öğün planlarınızı organize edin
- **Alışveriş Listesi**: Otomatik alışveriş listesi oluşturma

### 🏃‍♂️ Spor Modülü
- **Egzersiz Takibi**: Günlük fiziksel aktivite kaydı
- **Hedef Belirleme**: Kişisel fitness hedefleri
- **İlerleme Takibi**: Performans analizi
- **Hatırlatıcılar**: Egzersiz zamanı bildirimleri

### 🕌 Namaz Modülü
- **Vakit Takibi**: Günlük namaz vakitleri
- **Hatırlatıcılar**: Namaz zamanı bildirimleri
- **İlerleme**: Namaz kılma takibi
- **Özel Ayarlar**: Konum bazlı vakit hesaplama

### 📚 Ezber Modülü
- **Sure Ezberleme**: Kuran surelerini takip edin
- **Dua Ezberleme**: Günlük duaları öğrenin
- **İlerleme Takibi**: Ezber durumu analizi
- **Tekrar Sistemi**: Unutmayı önleyici tekrar programı

### 🔗 Zincir Modülü
- **Habit Tracking**: Alışkanlık takibi
- **Zincir Kırma**: Süreklilik motivasyonu
- **İstatistikler**: Detaylı analiz ve raporlar
- **Hedefler**: Uzun vadeli alışkanlık hedefleri

### ✅ Todo/Calendar Modülü
- **Görev Yönetimi**: Günlük, haftalık, aylık görevler
- **Takvim Entegrasyonu**: Tarih bazlı planlama
- **Öncelik Sistemi**: Acil ve önemli görevler
- **Kategoriler**: İş, kişisel, sağlık kategorileri

## 🛠️ Teknoloji Stack

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **PWA**: Progressive Web App desteği
- **Storage**: IndexedDB ile offline veri saklama
- **Caching**: Service Worker ile akıllı önbellekleme
- **AI**: OpenAI ChatGPT API entegrasyonu
- **Design**: Modern CSS Grid/Flexbox
- **Icons**: Custom emoji ve icon sistemi

## 📦 Kurulum

### Yerel Geliştirme
```bash
# Repository'yi klonlayın
git clone https://github.com/furkangunduz/FurkAI.git
cd FurkAI

# Basit HTTP server başlatın
python3 -m http.server 8000

# Tarayıcıda açın
open http://localhost:8000
```

### PWA Olarak Yükleme
1. Tarayıcıda `index.html` dosyasını açın
2. "Ana ekrana ekle" seçeneğini kullanın
3. Uygulama ana ekranınızda görünecek

## 🎯 Kullanım

### İlk Kullanım
1. Uygulamayı açın
2. Tutorial'ı takip edin
3. Hazır rutinleri inceleyin
4. Kendi rutinlerinizi oluşturun

### Rutin Oluşturma
1. "Rutinler" sayfasına gidin
2. "Yeni Rutin" butonuna tıklayın
3. Kategori, sıklık, zaman belirleyin
4. Hatırlatıcıları ayarlayın
5. Rutini kaydedin

### AI Yemek Önerileri
1. "Yemek" modülüne gidin
2. Mevcut malzemelerinizi girin
3. AI'dan öneri isteyin
4. Önerileri favorilerinize ekleyin

## 🔧 Geliştirme

### Proje Yapısı
```
FurkAI/
├── css/                 # Stil dosyaları
│   ├── app.css         # Ana uygulama stilleri
│   ├── components.css  # Bileşen stilleri
│   ├── design-system.css # Tasarım sistemi
│   └── modules.css     # Modül stilleri
├── js/
│   ├── core/           # Çekirdek sistemler
│   │   ├── app.js      # Ana uygulama
│   │   ├── data-manager.js # Veri yönetimi
│   │   ├── event-system.js # Olay sistemi
│   │   ├── module-manager.js # Modül yönetimi
│   │   ├── page-manager.js # Sayfa yönetimi
│   │   ├── tutorial-manager.js # Tutorial sistemi
│   │   └── ai-service.js # AI servisleri
│   └── modules/        # Uygulama modülleri
│       ├── yemek.js    # Yemek modülü
│       ├── spor.js     # Spor modülü
│       ├── namaz.js    # Namaz modülü
│       ├── ezber.js    # Ezber modülü
│       ├── zincir.js   # Zincir modülü
│       ├── todo.js     # Todo modülü
│       └── rutinler.js # Rutinler modülü
├── icons/              # PWA ikonları
├── index.html          # Ana HTML dosyası
├── manifest.json       # PWA manifest
└── sw.js              # Service Worker
```

### Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👨‍💻 Geliştirici

**Furkan Gündüz**
- GitHub: [@furkangunduz](https://github.com/furkangunduz)
- Email: furkan@example.com

## 🙏 Teşekkürler

- OpenAI ChatGPT API
- Modern CSS Grid/Flexbox
- Progressive Web App standartları
- Tüm açık kaynak kütüphaneler

## 📈 Gelecek Planları

- [ ] Hesap sistemi ve veri senkronizasyonu
- [ ] Daha fazla AI entegrasyonu
- [ ] Gelişmiş analitik ve raporlama
- [ ] Sosyal özellikler ve paylaşım
- [ ] Mobil uygulama versiyonu
- [ ] Çoklu dil desteği

---

**FurkAI** - Günlük rutinlerinizi yönetmenin modern yolu! 🚀