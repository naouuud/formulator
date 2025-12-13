import { Component, Input, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../models/json-types';

@Component({
  selector: 'app-renderer-address',
  imports: [],
  templateUrl: './renderer-address.html',
  styleUrl: './renderer-address.css',
})
export class RendererAddress {
  FieldType = FieldType;
  @Input() field: any;
  @Input() formGroupIn!: FormGroup;
  districts: WritableSignal<any[]> = signal([]);

  toggleDistrict(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const updatedDistricts = this.field.geoData.find((g: any) => g.value === value)['districts'];
    this.districts.set(updatedDistricts);
  }
}
