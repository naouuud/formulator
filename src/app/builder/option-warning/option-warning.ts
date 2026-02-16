import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-option-warning',
  imports: [],
  templateUrl: './option-warning.html',
  styleUrl: './option-warning.css',
})
export class OptionWarning {
  screen$;
  width$;
  constructor() {
    this.screen$ = signal(screen);
    this.width$ = computed(() => this.screen$().availWidth);
    // effect(() => console.log(this.width$()));
  }
}
