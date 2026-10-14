# Yaptığın tüm değişiklikleri GitHub'a gönderir; site 1-2 dakika içinde güncellenir.
# Kullanım:  powershell -ExecutionPolicy Bypass -File .\yayinla.ps1
Set-Location $PSScriptRoot
git add -A
git commit -m ("Günlük: " + (Get-Date -Format "yyyy-MM-dd HH:mm"))
git push
