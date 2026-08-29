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

## v0.5.4 — Combat Guide sistemi

Mevcut dinozor detay modalı korunarak ikinci bir `Combat Guide / Savaş Rehberi` paneli eklendi.

- Dinozor adının yanında `⚔ COMBAT GUIDE` butonu bulunur.
- Masaüstünde rehber paneli mevcut dossier'in sağında açılır.
- Küçük ekranlarda rehber aynı modalın üzerinde responsive overlay olarak açılır.
- Combat Guide kapatıldığında dinozor detay penceresi açık kalır.
- Normal / Prime stat sistemi bağımsız şekilde çalışmaya devam eder.
- Prime modu değiştiğinde, ileride moda özel rehber girilmişse Combat Guide içeriği de uygun varyanta geçebilir.
- Rehber hazır değilse `FIELD NOTES UNAVAILABLE` mesajı gösterilir.

### Dinozor combatGuide veri şablonu

Her dinozorun kendi `combatGuide` nesnesi vardır:

```js
combatGuide: {
  status: "ready", // hazır değilse "pending"
  contributors: [
    { name: "Raven", role: "Allosaurus Main" },
    { name: "Qui", role: "Contributor" }
  ],
  shared: {
    playstyle: "Genel oynanış tarzı...",
    combatBasics: "Stamina, pozisyon ve zamanlama notları...",
    techniques: [
      { name: "Teknik adı", description: "Nasıl uygulanır..." }
    ],
    matchups: [
      { opponent: "Ceratosaurus", strategy: "Bu eşleşmede..." },
      { opponent: "Diabloceratops", strategy: "Bu eşleşmede..." }
    ],
    mistakes: [
      "Gereksiz stamina harcamak",
      "Rakibin dönüş açısını küçümsemek"
    ]
  },
  normal: null,
  prime: null
}
```

`shared` ortak rehberdir. İleride Normal veya Prime oynanışı farklıysa `normal` ya da `prime` alanına aynı içerik yapısında ayrı rehber eklenebilir. Sistem önce moda özel rehberi, yoksa `shared` rehberi kullanır.
