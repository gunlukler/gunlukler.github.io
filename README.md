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

**Yol 2: Bilgisayardan — masaüstündeki "Yeni Günlük" simgesi**

1. Simgeye çift tıkla → başlığı ve (istersen) ruh hâli emojisini yaz.
2. Not Defteri açılır → "Bugün..." yerine günlüğünü yaz → **Ctrl + S** ile kaydet.
3. Küçük pencerede **Tamam**'a bas → yazı siteye gönderilir.

Simge `yeni-gunluk.ps1` betiğini çalıştırır. Simge silinirse Claude'dan yeniden oluşturmasını isteyebilirsin.

## Yazım ipuçları (Markdown)

- Boş satır = yeni paragraf. İlk paragraf ana sayfada özet olarak görünür.
- `*italik*`, `**kalın**`, `> alıntı`, `---` (süslü ayraç).
- `ruh_hali` isteğe bağlı; herhangi bir emoji yazabilirsin.

## Ayarlar

`_config.yml` dosyasında site adı, açıklama, alt yazı ve arama motoru görünürlüğü (`arama_motorlari`) değiştirilebilir.

## Reklam (Google AdSense)

1. AdSense onayı için kendi alan adın gerekir (ör. `ornek.com`); `github.io` adresleri genelde kabul edilmez.
2. Onaydan sonra `_config.yml` içindeki `adsense_id` alanına `ca-pub-...` kimliğini yaz → reklam kodu ve `ads.txt` otomatik oluşur.
3. Gizlilik politikası sayfası hazır: `/gizlilik/`.

## Anonimlik notları

- Site adresi GitHub kullanıcı adını içerir (`kullaniciadi.github.io`) — gerçek adınla ilişkisi olmayan bir hesap kullan.
- GitHub → Settings → Emails → **Keep my email addresses private** açık olsun.
- Yazılarda yer, iş yeri, tanıdık isimleri gibi seni tanıtabilecek ayrıntılara dikkat et.
- Depo herkese açıktır: silinen bir yazı bile geçmişte (commit history) görülebilir.
