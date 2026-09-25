import { Component, input } from '@angular/core';
import { Page } from '@formulator/schema';
import { FormNote } from '../form-note/form-note';
import { FormQuestion } from '../form-question/form-question';

@Component({
  selector: 'form-page',
  imports: [FormNote, FormQuestion],
  templateUrl: './form-page.html',
})
export class FormPage {
  readonly page = input.required<Page>();
}
