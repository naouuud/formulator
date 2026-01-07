import { trigger, style, transition, animate, keyframes } from '@angular/animations';

export const wobbleAnimation = trigger('wobble', [
  transition(':enter', [
    animate(
      '500ms',
      keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-5px)', offset: 0.25 }),
        style({ transform: 'translateX(5px)', offset: 0.5 }),
        style({ transform: 'translateX(-3px)', offset: 0.75 }),
        style({ transform: 'translateX(0)', offset: 1 }),
      ])
    ),
  ]),
]);
