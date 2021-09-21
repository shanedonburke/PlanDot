import { ViewContainerRef } from '@angular/core';
import { ToolbarDirective } from './toolbar.directive';

describe('ToolbarDirective', () => {
  it('should create an instance', () => {
    const directive = new ToolbarDirective({} as ViewContainerRef);
    expect(directive).toBeTruthy();
  });
});
