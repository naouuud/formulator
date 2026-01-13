import { Component, Input } from '@angular/core';
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
  @Input() labelMessage!: string;

  constructor(public controlContainer: ControlContainer, private builderService: BuilderService) {}
}
