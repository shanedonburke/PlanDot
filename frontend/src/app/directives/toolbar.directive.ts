import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[toolbarHost]',
})
export class ToolbarDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
