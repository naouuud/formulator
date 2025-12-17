import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Section, Type } from '../models/json-types';
import { RendererDate } from '../renderer-date-field/renderer-date';
import { CommonModule } from '@angular/common';
import { RendererTextarea } from '../renderer-textarea/renderer-textarea';
import { RendererAddressGroup } from '../renderer-address-group/renderer-address-group';
import { RendererNameGroup } from '../renderer-name-group/renderer-name-group';
import { RendererBirthday } from '../renderer-birthday/renderer-birthday';
import { checkers } from '../models/typecheck-functions';

@Component({
  selector: 'app-renderer-field',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RendererNameGroup,
    RendererBirthday,
    RendererDate,
    RendererAddressGroup,
    RendererTextarea,
  ],
  templateUrl: './renderer-field.html',
  styleUrl: './renderer-field.css',
})
export class RendererField implements OnInit {
  Type = Type;
  checkers = checkers;
  @Input() formGroupIn!: FormGroup;
  @Input() section!: Section;

  ngOnInit() {
    console.log(this.section);
  }
}
