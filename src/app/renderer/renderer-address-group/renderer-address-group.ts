import { Component, Input, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressGroup, FieldType } from '../../models/json-types';
import { checkers } from '../../models/typecheck-functions';

@Component({
  selector: 'app-renderer-address-group',
  imports: [],
  templateUrl: './renderer-address-group.html',
  styleUrl: './renderer-address-group.css',
})
export class RendererAddressGroup {
  SectionType = FieldType;
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
