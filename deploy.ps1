# MoneyMap Vercel Deployment Script
Write-Host "Starting MoneyMap deployment to Vercel..." -ForegroundColor Cyan

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
} catch {
    $vercelInstalled = $null
}

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build the project
Write-Host "Building project..." -ForegroundColor Cyan
npm run build

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Don't forget to set up your MongoDB password in Vercel environment variables." -ForegroundColor Yellow 