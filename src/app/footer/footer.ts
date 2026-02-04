import { Component } from '@angular/core';
import { factoryIconsComplex, factoryIconsBasic } from '../models/factory-types';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  authors = factoryIconsComplex
    .concat(factoryIconsBasic)
    .filter((type) => type.attribution && type.attribution.length > 0)
    .map((type) => type.attribution)
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(', ');
}
