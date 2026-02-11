import { Component } from '@angular/core';
import { Factory } from '../models/factory-types';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  authors = Factory.complex
    .concat(Factory.basic)
    .filter((type) => type.attribution && type.attribution.length > 0)
    .map((type) => type.attribution)
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(', ');
}
