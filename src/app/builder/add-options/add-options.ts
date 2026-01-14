import { Component, Input } from '@angular/core';
import { DuplicateOptionError, EmptyOptionError, Field, Option } from '../../models/field-types';
import { BuilderService } from '../../services/builder-service';

@Component({
  selector: 'app-add-options',
  imports: [],
  templateUrl: './add-options.html',
  styleUrl: './add-options.css',
})
export class AddOptions {
  @Input() field!: Field;

  constructor(private builderService: BuilderService) {}

  addOption_C(optionInput: HTMLInputElement) {
    const option = optionInput.value;
    try {
      this.builderService.addOption_S(this.field, option);
      optionInput.value = '';
    } catch (err) {
      if (err instanceof DuplicateOptionError) {
        console.warn(err);
      }
      if (err instanceof EmptyOptionError) {
        console.warn(err);
      }
    }
  }

  deleteOption_C(idx: number) {
    this.builderService.deleteOption_S(this.field, idx);
  }
}
