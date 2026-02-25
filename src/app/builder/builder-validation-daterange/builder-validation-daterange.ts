import {
  Component,
  computed,
  effect,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { FormRepoLocal } from '../../services/form-repo-local';
import { Field } from '../../models/field-types';
import {
  createDateRange,
  DateRange,
  InvalidDateError,
  InvalidRangeError,
  PropType,
  todayString,
} from '../../models/prop-types';
import { Node } from '../../models/node-types';
import { IFormRepo } from '../../services/form-repo';
import { FORM_REPO } from '../../app.config';

type SelectOptions = 'mixed' | 'past' | 'future';

@Component({
  selector: 'app-builder-validation-daterange',
  imports: [],
  templateUrl: './builder-validation-daterange.html',
  styleUrl: './builder-validation-daterange.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderValidationDaterange implements OnInit {
  dragDisabled$;
  @Input() node!: Node;
  #fallBackDateRange;
  maxDate$;
  minDate$;
  validationError$;
  selectValue$;
  showStart$;
  showEnd$;
  blockSelectEffectOnce = false;
  blockSaveOnce = true;
  @Output() triggerChangeEMIT = new EventEmitter<void>();
  PropType = PropType;
  editable = true;

  constructor(
    public controlContainer: ControlContainer,
    @Inject(FORM_REPO) private formRepo: IFormRepo,
  ) {
    this.dragDisabled$ = this.formRepo.dragDisabled$;
    this.#fallBackDateRange = this.#createFallBackDateRange();
    this.maxDate$ = signal<string>(this.#fallBackDateRange.max);
    this.minDate$ = signal<string>(this.#fallBackDateRange.min);
    this.validationError$ = signal<string | null>(null);
    this.selectValue$ = signal<SelectOptions>('mixed');
    this.showStart$ = computed(() => this.selectValue$() !== 'future');
    this.showEnd$ = computed(() => this.selectValue$() !== 'past');

    // Save
    effect((onCleanup) => {
      const maxDateString = this.maxDate$();
      const minDateString = this.minDate$();
      if (this.blockSaveOnce) {
        this.blockSaveOnce = false;
        return;
      }
      const save = setTimeout(() => {
        try {
          this.setDateRange_C(maxDateString, minDateString);
          this.validationError$.set(null);
        } catch (err: unknown) {
          if (err instanceof InvalidDateError)
            this.validationError$.set(`Please provide valid date with format 'YYYY-MM-DD'.`);
          if (err instanceof InvalidRangeError)
            this.validationError$.set(`End date cannot be earlier than start date.`);
        }
      }, 400);
      onCleanup(() => clearTimeout(save));
    });

    // Select
    effect(() => {
      const selectValue = this.selectValue$();
      if (this.blockSelectEffectOnce) {
        this.blockSelectEffectOnce = false;
        return;
      }
      // console.log('Run select effect');
      if (selectValue === 'past') {
        this.maxDate$.set('today');
        this.minDate$.set(todayString(-100));
      }
      if (selectValue === 'future') {
        this.minDate$.set('today');
        this.maxDate$.set(todayString(10));
      }
      if (selectValue === 'mixed') {
        this.minDate$.set(todayString(-100));
        this.maxDate$.set(todayString(10));
      }
    });

    // effect(() => {
    //   console.log(this.minDate$(), this.maxDate$());
    // });

    // effect(() => {
    //   console.warn(`Validation message: ${this.validationError$()}`);
    // });
  }

  ngOnInit(): void {
    // console.log('Run init');
    this.editable = this.node.getProp(PropType.DATERANGE)?.editable ?? true;
    this.#initializeDateRangeAndSelect();
    this.blockSelectEffectOnce = true;
  }

  setDateRange_C(maxDateString: string, minDateString: string) {
    const dateRange = createDateRange(maxDateString, minDateString); // factory enforces type correctness and throws error
    this.formRepo.setProp_S(this.node, PropType.DATERANGE, dateRange);
    this.triggerChangeEMIT.emit();
  }

  setSelectValue(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (!this.#isRangeOptions(value)) return;
    this.selectValue$.set(value);
  }

  #initializeDateRangeAndSelect(): void {
    const existingDateRange = this.node.getPropValue(PropType.DATERANGE);
    if (!existingDateRange) return; // should not happen but ok because we have initialized signals
    const existingMaxDate = existingDateRange.max;
    const existingMinDate = existingDateRange.min;
    // set select
    if (existingMaxDate === 'today') this.selectValue$.set('past');
    if (existingMinDate === 'today') this.selectValue$.set('future');
    // set max and min date
    this.maxDate$.set(existingMaxDate);
    this.minDate$.set(existingMinDate);
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

  #isRangeOptions(value: string): value is SelectOptions {
    return value === 'mixed' || value === 'past' || value === 'future';
  }
}
