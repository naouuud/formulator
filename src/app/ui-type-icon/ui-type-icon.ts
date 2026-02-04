import { Component, Input } from '@angular/core';
import { FactoryIcon } from '../models/factory-types';

@Component({
  selector: 'app-ui-type-icon',
  templateUrl: './ui-type-icon.html',
  styleUrl: './ui-type-icon.css',
})
export class UiTypeIcon {
  @Input() factoryIcon!: FactoryIcon;
}
