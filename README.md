# QUI Evrima Database v0.5.3

Bu sürüm yeni bir site değildir. v0.5.2'nin mevcut HTML/CSS/JS yapısı korunup yalnızca path, hero background ve kategori kartı sorunları düzeltilmiştir.

## Düzeltilenler

- Hero arka planı `<img>` olarak değil `.hero.hero-cinematic` üzerinde gerçek CSS `background-image` olarak kullanılıyor.
- GitHub Pages uyumlu relative path: `./assets/hero/hero-background.png`.
- Kullanıcının verdiği `hero-background.png` doğrudan `assets/hero/` içine yerleştirildi.
- Eski/stale `hero-background.webp` bağımlılığı kaldırıldı.
- Kategori kartları artık gerçek `<img>` kullanıyor; görsel, dark overlay ve yazılar ayrı katmanlarda.
- Carnivore / Herbivore / Omnivore kartlarında görsel sağa hizalı `object-fit: cover` ile tutulduğu için dinozorun tüm gövdesi kartta korunuyor.
- Mutations kartı `./assets/categories/mutations.webp` kullanıyor ve dosya pakete dahil.
- Kategori grid masaüstünde 4, tablette 2, mobilde 1 sütun.
- CSS ve JS için cache-busting eklendi (`?v=053`).
- `data.js` ve `script.js` relative path ile yükleniyor.
- HTML başlangıç sayaçları 22 / 35 / 11 / 9 / 2 / 35 olarak ayarlandı; JS yüklendiğinde yine veriden dinamik hesaplanıyor.
- Arama, Tüm Sınıflar, A-Z, Normal/Prime ve dinozor modal sistemi değiştirilmedi.

## Doğrulama

Paket içindeki local asset path'leri kontrol edildi:
- `./assets/hero/hero-background.png`
- `./assets/categories/carnivore.webp`
- `./assets/categories/herbivore.webp`
- `./assets/categories/omnivore.webp`
- `./assets/categories/mutations.webp`
- `./data.js`
- `./script.js`
- `./style.css`

`data.js` ve `script.js` JavaScript syntax kontrolünden geçti. `data.js` içinde 22 dinozor ve 35 mutation bulunuyor.

## GitHub'a yüklerken

ZIP'i çıkar ve klasörün **içindeki** `index.html`, `style.css`, `script.js`, `data.js`, `README.md` ve `assets` klasörünü repo köküne yükle.

Eski repo kökünde ayrıca `hero/`, `categories/`, `dinos/` gibi duplicate klasörler varsa bu sürüm onları kullanmaz; doğru yollar yalnızca `assets/...` altındadır.
