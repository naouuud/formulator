import { Component, computed, Input } from '@angular/core';
import { BuilderService } from '../services/builder-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-icon',
  imports: [CommonModule],
  templateUrl: './form-icon.html',
  styleUrl: './form-icon.css',
})
export class FormIcon {
  @Input() index!: number;
  @Input() formTitle!: string;
  @Input() formId!: string;
  activeIdx$;
  active$ = computed(() => this.activeIdx$() === this.index);

  constructor(private builderService: BuilderService) {
    this.activeIdx$ = this.builderService.activeIdx$;
  }

  setActiveIdx_C(): void {
    this.builderService.setActiveIdx_S(this.index);
  }

  deleteForm_C(event: PointerEvent): void {
    event.stopPropagation();
    this.builderService.deleteForm_S(this.index);
  }
}
