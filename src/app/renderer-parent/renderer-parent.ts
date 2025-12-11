import { Component } from '@angular/core';
import { RendererForm } from '../renderer-form/renderer-form';

@Component({
  selector: 'app-renderer-parent',
  imports: [RendererForm],
  templateUrl: './renderer-parent.html',
  styleUrl: './renderer-parent.css',
})
export class RendererParent {}
