import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'number-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      [type]="type"
      [class]="class || ''"
      [placeholder]="placeholder || ''"
      [min]="min"
      [max]="max"
      [name]="name || ''"
      [style.width]="width"
      [ngModel]="model"
      (ngModelChange)="onModelChange($event)"
      (input)="onInput($event)"
      [attr.step]="step"
      [attr.disabled]="disabled ? true : null"
    />
  `
})
export class NumberInputComponent {
  @Input() model: number | undefined;
  @Output() modelChange = new EventEmitter<number | undefined>();
  @Input() placeholder = '';
  @Input() min?: number;
  @Input() max?: number;
  @Input() name?: string;
  @Input() class: string = '';
  @Input() type = 'number';
  @Input() width?: string;
  @Input() step?: string;
  @Input() disabled?: boolean;

  onModelChange(val: any) {
    let v = val;
    if (typeof v === 'string') v = v.replace(/^0+/, '');
    if (v === '' || v === null) v = undefined;
    this.modelChange.emit(v !== undefined ? +v : undefined);
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.startsWith('0') && input.value.length > 1) {
      input.value = input.value.replace(/^0+/, '');
    }
  }
}
