@echo off
echo 🚀 Starting deployment to GitHub Pages...

echo 📦 Building application for production...
call npm run build:prod

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 🌐 Deploying to GitHub Pages...
    call npx angular-cli-ghpages --dir=dist/swing-trader-planner/browser
    
    if %errorlevel% equ 0 (
        echo 🎉 Deployment successful!
        echo 📱 Your app will be available at: https://yourusername.github.io/swing-trader-planner/
        echo ⚠️  Note: Replace 'yourusername' with your actual GitHub username
    ) else (
        echo ❌ Deployment failed!
        echo 💡 Make sure you have initialized a git repository and have GitHub Pages enabled
    )
) else (
    echo ❌ Build failed!
    echo 💡 Check the error messages above and fix any issues
)

pause
