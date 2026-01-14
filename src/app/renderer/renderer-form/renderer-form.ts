import { Component } from '@angular/core';
import { rendererTestForm } from '../../models/renderer-test';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Group } from '../../models/group-types';
import { RendererGroup } from '../renderer-group/renderer-group';
import { Field } from '../../models/field-types';
import { Prop, PropType, phonePattern, numberPattern } from '../../models/prop-types';
import { FormModel } from '../../models/form-model';

@Component({
  selector: 'app-renderer-form',
  imports: [RendererGroup, ReactiveFormsModule],
  templateUrl: './renderer-form.html',
  styleUrl: './renderer-form.css',
})
export class RendererForm {
  formGroup: FormGroup; // move to service?
  form: FormModel = rendererTestForm;

  constructor() {
    this.formGroup = new FormGroup({});
    this._buildFormGroup();
  }

  private _buildFormGroup(): void {
    this.form.groups.forEach((group: Group) => {
      group.fields.forEach((field: Field) => {
        const validators: ValidatorFn[] = [];
        field.props.forEach((prop: Prop) => {
          switch (prop.propType) {
            case PropType.REQUIRED:
              if (prop.value) validators.push(Validators.required);
              break;
            case PropType.MAXLENGTHCHAR:
              validators.push(Validators.maxLength(prop.value));
              break;
            // case PropType.MINLENGTHCHAR:
            //   if (prop.value > 1) validators.push(Validators.minLength(prop.value));
            //   break;
            case PropType.PATTERNPHONE:
              validators.push(Validators.pattern(phonePattern));
              break;
            case PropType.PATTERNNUMBER:
              validators.push(Validators.pattern(numberPattern));
              break;
            case PropType.EMAIL:
              if (prop.value) validators.push(Validators.email);
              break;
            // MINVALUE, MAXVALUE, MINDATE, MAXDATE
          }
        });
        this.formGroup.addControl(field.fieldId, new FormControl<string | null>(null, validators));
      });
    });
  }

  // private _extractFields(): void {
  //   this.form.sections.forEach((section: Section) => {
  //     if (this._isField(section)) {
  //       this.fields.push(section);
  //     } else {
  //       section.fields.forEach((section) => this.fields.push(section));
  //     }
  //   });
  // }

  // Type check function to distinguish Field and Group
  // private _isField(section: any): section is Field {
  //   return !section.fields;
  // }

  // separate into minValue/maxValue check
  // private _numberValueValidator(field: NumberField): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;
  //     if (value == null || value === '') return null; // ignore empty
  //     const numberValue = +value;
  //     if (Number.isNaN(numberValue)) return null; // validated by RegEx
  //     // in case NumberField properties are misconfigured
  //     const min = field.minValue ?? Number.NEGATIVE_INFINITY;
  //     const max = field.maxValue ?? Number.POSITIVE_INFINITY;
  //     if (numberValue < min) return { numberTooSmall: true };
  //     if (numberValue > max) return { numberTooLarge: true };
  //     return null;
  //   };
  // }

  // separate into minDate/maxDate check
  // private _dateValidator(field: DateField): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;
  //     // ignore empty values (use required validator instead)
  //     if (value == null || value === '') return null;
  //     // const selectedDate = new Date(value);
  //     const [year, month, day] = value.split('-').map(Number);
  //     const selectedDate = new Date(year, month - 1, day);
  //     const maxDate = new Date(field.maxDate);
  //     const minDate = new Date(field.minDate);
  //     if (!isNaN(maxDate.getTime()) && selectedDate > maxDate) return { dateOutsideMaxRange: true };
  //     if (!isNaN(minDate.getTime()) && selectedDate < minDate) return { dateOutsideMinRange: true };
  //     return null;
  //   };
  // }
}
