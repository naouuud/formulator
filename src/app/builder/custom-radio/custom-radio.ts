import { Component, Input } from '@angular/core';
import { Option } from '../../models/prop-types';

@Component({
  selector: 'app-custom-radio',
  imports: [],
  templateUrl: './custom-radio.html',
  styleUrl: './custom-radio.css',
})
export class CustomRadio {
  @Input() option!: Option;
}
