import { Component, effect, signal } from '@angular/core';
import { BuilderService } from '../../services/builder-service';
import { BuilderGroup } from '../builder-group/builder-group';
import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { Group, GroupType } from '../../models/group-types';
import { BuilderFormTitle } from '../builder-form-title/builder-form-title';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Prop, PropType } from '../../models/prop-types';
import { LABEL_MAX_LENGTH } from '../../models/field-types';

@Component({
  selector: 'app-builder-form',
  imports: [BuilderGroup, DragDropModule, CdkDropList, BuilderFormTitle],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  formModel$;
  hideMessage;
  allFormGroups;
  PropType = PropType;

  constructor(private builderService: BuilderService) {
    this.formModel$ = this.builderService.formModel$;
    this.allFormGroups = new FormGroup({});
    this.hideMessage = signal(false);
    effect(() => {
      const formModel = this.formModel$(); // only set once in service
      this.#addFormGroup(...formModel.groups);
    });
  }

  onDrop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      this._reorderGroup_C(event);
    } else {
      this._addGroup_C(event);
    }
  }

  private _reorderGroup_C(event: CdkDragDrop<unknown>) {
    this.builderService.reorderGroup_S(event.previousIndex, event.currentIndex);
  }

  private _addGroup_C(event: CdkDragDrop<GroupType>) {
    const groupType: GroupType = event.item.data;
    const group = this.builderService.addGroup_S(groupType); // return &Group
    this.builderService.reorderGroup_S(this.formModel$().groups.length - 1, event.currentIndex);
    this.#addFormGroup(group);
  }

  groupDeleteCleanup(fieldIds: string[]) {
    this.hideMessage.set(this.formModel$().groups.length > 0); // set empty message on if no groups left
    fieldIds.forEach((fieldId: string) => this.allFormGroups.removeControl(fieldId)); // clean up controls
    // console.log(this.allFormGroups);
  }

  submitForm(): void {
    if (this.allFormGroups.valid) {
      // proceed
    } else {
      this.builderService.showAllErrorMessages$.set(true);
      setTimeout(() => {
        this.builderService.showAllErrorMessages$.set(false);
      }, 8_000);
    }
  }

  #addFormGroup(...groups: Group[]): void {
    groups.forEach((g) => {
      g.fields.forEach((f) => {
        const fieldFormGroup = new FormGroup({});
        f.props.forEach((prop: Prop) => {
          const validators: ValidatorFn[] = [];
          switch (prop.propType) {
            case PropType.LABEL:
              validators.push(Validators.required, Validators.maxLength(LABEL_MAX_LENGTH));
              break;
            // Props set thru form based reactivity (no validators):
            //   LABEL = 'label',
            //   MAXLENGTHCHAR = 'maxlengthchar',
            //   MAXLENGTHWORD = 'maxlengthword',
            //   REQUIRED = 'required',
            //   OPTIONOTHER = 'optionother',
            // Non-editable Props (no controls)
            case PropType.PLACEHOLDER:
            case PropType.PATTERNNUMBER:
            case PropType.PATTERNPHONE:
            case PropType.OPTIONS:
            case PropType.DATERANGE:
            case PropType.EMAIL:
              return;
          }
          const control = new FormControl(prop.value, { nonNullable: true, validators });
          if (!prop.editable) control.disable();
          fieldFormGroup.addControl(prop.propType, control); //FormControl identifier = propType
        });
        this.allFormGroups.addControl(f.fieldId, fieldFormGroup); //FormGroup identifier = fieldId
      });
    });
    // console.log(this.allFormGroups);
  }
}
