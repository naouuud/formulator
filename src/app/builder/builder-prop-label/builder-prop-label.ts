import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, throttleTime } from 'rxjs';
import { PropChangeEvent, PropType } from '../../models/prop-types';
import { BuilderService } from '../../services/builder-service';

@Component({
  selector: 'app-builder-prop-label',
  imports: [ReactiveFormsModule],
  templateUrl: './builder-prop-label.html',
  styleUrl: './builder-prop-label.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderPropLabel implements OnInit {
  @Input() labelMessage!: string;
  @Input() isEditable!: boolean;
  @Output() propValueChange = new EventEmitter<PropChangeEvent>();

  constructor(public controlContainer: ControlContainer, private builderService: BuilderService) {}

  get form() {
    return this.controlContainer.control as FormGroup;
  }

  ngOnInit(): void {
    const control = this.form.get('label');
    if (!this.isEditable) control?.disable();
    control?.valueChanges
      .pipe(
        // throttleTime(1000, undefined, { leading: true, trailing: true }),
        map((value: unknown) => ({ propType: PropType.LABEL, value } as PropChangeEvent))
      )
      .subscribe(this.propValueChange);
  }
}
