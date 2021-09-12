import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewChild,
} from '@angular/core';
import { HelpPageDirective } from 'src/app/directives/help-page.directive';
import {
  HelpPage0Component,
  HelpPage1Component,
  HelpPage2Component,
} from '../help-page/help-page.component';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss'],
})
export class HelpDialogComponent {
  static HELP_PAGES = [
    HelpPage0Component,
    HelpPage1Component,
    HelpPage2Component,
  ];

  @ViewChild(HelpPageDirective) helpPageHost!: HelpPageDirective;

  get bubbles(): Array<boolean> {
    return Array(HelpDialogComponent.HELP_PAGES.length)
      .fill(0)
      .map((_, i) => i === this.pageIndex);
  }

  pageIndex = 0;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.loadHelpPage(0);
  }

  goToNextPage(): void {
    const newStep = this.pageIndex + 1;
    this.loadHelpPage(newStep);
    this.pageIndex = newStep;
  }

  goToPreviousPage(): void {
    const newStep = this.pageIndex - 1;
    this.loadHelpPage(newStep);
    this.pageIndex = newStep;
  }
  
  hasNextPage(): boolean {
    return this.pageIndex < HelpDialogComponent.HELP_PAGES.length - 1;
  }

  hasPreviousPage(): boolean {
    return this.pageIndex > 0;
  }

  private loadHelpPage(step: number): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        HelpDialogComponent.HELP_PAGES[step]
      );
    const viewContainerRef = this.helpPageHost.viewContainerRef;
    viewContainerRef.clear();

    const instance =
      viewContainerRef.createComponent(componentFactory).instance;
    instance.direction = step > this.pageIndex ? 'left' : 'right';
    this.cdr.detectChanges();
  }
}
