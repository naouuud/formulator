import { Component, Input } from '@angular/core';
import { Node } from '../models/node-types';

@Component({
  selector: 'app-builder-node-child',
  imports: [],
  templateUrl: './builder-node-child.html',
  styleUrl: './builder-node-child.css',
})
export class BuilderNodeChild {
  @Input() node!: Node;
}
