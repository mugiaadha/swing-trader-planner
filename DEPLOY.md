# Deployment instructions untuk GitHub Pages

## Langkah-langkah Deploy:

### 1. Setup Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Swing Trader Planner"
git branch -M main
git remote add origin https://github.com/yourusername/swing-trader-planner.git
git push -u origin main
```

### 2. Deploy menggunakan npm script
```bash
npm run deploy
```

### 3. Setup GitHub Pages
1. Buka repository di GitHub
2. Klik Settings
3. Scroll ke bagian "Pages"
4. Pilih "Deploy from a branch"
5. Pilih branch "gh-pages"
6. Klik Save

### 4. Akses Aplikasi
Aplikasi akan tersedia di: `https://yourusername.github.io/swing-trader-planner/`

(Ganti "yourusername" dengan username GitHub Anda)

## Alternatif Deploy:

### Menggunakan PowerShell:
```powershell
.\deploy.ps1
```

### Menggunakan Batch:
```cmd
deploy.bat
```

## Notes:
- Pastikan repository sudah public atau GitHub Pages sudah enabled
- Deployment bisa memakan waktu beberapa menit
- Jika ada perubahan, jalankan deploy script lagi
