# FurkAI PWA - README

## Kurulum ve Kullanım

### 1. GitHub Pages'e Deploy Etme

1. Bu repository'yi GitHub'a push edin
2. Repository Settings > Pages bölümüne gidin
3. Source olarak "Deploy from a branch" seçin
4. Branch olarak "main" seçin
5. Save butonuna tıklayın

### 2. iPhone Safari'de Ana Ekrana Ekleme

1. Safari'de uygulamayı açın
2. Alt kısımdaki paylaş butonuna (⬆️) tıklayın
3. "Ana Ekrana Ekle" seçeneğini seçin
4. Uygulama adını onaylayın ve "Ekle" butonuna tıklayın

### 3. Bildirim İzinleri

1. Ana ekrandan uygulamayı açın
2. Ayarlar > Bildirimler bölümüne gidin
3. "Bildirimleri etkinleştir" seçeneğini açın
4. Tarayıcı bildirim izni isteyecek, "İzin Ver" seçin

### 4. AI Entegrasyonu (Opsiyonel)

1. Ayarlar > AI Entegrasyonu bölümüne gidin
2. OpenAI API anahtarınızı girin (sk- ile başlayan)
3. Anahtarınız cihazınızda güvenle saklanır

## Özellikler

### 🍽️ Yemek Modülü
- **Kiler Yönetimi**: Ürün ekleme, barkod tarama, stok takibi
- **Tarifler**: Tarif oluşturma ve yönetimi
- **Haftalık Plan**: Otomatik yemek planı oluşturma
- **Alışveriş Listesi**: Eksik malzemeleri otomatik listeleme
- **AI Öneri**: ChatGPT ile kişiselleştirilmiş yemek önerileri

### 💪 Spor Modülü
- **Program Yönetimi**: Antrenman programları oluşturma
- **Seans Takibi**: Antrenman süresi ve kalori takibi
- **Streak Sistemi**: Günlük antrenman zinciri
- **İstatistikler**: Detaylı performans analizi

### 🕌 Namaz Modülü
- **Vakit Yönetimi**: Namaz vakitlerini planlama
- **Hatırlatmalar**: Vakit yaklaşınca bildirim
- **Kayıt Sistemi**: Namaz kılma takibi
- **Takvim Entegrasyonu**: ICS dosyası dışa aktarma

### 📖 Ezber Modülü
- **Hedef Belirleme**: Sure, ayet, hadis hedefleri
- **Spaced Repetition**: Bilimsel tekrar sistemi
- **İlerleme Takibi**: Ezber durumu analizi
- **Hatırlatmalar**: Düzenli tekrar bildirimleri

### ⛓️ Zincir Modülü
- **Alışkanlık Takibi**: "Don't Break The Chain" sistemi
- **Takvim Görünümü**: Günlük tamamlama takibi
- **Rozet Sistemi**: Başarı rozetleri ve ödüller
- **Esneklik**: Haftalık hedef ayarlama

### ✅ ToDo + Takvim Modülü
- **Günlük Görünüm**: Saat bazlı görev planlama
- **Haftalık Görünüm**: Haftalık görev dağılımı
- **Aylık Görünüm**: Aylık görev takvimi
- **Yıllık Görünüm**: Yıllık planlama
- **Modül Entegrasyonu**: Diğer modüllerle bağlantılı görevler

## Teknik Özellikler

- **PWA**: Progressive Web App desteği
- **Offline**: İnternet bağlantısı olmadan çalışma
- **Responsive**: Tüm cihazlarda uyumlu tasarım
- **IndexedDB**: Yerel veri saklama
- **Service Worker**: Arka plan işlemleri
- **Push Notifications**: Bildirim sistemi
- **SOLID Architecture**: Modüler ve genişletilebilir kod yapısı

## Veri Güvenliği

- Tüm veriler cihazınızda saklanır
- Hiçbir veri sunucuya gönderilmez
- AI API anahtarı sadece cihazınızda saklanır
- İsteğe bağlı dışa aktarım (JSON/ICS)

## Geliştirme

### Yeni Modül Ekleme

1. `js/modules/` klasöründe yeni modül dosyası oluşturun
2. `BaseModule` sınıfından türetin
3. `ModuleManager.registerModule()` ile kaydedin
4. CSS stillerini `css/modules.css` dosyasına ekleyin

### Yeni Özellik Ekleme

1. İlgili modül dosyasını düzenleyin
2. Veri modelini `DataManager` ile uyumlu hale getirin
3. UI bileşenlerini ekleyin
4. Olay sistemini kullanarak modüller arası iletişim kurun

## Sorun Giderme

### Bildirimler Çalışmıyor
- Ana ekrandan uygulamayı açtığınızdan emin olun
- Tarayıcı bildirim izinlerini kontrol edin
- Ayarlar > Bildirimler bölümünden etkinleştirin

### AI Önerileri Çalışmıyor
- OpenAI API anahtarınızın doğru olduğundan emin olun
- İnternet bağlantınızı kontrol edin
- API kullanım limitlerinizi kontrol edin

### Veriler Kayboldu
- Tarayıcı verilerini temizlemediğinizden emin olun
- IndexedDB desteğinin aktif olduğunu kontrol edin
- Düzenli olarak verilerinizi dışa aktarın

## Destek

Sorunlarınız için GitHub Issues kullanabilir veya dokümantasyonu inceleyebilirsiniz.
