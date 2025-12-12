import { Component, computed, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-renderer-date-field',
  imports: [],
  templateUrl: './renderer-date-field.html',
  styleUrl: './renderer-date-field.css',
})
export class RendererDateField implements OnInit {
  @Input() field: any;
  years: WritableSignal<number[]> = signal([]);
  selectedYear: WritableSignal<number | null> = signal(null);
  selectedMonth: WritableSignal<number> = signal(1);
  monthDays: Signal<number[]> = computed(() => {
    const year = this.selectedYear();
    if (year === null) {
      return Array.from({ length: 31 }, (_, i) => i + 1);
    }
    const month = this.selectedMonth();
    let maxDays;
    switch (month) {
      case 2:
        maxDays = this._calculateFebruaryDays(year ?? new Date().getFullYear());
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        maxDays = 30;
        break;
      default:
        maxDays = 31;
        break;
    }
    return Array.from({ length: maxDays }, (_, i) => i + 1);
  });

  ngOnInit(): void {
    this.selectedYear.set(this.field.maxYear);
    this.years.set(
      Array.from(
        { length: this.field.maxYear - this.field.minYear + 1 },
        (_, i) => this.field.maxYear - i
      )
    );
  }

  private _calculateFebruaryDays(year: number): number {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
  }

  selectYear(event: Event) {
    const year = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedYear.set(year);
  }

  selectMonth(event: Event) {
    const month = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedMonth.set(month);
  }
}
