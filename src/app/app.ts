import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { MainLayout } from './main-layout/main-layout';
import { Footer } from './footer/footer';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormMenu } from './form-menu/form-menu';
import { MainNavbar } from './main-navbar/main-navbar';

@Component({
  selector: 'app-root',
  imports: [RouterModule, Navbar, Sidebar, MainLayout, Footer, CdkScrollable, FormMenu, MainNavbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('formulator');
}
