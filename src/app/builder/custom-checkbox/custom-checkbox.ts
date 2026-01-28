import { Component, Input } from '@angular/core';
import { Option } from '../../models/prop-types';

@Component({
  selector: 'app-custom-checkbox',
  imports: [],
  templateUrl: './custom-checkbox.html',
  styleUrl: './custom-checkbox.css',
})
export class CustomCheckbox {
  @Input() option!: Option;
}
