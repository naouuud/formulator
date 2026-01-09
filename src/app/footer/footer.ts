import { Component } from '@angular/core';
import { uiTypesBasic, uiTypesCustom } from '../models/ui-types';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  authors = uiTypesBasic
    .concat(uiTypesCustom)
    .filter((type) => type.attribution && type.attribution.length > 0)
    .map((type) => type.attribution)
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(', ');
}
