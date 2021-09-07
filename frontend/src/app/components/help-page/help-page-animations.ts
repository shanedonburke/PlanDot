import { animate, state, style, transition, trigger } from "@angular/animations";

export const slideIn = trigger('slideIn', [
  state('*', style({ transform: 'translateX(0)' })),
  transition('void => left', [
    style({ transform: 'translateX(100%)' }),
    animate('0.5s ease-in-out')
  ]),
  transition('void => right', [
    style({ transform: 'translateX(-100%)' }),
    animate('0.5s ease-in-out')
  ]),
]);