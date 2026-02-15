import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainNavbar } from '../main-navbar/main-navbar';
import { BuilderService } from '../services/builder-service';
import { LoadingMeterComponent } from '../loading-meter/loading-meter';

@Component({
  selector: 'app-main',
  imports: [RouterModule, MainNavbar, LoadingMeterComponent],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  loading$;

  constructor(private builderService: BuilderService) {
    this.loading$ = this.builderService.loading$;
  }
}
