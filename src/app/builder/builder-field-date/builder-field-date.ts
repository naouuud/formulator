import { Component, computed, Input, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { Field } from '../../models/field-types';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidationDaterange } from '../builder-validation-daterange/builder-validation-daterange';

@Component({
  selector: 'app-builder-field-date',
  imports: [BuilderPropLabel, BuilderValidationDaterange],
  templateUrl: './builder-field-date.html',
  styleUrl: './builder-field-date.css',
})
export class BuilderFieldDate implements OnInit {
  @Input() field!: Field;

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
  selectedDay: WritableSignal<number | null> = signal(null);

  ngOnInit(): void {
    // const currentYear = new Date().getFullYear();
    // const maxYear = this.field.getPropValue(PropType.DATERANGE)?.max ?? currentYear;
    // const minYear = this.field.getPropValue(PropType.DATERANGE)?.min ?? currentYear - 50;
    // this.years.set(
    //   Array.from(
    //     {
    //       length: maxYear - minYear + 1,
    //     },
    //     (_, i) => maxYear - i,
    //   ),
    // );
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

  selectDay(event: Event) {
    const day = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedDay.set(day);
  }
}
