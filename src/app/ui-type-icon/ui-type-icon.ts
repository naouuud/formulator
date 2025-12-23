import { Component, Input } from '@angular/core';
import { UiType } from '../models/ui-types';

@Component({
  selector: 'app-ui-type-icon',
  imports: [],
  templateUrl: './ui-type-icon.html',
  styleUrl: './ui-type-icon.css',
})
export class UiTypeIcon {
  @Input() uiType!: UiType;
}
