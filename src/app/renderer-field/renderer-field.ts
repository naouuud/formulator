import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HTMLType, Radio, Text } from '../models/json-types';

type Field = Text | Radio;

@Component({
  selector: 'app-renderer-field',
  imports: [ReactiveFormsModule],
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
