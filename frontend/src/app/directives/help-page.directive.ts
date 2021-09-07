import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[helpPageHost]',
})
export class HelpPageDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
