# Create a local .env.local from .env.local.example safely
# Usage: .\scripts\create-env.ps1

$example = Join-Path $PSScriptRoot '..\.env.local.example'
$target = Join-Path $PSScriptRoot '..\.env.local'

if (-not (Test-Path $example)) {
    Write-Error "Example file not found: $example"
    exit 1
}

if (Test-Path $target) {
    Write-Host ".env.local already exists at $target. Aborting to avoid overwrite." -ForegroundColor Yellow
    exit 0
}

$content = Get-Content $example -Raw

# Prompt for API key
$key = Read-Host -Prompt 'Enter your Google API key (will not be stored by this script)'
if ([string]::IsNullOrWhiteSpace($key)) {
    Write-Host 'No key entered. Creating .env.local with placeholder. You must edit it manually.' -ForegroundColor Yellow
    $content = $content -replace 'REPLACE_WITH_YOUR_GOOGLE_API_KEY',''
} else {
    $content = $content -replace 'REPLACE_WITH_YOUR_GOOGLE_API_KEY', $key
}

# Write file with file mode for user only (best-effort)
Set-Content -Path $target -Value $content -NoNewline

Write-Host ".env.local created at $target. Do NOT commit this file to git." -ForegroundColor Green
Write-Host "If you want to test immediately for this PowerShell session, run:`$env:VITE_GOOGLE_API_KEY='$key'` and restart your dev server." -ForegroundColor Cyan
