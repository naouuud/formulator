import { Component, Input } from '@angular/core';
import { Group } from '../../models/group-types';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-builder-group',
  imports: [CdkDrag],
  templateUrl: './builder-group.html',
  styleUrl: './builder-group.css',
})
export class BuilderGroup {
  @Input() group!: Group;
}
