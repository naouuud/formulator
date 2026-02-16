import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainNavbar } from '../main-navbar/main-navbar';
import { BuilderService } from '../services/builder-service';
import { LoadingMeterComponent } from '../loading-meter/loading-meter';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, MainNavbar, LoadingMeterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  loading$;

  constructor(private builderService: BuilderService) {
    this.loading$ = this.builderService.loading$;
  }
}
