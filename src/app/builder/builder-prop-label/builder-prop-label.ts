import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { BuilderService } from '../../services/builder-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-builder-prop-label',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './builder-prop-label.html',
  styleUrl: './builder-prop-label.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderPropLabel {
  dragDisabled$;
  @Input() labelMessage!: string;

  constructor(
    public controlContainer: ControlContainer,
    private builderService: BuilderService,
  ) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }

  getControl(): AbstractControl | null {
    return this.controlContainer?.control?.get('label') ?? null;
  }

  endEdit(event: Partial<KeyboardEvent>) {
    // event.preventDefault();
    (event.target as HTMLInputElement).blur();
  }

  getErrorMessage(): string {
    if (this.getControl()?.getError('required')) return 'This field is required';
    if (this.getControl()?.getError('maxlength')) {
      const requiredLength = this.getControl()?.getError('maxlength').requiredLength;
      return `Label exceeds maximum length (${requiredLength} characters)`;
    }
    return '';
  }
}
