import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styles: `
    .home-dots {
      background-image: radial-gradient(circle, rgb(120 113 108 / 0.35) 1px, transparent 1px);
      background-size: 22px 22px;
    }
  `,
})
export class Home {
  /** Attribution — update name and GitHub profile URL. */
  protected readonly author = {
    name: 'naouuud',
    githubUrl: 'https://github.com/naouuud',
  };
}
