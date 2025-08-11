# 🎯 Swing Trader Planner

Aplikasi web professional untuk membuat rencana trading saham dengan diversifikasi dan manajemen risiko yang sistematis.

## ✨ Fitur

- **📊 Input Dinamis**: Masukkan daftar saham, periode trading, dan jumlah tahap
- **⚖️ Diversifikasi Otomatis**: Equal weight allocation untuk minimasi risiko
- **📈 Multi-Phase Planning**: Pembagian periode trading dalam beberapa tahap
- **💰 Kalkulator Modal**: Kalkulasi alokasi dana per saham
- **🛡️ Risk Management**: Panduan stop loss, take profit, dan position sizing
- **📱 Responsive Design**: Interface yang mobile-friendly
- **🎨 Modern UI**: Design yang profesional dan mudah digunakan

## 🚀 Cara Menggunakan

### Input Parameter:
1. **Daftar Saham**: Masukkan kode saham yang dipisahkan koma (contoh: CDIA,PTRO,BREN,CUAN)
2. **Modal Trading**: Masukkan total modal dalam IDR (default: 100 juta)
3. **Periode**: Tentukan berapa hari trading (contoh: 90 hari)
4. **Jumlah Tahap**: Tentukan berapa fase pembagian (contoh: 3 tahap)

### Output yang Dihasilkan:
- Overview lengkap rencana trading
- Breakdown alokasi per fase
- Kalkulasi modal per saham
- Timeline setiap fase
- Panduan risk management

## 🛠️ Teknologi

- **Angular 20**: Framework frontend modern
- **TypeScript**: Type-safe development
- **CSS3**: Styling responsive dan modern
- **Angular CLI**: Development tools

## 📦 Instalasi & Development

```bash
# Install dependencies
npm install

# Run development server
ng serve

# Build for production
npm run build:prod

# Deploy to GitHub Pages
npm run deploy
```

## 🌐 Deployment ke GitHub Pages

### Opsi 1: Menggunakan npm script
```bash
npm run deploy
```

### Opsi 2: Menggunakan PowerShell script
```powershell
.\deploy.ps1
```

### Opsi 3: Menggunakan Batch script
```cmd
deploy.bat
```

### Setup GitHub Pages:
1. Push project ke GitHub repository
2. Pergi ke Settings → Pages
3. Pilih "Deploy from a branch"
4. Pilih branch "gh-pages"
5. Aplikasi akan tersedia di: `https://yourusername.github.io/swing-trader-planner/`

## 📊 Contoh Penggunaan

**Input:**
- Saham: CDIA,PTRO,BREN,CUAN
- Modal: 100,000,000 IDR
- Periode: 90 hari
- Tahap: 3 fase

**Output:**
- Fase 1 (Hari 1-30): 25% CDIA, 25% PTRO, 25% BREN, 25% CUAN
- Fase 2 (Hari 31-60): Rebalancing dengan alokasi yang sama
- Fase 3 (Hari 61-90): Rebalancing final

## 🛡️ Risk Management Features

- **Stop Loss Guidelines**: 5-8% per posisi
- **Take Profit Targets**: 15-25% per fase
- **Position Sizing**: Maksimal 25% per saham
- **Rebalancing Schedule**: Setiap awal fase

## 🎨 UI/UX Features

- **Gradient Background**: Design modern dengan warna professional
- **Card-based Layout**: Informasi terorganisir dengan baik
- **Responsive Grid**: Adaptif untuk semua device
- **Interactive Elements**: Hover effects dan smooth transitions
- **Color-coded Information**: Mudah dibaca dan dipahami

## 📱 Mobile Support

Aplikasi fully responsive dan optimal untuk:
- Desktop browsers
- Tablet devices  
- Mobile phones

## 🔧 Customization

Aplikasi dapat dikustomisasi untuk:
- Strategi alokasi berbeda (tidak hanya equal weight)
- Tambahan parameter risk management
- Integrasi dengan data real-time
- Export ke Excel/PDF
- Historical performance tracking

## 📄 License

MIT License - bebas digunakan untuk keperluan personal maupun komersial.

## 🤝 Contributing

Kontribusi sangat welcome! Silakan:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di GitHub repository.

---

**⚠️ Disclaimer**: Aplikasi ini hanya untuk tujuan perencanaan dan edukasi. Bukan merupakan saran investasi. Selalu lakukan riset sendiri sebelum melakukan trading saham.
