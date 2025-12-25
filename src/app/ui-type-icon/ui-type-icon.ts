import { Component, Input } from '@angular/core';
import { UiType } from '../models/ui-types';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-ui-type-icon',
  imports: [CdkDrag],
  templateUrl: './ui-type-icon.html',
  styleUrl: './ui-type-icon.css',
})
export class UiTypeIcon {
  @Input() uiType!: UiType;
}
