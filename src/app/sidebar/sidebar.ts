import { Component } from '@angular/core';
import { uiTypes } from '../models/ui-types';
import { UiTypeIcon } from '../ui-type-icon/ui-type-icon';

@Component({
  selector: 'app-sidebar',
  imports: [UiTypeIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  uiTypes = uiTypes;
}
