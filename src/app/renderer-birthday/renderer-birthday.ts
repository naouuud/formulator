import { Component, computed, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BirthdayField } from '../models/json-types';

@Component({
  selector: 'app-renderer-birthday',
  imports: [],
  templateUrl: './renderer-birthday.html',
  styleUrl: './renderer-birthday.css',
})
export class RendererBirthday {
  @Input() field!: BirthdayField;
  @Input() formGroupIn!: FormGroup;

  months: WritableSignal<any[]> = signal([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]);
  thisMonth = signal(new Date().getMonth());
  selectedMonth: WritableSignal<number | null> = signal(null);

  years: WritableSignal<number[]> = signal([]);
  thisYear = signal(new Date().getFullYear());
  selectedYear: WritableSignal<number | null> = signal(null);

  days: Signal<number[]> = computed(() => {
    const year = this.selectedYear();
    const month = this.selectedMonth();
    // Initialize to 31
    if (month === null) {
      return Array.from({ length: 31 }, (_, i) => i + 1);
    }
    let maxDays;
    switch (month) {
      case 1: // February
        maxDays = this._calculateFebruaryDays(year ?? new Date().getFullYear());
        break;
      case 3: // April
      case 5: // June
      case 8: // September
      case 10: // November
        maxDays = 30;
        break;
      default:
        maxDays = 31;
        break;
    }
    return Array.from({ length: maxDays }, (_, i) => i + 1);
  });
  today = signal(new Date().getDate());

  ngOnInit(): void {
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
