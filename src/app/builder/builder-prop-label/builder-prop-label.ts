import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { BuilderService } from '../../services/builder-service';

@Component({
  selector: 'app-builder-prop-label',
  imports: [ReactiveFormsModule],
  templateUrl: './builder-prop-label.html',
  styleUrl: './builder-prop-label.css',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class BuilderPropLabel {
  dragDisabled$;
  @Input() labelMessage!: string;

  constructor(public controlContainer: ControlContainer, private builderService: BuilderService) {
    this.dragDisabled$ = this.builderService.dragDisabled$;
  }

  endEdit(event: Partial<KeyboardEvent>) {
    // event.preventDefault();
    (event.target as HTMLInputElement).blur();
  }
}
