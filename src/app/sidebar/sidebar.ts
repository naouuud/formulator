import { Component } from '@angular/core';
import { types } from '../models/ui-types';
import { Type } from '../type/type';

@Component({
  selector: 'app-sidebar',
  imports: [Type],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  types = types;
}
