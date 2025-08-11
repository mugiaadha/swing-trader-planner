import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NumberInputComponent } from './number-input.component';

type AllocationMode = 'equal' | 'custom';

interface Stock {
  code: string;
  weight: number;
}

@Component({
  selector: 'app-trader-plan-generator',
  templateUrl: './trader-plan-generator.component.html',
  styleUrls: ['./trader-plan-generator.component.css'],
  standalone: true, // enable imports in standalone component
  imports: [CommonModule, FormsModule, NumberInputComponent],
})
export class TraderPlanGeneratorComponent implements OnInit {
  totalCapital = 60000000;
  // lotSize: lock to 100 and ignore external changes
  durationDays = 90;
  stagesCount = 3;
  allocationMode: AllocationMode = 'equal';
  stage0LotsPerStock = 1;

  stocks: Stock[] = [{ code: '', weight: 0 }];
  stageAllocations: number[] = [];
  planPrices: number[][] = [];
  lotSize: number = 100;
  private storageKey = 'tp-generator-plan-v1';
  private autoWeights = true;
  private planPricesManual: boolean[][] = [];
  private plannedLots: number[][] = [];

  dragStockIndex: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadFromStorage();
    const applied = this.initStocksFromRoute();
    this.autoWeights = this.stocks.every((s) => (s.weight || 0) === 0);
    this.equalizeWeightsIfNeeded(applied);
    this.recalcAllocations();
    this.ensurePriceMatrixSize(false); // jangan reset setelah load storage
    this.propagateStage0Prices();
    this.recalcPlannedLots();
    if (applied) this.saveToStorage();
  }

  getStageList(): number[] {
    return Array.from({ length: this.stagesCount }, (_, i) => i + 1);
  }

  onStagesCountChange(): void {
    if (this.stagesCount < 1) this.stagesCount = 1;
    this.stagesCount = this.stagesCount ?? 1;
    this.recalcAllocations();
    this.ensurePriceMatrixSize(false); // jangan reset harga yang sudah ada
    this.propagateStage0Prices();
    this.recalcPlannedLots();
    setTimeout(() => this.saveToStorage(), 0); // force update after Angular change detection
  }

  onAllocationModeChange(): void {
    this.recalcAllocations();
    this.recalcPlannedLots();
    this.saveToStorage();
  }

  addStock(): void {
    this.stocks.push({ code: '', weight: 0 });
    this.ensurePriceMatrixSize(false); // expand matrix tanpa reset
    this.equalizeWeightsIfNeeded(true);
    this.propagateStage0Prices();
    this.recalcPlannedLots();
    this.saveToStorage();
  }

  removeStock(index: number): void {
    if (this.stocks.length <= 1) return;
    this.stocks.splice(index, 1);
    for (let s = 0; s <= this.stagesCount; s++) {
      if (this.planPrices[s]) this.planPrices[s].splice(index, 1);
      if (this.planPricesManual[s]) this.planPricesManual[s].splice(index, 1);
      if (this.plannedLots[s]) this.plannedLots[s].splice(index, 1);
    }
    this.equalizeWeightsIfNeeded();
    this.recalcPlannedLots();
    this.saveToStorage();
  }

  resetStocks(): void {
    this.stocks = [{ code: '', weight: 0 }];
    // Otomatis tambahkan harga awal (price) di planPrices[0]
    this.ensurePriceMatrixSize(true);
    this.equalizeWeightsIfNeeded(true);
    this.propagateStage0Prices();
    this.recalcPlannedLots();
    this.saveToStorage();
  }

  private recalcAllocations(): void {
    if (this.allocationMode === 'equal') {
      const equal = 100 / Math.max(1, this.stagesCount);
      this.stageAllocations = Array(this.stagesCount).fill(+equal.toFixed(6));
    } else {
      if (this.stageAllocations.length !== this.stagesCount) {
        const equal = 100 / Math.max(1, this.stagesCount);
        this.stageAllocations = Array(this.stagesCount).fill(+equal.toFixed(6));
      }
    }
  }

  private ensurePriceMatrixSize(resetValues = false): void {
    for (let s = 0; s <= this.stagesCount; s++) {
      if (!this.planPrices[s] || resetValues) this.planPrices[s] = [];
      if (!this.planPricesManual[s] || resetValues)
        this.planPricesManual[s] = [];
      if (!this.plannedLots[s] || resetValues) this.plannedLots[s] = [];
      for (let i = 0; i < this.stocks.length; i++) {
        // Inisialisasi harga awal (price) untuk saham baru di planPrices[0]
        if (this.planPrices[s][i] === undefined || resetValues) {
          if (s === 0) {
            this.planPrices[s][i] = 0;
          } else {
            // Default harga per stage = harga awal
            this.planPrices[s][i] = this.planPrices[0]?.[i] ?? 0;
          }
        }
        if (this.planPricesManual[s][i] === undefined || resetValues)
          this.planPricesManual[s][i] = false;
        if (this.plannedLots[s][i] === undefined || resetValues)
          this.plannedLots[s][i] = 0;
      }
      this.planPrices[s].length = this.stocks.length;
      this.planPricesManual[s].length = this.stocks.length;
      this.plannedLots[s].length = this.stocks.length;
    }
    this.planPrices.length = this.stagesCount + 1;
    this.planPricesManual.length = this.stagesCount + 1;
    this.plannedLots.length = this.stagesCount + 1;
  }

  onPriceChange(stageIndex: number, stockIndex: number): void {
    const v = this.planPrices?.[stageIndex]?.[stockIndex] ?? 0;
    if (v < 0 || !Number.isFinite(v))
      this.planPrices[stageIndex][stockIndex] = 0;

    if (stageIndex === 0) {
      for (let s = 1; s <= this.stagesCount; s++) {
        if (!this.planPricesManual[s][stockIndex]) {
          this.planPrices[s][stockIndex] = this.planPrices[0][stockIndex] || 0;
        }
      }
      this.recalcPlannedLots();
    } else {
      this.planPricesManual[stageIndex][stockIndex] = true;
      this.recalcLotsForStage(stageIndex, stockIndex);
    }

    this.saveToStorage();
  }

  private getBudgetFor(stageIndex: number, stockIndex: number): number {
    if (stageIndex === 0) return 0;
    const stagePct = this.stageAllocations[stageIndex - 1] ?? 0;
    const stockPct = this.stocks[stockIndex]?.weight ?? 0;
    return this.totalCapital * (stagePct / 100) * (stockPct / 100);
  }

  getLots(stageIndex: number, stockIndex: number): number {
    if (!this.plannedLots?.[stageIndex])
      return stageIndex === 0 ? this.stage0LotsPerStock || 0 : 0;
    return (
      this.plannedLots[stageIndex][stockIndex] ??
      (stageIndex === 0 ? this.stage0LotsPerStock || 0 : 0)
    );
  }

  private getSpendFor(stageIndex: number, stockIndex: number): number {
    const lots = this.getLots(stageIndex, stockIndex);
    // Ambil harga stage, jika 0 gunakan harga awal (stage 0)
    let price = this.planPrices?.[stageIndex]?.[stockIndex] ?? 0;
    if (!price || price <= 0) {
      price = this.planPrices?.[0]?.[stockIndex] ?? 0;
    }
    return lots * this.lotSize * price;
  }

  private recalcPlannedLots(): void {
    this.ensurePriceMatrixSize();
    for (let i = 0; i < this.stocks.length; i++) {
      this.plannedLots[0][i] = this.stage0LotsPerStock || 0;
    }
    for (let s = 1; s <= this.stagesCount; s++) {
      for (let i = 0; i < this.stocks.length; i++) {
        // Ambil harga stage, jika 0 gunakan harga awal (stage 0)
        let stagePrice = this.planPrices?.[s]?.[i] ?? 0;
        if (!stagePrice || stagePrice <= 0) {
          stagePrice = this.planPrices?.[0]?.[i] ?? 0;
        }
        if (!stagePrice || stagePrice <= 0) {
          this.plannedLots[s][i] = 0;
          continue;
        }
        const budget = this.getBudgetFor(s, i);
        const lotCost = stagePrice * this.lotSize;
        let lots = lotCost > 0 ? Math.floor(budget / lotCost) : 0;
        this.plannedLots[s][i] = lots;
        if (
          this.plannedLots[s][i] < 0 ||
          !Number.isFinite(this.plannedLots[s][i])
        )
          this.plannedLots[s][i] = 0;
      }
    }

    // --- Tambahan: Otomatis belikan sisa modal ke saham manapun yang bisa dibeli (prioritas bobot terbesar, jika sama prioritas index terkecil) ---
    let remaining = this.totalCapital - this.getTotalInvested();
    const sorted = this.stocks
      .map((stock, idx) => ({ idx, weight: stock.weight ?? 0 }))
      .sort((a, b) => {
        if (b.weight !== a.weight) return b.weight - a.weight;
        return a.idx - b.idx;
      });

    let found = true;
    while (found && remaining > 0) {
      found = false;
      for (const s of sorted) {
        // Cari harga terakhir (stage terakhir yang diisi) untuk saham ini
        let lastPrice = 0;
        for (let stage = this.stagesCount; stage >= 0; stage--) {
          let price = this.planPrices[stage]?.[s.idx] ?? 0;
          if (!price || price <= 0) {
            price = this.planPrices[0]?.[s.idx] ?? 0;
          }
          if (price > 0) {
            lastPrice = price;
            break;
          }
        }
        if (lastPrice > 0) {
          const lotCost = lastPrice * this.lotSize;
          if (lotCost <= remaining) {
            let targetStage = this.stagesCount;
            if (!this.plannedLots[targetStage])
              this.plannedLots[targetStage] = [];
            this.plannedLots[targetStage][s.idx] =
              (this.plannedLots[targetStage][s.idx] || 0) + 1;
            remaining -= lotCost;
            found = true;
            break;
          }
        }
      }
    }
  }

  private recalcLotsForStage(stageIndex: number, stockIndex: number): void {
    if (stageIndex === 0) return;
    const price = this.planPrices?.[stageIndex]?.[stockIndex] ?? 0;
    if (!price || price <= 0) {
      this.plannedLots[stageIndex][stockIndex] = 0;
      return;
    }
    const budget = this.getBudgetFor(stageIndex, stockIndex);
    const lotCost = price * this.lotSize;
    this.plannedLots[stageIndex][stockIndex] =
      lotCost > 0 ? Math.floor(budget / lotCost) : 0;
    if (
      this.plannedLots[stageIndex][stockIndex] < 0 ||
      !Number.isFinite(this.plannedLots[stageIndex][stockIndex])
    ) {
      this.plannedLots[stageIndex][stockIndex] = 0;
    }
  }

  generatePlan(): void {
    // Kalkulasi ulang semua agar sync
    this.equalizeWeightsIfNeeded();
    this.recalcAllocations();
    this.ensurePriceMatrixSize(false);
    this.propagateStage0Prices();
    this.recalcPlannedLots();
    this.saveToStorage();
  }

  exportCSV(): void {
    const g = (
      typeof globalThis !== 'undefined' ? (globalThis as any) : {}
    ) as any;
    if (!g.document) return;

    const rows: string[] = [];
    rows.push(
      ['Stage', 'Stock', 'Price', 'LotSize', 'Lots', 'Shares', 'Spend'].join(
        ','
      )
    );

    for (let i = 0; i < this.stocks.length; i++) {
      const code = this.stocks[i].code || `STOCK${i + 1}`;
      const price = this.planPrices?.[0]?.[i] ?? 0;
      const lots = this.getLots(0, i);
      const shares = lots * this.lotSize;
      const spend = shares * price;
      rows.push([0, code, price, this.lotSize, lots, shares, spend].join(','));
    }

    for (let s = 1; s <= this.stagesCount; s++) {
      for (let i = 0; i < this.stocks.length; i++) {
        const code = this.stocks[i].code || `STOCK${i + 1}`;
        // Ambil harga stage, jika 0 gunakan harga awal (stage 0)
        let price = this.planPrices?.[s]?.[i] ?? 0;
        if (!price || price <= 0) price = this.planPrices?.[0]?.[i] ?? 0;
        const lots = this.getLots(s, i);
        const shares = lots * this.lotSize;
        const spend = shares * price;
        rows.push(
          [s, code, price, this.lotSize, lots, shares, spend].join(',')
        );
      }
    }

    const csv = rows.join('\r\n');

    if (!g.Blob || !g.URL || typeof g.URL.createObjectURL !== 'function')
      return;

    const blob = new g.Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = g.URL.createObjectURL(blob);
    const a = g.document.createElement('a');
    a.href = url;
    a.download = 'trader-plan.csv';
    g.document.body.appendChild(a);
    a.click();
    g.document.body.removeChild(a);
    g.URL.revokeObjectURL(url);
  }

  formatCurrency(value: number): string {
    const n = Number.isFinite(value) ? value : 0;
    try {
      return (n || 0).toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      });
    } catch {
      return `Rp ${Math.round(n || 0).toString()}`;
    }
  }

  saveToStorage(): void {
    if (!this.canUseStorage()) return;
    //    this.recalcPlannedLots();
    const payload = {
      totalCapital: this.totalCapital,
      durationDays: this.durationDays,
      stagesCount: this.stagesCount,
      allocationMode: this.allocationMode,
      stage0LotsPerStock: this.stage0LotsPerStock,
      stocks: this.stocks,
      stageAllocations: this.stageAllocations,
      planPrices: this.planPrices,
      planPricesManual: this.planPricesManual,
      plannedLots: this.plannedLots,
      savedAt: Date.now(),
    };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(payload));
      console.log('Data saved:', payload); // untuk debug
    } catch {}
  }

  private loadFromStorage(): void {
    if (!this.canUseStorage()) return;
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      console.log('Data loaded:', data); // untuk debug
      this.totalCapital = data.totalCapital ?? this.totalCapital;
      this.durationDays = data.durationDays ?? this.durationDays;
      this.stagesCount = data.stagesCount ?? this.stagesCount;
      this.allocationMode = data.allocationMode ?? this.allocationMode;
      this.stage0LotsPerStock =
        data.stage0LotsPerStock ?? this.stage0LotsPerStock;
      this.stocks =
        Array.isArray(data.stocks) && data.stocks.length
          ? data.stocks
          : this.stocks;
      this.stageAllocations = Array.isArray(data.stageAllocations)
        ? data.stageAllocations
        : this.stageAllocations;
      this.planPrices = Array.isArray(data.planPrices)
        ? data.planPrices
        : this.planPrices;
      this.planPricesManual = Array.isArray(data.planPricesManual)
        ? data.planPricesManual
        : this.planPricesManual;
      this.plannedLots = Array.isArray(data.plannedLots)
        ? data.plannedLots
        : [];
      this.ensurePriceMatrixSize(false); // jangan reset values, biar harga awal tetap tersimpan
    } catch {}
  }

  private canUseStorage(): boolean {
    try {
      return (
        typeof window !== 'undefined' && typeof localStorage !== 'undefined'
      );
    } catch {
      return false;
    }
  }

  private equalizeWeightsIfNeeded(force = false): void {
    const weightsAllZero = this.stocks.every((s) => (s.weight || 0) === 0);
    if (!force && !this.autoWeights && !weightsAllZero) return;
    const n = this.stocks.length;
    if (n <= 0) return;
    const equal = +(100 / n).toFixed(6);
    let acc = 0;
    for (let i = 0; i < n; i++) {
      if (i < n - 1) {
        this.stocks[i].weight = equal;
        acc += equal;
      } else {
        this.stocks[i].weight = +(100 - acc).toFixed(6);
      }
    }
  }

  onWeightChange(): void {
    const weightsAllZero = this.stocks.every((s) => (s.weight || 0) === 0);
    if (weightsAllZero) {
      this.autoWeights = true;
      this.equalizeWeightsIfNeeded(true);
    } else {
      this.autoWeights = false;
    }
    this.saveToStorage();
  }

  private initStocksFromRoute(): boolean {
    try {
      const codes = this.extractCodesFromRoute();
      if (!codes.length) return false;
      this.stocks = codes.map((c) => ({
        code: c.toUpperCase(),
        weight: 0,
      }));
      this.ensurePriceMatrixSize(true);
      return true;
    } catch {
      return false;
    }
  }

  private extractCodesFromRoute(): string[] {
    const out: string[] = [];
    const add = (val?: string | null) => {
      if (!val) return;
      val.split(',').forEach((p) => {
        const clean = (p || '')
          .trim()
          .replace(/[^a-z0-9]/gi, '')
          .toUpperCase();
        if (clean) out.push(clean);
      });
    };

    add(this.route.snapshot.queryParamMap?.get('codes'));
    let r: ActivatedRoute | null = this.route;
    while (r) {
      add(r.snapshot.paramMap.get('codes'));
      const segs = r.snapshot.url ?? [];
      if (segs.length) {
        const last = segs[segs.length - 1].path;
        if (last && last.includes(',')) add(last);
      }
      r = (r.parent as ActivatedRoute) || null;
    }
    return out;
  }

  private propagateStage0Prices(): void {
    for (let i = 0; i < this.stocks.length; i++) {
      const base = this.planPrices?.[0]?.[i] ?? 0;
      for (let s = 1; s <= this.stagesCount; s++) {
        if (!this.planPricesManual?.[s]?.[i]) {
          this.planPrices[s][i] = base;
        }
      }
    }
  }

  public stocksWeightSum(): number {
    return this.stocks.reduce((a, b) => a + (b.weight || 0), 0);
  }

  public stageAllocationsSum(): number {
    return this.stageAllocations.reduce((a, b) => a + (b || 0), 0);
  }

  public onNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.startsWith('0') && input.value.length > 1) {
      input.value = input.value.replace(/^0+/, '');
    }
  }

  getStage0Invest(): number {
    let sum = 0;
    for (let i = 0; i < this.stocks.length; i++) {
      const price = this.planPrices?.[0]?.[i] ?? 0;
      sum += (this.stage0LotsPerStock || 0) * this.lotSize * price;
    }
    return sum;
  }

  getStageAllocatedAmount(stage: number): number {
    const pct = this.stageAllocations[stage - 1] ?? 0;
    return this.totalCapital * (pct / 100);
  }

  getStageUsedAmount(stage: number): number {
    let sum = 0;
    for (let i = 0; i < this.stocks.length; i++) {
      sum += this.getSpendFor(stage, i);
    }
    return sum;
  }

  getTotalInvested(): number {
    let sum = this.getStage0Invest();
    for (let s = 1; s <= this.stagesCount; s++) {
      sum += this.getStageUsedAmount(s);
    }
    return sum;
  }

  getRemainingCapital(): number {
    return this.totalCapital - this.getTotalInvested();
  }

  getTotalLots(stockIndex: number): number {
    let total = 0;
    for (let s = 0; s <= this.stagesCount; s++) {
      total += this.getLots(s, stockIndex);
    }
    return total;
  }

  getAvgPricePerShare(stockIndex: number): number {
    // Hitung total invest dan total shares, gunakan harga awal jika harga stage 0
    let totalInvest = 0;
    let totalShares = 0;
    for (let s = 0; s <= this.stagesCount; s++) {
      const lots = this.getLots(s, stockIndex);
      let price = this.planPrices?.[s]?.[stockIndex] ?? 0;
      if (!price || price <= 0) price = this.planPrices?.[0]?.[stockIndex] ?? 0;
      totalInvest += lots * this.lotSize * price;
      totalShares += lots * this.lotSize;
    }
    if (!totalShares) return 0;
    return Math.round(totalInvest / totalShares);
  }

  getTotalInvestForStock(stockIndex: number): number {
    let sum = 0;
    for (let s = 0; s <= this.stagesCount; s++) {
      const lots = this.getLots(s, stockIndex);
      let price = this.planPrices?.[s]?.[stockIndex] ?? 0;
      if (!price || price <= 0) price = this.planPrices?.[0]?.[stockIndex] ?? 0;
      sum += lots * this.lotSize * price;
    }
    return sum;
  }

  // Drag & drop handlers
  onStockDragStart(index: number) {
    this.dragStockIndex = index;
  }

  onStockDragOver(event: DragEvent, overIndex: number) {
    event.preventDefault();
    // Optional: highlight drop target
  }

  onStockDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (this.dragStockIndex === null || this.dragStockIndex === dropIndex)
      return;
    const moved = this.stocks.splice(this.dragStockIndex, 1)[0];
    this.stocks.splice(dropIndex, 0, moved);

    // Sinkronisasi matrix lain (planPrices, planPricesManual, plannedLots)
    const syncMatrix = (matrix: any[][]) => {
      for (let s = 0; s < matrix.length; s++) {
        if (!matrix[s]) continue;
        const row = matrix[s];
        const val = row.splice(this.dragStockIndex!, 1)[0];
        row.splice(dropIndex, 0, val);
      }
    };
    syncMatrix(this.planPrices);
    syncMatrix(this.planPricesManual);
    syncMatrix(this.plannedLots);

    this.dragStockIndex = null;
    this.recalcPlannedLots();
    this.saveToStorage();
  }

  onStockDragEnd() {
    this.dragStockIndex = null;
  }
}
