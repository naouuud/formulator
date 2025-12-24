import { Component, Input, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressGroup } from '../../models/group-types';
import { FieldType } from '../../models/field-types';
import { PropType } from '../../models/prop-types';

@Component({
  selector: 'app-renderer-address-group',
  imports: [],
  templateUrl: './renderer-address-group.html',
  styleUrl: './renderer-address-group.css',
})
export class RendererAddressGroup {
  FieldType = FieldType;
  PropType = PropType;
  @Input() group!: AddressGroup;
  @Input() formGroupIn!: FormGroup;
  districts: WritableSignal<any[]> = signal([]);

  // MAKE GENERIC
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
