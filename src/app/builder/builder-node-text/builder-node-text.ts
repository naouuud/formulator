import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BuilderPropLabel } from '../builder-prop-label/builder-prop-label';
import { BuilderValidation } from '../builder-validation/builder-validation';
import { CommonModule } from '@angular/common';
import { Node } from '../../models/node-types';

@Component({
  selector: 'app-builder-node-text',
  imports: [BuilderPropLabel, BuilderValidation, ReactiveFormsModule, CommonModule],
  templateUrl: './builder-node-text.html',
  styleUrl: './builder-node-text.css',
})
export class BuilderNodeText {
  @Input() node!: Node;
}
