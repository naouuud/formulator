import { Component } from '@angular/core';
import { uiTypes } from '../models/ui-types';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  authors = uiTypes
    .filter((type) => type.attribution && type.attribution.length > 0)
    .map((type) => type.attribution)
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(', ');
}
