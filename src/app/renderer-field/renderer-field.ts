import { Component, computed, Input, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HTMLType, RadioField, TextField } from '../models/json-types';
import { RendererDateField } from '../renderer-date-field/renderer-date-field';

type Field = TextField | RadioField;

@Component({
  selector: 'app-renderer-field',
  imports: [ReactiveFormsModule, RendererDateField],
  templateUrl: './renderer-field.html',
  styleUrl: './renderer-field.css',
})
export class RendererField implements OnInit {
  HTMLType = HTMLType;
  @Input() formGroup!: FormGroup;
  @Input() field!: any;

  ngOnInit() {
    console.log(this.field);
  }
}
