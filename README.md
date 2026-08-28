# QUI Evrima Database

The Isle: Evrima için hazırlanmış Türkçe fan rehberi.

## GitHub Pages ile yayınlama

1. Bu paketin içindeki dosyaların tamamını `Qui-land/evrima` repository'sinin **kök dizinine** yükle.
2. Commit mesajına örneğin `İlk site sürümü` yaz ve commit et.
3. Repository'de **Settings > Pages** bölümüne gir.
4. **Build and deployment > Source** kısmında `Deploy from a branch` seç.
5. **Branch** olarak `main`, klasör olarak `/(root)` seç ve **Save** de.
6. GitHub birkaç dakika içinde siteyi yayınlar.
7. Adres: `https://qui-land.github.io/evrima/`

## Dosyalar

- `index.html` — ana sayfa
- `style.css` — tasarım
- `data.js` — dinozor ve mutasyon verileri
- `script.js` — filtreleme, arama ve modal etkileşimleri
- `assets/dinos/` — dinozor kartları için özgün stilize specimen SVG'leri

## Not

Bu sürümdeki dinozor görselleri kopyalanmış oyun ekranları değildir; siteyi ilk günden temiz ve çalışan hale getirmek için hazırlanmış özgün stilize placeholder/specimen görselleridir. İleride lisanslı veya izinli gerçek The Isle: Evrima görselleriyle değiştirilebilir.

Mutasyon verileri patch ve sunucu ayarlarına göre değişebileceğinden veri güncellemeleri `data.js` içinden yapılır.
