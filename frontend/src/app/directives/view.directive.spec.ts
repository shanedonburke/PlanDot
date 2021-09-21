import { ViewContainerRef } from '@angular/core';
import { ViewDirective } from './view.directive';

describe('ViewDirective', () => {
  it('should create an instance', () => {
    const directive = new ViewDirective({} as ViewContainerRef);
    expect(directive).toBeTruthy();
  });
});
