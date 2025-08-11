# 🎯 Smart Swing Trading Planner

Aplikasi web professional untuk membuat rencana trading saham dengan perhitungan lot yang akurat, bobot portfolio dinamis, dan strategi DCA (Dollar Cost Averaging) bertahap.

## ✨ Fitur Utama

- **💰 Portfolio Dinamis**: Input saham dengan bobot custom (tidak harus equal weight)
- **📊 Perhitungan Lot Akurat**: Kalkulasi otomatis jumlah lot berdasarkan harga saham dan modal
- **⚡ Strategi DCA 3 Fase**: 
  - Fase 0: Tracker position (5% modal)
  - Fase 1: DCA saat turun 10-15% (40% modal)
  - Fase 2: DCA lanjutan saat turun 25-30% (55% modal)
- **🎯 Trigger Otomatis**: Hitung target harga untuk setiap fase
- **📱 Interface Modern**: Design responsive dan user-friendly
- **💡 Risk Management**: Panduan lengkap eksekusi dan manajemen risiko

## 🚀 Contoh Penggunaan Real

### Input:
- **Modal**: 100,000,000 IDR (100 juta)
- **Portfolio**:
  - BREN: 25% bobot, harga 7,500
  - CDIA: 50% bobot, harga 1,200  
  - PTRO: 15% bobot, harga 900
  - CUAN: 10% bobot, harga 580

### Output Detail:

#### Fase 0 - Tracker (5% modal = 5 juta):
- **BREN**: 1 lot @ 7,500 = 750,000
- **CDIA**: 2 lot @ 1,200 = 240,000
- **PTRO**: 1 lot @ 900 = 90,000
- **CUAN**: 1 lot @ 580 = 58,000

#### Fase 1 - DCA saat turun 15% (40% modal = 40 juta):
- **BREN**: 13 lot @ 6,375 = 8,287,500
- **CDIA**: 166 lot @ 1,020 = 16,932,000
- **PTRO**: 66 lot @ 765 = 5,049,000
- **CUAN**: 69 lot @ 493 = 3,402,000

#### Fase 2 - DCA lanjutan saat turun 30% (55% modal = 55 juta):
- **BREN**: 24 lot @ 5,250 = 12,600,000
- **CDIA**: 317 lot @ 840 = 26,628,000
- **PTRO**: 127 lot @ 630 = 8,001,000
- **CUAN**: 134 lot @ 406 = 5,440,000

## 🛠️ Teknologi

- **Angular 20**: Framework frontend terbaru
- **TypeScript**: Type-safe development
- **CSS3**: Modern responsive design
- **Lot Calculator**: Perhitungan matematis akurat
- **DCA Strategy Engine**: Logic strategi bertahap

## 📦 Instalasi & Development

```bash
# Clone repository
git clone https://github.com/yourusername/swing-trader-planner.git
cd swing-trader-planner

# Install dependencies
npm install

# Run development server
ng serve

# Build untuk production
npm run build:prod
```

## 🌐 Deployment ke GitHub Pages

### Quick Deploy:
```bash
npm run deploy
```

### Manual Deploy:
```bash
# Build production
ng build --configuration production --base-href /swing-trader-planner/

# Deploy ke GitHub Pages
npx angular-cli-ghpages --dir=dist/swing-trader-planner/browser
```

### Script Deploy:
```powershell
# PowerShell
.\deploy.ps1

# Batch
deploy.bat
```

## 💡 Cara Menggunakan Aplikasi

### 1. Input Modal & Konfigurasi
- Masukkan total modal trading
- Set lot size (default: 100 saham/lot)

### 2. Konfigurasi Saham & Bobot
- Tambah/hapus saham sesuai kebutuhan
- Set bobot masing-masing saham (total harus 100%)
- Input harga saham saat ini

### 3. Generate Plan
- Aplikasi akan kalkulasi:
  - Jumlah lot untuk setiap fase
  - Target harga trigger
  - Alokasi modal per saham
  - Timeline eksekusi

### 4. Eksekusi Trading
- Ikuti panduan fase demi fase
- Set price alert untuk trigger otomatis
- Monitor dan adjust sesuai kondisi market

## 📊 Fitur Kalkulasi

### Perhitungan Lot:
```
Target Lot = (Modal × Bobot × Alokasi Fase) ÷ (Harga Saham × Lot Size)
```

### Trigger Harga:
- **Fase 1**: Harga awal × 0.85 (turun 15%)
- **Fase 2**: Harga awal × 0.70 (turun 30%)

### Alokasi Modal:
- **Fase 0**: 5% (Tracker position)
- **Fase 1**: 40% (DCA pertama)
- **Fase 2**: 55% (DCA final)

## ⚠️ Risk Management

### Stop Loss Strategy:
- Set stop loss 8-10% dari rata-rata harga beli
- Review setelah setiap fase completion

### Position Sizing:
- Maksimal sesuai bobot yang ditentukan
- Jangan over-leverage pada satu saham

### Timing Strategy:
- Gunakan limit order untuk precision
- Set price alert untuk automation
- Monitor volume trading sebelum eksekusi

## 🎯 Advanced Features

### Portfolio Rebalancing:
- Auto-calculate jika ada perubahan harga
- Suggest rebalancing setelah fase completion

### Risk Metrics:
- Portfolio diversification score
- Maximum drawdown calculation
- Risk-adjusted return estimation

### Export Features:
- Export plan ke Excel/PDF
- Generate trading journal template
- Price alert configuration file

## 📱 Mobile Responsive

Aplikasi fully optimized untuk:
- Desktop trading setup
- Tablet monitoring
- Mobile execution alerts

## 🔧 Customization Options

### Strategy Modification:
- Adjust fase allocation percentages
- Modify trigger price thresholds
- Custom lot size configuration

### Portfolio Expansion:
- Support unlimited number of stocks
- Sector-based allocation
- Market cap weighted options

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/yourusername/swing-trader-planner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/swing-trader-planner/discussions)
- **Updates**: Follow repository untuk update terbaru

## 📄 License

MIT License - Free untuk penggunaan personal dan komersial.

---

**⚠️ Disclaimer**: Aplikasi ini adalah tools untuk perencanaan dan kalkulasi. Bukan merupakan saran investasi. Selalu DYOR (Do Your Own Research) dan konsultasi dengan advisor keuangan sebelum trading.
