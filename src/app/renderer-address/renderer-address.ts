import { Component, Input, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressGroup, FieldType } from '../models/json-types';
import { checkers } from '../models/typecheck-functions';

@Component({
  selector: 'app-renderer-address',
  imports: [],
  templateUrl: './renderer-address.html',
  styleUrl: './renderer-address.css',
})
export class RendererAddress {
  FieldType = FieldType;
  isTextField = checkers.isTextField;
  isSelectField = checkers.isSelectField;
  @Input() group!: AddressGroup;
  @Input() formGroupIn!: FormGroup;
  districts: WritableSignal<any[]> = signal([]);

  toggleDistrict(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const governorate = this.group.geoData.find((g: any) => g.value === value);
    if (!governorate) {
      this.districts.set([]);
      return;
    }
    const updatedDistricts = governorate['districts'];
    this.districts.set(updatedDistricts);
  }
}
