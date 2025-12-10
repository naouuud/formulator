import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-main-navbar',
  imports: [CommonModule],
  templateUrl: './main-navbar.html',
  styleUrl: './main-navbar.css',
})
export class MainNavbar {
  currentRoute = signal('');
  isBuild = computed(() => this.currentRoute() === '/');
  isView = computed(() => this.currentRoute() === '/view');

  constructor(private router: Router) {
    // Initial
    this.currentRoute.set(this.router.url);
    // Subscribe to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.urlAfterRedirects);
      });
  }

  navigateToBuild() {
    this.router.navigate(['/']);
  }

  navigateToView() {
    this.router.navigate(['/view']);
  }
}
