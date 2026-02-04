import { Component, computed, Input, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { PropType } from '../../models/prop-types';
import { BuilderValidationDaterange } from '../builder-validation-daterange/builder-validation-daterange';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { Node } from '../../models/node-types';

@Component({
  selector: 'app-builder-node-date',
  imports: [BuilderPropLabel, BuilderValidationDaterange, BuilderValidation],
  templateUrl: './builder-node-date.html',
  styleUrl: './builder-node-date.css',
})
export class BuilderNodeDate implements OnInit {
  @Input() node!: Node;
  PropType = PropType;
  currentDate = new Date();

  yearOptions = signal<number[]>([]);
  currentYear = signal(this.currentDate.getFullYear());
  selectedYear = signal<number | null>(null);

  readonly monthOptions = [
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
  ];
  currentMonth = signal(this.currentDate.getMonth());
  selectedMonth = signal<number | null>(null);

  dayOptions: Signal<number[]> = computed(() => {
    const selectedYear = this.selectedYear();
    const selectedMonth = this.selectedMonth();
    // Default to 31
    if (selectedMonth === null) return Array.from({ length: 31 }, (_, i) => i + 1);
    return this.#numberOfDays(selectedMonth, selectedYear);
  });
  currentDay = signal(this.currentDate.getDate());
  selectedDay: WritableSignal<number | null> = signal(null);

  ngOnInit(): void {
    this.setYearOptions();
  }

  setYearOptions(): void {
    const dateRange = this.node.getPropValue(PropType.DATERANGE);
    const maxYear = dateRange
      ? dateRange.max === 'today'
        ? this.currentYear()
        : new Date(dateRange.max).getFullYear()
      : this.currentYear();
    const minYear = dateRange
      ? dateRange.min === 'today'
        ? this.currentYear()
        : new Date(dateRange.min).getFullYear()
      : this.currentYear() - 50;
    this.yearOptions.set(
      Array.from(
        {
          length: maxYear - minYear + 1,
        },
        (_, i) => maxYear - i,
      ),
    );
  }

  #numberOfDays(selectedMonth: number, selectedYear: number | null): number[] {
    const februaryDays = (year: number) => {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    };
    let numDays;
    switch (selectedMonth) {
      case 1: // February
        numDays = selectedYear !== null ? februaryDays(selectedYear) : 28;
        break;
      case 3: // April
      case 5: // June
      case 8: // September
      case 10: // November
        numDays = 30;
        break;
      default:
        numDays = 31;
        break;
    }
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }

  setSelectedYear(event: Event) {
    const year = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedYear.set(year);
  }

  setSelectedMonth(event: Event) {
    const month = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedMonth.set(month);
  }

  setSelectedDay(event: Event) {
    const day = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedDay.set(day);
  }
}
