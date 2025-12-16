# Prompt and create server .env with GEOAPIFY_API_KEY (local only)
# Usage: .\scripts\set-geoapify.ps1

$target = Join-Path $PSScriptRoot '..\.env'

if (Test-Path $target) {
    Write-Host ".env already exists at $target. Aborting to avoid overwrite." -ForegroundColor Yellow
    Write-Host "If you want to replace it, delete it first and run this script again." -ForegroundColor Yellow
    exit 0
}

$key = Read-Host -Prompt 'Enter your Geoapify API key (will not be stored by this script except in .env)'
if ([string]::IsNullOrWhiteSpace($key)) {
    Write-Host 'No key entered. Aborting.' -ForegroundColor Yellow
    exit 1
}

$content = "GEOAPIFY_API_KEY=$key" + [Environment]::NewLine
Set-Content -Path $target -Value $content -NoNewline

Write-Host ".env created at $target with GEOAPIFY_API_KEY. Do NOT commit this file to git." -ForegroundColor Green
Write-Host "Start the proxy with: npm run serve:api" -ForegroundColor Cyan
