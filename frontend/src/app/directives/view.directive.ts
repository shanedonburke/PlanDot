import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[viewHost]',
})
export class ViewDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
