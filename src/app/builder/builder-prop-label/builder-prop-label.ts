import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, Subject, throttleTime } from 'rxjs';
import { Prop, PropChangeEvent, PropType, PropValueMap } from '../../models/prop-types';
import { BuilderService } from '../../services/builder-service';

@Component({
  selector: 'app-builder-prop-label',
  imports: [ReactiveFormsModule],
  templateUrl: './builder-prop-label.html',
  styleUrl: './builder-prop-label.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderPropLabel implements OnInit {
  @Output() propValueChange = new EventEmitter<PropChangeEvent>();

  constructor(public controlContainer: ControlContainer, private builderService: BuilderService) {}

  get form() {
    return this.controlContainer.control as FormGroup;
  }

  ngOnInit(): void {
    this.form
      .get('label')
      ?.valueChanges.pipe(
        throttleTime(1000, undefined, { leading: true, trailing: true }),
        map((value: unknown) => ({ propType: PropType.LABEL, value } as PropChangeEvent))
      )
      .subscribe(this.propValueChange);
  }
}
