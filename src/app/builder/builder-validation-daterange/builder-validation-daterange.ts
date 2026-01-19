import { Component, effect, Input, OnInit, signal } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { BuilderService } from '../../services/builder-service';
import { Field } from '../../models/field-types';
import {
  createDateRange,
  DateRange,
  InvalidDateError,
  InvalidRangeError,
  PropType,
} from '../../models/prop-types';

@Component({
  selector: 'app-builder-validation-daterange',
  imports: [],
  templateUrl: './builder-validation-daterange.html',
  styleUrl: './builder-validation-daterange.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderValidationDaterange implements OnInit {
  @Input() field!: Field;
  // custom handling, no formcontrol, manual initialization etc.
  #fallBackDateRange;
  maxDate$;
  minDate$;
  validationError$;

  constructor(
    public controlContainer: ControlContainer,
    private builderService: BuilderService,
  ) {
    this.#fallBackDateRange = this.#createFallBackDateRange();
    this.maxDate$ = signal<string>(this.#fallBackDateRange.max);
    this.minDate$ = signal<string>(this.#fallBackDateRange.min);
    this.validationError$ = signal<string | null>(null);
    effect((onCleanup) => {
      const maxDateString = this.maxDate$();
      const minDateString = this.minDate$();
      const save = setTimeout(() => {
        try {
          this.setDateRange_C(maxDateString, minDateString);
          this.validationError$.set(null);
        } catch (err: unknown) {
          if (err instanceof InvalidDateError) {
            this.validationError$.set(`Please provide valid date with format 'YYYY-MM-DD'.`);
          } else if (err instanceof InvalidRangeError) {
            this.validationError$.set(`End date cannot be earlier than start date.`);
          }
        }
      }, 400);
      onCleanup(() => clearTimeout(save));
    });
    effect(() => {
      console.log(`Validation message: ${this.validationError$()}`);
    });
  }

  ngOnInit(): void {
    const existingMaxDate = this.field.getPropValue(PropType.DATERANGE)?.max;
    existingMaxDate && this.maxDate$.set(existingMaxDate);
    const existingMinDate = this.field.getPropValue(PropType.DATERANGE)?.min;
    existingMinDate && this.minDate$.set(existingMinDate);
  }

  handleInput(event: any) {
    const val = event.target.value;
    console.log(val);
  }

  setDateRange_C(maxDateString: string, minDateString: string) {
    const dateRange = createDateRange(maxDateString, minDateString); // factory enforces type correctness and throws error
    this.builderService.setProp_S(this.field, PropType.DATERANGE, dateRange);
  }

  #createFallBackDateRange(): DateRange {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const maxDateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
    const minDateString = `${currentYear - 50}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
    const dateRange = createDateRange(maxDateString, minDateString); // use factory
    return dateRange;
  }
}
