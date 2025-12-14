import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-renderer-name',
  imports: [],
  templateUrl: './renderer-name.html',
  styleUrl: './renderer-name.css',
})
export class RendererName {
  @Input() field: any;
  @Input() formGroupIn!: FormGroup;
}
