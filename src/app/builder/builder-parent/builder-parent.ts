import { Component } from '@angular/core';
import { BuilderForm } from '../builder-form/builder-form';

@Component({
  selector: 'app-builder-parent',
  imports: [BuilderForm],
  templateUrl: './builder-parent.html',
  styleUrl: './builder-parent.css',
})
export class BuilderParent {}
