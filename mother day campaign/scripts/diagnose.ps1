# Chay nhe: npm run diagnose
# Kiem tra moi truong va goi y khi may treo / Next cham.

$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $root

Write-Host "=== mothers-day-campaign: diagnose ===" -ForegroundColor Cyan
Write-Host "Thu muc: $root"

Write-Host "`n--- Phien ban ---" -ForegroundColor Yellow
try { node -v } catch { Write-Host "node: khong tim thay" -ForegroundColor Red }
try { npm -v } catch { Write-Host "npm: khong tim thay" -ForegroundColor Red }

Write-Host "`n--- Bien moi truong (khong in gia tri bi mat) ---" -ForegroundColor Yellow
$envFile = Join-Path $root ".env.local"
if (Test-Path $envFile) {
    Write-Host ".env.local: co"
    $names = @(
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
        "NEXT_PUBLIC_SITE_URL"
    )
    foreach ($n in $names) {
        $found = Get-Content -LiteralPath $envFile -ErrorAction SilentlyContinue | Where-Object { $_ -like "$n=*" }
        if ($found) { Write-Host "  $n : da khai bao" } else { Write-Host "  $n : THIEU" -ForegroundColor Red }
    }
} else {
    Write-Host ".env.local: KHONG co (sao chep tu .env.example)" -ForegroundColor Red
}

Write-Host "`n--- Thu muc build ---" -ForegroundColor Yellow
$nextDir = Join-Path $root ".next"
if (Test-Path $nextDir) {
    try {
        $size = (Get-ChildItem $nextDir -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $mb = [math]::Round($size / 1MB, 1)
        Write-Host ".next: ~ $mb MB"
    } catch {
        Write-Host ".next: co nhung khong do duoc kich thuoc" -ForegroundColor DarkYellow
    }
    Write-Host "  Neu dev/build loi bat thuong: xoa .next roi chay lai npm run dev" -ForegroundColor DarkGray
} else {
    Write-Host ".next: chua co (binh thuong truoc lan build/dev dau)"
}

Write-Host "`n--- node_modules ---" -ForegroundColor Yellow
$nm = Join-Path $root "node_modules"
if (Test-Path $nm) {
    Write-Host "node_modules: co"
} else {
    Write-Host "node_modules: THIEU - chay npm install" -ForegroundColor Red
}

Write-Host "`n--- Goi y khi may treo khi chay terminal / npm dev ---" -ForegroundColor Yellow
Write-Host '1) Next 16 mac dinh Turbopack; project dung "npm run dev" = webpack (on dinh hon tren Windows).'
Write-Host '2) Dong cac tien trinh node.exe cu trong Task Manager truoc khi chay lai.'
Write-Host '3) Tam tat Real-time scan thu muc project trong Windows Defender neu RAM thap.'
Write-Host '4) Album Supabase: photos phai la JSON array 6-10 items, moi item co url va caption (string). Sai se bao loi 500.'
Write-Host "`nXong." -ForegroundColor Green
