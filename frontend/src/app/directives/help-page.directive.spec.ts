import { ViewContainerRef } from '@angular/core';
import { HelpPageDirective } from './help-page.directive';

describe('HelpPageDirective', () => {
  it('should create an instance', () => {
    const directive = new HelpPageDirective({} as ViewContainerRef);
    expect(directive).toBeTruthy();
  });
});
