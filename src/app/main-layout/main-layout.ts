import { Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainNavbar } from '../main-navbar/main-navbar';
import { FormRepoLocal } from '../services/form-repo-local';
import { LoadingMeterComponent } from '../loading-meter/loading-meter';
import { IFormRepo } from '../services/form-repo';
import { FORM_REPO } from '../app.config';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, MainNavbar, LoadingMeterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  loading$;

  constructor(@Inject(FORM_REPO) private formRepo: IFormRepo) {
    this.loading$ = this.formRepo.loading$;
  }
}
