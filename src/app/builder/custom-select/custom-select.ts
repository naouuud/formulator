import { Component, Input } from '@angular/core';
import { Option } from '../../models/prop-types';

@Component({
  selector: 'app-custom-select',
  imports: [],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.css',
})
export class CustomSelect {
  @Input() option!: Option;
}
