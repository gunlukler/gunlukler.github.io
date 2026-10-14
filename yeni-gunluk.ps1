# Masaüstündeki "Yeni Günlük" simgesinin çalıştırdığı betik.
# Başlık sorar → Not Defteri'nde yeni günlük açar → "Tamam" denince siteye gönderir.
param(
  [string]$Baslik,
  [string]$RuhHali,
  [switch]$Sessiz   # test için: pencere açmadan çalışır
)

Add-Type -AssemblyName Microsoft.VisualBasic
Add-Type -AssemblyName System.Windows.Forms
$ad = "Yeni Günlük"

function Mesaj($metin, $tur = "Information", $dugme = "OK") {
  if ($Sessiz) { Write-Host $metin; return "OK" }
  return [System.Windows.Forms.MessageBox]::Show($metin, $ad, $dugme, $tur)
}

Set-Location $PSScriptRoot

# 1) Başlık ve ruh hâli
if (-not $Baslik) {
  $Baslik = [Microsoft.VisualBasic.Interaction]::InputBox("Bugünkü yazının başlığı ne olsun?", $ad, "")
  if (-not $Baslik.Trim()) { exit }   # boş bırakıldı ya da İptal
  $RuhHali = [Microsoft.VisualBasic.Interaction]::InputBox(
    "Ruh hâlin? (isteğe bağlı)`n`nBir emoji yazabilirsin, örneğin: ☕ 🌧️ 😊 🌱`nEmoji paneli için Windows tuşu + nokta (.) tuşlarına bas.`nBoş bırakabilirsin.", $ad, "")
}
$Baslik = $Baslik.Trim()

# 2) Önce GitHub'daki yeni yazıları indir (siteden yazılanlar kaybolmasın)
git pull --rebase --quiet 2>$null
# Daha önce internet yokken gönderilemeyen yazı kaldıysa onu da gönder
git push --quiet 2>$null

# 3) Dosya adı: 2026-10-15-yagmurlu-sabah.md
$tarih = Get-Date -Format "yyyy-MM-dd"
$kisa = $Baslik.ToLower()
$harfler = @{ 'ç' = 'c'; 'ğ' = 'g'; 'ı' = 'i'; 'ö' = 'o'; 'ş' = 's'; 'ü' = 'u'; 'â' = 'a'; 'î' = 'i'; 'û' = 'u' }
foreach ($h in $harfler.Keys) { $kisa = $kisa.Replace($h, $harfler[$h]) }
$kisa = ($kisa -replace '[^a-z0-9]+', '-').Trim('-')
if (-not $kisa) { $kisa = "gunluk" }
$yol = Join-Path $PSScriptRoot "_posts\$tarih-$kisa.md"
$sayac = 2
while (Test-Path $yol) { $yol = Join-Path $PSScriptRoot "_posts\$tarih-$kisa-$sayac.md"; $sayac++ }

$sablon = "Bugün..."
$icerik = "---`ntitle: `"$($Baslik.Replace('"', '\"'))`"`nruh_hali: `"$("$RuhHali".Trim())`"`n---`n`n$sablon`n"
[IO.File]::WriteAllText($yol, $icerik, (New-Object Text.UTF8Encoding $false))

# 4) Not Defteri'nde yaz
if (-not $Sessiz) {
  Start-Process notepad.exe -ArgumentList "`"$yol`""
  Start-Sleep -Milliseconds 800
  $cevap = Mesaj ("Not Defteri açıldı. ""Bugün..."" yazan yeri silip günlüğünü yaz.`n`n" +
    "Bitince Not Defteri'nde KAYDET (Ctrl + S), sonra buradaki 'Tamam' düğmesine bas; yazın siteye gönderilecek.`n`n" +
    "Vazgeçmek için 'İptal'e bas.") "Information" "OKCancel"
  if ($cevap -ne "OK") {
    Remove-Item $yol -ErrorAction SilentlyContinue
    Mesaj "Vazgeçildi, hiçbir şey gönderilmedi."
    exit
  }
}

# 5) Hiç yazılmadıysa gönderme
$yazilan = [IO.File]::ReadAllText($yol)
if (($yazilan -split '---', 3)[2].Trim() -eq $sablon) {
  $cevap = Mesaj "Yazı hâlâ boş görünüyor (sadece ""Bugün..."" yazıyor).`n`nKaydetmeyi unutmuş olabilir misin? Not Defteri'nde Ctrl + S'ye bas, sonra 'Yeniden dene'ye tıkla.`n'İptal' dersen bu yazı silinir." "Warning" "RetryCancel"
  if ($cevap -eq "Retry") { $yazilan = [IO.File]::ReadAllText($yol) }
  if ($cevap -ne "Retry" -or ($yazilan -split '---', 3)[2].Trim() -eq $sablon) {
    Remove-Item $yol -ErrorAction SilentlyContinue
    Mesaj "Boş yazı silindi, hiçbir şey gönderilmedi."
    exit
  }
}

# 6) Gönder
git add -- $yol
git commit --quiet -m "Günlük: $Baslik"
$cikti = git push --quiet 2>&1
if ($LASTEXITCODE -eq 0) {
  Mesaj "Gönderildi! 🎉`n`n1-2 dakika sonra sitende görünecek:`nhttps://gunlukler.github.io"
} else {
  Mesaj ("Yazın bilgisayarına kaydedildi ama siteye gönderilemedi.`nİnternet bağlantını kontrol edip simgeye tekrar tıkladığında gönderilir.`n`nAyrıntı:`n" + ($cikti | Out-String)) "Error"
}
