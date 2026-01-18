import {
  Component,
  computed,
  effect,
  Input,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PropType } from '../../models/prop-types';
import { Field } from '../../models/field-types';

@Component({
  selector: 'app-renderer-birthday',
  imports: [ReactiveFormsModule],
  templateUrl: './renderer-date.html',
  styleUrl: './renderer-date.css',
})
export class RendererDate implements OnInit {
  PropType = PropType;
  @Input() field!: Field;
  @Input() formGroupIn!: FormGroup;
  @Input() formControlIn!: AbstractControl;

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

  constructor() {
    // Update FormControlIn
    effect(() => {
      const selectedDay = this.selectedDay();
      const selectedMonth = this.selectedMonth();
      const selectedYear = this.selectedYear();
      if (selectedYear !== null && selectedMonth !== null && selectedDay !== null) {
        const paddedMonth = (selectedMonth + 1).toString().padStart(2, '0');
        const paddedDay = selectedDay.toString().padStart(2, '0');
        this.formControlIn.setValue(`${selectedYear}-${paddedMonth}-${paddedDay}`);
      }
      // console.log(this.formControlIn.value);
    });
  }

  ngOnInit(): void {
    const maxYearDisp = this.field.getPropValue(PropType.MAXYEARDISP);
    const minYearDisp = this.field.getPropValue(PropType.MINYEARDISP);
    if (maxYearDisp === null || minYearDisp === null) return;
    this.years.set(
      Array.from(
        {
          length: maxYearDisp - minYearDisp + 1,
        },
        (_, i) => maxYearDisp - i,
      ),
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

  selectDay(event: Event) {
    const day = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedDay.set(day);
  }
}
