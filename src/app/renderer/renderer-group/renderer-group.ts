import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Group } from '../../models/group-types';
import { RendererField } from '../renderer-field/renderer-field';

@Component({
  selector: 'app-renderer-group',
  imports: [RendererField],
  templateUrl: './renderer-group.html',
  styleUrl: './renderer-group.css',
})
export class RendererGroup implements OnInit {
  @Input() formGroupIn!: FormGroup;
  @Input() group!: Group;

  ngOnInit(): void {
    console.log(this.group);
  }
}
