import { Component, effect, signal } from '@angular/core';
import { BuilderService } from '../../services/builder-service';
import { BuilderGroup } from '../builder-group/builder-group';
import { CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { Group, GroupType } from '../../models/group-types';
import { BuilderFormTitle } from '../builder-form-title/builder-form-title';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Prop, PropType } from '../../models/prop-types';

@Component({
  selector: 'app-builder-form',
  imports: [BuilderGroup, DragDropModule, CdkDropList, BuilderFormTitle],
  templateUrl: './builder-form.html',
  styleUrl: './builder-form.css',
})
export class BuilderForm {
  formModel$;
  hideMessage = signal(false);
  PropType = PropType;

  allFormGroups = new FormGroup({});

  constructor(private builderService: BuilderService) {
    this.formModel$ = this.builderService.formModel$;
    effect(() => {
      const formModel = this.formModel$(); //only called once, no more reactive pushes or will reinitialize all formGroups
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
    console.log(this.allFormGroups);
  }

  submitForm(): void {
    if (this.allFormGroups.valid) {
      // proceed
    } else {
      this.allFormGroups.markAllAsTouched();
    }
  }

  // handle date validation
  #addFormGroup(...groups: Group[]): void {
    groups.forEach((g) => {
      g.fields.forEach((f) => {
        const fieldFormGroup = new FormGroup({});
        f.props.forEach((prop: Prop) => {
          const validators: ValidatorFn[] = [];
          switch (prop.propType) {
            case PropType.LABEL:
              validators.push(Validators.maxLength(100));
              break;
            // add controls for other props
            // ignore some props, e.g. placeholder
            case PropType.PLACEHOLDER:
            case PropType.PATTERNNUMBER:
            case PropType.PATTERNPHONE:
              return;
          }
          const control = new FormControl(prop.value, { nonNullable: true, validators });
          if (!prop.editable) control.disable();
          fieldFormGroup.addControl(prop.propType, control); //FormControl identifier = propType
        });
        this.allFormGroups.addControl(f.fieldId, fieldFormGroup); //FormGroup identifier = fieldId
      });
    });
    console.log(this.allFormGroups);
  }
}
