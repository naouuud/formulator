import { Component, Input } from '@angular/core';
import { Node } from '../models/node';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-builder-group-node',
  imports: [],
  templateUrl: './builder-group-node.html',
  styleUrl: './builder-group-node.css',
})
export class BuilderGroupNode {
  @Input() formGroupIn!: FormGroup;
  @Input() node!: Node;
}
