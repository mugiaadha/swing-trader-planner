import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StockInput {
  symbol: string;
  weight: number;
  currentPrice: number;
  phase1Price?: number;
  phase2Price?: number;
}

interface TradingPlan {
  stocks: StockInput[];
  totalCapital: number;
  phases: number;
  phaseStrategy: PhaseStrategy[];
}

interface PhaseStrategy {
  phase: number;
  triggerCondition: string;
  allocations: StockAllocation[];
}

interface StockAllocation {
  symbol: string;
  weight: number;
  allocatedAmount: number;
  currentPrice: number;
  targetLots: number;
  lotValue: number;
  actualInvestment: number;
  priceTarget?: number;
  notes?: string;
}

@Component({
  selector: 'app-trading-planner',
  imports: [CommonModule, FormsModule],
  templateUrl: './trading-planner.html',
  styleUrl: './trading-planner.css'
})
export class TradingPlannerComponent {
  // Input parameters
  totalCapital: number = 100000000; // 100 juta
  phases: number = 3;
  
  // Stock inputs
  stockInputs: StockInput[] = [
    { symbol: 'BREN', weight: 25, currentPrice: 7500, phase1Price: 0, phase2Price: 0 },
    { symbol: 'CDIA', weight: 50, currentPrice: 1200, phase1Price: 0, phase2Price: 0 },
    { symbol: 'PTRO', weight: 15, currentPrice: 900, phase1Price: 0, phase2Price: 0 },
    { symbol: 'CUAN', weight: 10, currentPrice: 580, phase1Price: 0, phase2Price: 0 }
  ];

  // Phase configurations
  phaseConfigs = [
    { phase: 0, description: 'Tracker Phase', allocation: 5 }, // 5% untuk tracking
    { phase: 1, description: 'DCA Phase 1', allocation: 40 }, // 40% saat turun
    { phase: 2, description: 'DCA Phase 2', allocation: 55 }  // 55% sisa
  ];

  // Generated plan
  tradingPlan: TradingPlan | null = null;
  
  // Lot size (standard Indonesia = 100 shares)
  lotSize: number = 100;

  addStock() {
    this.stockInputs.push({ 
      symbol: '', 
      weight: 0, 
      currentPrice: 0,
      phase1Price: 0,
      phase2Price: 0
    });
  }

  removeStock(index: number) {
    if (this.stockInputs.length > 1) {
      this.stockInputs.splice(index, 1);
    }
  }

  getTotalWeight(): number {
    return this.stockInputs.reduce((sum, stock) => sum + stock.weight, 0);
  }

  generatePlan() {
    const totalWeight = this.getTotalWeight();
    if (totalWeight !== 100) {
      alert('Total bobot harus 100%!');
      return;
    }

    if (!this.isPhasePricesValid()) {
      alert('Mohon isi harga target untuk semua fase!');
      return;
    }

    const phaseStrategy: PhaseStrategy[] = [];

    this.phaseConfigs.forEach((config, phaseIndex) => {
      const allocations: StockAllocation[] = [];
      
      this.stockInputs.forEach(stock => {
        const allocatedAmount = (this.totalCapital * stock.weight / 100) * (config.allocation / 100);
        const targetLots = Math.floor(allocatedAmount / (stock.currentPrice * this.lotSize));
        const lotValue = stock.currentPrice * this.lotSize;
        const actualInvestment = targetLots * lotValue;
        
        let notes = '';
        let priceTarget = stock.currentPrice;
        
        if (phaseIndex === 0) {
          notes = 'Tracker: Beli minimal 1 lot untuk monitor harga';
          // Fase 0: minimal 1 lot untuk tracking
          const trackerLots = Math.max(1, targetLots);
          allocations.push({
            symbol: stock.symbol,
            weight: stock.weight,
            allocatedAmount,
            currentPrice: stock.currentPrice,
            targetLots: trackerLots,
            lotValue,
            actualInvestment: trackerLots * lotValue,
            priceTarget,
            notes
          });
        } else if (phaseIndex === 1) {
          // Fase 1: DCA dengan harga yang ditentukan user
          if (!stock.phase1Price || stock.phase1Price <= 0) {
            notes = `Set harga fase 1 untuk ${stock.symbol}`;
            priceTarget = stock.currentPrice;
          } else {
            priceTarget = stock.phase1Price;
            notes = `DCA saat harga mencapai ${this.formatPrice(priceTarget)} atau dibawahnya`;
          }
          
          const targetLots1 = Math.floor(allocatedAmount / (priceTarget * this.lotSize));
          allocations.push({
            symbol: stock.symbol,
            weight: stock.weight,
            allocatedAmount,
            currentPrice: priceTarget,
            targetLots: targetLots1,
            lotValue: priceTarget * this.lotSize,
            actualInvestment: targetLots1 * (priceTarget * this.lotSize),
            priceTarget,
            notes
          });
        } else {
          // Fase 2: DCA lanjutan dengan harga yang ditentukan user
          if (!stock.phase2Price || stock.phase2Price <= 0) {
            notes = `Set harga fase 2 untuk ${stock.symbol}`;
            priceTarget = stock.currentPrice;
          } else {
            priceTarget = stock.phase2Price;
            notes = `DCA lanjutan saat harga mencapai ${this.formatPrice(priceTarget)} atau dibawahnya`;
          }
          
          const targetLots2 = Math.floor(allocatedAmount / (priceTarget * this.lotSize));
          allocations.push({
            symbol: stock.symbol,
            weight: stock.weight,
            allocatedAmount,
            currentPrice: priceTarget,
            targetLots: targetLots2,
            lotValue: priceTarget * this.lotSize,
            actualInvestment: targetLots2 * (priceTarget * this.lotSize),
            priceTarget,
            notes
          });
        }
      });

      phaseStrategy.push({
        phase: config.phase,
        triggerCondition: this.getTriggerCondition(config.phase),
        allocations
      });
    });

    this.tradingPlan = {
      stocks: [...this.stockInputs],
      totalCapital: this.totalCapital,
      phases: this.phases,
      phaseStrategy
    };
  }

