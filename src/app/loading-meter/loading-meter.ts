import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-meter',
  template: `
    <div class="h-80 flex flex-col gap-4 justify-center items-center">
      <div class="w-2/3 h-5 relative overflow-hidden bg-gray-400 rounded-2xl ring-2 ring-gray-400">
        <div
          class="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 animate-loading-stripes"
        ></div>
      </div>
      <div class="text-gray-500">Loading your data...</div>
    </div>
  `,
  styles: [
    `
      @keyframes loading-stripes {
        0% {
          background-position: 0 0; /* start */
        }
        100% {
          background-position: 40px 0; /* move vertically */
        }
      }

      .animate-loading-stripes {
        background-size: 40px 40px;
        background-image: linear-gradient(
          45deg,
          rgba(200, 200, 200, 0.25) 25%,
          transparent 25%,
          transparent 50%,
          rgba(200, 200, 200, 0.25) 50%,
          rgba(200, 200, 200, 0.25) 75%,
          transparent 75%,
          transparent
        );
        animation: loading-stripes 1s linear infinite;
      }
    `,
  ],
})
export class LoadingMeterComponent {}
