import { Component, Input } from '@angular/core';
import { TypeModel } from '../models/ui-types';
import { NgIf } from '../../../node_modules/@angular/common/types/_common_module-chunk';

@Component({
  selector: 'app-type',
  imports: [],
  templateUrl: './type.html',
  styleUrl: './type.css',
})
export class Type {
  @Input() type!: TypeModel;
}