  getTriggerCondition(phase: number): string {
    switch (phase) {
      case 0: return 'Initial Entry - Tracker Position';
      case 1: return 'Trigger: Harga turun 10-15% dari harga awal';
      case 2: return 'Trigger: Harga turun 25-30% dari harga awal';
      default: return `Fase ${phase}`;
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0
    }).format(price);
  }

  calculateTotalInvestment(phase: PhaseStrategy): number {
    return phase.allocations.reduce((sum, allocation) => sum + allocation.actualInvestment, 0);
  }

  calculateCumulativeInvestment(phaseIndex: number): number {
    let total = 0;
    for (let i = 0; i <= phaseIndex; i++) {
      if (this.tradingPlan?.phaseStrategy[i]) {
        total += this.calculateTotalInvestment(this.tradingPlan.phaseStrategy[i]);
      }
    }
    return total;
  }

  resetPlan() {
    this.tradingPlan = null;
  }

  // Auto calculate phase prices based on percentage
  autoCalculatePhases() {
    this.stockInputs.forEach(stock => {
      if (stock.currentPrice > 0) {
        // Hanya suggest, user bisa ubah manual
        if (!stock.phase1Price || stock.phase1Price === 0) {
          stock.phase1Price = Math.round(stock.currentPrice * 0.85); // 15% down suggestion
        }
        if (!stock.phase2Price || stock.phase2Price === 0) {
          stock.phase2Price = Math.round(stock.currentPrice * 0.70); // 30% down suggestion
        }
      }
    });
  }

  // Clear all phase prices
  clearPhasePrices() {
    this.stockInputs.forEach(stock => {
      stock.phase1Price = 0;
      stock.phase2Price = 0;
    });
  }

  // Calculate percentage drop for phase prices
  getPhase1Percentage(stock: StockInput): number {
    if (!stock.currentPrice || !stock.phase1Price || stock.phase1Price <= 0) return 0;
    return Math.round((1 - stock.phase1Price / stock.currentPrice) * 100);
  }

  getPhase2Percentage(stock: StockInput): number {
    if (!stock.currentPrice || !stock.phase2Price || stock.phase2Price <= 0) return 0;
    return Math.round((1 - stock.phase2Price / stock.currentPrice) * 100);
  }

  // Validate phase prices
  isPhasePricesValid(): boolean {
    return this.stockInputs.every(stock => 
      stock.phase1Price && stock.phase1Price > 0 && 
      stock.phase2Price && stock.phase2Price > 0
    );
  }

  // Helper method for template
  abs(num: number): number {
    return Math.abs(num);
  }
}
