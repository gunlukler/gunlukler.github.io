# Sessiz Sayfalar

Anonim, sade bir günlük sitesi. GitHub Pages (Jekyll) ile ücretsiz yayınlanır.

## Yeni günlük yazmak

**Yol 1: Tarayıcıdan (bilgisayar ya da telefon, hiçbir şey kurmadan)**

1. GitHub'da deponu aç → `_posts` klasörüne gir → **Add file → Create new file**.
2. Dosya adı: `YYYY-AA-GG-kisa-baslik.md` (ör. `2026-10-15-yagmurlu-sabah.md`).
   Adda Türkçe karakter ve boşluk kullanma; başlığın kendisinde kullanabilirsin.
3. İçerik:

   ```
   ---
   title: "Yağmurlu sabah"
   ruh_hali: "🌧️"
   ---

   Bugün...
   ```
4. **Commit changes** → 1-2 dakika sonra sitede görünür.

**Yol 2: Bilgisayardan**

```powershell
powershell -ExecutionPolicy Bypass -File .\yeni.ps1 "Yağmurlu sabah"   # dosyayı oluşturur, Not Defteri'nde açar
powershell -ExecutionPolicy Bypass -File .\yayinla.ps1                 # GitHub'a gönderir
```

## Yazım ipuçları (Markdown)

- Boş satır = yeni paragraf. İlk paragraf ana sayfada özet olarak görünür.
- `*italik*`, `**kalın**`, `> alıntı`, `---` (süslü ayraç).
- `ruh_hali` isteğe bağlı; herhangi bir emoji yazabilirsin.

## Ayarlar

`_config.yml` dosyasında site adı, açıklama, alt yazı ve arama motoru görünürlüğü (`arama_motorlari`) değiştirilebilir.

## Anonimlik notları

- Site adresi GitHub kullanıcı adını içerir (`kullaniciadi.github.io`) — gerçek adınla ilişkisi olmayan bir hesap kullan.
- GitHub → Settings → Emails → **Keep my email addresses private** açık olsun.
- Yazılarda yer, iş yeri, tanıdık isimleri gibi seni tanıtabilecek ayrıntılara dikkat et.
- Depo herkese açıktır: silinen bir yazı bile geçmişte (commit history) görülebilir.
