# Deploy script untuk GitHub Pages
# Menjalankan build production dan deploy ke GitHub Pages

Write-Host "🚀 Starting deployment to GitHub Pages..." -ForegroundColor Green

# Build aplikasi untuk production
Write-Host "📦 Building application for production..." -ForegroundColor Yellow
npm run build:prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy ke GitHub Pages
    Write-Host "🌐 Deploying to GitHub Pages..." -ForegroundColor Yellow
    npx angular-cli-ghpages --dir=dist/swing-trader-planner/browser
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host "📱 Your app will be available at: https://yourusername.github.io/swing-trader-planner/" -ForegroundColor Cyan
        Write-Host "⚠️  Note: Replace 'yourusername' with your actual GitHub username" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        Write-Host "💡 Make sure you have initialized a git repository and have GitHub Pages enabled" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "💡 Check the error messages above and fix any issues" -ForegroundColor Yellow
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
