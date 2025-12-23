import { Component, computed, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateField, PropType } from '../../models/json-types';

@Component({
  selector: 'app-renderer-date',
  imports: [],
  templateUrl: './renderer-date.html',
  styleUrl: './renderer-date.css',
})
export class RendererDate implements OnInit {
  PropType = PropType;
  @Input() field!: DateField;
  @Input() formGroupIn!: FormGroup;

  years: WritableSignal<number[]> = signal([]);
  selectedYear: WritableSignal<number | null> = signal(null);
  selectedMonth: WritableSignal<number | null> = signal(null);
  monthDays: Signal<number[]> = computed(() => {
    const year = this.selectedYear();
    const month = this.selectedMonth();
    if (month === null) {
      return Array.from({ length: 31 }, (_, i) => i + 1);
    }
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
    const maxYearDisp = this.field.getPropValue(PropType.MAXYEARDISP);
    const minYearDisp = this.field.getPropValue(PropType.MINYEARDISP);
    if (maxYearDisp === null || minYearDisp === null) return;
    this.selectedYear.set(maxYearDisp);
    this.years.set(
      Array.from(
        {
          length: maxYearDisp - minYearDisp + 1,
        },
        (_, i) => maxYearDisp - i
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
