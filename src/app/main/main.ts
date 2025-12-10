import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainNavbar } from '../main-navbar/main-navbar';

@Component({
  selector: 'app-main',
  imports: [RouterModule, MainNavbar],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
