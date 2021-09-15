import { animate, state, style, transition, trigger } from "@angular/animations";

/** Slides the element in from the left or right */
export const slideIn = trigger('slideIn', [
  state('*', style({ transform: 'translateX(0)' })),
  // Right to left
  transition('void => left', [
    style({ transform: 'translateX(100%)' }),
    animate('0.5s ease-in-out')
  ]),
  // Left to right
  transition('void => right', [
    style({ transform: 'translateX(-100%)' }),
    animate('0.5s ease-in-out')
  ]),
]);