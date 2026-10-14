# Bugünün tarihiyle yeni bir günlük dosyası oluşturur ve Not Defteri'nde açar.
# Kullanım:  powershell -ExecutionPolicy Bypass -File .\yeni.ps1 "Bugünün başlığı"
param([Parameter(Mandatory = $true)][string]$Baslik)

$tarih = Get-Date -Format "yyyy-MM-dd"
$kisa = $Baslik.ToLower()
$harfler = @{ 'ç' = 'c'; 'ğ' = 'g'; 'ı' = 'i'; 'ö' = 'o'; 'ş' = 's'; 'ü' = 'u'; 'â' = 'a'; 'î' = 'i'; 'û' = 'u' }
foreach ($h in $harfler.Keys) { $kisa = $kisa.Replace($h, $harfler[$h]) }
$kisa = ($kisa -replace '[^a-z0-9]+', '-').Trim('-')
if (-not $kisa) { $kisa = "gunluk" }

$yol = Join-Path $PSScriptRoot "_posts\$tarih-$kisa.md"
if (Test-Path $yol) { Write-Host "Bu dosya zaten var: $yol"; notepad $yol; exit }

$icerik = @"
---
title: "$($Baslik.Replace('"', '\"'))"
ruh_hali: ""
---

Bugün...
"@
[IO.File]::WriteAllText($yol, $icerik, (New-Object Text.UTF8Encoding $false))
Write-Host "Oluşturuldu: $yol"
notepad $yol
