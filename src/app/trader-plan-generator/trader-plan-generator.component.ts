import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


export interface StockRow {
  code: string;
  weight: number;
}

@Component({
  selector: 'app-trader-plan-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trader-plan-generator.component.html',
  styleUrls: ['./trader-plan-generator.component.css'],
})
export class TraderPlanGeneratorComponent {
  stocks: StockRow[] = [
    { code: 'CDIA', weight: 0 },
    { code: 'BREN', weight: 0 },
    { code: 'PTRO', weight: 0 },
    { code: 'CUAN', weight: 0 },
  ];

  addStock() {
    this.stocks.push({ code: '', weight: 0 });
  }

  removeStock(idx: number) {
    if (this.stocks.length > 1) this.stocks.splice(idx, 1);
  }
}
